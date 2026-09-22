<template>
  <div class="shy-theme" :data-theme="theme.Name" :style="themeStyle">
    <!-- =====================================================
         MÀN HÌNH MỞ THIỆP
    ====================================================== -->

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <!-- =====================================================
         THIỆP
    ====================================================== -->

    <main v-else class="shy-invitation">
      <!-- ============ HERO ============ -->

      <WeddingHero
        v-if="showHero"
        :wedding="wedding"
        :monogram="monogram"
        :date-label="heroDateLabel"
        :event="primaryEvent"
        :guest-name="guestName"
      />

      <!-- ============ NỘI DUNG ============ -->

      <WeddingCouple v-if="showCouple" :wedding="wedding" :guest-name="guestName" />

      <WeddingGallery v-if="showGallery && gallery.length" :gallery="gallery" />

      <WeddingEvents
        v-if="showEvents && events.length"
        :events="events"
        :recipient-name="wedding?.recipientName"
      />

      <WeddingMap v-if="showMap && events.length" :events="events" />

      <DressCode v-if="showDressCode" />

      <Timeline v-if="showTimeline && timeline.length" :timeline="timeline" :events="events" />

      <WeddingWishes v-if="showGuestBook" :wishes="wishes" :wedding="wedding" />

      <WeddingStory v-if="showStory && wedding?.story" :story="wedding.story" />

      <WeddingGifts v-if="showGift && gifts.length" :gifts="gifts" />

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

import OpeningScreen from "@/page/SongHyRed/OpeningScreen.vue";
import WeddingHero from "@/page/SongHyRed/WeddingHero.vue";
import WeddingCouple from "@/page/SongHyRed/WeddingCouple.vue";
import WeddingStory from "@/page/SongHyRed/WeddingStory.vue";
import WeddingEvents from "@/page/SongHyRed/WeddingEvents.vue";
import WeddingGallery from "@/page/SongHyRed/WeddingGallery.vue";
import WeddingMap from "@/page/SongHyRed/WeddingMap.vue";
import DressCode from "@/page/SongHyRed/DressCode.vue";
import Timeline from "@/page/SongHyRed/Timeline.vue";
import WeddingGifts from "@/page/SongHyRed/WeddingGifts.vue";
import WeddingWishes from "@/page/SongHyRed/WeddingWishes.vue";
import WeddingFooter from "@/page/SongHyRed/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true } });

const wedding = computed(() => props.wedding || {});

/*
 * Bảng màu / font lấy từ theme của thiệp (xem useWeddingTheme),
 * fallback về tông "song hỷ đỏ" khi dữ liệu chưa có.
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
  Array.isArray(wedding.value?.guestBook?.Guest) ? wedding.value.guestBook.Guest : []
);

const primaryEvent = computed(() => events.value[0] || {});

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
    wedding.value?.hero?.WeddingDate ||
      wedding.value?.hero?.weddingDate ||
      wedding.value?.weddingDate
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
   TRANG
========================================================= */

.shy-theme {
  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow-x: hidden;

  background-color: var(--background, #fff7eb);

  color: var(--text, #666666);

  font-family: var(--font-main, Baskerville, "Times New Roman", serif);

  -webkit-font-smoothing: antialiased;

  text-rendering: optimizeLegibility;
}

/* =========================================================
   KHUNG THIỆP
========================================================= */

.shy-invitation {
  position: relative;

  width: 100%;
  max-width: 480px;

  min-height: 100dvh;

  margin: 0 auto;

  overflow: hidden;

  background-color: var(--background, #fff7eb);

  color: var(--text, #666666);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-invitation {
    max-width: 900px;

    border-left: 1px solid color-mix(in srgb, var(--primary, #800000) 13%, transparent);
    border-right: 1px solid color-mix(in srgb, var(--primary, #800000) 13%, transparent);
  }
}
</style>
