<template>
  <div class="midnight-gold-theme">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" @open="handleOpen" />
    <main v-else class="midnight-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="midnight-content">
        <section v-if="showCouple" class="midnight-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" /></section>
        <section v-if="showStory && wedding?.story" class="midnight-section"><WeddingStory :story="wedding.story" /></section>
        <section v-if="showEvents && events.length" class="midnight-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" /></section>
        <section v-if="showTimeline && timeline.length" class="midnight-section"><Timeline :timeline="timeline" :events="events" /></section>
        <section v-if="showCountdown" class="midnight-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" /></section>
        <section v-if="showGallery && gallery.length" class="midnight-section"><WeddingGallery :gallery="gallery" /></section>
      </div>

      <section v-if="showMap && events.length" class="midnight-section"><WeddingMap :events="events" /></section>
      <section v-if="showGift && gifts.length" class="midnight-section"><WeddingGifts :gifts="gifts" /></section>
      <section v-if="showGuestBook" class="midnight-section"><WeddingWishes :wishes="wishes" :wedding="wedding" /></section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="wedding?.music" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/MidnightGold/OpeningScreen.vue";
import WeddingHero from "@/page/MidnightGold/WeddingHero.vue";
import WeddingCouple from "@/page/MidnightGold/WeddingCouple.vue";
import WeddingStory from "@/page/MidnightGold/WeddingStory.vue";
import WeddingEvents from "@/page/MidnightGold/WeddingEvents.vue";
import WeddingCountdown from "@/page/MidnightGold/WeddingCountdown.vue";
import WeddingGallery from "@/page/MidnightGold/WeddingGallery.vue";
import WeddingMap from "@/page/MidnightGold/WeddingMap.vue";
import Timeline from "@/page/MidnightGold/Timeline.vue";
import WeddingGifts from "@/page/MidnightGold/WeddingGifts.vue";
import WeddingWishes from "@/page/MidnightGold/WeddingWishes.vue";
import WeddingFooter from "@/page/MidnightGold/WeddingFooter.vue";

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
.midnight-gold-theme {
  --theme-primary: #261d23;
  --theme-secondary: #9b7d4d;
  --theme-accent: #d8b676;
  --theme-bg: #17121b;
  --theme-panel: rgba(38, 29, 35, 0.72);
  --theme-text: #f0e6d2;
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(1100px 500px at 50% -140px, rgba(216, 182, 118, 0.12), transparent 65%),
    linear-gradient(180deg, #1d1622 0%, #17121b 45%, #120e15 100%);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.midnight-invitation { width: 100%; }
.midnight-content { padding: 0 20px 30px; background: linear-gradient(180deg, rgba(216, 182, 118, 0.05), rgba(18, 14, 21, 0.55)); }
.midnight-section { max-width: 1100px; margin: 0 auto 22px; }
</style>
