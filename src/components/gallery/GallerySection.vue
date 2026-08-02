<template>
  <section id="gallery" class="gallery-section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Album Ảnh</div>
        <h2>Những khoảnh khắc đẹp</h2>
        <p>Nhấn vào bất kỳ bức ảnh nào để xem toàn bộ bộ sưu tập theo kiểu slideshow.</p>
      </div>

      <div class="album-grid">

    <div
        v-for="(item,index) in previewImages"
        :key="item.id"
        class="album-item"
        @click="openGallery(index)"
    >

        <img
            :src="item.image"
            :alt="item.title"
        >

        <div
            v-if="index===3 && remainImages>0"
            class="more-overlay"
        >
            +{{ remainImages }}
        </div>

    </div>

</div>
    </v-container>

    <div v-if="selectedItem" class="lightbox" @click.self="closeLightbox">
      <div class="lightbox-panel">
        <button class="lightbox-close" type="button" @click="closeLightbox">
          <v-icon>mdi-close</v-icon>
        </button>

        <div class="lightbox-body">
          <button class="nav-btn nav-btn-left" type="button" @click.stop="prevImage">
            <v-icon>mdi-chevron-left</v-icon>
          </button>

          <div class="lightbox-image-wrap">
            <img :src="selectedItem.image" :alt="selectedItem.title" class="lightbox-image" />
            <div class="lightbox-caption">
              <p>{{ selectedItem.title }}</p>
              <span>{{ currentIndex + 1 }} / {{ gallery.length }}</span>
            </div>
          </div>

          <button class="nav-btn nav-btn-right" type="button" @click.stop="nextImage">
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useWeddingStore } from "@/stores/wedding";

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
  selectedIndex.value = index;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  selectedIndex.value = -1;
  document.body.style.overflow = "";
}

function prevImage() {
  if (selectedIndex.value > 0) selectedIndex.value -= 1;
}

function nextImage() {
  if (selectedIndex.value < gallery.value.length - 1) selectedIndex.value += 1;
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
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.gallery-card {
  position: relative;
  min-height: 320px;
  border: 0;
  padding: 0;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  animation: slideFade 0.8s ease both;
  cursor: pointer;
  background: transparent;
}
.gallery-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.16);
}
.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}
.gallery-card:hover .gallery-image {
  transform: scale(1.06);
}
.gallery-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 24px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.58) 100%);
}
.gallery-overlay span {
  color: white;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.05em;
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
  .gallery-grid {
    grid-template-columns: 1fr;
  }
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

.more-overlay{

    position:absolute;

    inset:0;

    background:rgba(0,0,0,.45);

    display:flex;

    justify-content:center;

    align-items:center;

    color:white;

    font-size:44px;

    font-weight:bold;

    backdrop-filter:blur(2px);
}
</style>
