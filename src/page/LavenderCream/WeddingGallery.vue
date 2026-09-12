<template>
  <section class="lc-gallery">
    <div class="lc-gallery__heading">
      <span class="lc-gallery__kicker">MEMORIES</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="lc-gallery__ornament">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="lc-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <div
      v-if="gallery.length"
      class="lc-gallery__wrap"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <button type="button" class="lc-gallery__arrow lc-gallery__arrow--prev" aria-label="Ảnh trước" @click="prev">
        <v-icon size="28">mdi-chevron-left</v-icon>
      </button>

      <div class="lc-gallery__stage">
        <div
          v-for="(item, index) in gallery"
          :key="index"
          class="lc-gallery__slide"
          :class="slideClass(index)"
          @click="handleSlideClick(index)"
        >
          <div class="lc-gallery__frame">
            <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" draggable="false" />

            <span class="lc-corner lc-corner--tl"></span>
            <span class="lc-corner lc-corner--tr"></span>
            <span class="lc-corner lc-corner--bl"></span>
            <span class="lc-corner lc-corner--br"></span>
          </div>
        </div>
      </div>

      <button type="button" class="lc-gallery__arrow lc-gallery__arrow--next" aria-label="Ảnh tiếp theo" @click="next">
        <v-icon size="28">mdi-chevron-right</v-icon>
      </button>

      <div class="lc-gallery__counter">
        <strong>{{ String(currentIndex + 1).padStart(2, "0") }}</strong>
        <span></span>
        <em>{{ String(gallery.length).padStart(2, "0") }}</em>
      </div>

      <div class="lc-gallery__dots">
        <button
          v-for="(_, index) in gallery"
          :key="index"
          type="button"
          :class="{ active: index === currentIndex }"
          :aria-label="`Đến ảnh ${index + 1}`"
          @click="goTo(index)"
        ></button>
      </div>
    </div>

    <div v-else class="lc-gallery__empty">
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

function goTo(index) {
  if (!props.gallery.length) return;

  currentIndex.value = (index + props.gallery.length) % props.gallery.length;
}

function next() {
  goTo(currentIndex.value + 1);
}

function prev() {
  goTo(currentIndex.value - 1);
}

function slideClass(index) {
  const total = props.gallery.length;

  if (!total) return "";

  let diff = index - currentIndex.value;

  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  if (diff === 0) return "is-active";
  if (diff === -1) return "is-prev";
  if (diff === 1) return "is-next";
  if (diff === -2) return "is-prev-2";
  if (diff === 2) return "is-next-2";

  return "is-hidden";
}

function handleSlideClick(index) {
  if (index === currentIndex.value) {
    openLightbox();
    return;
  }

  goTo(index);
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

  if (event.key === "ArrowLeft") prev();
  if (event.key === "ArrowRight") next();
  if (event.key === "Escape") closeLightbox();
}

const touchStartX = ref(0);

function onTouchStart(event) {
  touchStartX.value = event.changedTouches[0].clientX;
}

function onTouchEnd(event) {
  const endX = event.changedTouches[0].clientX;

  const distance = endX - touchStartX.value;

  if (Math.abs(distance) < 45) return;

  if (distance < 0) {
    next();
  } else {
    prev();
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
.lc-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #584a5b;
}

/* =====================================================
   HEADING
===================================================== */

.lc-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.lc-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #a086b4;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.lc-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #584a5b;
}

.lc-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #b9a0d0;
}

.lc-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.7));
}

.lc-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.lc-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.lc-gallery__intro {
  margin: 13px 0 0;

  color: #8d7f92;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   GALLERY
===================================================== */

.lc-gallery__wrap {
  position: relative;

  width: 100%;
  max-width: 1300px;

  margin: 0 auto;

  user-select: none;

  touch-action: pan-y;
}

.lc-gallery__stage {
  position: relative;

  width: 100%;

  height: clamp(410px, 55vw, 680px);

  display: flex;
  align-items: center;
  justify-content: center;
}

.lc-gallery__slide {
  position: absolute;

  width: min(54vw, 600px);

  aspect-ratio: 4 / 5;

  cursor: pointer;

  transition:
    transform 850ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 700ms ease,
    filter 700ms ease;

  will-change: transform, opacity;

  -webkit-tap-highlight-color: transparent;
}

.lc-gallery__frame {
  position: relative;

  width: 100%;
  height: 100%;

  padding: 7px;

  background: #fff;

  border: 1px solid rgba(160, 134, 180, 0.45);
  border-radius: 14px;

  box-shadow: 0 20px 55px rgba(88, 74, 91, 0.14);

  overflow: hidden;
}

.lc-gallery__frame img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 9px;

  filter: none;

  opacity: 1;

  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.lc-gallery__slide.is-active:hover .lc-gallery__frame img {
  transform: scale(1.025);
}

.lc-corner {
  position: absolute;

  width: 18px;
  height: 18px;

  z-index: 3;

  border-color: #b9a0d0;
  border-style: solid;

  pointer-events: none;
}

.lc-corner--tl { top: 3px; left: 3px; border-width: 1px 0 0 1px; }
.lc-corner--tr { top: 3px; right: 3px; border-width: 1px 1px 0 0; }
.lc-corner--bl { bottom: 3px; left: 3px; border-width: 0 0 1px 1px; }
.lc-corner--br { right: 3px; bottom: 3px; border-width: 0 1px 1px 0; }

/* =====================================================
   SLIDE POSITIONS
===================================================== */

.lc-gallery__slide.is-active {
  z-index: 10;

  transform: translateX(0) scale(1);

  opacity: 1;

  filter: none;
}

.lc-gallery__slide.is-prev {
  z-index: 8;

  transform: translateX(-68%) scale(0.83);

  opacity: 0.9;

  filter: saturate(0.96);
}

.lc-gallery__slide.is-next {
  z-index: 8;

  transform: translateX(68%) scale(0.83);

  opacity: 0.9;

  filter: saturate(0.96);
}

.lc-gallery__slide.is-prev-2 {
  z-index: 5;

  transform: translateX(-115%) scale(0.69);

  opacity: 0.62;

  filter: saturate(0.92);
}

.lc-gallery__slide.is-next-2 {
  z-index: 5;

  transform: translateX(115%) scale(0.69);

  opacity: 0.62;

  filter: saturate(0.92);
}

.lc-gallery__slide.is-hidden {
  z-index: 0;

  transform: translateX(0) scale(0.55);

  opacity: 0;

  pointer-events: none;
}

/* =====================================================
   ARROWS
===================================================== */

.lc-gallery__arrow {
  position: absolute;
  top: 50%;
  z-index: 30;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateY(-50%);

  color: #7d6390;

  border: 1px solid rgba(160, 134, 180, 0.45);
  border-radius: 50%;

  background: rgba(253, 252, 254, 0.92);

  box-shadow: 0 8px 25px rgba(88, 74, 91, 0.12);

  cursor: pointer;

  transition: transform 300ms ease, color 250ms ease, background 250ms ease, box-shadow 250ms ease;

  -webkit-tap-highlight-color: transparent;
}

.lc-gallery__arrow:hover {
  color: #584a5b;

  background: #fff;

  box-shadow: 0 10px 28px rgba(88, 74, 91, 0.18);
}

.lc-gallery__arrow--prev {
  left: 24px;
}

.lc-gallery__arrow--prev:hover {
  transform: translate(-4px, -50%);
}

.lc-gallery__arrow--next {
  right: 24px;
}

.lc-gallery__arrow--next:hover {
  transform: translate(4px, -50%);
}

/* =====================================================
   COUNTER
===================================================== */

.lc-gallery__counter {
  position: absolute;

  left: 50%;
  bottom: 30px;

  transform: translateX(-50%);

  display: flex;
  align-items: center;
  gap: 8px;

  color: #8d7f92;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;

  letter-spacing: 0.12em;
}

.lc-gallery__counter strong {
  color: #584a5b;

  font-size: 17px;
  font-weight: 600;
}

.lc-gallery__counter em {
  font-style: normal;

  opacity: 0.45;
}

.lc-gallery__counter span {
  width: 22px;
  height: 1px;

  background: #b9a0d0;
}

/* =====================================================
   DOTS
===================================================== */

.lc-gallery__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-top: 20px;
}

.lc-gallery__dots button {
  width: 6px;
  height: 6px;

  padding: 0;

  border: 0;
  border-radius: 999px;

  background: rgba(160, 134, 180, 0.35);

  cursor: pointer;

  transition: width 350ms ease, background 350ms ease;
}

.lc-gallery__dots button.active {
  width: 25px;

  background: #a086b4;
}

/* =====================================================
   EMPTY
===================================================== */

.lc-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #a99cb0;
}

.lc-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 900px) {
  .lc-gallery__stage {
    height: 560px;
  }

  .lc-gallery__slide {
    width: 54vw;
  }

  .lc-gallery__slide.is-prev {
    transform: translateX(-69%) scale(0.8);
  }

  .lc-gallery__slide.is-next {
    transform: translateX(69%) scale(0.8);
  }

  .lc-gallery__slide.is-prev-2 {
    transform: translateX(-112%) scale(0.66);
  }

  .lc-gallery__slide.is-next-2 {
    transform: translateX(112%) scale(0.66);
  }
}

@media (max-width: 700px) {
  .lc-gallery {
    padding: 45px 0 60px;
  }

  .lc-gallery__heading {
    margin-bottom: 8px;
  }

  .lc-gallery__stage {
    height: 455px;
  }

  .lc-gallery__slide {
    width: 64vw;

    max-width: 380px;
  }

  .lc-gallery__slide.is-prev {
    transform: translateX(-68%) scale(0.76);

    opacity: 0.86;

    filter: none;
  }

  .lc-gallery__slide.is-next {
    transform: translateX(68%) scale(0.76);

    opacity: 0.86;

    filter: none;
  }

  .lc-gallery__slide.is-prev-2 {
    transform: translateX(-105%) scale(0.62);

    opacity: 0.45;

    filter: none;
  }

  .lc-gallery__slide.is-next-2 {
    transform: translateX(105%) scale(0.62);

    opacity: 0.45;

    filter: none;
  }

  .lc-gallery__arrow {
    width: 38px;
    height: 38px;
  }

  .lc-gallery__arrow--prev {
    left: 5px;
  }

  .lc-gallery__arrow--next {
    right: 5px;
  }

  .lc-gallery__counter {
    bottom: 17px;
  }
}

@media (max-width: 430px) {
  .lc-gallery__stage {
    height: 405px;
  }

  .lc-gallery__slide {
    width: 68vw;
  }

  .lc-gallery__slide.is-prev {
    transform: translateX(-65%) scale(0.72);
  }

  .lc-gallery__slide.is-next {
    transform: translateX(65%) scale(0.72);
  }

  .lc-gallery__slide.is-prev-2,
  .lc-gallery__slide.is-next-2 {
    opacity: 0;
  }

  .lc-gallery__arrow {
    width: 34px;
    height: 34px;
  }

  .lc-gallery__arrow .v-icon {
    font-size: 23px !important;
  }

  .lc-gallery__frame {
    padding: 5px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .lc-gallery__slide,
  .lc-gallery__frame img,
  .lc-gallery__arrow,
  .lc-gallery__dots button {
    transition: none;
  }
}
</style>
