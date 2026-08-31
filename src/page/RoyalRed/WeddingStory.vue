<template>
  <section class="rr-section">
    <div class="rr-frame story">
      <div class="rr-kicker">OUR STORY</div>
      <h2 class="rr-title">Câu Chuyện Tình Yêu</h2>
      <div v-for="(item, i) in items" :key="i" class="story-item">
        <div>
          <h3>{{ item.Title || item.Name }}</h3>
          <p>{{ item.content || item.Description || item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ story: [Object, Array] });
const items = computed(() =>
  Array.isArray(props.story) ? props.story : props.story?.items || [props.story]
);
</script>
<style scoped>
.story-item {
  display: grid;
  gap: 15px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(216, 170, 90, 0.22);
}

.story-item h3 {
  margin: 0;
  color: #efd18b;
  font-size: 21px;
}
.story-item p {
  line-height: 1.7;
  margin: 6px 0 0;
  opacity: 0.78;
}
</style>
