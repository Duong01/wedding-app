<template>
  <div class="hero">

    <!-- =========================
         DECORATION
    ========================== -->

    <img
      :src="may"
      class="hero-art hero-cloud-left"
      alt=""
    />

    <img
      :src="may"
      class="hero-art hero-cloud-right"
      alt=""
    />

    <img
      :src="quat"
      class="hero-art hero-fan-right"
      alt=""
    />

    <img
      :src="hoa"
      class="hero-art hero-flower-left"
      alt=""
    />

    <img
      :src="hoa"
      class="hero-art hero-flower-right"
      alt=""
    />


    <!-- =========================
         HERO CONTENT
    ========================== -->

    <div class="hero-content">

      <!-- TOP LABEL -->

      <div class="top-label">
        <span class="top-line"></span>

        <span>
          THIỆP HỒNG BÁO HỶ
        </span>

        <span class="top-line"></span>
      </div>


      <!-- DOUBLE HAPPINESS -->

      <div class="happiness-wrap">

        <img
          :src="chineseHappiness"
          class="happiness"
          alt="囍"
        />

        <div class="happiness-glow"></div>

      </div>


      <!-- SMALL INTRO -->

      <div class="hero-intro">
        HỶ KẾT LƯƠNG DUYÊN
      </div>


      <!-- COUPLE IMAGE -->

      <div class="couple-image-wrap">

        <div class="image-decoration image-decoration-left"></div>

        <div class="image-decoration image-decoration-right"></div>

        <img
          :src="coupleImage"
          class="couple"
          alt="Cô dâu chú rể"
        />

      </div>


      <!-- NAMES -->

      <div class="names">

        <div class="name groom-name">
          {{ groomName }}
        </div>

        <div class="name-symbol">
          <span></span>

          <b>囍</b>

          <span></span>
        </div>

        <div class="name bride-name">
          {{ brideName }}
        </div>

      </div>


      <!-- DATE -->

      <div class="date-block">

        <div class="date-label">
          NGÀY VUI
        </div>

        <div class="date">
          {{ dateLabel || "DD · MM · YYYY" }}
        </div>

      </div>


      <!-- BOTTOM MESSAGE -->

      <div class="subtitle">
        TRĂM NĂM HẠNH PHÚC
      </div>


      <div class="bottom-symbol">
        <span></span>

        <b>✦</b>

        <span></span>
      </div>

    </div>

  </div>
</template>


<script setup>
import { computed } from "vue";

import {
  dauRe,
  chineseHappiness,
  hoa,
  may,
  quat,
} from "./nhatBinhDoAssets";


const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  monogram: {
    type: String,
    default: "G&B",
  },

  dateLabel: {
    type: String,
    default: "",
  },
});


const wedding = computed(() => props.wedding || {});


/* ==========================================================
   NAMES
========================================================== */

const groomName = computed(() => {
  return (
    wedding.value?.GroomName ||
    wedding.value?.groom?.name ||
    "CHÚ RỂ"
  );
});


const brideName = computed(() => {
  return (
    wedding.value?.BrideName ||
    wedding.value?.bride?.name ||
    "CÔ DÂU"
  );
});


/* ==========================================================
   COUPLE IMAGE
========================================================== */

const coupleImage = computed(() => {
  return (
    wedding.value?.hero?.Image ||
    dauRe
  );
});
</script>


<style scoped>

/* ==========================================================
   HERO
========================================================== */

.hero {
  position: relative;

  width: 100%;
  min-height: 650px;

  overflow: hidden;

  color: #8b1418;

  background:
    linear-gradient(
      180deg,
      rgba(255, 250, 239, 0.18),
      rgba(255, 248, 232, 0.04)
    );
}


/* ==========================================================
   CONTENT
========================================================== */

.hero-content {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;

  padding:
    54px
    28px
    70px;

  text-align: center;
}


/* ==========================================================
   TOP LABEL
========================================================== */

.top-label {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  color: #8e171a;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 3px;

  white-space: nowrap;
}


.top-line {
  width: 28px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #b58a45
    );
}


.top-line:last-child {
  background:
    linear-gradient(
      90deg,
      #b58a45,
      transparent
    );
}


/* ==========================================================
   DOUBLE HAPPINESS
========================================================== */

.happiness-wrap {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 82px;
  height: 82px;

  margin-top: 7px;
}


.happiness {
  position: relative;

  z-index: 3;

  width: 64px;
  height: 64px;

  object-fit: contain;

  filter:
    drop-shadow(
      0 3px 5px
      rgba(126, 18, 22, .12)
    );
}


.happiness-glow {
  position: absolute;

  width: 65px;
  height: 65px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(181, 138, 69, .13),
      transparent 70%
    );
}


/* ==========================================================
   INTRO
========================================================== */

.hero-intro {
  margin-top: -2px;

  color: #a17b43;

  font-size: 8px;

  font-weight: 600;

  letter-spacing: 3px;
}


/* ==========================================================
   COUPLE IMAGE
========================================================== */

.couple-image-wrap {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 265px;

  margin-top: 12px;

  padding: 5px;
}


.couple {
  position: relative;

  z-index: 4;

  display: block;

  width: 235px;
  height: 275px;

  object-fit: contain;

  filter:
    drop-shadow(
      0 12px 18px
      rgba(100, 20, 15, .12)
    );
}


/* ==========================================================
   IMAGE DECORATION
========================================================== */

.Image-decoration {
  position: absolute;

  width: 40px;
  height: 40px;

  border-color: rgba(181, 138, 69, .65);

  z-index: 2;
}


.Image-decoration-left {
  left: 0;
  top: 20px;

  border-top: 1px solid;
  border-left: 1px solid;
}


.Image-decoration-right {
  right: 0;
  bottom: 20px;

  border-right: 1px solid;
  border-bottom: 1px solid;
}


/* ==========================================================
   NAMES
========================================================== */

.names {
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  margin-top: 3px;
}


.name {
  color: #861317;

  font-family:
    "Cormorant Garamond",
    "Times New Roman",
    serif;

  font-size: 26px;

  font-weight: 600;

  line-height: 1.15;

  letter-spacing: 2px;

  text-transform: uppercase;

  text-shadow:
    0 1px 0 rgba(255,255,255,.4);
}


.groom-name {
  margin-bottom: 3px;
}


.bride-name {
  margin-top: 3px;
}


/* ==========================================================
   NAME SYMBOL
========================================================== */

.name-symbol {
  display: flex;

  align-items: center;

  gap: 8px;

  color: #b58a45;
}


.name-symbol span {
  width: 34px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #b58a45
    );
}


.name-symbol span:last-child {
  background:
    linear-gradient(
      90deg,
      #b58a45,
      transparent
    );
}


.name-symbol b {
  color: #9a171b;

  font-family: serif;

  font-size: 16px;

  font-weight: 400;
}


/* ==========================================================
   DATE
========================================================== */

.date-block {
  display: flex;

  flex-direction: column;

  align-items: center;

  margin-top: 20px;
}


.date-label {
  color: #a17b43;

  font-size: 7px;

  font-weight: 700;

  letter-spacing: 3px;
}


.date {
  margin-top: 5px;

  color: #8d1418;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 3px;
}


/* ==========================================================
   SUBTITLE
========================================================== */

.subtitle {
  margin-top: 18px;

  color: #a17b43;

  font-size: 8px;

  font-weight: 600;

  letter-spacing: 3px;
}


/* ==========================================================
   BOTTOM SYMBOL
========================================================== */

.bottom-symbol {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-top: 17px;
}


.bottom-symbol span {
  width: 45px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(181,138,69,.7)
    );
}


.bottom-symbol span:last-child {
  background:
    linear-gradient(
      90deg,
      rgba(181,138,69,.7),
      transparent
    );
}


.bottom-symbol b {
  color: #b58a45;

  font-size: 8px;

  font-weight: 400;
}


/* ==========================================================
   DECORATION BASE
========================================================== */

.hero-art {
  position: absolute;

  pointer-events: none;

  user-select: none;
}


/* ==========================================================
   CLOUD LEFT
========================================================== */

.hero-cloud-left {
  top: 5px;
  left: -52px;

  z-index: 2;

  width: 205px;

  opacity: .72;
}


/* ==========================================================
   CLOUD RIGHT
========================================================== */

.hero-cloud-right {
  top: 185px;
  right: -55px;

  z-index: 2;

  width: 145px;

  opacity: .48;

  transform: scaleX(-1);
}


/* ==========================================================
   FAN
========================================================== */

.hero-fan-right {
  top: 75px;
  right: -10px;

  z-index: 3;

  width: 82px;

  opacity: .65;

  transform: rotate(9deg);
}


/* ==========================================================
   FLOWER LEFT
========================================================== */

.hero-flower-left {
  left: -25px;
  bottom: -5px;

  z-index: 3;

  width: 150px;

  opacity: .75;

  transform:
    rotate(-7deg);
}


/* ==========================================================
   FLOWER RIGHT
========================================================== */

.hero-flower-right {
  right: -35px;
  bottom: 25px;

  z-index: 3;

  width: 125px;

  opacity: .55;

  transform:
    scaleX(-1)
    rotate(-5deg);
}


/* ==========================================================
   TABLET
========================================================== */

@media (min-width: 521px) {

  .hero-content {
    padding-top: 60px;
  }

  .couple {
    width: 250px;
    height: 290px;
  }

}


/* ==========================================================
   MOBILE
========================================================== */

@media (max-width: 520px) {

  .hero {
    min-height: 620px;
  }


  .hero-content {
    padding:
      45px
      20px
      60px;
  }


  .top-label {
    font-size: 8px;
    letter-spacing: 2.5px;
  }


  .happiness-wrap {
    width: 72px;
    height: 72px;
  }


  .happiness {
    width: 57px;
    height: 57px;
  }


  .couple-image-wrap {
    width: 235px;
  }


  .couple {
    width: 215px;
    height: 250px;
  }


  .name {
    font-size: 23px;
  }


  .hero-cloud-left {
    width: 175px;

    left: -50px;
  }


  .hero-cloud-right {
    width: 120px;

    right: -50px;
  }


  .hero-fan-right {
    width: 70px;

    right: -15px;
  }


  .hero-flower-left {
    width: 125px;

    left: -30px;
  }


  .hero-flower-right {
    width: 105px;

    right: -35px;
  }

}


/* ==========================================================
   SMALL MOBILE
========================================================== */

@media (max-width: 380px) {

  .hero {
    min-height: 590px;
  }


  .hero-content {
    padding:
      38px
      15px
      55px;
  }


  .couple-image-wrap {
    width: 215px;
  }


  .couple {
    width: 195px;
    height: 225px;
  }


  .name {
    font-size: 21px;
  }


  .date {
    font-size: 10px;

    letter-spacing: 2.5px;
  }

}

</style>
