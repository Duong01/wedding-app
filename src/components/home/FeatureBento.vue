<template>
  <section class="mk-section mk-section--alt">
    <div class="mk-container">
      <header class="mk-head mk-head--center">
        <p class="mk-eyebrow">Vì sao chọn chúng tôi</p>

        <h2>
          Thiệp cưới được làm như một
          <em>tác phẩm</em>
          — không phải một biểu mẫu.
        </h2>
      </header>

      <RailHint text="Vuốt ngang để xem đủ tám tính năng" />

      <div class="bento mk-rail">
        <article
          v-for="(item, index) in FEATURES"
          :key="item.title"
          class="mk-card bento-card"
          :class="`is-${index}`"
        >
          <span class="mk-orn" aria-hidden="true">{{ item.orn }}</span>

          <h3>{{ item.title }}</h3>

          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import RailHint from "@/components/marketing/RailHint.vue";

import { FEATURES } from "@/data/siteContent";
</script>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: 1fr;

  gap: 14px;
}

@media (min-width: 768px) {
  .bento {
    grid-template-columns: repeat(4, minmax(0, 1fr));

    gap: 18px;
  }

  /* Bento bất đối xứng: hai ô đầu trải rộng hơn */
  .bento-card.is-0,
  .bento-card.is-1 {
    grid-column: span 2;
  }
}
</style>
