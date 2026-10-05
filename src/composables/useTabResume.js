import { onMounted, onBeforeUnmount } from "vue";

/*
 * =========================================================
 * TỰ ĐỒNG BỘ LẠI KHI QUAY LẠI TAB
 * =========================================================
 *
 * Tab để lâu ở background → trình duyệt freeze timer,
 * thậm chí discard cả tab (giải phóng RAM). Khi người
 * dùng quay lại:
 *
 *  - Dữ liệu trên trang có thể đã stale hàng giờ
 *  - Token JWT có thể đã hết hạn giữa chừng
 *  - Kết nối API có thể đã bị server ngắt (IIS app pool
 *    ngủ, load balancer đổi node...)
 *
 * Composable này theo dõi 2 sự kiện:
 *
 *  - visibilitychange: tab ẩn → hiện lại
 *  - pageshow (persisted): khôi phục từ bfcache
 *
 * và gọi callback sau một ngưỡng "tab đã bỏ đi đủ lâu"
 * (mặc định 60 giây). Quay lại trong vài giây (chuyển tab
 * nhanh) thì bỏ qua — không làm phiền.
 *
 * Callback nhận (reason) với reason = "visible" | "bfcache".
 *
 * Dùng trong App.vue:
 *
 *   useTabResume((reason) => {
 *     auth.restoreSession();
 *     loadMyWeddingCount();
 *   });
 */

const DEFAULT_THRESHOLD_MS = 60 * 1000;

export function useTabResume(onResume, options = {}) {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD_MS;

  let hiddenAt = 0;

  function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
      hiddenAt = Date.now();
      return;
    }

    /* Tab hiện lại — đủ lâu mới tính là "quay lại" */
    if (Date.now() - hiddenAt >= threshold) {
      onResume("visible");
    }

    hiddenAt = 0;
  }

  /*
   * bfcache: trình duyệt khôi phục trang nguyên trạng từ
   * bộ nhớ (không chạy lại JS). event.persisted = true
   * nghĩa là trang vừa được phục hồi — dữ liệu chắc chắn
   * stale, luôn đồng bộ lại bất kể ẩn bao lâu.
   */
  function onPageShow(event) {
    if (event.persisted) {
      onResume("bfcache");
    }
  }

  onMounted(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pageshow", onPageShow);
  });
}
