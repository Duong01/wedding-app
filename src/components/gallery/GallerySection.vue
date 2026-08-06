<template>
  <section id="gallery" class="gallery-section">
    <v-container>
      <div class="section-header">
          <h2>
              Album Ảnh
          </h2>

          <p>
              Lưu giữ những khoảnh khắc đẹp nhất trong hành trình của chúng mình.
          </p>

      </div>

      <div class="album-grid">

  <!-- 3 ảnh đầu -->
  <div
    v-for="(item,index) in previewImages.slice(0,3)"
    :key="item.id"
    class="album-item"
    @click="openGallery(index)"
  >
    <img :src="item.image" :alt="item.title">
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

      <div class="more-count">
        +{{ remainImages + 1 }}
      </div>

      <div class="more-text">
        Xem tất cả
      </div>

    </div>

  </div>

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

        @close="dialog=false"

    />

</v-dialog>
      </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useWeddingStore } from "@/stores/wedding";
import GalleryModal from './GalleryModal.vue';
const dialog = ref(false);

const store = useWeddingStore();
const gallery = computed(() => store.wedding.gallery ?? []);
const selectedIndex = ref(-1);
const currentIndex = computed(() => selectedIndex.value);
const selectedItem = computed(() => (selectedIndex.value >= 0 ? gallery.value[selectedIndex.value] : null));

const previewImages = computed(() => gallery.value.slice(0,4));

const remainImages = computed(()=>
    gallery.value.length-4
); 
function openGallery(index) {
  selectedIndex.value=index;

    dialog.value=true;
}

function closeLightbox() {
  dialog.value=false;

    selectedIndex.value=-1;
}

function nextImage(){

    selectedIndex.value =
        (selectedIndex.value + 1) % gallery.value.length;

}

function prevImage(){

    selectedIndex.value =
        (selectedIndex.value - 1 + gallery.value.length)
        % gallery.value.length;

}

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.gallery-section{
    background:#f8f5ed;
    position:relative;
    padding: 50px 20px;
    animation: fadeInUp 0.8s ease-out;
}

.gallery-section::before{
    content:"";
    position:absolute;
    inset:0;
    background:url("/images/paper-texture.png");
    opacity:.08;
    pointer-events: none;
}

.section-header{
    text-align:center;
    margin-bottom:50px;
    animation: fadeInUp 0.8s ease-out 0.1s both;
}

.section-header h2{
    color:#7b1f1f;
    font-size: clamp(28px, 7vw, 46px);
    font-family:"Cormorant Garamond",serif;
    font-weight:700;
    margin: 0 0 15px 0;
}

.section-header p {
    color: #8b6a5d;
    font-size: clamp(13px, 3vw, 16px);
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
}

.album-grid{
    width: 100%;
    max-width:760px;
    margin: 0 auto;
    display:grid;
    grid-template-columns:repeat(2, 1fr);
    gap: clamp(12px, 4vw, 20px);
    animation: fadeInUp 0.8s ease-out 0.2s both;
}

.album-item{
    aspect-ratio:1;
    overflow:hidden;
    border-radius: clamp(12px, 3vw, 18px);
    position:relative;
    cursor:pointer;
    background:white;
    transition:.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    animation: scaleIn 0.6s ease-out backwards;
}

.album-item:nth-child(1) { animation-delay: 0.3s; }
.album-item:nth-child(2) { animation-delay: 0.35s; }
.album-item:nth-child(3) { animation-delay: 0.4s; }
.album-item:nth-child(4) { animation-delay: 0.45s; }

.album-item:hover{
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}

.album-item img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition:.5s ease-out;
}

.album-item:hover img{
    transform:scale(1.1);
}

/* ô xem thêm */
.more-item{
    position:relative;
}

.more-overlay{
    position:absolute;
    inset:0;
    background: linear-gradient(135deg, rgba(20,20,20,.5), rgba(10,10,10,.6));
    backdrop-filter:blur(3px);
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    color:#fff;
    transition: .3s ease-out;
}

.album-item:hover .more-overlay {
    backdrop-filter: blur(5px);
}

.more-count{
    font-size: clamp(18px, 5vw, 24px);
    font-weight:700;
    line-height:1;
}

.more-text{
    margin-top:10px;
    font-size: clamp(11px, 2vw, 13px);
    letter-spacing:1.5px;
    text-transform:uppercase;
    font-weight: 600;
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
  font-size: 24px;
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
  font-size: 20px;
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
  font-size: clamp(12px, 2vw, 14px);
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
    font-size: 18px;
  }

  .lightbox-close {
    width: 40px;
    height: 40px;
    font-size: 22px;
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
    font-size: 16px;
  }
}
</style>
