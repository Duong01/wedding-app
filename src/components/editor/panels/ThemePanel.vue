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
         PHONG CÁCH THIỆP
    ====================================================== -->

    <h3 class="sub-heading">Phong cách thiệp</h3>

    <p class="sub-hint">
      Đổi sang mẫu thiệp khác — nội dung (tên, ngày cưới, sự kiện,
      album...) giữ nguyên, chỉ đổi giao diện. Màu và font sẽ về
      mặc định của mẫu mới.
    </p>

    <div class="style-grid">
      <button
        v-for="style in THEME_STYLES"
        :key="style.slug"
        type="button"
        class="style-card"
        :class="{ active: style.slug === currentThemeName }"
        :title="style.name"
        @click="applyThemeStyle(style)"
      >
        <span class="style-thumb">
          <img :src="style.preview" :alt="style.name" loading="lazy" />

          <span
            v-if="style.slug === currentThemeName"
            class="style-check"
            aria-hidden="true"
          >
            <v-icon size="14">mdi-check</v-icon>
          </span>
        </span>

        <span class="style-name">{{ style.name }}</span>
      </button>
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

        <input
          v-model="wedding.theme.Layout.MaxWidth"
          type="text"
          placeholder="VD: 900px"
        />

        <small class="field-help">
          Bề rộng tối đa của nội dung thiệp. Mặc định 900px — tăng
          lên nếu muốn thiệp rộng hơn trên máy tính.
        </small>
      </div>

      <div class="editor-field">
        <label>Section padding</label>

        <input
          v-model="wedding.theme.Layout.SectionPadding"
          type="text"
          placeholder="VD: 80px"
        />

        <small class="field-help">
          Khoảng cách dọc giữa các mục. Mặc định 80px — giảm xuống
          (VD: 50px) để thiệp gọn hơn.
        </small>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";

import { THEME_META } from "@/data/templateCollections";

import { THEME_PALETTES } from "@/stores/weddingEditor";

import { parseWeddingDate } from "@/utils/datetime";

import { PREVIEWS, THEME_PREVIEW } from "@/utils/weddingCard";

import { confirmDialog } from "@/composables/useConfirm";

/* Font chọn trong panel nạp khi mở panel — index.html không
 * còn chèn sẵn 25 font nữa (xem utils/fontLoader.js). */
import { ensureFonts } from "@/utils/fontLoader";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/* =====================================================
   PHONG CÁCH THIỆP
===================================================== */

/*
 * Font + layout mặc định của từng mẫu — trùng bản demo
 * (src/mock/wedding.json) để bấm đổi là thiệp ra đúng
 * như gallery.
 */
const THEME_DEFAULTS = {
  "traditional-red": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "900px", SectionPadding: "80px" },
  },
  "romantic-pink": {
    fonts: { Main: "Baskerville", Heading: "Times New Roman", Script: "Alex Brush" },
    layout: { MaxWidth: "900px", SectionPadding: "80px" },
  },
  "elegant-gold": {
    fonts: { Main: "Patrick Hand", Heading: "Plus Jakarta Sans", Script: "Patrick Hand" },
    layout: { MaxWidth: "900px", SectionPadding: "80px" },
  },
  "modern-white": {
    fonts: { Main: "Baskerville", Heading: "Baskerville", Script: "Pinyon Script" },
    layout: { MaxWidth: "900px", SectionPadding: "80px" },
  },
  "nhat-binh-do": {
    fonts: { Main: "Baskerville", Heading: "Times New Roman", Script: "Alex Brush" },
    layout: { MaxWidth: "900px", SectionPadding: "80px" },
  },
  "royal-red": {
    fonts: { Main: "Baskerville", Heading: "Times New Roman", Script: "Great Vibes" },
    layout: { MaxWidth: "900px", SectionPadding: "85px" },
  },
  "dong-son": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cinzel", Script: "Allura" },
    layout: { MaxWidth: "900px", SectionPadding: "80px" },
  },
  "ivory-gold": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Ballet" },
    layout: { MaxWidth: "900px", SectionPadding: "80px" },
  },
  "serene-green": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "sunset-peach": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "80px" },
  },
  "champagne-blush": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "80px" },
  },
  "midnight-gold": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "lavender-cream": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "double-happiness": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "boho-terracotta": {
    fonts: { Main: "Libre Baskerville", Heading: "Viaoda Libre", Script: "Ms Madi" },
    layout: { MaxWidth: "900px", SectionPadding: "44px" },
  },
  "song-hy-red": {
    fonts: { Main: "Baskerville", Heading: "Times New Roman", Script: "EB Garamond" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "song-hac-red": {
    fonts: { Main: "Times New Roman", Heading: "Fraunces", Script: "Carattere" },
    layout: { MaxWidth: "480px", SectionPadding: "23px" },
  },
  "to-duyen-xanh": {
    fonts: { Main: "Baskerville", Heading: "Times New Roman", Script: "Carattere" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "emerald-luxe": {
    fonts: { Main: "Be Vietnam Pro", Heading: "Viaoda Libre", Script: "Babylonica" },
    layout: { MaxWidth: "900px", SectionPadding: "48px" },
  },
  "long-phung-v3": {
    fonts: { Main: "Baskerville", Heading: "Big Caslon", Script: "EB Garamond" },
    layout: { MaxWidth: "720px", SectionPadding: "60px" },
  },
  "watercolor-blush": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "botanical-leaf": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "chateau-blue": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "jade-phoenix": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "modern-noir": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
  "ruby-romance": {
    fonts: { Main: "Cormorant Garamond", Heading: "Cormorant Garamond", Script: "Allura" },
    layout: { MaxWidth: "930px", SectionPadding: "82px" },
  },
};

/*
 * Danh sách mẫu có thể đổi — chỉ những theme đã đăng ký
 * render (THEME_PALETTES) và có ảnh xem trước. "soft-rose"
 * nằm trong THEME_META nhưng chưa có component nên loại.
 */
const THEME_STYLES = Object.entries(THEME_META)
  .filter(([slug]) => THEME_PALETTES[slug])
  .map(([slug, meta]) => ({
    slug,
    name: meta.name,
    preview: PREVIEWS[THEME_PREVIEW[slug]] || "",
  }));

const currentThemeName = computed(() => props.wedding.theme?.Name || "");

async function applyThemeStyle(style) {
  if (style.slug === currentThemeName.value) {
    return;
  }

  /*
   * Đổi mẫu là ghi đè màu + font + layout người dùng đã
   * tinh chỉnh — hỏi trước để không mất công vô ý.
   */
  const ok = await confirmDialog({
    title: `Đổi sang "${style.name}"?`,
    message:
      "Toàn bộ nội dung thiệp (tên, ngày cưới, sự kiện, album, lời chúc...) được giữ nguyên. " +
      "Màu sắc, font và bố cục sẽ về mặc định của mẫu mới — các tùy chỉnh riêng của bạn ở phần dưới sẽ bị thay thế.",
    confirmText: "Đổi mẫu",
    cancelText: "Giữ mẫu hiện tại",
  });

  if (!ok) {
    return;
  }

  const theme = props.wedding.theme;

  const palette = THEME_PALETTES[style.slug];

  const defaults = THEME_DEFAULTS[style.slug] || {};

  /*
   * Thiệp cũ lưu trước khi có Fonts/Layout có thể thiếu
   * object này — tạo lại để không crash khi ghi.
   */
  if (!theme.Colors) {
    theme.Colors = {};
  }

  if (!theme.Fonts) {
    theme.Fonts = {};
  }

  if (!theme.Layout) {
    theme.Layout = {};
  }

  theme.Name = style.slug;

  if (palette) {
    Object.assign(theme.Colors, palette);
  }

  if (defaults.fonts) {
    Object.assign(theme.Fonts, defaults.fonts);
  }

  if (defaults.layout) {
    Object.assign(theme.Layout, defaults.layout);
  }

  /* Nạp font của mẫu mới để preview iframe hiển thị đúng. */
  ensureFonts(
    defaults.fonts ? Object.values(defaults.fonts) : []
  );
}

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
 * Bảng màu có sẵn — lấy đúng bộ màu của từng mẫu thiệp
 * (THEME_PALETTES, cùng nguồn với init() của editor store)
 * để bấm preset là thiệp ra đúng màu bản demo. Swatch trên
 * nút vẫn dùng màu nhận diện của gallery (THEME_META) cho
 * đồng bộ với thẻ mẫu.
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
    palette: THEME_PALETTES[slug] || meta.palette,
  }))
  .filter((preset) => preset.palette);

function isPresetActive(preset) {
  const colors = props.wedding.theme?.Colors || {};

  return (
    colors.Background === preset.palette.Background &&
    colors.Text === preset.palette.Text &&
    colors.Accent === preset.palette.Accent
  );
}

function applyPreset(preset) {
  const colors = props.wedding.theme.Colors;

  const palette = preset.palette;

  colors.Primary = palette.Primary;
  colors.Secondary = palette.Secondary;
  colors.Accent = palette.Accent;
  colors.AccentLight = palette.AccentLight;
  colors.Background = palette.Background;
  colors.BackgroundSecondary = palette.BackgroundSecondary;
  colors.Text = palette.Text;
  colors.TextSecondary = palette.TextSecondary;
  colors.White = palette.White;
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

/*
 * Mở panel → nạp toàn bộ font trong danh sách chọn để ô
 * preview hiển thị đúng font (mỗi font chỉ nạp 1 lần).
 */
onMounted(() => {
  ensureFonts(FONT_OPTIONS);
});

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

/* =====================================================
   PHONG CÁCH THIỆP
===================================================== */

.style-grid {
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));

  gap: 9px;

  margin-bottom: 26px;
}

.style-card {
  display: flex;

  flex-direction: column;

  gap: 6px;

  padding: 6px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 12px;

  background: #fffdfb;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.style-card:hover {
  transform: translateY(-2px);

  border-color: var(--border-strong, #e0d4c5);

  box-shadow: 0 8px 20px rgba(120, 80, 50, 0.08);
}

.style-card.active {
  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 2px rgba(166, 58, 46, 0.14);
}

.style-thumb {
  position: relative;

  display: block;

  overflow: hidden;

  aspect-ratio: 3 / 4;

  border-radius: 8px;

  background: #f4ede3;
}

.style-thumb img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.style-check {
  position: absolute;
  top: 5px;
  right: 5px;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  border-radius: 50%;

  background: var(--wine, #a63a2e);

  color: #fff;
}

.style-name {
  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;

  padding: 0 2px;

  color: #6b5a4e;

  font-size: 10.5px;
  font-weight: 650;

  text-align: center;
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
