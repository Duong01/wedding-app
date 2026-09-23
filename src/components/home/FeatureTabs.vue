<template>
  <section class="mk-section">
    <div class="mk-container">
      <header class="mk-head mk-head--center">
        <p class="mk-eyebrow">Tính năng</p>

        <h2>
          Mọi thứ một tấm thiệp cưới
          <em>cần có.</em>
        </h2>

        <p>
          Không chỉ là lời mời. Đây là nơi khách mời xem ảnh, chỉ đường, gửi
          lời chúc và mừng cưới — tất cả trong một đường link.
        </p>
      </header>

      <div class="tabs" role="tablist">
        <button
          v-for="(group, index) in FEATURE_GROUPS"
          :key="group.id"
          type="button"
          role="tab"
          class="tab"
          :class="{ 'is-active': index === activeIndex }"
          :aria-selected="index === activeIndex"
          @click="activeIndex = index"
        >
          {{ group.label }}
        </button>
      </div>

      <div class="panel">
        <div class="panel-media">
          <img
            :src="active.image"
            :alt="active.title"
            loading="lazy"
            @error="handleImageError"
          />

          <span class="panel-orn" aria-hidden="true">囍</span>
        </div>

        <div class="panel-body">
          <h3>{{ active.title }}</h3>

          <p class="panel-text">{{ active.text }}</p>

          <ul class="panel-points">
            <li v-for="point in active.points" :key="point">
              <span class="tick" aria-hidden="true">✦</span>
              {{ point }}
            </li>
          </ul>

          <router-link
            :to="{ name: 'Templates' }"
            class="mk-btn mk-btn--outline mk-btn--sm"
          >
            Xem mẫu có tính năng này
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { FEATURE_GROUPS } from "@/data/siteContent";
import { previewByStem } from "@/utils/weddingCard";

const activeIndex = ref(0);

const active = computed(() => {
  const group = FEATURE_GROUPS[activeIndex.value];

  return {
    ...group,
    image: previewByStem(group.image),
  };
});

function handleImageError(event) {
  const fallback = previewByStem(FEATURE_GROUPS[0].image);

  if (fallback && event.target.src !== fallback) {
    event.target.src = fallback;
  }
}
</script>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: 8px;

  margin-bottom: 28px;
}

.tab {
  padding: 10px 20px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 999px;

  background: rgba(255, 253, 248, 0.7);
  color: var(--studio-ink-soft, #5c4f43);

  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.tab:hover {
  border-color: rgba(185, 151, 91, 0.6);
}

.tab.is-active {
  background: var(--studio-ink, #2b2118);
  color: #f7f1e6;

  border-color: var(--studio-ink, #2b2118);
}

.panel {
  display: grid;
  grid-template-columns: 1fr;

  gap: 26px;
  align-items: center;

  padding: 22px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 26px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 20px 48px rgba(43, 33, 24, 0.07);
}

.panel-media {
  position: relative;

  overflow: hidden;

  border-radius: 18px;

  background: var(--studio-paper-deep, #efe6d4);
}

.panel-media img {
  display: block;

  width: 100%;

  aspect-ratio: 4 / 3;

  object-fit: cover;
  object-position: center top;
}

.panel-orn {
  position: absolute;

  top: 12px;
  left: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  border-radius: 10px;

  background: rgba(166, 58, 46, 0.9);
  color: #fff;

  font-family: var(--font-symbol);
  font-size: 18px;
}

.panel-body h3 {
  margin: 0 0 10px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(21px, 2.4vw, 28px);
  font-weight: 600;

  line-height: 1.2;
}

.panel-text {
  margin: 0 0 18px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15px;

  line-height: 1.75;
}

.panel-points {
  margin: 0 0 22px;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 10px;
}

.panel-points li {
  display: flex;

  gap: 10px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.6;
}

.tick {
  flex-shrink: 0;

  color: var(--studio-foil, #b9975b);

  font-size: 12px;

  line-height: 1.6;
}

@media (min-width: 768px) {
  .panel {
    grid-template-columns: 1fr 1fr;

    gap: 40px;

    padding: 30px;
  }
}
</style>
