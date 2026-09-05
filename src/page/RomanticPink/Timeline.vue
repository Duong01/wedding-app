<template>
  <section class="timeline">
    <div class="eyebrow">DẤU MỐC YÊU THƯƠNG</div>
    <h2>Hành trình của chúng mình</h2>
    <ol>
      <li v-for="(item, index) in items" :key="item.Id || index">
        <div class="timeline-marker">
          <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          <span class="icon">{{ item.Icon || "♡" }}</span>
        </div>
        <div class="timeline-content">
          <h3>{{ item.Title || item.Name }}</h3>
          <p>{{ item.Description || item.Content }}</p>
          <p v-if="item.Location" class="location">📍 {{ item.Location }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ timeline: { type: Array, default: () => [] } });
const items = computed(() => props.timeline || []);

function formatTime(index) {
  return `0${index + 1}`;
}
</script>
<style scoped>
.timeline {
  padding: 38px 23px;
}
.timeline ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
.timeline li {
  position: relative;
  display: grid;
  grid-template-columns: 78px 1fr;
  gap: 14px;
  padding: 12px 0 12px 16px;
  border-left: 1px solid #dc9caf;
}
.timeline li:before {
  content: "";
  position: absolute;
  left: -4px;
  top: 19px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.timeline time {
  color: #a64a6a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.timeline .icon {
  font-size: 16px;
}
.timeline-content h3 {
  margin: 0;
  color: #7a3752;
  font-size: 21px;
}
.timeline-content p {
  margin: 3px 0;
  line-height: 1.4;
  color: #764158;
}
.timeline .location {
  font-size: 12px;
  color: #9b6b78;
  margin-top: 5px;
}
</style>