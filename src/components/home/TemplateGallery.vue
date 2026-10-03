<template>
  <section id="gallery" class="gallery">
    <div class="mk-container">
      <header class="gallery-head">
        <h2>
          Mẫu thiệp cưới online
          <em>đẹp nhất</em>
        </h2>

        <p>Khám phá những mẫu thiệp cưới được thiết kế tinh tế và hiện đại</p>
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

      <div class="gallery-cta">
        <router-link :to="{ name: 'Templates' }" class="gallery-cta__btn">
          Xem tất cả mẫu thiệp
          <span aria-hidden="true">→</span>
        </router-link>

        <p class="gallery-cta__note">
          Những mẫu thiệp độc đáo đang chờ bạn
        </p>
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

.gallery-head {
  margin-bottom: 28px;

  text-align: center;
}

.gallery-head h2 {
  margin: 0 0 10px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(24px, 3.4vw, 36px);
  font-weight: 700;

  line-height: 1.15;
}

.gallery-head h2 em {
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-script, cursive);
  font-style: normal;
}

.gallery-head p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

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

/* =====================================================
   CTA CUỐI — nút đỏ tròn như bản gốc
===================================================== */

.gallery-cta {
  margin-top: 44px;

  text-align: center;
}

.gallery-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 16px 32px;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);
  color: #fdf6ec;

  font-size: 15.5px;
  font-weight: 600;

  text-decoration: none;

  box-shadow: 0 16px 36px rgba(166, 58, 46, 0.3);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

.gallery-cta__btn:hover {
  transform: scale(1.05);

  filter: brightness(1.06);

  box-shadow: 0 22px 46px rgba(166, 58, 46, 0.38);
}

.gallery-cta__note {
  margin: 12px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 13.5px;
}

@media (min-width: 768px) {
  .gallery {
    padding: 64px 0 52px;
  }
}
</style>
