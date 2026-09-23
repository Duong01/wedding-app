<template>
  <section class="rr-gallery">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="rr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         LƯỚI ẢNH
    ====================================================== -->

    <div v-if="gallery.length" class="rr-gallery__box">

      <div class="rr-gallery__grid">

        <button
          v-for="(item, index) in visibleImages"
          :key="item.id"
          type="button"
          class="rr-gallery__cell"
          :aria-label="`Xem ảnh ${index + 1}`"
          @click="openLightbox(index)"
        >
          <img
            :src="item.src"
            :alt="`Ảnh cưới ${index + 1}`"
            loading="lazy"
            decoding="async"
          />

          <span
            v-if="index === visibleImages.length - 1 && hiddenCount > 0"
            class="rr-gallery__more"
          >
            +{{ hiddenCount }}
          </span>
        </button>

      </div>

    </div>


    <p v-else class="rr-gallery__empty">
      Chưa có hình ảnh
    </p>


    <!-- =====================================================
         LIGHTBOX
    ====================================================== -->

    <GalleryModal
      v-if="dialog"
      :images="gallery"
      :start-index="currentIndex"
      @close="closeLightbox"
    />

  </section>
</template>


<script setup>
import { computed, defineAsyncComponent, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";


const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "gallery", "Heading", "Album Ảnh")
);


/* =====================================================
   ẢNH
===================================================== */

/*
 * Lưới chỉ hiển thị 4 ô vuông. Nếu còn ảnh phía sau
 * thì ô cuối phủ lớp "+N".
 */
const MAX_VISIBLE = 4;

const normalized = computed(() =>
  (props.gallery || [])
    .map((item, index) => {
      const data = item || {};

      return {
        id: data.Id || index,
        src: data.Image || data.Url || data.Src || data.image || "",
      };
    })
    .filter((item) => item.src)
);

const visibleImages = computed(() =>
  normalized.value.slice(0, MAX_VISIBLE)
);

const hiddenCount = computed(() =>
  Math.max(normalized.value.length - MAX_VISIBLE, 0)
);


/* =====================================================
   LIGHTBOX
===================================================== */

const currentIndex = ref(0);

const dialog = ref(false);

const openLightbox = (index) => {
  if (!props.gallery.length) {
    return;
  }

  currentIndex.value = index;

  dialog.value = true;
};

const closeLightbox = () => {
  dialog.value = false;
};
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.rr-gallery {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;

  padding: 0 24px;

  color: var(--rr-red);
}


/* =====================================================
   LƯỚI
===================================================== */

.rr-gallery__box {
  width: 100%;
  max-width: 320px;
}

.rr-gallery__grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 12px;

  padding: 16px;
}

.rr-gallery__cell {
  position: relative;

  display: block;

  aspect-ratio: 1 / 1;

  padding: 0;

  overflow: hidden;

  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 8px;

  background-color: color-mix(in srgb, var(--rr-white) 50%, transparent);

  cursor: pointer;
}

.rr-gallery__cell img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.2s ease;
}

.rr-gallery__cell:hover img {
  transform: scale(1.03);
}

.rr-gallery__more {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.55);

  color: #ffffff;

  font-size: 18px;
  font-weight: 600;
}


/* =====================================================
   EMPTY
===================================================== */

.rr-gallery__empty {
  margin: 0;

  font-size: 14px;

  text-align: center;

  opacity: 0.7;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-gallery {
    gap: 32px;

    padding: 0 40px;
  }

  .rr-gallery__box {
    max-width: 550px;
  }

  .rr-gallery__grid {
    gap: 16px;

    padding: 24px;
  }
}
</style>
