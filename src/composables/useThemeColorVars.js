import { computed, toValue } from "vue";

import { THEME_PALETTES } from "@/data/themePalettes";

import { THEME_COLOR_MAP } from "@/data/themeColorMap";

import { hexToRgb, shiftColor } from "@/utils/colorShift";

/*
 * =========================================================
 * MÀU EDITOR CHO 15 MẪU HARDCODE MÀU
 * =========================================================
 * CSS của các mẫu này dùng var(--tc-<hex>, #<hex>) — xem
 * data/themeColorMap.js. Composable trả về style gắn lên gốc
 * theme: CHỈ gán biến cho vai trò mà chủ thiệp đã đổi khác
 * màu gốc của mẫu, nên thiệp chưa chỉnh màu hiển thị y như
 * thiết kế.
 *
 * Mỗi sắc độ thuộc vai trò được dịch theo cùng độ lệch OKLCH
 * giữa màu gốc và màu người dùng chọn (utils/colorShift.js).
 *
 * wedding: getter / ref — preview editor thay CẢ object mỗi
 * lần sửa, truyền getter để luôn đọc bản mới nhất.
 */

const ROLES = [
  "Primary",
  "Secondary",
  "Accent",
  "AccentLight",
  "Background",
  "BackgroundSecondary",
  "Text",
  "TextSecondary",
  "White",
];

const LEGACY_PALETTE = THEME_PALETTES["traditional-red"];

const norm = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const readColor = (colors, role) =>
  norm(colors?.[role] ?? colors?.[role.charAt(0).toLowerCase() + role.slice(1)]);

/*
 * Dữ liệu cũ: code trước đây gán bảng traditional-red cho
 * MỌI mẫu. Bảng màu trùng gần hết bảng đó trên một mẫu khác
 * → coi như chưa chỉnh (không nhuộm đỏ thiệp đang đẹp).
 */
function isLegacyDefault(themeName, colors) {
  if (themeName === "traditional-red") {
    return false;
  }

  const same = ROLES.filter(
    (role) => readColor(colors, role) === norm(LEGACY_PALETTE[role])
  ).length;

  return same >= 7;
}

export function buildThemeColorVars(themeName, colors) {
  const map = THEME_COLOR_MAP[themeName];

  const palette = THEME_PALETTES[themeName];

  if (!map || !palette || !colors || isLegacyDefault(themeName, colors)) {
    return {};
  }

  /*
   * Màu người dùng cho từng vai trò (chỉ khi khác màu gốc).
   * Vai trò trùng màu gốc nhau (LongPhungV3: Primary =
   * Background) dùng chung: đổi ô nào cũng ăn.
   */
  const changed = {};

  for (const role of ROLES) {
    const value = readColor(colors, role);

    if (hexToRgb(value) && value !== norm(palette[role])) {
      changed[role] = value;
    }
  }

  if (!Object.keys(changed).length) {
    return {};
  }

  const style = {};

  for (const [role, hexes] of Object.entries(map)) {
    const base = norm(palette[role]);

    const target =
      changed[role] ||
      ROLES.filter((other) => norm(palette[other]) === base)
        .map((other) => changed[other])
        .find(Boolean);

    if (!target) {
      continue;
    }

    for (const hex of hexes) {
      const shifted = shiftColor(`#${hex}`, base, target);

      style[`--tc-${hex}`] = shifted;
      style[`--tc-${hex}-rgb`] = hexToRgb(shifted).join(", ");
    }
  }

  return style;
}

export function useThemeColorVars(wedding) {
  const colorVars = computed(() => {
    const data = toValue(wedding);

    const theme = data?.theme || {};

    return buildThemeColorVars(
      theme.Name || theme.name || "",
      theme.Colors || theme.colors
    );
  });

  return { colorVars };
}
