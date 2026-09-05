<template>
  <div class="romantic-divider" aria-hidden="true">

    <svg
      viewBox="0 0 520 70"
      class="divider-svg"
      preserveAspectRatio="none"
    >

      <!-- Cành trái -->
      <path
        d="M20 35
           C70 35 80 28 115 35
           C145 41 170 36 205 35"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
      />

      <!-- Cành phải -->
      <path
        d="M500 35
           C450 35 440 28 405 35
           C375 41 350 36 315 35"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
      />

      <!-- Lá trái -->

      <path
        d="M82 31 C73 18 61 14 49 16 C57 28 69 34 82 31Z"
        fill="currentColor"
        opacity=".45"
      />

      <path
        d="M116 36 C108 48 97 53 85 51 C92 40 102 35 116 36Z"
        fill="currentColor"
        opacity=".35"
      />

      <path
        d="M150 35 C143 22 133 17 122 19 C128 29 138 35 150 35Z"
        fill="currentColor"
        opacity=".4"
      />

      <!-- Lá phải -->

      <path
        d="M438 31 C447 18 459 14 471 16 C463 28 451 34 438 31Z"
        fill="currentColor"
        opacity=".45"
      />

      <path
        d="M404 36 C412 48 423 53 435 51 C428 40 418 35 404 36Z"
        fill="currentColor"
        opacity=".35"
      />

      <path
        d="M370 35 C377 22 387 17 398 19 C392 29 382 35 370 35Z"
        fill="currentColor"
        opacity=".4"
      />

      <!-- Trung tâm -->

      <g transform="translate(260 35)">

        <circle
          r="8"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
        />

        <circle
          r="3"
          fill="currentColor"
        />

        <!-- trái tim -->
        <path
          d="
            M0 4
            C-13 -5 -8 -13 -2 -10
            C0 -9 0 -6 0 -6
            C0 -6 0 -9 2 -10
            C8 -13 13 -5 0 4Z
          "
          fill="currentColor"
          opacity=".65"
        />

      </g>

    </svg>

  </div>
</template>
<script setup>
const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
});
</script>

<style scoped>
.romantic-divider {
  width: 100%;
  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #bd8a68;

  opacity: .72;

  pointer-events: none;
}

.divider-svg {
  width: min(520px, 100%);
  height: 70px;

  overflow: visible;

  animation: dividerBreath 5s ease-in-out infinite;
}

@keyframes dividerBreath {
  0%,
  100% {
    opacity: .65;
    transform: scaleX(.98);
  }

  50% {
    opacity: .9;
    transform: scaleX(1);
  }
}

@media (max-width: 600px) {
  .romantic-divider {
    height: 55px;
  }

  .divider-svg {
    height: 55px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .divider-svg {
    animation: none;
  }
}
</style>