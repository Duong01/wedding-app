<template>
  <section class="el-gallery">
    <div class="el-gallery__heading">
      <span class="el-gallery__kicker">TIMELESS LOVE</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="el-gallery__ornament">
        <span></span>
        <i>❦</i>
        <span></span>
      </div>

      <p class="el-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <div v-if="gallery.length" class="el-gallery__masonry">
      <figure
        v-for="(item, index) in gallery"
        :key="index"
        class="el-gallery__item"
        @click="openLightbox(index)"
      >
        <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" loading="lazy" draggable="false" />
      </figure>
    </div>

    <div v-else class="el-gallery__empty">
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
import { ref, onMounted, onUnmounted, defineAsyncComponent } from "vue";
const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

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

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("el-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".el-gallery__item").forEach((el) => observer.observe(el));
});

let observer;

onUnmounted(() => {
  observer?.disconnect();

  document.body.style.overflow = "";
});
</script>

<style scoped>
.el-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #2e3d36;
}

/* Fine gold lattice texture */
.el-gallery::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.04;

  background-image:
    repeating-linear-gradient(45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 20px),
    repeating-linear-gradient(-45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 20px);

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.el-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 26px;
}

.el-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #8a7a52;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.el-gallery__heading h2 {
  margin: 0;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #123b2e;
}

.el-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #c9a45c;
}

.el-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.85));
}

.el-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.el-gallery__ornament i {
  font-size: 13px;
  font-style: normal;
}

.el-gallery__intro {
  margin: 13px 0 0;

  color: #6b7a70;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   MASONRY WALL (CSS columns)
===================================================== */

.el-gallery__masonry {
  position: relative;
  z-index: 2;

  width: min(100%, 980px);

  margin: 0 auto;

  padding: 0 16px;

  columns: 3;
  column-gap: 14px;
}

.el-gallery__item {
  position: relative;

  break-inside: avoid;

  margin: 0 0 14px;

  overflow: hidden;

  cursor: pointer;

  border: 1px solid rgba(201, 164, 92, 0.55);

  box-shadow: 0 10px 26px rgba(12, 43, 33, 0.12);

  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease;

  -webkit-tap-highlight-color: transparent;

  /* Scroll-reveal */
  opacity: 0;

  transform: translateY(18px);
}

/* Alternating arch tops + varying aspect ratios */
.el-gallery__item:nth-child(odd) {
  border-radius: 999px 999px 14px 14px;
}

.el-gallery__item:nth-child(even) {
  border-radius: 14px;
}

.el-gallery__item:nth-child(6n + 1) { aspect-ratio: 3 / 4; }
.el-gallery__item:nth-child(6n + 2) { aspect-ratio: 1 / 1; }
.el-gallery__item:nth-child(6n + 3) { aspect-ratio: 4 / 5; }
.el-gallery__item:nth-child(6n + 4) { aspect-ratio: 3 / 4; }
.el-gallery__item:nth-child(6n + 5) { aspect-ratio: 1 / 1; }
.el-gallery__item:nth-child(6n + 6) { aspect-ratio: 4 / 5; }

.el-gallery__item img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.el-gallery__item:hover {
  transform: translateY(-4px);

  box-shadow: 0 18px 38px rgba(12, 43, 33, 0.2);
}

.el-gallery__item:hover img {
  transform: scale(1.04);
}

/* Scroll-reveal state */
.el-gallery__item.el-revealed {
  opacity: 1;

  transform: translateY(0);
}

/* Staggered transition-delay */
.el-gallery__item:nth-child(3n + 1).el-revealed { transition-delay: 0ms; }
.el-gallery__item:nth-child(3n + 2).el-revealed { transition-delay: 90ms; }
.el-gallery__item:nth-child(3n + 3).el-revealed { transition-delay: 180ms; }

/* =====================================================
   EMPTY
===================================================== */

.el-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #8a9a8f;
}

.el-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 700px) {
  .el-gallery {
    padding: 45px 0 60px;
  }

  .el-gallery__masonry {
    columns: 2;

    padding: 0 12px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .el-gallery__item,
  .el-gallery__item img {
    transition: none;

    opacity: 1;

    transform: none;
  }
}
</style>
