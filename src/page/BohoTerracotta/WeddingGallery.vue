<template>
  <section class="bt-gallery">
    <div class="bt-gallery__heading">
      <span class="bt-gallery__kicker">WILD &amp; FREE</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="bt-gallery__ornament">
        <span></span>
        <i>❋</i>
        <span></span>
      </div>

      <p class="bt-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <div v-if="gallery.length" class="bt-gallery__masonry">
      <figure
        v-for="(item, index) in gallery"
        :key="index"
        class="bt-gallery__item"
        @click="openLightbox(index)"
      >
        <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" loading="lazy" draggable="false" />
      </figure>
    </div>

    <div v-else class="bt-gallery__empty">
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

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bt-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".bt-gallery__item").forEach((el) => observer.observe(el));
});

let observer;

onUnmounted(() => {
  observer?.disconnect();

  document.body.style.overflow = "";
});
</script>

<style scoped>
.bt-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #5c4636;
}

/* Macramé lattice texture */
.bt-gallery::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.04;

  background-image:
    repeating-linear-gradient(45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 20px),
    repeating-linear-gradient(-45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 20px);

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.bt-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 26px;
}

.bt-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #8a9b7c;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.bt-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #9c5b3f;
}

.bt-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #c97b5d;
}

.bt-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.bt-gallery__ornament i {
  font-size: 13px;
  font-style: normal;
}

.bt-gallery__intro {
  margin: 13px 0 0;

  color: #8a6f5c;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   MASONRY WALL (CSS columns)
===================================================== */

.bt-gallery__masonry {
  position: relative;
  z-index: 2;

  width: min(100%, 980px);

  margin: 0 auto;

  padding: 0 16px;

  columns: 3;
  column-gap: 14px;
}

.bt-gallery__item {
  position: relative;

  break-inside: avoid;

  margin: 0 0 14px;

  overflow: hidden;

  cursor: pointer;

  border: 1px solid rgba(156, 91, 63, 0.35);

  box-shadow: 0 10px 26px rgba(92, 70, 54, 0.12);

  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease;

  -webkit-tap-highlight-color: transparent;

  /* Scroll-reveal */
  opacity: 0;

  transform: translateY(18px);
}

/* Alternating arch tops + varying aspect ratios */
.bt-gallery__item:nth-child(odd) {
  border-radius: 999px 999px 14px 14px;
}

.bt-gallery__item:nth-child(even) {
  border-radius: 14px;
}

.bt-gallery__item:nth-child(6n + 1) { aspect-ratio: 3 / 4; }
.bt-gallery__item:nth-child(6n + 2) { aspect-ratio: 1 / 1; }
.bt-gallery__item:nth-child(6n + 3) { aspect-ratio: 4 / 5; }
.bt-gallery__item:nth-child(6n + 4) { aspect-ratio: 3 / 4; }
.bt-gallery__item:nth-child(6n + 5) { aspect-ratio: 1 / 1; }
.bt-gallery__item:nth-child(6n + 6) { aspect-ratio: 4 / 5; }

.bt-gallery__item img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.bt-gallery__item:hover {
  transform: translateY(-4px) rotate(-1deg);

  box-shadow: 0 18px 38px rgba(92, 70, 54, 0.2);
}

.bt-gallery__item:hover img {
  transform: scale(1.04);
}

/* Scroll-reveal state */
.bt-gallery__item.bt-revealed {
  opacity: 1;

  transform: translateY(0);
}

/* Staggered transition-delay */
.bt-gallery__item:nth-child(3n + 1).bt-revealed { transition-delay: 0ms; }
.bt-gallery__item:nth-child(3n + 2).bt-revealed { transition-delay: 90ms; }
.bt-gallery__item:nth-child(3n + 3).bt-revealed { transition-delay: 180ms; }

/* =====================================================
   EMPTY
===================================================== */

.bt-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #b09a8c;
}

.bt-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 700px) {
  .bt-gallery {
    padding: 45px 0 60px;
  }

  .bt-gallery__masonry {
    columns: 2;

    padding: 0 12px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .bt-gallery__item,
  .bt-gallery__item img {
    transition: none;

    opacity: 1;

    transform: none;
  }
}
</style>
