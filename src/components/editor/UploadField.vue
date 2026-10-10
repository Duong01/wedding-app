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

        {{ uploading ? $t("upload.uploading") : buttonText || $t("upload.uploadImage") }}
      </button>

      <input
        v-model="model"
        type="text"
        class="upload-url-input"
        :placeholder="$t('upload.orPaste')"
        :disabled="uploading"
      />
    </div>

    <input
      ref="fileInput"
      type="file"
      class="upload-hidden-input"
      :accept="accept"
      :multiple="multiple"
      @change="onFileChange"
    />

    <p v-if="message" class="upload-message" :class="{ error: isError }">
      {{ message }}
    </p>

    <!-- Tiến trình từng file khi upload nhiều ảnh cùng lúc -->
    <ul v-if="uploadQueue.length" class="upload-queue">
      <li
        v-for="item in uploadQueue"
        :key="item.name"
        class="upload-queue-item"
        :class="{ done: item.done, failed: item.failed }"
      >
        <v-icon size="14" class="queue-icon">
          {{
            item.failed
              ? "mdi-alert-circle-outline"
              : item.done
                ? "mdi-check-circle-outline"
                : "mdi-loading mdi-spin"
          }}
        </v-icon>

        <span class="queue-name" :title="item.name">
          {{ item.name }}
        </span>

        <span v-if="!item.done && !item.failed" class="queue-percent">
          {{ item.percent }}%
        </span>

        <span v-else-if="item.done" class="queue-percent">
          {{ $t("upload.doneShort") }}
        </span>

        <span v-else class="queue-percent">
          {{ $t("upload.failedShort") }}
        </span>

        <i class="queue-bar">
          <i
            class="queue-bar-fill"
            :style="{ width: `${item.percent}%` }"
          />
        </i>
      </li>
    </ul>

    <div v-if="showPreview && previewUrl" class="upload-preview">
      <img
        v-if="kind === 'image'"
        :src="previewUrl"
        :alt="$t('editor.preview')"
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
        :title="$t('upload.clear')"
        @click="clearValue"
      >
        <v-icon size="15"> mdi-close </v-icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";

import { uploadMedia } from "@/model/api";

import { deleteMediaFile } from "@/composables/useMediaCleanup";

const { t } = useI18n();

const props = defineProps({
  /*
   * Giá trị 2 chiều — dùng v-model từ panel cha
   * (v-model="wedding.coverImage" ...).
   */
  modelValue: { type: String, default: "" },

  // "image" | "audio" — quyết định nút, filter file và preview
  kind: { type: String, default: "image" },

  // Nhãn nút upload
  buttonText: { type: String, default: "" },

  // Icon trên nút (mdi)
  icon: { type: String, default: "mdi-upload-outline" },

  // Ẩn khung xem trước (dùng khi panel cha đã có preview riêng)
  showPreview: { type: Boolean, default: true },

  // Xếp nút và ô link theo chiều dọc (ô hẹp như gallery)
  compact: { type: Boolean, default: false },

  /*
   * Cho phép chọn nhiều file một lần. Khi bật, component
   * phát thêm sự kiện "uploaded" với mảng URL để panel
   * cha tự tạo nhiều mục (dùng cho album ảnh).
   */
  multiple: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "uploaded"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const fileInput = ref(null);

const uploading = ref(false);

const message = ref("");

const isError = ref(false);

const previewError = ref(false);

/*
 * Tiến trình upload nhiều file — mảng trạng thái từng file
 * để hiện progress bar riêng: [{ name, percent, done, failed }].
 * percent = 100 nghĩa là trình duyệt đã gửi xong, đang chờ
 * server xử lý (tối ưu ảnh + đẩy lên R2).
 */
const uploadQueue = ref([]);

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
  const files = Array.from(event.target.files || []);

  // Cho phép chọn lại cùng 1 file lần nữa
  event.target.value = "";

  if (!files.length) {
    return;
  }

  if (props.multiple) {
    await uploadMany(files);

    return;
  }

  await uploadOne(files[0]);
}

/*
 * Kiểm tra loại file + dung lượng trước khi gửi lên
 * server. Trả về thông báo lỗi hoặc "" nếu hợp lệ.
 */
function validateFile(file) {
  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");

  if (props.kind === "image" && !isImage) {
    return t("upload.pickImage");
  }

  if (props.kind === "audio" && !isAudio) {
    return t("upload.pickAudio");
  }

  // Giới hạn 10MB — khớp với giới hạn trên server
  if (file.size > 10 * 1024 * 1024) {
    return t("upload.tooLarge");
  }

  return "";
}

async function uploadOne(file) {
  const invalid = validateFile(file);

  if (invalid) {
    showMessage(invalid, true);

    return;
  }

  uploading.value = true;

  try {
    const response = await uploadMedia(file);

    const result = response?.data;

    if (result && result.status === "success" && result.data?.url) {
      /*
       * Upload đè lên ảnh cũ → ảnh cũ thành mồ côi trên R2.
       * Xóa trước khi ghi URL mới (best-effort, không await).
       */
      if (props.modelValue && props.modelValue !== result.data.url) {
        deleteMediaFile(props.modelValue);
      }

      emit("update:modelValue", result.data.url);

      previewError.value = false;

      showMessage(t("upload.success"));
    } else {
      showMessage(result?.message || t("upload.failed"), true);
    }
  } catch (error) {
    console.error("[UploadField] uploadMedia error:", error);

    showMessage(
      error?.response?.data?.message || t("upload.failed"),
      true
    );
  } finally {
    uploading.value = false;
  }
}

/*
 * Tải nhiều file SONG SONG (giới hạn 3 request cùng lúc —
 * đủ nhanh mà không nghẽn băng thông / connection pool của
 * trình duyệt). Trước đây upload tuần tự từng file một:
 * 10 ảnh × 4s/ảnh = 40s; song song 3 luồng chỉ còn ~15s.
 *
 * Mỗi file có progress bar riêng (onUploadProgress của axios)
 * để người dùng thấy rõ đang gửi tới đâu, không tưởng là treo.
 */
const PARALLEL_UPLOADS = 3;

async function uploadMany(files) {
  const valid = files.filter((file) => !validateFile(file));

  if (!valid.length) {
    showMessage(t("upload.noValid"), true);

    return;
  }

  uploading.value = true;

  /* Khởi tạo trạng thái từng file cho progress bar */
  uploadQueue.value = valid.map((file) => ({
    name: file.name,
    percent: 0,
    done: false,
    failed: false,
  }));

  const urls = [];

  let failed = 0;

  let nextIndex = 0;

  async function uploadWorker() {
    while (nextIndex < valid.length) {
      const index = nextIndex;

      nextIndex += 1;

      const file = valid[index];

      const state = uploadQueue.value[index];

      try {
        const response = await uploadMedia(file, null, null, (event) => {
          if (event.total) {
            state.percent = Math.round(
              (event.loaded / event.total) * 100
            );
          }
        });

        const result = response?.data;

        if (result && result.status === "success" && result.data?.url) {
          urls.push(result.data.url);

          state.done = true;
        } else {
          failed += 1;

          state.failed = true;
        }
      } catch (error) {
        console.error("[UploadField] uploadMedia error:", error);

        failed += 1;

        state.failed = true;
      }
    }
  }

  /* Chạy N worker song song, mỗi worker tự lấy file kế tiếp */
  const workers = [];

  for (let i = 0; i < Math.min(PARALLEL_UPLOADS, valid.length); i += 1) {
    workers.push(uploadWorker());
  }

  await Promise.all(workers);

  uploading.value = false;

  /* Giữ progress bar 1.2s cho người dùng thấy kết quả rồi ẩn */
  window.setTimeout(() => {
    uploadQueue.value = [];
  }, 1200);

  if (urls.length) {
    emit("uploaded", urls);

    showMessage(
      failed
        ? t("upload.partial", { ok: urls.length, failed })
        : t("upload.done", { n: urls.length }),
      failed > 0
    );
  } else {
    showMessage(t("upload.failed"), true);
  }
}

function clearValue() {
  /*
   * Xóa file gốc trên R2 trước khi bỏ URL khỏi dữ liệu — sau khi
   * emit thì giá trị cũ không còn chỗ nào giữ. Best-effort, không
   * await: giao diện phải phản hồi tức thì.
   */
  deleteMediaFile(props.modelValue);

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

/* ==================================================
   PROGRESS QUEUE — tiến trình từng file khi upload nhiều
================================================== */

.upload-queue {
  display: flex;

  flex-direction: column;

  gap: 6px;

  margin: 0;

  padding: 0;

  list-style: none;
}

.upload-queue-item {
  display: grid;

  grid-template-columns: 16px 1fr auto 64px;

  align-items: center;

  gap: 8px;

  padding: 6px 8px;

  border: 1px solid var(--border, rgba(43, 33, 24, 0.1));

  border-radius: 8px;

  background: rgba(246, 241, 234, 0.6);

  font-size: 11px;
}

.queue-icon {
  color: var(--wine, #a63a2e);
}

.upload-queue-item.done .queue-icon {
  color: #2e7d32;
}

.upload-queue-item.failed .queue-icon {
  color: #c62828;
}

.queue-name {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: var(--studio-ink-soft, #5c4f43);
}

.queue-percent {
  color: var(--studio-ink-faint, #8a7a68);

  font-variant-numeric: tabular-nums;
}

.upload-queue-item.done .queue-percent {
  color: #2e7d32;
}

.upload-queue-item.failed .queue-percent {
  color: #c62828;
}

.queue-bar {
  position: relative;

  display: block;

  width: 64px;

  height: 4px;

  border-radius: 999px;

  background: rgba(43, 33, 24, 0.1);

  overflow: hidden;
}

.queue-bar-fill {
  position: absolute;

  inset: 0 auto 0 0;

  display: block;

  border-radius: 999px;

  background: linear-gradient(90deg, var(--wine, #a63a2e), #d98a4a);

  transition: width 0.2s ease;
}

.upload-queue-item.done .queue-bar-fill {
  width: 100% !important;

  background: #2e7d32;
}

.upload-queue-item.failed .queue-bar-fill {
  width: 100% !important;

  background: #c62828;
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
