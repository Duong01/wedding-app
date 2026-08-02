<template>
  <section class="location-section">
    <v-container>
      <div class="location-card">
        <div class="location-copy">
          <div class="sub-title">Địa Điểm</div>
          <h2>Tiệc cưới tại {{ wedding.location }}</h2>
          <p>{{ wedding.address }}</p>
          <div class="location-note">Hãy đến đúng giờ để cùng nhau bắt đầu một ngày vui trọn vẹn.</div>
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
  padding: 70px 0 100px;
}

.location-card {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 24px;
  padding: 32px;
  border-radius: 36px;
  background: linear-gradient(135deg, rgba(255, 250, 245, 0.97) 0%, rgba(255, 244, 235, 0.95) 100%);
  border: 1px solid rgba(206, 160, 145, 0.24);
  box-shadow: 0 24px 70px rgba(93, 61, 54, 0.08);
}

.sub-title {
  color: #c57c78;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 0.85rem;
}

.location-copy h2 {
  margin: 0 0 12px;
  font-family: "Cormorant Garamond", serif;
  font-size: 2rem;
  color: #4d3537;
}

.location-copy p {
  margin: 0 0 16px;
  color: #7a6768;
  line-height: 1.8;
}

.location-note {
  padding: 16px 18px;
  border-radius: 20px;
  background: #fff4ec;
  color: #8c5f55;
  font-weight: 600;
}

.map-frame {
  min-height: 420px;
  overflow: hidden;
  border-radius: 24px;
}

@media (max-width: 980px) {
  .location-card {
    grid-template-columns: 1fr;
  }
}
</style>
