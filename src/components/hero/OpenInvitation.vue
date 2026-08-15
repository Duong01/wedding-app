<template>
  <section
    class="opening"
    :style="themeStyle"
  >
    <!-- Background -->
    <HeroBackground
      :background="backgroundImage"
    />

    <!-- Particles -->
    <HeroParticles />

    <!-- Invitation -->
    <HeroCard
      :guest-name="guestName"
      :groom-name="wedding.groomName"
      :bride-name="wedding.brideName"
      :groom-image="
        wedding.couple?.groom?.avatar || defaultAvatar
      "
      :bride-image="
        wedding.couple?.bride?.avatar || defaultAvatar
      "
      :wedding-date="wedding.weddingDate"
      :address="wedding.hero?.location || getLocation"
      @open="openInvitation"
    />
  </section>
</template>

<script setup>
import { computed } from "vue";

import HeroBackground from "./HeroBackground.vue";
import HeroParticles from "./HeroParticles.vue";
import HeroCard from "./HeroCard.vue";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["open"]);



const defaultAvatar =
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=80";



const guestName = computed(() => {
  return "Kính mời";
});


const theme = computed(() => {
  return props.wedding?.theme || {};
});

const colors = computed(() => {
  return theme.value?.colors || {};
});

const fonts = computed(() => {
  return theme.value?.fonts || {};
});



const backgroundImage = computed(() => {
  return (
    props.wedding?.hero?.background ||
    props.wedding?.coverImage ||
    ""
  );
});



const getLocation = computed(() => {
  return props.wedding?.hero?.location || "";
});


const themeStyle = computed(() => {
  return {
    "--primary": colors.value.primary || "#7b0d0d",
    "--secondary": colors.value.secondary || "#9d2525",

    "--accent": colors.value.accent || "#c79d5c",
    "--accent-light":
      colors.value.accentLight || "#f7d8a3",

    "--background":
      colors.value.background || "#f8f5ed",

    "--background-secondary":
      colors.value.backgroundSecondary || "#eee8dc",

    "--text":
      colors.value.text || "#5c4d46",

    "--text-secondary":
      colors.value.textSecondary || "#806f66",

    "--white":
      colors.value.white || "#fffaf4",

    "--font-main":
      fonts.value.main ||
      "Cormorant Garamond",

    "--font-heading":
      fonts.value.heading ||
      "Cormorant Garamond",

    "--font-script":
      fonts.value.script ||
      "The Nautigal",
  };
});

const openInvitation = () => {
  emit("open");
};
</script>

<style scoped>
.opening {
  position: fixed;
  inset: 0;

  z-index: 999;

  width: 100%;
  height: 100dvh;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      var(--background) 0%,
      var(--background-secondary) 100%
    );

  color: var(--text);

  font-family: var(--font-main);

  isolation: isolate;
}

.opening::before {
  content: "";

  position: absolute;
  inset: 0;

  z-index: 0;

  pointer-events: none;

  background:
    radial-gradient(
      circle at 50% 30%,
      color-mix(
        in srgb,
        var(--white) 30%,
        transparent
      ),
      transparent 55%
    );
}

.opening > :deep(*) {
  position: relative;
  z-index: 1;
}

@media (max-width: 600px) {
  .opening {
    min-height: 100dvh;
  }
}
</style>