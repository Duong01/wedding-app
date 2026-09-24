<template>
  <div class="traditional-red" :data-theme="theme.Name" :style="themeStyle">
    <!-- =====================================================
         MÀN HÌNH MỞ THIỆP
    ====================================================== -->

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :guest-name="guestName"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <!-- =====================================================
         THIỆP
    ====================================================== -->

    <main v-else class="tr-invitation">
      <!-- HOA VĂN CHÌM TOÀN THIỆP -->
      <div
        class="tr-invitation__pattern"
        aria-hidden="true"
        :style="{ backgroundImage: `url(${rongPhuong})` }"
      ></div>

      <!-- ============ HERO ============ -->

      <WeddingHero :wedding="wedding" />

      <!-- ============ NỘI DUNG ============ -->

      <div class="tr-invitation__body">
        <img
          :src="cloud"
          alt=""
          aria-hidden="true"
          class="tr-invitation__cloud tr-invitation__cloud--1"
        />
        <img
          :src="cloud"
          alt=""
          aria-hidden="true"
          class="tr-invitation__cloud tr-invitation__cloud--2"
        />
        <img
          :src="cloud"
          alt=""
          aria-hidden="true"
          class="tr-invitation__cloud tr-invitation__cloud--3"
        />
        <img
          :src="cloud"
          alt=""
          aria-hidden="true"
          class="tr-invitation__cloud tr-invitation__cloud--4"
        />
        <img
          :src="cloud"
          alt=""
          aria-hidden="true"
          class="tr-invitation__cloud tr-invitation__cloud--5"
        />
        <img
          :src="cloud"
          alt=""
          aria-hidden="true"
          class="tr-invitation__cloud tr-invitation__cloud--6"
        />

        <div class="tr-paper">
          <WeddingInfo :wedding="wedding" />

          <WeddingGallery
            v-if="showGallery && gallery.length"
            :gallery="gallery"
          />

          <WeddingEvents
            v-if="showEvents && events.length"
            :events="events"
            :wedding="wedding"
            :recipient-name="wedding.recipientName"
            :countdown="wedding.countdown"
            :settings="settings"
          />
        </div>
      </div>

      <!-- ============ BẢN ĐỒ ============ -->

      <div class="tr-invitation__map">
        <div
          class="tr-invitation__pattern tr-invitation__pattern--flip"
          aria-hidden="true"
          :style="{ backgroundImage: `url(${rongPhuong})` }"
        ></div>

        <WeddingMap v-if="showMap && events.length" :events="events" />

        <Timeline
          v-if="showTimeline && timeline.length"
          :timeline="timeline"
        />

        <WeddingWishes
          v-if="showGuestBook"
          :wishes="wishes"
          :wedding="wedding"
        />

        <WeddingGifts
          v-if="showGift && gifts.length"
          :gifts="gifts"
          :wedding="wedding"
        />
      </div>

      <!-- ============ FOOTER ============ -->

      <WeddingFooter v-if="showFooter" :wedding="wedding" />

      <!-- ============ NHẠC ============ -->

      <FloatingMusic
        v-if="showMusic"
        ref="floatingMusicRef"
        :music="heroMusic"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, onMounted } from "vue";

import dayjs from "dayjs";

import FloatingMusic from "@/components/common/FloatingMusic.vue";

import OpeningScreen from "@/page/TraditionalRed/OpeningScreen.vue";
import WeddingHero from "@/page/TraditionalRed/WeddingHero.vue";
import WeddingInfo from "@/page/TraditionalRed/WeddingInfo.vue";
import WeddingGallery from "@/page/TraditionalRed/WeddingGallery.vue";
import WeddingEvents from "@/page/TraditionalRed/WeddingEvents.vue";
import WeddingMap from "@/page/TraditionalRed/WeddingMap.vue";
import Timeline from "@/page/TraditionalRed/Timeline.vue";
import WeddingWishes from "@/page/TraditionalRed/WeddingWishes.vue";
import WeddingGifts from "@/page/TraditionalRed/WeddingGifts.vue";
import WeddingFooter from "@/page/TraditionalRed/WeddingFooter.vue";

import { rongPhuong, cloud } from "@/page/TraditionalRed/traditionalRedAssets";

import { useWeddingTheme } from "@/composables/useWeddingTheme";

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

const emit = defineEmits(["open"]);

const { theme, themeStyle } = useWeddingTheme(props.wedding);

const wedding = computed(() => props.wedding || {});

/* =========================================================
   TRẠNG THÁI
========================================================= */

const opened = ref(props.startOpened);

const floatingMusicRef = ref(null);

/* =========================================================
   DỮ LIỆU
========================================================= */

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

/* =========================================================
   CỜ HIỂN THỊ
========================================================= */

const showEvents = computed(() => settings.value.ShowEvents !== false);
const showTimeline = computed(() => settings.value.ShowTimeline !== false);
const showGallery = computed(() => settings.value.ShowGallery === true);
const showMap = computed(() => settings.value.ShowMap === true);
const showGift = computed(() => settings.value.ShowGift === true);
const showGuestBook = computed(() => settings.value.ShowGuestBook === true);
const showFooter = computed(() => settings.value.ShowFooter !== false);

const showMusic = computed(
  () =>
    wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true
);

/* =========================================================
   TÊN KHÁCH MỜI
   recipientName từ API là mảng [{ Token, Name }]
========================================================= */

const guestName = computed(
  () =>
    (Array.isArray(wedding.value?.recipientName)
      ? wedding.value.recipientName[0]?.Name
      : wedding.value?.recipientName?.Name) ||
    wedding.value?.guestName ||
    "Quý khách"
);

/* =========================================================
   NGÀY
========================================================= */

function formatDate(date) {
  const value = dayjs(date);

  return value.isValid() ? value.format("DD · MM · YYYY") : "";
}

const openDateLabel = computed(() => formatDate(wedding.value?.weddingDate));

/* =========================================================
   NHẠC
   Ưu tiên wedding.music, fallback hero.Music.
========================================================= */

const heroMusic = computed(() => {
  const music = wedding.value?.music || {};

  const heroUrl = wedding.value?.hero?.Music;

  if (music.Url || !heroUrl) {
    return music;
  }

  return { ...music, Url: heroUrl };
});

/* =========================================================
   MỞ THIỆP
========================================================= */

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

.traditional-red {
  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow-x: hidden;

  background-color: #680e0e;

  color: #ffe3b1;

  font-family: "Baskerville", "Times New Roman", serif;

  -webkit-font-smoothing: antialiased;

  text-rendering: optimizeLegibility;
}

/* =========================================================
   KHUNG THIỆP
========================================================= */

.tr-invitation {
  position: relative;

  width: 100%;
  max-width: 480px;

  min-height: 100dvh;

  margin: 0 auto;

  overflow: hidden;

  background-color: #680e0e;

  color: #ffe3b1;
}

/* =========================================================
   HOA VĂN CHÌM
========================================================= */

.tr-invitation__pattern {
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  z-index: 0;

  pointer-events: none;

  opacity: 0.06;

  background-repeat: repeat-y;

  background-position: center top;

  background-size: 100% auto;
}

.tr-invitation__pattern--flip {
  transform: scaleX(-1);
}

/* =========================================================
   THÂN THIỆP
========================================================= */

.tr-invitation__body {
  position: relative;

  z-index: 10;

  padding: 0 12px;
}

/* =========================================================
   KHỐI GIẤY
   Bốn góc khoét tròn để lộ nền đỏ phía sau.
========================================================= */

.tr-paper {
  position: relative;

  z-index: 10;

  padding: 40px 16px;

  background: radial-gradient(circle at 0 0, #680e0e 35px, transparent 35px),
    radial-gradient(circle at 100% 0, #680e0e 35px, transparent 35px),
    radial-gradient(circle at 0 100%, #680e0e 35px, transparent 35px),
    radial-gradient(circle at 100% 100%, #680e0e 35px, transparent 35px),
    url("@/assets/longphung/bg-frame.jpg");

  background-size: 70px 70px, 70px 70px, 70px 70px, 70px 70px, cover;

  background-position: top left, top right, bottom left, bottom right, center;

  background-repeat: no-repeat;
}

/* =========================================================
   MÂY TRANG TRÍ
========================================================= */

.tr-invitation__cloud {
  position: absolute;

  width: 150px;
  height: 70px;

  object-fit: contain;

  pointer-events: none;
}

.tr-invitation__cloud--1 {
  top: 15%;
  left: -64px;

  z-index: 0;
}

.tr-invitation__cloud--2 {
  top: 28%;
  right: -32px;

  z-index: 0;
}

.tr-invitation__cloud--3 {
  top: 65%;
  left: -80px;

  z-index: 20;
}

.tr-invitation__cloud--4 {
  top: 72%;
  right: -32px;

  z-index: 0;
}

.tr-invitation__cloud--5 {
  top: 1%;
  right: -48px;

  z-index: 20;
}

.tr-invitation__cloud--6 {
  bottom: -10%;
  left: -48px;

  z-index: 20;
}

.tr-invitation__map {
  position: relative;

  width: 100%;
}

.tr-invitation__map > * {
  position: relative;

  z-index: 10;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-invitation {
    max-width: 900px;

    border-left: 1px solid rgba(255, 227, 177, 0.13);
    border-right: 1px solid rgba(255, 227, 177, 0.13);
  }

  .tr-invitation__body {
    padding: 0 16px;
  }

  .tr-paper {
    padding: 56px 24px;
  }

  .tr-invitation__cloud {
    width: 210px;
    height: 100px;
  }

  .tr-invitation__cloud--1 {
    left: -80px;
  }

  .tr-invitation__cloud--2 {
    right: -64px;
  }

  .tr-invitation__cloud--3 {
    left: -64px;
  }

  .tr-invitation__cloud--4 {
    right: -64px;
  }

  .tr-invitation__cloud--5 {
    right: -48px;
  }

  .tr-invitation__cloud--6 {
    left: -48px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .traditional-red *,
  .traditional-red *::before,
  .traditional-red *::after {
    animation-duration: 0.01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: 0.01ms !important;
  }
}
</style>
