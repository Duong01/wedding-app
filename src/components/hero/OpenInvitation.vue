<template>
  <section class="opening">
    <HeroBackground />
    <HeroParticles />
    <HeroCard
      :guest-name="guestName"
      :groom-name="wedding.groomName"
      :bride-name="wedding.brideName"
      :groom-image="wedding.couple?.groom?.avatar || defaultAvatar"
      :bride-image="wedding.couple?.bride?.avatar || defaultAvatar"
      :wedding-date="wedding.weddingDate"
      :address="wedding.location"
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
const wedding1 = computed(() => store.wedding);
const wedding = computed(() => wedding1.value.hero ?? {});

const guestName = computed(() => "Kính mời");
const defaultAvatar = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=80";


const { play } = useMusic();

async function openInvitation() {
  await play();
  gsap.to(".opening", {
    opacity: 0,
    scale: 1.04,
    duration: 1,
    ease: "power3.inOut",
    onComplete() {
      emit("open");
    }
  });
}
</script>

<style scoped>
.opening {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 999;
  background: linear-gradient(135deg, #140b15 0%, #2e1b25 100%);
}
</style>
