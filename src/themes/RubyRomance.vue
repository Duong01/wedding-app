<template>
  <div class="ruby-romance-theme">
    <OpeningScreen v-if="!opened" :wedding="wedding" :monogram="monogram" :date-label="openDateLabel" :sections="sections" @open="handleOpen" />
    <main v-else class="ruby-invitation">
      <WeddingHero v-if="showHero" :wedding="wedding" :monogram="monogram" :date-label="heroDateLabel" :event="primaryEvent" :guest-name="guestName" />

      <div class="ruby-content">
        <section v-if="showCouple" class="ruby-section"><WeddingCouple :wedding="wedding" :guest-name="guestName" :sections="sections" /></section>
        <section v-if="showStory && useMilestoneStory" class="ruby-section"><StoryMilestones :wedding="wedding" /></section>
        <section v-if="showStory && !useMilestoneStory && wedding?.story" class="ruby-section"><WeddingStory :story="wedding.story" :sections="sections" /></section>

        <section v-if="showEvents && events.length" class="ruby-section"><WeddingEvents :events="events" :recipient-name="wedding?.recipientName" :sections="sections" :settings="settings" /></section>

        <!-- ============ VIDEO CƯỚI ============ -->

        <section v-if="showVideo" class="ruby-section"><VideoSection :wedding="wedding" /></section>

        <!-- ============ TRÒ CHƠI ============ -->

        <section v-if="showGame" class="ruby-section"><GameSection :wedding="wedding" /></section>
        <section v-if="showTimeline && timeline.length" class="ruby-section"><Timeline :timeline="timeline" :events="events" :sections="sections" /></section>
        <section v-if="showCountdown" class="ruby-section"><WeddingCountdown :countdown="countdownTarget" :wedding-date="wedding?.weddingDate" :sections="sections" /></section>
        <section v-if="showGallery && gallery.length" class="ruby-section"><WeddingGallery :gallery="gallery" :sections="sections" /></section>

      </div>
      <section v-if="showGift && gifts.length" class="ruby-section"><WeddingGifts :gifts="gifts" :sections="sections" /></section>
      <section v-if="showGuestBook" class="ruby-section"><WeddingWishes :wishes="wishes" :wedding="wedding" :sections="sections" /></section>

      <WeddingFooter v-if="showFooter" :wedding="wedding" :monogram="monogram" :current-year="currentYear" :sections="sections" />
      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="heroMusic" />
    </main>

  <!-- Hiệu ứng mùa theo ngày cưới: hoa rơi / nắng / lá rơi / tuyết -->
  <SeasonFx :wedding="wedding" />
</div>
</template>

<script setup>
import { computed, nextTick, ref, onMounted } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";

import SeasonFx from "@/components/common/SeasonFx.vue";
import VideoSection from "@/components/common/VideoSection.vue";
import GameSection from "@/components/common/GameSection.vue";
import StoryMilestones from "@/components/common/StoryMilestones.vue";

import OpeningScreen from "@/page/RubyRomance/OpeningScreen.vue";
import WeddingHero from "@/page/RubyRomance/WeddingHero.vue";
import WeddingCouple from "@/page/RubyRomance/WeddingCouple.vue";
import WeddingStory from "@/page/RubyRomance/WeddingStory.vue";
import WeddingEvents from "@/page/RubyRomance/WeddingEvents.vue";
import WeddingCountdown from "@/page/RubyRomance/WeddingCountdown.vue";
import WeddingGallery from "@/page/RubyRomance/WeddingGallery.vue";
import Timeline from "@/page/RubyRomance/Timeline.vue";
import WeddingGifts from "@/page/RubyRomance/WeddingGifts.vue";
import WeddingWishes from "@/page/RubyRomance/WeddingWishes.vue";
import WeddingFooter from "@/page/RubyRomance/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true }, startOpened: { type: Boolean, default: false } });

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
.ruby-romance-theme {
  --theme-primary: #8c2f42;
  --theme-secondary: #c46a7e;
  --theme-accent: #e8b4be;
  --theme-bg: #fdf7f8;
  --theme-panel: rgba(255,255,255,0.72);
  --theme-text: #5c2430;
  min-height: 100vh;
  width: 100%;
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: "Cormorant Garamond", Georgia, serif;
}

.ruby-invitation { width: 100%; }
.ruby-content { padding: 0 20px 30px; background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(245,216,222,0.8)); }
.ruby-section { max-width: 1100px; margin: 0 auto 22px; }

/* Màn hình rộng: nền ngoài thiệp là màu giấy, thiệp ở giữa
   giữ nguyên nền như bản mobile. */
@media (min-width: 768px) {
  .ruby-romance-theme {
    background: #f2ead8;
  }

  .ruby-invitation {
    width: min(900px, 100%);
    margin: 0 auto;
    background: var(--theme-bg);
    box-shadow: 0 0 44px rgba(110, 38, 50, 0.16);
  }
}
</style>
