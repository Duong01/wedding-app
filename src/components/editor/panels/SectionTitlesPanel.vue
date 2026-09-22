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

    <div
      v-for="section in SECTION_TITLES"
      :key="section.key"
      class="section-title-group"
    >
      <div class="section-title-head">
        <v-icon size="17">
          {{ section.icon }}
        </v-icon>

        <strong>{{ section.label }}</strong>
      </div>

      <div
        v-for="field in section.fields"
        :key="field.name"
        class="editor-field"
      >
        <label>{{ field.label }}</label>

        <input
          v-model="sections()[section.key][field.name]"
          type="text"
          :placeholder="field.default || 'Mặc định của mẫu'"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { SECTION_TITLES, ensureSections } from "@/data/sectionTitles";

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
</script>

<style scoped>
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

  font-size: 14px;
}
</style>
