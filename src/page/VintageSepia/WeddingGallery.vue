<template>
  <section class="vs-gallery">
    <div class="vs-gallery__heading">
      <span class="vs-gallery__kicker">BỘ SƯU TẬP</span>

      <h2>Những Khoảnh Khắc</h2>

      <div class="vs-gallery__divider">
        <span></span>
        <i>❦</i>
        <span></span>
      </div>

      <p class="vs-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <!-- POLAROID SCATTER -->
    <div v-if="gallery.length" class="vs-gallery__table">
      <button
        v-for="(item, index) in gallery"
        :key="index"
        type="button"
        class="vs-polaroid"
        :aria-label="`Xem ảnh ${index + 1}`"
        @click="openLightbox(index)"
      >
        <span class="vs-polaroid__tape" aria-hidden="true"></span>

        <span class="vs-polaroid__photo">
          <img :src="src(item)" :alt="`Kỷ niệm cưới ${index + 1}`" loading="lazy" draggable="false" />
        </span>

        <span class="vs-polaroid__caption">Kỷ niệm {{ String(index + 1).padStart(2, "0") }}</span>
      </button>
    </div>

    <div v-else class="vs-gallery__empty">
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

function handleKeydown(event) {
  if (event.key === "Escape" && dialog.value) {
    closeLightbox();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);

  document.body.style.overflow = "";
});
</script>

<style scoped>
.vs-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #6b4f3a;
}

/* =====================================================
   HEADING
===================================================== */

.vs-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 26px;
}

.vs-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.32em;
  text-indent: 0.32em;
}

.vs-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #4a3a2c;
}

.vs-gallery__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #c2a878;
}

.vs-gallery__divider span {
  width: 48px;
  height: 1px;

  background: #3d2f24;

  opacity: 0.55;
}

.vs-gallery__divider i {
  font-size: 12px;
  font-style: normal;
}

.vs-gallery__intro {
  margin: 13px 0 0;

  color: #97745a;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   POLAROID TABLE
===================================================== */

.vs-gallery__table {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px 6px;

  max-width: 760px;

  margin: 0 auto;

  padding: 10px 16px;
}

.vs-polaroid {
  position: relative;

  display: flex;
  flex-direction: column;

  padding: 10px 10px 34px;

  border: 0;

  background: #fffdf6;

  box-shadow: 0 6px 16px rgba(61, 47, 36, 0.18);

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  transition:
    transform 300ms ease,
    box-shadow 300ms ease;

  -webkit-tap-highlight-color: transparent;
}

/* Per-item scatter rotation */
.vs-polaroid:nth-child(6n + 1) { transform: rotate(-4deg); }
.vs-polaroid:nth-child(6n + 2) { transform: rotate(3deg); }
.vs-polaroid:nth-child(6n + 3) { transform: rotate(-2deg); }
.vs-polaroid:nth-child(6n + 4) { transform: rotate(5deg); }
.vs-polaroid:nth-child(6n + 5) { transform: rotate(-3deg); }
.vs-polaroid:nth-child(6n + 6) { transform: rotate(2.5deg); }

.vs-polaroid:hover {
  transform: rotate(0) scale(1.04);

  z-index: 5;

  box-shadow: 0 16px 34px rgba(61, 47, 36, 0.3);
}

/* Washi tape strip on top center */
.vs-polaroid__tape {
  position: absolute;
  z-index: 3;

  top: -9px;
  left: 50%;

  width: 74px;
  height: 20px;

  transform: translateX(-50%) rotate(-3deg);

  background: rgba(194, 168, 120, 0.35);

  box-shadow: 0 1px 3px rgba(61, 47, 36, 0.12);

  pointer-events: none;
}

.vs-polaroid__photo {
  display: block;

  overflow: hidden;

  background: #ead9bd;
}

.vs-polaroid__photo img {
  display: block;

  width: 100%;

  aspect-ratio: 1 / 1;

  object-fit: cover;

  filter: sepia(0.25) saturate(0.9);

  transition: filter 300ms ease;
}

.vs-polaroid:hover .vs-polaroid__photo img {
  filter: none;
}

.vs-polaroid__caption {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 7px;

  text-align: center;

  color: #6b4f3a;

  font-family: "Allura", cursive;

  font-size: 15px;

  line-height: 1;

  pointer-events: none;
}

/* =====================================================
   EMPTY
===================================================== */

.vs-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #b09a86;
}

.vs-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 600px) {
  .vs-gallery {
    padding: 45px 0 60px;
  }

  .vs-gallery__table {
    grid-template-columns: repeat(2, 1fr);

    padding: 10px 12px;
  }

  .vs-polaroid:nth-child(6n + 1) { transform: rotate(-2deg); }
  .vs-polaroid:nth-child(6n + 2) { transform: rotate(2deg); }
  .vs-polaroid:nth-child(6n + 3) { transform: rotate(-1.5deg); }
  .vs-polaroid:nth-child(6n + 4) { transform: rotate(1.5deg); }
  .vs-polaroid:nth-child(6n + 5) { transform: rotate(-2deg); }
  .vs-polaroid:nth-child(6n + 6) { transform: rotate(2deg); }

  .vs-polaroid__caption {
    font-size: 13px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .vs-polaroid,
  .vs-polaroid__photo img {
    transition: none;
  }
}
</style>
