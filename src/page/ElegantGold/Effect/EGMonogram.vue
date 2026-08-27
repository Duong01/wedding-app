<template>
  <div
    class="eg-monogram"
    :style="{
      '--size': `${size}px`
    }"
  >
    <span class="eg-monogram__text">
      {{ value }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: String,
    required: true,
  },

  size: {
    type: Number,
    default: 90,
  },
});
</script>

<style scoped>
.eg-monogram {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: var(--size);
  height: var(--size);

  margin: auto;

  border:
    1px solid
    rgba(212, 175, 55, 0.65);

  border-radius: 50%;

  color: var(--eg-accent);

  background:
    rgba(255, 253, 246, 0.5);
}

.eg-monogram::before {
  content: "";

  position: absolute;

  inset: 6px;

  border:
    1px solid
    rgba(212, 175, 55, 0.25);

  border-radius: 50%;
}

.eg-monogram__text {
  position: relative;

  font-family:
    "Allura",
    cursive;

  font-size:
    calc(var(--size) * 0.3);

  line-height: 1;

  transform: translateY(-2px);
}
</style>