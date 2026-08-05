<template>
  <div class="gallery-modal" @click.self="close">
    <div class="modal-panel">
      <button class="modal-close" type="button" @click="close">
        ✕
      </button>

      <swiper
        ref="mainSwiper"
        :modules="modules"
        :navigation="true"
        :keyboard="{ enabled: true }"
        :initial-slide="startIndex"
        :thumbs="{ swiper: thumbsSwiper }">
        <swiper-slide v-for="(img, i) in images" :key="i">
          <img :src="img.image" :alt="img.title || 'image'" class="main-image" />
        </swiper-slide>
      </swiper>

      <div class="thumbs-wrap">
        <swiper
          class="thumbs-swiper"
          :modules="modules"
          space-between="10"
          slides-per-view="6"
          @swiper="onThumbsSwiper"
          :breakpoints="{ 0: { slidesPerView: 3 }, 640: { slidesPerView: 5 }, 900: { slidesPerView: 6 } }">
          <swiper-slide v-for="(img, i) in images" :key="'t'+i" class="thumb-slide">
            <img :src="img.image" :alt="img.title || 'thumb'" />
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Swiper, SwiperSlide } from "swiper/vue";

import {
  Navigation,
  Thumbs,
  Keyboard
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const props = defineProps({
  images: { type: Array, required: true },
  startIndex: { type: Number, default: 0 }
});
const emit = defineEmits(['close']);

const mainSwiper = ref(null);
const thumbsSwiper = ref();
const modules = [Thumbs, Navigation, Keyboard];


function onThumbsSwiper(swiper) {
  thumbsSwiper.value = swiper;
}


function close() {
  emit('close');
}

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.gallery-modal{
  position:fixed;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(10,10,10,0.85);
  z-index:1400;
  padding:20px;
}
.modal-panel{
  width:min(100%,1100px);
  background:transparent;
  position:relative;
}
.modal-close{
  position:absolute;
  top:-12px;
  right:-12px;
  width:42px;
  height:42px;
  border-radius:50%;
  border:0;
  background:#fff;
  cursor:pointer;
  z-index:3;
}
.main-image{
  width:100%;
  max-height:70vh;
  object-fit:cover;
  display:block;
  border-radius:14px;
}
.thumbs-wrap{ margin-top:14px }
.thumb-slide img{ width:100%; height:64px; object-fit:cover; border-radius:8px; cursor:pointer }

@media (max-width:700px){
  .thumb-slide img{ height:48px }
}
</style>
