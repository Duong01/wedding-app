import { ref, watch, onMounted, onBeforeUnmount } from "vue";

/*
 * Đồng bộ dữ liệu wedding sang các iframe preview
 * (panel bên phải + overlay fullscreen) qua postMessage.
 *
 * Iframe thật → media query của theme phản ứng
 * theo chiều rộng khung, không theo cửa sổ.
 */
export function useWeddingPreviewSync(
  wedding,
  previewIframe,
  overlayIframe,
  options = {}
) {
  const previewUrl = `${window.location.origin}/preview-bare`;

  /*
   * Cho phép tạm dừng đẩy dữ liệu sang iframe — người
   * dùng bấm nút "tạm dừng tự động cập nhật" khi đang
   * xem một mục dài trong bản xem trước.
   */
  const enabled = options.enabled || (() => true);

  function cloneWedding(data) {
    try {
      return structuredClone(data);
    } catch {
      return JSON.parse(JSON.stringify(data));
    }
  }

  /*
   * Trả về true khi đã gửi được (hoặc không có iframe để gửi —
   * overlay đang đóng), false khi iframe tồn tại nhưng chưa có
   * contentWindow (đang mount, hoặc panel vừa reload qua
   * about:blank). Trường hợp false sẽ được hẹn gửi lại.
   */
  function postToIframe(iframe, payload) {
    const el = iframe?.value;

    if (!el) {
      return true;
    }

    const target = el.contentWindow;

    if (!target) {
      return false;
    }

    try {
      target.postMessage(payload, window.location.origin);

      return true;
    } catch (e) {
      console.warn(
        "[WeddingEditor] Không thể gửi dữ liệu preview:",
        e
      );

      return false;
    }
  }

  /*
   * Iframe chưa sẵn sàng → bản cập nhật sẽ bị mất nếu chỉ gửi
   * một lần. Hẹn gửi lại mỗi 150ms, tối đa 10 lần (~1.5s) —
   * đủ để iframe mount xong hoặc reload xong.
   */
  const RETRY_DELAY = 150;
  const MAX_RETRY = 10;

  let retryTimer = null;
  let retryCount = 0;

  function scheduleRetry() {
    if (retryTimer || retryCount >= MAX_RETRY) {
      return;
    }

    retryTimer = window.setTimeout(() => {
      retryTimer = null;
      retryCount += 1;

      pushWeddingToIframes();
    }, RETRY_DELAY);
  }

  function pushWeddingToIframes() {
    if (!wedding.value) {
      return;
    }

    if (!enabled()) {
      return;
    }

    const payload = {
      type: "wedding:update",
      wedding: cloneWedding(wedding.value),
    };

    const sentPreview = postToIframe(previewIframe, payload);
    const sentOverlay = postToIframe(overlayIframe, payload);

    if (sentPreview && sentOverlay) {
      retryCount = 0;

      return;
    }

    scheduleRetry();
  }

  /*
   * Debounce 300ms để không postMessage
   * liên tục khi người dùng đang gõ.
   */
  let previewSyncTimer = null;

  watch(
    wedding,
    () => {
      window.clearTimeout(previewSyncTimer);

      /* Dữ liệu mới → cho phép retry lại từ đầu */
      retryCount = 0;

      previewSyncTimer = window.setTimeout(() => {
        pushWeddingToIframes();
      }, 300);
    },
    { deep: true }
  );

  /*
   * Iframe báo "preview:ready" → gửi ngay
   * bản dữ liệu hiện tại.
   */
  function onPreviewMessage(event) {
    if (event.origin !== window.location.origin) {
      return;
    }

    if (event.data?.type === "preview:ready") {
      retryCount = 0;

      pushWeddingToIframes();
    }
  }

  onMounted(() => {
    window.addEventListener("message", onPreviewMessage);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("message", onPreviewMessage);

    window.clearTimeout(previewSyncTimer);
    window.clearTimeout(retryTimer);
  });

  return {
    previewUrl,
    pushWeddingToIframes,
  };
}
