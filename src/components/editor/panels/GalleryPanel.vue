<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> PHOTO ALBUM </span>

        <h1>{{ $t('editor.menu.gallery') }}</h1>

        <p>{{ $t('galleryPanel.desc') }}</p>
      </div>

      <button
        type="button"
        class="small-primary-button"
        @click="addGallery"
      >
        <v-icon size="17"> mdi-image-plus-outline </v-icon>

        {{ $t('galleryPanel.add') }}
      </button>
    </div>

    <!-- =====================================================
         KIỂU HIỂN THỊ ALBUM
    ====================================================== -->

    <h3 class="sub-heading">{{ $t('galleryPanel.layout') }}</h3>

    <p class="field-help block-help">
      {{ $t('galleryPanel.layoutHint') }}
    </p>

    <div class="layout-selector">
      <button
        v-for="item in GALLERY_LAYOUTS"
        :key="item.value"
        type="button"
        class="layout-card"
        :class="{ active: currentLayout === item.value }"
        :aria-pressed="currentLayout === item.value"
        @click="setLayout(item.value)"
      >
        <v-icon size="20"> {{ item.icon }} </v-icon>

        <strong> {{ item.label }} </strong>

        <small>
          {{ item.value === "default" ? defaultHint : item.hint }}
        </small>
      </button>
    </div>

    <!-- =====================================================
         TẢI NHIỀU ẢNH CÙNG LÚC
    ====================================================== -->

    <div class="bulk-upload">
      <div class="bulk-info">
        <v-icon size="19"> mdi-cloud-upload-outline </v-icon>

        <div>
          <strong> {{ $t('galleryPanel.bulk') }} </strong>

          <small>
            {{ $t('galleryPanel.bulkHint') }}
          </small>
        </div>
      </div>

      <UploadField
        kind="image"
        :button-text="$t('galleryPanel.pickMany')"
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
          :alt="$t('galleryPanel.photoN', { n: index + 1 })" loading="lazy" @error="image.hasError = true" /> <div v-else class="image-placeholder"> <v-icon size="32"> mdi-image-outline </v-icon> <span> {{ $t('galleryPanel.noPhoto') }} </span>
        </div>

        <div class="gallery-input">
          <UploadField
            v-model="image.Image"
            kind="image"
            :button-text="$t('galleryPanel.upload')"
            icon="mdi-image-plus-outline"
            :show-preview="false"
            compact
          />

          <button
            type="button"
            class="danger-icon"
            :title="$t('galleryPanel.remove')"
            @click="removeGallery(index)"
          >
            <v-icon size="17"> mdi-delete-outline </v-icon>
          </button>
        </div>
      </article>
    </div>

    <div v-if="!wedding.gallery?.length" class="empty-card">
      <v-icon size="30"> mdi-image-multiple-outline </v-icon>

      <strong> {{ $t('galleryPanel.empty') }} </strong>

      <span> {{ $t('galleryPanel.emptyHint') }} </span>
    </div>

    <p v-else class="gallery-hint">
      <v-icon size="14"> mdi-drag </v-icon>

      {{ $t('galleryPanel.dragHint') }}
    </p>

    <button type="button" class="add-button" @click="addGallery">
      <v-icon> mdi-image-plus-outline </v-icon>

      {{ $t('galleryPanel.add') }}
    </button>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";

import UploadField from "@/components/editor/UploadField.vue";

import {
  GALLERY_LAYOUTS,
  THEME_GALLERY_LAYOUT,
  galleryLayoutLabel,
  resolveGalleryLayout,
} from "@/data/galleryLayouts";

import { confirmDialog } from "@/composables/useConfirm";

const { t } = useI18n();

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Kiểu album lưu ở settings.GalleryLayout — preview đọc
 * thẳng nên đổi là thiệp xem trước đổi theo ngay.
 */
const currentLayout = computed(() =>
  resolveGalleryLayout(props.wedding?.settings?.GalleryLayout)
);

/*
 * Ô "Mặc định của mẫu" ghi rõ mẫu đang dùng kiểu nào.
 */
const defaultHint = computed(() => {
  const name = props.wedding?.theme?.Name || "";

  const label = galleryLayoutLabel(THEME_GALLERY_LAYOUT[name] || "coverflow");

  return t("galleryPanel.themeDefault", { label });
});

function setLayout(value) {
  if (!props.wedding.settings || typeof props.wedding.settings !== "object") {
    props.wedding.settings = {};
  }

  props.wedding.settings.GalleryLayout = value;
}

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
    get title() { return t("galleryPanel.confirmTitle"); },
    get message() { return t("galleryPanel.confirmMessage"); },
    detail: t("galleryPanel.photoN", { n: index + 1 }),
    get confirmText() { return t("galleryPanel.remove"); },
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
.layout-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-bottom: 20px;
}

.layout-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  padding: 13px;

  color: #8a7a68;

  border: 1px solid #d3c3ae;
  border-radius: 12px;

  background: rgba(255, 253, 251, 0.7);

  text-align: left;

  cursor: pointer;

  transition: border-color 0.15s ease, background 0.15s ease;
}

.layout-card.active {
  border-color: #8a7a68;

  background: rgba(138, 122, 104, 0.1);

  box-shadow: inset 0 0 0 1px #8a7a68;
}

.layout-card strong {
  color: #5c4d46;

  font-size: 13px;
}

.layout-card small {
  color: #806f66;

  font-size: 11px;
  line-height: 1.4;
}

@media (max-width: 520px) {
  .layout-selector {
    grid-template-columns: 1fr;
  }
}

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
