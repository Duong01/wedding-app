<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> WEDDING INFORMATION </span>

        <h1>Thông tin chung</h1>

        <p>Thông tin cơ bản của thiệp cưới.</p>
      </div>
    </div>

    <!-- =====================================================
         TIẾN ĐỘ HOÀN THIỆN
    ====================================================== -->

    <div class="progress-card">
      <div class="progress-head">
        <strong> Mức độ hoàn thiện </strong>

        <span> {{ completedCount }} / {{ checklist.length }} mục </span>
      </div>

      <div class="progress-bar">
        <i :style="{ width: `${progressPercent}%` }" />
      </div>

      <ul class="progress-list">
        <li
          v-for="item in checklist"
          :key="item.label"
          :class="{ done: item.done }"
        >
          <v-icon size="14">
            {{ item.done ? "mdi-check-circle" : "mdi-circle-outline" }}
          </v-icon>

          <span>{{ item.label }}</span>
        </li>
      </ul>
    </div>

    <div class="form-grid">
      <div class="editor-field">
        <label>Tên chú rể</label>

        <input
          v-model="wedding.groomName"
          type="text"
          placeholder="Trần Hiếu"
        />
      </div>

      <div class="editor-field">
        <label>Tên cô dâu</label>

        <input
          v-model="wedding.brideName"
          type="text"
          placeholder="Hà Uyên"
        />
      </div>

      <div class="editor-field full">
        <label>Slug</label>

        <div class="slug-row">
          <input
            v-model="wedding.slug"
            type="text"
            placeholder="ha-uyen-tran-hieu"
          />

          <button
            type="button"
            class="slug-button"
            title="Tạo slug từ tên cô dâu chú rể"
            @click="generateSlug"
          >
            <v-icon size="16"> mdi-auto-fix </v-icon>

            Tạo từ tên
          </button>
        </div>

        <small class="field-help">
          Đường dẫn của thiệp trên website.
          <template v-if="wedding.slug">
            Khách mở thiệp tại
            <code>/{{ wedding.slug }}</code>
          </template>
        </small>
      </div>

      <div class="editor-field">
        <label>Ngôn ngữ</label>

        <select v-model="wedding.language">
          <option value="vi">Tiếng Việt</option>

          <option value="en">English</option>
        </select>
      </div>

      <div class="editor-field">
        <label>Ngày cưới</label>

        <input
          :value="datetimeLocalValue"
          type="datetime-local"
          @input="onDateInput"
        />

        <small v-if="weddingDateLabel" class="field-help">
          {{ weddingDateLabel }}
        </small>
      </div>

      <div class="editor-field full">
        <label>Ngày âm lịch</label>

        <input
          v-model="wedding.weddingLunar"
          type="text"
          placeholder="VD: 12 tháng 5 năm Bính Ngọ"
        />

        <small class="field-help">
          Hiển thị bên cạnh ngày dương ở các mẫu có hỗ trợ.
        </small>
      </div>

      <div class="editor-field full">
        <label>Ảnh bìa</label>

        <UploadField
          v-model="wedding.coverImage"
          kind="image"
          button-text="Tải ảnh bìa lên"
        />
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
 * Input datetime-local không nhận phần giây còn hệ
 * thống lưu "2026-11-14T08:00:00" (ISO) — chuyển đổi
 * 2 chiều qua utils/datetime.
 */
const datetimeLocalValue = computed(() => {
  return toDatetimeLocal(props.wedding.weddingDate);
});

function onDateInput(event) {
  props.wedding.weddingDate = fromDatetimeLocal(event.target.value);
}

/*
 * Hiển thị lại ngày cưới bằng chữ để người dùng kiểm
 * tra nhanh mình chọn đúng ngày chưa.
 */
const weddingDateLabel = computed(() => {
  const date = parseWeddingDate(props.wedding.weddingDate);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
});

/* =====================================================
   SLUG
===================================================== */

/*
 * Bỏ dấu tiếng Việt + ký tự đặc biệt để ra slug hợp lệ
 * trên URL. "Hà Uyên & Trần Hiếu" → "ha-uyen-tran-hieu".
 */
function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateSlug() {
  const bride = slugify(props.wedding.brideName);

  const groom = slugify(props.wedding.groomName);

  const parts = [bride, groom].filter(Boolean);

  if (!parts.length) {
    return;
  }

  props.wedding.slug = parts.join("-");
}

/* =====================================================
   CHECKLIST HOÀN THIỆN
===================================================== */

const checklist = computed(() => {
  const wedding = props.wedding;

  return [
    {
      label: "Tên cô dâu & chú rể",
      done: !!(wedding.groomName && wedding.brideName),
    },
    {
      label: "Ngày cưới",
      done: !!wedding.weddingDate,
    },
    {
      label: "Ảnh bìa",
      done: !!wedding.coverImage,
    },
    {
      label: "Sự kiện cưới",
      done: Array.isArray(wedding.events) && wedding.events.length > 0,
    },
    {
      label: "Album ảnh",
      done: Array.isArray(wedding.gallery) && wedding.gallery.length > 0,
    },
    {
      label: "Chuyện tình yêu",
      done: !!wedding.story?.Description,
    },
  ];
});

const completedCount = computed(
  () => checklist.value.filter((item) => item.done).length
);

const progressPercent = computed(() =>
  Math.round((completedCount.value / checklist.value.length) * 100)
);
</script>

<style scoped>
.progress-card {
  margin-bottom: 24px;

  padding: 16px 18px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 15px;

  background: #fffdfb;
}

.progress-head {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 10px;
}

.progress-head strong {
  color: #3a2c26;

  font-size: 12.5px;
}

.progress-head span {
  color: #a8988a;

  font-size: 11px;
}

.progress-bar {
  height: 6px;

  overflow: hidden;

  border-radius: 999px;

  background: #f0e8dd;
}

.progress-bar i {
  display: block;

  height: 100%;

  border-radius: 999px;

  background: linear-gradient(90deg, var(--gold, #b9975b), var(--wine, #a63a2e));

  transition: width 0.35s ease;
}

.progress-list {
  display: flex;

  flex-wrap: wrap;

  gap: 6px 16px;

  margin: 13px 0 0;
  padding: 0;

  list-style: none;
}

.progress-list li {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #a8988a;

  font-size: 11px;
}

.progress-list li.done {
  color: #3a7d44;
}

.slug-row {
  display: flex;

  gap: 7px;

  align-items: stretch;
}

.slug-row input {
  flex: 1;

  min-width: 0;
}

.slug-button {
  flex: 0 0 auto;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 0 13px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 10px;

  background: #fffdfb;

  color: #6b5a4e;

  font-family: inherit;
  font-size: 11.5px;
  font-weight: 650;

  white-space: nowrap;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.slug-button:hover {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}

.field-help code {
  padding: 1px 5px;

  border-radius: 5px;

  background: #f4eee6;

  color: var(--wine, #a63a2e);

  font-size: 10px;
}

@media (max-width: 520px) {
  .slug-row {
    flex-direction: column;
  }

  .slug-button {
    height: 40px;

    justify-content: center;
  }
}
</style>
