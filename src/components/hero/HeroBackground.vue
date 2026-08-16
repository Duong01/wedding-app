<template>
  <div class="hero-background">
    <!-- Video -->
    <video
      v-if="videoUrl"
      class="bg-video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      :poster="coverImage"
    >
      <source :src="videoUrl" type="video/mp4" />
    </video>

    <!-- Image -->
    <div v-else class="bg-image" :style="backgroundStyle"></div>

    <!-- Overlay -->
    <div class="overlay"></div>

    <!-- Light -->
    <div class="light light-1"></div>

    <div class="light light-2"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";




const props = defineProps({
  background: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

console.log(props.background);


const videoUrl = computed(() => {
  return props.background.video || "";
});

const coverImage = computed(() => {
  return props.background.image || "";
});

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${coverImage.value})`,
}));
</script>

<style scoped lang="scss">
.hero-background {
  position: absolute;

  inset: 0;

  overflow: hidden;
}

/* ---------------- Image ---------------- */

.bg-image {
  position: absolute;

  inset: 0;

  background-position: center;

  background-size: cover;

  animation: kenburns 25s linear infinite alternate;
}

/* ---------------- Video ---------------- */

.bg-video {
  position: absolute;

  width: 100%;

  height: 100%;

  object-fit: cover;

  transform: scale(1.1);
}

/* ---------------- Overlay ---------------- */

.overlay {
  position: absolute;

  inset: 0;

  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.65)
  );
}

/* ---------------- Lights ---------------- */

.light {
  position: absolute;

  border-radius: 50%;

  filter: blur(140px);

  opacity: 0.25;
}

.light-1 {
  width: 400px;

  height: 400px;

  background: linear-gradient(135deg, #ffb6d9, #ffa0c9);

  top: -100px;

  left: -150px;
}

.light-2 {
  width: 450px;

  height: 450px;

  background: linear-gradient(135deg, #ffe0b2, #ffd8a8);

  bottom: -150px;

  right: -200px;
}

/* ---------------- Animation ---------------- */

@keyframes kenburns {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.18);
  }
}

@media (max-width: 600px) {
  .light-1 {
    width: 250px;

    height: 250px;
  }

  .light-2 {
    width: 300px;

    height: 300px;
  }
}
</style>
