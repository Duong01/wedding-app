<template>
  <section class="section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Wedding Event</div>
        <h2>Thông Tin Lễ Cưới</h2>
        <p>Chúng mình đã chuẩn bị một ngày vui trọn vẹn với nhiều khoảnh khắc đáng nhớ.</p>
      </div>

      <v-row>
        <v-col v-for="event in events" :key="event.id" cols="12" md="4">
          <div class="event-card">
            <div class="event-badge">{{ event.type }}</div>
            <h3>{{ event.title }}</h3>
            <p class="event-time">{{ event.time }} · {{ event.date }}</p>
            <p class="event-place">{{ event.place }}</p>
            <p class="event-desc">{{ event.description }}</p>
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
const events = computed(() => store.wedding.events ?? []);
</script>

<style scoped>
.section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff9fc 0%, #fff 100%);
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
.event-card {
  padding: 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(216, 138, 156, 0.18);
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 22px 42px rgba(0, 0, 0, 0.12);
}
.event-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: #ffe4eb;
  color: #b45b73;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 14px;
}
.event-card h3 {
  font-size: 1.2rem;
  color: #3f2a2a;
  margin-bottom: 8px;
}
.event-time,
.event-place {
  color: #d88a9c;
  font-weight: 600;
  margin-bottom: 6px;
}
.event-desc {
  color: #6f6a6a;
  line-height: 1.7;
}
</style>