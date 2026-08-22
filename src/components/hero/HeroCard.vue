<template>
  <div class="wedding-opening">

    <!-- ================= BACKGROUND ================= -->

    <div class="paper-bg"></div>

    <div class="bg-happiness happiness-1">囍</div>
    <div class="bg-happiness happiness-2">囍</div>
    <div class="bg-happiness happiness-3">囍</div>
    <div class="bg-happiness happiness-4">囍</div>
    <div class="bg-happiness happiness-5">囍</div>

    <!-- ================= CARD ================= -->

    <div class="card-wrapper">

      <article class="invitation-card">

        <!-- Border -->
        <div class="outer-border"></div>
        <div class="inner-border"></div>

        <!-- ================= DECORATION ================= -->

        <img
          :src="dragonImage"
          class="dragon"
          alt=""
        />

        <img
          :src="phoenixImage"
          class="phoenix"
          alt=""
        />

        <!-- Soft decorative glow -->
        <div class="gold-glow glow-left"></div>
        <div class="gold-glow glow-right"></div>

        <!-- ================= CENTER ================= -->

        <div class="center-area">

          <!-- Double happiness -->
          <div class="main-symbol">
            囍
          </div>

          <div class="top-divider">
            <span></span>
            <i></i>
            <span></span>
          </div>

          <!-- Guest -->
          <div class="guest">
            {{ guestName }}
          </div>

          <!-- Names -->
          <div class="names">

            <div class="name">
              {{ groomName }}
            </div>

            <div class="ampersand">
              &
            </div>

            <div class="name">
              {{ brideName }}
            </div>

          </div>

          <!-- Date -->
          <div class="date">
            {{ formattedDate }}
          </div>

          <!-- Divider -->
          <div class="middle-divider">

            <span></span>

            <div class="mini-symbol">
              囍
            </div>

            <span></span>

          </div>

          <!-- Invitation -->
          <div class="invitation-text">
            Trân trọng kính mời
          </div>

          <!-- Address -->
          <div
            v-if="displayAddress"
            class="location"
          >
            <v-icon size="13">
              mdi-map-marker-outline
            </v-icon>

            <span>
              {{ displayAddress }}
            </span>
          </div>

          <!-- ================= BUTTON ================= -->

          <button
            type="button"
            class="open-button"
            @click="$emit('open')"
          >
            <span class="button-icon">
              <v-icon size="18">
                mdi-email-open-heart-outline
              </v-icon>
            </span>

            <span class="button-text">
              Mở thiệp
            </span>
          </button>

        </div>

        <!-- Bottom ornament -->
        <div class="bottom-ornament">
          <span></span>
          <i></i>
          <i></i>
          <i></i>
          <span></span>
        </div>

      </article>

      <div class="card-shadow"></div>

    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";

import dragonImage from "@/assets/phuong.webp";
import phoenixImage from "@/assets/rong.webp";

const props = defineProps({
  guestName: {
    type: String,
    default: "Kính mời"
  },

  groomName: {
    type: String,
    default: "Chú rể"
  },

  brideName: {
    type: String,
    default: "Cô dâu"
  },

  groomImage: {
    type: String,
    default: ""
  },

  brideImage: {
    type: String,
    default: ""
  },

  weddingDate: {
    type: [String, Date],
    default: ""
  },

  address: {
    type: String,
    default: ""
  }
});

defineEmits(["open"]);

const formattedDate = computed(() => {
  if (!props.weddingDate) {
    return "";
  }

  const date = new Date(props.weddingDate);

  if (Number.isNaN(date.getTime())) {
    return props.weddingDate;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
});

const displayAddress = computed(() => {
  return props.address || "";
});
</script>

<style scoped>

/* =========================================================
   BASE
========================================================= */

.wedding-opening {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background: #f5f0e5;

  font-family:
    "Noto Serif",
    "Times New Roman",
    serif;

  isolation: isolate;
}


/* =========================================================
   PAPER BACKGROUND
========================================================= */

.paper-bg {
  position: absolute;
  inset: 0;

  z-index: -10;

  background: url("@/assets/bg-frame.jpg") center / cover;
}

.paper-bg::before {
  content: "";

  position: absolute;
  inset: 0;

  opacity: .22;

  background: url("@/assets/bg-frame.jpg") center / cover;

  background-size: 7px 7px;
}


/* =========================================================
   BACKGROUND 囍
========================================================= */

.bg-happiness {
  position: absolute;

  font-family:
    "Noto Serif SC",
    "SimSun",
    serif;

  font-size: 30px;

  color: rgba(174, 55, 58, .16);

  pointer-events: none;

  animation: bgFloat 8s ease-in-out infinite;
}

.happiness-1 {
  top: 10%;
  left: 16%;
}

.happiness-2 {
  top: 13%;
  right: 15%;

  color: rgba(194, 143, 57, .18);

  animation-delay: -2s;
}

.happiness-3 {
  bottom: 20%;
  left: 15%;

  animation-delay: -4s;
}

.happiness-4 {
  bottom: 12%;
  right: 18%;

  color: rgba(194, 143, 57, .16);

  animation-delay: -1s;
}

.happiness-5 {
  top: 40%;
  right: 8%;

  animation-delay: -5s;
}

@keyframes bgFloat {

  0%,
  100% {
    transform: translateY(0);
    opacity: .15;
  }

  50% {
    transform: translateY(-10px);
    opacity: .28;
  }

}


/* =========================================================
   CARD WRAPPER
========================================================= */

.card-wrapper {
  position: relative;

  width: min(840px, 76vw);

  aspect-ratio: 1.5 / 1;

  display: flex;
  align-items: center;
  justify-content: center;
}


/* =========================================================
   CARD
========================================================= */

.invitation-card {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #821114 0%,
      #751013 48%,
      #670b0f 100%
    );

  /* box-shadow:
    0 30px 70px rgba(45, 24, 14, .28),
    0 8px 22px rgba(45, 24, 14, .15); */

  isolation: isolate;
}


/* =========================================================
   CARD BORDER
========================================================= */

.outer-border {
  position: absolute;

  inset: 3px;

  z-index: 20;

  border: 1px solid rgba(230, 192, 116, .85);

  border-radius: 9px;

  pointer-events: none;
}

.inner-border {
  position: absolute;

  inset: 12px;

  z-index: 20;

  border: 1px solid rgba(236, 200, 128, .3);

  border-radius: 5px;

  pointer-events: none;
}


/* =========================================================
   CENTRAL DARK AREA
   QUAN TRỌNG:
   giúp chữ không bị họa tiết phía sau làm rối
========================================================= */

.center-area {
  position: absolute;

  z-index: 10;

  top: 7%;
  bottom: 7%;

  left: 28%;
  right: 28%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  /*
   * Vùng trung tâm hơi tối hơn nền
   * nhưng vẫn trong suốt.
   */

  /* background:
    radial-gradient(
      ellipse at center,
      rgba(77, 5, 8, .56) 0%,
      rgba(77, 5, 8, .30) 52%,
      rgba(77, 5, 8, 0) 78%
    ); */

  border-radius: 45%;

  padding: 20px 12px;
}


/* =========================================================
   GOLD LIGHT
========================================================= */

.gold-glow {
  position: absolute;

  z-index: 3;

  width: 280px;
  height: 280px;

  border-radius: 50%;

  /* background:
    radial-gradient(
      circle,
      rgba(232, 191, 110, .12),
      transparent 68%
    ); */

  filter: blur(10px);

  pointer-events: none;
}

.glow-left {
  left: -100px;
  bottom: -100px;
}

.glow-right {
  right: -100px;
  top: -100px;
}


/* =========================================================
   DRAGON
   → CHỈ NẰM Ở GÓC TRÁI DƯỚI
========================================================= */

.dragon {
  position: absolute;

  z-index: 4;

  width: 39%;
  max-width: 330px;

  left: -10%;
  bottom: -9%;

  object-fit: contain;

  opacity: .56;

  pointer-events: none;

  /*
   * Giữ màu đồng/vàng của họa tiết
   */

  filter:
    sepia(.2)
    saturate(.7)
    brightness(.88)
    contrast(1.08);

  transform: rotate(-2deg);

  transition:
    transform .8s ease,
    opacity .8s ease;
}


/* =========================================================
   PHOENIX
   → CHỈ NẰM Ở GÓC PHẢI TRÊN
========================================================= */

.phoenix {
  position: absolute;

  z-index: 4;

  width: 39%;
  max-width: 330px;

  right: -10%;
  top: -20%;

  object-fit: contain;

  opacity: .56;

  pointer-events: none;

  filter:
    sepia(.2)
    saturate(.7)
    brightness(.88)
    contrast(1.08);

  transform: rotate(2deg);

  transition:
    transform .8s ease,
    opacity .8s ease;
}


/* =========================================================
   HOVER
========================================================= */

.invitation-card:hover .dragon {
  transform:
    translate(-5px, -5px)
    rotate(-3deg);

  opacity: .63;
}

.invitation-card:hover .phoenix {
  transform:
    translate(5px, 5px)
    rotate(3deg);

  opacity: .63;
}


/* =========================================================
   MAIN 囍
========================================================= */

.main-symbol {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 6px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      #f7e3a9 0%,
      #e6c77f 70%,
      #cda85d 100%
    );

  color: #7a3d22;

  font-family:
    "Noto Serif SC",
    "SimSun",
    serif;

  font-size: 27px;

  line-height: 1;

  /* box-shadow:
    0 4px 18px rgba(234, 195, 116, .25); */
}


/* =========================================================
   TOP DIVIDER
========================================================= */

.top-divider {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 85px;

  gap: 7px;

  margin-bottom: 8px;
}

.top-divider span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(233, 195, 119, .8)
    );
}

.top-divider span:last-child {
  transform: rotate(180deg);
}

.top-divider i {
  width: 5px;
  height: 5px;

  border: 1px solid #e2bd72;

  transform: rotate(45deg);
}


/* =========================================================
   GUEST
========================================================= */

.guest {
  margin-bottom: 5px;

  color: #ecd7a1;

  font-size: clamp(12px, 1.25vw, 16px);

  letter-spacing: 1px;

  white-space: nowrap;
}


/* =========================================================
   NAMES
========================================================= */

.names {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  color: #f8e4aa;

  text-shadow:
    0 2px 8px rgba(37, 5, 5, .7);
}

.name {
  font-family:
    "Cormorant Garamond",
    "Noto Serif",
    "Times New Roman",
    serif;

  font-size: clamp(30px, 4vw, 48px);

  line-height: 1.05;

  font-weight: 500;

  white-space: nowrap;
}

.ampersand {
  margin: 2px 0;

  color: #e7c57b;

  font-family:
    "Times New Roman",
    serif;

  font-size: 20px;

  line-height: 1;
}


/* =========================================================
   DATE
========================================================= */

.date {
  margin-top: 9px;

  color: #efd69a;

  font-size: clamp(13px, 1.4vw, 17px);

  white-space: nowrap;

  text-shadow:
    0 1px 5px rgba(35, 4, 4, .65);
}


/* =========================================================
   MIDDLE DIVIDER
========================================================= */

.middle-divider {
  display: flex;

  align-items: center;

  width: 105px;

  gap: 8px;

  margin: 9px 0;
}

.middle-divider span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(230, 192, 113, .75)
    );
}

.middle-divider span:last-child {
  transform: rotate(180deg);
}

.mini-symbol {
  color: #e7c47a;

  font-family:
    "Noto Serif SC",
    "SimSun",
    serif;

  font-size: 12px;
}


/* =========================================================
   INVITATION TEXT
========================================================= */

.invitation-text {
  color: #f0d9a2;

  font-size: clamp(12px, 1.3vw, 16px);

  line-height: 1.4;

  white-space: nowrap;
}


/* =========================================================
   LOCATION
========================================================= */

.location {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 4px;

  max-width: 270px;

  margin-top: 5px;

  color: rgba(241, 217, 165, .78);

  font-size: 10px;

  line-height: 1.35;

  text-align: center;
}


/* =========================================================
   OPEN BUTTON
   → NÚT CHÍNH
========================================================= */

.open-button {
  position: relative;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  min-width: 255px;

  height: 48px;

  margin-top: 13px;

  padding: 0 25px;

  border: 1px solid rgba(255, 241, 191, .85);

  border-radius: 999px;

  cursor: pointer;

  overflow: hidden;

  background:
    linear-gradient(
      135deg,
      #fff0bd 0%,
      #eacb84 48%,
      #d8b566 100%
    );

  color: #681216;

  font-family:
    "Noto Serif",
    "Times New Roman",
    serif;

  font-size: 15px;

  font-weight: 600;

  letter-spacing: .2px;

  /* box-shadow:
    0 7px 20px rgba(32, 5, 5, .3),
    0 0 0 4px rgba(235, 202, 132, .12); */

  transition:
    transform .28s ease,
    box-shadow .28s ease,
    filter .28s ease;
}


/* Shine */

.open-button::before {
  content: "";

  position: absolute;

  top: 0;
  left: -100%;

  width: 80%;
  height: 100%;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.55),
      transparent
    );

  transform: skewX(-20deg);

  transition: left .6s ease;
}


/* Outer glow */

.open-button::after {
  content: "";

  position: absolute;

  inset: -5px;

  border-radius: inherit;

  border: 1px solid rgba(255, 222, 145, .3);

  animation:
    buttonPulse
    2.4s
    ease-in-out
    infinite;

  pointer-events: none;
}


.open-button:hover {
  transform:
    translateY(-3px)
    scale(1.035);

  filter: brightness(1.05);

  box-shadow:
    0 12px 28px rgba(32, 5, 5, .38),
    0 0 25px rgba(236, 198, 115, .32);
}

.open-button:hover::before {
  left: 140%;
}

.open-button:active {
  transform: scale(.96);
}


.button-icon {
  display: flex;

  align-items: center;
  justify-content: center;
}

.button-text {
  position: relative;

  z-index: 2;
}


@keyframes buttonPulse {

  0%,
  100% {
    opacity: .3;
    transform: scale(1);
  }

  50% {
    opacity: .7;
    transform: scale(1.04);
  }

}


/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.bottom-ornament {
  position: absolute;

  z-index: 12;

  left: 50%;
  bottom: 11px;

  transform: translateX(-50%);

  display: flex;

  align-items: center;

  gap: 5px;

  width: 110px;

  opacity: .5;
}

.bottom-ornament span {
  flex: 1;

  height: 1px;

  background: #d8b36b;
}

.bottom-ornament i {
  width: 4px;
  height: 4px;

  border: 1px solid #d8b36b;

  transform: rotate(45deg);
}


/* =========================================================
   SHADOW
========================================================= */

.card-shadow {
  position: absolute;

  z-index: -1;

  left: 8%;
  bottom: -8%;

  width: 84%;
  height: 20%;

  border-radius: 50%;

  background: rgba(48, 31, 19, .3);

  filter: blur(25px);
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 900px) {

  .card-wrapper {
    width: 84vw;
  }

  .center-area {
    left: 25%;
    right: 25%;
  }

  .dragon,
  .phoenix {
    width: 38%;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

  .card-wrapper {
    width: 88vw;

    /*
     * Card dọc hơn trên mobile
     */
    aspect-ratio: .72 / 1;
  }

  .invitation-card {
    border-radius: 8px;
  }

  .inner-border {
    inset: 8px;
  }


  /* -------------------------
     CENTER
  ------------------------- */

  .center-area {
    top: 5%;
    bottom: 5%;

    left: 12%;
    right: 12%;

    padding: 18px 10px;

  }


  /* -------------------------
     DRAGON
  ------------------------- */

  .dragon {
    width: 52%;

    max-width: none;

    left: -16%;
    bottom: -3%;

    opacity: .48;
  }


  /* -------------------------
     PHOENIX
  ------------------------- */

  .phoenix {
    width: 52%;

    max-width: none;

    right: -16%;
    top: -3%;

    opacity: .48;
  }


  /* -------------------------
     SYMBOL
  ------------------------- */

  .main-symbol {
    width: 47px;
    height: 47px;

    font-size: 24px;
  }


  /* -------------------------
     NAMES
  ------------------------- */

  .name {
    font-size: clamp(27px, 8vw, 36px);
  }

  .ampersand {
    font-size: 17px;
  }


  /* -------------------------
     DATE
  ------------------------- */

  .date {
    font-size: 13px;

    margin-top: 8px;
  }


  /* -------------------------
     LOCATION
  ------------------------- */

  .location {
    max-width: 190px;

    font-size: 9px;
  }


  /* -------------------------
     BUTTON
  ------------------------- */

  .open-button {
    min-width: 245px;

    height: 46px;

    margin-top: 12px;

    font-size: 14px;
  }


  /* Background */
  .bg-happiness {
    font-size: 22px;
  }

}


/* =========================================================
   SMALL PHONE
========================================================= */

@media (max-width: 380px) {

  .card-wrapper {
    width: 90vw;
  }

  .center-area {
    left: 10%;
    right: 10%;
  }

  .dragon {
    width: 55%;
    left: -20%;
  }

  .phoenix {
    width: 55%;
    right: -20%;
  }

  .main-symbol {
    width: 42px;
    height: 42px;

    font-size: 21px;
  }

  .name {
    font-size: 25px;
  }

  .date {
    font-size: 12px;
  }

  .invitation-text {
    font-size: 12px;
  }

  .open-button {
    min-width: 135px;

    height: 43px;

    font-size: 13px;
  }

}


/* =========================================================
   SHORT SCREEN
========================================================= */

@media (
  max-width: 600px
) and (
  max-height: 680px
) {

  .card-wrapper {
    width: 78vw;
  }

  .center-area {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .main-symbol {
    width: 40px;
    height: 40px;

    font-size: 20px;
  }

  .name {
    font-size: 24px;
  }

  .date {
    margin-top: 5px;
  }

  .middle-divider {
    margin: 5px 0;
  }

  .open-button {
    margin-top: 7px;

    height: 40px;
  }

}


/* =========================================================
   ACCESSIBILITY
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .bg-happiness,
  .open-button::after {
    animation: none;
  }

  .invitation-card:hover .dragon,
  .invitation-card:hover .phoenix {
    transform: none;
  }

}

</style>