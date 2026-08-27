<template>
  <section class="eg-gallery">

    <div class="gallery-inner">

      <!-- HEADER -->

      <header class="gallery-header">

        <div class="gallery-label">
          OUR MEMORIES
        </div>

        <div class="gallery-script">
          Những khoảnh khắc đẹp
        </div>

        <h2>
          Album
          <br />
          <em>của chúng mình</em>
        </h2>

        <div class="gallery-symbol">
          ◆
        </div>

      </header>

      <!-- PREVIEW -->

      <div class="gallery-preview">

        <button
          type="button"
          class="gallery-image-button"
          @click="openGallery(0)"
        >
          <img
            v-if="gallery[0]"
            :src="getImage(gallery[0])"
            :alt="getAlt(gallery[0], 0)"
            class="preview-image"
          />

          <div class="preview-overlay">
            <span class="preview-icon">
              ⊕
            </span>

            <span>
              Xem album
            </span>
          </div>
        </button>

      </div>

      <!-- THUMBNAILS -->

      <div
        v-if="gallery.length > 1"
        class="thumbnail-list"
      >
        <button
          v-for="(item, index) in gallery.slice(0, 6)"
          :key="item.Id || index"
          type="button"
          class="thumbnail"
          @click="openGallery(index)"
        >
          <img
            :src="getImage(item)"
            :alt="getAlt(item, index)"
          />
        </button>
      </div>

      <div
        v-if="gallery.length > 6"
        class="more-count"
      >
        +{{ gallery.length - 6 }} ảnh khác
      </div>

    </div>

    <!-- =========================================
         FULLSCREEN GALLERY
    ========================================== -->

    <Teleport to="body">

      <Transition name="gallery-fade">

        <div
          v-if="dialog"
          class="gallery-modal"
          @click.self="closeGallery"
        >

          <!-- TOP -->

          <div class="modal-top">

            <div class="modal-counter">
              {{ currentNumber }}
              <span>/</span>
              {{ totalNumber }}
            </div>

            <button
              type="button"
              class="close-button"
              aria-label="Đóng"
              @click="closeGallery"
            >
              ×
            </button>

          </div>

          <!-- IMAGE -->

          <div class="modal-content">

            <button
              type="button"
              class="nav-button nav-prev"
              aria-label="Ảnh trước"
              @click="previous"
            >
              ‹
            </button>

            <div class="modal-image-wrap">

              <img
                v-if="currentImage"
                :src="currentImage"
                :alt="currentAlt"
                class="modal-image"
              />

            </div>

            <button
              type="button"
              class="nav-button nav-next"
              aria-label="Ảnh tiếp"
              @click="next"
            >
              ›
            </button>

          </div>

          <!-- BOTTOM THUMBNAILS -->

          <div class="modal-thumbnails">

            <button
              v-for="(item, index) in gallery"
              :key="item.Id || index"
              type="button"
              class="modal-thumbnail"
              :class="{
                active:
                  index === currentIndex
              }"
              @click="setIndex(index)"
            >
              <img
                :src="getImage(item)"
                :alt="getAlt(item, index)"
              />
            </button>

          </div>

        </div>

      </Transition>

    </Teleport>

  </section>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  ref,
} from "vue";

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "open",
]);

const dialog = ref(false);

const currentIndex = ref(0);

/* =========================================
   IMAGE
========================================= */

function getImage(item) {
  if (!item) return "";

  if (typeof item === "string") {
    return item;
  }

  return (
    item.url ||
    item.Image ||
    item.src ||
    item.thumbnail ||
    ""
  );
}

function getAlt(item, index) {
  if (
    item &&
    typeof item === "object" &&
    item.alt
  ) {
    return item.alt;
  }

  return `Ảnh cưới ${index + 1}`;
}

/* =========================================
   CURRENT
========================================= */

const currentImage = computed(() => {
  if (!props.gallery.length) {
    return "";
  }

  return getImage(
    props.gallery[
      currentIndex.value
    ]
  );
});

const currentAlt = computed(() => {
  if (!props.gallery.length) {
    return "";
  }

  return getAlt(
    props.gallery[
      currentIndex.value
    ],
    currentIndex.value
  );
});

const currentNumber = computed(() => {
  return String(
    currentIndex.value + 1
  ).padStart(2, "0");
});

const totalNumber = computed(() => {
  return String(
    props.gallery.length
  ).padStart(2, "0");
});

/* =========================================
   OPEN
========================================= */

function openGallery(index = 0) {
  if (!props.gallery.length) {
    return;
  }

  currentIndex.value =
    Math.max(
      0,
      Math.min(
        index,
        props.gallery.length - 1
      )
    );

  dialog.value = true;

  document.body.style.overflow =
    "hidden";

  emit(
    "open",
    currentIndex.value
  );
}

/* =========================================
   CLOSE
========================================= */

function closeGallery() {
  dialog.value = false;

  document.body.style.overflow = "";
}

/* =========================================
   INDEX
========================================= */

function setIndex(index) {
  if (
    index < 0 ||
    index >= props.gallery.length
  ) {
    return;
  }

  currentIndex.value = index;
}

function previous() {
  if (!props.gallery.length) {
    return;
  }

  currentIndex.value =
    currentIndex.value <= 0
      ? props.gallery.length - 1
      : currentIndex.value - 1;
}

function next() {
  if (!props.gallery.length) {
    return;
  }

  currentIndex.value =
    currentIndex.value >=
    props.gallery.length - 1
      ? 0
      : currentIndex.value + 1;
}

/* =========================================
   KEYBOARD
========================================= */

function handleKeydown(event) {
  if (!dialog.value) {
    return;
  }

  if (event.key === "Escape") {
    closeGallery();
    return;
  }

  if (event.key === "ArrowLeft") {
    previous();
    return;
  }

  if (event.key === "ArrowRight") {
    next();
  }
}

window.addEventListener(
  "keydown",
  handleKeydown
);

/* =========================================
   CLEANUP
========================================= */

onBeforeUnmount(() => {
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

.eg-gallery {
  position: relative;

  padding:
    100px 35px;

  background:
    #f7f2e8;

  overflow: hidden;
}

.eg-gallery::before {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(180,142,40,0.1);

  pointer-events: none;
}

.gallery-inner {
  position: relative;

  width: min(
    100%,
    750px
  );

  margin: auto;
}

/* =====================================================
   HEADER
===================================================== */

.gallery-header {
  text-align: center;

  margin-bottom: 50px;
}

.gallery-label {
  color: #a98a47;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.gallery-script {
  margin-top: 20px;

  color: #c39c42;

  font-family:
    "Allura",
    cursive;

  font-size: 35px;
}

.gallery-header h2 {
  margin:
    5px 0 18px;

  color: #30291f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(35px, 6vw, 49px);

  font-weight: 400;

  line-height: 0.95;
}

.gallery-header h2 em {
  color: #8e7a59;

  font-style: italic;
}

.gallery-symbol {
  color: #d4af37;

  font-size: 7px;
}

/* =====================================================
   PREVIEW
===================================================== */

.gallery-preview {
  position: relative;

  width: min(
    100%,
    580px
  );

  margin:
    0 auto 18px;
}

.gallery-image-button {
  position: relative;

  display: block;

  width: 100%;

  padding: 8px;

  border:
    1px solid
    rgba(180,142,40,0.5);

  background:
    #fffdf8;

  cursor: pointer;

  overflow: hidden;
}

.gallery-image-button::before {
  content: "";

  position: absolute;

  inset: 13px;

  z-index: 1;

  border:
    1px solid
    rgba(212,175,55,0.18);

  pointer-events: none;
}

.preview-image {
  display: block;

  width: 100%;

  aspect-ratio: 1.15;

  object-fit: cover;

  transition:
    transform 0.7s ease;
}

.gallery-image-button:hover
.preview-image {
  transform:
    scale(1.025);
}

.preview-overlay {
  position: absolute;

  inset: 0;

  z-index: 2;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 7px;

  color: #fff8e8;

  background:
    rgba(20,18,14,0.35);

  opacity: 0;

  transition:
    opacity 0.35s ease;
}

.gallery-image-button:hover
.preview-overlay {
  opacity: 1;
}

.preview-icon {
  color: #e0c56e;

  font-size: 28px;
}

.preview-overlay span:last-child {
  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 17px;

  letter-spacing: 1px;
}

/* =====================================================
   THUMBNAILS
===================================================== */

.thumbnail-list {
  display: grid;

  grid-template-columns:
    repeat(6, 1fr);

  gap: 8px;

  width: min(
    100%,
    580px
  );

  margin: auto;
}

.thumbnail {
  display: block;

  padding: 3px;

  border:
    1px solid
    rgba(180,142,40,0.25);

  background: #fffdf8;

  cursor: pointer;

  overflow: hidden;
}

.thumbnail img {
  display: block;

  width: 100%;

  aspect-ratio: 1;

  object-fit: cover;

  transition:
    transform 0.35s ease;
}

.thumbnail:hover img {
  transform:
    scale(1.08);
}

.more-count {
  margin-top: 17px;

  color: #a08c70;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;

  font-style: italic;

  text-align: center;
}

/* =====================================================
   MODAL
===================================================== */

.gallery-modal {
  position: fixed;

  inset: 0;

  z-index: 100000;

  display: flex;

  flex-direction: column;

  background:
    rgba(12,11,9,0.97);

  color: #fff;

  overflow: hidden;
}

/* TOP */

.modal-top {
  position: relative;

  flex:
    0 0 65px;

  display: flex;

  align-items: center;

  justify-content: center;
}

.modal-counter {
  color:
    rgba(245,226,171,0.85);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 18px;

  letter-spacing: 2px;
}

.modal-counter span {
  margin:
    0 6px;

  color:
    rgba(255,255,255,0.3);
}

.close-button {
  position: absolute;

  top: 14px;
  right: 20px;

  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(212,175,55,0.35);

  border-radius: 50%;

  background:
    rgba(255,255,255,0.03);

  color:
    rgba(255,255,255,0.8);

  font-size: 25px;

  font-weight: 200;

  cursor: pointer;

  transition:
    all 0.3s ease;
}

.close-button:hover {
  color: #d4af37;

  border-color:
    #d4af37;
}

/* IMAGE */

.modal-content {
  flex:
    1 1 auto;

  min-height: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 20px;

  padding:
    0 20px;
}

.modal-image-wrap {
  width: min(
    100%,
    900px
  );

  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  min-width: 0;
}

.modal-image {
  display: block;

  max-width: 100%;
  max-height: 100%;

  object-fit: contain;

  box-shadow:
    0 20px 70px
    rgba(0,0,0,0.4);
}

.nav-button {
  flex:
    0 0 45px;

  width: 45px;
  height: 45px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(212,175,55,0.4);

  border-radius: 50%;

  background:
    rgba(255,255,255,0.025);

  color:
    rgba(245,225,170,0.9);

  font-family:
    Georgia,
    serif;

  font-size: 32px;

  font-weight: 200;

  line-height: 1;

  cursor: pointer;

  transition:
    all 0.3s ease;
}

.nav-button:hover {
  background:
    rgba(212,175,55,0.1);

  border-color:
    #d4af37;
}

/* BOTTOM THUMBNAILS */

.modal-thumbnails {
  flex:
    0 0 90px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding:
    10px 20px;

  overflow-x: auto;

  scrollbar-width: none;
}

.modal-thumbnails::-webkit-scrollbar {
  display: none;
}

.modal-thumbnail {
  flex:
    0 0 58px;

  width: 58px;
  height: 58px;

  padding: 2px;

  border:
    1px solid
    rgba(255,255,255,0.15);

  background: transparent;

  cursor: pointer;

  opacity: 0.55;

  transition:
    all 0.3s ease;
}

.modal-thumbnail img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.modal-thumbnail:hover {
  opacity: 0.85;
}

.modal-thumbnail.active {
  border-color:
    #d4af37;

  opacity: 1;
}

/* TRANSITION */

.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition:
    opacity 0.3s ease;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {
  .eg-gallery {
    padding:
      75px 20px;
  }

  .eg-gallery::before {
    inset: 10px;
  }

  .gallery-header {
    margin-bottom: 35px;
  }

  .thumbnail-list {
    grid-template-columns:
      repeat(4, 1fr);
  }

  .modal-top {
    flex-basis: 55px;
  }

  .close-button {
    top: 8px;
    right: 10px;
  }

  .modal-content {
    gap: 5px;

    padding:
      0 5px;
  }

  .nav-button {
    flex:
      0 0 34px;

    width: 34px;
    height: 34px;

    font-size: 25px;
  }

  .modal-thumbnails {
    flex-basis: 75px;

    justify-content: flex-start;
  }

  .modal-thumbnail {
    flex-basis: 52px;

    width: 52px;
    height: 52px;
  }
}
</style>