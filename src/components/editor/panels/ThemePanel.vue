<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> DESIGN SYSTEM </span>

        <h1>Giao diện</h1>

        <p>Tùy chỉnh màu sắc, font và bố cục.</p>
      </div>
    </div>

    <!-- =====================================================
         XEM TRƯỚC NHANH
    ====================================================== -->

    <div class="theme-preview" :style="previewStyle">
      <span class="theme-preview-eyebrow"> THIỆP MỜI CƯỚI </span>

      <strong class="theme-preview-names">
        {{ wedding.brideName || "Cô dâu" }}
        &amp;
        {{ wedding.groomName || "Chú rể" }}
      </strong>

      <span class="theme-preview-date">
        {{ weddingDateLabel || "Ngày cưới" }}
      </span>

      <div class="theme-preview-swatches">
        <i
          v-for="color in previewSwatches"
          :key="color"
          :style="{ background: color }"
        />
      </div>
    </div>

    <!-- =====================================================
         BẢNG MÀU CÓ SẴN
    ====================================================== -->

    <h3 class="sub-heading">Bảng màu có sẵn</h3>

    <p class="sub-hint">
      Chọn nhanh một bảng màu của bộ sưu tập, sau đó tinh chỉnh từng
      màu bên dưới nếu muốn.
    </p>

    <div class="preset-grid">
      <button
        v-for="preset in PRESETS"
        :key="preset.name"
        type="button"
        class="preset-card"
        :class="{ active: isPresetActive(preset) }"
        :title="preset.name"
        @click="applyPreset(preset)"
      >
        <span class="preset-swatches">
          <i
            v-for="color in preset.swatches"
            :key="color"
            :style="{ background: color }"
          />
        </span>

        <span class="preset-name">
          {{ preset.name }}
        </span>
      </button>
    </div>

    <!-- =====================================================
         MÀU SẮC
    ====================================================== -->

    <h3 class="sub-heading">Màu sắc</h3>

    <div class="color-grid">
      <div
        v-for="field in COLOR_FIELDS"
        :key="field.key"
        class="color-field"
      >
        <label>{{ field.label }}</label>

        <div class="color-control">
          <input
            v-model="wedding.theme.Colors[field.key]"
            type="color"
          />

          <input
            v-model="wedding.theme.Colors[field.key]"
            type="text"
          />
        </div>

        <small class="field-help">{{ field.hint }}</small>
      </div>
    </div>

    <!-- =====================================================
         FONT
    ====================================================== -->

    <h3 class="sub-heading">Font</h3>

    <div class="form-grid">
      <div class="editor-field">
        <label>Font nội dung</label>

        <input
          v-model="wedding.theme.Fonts.Main"
          type="text"
          list="font-options"
        />

        <small class="field-help" :style="{ fontFamily: fontPreview('Main') }">
          Nội dung thân bài thiệp
        </small>
      </div>

      <div class="editor-field">
        <label>Font tiêu đề</label>

        <input
          v-model="wedding.theme.Fonts.Heading"
          type="text"
          list="font-options"
        />

        <small
          class="field-help"
          :style="{ fontFamily: fontPreview('Heading') }"
        >
          Tiêu đề, tên, ngày tháng
        </small>
      </div>

      <div class="editor-field">
        <label>Font chữ nghệ thuật</label>

        <input
          v-model="wedding.theme.Fonts.Script"
          type="text"
          list="font-options"
        />

        <small class="field-help" :style="{ fontFamily: fontPreview('Script') }">
          Chữ ký, dấu &amp;, từ trang trí
        </small>
      </div>
    </div>

    <datalist id="font-options">
      <option v-for="font in FONT_OPTIONS" :key="font" :value="font" />
    </datalist>

    <!-- =====================================================
         LAYOUT
    ====================================================== -->

    <h3 class="sub-heading">Layout</h3>

    <div class="form-grid">
      <div class="editor-field">
        <label>Max width</label>

        <input v-model="wedding.theme.Layout.MaxWidth" type="text" />

        <small class="field-help">
          Bề rộng tối đa của nội dung thiệp.
        </small>
      </div>

      <div class="editor-field">
        <label>Section padding</label>

        <input
          v-model="wedding.theme.Layout.SectionPadding"
          type="text"
        />

        <small class="field-help">
          Khoảng cách dọc giữa các mục.
        </small>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { THEME_META } from "@/data/templateCollections";

import { parseWeddingDate } from "@/utils/datetime";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/* =====================================================
   MÀU SẮC
===================================================== */

const COLOR_FIELDS = [
  { key: "Primary", label: "Primary", hint: "Màu chính của thiệp" },
  { key: "Secondary", label: "Secondary", hint: "Màu phụ, đậm nhạt" },
  { key: "Accent", label: "Accent", hint: "Kim tuyến, đường viền" },
  { key: "AccentLight", label: "Accent Light", hint: "Nền nhấn nhạt" },
  { key: "Background", label: "Background", hint: "Nền chính" },
  {
    key: "BackgroundSecondary",
    label: "Background Secondary",
    hint: "Nền các khối phụ",
  },
  { key: "Text", label: "Text", hint: "Màu chữ chính" },
  { key: "TextSecondary", label: "Text Secondary", hint: "Màu chữ phụ" },
  { key: "White", label: "White", hint: "Nền thẻ, khối nổi" },
];

/*
 * Bảng màu lấy từ THEME_META của bộ sưu tập — người dùng
 * chọn 1 nút là có ngay bộ màu hài hoà, không phải tự
 * phối 9 màu bằng tay.
 */
const PRESETS = Object.entries(THEME_META)
  .map(([slug, meta]) => ({
    slug,
    name: meta.name,
    swatches: [
      meta.palette.bg,
      meta.palette.ink,
      meta.palette.accent,
      meta.palette.seal,
    ],
    palette: meta.palette,
  }))
  .filter((preset) => preset.palette);

function isPresetActive(preset) {
  const colors = props.wedding.theme?.Colors || {};

  return (
    colors.Background === preset.palette.bg &&
    colors.Text === preset.palette.ink &&
    colors.Accent === preset.palette.accent
  );
}

function applyPreset(preset) {
  const colors = props.wedding.theme.Colors;

  const palette = preset.palette;

  colors.Background = palette.bg;
  colors.BackgroundSecondary = palette.bg;
  colors.Text = palette.ink;
  colors.TextSecondary = palette.soft;
  colors.Accent = palette.accent;
  colors.AccentLight = palette.accent;
  colors.Primary = palette.seal;
  colors.Secondary = palette.seal;
  colors.White = palette.bg;
}

/* =====================================================
   FONT
===================================================== */

/*
 * Các font đã nạp sẵn trong index.html — chỉ gợi ý
 * những font chắc chắn hiển thị được.
 */
const FONT_OPTIONS = [
  "Cormorant Garamond",
  "Playfair Display",
  "EB Garamond",
  "Lora",
  "Libre Baskerville",
  "Be Vietnam Pro",
  "Plus Jakarta Sans",
  "Allura",
  "Great Vibes",
  "Pinyon Script",
  "Alex Brush",
  "Aguafina Script",
  "Ms Madi",
  "The Nautigal",
  "Whisper",
  "Babylonica",
  "Carattere",
  "Viaoda Libre",
  "Uchen",
  "Oswald",
];

function fontPreview(key) {
  const name = props.wedding.theme?.Fonts?.[key];

  return name ? `"${name}", Georgia, serif` : "inherit";
}

/* =====================================================
   XEM TRƯỚC
===================================================== */

const previewStyle = computed(() => {
  const colors = props.wedding.theme?.Colors || {};

  const fonts = props.wedding.theme?.Fonts || {};

  return {
    background: colors.Background || "#f8f5ed",
    color: colors.Text || "#5c4d46",
    borderColor: colors.Accent || "#c79d5c",
    fontFamily: fonts.Main ? `"${fonts.Main}", Georgia, serif` : "inherit",
  };
});

const previewSwatches = computed(() => {
  const colors = props.wedding.theme?.Colors || {};

  return [
    colors.Primary,
    colors.Secondary,
    colors.Accent,
    colors.AccentLight,
    colors.BackgroundSecondary,
  ].filter(Boolean);
});

const weddingDateLabel = computed(() => {
  const date = parseWeddingDate(props.wedding.weddingDate);

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
.theme-preview {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 5px;

  margin-bottom: 26px;

  padding: 26px 20px;

  border: 1px solid;
  border-radius: 16px;

  text-align: center;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}

.theme-preview-eyebrow {
  font-size: 9px;

  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 0.7;
}

.theme-preview-names {
  font-family: var(--font-heading), Georgia, serif;
  font-size: 24px;
  font-weight: 600;
}

.theme-preview-date {
  font-size: 11.5px;

  opacity: 0.75;
}

.theme-preview-swatches {
  display: flex;

  gap: 5px;

  margin-top: 10px;
}

.theme-preview-swatches i {
  width: 20px;

  height: 20px;

  border-radius: 6px;

  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.sub-hint {
  margin: -8px 0 14px;

  color: #a8988a;

  font-size: 11px;

  line-height: 1.5;
}

.preset-grid {
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));

  gap: 9px;

  margin-bottom: 8px;
}

.preset-card {
  display: flex;

  flex-direction: column;

  gap: 8px;

  padding: 10px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 12px;

  background: #fffdfb;

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.preset-card:hover {
  transform: translateY(-2px);

  border-color: var(--border-strong, #e0d4c5);

  box-shadow: 0 8px 20px rgba(120, 80, 50, 0.08);
}

.preset-card.active {
  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 2px rgba(166, 58, 46, 0.14);
}

.preset-swatches {
  display: flex;

  gap: 3px;
}

.preset-swatches i {
  flex: 1;

  height: 22px;

  border-radius: 6px;

  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.07);
}

.preset-name {
  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

  color: #6b5a4e;

  font-size: 10.5px;
  font-weight: 650;
}
</style>
