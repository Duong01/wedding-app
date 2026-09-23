<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> DRESS CODE </span>

        <h1>Trang phục</h1>

        <p>
          Gợi ý trang phục cho khách mời. Chỉ hiển thị với các mẫu
          có mục Dress Code.
        </p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> Hiển thị mục Dress Code </strong>

        <small> Khách mời thấy gợi ý trang phục trên thiệp. </small>
      </div>

      <v-switch
        v-model="wedding.settings.ShowDressCode"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>Ghi chú ngắn</label>

      <input
        v-model="wedding.dressCode.Note"
        type="text"
        placeholder="VD: Trang phục dự tiệc"
      />

      <small class="field-help">
        Dòng mô tả ngắn hiển thị dưới tiêu đề mục.
      </small>
    </div>

    <!-- =====================================================
         BẢNG MÀU GỢI Ý
    ====================================================== -->

    <h3 class="sub-heading">Bảng màu gợi ý</h3>

    <p class="field-help block-help">
      Thêm các màu khách mời nên mặc. Thứ tự hiển thị theo đúng
      thứ tự bên dưới.
    </p>

    <div class="swatch-list">
      <div
        v-for="(color, index) in wedding.dressCode.Colors"
        :key="`color-${index}`"
        class="swatch-item"
      >
        <input
          v-model="wedding.dressCode.Colors[index]"
          type="color"
          class="swatch-picker"
        />

        <input
          v-model="wedding.dressCode.Colors[index]"
          type="text"
          class="swatch-text"
          placeholder="#000000"
        />

        <button
          type="button"
          class="danger-icon"
          title="Xoá màu"
          @click="removeColor(index)"
        >
          <v-icon size="17"> mdi-delete-outline </v-icon>
        </button>
      </div>

      <div v-if="!wedding.dressCode.Colors.length" class="empty-card small">
        <v-icon size="26"> mdi-palette-outline </v-icon>

        <strong> Chưa có màu gợi ý </strong>

        <span> Thêm màu để khách mời dễ chọn trang phục. </span>
      </div>
    </div>

    <button type="button" class="add-button" @click="addColor">
      <v-icon> mdi-palette-plus </v-icon>

      Thêm màu
    </button>

    <!-- =====================================================
         GỢI Ý CHI TIẾT
    ====================================================== -->

    <h3 class="sub-heading">Gợi ý chi tiết</h3>

    <p class="field-help block-help">
      Mỗi dòng là một gợi ý riêng biệt hiển thị trên thiệp.
    </p>

    <div class="items-list">
      <article
        v-for="(item, index) in wedding.dressCode.Suggestions"
        :key="`sug-${index}`"
        class="editor-card compact-card"
      >
        <div class="card-header">
          <div>
            <span> GỢI Ý {{ index + 1 }} </span>

            <strong>
              {{ item || "Chưa nhập nội dung" }}
            </strong>
          </div>

          <div class="card-header-actions">
            <button
              type="button"
              class="small-icon-button"
              title="Chuyển lên"
              :disabled="index === 0"
              @click="moveSuggestion(index, -1)"
            >
              <v-icon size="17"> mdi-arrow-up </v-icon>
            </button>

            <button
              type="button"
              class="small-icon-button"
              title="Chuyển xuống"
              :disabled="index === wedding.dressCode.Suggestions.length - 1"
              @click="moveSuggestion(index, 1)"
            >
              <v-icon size="17"> mdi-arrow-down </v-icon>
            </button>

            <button
              type="button"
              class="danger-icon"
              title="Xoá gợi ý"
              @click="removeSuggestion(index)"
            >
              <v-icon size="18"> mdi-delete-outline </v-icon>
            </button>
          </div>
        </div>

        <div class="editor-field">
          <textarea
            v-model="wedding.dressCode.Suggestions[index]"
            rows="2"
            placeholder="VD: Ưu tiên trang phục thanh lịch, tối màu"
          />
        </div>
      </article>

      <div
        v-if="!wedding.dressCode.Suggestions.length"
        class="empty-card"
      >
        <v-icon size="30"> mdi-tshirt-crew-outline </v-icon>

        <strong> Chưa có gợi ý </strong>

        <span> Thêm vài dòng gợi ý để khách mời biết nên mặc gì. </span>
      </div>
    </div>

    <button type="button" class="add-button" @click="addSuggestion">
      <v-icon> mdi-plus </v-icon>

      Thêm gợi ý
    </button>
  </section>
</template>

<script setup>
import { confirmDialog } from "@/composables/useConfirm";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * dressCode có thể chưa tồn tại (dữ liệu cũ) — tạo sẵn
 * cấu trúc để v-model ghi được, giống cách
 * SectionTitlesPanel dùng ensureSections.
 */
function ensureDressCode() {
  const wedding = props.wedding;

  if (!wedding.dressCode || typeof wedding.dressCode !== "object") {
    wedding.dressCode = {};
  }

  if (!Array.isArray(wedding.dressCode.Colors)) {
    wedding.dressCode.Colors = [];
  }

  if (!Array.isArray(wedding.dressCode.Suggestions)) {
    wedding.dressCode.Suggestions = [];
  }

  if (typeof wedding.dressCode.Note !== "string") {
    wedding.dressCode.Note = "";
  }

  return wedding.dressCode;
}

ensureDressCode();

function addColor() {
  ensureDressCode().Colors.push("#c79d5c");
}

async function removeColor(index) {
  const color = props.wedding.dressCode.Colors[index];

  const ok = await confirmDialog({
    title: "Xoá màu này?",
    message: "Màu sẽ không còn hiển thị trong gợi ý trang phục.",
    detail: color,
    confirmText: "Xoá màu",
    danger: true,
  });

  if (!ok) {
    return;
  }

  props.wedding.dressCode.Colors.splice(index, 1);
}

function addSuggestion() {
  ensureDressCode().Suggestions.push("");
}

async function removeSuggestion(index) {
  const text = props.wedding.dressCode.Suggestions[index];

  const ok = await confirmDialog({
    title: "Xoá gợi ý này?",
    message: "Nội dung gợi ý sẽ bị xoá khỏi thiệp.",
    detail: text,
    confirmText: "Xoá gợi ý",
    danger: true,
  });

  if (!ok) {
    return;
  }

  props.wedding.dressCode.Suggestions.splice(index, 1);
}

function moveSuggestion(index, direction) {
  const list = props.wedding.dressCode.Suggestions;

  const target = index + direction;

  if (target < 0 || target >= list.length) {
    return;
  }

  const [item] = list.splice(index, 1);

  list.splice(target, 0, item);
}
</script>

<style scoped>
.block-help {
  margin: -6px 0 12px;
}

.swatch-list {
  display: flex;

  flex-direction: column;

  gap: 9px;

  margin-bottom: 12px;
}

.swatch-item {
  display: flex;

  align-items: center;

  gap: 9px;
}

.swatch-picker {
  width: 44px;

  height: 44px;

  flex: 0 0 44px;

  padding: 2px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 10px;

  background: #fffdfb;

  cursor: pointer;
}

.swatch-text {
  flex: 1;

  min-width: 0;

  outline: none;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 10px;

  background: #fffdfb;

  color: #2b2118;

  padding: 11px 12px;

  font-family: inherit;
  font-size: 13px;
}

.swatch-text:focus {
  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.09);
}

.empty-card.small {
  min-height: 120px;
}

.compact-card {
  padding: 15px;
}

.compact-card .card-header {
  margin-bottom: 12px;
}

.compact-card .editor-field {
  margin-bottom: 0;
}

.card-header-actions {
  display: flex;

  align-items: center;

  gap: 6px;
}

.small-icon-button {
  width: 34px;

  height: 34px;

  flex: 0 0 34px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 0;

  border-radius: 9px;

  background: #f4eee6;

  color: #6b5a4e;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.small-icon-button:hover:not(:disabled) {
  background: #ece4d9;

  transform: translateY(-1px);
}

.small-icon-button:disabled {
  opacity: 0.35;

  cursor: not-allowed;
}
</style>
