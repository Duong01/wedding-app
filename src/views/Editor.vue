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
      :progress="overallProgress"
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
          <i18n-t keypath="editor.notice.warn" tag="span">
            <template #strong>
              <strong>{{ $t("editor.notice.notLoggedIn") }}</strong>
            </template>
          </i18n-t>
        </template>

        <template v-else>
          {{ $t("editor.notice.localOnly") }}
        </template>
      </span>

      <button type="button" class="notice-login" @click="goToLogin">
        <v-icon size="15"> mdi-login-variant </v-icon>

        <span>{{ $t("auth.login") }}</span>
      </button>

      <button
        v-if="loginNoticeLevel === 'info'"
        type="button"
        class="notice-dismiss"
        :title="$t('editor.notice.hide')"
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

        <strong> {{ $t("editor.loading") }} </strong>

        <span> {{ $t("common.pleaseWait") }} </span>
      </div>
    </div>

    <!-- ERROR -->
    <div v-else-if="!wedding" class="editor-error">
      <div class="error-card">
        <div class="error-icon">
          <v-icon> mdi-alert-circle-outline </v-icon>
        </div>

        <h2>{{ $t("editor.loadError") }}</h2>

        <p>
          {{ error || $t("editor.notReady") }}
        </p>

        <button type="button" class="save-button" @click="initializeEditor">
          <v-icon> mdi-refresh </v-icon>

          {{ $t("common.retry") }}
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
        <GeneralPanel
          v-if="activeMenu === 'general'"
          :wedding="wedding"
          :progress="completion.general"
          :checklist="progressChecklist"
          :overall="overallProgress"
        />

        <CouplePanel
          v-if="activeMenu === 'couple'"
          :wedding="wedding"
          :progress="completion.couple"
        />

        <HeroPanel
          v-if="activeMenu === 'hero'"
          :wedding="wedding"
          :progress="completion.hero"
        />

        <StoryPanel
          v-if="activeMenu === 'story'"
          :wedding="wedding"
          :progress="completion.story"
        />

        <VideoPanel
          v-if="activeMenu === 'video'"
          :wedding="wedding"
          :progress="completion.video"
        />

        <EventsPanel
          v-if="activeMenu === 'events'"
          :wedding="wedding"
          :progress="completion.events"
        />

        <TimelinePanel
          v-if="activeMenu === 'timeline'"
          :wedding="wedding"
          :progress="completion.timeline"
        />

        <GalleryPanel
          v-if="activeMenu === 'gallery'"
          :wedding="wedding"
          :progress="completion.gallery"
        />

        <GamePanel
          v-if="activeMenu === 'game'"
          :wedding="wedding"
          :progress="completion.game"
        />

        <RecipientPanel
          v-if="activeMenu === 'recipient'"
          :wedding="wedding"
          :progress="completion.recipient"
        />

        <GiftsPanel
          v-if="activeMenu === 'gifts'"
          :wedding="wedding"
          :progress="completion.gifts"
        />

        <GuestbookPanel
          v-if="activeMenu === 'guestbook'"
          :wedding="wedding"
          :progress="completion.guestbook"
        />

        <CountdownPanel
          v-if="activeMenu === 'countdown'"
          :wedding="wedding"
          :progress="completion.countdown"
        />

        <MusicPanel
          v-if="activeMenu === 'music'"
          :wedding="wedding"
          :progress="completion.music"
        />

        <FooterPanel
          v-if="activeMenu === 'footer'"
          :wedding="wedding"
          :progress="completion.footer"
        />

        <SettingsPanel v-if="activeMenu === 'settings'" :wedding="wedding" />

        <DressCodePanel
          v-if="activeMenu === 'dressCode'"
          :wedding="wedding"
          :progress="completion.dressCode"
        />

        <SectionTitlesPanel
          v-if="activeMenu === 'sections'"
          :wedding="wedding"
          :progress="completion.sections"
        />

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

      <span> {{ $t("editor.preview") }} </span>
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
          <strong> {{ $t("editor.draft.title") }} </strong>

          <span>
            {{ $t("editor.draft.body", { time: draftPrompt.time }) }}
          </span>
        </div>
        <div class="draft-actions">
          <button type="button" class="draft-btn ghost" @click="discardDraft">
            {{ $t("common.discard") }}
          </button>
          <button type="button" class="draft-btn" @click="restoreDraft">
            {{ $t("editor.draft.restore") }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template> <script setup>
import { useI18n } from "vue-i18n";
import {
  ref,
  computed,
  onMounted,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  watch,
} from "vue";
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
import VideoPanel from "@/components/editor/panels/VideoPanel.vue";
import EventsPanel from "@/components/editor/panels/EventsPanel.vue";
import TimelinePanel from "@/components/editor/panels/TimelinePanel.vue";
import GalleryPanel from "@/components/editor/panels/GalleryPanel.vue";
import GamePanel from "@/components/editor/panels/GamePanel.vue";
import RecipientPanel from "@/components/editor/panels/RecipientPanel.vue";
import GiftsPanel from "@/components/editor/panels/GiftsPanel.vue";
import GuestbookPanel from "@/components/editor/panels/GuestbookPanel.vue";
import CountdownPanel from "@/components/editor/panels/CountdownPanel.vue";
import MusicPanel from "@/components/editor/panels/MusicPanel.vue";
import FooterPanel from "@/components/editor/panels/FooterPanel.vue";
import SettingsPanel from "@/components/editor/panels/SettingsPanel.vue";
import DressCodePanel from "@/components/editor/panels/DressCodePanel.vue";
import SectionTitlesPanel from "@/components/editor/panels/SectionTitlesPanel.vue";
import ThemePanel from "@/components/editor/panels/ThemePanel.vue";
import { useWeddingPreviewSync } from "@/composables/useWeddingPreviewSync";
import { useEditorHistory } from "@/composables/useEditorHistory";
import { useWeddingPublish } from "@/composables/useWeddingPublish";
import { confirmDialog } from "@/composables/useConfirm";
import { ensureSections } from "@/data/sectionTitles";
import { ensureNewSections } from "@/utils/weddingShape";
import "@/assets/styles/editor.css";
const { t } = useI18n();
defineOptions({ name: "WeddingEditor" });
const router = useRouter();
const route = useRoute();
/* ========================================================= STORE ========================================================= */ const weddingStore =
  useWeddingStore();
const editorStore = useWeddingEditorStore();
const auth = useAuthStore();
/* ========================================================= STATE ========================================================= */ const activeMenu =
  ref("general");
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

  ensureNewSections(editorStore.wedding);

  editorStore.markDirty();

  draftPrompt.value = null;

  showSaveMessage(t("editor.draft.restored"));
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
  {
    id: "content",
    get label() {
      return t("editor.group.content");
    },
  },
  {
    id: "guests",
    get label() {
      return t("editor.group.guests");
    },
  },
  {
    id: "config",
    get label() {
      return t("editor.group.config");
    },
  },
];

const menus = [
  {
    id: "general",
    group: "content",
    get label() {
      return t("editor.menu.general");
    },
    get description() {
      return t("editor.menu.generalDesc");
    },
    icon: "mdi-card-account-details-outline",
  },

  {
    id: "couple",
    group: "content",
    get label() {
      return t("editor.menu.couple");
    },
    get description() {
      return t("editor.menu.coupleDesc");
    },
    icon: "mdi-heart-outline",
  },

  {
    id: "hero",
    group: "content",
    get label() {
      return t("editor.menu.hero");
    },
    get description() {
      return t("editor.menu.heroDesc");
    },
    icon: "mdi-image-outline",
  },

  {
    id: "story",
    group: "content",
    get label() {
      return t("editor.menu.story");
    },
    get description() {
      return t("editor.menu.storyDesc");
    },
    icon: "mdi-book-heart-outline",
  },

  {
    id: "video",
    group: "content",
    get label() {
      return t("editor.menu.video");
    },
    get description() {
      return t("editor.menu.videoDesc");
    },
    icon: "mdi-play-circle-outline",
  },

  {
    id: "events",
    group: "content",
    get label() {
      return t("editor.menu.events");
    },
    get description() {
      return t("editor.menu.eventsDesc");
    },
    icon: "mdi-calendar-heart-outline",
  },

  {
    id: "dressCode",
    group: "content",
    get label() {
      return t("editor.menu.dressCode");
    },
    get description() {
      return t("editor.menu.dressCodeDesc");
    },
    icon: "mdi-tshirt-crew-outline",
  },

  {
    id: "timeline",
    group: "content",
    get label() {
      return t("sections.timeline");
    },
    get description() {
      return t("editor.menu.timeline");
    },
    icon: "mdi-timeline-outline",
  },

  {
    id: "gallery",
    group: "content",
    get label() {
      return t("editor.menu.gallery");
    },
    get description() {
      return t("editor.menu.galleryDesc");
    },
    icon: "mdi-image-multiple-outline",
  },

  {
    id: "game",
    group: "content",
    get label() {
      return t("editor.menu.game");
    },
    get description() {
      return t("editor.menu.gameDesc");
    },
    icon: "mdi-party-popper",
  },

  {
    id: "countdown",
    group: "content",
    get label() {
      return t("editor.menu.countdown");
    },
    get description() {
      return t("editor.menu.countdownDesc");
    },
    icon: "mdi-timer-outline",
  },

  {
    id: "footer",
    group: "content",
    get label() {
      return t("editor.menu.footer");
    },
    get description() {
      return t("editor.menu.footerDesc");
    },
    icon: "mdi-page-layout-footer",
  },

  {
    id: "music",
    group: "content",
    get label() {
      return t("editor.menu.music");
    },
    get description() {
      return t("editor.menu.musicDesc");
    },
    icon: "mdi-music-outline",
  },

  {
    id: "recipient",
    group: "guests",
    get label() {
      return t("editor.menu.recipient");
    },
    get description() {
      return t("editor.menu.recipientDesc");
    },
    icon: "mdi-account-multiple-outline",
  },

  {
    id: "gifts",
    group: "guests",
    get label() {
      return t("editor.menu.gifts");
    },
    get description() {
      return t("editor.menu.giftsDesc");
    },
    icon: "mdi-gift-outline",
  },

  {
    id: "guestbook",
    group: "guests",
    get label() {
      return t("editor.menu.guestbook");
    },
    get description() {
      return t("editor.menu.guestbookDesc");
    },
    icon: "mdi-message-heart-outline",
  },

  {
    id: "sections",
    group: "config",
    get label() {
      return t("editor.menu.sections");
    },
    get description() {
      return t("editor.menu.sectionsDesc");
    },
    icon: "mdi-format-title",
  },

  {
    id: "settings",
    group: "config",
    get label() {
      return t("editor.menu.settings");
    },
    get description() {
      return t("editor.menu.settingsDesc");
    },
    icon: "mdi-tune-variant",
  },

  {
    id: "theme",
    group: "config",
    get label() {
      return t("editor.menu.theme");
    },
    get description() {
      return t("editor.menu.themeDesc");
    },
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
 *
 * Mỗi mục trả { done, total }:
 *   - done >= total → sidebar tick + badge "Đã có nội dung"
 *   - done > 0      → badge "x%" (làm dở)
 *   - done = 0      → badge "Chưa có nội dung"
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

  /* Đếm số phần tử trong list thỏa điều kiện. */
  const count = (list, predicate) =>
    Array.isArray(list) ? list.filter(predicate).length : 0;

  const coupleDone =
    count(
      [data.couple?.Bride, data.couple?.Groom],
      (person) => person && has(person.Name)
    ) + has(data.couple?.Bride?.Description) + has(data.couple?.Groom?.Description);

  const eventsDone = count(
    data.events,
    (event) => has(event?.Title) && has(event?.EventDate)
  );

  const timelineDone = count(
    data.timeline,
    (item) => has(item?.Title) && has(item?.Time)
  );

  const giftsDone = count(
    data.gifts,
    (gift) => has(gift?.Name) && (has(gift?.AccountNumber) || has(gift?.QrCode))
  );

  return {
    general: {
      done:
        has(data.brideName) +
        has(data.groomName) +
        has(data.weddingDate) +
        has(data.slug),
      total: 4,
    },
    couple: { done: coupleDone, total: 4 },
    hero: {
      done:
        has(data.hero?.Title) +
        has(data.hero?.Subtitle) +
        has(data.hero?.Location),
      total: 3,
    },
    story: {
      done:
        has(data.story?.Title) +
        (has(data.story?.Description) || has(data.storyMilestones)),
      total: 2,
    },
    video: { done: has(data.video?.Url) ? 1 : 0, total: 1 },
    events: { done: eventsDone, total: Math.max(data.events?.length || 0, 1) },
    dressCode: {
      done: has(data.dressCode?.Note) || has(data.dressCode?.Colors) ? 1 : 0,
      total: 1,
    },
    timeline: {
      done: timelineDone,
      total: Math.max(data.timeline?.length || 0, 1),
    },
    gallery: {
      done: has(data.gallery) ? 1 : 0,
      total: 1,
    },
    game: {
      done: has(data.game?.Title) || data.settings?.ShowGame === true ? 1 : 0,
      total: 1,
    },
    countdown: { done: has(data.countdown?.Target) ? 1 : 0, total: 1 },
    footer: {
      done: has(data.footer?.Message) || has(data.thankYouNote) ? 1 : 0,
      total: 1,
    },
    music: { done: has(data.music?.Url) ? 1 : 0, total: 1 },
    recipient: {
      done: has(data.recipientName) ? 1 : 0,
      total: 1,
    },
    gifts: { done: giftsDone, total: Math.max(data.gifts?.length || 0, 1) },
    guestbook: {
      done: has(data.guestBook?.Title) || has(data.guestBook?.Guest) ? 1 : 0,
      total: 1,
    },
    sections: {
      done: Object.values(data.sections || {}).some((section) =>
        Object.values(section || {}).some((value) => has(value))
      )
        ? 1
        : 0,
      total: 1,
    },
  };
});

/*
 * Tổng hợp toàn thiệp: cộng done/total của mọi mục nội dung
 * (bỏ "settings"/"theme" vì đó là cấu hình, không phải nội
 * dung khách mời nhìn thấy). Dùng cho thanh tiến độ trên
 * header — người dùng thấy ngay còn bao nhiêu phần trăm.
 */
const overallProgress = computed(() => {
  const entries = Object.entries(completion.value).filter(
    ([id]) => id !== "settings" && id !== "theme"
  );

  const total = entries.reduce((sum, [, value]) => sum + (value.total || 0), 0);

  const done = entries.reduce(
    (sum, [, value]) => sum + Math.min(value.done || 0, value.total || 0),
    0
  );

  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
  };
});

/*
 * Danh sách mục nội dung kèm tiến độ — dùng cho thẻ "Tiến
 * độ hoàn thiện" ở panel Thông tin chung. Lấy từ chính
 * `completion` nên số liệu luôn khớp với badge ở từng mục
 * và thanh tiến độ trên header.
 */
const progressChecklist = computed(() =>
  menus
    .filter((item) => item.id !== "settings" && item.id !== "theme")
    .map((item) => {
      const value = completion.value[item.id] || { done: 0, total: 0 };

      return {
        id: item.id,
        label: item.label,
        done: value.done || 0,
        total: value.total || 0,
        complete: value.total > 0 && value.done >= value.total,
      };
    })
);

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
    showSaveMessage(t("editor.save.loginRequired"));

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

          /*
           * Cache của weddingStore vẫn giữ bản CŨ. loadWedding()
           * trả cache trước khi gọi API → lần sau mở lại editor
           * sẽ thiếu nội dung vừa lưu. Xoá cache của slug này.
           */
          weddingStore.invalidate(
            routeSlug.value || wedding.value?.slug
          );

          showSaveMessage(t("editor.save.success"));
          saving.value = false;

          resolve(result?.status === "success");
        },

        (err) => {
          console.error("[WeddingEditor] save error:", err);

          showSaveMessage(err?.message || t("editor.save.failed"), true);

          saving.value = false;

          resolve(false);
        }
      );
    } catch (err) {
      console.error("[WeddingEditor] save exception:", err);

      showSaveMessage(err?.message || t("editor.save.failed"), true);

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
    showSaveMessage(t("editor.publish.loginRequired"));

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
    get title() {
      return t("editor.publish.confirmTitle");
    },
    message: t("editor.publish.confirmMessage"),
    get confirmText() {
      return t("editor.publish.now");
    },
    get cancelText() {
      return t("common.later");
    },
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

  showSaveMessage(t("editor.publish.failed"), true);
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
    console.warn("[WeddingEditor] Không có wedding để preview.");

    return;
  }

  /*
   * KHÔNG truyền wedding qua router.
   *
   * WeddingPreview sẽ lấy trực tiếp từ
   * useWeddingEditorStore().
   *
   * Nhưng VẪN truyền slug: nếu người dùng tải lại trang
   * /preview (hoặc mở tab mới) thì editor store rỗng —
   * không có slug thì preview báo "không có dữ liệu".
   */
  await router.push({
    path: "/preview",
    query: {
      theme: wedding.value.theme?.Name || routeTheme.value,
      slug: routeSlug.value || wedding.value.slug || undefined,
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
      get title() {
        return t("editor.leave.title");
      },
      get message() {
        return t("editor.leave.message");
      },
      get confirmText() {
        return t("editor.leave.confirm");
      },
      get cancelText() {
        return t("editor.leave.stay");
      },
      danger: true,
    });

    if (!ok) {
      return;
    }
  }

  /*
   * Trở về NGAY TRANG TRƯỚC ĐÓ (không cố định /templates):
   * người dùng có thể vào editor từ "Thiệp của tôi", từ
   * trang mẫu, hay từ link trực tiếp. Dùng history.back()
   * để giữ đúng luồng điều hướng; chỉ khi không có trang
   * trước (mở tab mới / vào thẳng link) mới fallback về
   * danh sách thiệp của tôi.
   *
   * vue-router lưu vị trí trước ở history.state.back; đọc
   * qua router.options.history.state để không phụ thuộc
   * window.history.state (có thể bị thay bởi router khác).
   */
  const previous = router.options.history.state?.back;

  /*
   * Trang trước là Preview (vòng Editor ↔ Preview) hoặc một
   * Editor khác thì KHÔNG back vào — quay lại là lặp qua lại
   * không thoát ra được. Thoát về danh sách thiệp.
   */
  const isSelfOrPreview =
    typeof previous === "string" &&
    (previous === "/preview" ||
      previous.startsWith("/preview?") ||
      previous === "/editor" ||
      previous.startsWith("/editor?"));

  if (previous && !isSelfOrPreview) {
    router.back();
    return;
  }

  await router.push({
    path: "/manage",
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
      const storeTheme = editorStore.wedding.theme?.Name || "";

      const storeSlug = editorStore.wedding.slug || "";

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
      const needLoadSlug = routeSlug.value && routeSlug.value !== storeSlug;

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
      const result = await weddingStore.loadWedding(routeSlug.value);

      const data = result || weddingStore.wedding;

      if (!data) {
        throw new Error(t("editor.apiNoData"));
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
        console.warn("[WeddingEditor] structuredClone failed:", cloneError);

        copy = JSON.parse(JSON.stringify(data));
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
      throw new Error(t("editor.storeInitFailed"));
    }
  } catch (err) {
    console.error("[WeddingEditor] initialize error:", err);

    error.value = err?.message || t("editor.loadErrorDot");
  } finally {
    /*
     * Dữ liệu cũ có thể chưa có wedding.sections —
     * tạo sẵn object rỗng để panel "Tiêu đề mục"
     * ghi được giá trị (API lưu dạng object lồng nhau
     * sections[key][field] = value).
     */
    ensureSections(editorStore.wedding);

    /*
     * Thiệp cũ (load từ API) chưa có video / game /
     * storyMilestones / story.Mode — back-fill để panel
     * v-model không crash và preview không undefined.
     */
    ensureNewSections(editorStore.wedding);

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

/*
 * Editor nằm trong <KeepAlive include="WeddingEditor"> (App.vue)
 * nên vòng đời là:
 *
 *   Lần đầu vào:  onMounted → onActivated   (cả hai cùng chạy)
 *   Quay lại:     chỉ onActivated
 *
 * Trước đây cả hai hook đều gọi initializeEditor() → lần đầu
 * vào editor, API bị gọi 2 LẦN (getWeddingForEdit +
 * getWeddingStatus nhân đôi). Cờ mountedInit chặn chạy lần 2
 * trong cùng một lần mount; onActivated vẫn chạy mỗi lần quay
 * lại từ trang khác (query theme/slug có thể đã đổi).
 */
let mountedInit = false;

onMounted(() => {
  window.addEventListener("keydown", onEditorKeydown);

  mountedInit = true;

  initializeEditor();
});

onActivated(() => {
  if (mountedInit) {
    /* Vừa mount xong — initializeEditor đã chạy ở onMounted. */
    mountedInit = false;

    return;
  }

  initializeEditor();
});

/*
 * Rời editor (về Manage / Templates...) — component vẫn sống
 * trong KeepAlive nhưng lịch sử hoàn tác 40 snapshot full
 * wedding không cần giữ: người dùng không ở đó để bấm undo.
 * Cắt còn 5 bước gần nhất — quay lại vẫn hoàn tác được vài
 * thao tác, bộ nhớ giảm ngay vài chục MB với thiệp nhiều ảnh.
 */
onDeactivated(() => {
  const history = editorStore.history;

  if (Array.isArray(history) && history.length > 5) {
    const cut = history.length - 5;

    history.splice(0, cut);

    editorStore.historyIndex = Math.max(0, editorStore.historyIndex - cut);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEditorKeydown);
});
</script>
