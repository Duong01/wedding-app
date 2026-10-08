<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> SECTION TITLES </span>

        <h1>{{ $t('editor.menu.sections') }}</h1>

        <p>
          {{ $t('sections.desc') }}
        </p>
      </div>

      <PanelProgressBadge
        :done="progress?.done || 0"
        :total="progress?.total || 0"
      />
    </div>

    <!-- =====================================================
         TÌM NHANH
    ====================================================== -->

    <div class="section-search">
      <v-icon size="17"> mdi-magnify </v-icon>

      <input
        v-model="keyword"
        type="text"
        :placeholder="$t('sections.search')"
      />

      <button
        v-if="keyword"
        type="button"
        class="search-clear"
        :title="$t('editor.nav.clearSearch')"
        @click="keyword = ''"
      >
        <v-icon size="15"> mdi-close </v-icon>
      </button>
    </div>

    <p v-if="keyword && !filteredSections.length" class="search-empty">
      {{ $t("editor.nav.noMatch", { keyword }) }} </p> <!-- ===================================================== DANH SÁCH MỤC ====================================================== --> <div v-for="section in filteredSections" :key="section.key" class="section-title-group" > <div class="section-title-head"> <v-icon size="17"> {{ section.icon }} </v-icon> <strong>{{ section.label }}</strong> <span v-if="overrideCount(section)" class="section-badge"> {{ $t("sections.changedCount", { n: overrideCount(section) }) }} </span> <button v-if="overrideCount(section)" type="button" class="section-reset" :title="$t('sections.restoreOne')" @click="resetSection(section)" > <v-icon size="15"> mdi-restore </v-icon> </button> </div> <div v-for="field in section.fields" :key="field.name" class="editor-field" > <label>{{ field.label }}</label> <div class="field-row"> <!--
                Ô luôn hiện sẵn chữ mặc định (tính cả tiêu đề
                từ panel khác — story/video/game). Người dùng
                gõ thì ghi đè vào wedding.sections; xoá hết
                chữ thì tự rơi về mặc định.
              --> <input :value="fieldValue(section, field)" type="text" @input="setFieldValue(section, field, $event.target.value)" /> <button v-if="fieldValue(section, field)" type="button" class="field-clear" :title="$t('sections.clearToDefault')" @click="setFieldValue(section, field, '')" > <v-icon size="15"> mdi-close </v-icon> </button> </div> </div> </div> </section> </template> <script setup> import { useI18n } from "vue-i18n"; import { computed, ref } from "vue"; import { SECTION_TITLES, ensureSections, sectionDefault, sectionOverride, } from "@/data/sectionTitles"; import { confirmDialog } from "@/composables/useConfirm"; import PanelProgressBadge from "@/components/editor/PanelProgressBadge.vue"; const { t } = useI18n(); const props = defineProps({ wedding: { type: Object, required: true }, /* { done, total } từ Editor.vue — badge hoàn thiện mục. */ progress: { type: Object, default: null }, }); /* * wedding.sections có thể chưa tồn tại (dữ liệu cũ) nên * phải tạo sẵn object rỗng trước khi v-model ghi vào. * ensureSections sửa trực tiếp trên wedding nên gọi lại * nhiều lần vẫn an toàn. */ function sections() { return ensureSections(props.wedding); } /* ===================================================== GIÁ TRỊ Ô NHẬP ===================================================== */ /* * Ô hiển thị: giá trị người dùng đã nhập, nếu chưa nhập * thì hiện sẵn chữ mặc định (người dùng thấy ngay chữ sẽ * hiển thị trên thiệp và sửa trực tiếp từ đó). */ function fieldValue(section, field) { const override = sectionOverride(sections(), section.key, field.name); if (override) { return override; } return sectionDefault(props.wedding, section.key, field.name); } /* * Ghi giá trị người dùng gõ vào wedding.sections. * Gõ đúng nguyên văn chữ mặc định vẫn tính là "đã đổi" — * đơn giản, và người dùng muốn về mặc định chỉ cần xoá * chữ (nút ✕ hoặc select-all + Delete). */ function setFieldValue(section, field, value) { sections()[section.key][field.name] = value; } /* ===================================================== TÌM KIẾM ===================================================== */ const keyword = ref("");

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
    title: t("sections.restoreTitle", { name: section.label }),
    get message() { return t("sections.restoreMessage"); },
    get confirmText() { return t("editor.draft.restore"); },
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
