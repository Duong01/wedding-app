<template>
  <section class="mk-section mk-section--alt">
    <div class="mk-container">
      <header class="mk-head mk-head--center">
        <p class="mk-eyebrow">Bộ sưu tập</p>

        <h2>
          Năm bản sắc,
          <em>một ngày chung đôi.</em>
        </h2>

        <p>
          Mỗi bộ sưu tập bám theo một tinh thần riêng — chọn hướng rồi xem
          toàn bộ mẫu trong đó.
        </p>
      </header>

      <RailHint text="Vuốt ngang để xem đủ năm bộ sưu tập" />

      <div class="collections mk-rail">
        <router-link
          v-for="col in cards"
          :key="col.id"
          :to="{ name: col.routeName }"
          class="col-card"
        >
          <span class="col-swatches" aria-hidden="true">
            <span
              v-for="(swatch, index) in col.swatches"
              :key="index"
              class="col-swatch"
              :style="{ background: swatch }"
            ></span>
          </span>

          <h3>{{ col.title }}</h3>

          <p class="col-sub">{{ col.sub }}</p>

          <p class="col-text">{{ col.text }}</p>

          <span class="col-more">
            Xem bộ sưu tập
            <span aria-hidden="true">→</span>
          </span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import RailHint from "@/components/marketing/RailHint.vue";

import { COLLECTIONS } from "@/data/templateCollections";
import { COLLECTION_LANDING } from "@/data/siteContent";

const cards = computed(() =>
  COLLECTIONS.map((col) => {
    const landing = COLLECTION_LANDING[col.id] || {};

    return {
      id: col.id,
      sub: col.sub,
      swatches: col.swatches,
      title: landing.title || col.name,
      text: landing.text || col.sub,
      routeName: landing.routeName || "Templates",
    };
  })
);
</script>

<style scoped>
.collections {
  display: grid;
  grid-template-columns: 1fr;

  gap: 14px;
}

.col-card {
  display: flex;
  flex-direction: column;

  padding: 24px 22px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 22px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 16px 40px rgba(43, 33, 24, 0.05);

  text-decoration: none;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.col-card:hover {
  transform: translateY(-4px);

  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 24px 52px rgba(43, 33, 24, 0.1);
}

.col-swatches {
  display: flex;

  gap: 6px;

  margin-bottom: 16px;
}

.col-swatch {
  width: 26px;
  height: 26px;

  border: 1px solid rgba(43, 33, 24, 0.1);
  border-radius: 50%;
}

.col-card h3 {
  margin: 0 0 6px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 600;
}

.col-sub {
  margin: 0 0 10px;

  color: var(--studio-foil, #b9975b);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.col-text {
  flex: 1;

  margin: 0 0 18px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.7;
}

.col-more {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  color: var(--studio-seal, #a63a2e);

  font-size: 13px;
  font-weight: 650;
}

@media (min-width: 768px) {
  .collections {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 18px;
  }
}

@media (min-width: 1024px) {
  .collections {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .col-card {
    grid-column: span 2;
  }

  .col-card:nth-child(4),
  .col-card:nth-child(5) {
    grid-column: span 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .col-card {
    transition: none;
  }
}
</style>
