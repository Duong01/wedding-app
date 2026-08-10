<template>
  <section id="gallery" class="gallery-section">
    <v-container>
      <div class="album-heading">

        <h2 class="album-title">Khoảnh khắc của chúng mình</h2>

        <div class="album-ornament">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

        <p class="album-description">
          Lưu giữ những khoảnh khắc đẹp nhất trong hành trình yêu thương của
          chúng mình.
        </p>
      </div>

      <div class="album-grid">
        <!-- 3 ảnh đầu -->
        <div
          v-for="(item, index) in previewImages.slice(0, 3)"
          :key="item.id"
          class="album-item"
          @click="openGallery(index)"
        >
          <img :src="item.image" :alt="item.title" />
        </div>

        <!-- Ô xem thêm -->
        <div
          class="album-item more-item"
          @click="openGallery(3)"
        >
          <img
            :src="gallery[3]?.image"
            alt=""
          >

          <div class="more-overlay">

            <span class="more-count"> +{{ remainImages + 1 }} </span>
          <span class="more-text"> Xem tất cả </span>
          <span class="more-arrow"> → </span>

          </div>

        </div>
        <!-- <button
          type="button"
          class="more-overlay"
          @click="dialog = true"
          aria-label="Xem tất cả ảnh"
        >
          <span class="more-count"> +{{ remainImages + 1 }} </span>
          <span class="more-text"> Xem tất cả </span>
          <span class="more-arrow"> → </span>
        </button> -->
      </div>
    </v-container>

    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      transition="dialog-fade-transition"
      content-class="gallery-dialog"
    >
      <GalleryModal
        :images="gallery"
        :start-index="currentIndex"
        @close="dialog = false"
      />
    </v-dialog>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useWeddingStore } from "@/stores/wedding";
import GalleryModal from "./GalleryModal.vue";
const dialog = ref(false);

const store = useWeddingStore();
const gallery = computed(() => store.wedding.gallery ?? []);
const selectedIndex = ref(-1);
const currentIndex = computed(() => selectedIndex.value);
const selectedItem = computed(() =>
  selectedIndex.value >= 0 ? gallery.value[selectedIndex.value] : null
);

const previewImages = computed(() => gallery.value.slice(0, 4));

const remainImages = computed(() => gallery.value.length - 4);
function openGallery(index) {
  selectedIndex.value = index;

  dialog.value = true;
}

function closeLightbox() {
  dialog.value = false;

  selectedIndex.value = -1;
}

function nextImage() {
  selectedIndex.value = (selectedIndex.value + 1) % gallery.value.length;
}

function prevImage() {
  selectedIndex.value =
    (selectedIndex.value - 1 + gallery.value.length) % gallery.value.length;
}

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* =========================================================
   WEDDING ALBUM
   ========================================================= */

.album-heading {
  width: 100%;
  max-width: 600px;

  margin: 0 auto 32px;

  text-align: center;
}

/* OUR LOVE STORY */

.album-kicker {
  margin-bottom: 8px;

  font-family: var(--font-main);

  font-size: 8px;
  font-weight: 500;

  letter-spacing: 3.5px;

  color: var(--gold);

  text-transform: uppercase;
}

/* Tiêu đề */

.album-title {
  margin: 0;

  font-family: var(--font-wedding);

  font-size: clamp(32px, 7vw, 46px);

  font-weight: 500;

  font-style: italic;

  line-height: 1.05;

  color: var(--primary);

  letter-spacing: -0.3px;
}

/* Trang trí */

.album-ornament {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  margin: 15px auto 13px;
}

.album-ornament span {
  display: block;

  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 180, 109, 0.7));
}

.album-ornament span:last-child {
  background: linear-gradient(90deg, rgba(216, 180, 109, 0.7), transparent);
}

.album-ornament i {
  font-family: var(--font-wedding);

  font-size: 13px;

  font-style: normal;

  color: var(--gold);
}

/* Mô tả */

.album-description {
  max-width: 420px;

  margin: 0 auto;

  font-family: var(--font-main);

  font-size: 11px;

  font-weight: 300;

  line-height: 1.8;

  color: var(--sub-text);
}


/* =========================================================
   ALBUM
   ========================================================= */

.album-grid {
  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 14px;

  width: 100%;
  max-width: 1200px;

  margin: 30px auto 0;
}


/* =========================================================
   ALBUM ITEM
   ========================================================= */

.album-item {
  position: relative;

  width: 100%;

  /*
   * Tất cả ảnh cùng tỷ lệ
   */
  aspect-ratio: 1 / 1;

  overflow: hidden;

  border-radius: 18px;

  background: #eee;

  cursor: pointer;

  /*
   * Viền nhẹ
   */
  border: 1px solid rgba(255, 255, 255, 0.8);

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.08);

  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;
}


/* =========================================================
   IMAGE
   ========================================================= */

.album-item img {
  display: block;

  width: 100%;
  height: 100%;

  /*
   * Quan trọng:
   * ép tất cả ảnh cùng kích thước
   */
  object-fit: cover;

  object-position: center;

  transition:
    transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.4s ease;
}


/* =========================================================
   HOVER
   ========================================================= */

.album-item:hover {
  transform: translateY(-5px);

  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.16);
}

.album-item:hover img {
  transform: scale(1.06);
}


/* =========================================================
   MORE ITEM
   ========================================================= */

.more-item {
  isolation: isolate;
}

.more-item::after {
  content: "";

  position: absolute;
  inset: 0;

  z-index: 1;

  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.68),
      rgba(0, 0, 0, 0.08) 70%
    );

  pointer-events: none;
}


/* =========================================================
   MORE OVERLAY
   ========================================================= */

.more-overlay {
  position: absolute;

  left: 50%;
  bottom: 18px;

  z-index: 3;

  display: flex;
  align-items: center;

  gap: 9px;

  transform: translateX(-50%);

  width: max-content;
  max-width: calc(100% - 24px);

  padding: 6px 12px 6px 7px;

  color: #fff;

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;

  background:
    rgba(15, 15, 15, 0.55);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.25);

  white-space: nowrap;

  pointer-events: none;
}


/* NUMBER */

.more-count {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 34px;
  height: 34px;

  padding: 0 8px;

  color: #302513;

  font-size: 13px;
  font-weight: 700;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #f6e4a5,
      #cda64b
    );

  box-shadow:
    0 4px 15px rgba(215, 174, 74, 0.25);
}


/* TEXT */

.more-text {
  font-size: 13px;
  font-weight: 500;

  letter-spacing: 0.02em;
}


/* ARROW */

.more-arrow {
  font-size: 16px;

  color: rgba(255, 255, 255, 0.8);

  transition: transform 0.3s ease;
}


/* Hover */

.more-item:hover .more-overlay {
  background:
    rgba(20, 20, 20, 0.72);
}

.more-item:hover .more-arrow {
  transform: translateX(4px);
}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 900px) {

  .album-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 12px;

    margin-top: 25px;
  }

  .album-item {
    border-radius: 15px;
  }
}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 600px) {

  .album-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 9px;

    width: 100%;

    margin-top: 20px;
  }

  .album-item {
    aspect-ratio: 1 / 1;

    border-radius: 12px;
  }

  .more-overlay {
    bottom: 10px;

    gap: 6px;

    padding: 4px 8px 4px 5px;
  }

  .more-count {
    min-width: 29px;
    height: 29px;

    font-size: 11px;
  }

  .more-text {
    font-size: 11px;
  }

  .more-arrow {
    display: none;
  }
}


/* =========================================================
   VERY SMALL MOBILE
   ========================================================= */

@media (max-width: 360px) {

  .album-grid {
    gap: 7px;
  }

  .album-item {
    border-radius: 10px;
  }

  .more-text {
    display: none;
  }

  .more-overlay {
    left: auto;
    right: 8px;

    transform: none;

    max-width: none;
  }
}


/* Tất cả item */

.album-item {
  position: relative;

  overflow: hidden;

  min-height: 220px;

  border-radius: 18px;

  background: #eee;

  cursor: pointer;

  isolation: isolate;
}

/* Ảnh */

.album-item img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  transition: transform 0.7s cubic-bezier(0.2, 0.65, 0.25, 1), filter 0.5s ease;
}

/* Hover */

.album-item:hover img {
  transform: scale(1.045);

  filter: brightness(0.88);
}
.gallery-section {
  background: #f8f5ed;
  position: relative;
  padding: 50px 20px;
  animation: fadeInUp 0.8s ease-out;
}

.gallery-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("/images/paper-texture.png");
  opacity: 0.08;
  pointer-events: none;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
  animation: fadeInUp 0.8s ease-out 0.1s both;
}

.section-header h2 {
  color: #7b1f1f;
  /* font-size: clamp(28px, 7vw, 46px); */
  font-weight: 700;
  margin: 0 0 15px 0;
}

.section-header p {
  color: #8b6a5d;
  /* font-size: clamp(13px, 3vw, 16px); */
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}



.album-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: clamp(12px, 3vw, 18px);
  position: relative;
  cursor: pointer;
  background: white;
  transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: scaleIn 0.6s ease-out backwards;
}

.album-item:nth-child(1) {
  animation-delay: 0.3s;
}
.album-item:nth-child(2) {
  animation-delay: 0.35s;
}
.album-item:nth-child(3) {
  animation-delay: 0.4s;
}
.album-item:nth-child(4) {
  animation-delay: 0.45s;
}

.album-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}

.album-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s ease-out;
}

.album-item:hover img {
  transform: scale(1.1);
}

/* ô xem thêm */
.more-item {
  position: relative;
}

/* =========================================================
   MORE OVERLAY
   ========================================================= */

.more-overlay {
  position: absolute;
  inset: auto 14px 14px auto;

  z-index: 10;

  display: inline-flex;
  align-items: center;
  gap: 9px;

  min-height: 46px;
  padding: 6px 12px 6px 7px;

  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;

  color: #fff;

  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.72),
    rgba(20, 20, 20, 0.42)
  );

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  cursor: pointer;

  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease,
    box-shadow 0.3s ease;

  appearance: none;
  -webkit-tap-highlight-color: transparent;
}

/* =========================================================
   NUMBER
   ========================================================= */

.more-count {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 34px;
  height: 34px;

  padding: 0 8px;

  border-radius: 50%;

  color: #18130d;

  font-size: 13px;
  font-weight: 700;
  line-height: 1;

  background: linear-gradient(135deg, #f4df9a, #c99f42);

  box-shadow: 0 3px 12px rgba(212, 170, 70, 0.25);
}

/* =========================================================
   TEXT
   ========================================================= */

.more-text {
  font-size: 13px;
  font-weight: 500;

  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* =========================================================
   ARROW
   ========================================================= */

.more-arrow {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  color: rgba(255, 255, 255, 0.75);

  font-size: 16px;

  transition: transform 0.3s ease, color 0.3s ease;
}

/* =========================================================
   HOVER
   ========================================================= */

.more-overlay:hover {
  transform: translateY(-3px);

  border-color: rgba(231, 199, 106, 0.55);

  background: linear-gradient(
    135deg,
    rgba(35, 30, 20, 0.82),
    rgba(20, 20, 20, 0.58)
  );

  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35), 0 0 25px rgba(216, 180, 90, 0.12);
}

.more-overlay:hover .more-arrow {
  color: #e7c76a;
  transform: translateX(4px);
}

/* =========================================================
   ACTIVE / TOUCH
   ========================================================= */

.more-overlay:active {
  transform: scale(0.96);
}

/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 768px) {
  .more-overlay {
    right: 10px;
    bottom: 10px;

    min-height: 42px;

    gap: 7px;

    padding: 5px 10px 5px 6px;
  }

  .more-count {
    min-width: 30px;
    height: 30px;

    font-size: 12px;
  }

  .more-text {
    font-size: 12px;
  }

  .more-arrow {
    width: 20px;
    height: 20px;

    font-size: 14px;
  }
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 480px) {
  .more-overlay {
    right: 8px;
    bottom: 8px;

    min-height: 38px;

    gap: 6px;

    padding: 4px 8px 4px 5px;

    border-radius: 999px;
  }

  .more-count {
    min-width: 28px;
    height: 28px;

    font-size: 11px;
  }

  .more-text {
    font-size: 11px;
  }

  .more-arrow {
    display: none;
  }
}

/* =========================================================
   VERY SMALL MOBILE
   ========================================================= */

@media (max-width: 360px) {
  .more-overlay {
    right: 6px;
    bottom: 6px;
  }

  .more-text {
    display: none;
  }

  .more-count {
    min-width: 30px;
    height: 30px;
  }
}

/* Lightbox/Modal Styles */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(4px);
}

.lightbox-panel {
  width: min(100%, 900px);
  position: relative;
  animation: scaleIn 0.4s ease-out;
}

.lightbox-close {
  position: absolute;
  top: -16px;
  right: -16px;
  z-index: 2;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #7b1f1f;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: 0.3s ease-out;
  font-weight: bold;
  /* font-size: 24px; */
}

.lightbox-close:hover {
  transform: rotate(90deg);
  background: #f0f0f0;
}

.lightbox-body {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 16px;
  align-items: center;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  color: #7b1f1f;
  cursor: pointer;
  transition: 0.3s ease-out;
  font-weight: bold;
  /* font-size: 20px; */
}

.nav-btn:hover {
  background: white;
  transform: scale(1.05);
}

.lightbox-image-wrap {
  border-radius: 24px;
  overflow: hidden;
  background: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: scaleIn 0.5s ease-out;
}

.lightbox-image {
  width: 100%;
  max-height: 70vh;
  object-fit: cover;
  display: block;
}

.lightbox-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  color: #7b1f1f;
  border-radius: 0 0 24px 24px;
  /* font-size: clamp(12px, 2vw, 14px); */
}

.lightbox-caption p {
  margin: 0;
  font-weight: 700;
}

.lightbox-caption span {
  color: #9d6d79;
}

@keyframes slideFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .gallery-section {
    padding: 40px 15px;
  }

  .section-header {
    margin-bottom: 40px;
  }

  .album-grid {
    gap: clamp(10px, 3vw, 15px);
  }

  .lightbox-body {
    grid-template-columns: 32px 1fr 32px;
    gap: 12px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
    /* font-size: 18px; */
  }

  .lightbox-close {
    width: 40px;
    height: 40px;
    /* font-size: 22px; */
  }
}

@media (max-width: 480px) {
  .gallery-section {
    padding: 30px 12px;
  }

  .album-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .lightbox {
    padding: 16px;
  }

  .lightbox-body {
    grid-template-columns: 28px 1fr 28px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
    /* font-size: 16px; */
  }
}
/* ========================================================= GALLERY DIALOG ========================================================= */
.gallery-dialog {
  margin: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
  height: 100dvh !important;
  max-height: 100dvh !important;
  overflow: hidden;
  background: #0b0b0b !important;
} /* Vuetify dialog content */
.gallery-dialog .v-card,
.gallery-dialog .v-sheet {
  width: 100%;
  height: 100%;
  border-radius: 0 !important;
}
</style>
