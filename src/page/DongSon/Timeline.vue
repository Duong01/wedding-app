<template>
  <section class="timeline">
    <div class="timeline-title">
      <small>OUR JOURNEY</small>
      <h2>Hành trình của chúng mình</h2>
    </div>

    <div class="timeline-list">
      <article
        v-for="(item, index) in items"
        :key="item.id || index"
        class="timeline-item"
      >
        <div class="timeline-marker">
          {{ String(index + 1).padStart(2, "0") }}
        </div>

        <div class="timeline-content">
          <span>
            {{ item.Date || item.Time || "" }}
          </span>

          <h3>
            {{ item.Title || item.Name || "Một dấu mốc đáng nhớ" }}
          </h3>

          <p>
            {{ item.Content || item.Description || "" }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },
  events: {
    type: Array,
    default: () => [],
  },
});

const items = computed(() => {
  if (props.timeline.length) return props.timeline;
  return props.events;
});
</script>

<style scoped>
.timeline {
  padding: 70px 22px;
  background: #f3ead8;
  color: #641914;
}

.timeline-title {
  text-align: center;
  margin-bottom: 45px;
}

.timeline-title small {
  color: #a96b32;
  font-size: 8px;
  letter-spacing: .4em;
}

h2 {
  font-family: Georgia, serif;
  font-size: 29px;
  font-weight: 400;
}

.timeline-list {
  position: relative;
  max-width: 580px;
  margin: auto;
}

.timeline-list::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 24px;
  width: 1px;
  background: #a96b32;
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 18px;
  margin-bottom: 32px;
}

.timeline-marker {
  position: relative;
  z-index: 2;
  width: 49px;
  height: 49px;
  display: grid;
  place-items: center;
  border: 1px solid #a96b32;
  border-radius: 50%;
  background: #f3ead8;
  color: #a96b32;
  font-size: 8px;
}

.timeline-content {
  padding: 5px 0 15px;
}

.timeline-content > span {
  font-size: 8px;
  letter-spacing: .25em;
  color: #a96b32;
}

.timeline-content h3 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: 400;
}

.timeline-content p {
  margin: 0;
  color: #80675f;
  font-family: Georgia, serif;
  font-size: 13px;
  line-height: 1.8;
}
</style>