<template>
  <section class="mk-section mk-section--alt">
    <div class="mk-container">
      <header class="mk-head mk-head--center">
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
