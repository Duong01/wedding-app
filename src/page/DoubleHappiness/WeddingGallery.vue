<template>
  <section class="dh-gallery">
    <div class="dh-gallery__heading">
      <span class="dh-gallery__kicker">KỶ NIỆM TƯƠI ĐẸP</span>

      <h2>Album Hình Cưới</h2>

      <div class="dh-gallery__ornament">
        <span></span>
        <i>囍</i>
        <span></span>
      </div>

      <p class="dh-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <div v-if="gallery.length" class="dh-gallery__filmstrip">
      <button type="button" class="dh-gallery__arrow dh-gallery__arrow--prev" aria-label="Ảnh trước" @click="scrollPrev">
        <v-icon size="24">mdi-chevron-left</v-icon>
      </button>

      <div ref="stripRef" class="dh-gallery__strip" @click.self="openLightboxAt(currentIndex)">
        <div
          v-for="(item, index) in gallery"
          :key="index"
          class="dh-gallery__frame"
          @click="handleFrameClick(index)"
        >
          <span class="dh-gallery__badge" aria-hidden="true">囍</span>

          <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" draggable="false" loading="lazy" />
        </div>
      </div>

      <button type="button" class="dh-gallery__arrow dh-gallery__arrow--next" aria-label="Ảnh tiếp theo" @click="scrollNext">
        <v-icon size="24">mdi-chevron-right</v-icon>
      </button>

      <div class="dh-gallery__counter">
        <strong>{{ String(currentIndex + 1).padStart(2, "0") }}</strong>
        <span></span>
        <em>{{ String(gallery.length).padStart(2, "0") }}</em>
      </div>
    </div>

    <div v-else class="dh-gallery__empty">
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

const stripRef = ref(null);
const currentIndex = ref(0);
const dialog = ref(false);

/* =========================================
   FILMSTRIP SCROLLING
========================================= */

function frameStep() {
  const strip = stripRef.value;

  if (!strip || !strip.firstElementChild) return 300;

  const gap = parseFloat(getComputedStyle(strip).columnGap || getComputedStyle(strip).gap) || 16;

  return strip.firstElementChild.getBoundingClientRect().width + gap;
}

function scrollPrev() {
  const strip = stripRef.value;

  if (!strip) return;

  strip.scrollBy({ left: -frameStep(), behavior: "smooth" });
}

function scrollNext() {
  const strip = stripRef.value;

  if (!strip) return;

  strip.scrollBy({ left: frameStep(), behavior: "smooth" });
}

function onStripScroll() {
  const strip = stripRef.value;

  if (!strip) return;

  const step = frameStep();

  if (step <= 0) return;

  currentIndex.value = Math.min(
    props.gallery.length - 1,
    Math.max(0, Math.round(strip.scrollLeft / step))
  );
}

/* =========================================
   LIGHTBOX
========================================= */

function handleFrameClick(index) {
  currentIndex.value = index;

  openLightbox();
}

function openLightbox() {
  dialog.value = true;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  dialog.value = false;
  document.body.style.overflow = "";
}

function handleKeydown(event) {
  if (dialog.value) return;

  if (event.key === "ArrowLeft") scrollPrev();
  if (event.key === "ArrowRight") scrollNext();
  if (event.key === "Escape") closeLightbox();
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);

  stripRef.value?.addEventListener("scroll", onStripScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);

  stripRef.value?.removeEventListener("scroll", onStripScroll);

  document.body.style.overflow = "";
});
</script>

<style scoped>
.dh-gallery {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-red-dark: #5c0e10;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;

  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: var(--dh-ink);
}

/* =====================================================
   HEADING
===================================================== */

.dh-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 22px;
}

.dh-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: var(--dh-red-bright);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.dh-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: var(--dh-red);
}

.dh-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: var(--dh-gold);
}

.dh-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.75));
}

.dh-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.dh-gallery__ornament i {
  font-size: 15px;
  font-style: normal;
}

.dh-gallery__intro {
  margin: 13px 0 0;

  color: #8a6a52;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   FILMSTRIP
===================================================== */

.dh-gallery__filmstrip {
  position: relative;

  width: min(100%, 980px);

  margin: 0 auto;

  padding: 34px 54px 30px;

  border-radius: 18px;

  background:
    repeating-radial-gradient(circle at 9px 9px, rgba(243, 217, 164, 0.32) 0 2.5px, transparent 2.5px 18px) top left / 18px 18px repeat-x,
    repeating-radial-gradient(circle at 9px calc(100% - 9px), rgba(243, 217, 164, 0.32) 0 2.5px, transparent 2.5px 18px) bottom left / 18px 18px repeat-x,
    linear-gradient(180deg, var(--dh-red-dark) 0%, #4a0b0d 100%);

  box-shadow:
    0 22px 55px rgba(40, 6, 8, 0.35),
    inset 0 0 0 1px rgba(217, 164, 65, 0.25);

  user-select: none;
}

/* =====================================================
   STRIP
===================================================== */

.dh-gallery__strip {
  display: flex;
  align-items: stretch;
  gap: 16px;

  overflow-x: auto;

  scroll-snap-type: x mandatory;

  padding: 4px 2px 10px;

  scrollbar-width: none;
  -ms-overflow-style: none;

  -webkit-overflow-scrolling: touch;
}

.dh-gallery__strip::-webkit-scrollbar {
  display: none;
}

/* =====================================================
   FRAME
===================================================== */

.dh-gallery__frame {
  position: relative;

  flex: 0 0 auto;

  width: min(70vw, 340px);

  aspect-ratio: 4 / 5;

  padding: 7px;

  scroll-snap-align: center;

  border: 2px solid var(--dh-gold);
  border-radius: 6px;

  background: rgba(253, 246, 236, 0.96);

  box-shadow: 0 14px 34px rgba(20, 3, 4, 0.45);

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dh-gallery__frame:hover {
  transform: translateY(-4px);

  box-shadow: 0 20px 42px rgba(20, 3, 4, 0.55);
}

.dh-gallery__frame img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 3px;

  pointer-events: none;
}

/* Small 囍 badge at top-right corner */
.dh-gallery__badge {
  position: absolute;
  z-index: 3;

  top: -11px;
  right: -11px;

  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-red-dark);

  font-size: 14px;
  line-height: 1;

  border: 1px solid rgba(243, 217, 164, 0.8);
  border-radius: 50%;

  background: linear-gradient(135deg, var(--dh-gold-light), var(--dh-gold));

  box-shadow: 0 4px 10px rgba(20, 3, 4, 0.4);
}

/* =====================================================
   ARROWS
===================================================== */

.dh-gallery__arrow {
  position: absolute;
  top: 50%;
  z-index: 30;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateY(-50%);

  color: var(--dh-red-dark);

  border: 1px solid rgba(243, 217, 164, 0.7);
  border-radius: 50%;

  background: linear-gradient(135deg, var(--dh-gold-light), var(--dh-gold));

  box-shadow: 0 8px 22px rgba(20, 3, 4, 0.45);

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;

  -webkit-tap-highlight-color: transparent;
}

.dh-gallery__arrow:hover {
  transform: translateY(-50%) scale(1.06);

  box-shadow: 0 12px 28px rgba(20, 3, 4, 0.55);
}

.dh-gallery__arrow--prev {
  left: 8px;
}

.dh-gallery__arrow--next {
  right: 8px;
}

/* =====================================================
   COUNTER
===================================================== */

.dh-gallery__counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 16px;

  color: rgba(247, 230, 196, 0.65);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;

  letter-spacing: 0.14em;
}

.dh-gallery__counter strong {
  color: var(--dh-gold);

  font-size: 17px;
  font-weight: 600;
}

.dh-gallery__counter em {
  font-style: normal;

  opacity: 0.55;
}

.dh-gallery__counter span {
  width: 22px;
  height: 1px;

  background: var(--dh-gold);
}

/* =====================================================
   EMPTY
===================================================== */

.dh-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #b09a8c;
}

.dh-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 700px) {
  .dh-gallery {
    padding: 45px 0 60px;
  }

  .dh-gallery__filmstrip {
    width: calc(100% - 16px);

    padding: 28px 40px 24px;
  }

  .dh-gallery__frame {
    width: min(70vw, 300px);
  }

  .dh-gallery__arrow {
    width: 36px;
    height: 36px;
  }

  .dh-gallery__arrow--prev {
    left: 4px;
  }

  .dh-gallery__arrow--next {
    right: 4px;
  }

  .dh-gallery__arrow .v-icon {
    font-size: 20px !important;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .dh-gallery__frame,
  .dh-gallery__arrow {
    transition: none;
  }
}
</style>
