<template>
  <div class="eg-divider">
    <span class="eg-divider__line"></span>

    <span class="eg-divider__diamond">
      ✦
    </span>

    <span class="eg-divider__line"></span>
  </div>
</template>

<style scoped>
.eg-divider {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 18px auto;
}

.eg-divider__line {
  width: 55px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--eg-accent)
    );
}

.eg-divider__line:last-child {
  background:
    linear-gradient(
      90deg,
      var(--eg-accent),
      transparent
    );
}

.eg-divider__diamond {
  color: var(--eg-accent);

  font-size: 11px;

  line-height: 1;

  animation:
    eg-divider-pulse
    3s ease-in-out infinite;
}

@keyframes eg-divider-pulse {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}
</style>