<template>
  <section
    class="opening"
    :style="themeStyle"
  >
    <!-- Background -->
    <HeroBackground
      :background="backgroundImage"
    />

    

    <!-- Invitation -->
    <HeroCard
      :guest-name="guestName"
      :groom-name="wedding.groomName"
      :bride-name="wedding.brideName"
      :groom-image="
        wedding.couple?.Groom?.Avatar || defaultAvatar
      "
      :bride-image="
        wedding.couple?.Bride?.Avatar || defaultAvatar
      "
      :wedding-date="wedding.weddingDate"
      :address="wedding.hero?.Location || getLocation"
      @open="openInvitation"
    />
  </section>
  <!-- Particles -->
    <HeroParticles />
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
  return theme.value?.Colors || {};
});

const fonts = computed(() => {
  return theme.value?.Fonts || {};
});



const backgroundImage = computed(() => {
  return (
    props.wedding?.coverImage ||
    ""
  );
});



const getLocation = computed(() => {
  return props.wedding?.hero?.Location || "";
});


const themeStyle = computed(() => {
  return {
    "--primary": colors.value.Primary || "#7b0d0d",
    "--secondary": colors.value.Secondary || "#9d2525",

    "--accent": colors.value.Accent || "#c79d5c",
    "--accent-light":
      colors.value.AccentLight || "#f7d8a3",

    "--background":
      colors.value.Background || "#f8f5ed",

    "--background-secondary":
      colors.value.BackgroundSecondary || "#eee8dc",

    "--text":
      colors.value.Text || "#5c4d46",

    "--text-secondary":
      colors.value.TextSecondary || "#806f66",

    "--white":
      colors.value.White || "#fffaf4",

    "--font-main":
      fonts.value.Main ||
      "Cormorant Garamond",

    "--font-heading":
      fonts.value.Heading ||
      "Cormorant Garamond",

    "--font-script":
      fonts.value.Script ||
      "Allura",
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

  background: url("@/assets/bg-frame.jpg") center / cover;

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

  background: url("@/assets/bg-frame.jpg") center / cover;
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