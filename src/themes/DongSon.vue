<template>
  <div class="nb-wedding">

    <!-- =====================================================
         OPENING
    ====================================================== -->

    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <template v-else>

      <main class="invitation">

        <!-- =================================================
             HERO DECORATION
             Không khung
        ================================================== -->

        <img
          :src="assets.mayTo"
          class="art hero-cloud hero-cloud-left"
          alt=""
        />

        <img
          :src="assets.may"
          class="art hero-cloud-small hero-cloud-small-right"
          alt=""
        />

        <img
          :src="assets.hoa"
          class="art hero-flower hero-flower-left"
          alt=""
        />

        <img
          :src="assets.hoa"
          class="art hero-flower hero-flower-right"
          alt=""
        />


        <!-- =================================================
             HERO
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showHero"
          class="section hero-section"
        >
          <WeddingHero
            :wedding="wedding"
            :monogram="monogram"
            :date-label="heroDateLabel"
          />
        </section>


        <!-- =================================================
             THÔNG TIN LỄ CƯỚI
             CÓ KHUNG
        ================================================== -->

        <section
          v-if="showCouple"
          class="framed-section wedding-info-frame"
        >

          <div class="frame-decoration">

            <img
              :src="assets.corner"
              class="frame-corner frame-corner-tl"
              alt=""
            />

            <img
              :src="assets.corner"
              class="frame-corner frame-corner-tr"
              alt=""
            />

            <img
              :src="assets.corner"
              class="frame-corner frame-corner-bl"
              alt=""
            />

            <img
              :src="assets.corner"
              class="frame-corner frame-corner-br"
              alt=""
            />

          </div>

          <div class="framed-content">

            <WeddingCouple
              :wedding="wedding"
            />

          </div>

        </section>


        <!-- =================================================
             STORY
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showStory && wedding?.story"
          class="section story-section"
        >

          <WeddingStory
            :story="wedding.story"
          />

        </section>


        <!-- =================================================
             ALBUM
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showGallery && gallery.length"
          class="section gallery-section"
        >

          <WeddingGallery
            :gallery="gallery"
            @open="openGallery"
          />

        </section>


        <!-- =================================================
             THÔNG TIN TIỆC CƯỚI
             CÓ KHUNG
        ================================================== -->

        <section
          v-if="showEvents && events.length"
          class="framed-section party-info-frame"
        >

          <div class="frame-decoration">

            <img
              :src="assets.corner"
              class="frame-corner frame-corner-tl"
              alt=""
            />

            <img
              :src="assets.corner"
              class="frame-corner frame-corner-tr"
              alt=""
            />

            <img
              :src="assets.corner"
              class="frame-corner frame-corner-bl"
              alt=""
            />

            <img
              :src="assets.corner"
              class="frame-corner frame-corner-br"
              alt=""
            />

          </div>

          <div class="framed-content">

            <WeddingEvents
              :events="events"
            />

          </div>

        </section>


        <!-- =================================================
             COUNTDOWN
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showCountdown"
          class="section countdown-section"
        >

          <WeddingCountdown
            :countdown="wedding?.countdown"
          />

        </section>


        <!-- =================================================
             MAP
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showMap && events.length"
          class="section map-section"
        >

          <WeddingMap
            :events="events"
          />

        </section>

        <!-- =================================================
             TIMELINE
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showTimeLine && events.length"
          class="section map-section"
        >

          <Timeline
            :timeline="timeline"
            :events="events"
          />

        </section>


        <!-- =================================================
             HỘP QUÀ MỪNG
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showGift && gifts.length"
          class="section gift-section"
        >

          <WeddingGifts
            :gifts="gifts"
          />

        </section>


        <!-- =================================================
             SỔ LƯU BÚT
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showGuestBook"
          class="section guestbook-section"
        >

          <WeddingWishes
            :wishes="wishes"
            :wedding="wedding"
          />

        </section>


        <!-- =================================================
             FOOTER
             KHÔNG KHUNG
        ================================================== -->

        <section
          v-if="showFooter"
          class="section footer-section"
        >

          <WeddingFooter
            :wedding="wedding"
            :monogram="monogram"
            :current-year="currentYear"
          />

        </section>


        <!-- =================================================
             BOTTOM DECORATION
        ================================================== -->

        <img
          :src="assets.mayTo"
          class="art cloud-bottom"
          alt=""
        />

        <img
          :src="assets.longDen"
          class="art lantern-bottom"
          alt=""
        />

        <img
          :src="assets.quat"
          class="art fan-bottom"
          alt=""
        />

        <img
          :src="assets.hoa"
          class="art flower-bottom"
          alt=""
        />

      </main>


      <!-- =================================================
           MUSIC
      ================================================== -->

      <FloatingMusic
        v-if="showMusic"
        ref="floatingMusicRef"
        :music="wedding?.music"
      />

    </template>

  </div>
</template>


<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";

import FloatingMusic from "@/components/common/FloatingMusic.vue";

import OpeningScreen from "@/page/NhatBinhDo/OpeningScreen.vue";
import WeddingHero from "@/page/NhatBinhDo/WeddingHero.vue";
import WeddingCouple from "@/page/NhatBinhDo/WeddingCouple.vue";
import WeddingStory from "@/page/NhatBinhDo/WeddingStory.vue";
import WeddingEvents from "@/page/NhatBinhDo/WeddingEvents.vue";
import WeddingCountdown from "@/page/NhatBinhDo/WeddingCountdown.vue";
import WeddingGallery from "@/page/NhatBinhDo/WeddingGallery.vue";
import WeddingMap from "@/page/NhatBinhDo/WeddingMap.vue";
import Timeline from "@/page/NhatBinhDo/Timeline.vue";
import WeddingGifts from "@/page/NhatBinhDo/WeddingGifts.vue";
import WeddingWishes from "@/page/NhatBinhDo/WeddingWishes.vue";
import WeddingFooter from "@/page/NhatBinhDo/WeddingFooter.vue";

import {
  paper,
  chineseHappiness,
  chuHy,
  dauRe,
  hoa,
  longDen,
  mayTo,
  may,
  quat,
  corner,
} from "@/page/NhatBinhDo/nhatBinhDoAssets";


/* ==========================================================
   PROPS
========================================================== */

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
});


/* ==========================================================
   WEDDING
========================================================== */

const wedding = computed(() => props.wedding);


/* ==========================================================
   STATE
========================================================== */

const opened = ref(false);

const floatingMusicRef = ref(null);

const galleryIndex = ref(0);

const currentYear = new Date().getFullYear();


/* ==========================================================
   ASSETS
========================================================== */

const assets = {
  paper,
  chineseHappiness,
  chuHy,
  dauRe,
  hoa,
  longDen,
  mayTo,
  may,
  quat,
  corner,
};


/* ==========================================================
   DATA
========================================================== */

const events = computed(() => {
  return Array.isArray(wedding.value?.events)
    ? wedding.value.events
    : [];
});
const timeline = computed(() => {
  return Array.isArray(wedding.value?.timeline)
    ? wedding.value.timeline
    : [];
});

const gallery = computed(() => {
  return Array.isArray(wedding.value?.gallery)
    ? wedding.value.gallery
    : [];
});


const gifts = computed(() => {
  return Array.isArray(wedding.value?.gifts)
    ? wedding.value.gifts
    : [];
});


const wishes = computed(() => {
  return Array.isArray(
    wedding.value?.guestBook?.Guest,
  )
    ? wedding.value.guestBook.Guest
    : [];
});


/* ==========================================================
   SETTINGS
========================================================== */

const settings = computed(() => {
  return wedding.value?.settings || {};
});


const showHero = computed(() => {
  return settings.value.ShowHero !== false;
});


const showCouple = computed(() => {
  return settings.value.ShowCouple !== false;
});


const showStory = computed(() => {
  return settings.value.ShowStory !== false;
});


const showEvents = computed(() => {
  return settings.value.ShowEvents !== false;
});


const showCountdown = computed(() => {
  return settings.value.ShowCountdown === true;
});


const showGallery = computed(() => {
  return settings.value.ShowGallery === true;
});


const showMap = computed(() => {
  return settings.value.ShowMap === true;
});


const showGift = computed(() => {
  return settings.value.ShowGift === true;
});


const showGuestBook = computed(() => {
  return settings.value.ShowGuestBook === true;
});


const showMusic = computed(() => {
  return (
    wedding.value?.music?.Enabled === true &&
    settings.value.ShowMusic === true
  );
});


const showFooter = computed(() => {
  return settings.value.ShowFooter !== false;
});
const showTimeLine = computed(() => {
  return settings.value.ShowTimeline !== false;
});


/* ==========================================================
   MONOGRAM
========================================================== */

const monogram = computed(() => {
  const groom =
    (wedding.value?.GroomName || "G")
      .trim()
      .charAt(0);

  const bride =
    (wedding.value?.BrideName || "B")
      .trim()
      .charAt(0);

  return `${groom}&${bride}`.toUpperCase();
});


/* ==========================================================
   DATE
========================================================== */

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = dayjs(date);

  if (!parsed.isValid()) {
    return "";
  }

  return parsed.format("DD · MM · YYYY");
}


const openDateLabel = computed(() => {
  return formatDate(
    wedding.value?.weddingDate,
  );
});


const heroDateLabel = computed(() => {
  return formatDate(
    wedding.value?.hero?.weddingDate ||
    wedding.value?.weddingDate,
  );
});


/* ==========================================================
   OPEN
========================================================== */

async function handleOpen() {
  opened.value = true;

  await nextTick();

  floatingMusicRef.value?.play?.();
}


/* ==========================================================
   GALLERY
========================================================== */

function openGallery(index) {
  galleryIndex.value = index;
}
</script>


<style scoped>

/* ==========================================================
   ROOT
========================================================== */

.nb-wedding {
  --red: #971519;
  --red-dark: #720e12;

  --gold: #b58a45;
  --gold-light: #d7bb82;

  --paper: #f6ecd9;

  width: 100%;
  min-height: 100vh;

  overflow-x: hidden;

  background: #fff;
}


/* ==========================================================
   RESET
========================================================== */

.nb-wedding *,
.nb-wedding *::before,
.nb-wedding *::after {
  box-sizing: border-box;
}


.nb-wedding img {
  display: block;
  max-width: 100%;
}


.nb-wedding button,
.nb-wedding input,
.nb-wedding textarea {
  font: inherit;
}


/* ==========================================================
   MAIN
========================================================== */

.invitation {
  position: relative;

  width: min(48rem, 100%);

  min-height: 100vh;

  margin: 0 auto;

  overflow: hidden;

  color: var(--red);

  background: var(--paper);

  box-shadow:
    0 15px 60px rgba(64, 35, 15, 0.16);
}


/* ==========================================================
   PAPER
   CHỈ PAPER OPACITY 0.15
========================================================== */

.invitation::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: 0;

  pointer-events: none;

  background-image:
    url("@/assets/nhat-binh-do-red/paper.webp");

  background-repeat: repeat-y;

  background-position: center top;

  background-size: 100% auto;

  opacity: 0.15;
}


/* ==========================================================
   GENERIC SECTION
========================================================== */

.section {
  position: relative;

  z-index: 2;

  width: 100%;

  padding:
    40px 25px;
}


/* ==========================================================
   HERO
   KHÔNG KHUNG
========================================================== */

.hero-section {
  position: relative;

  min-height: 650px;

  padding: 0;

  z-index: 2;
}


/* ==========================================================
   2 KHUNG CHÍNH
========================================================== */

.framed-section {
  position: relative;

  z-index: 5;

  width: calc(100% - 36px);

  margin:
    25px auto;

  padding:
    48px 24px;

  border:
    1px solid
    rgba(151, 21, 25, 0.38);

  background:
    rgba(255, 249, 235, 0.28);

  box-shadow:
    inset 0 0 35px
    rgba(151, 21, 25, 0.025);
}


/* ==========================================================
   KHUNG THÔNG TIN LỄ CƯỚI
========================================================== */

.wedding-info-frame {

  margin-top: 10px;

  border-radius:
    18px 18px 4px 4px;

}


/* ==========================================================
   KHUNG THÔNG TIN TIỆC CƯỚI
========================================================== */

.party-info-frame {

  margin-top: 35px;

  margin-bottom: 35px;

  border-radius: 4px 4px 18px 18px;

}


/* ==========================================================
   FRAME CONTENT
========================================================== */

.framed-content {
  position: relative;

  z-index: 3;

  width: 100%;
}


/* ==========================================================
   FRAME CORNERS
========================================================== */

.frame-decoration {
  position: absolute;

  inset: 0;

  pointer-events: none;

  z-index: 8;
}


.frame-corner {
  position: absolute;

  width: 78px;

  pointer-events: none;

  user-select: none;
}


.frame-corner-tl {
  top: -1px;
  left: -1px;
}


.frame-corner-tr {
  top: -1px;
  right: -1px;

  transform: scaleX(-1);
}


.frame-corner-bl {
  bottom: -1px;
  left: -1px;

  transform: scaleY(-1);
}


.frame-corner-br {
  right: -1px;
  bottom: -1px;

  transform: scale(-1);
}


/* ==========================================================
   HERO CLOUD
========================================================== */

.hero-cloud {
  position: absolute;

  z-index: 3;

  pointer-events: none;

  user-select: none;
}


.hero-cloud-left {
  top: -15px;

  left: -45px;

  width: 230px;

  opacity: .9;
}


.hero-cloud-small {
  position: absolute;

  z-index: 3;

  pointer-events: none;
}


.hero-cloud-small-right {
  top: 105px;

  right: -35px;

  width: 135px;

  opacity: .7;

  transform:
    scaleX(-1);
}


/* ==========================================================
   HERO FLOWER
========================================================== */

.hero-flower {
  position: absolute;

  z-index: 4;

  pointer-events: none;

  user-select: none;
}


.hero-flower-left {
  top: 20px;

  left: 10px;

  width: 105px;

  opacity: .8;

  transform:
    rotate(-10deg);
}


.hero-flower-right {
  top: 30px;

  right: 10px;

  width: 100px;

  opacity: .8;

  transform:
    scaleX(-1)
    rotate(-10deg);
}


/* ==========================================================
   STORY
   KHÔNG KHUNG
========================================================== */


/* ==========================================================
   ALBUM
   KHÔNG KHUNG
========================================================== */



/* ==========================================================
   COUNTDOWN
   KHÔNG KHUNG
========================================================== */


/* ==========================================================
   MAP
   KHÔNG KHUNG
========================================================== */


/* ==========================================================
   GIFT
   KHÔNG KHUNG
========================================================== */


/* ==========================================================
   GUESTBOOK
   KHÔNG KHUNG
========================================================== */


/* ==========================================================
   FOOTER
   KHÔNG KHUNG
========================================================== */


/* ==========================================================
   BOTTOM DECORATION
========================================================== */

.cloud-bottom {
  position: absolute;

  right: -45px;

  bottom: 10px;

  width: 250px;

  z-index: 3;

  opacity: .9;

  pointer-events: none;

  transform:
    scaleX(-1);
}


.lantern-bottom {
  position: absolute;

  right: 35px;

  bottom: 55px;

  width: 70px;

  z-index: 4;

  opacity: .9;

  pointer-events: none;
}


.fan-bottom {
  position: absolute;

  left: 15px;

  bottom: 55px;

  width: 90px;

  z-index: 4;

  opacity: .85;

  pointer-events: none;

  transform:
    rotate(-8deg);
}


.flower-bottom {
  position: absolute;

  left: 55px;

  bottom: 15px;

  width: 110px;

  z-index: 4;

  opacity: .8;

  pointer-events: none;
}


/* ==========================================================
   MOBILE
========================================================== */

@media (max-width: 768px) {

  .invitation {
    width: 100%;

    box-shadow: none;
  }


  .section {
    padding-left: 18px;

    padding-right: 18px;
  }


  .framed-section {
    width: calc(100% - 24px);

    padding:
      42px 18px;
  }


  .frame-corner {
    width: 68px;
  }


  .hero-section {
    min-height: 620px;
  }


  .hero-cloud-left {
    width: 190px;

    left: -45px;
  }


  .hero-cloud-small-right {
    width: 110px;

    right: -30px;
  }


  .hero-flower-left {
    width: 85px;
  }


  .hero-flower-right {
    width: 80px;
  }

}


/* ==========================================================
   SMALL MOBILE
========================================================== */

@media (max-width: 420px) {

  .hero-section {
    min-height: 580px;
  }


  .framed-section {
    width: calc(100% - 18px);

    padding:
      38px 14px;
  }


  .frame-corner {
    width: 60px;
  }


  .hero-cloud-left {
    width: 165px;
  }


  .hero-cloud-small-right {
    width: 95px;
  }


  .hero-flower-left {
    width: 72px;
  }


  .hero-flower-right {
    width: 70px;
  }


  .cloud-bottom {
    width: 200px;
  }

}
</style>

