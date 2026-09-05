<template>
  <div class="dong-son-wedding">
    <!-- OPENING -->
    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <template v-else>
      <main class="invitation">
        <!-- HERO -->
        <section v-if="showHero" class="section hero-section">
          <WeddingHero
            :wedding="wedding"
            :monogram="monogram"
            :date-label="heroDateLabel"
          />
        </section>

        <!-- COUPLE -->
        <section v-if="showCouple" class="section couple-section">
          <WeddingCouple :wedding="wedding" />
        </section>

        <!-- STORY -->
        <section
          v-if="showStory && wedding?.story"
          class="section story-section"
        >
          <WeddingStory :story="wedding.story" />
        </section>

        <!-- EVENTS -->
        <section
          v-if="showEvents && events.length"
          class="section events-section"
        >
          <WeddingEvents :events="events" />
        </section>

        <!-- COUNTDOWN -->
        <section v-if="showCountdown" class="section countdown-section">
          <WeddingCountdown :countdown="wedding?.countdown" />
        </section>

        <!-- GALLERY -->
        <section
          v-if="showGallery && gallery.length"
          class="section gallery-section"
        >
          <WeddingGallery :gallery="gallery" @open="openGallery" />
        </section>

        <!-- MAP -->
        <section v-if="showMap && events.length" class="section map-section">
          <WeddingMap :events="events" />
        </section>

        <!-- TIMELINE -->
        <section
          v-if="showTimeLine && (timeline.length || events.length)"
          class="section timeline-section"
        >
          <Timeline :timeline="timeline" :events="events" />
        </section>

        <!-- GIFTS -->
        <section v-if="showGift && gifts.length" class="section gift-section">
          <WeddingGifts :gifts="gifts" />
        </section>

        <!-- GUEST BOOK -->
        <section v-if="showGuestBook" class="section guestbook-section">
          <WeddingWishes :wishes="wishes" :wedding="wedding" />
        </section>

        <!-- FOOTER -->
        <section v-if="showFooter" class="section footer-section">
          <WeddingFooter
            :wedding="wedding"
            :monogram="monogram"
            :current-year="currentYear"
          />
        </section>
      </main>

      <FloatingMusic
        v-if="showMusic"
        ref="floatingMusicRef"
        :music="wedding?.music"
      />
    </template>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";

import dayjs from "dayjs";

import FloatingMusic from "@/components/common/FloatingMusic.vue";

import OpeningScreen from "@/page/DongSon/OpeningScreen.vue";

import WeddingHero from "@/page/DongSon/WeddingHero.vue";

import WeddingCouple from "@/page/DongSon/WeddingCouple.vue";

import WeddingStory from "@/page/DongSon/WeddingStory.vue";

import WeddingEvents from "@/page/DongSon/WeddingEvents.vue";

import WeddingCountdown from "@/page/DongSon/WeddingCountdown.vue";

import WeddingGallery from "@/page/DongSon/WeddingGallery.vue";

import WeddingMap from "@/page/DongSon/WeddingMap.vue";

import Timeline from "@/page/DongSon/Timeline.vue";

import WeddingGifts from "@/page/DongSon/WeddingGifts.vue";

import WeddingWishes from "@/page/DongSon/WeddingWishes.vue";

import WeddingFooter from "@/page/DongSon/WeddingFooter.vue";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
});

const wedding = computed(() => props.wedding);

const opened = ref(false);
const floatingMusicRef = ref(null);
const galleryIndex = ref(0);

const currentYear = new Date().getFullYear();

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

const settings = computed(() => wedding.value?.settings || {});

const showHero = computed(() => settings.value.ShowHero !== false);

const showCouple = computed(() => settings.value.ShowCouple !== false);

const showStory = computed(() => settings.value.ShowStory !== false);

const showEvents = computed(() => settings.value.ShowEvents !== false);

const showCountdown = computed(() => settings.value.ShowCountdown === true);

const showGallery = computed(() => settings.value.ShowGallery === true);

const showMap = computed(() => settings.value.ShowMap === true);

const showTimeLine = computed(() => settings.value.ShowTimeline !== false);

const showGift = computed(() => settings.value.ShowGift === true);

const showGuestBook = computed(() => settings.value.ShowGuestBook === true);

const showMusic = computed(
  () =>
    wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true
);

const showFooter = computed(() => settings.value.ShowFooter !== false);

const monogram = computed(() => {
  const groom = (wedding.value?.GroomName || wedding.value?.groomName || "G")
    .trim()
    .charAt(0);

  const bride = (wedding.value?.BrideName || wedding.value?.brideName || "B")
    .trim()
    .charAt(0);

  return `${groom}&${bride}`.toUpperCase();
});

function formatDate(date) {
  if (!date) return "";

  const parsed = dayjs(date);

  if (!parsed.isValid()) return "";

  return parsed.format("DD · MM · YYYY");
}

const openDateLabel = computed(() => formatDate(wedding.value?.weddingDate));

const heroDateLabel = computed(() =>
  formatDate(wedding.value?.hero?.weddingDate || wedding.value?.weddingDate)
);

async function handleOpen() {
  opened.value = true;

  await nextTick();

  floatingMusicRef.value?.play?.();
}

function openGallery(index) {
  galleryIndex.value = index;
}
</script>

<style scoped>
.dong-son-wedding {
  --dong-red: #8f241c;
  --dong-red-dark: #54120f;
  --dong-red-deep: #350b0a;

  --dong-bronze: #a96b32;
  --dong-gold: #c99552;
  --dong-gold-light: #d9b678;

  --dong-ivory: #f3ead8;
  --dong-paper: #eee3cd;
  --dong-text: #641914;

  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(135deg, #1a0a08 0%, #24100e 50%, #1a0a08 100%);
}

.dong-son-wedding *,
.dong-son-wedding *::before,
.dong-son-wedding *::after {
  box-sizing: border-box;
}

.dong-son-wedding img {
  display: block;
  max-width: 100%;
}

.dong-son-wedding button,
.dong-son-wedding input,
.dong-son-wedding textarea {
  font: inherit;
}

.invitation {
  position: relative;
  width: min(48rem, 100%);
  min-height: 100vh;
  margin: 0 auto;
  overflow: hidden;

  background: radial-gradient(
      circle at 50% 0,
      rgba(201, 149, 82, 0.12),
      transparent 35%
    ),
    radial-gradient(
      circle at 50% 100%,
      rgba(139, 36, 28, 0.08),
      transparent 40%
    ),
    var(--dong-paper);

  box-shadow: 
    0 20px 70px rgba(0, 0, 0, 0.5),
    inset 0 0 0 1px rgba(169, 107, 50, 0.2);
}

.section {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.hero-section {
  padding: 0;
  border-bottom: 2px solid rgba(169, 107, 50, 0.3);
}

.couple-section,
.story-section,
.events-section,
.countdown-section,
.gallery-section,
.map-section,
.timeline-section,
.gift-section,
.guestbook-section,
.footer-section {
  padding: 0;
  border-bottom: 1px solid rgba(169, 107, 50, 0.2);
}

.footer-section {
  border-bottom: none;
}

/* Decorative separator with traditional pattern */
.section:not(.hero-section)::before {
  content: "◆ ◇ ◆ ◇ ◆";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: auto;
  text-align: center;
  color: rgba(169, 107, 50, 0.3);
  font-size: 8px;
  letter-spacing: 0.3em;
  padding: 12px 0;
  pointer-events: none;
}

.section:not(.hero-section)::after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 85%;
  height: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(169, 107, 50, 0.3) 20%,
    rgba(169, 107, 50, 0.3) 80%,
    transparent 100%
  );
  pointer-events: none;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section {
  animation: fade-in 0.6s ease-out forwards;
}

/* Mobile */
@media (max-width: 600px) {
  .invitation {
    width: 100%;
    box-shadow: none;
    border-radius: 0;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .invitation {
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
  }
}
</style>