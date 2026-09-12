<template>
  <div class="lavender-cream-theme">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" @open="handleOpen" />
    <main v-else class="lavender-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="lavender-content">
        <section v-if="showCouple" class="lavender-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" /></section>
        <section v-if="showStory && wedding?.story" class="lavender-section"><WeddingStory :story="wedding.story" /></section>
        <section v-if="showEvents && events.length" class="lavender-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" /></section>
        <section v-if="showTimeline && timeline.length" class="lavender-section"><Timeline :timeline="timeline" :events="events" /></section>
        <section v-if="showCountdown" class="lavender-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" /></section>
        <section v-if="showGallery && gallery.length" class="lavender-section"><WeddingGallery :gallery="gallery" /></section>
      </div>

      <section v-if="showMap && events.length" class="lavender-section"><WeddingMap :events="events" /></section>
      <section v-if="showGift && gifts.length" class="lavender-section"><WeddingGifts :gifts="gifts" /></section>
      <section v-if="showGuestBook" class="lavender-section"><WeddingWishes :wishes="wishes" :wedding="wedding" /></section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="wedding?.music" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/LavenderCream/OpeningScreen.vue";
import WeddingHero from "@/page/LavenderCream/WeddingHero.vue";
import WeddingCouple from "@/page/LavenderCream/WeddingCouple.vue";
import WeddingStory from "@/page/LavenderCream/WeddingStory.vue";
import WeddingEvents from "@/page/LavenderCream/WeddingEvents.vue";
import WeddingCountdown from "@/page/LavenderCream/WeddingCountdown.vue";
import WeddingGallery from "@/page/LavenderCream/WeddingGallery.vue";
import WeddingMap from "@/page/LavenderCream/WeddingMap.vue";
import Timeline from "@/page/LavenderCream/Timeline.vue";
import WeddingGifts from "@/page/LavenderCream/WeddingGifts.vue";
import WeddingWishes from "@/page/LavenderCream/WeddingWishes.vue";
import WeddingFooter from "@/page/LavenderCream/WeddingFooter.vue";

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
.lavender-cream-theme {
  --theme-primary: #584a5b;
  --theme-secondary: #a086b4;
  --theme-accent: #d8c0de;
  --theme-bg: #faf8fc;
  --theme-panel: rgba(255,255,255,0.72);
  --theme-text: #433846;
  min-height: 100vh;
  width: 100%;
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.lavender-invitation { width: 100%; }
.lavender-content { padding: 0 20px 30px; background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(241,235,244,0.8)); }
.lavender-section { max-width: 1100px; margin: 0 auto 22px; }
</style>
