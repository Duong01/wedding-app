import { ref, watch, onMounted, onBeforeUnmount } from "vue";

/*
 * Đồng bộ dữ liệu wedding sang các iframe preview
 * (panel bên phải + overlay fullscreen) qua postMessage.
 *
 * Iframe thật → media query của theme phản ứng
 * theo chiều rộng khung, không theo cửa sổ.
 */
export function useWeddingPreviewSync(wedding, previewIframe, overlayIframe) {
  const previewUrl = `${window.location.origin}/preview-bare`;

  function cloneWedding(data) {
    try {
      return structuredClone(data);
    } catch {
      return JSON.parse(JSON.stringify(data));
    }
  }

  function postToIframe(iframe, payload) {
    if (!iframe?.value?.contentWindow) {
      return;
    }

    try {
      iframe.value.contentWindow.postMessage(
        payload,
        window.location.origin
      );
    } catch (e) {
      console.warn(
        "[WeddingEditor] Không thể gửi dữ liệu preview:",
        e
      );
    }
  }

  function pushWeddingToIframes() {
    if (!wedding.value) {
      return;
    }

    const payload = {
      type: "wedding:update",
      wedding: cloneWedding(wedding.value),
    };

    postToIframe(previewIframe, payload);
    postToIframe(overlayIframe, payload);
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
      pushWeddingToIframes();
    }
  }

  onMounted(() => {
    window.addEventListener("message", onPreviewMessage);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("message", onPreviewMessage);

    window.clearTimeout(previewSyncTimer);
  });

  return {
    previewUrl,
    pushWeddingToIframes,
  };
}
