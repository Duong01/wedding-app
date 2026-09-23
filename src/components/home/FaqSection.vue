<template>
  <section class="mk-section">
    <div class="mk-container faq-grid">
      <header class="faq-head">
        <p class="mk-eyebrow">Giải đáp</p>

        <h2>
          Bạn còn
          <em>thắc mắc?</em>
        </h2>

        <p>
          Tổng hợp những câu hỏi các cặp đôi hỏi tụi mình nhiều nhất trước
          khi bắt đầu.
        </p>

        <router-link
          :to="{ name: 'Guide' }"
          class="mk-btn mk-btn--outline mk-btn--sm faq-more"
        >
          Xem hướng dẫn chi tiết
        </router-link>
      </header>

      <FaqAccordion :items="FAQS" />
    </div>
  </section>
</template>

<script setup>
import FaqAccordion from "@/components/marketing/FaqAccordion.vue";

import { FAQS } from "@/data/siteContent";
</script>

<style scoped>
.faq-grid {
  display: grid;
  grid-template-columns: 1fr;

  gap: 28px;
}

.faq-head h2 {
  margin: 0 0 12px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 600;

  line-height: 1.15;
}

.faq-head h2 em {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.faq-head p {
  max-width: 420px;

  margin: 0 0 20px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15px;

  line-height: 1.75;
}

@media (min-width: 768px) {
  .faq-grid {
    grid-template-columns: 0.8fr 1.2fr;

    gap: 48px;
  }

  .faq-head {
    position: sticky;
    top: 96px;

    align-self: start;
  }
}
</style>
