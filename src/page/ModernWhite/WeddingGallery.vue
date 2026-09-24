<template>
  <section class="mw-gallery">
    <h2 class="mw-title">Album Ảnh</h2>

    <div v-if="gallery.length" class="mw-gallery__grid">
      <button
        v-for="(image, index) in visibleImages"
        :key="index"
        type="button"
        class="mw-gallery__cell"
        @click="openGallery(index)"
      >
        <img :src="resolveImage(image)" alt="" loading="lazy" decoding="async" />

        <span v-if="index === visibleImages.length - 1 && hiddenCount" class="mw-gallery__more">
          +{{ hiddenCount }}
        </span>
      </button>
    </div>

    <p v-else class="mw-gallery__empty">Chưa có hình ảnh</p>

    <GalleryModal
      v-if="dialog"
      :images="gallery"
      :start-index="currentIndex"
      accent="var(--mw-blue, #486c7d)"
      @close="closeLightbox"
    />
  </section>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from "vue";

const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const MAX_VISIBLE = 4;

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },
});

const dialog = ref(false);

const currentIndex = ref(0);

const visibleImages = computed(() => props.gallery.slice(0, MAX_VISIBLE));

const hiddenCount = computed(() =>
  Math.max(0, props.gallery.length - MAX_VISIBLE)
);

function resolveImage(image) {
  if (typeof image === "string") {
    return image;
  }

  return image?.Url || image?.url || image?.Image || image?.Src || "";
}

function openGallery(index = 0) {
  if (!props.gallery.length) {
    return;
  }

  currentIndex.value = Math.min(Math.max(index, 0), props.gallery.length - 1);

  dialog.value = true;
}

function closeLightbox() {
  dialog.value = false;
}
</script>

<style scoped>
.mw-gallery {
  text-align: center;
}

.mw-gallery__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  width: 100%;
  max-width: 432px;

  margin: 24px auto 0;
}

.mw-gallery__cell {
  position: relative;

  aspect-ratio: 1 / 1;

  padding: 0;

  overflow: hidden;

  border: 1px solid var(--mw-blue-soft);
  border-radius: 12px;

  background-color: var(--mw-blue-mist);

  cursor: pointer;
}

.mw-gallery__cell img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.2s ease;
}

.mw-gallery__cell:hover img {
  transform: scale(1.03);
}

.mw-gallery__more {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.55);
  color: #ffffff;

  font-family: var(--mw-font-serif);
  font-size: 18px;
  font-weight: 600;
}

.mw-gallery__empty {
  margin: 24px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 14px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-gallery__grid {
    gap: 16px;

    max-width: 600px;
  }
}
</style>
