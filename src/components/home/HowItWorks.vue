<template>
  <section ref="root" class="mk-section">
    <div class="mk-container">
      <header class="mk-head mk-head--center rv">
        <p class="mk-eyebrow">{{ $t('steps.eyebrow') }}</p>

        <h2>
          {{ $t('steps.h2a') }}
          <em>{{ $t('steps.h2b') }}</em>
        </h2>

        <p>{{ $t('steps.lead') }}</p>
      </header>

      <div class="steps">
        <article
          v-for="(step, index) in STEPS"
          :key="step.title"
          class="step rv"
          :data-rv-delay="index"
        >
          <span class="step__seal" aria-hidden="true">{{ step.seal }}</span>

          <p class="step__kicker">{{ $t('guide.step') }} {{ index + 1 }}</p>

          <h3>{{ step.title }}</h3>

          <p class="step__text">{{ step.text }}</p>

          <p class="step__short">{{ step.short }}</p>

          <!-- mũi tên nối sang thẻ kế — chỉ hiện desktop -->
          <svg
            v-if="index < STEPS.length - 1"
            class="step__arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </article>
      </div>

      <div class="mk-cta rv">
        <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
          {{ $t('steps.cta') }}
        </router-link>

        <p class="mk-note">
          {{ $t('steps.note') }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useReveal } from "@/composables/useReveal";
import { STEPS } from "@/data/siteContent";

const root = useReveal();
</script>

<style scoped>
/*
 * Ba thẻ bước nối nhau bằng mũi tên trên desktop; trên điện
 * thoại xếp dọc, mũi tên xoay xuống. Con dấu 壹贰叁 lớn mờ ở
 * góc làm dấu ấn cho từng bước.
 */

.steps {
  display: grid;

  grid-template-columns: 1fr;

  gap: 14px;
}

.step {
  position: relative;

  display: flex;
  flex-direction: column;

  padding: 26px 24px 24px;

  overflow: hidden;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 22px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 10px 28px rgba(43, 33, 24, 0.07);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.step:hover {
  transform: translateY(-4px);

  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 20px 44px rgba(43, 33, 24, 0.12);
}

/* con dấu lớn mờ góc phải trên */
.step__seal {
  position: absolute;
  top: -14px;
  right: 6px;

  color: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  font-family: var(--font-symbol);
  font-size: 96px;
  line-height: 1;

  pointer-events: none;

  transition: color 0.3s ease, transform 0.3s ease;
}

.step:hover .step__seal {
  color: rgba(185, 151, 91, 0.28);

  transform: rotate(-6deg) scale(1.04);
}

.step__kicker {
  margin: 0 0 8px;

  color: var(--studio-foil, #b9975b);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.step h3 {
  position: relative;
  z-index: 1;

  margin: 0 0 8px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 21px;
  font-weight: 600;

  line-height: 1.25;
}

.step__text {
  position: relative;
  z-index: 1;

  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.7;
}

/* mô tả ngắn gọn — chỉ dùng trên điện thoại */
.step__short {
  position: relative;
  z-index: 1;

  margin: 8px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;

  line-height: 1.55;
}

/* mũi tên nối — chỉ hiện desktop */
.step__arrow {
  display: none;
}

/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 18px;
  }

  .step__short {
    display: none;
  }

  .step__arrow {
    position: absolute;
    top: 50%;
    right: -15px;
    z-index: 5;

    display: block;

    width: 30px;
    height: 30px;
    padding: 5px;

    border: 1px solid rgba(185, 151, 91, 0.4);
    border-radius: 50%;

    background: var(--studio-card, #fffdf8);
    color: var(--studio-seal, #a63a2e);

    box-shadow: 0 6px 16px rgba(43, 33, 24, 0.12);

    transform: translateY(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .step,
  .step__seal {
    transition: none;
  }
}
</style>
