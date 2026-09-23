<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> HERO </span>

        <h1>Ảnh bìa</h1>

        <p>Nội dung xuất hiện đầu tiên khi khách mở thiệp.</p>
      </div>
    </div>

    <!-- =====================================================
         XEM TRƯỚC ẢNH BÌA
    ====================================================== -->

    <div class="hero-preview">
      <img
        v-if="wedding.hero.Background"
        :src="wedding.hero.Background"
        alt="Ảnh nền"
      />

      <div v-else class="hero-preview-empty">
        <v-icon size="30"> mdi-image-outline </v-icon>

        <span> Chưa có ảnh nền </span>
      </div>

      <div class="hero-preview-overlay">
        <span class="hero-preview-kicker">
          {{ wedding.hero.Subtitle || "Lời mời" }}
        </span>

        <strong>
          {{ wedding.hero.BrideName || "Cô dâu" }}
          &amp;
          {{ wedding.hero.GroomName || "Chú rể" }}
        </strong>

        <span class="hero-preview-date">
          {{ heroDateLabel || "Chưa chọn ngày" }}
        </span>
      </div>
    </div>

    <div class="form-grid">
      <div class="editor-field">
        <label>Tiêu đề</label>

        <input
          v-model="wedding.hero.Title"
          type="text"
          placeholder="VD: Save The Date"
        />
      </div>

      <div class="editor-field">
        <label>Lời mời</label>

        <input
          v-model="wedding.hero.Subtitle"
          type="text"
          placeholder="VD: Trân trọng kính mời"
        />
      </div>

      <div class="editor-field">
        <label>Tên chú rể</label>

        <input v-model="wedding.hero.GroomName" type="text" />

        <small class="field-help">
          Đã đồng bộ với mục Thông tin chung.
        </small>
      </div>

      <div class="editor-field">
        <label>Tên cô dâu</label>

        <input v-model="wedding.hero.BrideName" type="text" />

        <small class="field-help">
          Đã đồng bộ với mục Thông tin chung.
        </small>
      </div>

      <div class="editor-field">
        <label>Ngày cưới</label>

        <input
          :value="heroDateInput"
          type="datetime-local"
          @input="onHeroDateInput"
        />

        <small class="field-help">
          Đã đồng bộ với mục Thông tin chung.
        </small>
      </div>

      <div class="editor-field">
        <label>Địa điểm</label>

        <input
          v-model="wedding.hero.Location"
          type="text"
          placeholder="VD: Tư gia nhà gái"
        />
      </div>

      <div class="editor-field full">
        <label>Ảnh nền</label>

        <UploadField
          v-model="wedding.hero.Background"
          kind="image"
          button-text="Tải ảnh nền lên"
        />

        <small class="field-help">
          Nên dùng ảnh dọc hoặc vuông, tối thiểu 1200px để không bị vỡ
          trên điện thoại.
        </small>
      </div>

      <div class="editor-field full">
        <label>Nhạc</label>

        <UploadField
          v-model="wedding.hero.Music"
          kind="audio"
          button-text="Tải nhạc lên"
          icon="mdi-music-note-plus"
        />

        <small class="field-help">
          Nhạc riêng cho màn hình mở thiệp. Để trống sẽ dùng nhạc ở mục
          Âm nhạc.
        </small>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import UploadField from "@/components/editor/UploadField.vue";

import {
  fromDatetimeLocal,
  parseWeddingDate,
  toDatetimeLocal,
} from "@/utils/datetime";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Hero.WeddingDate là DateTime? bên API — dùng chung
 * input datetime-local và utils/datetime để không lệch
 * định dạng với mục Thông tin chung.
 */
const heroDateInput = computed(() =>
  toDatetimeLocal(props.wedding.hero?.WeddingDate)
);

function onHeroDateInput(event) {
  props.wedding.hero.WeddingDate = fromDatetimeLocal(event.target.value);
}

const heroDateLabel = computed(() => {
  const date = parseWeddingDate(props.wedding.hero?.WeddingDate);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
});
</script>

<style scoped>
.hero-preview {
  position: relative;

  aspect-ratio: 16 / 9;

  max-height: 260px;

  overflow: hidden;

  margin-bottom: 24px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 16px;

  background: #f6f1ea;
}

.hero-preview img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.hero-preview-empty {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 7px;

  height: 100%;

  color: #a8988a;

  font-size: 11px;
}

.hero-preview-overlay {
  position: absolute;

  inset: auto 0 0 0;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 3px;

  padding: 26px 16px 16px;

  background: linear-gradient(to top, rgba(20, 12, 8, 0.78), transparent);

  text-align: center;
}

.hero-preview-kicker {
  color: rgba(255, 255, 255, 0.78);

  font-size: 9.5px;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-preview-overlay strong {
  color: #fff;

  font-family: var(--font-heading), Georgia, serif;
  font-size: 21px;
  font-weight: 600;
}

.hero-preview-date {
  color: rgba(255, 255, 255, 0.82);

  font-size: 11px;
}
</style>
