<template>
  <section class="lp-gallery">
    <div class="lp-section-title">
      <h2>ALBUM ẢNH CƯỚI</h2>
    </div>

    <p class="lp-gallery__intro">
      Những khoảnh khắc đẹp nhất<br />
      được lưu giữ cùng chúng mình
    </p>

    <!-- Lưới 2 cột, tối đa 4 ảnh + đếm ảnh tràn -->
    <div v-if="gallery.length" class="lp-gallery__grid">
      <figure
        v-for="(item, index) in visibleImages"
        :key="index"
        class="lp-gallery__item"
        @click="openLightbox(index)"
      >
        <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" loading="lazy" draggable="false" />
      </figure>

      <figure
        v-if="overflowCount > 0"
        class="lp-gallery__item lp-gallery__item--overflow"
        @click="openLightbox(maxVisible)"
      >
        <img :src="src(gallery[maxVisible])" alt="" loading="lazy" draggable="false" />

        <div class="lp-gallery__overflow">
          <strong>+{{ overflowCount }}</strong>
          <span>XEM THÊM</span>
        </div>
      </figure>
    </div>

    <div v-else class="lp-gallery__empty">
      <v-icon size="30">mdi-image-outline</v-icon>
      <p>Chưa có hình ảnh</p>
    </div>

    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-fade-transition"
      content-class="gallery-dialog"
    >
      <GalleryModal
        v-if="dialog"
        :images="gallery"
        :start-index="currentIndex"
        @close="closeLightbox"
      />
    </v-dialog>
  </section>
</template>

<script setup>
import { computed, ref, defineAsyncComponent } from "vue";
const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const props = defineProps({
  gallery: { type: Array, default: () => [] },
});

const maxVisible = 4;

function src(item) {
  if (typeof item === "string") {
    return item;
  }

  return item?.Url || item?.Image || item?.Src || item?.ImageUrl || "";
}

const visibleImages = computed(() => props.gallery.slice(0, maxVisible));

const overflowCount = computed(() =>
  props.gallery.length > maxVisible ? props.gallery.length - maxVisible - 1 : 0
);

const currentIndex = ref(0);
const dialog = ref(false);

function openLightbox(index) {
  if (!props.gallery.length) return;

  currentIndex.value = index;
  dialog.value = true;

  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  dialog.value = false;
  document.body.style.overflow = "";
}
</script>

<style scoped>
.lp-gallery {
  position: relative;

  width: 100%;

  padding: 40px 0 30px;

  overflow: hidden;

  color: #ffbe89;

  text-align: center;
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 14px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: #ffbe89;
}

.lp-gallery__intro {
  margin: 0 0 22px;

  font-size: 12px;

  line-height: 1.7;

  color: rgba(255, 190, 137, 0.7);
}

/* =====================================================
   LƯỚI ẢNH 2 CỘT
===================================================== */

.lp-gallery__grid {
  width: min(100%, 550px);

  margin: 0 auto;

  padding: 0 16px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 768px) {
  .lp-gallery__grid {
    gap: 16px;

    padding: 0 24px;
  }
}

.lp-gallery__item {
  position: relative;

  margin: 0;

  aspect-ratio: 1 / 1;

  overflow: hidden;

  cursor: pointer;

  border: 1px solid rgba(255, 190, 137, 0.25);
  border-radius: 8px;

  -webkit-tap-highlight-color: transparent;
}

.lp-gallery__item img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.lp-gallery__item:hover img {
  transform: scale(1.05);
}

/* Ô đếm ảnh tràn */
.lp-gallery__item--overflow img {
  filter: brightness(0.5);
}

.lp-gallery__overflow {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  background: rgba(0, 0, 0, 0.55);
}

.lp-gallery__overflow strong {
  font-family: "Big Caslon", "Baskerville", "Times New Roman", serif;

  font-size: 30px;

  color: #ffbe89;
}

.lp-gallery__overflow span {
  font-size: 9px;

  letter-spacing: 0.2em;

  color: rgba(255, 190, 137, 0.8);
}

/* =====================================================
   EMPTY
===================================================== */

.lp-gallery__empty {
  padding: 60px 20px;

  text-align: center;

  color: rgba(255, 190, 137, 0.5);
}

.lp-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
