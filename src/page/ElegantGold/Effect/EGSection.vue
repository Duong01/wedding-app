<template>
  <section
    class="eg-section"
    :class="[
      `eg-section--${variant}`,
      {
        'eg-section--dark': dark
      }
    ]"
  >
    <div class="eg-section__inner">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "default",
  },

  dark: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.eg-section {
  position: relative;

  width: 100%;

  padding:
    clamp(58px, 8vw, 92px)
    clamp(18px, 5vw, 60px);

  overflow: hidden;
}

.eg-section__inner {
  width: 100%;
  max-width: 780px;

  margin: 0 auto;
}

.eg-section--wide
.eg-section__inner {
  max-width: 100%;
}

.eg-section--compact {
  padding-top: 45px;
  padding-bottom: 45px;
}

.eg-section--dark {
  color: #fffdf6;

  background:
    var(--eg-primary);
}

@media (max-width: 600px) {
  .eg-section {
    padding:
      52px 16px;
  }
}
</style>