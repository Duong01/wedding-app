<template>
  <div class="hero-background">

    <!-- Nền đỏ -->
    <div class="red-background"></div>

    <!-- Ảnh nền người dùng tải lên (ưu tiên cao nhất) -->
    <div v-if="background" class="photo-background">
      <img :src="background" alt="" draggable="false" />
    </div>

    <!-- Hoa văn chìm -->
    <div class="pattern"></div>

    <!-- Ánh sáng -->
    <div class="warm-glow"></div>

    <!-- Viền tối -->
    <div class="vignette"></div>

  </div>
</template>

<script setup>
defineProps({
  background: {
    type: String,
    default: "",
  },
});
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
   PHOTO BACKGROUND (ảnh người dùng tải lên)
========================================================= */

.photo-background {
  position: absolute;

  inset: 0;

  overflow: hidden;
}

.photo-background img {
  width: 100%;

  height: 100%;

  object-fit: cover;

  object-position: center 28%;

  opacity: 0.42;

  filter: saturate(0.86) contrast(1.05) brightness(0.9);
}

.photo-background::after {
  content: "";

  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      ellipse at center 45%,
      rgba(77, 5, 8, 0.62) 0%,
      rgba(77, 5, 8, 0.34) 48%,
      rgba(77, 5, 8, 0) 76%
    ),
    linear-gradient(
      180deg,
      rgba(141, 17, 21, 0.72),
      rgba(123, 13, 13, 0.42) 45%,
      rgba(105, 9, 12, 0.78)
    );
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
      var(--p-hero-glow, rgba(174, 43, 43, 0.35)),
      transparent 55%
    ),

    linear-gradient(
      180deg,
      var(--p-hero-1, #8d1115) 0%,
      var(--p-hero-2, #7b0d0d) 45%,
      var(--p-hero-3, #69090c) 100%
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