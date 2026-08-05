<template>
  <div class="music">
    <audio ref="audio" loop preload="auto"></audio>

    <Transition name="zoom">
      <div
        class="music-btn"
        :class="{ playing: store.playing }"
        @click="toggle"
      >
        <v-icon size="32">
          {{ store.playing ? "mdi-disc" : "mdi-music" }}
        </v-icon>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useMusic } from "@/composables/useMusic";

const audio = ref();

const {
  store,

  init,

  play,

  pause,
} = useMusic();

onMounted(() => {
  init(audio.value);
});

function toggle() {
  if (store.playing) pause();
  else play();
}
</script>

<style scoped>
.music {
  position: fixed;
  left: 20px;
  bottom: 30px;
  z-index: 9999;
}

.music-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  background: linear-gradient(135deg, #ff7aa2 0%, #ff4d88 50%, #ff6b91 100%);
  box-shadow: 0 16px 36px rgba(255, 91, 139, 0.35);
  border: 2px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.music-btn:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 22px 42px rgba(255, 91, 139, 0.42);
}

.music-btn.playing {
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.zoom-enter-active,
.zoom-leave-active {
  transition: 0.35s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@media (max-width: 600px) {
  .music-btn {
    width: 40px;
    height: 40px;
  }
}
</style>