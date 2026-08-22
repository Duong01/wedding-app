<template>
  <div class="hero-background">

    <!-- Nền đỏ -->
    <div class="red-background"></div>

    <!-- Hoa văn chìm -->
    <div class="pattern"></div>

    <!-- Ánh sáng -->
    <div class="warm-glow"></div>

    <!-- Viền tối -->
    <div class="vignette"></div>

  </div>
</template>

<script setup>
</script>

<style scoped>

.hero-background {
  position: absolute;

  inset: 0;

  z-index: 0;

  overflow: hidden;

  pointer-events: none;
}


/* =========================================================
   RED BACKGROUND
========================================================= */

.red-background {
  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at 50% 35%,
      rgba(174, 43, 43, 0.35),
      transparent 55%
    ),

    linear-gradient(
      180deg,
      #8d1115 0%,
      #7b0d0d 45%,
      #69090c 100%
    );
}


/* =========================================================
   HOA VĂN CHỮ HỶ
========================================================= */

.pattern {
  position: absolute;

  inset: 0;

  background-image:
    url("@/assets/chu-hy.webp");


  background-position:
    center 30%;

  background-size:
    360px auto;

  opacity: 0.08;

  filter:
    sepia(0.3)
    brightness(1.25);

  mix-blend-mode: screen;
}


/* =========================================================
   WARM GLOW
========================================================= */

.warm-glow {
  position: absolute;

  width: 500px;

  height: 500px;

  top: 30%;

  left: 50%;

  transform:
    translate(-50%, -50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(244, 194, 108, 0.15),
      transparent 70%
    );

  filter: blur(35px);
}


/* =========================================================
   VIGNETTE
========================================================= */

.vignette {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(45, 0, 0, 0.22),
      transparent 20%,
      transparent 80%,
      rgba(45, 0, 0, 0.22)
    ),

    linear-gradient(
      180deg,
      rgba(35, 0, 0, 0.18),
      transparent 20%,
      transparent 75%,
      rgba(35, 0, 0, 0.35)
    );
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

  .pattern {
    background-size: 300px auto;

    background-position:
      center 30%;

    opacity: 0.07;
  }

  .warm-glow {
    width: 380px;

    height: 380px;
  }

}

</style>