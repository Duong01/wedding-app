<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> SECTION TITLES </span>

        <h1>Tiêu đề mục</h1>

        <p>
          Đổi tên các mục hiển thị trên thiệp. Bỏ trống để dùng
          tiêu đề mặc định của mẫu.
        </p>
      </div>
    </div>

    <!-- =====================================================
         TÌM NHANH
    ====================================================== -->

    <div class="section-search">
      <v-icon size="17"> mdi-magnify </v-icon>

      <input
        v-model="keyword"
        type="text"
        placeholder="Tìm mục cần đổi tên..."
      />

      <button
        v-if="keyword"
        type="button"
        class="search-clear"
        title="Xoá tìm kiếm"
        @click="keyword = ''"
      >
        <v-icon size="15"> mdi-close </v-icon>
      </button>
    </div>

    <p v-if="keyword && !filteredSections.length" class="search-empty">
      Không tìm thấy mục nào khớp "{{ keyword }}".
    </p>

    <!-- =====================================================
         DANH SÁCH MỤC
    ====================================================== -->

    <div
      v-for="section in filteredSections"
      :key="section.key"
      class="section-title-group"
    >
      <div class="section-title-head">
        <v-icon size="17">
          {{ section.icon }}
        </v-icon>

        <strong>{{ section.label }}</strong>

        <span v-if="overrideCount(section)" class="section-badge">
          {{ overrideCount(section) }} đã đổi
        </span>

        <button
          v-if="overrideCount(section)"
          type="button"
          class="section-reset"
          title="Khôi phục mặc định của mục này"
          @click="resetSection(section)"
        >
          <v-icon size="15"> mdi-restore </v-icon>
        </button>
      </div>

      <div
        v-for="field in section.fields"
        :key="field.name"
        class="editor-field"
      >
        <label>{{ field.label }}</label>

        <div class="field-row">
          <input
            v-model="sections()[section.key][field.name]"
            type="text"
            :placeholder="field.default || 'Mặc định của mẫu'"
          />

          <button
            v-if="sections()[section.key][field.name]"
            type="button"
            class="field-clear"
            title="Xoá để dùng lại mặc định"
            @click="sections()[section.key][field.name] = ''"
          >
            <v-icon size="15"> mdi-close </v-icon>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { SECTION_TITLES, ensureSections } from "@/data/sectionTitles";

import { confirmDialog } from "@/composables/useConfirm";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * wedding.sections có thể chưa tồn tại (dữ liệu cũ) nên
 * phải tạo sẵn object rỗng trước khi v-model ghi vào.
 * ensureSections sửa trực tiếp trên wedding nên gọi lại
 * nhiều lần vẫn an toàn.
 */
function sections() {
  return ensureSections(props.wedding);
}

/* =====================================================
   TÌM KIẾM
===================================================== */

const keyword = ref("");

/*
 * Tìm theo tên mục hoặc tên trường — người dùng thường
 * nhớ "album ảnh" chứ không nhớ key kỹ thuật.
 */
const filteredSections = computed(() => {
  const query = keyword.value.trim().toLowerCase();

  if (!query) {
    return SECTION_TITLES;
  }

  return SECTION_TITLES.filter((section) => {
    if (section.label.toLowerCase().includes(query)) {
      return true;
    }

    return section.fields.some((field) =>
      field.label.toLowerCase().includes(query)
    );
  });
});

/* =====================================================
   ĐẾM / KHÔI PHỤC
===================================================== */

function overrideCount(section) {
  const data = sections()[section.key] || {};

  return section.fields.filter((field) => {
    const value = data[field.name];

    return typeof value === "string" && value.trim();
  }).length;
}

async function resetSection(section) {
  const ok = await confirmDialog({
    title: `Khôi phục "${section.label}"?`,
    message:
      "Các ô đã đổi trong mục này sẽ trở về tiêu đề mặc định của mẫu.",
    confirmText: "Khôi phục",
  });

  if (!ok) {
    return;
  }

  section.fields.forEach((field) => {
    sections()[section.key][field.name] = "";
  });
}
</script>

<style scoped>
.section-search {
  display: flex;

  align-items: center;

  gap: 9px;

  margin-bottom: 20px;

  padding: 0 13px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 11px;

  background: #fffdfb;

  color: #a8988a;
}

.section-search:focus-within {
  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.09);
}

.section-search input {
  flex: 1;

  min-width: 0;

  border: 0;

  outline: none;

  background: transparent;

  color: #2b2118;

  padding: 11px 0;

  font-family: inherit;
  font-size: 13px;
}

.search-clear {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 24px;

  height: 24px;

  border: 0;

  border-radius: 7px;

  background: #f4eee6;

  color: #6b5a4e;

  cursor: pointer;
}

.search-empty {
  margin: 0 0 18px;

  color: #a8988a;

  font-size: 12px;
}

.section-title-group {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.section-title-group:last-child {
  border-bottom: none;
}

.section-title-head {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 12px;

  color: var(--wine, #a63a2e);

  font-size: 14px;
}

.section-title-head strong {
  color: #3a2c26;
}

.section-badge {
  padding: 2px 8px;

  border-radius: 999px;

  background: rgba(166, 58, 46, 0.09);

  color: var(--wine, #a63a2e);

  font-size: 9.5px;
  font-weight: 700;
}

.section-reset {
  margin-left: auto;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 28px;

  height: 28px;

  border: 0;

  border-radius: 8px;

  background: #f4eee6;

  color: #6b5a4e;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.section-reset:hover {
  background: #ece4d9;

  color: var(--wine, #a63a2e);
}

.field-row {
  display: flex;

  gap: 7px;

  align-items: stretch;
}

.field-row input {
  flex: 1;

  min-width: 0;
}

.field-clear {
  width: 40px;

  flex: 0 0 40px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 10px;

  background: #fffdfb;

  color: #a8988a;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.field-clear:hover {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}
</style>
