<template>
  <div ref="rootRef" class="baroque" :data-theme="theme.Name" :style="themeStyle">
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

    <main v-else class="bq-invitation">
      <!-- HOA VĂN NỀN LẶP LẠI -->
      <div
        class="bq-invitation__bg"
        aria-hidden="true"
        :style="{ backgroundImage: `url(${background})` }"
      ></div>

      <div class="bq-invitation__inner">
        <!-- ============ HERO ============ -->

        <WeddingHero
          v-if="showHero"
          :wedding="wedding"
          :monogram="monogram"
          :date-label="heroDateLabel"
          :event="primaryEvent"
          :guest-name="guestName"
        />

        <!-- ============ THÔNG TIN LỄ CƯỚI ============ -->

        <WeddingCouple v-if="showCouple" :wedding="wedding" :guest-name="guestName" />

        <!-- ============ CHUYỆN TÌNH YÊU ============ -->

        <WeddingStory v-if="showStory && wedding?.story" :story="wedding.story" />

        <!-- ============ ALBUM ẢNH ============ -->

        <WeddingGallery v-if="showGallery && gallery.length" :gallery="gallery" />

        <!-- ============ THÔNG TIN TIỆC CƯỚI ============ -->

        <WeddingEvents
          v-if="showEvents && events.length"
          :events="events"
          :recipient-name="wedding?.recipientName"
        />

        <!-- ============ ĐẾM NGƯỢC ============ -->

        <WeddingCountdown
          v-if="showCountdown"
          :countdown="countdownTarget"
          :wedding-date="wedding?.weddingDate"
        />

        <!-- ============ BẢN ĐỒ ============ -->

        <WeddingMap v-if="showMap && events.length" :events="events" />

        <!-- ============ DRESS CODE ============ -->

        <DressCode v-if="showDressCode" :dress-code="wedding?.dressCode" />

        <!-- ============ LỊCH TRÌNH NGÀY CƯỚI ============ -->

        <Timeline v-if="showTimeline && timeline.length" :timeline="timeline" :events="events" />

        <!-- ============ SỔ LƯU BÚT ============ -->

        <WeddingWishes v-if="showGuestBook" :wishes="wishes" :wedding="wedding" />

        <!-- ============ HỘP QUÀ MỪNG ============ -->

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

import OpeningScreen from "@/page/BohoTerracotta/OpeningScreen.vue";
import WeddingHero from "@/page/BohoTerracotta/WeddingHero.vue";
import WeddingCouple from "@/page/BohoTerracotta/WeddingCouple.vue";
import WeddingStory from "@/page/BohoTerracotta/WeddingStory.vue";
import WeddingGallery from "@/page/BohoTerracotta/WeddingGallery.vue";
import WeddingEvents from "@/page/BohoTerracotta/WeddingEvents.vue";
import WeddingCountdown from "@/page/BohoTerracotta/WeddingCountdown.vue";
import WeddingMap from "@/page/BohoTerracotta/WeddingMap.vue";
import DressCode from "@/page/BohoTerracotta/DressCode.vue";
import Timeline from "@/page/BohoTerracotta/Timeline.vue";
import WeddingWishes from "@/page/BohoTerracotta/WeddingWishes.vue";
import WeddingGifts from "@/page/BohoTerracotta/WeddingGifts.vue";
import WeddingFooter from "@/page/BohoTerracotta/WeddingFooter.vue";

import { useWeddingTheme } from "@/composables/useWeddingTheme";

import { background } from "@/page/BohoTerracotta/bohoTerracottaAssets";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
});

const { theme, themeStyle } = useWeddingTheme(props.wedding);

const wedding = computed(() => props.wedding || {});

/* =========================================================
   TRẠNG THÁI
========================================================= */

const opened = ref(false);

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
const showDressCode = computed(() => settings.value.ShowDressCode === true);
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
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    "";

  const bride =
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    "";

  const left = groom.trim().charAt(0);
  const right = bride.trim().charAt(0);

  if (!left && !right) return "&";

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
   theme nên không thừa hưởng biến --bq-* khai báo ở .baroque.
   Chép sang <body> để chúng vẫn đúng màu.
========================================================= */

const BODY_VARS = [
  "--bq-bg",
  "--bq-bg-2",
  "--bq-ink",
  "--bq-soft",
  "--bq-accent",
  "--bq-accent-light",
  "--bq-deep",
  "--bq-surface",
  "--bq-muted",
  "--bq-line",
  "--bq-ink-rgb",
  "--bq-soft-rgb",
  "--bq-accent-rgb",
  "--bq-bg-rgb",
  "--bq-surface-rgb",
  "--bq-deep-rgb",
];

/* Biến --bq-*-rgb dùng cho rgba() nên phải suy ra từ màu thật. */
const RGB_SOURCES = {
  "--bq-ink-rgb": "--bq-ink",
  "--bq-soft-rgb": "--bq-soft",
  "--bq-accent-rgb": "--bq-accent",
  "--bq-bg-rgb": "--bq-bg",
  "--bq-surface-rgb": "--bq-surface",
  "--bq-deep-rgb": "--bq-deep",
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

    if (value) document.body.style.setProperty(name, value);
  });

  Object.entries(RGB_SOURCES).forEach(([target, source]) => {
    const triplet = toRgbTriplet(computedStyle.getPropertyValue(source));

    if (triplet) document.body.style.setProperty(target, triplet);
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

  await nextTick();

  floatingMusicRef.value?.play?.();
}
</script>

<style scoped>
/* =========================================================
   BẢNG MÀU
   Lấy từ theme.Colors trong dữ liệu, fallback về tông
   baroque đỏ sẫm — vàng đồng.
========================================================= */

.baroque {
  --bq-bg: var(--background, #2b0303);
  --bq-bg-2: var(--background-secondary, #3a0607);
  --bq-ink: var(--text, #ffefd6);
  --bq-soft: var(--text-secondary, #e8cfa8);
  --bq-accent: var(--accent, #ffdfaf);
  --bq-accent-light: var(--accent-light, #ffe9c9);
  --bq-deep: var(--primary, #511419);
  --bq-surface: var(--white, #fff6e6);
  --bq-muted: rgba(255, 239, 214, 0.62);
  --bq-line: rgba(255, 223, 175, 0.33);

  --bq-ink-rgb: 255, 239, 214;
  --bq-soft-rgb: 232, 207, 168;
  --bq-accent-rgb: 255, 223, 175;
  --bq-bg-rgb: 43, 3, 3;
  --bq-surface-rgb: 255, 246, 230;
  --bq-deep-rgb: 81, 20, 25;

  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow-x: hidden;

  background-color: var(--bq-bg);
  color: var(--bq-ink);

  font-family: "Libre Baskerville", "Baskerville", "Times New Roman", serif;

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* =========================================================
   KHUNG THIỆP
========================================================= */

.bq-invitation {
  position: relative;
  isolation: isolate;

  width: 100%;
  max-width: 480px;

  margin: 0 auto;

  overflow: hidden;
}

/* Hoa văn nền lặp lại — ảnh gán qua inline style */
.bq-invitation__bg {
  position: absolute;
  inset: 0;
  z-index: 0;

  background-size: 100% auto;
  background-repeat: repeat;
  background-position: top left;

  opacity: 0.65;

  pointer-events: none;
}

.bq-invitation__inner {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 23px;

  padding: 34px 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-invitation {
    max-width: 900px;

    border-left: 1px solid var(--bq-line);
    border-right: 1px solid var(--bq-line);
  }

  .bq-invitation__inner {
    gap: 30px;

    padding: 44px 0;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bq-invitation * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
</style>
