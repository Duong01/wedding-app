<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> PHOTO ALBUM </span>

        <h1>Album ảnh</h1>

        <p>Thêm những khoảnh khắc đáng nhớ.</p>
      </div>

      <button
        type="button"
        class="small-primary-button"
        @click="addGallery"
      >
        <v-icon size="17"> mdi-image-plus-outline </v-icon>

        Thêm ảnh
      </button>
    </div>

    <div class="gallery-editor">
      <article
        v-for="(image, index) in wedding.gallery"
        :key="image.Id || index"
        class="gallery-item"
      >
        <img
          v-if="image.Image"
          :src="image.Image"
          :alt="`Ảnh ${index + 1}`"
          loading="lazy"
          @error="image.hasError = true"
        />

        <div v-else class="image-placeholder">
          <v-icon size="32"> mdi-image-outline </v-icon>

          <span> Chưa có ảnh </span>
        </div>

        <div class="gallery-input">
          <input
            v-model="image.Image"
            type="text"
            placeholder="URL hình ảnh"
          />

          <button
            type="button"
            class="danger-icon"
            title="Xóa ảnh"
            @click="removeGallery(index)"
          >
            <v-icon size="17"> mdi-delete-outline </v-icon>
          </button>
        </div>
      </article>
    </div>

    <button type="button" class="add-button" @click="addGallery">
      <v-icon> mdi-image-plus-outline </v-icon>

      Thêm ảnh
    </button>
  </section>
</template>

<script setup>
const props = defineProps({
  wedding: { type: Object, required: true },
});

function addGallery() {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.gallery)) {
    props.wedding.gallery = [];
  }

  props.wedding.gallery.push({
    Id: Date.now(),
    Image: "",
  });
}

function removeGallery(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.gallery)) return;

  props.wedding.gallery.splice(index, 1);
}
</script>
