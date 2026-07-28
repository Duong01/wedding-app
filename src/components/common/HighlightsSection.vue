<template>
  <section class="highlights-section" id="wedding-events">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Thông Tin Lễ Cưới</div>
        <h2>Ngày Trọng Đại Của Chúng Tôi</h2>
        <p>Khoảnh khắc quan trọng, địa điểm và thời gian được chuẩn bị tinh tế cho ngày cưới.</p>
      </div>

      <div class="event-slider">
        <div class="event-track" :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
          <div
            class="event-card"
            v-for="(event, index) in events"
            :key="event.id"
          >
            <div class="event-item">
              <div class="event-item-image">
                <v-img :src="event.image || coverImage" height="500" cover />
              </div>
              <div class="event-item-info">
                <div class="event-label">{{ event.date }} · {{ event.time }}</div>
                <h3 class="event-title">{{ event.title }}</h3>
                <div class="event-type">{{ event.type }}</div>
                <p class="event-place">{{ event.place }}</p>
                <p class="event-desc">{{ event.description }}</p>
                <div class="event-actions">
                  <v-btn color="pink" variant="tonal" class="event-map-btn" @click="openMap(event.place)">
                    <v-icon left>mdi-map-search</v-icon>
                    Xem bản đồ
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="timeline-controls">
        <v-btn icon @click="prev" :disabled="activeIndex === 0">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span>{{ activeIndex + 1 }} / {{ events.length }}</span>
        <v-btn icon @click="next" :disabled="activeIndex === events.length - 1">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();
const events = computed(() => store.wedding.events ?? []);
const coverImage = computed(() => store.wedding.coverImage);
const activeIndex = ref(0);

function prev() {
  if (activeIndex.value > 0) activeIndex.value -= 1;
}

function next() {
  if (activeIndex.value < events.value.length - 1) activeIndex.value += 1;
}

function openMap(place) {
  const query = encodeURIComponent(place);
  window.open(`https://maps.google.com/maps?q=${query}`, "_blank");
}
</script>

<style scoped>
.highlights-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff4f6 0%, #fffefc 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.sub-title {
  color: #cb7d8c;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 10px;
}

.section-header h2 {
  font-size: 2.75rem;
  color: #3c2a2f;
  margin-bottom: 12px;
}

.section-header p {
  color: #7f6e75;
  max-width: 640px;
  margin: 0 auto;
}

.event-slider {
  overflow: hidden;
  position: relative;
}

.event-track {
  display: flex;
  width: 100%;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.event-card {
  min-width: 100%;
  padding: 24px 0;
  display: flex;
  justify-content: center;
}

.event-item {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 36px;
  overflow: hidden;
  box-shadow: 0 32px 90px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(219, 166, 176, 0.25);
}

.event-item-image {
  min-height: 500px;
  overflow: hidden;
}

.event-item-image .v-img {
  height: 100%;
}

.event-item-info {
  padding: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: fadeUp 0.8s ease;
}

.event-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 999px;
  background: #fde7ef;
  color: #be5071;
  font-weight: 700;
  margin-bottom: 18px;
}

.event-title {
  margin: 0 0 14px;
  font-size: 2.25rem;
  color: #3c2a2f;
  line-height: 1.05;
}

.event-type {
  display: inline-block;
  color: #b96178;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.event-place {
  margin-bottom: 16px;
  color: #8c5a70;
  font-weight: 700;
}

.event-desc {
  color: #6f6a6a;
  line-height: 1.85;
  margin-bottom: 28px;
}

.event-actions {
  display: flex;
  justify-content: flex-start;
}

.event-map-btn {
  border-radius: 999px;
}

.timeline-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.timeline-controls span {
  font-weight: 700;
  color: #5f3f4d;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1040px) {
  .event-item {
    grid-template-columns: 1fr;
  }

  .event-item-image {
    min-height: 340px;
  }
}

@media (max-width: 760px) {
  .section-header h2 {
    font-size: 2rem;
  }

  .event-item {
    gap: 18px;
  }

  .event-item-info {
    padding: 28px;
  }

  .event-title {
    font-size: 1.75rem;
  }
}
</style>
