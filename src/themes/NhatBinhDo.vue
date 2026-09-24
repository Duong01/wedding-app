<template>
  <div class="cfr-theme" :data-theme="theme.Name" :style="themeStyle">

    <!-- =====================================================
         OPENING
    ====================================================== -->

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      :sections="sections"
      @open="handleOpen"
    />

    <main v-else class="cfr-invitation">

      <!-- =================================================
           NỀN HOA
      ================================================== -->

      <div class="cfr-garland" aria-hidden="true">
        <img :src="flower1" alt="" />
      </div>

      <div class="cfr-blooms" aria-hidden="true">
        <img
          v-for="bloom in blooms"
          :key="bloom.id"
          :src="bloom.src"
          class="cfr-bloom"
          :class="bloom.side"
          :style="{ top: bloom.top }"
          alt=""
        />
      </div>

      <div class="cfr-content">

        <!-- ===============================================
             HERO
        ================================================ -->

        <section v-if="showHero" class="cfr-section cfr-section--hero">
          <WeddingHero
            :wedding="wedding"
            :monogram="monogram"
            :date-label="heroDateLabel"
          />
        </section>

        <!-- ===============================================
             THÔNG TIN BUỔI LỄ
        ================================================ -->

        <section v-if="showCouple" class="cfr-section">
          <WeddingCouple :wedding="wedding" :sections="sections" />
        </section>

        <!-- ===============================================
             ALBUM ẢNH
        ================================================ -->

        <template v-if="showGallery && gallery.length">
          <div class="cfr-filigree" aria-hidden="true">
            <img :src="filigree" alt="" />
          </div>

          <section class="cfr-section">
            <WeddingGallery :gallery="gallery" :sections="sections" />
          </section>

          <div class="cfr-filigree" aria-hidden="true">
            <img :src="filigree" alt="" />
          </div>
        </template>

        <!-- ===============================================
             THÔNG TIN TIỆC BÁO HỶ
        ================================================ -->

        <section v-if="showEvents && events.length" class="cfr-section">
          <WeddingEvents
            :events="events"
            :recipient-name="wedding?.recipientName"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             CÙNG ĐẾM NGƯỢC
        ================================================ -->

        <section v-if="showCountdown" class="cfr-section">
          <WeddingCountdown
            :countdown="countdownTarget"
            :wedding-date="wedding?.weddingDate"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             ĐỊA ĐIỂM
        ================================================ -->

        <section v-if="showMap && events.length" class="cfr-section">
          <WeddingMap :events="events" :sections="sections" />
        </section>

        <!-- ===============================================
             DRESS CODE
        ================================================ -->

        <section v-if="showDressCode" class="cfr-section">
          <DressCode :dress-code="wedding?.dressCode" :sections="sections" />
        </section>

        <!-- ===============================================
             LỊCH TRÌNH TIỆC BÁO HỶ
        ================================================ -->

        <section v-if="showTimeline && timeline.length" class="cfr-section">
          <Timeline :timeline="timeline" :events="events" :sections="sections" />
        </section>

        <!-- ===============================================
             CHUYỆN TÌNH YÊU
        ================================================ -->

        <section v-if="showStory && wedding?.story" class="cfr-section">
          <WeddingStory :story="wedding.story" :sections="sections" />
        </section>

        <!-- ===============================================
             SỔ LƯU BÚT
        ================================================ -->

        <section v-if="showGuestBook" class="cfr-section">
          <WeddingWishes
            :wishes="wishes"
            :wedding="wedding"
            :sections="sections"
          />
        </section>

        <!-- ===============================================
             HỘP QUÀ MỪNG
        ================================================ -->

        <section v-if="showGift && gifts.length" class="cfr-section">
          <WeddingGifts :gifts="gifts" :sections="sections" />
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
        :sections="sections"
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

import OpeningScreen from "@/page/NhatBinhDo/OpeningScreen.vue";
import WeddingHero from "@/page/NhatBinhDo/WeddingHero.vue";
import WeddingCouple from "@/page/NhatBinhDo/WeddingCouple.vue";
import WeddingStory from "@/page/NhatBinhDo/WeddingStory.vue";
import WeddingEvents from "@/page/NhatBinhDo/WeddingEvents.vue";
import WeddingCountdown from "@/page/NhatBinhDo/WeddingCountdown.vue";
import WeddingGallery from "@/page/NhatBinhDo/WeddingGallery.vue";
import WeddingMap from "@/page/NhatBinhDo/WeddingMap.vue";
import Timeline from "@/page/NhatBinhDo/Timeline.vue";
import DressCode from "@/page/NhatBinhDo/DressCode.vue";
import WeddingGifts from "@/page/NhatBinhDo/WeddingGifts.vue";
import WeddingWishes from "@/page/NhatBinhDo/WeddingWishes.vue";
import WeddingFooter from "@/page/NhatBinhDo/WeddingFooter.vue";

import {
  flower1,
  flower2,
  flower3,
  filigree,
} from "@/page/NhatBinhDo/crystalFloralAssets";


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
   NỀN HOA
   Mẫu gốc rải hoa so le hai bên suốt chiều dài thiệp.
========================================================== */

const blooms = [
  { id: 1, src: flower3, side: "is-left", top: "6%" },
  { id: 2, src: flower2, side: "is-right", top: "12%" },
  { id: 3, src: flower2, side: "is-left", top: "26%" },
  { id: 4, src: flower3, side: "is-right", top: "32%" },
  { id: 5, src: flower3, side: "is-left", top: "46%" },
  { id: 6, src: flower2, side: "is-right", top: "52%" },
  { id: 7, src: flower2, side: "is-left", top: "66%" },
  { id: 8, src: flower3, side: "is-right", top: "72%" },
  { id: 9, src: flower3, side: "is-left", top: "86%" },
  { id: 10, src: flower2, side: "is-right", top: "92%" },
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
   NHATBINHDO — CRYSTAL FLORAL RED
   Bảng màu lấy từ wedding.theme.Colors (ThemePanel),
   fallback về tông đỏ của mẫu tham chiếu.
========================================================== */

.cfr-theme {
  --cfr-red: var(--primary, #9c1f2c);
  --cfr-red-deep: var(--secondary, #560207);
  --cfr-cream: var(--background, #fbf8f3);
  --cfr-cream-2: var(--accent-light, #f6ecd9);
  --cfr-hairline: rgba(156, 31, 44, 0.27);
  --cfr-hairline-soft: rgba(156, 31, 44, 0.13);
  --cfr-font-heading: var(
    --font-heading,
    "Times New Roman",
    Times,
    serif
  );
  --cfr-font-body: var(
    --font-main,
    Baskerville,
    "Libre Baskerville",
    "Times New Roman",
    serif
  );
  --cfr-font-name: "EB Garamond", var(--font-main, serif);
  --cfr-font-script: var(--font-script, "Alex Brush", cursive);

  width: 100%;
  min-height: 100vh;

  background-color: var(--cfr-cream);
  color: var(--cfr-red-deep);

  font-family: var(--cfr-font-body);
}

.cfr-theme *,
.cfr-theme *::before,
.cfr-theme *::after {
  box-sizing: border-box;
}

.cfr-theme img {
  display: block;
  max-width: 100%;
}

.cfr-theme button,
.cfr-theme input,
.cfr-theme textarea {
  font: inherit;
}


/* ==========================================================
   KHUNG THIỆP
========================================================== */

.cfr-invitation {
  position: relative;
  isolation: isolate;

  width: min(480px, 100%);
  min-height: 100vh;

  margin: 0 auto;

  overflow-x: clip;

  background-color: var(--cfr-cream);
}


/* ==========================================================
   NỀN HOA
========================================================== */

.cfr-garland {
  position: absolute;
  top: -20px;
  left: 50%;

  z-index: 0;

  width: 90%;

  transform: translateX(-50%);

  overflow: hidden;

  pointer-events: none;
}

.cfr-garland img {
  width: 100%;
  height: auto;

  transform: scaleX(-1);
}

.cfr-blooms {
  position: absolute;
  inset: 0;

  z-index: 0;

  overflow: hidden;

  pointer-events: none;
}

.cfr-bloom {
  position: absolute;

  width: 50%;
  height: auto;

  object-fit: contain;

  opacity: 0.07;
}

.cfr-bloom.is-left {
  left: -10%;

  transform: rotate(20deg);
}

.cfr-bloom.is-right {
  right: -10%;

  transform: scaleX(-1) rotate(-20deg);
}


/* ==========================================================
   NỘI DUNG
========================================================== */

.cfr-content {
  position: relative;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  padding: 0 12px 40px;
}

.cfr-section {
  position: relative;
  z-index: 3;

  width: 100%;
}

.cfr-section--hero {
  padding: 0;
}

.cfr-filigree {
  position: relative;
  z-index: 3;

  display: flex;
  justify-content: center;

  width: 100%;
}

.cfr-filigree img {
  width: 250px;
  height: auto;

  object-fit: contain;
}


/* ==========================================================
   TIÊU ĐỀ DÙNG CHUNG
========================================================= */

.cfr-theme :deep(.cfr-title) {
  margin: 0;

  color: var(--cfr-red);

  font-family: var(--cfr-font-heading);
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;
  line-height: 1.4;
  text-align: center;
  text-transform: uppercase;
}

.cfr-theme :deep(.cfr-lead) {
  margin: 6px 0 0;

  color: var(--cfr-red);

  font-family: var(--cfr-font-body);
  font-size: 14px;

  line-height: 1.6;
  text-align: center;

  opacity: 0.7;
}

.cfr-theme :deep(.cfr-pill) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 40px;

  padding: 0 24px;

  border: none;
  border-radius: 999px;

  background-color: var(--cfr-red);
  color: #ffffff;

  font-family: var(--cfr-font-body);
  font-size: 14px;
  font-weight: 600;

  letter-spacing: 0.05em;

  cursor: pointer;

  transition: transform 0.25s ease, opacity 0.25s ease;
}

.cfr-theme :deep(.cfr-pill:hover:not(:disabled)) {
  transform: scale(1.03);
}

.cfr-theme :deep(.cfr-pill:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.cfr-theme :deep(.cfr-link) {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: var(--cfr-red-deep);

  font-family: var(--cfr-font-body);
  font-size: 14px;

  letter-spacing: 0.05em;

  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;

  transition: opacity 0.2s ease;
}

.cfr-theme :deep(.cfr-link:hover) {
  opacity: 0.7;
}


/* ==========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .cfr-invitation {
    width: min(900px, 100%);

    border-left: 1px solid var(--cfr-hairline-soft);
    border-right: 1px solid var(--cfr-hairline-soft);
  }

  .cfr-garland {
    top: -40px;
  }

  .cfr-content {
    gap: 48px;

    padding: 0 24px 64px;
  }

  .cfr-filigree img {
    width: 360px;
  }

  .cfr-theme :deep(.cfr-title) {
    font-size: 24px;
  }

  .cfr-theme :deep(.cfr-lead) {
    font-size: 16px;
  }

  .cfr-theme :deep(.cfr-pill) {
    min-height: 44px;

    font-size: 16px;
  }
}
</style>
