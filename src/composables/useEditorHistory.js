import { onBeforeUnmount, onMounted, watch } from "vue";

/*
 * =========================================================
 * LỊCH SỬ HOÀN TÁC + TỰ ĐỘNG LƯU BẢN NHÁP
 * =========================================================
 *
 * Gắn vào Editor.vue một lần, nhận wedding (computed) và
 * editorStore. Nhiệm vụ:
 *
 * 1. Theo dõi mọi thay đổi trên wedding (deep watch) và
 *    ghi snapshot vào lịch sử — nhưng DEBOUNCE để một lần
 *    gõ phím không tạo ra hàng chục bước hoàn tác.
 *
 * 2. Đánh dấu dirty + tự động lưu bản nháp xuống
 *    localStorage (chậm hơn, 1.5s) để lỡ tải lại trang
 *    vẫn khôi phục được.
 *
 * 3. Chặn đóng tab khi còn thay đổi chưa lưu.
 *
 * Không tự gọi API — việc lưu lên server vẫn do người
 * dùng bấm "Lưu thiệp" (hoặc Ctrl+S).
 */
export function useEditorHistory(wedding, editorStore, options = {}) {
  const {
    /* Thời gian gộp các thay đổi liên tiếp thành 1 bước. */
    historyDelay = 700,

    /* Thời gian chờ trước khi ghi bản nháp. */
    draftDelay = 1500,

    /* Tắt hoàn toàn (dùng khi đang load dữ liệu). */
    enabled = () => true,
  } = options;

  let historyTimer = null;
  let draftTimer = null;

  /*
   * Bỏ qua watch trong lúc store tự thay wedding
   * (undo/redo/load) — nếu không sẽ ghi lịch sử
   * cho chính thao tác hoàn tác.
   */
  let suspended = false;

  function suspend() {
    suspended = true;
  }

  function resume() {
    suspended = false;
  }

  function scheduleHistory() {
    if (suspended || !enabled()) {
      return;
    }

    window.clearTimeout(historyTimer);

    historyTimer = window.setTimeout(() => {
      editorStore.pushHistory();
    }, historyDelay);
  }

  function scheduleDraft() {
    if (suspended || !enabled()) {
      return;
    }

    window.clearTimeout(draftTimer);

    draftTimer = window.setTimeout(() => {
      editorStore.saveDraft();
    }, draftDelay);
  }

  watch(
    wedding,
    () => {
      if (suspended || !enabled() || !wedding.value) {
        return;
      }

      editorStore.markDirty();

      scheduleHistory();
      scheduleDraft();
    },
    { deep: true }
  );

  /* =====================================================
     CẢNH BÁO RỜI TRANG
  ===================================================== */

  function onBeforeUnload(event) {
    if (!editorStore.dirty) {
      return;
    }

    /*
     * Trình duyệt hiện đại bỏ qua nội dung tuỳ biến,
     * chỉ hiện hộp thoại xác nhận mặc định.
     */
    event.preventDefault();

    event.returnValue = "";

    return "";
  }

  onMounted(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", onBeforeUnload);

    window.clearTimeout(historyTimer);
    window.clearTimeout(draftTimer);
  });

  return {
    suspend,
    resume,

    /*
     * Ghi lịch sử ngay lập tức — dùng trước các thao tác
     * "nặng" như xoá một sự kiện, để hoàn tác trả về
     * đúng trạng thái trước khi xoá.
     */
    commitNow() {
      window.clearTimeout(historyTimer);

      if (!suspended && enabled()) {
        editorStore.pushHistory();
      }
    },
  };
}
