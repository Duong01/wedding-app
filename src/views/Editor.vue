<template>
  <div class="wedding-editor">
    <EditorHeader
      :wedding="wedding"
      :routeTheme="routeTheme"
      :saving="saving"
      :dirty="editorStore.dirty"
      :canUndo="editorStore.canUndo"
      :canRedo="editorStore.canRedo"
      :undoDepth="editorStore.undoDepth"
      :publishState="publishState"
      :daysLeft="daysLeft"
      :publishing="publishing"
      @back="backToTemplates"
      @preview="previewWedding"
      @save="saveWedding"
      @undo="undo"
      @redo="redo"
      @publish="publishWedding"
      @share="openPublishDialog"
      @payment="goToPayment"
    />

    <!-- =====================================================
         THÔNG BÁO CHƯA ĐĂNG NHẬP (thường trực, không tự tắt)
    ====================================================== -->
    <div
      v-if="showLoginNotice"
      class="editor-login-notice"
      :class="loginNoticeLevel"
    >
      <v-icon class="notice-icon" size="17">
        {{
          loginNoticeLevel === "warn"
            ? "mdi-alert-outline"
            : "mdi-account-outline"
        }}
      </v-icon>

      <span class="notice-text">
        <template v-if="loginNoticeLevel === 'warn'">
          Bạn đang chỉnh sửa mà <strong>chưa đăng nhập</strong> — thay đổi
          chưa được lưu lên server và thiệp chưa thể xuất bản cho khách mời.
        </template>

        <template v-else>
          Bạn chưa đăng nhập. Mọi thay đổi chỉ được giữ trên máy này.
        </template>
      </span>

      <button type="button" class="notice-login" @click="goToLogin">
        <v-icon size="15"> mdi-login-variant </v-icon>

        <span>Đăng nhập</span>
      </button>

      <button
        v-if="loginNoticeLevel === 'info'"
        type="button"
        class="notice-dismiss"
        title="Ẩn thông báo"
        @click="loginNoticeDismissed = true"
      >
        <v-icon size="16"> mdi-close </v-icon>
      </button>
    </div>

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
        :completion="completion"
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

        <DressCodePanel v-if="activeMenu === 'dressCode'" :wedding="wedding" />

        <SectionTitlesPanel v-if="activeMenu === 'sections'" :wedding="wedding" />

        <ThemePanel v-if="activeMenu === 'theme'" :wedding="wedding" />
      </section>

      <!-- LIVE PREVIEW (iframe thật) -->
      <EditorPreviewPanel
        ref="previewPanelRef"
        :themeName="wedding.theme?.Name"
        :previewDevice="previewDevice"
        :previewUrl="previewUrl"
        :autoRefresh="autoRefresh"
        @update:previewDevice="previewDevice = $event"
        @update:autoRefresh="autoRefresh = $event"
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
      :dirty="editorStore.dirty"
      :canUndo="editorStore.canUndo"
      :canRedo="editorStore.canRedo"
      :publishState="publishState"
      :daysLeft="daysLeft"
      :publishing="publishing"
      @select="selectMenu"
      @open-menu="mobileMenuOpen = true"
      @preview="previewWedding"
      @save="saveWedding"
      @undo="undo"
      @redo="redo"
      @publish="publishWedding"
      @share="openPublishDialog"
      @payment="goToPayment"
    />

    <!-- =====================================================
         MOBILE MENU SHEET
    ====================================================== -->
    <Transition name="sheet">
      <EditorMobileSheet
        v-if="mobileMenuOpen"
        :menus="menus"
        :activeMenu="activeMenu"
        :completion="completion"
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

    <!-- =====================================================
         HỘP THOẠI XÁC NHẬN DÙNG CHUNG
    ====================================================== -->
    <EditorConfirmDialog />

    <!-- =====================================================
         KHUNG CHIA SẺ LINK SAU KHI XUẤT BẢN
    ====================================================== -->
    <PublishDialog
      v-if="publishDialogOpen"
      :guestLink="guestLink"
      :trialEndsAt="trialEndsAt"
      :daysLeft="daysLeft"
      :publishState="publishState"
      @close="publishDialogOpen = false"
      @payment="goToPayment"
    />

    <!-- =====================================================
         KHÔI PHỤC BẢN NHÁP
    ====================================================== -->
    <Transition name="toast">
      <div v-if="draftPrompt" class="draft-prompt">
        <div class="draft-icon">
          <v-icon size="19"> mdi-history </v-icon>
        </div>

        <div class="draft-body">
          <strong> Có bản nháp chưa lưu </strong>

          <span>
            Bạn còn thay đổi từ {{ draftPrompt.time }} chưa lưu lên
            server.
          </span>
        </div>

        <div class="draft-actions">
          <button type="button" class="draft-btn ghost" @click="discardDraft">
            Bỏ
          </button>

          <button type="button" class="draft-btn" @click="restoreDraft">
            Khôi phục
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useWeddingStore } from "@/stores/wedding";
import { useWeddingEditorStore } from "@/stores/weddingEditor";
import { useAuthStore } from "@/stores/auth";
import { AddDataWedding } from "@/model/api";
import EditorHeader from "@/components/editor/EditorHeader.vue";
import EditorSidebarNav from "@/components/editor/EditorSidebarNav.vue";
import EditorPreviewPanel from "@/components/editor/EditorPreviewPanel.vue";
import PreviewOverlay from "@/components/editor/PreviewOverlay.vue";
import EditorMobileBar from "@/components/editor/EditorMobileBar.vue";
import EditorMobileSheet from "@/components/editor/EditorMobileSheet.vue";
import EditorConfirmDialog from "@/components/editor/EditorConfirmDialog.vue";
import PublishDialog from "@/components/editor/PublishDialog.vue";
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
import DressCodePanel from "@/components/editor/panels/DressCodePanel.vue";
import SectionTitlesPanel from "@/components/editor/panels/SectionTitlesPanel.vue";
import ThemePanel from "@/components/editor/panels/ThemePanel.vue";

import { useWeddingPreviewSync } from "@/composables/useWeddingPreviewSync";
import { useEditorHistory } from "@/composables/useEditorHistory";
import { useWeddingPublish } from "@/composables/useWeddingPublish";
import { confirmDialog } from "@/composables/useConfirm";
import { ensureSections } from "@/data/sectionTitles";
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

/*
 * Tự động đẩy dữ liệu sang iframe xem trước. Tắt khi
 * người dùng muốn giữ nguyên bản xem trước để đọc.
 */
const autoRefresh = ref(true);

const previewPanelRef = ref(null);
const overlayRef = ref(null);

const loading = ref(false);
const saving = ref(false);

const error = ref("");

const saveMessage = ref("");
const saveError = ref(false);

/*
 * Bản nháp khôi phục được (localStorage) — hiển thị
 * thanh hỏi người dùng trước khi ghi đè dữ liệu.
 */
const draftPrompt = ref(null);

/*
 * Khung chia sẻ link sau khi xuất bản.
 */
const publishDialogOpen = ref(false);

/*
 * Người dùng đã bấm ẩn dải "chưa đăng nhập" mức nhạt.
 * Mức cảnh báo (đã chỉnh sửa) KHÔNG cho ẩn.
 */
const loginNoticeDismissed = ref(false);

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
   XUẤT BẢN + DÙNG THỬ
========================================================= */

/*
 * Trạng thái xuất bản (Draft / Trial / Expired / Active / Locked)
 * đọc từ server. Chỉ sau khi chủ thiệp bấm "Xuất bản" thì khách
 * mời mới xem được — bấm Lưu đơn thuần thì không.
 */
const {
  publishing,
  publishState,
  daysLeft,
  trialEndsAt,
  guestLink,
  refresh: refreshPublish,
  publish: publishToServer,
} = useWeddingPublish(wedding, routeSlug);

/*
 * Dải thông báo "chưa đăng nhập" — thường trực, không tự tắt.
 * Mức cảnh báo bật ngay khi người dùng đã chỉnh sửa gì đó.
 */
const loginNoticeLevel = computed(() => {
  if (auth.isLoggedIn) {
    return null;
  }

  return editorStore.dirty ? "warn" : "info";
});

const showLoginNotice = computed(() => {
  if (!loginNoticeLevel.value) {
    return false;
  }

  /* Mức cảnh báo luôn hiện; mức nhạt cho phép ẩn. */
  return loginNoticeLevel.value === "warn" || !loginNoticeDismissed.value;
});

function goToLogin() {
  router.push({
    name: "Login",
    query: {
      redirect: route.fullPath,
    },
  });
}

/* =========================================================
   IFRAME PREVIEW SYNC
========================================================= */

const { previewUrl } = useWeddingPreviewSync(
  wedding,
  computed(() => previewPanelRef.value?.iframeEl ?? null),
  computed(() => overlayRef.value?.iframeEl ?? null),
  { enabled: () => autoRefresh.value }
);

/* =========================================================
   LỊCH SỬ HOÀN TÁC + TỰ ĐỘNG LƯU BẢN NHÁP
========================================================= */

/*
 * Chỉ ghi lịch sử khi đã có dữ liệu thiệp và không
 * đang ở màn hình loading.
 */
const history = useEditorHistory(wedding, editorStore, {
  enabled: () => !!wedding.value && !loading.value,
});

function undo() {
  if (!editorStore.undo()) {
    return;
  }

  /*
   * wedding vừa bị thay bằng snapshot cũ — tạm ngưng
   * watch để không ghi thêm một bước lịch sử cho
   * chính thao tác hoàn tác.
   */
  history.suspend();

  window.setTimeout(() => history.resume(), 0);
}

function redo() {
  if (!editorStore.redo()) {
    return;
  }

  history.suspend();

  window.setTimeout(() => history.resume(), 0);
}

/* =========================================================
   PHÍM TẮT
========================================================= */

function onEditorKeydown(event) {
  const meta = event.ctrlKey || event.metaKey;

  if (!meta) {
    return;
  }

  const key = event.key.toLowerCase();

  if (key === "s") {
    event.preventDefault();

    saveWedding();

    return;
  }

  if (key === "z" && !event.shiftKey) {
    event.preventDefault();

    undo();

    return;
  }

  if ((key === "z" && event.shiftKey) || key === "y") {
    event.preventDefault();

    redo();
  }
}

/* =========================================================
   BẢN NHÁP
========================================================= */

function formatDraftTime(timestamp) {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(timestamp));
}

/*
 * Chỉ hỏi khôi phục khi bản nháp thuộc ĐÚNG thiệp đang
 * mở (cùng slug, hoặc cùng theme nếu là thiệp mới) —
 * tránh ghi đè thiệp này bằng nháp của thiệp khác.
 */
function checkDraft() {
  const draft = editorStore.readDraft();

  if (!draft?.wedding) {
    return;
  }

  const currentSlug = routeSlug.value || "";

  const draftSlug = draft.wedding.slug || "";

  if (currentSlug !== draftSlug) {
    return;
  }

  const currentTheme = routeTheme.value;

  const draftTheme = draft.wedding.theme?.Name || "";

  if (!currentSlug && draftTheme !== currentTheme) {
    return;
  }

  draftPrompt.value = {
    time: formatDraftTime(draft.savedAt),
    wedding: draft.wedding,
  };
}

function restoreDraft() {
  if (!draftPrompt.value?.wedding) {
    return;
  }

  editorStore.setWedding(draftPrompt.value.wedding);

  ensureSections(editorStore.wedding);

  editorStore.markDirty();

  draftPrompt.value = null;

  showSaveMessage("Đã khôi phục bản nháp chưa lưu.");
}

function discardDraft() {
  editorStore.clearDraft();

  draftPrompt.value = null;
}

/*
 * Đồng bộ các trường dùng chung giữa các panel:
 * tên cô dâu/chú rể + ngày cưới nhập ở panel
 * Thông tin chung tự động điền sang Hero/Footer/
 * Couple/Countdown (và ngược lại) — người dùng
 * không phải nhập lại.
 *
 * syncSharedFields/syncRelatedFields chỉ ghi đè khi
 * trường đích đang trống hoặc trùng giá trị đã sync
 * trước đó, nên nội dung người dùng chủ động sửa
 * khác đi vẫn được giữ nguyên.
 */
watch(
  () => wedding.value?.groomName,
  (value) => {
    editorStore.syncSharedFields(
      { groomName: value },
      wedding.value?.hero || {}
    );

    editorStore.syncSharedFields(
      { groomName: value },
      wedding.value?.footer || {}
    );

    editorStore.syncRelatedFields({ groomName: value });
  }
);

watch(
  () => wedding.value?.brideName,
  (value) => {
    editorStore.syncSharedFields(
      { brideName: value },
      wedding.value?.hero || {}
    );

    editorStore.syncSharedFields(
      { brideName: value },
      wedding.value?.footer || {}
    );

    editorStore.syncRelatedFields({ brideName: value });
  }
);

watch(
  () => wedding.value?.weddingDate,
  (value) => {
    editorStore.syncSharedFields(
      { weddingDate: value },
      wedding.value?.hero || {}
    );

    editorStore.syncRelatedFields({ weddingDate: value });
  }
);

/* =========================================================
   MENUS
========================================================= */

/*
 * Menu chia theo nhóm để sidebar dài 20 mục vẫn dễ
 * quét mắt: Nội dung thiệp → Khách mời → Cấu hình.
 */
const MENU_GROUPS = [
  { id: "content", label: "NỘI DUNG THIỆP" },
  { id: "guests", label: "KHÁCH MỜI" },
  { id: "config", label: "CẤU HÌNH" },
];

const menus = [
  {
    id: "general",
    group: "content",
    label: "Thông tin chung",
    description: "Thông tin cơ bản",
    icon: "mdi-card-account-details-outline",
  },

  {
    id: "couple",
    group: "content",
    label: "Cô dâu & Chú rể",
    description: "Thông tin hai bạn",
    icon: "mdi-heart-outline",
  },

  {
    id: "hero",
    group: "content",
    label: "Ảnh bìa",
    description: "Màn hình mở đầu",
    icon: "mdi-image-outline",
  },

  {
    id: "story",
    group: "content",
    label: "Chuyện tình yêu",
    description: "Câu chuyện của hai bạn",
    icon: "mdi-book-heart-outline",
  },

  {
    id: "events",
    group: "content",
    label: "Sự kiện cưới",
    description: "Ngày giờ địa điểm",
    icon: "mdi-calendar-heart-outline",
  },

  {
    id: "dressCode",
    group: "content",
    label: "Trang phục",
    description: "Dress code cho khách",
    icon: "mdi-tshirt-crew-outline",
  },

  {
    id: "timeline",
    group: "content",
    label: "Timeline",
    description: "Lịch trình ngày cưới",
    icon: "mdi-timeline-outline",
  },

  {
    id: "gallery",
    group: "content",
    label: "Album ảnh",
    description: "Khoảnh khắc đáng nhớ",
    icon: "mdi-image-multiple-outline",
  },

  {
    id: "countdown",
    group: "content",
    label: "Đếm ngược",
    description: "Đếm ngày cưới",
    icon: "mdi-timer-outline",
  },

  {
    id: "footer",
    group: "content",
    label: "Chân thiệp",
    description: "Lời cảm ơn cuối thiệp",
    icon: "mdi-page-layout-footer",
  },

  {
    id: "map",
    group: "content",
    label: "Bản đồ",
    description: "Chỉ đường đến sự kiện",
    icon: "mdi-map-marker-outline",
  },

  {
    id: "music",
    group: "content",
    label: "Âm nhạc",
    description: "Nhạc nền thiệp",
    icon: "mdi-music-outline",
  },

  {
    id: "recipient",
    group: "guests",
    label: "Khách mời",
    description: "Cá nhân hóa thiệp",
    icon: "mdi-account-multiple-outline",
  },

  {
    id: "gifts",
    group: "guests",
    label: "Mừng cưới",
    description: "Tài khoản nhận quà",
    icon: "mdi-gift-outline",
  },

  {
    id: "guestbook",
    group: "guests",
    label: "Sổ lưu bút",
    description: "Lời chúc khách mời",
    icon: "mdi-message-heart-outline",
  },

  {
    id: "sections",
    group: "config",
    label: "Tiêu đề mục",
    description: "Đổi tên các mục",
    icon: "mdi-format-title",
  },

  {
    id: "settings",
    group: "config",
    label: "Cài đặt hiển thị",
    description: "Bật / tắt nội dung",
    icon: "mdi-tune-variant",
  },

  {
    id: "theme",
    group: "config",
    label: "Giao diện",
    description: "Màu sắc & font",
    icon: "mdi-palette-outline",
  },
];

/* =========================================================
   ĐỘ HOÀN THIỆN TỪNG MỤC
========================================================= */

/*
 * Đánh dấu mục nào đã có nội dung để sidebar hiện tick
 * — người dùng nhìn ra ngay còn thiếu gì mà không phải
 * mở từng mục.
 */
const completion = computed(() => {
  const data = wedding.value;

  if (!data) {
    return {};
  }

  const has = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return typeof value === "string" ? !!value.trim() : !!value;
  };

  return {
    general: has(data.brideName) && has(data.groomName) && has(data.weddingDate),
    couple: has(data.couple?.Bride?.Name) || has(data.couple?.Groom?.Name),
    hero: has(data.hero?.Background) || has(data.hero?.Subtitle),
    story: has(data.story?.Description) || has(data.story?.Title),
    events: has(data.events),
    dressCode: has(data.dressCode?.Note) || has(data.dressCode?.Colors),
    timeline: has(data.timeline),
    gallery: has(data.gallery),
    countdown: !!data.countdown?.Enabled,
    footer: has(data.footer?.Message) || has(data.thankYouNote),
    map: (data.events || []).some((event) => has(event.Map)),
    music: has(data.music?.Url),
    recipient: has(data.recipientName),
    gifts: has(data.gifts),
    guestbook: has(data.guestBook?.Guest),
    sections: Object.values(data.sections || {}).some((section) =>
      Object.values(section || {}).some((value) => has(value))
    ),
  };
});

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

/*
 * Lưu thiệp lên server.
 *
 * @returns Promise<boolean> — true khi đã lưu xong. publishWedding()
 *          cần chờ kết quả này trước khi xuất bản, nếu không sẽ
 *          xuất bản nhầm nội dung cũ.
 */
function saveWedding() {
  if (!wedding.value || saving.value) {
    return Promise.resolve(false);
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

    return Promise.resolve(false);
  }

  saving.value = true;
  saveMessage.value = "";
  saveError.value = false;

  return new Promise((resolve) => {
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
           * Danh sách thiệp giờ lấy trực tiếp từ API
           * (getAllWeddings / Manage) — không cần ghi
           * registry localStorage nữa.
           */

          /*
           * Đã lên server → bản nháp localStorage hết
           * cần thiết, xoá để lần mở sau không hỏi lại.
           */
          editorStore.markSaved();
          editorStore.clearDraft();

          showSaveMessage("Đã lưu thiệp thành công.");
          saving.value = false;

          resolve(result?.status === "success");
        },

        (err) => {
          console.error("[WeddingEditor] save error:", err);

          showSaveMessage(
            err?.message || "Không thể lưu thiệp.",
            true
          );

          saving.value = false;

          resolve(false);
        }
      );
    } catch (err) {
      console.error("[WeddingEditor] save exception:", err);

      showSaveMessage(
        err?.message || "Không thể lưu thiệp.",
        true
      );

      saving.value = false;

      resolve(false);
    }
  });
}

/* =========================================================
   XUẤT BẢN
========================================================= */

/*
 * Luồng: kiểm tra đăng nhập → lưu nếu còn thay đổi chưa lưu
 * → xác nhận → gọi API → mở khung chia sẻ link.
 *
 * Lưu trước là bắt buộc: nếu không, thiệp được xuất bản với
 * nội dung cũ trên server trong khi bản đang sửa còn nằm ở máy.
 */
async function publishWedding() {
  if (!wedding.value || publishing.value) {
    return;
  }

  if (!auth.canSaveWedding()) {
    showSaveMessage("Vui lòng đăng nhập để xuất bản thiệp.");

    goToLogin();

    return;
  }

  if (editorStore.dirty) {
    const saved = await saveWedding();

    if (!saved) {
      return;
    }
  }

  const ok = await confirmDialog({
    title: "Xuất bản thiệp?",
    message:
      "Sau khi xuất bản, khách mời mở link sẽ xem được thiệp. " +
      "Bạn được dùng thử miễn phí 3 ngày, sau đó cần thanh toán " +
      "một lần để thiệp tiếp tục hoạt động.",
    confirmText: "Xuất bản ngay",
    cancelText: "Để sau",
  });

  if (!ok) {
    return;
  }

  const success = await publishToServer();

  if (success) {
    /*
     * Thiệp mới lưu lần đầu: server vừa sinh slug nhưng URL vẫn
     * chưa có. Ghi slug lên URL để lần sau mở lại là đúng thiệp
     * này, và để link khách mời trong khung chia sẻ có giá trị.
     */
    const slug = routeSlug.value || wedding.value?.slug;

    if (slug && slug !== routeSlug.value) {
      router.replace({
        name: "Editor",
        query: { ...route.query, slug },
      });
    }

    publishDialogOpen.value = true;
    return;
  }

  showSaveMessage("Không thể xuất bản thiệp. Vui lòng thử lại.", true);
}

function openPublishDialog() {
  publishDialogOpen.value = true;
}

function goToPayment() {
  /*
   * Thiệp vừa được lưu lần đầu chưa có slug trên URL —
   * lấy slug server vừa trả về trong wedding.
   */
  const slug = routeSlug.value || wedding.value?.slug;

  if (!slug) {
    return;
  }

  router.push({
    name: "WeddingPayment",
    params: { slug },
  });
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
  /*
   * Còn thay đổi chưa lưu thì hỏi trước khi rời — bản
   * nháp vẫn nằm trong localStorage nên có thể khôi
   * phục, nhưng người dùng cần biết mình đang bỏ dở.
   */
  if (editorStore.dirty) {
    const ok = await confirmDialog({
      title: "Rời trình chỉnh sửa?",
      message:
        "Bạn còn thay đổi chưa lưu lên server. Bản nháp vẫn được giữ trên máy này và hỏi khôi phục ở lần mở sau.",
      confirmText: "Rời trang",
      cancelText: "Ở lại",
      danger: true,
    });

    if (!ok) {
      return;
    }
  }

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
    /*
     * Dữ liệu cũ có thể chưa có wedding.sections —
     * tạo sẵn object rỗng để panel "Tiêu đề mục"
     * ghi được giá trị (API lưu dạng object lồng nhau
     * sections[key][field] = value).
     */
    ensureSections(editorStore.wedding);

    loading.value = false;

    /*
     * Sau khi dữ liệu đã sẵn sàng mới kiểm tra bản
     * nháp — cần biết slug/theme hiện tại để so khớp.
     */
    checkDraft();

    /*
     * Đọc trạng thái xuất bản / dùng thử của thiệp.
     * Thiệp mới chưa có slug thì composable tự bỏ qua
     * và giữ mặc định Draft.
     */
    refreshPublish();
  }
}
/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {
  initializeEditor();

  window.addEventListener("keydown", onEditorKeydown);
});

/*
 * KeepAlive: quay lại Editor từ Preview / trang khác
 * vẫn phải đọc lại query trên URL (theme/slug có thể
 * đã đổi) — onMounted không chạy lại.
 */
onActivated(() => {
  initializeEditor();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEditorKeydown);
});
</script>
