<template>
  <section class="gallery">
    <div class="eyebrow">KHOẢNH KHẮC YÊU THƯƠNG</div>
    <h2>Album cưới</h2>
    <div>
      <img
        v-for="(photo, index) in images"
        :key="index"
        :src="photo.Image || photo.Url || photo"
        :alt="`Khoảnh khắc cưới ${index + 1}`"
        loading="lazy"
      />
    </div>
  </section>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ gallery: { type: Array, default: () => [] } });
const images = computed(() => props.gallery || []);
</script>
<style scoped>
.gallery {
  padding: 38px 18px;
  text-align: center;
}

.gallery img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(129, 44, 71, 0.14);
}
.gallery img:first-child {
  grid-column: span 2;
  height: 330px;
}
</style>