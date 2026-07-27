import { ref, watch } from "vue";

import { useMusicStore } from "@/stores/music";

export function useMusic() {

    const store = useMusicStore();

    const audio = ref();

    function init(el) {
        function init(el) {
    audio.value = el;

    console.log("store.src =", store.src);

    audio.value.src = store.src;

    console.log("audio.src =", audio.value.src);

    audio.value.load();

    audio.value.onerror = () => {
        console.log("Audio error", audio.value.error);
    };
}

    }

    async function play() {
    if (!audio.value) return;

    if (!audio.value.src) {
        console.error("Audio source is empty");
        return;
    }

    console.log(audio.value.src);

    try {
        await audio.value.play();
        store.play();
    } catch (e) {
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