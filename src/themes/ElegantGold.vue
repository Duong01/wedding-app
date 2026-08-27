<template>
  <div
    class="elegant-gold"
    :style="themeStyle"
  >

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <main
      v-else
      class="eg-invitation"
    >

      <!-- ================= HERO ================= -->

      <EGScrollReveal class="eg-root-section eg-hero-reveal">
        <WeddingHero
          v-if="showHero"
          :wedding="wedding"
          :monogram="monogram"
          :date-label="heroDateLabel"
        />
      </EGScrollReveal>


      <!-- ================= COUPLE ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingCouple
          v-if="showCouple"
          :wedding="wedding"
        />
      </EGScrollReveal>


      <!-- ================= STORY ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingStory
          v-if="showStory"
          :story="wedding.story"
        />
      </EGScrollReveal>


      <!-- ================= EVENTS ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingEvents
          v-if="showEvents"
          :events="events"
        />
      </EGScrollReveal>


      <!-- ================= COUNTDOWN ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingCountdown
          v-if="showCountdown"
          :countdown="wedding.countdown"
        />
      </EGScrollReveal>


      <!-- ================= TIMELINE ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingTimeline
          v-if="showTimeline"
          :timeline="timeline"
        />
      </EGScrollReveal>


      <!-- ================= GALLERY ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingGallery
          v-if="showGallery"
          :gallery="gallery"
          @open="openGallery"
        />
      </EGScrollReveal>


      <!-- ================= MAP ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingMap
          v-if="showMap"
          :events="events"
        />
      </EGScrollReveal>


      <!-- ================= GIFTS ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingGifts
          v-if="showGift"
          :gifts="gifts"
        />
      </EGScrollReveal>


      <!-- ================= WISHES ================= -->

      <EGScrollReveal class="eg-root-section">
        <WeddingWishes
          v-if="showGuestBook"
          :wishes="wishes"
          :wedding="wedding"
        />
      </EGScrollReveal>


      <!-- ================= FOOTER ================= -->

      <EGScrollReveal class="eg-root-section eg-footer-reveal">
        <WeddingFooter
          v-if="showFooter"
          :wedding="wedding"
          :monogram="monogram"
          :current-year="currentYear"
        />
      </EGScrollReveal>

    </main>


    <!-- =====================================================
         FLOATING MUSIC
    ====================================================== -->

    <FloatingMusic
      v-if="showMusic"
      ref="floatingMusicRef"
      :music="wedding.music"
    />

  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
} from "vue";

import dayjs from "dayjs";
import "dayjs/locale/vi";

import FloatingMusic from "@/components/common/FloatingMusic.vue";

import OpeningScreen from "@/page/ElegantGold/OpeningScreen.vue";
import WeddingHero from "@/page/ElegantGold/WeddingHero.vue";
import WeddingCouple from "@/page/ElegantGold/WeddingCouple.vue";
import WeddingEvents from "@/page/ElegantGold/WeddingEvents.vue";
import WeddingGallery from "@/page/ElegantGold/WeddingGallery.vue";
import WeddingGifts from "@/page/ElegantGold/WeddingGifts.vue";
import WeddingWishes from "@/page/ElegantGold/WeddingWishes.vue";
import WeddingFooter from "@/page/ElegantGold/WeddingFooter.vue";


import WeddingStory from "@/page/ElegantGold/WeddingStory.vue";
import WeddingCountdown from "@/page/ElegantGold/WeddingCountdown.vue";
import WeddingTimeline from "@/page/ElegantGold/WeddingTimeline.vue";
import WeddingMap from "@/page/ElegantGold/WeddingMap.vue";

import EGSection from "@/page/ElegantGold/Effect/EGSection.vue";
import EGScrollReveal from "@/page/ElegantGold/Effect/EGScrollReveal.vue";

import { useWeddingTheme } from "@/composables/useWeddingTheme";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
});



const wedding = computed(() => props.wedding);

const {
  theme,
  themeStyle,
} = useWeddingTheme(props.wedding);


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const opened = ref(false);

const floatingMusicRef = ref(null);

const galleryDialog = ref(false);

const galleryIndex = ref(0);

const currentYear = new Date().getFullYear();


/*
|--------------------------------------------------------------------------
| SETTINGS
|--------------------------------------------------------------------------
*/

const settings = computed(() => {
  return wedding.value?.settings || {};
});


/*
|--------------------------------------------------------------------------
| DATA
|--------------------------------------------------------------------------
*/

const events = computed(() => {
  return Array.isArray(wedding.value?.events)
    ? wedding.value.events
    : [];
});


const gallery = computed(() => {
  return Array.isArray(wedding.value?.gallery)
    ? wedding.value.gallery
    : [];
});


const gifts = computed(() => {
  return Array.isArray(wedding.value?.gifts)
    ? wedding.value.gifts
    : [];
});


const wishes = computed(() => {
  return Array.isArray(
    wedding.value?.guestBook?.guest
  )
    ? wedding.value.guestBook.guest
    : [];
});


const timeline = computed(() => {
  return Array.isArray(wedding.value?.timeline)
    ? wedding.value.timeline
    : [];
});


/*
|--------------------------------------------------------------------------
| SECTION HELPER
|--------------------------------------------------------------------------
|
| Nếu API chưa có setting:
| → dùng defaultValue
|
| Nếu setting = false:
| → ẩn section
|
*/

function sectionEnabled(
  key,
  hasData = true,
  defaultValue = true
) {
  const value = settings.value?.[key];

  if (typeof value === "boolean") {
    return value && hasData;
  }

  return defaultValue && hasData;
}


/*
|--------------------------------------------------------------------------
| SECTION VISIBILITY
|--------------------------------------------------------------------------
*/

const showHero = computed(() => {
  return sectionEnabled(
    "showHero",
    true
  );
});


const showCouple = computed(() => {
  return sectionEnabled(
    "showCouple",
    true
  );
});


const showStory = computed(() => {
  return sectionEnabled(
    "showStory",
    !!wedding.value?.story?.description
  );
});


const showCountdown = computed(() => {
  return (
    wedding.value?.countdown?.enabled === true &&
    settings.value?.showCountdown !== false &&
    !!countdownTarget.value
  );
});


const showEvents = computed(() => {
  return sectionEnabled(
    "showEvents",
    events.value.length > 0
  );
});


const showTimeline = computed(() => {
  return sectionEnabled(
    "showTimeline",
    timeline.value.length > 0
  );
});


const showMap = computed(() => {
  return sectionEnabled(
    "showMap",
    events.value.some(
      (item) => item?.map
    )
  );
});


const showGallery = computed(() => {
  return sectionEnabled(
    "showGallery",
    gallery.value.length > 0
  );
});


const showGift = computed(() => {
  return sectionEnabled(
    "showGift",
    gifts.value.length > 0
  );
});


const showGuestBook = computed(() => {
  return (
    sectionEnabled(
      "showGuestBook",
      wedding.value?.guestBook?.enabled !== false
    )
  );
});


const showFooter = computed(() => {
  return settings.value?.showFooter !== false;
});


const showMusic = computed(() => {
  return (
    wedding.value?.music?.Enabled === true &&
    settings.value?.showMusic !== false
  );
});


/*
|--------------------------------------------------------------------------
| COUNTDOWN
|--------------------------------------------------------------------------
*/

const countdownTarget = computed(() => {
  return (
    wedding.value?.countdown?.target ||
    wedding.value?.weddingDate ||
    ""
  );
});


/*
|--------------------------------------------------------------------------
| MONOGRAM
|--------------------------------------------------------------------------
*/

const monogram = computed(() => {
  const groom = (
    wedding.value?.GroomName || "G"
  )
    .trim()
    .charAt(0);

  const bride = (
    wedding.value?.BrideName || "B"
  )
    .trim()
    .charAt(0);

  return `${groom}&${bride}`.toUpperCase();
});


/*
|--------------------------------------------------------------------------
| DATE FORMAT
|--------------------------------------------------------------------------
*/

function formatFull(date) {
  if (!date) return "";

  const parsed = dayjs(date);

  if (!parsed.isValid()) {
    return "";
  }

  const weekday = parsed
    .locale("vi")
    .format("dddd")
    .replace(
      /^./,
      (char) => char.toUpperCase()
    );

  return `${weekday} · ${parsed.format(
    "DD.MM.YYYY"
  )}`;
}


const openDateLabel = computed(() => {
  return formatFull(
    wedding.value?.weddingDate
  );
});


const heroDateLabel = computed(() => {
  return formatFull(
    wedding.value?.hero?.weddingDate ||
    wedding.value?.weddingDate
  );
});


/*
|--------------------------------------------------------------------------
| OPEN INVITATION
|--------------------------------------------------------------------------
*/

async function handleOpen() {
  opened.value = true;

  await nextTick();

  floatingMusicRef.value?.play?.();
}


/*
|--------------------------------------------------------------------------
| GALLERY
|--------------------------------------------------------------------------
*/

function openGallery(index = 0) {
  galleryIndex.value = index;

  galleryDialog.value = true;

  document.body.style.overflow = "hidden";
}


function closeGallery() {
  galleryDialog.value = false;

  document.body.style.overflow = "";
}


/*
|--------------------------------------------------------------------------
| CLEANUP
|--------------------------------------------------------------------------
*/

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.elegant-gold {
  --gold: #d4af37;
  --gold-light: #f3e5c0;

  --black: #23201a;
  --black-soft: #35301f;

  --cream: #f6f1e6;
  --paper: #fffdf6;

  --text: #3a332a;
  --text-soft: #8a7d6a;

  --font-heading:
    "Cormorant Garamond",
    Georgia,
    serif;

  --font-script:
    "Allura",
    cursive;

  min-height: 100vh;

  color: var(--text);

  background:
    #e5ddcd;

  font-family:
    var(--font-heading);

}

.eg-invitation {
  width: min(
    100%,
    900px
  );

  margin: 0 auto;

  background:
    var(--paper);

  box-shadow:
    0 0 70px
    rgba(35, 32, 26, 0.16);
}
</style>
