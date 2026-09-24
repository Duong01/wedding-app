<template>
  <div class="lpv3-theme">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" @open="handleOpen" />
    <main v-else class="lpv3-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="lpv3-content">
        <section v-if="showCouple" class="lpv3-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" /></section>
        <section v-if="showStory && wedding?.story" class="lpv3-section"><WeddingStory :story="wedding.story" /></section>
        <section v-if="showEvents && events.length" class="lpv3-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" /></section>
        <section v-if="showTimeline && timeline.length" class="lpv3-section"><Timeline :timeline="timeline" :events="events" /></section>
        <section v-if="showCountdown" class="lpv3-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" /></section>
        <section v-if="showGallery && gallery.length" class="lpv3-section"><WeddingGallery :gallery="gallery" /></section>
      </div>

      <section v-if="showMap && events.length" class="lpv3-section"><WeddingMap :events="events" /></section>
      <section v-if="showGift && gifts.length" class="lpv3-section"><WeddingGifts :gifts="gifts" /></section>
      <section v-if="showGuestBook" class="lpv3-section"><WeddingWishes :wishes="wishes" :wedding="wedding" /></section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="heroMusic" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, onMounted } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/LongPhungV3/OpeningScreen.vue";
import WeddingHero from "@/page/LongPhungV3/WeddingHero.vue";
import WeddingCouple from "@/page/LongPhungV3/WeddingCouple.vue";
import WeddingStory from "@/page/LongPhungV3/WeddingStory.vue";
import WeddingEvents from "@/page/LongPhungV3/WeddingEvents.vue";
import WeddingCountdown from "@/page/LongPhungV3/WeddingCountdown.vue";
import WeddingGallery from "@/page/LongPhungV3/WeddingGallery.vue";
import WeddingMap from "@/page/LongPhungV3/WeddingMap.vue";
import Timeline from "@/page/LongPhungV3/Timeline.vue";
import WeddingGifts from "@/page/LongPhungV3/WeddingGifts.vue";
import WeddingWishes from "@/page/LongPhungV3/WeddingWishes.vue";
import WeddingFooter from "@/page/LongPhungV3/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true }, startOpened: { type: Boolean, default: false } });

const emit = defineEmits(["open"]);
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
const opened = ref(props.startOpened);
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
const heroDateLabel = computed(() => formatDate(wedding.value?.hero?.WeddingDate || wedding.value?.hero?.weddingDate || wedding.value?.weddingDate));
async function handleOpen() {
  opened.value = true;

  emit("open");
  await nextTick();
  floatingMusicRef.value?.play?.();
}

/*
 * Vào thẳng nội dung (bước 3 /open → /view): theme mount lại
 * từ đầu nên handleOpen của bước 2 không còn — phải tự phát
 * nhạc tại đây, nếu không bước 3 im lặng.
 */
onMounted(() => {
  if (props.startOpened) {
    floatingMusicRef.value?.play?.();
  }
});

</script>

<style scoped>
.lpv3-theme {
  --lpv3-red: #7a0014;
  --lpv3-red-deep: #710001;
  --lpv3-gold: #ffbe89;
  --lpv3-gold-soft: rgba(255, 190, 137, 0.8);
  --lpv3-gift-gold: #d4af37;

  min-height: 100vh;
  width: 100%;
  background: var(--lpv3-red);
  color: var(--lpv3-gold);
  font-family: "Baskerville", "Times New Roman", serif;
}

.lpv3-invitation {
  position: relative;
  isolation: isolate;
  width: 100%;
  overflow: hidden;
}

/* Nền rồng phượng parallax — 12 ảnh xen kẽ, mờ 40% */
.lpv3-invitation::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 190, 137, 0.08), transparent 55%),
    linear-gradient(180deg, #7a0014 0%, #6d0009 55%, #5a000e 100%);

  pointer-events: none;
}

.lpv3-content {
  position: relative;
  z-index: 1;
  padding: 0 0 26px;
}

.lpv3-section {
  max-width: 720px;
  margin: 0 auto;
}
</style>
