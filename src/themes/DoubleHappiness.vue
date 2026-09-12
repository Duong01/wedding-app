<template>
  <div class="double-happiness-theme">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" @open="handleOpen" />
    <main v-else class="dh-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="dh-content">
        <section v-if="showCouple" class="dh-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" /></section>
        <section v-if="showStory && wedding?.story" class="dh-section"><WeddingStory :story="wedding.story" /></section>
        <section v-if="showEvents && events.length" class="dh-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" /></section>
        <section v-if="showTimeline && timeline.length" class="dh-section"><Timeline :timeline="timeline" :events="events" /></section>
        <section v-if="showCountdown" class="dh-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" /></section>
        <section v-if="showGallery && gallery.length" class="dh-section"><WeddingGallery :gallery="gallery" /></section>
      </div>

      <section v-if="showMap && events.length" class="dh-section"><WeddingMap :events="events" /></section>
      <section v-if="showGift && gifts.length" class="dh-section"><WeddingGifts :gifts="gifts" /></section>
      <section v-if="showGuestBook" class="dh-section"><WeddingWishes :wishes="wishes" :wedding="wedding" /></section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="wedding?.music" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/DoubleHappiness/OpeningScreen.vue";
import WeddingHero from "@/page/DoubleHappiness/WeddingHero.vue";
import WeddingCouple from "@/page/DoubleHappiness/WeddingCouple.vue";
import WeddingStory from "@/page/DoubleHappiness/WeddingStory.vue";
import WeddingEvents from "@/page/DoubleHappiness/WeddingEvents.vue";
import WeddingCountdown from "@/page/DoubleHappiness/WeddingCountdown.vue";
import WeddingGallery from "@/page/DoubleHappiness/WeddingGallery.vue";
import WeddingMap from "@/page/DoubleHappiness/WeddingMap.vue";
import Timeline from "@/page/DoubleHappiness/Timeline.vue";
import WeddingGifts from "@/page/DoubleHappiness/WeddingGifts.vue";
import WeddingWishes from "@/page/DoubleHappiness/WeddingWishes.vue";
import WeddingFooter from "@/page/DoubleHappiness/WeddingFooter.vue";

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
.double-happiness-theme {
  --theme-primary: #7a1216;
  --theme-secondary: #a32a2a;
  --theme-accent: #d9a441;
  --theme-bg: #5c0e10;
  --theme-panel: rgba(122, 18, 22, 0.85);
  --theme-text: #f7e6c4;
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(900px 420px at 50% -120px, rgba(217, 164, 65, 0.14), transparent 65%),
    linear-gradient(180deg, #7a1216 0%, #6b1013 40%, #5c0e10 100%);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.dh-invitation { width: 100%; }

.dh-content {
  padding: 0 20px 30px;
  background:
    linear-gradient(180deg, rgba(92, 14, 16, 0.4), rgba(92, 14, 16, 0.72)),
    repeating-linear-gradient(45deg, rgba(217, 164, 65, 0.035) 0 2px, transparent 2px 14px);
}

.dh-section { max-width: 1100px; margin: 0 auto 22px; }
</style>
