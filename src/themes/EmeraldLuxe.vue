<template>
  <div ref="rootRef" class="chipi-red" :data-theme="theme.Name" :style="themeStyle">
    <!-- =====================================================
         MÀN HÌNH MỞ THIỆP
    ====================================================== -->

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <!-- =====================================================
         THIỆP
    ====================================================== -->

    <main v-else class="cr-invitation">
      <!-- HOA VĂN CHÌM TOÀN THIỆP -->
      <div class="cr-invitation__pattern" aria-hidden="true"></div>

      <!-- ============ HERO ============ -->

      <WeddingHero
        v-if="showHero"
        :wedding="wedding"
        :monogram="monogram"
        :date-label="heroDateLabel"
        :event="primaryEvent"
        :guest-name="guestName"
      />

      <!-- ============ NỘI DUNG ============ -->

      <div class="cr-invitation__body">
        <WeddingCouple v-if="showCouple" :wedding="wedding" :guest-name="guestName" />

        <WeddingStory v-if="showStory && wedding?.story" :story="wedding.story" />

        <WeddingGallery v-if="showGallery && gallery.length" :gallery="gallery" />

        <WeddingEvents
          v-if="showEvents && events.length"
          :events="events"
          :recipient-name="wedding?.recipientName"
        />

        <WeddingMap v-if="showMap && events.length" :events="events" />

        <Timeline v-if="showTimeline && timeline.length" :timeline="timeline" :events="events" />

        <WeddingCountdown
          v-if="showCountdown"
          :countdown="countdownTarget"
          :wedding-date="wedding?.weddingDate"
        />

        <WeddingWishes v-if="showGuestBook" :wishes="wishes" :wedding="wedding" />

        <WeddingGifts v-if="showGift && gifts.length" :gifts="gifts" />
      </div>

      <!-- ============ FOOTER ============ -->

      <WeddingFooter
        v-if="showFooter"
        :wedding="wedding"
        :monogram="monogram"
        :current-year="currentYear"
      />

      <!-- ============ NHẠC ============ -->

      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="heroMusic" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

import dayjs from "dayjs";

import FloatingMusic from "@/components/common/FloatingMusic.vue";

import OpeningScreen from "@/page/EmeraldLuxe/OpeningScreen.vue";
import WeddingHero from "@/page/EmeraldLuxe/WeddingHero.vue";
import WeddingCouple from "@/page/EmeraldLuxe/WeddingCouple.vue";
import WeddingStory from "@/page/EmeraldLuxe/WeddingStory.vue";
import WeddingGallery from "@/page/EmeraldLuxe/WeddingGallery.vue";
import WeddingEvents from "@/page/EmeraldLuxe/WeddingEvents.vue";
import WeddingMap from "@/page/EmeraldLuxe/WeddingMap.vue";
import Timeline from "@/page/EmeraldLuxe/Timeline.vue";
import WeddingCountdown from "@/page/EmeraldLuxe/WeddingCountdown.vue";
import WeddingWishes from "@/page/EmeraldLuxe/WeddingWishes.vue";
import WeddingGifts from "@/page/EmeraldLuxe/WeddingGifts.vue";
import WeddingFooter from "@/page/EmeraldLuxe/WeddingFooter.vue";

import { useWeddingTheme } from "@/composables/useWeddingTheme";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
  startOpened: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["open"]);

const { theme, themeStyle } = useWeddingTheme(props.wedding);

const wedding = computed(() => props.wedding || {});

/* =========================================================
   TRẠNG THÁI
========================================================= */

const opened = ref(props.startOpened);

const floatingMusicRef = ref(null);

const rootRef = ref(null);

/* =========================================================
   DỮ LIỆU
========================================================= */

const events = computed(() =>
  Array.isArray(wedding.value?.events) ? wedding.value.events : []
);

const primaryEvent = computed(() => events.value[0] || {});

const timeline = computed(() =>
  Array.isArray(wedding.value?.timeline) ? wedding.value.timeline : []
);

const gallery = computed(() =>
  Array.isArray(wedding.value?.gallery) ? wedding.value.gallery : []
);

const gifts = computed(() =>
  Array.isArray(wedding.value?.gifts) ? wedding.value.gifts : []
);

const wishes = computed(() =>
  Array.isArray(wedding.value?.guestBook?.Guest) ? wedding.value.guestBook.Guest : []
);

const settings = computed(() => wedding.value?.settings || {});

/* =========================================================
   CỜ HIỂN THỊ
========================================================= */

const showHero = computed(() => settings.value.ShowHero !== false);
const showCouple = computed(() => settings.value.ShowCouple !== false);
const showStory = computed(() => settings.value.ShowStory !== false);
const showEvents = computed(() => settings.value.ShowEvents !== false);
const showTimeline = computed(() => settings.value.ShowTimeline !== false);
const showFooter = computed(() => settings.value.ShowFooter !== false);

const showCountdown = computed(() => settings.value.ShowCountdown === true);
const showGallery = computed(() => settings.value.ShowGallery === true);
const showMap = computed(() => settings.value.ShowMap === true);
const showGift = computed(() => settings.value.ShowGift === true);
const showGuestBook = computed(() => settings.value.ShowGuestBook === true);

const showMusic = computed(
  () => wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true
);

/* =========================================================
   TÊN KHÁCH MỜI
   recipientName từ API có thể là mảng [{ Token, Name }] hoặc object.
========================================================= */

const guestName = computed(
  () =>
    (Array.isArray(wedding.value?.recipientName)
      ? wedding.value.recipientName[0]?.Name
      : wedding.value?.recipientName?.Name) ||
    wedding.value?.guestName ||
    "Quý khách"
);

/* =========================================================
   MONOGRAM
========================================================= */

const monogram = computed(() => {
  const groom =
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.couple?.Groom?.Name ||
    "";

  const bride =
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.couple?.Bride?.Name ||
    "";

  const left = groom.trim().charAt(0);
  const right = bride.trim().charAt(0);

  if (!left && !right) return "囍";

  return `${left}&${right}`.toUpperCase();
});

/* =========================================================
   NGÀY
========================================================= */

function formatDate(date) {
  const value = dayjs(date);

  return value.isValid() ? value.format("DD · MM · YYYY") : "";
}

const openDateLabel = computed(() => formatDate(wedding.value?.weddingDate));

const heroDateLabel = computed(() => {
  const raw = primaryEvent.value?.EventDate || wedding.value?.weddingDate;

  const value = dayjs(raw);

  if (!value.isValid()) return "";

  const weekdays = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY",
  ];

  return `${weekdays[value.day()]}, ${value.format("DD/MM/YYYY")}`;
});

/* =========================================================
   ĐẾM NGƯỢC
========================================================= */

const countdownTarget = computed(
  () => wedding.value?.countdown?.Target || wedding.value?.weddingDate || ""
);

/* =========================================================
   NHẠC
   Ưu tiên wedding.music, fallback hero.Music.
========================================================= */

const heroMusic = computed(() => {
  const music = wedding.value?.music || {};

  const heroUrl = wedding.value?.hero?.Music;

  if (music.Url || !heroUrl) {
    return music;
  }

  return { ...music, Url: heroUrl };
});

/* =========================================================
   NĂM HIỆN TẠI
========================================================= */

const currentYear = new Date().getFullYear();

/* =========================================================
   BIẾN MÀU RA <body>
   Modal xác nhận / hộp quà được Teleport ra ngoài cây DOM của
   theme nên không thừa hưởng biến --cr-* khai báo ở .chipi-red.
   Chép sang <body> để chúng vẫn đúng màu.
========================================================= */

const BODY_VARS = [
  "--cr-bg",
  "--cr-bg-2",
  "--cr-ink",
  "--cr-soft",
  "--cr-accent",
  "--cr-accent-light",
  "--cr-surface",
  "--cr-muted",
  "--cr-line",
  "--cr-ink-rgb",
  "--cr-soft-rgb",
  "--cr-accent-rgb",
  "--cr-bg-rgb",
  "--cr-surface-rgb",
];

/* Biến --cr-*-rgb dùng cho rgba() nên phải suy ra từ màu thật. */
const RGB_SOURCES = {
  "--cr-ink-rgb": "--cr-ink",
  "--cr-soft-rgb": "--cr-soft",
  "--cr-accent-rgb": "--cr-accent",
  "--cr-bg-rgb": "--cr-bg",
  "--cr-surface-rgb": "--cr-surface",
};

function toRgbTriplet(value) {
  const hex = String(value || "").trim().replace("#", "");

  if (!/^[0-9a-f]{6}$/i.test(hex)) return "";

  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ");
}

function syncBodyVars() {
  const root = rootRef.value;

  if (!root) return;

  const computedStyle = window.getComputedStyle(root);

  BODY_VARS.forEach((name) => {
    const value = computedStyle.getPropertyValue(name).trim();

    if (value) {
      document.body.style.setProperty(name, value);
    }
  });

  Object.entries(RGB_SOURCES).forEach(([target, source]) => {
    const triplet = toRgbTriplet(computedStyle.getPropertyValue(source));

    if (triplet) {
      document.body.style.setProperty(target, triplet);
    }
  });
}

function clearBodyVars() {
  BODY_VARS.forEach((name) => document.body.style.removeProperty(name));
}

onMounted(syncBodyVars);

watch(themeStyle, () => nextTick(syncBodyVars), { deep: true });

onBeforeUnmount(clearBodyVars);

/* =========================================================
   MỞ THIỆP
========================================================= */

async function handleOpen() {
  opened.value = true;

  emit("open");

  await nextTick();

  floatingMusicRef.value?.play?.();
}

/*
 * Vào thẳng nội dung (bước 3 /open → /view): theme mount lại
 * từ đầu nên handleOpen của bước 2 không còn — phải tự phát
 * nhạc tại đây, nếu không bước 3 im lặng.
 */
onMounted(() => {
  if (props.startOpened) {
    floatingMusicRef.value?.play?.();
  }
});

</script>

<style scoped>
/* =========================================================
   TRANG
========================================================= */

.chipi-red {
  /*
   * Bảng màu lấy từ theme.Colors của thiệp (xem useWeddingTheme),
   * fallback về tông "chibi đỏ" khi dữ liệu chưa có.
   * Các biến --cr-*-rgb dùng cho những chỗ cần độ trong suốt.
   */
  --cr-bg: var(--background, #fef0e0);
  --cr-bg-2: var(--background-secondary, #f7e6cd);
  --cr-ink: var(--primary, #4c2d1f);
  --cr-soft: var(--text-secondary, #624537);
  --cr-accent: var(--accent, #e1c490);
  --cr-accent-light: var(--accent-light, #f3ddb8);
  --cr-surface: var(--white, #fffaf2);
  --cr-muted: #a98a5c;
  --cr-line: rgba(76, 45, 31, 0.22);

  --cr-ink-rgb: 76, 45, 31;
  --cr-soft-rgb: 98, 69, 55;
  --cr-accent-rgb: 225, 196, 144;
  --cr-bg-rgb: 254, 240, 224;
  --cr-surface-rgb: 255, 250, 242;

  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow-x: hidden;

  background-color: var(--cr-bg);

  color: var(--cr-ink);

  font-family: "Be Vietnam Pro", "Segoe UI", sans-serif;

  -webkit-font-smoothing: antialiased;

  text-rendering: optimizeLegibility;
}

/* =========================================================
   KHUNG THIỆP
========================================================= */

.cr-invitation {
  position: relative;

  width: 100%;
  max-width: 480px;

  min-height: 100dvh;

  margin: 0 auto;

  padding: 0 15px;

  box-sizing: border-box;

  overflow: hidden;

  background-color: var(--cr-bg);

  color: var(--cr-ink);
}

/* =========================================================
   HOA VĂN CHÌM
========================================================= */

.cr-invitation__pattern {
  position: absolute;

  inset: 0;

  z-index: 0;

  pointer-events: none;

  opacity: 0.5;

  background-image: radial-gradient(rgba(var(--cr-accent-rgb), 0.55) 1px, transparent 1px);

  background-size: 22px 22px;
}

/* =========================================================
   THÂN THIỆP
========================================================= */

.cr-invitation__body {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  gap: 34px;

  padding: 30px 0 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .cr-invitation {
    max-width: 900px;

    padding: 0 24px;

    border-left: 1px solid var(--cr-line);
    border-right: 1px solid var(--cr-line);
  }

  .cr-invitation__body {
    gap: 48px;

    padding-top: 40px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .chipi-red *,
  .chipi-red *::before,
  .chipi-red *::after {
    animation-duration: 0.01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: 0.01ms !important;
  }
}
</style>
