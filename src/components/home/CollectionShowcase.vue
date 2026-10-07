<template>
  <section ref="root" class="mk-section mk-section--alt">
    <div class="mk-container">
      <header class="mk-head mk-head--center rv">
        <p class="mk-eyebrow">{{ $t('stats.collections') }}</p>

        <h2>
          {{ $t('collections.h2a') }}
          <em>{{ $t('collections.h2b') }}</em>
        </h2>

        <p>
          {{ $t('collections.lead') }}
        </p>
      </header>

      <div class="collections">
        <router-link
          v-for="(col, index) in cards"
          :key="col.id"
          :to="{ name: col.routeName }"
          class="col-card rv"
          :data-rv-delay="index % 3"
        >
          <div
            class="col-media"
            @mouseenter="scroll.start"
            @mouseleave="scroll.stop"
          >
            <img
              v-if="col.src"
              :src="col.src"
              :alt="col.title"
              class="col-img"
              loading="lazy"
              @error="handleImageError"
            />

            <span v-else class="col-img col-img--empty" aria-hidden="true">
              {{ col.orn }}
            </span>

            <span class="col-count">{{ $t("collections.count", { n: col.count }) }}</span>
          </div>

          <div class="col-body">
            <h3>{{ col.title }}</h3>

            <p class="col-sub">{{ col.sub }}</p>

            <p class="col-text">{{ col.text }}</p>

            <span class="col-more">
              {{ $t('collections.view') }}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { useHoverAutoScroll } from "@/composables/useHoverAutoScroll";
import { useReveal } from "@/composables/useReveal";
import { COLLECTIONS } from "@/data/templateCollections";
import { COLLECTION_LANDING } from "@/data/siteContent";
import { handleImageError, previewFor, themeMeta } from "@/utils/weddingCard";

const root = useReveal();

/*
 * Hover vào ảnh bìa bộ sưu tập → ảnh nguyên trang tự cuộn
 * xuống chậm rãi cho xem trọn bộ thiết kế (xem useHoverAutoScroll).
 */
const scroll = useHoverAutoScroll();

const props = defineProps({
  weddings: { type: Array, default: () => [] },
});

/*
 * Mỗi bộ sưu tập lấy ảnh của mẫu đầu tiên thuộc bộ đó làm
 * mặt bìa — nhìn là thấy ngay tinh thần của cả nhóm.
 */
const cards = computed(() =>
  COLLECTIONS.map((col) => {
    const landing = COLLECTION_LANDING[col.id] || {};

    const members = props.weddings.filter(
      (w) => themeMeta(w).collection === col.id
    );

    return {
      id: col.id,
      sub: col.sub,
      orn: members.length ? themeMeta(members[0]).orn : "✦",
      title: landing.title || col.name,
      text: landing.text || col.sub,
      routeName: landing.routeName || "Templates",
      count: members.length,
      src: members.length ? previewFor(members[0]) : "",
    };
  })
);
</script>

<style scoped>
.collections {
  display: grid;
  grid-template-columns: 1fr;

  gap: 16px;
}

.col-card {
  display: flex;
  flex-direction: column;

  overflow: hidden;

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

/* --- ảnh bìa --- */

/*
 * Khung ảnh giữ tỉ lệ 4/3, ảnh bên trong để height:auto —
 * phần tràn nằm dưới khung để useHoverAutoScroll cuộn bằng
 * translateY khi hover (xem composables/useHoverAutoScroll.js).
 */
.col-media {
  position: relative;

  display: block;

  aspect-ratio: 4 / 3;

  overflow: hidden;

  background: var(--studio-paper-deep, #efe6d4);
}

.col-img {
  display: block;

  width: 100%;
  height: auto;
}

.col-img--empty {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;

  color: rgba(43, 33, 24, 0.25);

  font-family: var(--font-symbol);
  font-size: 40px;
}

.col-count {
  position: absolute;
  right: 12px;
  bottom: 12px;

  padding: 5px 12px;

  border-radius: 999px;

  background: rgba(43, 33, 24, 0.72);
  color: #f7f1e6;

  font-size: 11.5px;
  font-weight: 600;

  backdrop-filter: blur(6px);
}

/* --- phần chữ --- */

.col-body {
  display: flex;
  flex-direction: column;
  flex: 1;

  padding: 20px 20px 22px;
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

/*
 * Điện thoại: bảy bộ sưu tập xếp một cột là bảy màn hình
 * cuộn liên tiếp. Hai cột vẫn đọc rõ ảnh bìa mà chiều cao
 * giảm còn một nửa.
 */
@media (max-width: 767px) {
  .collections {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 12px;
  }

  .col-body {
    padding: 14px 14px 16px;
  }

  .col-card h3 {
    font-size: 16px;
  }

  .col-sub {
    font-size: 10px;

    letter-spacing: 0.06em;
  }

  .col-text {
    margin-bottom: 12px;

    font-size: 12.5px;

    line-height: 1.6;
  }

  .col-more {
    font-size: 12px;
  }

  .col-count {
    right: 8px;
    bottom: 8px;

    padding: 4px 9px;

    font-size: 10.5px;
  }
}

@media (max-width: 380px) {
  .collections {
    gap: 10px;
  }

  .col-body {
    padding: 12px 12px 14px;
  }

  .col-card h3 {
    font-size: 15px;
  }

  .col-text {
    font-size: 12px;
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
