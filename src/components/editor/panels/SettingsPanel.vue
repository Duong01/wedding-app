<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> DISPLAY SETTINGS </span>

        <h1>{{ $t('editor.menu.settings') }}</h1>

        <p>{{ $t('settingsPanel.desc') }}</p>
      </div>
    </div>

    <div class="settings-toolbar">
      <span>
        <i18n-t keypath="settingsPanel.enabledCount" tag="span">
          <template #on>
            <strong>{{ enabledCount }}</strong>
          </template>
          <template #total>{{ SETTINGS_ORDER.length }}</template>
        </i18n-t>
      </span>

      <div class="settings-toolbar-actions">
        <button type="button" class="toolbar-btn" @click="toggleAll(true)">
          {{ $t('settingsPanel.allOn') }}
        </button>

        <button type="button" class="toolbar-btn" @click="toggleAll(false)">
          {{ $t('settingsPanel.allOff') }}
        </button>
      </div>
    </div>

    <div class="settings-grid">
      <div
        v-for="key in SETTINGS_ORDER"
        :key="key"
        class="setting-item"
      >
        <div class="setting-info">
          <div class="setting-icon">
            <v-icon size="17">
              {{ settingMeta(key)?.icon || "mdi-eye-outline" }}
            </v-icon>
          </div>

          <div>
            <strong>
              {{ settingMeta(key)?.label || key }}
            </strong>

            <small>
              {{ settingMeta(key)?.description || "" }}
            </small>
          </div>
        </div>

        <v-switch
          v-model="settings[key]"
          color="primary"
          hide-details
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n();

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Metadata cho từng flag ShowX trong wedding.settings.
 * (Trước đây template gọi settingIcon/settingLabel/
 * settingDescription nhưng các hàm không tồn tại → lỗi runtime.)
 */
const SETTINGS_META = {
  ShowHero: {
    icon: "mdi-image-outline",
    get label() { return t("editor.menu.hero"); },
    get description() { return t("settingsPanel.heroDesc"); },
  },
  ShowCouple: {
    icon: "mdi-heart-outline",
    get label() { return t("editor.menu.couple"); },
    get description() { return t("settingsPanel.coupleDesc"); },
  },
  ShowStory: {
    icon: "mdi-book-heart-outline",
    get label() { return t("editor.menu.story"); },
    get description() { return t("settingsPanel.storyDesc"); },
  },
  ShowVideo: {
    icon: "mdi-play-circle-outline",
    get label() { return t("editor.menu.video"); },
    get description() { return t("settingsPanel.videoDesc"); },
  },
  ShowEvents: {
    icon: "mdi-calendar-heart-outline",
    get label() { return t("editor.menu.events"); },
    get description() { return t("settingsPanel.eventsDesc"); },
  },
  ShowDressCode: {
    icon: "mdi-tshirt-crew-outline",
    get label() { return t("editor.menu.dressCode"); },
    get description() { return t("settingsPanel.dressDesc"); },
  },
  ShowTimeline: {
    icon: "mdi-timeline-outline",
    label: "Timeline",
    get description() { return t("settingsPanel.timelineDesc"); },
  },
  ShowCountdown: {
    icon: "mdi-timer-outline",
    get label() { return t("editor.menu.countdown"); },
    get description() { return t("settingsPanel.countdownDesc"); },
  },
  ShowGallery: {
    icon: "mdi-image-multiple-outline",
    get label() { return t("editor.menu.gallery"); },
    get description() { return t("settingsPanel.galleryDesc"); },
  },
  ShowGame: {
    icon: "mdi-party-popper",
    get label() { return t("editor.menu.game"); },
    get description() { return t("settingsPanel.gameDesc"); },
  },
  ShowMap: {
    icon: "mdi-map-marker-outline",
    get label() { return t("settingsPanel.map"); },
    get description() { return t("settingsPanel.mapDesc"); },
  },
  ShowGift: {
    icon: "mdi-gift-outline",
    get label() { return t("editor.menu.gifts"); },
    get description() { return t("settingsPanel.giftsDesc"); },
  },
  ShowGuestBook: {
    icon: "mdi-message-heart-outline",
    get label() { return t("editor.menu.guestbook"); },
    get description() { return t("settingsPanel.guestbookDesc"); },
  },
  ShowMusic: {
    icon: "mdi-music-outline",
    get label() { return t("editor.menu.music"); },
    get description() { return t("settingsPanel.musicDesc"); },
  },
  ShowFooter: {
    icon: "mdi-page-layout-footer",
    label: "Footer",
    get description() { return t("settingsPanel.footerDesc"); },
  },
  ShowSeasonFx: {
    icon: "mdi-weather-snowy-rainy",
    get label() { return t("settingsPanel.seasonFx"); },
    get description() { return t("settingsPanel.seasonFxDesc"); },
  },
  AutoScroll: {
    icon: "mdi-arrow-down-bold-circle-outline",
    get label() { return t("settingsPanel.autoScroll"); },
    get description() { return t("settingsPanel.autoScrollDesc"); },
  },
};

/*
 * Thứ tự hiển thị mong muốn — theo đúng trình tự các
 * mục xuất hiện trên thiệp, không phụ thuộc thứ tự key
 * trong object (dữ liệu cũ có thể thiếu/thừa key).
 */
const SETTINGS_ORDER = Object.keys(SETTINGS_META);

/*
 * Cờ mới mặc định TẮT. Nếu ép mọi cờ thiếu thành true
 * thì thiệp cũ vừa mở editor đã tự bật video/game (dù
 * chưa có nội dung) — và tệ hơn là ghi giá trị đó
 * ngược lại DB khi save.
 */
const SETTINGS_DEFAULTS = {
  ShowVideo: false,
  ShowGame: false,
};

/*
 * Dữ liệu cũ có thể chưa có ShowDressCode → bổ sung
 * mặc định để switch hiển thị và ghi được giá trị.
 */
const settings = computed(() => {
  const data = props.wedding.settings;

  if (!data || typeof data !== "object") {
    props.wedding.settings = {};
  }

  SETTINGS_ORDER.forEach((key) => {
    if (typeof props.wedding.settings[key] !== "boolean") {
      props.wedding.settings[key] = SETTINGS_DEFAULTS[key] ?? true;
    }
  });

  return props.wedding.settings;
});

/*
 * Số mục đang bật / tổng số — giúp người dùng biết
 * ngay mình đã tắt bao nhiêu phần.
 */
const enabledCount = computed(
  () => SETTINGS_ORDER.filter((key) => settings.value[key]).length
);

function settingMeta(key) {
  return SETTINGS_META[key];
}

function toggleAll(value) {
  SETTINGS_ORDER.forEach((key) => {
    props.wedding.settings[key] = value;
  });
}
</script>

<style scoped>
.settings-toolbar {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 14px;

  margin-bottom: 16px;

  padding: 11px 14px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 12px;

  background: #fffdfb;
}

.settings-toolbar span {
  color: #8a7a68;

  font-size: 11.5px;
}

.settings-toolbar strong {
  color: #3a2c26;
}

.settings-toolbar-actions {
  display: flex;

  gap: 7px;
}

.toolbar-btn {
  height: 30px;

  padding: 0 12px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 8px;

  background: #fffdfb;

  color: #6b5a4e;

  font-family: inherit;
  font-size: 11px;
  font-weight: 650;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.toolbar-btn:hover {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}
</style>
