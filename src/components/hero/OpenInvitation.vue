<template>
  <section class="opening">


<!-- Background -->
<HeroBackground />

<!-- Effect -->
<HeroParticles />

<!-- Glass Card -->
<HeroCard
  :guest-name="guestName"
  :groom-name="wedding.groomName"
  :bride-name="wedding.brideName"
  @open="openInvitation"
/>


  </section>
</template>

<script setup>
import { computed } from "vue";
import { gsap } from "gsap";

import HeroBackground from "./HeroBackground.vue";
import HeroParticles from "./HeroParticles.vue";
import HeroCard from "./HeroCard.vue";
import { useMusic } from "@/composables/useMusic";

import { useWeddingStore } from "@/stores/wedding";

const emit = defineEmits(["open"]);

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const guestName = computed(() => {

    return "Kính mời";

});
const { play } = useMusic();

async function openInvitation() {

    await play();

    gsap.to(".opening", {

        opacity: 0,

        scale: 1.08,

        duration: 1,

        ease: "power3.inOut",

        onComplete() {

            emit("open");

        }

    });

}
</script>

<style scoped>

.opening{

    position:fixed;

    inset:0;

    overflow:hidden;

    z-index:999;

    background:#000;

}

</style>
