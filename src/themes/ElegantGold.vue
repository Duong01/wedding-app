<template>
  <div class="la-theme" :data-theme="theme.Name" :style="themeStyle">
    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <main v-else class="la-invitation">
      <WeddingHero
        v-if="showHero"
        :wedding="wedding"
        :monogram="monogram"
        :date-label="heroDateLabel"
        :event="primaryEvent"
        :guest-name="guestName"
      />

      <div class="la-content">
        <section v-if="showCouple" class="la-section">
          <WeddingCouple :wedding="wedding" :guest-name="guestName" />
        </section>

        <section v-if="showStory && wedding?.story" class="la-section">
          <WeddingStory :story="wedding.story" />
        </section>

        <section v-if="showGallery && gallery.length" class="la-section">
          <WeddingGallery :gallery="gallery" />
        </section>

        <section v-if="showEvents && events.length" class="la-section">
          <WeddingEvents :events="events" :recipient-name="wedding?.recipientName" />
        </section>

        <section v-if="showCountdown" class="la-section">
          <WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" />
        </section>

        <section v-if="showMap && events.length" class="la-section">
          <WeddingMap :events="events" />
        </section>

        <section v-if="showDressCode" class="la-section">
          <DressCode :dress-code="wedding?.dressCode" />
        </section>

        <section v-if="showTimeline && timeline.length" class="la-section">
          <Timeline :timeline="timeline" :events="events" />
        </section>

        <section v-if="showGift && gifts.length" class="la-section">
          <WeddingGifts :gifts="gifts" />
        </section>

        <section v-if="showGuestBook" class="la-section">
          <WeddingWishes :wishes="wishes" :wedding="wedding" />
        </section>
      </div>

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
import { useWeddingTheme } from "@/composables/useWeddingTheme";

import OpeningScreen from "@/page/ElegantGold/OpeningScreen.vue";
import WeddingHero from "@/page/ElegantGold/WeddingHero.vue";
import WeddingCouple from "@/page/ElegantGold/WeddingCouple.vue";
import WeddingStory from "@/page/ElegantGold/WeddingStory.vue";
import WeddingGallery from "@/page/ElegantGold/WeddingGallery.vue";
import WeddingEvents from "@/page/ElegantGold/WeddingEvents.vue";
import WeddingCountdown from "@/page/ElegantGold/WeddingCountdown.vue";
import WeddingMap from "@/page/ElegantGold/WeddingMap.vue";
import DressCode from "@/page/ElegantGold/DressCode.vue";
import Timeline from "@/page/ElegantGold/Timeline.vue";
import WeddingGifts from "@/page/ElegantGold/WeddingGifts.vue";
import WeddingWishes from "@/page/ElegantGold/WeddingWishes.vue";
import WeddingFooter from "@/page/ElegantGold/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true } });

const wedding = computed(() => props.wedding || {});

/*
 * Bảng màu / font lấy từ wedding.theme (panel Theme của editor).
 * Toàn bộ token --la-* bên dưới đều trỏ về các biến --primary,
 * --accent… do useWeddingTheme sinh ra, nên đổi màu trong editor
 * là thiệp đổi theo ngay.
 */
const { theme, themeStyle } = useWeddingTheme(props.wedding);

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
const showDressCode = computed(() => settings.value.ShowDressCode !== false);
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
/* =========================================================
   TOKENS
   Mọi giá trị đều có fallback = bảng màu love-art gốc, nên
   thiệp vẫn đúng dáng khi wedding.theme chưa được cấu hình.
========================================================= */

.la-theme {
  --la-red: var(--primary, #d70c1b);
  --la-red-deep: var(--secondary, #a30a15);
  --la-ink: var(--text, #000000);
  --la-ink-soft: var(--text-secondary, #4a4a4a);
  --la-paper: var(--white, #ffffff);
  --la-cream: var(--background, #ffffff);
  --la-blush: var(--background-secondary, #fdecee);
  --la-hairline: rgba(215, 12, 27, 0.27);
  --la-hairline-soft: rgba(215, 12, 27, 0.13);

  --la-font-hand: "Patrick Hand", "Baloo Bhaijaan", cursive;
  --la-font-display: "Plus Jakarta Sans", "Be Vietnam Pro", sans-serif;

  min-height: 100vh;
  width: 100%;

  background-color: var(--la-paper);
  color: var(--la-ink);

  font-family: var(--la-font-hand);
}

.la-invitation {
  width: min(480px, 100%);
  margin: 0 auto;

  background-color: var(--la-paper);

  overflow-x: clip;
}

.la-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  padding: 24px 16px 40px;
}

.la-section {
  position: relative;
  z-index: 3;

  width: 100%;
}

/* =========================================================
   TIÊU ĐỀ DÙNG CHUNG
   Các component con dùng :deep() để lấy đúng kiểu chữ này.
========================================================= */

.la-theme :deep(.la-title) {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-display);
  font-size: 26px;
  font-weight: 700;

  letter-spacing: 0.05em;
  line-height: 1.15;
  text-transform: uppercase;
}

.la-theme :deep(.la-eyebrow) {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;

  letter-spacing: 0.02em;
}

.la-theme :deep(.la-lead) {
  max-width: 300px;
  margin: 0 auto;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 12px;
  font-weight: 300;

  line-height: 1.5;
}

/* Nút tròn đỏ dùng chung (RSVP, gửi lời chúc, chỉ đường…) */
.la-theme :deep(.la-pill) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 36px;
  padding: 0 24px;

  border: 1px solid var(--la-red);
  border-radius: 999px;

  background-color: var(--la-red);
  color: var(--la-paper);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;

  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;

  cursor: pointer;

  transition: transform 0.25s ease, background-color 0.25s ease;
}

.la-theme :deep(.la-pill:hover) {
  transform: scale(1.03);
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-invitation {
    width: min(900px, 100%);

    border-left: 1px solid var(--la-hairline-soft);
    border-right: 1px solid var(--la-hairline-soft);
  }

  .la-content {
    gap: 56px;

    padding: 32px 40px 56px;
  }

  .la-theme :deep(.la-title) {
    font-size: 32px;
  }

  .la-theme :deep(.la-eyebrow) {
    font-size: 15px;
  }

  .la-theme :deep(.la-lead) {
    max-width: 420px;

    font-size: 14px;
  }

  .la-theme :deep(.la-pill) {
    min-height: 40px;

    font-size: 14px;
  }
}
</style>
