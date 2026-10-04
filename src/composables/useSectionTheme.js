import { computed, nextTick, onMounted, ref, toValue, watch } from "vue";

import { DEFAULT_PALETTE, THEME_PALETTES } from "@/data/themePalettes";

import {
  contrast,
  ensureContrast,
  isDark,
  isHex,
  measureSurface,
  mix,
  pickReadable,
} from "@/utils/colorContrast";

/*
 * =========================================================
 * MÀU CHO CÁC MỤC DÙNG CHUNG (GAME / VIDEO)
 * =========================================================
 * GameSection / VideoSection là 1 component dùng chung cho
 * cả 26 theme, style qua biến CSS.
 *
 * Chỉ 11 theme có pipeline màu (useWeddingTheme gắn biến
 * lên wrapper). 15 theme còn lại hardcode màu trong CSS —
 * biến không tồn tại nên game rơi về bảng :root của
 * theme.css (đỏ son truyền thống).
 *
 * Composable này cho section TỰ gắn bảng màu của thiệp lên
 * gốc section mình (scoped — không đụng wrapper theme):
 *
 *   THEME_PALETTES[theme.Name] làm nền, đè lên bằng
 *   theme.Colors chủ thiệp chỉnh trong editor (bỏ qua ô
 *   trống và URL ảnh).
 *
 * TƯƠNG PHẢN: bảng màu không nói section thật sự nằm trên
 * nền gì (TraditionalRed bảng màu nền kem nhưng thân thiệp
 * đỏ #680e0e; h2 toàn cục lấy --primary trùng màu nền tối
 * → tiêu đề tàng hình). SURFACES khai báo nền THẬT phía sau
 * section; từ đó sinh các token --sec-* / --card-* / --btn-*
 * / --solid-* đã kiểm tra tỉ lệ WCAG.
 *
 * Nền ưu tiên ĐO THẬT trên trang (rootRef — đi ngược lên
 * cha tìm nền đặc); theme nền gradient / ảnh không đo được
 * thì rơi về SURFACES khai báo tay. Ngưỡng:
 *
 *   chữ thường ≥ 4.5:1 · chữ trên card ≥ 7:1
 *   viền / nút so với nền ≥ 3:1 (thành phần giao diện)
 */

/*
 * Nền thật phía sau section:
 *   - chuỗi hex / mảng hex: theme hardcode nền trong CSS
 *     (mảng = gradient, kiểm tra với mọi điểm dừng).
 *   - "Background" / "White": theme có pipeline màu, nền là
 *     ô màu tương ứng của bảng màu (chủ thiệp đổi được).
 */
const SURFACES = {
  "traditional-red": "#680e0e",
  /* Thân thiệp nền giấy sáng (--dong-ivory → --dong-paper), chỉ viền ngoài tối */
  "dong-son": ["#f3ead8", "#eee3cd"],
  "long-phung-v3": ["#7a0014", "#5a000e"],
  "midnight-gold": ["#1d1622", "#120e15"],
  "double-happiness": ["#7a1216", "#5c0e10"],
  "ivory-gold": ["#fffdf8", "#f5ede1"],

  "botanical-leaf": ["#f9fbf9", "#f2f7f3"],
  "champagne-blush": ["#fffaf7", "#f6f0eb"],
  "chateau-blue": ["#fafbfd", "#f0f3f9"],
  "jade-phoenix": ["#fdfaf3", "#f5e8cf"],
  "lavender-cream": ["#faf8fc", "#f3edf6"],
  "modern-noir": ["#fbf8f0", "#f0e3c8"],
  "ruby-romance": ["#fdf7f8", "#f7dde2"],
  "serene-green": ["#f5f8f4", "#eff5ed"],
  "sunset-peach": ["#fffaf5", "#fdf0e7"],
  "watercolor-blush": ["#fdf8fa", "#fdf1f4"],

  "elegant-gold": "White",
  "modern-white": "White",
  "royal-red": "White",
};

const DARK_INK = "#2b211d";

const LIGHT_INK = "#fffaf2";

const isImageUrl = (value) =>
  typeof value === "string" && /^(https?:|data:|url\()/i.test(value.trim());

const read = (p, key) => p[key] || p[key.charAt(0).toLowerCase() + key.slice(1)];

function resolveSurface(themeName, palette, measured) {
  if (isHex(measured)) {
    return [measured];
  }

  const spec = SURFACES[themeName] || "Background";

  if (Array.isArray(spec) || isHex(spec)) {
    return Array.isArray(spec) ? spec : [spec];
  }

  const value = read(palette, spec);

  return isHex(value) ? [value] : ["#f8f5ed"];
}

/*
 * Tính toàn bộ token màu từ bảng màu + nền thật.
 * Export riêng để kiểm tra nhanh mọi theme ngoài Vue.
 */
export function buildSectionTokens(themeName, palette, measured = null) {
  const p = palette || DEFAULT_PALETTE;

  const primary = read(p, "Primary") || "#7b0d0d";
  const secondary = read(p, "Secondary") || "#9d2525";
  const accent = read(p, "Accent") || "#c79d5c";
  const accentLight = read(p, "AccentLight") || "#f7d8a3";
  const text = read(p, "Text") || "#5c4d46";
  const textSecondary = read(p, "TextSecondary") || "#806f66";
  const white = read(p, "White") || "#fffaf4";

  const surface = resolveSurface(themeName, p, measured);

  const dark = isDark(surface);

  /*
   * ---------- CHỮ TRÊN NỀN SECTION ----------
   * Nền sáng: ưu tiên màu thương hiệu đậm (Primary).
   * Nền tối: ưu tiên màu vàng/kem sáng (AccentLight, Accent).
   */
  const secHeading = dark
    ? pickReadable([accentLight, accent, text, white], surface, 4.5)
    : pickReadable([primary, secondary, text], surface, 4.5);

  const secEyebrow = dark
    ? pickReadable([accent, accentLight, textSecondary, text], surface, 4.5)
    : pickReadable([secondary, accent, textSecondary, primary], surface, 4.5);

  const secText = dark
    ? pickReadable([text, white, accentLight], surface, 4.5)
    : pickReadable([text, primary], surface, 4.5);

  const secMuted = dark
    ? pickReadable([textSecondary, text, accentLight], surface, 4.5)
    : pickReadable([textSecondary, text], surface, 4.5);

  /*
   * Viền trang trí trên nền section (≥ 3:1 so với nền).
   */
  const secLine = ensureContrast(accent, surface, 3);

  /*
   * ---------- CARD (nền sáng mọi theme) ----------
   * Card luôn giấy sáng (White) — trên thiệp nền tối nó là
   * "tờ thiệp" kem; chữ trong card là mực tối ≥ 7:1.
   */
  const cardBg = isHex(white) && !isDark(white) ? white : "#fffaf4";

  const cardInk = pickReadable([text, primary, secondary, DARK_INK], cardBg, 7);

  const cardHeading = pickReadable([primary, secondary, cardInk], cardBg, 4.5);

  const cardMuted = pickReadable([textSecondary, text, cardInk], cardBg, 4.5);

  const cardLine = ensureContrast(accent, cardBg, 3);

  /*
   * ---------- MÀU KHỐI ĐẬM (chữ sáng trên đó) ----------
   * Ô vòng quay, nhãn A/B/C quiz, nút trong card: màu
   * thương hiệu đậm, chữ kem ≥ 4.5:1 và khối ≥ 3:1 so với
   * card sáng.
   */
  const solidBase = [primary, secondary, text].find(
    (c) => isHex(c) && isDark(c)
  ) || primary;

  let solid = ensureContrast(solidBase, LIGHT_INK, 4.5);

  solid = ensureContrast(solid, cardBg, 4.5);

  const solidInk = contrast(LIGHT_INK, solid) >= 4.5 ? LIGHT_INK : "#ffffff";

  /*
   * ---------- NÚT TRÊN NỀN SECTION ----------
   * Nền sáng: khối đậm (solid) — tách khỏi nền ≥ 3:1.
   * Nền tối: nút vàng/kem sáng với chữ tối — khối đỏ đậm
   * trên nền đỏ đậm sẽ chìm.
   */
  let btnBg;
  let btnInk;

  if (dark) {
    btnBg = pickReadable([accent, accentLight, secHeading], surface, 3);

    btnInk = pickReadable([cardInk, DARK_INK, "#000000"], btnBg, 4.5);
  } else {
    btnBg = ensureContrast(solid, surface, 3);

    btnInk = contrast(LIGHT_INK, btnBg) >= 4.5 ? LIGHT_INK : "#ffffff";
  }

  /*
   * Ô sáng vòng quay — AccentLight nhạt về phía card để mực
   * tối đọc rõ, và khác hẳn ô đậm.
   */
  let wheelLight = isHex(accentLight) && !isDark(accentLight)
    ? accentLight
    : mix(accent, "#ffffff", 0.7);

  if (contrast(cardInk, wheelLight) < 4.5) {
    wheelLight = mix(wheelLight, "#ffffff", 0.5);
  }

  /*
   * Lớp cào: ánh kim theo Accent của thiệp thay cho bạc xám.
   */
  /*
   * Accent đậm (NhatBinhDo: đỏ) thì lấy AccentLight — lớp cào
   * phải sáng để chữ "CÀO ĐỂ NHẬN QUÀ" màu mực đọc được.
   */
  const scratchBase =
    [accent, accentLight].find((c) => isHex(c) && !isDark(c)) ||
    mix(accent, "#ffffff", 0.6);

  const scratchStops = [
    mix(scratchBase, "#ffffff", 0.25),
    mix(scratchBase, "#ffffff", 0.55),
    mix(scratchBase, "#000000", 0.08),
  ];

  const scratchInk = pickReadable([cardInk, DARK_INK], scratchStops, 4.5);

  return {
    dark,

    vars: {
      /* Biến gốc — giữ cho code cũ / theme đọc */
      "--primary": primary,
      "--secondary": secondary,
      "--accent": accent,
      "--accent-light": accentLight,
      "--background": surface[0],
      "--background-secondary":
        read(p, "BackgroundSecondary") || "#eee8dc",
      "--text": secText,
      "--text-secondary": secMuted,
      "--white": cardBg,
      "--heading": secHeading,

      /* Nền section */
      "--sec-heading": secHeading,
      "--sec-eyebrow": secEyebrow,
      "--sec-text": secText,
      "--sec-muted": secMuted,
      "--sec-line": secLine,

      /* Card sáng */
      "--card-bg": cardBg,
      "--card-ink": cardInk,
      "--card-heading": cardHeading,
      "--card-muted": cardMuted,
      "--card-line": cardLine,

      /* Khối đậm + nút */
      "--solid": solid,
      "--solid-ink": solidInk,
      "--btn-bg": btnBg,
      "--btn-ink": btnInk,

      /* Vòng quay / thẻ cào */
      "--wheel-light": wheelLight,
      "--scratch-a": scratchStops[0],
      "--scratch-b": scratchStops[1],
      "--scratch-c": scratchStops[2],
      "--scratch-ink": scratchInk,
    },
  };
}

/*
 * rootRef (tuỳ chọn): phần tử gốc của section — dùng để đo
 * nền thật phía sau nó sau khi mount / đổi theme.
 */
export function useSectionTheme(wedding, rootRef = null) {
  const themeName = computed(() => {
    const data = toValue(wedding);

    return data?.theme?.Name || data?.theme?.name || "";
  });

  const palette = computed(() => {
    const data = toValue(wedding);

    const base = THEME_PALETTES[themeName.value] || DEFAULT_PALETTE;

    const colors = data?.theme?.Colors || data?.theme?.colors;

    if (!colors) {
      return base;
    }

    /*
     * Bảng màu gốc của mẫu làm nền — Colors chỉ đè lên những
     * ô thực sự hợp lệ (có giá trị, không phải URL ảnh).
     */
    const merged = { ...base };

    for (const [key, value] of Object.entries(colors)) {
      if (typeof value === "string" && value.trim() && !isImageUrl(value)) {
        merged[key.charAt(0).toUpperCase() + key.slice(1)] = value;
      }
    }

    return merged;
  });

  const measured = ref(null);

  async function remeasure() {
    await nextTick();

    measured.value = measureSurface(toValue(rootRef));
  }

  if (rootRef) {
    onMounted(remeasure);

    /*
     * Đổi mẫu / đổi màu trong editor: theme mới render xong
     * mới đo lại (đo ngay sẽ ra nền của theme cũ).
     */
    watch([themeName, palette], () => {
      measured.value = null;

      setTimeout(remeasure, 50);
    });

    /* Section ẩn → hiện (v-if) thì phần tử mới mount sau */
    watch(() => toValue(rootRef), (el) => el && remeasure());
  }

  const tokens = computed(() =>
    buildSectionTokens(themeName.value, palette.value, measured.value)
  );

  const cardInk = computed(() => tokens.value.vars["--card-ink"]);

  const sectionStyle = computed(() => tokens.value.vars);

  return {
    themeName,
    palette,
    cardInk,
    sectionStyle,
  };
}
