<template>
  <div class="eg-theme">
    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <main v-else class="eg-invitation">
      <WeddingHero
        v-if="showHero"
        :wedding="wedding"
        :monogram="monogram"
        :date-label="heroDateLabel"
        :event="primaryEvent"
        :guest-name="guestName"
      />

      <div class="eg-content">
        <section v-if="showCouple" class="eg-section">
          <WeddingCouple :wedding="wedding" :guest-name="guestName" />
        </section>

        <section v-if="showStory && wedding?.story" class="eg-section">
          <WeddingStory :story="wedding.story" />
        </section>

        <section v-if="showEvents && events.length" class="eg-section">
          <WeddingEvents :events="events" :recipient-name="wedding?.recipientName" />
        </section>

        <section v-if="showTimeline && timeline.length" class="eg-section">
          <Timeline :timeline="timeline" :events="events" />
        </section>

        <section v-if="showCountdown" class="eg-section">
          <WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" />
        </section>

        <section v-if="showGallery && gallery.length" class="eg-section">
          <WeddingGallery :gallery="gallery" />
        </section>
      </div>

      <section v-if="showMap && events.length" class="eg-section">
        <WeddingMap :events="events" />
      </section>

      <section v-if="showGift && gifts.length" class="eg-section">
        <WeddingGifts :gifts="gifts" />
      </section>

      <section v-if="showGuestBook" class="eg-section">
        <WeddingWishes :wishes="wishes" :wedding="wedding" />
      </section>

      <WeddingFooter
        v-if="showFooter"
        :wedding="wedding"
        :monogram="monogram"
        :current-year="currentYear"
      />

      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="heroMusic" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";

import FloatingMusic from "@/components/common/FloatingMusic.vue";

import OpeningScreen from "@/page/ElegantGold/OpeningScreen.vue";
import WeddingHero from "@/page/ElegantGold/WeddingHero.vue";
import WeddingCouple from "@/page/ElegantGold/WeddingCouple.vue";
import WeddingStory from "@/page/ElegantGold/WeddingStory.vue";
import WeddingEvents from "@/page/ElegantGold/WeddingEvents.vue";
import WeddingCountdown from "@/page/ElegantGold/WeddingCountdown.vue";
import WeddingGallery from "@/page/ElegantGold/WeddingGallery.vue";
import WeddingMap from "@/page/ElegantGold/WeddingMap.vue";
import Timeline from "@/page/ElegantGold/Timeline.vue";
import WeddingGifts from "@/page/ElegantGold/WeddingGifts.vue";
import WeddingWishes from "@/page/ElegantGold/WeddingWishes.vue";
import WeddingFooter from "@/page/ElegantGold/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true } });

const wedding = computed(() => props.wedding || {});

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

const opened = ref(false);
const floatingMusicRef = ref(null);
const currentYear = new Date().getFullYear();

const settings = computed(() => wedding.value?.settings || {});
const events = computed(() => (Array.isArray(wedding.value?.events) ? wedding.value.events : []));
const timeline = computed(() => (Array.isArray(wedding.value?.timeline) ? wedding.value.timeline : []));
const gallery = computed(() => (Array.isArray(wedding.value?.gallery) ? wedding.value.gallery : []));
const gifts = computed(() => (Array.isArray(wedding.value?.gifts) ? wedding.value.gifts : []));
const wishes = computed(() =>
  Array.isArray(wedding.value?.guestBook?.Guest) ? wedding.value.guestBook.Guest : []
);
const primaryEvent = computed(() => events.value[0] || {});
const countdownTarget = computed(
  () => wedding.value?.countdown?.Target || wedding.value?.countdown || wedding.value?.weddingDate
);
const guestName = computed(
  () =>
    (Array.isArray(wedding.value?.recipientName)
      ? wedding.value.recipientName[0]?.Name
      : wedding.value?.recipientName?.Name) ||
    wedding.value?.guestName ||
    "Quý khách"
);

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
const showMusic = computed(
  () => wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true
);

const monogram = computed(() => {
  const groom =
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    "G";
  const bride =
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    "B";

  return `${groom.trim().charAt(0)}&${bride.trim().charAt(0)}`.toUpperCase();
});

function formatDate(value) {
  const date = dayjs(value);
  return date.isValid() ? date.format("DD · MM · YYYY") : "";
}

const openDateLabel = computed(() => formatDate(wedding.value?.weddingDate));
const heroDateLabel = computed(() =>
  formatDate(
    wedding.value?.hero?.WeddingDate || wedding.value?.hero?.weddingDate || wedding.value?.weddingDate
  )
);

async function handleOpen() {
  opened.value = true;

  await nextTick();

  floatingMusicRef.value?.play?.();
}
</script>

<style scoped>
.eg-theme {
  --eg-ink: #5d452a;
  --eg-ink-deep: #4a3620;
  --eg-text: #5f4f38;
  --eg-muted: #8a7657;
  --eg-label: #8a7a52;
  --eg-gold: #b58a45;
  --eg-gold-light: #d7bb82;
  --eg-gold-pale: #efe3c8;
  --eg-cream: #faf8f3;
  --eg-paper: #f6ecd9;

  min-height: 100vh;
  width: 100%;

  background:
    repeating-linear-gradient(45deg, rgba(181, 138, 69, 0.035) 0 1px, transparent 1px 14px),
    repeating-linear-gradient(-45deg, rgba(181, 138, 69, 0.035) 0 1px, transparent 1px 14px),
    linear-gradient(180deg, #faf8f3 0%, #f6ecd9 55%, #f3e6cd 100%);

  color: var(--eg-text);

  font-family: "Cormorant Garamond", Georgia, serif;
}

.eg-invitation {
  width: 100%;
}

.eg-content {
  padding: 0 20px 30px;

  background: linear-gradient(180deg, rgba(255, 253, 248, 0.35), rgba(231, 216, 184, 0.4));
}

.eg-section {
  max-width: 1100px;

  margin: 0 auto 22px;
}
</style>
