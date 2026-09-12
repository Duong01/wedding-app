<template>
  <div class="wedding-preview-page">

    <!-- =====================================================
         LOADING
    ====================================================== -->
    <div
      v-if="loading"
      class="preview-loading"
    >
      <div class="preview-loading-card">
        <v-progress-circular
          indeterminate
          size="42"
        />

        <strong>
          Đang chuẩn bị thiệp...
        </strong>

        <span>
          Vui lòng chờ một chút
        </span>
      </div>
    </div>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <div
      v-else-if="!wedding"
      class="preview-error"
    >
      <div class="preview-error-card">

        <div class="preview-error-icon">
          <v-icon size="32">
            mdi-card-account-details-outline
          </v-icon>
        </div>

        <h2>
          Chưa có dữ liệu thiệp
        </h2>

        <p>
          Thiệp xem trước chưa được khởi tạo.
          Hãy quay lại trình chỉnh sửa và thử lại.
        </p>

        <button
          type="button"
          class="preview-back-button"
          @click="backToEditor"
        >
          <v-icon size="18">
            mdi-arrow-left
          </v-icon>

          Quay lại chỉnh sửa
        </button>

      </div>
    </div>

    <!-- =====================================================
         PREVIEW
    ====================================================== -->
    <div
      v-else
      class="preview-page"
    >

      <!-- ===================================================
           TOP BAR
      ==================================================== -->
      <header class="preview-topbar">

        <button
          type="button"
          class="preview-back"
          @click="backToEditor"
        >
          <v-icon size="19">
            mdi-arrow-left
          </v-icon>

          <span>
            Chỉnh sửa
          </span>
        </button>

        <div class="preview-title">
          <span>
            XEM TRƯỚC THIỆP
          </span>

          <strong>
            {{ wedding.theme?.Name || "traditional-red" }}
          </strong>
        </div>

        <button
          type="button"
          class="preview-save"
          @click="saveWedding"
        >
          <v-icon size="18">
            mdi-content-save-outline
          </v-icon>

          <span>
            Lưu
          </span>
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

          <div
            v-else
            class="theme-error"
          >
            <v-icon size="34">
              mdi-palette-outline
            </v-icon>

            <h2>
              Không tìm thấy giao diện
            </h2>

            <p>
              Theme:
              <strong>
                {{ themeName }}
              </strong>
            </p>

            <button
              type="button"
              @click="backToEditor"
            >
              Quay lại Editor
            </button>
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
import {
  computed,
  onMounted,
  ref,
} from "vue";

import {
  useRouter,
  useRoute,
} from "vue-router";

import {
  useWeddingStore,
} from "@/stores/wedding";

import {
  useWeddingEditorStore,
} from "@/stores/weddingEditor";

import {
  useAuthStore,
} from "@/stores/auth";

import {
  AddDataWedding,
} from "@/model/api";

import { addEntry as addRegistryEntry } from "@/model/weddingRegistry";

/*
 * =========================================================
 * THEMES
 * Dùng chung map theme với toàn app.
 * =========================================================
 */

import themes from "@/themes";

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

const editorStore =
  useWeddingEditorStore();

const weddingStore =
  useWeddingStore();

const auth =
  useAuthStore();

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

  return (
    wedding.value?.theme?.Name ||
    "traditional-red"
  );
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
  await router.push({
    path: "/editor",
    query: {
      theme: themeName.value,
    },
  });
}

/* =========================================================
   SAVE
========================================================= */

function showSaveMessage(
  message,
  isError = false
) {
  saveMessage.value = message;
  saveError.value = isError;

  window.clearTimeout(
    showSaveMessage.timer
  );

  showSaveMessage.timer =
    window.setTimeout(() => {
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
    showSaveMessage("Vui lòng đăng nhập để lưu thiệp.", true);

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
        console.log(
          "[WeddingPreview] saved:",
          result
        );

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
            console.warn(
              "[WeddingPreview] Không thể đồng bộ:",
              e
            );
          }
        }

        /*
         * Ghi nhận thiệp vào registry quản lý.
         */
        try {
          addRegistryEntry(wedding.value);
        } catch (e) {
          console.warn(
            "[WeddingPreview] Không thể ghi registry:",
            e
          );
        }

        showSaveMessage(
          "Đã lưu thiệp thành công."
        );
      },

      (err) => {
        console.error(
          "[WeddingPreview] save error:",
          err
        );

        showSaveMessage(
          err?.message ||
            "Không thể lưu thiệp.",
          true
        );
      }
    );
  } catch (err) {
    console.error(
      "[WeddingPreview] save exception:",
      err
    );

    showSaveMessage(
      err?.message ||
        "Không thể lưu thiệp.",
      true
    );
  }
}

/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {
  console.log(
    "[WeddingPreview] mounted"
  );

  console.log(
    "[WeddingPreview] wedding:",
    editorStore.wedding
  );

  console.log(
    "[WeddingPreview] theme:",
    themeName.value
  );

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
    loadFromApi(
      route.query.slug.trim()
    );
  }
});

/* =========================================================
   LOAD API
========================================================= */

async function loadFromApi(slug) {
  loading.value = true;

  try {
    console.log(
      "[WeddingPreview] Load API:",
      slug
    );

    const result =
      await weddingStore.loadWedding(
        slug
      );

    const data =
      result ||
      weddingStore.wedding;

    if (!data) {
      throw new Error(
        "Không tìm thấy dữ liệu thiệp."
      );
    }

    let copy;

    try {
      copy = structuredClone(data);
    } catch (cloneError) {
      console.warn(
        "[WeddingPreview] structuredClone failed:",
        cloneError
      );

      copy = JSON.parse(
        JSON.stringify(data)
      );
    }

    editorStore.setWedding(copy);

    console.log(
      "[WeddingPreview] API wedding:",
      editorStore.wedding
    );
  } catch (err) {
    console.error(
      "[WeddingPreview] API error:",
      err
    );

    showSaveMessage(
      err?.message ||
        "Không thể tải dữ liệu thiệp.",
      true
    );
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wedding-preview-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.preview-page {
  min-height: 100vh;
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

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
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

  border: 1px solid
    var(--primary, #7b0d0d);
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

  font-size: 8px;
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

  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 28px 18px 60px;
}

.preview-device {
  width: min(900px, 100%);

  min-height: 700px;

  overflow: hidden;

  background: #fff;

  box-shadow:
    0 20px 70px rgba(0, 0, 0, 0.16);
}

/* =========================================================
   LOADING
========================================================= */

.preview-loading,
.preview-error {
  min-height: 100vh;

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

  box-shadow:
    0 20px 60px
      rgba(0, 0, 0, 0.08);
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

  box-shadow:
    0 15px 40px
      rgba(0, 0, 0, 0.2);

  font-size: 11px;
  font-weight: 600;
}

.preview-toast.error {
  background: #a92828;
}

/* =========================================================
   TRANSITION
========================================================= */

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
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