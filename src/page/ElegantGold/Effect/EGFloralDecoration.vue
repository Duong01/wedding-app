<template>
  <div
    class="eg-floral"
    :class="`eg-floral--${position}`"
    aria-hidden="true"
  >
    <span class="eg-floral__branch">
      ❧
    </span>

    <span class="eg-floral__dot"></span>
    <span class="eg-floral__dot"></span>
    <span class="eg-floral__dot"></span>
  </div>
</template>

<script setup>
defineProps({
  position: {
    type: String,
    default: "bottom",
  },
});
</script>

<style scoped>
.eg-floral {
  position: absolute;

  width: 90px;
  height: 90px;

  pointer-events: none;

  color: var(--eg-accent);

  opacity: 0.45;
}

.eg-floral--top {
  top: 20px;
  right: 20px;

  transform:
    rotate(180deg);
}

.eg-floral--bottom {
  bottom: 20px;
  left: 20px;
}

.eg-floral__branch {
  font-family:
    Georgia,
    serif;

  font-size: 70px;

  line-height: 1;
}

.eg-floral__dot {
  position: absolute;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background:
    var(--eg-accent);
}

.eg-floral__dot:nth-child(2) {
  top: 18px;
  left: 48px;
}

.eg-floral__dot:nth-child(3) {
  top: 32px;
  left: 64px;
}

.eg-floral__dot:nth-child(4) {
  top: 46px;
  left: 54px;
}
</style>