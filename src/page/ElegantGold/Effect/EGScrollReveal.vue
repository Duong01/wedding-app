<template>
  <div
    ref="element"
    class="eg-reveal"
    :class="{
      'is-visible': visible
    }"
  >
    <slot />
  </div>
</template>

<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

const element = ref(null);

const visible = ref(false);

let observer = null;

onMounted(() => {
  if (!element.value) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;

      visible.value = true;

      observer?.disconnect();
    },
    {
      threshold: 0.12,
      rootMargin:
        "0px 0px -40px 0px",
    }
  );

  observer.observe(element.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
.eg-reveal {
  opacity: 0;

  transform:
    translate3d(0, 28px, 0);

  transition:
    opacity 0.8s
      cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s
      cubic-bezier(0.22, 1, 0.36, 1);
}

.eg-reveal.is-visible {
  opacity: 1;

  transform:
    translate3d(0, 0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .eg-reveal {
    opacity: 1;

    transform: none;

    transition: none;
  }
}
</style>