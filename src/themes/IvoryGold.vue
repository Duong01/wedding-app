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

import OpeningScreen from "@/page/IvoryGold/OpeningScreen.vue";
import WeddingHero from "@/page/IvoryGold/WeddingHero.vue";
import WeddingCouple from "@/page/IvoryGold/WeddingCouple.vue";
import WeddingStory from "@/page/IvoryGold/WeddingStory.vue";
import WeddingEvents from "@/page/IvoryGold/WeddingEvents.vue";
import WeddingCountdown from "@/page/IvoryGold/WeddingCountdown.vue";
import WeddingGallery from "@/page/IvoryGold/WeddingGallery.vue";
import WeddingMap from "@/page/IvoryGold/WeddingMap.vue";
import Timeline from "@/page/IvoryGold/Timeline.vue";
import WeddingGifts from "@/page/IvoryGold/WeddingGifts.vue";
import WeddingWishes from "@/page/IvoryGold/WeddingWishes.vue";
import WeddingFooter from "@/page/IvoryGold/WeddingFooter.vue";

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
   ROOT - IVORYGOLD THEME (Distinct Ivory/Cream Palette)
========================================================== */

.nb-wedding {
  --ivory: #fffaf0;
  --cream: #f5ede1;
  --champagne: #e8d5c4;
  --soft-gold: #d4af85;
  --dark-accent: #5a4835;
  --text-color: #4a3f38;

  width: 100%;
  min-height: 100vh;

  overflow-x: hidden;

  background: linear-gradient(135deg, #fffdf8 0%, #f5ede1 50%, #faf6f0 100%);
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
   MAIN INVITATION
========================================================== */

.invitation {
  position: relative;

  width: min(48rem, 100%);

  min-height: 100vh;

  margin: 0 auto;

  overflow: hidden;

  color: var(--text-color);

  background: linear-gradient(180deg, var(--ivory) 0%, var(--cream) 50%, var(--ivory) 100%);

  box-shadow:
    0 15px 60px rgba(90, 72, 53, 0.12),
    inset 0 0 0 1px rgba(212, 175, 133, 0.15);
}


/* ==========================================================
   PAPER TEXTURE
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

  opacity: 0.08;
}


/* ==========================================================
   GENERIC SECTION - WITH SOFT ANIMATIONS
========================================================== */

.section {
  position: relative;

  z-index: 2;

  width: 100%;

  padding: 40px 25px;
  
  animation: softSlideIn 0.8s cubic-bezier(0.25, 1, 0.5, 1) both;
}

.section:nth-child(2) { animation-delay: 0.1s; }
.section:nth-child(3) { animation-delay: 0.2s; }
.section:nth-child(4) { animation-delay: 0.3s; }
.section:nth-child(5) { animation-delay: 0.4s; }

@keyframes softSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* ==========================================================
   HERO SECTION
========================================================== */

.hero-section {
  position: relative;

  min-height: 650px;

  padding: 0;

  z-index: 2;
  
  animation: fadeInDown 0.9s ease-out both;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* ==========================================================
   FRAMED SECTIONS - ELEGANT HOVER
========================================================== */

.framed-section {
  position: relative;

  z-index: 5;

  width: calc(100% - 36px);

  margin: 25px auto;

  padding: 48px 24px;

  border:
    1px solid
    rgba(212, 175, 133, 0.45);

  background:
    linear-gradient(135deg, rgba(255, 250, 240, 0.6), rgba(245, 237, 225, 0.4));

  box-shadow:
    inset 0 0 25px
    rgba(212, 175, 133, 0.08),
    0 8px 24px rgba(90, 72, 53, 0.08);
    
  border-radius: 6px;
  
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.framed-section:hover {
  background:
    linear-gradient(135deg, rgba(255, 250, 240, 0.8), rgba(245, 237, 225, 0.6));
  box-shadow:
    inset 0 0 25px
    rgba(212, 175, 133, 0.15),
    0 12px 36px rgba(90, 72, 53, 0.12);
  transform: translateY(-2px);
}


/* ==========================================================
   FRAME CORNERS - SOFT GLOW
========================================================== */

.frame-corner {
  position: absolute;

  width: 82px;

  pointer-events: none;
  
  filter: drop-shadow(0 0 2px rgba(212, 175, 133, 0.2));
  
  transition: filter 0.4s ease;
}

.framed-section:hover .frame-corner {
  filter: drop-shadow(0 0 5px rgba(212, 175, 133, 0.5));
}


.frame-corner-tl {
  top: 0;
  left: 0;
}


.frame-corner-tr {
  top: 0;
  right: 0;
  transform: scaleX(-1);
}


.frame-corner-bl {
  bottom: 0;
  left: 0;
  transform: scaleY(-1);
}


.frame-corner-br {
  bottom: 0;
  right: 0;
  transform: scaleX(-1) scaleY(-1);
}


/* ==========================================================
   ORNAMENTS
========================================================== */

.ornament {
  position: absolute;

  width: 60px;

  opacity: 0.6;

  pointer-events: none;
  
  transition: opacity 0.4s ease;
}

.framed-section:hover .ornament {
  opacity: 0.85;
}


/* ==========================================================
   HERO DECORATIONS - GENTLE ANIMATIONS
========================================================== */

.art {
  position: absolute;

  pointer-events: none;
}


.hero-cloud {
  width: 280px;

  opacity: 0.5;
  
  animation: gentleFloat 8s ease-in-out infinite;
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-10px); opacity: 0.7; }
}


.hero-cloud-left {
  top: 20px;

  left: -50px;
}


.hero-cloud-small-right {
  width: 140px;

  top: 280px;

  right: -40px;
  
  animation: gentleFloat 10s ease-in-out infinite reverse;
}


.hero-flower {
  width: 120px;

  opacity: 0.5;
  
  animation: gentleSway 9s ease-in-out infinite;
}

@keyframes gentleSway {
  0%, 100% { transform: rotate(0deg); opacity: 0.5; }
  50% { transform: rotate(2deg); opacity: 0.7; }
}


.hero-flower-left {
  top: 100px;

  left: -35px;
}


.hero-flower-right {
  bottom: 120px;

  right: -40px;

  transform: scaleX(-1);
  
  animation-delay: -1.5s;
}


/* ==========================================================
   BOTTOM DECORATIONS - REFINED
========================================================== */

.cloud-bottom {
  position: absolute;

  right: -45px;

  bottom: 10px;

  width: 250px;

  z-index: 3;

  opacity: 0.7;

  pointer-events: none;

  transform: scaleX(-1);
  
  animation: gentleFloat 9s ease-in-out infinite;
}


.lantern-bottom {
  position: absolute;

  right: 35px;

  bottom: 55px;

  width: 70px;

  z-index: 4;

  opacity: 0.8;

  pointer-events: none;
  
  animation: gentleSwing 4s ease-in-out infinite;
}

@keyframes gentleSwing {
  0%, 100% { transform: rotate(-1.5deg); }
  50% { transform: rotate(1.5deg); }
}


.fan-bottom {
  position: absolute;

  left: 15px;

  bottom: 55px;

  width: 90px;

  z-index: 4;

  opacity: 0.75;

  pointer-events: none;

  transform: rotate(-8deg);
  
  animation: slowSpin 12s linear infinite;
}

@keyframes slowSpin {
  from { transform: rotate(-8deg); }
  to { transform: rotate(352deg); }
}


.flower-bottom {
  position: absolute;

  left: 55px;

  bottom: 15px;

  width: 110px;

  z-index: 4;

  opacity: 0.65;

  pointer-events: none;
  
  animation: gentleGlow 5s ease-in-out infinite;
}

@keyframes gentleGlow {
  0%, 100% { opacity: 0.5; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.1); }
}


/* ==========================================================
   WEDDING INFO FRAME
========================================================== */

.wedding-info-frame {
  margin-top: 10px;
  border-radius: 18px 18px 4px 4px;
}


/* ==========================================================
   PARTY INFO FRAME  
========================================================== */

.party-info-frame {
  margin-top: 15px;
}


/* ==========================================================
   FRAME DECORATION
========================================================== */

.frame-decoration {
  position: relative;
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
    padding: 42px 18px;
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
    padding: 38px 14px;
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

