<template>
  <div class="vintage-sepia-theme">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" @open="handleOpen" />
    <main v-else class="vs-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="vs-content">
        <section v-if="showCouple" class="vs-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" /></section>
        <section v-if="showStory && wedding?.story" class="vs-section"><WeddingStory :story="wedding.story" /></section>
        <section v-if="showEvents && events.length" class="vs-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" /></section>
        <section v-if="showTimeline && timeline.length" class="vs-section"><Timeline :timeline="timeline" :events="events" /></section>
        <section v-if="showCountdown" class="vs-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" /></section>
        <section v-if="showGallery && gallery.length" class="vs-section"><WeddingGallery :gallery="gallery" /></section>
      </div>

      <section v-if="showMap && events.length" class="vs-section"><WeddingMap :events="events" /></section>
      <section v-if="showGift && gifts.length" class="vs-section"><WeddingGifts :gifts="gifts" /></section>
      <section v-if="showGuestBook" class="vs-section"><WeddingWishes :wishes="wishes" :wedding="wedding" /></section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="wedding?.music" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/VintageSepia/OpeningScreen.vue";
import WeddingHero from "@/page/VintageSepia/WeddingHero.vue";
import WeddingCouple from "@/page/VintageSepia/WeddingCouple.vue";
import WeddingStory from "@/page/VintageSepia/WeddingStory.vue";
import WeddingEvents from "@/page/VintageSepia/WeddingEvents.vue";
import WeddingCountdown from "@/page/VintageSepia/WeddingCountdown.vue";
import WeddingGallery from "@/page/VintageSepia/WeddingGallery.vue";
import WeddingMap from "@/page/VintageSepia/WeddingMap.vue";
import Timeline from "@/page/VintageSepia/Timeline.vue";
import WeddingGifts from "@/page/VintageSepia/WeddingGifts.vue";
import WeddingWishes from "@/page/VintageSepia/WeddingWishes.vue";
import WeddingFooter from "@/page/VintageSepia/WeddingFooter.vue";

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
.vintage-sepia-theme {
  --theme-primary: #6b4f3a;
  --theme-secondary: #97745a;
  --theme-accent: #c2a878;
  --theme-bg: #f6efe2;
  --theme-panel: rgba(255, 252, 244, 0.8);
  --theme-text: #4a3a2c;
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(1200px 500px at 20% 0%, rgba(194, 168, 120, 0.1), transparent 60%),
    radial-gradient(900px 420px at 85% 100%, rgba(107, 79, 58, 0.07), transparent 55%),
    var(--theme-bg);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.vs-invitation { width: 100%; }

.vs-content {
  padding: 0 20px 30px;
  background: linear-gradient(180deg, rgba(255, 252, 244, 0.3), rgba(234, 217, 189, 0.5));
}

.vs-section { max-width: 1100px; margin: 0 auto 22px; }
</style>
