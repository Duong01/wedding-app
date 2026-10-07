<template>
  <section ref="root" class="mk-section mk-section--alt">
    <div class="mk-container">
      <header class="mk-head mk-head--center rv">
        <p class="mk-eyebrow">{{ $t('testi.eyebrow') }}</p>

        <h2>
          {{ $t('testi.h2a') }}
          <em>{{ $t('testi.h2b') }}</em>
        </h2>

        <p class="testi-rating">
          <span class="testi-rating__stars" aria-hidden="true">★★★★★</span>
          {{ $t('testi.rating') }}
        </p>
      </header>

      <RailHint :text="$t('testi.swipe')" />

      <div class="quotes mk-rail">
        <figure
          v-for="(item, index) in TESTIMONIALS"
          :key="item.name"
          class="quote rv"
          :data-rv-delay="index % 3"
        >
          <span class="quote__stars" :aria-label="$t('testi.stars', { n: 5 })">
            ★★★★★
          </span>

          <blockquote>{{ item.text }}</blockquote>

          <figcaption>
            <span class="quote__avatar" aria-hidden="true">{{ item.orn }}</span>

            <span class="quote__who">
              <strong>{{ item.name }}</strong>
              <span>{{ item.meta }}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
import RailHint from "@/components/marketing/RailHint.vue";

import { useReveal } from "@/composables/useReveal";
import { TESTIMONIALS } from "@/data/siteContent";

const root = useReveal();
</script>

<style scoped>
/*
 * Thẻ đánh giá: 5 sao foil trên đầu, lời chúc ở giữa, chân
 * thẻ là avatar ornament + tên cặp đôi. Dòng tổng điểm ngay
 * dưới tiêu đề để củng cố uy tín ngay từ cái nhìn đầu.
 */

.testi-rating {
  display: inline-flex;
  align-items: center;

  gap: 10px;

  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;
  font-weight: 600;
}

.testi-rating__stars {
  color: var(--studio-foil, #b9975b);

  font-size: 16px;
  letter-spacing: 0.12em;
}

.quotes {
  display: grid;
  grid-template-columns: 1fr;

  gap: 14px;
}

.quote {
  display: flex;
  flex-direction: column;

  margin: 0;
  padding: 26px 22px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 22px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 16px 40px rgba(43, 33, 24, 0.05);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.quote:hover {
  transform: translateY(-4px);

  box-shadow: 0 24px 52px rgba(43, 33, 24, 0.1);
}

.quote__stars {
  margin-bottom: 14px;

  color: var(--studio-foil, #b9975b);

  font-size: 15px;
  letter-spacing: 0.14em;
}

.quote blockquote {
  flex: 1;

  margin: 0 0 18px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14.5px;

  line-height: 1.8;
}

.quote figcaption {
  display: flex;
  align-items: center;

  gap: 12px;

  padding-top: 16px;

  border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.1));
}

.quote__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  flex-shrink: 0;

  border: 1px solid rgba(185, 151, 91, 0.3);
  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol);
  font-size: 18px;
}

.quote__who {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.quote__who strong {
  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 600;
}

.quote__who span {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;
}

@media (min-width: 768px) {
  .quotes {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quote {
    transition: none;
  }
}
</style>
