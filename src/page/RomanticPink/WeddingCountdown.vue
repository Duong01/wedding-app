<template>
  <section class="countdown">
    <div class="eyebrow">NGÀY VUI ĐANG ĐẾN GẦN</div>
    <h2>Đếm ngược</h2>
    <div class="countdown-grid">
      <article v-for="item in values" :key="item.label" class="countdown-item">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </article>
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";

const props = defineProps({ 
  countdown: { type: [String, Date, Object], default: "" }, 
  weddingDate: { type: [String, Date], default: "" } 
});

const now = ref(Date.now());
let timer;

onMounted(() => { 
  timer = window.setInterval(() => { 
    now.value = Date.now(); 
  }, 1000); 
});

onUnmounted(() => window.clearInterval(timer));

const target = computed(() => props.countdown?.Target || props.countdown || props.weddingDate);

const values = computed(() => { 
  const seconds = Math.max(0, dayjs(target.value).diff(dayjs(now.value), "second")); 
  return [
    ["NGÀY", Math.floor(seconds / 86400)],
    ["GIỜ", Math.floor((seconds % 86400) / 3600)],
    ["PHÚT", Math.floor((seconds % 3600) / 60)],
    ["GIÂY", seconds % 60]
  ].map(([label, value]) => ({ 
    label, 
    value: String(value).padStart(2, "0") 
  })); 
});
</script>
<style scoped>
.countdown {
  text-align: center;
}

.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}

.countdown-item {
  padding: 14px 2px;
  border-top: 1px solid #d895a9;
  border-bottom: 1px solid #d895a9;
}

.countdown-item b {
  display: block;
  color: #a43e65;
  font-size: 28px;
  margin-bottom: 4px;
}

.countdown-item span {
  font-size: 8px;
  letter-spacing: 0.1em;
  color: #b56882;
}
</style>