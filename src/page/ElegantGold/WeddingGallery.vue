<template>
  <section class="gallery">
    <div class="gallery-heading">
      <small>OUR MEMORIES</small>
      <h2>Khoảnh khắc yêu thương</h2>
      <p>Những hình ảnh chúng mình muốn lưu giữ mãi.</p>
    </div>

    <div class="gallery-grid">
      <button
        v-for="(item, index) in gallery"
        :key="item.id || index"
        class="photo"
        :class="{ large: index === 0 || index % 5 === 0 }"
        @click="$emit('open', index)"
      >
        <img
          :src="item.url || item.src || item.image"
          :alt="item.caption || `Ảnh ${index + 1}`"
          loading="lazy"
        />

        <span class="photo-number">
          {{ String(index + 1).padStart(2, "0") }}
        </span>
      </button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["open"]);
</script>

<style scoped>
.gallery {
  padding: 70px 18px;
  background: #f3ead8;
  color: #641914;
}

.gallery-heading {
  text-align: center;
  margin-bottom: 30px;
}

.gallery-heading small {
  font-size: 8px;
  letter-spacing: .4em;
  color: #a96b32;
}

h2 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.gallery-heading p {
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 13px;
  color: #80675f;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-width: 650px;
  margin: auto;
}

.photo {
  position: relative;
  overflow: hidden;
  min-height: 190px;
  padding: 0;
  border: 1px solid rgba(143,36,28,.35);
  background: #641914;
  cursor: pointer;
}

.photo.large {
  grid-row: span 2;
  min-height: 388px;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .7s ease;
}

.photo:hover img {
  transform: scale(1.06);
}

.photo::after {
  content: "";
  position: absolute;
  inset: 7px;
  border: 1px solid rgba(255,230,190,.55);
  pointer-events: none;
}

.photo-number {
  position: absolute;
  right: 13px;
  bottom: 11px;
  z-index: 2;
  color: #f3ead8;
  font-size: 8px;
  letter-spacing: .15em;
}
</style>