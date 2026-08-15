<template>
  <div
    v-if="musicEnabled"
    class="music-control"
  >
    <audio
      ref="audio"
      loop
      preload="auto"
    ></audio>

    <button
      type="button"
      class="music-btn"
      :class="{
        playing: store.playing
      }"
      @click="toggle"
      aria-label="Bật hoặc tắt nhạc"
    >
      <v-icon size="30">
        {{
          store.playing
            ? "mdi-disc"
            : "mdi-music"
        }}
      </v-icon>

      <span class="music-ring"></span>
    </button>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
} from "vue";

import { useMusic } from "@/composables/useMusic";

const props = defineProps({
  music: {
    type: Object,
    default: () => ({
      enabled: false,
      url: "",
      title: "",
      autoplay: false,
    }),
  },
});

const {
  audio,
  store,
  init,
  play,
  pause,
  toggle,
} = useMusic();

const musicEnabled = computed(() => {
  return (
    props.music?.enabled === true &&
    !!props.music?.url
  );
});

onMounted(() => {
  if (!musicEnabled.value) {
    return;
  }

  console.log(
    "🎵 FloatingMusic init:",
    props.music
  );

  init(
    audio.value,
    props.music
  );
});

// Cho component cha gọi:
// floatingMusicRef.value.play()
defineExpose({
  play,
  pause,
  toggle,
});
</script>

<style scoped>
/* CSS của bạn giữ nguyên */
.music-control {
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 99999;
}

audio {
  display: none;
}

.music-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  background:
    linear-gradient(
      135deg,
      #ff8fab 0%,
      #ff5d8f 50%,
      #e94f78 100%
    );
  box-shadow:
    0 10px 30px rgba(232, 80, 120, 0.35),
    0 4px 12px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.music-btn:hover {
  transform: translateY(-4px) scale(1.06);
  box-shadow:
    0 16px 38px rgba(232, 80, 120, 0.45),
    0 6px 16px rgba(0, 0, 0, 0.15);
}

.music-btn:active {
  transform: scale(0.94);
}

.music-btn.playing {
  animation: musicRotate 5s linear infinite;
}

.music-btn :deep(.v-icon) {
  position: relative;
  z-index: 2;
}

.music-ring {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.55);
  pointer-events: none;
}

.music-btn.playing .music-ring {
  animation: musicPulse 1.8s ease-out infinite;
}

@keyframes musicRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes musicPulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }

  70% {
    transform: scale(1.35);
    opacity: 0;
  }

  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

@media (max-width: 600px) {
  .music-control {
    left: 16px;
    bottom: 18px;
  }

  .music-btn {
    width: 40px;
    height: 40px;
  }

  .music-btn :deep(.v-icon) {
    font-size: 26px !important;
  }
}
</style>