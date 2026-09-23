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

    <!-- =====================================================
         TẢI NHIỀU ẢNH CÙNG LÚC
    ====================================================== -->

    <div class="bulk-upload">
      <div class="bulk-info">
        <v-icon size="19"> mdi-cloud-upload-outline </v-icon>

        <div>
          <strong> Tải nhiều ảnh cùng lúc </strong>

          <small>
            Chọn một lần nhiều file — mỗi ảnh thành một mục trong album.
          </small>
        </div>
      </div>

      <UploadField
        kind="image"
        button-text="Chọn nhiều ảnh"
        icon="mdi-image-multiple-outline"
        :show-preview="false"
        multiple
        @uploaded="onBulkUploaded"
      />
    </div>

    <!-- =====================================================
         DANH SÁCH ẢNH
    ====================================================== -->

    <div class="gallery-editor">
      <article
        v-for="(image, index) in wedding.gallery"
        :key="image.Id || index"
        class="gallery-item"
        :class="{
          dragging: dragIndex === index,
          'drop-target': dropIndex === index && dragIndex !== index,
        }"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover.prevent="onDragOver(index)"
        @dragleave="onDragLeave(index)"
        @drop.prevent="onDrop(index)"
        @dragend="onDragEnd"
      >
        <span class="gallery-order">{{ index + 1 }}</span>

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
          <UploadField
            v-model="image.Image"
            kind="image"
            button-text="Tải ảnh"
            icon="mdi-image-plus-outline"
            :show-preview="false"
            compact
          />

          <button
            type="button"
            class="danger-icon"
            title="Xoá ảnh"
            @click="removeGallery(index)"
          >
            <v-icon size="17"> mdi-delete-outline </v-icon>
          </button>
        </div>
      </article>
    </div>

    <div v-if="!wedding.gallery?.length" class="empty-card">
      <v-icon size="30"> mdi-image-multiple-outline </v-icon>

      <strong> Album chưa có ảnh </strong>

      <span> Tải lên những khoảnh khắc đẹp nhất của hai bạn. </span>
    </div>

    <p v-else class="gallery-hint">
      <v-icon size="14"> mdi-drag </v-icon>

      Kéo thả để sắp xếp thứ tự ảnh hiển thị trên thiệp.
    </p>

    <button type="button" class="add-button" @click="addGallery">
      <v-icon> mdi-image-plus-outline </v-icon>

      Thêm ảnh
    </button>
  </section>
</template>

<script setup>
import { ref } from "vue";

import UploadField from "@/components/editor/UploadField.vue";

import { confirmDialog } from "@/composables/useConfirm";

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

/*
 * Nhận mảng URL từ UploadField (chế độ multiple) và
 * tạo mục tương ứng — dùng chung cho ảnh mới.
 */
function onBulkUploaded(urls) {
  if (!props.wedding || !Array.isArray(urls)) {
    return;
  }

  if (!Array.isArray(props.wedding.gallery)) {
    props.wedding.gallery = [];
  }

  urls.forEach((url, offset) => {
    props.wedding.gallery.push({
      Id: Date.now() + offset,
      Image: url,
    });
  });
}

async function removeGallery(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.gallery)) return;

  const ok = await confirmDialog({
    title: "Xoá ảnh này?",
    message: "Ảnh sẽ bị xoá khỏi album. Bạn vẫn hoàn tác được.",
    detail: `Ảnh ${index + 1}`,
    confirmText: "Xoá ảnh",
    danger: true,
  });

  if (!ok) {
    return;
  }

  props.wedding.gallery.splice(index, 1);
}

/* =====================================================
   KÉO THẢ SẮP XẾP
===================================================== */

const dragIndex = ref(-1);
const dropIndex = ref(-1);

function onDragStart(index) {
  dragIndex.value = index;
}

function onDragOver(index) {
  if (dragIndex.value === -1) {
    return;
  }

  dropIndex.value = index;
}

function onDragLeave(index) {
  if (dropIndex.value === index) {
    dropIndex.value = -1;
  }
}

function onDrop(index) {
  const from = dragIndex.value;

  const list = props.wedding.gallery;

  if (from === -1 || from === index || !Array.isArray(list)) {
    onDragEnd();

    return;
  }

  const [item] = list.splice(from, 1);

  list.splice(index, 0, item);

  onDragEnd();
}

function onDragEnd() {
  dragIndex.value = -1;
  dropIndex.value = -1;
}
</script>

<style scoped>
.bulk-upload {
  display: flex;

  align-items: center;

  justify-content: space-between;

  flex-wrap: wrap;

  gap: 14px;

  margin-bottom: 18px;

  padding: 14px 16px;

  border: 1px dashed #d3c3ae;
  border-radius: 14px;

  background: rgba(255, 253, 251, 0.7);
}

.bulk-info {
  display: flex;

  align-items: center;

  gap: 11px;

  min-width: 0;

  color: var(--wine, #a63a2e);
}

.bulk-info > div {
  display: flex;

  flex-direction: column;
}

.bulk-info strong {
  color: #3a2c26;

  font-size: 12.5px;
}

.bulk-info small {
  margin-top: 3px;

  color: #a8988a;

  font-size: 10.5px;
}

.gallery-item {
  position: relative;

  cursor: grab;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.gallery-item:active {
  cursor: grabbing;
}

.gallery-item.dragging {
  opacity: 0.45;
}

.gallery-item.drop-target {
  transform: translateY(-3px);

  box-shadow: 0 0 0 2px var(--wine, #a63a2e);
}

.gallery-order {
  position: absolute;

  top: 7px;

  left: 7px;

  z-index: 2;

  min-width: 22px;

  height: 22px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: 0 6px;

  border-radius: 7px;

  background: rgba(43, 33, 24, 0.62);

  color: #fff;

  font-size: 10.5px;
  font-weight: 700;
}

.gallery-hint {
  display: flex;

  align-items: center;

  gap: 6px;

  margin: 12px 0 0;

  color: #a8988a;

  font-size: 10.5px;
}
</style>
