<template>
  <section class="memories-section">
    <!-- HEADER -->
    <div class="memories-heading">
      <span class="memories-kicker">MEMORIES</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="heading-ornament">
        <span></span>
        <b>♥</b>
        <span></span>
      </div>

      <p class="memories-intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <!-- GALLERY -->
    <div
      v-if="gallery.length"
      class="royal-gallery"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <!-- PREV -->
      <button
        type="button"
        class="gallery-arrow gallery-prev"
        aria-label="Ảnh trước"
        @click="prev"
      >
        <v-icon size="28">mdi-chevron-left</v-icon>
      </button>

      <!-- STAGE -->
      <div class="gallery-stage">
        <div
          v-for="(item, index) in gallery"
          :key="index"
          class="gallery-slide"
          :class="slideClass(index)"
          @click="handleSlideClick(index)"
        >
          <div class="photo-frame">
            <img
              :src="src(item)"
              :alt="`Khoảnh khắc cưới ${index + 1}`"
              draggable="false"
            />


            <!-- Góc trang trí -->
            <span class="corner corner-tl"></span>
            <span class="corner corner-tr"></span>
            <span class="corner corner-bl"></span>
            <span class="corner corner-br"></span>
          </div>
        </div>
      </div>

      <!-- NEXT -->
      <button
        type="button"
        class="gallery-arrow gallery-next"
        aria-label="Ảnh tiếp theo"
        @click="next"
      >
        <v-icon size="28">mdi-chevron-right</v-icon>
      </button>

      <!-- COUNTER -->
      <div class="gallery-counter">
        <strong>{{ String(currentIndex + 1).padStart(2, "0") }}</strong>
        <span></span>
        <em>{{ String(gallery.length).padStart(2, "0") }}</em>
      </div>

      <!-- DOTS -->
      <div class="gallery-dots">
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

    <!-- EMPTY -->
    <div v-else class="gallery-empty">
      <v-icon size="30">mdi-image-outline</v-icon>
      <p>Chưa có hình ảnh</p>
    </div>

    <!-- LIGHTBOX -->
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
  gallery: {
    type: Array,
    default: () => [],
  },
});

/* =====================================================
   IMAGE
===================================================== */

function src(item) {
  if (typeof item === "string") {
    return item;
  }

  return (
    item?.Url ||
    item?.Image ||
    item?.Src ||
    item?.ImageUrl ||
    ""
  );
}

/* =====================================================
   STATE
===================================================== */

const currentIndex = ref(0);
const dialog = ref(false);

/* =====================================================
   NAVIGATION
===================================================== */

function goTo(index) {
  if (!props.gallery.length) return;

  currentIndex.value =
    (index + props.gallery.length) %
    props.gallery.length;
}

function next() {
  goTo(currentIndex.value + 1);
}

function prev() {
  goTo(currentIndex.value - 1);
}

/* =====================================================
   SLIDE POSITION
===================================================== */

function slideClass(index) {
  const total = props.gallery.length;

  if (!total) return "";

  let diff = index - currentIndex.value;

  if (diff > total / 2) {
    diff -= total;
  }

  if (diff < -total / 2) {
    diff += total;
  }

  if (diff === 0) {
    return "is-active";
  }

  if (diff === -1) {
    return "is-prev";
  }

  if (diff === 1) {
    return "is-next";
  }

  if (diff === -2) {
    return "is-prev-2";
  }

  if (diff === 2) {
    return "is-next-2";
  }

  return "is-hidden";
}

/* =====================================================
   CLICK
===================================================== */

function handleSlideClick(index) {
  if (index === currentIndex.value) {
    openLightbox();
    return;
  }

  goTo(index);
}

/* =====================================================
   LIGHTBOX
===================================================== */

function openLightbox() {
  dialog.value = true;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  dialog.value = false;
  document.body.style.overflow = "";
}

/* =====================================================
   KEYBOARD
===================================================== */

function handleKeydown(event) {
  if (dialog.value) return;

  if (event.key === "ArrowLeft") {
    prev();
  }

  if (event.key === "ArrowRight") {
    next();
  }

  if (event.key === "Escape") {
    closeLightbox();
  }
}

/* =====================================================
   SWIPE
===================================================== */

const touchStartX = ref(0);

function onTouchStart(event) {
  touchStartX.value =
    event.changedTouches[0].clientX;
}

function onTouchEnd(event) {
  const endX =
    event.changedTouches[0].clientX;

  const distance =
    endX - touchStartX.value;

  if (Math.abs(distance) < 45) return;

  if (distance < 0) {
    next();
  } else {
    prev();
  }
}

/* =====================================================
   LIFECYCLE
===================================================== */

onMounted(() => {
  window.addEventListener(
    "keydown",
    handleKeydown
  );
});

onUnmounted(() => {
  window.removeEventListener(
    "keydown",
    handleKeydown
  );

  document.body.style.overflow = "";
});
</script>

<style scoped>
/* =====================================================
   SECTION
===================================================== */

.memories-section {
  position: relative;

  width: 100%;

  padding: 65px 0 80px;

  overflow: hidden;

  color: #7d4b5c;
}


/* =====================================================
   HEADER
===================================================== */

.memories-heading {
  position: relative;

  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.memories-kicker {
  display: block;

  margin-bottom: 7px;

  color: #b47788;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.36em;
}

.memories-heading h2 {
  margin: 0;

  color: #9b4b61;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(30px, 7vw, 42px);

  font-weight: 600;

  line-height: 1.05;
}

.heading-ornament {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 11px;

  margin-top: 13px;
}

.heading-ornament span {
  width: 48px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(198, 160, 106, 0.7)
    );
}

.heading-ornament span:last-child {
  transform: rotate(180deg);
}

.heading-ornament b {
  color: #c6a06a;

  font-size: 12px;

  font-weight: 400;
}

.memories-intro {
  margin: 13px 0 0;

  color: #a27684;

  font-size: 12px;

  line-height: 1.7;
}


/* =====================================================
   GALLERY
===================================================== */

.royal-gallery {
  position: relative;

  width: 100%;

  max-width: 1300px;

  margin: 0 auto;

  user-select: none;

  touch-action: pan-y;
}


/* =====================================================
   STAGE
===================================================== */

.gallery-stage {
  position: relative;

  width: 100%;

  height: clamp(410px, 55vw, 680px);

  display: flex;

  align-items: center;

  justify-content: center;
}


/* =====================================================
   SLIDE
===================================================== */

.gallery-slide {
  position: absolute;

  width: min(54vw, 600px);

  aspect-ratio: 4 / 5;

  cursor: pointer;

  transition:
    transform 850ms
      cubic-bezier(0.22, 1, 0.36, 1),
    opacity 700ms ease,
    filter 700ms ease;

  will-change:
    transform,
    opacity;

  -webkit-tap-highlight-color: transparent;
}


/* =====================================================
   PHOTO FRAME
===================================================== */

.photo-frame {
  position: relative;

  width: 100%;
  height: 100%;

  padding: 7px;

  background: #fff;

  border: 1px solid
    rgba(198, 160, 106, 0.45);

  box-shadow:
    0 20px 55px
    rgba(110, 54, 70, 0.18);

  overflow: hidden;
}


/* =====================================================
   IMAGE — LUÔN RÕ
===================================================== */

.photo-frame img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  /*
   * Không overlay
   * Không brightness
   * Không saturate
   * Không blur
   */

  filter: none;

  opacity: 1;

  transition:
    transform 1s
      cubic-bezier(0.22, 1, 0.36, 1);
}


/* Zoom nhẹ khi hover */

.gallery-slide.is-active:hover
.photo-frame img {
  transform: scale(1.025);
}


/* =====================================================
   INNER BORDER
===================================================== */

.photo-border {
  position: absolute;

  inset: 13px;

  border: 1px solid
    rgba(255, 255, 255, 0.7);

  pointer-events: none;

  z-index: 2;
}


/* =====================================================
   CORNERS
===================================================== */

.corner {
  position: absolute;

  width: 18px;
  height: 18px;

  z-index: 3;

  border-color: #c6a06a;

  border-style: solid;

  pointer-events: none;
}

.corner-tl {
  top: 3px;
  left: 3px;

  border-width: 1px 0 0 1px;
}

.corner-tr {
  top: 3px;
  right: 3px;

  border-width: 1px 1px 0 0;
}

.corner-bl {
  bottom: 3px;
  left: 3px;

  border-width: 0 0 1px 1px;
}

.corner-br {
  right: 3px;
  bottom: 3px;

  border-width: 0 1px 1px 0;
}


/* =====================================================
   ACTIVE
===================================================== */

.gallery-slide.is-active {
  z-index: 10;

  transform:
    translateX(0)
    scale(1);

  opacity: 1;

  filter: none;
}


/* =====================================================
   PREVIOUS
===================================================== */

.gallery-slide.is-prev {
  z-index: 8;

  transform:
    translateX(-68%)
    scale(0.83);

  opacity: 0.9;

  /*
   * Chỉ giảm rất nhẹ độ tương phản.
   * Ảnh vẫn rõ.
   */

  filter: saturate(0.96);
}


/* =====================================================
   NEXT
===================================================== */

.gallery-slide.is-next {
  z-index: 8;

  transform:
    translateX(68%)
    scale(0.83);

  opacity: 0.9;

  filter: saturate(0.96);
}


/* =====================================================
   SECONDARY
===================================================== */

.gallery-slide.is-prev-2 {
  z-index: 5;

  transform:
    translateX(-115%)
    scale(0.69);

  opacity: 0.62;

  filter: saturate(0.92);
}

.gallery-slide.is-next-2 {
  z-index: 5;

  transform:
    translateX(115%)
    scale(0.69);

  opacity: 0.62;

  filter: saturate(0.92);
}


/* =====================================================
   HIDDEN
===================================================== */

.gallery-slide.is-hidden {
  z-index: 0;

  transform:
    translateX(0)
    scale(0.55);

  opacity: 0;

  pointer-events: none;
}


/* =====================================================
   ARROWS
===================================================== */

.gallery-arrow {
  position: absolute;

  top: 50%;

  z-index: 30;

  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;
  justify-content: center;

  transform:
    translateY(-50%);

  color: #9e6072;

  border: 1px solid
    rgba(198, 160, 106, 0.42);

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.92);

  box-shadow:
    0 8px 25px
    rgba(100, 48, 64, 0.12);

  cursor: pointer;

  transition:
    transform 300ms ease,
    color 250ms ease,
    background 250ms ease,
    box-shadow 250ms ease;

  -webkit-tap-highlight-color: transparent;
}

.gallery-arrow:hover {
  color: #91445e;

  background: #fff;

  box-shadow:
    0 10px 28px
    rgba(100, 48, 64, 0.18);
}

.gallery-prev {
  left: 24px;
}

.gallery-prev:hover {
  transform:
    translate(-4px, -50%);
}

.gallery-next {
  right: 24px;
}

.gallery-next:hover {
  transform:
    translate(4px, -50%);
}


/* =====================================================
   COUNTER
===================================================== */

.gallery-counter {
  position: absolute;

  left: 50%;

  bottom: 30px;

  transform:
    translateX(-50%);

  display: flex;

  align-items: center;

  gap: 8px;

  color: #9d6072;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 14px;

  letter-spacing: 0.12em;
}

.gallery-counter strong {
  color: #9b4b61;

  font-size: 17px;

  font-weight: 600;
}

.gallery-counter em {
  font-style: normal;

  opacity: 0.45;
}

.gallery-counter span {
  width: 22px;
  height: 1px;

  background:
    #c6a06a;
}


/* =====================================================
   DOTS
===================================================== */

.gallery-dots {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 20px;
}

.gallery-dots button {
  width: 6px;
  height: 6px;

  padding: 0;

  border: 0;

  border-radius: 999px;

  background:
    rgba(164, 92, 112, 0.3);

  cursor: pointer;

  transition:
    width 350ms ease,
    background 350ms ease;
}

.gallery-dots button.active {
  width: 25px;

  background: #b85e79;
}


/* =====================================================
   EMPTY
===================================================== */

.gallery-empty {
  padding: 80px 20px;

  text-align: center;

  color: #b38a98;
}

.gallery-empty p {
  margin: 8px 0 0;

  font-size: 13px;
}


/* =====================================================
   TABLET
===================================================== */

@media (max-width: 900px) {
  .gallery-stage {
    height: 560px;
  }

  .gallery-slide {
    width: 54vw;
  }

  .gallery-slide.is-prev {
    transform:
      translateX(-69%)
      scale(0.8);
  }

  .gallery-slide.is-next {
    transform:
      translateX(69%)
      scale(0.8);
  }

  .gallery-slide.is-prev-2 {
    transform:
      translateX(-112%)
      scale(0.66);
  }

  .gallery-slide.is-next-2 {
    transform:
      translateX(112%)
      scale(0.66);
  }
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 700px) {
  .memories-section {
    padding:
      50px
      0
      65px;
  }

  .memories-heading {
    margin-bottom: 8px;
  }

  .gallery-stage {
    height: 455px;
  }

  .gallery-slide {
    width: 64vw;

    max-width: 380px;
  }

  /*
   * Ảnh hai bên vẫn nhìn rõ,
   * không làm tối ảnh.
   */

  .gallery-slide.is-prev {
    transform:
      translateX(-68%)
      scale(0.76);

    opacity: 0.86;

    filter: none;
  }

  .gallery-slide.is-next {
    transform:
      translateX(68%)
      scale(0.76);

    opacity: 0.86;

    filter: none;
  }

  .gallery-slide.is-prev-2 {
    transform:
      translateX(-105%)
      scale(0.62);

    opacity: 0.45;

    filter: none;
  }

  .gallery-slide.is-next-2 {
    transform:
      translateX(105%)
      scale(0.62);

    opacity: 0.45;

    filter: none;
  }

  .gallery-arrow {
    width: 38px;
    height: 38px;
  }

  .gallery-prev {
    left: 5px;
  }

  .gallery-next {
    right: 5px;
  }

  .gallery-counter {
    bottom: 17px;
  }
}


/* =====================================================
   SMALL MOBILE
===================================================== */

@media (max-width: 430px) {
  .gallery-stage {
    height: 405px;
  }

  .gallery-slide {
    width: 68vw;
  }

  .gallery-slide.is-prev {
    transform:
      translateX(-65%)
      scale(0.72);
  }

  .gallery-slide.is-next {
    transform:
      translateX(65%)
      scale(0.72);
  }

  .gallery-slide.is-prev-2,
  .gallery-slide.is-next-2 {
    opacity: 0;
  }

  .gallery-arrow {
    width: 34px;
    height: 34px;
  }

  .gallery-arrow .v-icon {
    font-size: 23px !important;
  }

  .photo-frame {
    padding: 5px;
  }

  .photo-border {
    inset: 10px;
  }
}


/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .gallery-slide,
  .photo-frame img,
  .gallery-arrow,
  .gallery-dots button {
    transition: none;
  }
}
</style>
