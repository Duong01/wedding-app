<template>
  <section class="gallery-section">

    <!-- =========================================
         HEADER
    ========================================== -->

    <div class="gallery-heading">

      <span class="heading-kicker">
        NHỮNG KHOẢNH KHẮC
      </span>

      <h2>
        KHOẢNH KHẮC CỦA CHÚNG MÌNH
      </h2>

      <div class="heading-decoration">
        <span></span>

        <b>囍</b>

        <span></span>
      </div>

    </div>


    <!-- =========================================
         GALLERY
    ========================================== -->

    <div
      v-if="visibleGallery.length"
      class="gallery"
    >

      <!-- =======================================
           ẢNH 1 - ẢNH LỚN
      ======================================== -->

      <button
        v-if="visibleGallery[0]"
        type="button"
        class="gallery-item gallery-main"
        @click="openGallery(0)"
      >

        <img
          :src="getImage(visibleGallery[0])"
          alt="Ảnh cưới 1"
        />

        <span class="image-number">
          01
        </span>

      </button>


      <!-- =======================================
           CỘT ẢNH NHỎ
      ======================================== -->

      <div class="gallery-side">

        <!-- ẢNH 2 -->

        <button
          v-if="visibleGallery[1]"
          type="button"
          class="gallery-item gallery-small"
          @click="openGallery(1)"
        >

          <img
            :src="getImage(visibleGallery[1])"
            alt="Ảnh cưới 2"
          />

          <span class="image-number">
            02
          </span>

        </button>


        <!-- ẢNH 3 -->

        <button
          v-if="visibleGallery[2]"
          type="button"
          class="gallery-item gallery-small"
          @click="openGallery(2)"
        >

          <img
            :src="getImage(visibleGallery[2])"
            alt="Ảnh cưới 3"
          />

          <span class="image-number">
            03
          </span>

        </button>


        <!-- =====================================
             ẢNH 4 - XEM TẤT CẢ
        ====================================== -->

        <button
          v-if="visibleGallery[3]"
          type="button"
          class="gallery-item gallery-small gallery-last"
          @click="openGallery(3)"
        >

          <img
            :src="getImage(visibleGallery[3])"
            alt="Ảnh cưới 4"
          />

          <div class="all-photos-overlay">

            <span class="overlay-icon">
              +
            </span>

            <strong>
              XEM TẤT CẢ
            </strong>

            <small>
              {{ gallery.length }} ẢNH
            </small>

          </div>

        </button>

      </div>

    </div>


    <!-- =========================================
         EMPTY
    ========================================== -->

    <div
      v-else
      class="gallery-empty"
    >
      Chưa có hình ảnh
    </div>


    <!-- =========================================
         FULLSCREEN GALLERY DIALOG
    ========================================== -->

    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
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
import { computed, ref } from "vue";
import GalleryModal from "@/components/gallery/GalleryModal.vue";


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },
});


/* =====================================================
   DIALOG
===================================================== */

const dialog = ref(false);


/*
 * Vị trí ảnh hiện tại trong GalleryModal.
 *
 * Ví dụ:
 * 0 = ảnh đầu tiên
 * 1 = ảnh thứ hai
 * 2 = ảnh thứ ba
 * 3 = ảnh thứ tư
 */
const currentIndex = ref(0);


/* =====================================================
   VISIBLE GALLERY
   Chỉ hiển thị 4 ảnh bên ngoài
===================================================== */

const visibleGallery = computed(() => {
  return props.gallery.slice(0, 4);
});


/* =====================================================
   OPEN GALLERY
===================================================== */

function openGallery(index = 0) {

  /*
   * Nếu gallery không có ảnh thì không mở dialog.
   */
  if (!props.gallery.length) {
    return;
  }


  /*
   * Đảm bảo index luôn nằm trong phạm vi
   * của gallery từ API.
   */
  const safeIndex = Math.min(
    Math.max(index, 0),
    props.gallery.length - 1,
  );


  currentIndex.value = safeIndex;

  dialog.value = true;
}


/* =====================================================
   CLOSE GALLERY
===================================================== */

function closeLightbox() {
  dialog.value = false;
}


/* =====================================================
   IMAGE URL
===================================================== */

function getImage(item) {

  if (typeof item === "string") {
    return item;
  }

  return (
    item?.Url ||
    item?.Src ||
    item?.Image ||
    item?.ImageUrl ||
    ""
  );
}
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.gallery-section {
  width: 100%;

  color: #3f4a3e;
}


/* =====================================================
   HEADER
===================================================== */

.gallery-heading {
  text-align: center;

  margin-bottom: 28px;
}


.heading-kicker {
  display: block;

  margin-bottom: 6px;

  color: #8b948a;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 2.5px;
}


.gallery-heading h2 {
  margin: 0;

  color: #3f4a3e;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 24px;
  font-weight: 700;

  line-height: 1.2;

  letter-spacing: .8px;
}


.heading-decoration {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-top: 10px;
}


.heading-decoration span {
  width: 38px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #93a58c
    );
}


.heading-decoration span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #93a58c
    );
}


.heading-decoration b {
  color: #6b7f6a;

  font-family:
    "Times New Roman",
    serif;

  font-size: 18px;

  line-height: 1;
}


/* =====================================================
   GALLERY
===================================================== */

.gallery {
  display: grid;

  grid-template-columns:
    1.15fr
    .85fr;

  gap: 10px;

  width: 100%;
}


/* =====================================================
   SIDE
===================================================== */

.gallery-side {
  display: grid;

  grid-template-rows:
    repeat(3, 1fr);

  gap: 10px;

  min-width: 0;
}


/* =====================================================
   ITEM
===================================================== */

.gallery-item {
  position: relative;

  display: block;

  width: 100%;
  height: 100%;

  min-width: 0;

  padding: 0;

  overflow: hidden;

  border: 0;

  background: #eef2ea;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
}


/* Viền bên trong ảnh */

.gallery-item::after {
  content: "";

  position: absolute;

  inset: 5px;

  z-index: 3;

  border:
    1px solid
    rgba(255, 255, 255, .65);

  pointer-events: none;
}


/* =====================================================
   IMAGE
===================================================== */

.gallery-main {
  min-height: 430px;
}


.gallery-main img,
.gallery-small img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform .65s cubic-bezier(.2,.7,.2,1),
    filter .4s ease;
}


.gallery-main:hover img,
.gallery-small:hover img {
  transform: scale(1.045);

  filter: brightness(.96);
}


/* =====================================================
   NUMBER
===================================================== */

.Image-number {
  position: absolute;

  left: 13px;
  bottom: 12px;

  z-index: 5;

  color: rgba(255,255,255,.95);

  font-family:
    Georgia,
    serif;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 1px;

  text-shadow:
    0 1px 5px
    rgba(0,0,0,.35);
}


/* =====================================================
   LAST IMAGE OVERLAY
===================================================== */

.gallery-last::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: 2;

  background:
    linear-gradient(
      to top,
      rgba(39,52,40,.82),
      rgba(39,52,40,.18)
    );

  pointer-events: none;
}


.all-photos-overlay {
  position: absolute;

  inset: 0;

  z-index: 5;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  color: #fff;

  text-align: center;
}


.overlay-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  margin-bottom: 7px;

  border:
    1px solid
    rgba(255,255,255,.8);

  color: #fff;

  font-family: Georgia, serif;

  font-size: 20px;
}


.all-photos-overlay strong {
  font-size: 10px;
  font-weight: 800;

  letter-spacing: 1.8px;
}


.all-photos-overlay small {
  margin-top: 4px;

  color: rgba(255,255,255,.8);

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 1.2px;
}


/* =====================================================
   EMPTY
===================================================== */

.gallery-empty {
  padding: 35px 20px;

  color: #8b948a;

  font-size: 12px;

  text-align: center;

  border:
    1px solid
    rgba(107,127,106,.2);
}


/* =====================================================
   DIALOG
===================================================== */

:deep(.gallery-dialog) {
  margin: 0;

  max-width: 100%;

  border-radius: 0;

  overflow: hidden;
}


/*
 * Mobile
 */

@media (max-width: 520px) {

  .gallery-heading {
    margin-bottom: 22px;
  }


  .gallery-heading h2 {
    font-size: 21px;
  }


  .gallery {
    grid-template-columns:
      1.05fr
      .95fr;

    gap: 7px;
  }


  .gallery-side {
    gap: 7px;
  }


  .gallery-main {
    min-height: 340px;
  }


  .gallery-item::after {
    inset: 4px;
  }

}


/*
 * Rất nhỏ
 */

@media (max-width: 360px) {

  .gallery {
    grid-template-columns:
      1fr
      1fr;
  }


  .gallery-main {
    min-height: 280px;
  }

}

</style>
