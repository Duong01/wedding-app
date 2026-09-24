<template>
  <div class="royal-red" :data-theme="theme.Name" :style="themeStyle">

    <!-- =====================================================
         MÀN HÌNH MỞ THIỆP
    ====================================================== -->

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :guest-name="guestName"
      :monogram="monogram"
      :date-label="openDateLabel"
      :sections="sections"
      @open="handleOpen"
    />

    <main v-else class="royal-invitation">

      <!-- =================================================
           NỀN HOA VĂN
      ================================================== -->

      <div class="rr-texture" aria-hidden="true"></div>

      <div class="rr-blooms" aria-hidden="true">
        <img
          v-for="bloom in blooms"
          :key="bloom.id"
          :src="bloom.src"
          class="rr-bloom"
          :class="bloom.side"
          :style="{ top: bloom.top }"
          alt=""
        />
      </div>

      <div class="rr-content">

        <!-- ===============================================
             HERO
        ================================================ -->

        <section v-if="showHero" class="rr-section rr-section--hero">
          <WeddingHero
            :wedding="wedding"
            :monogram="monogram"
            :date-label="heroDateLabel"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             THÔNG TIN LỄ CƯỚI
        ================================================ -->

        <section v-if="showCouple" class="rr-section">
          <WeddingCouple
            :wedding="wedding"
            :guest-name="guestName"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             ALBUM ẢNH
        ================================================ -->

        <section v-if="showGallery && gallery.length" class="rr-section">
          <WeddingGallery :gallery="gallery" :sections="sections" />
        </section>

        <!-- ===============================================
             THÔNG TIN TIỆC CƯỚI
        ================================================ -->

        <section v-if="showEvents && events.length" class="rr-section">
          <WeddingEvents
            :events="events"
            :recipient-name="wedding?.recipientName"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             ĐẾM NGƯỢC
        ================================================ -->

        <section v-if="showCountdown" class="rr-section">
          <WeddingCountdown
            :countdown="wedding?.countdown"
            :wedding-date="wedding?.weddingDate"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             ĐỊA ĐIỂM
        ================================================ -->

        <section v-if="showMap && events.length" class="rr-section">
          <WeddingMap :events="events" :sections="sections" />
        </section>

        <!-- ===============================================
             LỊCH TRÌNH NGÀY CƯỚI
        ================================================ -->

        <section v-if="showTimeline && timeline.length" class="rr-section">
          <Timeline
            :timeline="timeline"
            :events="events"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             CHUYỆN TÌNH YÊU
        ================================================ -->

        <section v-if="showStory && wedding?.story" class="rr-section">
          <WeddingStory :story="wedding.story" :sections="sections" />
        </section>

        <!-- ===============================================
             SỔ LƯU BÚT
        ================================================ -->

        <section v-if="showGuestBook" class="rr-section">
          <WeddingWishes
            :wishes="wishes"
            :wedding="wedding"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             HỘP QUÀ MỪNG
        ================================================ -->

        <section v-if="showGift && gifts.length" class="rr-section">
          <WeddingGifts
            :gifts="gifts"
            :wedding="wedding"
            :sections="sections"
          />
        </section>

      </div>

      <!-- =================================================
           CHÂN THIỆP
      ================================================== -->

      <WeddingFooter
        v-if="showFooter"
        :wedding="wedding"
        :monogram="monogram"
        :current-year="currentYear"
        :sections="sections"
      />

    </main>

    <!-- =====================================================
         NHẠC NỀN
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

import OpeningScreen from "@/page/RoyalRed/OpeningScreen.vue";
import WeddingHero from "@/page/RoyalRed/WeddingHero.vue";
import WeddingCouple from "@/page/RoyalRed/WeddingCouple.vue";
import WeddingStory from "@/page/RoyalRed/WeddingStory.vue";
import WeddingEvents from "@/page/RoyalRed/WeddingEvents.vue";
import WeddingCountdown from "@/page/RoyalRed/WeddingCountdown.vue";
import WeddingGallery from "@/page/RoyalRed/WeddingGallery.vue";
import WeddingMap from "@/page/RoyalRed/WeddingMap.vue";
import Timeline from "@/page/RoyalRed/Timeline.vue";
import WeddingGifts from "@/page/RoyalRed/WeddingGifts.vue";
import WeddingWishes from "@/page/RoyalRed/WeddingWishes.vue";
import WeddingFooter from "@/page/RoyalRed/WeddingFooter.vue";

import { flower } from "@/page/RoyalRed/royalRedAssets";


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

const wedding = computed(() => props.wedding || {});

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
   NỀN HOA
   Mẫu gốc rải hoa so le hai bên suốt chiều dài thiệp.
========================================================== */

const blooms = [
  { id: 1, src: flower, side: "is-left", top: "8%" },
  { id: 2, src: flower, side: "is-right", top: "20%" },
  { id: 3, src: flower, side: "is-left", top: "34%" },
  { id: 4, src: flower, side: "is-right", top: "46%" },
  { id: 5, src: flower, side: "is-left", top: "60%" },
  { id: 6, src: flower, side: "is-right", top: "72%" },
  { id: 7, src: flower, side: "is-left", top: "86%" },
];


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
   TIÊU ĐỀ MỤC
========================================================== */

const sections = computed(() => wedding.value?.sections || {});


/* ==========================================================
   SETTINGS
========================================================== */

const settings = computed(() => wedding.value?.settings || {});

const showHero = computed(() => settings.value.ShowHero !== false);

const showCouple = computed(() => settings.value.ShowCouple !== false);

const showStory = computed(() => settings.value.ShowStory !== false);

const showEvents = computed(() => settings.value.ShowEvents !== false);

const showTimeline = computed(() => settings.value.ShowTimeline !== false);

const showCountdown = computed(() => settings.value.ShowCountdown === true);

const showGallery = computed(() => settings.value.ShowGallery === true);

const showMap = computed(() => settings.value.ShowMap === true);

const showGift = computed(() => settings.value.ShowGift === true);

const showGuestBook = computed(() => settings.value.ShowGuestBook === true);

const showFooter = computed(() => settings.value.ShowFooter !== false);

const showMusic = computed(
  () =>
    wedding.value?.music?.Enabled === true &&
    settings.value.ShowMusic === true
);


/* ==========================================================
   NGƯỜI ĐƯỢC MỜI
========================================================== */

/*
 * recipientName từ API là mảng [{ Token, Name }]
 * (GetWeddingByToken) — lấy tên khách đầu tiên.
 */
const guestName = computed(
  () =>
    (Array.isArray(wedding.value?.recipientName)
      ? wedding.value.recipientName[0]?.Name
      : wedding.value?.recipientName?.Name) ||
    wedding.value?.guestName ||
    "Quý khách"
);


/* ==========================================================
   MONOGRAM
========================================================== */

const monogram = computed(() => {
  const groom = (
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    "G"
  )
    .trim()
    .charAt(0);

  const bride = (
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    "B"
  )
    .trim()
    .charAt(0);

  return `${groom}&${bride}`.toUpperCase();
});


/* ==========================================================
   NGÀY
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
   MỞ THIỆP
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


<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600&family=Pattaya&family=Great+Vibes&display=swap");
</style>


<style scoped>
/* ==========================================================
   ROYAL RED
   Bảng màu lấy từ wedding.theme.Colors (ThemePanel),
   fallback về tông đỏ của mẫu gốc.
========================================================== */

.royal-red {
  --rr-red: var(--primary, #5c080c);
  --rr-red-deep: var(--secondary, #8c171b);
  --rr-cream: var(--background, #f4eee2);
  --rr-cream-2: var(--background-secondary, #e7decd);
  --rr-gold: var(--accent, #d0a85c);
  --rr-gold-light: var(--accent-light, #f4dca5);
  --rr-text: var(--text, #49352d);
  --rr-text-soft: var(--text-secondary, #79645a);
  --rr-white: var(--white, #fff9ed);

  --rr-hairline: color-mix(in srgb, var(--rr-red) 27%, transparent);
  --rr-hairline-soft: color-mix(in srgb, var(--rr-red) 13%, transparent);

  --rr-font-heading: var(
    --font-heading,
    "Times New Roman",
    Times,
    serif
  );
  --rr-font-body: var(
    --font-main,
    Baskerville,
    "Times New Roman",
    serif
  );
  --rr-font-name: "EB Garamond", var(--font-main, serif);
  --rr-font-hero: "Playfair Display", var(--font-heading, serif);
  --rr-font-script: var(--font-script, "Great Vibes", cursive);
  --rr-font-guestbook: "Pattaya", cursive;

  width: 100%;
  min-height: 100vh;

  overflow-x: hidden;

  background-color: var(--rr-cream);
  color: var(--rr-red);

  font-family: var(--rr-font-body);

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.royal-red *,
.royal-red *::before,
.royal-red *::after {
  box-sizing: border-box;
}

.royal-red img {
  display: block;
  max-width: 100%;
}

.royal-red button,
.royal-red input,
.royal-red textarea {
  font: inherit;
}


/* ==========================================================
   KHUNG THIỆP
========================================================== */

.royal-invitation {
  position: relative;
  isolation: isolate;

  width: min(480px, 100%);
  min-height: 100vh;

  margin: 0 auto;

  overflow-x: clip;

  background-color: var(--rr-cream);
}


/* ==========================================================
   NỀN HOA VĂN
========================================================== */

.rr-texture {
  position: absolute;
  inset: 0;

  z-index: 0;

  pointer-events: none;

  background-image: url("/src/assets/royal-red/background.webp");
  background-repeat: repeat-y;
  background-position: center top;
  background-size: 100% auto;

  opacity: 0.3;
}

.rr-blooms {
  position: absolute;
  inset: 0;

  z-index: 1;

  overflow: hidden;

  pointer-events: none;
}

.rr-bloom {
  position: absolute;

  width: 46%;
  height: auto;

  object-fit: contain;

  opacity: 0.1;
}

.rr-bloom.is-left {
  left: -12%;

  transform: rotate(18deg);
}

.rr-bloom.is-right {
  right: -12%;

  transform: scaleX(-1) rotate(-18deg);
}


/* ==========================================================
   NỘI DUNG
========================================================== */

.rr-content {
  position: relative;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  padding: 0 0 40px;
}

.rr-section {
  position: relative;
  z-index: 3;

  width: 100%;
}

.rr-section--hero {
  padding: 0;
}


/* ==========================================================
   TIÊU ĐỀ DÙNG CHUNG
========================================================== */

.royal-red :deep(.rr-title) {
  margin: 0;

  color: var(--rr-red);

  font-family: var(--rr-font-heading);
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;
  line-height: 1.3;
  text-align: center;
  text-transform: uppercase;
}

.royal-red :deep(.rr-kicker) {
  margin: 0 0 6px;

  color: var(--rr-red);

  font-family: var(--rr-font-body);
  font-size: 12px;
  font-weight: 400;

  letter-spacing: 0.2em;
  line-height: 1.4;
  text-align: center;
  text-transform: uppercase;

  opacity: 0.75;
}

.royal-red :deep(.rr-lead) {
  margin: 8px 0 0;

  color: var(--rr-red);

  font-family: var(--rr-font-body);
  font-size: 14px;

  line-height: 1.7;
  text-align: center;

  opacity: 0.8;
}

.royal-red :deep(.rr-pill) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 40px;

  padding: 0 18px;

  border: none;
  border-radius: 10px;

  background-color: var(--rr-red);
  color: #ffffff;

  font-family: var(--rr-font-body);
  font-size: 14px;
  font-weight: 600;

  letter-spacing: 0.05em;

  cursor: pointer;

  transition: transform 0.25s ease, opacity 0.25s ease;
}

.royal-red :deep(.rr-pill:hover:not(:disabled)) {
  transform: scale(1.03);
}

.royal-red :deep(.rr-pill:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.royal-red :deep(.rr-link) {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: var(--rr-red);

  font-family: var(--rr-font-body);
  font-size: 14px;

  letter-spacing: 0.05em;

  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;

  transition: opacity 0.2s ease;
}

.royal-red :deep(.rr-link:hover) {
  opacity: 0.7;
}


/* ==========================================================
   TABLET / DESKTOP
========================================================== */

@media (min-width: 768px) {
  .royal-invitation {
    width: min(900px, 100%);

    border-left: 1px solid var(--rr-hairline-soft);
    border-right: 1px solid var(--rr-hairline-soft);
  }

  .rr-content {
    gap: 56px;

    padding-bottom: 56px;
  }

  .royal-red :deep(.rr-title) {
    font-size: 24px;
  }

  .royal-red :deep(.rr-kicker) {
    font-size: 13px;
  }

  .royal-red :deep(.rr-lead) {
    font-size: 15px;
  }

  .royal-red :deep(.rr-pill) {
    min-height: 44px;

    font-size: 16px;
  }
}


/* ==========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================== */

@media (prefers-reduced-motion: reduce) {
  .royal-red *,
  .royal-red *::before,
  .royal-red *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
