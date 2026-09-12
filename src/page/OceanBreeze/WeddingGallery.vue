<template>
  <section class="ob-gallery">
    <div class="ob-gallery__heading">
      <span class="ob-gallery__kicker">BY THE SEA</span>

      <h2>Album Kỷ Niệm</h2>

      <div class="ob-gallery__ornament">
        <span>〜</span>
        <i>❊</i>
        <span>〜</span>
      </div>

      <p class="ob-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <div v-if="gallery.length" class="ob-gallery__grid">
      <figure
        v-for="(item, index) in gallery"
        :key="index"
        class="ob-gallery__item"
        :style="{ '--delay': `${(index % 12) * 70}ms` }"
        @click="openLightbox(index)"
      >
        <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" loading="lazy" draggable="false" />
      </figure>
    </div>

    <div v-else class="ob-gallery__empty">
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
import { ref, onMounted, onUnmounted } from "vue";
import GalleryModal from "@/components/gallery/GalleryModal.vue";

const props = defineProps({
  gallery: { type: Array, default: () => [] },
});

function src(item) {
  if (typeof item === "string") {
    return item;
  }

  return item?.Url || item?.Image || item?.Src || item?.ImageUrl || "";
}

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

let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ob-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".ob-gallery__item")
    .forEach((el) => observer.observe(el));
});

onUnmounted(() => {
  observer?.disconnect();

  document.body.style.overflow = "";
});
</script>

<style scoped>
.ob-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #274b5c;
}

/* =====================================================
   HEADING
===================================================== */

.ob-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 24px;
}

.ob-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #e8927c;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.36em;
  text-indent: 0.36em;
}

.ob-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #1d6a8e;
}

.ob-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #4a9ab8;
}

.ob-gallery__ornament span {
  font-size: 13px;
  font-style: normal;

  opacity: 0.75;
}

.ob-gallery__ornament i {
  font-size: 12px;
  font-style: normal;

  color: #e8927c;
}

.ob-gallery__intro {
  margin: 13px 0 0;

  color: #5b8296;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   BENTO MOSAIC GRID
===================================================== */

.ob-gallery__grid {
  width: min(100%, 1100px);

  margin: 0 auto;
  padding: 0 16px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 96px;
  grid-auto-flow: dense;
  gap: 10px;
}

.ob-gallery__item {
  position: relative;

  margin: 0;

  border-radius: 18px;
  overflow: hidden;

  border: 1px solid rgba(74, 154, 184, 0.35);

  background: rgba(226, 241, 245, 0.5);

  cursor: pointer;

  opacity: 0;
  transform: translateY(26px);

  transition:
    opacity 0.7s ease var(--delay, 0ms),
    transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay, 0ms),
    box-shadow 0.3s ease;

  -webkit-tap-highlight-color: transparent;
}

.ob-gallery__item.ob-revealed {
  opacity: 1;
  transform: translateY(0);
}

.ob-gallery__item:hover {
  box-shadow: 0 14px 34px rgba(29, 106, 142, 0.18);
}

.ob-gallery__item img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.ob-gallery__item:hover img {
  transform: scale(1.06);
}

/* --- Bento span pattern (repeats every 6 items) --- */

.ob-gallery__item:nth-child(6n + 1) {
  grid-column: span 2;
  grid-row: span 2;
}

.ob-gallery__item:nth-child(6n + 2) {
  grid-column: span 2;
  grid-row: span 1;
}

.ob-gallery__item:nth-child(6n + 3) {
  grid-column: span 1;
  grid-row: span 1;
}

.ob-gallery__item:nth-child(6n + 4) {
  grid-column: span 1;
  grid-row: span 1;
}

.ob-gallery__item:nth-child(6n + 5) {
  grid-column: span 1;
  grid-row: span 2;
}

.ob-gallery__item:nth-child(6n + 6) {
  grid-column: span 2;
  grid-row: span 1;
}

/* =====================================================
   EMPTY
===================================================== */

.ob-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #7ba3b3;
}

.ob-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 700px) {
  .ob-gallery {
    padding: 45px 0 60px;
  }

  .ob-gallery__grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 80px;

    padding: 0 12px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .ob-gallery__item {
    opacity: 1;

    transform: none;

    transition: none;
  }

  .ob-gallery__item img {
    transition: none;
  }
}
</style>
