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
.gallery-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff7f8 0%, #fffdfc 100%);
}
.section-header {
  text-align: center;
  margin-bottom: 56px;
}
.sub-title {
  color: #c76a7e;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 10px;
}
.section-header h2 {
  font-size: 2.5rem;
  color: #3b2a2b;
  margin-bottom: 10px;
}
.section-header p {
  color: #7d6c70;
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.8;
}

.album-grid{

    max-width:760px;

    margin:40px auto 0;

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:16px;

}


.album-item{

    position:relative;

    aspect-ratio:1;

    border-radius:18px;

    overflow:hidden;

    cursor:pointer;

    background:#fff;

    box-shadow:0 10px 30px rgba(0,0,0,.08);

    transition:.35s;

}


.album-item:hover{

    transform:translateY(-6px);

}


.album-item img{

    width:100%;

    height:100%;

    object-fit:cover;

    transition:.45s;

}


.album-item:hover img{

    transform:scale(1.08);

}



/* ô xem thêm */

.more-item{

    position:relative;

}


.more-overlay{

    position:absolute;

    inset:0;

    background:rgba(20,20,20,.45);

    backdrop-filter:blur(2px);

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    color:#fff;

}


.more-count{

    font-size:20px;

    font-weight:700;

    line-height:1;

}


.more-text{

    margin-top:10px;

    font-size:12px;

    letter-spacing:1px;

    text-transform:uppercase;

}
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(10, 10, 10, 0.82);
}
.lightbox-panel {
  width: min(100%, 900px);
  position: relative;
}
.lightbox-close {
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 2;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #4b2d33;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.lightbox-body {
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  gap: 16px;
  align-items: center;
}
.nav-btn {
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  color: #4b2d33;
  cursor: pointer;
}
.lightbox-image-wrap {
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.25);
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
  padding: 14px 18px;
  background: white;
  color: #4b2d33;
}
.lightbox-caption p {
  margin: 0;
  font-weight: 700;
}
.lightbox-caption span {
  color: #9d6d79;
  font-size: 0.95rem;
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
@media (max-width: 880px) {
  .lightbox-body {
    grid-template-columns: 32px 1fr 32px;
  }
  .nav-btn {
    width: 36px;
    height: 36px;
  }
}
.gallery-section{

    background:#f8f5ed;
    padding:100px 0;
    position:relative;
}

.gallery-section::before{

    content:"";
    position:absolute;
    inset:0;

    background:url("/paper-texture.png");

    opacity:.18;
}

.section-header{

    text-align:center;
    margin-bottom:60px;
}

.section-header h2{

    color:#7b1f1f;
    font-size:46px;
    font-family:"Cormorant Garamond",serif;
    font-weight:700;
}

.album-grid{

    width:700px;
    max-width:100%;

    margin:auto;

    display:grid;

    grid-template-columns:1fr 1fr;

    gap:18px;
}

.album-item{

    aspect-ratio:1;

    overflow:hidden;

    border-radius:8px;

    position:relative;

    cursor:pointer;

    background:white;

    transition:.35s;
}

.album-item:hover{

    transform:translateY(-5px);
}

.album-item img{

    width:100%;
    height:100%;
    object-fit:cover;

    transition:.5s;
}

.album-item:hover img{

    transform:scale(1.06);
}

</style>
