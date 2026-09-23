import { reactive } from "vue";

/*
 * =========================================================
 * HỘP THOẠI XÁC NHẬN DÙNG CHUNG
 * =========================================================
 *
 * Thay cho window.confirm() — vốn chặn luồng JS, không
 * theo được theme và không hiển thị được nội dung dài.
 *
 * Cách dùng trong panel:
 *
 *   import { confirmDialog } from "@/composables/useConfirm";
 *
 *   if (!(await confirmDialog({ title: "Xoá ảnh?" }))) return;
 *
 * Chỉ có MỘT hộp thoại tồn tại tại một thời điểm (state
 * là singleton ở module) nên không cần render ở từng panel
 * — EditorConfirmDialog gắn một lần trong Editor.vue.
 */

const state = reactive({
  open: false,

  title: "",
  message: "",
  detail: "",

  confirmText: "Xác nhận",
  cancelText: "Huỷ",

  /* Kiểu nguy hiểm: nút xác nhận màu đỏ. */
  danger: false,

  /* Promise resolver của lần gọi gần nhất. */
  resolve: null,
});

export function useConfirmState() {
  return state;
}

export function confirmDialog(options = {}) {
  /*
   * Nếu đang có hộp thoại mở mà panel khác lại gọi,
   * đóng cái cũ (trả về false) rồi mở cái mới.
   */
  if (state.resolve) {
    state.resolve(false);
    state.resolve = null;
  }

  state.title = options.title || "Xác nhận";

  state.message = options.message || "";

  state.detail = options.detail || "";

  state.confirmText = options.confirmText || "Xác nhận";

  state.cancelText = options.cancelText || "Huỷ";

  state.danger = options.danger === true;

  state.open = true;

  return new Promise((resolve) => {
    state.resolve = resolve;
  });
}

export function resolveConfirm(value) {
  state.open = false;

  const resolve = state.resolve;

  state.resolve = null;

  if (resolve) {
    resolve(value === true);
  }
}
