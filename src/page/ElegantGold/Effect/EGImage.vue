<template>
  <div
    class="eg-image"
    :class="{
      'eg-image--rounded': rounded,
      'eg-image--circle': circle
    }"
  >
    <img
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
    />

    <div
      v-if="overlay"
      class="eg-image__overlay"
    />
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },

  alt: {
    type: String,
    default: "",
  },

  rounded: {
    type: Boolean,
    default: false,
  },

  circle: {
    type: Boolean,
    default: false,
  },

  overlay: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.eg-image {
  position: relative;

  width: 100%;

  overflow: hidden;
}

.eg-image img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 0.9s
    cubic-bezier(0.22, 1, 0.36, 1);
}

.eg-image:hover img {
  transform: scale(1.035);
}

.eg-image--rounded {
  border-radius: 18px;
}

.eg-image--circle {
  aspect-ratio: 1;

  border-radius: 50%;
}

.eg-image__overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      180deg,
      transparent 45%,
      rgba(0, 0, 0, 0.25)
    );

  pointer-events: none;
}
</style>