import { defineStore } from "pinia";
import musicFile from "@/assets/music/So_Beautiful_In_White.mp3";

export const useMusicStore = defineStore("music", {
  state: () => ({
    playing: false,

    volume: 0.6,

    src: musicFile
  }),

  actions: {
    play() {
      this.playing = true;
    },

    pause() {
      this.playing = false;
    },

    setVolume(value) {
      this.volume = value;
    },

    setSource(src) {
      this.src = src;
    }
  }
});