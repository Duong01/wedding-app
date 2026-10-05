<template>
  <div ref="rootRef" class="shc-theme" :data-theme="theme.Name" :style="themeStyle">
    <!-- =====================================================
         MÀN HÌNH MỞ THIỆP
    ====================================================== -->

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen" :sections="sections" />

    <!-- =====================================================
         THIỆP
    ====================================================== -->

    <main v-else class="shc-invitation">
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

      <WeddingCouple v-if="showCouple" :wedding="wedding" :guest-name="guestName" :sections="sections" />
      <WeddingStory
        v-if="showStory && wedding?.story"
        :story="wedding.story" :sections="sections" />
      <WeddingGallery :layout="wedding?.settings?.GalleryLayout" v-if="showGallery && gallery.length" :gallery="gallery" :sections="sections" />

      <WeddingEvents
        v-if="showEvents && events.length"
        :events="events"
        :recipient-name="wedding?.recipientName"
        :settings="settings" :sections="sections" />

      <!-- ============ VIDEO CƯỚI ============ -->

      <VideoSection v-if="showVideo" :wedding="wedding" />

      <!-- ============ TRÒ CHƠI ============ -->

      <GameSection v-if="showGame" :wedding="wedding" />

      <DressCode v-if="showDressCode" :sections="sections" />

      <Timeline v-if="showTimeline && timeline.length" :timeline="timeline" :events="events" :sections="sections" />

      <WeddingWishes v-if="showGuestBook" :wishes="wishes" :wedding="wedding" :sections="sections" />

      <StoryMilestones
        v-if="showStory && useMilestoneStory"
        :wedding="wedding"
      />

      

      <WeddingGifts
        v-if="showGift && gifts.length"
        :gifts="gifts"
        :wishes="wishes" :sections="sections" />

      <WeddingFooter
        v-if="showFooter"
        :wedding="wedding"
        :monogram="monogram"
        :current-year="currentYear"
      />

      <FloatingMusic v-if="showMusic" ref="floatingMusicRef" :music="heroMusic" />
    </main>

  <!-- Hiệu ứng mùa theo ngày cưới: hoa rơi / nắng / lá rơi / tuyết -->
  <SeasonFx :wedding="wedding" />
</div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import dayjs from "dayjs";

import FloatingMusic from "@/components/common/FloatingMusic.vue";

import SeasonFx from "@/components/common/SeasonFx.vue";
import VideoSection from "@/components/common/VideoSection.vue";
import GameSection from "@/components/common/GameSection.vue";
import StoryMilestones from "@/components/common/StoryMilestones.vue";

import { useWeddingTheme } from "@/composables/useWeddingTheme";

import OpeningScreen from "@/page/SongHacRed/OpeningScreen.vue";
import WeddingHero from "@/page/SongHacRed/WeddingHero.vue";
import WeddingCouple from "@/page/SongHacRed/WeddingCouple.vue";
import WeddingStory from "@/page/SongHacRed/WeddingStory.vue";
import WeddingEvents from "@/page/SongHacRed/WeddingEvents.vue";
import WeddingGallery from "@/page/SongHacRed/WeddingGallery.vue";
import DressCode from "@/page/SongHacRed/DressCode.vue";
import Timeline from "@/page/SongHacRed/Timeline.vue";
import WeddingGifts from "@/page/SongHacRed/WeddingGifts.vue";
import WeddingWishes from "@/page/SongHacRed/WeddingWishes.vue";
import WeddingFooter from "@/page/SongHacRed/WeddingFooter.vue";
import { t } from "@/lang";
const props = defineProps({ wedding: { type: Object, required: true }, startOpened: { type: Boolean, default: false } });

/* Tiêu đề mục người dùng sửa ở panel "Tiêu đề mục" */
const sections = computed(() => props.wedding?.sections || {});

const emit = defineEmits(["open"]);

const wedding = computed(() => props.wedding || {});

/*
 * Bảng màu / font lấy từ theme của thiệp (xem useWeddingTheme),
 * fallback về tông "song hạc đỏ" khi dữ liệu chưa có.
 */
const { theme, themeStyle } = useWeddingTheme(() => props.wedding);

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
const rootRef = ref(null);
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
    t("Quý khách")
);

const showHero = computed(() => settings.value.ShowHero !== false);
const showCouple = computed(() => settings.value.ShowCouple !== false);
const showStory = computed(() => settings.value.ShowStory !== false);
const showEvents = computed(() => settings.value.ShowEvents !== false);
const showTimeline = computed(() => settings.value.ShowTimeline !== false);
const showGallery = computed(() => settings.value.ShowGallery === true);
const showVideo = computed(() => settings.value.ShowVideo === true);
const showGame = computed(() => settings.value.ShowGame === true);
const showDressCode = computed(() => settings.value.ShowDressCode !== false);
const showGift = computed(() => settings.value.ShowGift === true);
const showGuestBook = computed(() => settings.value.ShowGuestBook === true);
const showFooter = computed(() => settings.value.ShowFooter !== false);
const showMusic = computed(
  () => wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true
);

/*
 * Story 2 chế độ: danh sách dấu mốc thay cho khối văn bản.
 */
const useMilestoneStory = computed(
  () =>
    wedding.value?.story?.Mode === "milestones" &&
    (wedding.value?.storyMilestones || []).length > 0
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

/* =========================================================
   BIẾN MÀU CHO MODAL TELEPORT
   ---------------------------------------------------------
   Dialog quà / lightbox teleport ra <body> — ngoài .shc-theme
   nên không kế thừa biến màu. Chép sang <body> như
   BohoTerracotta / EmeraldLuxe để modal không mất màu.
========================================================= */

const BODY_VARS = [
  "--primary",
  "--secondary",
  "--accent",
  "--accent-light",
  "--background",
  "--text",
  "--text-secondary",
  "--white",
];

function syncBodyVars() {
  const root = rootRef.value;

  if (!root) return;

  const computedStyle = window.getComputedStyle(root);

  BODY_VARS.forEach((name) => {
    const value = computedStyle.getPropertyValue(name).trim();

    if (value) document.body.style.setProperty(name, value);
  });
}

function clearBodyVars() {
  BODY_VARS.forEach((name) => document.body.style.removeProperty(name));
}

onMounted(syncBodyVars);

watch(themeStyle, () => nextTick(syncBodyVars), { deep: true });

onBeforeUnmount(clearBodyVars);

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
/* =========================================================
   TRANG
========================================================= */

.shc-theme {
  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow-x: hidden;

  background-color: var(--background, #920002);

  color: var(--text, #ffe8a4);

  font-family: "Times New Roman", Times, serif;

  -webkit-font-smoothing: antialiased;

  text-rendering: optimizeLegibility;
}

/* =========================================================
   KHUNG THIỆP
========================================================= */

.shc-invitation {
  position: relative;

  width: 100%;
  max-width: 480px;

  min-height: 100dvh;

  margin: 0 auto;

  overflow: hidden;

  background-color: var(--background, #920002);

  color: var(--text, #ffe8a4);
}

/* =========================================================
   TABLET / DESKTOP
   ---------------------------------------------------------
   Màn hình rộng: nền ngoài thiệp là màu giấy, thiệp ở
   giữa giữ nguyên nền đỏ như bản mobile.
========================================================= */

@media (min-width: 768px) {
  .shc-theme {
    background-color: #f2ead8;
  }

  .shc-invitation {
    max-width: 900px;

    border-left: 1px solid rgba(255, 232, 164, 0.2);
    border-right: 1px solid rgba(255, 232, 164, 0.2);

    box-shadow: 0 0 44px rgba(92, 8, 8, 0.28);
  }
}
</style>
