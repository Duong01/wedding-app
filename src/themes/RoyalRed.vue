<template>
  <div class="royal-red">
    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :guestName="wedding.recipientName.Name"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <main v-else class="royal-invitation">
      <WeddingHero
        :wedding="wedding"
        :monogram="monogram"
        :date-label="heroDateLabel"
      />
      <div class="bg-border">
        <div
          class="bg-border__corner bg-border__corner--tl"
          :style="{
            backgroundImage: `url(${frame_corner_top_left})`,
          }"
        />

        <div
          class="bg-border__corner bg-border__corner--tr"
          :style="{
            backgroundImage: `url(${frame_corner_top_left})`,
          }"
        />

        <div
          class="bg-border__corner bg-border__corner--bl"
          :style="{
            backgroundImage: `url(${frame_corner_top_left})`,
          }"
        />

        <div
          class="bg-border__corner bg-border__corner--br"
          :style="{
            backgroundImage: `url(${frame_corner_top_left})`,
          }"
        />

        <div
          class="bg-border__ornament bg-border__ornament--top"
          :style="{
            backgroundImage: `url(${frame_middle_horizontal})`,
          }"
        />

        <div
          class="bg-border__ornament bg-border__ornament--bottom"
          :style="{
            backgroundImage: `url(${frame_middle_horizontal})`,
          }"
        />

        <div
          class="bg-border__ornament bg-border__ornament--left"
          :style="{
            backgroundImage: `url(${frame_middle_vertical})`,
          }"
        />

        <div
          class="bg-border__ornament bg-border__ornament--right"
          :style="{
            backgroundImage: `url(${frame_middle_vertical})`,
          }"
        />
        <div class="bg-border__content">
          <WeddingCouple v-if="showCouple" :wedding="wedding" :guestName="wedding.recipientName.Name" />

          <WeddingStory
            v-if="showStory && wedding?.story"
            :story="wedding.story"
          />

          <WeddingEvents v-if="showEvents && events.length" :events="events" />

          <Timeline
            v-if="showTimeline && timeline.length"
            :timeline="timeline"
          />

          <WeddingCountdown
            v-if="showCountdown"
            :countdown="wedding?.countdown"
            :wedding-date="wedding?.weddingDate"
          />

          <WeddingGallery
            v-if="showGallery && gallery.length"
            :gallery="gallery"
          />
        </div>
      </div>

      <WeddingMap v-if="showMap && events.length" :events="events" />

      <WeddingGifts v-if="showGift && gifts.length" :gifts="gifts" />

      <WeddingWishes v-if="showGuestBook" :wishes="wishes" :wedding="wedding" />

      <WeddingFooter
        v-if="showFooter"
        :wedding="wedding"
        :monogram="monogram"
        :current-year="currentYear"
      />

      <FloatingMusic
        v-if="showMusic"
        ref="floatingMusicRef"
        :music="wedding?.music"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/RoyalRed/OpeningScreen.vue";
import WeddingHero from "@/page/RoyalRed/WeddingHero.vue";
import WeddingCouple from "@/page/RoyalRed/WeddingCouple.vue";
import WeddingStory from "@/page/RoyalRed/WeddingStory.vue";
import WeddingEvents from "@/page/RoyalRed/WeddingEvents.vue";
import WeddingCountdown from "@/page/RoyalRed/WeddingCountdown.vue";
import WeddingGallery from "@/page/RoyalRed/WeddingGallery.vue";
import WeddingMap from "@/page/RoyalRed/WeddingMap.vue";
import Timeline from "@/page/RoyalRed/Timeline.vue";
import WeddingGifts from "@/page/RoyalRed/WeddingGifts.vue";
import WeddingWishes from "@/page/RoyalRed/WeddingWishes.vue";
import WeddingFooter from "@/page/RoyalRed/WeddingFooter.vue";

import {
  backgroud,
  flower,
  frame_corner_top_left,
  frame_middle_horizontal,
  frame_middle_vertical,
} from "@/page/RoyalRed/royalRedAssets";

const props = defineProps({ wedding: { type: Object, required: true } });
const wedding = computed(() => props.wedding || {});
const opened = ref(false);
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
const showMusic = computed(
  () =>
    wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true
);

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
  const d = dayjs(date);
  return d.isValid() ? d.format("DD · MM · YYYY") : "";
}
const openDateLabel = computed(() => formatDate(wedding.value?.weddingDate));
const heroDateLabel = computed(() =>
  formatDate(wedding.value?.hero?.weddingDate || wedding.value?.weddingDate)
);

async function handleOpen() {
  opened.value = true;
  await nextTick();
  floatingMusicRef.value?.play?.();
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&display=swap");

/* =========================================================
   ROYAL RED
   ========================================================= */

.royal-red {
  --rr-bg: #280003;
  --rr-bg-deep: #160001;

  --rr-red: #570407;
  --rr-red-light: #76090d;

  --rr-gold: #d8ad61;
  --rr-gold-light: #f3d99c;
  --rr-gold-soft: rgba(216, 173, 97, 0.55);

  --rr-paper: #f8e9ca;
  --rr-text: #f3ddb0;

  width: 100%;
  min-height: 100vh;

  overflow-x: hidden;

  background: radial-gradient(
      circle at 50% 10%,
      rgba(150, 20, 25, 0.25),
      transparent 32%
    ),
    linear-gradient(180deg, #160001 0%, #2b0003 45%, #170001 100%);

  color: var(--rr-text);

  font-family: "Cormorant Garamond", Georgia, serif;

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* =========================================================
   MAIN INVITATION
   ========================================================= */

.royal-invitation {
  position: relative;

  width: min(620px, 100%);
  min-height: 100vh;

  margin: 0 auto;

  overflow: hidden;

  background-color: var(--rr-bg);

  /*
   * background.webp
   * là texture/nền chính của toàn bộ thiệp.
   *
   * Không dùng background-attachment: fixed.
   * Không dùng 100% 100%.
   */
  background-image: linear-gradient(
      180deg,
      rgba(68, 2, 6, 0.72),
      rgba(39, 1, 3, 0.86)
    ),
    url("/src/assets/royal-red/background.webp");

  background-repeat: no-repeat, repeat-y;

  background-position: center top, center top;

  background-size: cover, 620px auto;

  box-shadow: 0 0 80px rgba(0, 0, 0, 0.65), inset 0 0 80px rgba(0, 0, 0, 0.35);
}

/* =========================================================
   GLOBAL RED LIGHT
   ========================================================= */

.royal-invitation::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: 0;

  pointer-events: none;

  background: radial-gradient(
      ellipse at 50% 0%,
      rgba(185, 38, 38, 0.18),
      transparent 35%
    ),
    radial-gradient(ellipse at 50% 55%, rgba(105, 8, 12, 0.1), transparent 50%),
    linear-gradient(180deg, rgba(67, 2, 5, 0.04), rgba(22, 0, 1, 0.25));
}

/* =========================================================
   SUBTLE GOLD TEXTURE
   ========================================================= */

.royal-invitation::after {
  content: "";

  position: absolute;

  inset: 0;

  z-index: 0;

  pointer-events: none;

  opacity: 0.12;

  background-image: radial-gradient(
    rgba(255, 224, 157, 0.22) 0.5px,
    transparent 0.7px
  );

  background-size: 8px 8px;

  mask-image: linear-gradient(to bottom, black 0%, black 75%, transparent 100%);

  -webkit-mask-image: linear-gradient(
    to bottom,
    black 0%,
    black 75%,
    transparent 100%
  );
}

/* =========================================================
   ALL DIRECT CHILDREN
   ========================================================= */

.royal-invitation > * {
  position: relative;

  z-index: 2;
}
/* =========================================================
   BG BORDER
   WeddingCouple -> WeddingGallery
   ========================================================= */

.bg-border {
  position: relative;

  margin: 0 14px;

  padding: 52px 32px;

  /*
   * BORDER CHÍNH
   * Đây là đường viền chạy liên tục.
   */
  border: 1px solid rgba(216, 173, 97, 0.62);

  /*
   * Nền trong khung rất nhẹ
   */
  background: linear-gradient(
    180deg,
    rgba(86, 4, 8, 0.08),
    rgba(20, 0, 1, 0.04)
  );

  /*
   * Giúp border không bị nội dung tràn ra ngoài.
   */
  overflow: hidden;

  box-shadow: inset 0 0 35px rgba(0, 0, 0, 0.08), 0 0 25px rgba(0, 0, 0, 0.08);
}

/* =========================================================
   CONTENT
   ========================================================= */

.bg-border__content {
  position: relative;

  z-index: 5;

  width: 100%;
}

/* =========================================================
   CORNERS
   ========================================================= */

.bg-border__corner {
  position: absolute;

  width: 86px;
  height: 86px;

  z-index: 10;

  pointer-events: none;

  background-repeat: no-repeat;

  background-position: center;

  /*
   * GIỮ NGUYÊN TỶ LỆ ASSET
   */
  background-size: contain;
}

/* TOP LEFT */

.bg-border__corner--tl {
  top: -1px;
  left: -1px;
}

/* TOP RIGHT */

.bg-border__corner--tr {
  top: -1px;
  right: -1px;

  transform: scaleX(-1);
}

/* BOTTOM LEFT */

.bg-border__corner--bl {
  bottom: -1px;
  left: -1px;

  transform: scaleY(-1);
}

/* BOTTOM RIGHT */

.bg-border__corner--br {
  bottom: -1px;
  right: -1px;

  transform: scale(-1);
}

/* =========================================================
   MIDDLE DECORATION
   ========================================================= */

.bg-border__ornament {
  position: absolute;

  z-index: 11;

  pointer-events: none;

  background-repeat: no-repeat;

  background-position: center;

  /*
   * Tuyệt đối không stretch.
   */
  background-size: contain;
}

/* =========================================================
   TOP CENTER
   ========================================================= */

.bg-border__ornament--top {
  top: -9px;

  left: 50%;

  width: 150px;
  height: 18px;

  transform: translateX(-50%);
}

/* =========================================================
   BOTTOM CENTER
   ========================================================= */

.bg-border__ornament--bottom {
  bottom: -9px;

  left: 50%;

  width: 150px;
  height: 18px;

  transform: translateX(-50%) rotate(180deg);
}

/* =========================================================
   LEFT CENTER
   ========================================================= */

.bg-border__ornament--left {
  left: -9px;

  top: 50%;

  width: 18px;
  height: 150px;

  transform: translateY(-50%);
}

/* =========================================================
   RIGHT CENTER
   ========================================================= */

.bg-border__ornament--right {
  right: -9px;

  top: 50%;

  width: 18px;
  height: 150px;

  transform: translateY(-50%) rotate(180deg);
}

/* =========================================================
   SECTIONS
   ========================================================= */

.rr-section {
  position: relative;
}

.rr-section + .rr-section {
  border-top: none;
}

/* =========================================================
   GENERIC INNER FRAME
   ========================================================= */

.rr-frame {
  position: relative;

  margin: 0;


  border: none;

  background: transparent;

  box-shadow: none;
}

/*
 * Tắt frame cũ.
 *
 * Không để component con tự tạo
 * horizontal decoration.
 */
.rr-frame::before,
.rr-frame::after {
  display: none;
}

/* =========================================================
   TYPOGRAPHY
   ========================================================= */

.rr-kicker {
  margin-bottom: 10px;

  text-align: center;

  text-transform: uppercase;

  letter-spacing: 0.32em;

  font-size: 10px;
  font-weight: 600;

  color: var(--rr-gold-light);

  opacity: 0.9;
}

.rr-title {
  margin: 8px 0 22px;

  text-align: center;

  font-size: clamp(28px, 7vw, 38px);

  line-height: 1.05;

  font-weight: 500;

  color: var(--rr-gold-light);

  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 18px rgba(0, 0, 0, 0.25);
}

.rr-script {
  font-family: "Great Vibes", cursive;

  font-weight: 400;

  color: var(--rr-gold-light);

  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
}

/* =========================================================
   DIVIDER
   ========================================================= */

.rr-divider {
  display: flex;

  align-items: center;

  gap: 12px;

  width: min(230px, 80%);

  margin: 20px auto;

  color: var(--rr-gold);
}

.rr-divider::before,
.rr-divider::after {
  content: "";

  height: 1px;

  flex: 1;

  background: linear-gradient(90deg, transparent, var(--rr-gold));
}

.rr-divider::after {
  transform: scaleX(-1);
}

.rr-divider span {
  font-size: 13px;

  color: var(--rr-gold-light);
}

/* =========================================================
   HERO
   ========================================================= */

.royal-hero {
  position: relative;

  min-height: 760px;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 70px 24px;

  overflow: hidden;

  text-align: center;

  background: linear-gradient(
    180deg,
    rgba(48, 0, 3, 0.08),
    rgba(25, 0, 1, 0.4)
  );
}

/* Hero inner border */

.royal-hero::before {
  content: "";

  position: absolute;

  inset: 25px 16px;

  border: 1px solid rgba(216, 173, 97, 0.48);

  pointer-events: none;
}

/* Hero subtle glow */

.royal-hero::after {
  content: "";

  position: absolute;

  inset: 0;

  pointer-events: none;

  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(216, 173, 97, 0.08),
    transparent 48%
  );
}

/* =========================================================
   HERO CONTENT
   ========================================================= */

.royal-hero-content {
  position: relative;

  z-index: 4;

  width: 100%;

  max-width: 560px;
}

.royal-hero-date {
  margin-bottom: 20px;

  font-size: 11px;

  letter-spacing: 0.4em;

  color: var(--rr-gold-light);
}

.royal-hero-monogram {
  width: 118px;
  height: 118px;

  margin: 22px auto 28px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 1px solid var(--rr-gold);

  border-radius: 50%;

  color: var(--rr-gold-light);

  font-family: "Great Vibes", cursive;

  font-size: 42px;

  box-shadow: 0 0 0 7px rgba(216, 173, 97, 0.07),
    0 0 40px rgba(216, 173, 97, 0.12);
}

.royal-hero-names {
  margin: 0;

  font-family: "Great Vibes", cursive;

  font-size: clamp(48px, 13vw, 78px);

  font-weight: 400;

  line-height: 0.95;

  color: #f5d99a;

  text-shadow: 0 4px 25px rgba(0, 0, 0, 0.4);
}

.royal-hero-subtitle {
  margin-top: 26px;

  text-transform: uppercase;

  letter-spacing: 0.28em;

  font-size: 10px;

  color: rgba(243, 217, 156, 0.85);
}

/* =========================================================
   HERO FLOWER
   =========================================================
   
   flower.webp chỉ dành cho WeddingHero.
   
   Các element này cần nằm trong WeddingHero.vue.
   ========================================================= */

.rr-hero-flower {
  position: absolute;

  width: 145px;
  height: 145px;

  z-index: 1;

  pointer-events: none;

  background-repeat: no-repeat;

  background-position: center;

  background-size: contain;

  opacity: 0.92;
}

.rr-hero-flower--left {
  left: -42px;
  top: 30px;

  transform: rotate(-10deg);
}

.rr-hero-flower--right {
  right: -42px;
  bottom: 30px;

  transform: scaleX(-1) rotate(-10deg);
}

/* =========================================================
   PHOTO
   ========================================================= */

.rr-photo {
  position: relative;

  overflow: hidden;

  background: #1b0001;

  border: 1px solid rgba(216, 173, 97, 0.55);

  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.32);
}

/* =========================================================
   PHOTO IMAGE
   ========================================================= */

.rr-photo img {
  display: block;

  width: 100%;
  height: 100%;

  /*
   * Crop thay vì stretch.
   */
  object-fit: cover;

  object-position: center;

  transition: transform 0.8s ease, filter 0.8s ease;
}

.rr-photo:hover img {
  transform: scale(1.035);

  filter: saturate(0.92);
}

/* =========================================================
   INNER PHOTO BORDER
   ========================================================= */

.rr-photo::after {
  content: "";

  position: absolute;

  inset: 8px;

  border: 1px solid rgba(255, 226, 167, 0.28);

  pointer-events: none;
}

/* =========================================================
   EVENT CARD
   ========================================================= */

.rr-event-card {
  position: relative;

  padding: 30px 22px;

  text-align: center;

  border: 1px solid rgba(216, 173, 97, 0.42);

  background: linear-gradient(
    145deg,
    rgba(118, 9, 13, 0.34),
    rgba(35, 0, 2, 0.42)
  );

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);

  transition: transform 0.3s ease, border-color 0.3s ease;
}

.rr-event-card:hover {
  transform: translateY(-3px);

  border-color: rgba(243, 217, 156, 0.7);
}

.rr-event-card .icon {
  margin-bottom: 12px;

  color: var(--rr-gold-light);

  font-size: 24px;
}

.rr-event-card .date {
  color: var(--rr-gold-light);

  font-size: 13px;

  letter-spacing: 0.15em;
}

.rr-event-card .name {
  margin: 8px 0;

  font-size: 25px;

  color: #f3d99c;
}

.rr-event-card .location {
  font-size: 14px;

  color: rgba(247, 230, 196, 0.78);
}

/* =========================================================
   COUNTDOWN
   ========================================================= */

.rr-countdown {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 8px;

  max-width: 440px;

  margin: 28px auto;
}

.rr-countdown-item {
  padding: 15px 5px;

  border-top: 1px solid rgba(216, 173, 97, 0.48);

  border-bottom: 1px solid rgba(216, 173, 97, 0.48);

  text-align: center;
}

.rr-countdown-number {
  display: block;

  font-size: 28px;

  line-height: 1;

  color: var(--rr-gold-light);
}

.rr-countdown-label {
  display: block;

  margin-top: 6px;

  text-transform: uppercase;

  letter-spacing: 0.15em;

  font-size: 8px;

  color: rgba(243, 217, 156, 0.7);
}

/* =========================================================
   TIMELINE
   ========================================================= */

.rr-timeline {
  position: relative;

  max-width: 470px;

  margin: 0 auto;
}

.rr-timeline::before {
  content: "";

  position: absolute;

  top: 0;
  bottom: 0;

  left: 50%;

  width: 1px;

  background: linear-gradient(180deg, transparent, var(--rr-gold), transparent);

  opacity: 0.75;
}

.rr-timeline-item {
  position: relative;

  width: 50%;

  padding: 15px 22px;
}

.rr-timeline-item:nth-child(odd) {
  text-align: right;
}

.rr-timeline-item:nth-child(even) {
  margin-left: 50%;
}

.rr-timeline-item::before {
  content: "";

  position: absolute;

  top: 22px;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: var(--rr-gold-light);

  box-shadow: 0 0 0 4px rgba(216, 173, 97, 0.12);
}

.rr-timeline-item:nth-child(odd)::before {
  right: -4px;
}

.rr-timeline-item:nth-child(even)::before {
  left: -4px;
}

.rr-timeline-time {
  color: var(--rr-gold-light);

  font-size: 12px;

  letter-spacing: 0.12em;
}

.rr-timeline-title {
  margin-top: 4px;

  font-size: 22px;

  color: #f4ddb0;
}

/* =========================================================
   GALLERY
   ========================================================= */

.rr-gallery {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 8px;

  width: 100%;
}

.rr-gallery .rr-photo:first-child {
  grid-column: span 2;

  aspect-ratio: 4 / 5;
}

.rr-gallery .rr-photo:not(:first-child) {
  aspect-ratio: 1 / 1.15;
}

/* =========================================================
   QUOTE / STORY
   ========================================================= */

.rr-quote {
  position: relative;

  max-width: 500px;

  margin: 0 auto;

  padding: 25px 20px 30px;

  text-align: center;

  color: rgba(248, 233, 202, 0.88);

  font-size: 19px;

  line-height: 1.65;
}

.rr-quote::before {
  content: "“";

  display: block;

  height: 35px;

  font-family: Georgia, serif;

  font-size: 65px;

  line-height: 1;

  color: var(--rr-gold);

  opacity: 0.7;
}

/* =========================================================
   MAP
   ========================================================= */

.rr-map {
  overflow: hidden;

  border: 1px solid rgba(216, 173, 97, 0.5);

  filter: sepia(0.25) saturate(0.75);
}

/* =========================================================
   BUTTON
   ========================================================= */

.rr-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  min-width: 170px;

  padding: 13px 25px;

  border: 1px solid var(--rr-gold);

  background: linear-gradient(
    135deg,
    rgba(216, 173, 97, 0.16),
    rgba(216, 173, 97, 0.04)
  );

  color: var(--rr-gold-light);

  text-transform: uppercase;

  letter-spacing: 0.18em;

  font-size: 10px;

  cursor: pointer;

  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.rr-button:hover {
  background: var(--rr-gold);

  color: #350003;

  box-shadow: 0 8px 25px rgba(216, 173, 97, 0.2);
}

/* =========================================================
   FOOTER
   ========================================================= */

.rr-footer {
  position: relative;

  padding: 70px 25px 45px;

  text-align: center;

  background: linear-gradient(180deg, transparent, rgba(15, 0, 1, 0.35));
}

.rr-footer-monogram {
  width: 76px;
  height: 76px;

  margin: 0 auto 20px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 1px solid var(--rr-gold);

  border-radius: 50%;

  font-family: "Great Vibes", cursive;

  font-size: 30px;

  color: var(--rr-gold-light);
}

.rr-footer-title {
  font-family: "Great Vibes", cursive;

  font-size: 42px;

  color: var(--rr-gold-light);
}

.rr-footer-year {
  margin-top: 18px;

  font-size: 9px;

  text-transform: uppercase;

  letter-spacing: 0.25em;

  color: rgba(243, 217, 156, 0.5);
}

/* =========================================================
   DESKTOP
   ========================================================= */

@media (min-width: 700px) {
  .royal-invitation {
    border-left: 1px solid rgba(216, 173, 97, 0.18);

    border-right: 1px solid rgba(216, 173, 97, 0.18);
  }
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 420px) {
  /* -------------------------------------------------------
     Main
     ------------------------------------------------------- */

  .royal-invitation {
    width: 100%;

    background-size: cover, 420px auto;
  }
  .bg-border {
    margin: 0 8px;

    padding: 46px 25px;

    border-width: 1px;
  }

  .bg-border__corner {
    width: 68px;
    height: 68px;
  }

  .bg-border__ornament--top,
  .bg-border__ornament--bottom {
    width: 110px;
    height: 14px;
  }

  .bg-border__ornament--top {
    top: -7px;
  }

  .bg-border__ornament--bottom {
    bottom: -7px;
  }

  .bg-border__ornament--left,
  .bg-border__ornament--right {
    width: 14px;
    height: 110px;
  }

  .bg-border__ornament--left {
    left: -7px;
  }

  .bg-border__ornament--right {
    right: -7px;
  }

  /* -------------------------------------------------------
     Hero
     ------------------------------------------------------- */

  .royal-hero {
    min-height: 680px;

    padding: 55px 18px;
  }

  .royal-hero::before {
    inset: 18px 10px;
  }

  .royal-hero-monogram {
    width: 95px;
    height: 95px;

    font-size: 34px;
  }

  .royal-hero-names {
    font-size: 50px;
  }

  .royal-hero-subtitle {
    font-size: 9px;

    letter-spacing: 0.22em;
  }

  /* -------------------------------------------------------
     Flower
     ------------------------------------------------------- */

  .rr-hero-flower {
    width: 110px;
    height: 110px;
  }

  .rr-hero-flower--left {
    left: -35px;
    top: 25px;
  }

  .rr-hero-flower--right {
    right: -35px;
    bottom: 25px;
  }

  /* -------------------------------------------------------
     Typography
     ------------------------------------------------------- */

  .rr-title {
    font-size: 28px;
  }

  /* -------------------------------------------------------
     Countdown
     ------------------------------------------------------- */

  .rr-countdown-number {
    font-size: 23px;
  }

  .rr-countdown-label {
    font-size: 7px;
  }

  /* -------------------------------------------------------
     Timeline
     ------------------------------------------------------- */

  .rr-timeline-item {
    padding-left: 15px;
    padding-right: 15px;
  }

  /* -------------------------------------------------------
     Photo
     ------------------------------------------------------- */

  .rr-photo::after {
    inset: 6px;
  }

  /* -------------------------------------------------------
     Footer
     ------------------------------------------------------- */

  .rr-footer {
    padding: 55px 18px 35px;
  }

  .rr-footer-title {
    font-size: 38px;
  }
}

/* =========================================================
   VERY SMALL DEVICES
   ========================================================= */

@media (max-width: 350px) {
  .bg-border {
    margin: 0 5px;

    padding: 40px 21px;
  }

  .bg-border__corner {
    width: 60px;
    height: 60px;
  }

  .bg-border__ornament--top,
  .bg-border__ornament--bottom {
    width: 95px;
    height: 12px;
  }

  .bg-border__ornament--left,
  .bg-border__ornament--right {
    width: 12px;
    height: 95px;
  }

  .rr-hero-flower {
    width: 95px;
    height: 95px;
  }

  .royal-hero-names {
    font-size: 45px;
  }

  .rr-title {
    font-size: 26px;
  }
}

/* =========================================================
   REDUCED MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;

    animation-duration: 0.01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: 0.01ms !important;
  }
}
</style>

