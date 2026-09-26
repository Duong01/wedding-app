<template>
  <section class="mk-section mk-section--alt">
    <div class="mk-container">
      <header class="mk-head mk-head--center">
        <p class="mk-eyebrow">Khách hàng nói gì</p>

        <h2>
          Hơn mười hai nghìn cặp đôi
          <em>đã gửi thiệp qua đây.</em>
        </h2>
      </header>

      <RailHint text="Vuốt ngang để đọc thêm đánh giá" />

      <div class="quotes mk-rail">
        <figure
          v-for="item in TESTIMONIALS"
          :key="item.name"
          class="quote"
        >
          <span class="quote-orn" aria-hidden="true">{{ item.orn }}</span>

          <blockquote>{{ item.text }}</blockquote>

          <figcaption>
            <strong>{{ item.name }}</strong>
            <span>{{ item.meta }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
import RailHint from "@/components/marketing/RailHint.vue";

import { TESTIMONIALS } from "@/data/siteContent";
</script>

<style scoped>
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

.quote-orn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  margin-bottom: 16px;

  border: 1px solid rgba(185, 151, 91, 0.3);
  border-radius: 12px;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol);
  font-size: 18px;
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
  flex-direction: column;

  gap: 3px;

  padding-top: 16px;

  border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.1));
}

.quote figcaption strong {
  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 600;
}

.quote figcaption span {
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
