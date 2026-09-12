<template>
  <div class="wedding-editor">
    <EditorHeader
      :wedding="wedding"
      :routeTheme="routeTheme"
      :saving="saving"
      @back="backToTemplates"
      @preview="previewWedding"
      @save="saveWedding"
    />

    <!-- =====================================================
         LOADING
    ====================================================== -->
    <div v-if="loading" class="editor-loading">
      <div class="loading-card">
        <v-progress-circular indeterminate size="38" />

        <strong> Đang chuẩn bị trình chỉnh sửa... </strong>

        <span> Vui lòng chờ một chút </span>
      </div>
    </div>

    <!-- ERROR -->
    <div v-else-if="!wedding" class="editor-error">
      <div class="error-card">
        <div class="error-icon">
          <v-icon> mdi-alert-circle-outline </v-icon>
        </div>

        <h2>Không thể tải dữ liệu thiệp</h2>

        <p>
          {{ error || "Dữ liệu thiệp chưa sẵn sàng." }}
        </p>

        <button type="button" class="save-button" @click="initializeEditor">
          <v-icon> mdi-refresh </v-icon>

          Thử lại
        </button>
      </div>
    </div>

    <!-- =====================================================
         EDITOR
    ====================================================== -->
    <main v-else class="editor-layout">
      <!-- SIDEBAR -->
      <EditorSidebarNav
        :menus="menus"
        :activeMenu="activeMenu"
        @select="selectMenu"
      />

      <!-- CENTER EDITOR -->
      <section class="editor-center">
        <GeneralPanel v-if="activeMenu === 'general'" :wedding="wedding" />

        <CouplePanel v-if="activeMenu === 'couple'" :wedding="wedding" />

        <HeroPanel v-if="activeMenu === 'hero'" :wedding="wedding" />

        <StoryPanel v-if="activeMenu === 'story'" :wedding="wedding" />

        <EventsPanel v-if="activeMenu === 'events'" :wedding="wedding" />

        <TimelinePanel v-if="activeMenu === 'timeline'" :wedding="wedding" />

        <GalleryPanel v-if="activeMenu === 'gallery'" :wedding="wedding" />

        <RecipientPanel v-if="activeMenu === 'recipient'" :wedding="wedding" />

        <GiftsPanel v-if="activeMenu === 'gifts'" :wedding="wedding" />

        <GuestbookPanel v-if="activeMenu === 'guestbook'" :wedding="wedding" />

        <CountdownPanel v-if="activeMenu === 'countdown'" :wedding="wedding" />

        <MusicPanel v-if="activeMenu === 'music'" :wedding="wedding" />

        <FooterPanel v-if="activeMenu === 'footer'" :wedding="wedding" />

        <MapPanel v-if="activeMenu === 'map'" :wedding="wedding" />

        <SettingsPanel v-if="activeMenu === 'settings'" :wedding="wedding" />

        <ThemePanel v-if="activeMenu === 'theme'" :wedding="wedding" />
      </section>

      <!-- LIVE PREVIEW (iframe thật) -->
      <EditorPreviewPanel
        ref="previewPanelRef"
        :themeName="wedding.theme?.Name"
        :previewDevice="previewDevice"
        :previewUrl="previewUrl"
        @update:previewDevice="previewDevice = $event"
      />
    </main>

    <!-- =====================================================
         PREVIEW OVERLAY (tablet / mobile)
    ====================================================== -->
    <Transition name="preview-overlay">
      <PreviewOverlay
        v-if="previewOverlayOpen"
        ref="overlayRef"
        :themeName="wedding?.theme?.Name"
        :previewDevice="previewDevice"
        :previewUrl="previewUrl"
        @update:previewDevice="previewDevice = $event"
        @close="previewOverlayOpen = false"
      />
    </Transition>

    <!-- =====================================================
         PREVIEW FAB (tablet / mobile)
    ====================================================== -->
    <button
      v-if="wedding"
      type="button"
      class="preview-fab"
      @click="previewOverlayOpen = true"
    >
      <v-icon size="18"> mdi-eye-outline </v-icon>

      <span> Xem trước </span>
    </button>

    <!-- =====================================================
         MOBILE BOTTOM BAR
    ====================================================== -->
    <EditorMobileBar
      :activeMenu="activeMenu"
      :menuOpen="mobileMenuOpen"
      :saving="saving"
      @select="selectMenu"
      @open-menu="mobileMenuOpen = true"
      @preview="previewWedding"
      @save="saveWedding"
    />

    <!-- =====================================================
         MOBILE MENU SHEET
    ====================================================== -->
    <Transition name="sheet">
      <EditorMobileSheet
        v-if="mobileMenuOpen"
        :menus="menus"
        :activeMenu="activeMenu"
        @select="selectMenu"
        @close="mobileMenuOpen = false"
      />
    </Transition>

    <!-- =====================================================
         SAVE TOAST
    ====================================================== -->
    <Transition name="toast">
      <SaveToast
        v-if="saveMessage"
        :message="saveMessage"
        :isError="saveError"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useWeddingStore } from "@/stores/wedding";
import { useWeddingEditorStore } from "@/stores/weddingEditor";
import { useAuthStore } from "@/stores/auth";
import { AddDataWedding } from "@/model/api";
import { addEntry as addRegistryEntry } from "@/model/weddingRegistry";
import EditorHeader from "@/components/editor/EditorHeader.vue";
import EditorSidebarNav from "@/components/editor/EditorSidebarNav.vue";
import EditorPreviewPanel from "@/components/editor/EditorPreviewPanel.vue";
import PreviewOverlay from "@/components/editor/PreviewOverlay.vue";
import EditorMobileBar from "@/components/editor/EditorMobileBar.vue";
import EditorMobileSheet from "@/components/editor/EditorMobileSheet.vue";
import SaveToast from "@/components/editor/SaveToast.vue";

import GeneralPanel from "@/components/editor/panels/GeneralPanel.vue";
import CouplePanel from "@/components/editor/panels/CouplePanel.vue";
import HeroPanel from "@/components/editor/panels/HeroPanel.vue";
import StoryPanel from "@/components/editor/panels/StoryPanel.vue";
import EventsPanel from "@/components/editor/panels/EventsPanel.vue";
import TimelinePanel from "@/components/editor/panels/TimelinePanel.vue";
import GalleryPanel from "@/components/editor/panels/GalleryPanel.vue";
import RecipientPanel from "@/components/editor/panels/RecipientPanel.vue";
import GiftsPanel from "@/components/editor/panels/GiftsPanel.vue";
import GuestbookPanel from "@/components/editor/panels/GuestbookPanel.vue";
import CountdownPanel from "@/components/editor/panels/CountdownPanel.vue";
import MusicPanel from "@/components/editor/panels/MusicPanel.vue";
import FooterPanel from "@/components/editor/panels/FooterPanel.vue";
import MapPanel from "@/components/editor/panels/MapPanel.vue";
import SettingsPanel from "@/components/editor/panels/SettingsPanel.vue";
import ThemePanel from "@/components/editor/panels/ThemePanel.vue";

import { useWeddingPreviewSync } from "@/composables/useWeddingPreviewSync";
import "@/assets/styles/editor.css";

defineOptions({
  name: "WeddingEditor",
});

const router = useRouter();
const route = useRoute();

/* =========================================================
   STORE
========================================================= */

const weddingStore = useWeddingStore();
const editorStore = useWeddingEditorStore();
const auth = useAuthStore();

/* =========================================================
   STATE
========================================================= */

const activeMenu = ref("general");
const previewDevice = ref("desktop");
const mobileMenuOpen = ref(false);
const previewOverlayOpen = ref(false);

const previewPanelRef = ref(null);
const overlayRef = ref(null);

const loading = ref(false);
const saving = ref(false);

const error = ref("");

const saveMessage = ref("");
const saveError = ref(false);

/* =========================================================
   ROUTE
========================================================= */

const routeTheme = computed(() => {
  const value = route.query.theme;

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "traditional-red";
});

const routeSlug = computed(() => {
  const value = route.query.slug;

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "";
});

/* =========================================================
   WEDDING
========================================================= */

const wedding = computed(() => {
  return editorStore.wedding;
});

/* =========================================================
   IFRAME PREVIEW SYNC
========================================================= */

const { previewUrl } = useWeddingPreviewSync(
  wedding,
  computed(() => previewPanelRef.value?.iframeEl ?? null),
  computed(() => overlayRef.value?.iframeEl ?? null)
);

/* =========================================================
   MENUS
========================================================= */

const menus = [
  {
    id: "general",
    label: "Thông tin chung",
    description: "Thông tin cơ bản",
    icon: "mdi-card-account-details-outline",
  },

  {
    id: "couple",
    label: "Cô dâu & Chú rể",
    description: "Thông tin hai bạn",
    icon: "mdi-heart-outline",
  },

  {
    id: "hero",
    label: "Ảnh bìa",
    description: "Màn hình mở đầu",
    icon: "mdi-image-outline",
  },

  {
    id: "story",
    label: "Chuyện tình yêu",
    description: "Câu chuyện của hai bạn",
    icon: "mdi-book-heart-outline",
  },

  {
    id: "events",
    label: "Sự kiện cưới",
    description: "Ngày giờ địa điểm",
    icon: "mdi-calendar-heart-outline",
  },

  {
    id: "timeline",
    label: "Timeline",
    description: "Lịch trình ngày cưới",
    icon: "mdi-timeline-outline",
  },

  {
    id: "gallery",
    label: "Album ảnh",
    description: "Khoảnh khắc đáng nhớ",
    icon: "mdi-image-multiple-outline",
  },

  {
    id: "recipient",
    label: "Khách mời",
    description: "Cá nhân hóa thiệp",
    icon: "mdi-account-multiple-outline",
  },

  {
    id: "gifts",
    label: "Mừng cưới",
    description: "Tài khoản nhận quà",
    icon: "mdi-gift-outline",
  },

  {
    id: "guestbook",
    label: "Sổ lưu bút",
    description: "Lời chúc khách mời",
    icon: "mdi-message-heart-outline",
  },
];

/* =========================================================
   SELECT MENU
========================================================= */

function selectMenu(id) {
  activeMenu.value = id;
  mobileMenuOpen.value = false;
}

/* =========================================================
   SAVE MESSAGE
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

/* =========================================================
   SAVE API
========================================================= */

function saveWedding() {
  if (!wedding.value || saving.value) {
    return;
  }

  /*
   * Chưa đăng nhập → chuyển sang trang đăng nhập
   * kèm redirect quay lại đúng trang Editor hiện tại
   * (giữ nguyên query theme/slug).
   *
   * Dữ liệu thiệp vẫn nằm trong Pinia store
   * (weddingEditor) nên không bị mất — sau khi
   * đăng nhập xong quay lại, KeepAlive + store
   * giữ nguyên bản nháp đang soạn.
   */
  if (!auth.canSaveWedding()) {
    showSaveMessage("Vui lòng đăng nhập để lưu thiệp.");

    router.push({
      name: "Login",
      query: {
        redirect: route.fullPath,
      },
    });

    return;
  }

  saving.value = true;
  saveMessage.value = "";
  saveError.value = false;

  try {
    AddDataWedding(
      wedding.value,

      (result) => {
        console.log("[WeddingEditor] saved:", result);

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
              "[WeddingEditor] Không thể cập nhật kết quả API:",
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
            "[WeddingEditor] Không thể ghi registry:",
            e
          );
        }

        showSaveMessage("Đã lưu thiệp thành công.");
        saving.value = false;
      },

      (err) => {
        console.error("[WeddingEditor] save error:", err);

        showSaveMessage(
          err?.message || "Không thể lưu thiệp.",
          true
        );

        saving.value = false;
      }
    );
  } catch (err) {
    console.error("[WeddingEditor] save exception:", err);

    showSaveMessage(
      err?.message || "Không thể lưu thiệp.",
      true
    );

    saving.value = false;
  }
}

/* =========================================================
   PREVIEW
========================================================= */

async function previewWedding() {
  if (!wedding.value) {
    console.warn(
      "[WeddingEditor] Không có wedding để preview."
    );

    return;
  }

  /*
   * KHÔNG truyền wedding qua router.
   *
   * WeddingPreview sẽ lấy trực tiếp từ
   * useWeddingEditorStore().
   */
  await router.push({
    path: "/preview",
    query: {
      theme:
        wedding.value.theme?.Name ||
        routeTheme.value,
    },
  });
}

/* =========================================================
   BACK
========================================================= */

async function backToTemplates() {
  await router.push({
    path: "/templates",
  });
}

/* =========================================================
   INITIALIZE
========================================================= */

async function initializeEditor() {
  loading.value = true;
  error.value = "";

  try {
    /*
     * =====================================================
     * 1. ĐÃ CÓ DRAFT TRONG EDITOR STORE
     * =====================================================
     *
     * Đây là trường hợp:
     *
     * Editor
     *   ↓
     * Preview
     *   ↓
     * Editor
     *
     * Không được tạo lại dữ liệu.
     */
    if (editorStore.wedding) {
      const storeTheme =
        editorStore.wedding.theme?.Name || "";

      const storeSlug =
        editorStore.wedding.slug || "";

      /*
       * URL yêu cầu theme KHÁC draft hiện tại
       * (đang mở từ trang "Mẫu thiệp" với mẫu khác)
       * → tạo draft mới với theme được chọn.
       *
       * Không thì preview sẽ luôn kẹt theme cũ.
       */
      if (
        !routeSlug.value &&
        routeTheme.value &&
        routeTheme.value !== storeTheme
      ) {
        editorStore.reset(routeTheme.value);

        return;
      }

      /*
       * URL yêu cầu load thiệp đã lưu KHÁC draft
       * hiện tại (đang mở từ trang "Thiệp của tôi")
       * → bỏ qua draft, rơi xuống nhánh load API.
       */
      const needLoadSlug =
        routeSlug.value &&
        routeSlug.value !== storeSlug;

      if (!needLoadSlug) {
        /*
         * Round trip Editor → Preview → Editor:
         * giữ nguyên draft. Chỉ bổ sung theme nếu thiếu.
         */
        if (!storeTheme) {
          editorStore.setTheme(routeTheme.value);
        }

        return;
      }

      /*
       * Draft là thiệp khác với slug trên URL
       * → xóa để load lại từ API ở nhánh dưới.
       */
      editorStore.clear();
    }

    /*
     * =====================================================
     * 2. EDITOR ĐƯỢC MỞ VỚI SLUG
     * =====================================================
     *
     * Ví dụ:
     *
     * /editor?slug=ha-uyen-tran-hieu
     *
     * Khi đó mới load API.
     */
    if (routeSlug.value) {
      const result =
        await weddingStore.loadWedding(
          routeSlug.value
        );

      const data =
        result || weddingStore.wedding;

      if (!data) {
        throw new Error(
          "API không trả về dữ liệu thiệp."
        );
      }

      /*
       * Copy dữ liệu API.
       *
       * Editor Store sở hữu bản copy.
       */
      let copy;

      try {
        copy = structuredClone(data);
      } catch (cloneError) {
        console.warn(
          "[WeddingEditor] structuredClone failed:",
          cloneError
        );

        copy = JSON.parse(
          JSON.stringify(data)
        );
      }

      editorStore.setWedding(copy);

      return;
    }

    /*
     * =====================================================
     * 3. EDITOR MỚI
     * =====================================================
     *
     * /editor?theme=traditional-red
     *
     * Không gọi API.
     *
     * Store tạo object rỗng.
     */
    editorStore.init(routeTheme.value);

    /*
     * Kiểm tra bắt buộc.
     */
    if (!editorStore.wedding) {
      throw new Error(
        "WeddingEditorStore không tạo được dữ liệu thiệp."
      );
    }
  } catch (err) {
    console.error(
      "[WeddingEditor] initialize error:",
      err
    );

    error.value =
      err?.message ||
      "Không thể tải dữ liệu thiệp.";
  } finally {
    loading.value = false;
  }
}

/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {
  initializeEditor();
});

/*
 * KeepAlive: quay lại Editor từ Preview / trang khác
 * vẫn phải đọc lại query trên URL (theme/slug có thể
 * đã đổi) — onMounted không chạy lại.
 */
onActivated(() => {
  initializeEditor();
});
</script>
