<template>
  <div class="wedding-preview-page">
    <!-- =====================================================
         LOADING
    ====================================================== -->
    <div v-if="loading" class="preview-loading">
      <div class="preview-loading-card">
        <v-progress-circular indeterminate size="42" />

        <strong> {{ $t('preview.preparing') }} </strong>

        <span> {{ $t('common.pleaseWait') }} </span>
      </div>
    </div>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <div v-else-if="!wedding" class="preview-error">
      <div class="preview-error-card">
        <div class="preview-error-icon">
          <v-icon size="32"> mdi-card-account-details-outline </v-icon>
        </div>

        <h2>{{ $t('preview.noData') }}</h2>

        <p>
          {{ $t('preview.noDataHint') }}
        </p>

        <button type="button" class="preview-back-button" @click="backToEditor">
          <v-icon size="18"> mdi-arrow-left </v-icon>

          {{ $t('preview.backToEdit') }}
        </button>
      </div>
    </div>

    <!-- =====================================================
         PREVIEW
    ====================================================== -->
    <div v-else class="preview-page">
      <!-- ===================================================
           TOP BAR
      ==================================================== -->
      <header class="preview-topbar">
        <button type="button" class="preview-back" @click="backToEditor">
          <v-icon size="19"> mdi-arrow-left </v-icon>

          <span> {{ $t('preview.edit') }} </span>
        </button>

        <div class="preview-title">
          <span> {{ $t('preview.kicker') }} </span>

          <strong>
            {{ wedding.theme?.Name || "traditional-red" }}
          </strong>
        </div>

        <button type="button" class="preview-save" @click="saveWedding">
          <v-icon size="18"> mdi-content-save-outline </v-icon>

          <span> {{ $t('editor.mobile.save') }} </span>
        </button>
      </header>

      <!-- ===================================================
           THEME PREVIEW
      ==================================================== -->
      <main class="preview-content">
        <div class="preview-device">
          <component
            v-if="currentTheme"
            :is="currentTheme"
            :wedding="wedding"
          />

          <div v-else class="theme-error">
            <v-icon size="34"> mdi-palette-outline </v-icon>

            <h2>{{ $t('preview.themeNotFound') }}</h2>

            <p>
              Theme:
              <strong>
                {{ themeName }}
              </strong>
            </p>

            <button type="button" @click="backToEditor">{{ $t('preview.backToEditor') }}</button>
          </div>
        </div>
      </main>

      <!-- ===================================================
           SAVE MESSAGE
      ==================================================== -->
      <Transition name="toast">
        <div
          v-if="saveMessage"
          class="preview-toast"
          :class="{ error: saveError }"
        >
          <v-icon size="18">
            {{
              saveError
                ? "mdi-alert-circle-outline"
                : "mdi-check-circle-outline"
            }}
          </v-icon>

          <span>
            {{ saveMessage }}
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import { useRouter, useRoute } from "vue-router";

import { useWeddingStore } from "@/stores/wedding";

import { useWeddingEditorStore } from "@/stores/weddingEditor";

import { useAuthStore } from "@/stores/auth";

import { AddDataWedding } from "@/model/api";

import { setCardLocale, clearCardLocale } from "@/lang";

import { ensureNewSections } from "@/utils/weddingShape";

/*
 * =========================================================
 * THEMES
 * Dùng chung map theme với toàn app.
 * =========================================================
 */

import themes from "@/themes";

const { t } = useI18n();

defineOptions({
  name: "WeddingPreview",
});

/* =========================================================
   ROUTER
========================================================= */

const router = useRouter();
const route = useRoute();

/* =========================================================
   STORE
========================================================= */

const editorStore = useWeddingEditorStore();

const weddingStore = useWeddingStore();

const auth = useAuthStore();

/* =========================================================
   STATE
========================================================= */

const loading = ref(false);

const saveMessage = ref("");
const saveError = ref(false);

/* =========================================================
   WEDDING
========================================================= */

/*
 * QUAN TRỌNG:
 *
 * Không tạo ref(null).
 *
 * Preview sử dụng trực tiếp Editor Store.
 */
const wedding = computed(() => {
  return editorStore.wedding;
});

/*
 * Trang xem trước render theme trực tiếp (không qua iframe
 * /preview-bare) — phải tự đặt ngôn ngữ thiệp, nếu không
 * chữ trên thiệp sẽ theo ngôn ngữ giao diện.
 */
watch(
  wedding,
  (value) => {
    if (value) {
      setCardLocale(value.language);
    } else {
      clearCardLocale();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearCardLocale();
});

/* =========================================================
   THEME
========================================================= */

const themeName = computed(() => {
  /*
   * Ưu tiên theme trên URL (?theme=...) — đây là
   * theme mà Editor chủ động yêu cầu xem trước.
   *
   * Chỉ dùng theme trong dữ liệu khi URL không có.
   */
  const queryTheme = route.query.theme;

  if (typeof queryTheme === "string" && queryTheme.trim()) {
    return queryTheme.trim();
  }

  return wedding.value?.theme?.Name || "traditional-red";
});

/* =========================================================
   THEME MAP
========================================================= */

const currentTheme = computed(() => {
  return themes[themeName.value] || null;
});

/* =========================================================
   BACK
========================================================= */

async function backToEditor() {
  /*
   * Giữ slug trên URL: nếu người dùng vào /preview?slug=...
   * bằng link trực tiếp (tab mới / F5) thì quay lại editor
   * phải mở đúng thiệp đó, không rơi về thiệp mới.
   */
  const slug =
    (typeof route.query.slug === "string" && route.query.slug) ||
    wedding.value?.slug ||
    "";

  /*
   * Đến từ Editor (luồng Editor → Preview) → quay lại bằng
   * history.back(), KHÔNG push /editor mới.
   *
   * Push cộng thêm một mục lịch sử: nút back của Editor lại
   * quay về đúng Preview này, rồi back ở preview lại push
   * /editor — người dùng kẹt trong vòng lặp Editor ↔ Preview
   * không thoát ra được. back() không cộng mục mới.
   */
  const previous = router.options.history.state?.back;

  const previousIsEditor =
    previous === "/editor" ||
    (typeof previous === "string" && previous.startsWith("/editor?"));

  if (previousIsEditor) {
    router.back();

    return;
  }

  /*
   * Mở /preview trực tiếp bằng link / F5 — không có Editor
   * trước đó. Dùng REPLACE (không push) để ghi đè mục
   * /preview: lần sau bấm back khỏi Editor không quay lại
   * Preview.
   */
  await router.replace({
    path: "/editor",
    query: {
      theme: themeName.value,
      slug: slug || undefined,
    },
  });
}

/* =========================================================
   SAVE
========================================================= */

function showSaveMessage(message, isError = false) {
  saveMessage.value = message;
  saveError.value = isError;

  window.clearTimeout(showSaveMessage.timer);

  showSaveMessage.timer = window.setTimeout(() => {
    saveMessage.value = "";
    saveError.value = false;
  }, 2800);
}

function saveWedding() {
  if (!wedding.value) {
    return;
  }

  /*
   * Chưa đăng nhập (hoặc không đủ quyền) → sang
   * trang đăng nhập, redirect quay lại đúng trang
   * preview này. Dữ liệu vẫn nằm trong Editor Store
   * nên không mất.
   */
  if (!auth.canSaveWedding()) {
    showSaveMessage(t("editor.save.loginRequired"), true);

    router.push({
      name: "Login",
      query: {
        redirect: route.fullPath,
      },
    });

    return;
  }

  try {
    AddDataWedding(
      wedding.value,

      (result) => {
        console.log("[WeddingPreview] saved:", result);

        /*
         * API trả về envelope { status, message, data }.
         */
        if (
          result &&
          result.status === "success" &&
          result.data &&
          typeof result.data === "object"
        ) {
          try {
            editorStore.setWedding({
              ...wedding.value,
              ...result.data,
            });
          } catch (e) {
            console.warn("[WeddingPreview] Không thể đồng bộ:", e);
          }
        }

        /*
         * Danh sách thiệp giờ lấy trực tiếp từ API
         * (getAllWeddings / Manage) — không cần ghi
         * registry localStorage nữa.
         */

        /*
         * Cache weddingStore vẫn giữ bản cũ — xoá để lần mở
         * editor/preview sau lấy lại dữ liệu vừa lưu từ API.
         */
        weddingStore.invalidate(
          (typeof route.query.slug === "string" && route.query.slug) ||
            wedding.value?.slug
        );

        showSaveMessage(t("editor.save.success"));
      },

      (err) => {
        console.error("[WeddingPreview] save error:", err);

        showSaveMessage(err?.message || t("editor.save.failed"), true);
      }
    );
  } catch (err) {
    console.error("[WeddingPreview] save exception:", err);

    showSaveMessage(err?.message || t("editor.save.failed"), true);
  }
}

/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {
  console.log("[WeddingPreview] mounted");

  console.log("[WeddingPreview] wedding:", editorStore.wedding);

  console.log("[WeddingPreview] theme:", themeName.value);

  /*
   * Preview được mở trực tiếp bằng URL
   * nhưng không có Editor Store.
   *
   * Không tự tạo dữ liệu giả.
   *
   * Nếu có slug thì thử load API.
   */
  if (
    !editorStore.wedding &&
    typeof route.query.slug === "string" &&
    route.query.slug.trim()
  ) {
    loadFromApi(route.query.slug.trim());
  }
});

/* =========================================================
   LOAD API
========================================================= */

async function loadFromApi(slug) {
  loading.value = true;

  try {
    console.log("[WeddingPreview] Load API:", slug);

    const result = await weddingStore.loadWedding(slug);

    const data = result || weddingStore.wedding;

    if (!data) {
      throw new Error(t("preview.notFound"));
    }

    let copy;

    try {
      copy = structuredClone(data);
    } catch (cloneError) {
      console.warn("[WeddingPreview] structuredClone failed:", cloneError);

      copy = JSON.parse(JSON.stringify(data));
    }

    editorStore.setWedding(copy);

    /*
     * Thiệp cũ / thiệp lưu dở có thể thiếu couple, video,
     * game, settings... — back-fill để theme render không
     * crash khi preview được mở thẳng bằng URL.
     */
    ensureNewSections(editorStore.wedding);

    console.log("[WeddingPreview] API wedding:", editorStore.wedding);
  } catch (err) {
    console.error("[WeddingPreview] API error:", err);

    showSaveMessage(err?.message || t("editor.loadErrorDot"), true);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wedding-preview-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: #f4f5f7;
}

.preview-page {
  min-height: 100vh;
  min-height: 100dvh;
}

/* =========================================================
   TOPBAR
========================================================= */

.preview-topbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  height: 64px;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  padding: 0 20px;

  background: rgba(255, 255, 255, 0.94);

  border-bottom: 1px solid #e5e6e9;

  backdrop-filter: blur(18px);
}

.preview-back,
.preview-save {
  height: 38px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 0 13px;

  border-radius: 10px;

  font-size: 12px;
  font-weight: 650;

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.preview-back {
  justify-self: start;

  color: #555b64;

  background: #fff;

  border: 1px solid #dedfe3;
}

.preview-back:hover {
  background: #f7f7f8;
  transform: translateY(-1px);
}

.preview-save {
  justify-self: end;

  color: #fff;

  background: var(--primary, #7b0d0d);

  border: 1px solid var(--primary, #7b0d0d);
}

.preview-save:hover {
  transform: translateY(-1px);
}

.preview-title {
  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;
}

.preview-title span {
  color: #999fa7;

  font-size: 10px;
  font-weight: 750;

  letter-spacing: 0.14em;
}

.preview-title strong {
  margin-top: 3px;

  color: #33363b;

  font-size: 13px;
}

/* =========================================================
   CONTENT
========================================================= */

.preview-content {
  min-height: calc(100vh - 64px);
  min-height: calc(100dvh - 64px);

  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 28px 18px 60px;
}

.preview-device {
  width: min(900px, 100%);

  min-height: 700px;
  min-height: min(700px, 100dvh);

  overflow: hidden;

  background: #fff;

  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.16);
}

/* =========================================================
   LOADING
========================================================= */

.preview-loading,
.preview-error {
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 25px;
}

.preview-loading-card,
.preview-error-card {
  width: min(420px, 100%);

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  gap: 10px;

  padding: 38px 28px;

  background: #fff;

  border: 1px solid #e4e5e8;

  border-radius: 22px;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.preview-loading-card strong,
.preview-error-card h2 {
  margin: 10px 0 0;

  color: #2e3136;

  font-size: 18px;
}

.preview-loading-card span,
.preview-error-card p {
  margin: 0;

  color: #8e949c;

  font-size: 13px;

  line-height: 1.6;
}

.preview-error-icon {
  width: 58px;
  height: 58px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #7b0d0d;

  background: #f9eeee;

  border-radius: 16px;
}

.preview-back-button {
  height: 40px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 0 15px;

  margin-top: 8px;

  color: #fff;

  background: #7b0d0d;

  border: 0;

  border-radius: 10px;

  font-size: 12px;

  cursor: pointer;
}

/* =========================================================
   THEME ERROR
========================================================= */

.theme-error {
  min-height: 700px;
  min-height: min(700px, 100dvh);

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  gap: 8px;

  padding: 30px;
}

.theme-error h2 {
  margin: 10px 0 0;

  font-size: 20px;
}

.theme-error p {
  margin: 0;

  color: #888;

  font-size: 13px;
}

.theme-error button {
  margin-top: 12px;

  height: 38px;

  padding: 0 14px;

  color: #fff;

  background: #7b0d0d;

  border: 0;

  border-radius: 9px;

  cursor: pointer;
}

/* =========================================================
   TOAST
========================================================= */

.preview-toast {
  position: fixed;

  right: 24px;
  bottom: 24px;

  z-index: 3000;

  display: flex;

  align-items: center;

  gap: 9px;

  padding: 11px 15px;

  color: #fff;

  background: #25282d;

  border-radius: 12px;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);

  font-size: 11px;
  font-weight: 600;
}

.preview-toast.error {
  background: var(--app-danger, #a03030);
}

/* =========================================================
   TRANSITION
========================================================= */

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform: translateY(10px);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .preview-topbar {
    height: 58px;

    padding: 0 10px;
  }

  .preview-back,
  .preview-save {
    width: 38px;

    padding: 0;
  }

  .preview-back span,
  .preview-save span {
    display: none;
  }

  .preview-content {
    padding: 0;
  }

  .preview-device {
    width: 100%;

    min-height: 100vh;
    min-height: 100dvh;

    box-shadow: none;
  }

  .preview-toast {
    right: 12px;
    left: 12px;
    bottom: 20px;

    justify-content: center;
  }
}
</style>