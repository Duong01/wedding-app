import { onBeforeUnmount, onMounted } from "vue";

/*
 * =========================================================
 * TỰ ĐỘNG GIẢI PHÓNG BỘ NHỚ KHI TRÌNH DUYỆT BỊ NẶNG
 * =========================================================
 *
 * Vấn đề: app chạy lâu (mở nhiều thiệp, chỉnh sửa nhiều) thì
 * bộ nhớ JS heap phình to — lịch sử hoàn tác của editor giữ
 * 40 bản snapshot full wedding, cache wedding store giữ mọi
 * thiệp đã mở, iframe preview giữ DOM riêng. Trên máy yếu /
 * điện thoại, trình duyệt chậm dần rồi đơ.
 *
 * Giải pháp: theo dõi áp lực bộ nhớ theo 2 tín hiệu:
 *
 *  1. performance.memory (Chrome/Edge) — heap đã dùng.
 *  2. Sự kiện "memory pressure" của Page Lifecycle API
 *     (Chrome 133+) — hệ thống sắp kill tab, phải nhả ngay.
 *
 * Khi vượt ngưỡng → gọi các hàm cắt giảm theo TẦNG, từ nhẹ
 * đến nặng, cho tới khi heap về mức an toàn:
 *
 *  Tầng 1 (nhẹ): xoá cache wedding store (thiệp nào đang mở
 *                vẫn giữ ở store.wedding, chỉ bỏ bản cache
 *                của các thiệp KHÁC đã rời khỏi).
 *  Tầng 2 (vừa): cắt lịch sử hoàn tác editor còn 10 bước
 *                gần nhất (bỏ snapshot cũ — phần lớn bộ nhớ
 *                nằm ở đây).
 *  Tầng 3 (nặng): xoá toàn bộ lịch sử hoàn tác + bản nháp
 *                pendingDraft trong store (bản nháp trên
 *                localStorage vẫn còn, không mất dữ liệu).
 *
 * Không bao giờ reload cứng trang — người dùng đang làm việc.
 * Không đụng wedding đang chỉnh sửa — chỉ cắt các bản sao.
 *
 * Tham khảo ngưỡng: heap Chrome desktop thường 50–150MB cho
 * app này; trên 350MB là đang phình bất thường, trên 500MB
 * là nguy cơ crash tab trên điện thoại (2GB RAM).
 */

/* Ngưỡng heap (MB) bắt đầu cắt giảm. */
const PRESSURE_THRESHOLD_MB = 350;

/* Ngưỡng an toàn — cắt tới khi xuống dưới mức này thì dừng. */
const SAFE_THRESHOLD_MB = 250;

/* Nhịp kiểm tra — 1p, đủ sớm mà không tốn CPU. */
const CHECK_INTERVAL_MS = 60000;

/* Số bước hoàn tác giữ lại khi cắt tầng 2. */
const TRIM_HISTORY_KEEP = 10;

function readUsedHeapMB() {
  const memory = performance.memory;

  if (!memory || !memory.usedJSHeapSize) {
    return null;
  }

  return memory.usedJSHeapSize / (1024 * 1024);
}

export function useMemoryGuard() {
  let timer = null;

  /* Đang trong đợt cắt — tránh cắt chồng chéo. */
  let trimming = false;

  /* Đã từng cắt tới tầng nào — không lặp lại tầng đã chạy. */
  let levelReached = 0;

  function trimWeddingCache() {
    /*
     * Import động để App.vue (mọi trang) không kéo wedding
     * store vào bundle khi chưa cần — store chỉ tải khi thật
     * sự phải cắt giảm.
     */
    return import("@/stores/wedding").then(({ useWeddingStore }) => {
      const store = useWeddingStore();

      const slugs = Object.keys(store.cache || {});

      if (!slugs.length) {
        return;
      }

      /*
       * Giữ lại đúng 1 bản — thiệp đang mở (store.wedding).
       * Các bản cache của thiệp khác (đã rời trang) là rác
       * an toàn để xoá.
       */
      const keep = store.wedding?.slug || slugs[0];

      slugs.forEach((slug) => {
        if (slug !== keep) {
          delete store.cache[slug];
        }
      });
    });
  }

  function trimEditorHistory(keepSteps) {
    return import("@/stores/weddingEditor").then(
      ({ useWeddingEditorStore }) => {
        const store = useWeddingEditorStore();

        if (!store.history || store.history.length <= keepSteps) {
          return;
        }

        /*
         * Giữ `keepSteps` snapshot GẦN NHẤT (đúng vị trí
         * historyIndex hiện tại) — người dùng vẫn hoàn tác
         * được các thao tác vừa làm, chỉ mất bước cũ xa.
         */
        const cut = store.history.length - keepSteps;

        store.history.splice(0, cut);

        store.historyIndex = Math.max(0, store.historyIndex - cut);
      }
    );
  }

  function clearEditorDraftState() {
    return import("@/stores/weddingEditor").then(
      ({ useWeddingEditorStore }) => {
        const store = useWeddingEditorStore();

        /*
         * Chỉ xoá bản nháp đang treo trong bộ nhớ (chưa được
         * hỏi khôi phục). Bản nháp localStorage không đụng —
         * người dùng vẫn khôi phục được sau khi tải lại trang.
         */
        store.pendingDraft = null;
      }
    );
  }

  async function runTrim() {
    if (trimming) {
      return;
    }

    trimming = true;

    try {
      /* Tầng 1 — cache wedding store. */
      if (levelReached < 1) {
        levelReached = 1;

        await trimWeddingCache();
      }

      const afterLevel1 = readUsedHeapMB();

      if (afterLevel1 !== null && afterLevel1 <= SAFE_THRESHOLD_MB) {
        return;
      }

      /* Tầng 2 — cắt lịch sử hoàn tác còn 10 bước. */
      if (levelReached < 2) {
        levelReached = 2;

        await trimEditorHistory(TRIM_HISTORY_KEEP);
      }

      const afterLevel2 = readUsedHeapMB();

      if (afterLevel2 !== null && afterLevel2 <= SAFE_THRESHOLD_MB) {
        return;
      }

      /* Tầng 3 — xoá sạch lịch sử + nháp treo. */
      if (levelReached < 3) {
        levelReached = 3;

        await trimEditorHistory(1);

        await clearEditorDraftState();
      }
    } catch (error) {
      /* Cắt giảm là việc phụ — lỗi thì bỏ qua, lần sau thử lại. */
      console.warn("[MemoryGuard] Cắt giảm bộ nhớ lỗi:", error);
    } finally {
      trimming = false;
    }
  }

  function check() {
    const usedMB = readUsedHeapMB();

    if (usedMB === null) {
      return;
    }

    if (usedMB >= PRESSURE_THRESHOLD_MB) {
      runTrim();
    } else if (usedMB < SAFE_THRESHOLD_MB) {
      /* Về mức an toàn → cho phép cắt lại từ tầng 1 lần sau. */
      levelReached = 0;
    }
  }

  function onMemoryPressure() {
    /*
     * Hệ thống sắp kill tab (Chrome báo "memory pressure")
     * — cắt thẳng tầng 3, không chờ nhịp kiểm tra.
     */
    levelReached = 0;

    runTrim();
  }

  onMounted(() => {
    timer = window.setInterval(check, CHECK_INTERVAL_MS);

    window.addEventListener("memorypressure", onMemoryPressure);
  });

  onBeforeUnmount(() => {
    window.clearInterval(timer);

    window.removeEventListener("memorypressure", onMemoryPressure);
  });
}
