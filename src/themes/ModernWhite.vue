<template>
  <div class="mw-theme" :data-theme="theme.Name" :style="themeStyle">

    <!-- =====================================================
         OPENING
    ====================================================== -->

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <main v-else class="mw-invitation">

      <!-- =================================================
           NỀN HOA VƯỜN
      ================================================== -->

      <div class="mw-bg mw-bg--top" aria-hidden="true"></div>
      <div class="mw-bg mw-bg--mid" aria-hidden="true"></div>
      <div class="mw-bg mw-bg--bottom" aria-hidden="true"></div>

      <div class="mw-content">

        <!-- ===============================================
             HERO
        ================================================ -->

        <section v-if="showHero" class="mw-section mw-section--hero">
          <WeddingHero
            :wedding="wedding"
            :monogram="monogram"
            :date-label="heroDateLabel"
          />
        </section>

        <!-- ===============================================
             ALBUM ẢNH
        ================================================ -->

        <section v-if="showGallery && gallery.length" class="mw-section">
          <WeddingGallery :gallery="gallery" />
        </section>

        <!-- ===============================================
             THÔNG TIN LỄ CƯỚI
        ================================================ -->

        <section v-if="showCouple" class="mw-section">
          <WeddingCouple :wedding="wedding" />
        </section>

        <!-- ===============================================
             CHUYỆN TÌNH YÊU
        ================================================ -->

        <section v-if="showStory && wedding?.story" class="mw-section">
          <WeddingStory :story="wedding.story" />
        </section>

        <!-- ===============================================
             THÔNG TIN TIỆC CƯỚI
        ================================================ -->

        <section v-if="showEvents && events.length" class="mw-section">
          <WeddingEvents
            :events="events"
            :recipient-name="wedding?.recipientName"
          />
        </section>

        <!-- ===============================================
             CÙNG ĐẾM NGƯỢC
        ================================================ -->

        <section v-if="showCountdown" class="mw-section">
          <WeddingCountdown
            :countdown="countdownTarget"
            :wedding-date="wedding?.weddingDate"
          />
        </section>

        <!-- ===============================================
             ĐỊA ĐIỂM
        ================================================ -->

        <section v-if="showMap && events.length" class="mw-section">
          <WeddingMap :events="events" />
        </section>

        <!-- ===============================================
             LỊCH TRÌNH NGÀY CƯỚI
        ================================================ -->

        <section v-if="showTimeline && timeline.length" class="mw-section">
          <Timeline :timeline="timeline" :events="events" />
        </section>

        <!-- ===============================================
             DRESS CODE
        ================================================ -->

        <section v-if="showDressCode" class="mw-section">
          <DressCode :dress-code="wedding?.dressCode" />
        </section>

        <!-- ===============================================
             SỔ LƯU BÚT
        ================================================ -->

        <section v-if="showGuestBook" class="mw-section">
          <WeddingWishes :wishes="wishes" :wedding="wedding" />
        </section>

        <!-- ===============================================
             HỘP QUÀ MỪNG
        ================================================ -->

        <section v-if="showGift && gifts.length" class="mw-section">
          <WeddingGifts :gifts="gifts" />
        </section>

      </div>

      <!-- =================================================
           FOOTER
      ================================================== -->

      <WeddingFooter
        v-if="showFooter"
        :wedding="wedding"
        :monogram="monogram"
        :current-year="currentYear"
      />

    </main>

    <!-- =====================================================
         MUSIC
    ====================================================== -->

    <FloatingMusic
      v-if="showMusic"
      ref="floatingMusicRef"
      :music="heroMusic"
    />

  </div>
</template>


<script setup>
import { computed, nextTick, ref, onMounted } from "vue";
import dayjs from "dayjs";

import FloatingMusic from "@/components/common/FloatingMusic.vue";
import { useWeddingTheme } from "@/composables/useWeddingTheme";

import OpeningScreen from "@/page/ModernWhite/OpeningScreen.vue";
import WeddingHero from "@/page/ModernWhite/WeddingHero.vue";
import WeddingCouple from "@/page/ModernWhite/WeddingCouple.vue";
import WeddingStory from "@/page/ModernWhite/WeddingStory.vue";
import WeddingEvents from "@/page/ModernWhite/WeddingEvents.vue";
import WeddingCountdown from "@/page/ModernWhite/WeddingCountdown.vue";
import WeddingGallery from "@/page/ModernWhite/WeddingGallery.vue";
import WeddingMap from "@/page/ModernWhite/WeddingMap.vue";
import Timeline from "@/page/ModernWhite/Timeline.vue";
import DressCode from "@/page/ModernWhite/DressCode.vue";
import WeddingGifts from "@/page/ModernWhite/WeddingGifts.vue";
import WeddingWishes from "@/page/ModernWhite/WeddingWishes.vue";
import WeddingFooter from "@/page/ModernWhite/WeddingFooter.vue";


/* ==========================================================
   PROPS
========================================================== */

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


/* ==========================================================
   THEME
========================================================== */

const { theme, themeStyle } = useWeddingTheme(props.wedding);


/* ==========================================================
   WEDDING
========================================================== */

const wedding = computed(() => props.wedding);

/*
 * Ưu tiên nhạc từ wedding.music (panel Nhạc).
 * Nếu trống mà hero.Music có giá trị thì dùng hero.Music.
 */
const heroMusic = computed(() => {
  const music = wedding.value?.music || {};
  const heroUrl = wedding.value?.hero?.Music;

  if (music.Url || !heroUrl) {
    return music;
  }

  return { ...music, Url: heroUrl };
});


/* ==========================================================
   STATE
========================================================== */

const opened = ref(props.startOpened);

const floatingMusicRef = ref(null);

const currentYear = new Date().getFullYear();


/* ==========================================================
   DATA
========================================================== */

const events = computed(() =>
  Array.isArray(wedding.value?.events) ? wedding.value.events : []
);

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
  Array.isArray(wedding.value?.guestBook?.Guest)
    ? wedding.value.guestBook.Guest
    : []
);


/* ==========================================================
   SETTINGS
========================================================== */

const settings = computed(() => wedding.value?.settings || {});

const showHero = computed(() => settings.value.ShowHero !== false);

const showCouple = computed(() => settings.value.ShowCouple !== false);

const showStory = computed(() => settings.value.ShowStory !== false);

const showEvents = computed(() => settings.value.ShowEvents !== false);

const showCountdown = computed(() => settings.value.ShowCountdown === true);

const showGallery = computed(() => settings.value.ShowGallery === true);

const showMap = computed(() => settings.value.ShowMap === true);

const showTimeline = computed(() => settings.value.ShowTimeline !== false);

const showDressCode = computed(() => settings.value.ShowDressCode !== false);

const showGift = computed(() => settings.value.ShowGift === true);

const showGuestBook = computed(() => settings.value.ShowGuestBook === true);

const showFooter = computed(() => settings.value.ShowFooter !== false);

const showMusic = computed(
  () =>
    wedding.value?.music?.Enabled === true &&
    settings.value.ShowMusic === true
);


/* ==========================================================
   COUNTDOWN TARGET
========================================================== */

const countdownTarget = computed(() => {
  const value = wedding.value?.countdown;

  if (value?.Date || value?.Target || value?.WeddingDate) {
    return value;
  }

  return (
    wedding.value?.weddingDate ||
    wedding.value?.hero?.WeddingDate ||
    ""
  );
});


/* ==========================================================
   MONOGRAM
========================================================== */

const monogram = computed(() => {
  const groom = (
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.couple?.Groom?.Name ||
    "G"
  )
    .trim()
    .charAt(0);

  const bride = (
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.couple?.Bride?.Name ||
    "B"
  )
    .trim()
    .charAt(0);

  return `${groom}&${bride}`.toUpperCase();
});


/* ==========================================================
   DATE
========================================================== */

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = dayjs(date);

  if (!parsed.isValid()) {
    return "";
  }

  return parsed.format("DD · MM · YYYY");
}

const openDateLabel = computed(() =>
  formatDate(wedding.value?.weddingDate || wedding.value?.hero?.WeddingDate)
);

const heroDateLabel = computed(() =>
  formatDate(wedding.value?.hero?.WeddingDate || wedding.value?.weddingDate)
);


/* ==========================================================
   OPEN
========================================================== */

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
/* ==========================================================
   MODERNWHITE — VƯỜN XUÂN BLUE
   Bảng màu lấy từ wedding.theme.Colors (ThemePanel),
   fallback về tông xanh của mẫu tham chiếu.
========================================================== */

.mw-theme {
  --mw-blue: var(--primary, #486c7d);
  --mw-blue-deep: var(--secondary, #3a5666);
  --mw-blue-soft: var(--accent, #a4c4d4);
  --mw-blue-mist: var(--accent-light, #e8f0f4);
  --mw-ink: var(--text, #3a5666);
  --mw-ink-soft: var(--text-secondary, #6b8494);
  --mw-paper: var(--white, #ffffff);
  --mw-cream: var(--background, #ffffff);
  --mw-hairline: rgba(72, 108, 125, 0.27);
  --mw-hairline-soft: rgba(72, 108, 125, 0.13);
  --mw-font-script: var(--font-script, "Pinyon Script", cursive);
  --mw-font-serif: var(
    --font-main,
    Baskerville,
    "Times New Roman",
    "Be Vietnam Pro",
    serif
  );

  width: 100%;
  min-height: 100vh;

  background-color: var(--mw-paper);
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
}

.mw-theme *,
.mw-theme *::before,
.mw-theme *::after {
  box-sizing: border-box;
}

.mw-theme img {
  display: block;
  max-width: 100%;
}

.mw-theme button,
.mw-theme input,
.mw-theme textarea {
  font: inherit;
}


/* ==========================================================
   KHUNG THIỆP
========================================================== */

.mw-invitation {
  position: relative;

  width: min(480px, 100%);
  min-height: 100vh;

  margin: 0 auto;

  overflow-x: clip;

  background-color: var(--mw-paper);
}


/* ==========================================================
   NỀN HOA VƯỜN
========================================================== */

.mw-bg {
  position: absolute;
  z-index: 1;

  pointer-events: none;

  background-repeat: no-repeat;
  background-size: contain;
}

.mw-bg--top {
  top: 0;
  left: -66%;

  width: 223%;
  height: 1040px;

  background-image: url("@/assets/vuon xuan blu/top.webp");
  background-position: left top;
}

.mw-bg--mid {
  top: 10%;
  left: 50%;

  width: 214%;
  height: 1307px;

  transform: translateX(-50%);

  background-image: url("@/assets/vuon xuan blu/mid.webp");
  background-position: center center;
}

.mw-bg--bottom {
  bottom: 0;
  left: -59%;

  width: 235%;
  height: 1435px;

  background-image: url("@/assets/vuon xuan blu/button.webp");
  background-position: left center;
}


/* ==========================================================
   NỘI DUNG
========================================================== */

.mw-content {
  position: relative;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;

  padding: 96px 16px 48px;
}

.mw-section {
  position: relative;
  z-index: 3;

  width: 100%;
}

.mw-section--hero {
  padding: 0;
}


/* ==========================================================
   TIÊU ĐỀ DÙNG CHUNG
========================================================= */

.mw-theme :deep(.mw-title) {
  margin: 0;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.05em;
  line-height: 1.4;
  text-align: center;
  text-transform: uppercase;
}

.mw-theme :deep(.mw-kicker) {
  display: block;

  margin-bottom: 6px;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 11px;
  font-weight: 400;

  letter-spacing: 0.2em;
  text-align: center;
  text-transform: uppercase;
}

.mw-theme :deep(.mw-lead) {
  max-width: 320px;

  margin: 12px auto 0;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;
  font-weight: 400;

  letter-spacing: 0.05em;
  line-height: 1.6;
  text-align: center;
}

.mw-theme :deep(.mw-pill) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 38px;

  padding: 0 24px;

  border: none;
  border-radius: 999px;

  background-color: var(--mw-blue);
  color: var(--mw-paper);

  font-family: var(--mw-font-serif);
  font-size: 14px;
  font-weight: 600;

  letter-spacing: 0.05em;

  cursor: pointer;

  transition: transform 0.25s ease, opacity 0.25s ease;
}

.mw-theme :deep(.mw-pill:hover:not(:disabled)) {
  transform: scale(1.03);
}

.mw-theme :deep(.mw-pill:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.mw-theme :deep(.mw-divider) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 14px auto 0;

  color: var(--mw-blue-soft);
}

.mw-theme :deep(.mw-divider span) {
  width: 48px;
  height: 1px;

  background-color: var(--mw-hairline);
}

.mw-theme :deep(.mw-divider i) {
  font-size: 11px;
  font-style: normal;
}


/* ==========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-invitation {
    width: min(900px, 100%);

    border-left: 1px solid var(--mw-hairline-soft);
    border-right: 1px solid var(--mw-hairline-soft);
  }

  .mw-bg--top {
    left: -35%;
    width: 119%;
  }

  .mw-bg--mid {
    width: 114%;
  }

  .mw-bg--bottom {
    left: -31%;
    width: 125%;
  }

  .mw-content {
    gap: 64px;

    padding: 128px 40px 64px;
  }

  .mw-theme :deep(.mw-title) {
    font-size: 26px;
  }

  .mw-theme :deep(.mw-kicker) {
    font-size: 13px;
  }

  .mw-theme :deep(.mw-lead) {
    max-width: 500px;

    font-size: 16px;
  }

  .mw-theme :deep(.mw-pill) {
    min-height: 42px;

    font-size: 16px;
  }
}
</style>
