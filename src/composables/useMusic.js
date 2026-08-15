import {
  ref,
  watch,
  onBeforeUnmount,
} from "vue";

import { useMusicStore } from "@/stores/music";

export function useMusic() {
  const store = useMusicStore();

  const audio = ref(null);

  const music = ref(null);

  function init(el, musicData) {
    if (!el) {
      console.warn(
        "Music audio element chưa tồn tại."
      );

      return;
    }

    audio.value = el;
    music.value = musicData;

    audio.value.volume = store.volume;
    audio.value.loop = true;

    const src = musicData?.url;

    if (!src) {
      console.warn(
        "Thiệp hiện tại không có music.url"
      );

      return;
    }

    console.log(
      "🎵 Khởi tạo nhạc:",
      src
    );

    audio.value.src = src;
    audio.value.load();

    audio.value.addEventListener(
      "play",
      handlePlay
    );

    audio.value.addEventListener(
      "pause",
      handlePause
    );

    audio.value.addEventListener(
      "ended",
      handlePause
    );

    audio.value.addEventListener(
      "error",
      handleError
    );
  }

  function handlePlay() {
    store.play();
  }

  function handlePause() {
    store.pause();
  }

  function handleError(event) {
    const el = event.target;

    console.error(
      "❌ Không thể tải nhạc:",
      el.currentSrc
    );

    console.error(
      "Audio error:",
      el.error
    );

    console.error(
      "Error code:",
      el.error?.code
    );

    console.error(
      "Error message:",
      el.error?.message
    );
  }

  async function play() {
    if (!audio.value) {
      console.warn(
        "Music audio chưa được khởi tạo."
      );

      return false;
    }

    if (!music.value?.url) {
      console.warn(
        "Không có URL nhạc."
      );

      return false;
    }

    try {
      audio.value.volume = store.volume;

      await audio.value.play();

      store.play();

      return true;

    } catch (error) {
      console.error(
        "Không thể phát nhạc:",
        error
      );

      store.pause();

      return false;
    }
  }

  function pause() {
    if (!audio.value) {
      return;
    }

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
      immediate: true,
    }
  );

  onBeforeUnmount(() => {
    if (!audio.value) {
      return;
    }

    audio.value.pause();

    audio.value.removeEventListener(
      "play",
      handlePlay
    );

    audio.value.removeEventListener(
      "pause",
      handlePause
    );

    audio.value.removeEventListener(
      "ended",
      handlePause
    );

    audio.value.removeEventListener(
      "error",
      handleError
    );

    audio.value.removeAttribute("src");

    audio.value.load();

    audio.value = null;

    music.value = null;

    store.pause();
  });

  return {
    audio,
    music,
    store,
    init,
    play,
    pause,
    toggle,
  };
}