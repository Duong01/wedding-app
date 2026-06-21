import { defineStore } from "pinia";

export const useMusicStore = defineStore("music", {

    state: () => ({

        playing: false,

        volume: 0.6,

        src: "/music/default.mp3"

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