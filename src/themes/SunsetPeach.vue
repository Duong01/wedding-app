<template>
  <div class="sunset-peach-theme">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" @open="handleOpen" />

    <main v-else class="sunset-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="sunset-content">
        <section v-if="showCouple" class="sunset-section">
          <WeddingCouple :wedding="wedding" :guest-name="guestName" />
        </section>
        <section v-if="showStory && wedding?.story" class="sunset-section">
          <WeddingStory :story="wedding.story" />
        </section>
        <section v-if="showEvents && events.length" class="sunset-section">
          <WeddingEvents :events="events" :recipient-name="wedding?.recipientName" />
        </section>
        <section v-if="showTimeline && timeline.length" class="sunset-section">
          <Timeline :timeline="timeline" :events="events" />
        </section>
        <section v-if="showCountdown" class="sunset-section">
          <WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" />
        </section>
        <section v-if="showGallery && gallery.length" class="sunset-section">
          <WeddingGallery :gallery="gallery" />
        </section>
      </div>

      <section v-if="showMap && events.length" class="sunset-section">
        <WeddingMap :events="events" />
      </section>
      <section v-if="showGift && gifts.length" class="sunset-section">
        <WeddingGifts :gifts="gifts" />
      </section>
      <section v-if="showGuestBook" class="sunset-section">
        <WeddingWishes :wishes="wishes" :wedding="wedding" />
      </section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="wedding?.music" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/RomanticPink/OpeningScreen.vue";
import WeddingHero from "@/page/RomanticPink/WeddingHero.vue";
import WeddingCouple from "@/page/RomanticPink/WeddingCouple.vue";
import WeddingStory from "@/page/RomanticPink/WeddingStory.vue";
import WeddingEvents from "@/page/RomanticPink/WeddingEvents.vue";
import WeddingCountdown from "@/page/RomanticPink/WeddingCountdown.vue";
import WeddingGallery from "@/page/RomanticPink/WeddingGallery.vue";
import WeddingMap from "@/page/RomanticPink/WeddingMap.vue";
import Timeline from "@/page/RomanticPink/Timeline.vue";
import WeddingGifts from "@/page/RomanticPink/WeddingGifts.vue";
import WeddingWishes from "@/page/RomanticPink/WeddingWishes.vue";
import WeddingFooter from "@/page/RomanticPink/WeddingFooter.vue";
import { softBg } from "@/page/SunsetPeach/sunsetPeachAssets";

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
.sunset-peach-theme {
  --theme-primary: #7a4a3d;
  --theme-secondary: #d67a63;
  --theme-accent: #f4c6a9;
  --theme-bg: #fffaf5;
  --theme-panel: rgba(255,255,255,0.7);
  --theme-text: #523835;
  min-height: 100vh;
  width: 100%;
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.sunset-invitation { width: 100%; }

.sunset-content { background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(253,238,228,0.78)); padding: 0 20px 30px; }

.sunset-section { max-width: 1100px; margin: 0 auto 22px; }

.sunset-peach-theme :deep(.event-card),
.sunset-peach-theme :deep(.gift-card),
.sunset-peach-theme :deep(.story-card),
.sunset-peach-theme :deep(.timeline-item),
.sunset-peach-theme :deep(.guest-message) {
  background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,244,238,0.82));
  border: 1px solid rgba(122,74,61,0.12);
  border-radius: 24px;
  box-shadow: 0 18px 42px rgba(122,74,61,0.08);
}

.sunset-peach-theme :deep(.opening-screen),
.sunset-peach-theme :deep(.wedding-hero) {
  background: v-bind("softBg");
  box-shadow: inset 0 -100px 120px rgba(122,74,61,0.08);
}

.sunset-peach-theme :deep(.event-pill),
.sunset-peach-theme :deep(.gift-card .gift-badge),
.sunset-peach-theme :deep(.ring-badge) {
  background: rgba(214,122,99,0.12);
  color: var(--theme-primary);
  border-color: rgba(122,74,61,0.18);
  border-radius: 999px;
}

.sunset-peach-theme :deep(.story-card::before),
.sunset-peach-theme :deep(.guest-message::before) {
  content: "✦";
  position: absolute;
  top: 14px;
  right: 16px;
  color: rgba(122,74,61,0.5);
  font-size: 18px;
}
</style>
