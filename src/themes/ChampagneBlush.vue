<template>
  <div class="champagne-blush-theme">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" @open="handleOpen" />
    <main v-else class="champagne-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="champagne-content">
        <section v-if="showCouple" class="champagne-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" /></section>
        <section v-if="showStory && wedding?.story" class="champagne-section"><WeddingStory :story="wedding.story" /></section>
        <section v-if="showEvents && events.length" class="champagne-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" /></section>
        <section v-if="showTimeline && timeline.length" class="champagne-section"><Timeline :timeline="timeline" :events="events" /></section>
        <section v-if="showCountdown" class="champagne-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" /></section>
        <section v-if="showGallery && gallery.length" class="champagne-section"><WeddingGallery :gallery="gallery" /></section>
      </div>

      <section v-if="showMap && events.length" class="champagne-section"><WeddingMap :events="events" /></section>
      <section v-if="showGift && gifts.length" class="champagne-section"><WeddingGifts :gifts="gifts" /></section>
      <section v-if="showGuestBook" class="champagne-section"><WeddingWishes :wishes="wishes" :wedding="wedding" /></section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="wedding?.music" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/ChampagneBlush/OpeningScreen.vue";
import WeddingHero from "@/page/ChampagneBlush/WeddingHero.vue";
import WeddingCouple from "@/page/ChampagneBlush/WeddingCouple.vue";
import WeddingStory from "@/page/ChampagneBlush/WeddingStory.vue";
import WeddingEvents from "@/page/ChampagneBlush/WeddingEvents.vue";
import WeddingCountdown from "@/page/ChampagneBlush/WeddingCountdown.vue";
import WeddingGallery from "@/page/ChampagneBlush/WeddingGallery.vue";
import WeddingMap from "@/page/ChampagneBlush/WeddingMap.vue";
import Timeline from "@/page/ChampagneBlush/Timeline.vue";
import WeddingGifts from "@/page/ChampagneBlush/WeddingGifts.vue";
import WeddingWishes from "@/page/ChampagneBlush/WeddingWishes.vue";
import WeddingFooter from "@/page/ChampagneBlush/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true } });
const wedding = computed(() => props.wedding || {});
const opened = ref(false);
const floatingMusicRef = ref(null);
const currentYear = new Date().getFullYear();
const settings = computed(() => wedding.value?.settings || {});
const events = computed(() => Array.isArray(wedding.value?.events) ? wedding.value.events : []);
const timeline = computed(() => Array.isArray(wedding.value?.timeline) ? wedding.value.timeline : []);
const gallery = computed(() => Array.isArray(wedding.value?.gallery) ? wedding.value.gallery : []);
const gifts = computed(() => Array.isArray(wedding.value?.gifts) ? wedding.value.gifts : []);
const wishes = computed(() => Array.isArray(wedding.value?.guestBook?.Guest) ? wedding.value.guestBook.Guest : []);
const primaryEvent = computed(() => events.value[0] || {});
const countdownTarget = computed(() => wedding.value?.countdown?.Target || wedding.value?.countdown || wedding.value?.weddingDate);
const guestName = computed(() => (Array.isArray(wedding.value?.recipientName) ? wedding.value.recipientName[0]?.Name : wedding.value?.recipientName?.Name) || wedding.value?.guestName || "Quý khách");
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
const showMusic = computed(() => wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true);
const monogram = computed(() => {
  const groom = wedding.value?.GroomName || wedding.value?.groomName || wedding.value?.hero?.GroomName || wedding.value?.couple?.Groom?.Name || "G";
  const bride = wedding.value?.BrideName || wedding.value?.brideName || wedding.value?.hero?.BrideName || wedding.value?.couple?.Bride?.Name || "B";
  return `${groom.trim().charAt(0)}&${bride.trim().charAt(0)}`.toUpperCase();
});
function formatDate(value) {
  const date = dayjs(value);
  return date.isValid() ? date.format("DD · MM · YYYY") : "";
}
const openDateLabel = computed(() => formatDate(wedding.value?.weddingDate));
const heroDateLabel = computed(() => formatDate(wedding.value?.hero?.weddingDate || wedding.value?.weddingDate));
async function handleOpen() {
  opened.value = true;
  await nextTick();
  floatingMusicRef.value?.play?.();
}
</script>

<style scoped>
.champagne-blush-theme {
  --theme-primary: #6c4b4a;
  --theme-secondary: #b67f7d;
  --theme-accent: #ead2b6;
  --theme-bg: #fffaf7;
  --theme-panel: rgba(255,255,255,0.7);
  --theme-text: #453533;
  min-height: 100vh;
  width: 100%;
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.champagne-invitation { width: 100%; }
.champagne-content { padding: 0 20px 30px; background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(244,238,232,0.82)); }
.champagne-section { max-width: 1100px; margin: 0 auto 22px; }
</style>
