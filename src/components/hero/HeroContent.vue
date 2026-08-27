<template>
  <div class="hero-content">
    <div class="hero-inner">
      <!-- =========================================
           EYEBROW
      ========================================== -->


      <!-- =========================================
           NAMES
      ========================================== -->

      <div class="names">
        <div class="main-symbol">
            囍
          </div>

          <div class="top-divider">
            <span></span>
            <i></i>
            <span></span>
          </div>


        <div class="person-name">
          {{ hero.GroomName }}
        </div>

        <div class="ampersand">&</div>

        <div class="person-name">
          {{ hero.BrideName }}
        </div>
      </div>

      <!-- =========================================
           ORNAMENT
      ========================================== -->

      <div class="ornament">
        <span class="ornament-line"></span>

        <span class="ornament-symbol"> ✦ </span>

        <span class="ornament-line"></span>
      </div>

      <!-- =========================================
           SUBTITLE
      ========================================== -->

      <p class="subtitle">
        Sự hiện diện của các bạn là niềm vui lớn nhất của chúng mình
      </p>

      <!-- =========================================
           META
      ========================================== -->

      <div class="meta">
        <!-- DATE -->

        <div class="meta-item">
          <span class="meta-label"> Save the Date </span>

          <span class="meta-value">
            {{ formatDate(hero.WeddingDate) }}
          </span>
        </div>

        <!-- DIVIDER -->

        <div class="meta-divider">
          <span> ✦ </span>
        </div>

        <!-- LOCATION -->

        <div class="meta-item">
          <span class="meta-label"> Wedding Ceremony </span>

          <span class="meta-location">
            {{ hero.Location }}
          </span>
        </div>
      </div>

      <!-- =========================================
           COUNTDOWN
      ========================================== -->

      <div class="countdown-wrapper">
        <HeroCountdown :timeWedding="hero.WeddingDate" />
      </div>
    </div>
  </div>
</template>


<script setup>
import dayjs from "dayjs";

import HeroCountdown from "./HeroCountdown.vue";
import crossImage from "@/assets/chu-hy.webp";
defineProps({
  hero: {
    type: Object,
    required: true,
  },
});

function formatDate(date) {
  if (!date) return "";

  return dayjs(date).format("DD.MM.YYYY");
}
</script>


<style scoped lang="scss">
/* =========================================================
   HERO CONTENT
========================================================= */

.hero-content {
  position: relative;

  z-index: 10;

  width: 100%;

  max-width: 380px;

  margin: 0 auto;

  text-align: center;

  color: var(--p-gold-light, #f8dfad);

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}


.hero-inner {
  position: relative;

  z-index: 6;

  width:
    min(
      100%,
      360px
    );

  margin:
    0 auto;

  text-align:
    center;

  pointer-events:
    auto;
}

/* =========================================================
   EYEBROW
========================================================= */

.eyebrow {
  margin-bottom: clamp(14px, 2vh, 22px);

  color: var(--accent-light, #f7d8a3);

  font-family: var(--font-heading);

  font-size: var(--text-xs);

  font-weight: 500;

  line-height: 1;

  letter-spacing: 0.38em;

  text-transform: uppercase;

  opacity: 0.85;
}

/* =========================================================
   NAMES
========================================================= */

.names {
  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  gap:
    0;
}


.main-symbol {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  margin-bottom:
    8px;

  color:
    var(--p-gold, #e7c47d);

  font-family:
    var(--font-symbol);

  font-size:
    var(--text-2xl);

  line-height:
    1;

  text-shadow:
    0 2px 8px
    rgba(0, 0, 0, 0.18);
}


.top-divider {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    90px;

  gap:
    8px;

  margin-bottom:
    12px;
}


.top-divider span {
  flex:
    1;

  height:
    1px;

  background:
    rgba(
      247,
      216,
      163,
      0.65
    );
}


.top-divider i {
  width:
    6px;

  height:
    6px;

  border:
    1px solid
    var(--p-gold, #e7c47d);

  transform:
    rotate(45deg);
}

/* =========================================================
   PERSON NAME
========================================================= */

.person-name {
  width: 100%;

  color:
    var(--p-hero-text, #f7d8a3);

  font-family:
    var(--font-script);

  font-size:
    var(--text-display);

  font-weight:
    400;

  line-height:
    0.9;

  white-space:
    nowrap;

  text-align:
    center;

  text-shadow:
    0 2px 12px
    rgba(50, 0, 0, 0.35);
}

/* =========================================================
   AMPERSAND
========================================================= */

.ampersand {
  margin: clamp(9px, 1.5vh, 15px) 0;

  color: var(--accent-light, #f7d8a3);

  font-family: var(--font-heading);

  font-size: var(--text-3xl);

  font-weight: 400;

  line-height: 0.75;

  text-align: center;

  text-shadow: 0 2px 8px rgba(45, 0, 0, 0.15);
}

/* =========================================================
   ORNAMENT
========================================================= */

.ornament {
  display: flex;

  align-items: center;

  justify-content: center;

  width: min(300px, 62vw);

  margin: clamp(20px, 3vh, 28px) auto clamp(15px, 2vh, 20px);

  gap: 12px;
}

/* =========================================================
   ORNAMENT LINE
========================================================= */

.ornament-line {
  flex: 1;

  height: 1px;

  // background: linear-gradient(90deg, transparent, var(--accent, #c79d5c));

  opacity: 0.7;
}

/* =========================================================
   ORNAMENT SYMBOL
========================================================= */

.ornament-symbol {
  flex: 0 0 auto;

  color: var(--accent-light, #f7d8a3);

  font-family: var(--font-heading);

  font-size: var(--text-xs);

  line-height: 1;
}

/* =========================================================
   SUBTITLE
========================================================= */

.subtitle {
  width: min(100%, 480px);

  margin: 0 auto;

  color: var(--accent-light, #f7d8a3);

  font-family: var(--font-main);

  font-size: var(--text-md);

  font-weight: 400;

  line-height: 1.7;

  letter-spacing: 0.01em;

  text-align: center;
}

/* =========================================================
   META
========================================================= */

.meta {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    1px
    minmax(0, 1fr);

  align-items: center;

  width: min(100%, 560px);

  margin: clamp(20px, 3vh, 28px) auto 0;
}

/* =========================================================
   META ITEM
========================================================= */

.meta-item {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-width: 0;

  padding: 0 14px;

  text-align: center;
}

/* =========================================================
   META LABEL
========================================================= */

.meta-label {
  margin-bottom: 6px;

  color: var(--accent-light, #f7d8a3);

  font-family: var(--font-heading);

  font-size: var(--text-xs);

  font-weight: 600;

  line-height: 1.2;

  letter-spacing: 0.18em;

  text-transform: uppercase;

  white-space: nowrap;
}

/* =========================================================
   DATE
========================================================= */

.meta-value {
  color: var(--accent-light, #f7d8a3);

  font-family: var(--font-heading);
  font-variant-numeric: lining-nums;

  font-size: var(--text-sm);

  font-weight: 600;

  line-height: 1.3;

  white-space: nowrap;
}

/* =========================================================
   LOCATION
========================================================= */

.meta-location {
  width: 100%;

  max-width: 220px;

  color: var(--accent-light, #f7d8a3);

  font-family: var(--font-heading);

  font-size: var(--text-sm);

  font-weight: 400;

  line-height: 1.45;

  text-align: center;

  overflow-wrap: anywhere;
}

/* =========================================================
   META DIVIDER
========================================================= */

.meta-divider {
  position: relative;

  width: 1px;

  height: 46px;

  // background: linear-gradient(
  //   180deg,
  //   transparent,
  //   rgba(199, 157, 92, 0.65),
  //   transparent
  // );
}

/* =========================================================
   DIVIDER SYMBOL
========================================================= */

.meta-divider span {
  position: absolute;

  top: 50%;

  left: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 18px;

  height: 18px;

  transform: translate(-50%, -50%);

  color: var(--accent-light, #f7d8a3);

  // background: var(--primary, #7b0d0d);

  font-size: var(--text-xs);

  line-height: 1;
}

/* =========================================================
   COUNTDOWN
========================================================= */

.countdown-wrapper {
  width: 100%;

  margin-top: clamp(22px, 3.5vh, 34px);
}

/* =========================================================
   TABLET / MOBILE
   (cỡ chữ đã responsive qua --text-* scale)
======================================================== */

@media (max-width: 600px) {
  .hero-content {
    padding: 28px 14px 35px;
  }

  .hero-inner {
    width: 100%;
  }

  .eyebrow {
    margin-bottom: 14px;

    letter-spacing: 0.3em;
  }

  .ornament {
    width: min(230px, 65vw);

    margin: 17px auto 14px;
  }

  .subtitle {
    width: min(100%, 340px);

    line-height: 1.6;
  }

  .meta {
    width: 100%;

    margin-top: 19px;
  }

  .meta-item {
    padding: 0 7px;
  }

  .meta-label {
    letter-spacing: 0.12em;
  }

  .meta-location {
    max-width: 145px;

    line-height: 1.4;
  }

  .meta-divider {
    height: 38px;
  }

  .countdown-wrapper {
    margin-top: 22px;
  }
}

/* =========================================================
   SMALL MOBILE
======================================================== */

@media (max-width: 380px) {
  .hero-content {
    padding: 24px 10px 30px;
  }

  .eyebrow {
    margin-bottom: 12px;
  }

  .ornament {
    width: 190px;

    margin: 14px auto 12px;
  }

  .subtitle {
    max-width: 300px;

    line-height: 1.55;
  }

  .meta {
    margin-top: 16px;
  }

  .meta-item {
    padding: 0 4px;
  }

  .meta-label {
    letter-spacing: 0.09em;
  }

  .meta-location {
    max-width: 125px;
  }

  .meta-divider {
    height: 34px;
  }

  .countdown-wrapper {
    margin-top: 18px;
  }
}

/* =========================================================
   VERY SHORT MOBILE
======================================================== */

@media (max-width: 600px) and (max-height: 700px) {
  .hero-content {
    align-items: flex-start;

    padding-top: 45px;
  }

  .ampersand {
    margin: 6px 0;
  }

  .ornament {
    margin: 12px auto;
  }

  .subtitle {
    line-height: 1.45;
  }

  .meta {
    margin-top: 14px;
  }

  .countdown-wrapper {
    margin-top: 16px;
  }
}
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
.main-symbol {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 6px;

  border-radius: 50%;

  // background:
  //   radial-gradient(
  //     circle,
  //     #f7e3a9 0%,
  //     #e6c77f 70%,
  //     #cda85d 100%
  //   );

  color: #e2bd72;

  font-family:
    var(--font-symbol);

  font-size: var(--text-2xl);

  line-height: 1;

  /* box-shadow:
    0 4px 18px rgba(234, 195, 116, .25); */
}

</style>
