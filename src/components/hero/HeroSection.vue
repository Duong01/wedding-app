<template>
  <section class="hero-section">

    <!-- Nền -->
    <HeroBackground />

    <!-- Hiệu ứng -->
    <HeroParticles />
    <!-- Phượng -->
    <img
      src="@/assets/phuong.webp"
      class="dragon dragon-right"
      alt=""
      aria-hidden="true"
    />
    
    <!-- Rồng -->
    <img
      src="@/assets/rong.webp"
      class="dragon dragon-left"
      alt=""
      aria-hidden="true"
    />

    

    <!-- Nội dung -->
    <div class="hero-content-wrapper">
      <HeroContent :hero="hero" />
    </div>

    <!-- Decorative bottom -->
    <div class="hero-bottom-decoration"></div>

  </section>
</template>

<script setup>
import HeroBackground from "./HeroBackground.vue";
import HeroParticles from "./HeroParticles.vue";
import HeroContent from "./HeroContent.vue";

defineProps({
  hero: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
/* =========================================================
   HERO
========================================================= */

.hero-section {
  position: relative;

  width: 100%;

  height: 100dvh;

  min-height: 620px;

  overflow: hidden;

  background: #7b0d0d;

  color: #f8dfad;

  isolation: isolate;
}


/* =========================================================
   HERO CONTENT
========================================================= */

.hero-content-wrapper {
  position: relative;

  z-index: 10;

  width: 100%;

  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  padding:
    170px
    25px
    90px;
}


/* =========================================================
   RỒNG / PHƯỢNG
========================================================= */

.dragon {
  position: absolute;

  z-index: 5;

  pointer-events: none;

  user-select: none;

  object-fit: contain;

  filter:
    drop-shadow(
      0 5px 10px
      rgba(0, 0, 0, 0.15)
    );

  animation:
    dragonFloat
    6s ease-in-out infinite;
}


/* Rồng bên trái */

.dragon-left {
  top: 45px;

  left: 50%;

  width: 185px;

  transform:
    translateX(-100%)
    rotate(-4deg);
}


/* Phượng bên phải */

.dragon-right {
  top: 45px;

  left: 50%;

  width: 185px;

  transform:
    translateX(0%)
    rotate(4deg);
}


/* =========================================================
   ANIMATION
========================================================= */

@keyframes dragonFloat {

  0%,
  100% {
    margin-top: 0;
  }

  50% {
    margin-top: -5px;
  }

}


/* =========================================================
   ĐƯỜNG TRANG TRÍ CUỐI HERO
========================================================= */

.hero-bottom-decoration {
  position: absolute;

  z-index: 11;

  left: 50%;

  bottom: 24px;

  width: 80px;

  height: 1px;

  transform: translateX(-50%);

  background:
    linear-gradient(
      90deg,
      transparent,
      #e8c98f,
      transparent
    );

  opacity: 0.8;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 600px) {

  .hero-section {
    min-height: 100dvh;

    height: 100dvh;
  }

  .hero-content-wrapper {
    padding:
      150px
      20px
      75px;
  }

  .dragon-left {
    width: 145px;

    top: 35px;
  }

  .dragon-right {
    width: 145px;

    top: 35px;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

  .dragon-left {
    width: 125px;

    top: 32px;
  }

  .dragon-right {
    width: 125px;

    top: 32px;
  }

  .hero-content-wrapper {
    padding-top: 135px;
  }

}
</style>