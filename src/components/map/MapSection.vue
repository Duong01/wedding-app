<template>
  <section class="location-section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Địa Điểm</div>
        <h2>Tiệc Cưới Tại</h2>
        <p>Hân hạnh chào đón quý khách tới địa điểm tổ chức trong ngày vui của chúng mình.</p>
      </div>

      <div class="location-layout">
        <div class="location-card">
          <h3>Địa chỉ tổ chức</h3>
          <p>{{ wedding.location }}</p>
          <p>{{ wedding.address }}</p>
          <div class="location-note">Hãy đến trước 15 phút để nhận hướng dẫn chỗ ngồi và đón khách.</div>
        </div>

        <div class="map-frame">
          <iframe
            :src="mapSrc"
            width="100%"
            height="100%"
            style="border:0"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();
const wedding = computed(() => store.wedding);

const mapSrc = computed(() => {
  const query = encodeURIComponent(wedding.value.address || wedding.value.location || "");
  return `https://maps.google.com/maps?q=${query}&output=embed`;
});
</script>

<style scoped>
.location-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff5f6 0%, #fffefc 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.sub-title {
  color: #c96f8c;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 10px;
}

.section-header h2 {
  font-size: 2.5rem;
  color: #3b2a2e;
  margin-bottom: 10px;
}

.section-header p {
  color: #7d6d73;
  max-width: 680px;
  margin: 0 auto;
}

.location-layout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
}

.location-card,
.map-frame {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 32px;
  border: 1px solid rgba(221, 156, 172, 0.18);
  box-shadow: 0 26px 62px rgba(0, 0, 0, 0.08);
  padding: 36px;
}

.location-card h3 {
  margin: 0 0 16px;
  color: #3b2a2f;
}

.location-card p {
  margin: 0 0 16px;
  color: #6f6068;
  line-height: 1.8;
}

.location-note {
  padding: 20px;
  border-radius: 22px;
  background: #fff0f3;
  color: #8d5b70;
  font-weight: 600;
}

.map-frame {
  min-height: 420px;
  overflow: hidden;
}

@media (max-width: 980px) {
  .location-layout {
    grid-template-columns: 1fr;
  }
}
</style>