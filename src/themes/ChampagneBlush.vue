<template>
  <div class="champagne-blush-theme" :style="colorVars">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" @open="handleOpen" :sections="sections" />
    <main v-else class="champagne-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="champagne-content">
        <section v-if="showCouple" class="champagne-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" :sections="sections" /></section>
        <section v-if="showStory && useMilestoneStory" class="champagne-section"><StoryMilestones :wedding="wedding" /></section>
        <section v-if="showStory && !useMilestoneStory && wedding?.story" class="champagne-section"><WeddingStory :story="wedding.story" :sections="sections" /></section>

        <section v-if="showEvents && events.length" class="champagne-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" :settings="settings" :sections="sections" /></section>

        <!-- ============ VIDEO CƯỚI ============ -->

        <section v-if="showVideo" class="champagne-section"><VideoSection :wedding="wedding" /></section>

        <!-- ============ TRÒ CHƠI ============ -->

        <section v-if="showGame" class="champagne-section"><GameSection :wedding="wedding" /></section>
        <section v-if="showTimeline && timeline.length" class="champagne-section"><Timeline :timeline="timeline" :events="events" :sections="sections" /></section>
        <section v-if="showCountdown" class="champagne-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" :sections="sections" /></section>
        <section v-if="showGallery && gallery.length" class="champagne-section"><WeddingGallery :layout="wedding?.settings?.GalleryLayout" :gallery="gallery" :sections="sections" /></section>

      </div>
      <section v-if="showGift && gifts.length" class="champagne-section"><WeddingGifts :gifts="gifts" :sections="sections" /></section>
      <section v-if="showGuestBook" class="champagne-section"><WeddingWishes :wishes="wishes" :wedding="wedding" :sections="sections" /></section>

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

import OpeningScreen from "@/page/ChampagneBlush/OpeningScreen.vue";
import WeddingHero from "@/page/ChampagneBlush/WeddingHero.vue";
import WeddingCouple from "@/page/ChampagneBlush/WeddingCouple.vue";
import WeddingStory from "@/page/ChampagneBlush/WeddingStory.vue";
import WeddingEvents from "@/page/ChampagneBlush/WeddingEvents.vue";
import WeddingCountdown from "@/page/ChampagneBlush/WeddingCountdown.vue";
import WeddingGallery from "@/page/ChampagneBlush/WeddingGallery.vue";
import Timeline from "@/page/ChampagneBlush/Timeline.vue";
import WeddingGifts from "@/page/ChampagneBlush/WeddingGifts.vue";
import WeddingWishes from "@/page/ChampagneBlush/WeddingWishes.vue";
import WeddingFooter from "@/page/ChampagneBlush/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true }, startOpened: { type: Boolean, default: false } });

/* Màu chủ thiệp chỉnh trong editor (xem useThemeColorVars) */
const { colorVars } = useThemeColorVars(() => props.wedding);

/* Tiêu đề mục người dùng sửa ở panel "Tiêu đề mục" */
const sections = computed(() => props.wedding?.sections || {});

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
.champagne-blush-theme {
  --theme-primary: var(--tc-6c4b4a, #6c4b4a);
  --theme-secondary: var(--tc-b67f7d, #b67f7d);
  --theme-accent: var(--tc-ead2b6, #ead2b6);
  --theme-bg: var(--tc-fffaf7, #fffaf7);
  --theme-panel: rgba(255,255,255,0.7);
  --theme-text: var(--tc-453533, #453533);
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.champagne-invitation { width: 100%; }
.champagne-content { padding: 0 20px 30px; background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(var(--tc-f4eee8-rgb, 244, 238, 232), 0.82)); }
.champagne-section { max-width: 1100px; margin: 0 auto 22px; }

/* Màn hình rộng: nền ngoài thiệp là màu giấy, thiệp ở giữa
   giữ nguyên nền như bản mobile. */
@media (min-width: 768px) {
  .champagne-blush-theme {
    background: var(--tc-f2ead8, #f2ead8);
  }

  .champagne-invitation {
    width: min(900px, 100%);
    margin: 0 auto;
    background: var(--theme-bg);
    box-shadow: 0 0 44px rgba(var(--tc-6c4b4a-rgb, 108, 75, 74), 0.16);
  }
}
</style>
