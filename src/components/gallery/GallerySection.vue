<template>
  <section id="gallery" class="gallery-section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Album Ảnh</div>
        <h2>Khoảnh Khắc Của Chúng Tôi</h2>
        <p>Những hình ảnh lưu giữ lại những kỷ niệm đẹp nhất trong hành trình yêu thương.</p>
      </div>

      <div class="gallery-grid">
        <div
          v-for="(item, index) in galleryPreview"
          :key="item.id"
          class="gallery-card"
          :class="{ overlay: index === 3 && extraCount > 0 }"
        >
          <v-img :src="item.image" cover class="gallery-image" />
          <div class="gallery-overlay">
            <span v-if="index === 3 && extraCount > 0">+{{ extraCount }}</span>
            <span v-else>{{ item.title }}</span>
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();
const gallery = computed(() => store.wedding.gallery ?? []);
const galleryPreview = computed(() => gallery.value.slice(0, 4));
const extraCount = computed(() => Math.max(0, gallery.value.length - 4));
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
  letter-spacing: 4px;
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
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.gallery-card {
  position: relative;
  min-height: 320px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.gallery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.14);
}
.gallery-image {
  height: 100%;
}
.gallery-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 24px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.55) 100%);
}
.gallery-overlay span {
  color: white;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.gallery-card.overlay .gallery-overlay {
  align-items: center;
  justify-content: center;
  background: rgba(58, 25, 41, 0.7);
}
.gallery-card.overlay .gallery-overlay span {
  font-size: 2rem;
}
@media (max-width: 880px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>