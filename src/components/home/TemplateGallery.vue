<template>
  <section id="gallery" class="gallery">
    <div class="mk-container">
      <header class="mk-head">
        <div>
          <p class="mk-eyebrow">Bộ sưu tập</p>

          <h2>
            Chọn một
            <em>bản sắc</em>
            hợp với ngày chung đôi.
          </h2>
        </div>

        <router-link
          :to="{ name: 'Templates' }"
          class="mk-btn mk-btn--outline mk-btn--sm"
        >
          Xem tất cả
          <span aria-hidden="true">→</span>
        </router-link>
      </header>

      <div class="chips">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="chip"
          :class="{ 'is-active': activeCollection === tab.id }"
          @click="activeCollection = tab.id"
        >
          {{ tab.name }}

          <i v-if="tab.count !== undefined">{{ tab.count }}</i>
        </button>
      </div>

      <div v-if="loading" class="state-box">Đang tải mẫu thiệp…</div>

      <div v-else-if="items.length === 0" class="state-box">
        Chưa có mẫu thiệp trong bộ sưu tập này.
      </div>

      <TemplateCarousel3D
        v-else
        :items="items"
        @select="onSelect"
      />

      <div class="mk-cta">
        <router-link :to="{ name: 'Templates' }" class="mk-btn mk-btn--outline">
          Xem tất cả {{ total }} mẫu thiệp
          <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import TemplateCarousel3D from "@/components/marketing/TemplateCarousel3D.vue";

import { COLLECTIONS } from "@/data/templateCollections";
import { themeMeta, toCardItem } from "@/utils/weddingCard";

const props = defineProps({
  weddings: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const router = useRouter();

const activeCollection = ref("all");

const total = computed(() => props.weddings.length);

const tabs = computed(() => {
  const list = [{ id: "all", name: "Tất cả", count: props.weddings.length }];

  COLLECTIONS.forEach((col) => {
    const count = props.weddings.filter(
      (w) => themeMeta(w).collection === col.id
    ).length;

    if (count > 0) {
      list.push({ id: col.id, name: col.name, count });
    }
  });

  return list;
});

const items = computed(() => {
  const list =
    activeCollection.value === "all"
      ? props.weddings
      : props.weddings.filter(
          (w) => themeMeta(w).collection === activeCollection.value
        );

  return list.map(toCardItem);
});

function onSelect(item) {
  if (!item?.slug) {
    return;
  }

  /*
   * Bước 1 của luồng xem thiệp — trang giới thiệu mẫu.
   * Từ đó khách bấm "Xem thiệp" mới sang bước 2 (phong bì).
   */
  router.push({
    name: "WeddingIntro",
    params: { slug: item.slug },
  });
}
</script>

<style scoped>
.gallery {
  padding: 48px 0 40px;
}

.chips {
  display: flex;
  flex-wrap: wrap;

  gap: 8px;

  margin-bottom: 28px;
}

.chip {
  display: inline-flex;
  align-items: center;

  gap: 7px;

  padding: 9px 16px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 999px;

  background: var(--studio-glass, rgba(255, 253, 248, 0.7));
  color: var(--studio-ink-soft, #5c4f43);

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.chip i {
  font-style: normal;

  font-size: 11px;

  opacity: 0.6;
}

.chip:hover {
  border-color: rgba(185, 151, 91, 0.6);
}

.chip.is-active {
  background: var(--studio-contrast-bg, #2b2118);
  color: var(--studio-contrast-ink, #f7f1e6);

  border-color: var(--studio-contrast-bg, #2b2118);
}

.state-box {
  padding: 44px 20px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 20px;

  background: var(--studio-card, #fffdf8);
  color: var(--studio-ink-soft, #5c4f43);

  text-align: center;
}

@media (min-width: 768px) {
  .gallery {
    padding: 64px 0 52px;
  }
}
</style>
