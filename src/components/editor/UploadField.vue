<template>
  <div class="upload-field" :class="{ compact }">
    <div class="upload-row">
      <button
        type="button"
        class="upload-button"
        :disabled="uploading"
        @click="openFilePicker"
      >
        <v-icon size="16">
          {{ uploading ? "mdi-loading mdi-spin" : icon }}
        </v-icon>

        {{ uploading ? "Đang tải lên..." : buttonText }}
      </button>

      <input
        v-model="model"
        type="text"
        class="upload-url-input"
        placeholder="Hoặc dán đường link..."
        :disabled="uploading"
      />
    </div>

    <input
      ref="fileInput"
      type="file"
      class="upload-hidden-input"
      :accept="accept"
      @change="onFileChange"
    />

    <p v-if="message" class="upload-message" :class="{ error: isError }">
      {{ message }}
    </p>

    <div v-if="showPreview && previewUrl" class="upload-preview">
      <img
        v-if="kind === 'image'"
        :src="previewUrl"
        alt="Xem trước"
        @error="previewError = true"
      />

      <audio
        v-else
        :src="previewUrl"
        controls
      />

      <button
        type="button"
        class="upload-clear"
        title="Xóa đường dẫn"
        @click="clearValue"
      >
        <v-icon size="15"> mdi-close </v-icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import { uploadMedia } from "@/model/api";

const props = defineProps({
  /*
   * Giá trị 2 chiều — dùng v-model từ panel cha
   * (v-model="wedding.coverImage" ...).
   */
  modelValue: { type: String, default: "" },

  // "image" | "audio" — quyết định nút, filter file và preview
  kind: { type: String, default: "image" },

  // Nhãn nút upload
  buttonText: { type: String, default: "Tải ảnh lên" },

  // Icon trên nút (mdi)
  icon: { type: String, default: "mdi-upload-outline" },

  // Ẩn khung xem trước (dùng khi panel cha đã có preview riêng)
  showPreview: { type: Boolean, default: true },

  // Xếp nút và ô link theo chiều dọc (ô hẹp như gallery)
  compact: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const fileInput = ref(null);

const uploading = ref(false);

const message = ref("");

const isError = ref(false);

const previewError = ref(false);

const accept = computed(() =>
  props.kind === "audio"
    ? "audio/*"
    : "image/*"
);

const previewUrl = computed(() => {
  if (!props.modelValue || previewError.value) {
    return "";
  }

  return props.modelValue;
});

function showMessage(text, error = false) {
  message.value = text;
  isError.value = error;

  window.clearTimeout(showMessage.timer);

  showMessage.timer = window.setTimeout(() => {
    message.value = "";
    isError.value = false;
  }, 3200);
}

function openFilePicker() {
  fileInput.value?.click();
}

async function onFileChange(event) {
  const file = event.target.files?.[0];

  // Cho phép chọn lại cùng 1 file lần nữa
  event.target.value = "";

  if (!file) {
    return;
  }

  // Kiểm tra loại file trước khi gửi lên server
  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");

  if (props.kind === "image" && !isImage) {
    showMessage("Vui lòng chọn file ảnh.", true);

    return;
  }

  if (props.kind === "audio" && !isAudio) {
    showMessage("Vui lòng chọn file nhạc.", true);

    return;
  }

  // Giới hạn 10MB — khớp với giới hạn trên server
  if (file.size > 10 * 1024 * 1024) {
    showMessage("File vượt quá giới hạn 10MB.", true);

    return;
  }

  uploading.value = true;

  try {
    const response = await uploadMedia(file);

    const result = response?.data;

    if (result && result.status === "success" && result.data?.url) {
      emit("update:modelValue", result.data.url);

      previewError.value = false;

      showMessage("Đã tải file lên server.");
    } else {
      showMessage(result?.message || "Không thể tải file lên server.", true);
    }
  } catch (error) {
    console.error("[UploadField] uploadMedia error:", error);

    showMessage(
      error?.response?.data?.message || "Không thể tải file lên server.",
      true
    );
  } finally {
    uploading.value = false;
  }
}

function clearValue() {
  emit("update:modelValue", "");

  previewError.value = false;
}
</script>

<style scoped>
.upload-field {
  display: flex;

  flex-direction: column;

  gap: 8px;
}

.upload-row {
  display: flex;

  gap: 8px;

  align-items: stretch;
}

.upload-button {
  flex: 0 0 auto;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 0 12px;

  border: 0;

  border-radius: 10px;

  background: linear-gradient(135deg, var(--wine), var(--wine-dark));

  color: #fff;

  font-family: inherit;

  font-size: 11px;

  font-weight: 650;

  cursor: pointer;

  white-space: nowrap;

  box-shadow: 0 5px 15px rgba(166, 58, 46, 0.2);

  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.upload-button:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow: 0 8px 20px rgba(166, 58, 46, 0.26);
}

.upload-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}

.upload-url-input {
  flex: 1;

  min-width: 0;

  outline: none;

  border: 1px solid var(--border-strong);

  border-radius: 10px;

  background: #fffdfb;

  color: var(--studio-ink, #2b2118);

  padding: 11px 12px;

  font-family: inherit;

  font-size: 13px;

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.upload-url-input:focus {
  border-color: var(--wine);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.09);
}

.upload-hidden-input {
  display: none;
}

.upload-message {
  margin: 0;

  padding: 8px 12px;

  border-radius: 8px;

  background: rgba(46, 125, 50, 0.08);

  color: #2e7d32;

  font-size: 11px;
}

.upload-message.error {
  background: rgba(198, 40, 40, 0.08);

  color: #c62828;
}

.upload-preview {
  position: relative;

  width: 132px;
}

.upload-preview img {
  display: block;

  width: 132px;

  height: 132px;

  object-fit: cover;

  border: 1px solid var(--border);

  border-radius: 10px;

  background: #f6f1ea;
}

.upload-preview audio {
  display: block;

  width: 100%;

  height: 36px;
}

.upload-clear {
  position: absolute;

  top: 6px;

  right: 6px;

  width: 24px;

  height: 24px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 0;

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.55);

  color: #fff;

  cursor: pointer;

  transition: background 0.2s ease;
}

.upload-clear:hover {
  background: rgba(0, 0, 0, 0.75);
}

/* Chế độ hẹp: nút + ô link xếp dọc */
.upload-field.compact .upload-row {
  flex-direction: column;

  align-items: stretch;
}

.upload-field.compact .upload-button {
  justify-content: center;
}
</style>
