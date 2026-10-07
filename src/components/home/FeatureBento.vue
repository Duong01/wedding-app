<template>
  <section ref="root" class="mk-section mk-section--alt">
    <div class="mk-container">
      <header class="mk-head mk-head--center rv">
        <p class="mk-eyebrow">{{ $t('bento.eyebrow') }}</p>

        <h2>
          <i18n-t keypath="bento.h2" tag="span">
            <template #work>
              <em>{{ $t("bento.work") }}</em>
            </template>
          </i18n-t>
        </h2>
      </header>

      <RailHint :text="$t('bento.swipe')" />

      <div class="bento mk-rail">
        <article
          v-for="(item, index) in FEATURES"
          :key="item.title"
          class="mk-card bento-card rv"
          :class="`is-${index}`"
          :data-rv-delay="index % 4"
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

import { useReveal } from "@/composables/useReveal";
import { FEATURES } from "@/data/siteContent";

const root = useReveal();
</script>

<style scoped>
/*
 * Bento mosaic bất đối xứng: 8 tính năng chia 4 hàng, mỗi
 * hàng 2 ô nhưng xen kẽ ô rộng/hẹp (7/5 rồi 5/7) — tạo nhịp
 * so le thay vì lưới đều tăm tắp. Ô đầu tiên (tính năng chủ
 * đạo "phong cách Á Đông") mang nền đỏ son nhạt nổi bật.
 */

.bento {
  display: grid;

  grid-template-columns: 1fr;

  gap: 14px;
}

/* ô chủ đạo — nền đỏ son nhạt, viền đậm hơn */
.bento-card.is-0 {
  border-color: rgba(166, 58, 46, 0.3);

  background:
    radial-gradient(
      circle at 92% 0%,
      rgba(166, 58, 46, 0.1),
      transparent 48%
    ),
    var(--studio-card, #fffdf8);
}

.bento-card.is-0 .mk-orn {
  background: rgba(166, 58, 46, 0.12);
}

@media (min-width: 768px) {
  .bento {
    grid-template-columns: repeat(12, minmax(0, 1fr));

    gap: 18px;
  }

  /* hàng 1: 7/5 — hàng 2: 5/7 — hàng 3: 7/5 — hàng 4: 5/7 */
  .bento-card.is-0,
  .bento-card.is-6 {
    grid-column: span 7;
  }

  .bento-card.is-1,
  .bento-card.is-7 {
    grid-column: span 5;
  }

  .bento-card.is-2,
  .bento-card.is-4 {
    grid-column: span 5;
  }

  .bento-card.is-3,
  .bento-card.is-5 {
    grid-column: span 7;
  }
}
</style>
