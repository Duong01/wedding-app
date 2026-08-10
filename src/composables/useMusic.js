import { ref, watch } from "vue";
import { useMusicStore } from "@/stores/music";

const audio = ref(null);

let initialized = false;

export function useMusic() {
  const store = useMusicStore();

  function init(el) {
    if (!el) return;

    audio.value = el;

    if (!initialized) {
      initialized = true;

      audio.value.volume = store.volume;

      if (store.src) {
        audio.value.src = store.src;
        audio.value.load();
      }

      audio.value.addEventListener("play", () => {
        store.play();
      });

      audio.value.addEventListener("pause", () => {
        store.pause();
      });

      audio.value.addEventListener("ended", () => {
        store.pause();
      });

      audio.value.addEventListener("error", (event) => {
        console.error(
          "Không thể phát nhạc:",
          event,
          audio.value?.src
        );
      });
    }
  }

  async function play() {
    if (!audio.value) {
      console.warn("Music audio chưa được khởi tạo.");
      return false;
    }

    try {
      if (audio.value.src !== store.src) {
        audio.value.src = store.src;
        audio.value.load();
      }

      audio.value.volume = store.volume;

      await audio.value.play();

      store.play();

      return true;
    } catch (error) {
      console.error("Không thể phát nhạc:", error);

      store.pause();

      return false;
    }
  }

  function pause() {
    if (!audio.value) return;

    audio.value.pause();

    store.pause();
  }

  function toggle() {
    if (store.playing) {
      pause();
    } else {
      play();
    }
  }

  watch(
    () => store.volume,
    (value) => {
      if (audio.value) {
        audio.value.volume = value;
      }

      localStorage.setItem(
        "music-volume",
        String(value)
      );
    },
    {
      immediate: true
    }
  );

  watch(
    () => store.src,
    (src) => {
      if (!audio.value || !src) return;

      audio.value.src = src;
      audio.value.load();
    }
  );

  return {
    audio,
    store,
    init,
    play,
    pause,
    toggle
  };
}