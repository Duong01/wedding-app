<template>
  <div class="double-happiness-theme" :style="colorVars">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" :sections="sections" @open="handleOpen" />
    <main v-else class="dh-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="dh-content">
        <section v-if="showCouple" class="dh-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" :sections="sections" /></section>
        <section v-if="showStory && useMilestoneStory" class="dh-section"><StoryMilestones :wedding="wedding" /></section>
        <section v-if="showStory && !useMilestoneStory && wedding?.story" class="dh-section"><WeddingStory :story="wedding.story" :sections="sections" /></section>

        <section v-if="showEvents && events.length" class="dh-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" :sections="sections" :settings="settings" /></section>

        <!-- ============ VIDEO CƯỚI ============ -->

        <section v-if="showVideo" class="dh-section"><VideoSection :wedding="wedding" /></section>

        <!-- ============ TRÒ CHƠI ============ -->

        <section v-if="showGame" class="dh-section"><GameSection :wedding="wedding" /></section>
        <section v-if="showTimeline && timeline.length" class="dh-section"><Timeline :timeline="timeline" :events="events" :sections="sections" /></section>
        <section v-if="showCountdown" class="dh-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" :sections="sections" /></section>
        <section v-if="showGallery && gallery.length" class="dh-section"><WeddingGallery :layout="wedding?.settings?.GalleryLayout" :gallery="gallery" :sections="sections" /></section>

      </div>
      <section v-if="showGift && gifts.length" class="dh-section"><WeddingGifts :gifts="gifts" :sections="sections" /></section>
      <section v-if="showGuestBook" class="dh-section"><WeddingWishes :wishes="wishes" :wedding="wedding" :sections="sections" /></section>

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

import OpeningScreen from "@/page/DoubleHappiness/OpeningScreen.vue";
import WeddingHero from "@/page/DoubleHappiness/WeddingHero.vue";
import WeddingCouple from "@/page/DoubleHappiness/WeddingCouple.vue";
import WeddingStory from "@/page/DoubleHappiness/WeddingStory.vue";
import WeddingEvents from "@/page/DoubleHappiness/WeddingEvents.vue";
import WeddingCountdown from "@/page/DoubleHappiness/WeddingCountdown.vue";
import WeddingGallery from "@/page/DoubleHappiness/WeddingGallery.vue";
import Timeline from "@/page/DoubleHappiness/Timeline.vue";
import WeddingGifts from "@/page/DoubleHappiness/WeddingGifts.vue";
import WeddingWishes from "@/page/DoubleHappiness/WeddingWishes.vue";
import WeddingFooter from "@/page/DoubleHappiness/WeddingFooter.vue";

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
.double-happiness-theme {
  --theme-primary: var(--tc-7a1216, #7a1216);
  --theme-secondary: var(--tc-a32a2a, #a32a2a);
  --theme-accent: var(--tc-d9a441, #d9a441);
  --theme-bg: var(--tc-5c0e10, #5c0e10);
  --theme-panel: rgba(var(--tc-7a1216-rgb, 122, 18, 22), 0.85);
  --theme-text: var(--tc-f7e6c4, #f7e6c4);
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background:
    radial-gradient(900px 420px at 50% -120px, rgba(var(--tc-d9a441-rgb, 217, 164, 65), 0.14), transparent 65%),
    linear-gradient(180deg, var(--tc-7a1216, #7a1216) 0%, var(--tc-6b1013, #6b1013) 40%, var(--tc-5c0e10, #5c0e10) 100%);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.dh-invitation { width: 100%; }

.dh-content {
  padding: 0 20px 30px;
  background:
    linear-gradient(180deg, rgba(var(--tc-5c0e10-rgb, 92, 14, 16), 0.4), rgba(var(--tc-5c0e10-rgb, 92, 14, 16), 0.72)),
    repeating-linear-gradient(45deg, rgba(var(--tc-d9a441-rgb, 217, 164, 65), 0.035) 0 2px, transparent 2px 14px);
}

.dh-section { max-width: 1100px; margin: 0 auto 22px; }

/* Màn hình rộng: nền ngoài thiệp là màu giấy, thiệp ở giữa
   giữ nguyên nền như bản mobile. */
@media (min-width: 768px) {
  .double-happiness-theme {
    background: var(--tc-f2ead8, #f2ead8);
  }

  .dh-invitation {
    width: min(900px, 100%);
    margin: 0 auto;
    background:
      radial-gradient(900px 420px at 50% -120px, rgba(var(--tc-d9a441-rgb, 217, 164, 65), 0.14), transparent 65%),
      linear-gradient(180deg, var(--tc-7a1216, #7a1216) 0%, var(--tc-6b1013, #6b1013) 40%, var(--tc-5c0e10, #5c0e10) 100%);
    box-shadow: 0 0 44px rgba(0, 0, 0, 0.35);
  }
}
</style>
