<template>
  <div class="jade-phoenix-theme" :style="colorVars">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" :sections="sections" @open="handleOpen" />
    <main v-else class="jade-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="jade-content">
        <section v-if="showCouple" class="jade-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" :sections="sections" /></section>
        <section v-if="showStory && useMilestoneStory" class="jade-section"><StoryMilestones :wedding="wedding" /></section>
        <section v-if="showStory && !useMilestoneStory && wedding?.story" class="jade-section"><WeddingStory :story="wedding.story" :sections="sections" /></section>

        <section v-if="showEvents && events.length" class="jade-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" :sections="sections" :settings="settings" /></section>

        <!-- ============ VIDEO CƯỚI ============ -->

        <section v-if="showVideo" class="jade-section"><VideoSection :wedding="wedding" /></section>

        <!-- ============ TRÒ CHƠI ============ -->

        <section v-if="showGame" class="jade-section"><GameSection :wedding="wedding" /></section>
        <section v-if="showTimeline && timeline.length" class="jade-section"><Timeline :timeline="timeline" :events="events" :sections="sections" /></section>
        <section v-if="showCountdown" class="jade-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" :sections="sections" /></section>
        <section v-if="showGallery && gallery.length" class="jade-section"><WeddingGallery :layout="wedding?.settings?.GalleryLayout" :gallery="gallery" :sections="sections" /></section>

      </div>
      <section v-if="showGift && gifts.length" class="jade-section"><WeddingGifts :gifts="gifts" :sections="sections" /></section>
      <section v-if="showGuestBook" class="jade-section"><WeddingWishes :wishes="wishes" :wedding="wedding" :sections="sections" /></section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" :sections="sections" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="heroMusic" />
    </main>

  <!-- Hiệu ứng mùa theo ngày cưới: hoa rơi / nắng / lá rơi / tuyết -->
  <SeasonFx :wedding="wedding" />
</div>
</template>

<script setup>
import { useThemeColorVars } from "@/composables/useThemeColorVars";
import { computed, nextTick, ref, onMounted } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";

import SeasonFx from "@/components/common/SeasonFx.vue";
import VideoSection from "@/components/common/VideoSection.vue";
import GameSection from "@/components/common/GameSection.vue";
import StoryMilestones from "@/components/common/StoryMilestones.vue";

import OpeningScreen from "@/page/JadePhoenix/OpeningScreen.vue";
import WeddingHero from "@/page/JadePhoenix/WeddingHero.vue";
import WeddingCouple from "@/page/JadePhoenix/WeddingCouple.vue";
import WeddingStory from "@/page/JadePhoenix/WeddingStory.vue";
import WeddingEvents from "@/page/JadePhoenix/WeddingEvents.vue";
import WeddingCountdown from "@/page/JadePhoenix/WeddingCountdown.vue";
import WeddingGallery from "@/page/JadePhoenix/WeddingGallery.vue";
import Timeline from "@/page/JadePhoenix/Timeline.vue";
import WeddingGifts from "@/page/JadePhoenix/WeddingGifts.vue";
import WeddingWishes from "@/page/JadePhoenix/WeddingWishes.vue";
import WeddingFooter from "@/page/JadePhoenix/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true }, startOpened: { type: Boolean, default: false } });

/* Màu chủ thiệp chỉnh trong editor (xem useThemeColorVars) */
const { colorVars } = useThemeColorVars(() => props.wedding);

const emit = defineEmits(["open"]);
const wedding = computed(() => props.wedding || {})

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
});;
const opened = ref(props.startOpened);
const floatingMusicRef = ref(null);
const currentYear = new Date().getFullYear();
const settings = computed(() => wedding.value?.settings || {});
const sections = computed(() => wedding.value?.sections || {});
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
const showVideo = computed(() => settings.value.ShowVideo === true);
const showGame = computed(() => settings.value.ShowGame === true);

/*
 * Story 2 chế độ: danh sách dấu mốc thay cho khối văn bản.
 */
const useMilestoneStory = computed(
  () =>
    wedding.value?.story?.Mode === "milestones" &&
    (wedding.value?.storyMilestones || []).length > 0
);
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
.jade-phoenix-theme {
  --theme-primary: var(--tc-6e1f24, #6e1f24);
  --theme-secondary: var(--tc-b98a4b, #b98a4b);
  --theme-accent: var(--tc-e8c98a, #e8c98a);
  --theme-bg: var(--tc-fdfaf3, #fdfaf3);
  --theme-panel: rgba(255,255,255,0.72);
  --theme-text: var(--tc-4a2328, #4a2328);
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.jade-invitation { width: 100%; }
.jade-content { padding: 0 20px 30px; background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(var(--tc-f3e3c4-rgb, 243, 227, 196), 0.8)); }
.jade-section { max-width: 1100px; margin: 0 auto 22px; }

/* Màn hình rộng: nền ngoài thiệp là màu giấy, thiệp ở giữa
   giữ nguyên nền như bản mobile. */
@media (min-width: 768px) {
  .jade-phoenix-theme {
    background: var(--tc-f2ead8, #f2ead8);
  }

  .jade-invitation {
    width: min(900px, 100%);
    margin: 0 auto;
    background: var(--theme-bg);
    box-shadow: 0 0 44px rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.16);
  }
}
</style>
