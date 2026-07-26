<template>
  <section id="gallery" class="section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Our Memories</div>
        <h2>Thư Viện Ảnh</h2>
        <p>Những khoảnh khắc đáng nhớ của chúng mình.</p>
      </div>

      <v-row>
        <v-col
          v-for="item in gallery"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
        >
          <div class="gallery-card">
            <v-img :src="item.image" height="280" cover class="gallery-image" />
            <div class="gallery-overlay">
              <span>{{ item.title }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();
const gallery = computed(() => store.wedding.gallery ?? []);
</script>

<style scoped>
.section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff8fb 0%, #ffffff 100%);
}
.section-header {
  text-align: center;
  margin-bottom: 56px;
}
.sub-title {
  color: #d88a9c;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 10px;
}
.section-header h2 {
  font-size: 2rem;
  color: #3f2a2a;
  margin-bottom: 10px;
}
.section-header p {
  color: #7a6a6a;
}
.gallery-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.gallery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.16);
}
.gallery-image {
  transition: transform 0.45s ease;
}
.gallery-card:hover .gallery-image {
  transform: scale(1.06);
}
.gallery-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 18px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.55) 100%);
}
.gallery-overlay span {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>