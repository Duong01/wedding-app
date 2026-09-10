<template>
  <div class="serene-green-theme">
    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <main v-else class="serene-invitation">
      <WeddingHero
        v-if="showHero"
        :wedding="wedding"
        :monogram="monogram"
        :date-label="heroDateLabel"
        :event="primaryEvent"
        :guest-name="guestName"
      />

      <div class="serene-content">
        <section v-if="showCouple" class="serene-section">
          <WeddingCouple :wedding="wedding" :guest-name="guestName" />
        </section>
        <section v-if="showStory && wedding?.story" class="serene-section">
          <WeddingStory :story="wedding.story" />
        </section>
        <section v-if="showEvents && events.length" class="serene-section">
          <WeddingEvents :events="events" :recipient-name="wedding?.recipientName" />
        </section>
        <section v-if="showTimeline && timeline.length" class="serene-section">
          <Timeline :timeline="timeline" :events="events" />
        </section>
        <section v-if="showCountdown" class="serene-section">
          <WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" />
        </section>
        <section v-if="showGallery && gallery.length" class="serene-section">
          <WeddingGallery :gallery="gallery" />
        </section>
      </div>

      <section v-if="showMap && events.length" class="serene-section">
        <WeddingMap :events="events" />
      </section>
      <section v-if="showGift && gifts.length" class="serene-section">
        <WeddingGifts :gifts="gifts" />
      </section>
      <section v-if="showGuestBook" class="serene-section">
        <WeddingWishes :wishes="wishes" :wedding="wedding" />
      </section>

      <WeddingFooter
        v-if="showFooter"
        :wedding="wedding"
        :monogram="monogram"
        :current-year="currentYear"
      />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="wedding?.music" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/ModernWhite/OpeningScreen.vue";
import WeddingHero from "@/page/ModernWhite/WeddingHero.vue";
import WeddingCouple from "@/page/ModernWhite/WeddingCouple.vue";
import WeddingStory from "@/page/ModernWhite/WeddingStory.vue";
import WeddingEvents from "@/page/ModernWhite/WeddingEvents.vue";
import WeddingCountdown from "@/page/ModernWhite/WeddingCountdown.vue";
import WeddingGallery from "@/page/ModernWhite/WeddingGallery.vue";
import WeddingMap from "@/page/ModernWhite/WeddingMap.vue";
import Timeline from "@/page/ModernWhite/Timeline.vue";
import WeddingGifts from "@/page/ModernWhite/WeddingGifts.vue";
import WeddingWishes from "@/page/ModernWhite/WeddingWishes.vue";
import WeddingFooter from "@/page/ModernWhite/WeddingFooter.vue";
import { icon, softBg } from "@/page/SereneGreen/sereneGreenAssets";

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
.serene-green-theme {
  --theme-primary: #28514b;
  --theme-secondary: #6c8e7a;
  --theme-accent: #c8d4c3;
  --theme-bg: #f5f8f4;
  --theme-panel: rgba(255,255,255,0.72);
  --theme-text: #2e3834;
  min-height: 100vh;
  width: 100%;
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.serene-green-theme :deep(.event-card),
.serene-green-theme :deep(.gift-card),
.serene-green-theme :deep(.story-card),
.serene-green-theme :deep(.timeline-item),
.serene-green-theme :deep(.guest-message) {
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(40,81,75,0.14);
  border-radius: 22px;
  box-shadow: 0 18px 45px rgba(40, 81, 75, 0.08);
}

.serene-green-theme :deep(.wedding-hero) {
  box-shadow: inset 0 -120px 140px rgba(21, 42, 38, 0.12);
}

.serene-green-theme :deep(.ring-badge),
.serene-green-theme :deep(.event-pill),
.serene-green-theme :deep(.gift-card .gift-badge) {
  border-radius: 999px;
  border: 1px solid rgba(40,81,75,0.2);
  color: var(--theme-primary);
  background: rgba(200,212,195,0.22);
  box-shadow: 0 8px 22px rgba(40,81,75,0.08);
}

.serene-green-theme :deep(.section-heading) {
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.serene-green-theme :deep(.story-card::before),
.serene-green-theme :deep(.guest-message::before) {
  content: "❀";
  position: absolute;
  top: 12px;
  right: 18px;
  color: rgba(40,81,75,0.35);
  font-size: 18px;
}
</style>
