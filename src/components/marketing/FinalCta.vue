<template>
  <section ref="root" class="mk-final">
    <div class="mk-container">
      <div class="mk-final__box rv">
        <!-- vệt sáng foil trượt chậm quanh khối -->
        <span class="mk-final__glow" aria-hidden="true"></span>

        <span class="mk-final__seal" aria-hidden="true">囍</span>

        <h2>
          {{ title || $t("finalCta.title") }}
          <em>{{ titleAccent || $t("finalCta.accent") }}</em>
        </h2>

        <p>{{ text || $t("finalCta.text") }}</p>

        <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--light">
          {{ cta || $t("footer.createNow") }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useReveal } from "@/composables/useReveal";

defineProps({
  /* Bỏ trống → dùng câu mặc định theo ngôn ngữ giao diện ($t trong template) */
  title: { type: String, default: "" },
  titleAccent: { type: String, default: "" },
  text: { type: String, default: "" },
  cta: { type: String, default: "" },
});

const root = useReveal();
</script>

<style scoped>
/*
 * Vệt sáng foil trượt chậm theo đường chéo — hiệu ứng "sống"
 * duy nhất của khối CTA, đủ tinh tế cho trang cưới.
 */
.mk-final__glow {
  position: absolute;

  top: -60%;
  left: 0;

  width: 60%;
  height: 220%;

  background: linear-gradient(
    100deg,
    transparent,
    rgba(233, 189, 118, 0.14),
    transparent
  );

  transform: translateX(-100%) rotate(18deg);

  pointer-events: none;

  animation: final-glow 7s ease-in-out infinite;
}

@keyframes final-glow {
  0% {
    transform: translateX(-100%) rotate(18deg);

    opacity: 0;
  }

  20%,
  80% {
    opacity: 1;
  }

  100% {
    transform: translateX(220%) rotate(18deg);

    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mk-final__glow {
    animation: none;

    opacity: 0;
  }
}
</style>
