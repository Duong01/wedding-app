<template>
  <section class="tr-gallery">
    <h2 class="tr-gallery__title">Album Ảnh</h2>

    <div class="tr-gallery__wrap">
      <div class="tr-gallery__grid">
        <button
          v-for="(item, index) in images"
          :key="index"
          type="button"
          class="tr-gallery__cell"
          :aria-label="`Xem ảnh ${index + 1}`"
          @click="openLightbox(index)"
        >
          <img :src="item" alt="" loading="lazy" decoding="async" />
        </button>
      </div>
    </div>

    <GalleryModal
      v-if="dialog"
      :images="images"
      :start-index="currentIndex"
      accent="#680e0e"
      @close="closeLightbox"
    />
  </section>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from "vue";

const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },
});

/* =========================================================
   CHUẨN HÓA ẢNH
========================================================= */

const images = computed(() =>
  (props.gallery || [])
    .map((item) => item?.Url || item?.Image || item?.Src || item?.ImageUrl || "")
    .filter(Boolean)
);

/* =========================================================
   LIGHTBOX
========================================================= */

const dialog = ref(false);
const currentIndex = ref(0);

function openLightbox(index) {
  if (!images.value.length) return;

  currentIndex.value = index;
  dialog.value = true;
}

function closeLightbox() {
  dialog.value = false;
}
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.tr-gallery {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  align-items: center;

  margin-bottom: 48px;
}

.tr-gallery__title {
  margin: 0 0 24px;

  text-align: center;

  text-transform: uppercase;

  color: #680e0e;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;
}

/* =========================================================
   LƯỚI ẢNH
========================================================= */

.tr-gallery__wrap {
  width: 100%;
  max-width: 320px;
}

.tr-gallery__grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 12px;

  padding: 16px;
}

.tr-gallery__cell {
  position: relative;

  display: block;

  aspect-ratio: 1 / 1;

  padding: 0;

  border: 1px solid rgba(0, 0, 0, 0.07);

  border-radius: 8px;

  overflow: hidden;

  cursor: pointer;

  background-color: rgba(255, 255, 255, 0.5);
}

.tr-gallery__cell img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  object-position: 50% 50%;

  transition: transform 0.2s ease;
}

.tr-gallery__cell:hover img {
  transform: scale(1.03);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-gallery {
    margin-bottom: 64px;
  }

  .tr-gallery__title {
    font-size: 24px;
  }

  .tr-gallery__wrap {
    max-width: 550px;
  }

  .tr-gallery__grid {
    gap: 16px;

    padding: 24px;
  }
}
</style>
