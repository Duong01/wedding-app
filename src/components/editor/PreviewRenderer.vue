<template>
  <div class="preview-renderer">
    <component
      v-if="currentTheme && wedding"
      :is="currentTheme"
      :wedding="wedding"
    />

    <div
      v-else
      class="preview-renderer-empty"
    >
      <p>
        Đang chờ dữ liệu thiệp từ Editor...
      </p>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
} from "vue";

import themes from "@/themes";

import { setCardLocale, clearCardLocale } from "@/lang";

import { ensureFonts } from "@/utils/fontLoader";

import { fontsForTheme } from "@/data/themeFonts";

defineOptions({
  name: "PreviewRenderer",
});

/* =========================================================
   STATE
========================================================= */

/*
 * Iframe có JS realm + Pinia riêng,
 * không dùng store của parent.
 *
 * Dữ liệu được đẩy vào qua postMessage.
 */
const wedding = ref(null);

/* =========================================================
   THEME
========================================================= */

const themeName = computed(() => {
  return (
    wedding.value?.theme?.Name ||
    "traditional-red"
  );
});

const currentTheme = computed(() => {
  return themes[themeName.value] || null;
});

/*
 * Iframe là document riêng — font nạp ở trang editor
 * không ăn vào đây. Nạp theo theme đang xem trước để
 * đổi mẫu trong editor là preview hiện đúng font luôn.
 */
watch(
  wedding,
  (value) => {
    if (value) {
      ensureFonts(fontsForTheme(value));

      /* Ngôn ngữ thiệp — đổi trong editor là preview đổi theo */
      setCardLocale(value.language);
    } else {
      clearCardLocale();
    }
  }
);

/* =========================================================
   POSTMESSAGE BRIDGE
========================================================= */

function cloneData(data) {
  try {
    return structuredClone(data);
  } catch {
    return JSON.parse(JSON.stringify(data));
  }
}

function onMessage(event) {
  /*
   * Chỉ nhận message cùng origin
   * (dev server / domain production).
   */
  if (event.origin !== window.location.origin) {
    return;
  }

  const data = event.data;

  if (!data || data.type !== "wedding:update") {
    return;
  }

  wedding.value = cloneData(data.wedding);
}

function notifyReady() {
  try {
    window.parent.postMessage(
      { type: "preview:ready" },
      window.location.origin
    );
  } catch (e) {
    console.warn(
      "[PreviewRenderer] Không thể báo ready:",
      e
    );
  }
}

onMounted(() => {
  window.addEventListener(
    "message",
    onMessage
  );

  notifyReady();
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "message",
    onMessage
  );

  clearCardLocale();
});
</script>

<style scoped>
.preview-renderer {
  min-height: 100vh;
  min-height: 100dvh;

  background: #fff;
}

.preview-renderer-empty {
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 30px;

  color: #999;

  font-size: 13px;

  text-align: center;
}
</style>
