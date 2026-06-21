import { ref, watch } from "vue";

import { useMusicStore } from "@/stores/music";

export function useMusic() {

    const store = useMusicStore();

    const audio = ref();

    function init(el) {

        audio.value = el;

        audio.value.volume = store.volume;

        audio.value.src = store.src;

    }

    async function play() {

        if (!audio.value) return;

        try {

            await audio.value.play();

            store.play();

        }

        catch (e) {

            console.error(e);

        }

    }

    function pause() {

        if (!audio.value) return;

        audio.value.pause();

        store.pause();

    }

    watch(() => store.volume, value => {

        if (audio.value)

            audio.value.volume = value;

        localStorage.setItem("music-volume", value);

    });

    return {

        audio,

        store,

        init,

        play,

        pause

    };

}