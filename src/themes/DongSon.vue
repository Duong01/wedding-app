<template>
  <div class="dong-son-wedding" :style="colorVars">
    <!-- OPENING -->
    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen" :sections="sections" />

    <template v-else>
      <main class="invitation">
        <!-- HERO -->
        <section v-if="showHero" class="section hero-section">
          <WeddingHero
            :wedding="wedding"
            :monogram="monogram"
            :date-label="heroDateLabel"
          />
        </section>

        <!-- COUPLE -->
        <section v-if="showCouple" class="section couple-section">
          <WeddingCouple :wedding="wedding" :sections="sections" />
        </section>

        <!-- STORY -->
        <section v-if="showStory && useMilestoneStory" class="section story-section">
          <StoryMilestones :wedding="wedding" />
        </section>

        <section
          v-else-if="showStory && wedding?.story"
          class="section story-section"
        >
          <WeddingStory :story="wedding.story" :sections="sections" />
        </section>

        <!-- EVENTS -->
        <section
          v-if="showEvents && events.length"
          class="section events-section"
        >
          <WeddingEvents :events="events" :settings="settings" :sections="sections" />
        </section>

        <!-- ============ VIDEO CƯỚI ============ -->

        <section v-if="showVideo" class="section story-section">
        <VideoSection :wedding="wedding" />
        </section>

        <!-- ============ TRÒ CHƠI ============ -->

        <section v-if="showGame" class="section gallery-section">
        <GameSection :wedding="wedding" />
        </section>

        <!-- COUNTDOWN -->
        <section v-if="showCountdown" class="section countdown-section">
          <WeddingCountdown :countdown="wedding?.countdown" :sections="sections" />
        </section>

        <!-- GALLERY -->
        <section
          v-if="showGallery && gallery.length"
          class="section gallery-section"
        >
          <WeddingGallery :layout="wedding?.settings?.GalleryLayout" :gallery="gallery" :sections="sections" />
        </section>

        <!-- TIMELINE -->
        <section
          v-if="showTimeLine && (timeline.length || events.length)"
          class="section timeline-section"
        >
          <Timeline :timeline="timeline" :events="events" :sections="sections" />
        </section>

        <!-- GIFTS -->
        <section v-if="showGift && gifts.length" class="section gift-section">
          <WeddingGifts :gifts="gifts" :sections="sections" />
        </section>

        <!-- GUEST BOOK -->
        <section v-if="showGuestBook" class="section guestbook-section">
          <WeddingWishes :wishes="wishes" :wedding="wedding" :sections="sections" />
        </section>

        <!-- FOOTER -->
        <section v-if="showFooter" class="section footer-section">
          <WeddingFooter
            :wedding="wedding"
            :monogram="monogram"
            :current-year="currentYear"
          />
        </section>
      </main>

      <FloatingMusic
        v-if="showMusic"
        ref="floatingMusicRef"
        :music="heroMusic"
      />
    </template>

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

import OpeningScreen from "@/page/DongSon/OpeningScreen.vue";

import WeddingHero from "@/page/DongSon/WeddingHero.vue";

import WeddingCouple from "@/page/DongSon/WeddingCouple.vue";

import WeddingStory from "@/page/DongSon/WeddingStory.vue";

import WeddingEvents from "@/page/DongSon/WeddingEvents.vue";

import WeddingCountdown from "@/page/DongSon/WeddingCountdown.vue";

import WeddingGallery from "@/page/DongSon/WeddingGallery.vue";

import Timeline from "@/page/DongSon/Timeline.vue";

import WeddingGifts from "@/page/DongSon/WeddingGifts.vue";

import WeddingWishes from "@/page/DongSon/WeddingWishes.vue";

import WeddingFooter from "@/page/DongSon/WeddingFooter.vue";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
  startOpened: {
    type: Boolean,
    default: false,
  },
});

/* Màu chủ thiệp chỉnh trong editor (xem useThemeColorVars) */
const { colorVars } = useThemeColorVars(() => props.wedding);

/* Tiêu đề mục người dùng sửa ở panel "Tiêu đề mục" */
const sections = computed(() => props.wedding?.sections || {});

const emit = defineEmits(["open"]);

const wedding = computed(() => props.wedding)

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
  Array.isArray(wedding.value?.guestBook?.Guest)
    ? wedding.value.guestBook.Guest
    : []
);

const settings = computed(() => wedding.value?.settings || {});

const showHero = computed(() => settings.value.ShowHero !== false);

const showCouple = computed(() => settings.value.ShowCouple !== false);

const showStory = computed(() => settings.value.ShowStory !== false);

const showEvents = computed(() => settings.value.ShowEvents !== false);

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

const showTimeLine = computed(() => settings.value.ShowTimeline !== false);

const showGift = computed(() => settings.value.ShowGift === true);

const showGuestBook = computed(() => settings.value.ShowGuestBook === true);

const showMusic = computed(
  () =>
    wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true
);

const showFooter = computed(() => settings.value.ShowFooter !== false);

const monogram = computed(() => {
  const groom = (wedding.value?.GroomName || wedding.value?.groomName || "G")
    .trim()
    .charAt(0);

  const bride = (wedding.value?.BrideName || wedding.value?.brideName || "B")
    .trim()
    .charAt(0);

  return `${groom}&${bride}`.toUpperCase();
});

function formatDate(date) {
  if (!date) return "";

  const parsed = dayjs(date);

  if (!parsed.isValid()) return "";

  return parsed.format("DD · MM · YYYY");
}

const openDateLabel = computed(() => formatDate(wedding.value?.weddingDate));

const heroDateLabel = computed(() =>
  formatDate(wedding.value?.hero?.WeddingDate || wedding.value?.hero?.weddingDate || wedding.value?.weddingDate)
);

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
.dong-son-wedding {
  --dong-red: var(--tc-8f241c, #8f241c);
  --dong-red-dark: var(--tc-54120f, #54120f);
  --dong-red-deep: var(--tc-350b0a, #350b0a);

  --dong-bronze: var(--tc-a96b32, #a96b32);
  --dong-gold: var(--tc-c99552, #c99552);
  --dong-gold-light: var(--tc-d9b678, #d9b678);

  --dong-ivory: var(--tc-f3ead8, #f3ead8);
  --dong-paper: var(--tc-eee3cd, #eee3cd);
  --dong-text: var(--tc-641914, #641914);

  /* Khung nổi bật cho từng mục */
  --dong-frame: rgba(var(--tc-a96b32-rgb, 169, 107, 50), 0.55);
  --dong-frame-inner: rgba(var(--tc-a96b32-rgb, 169, 107, 50), 0.3);
  --dong-frame-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);

  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  background: linear-gradient(135deg, var(--tc-1a0a08, #1a0a08) 0%, var(--tc-24100e, #24100e) 50%, var(--tc-1a0a08, #1a0a08) 100%);
}

.dong-son-wedding *,
.dong-son-wedding *::before,
.dong-son-wedding *::after {
  box-sizing: border-box;
}

.dong-son-wedding img {
  display: block;
  max-width: 100%;
}

.dong-son-wedding button,
.dong-son-wedding input,
.dong-son-wedding textarea {
  font: inherit;
}

.invitation {
  position: relative;
  width: min(48rem, 100%);
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  overflow: hidden;

  background: radial-gradient(
      circle at 50% 0,
      rgba(var(--tc-c99552-rgb, 201, 149, 82), 0.12),
      transparent 35%
    ),
    radial-gradient(
      circle at 50% 100%,
      rgba(var(--tc-8b241c-rgb, 139, 36, 28), 0.08),
      transparent 40%
    ),
    var(--dong-paper);

  box-shadow:
    0 20px 70px rgba(0, 0, 0, 0.5),
    inset 0 0 0 1px rgba(var(--tc-a96b32-rgb, 169, 107, 50), 0.2);
}

.section {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/*
 * Khung nổi bật cho từng mục: viền vàng đồng đậm + viền trong
 * mảnh, đổ bóng tách khỏi nền thiệp. Hero đã có khung riêng.
 */
.section:not(.hero-section) {
  margin: 0 14px 18px;

  border: 1px solid var(--dong-frame);
  border-radius: 4px;

  box-shadow: var(--dong-frame-shadow);
}

.section:not(.hero-section)::after {
  content: "";

  position: absolute;
  inset: 6px;

  border: 1px solid var(--dong-frame-inner);

  pointer-events: none;

  z-index: 5;
}

.hero-section {
  padding: 0;
  border-bottom: 2px solid rgba(var(--tc-a96b32-rgb, 169, 107, 50), 0.3);
}

.couple-section,
.story-section,
.events-section,
.countdown-section,
.gallery-section,
.map-section,
.timeline-section,
.gift-section,
.guestbook-section,
.footer-section {
  padding: 0;
  border-bottom: 1px solid var(--dong-frame);
}

.footer-section {
  border-bottom: none;
}

/* Decorative separator with traditional pattern */
.section:not(.hero-section)::before {
  content: "◆ ◇ ◆ ◇ ◆";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: auto;
  text-align: center;
  color: rgba(var(--tc-a96b32-rgb, 169, 107, 50), 0.55);
  font-size: 10px;
  letter-spacing: 0.3em;
  padding: 12px 0;
  pointer-events: none;
  z-index: 6;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section {
  animation: fade-in 0.6s ease-out forwards;
}

/* Mobile */
@media (max-width: 600px) {
  .invitation {
    width: 100%;
    box-shadow: none;
    border-radius: 0;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .dong-son-wedding {
    background: var(--tc-f2ead8, #f2ead8);
  }

  .invitation {
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
  }
}
</style>