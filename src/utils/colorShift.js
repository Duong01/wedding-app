/*
 * =========================================================
 * DỊCH MÀU THEO BẢNG MÀU NGƯỜI DÙNG (OKLCH)
 * =========================================================
 * Các mẫu thiệp hardcode nhiều sắc độ quanh 1 màu chủ đạo
 * (vd. BotanicalLeaf: #3d5a47 tiêu đề, #4a6653 dòng nhỏ,
 * #b5d0ba viền...). Khi chủ thiệp đổi màu chủ đạo trong
 * editor, mọi sắc độ thuộc vai trò đó được dịch theo CÙNG
 * độ lệch (độ sáng / độ đậm / tông) trong không gian OKLCH
 * — giữ nguyên quan hệ đậm nhạt của thiết kế gốc.
 *
 * Không phụ thuộc alias "@/..." để script chuyển đổi chạy
 * thẳng bằng Node dùng lại được.
 */

export function hexToRgb(hex) {
  let h = String(hex || "").trim().replace(/^#/, "");

  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (!/^[0-9a-f]{6}$/i.test(h)) {
    return null;
  }

  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function rgbToHex(rgb) {
  return (
    "#" +
    rgb
      .map((c) =>
        Math.round(Math.min(255, Math.max(0, c)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

const toLinear = (c) => {
  const s = c / 255;

  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (c) => {
  const s = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

  return s * 255;
};

export function rgbToOklch([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map(toLinear);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const C = Math.sqrt(A * A + B * B);

  let H = (Math.atan2(B, A) * 180) / Math.PI;

  if (H < 0) {
    H += 360;
  }

  return [L, C, H];
}

export function oklchToRgb([L, C, H]) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(fromLinear);
}

/*
 * Khoảng cách 2 màu trong OKLab (≈ chênh lệch cảm nhận).
 */
export function oklabDistance(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);

  if (!a || !b) {
    return Infinity;
  }

  const [L1, C1, H1] = rgbToOklch(a);
  const [L2, C2, H2] = rgbToOklch(b);

  const a1 = C1 * Math.cos((H1 * Math.PI) / 180);
  const b1 = C1 * Math.sin((H1 * Math.PI) / 180);
  const a2 = C2 * Math.cos((H2 * Math.PI) / 180);
  const b2 = C2 * Math.sin((H2 * Math.PI) / 180);

  return Math.sqrt((L1 - L2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

/*
 * Dịch `design` (1 sắc độ trong thiết kế) theo độ lệch từ
 * `from` (màu gốc của vai trò) sang `to` (màu người dùng).
 *
 *   L' = L + (L_to − L_from)
 *   C' = C × (C_to / C_from)   (màu gốc gần xám: cộng thẳng)
 *   H' = H + (H_to − H_from)   (màu gốc gần xám: lấy H_to)
 */
export function shiftColor(design, from, to) {
  const d = hexToRgb(design);
  const f = hexToRgb(from);
  const t = hexToRgb(to);

  if (!d || !f || !t) {
    return design;
  }

  if (from.toLowerCase() === to.toLowerCase()) {
    return design;
  }

  const [Ld, Cd, Hd] = rgbToOklch(d);
  const [Lf, Cf, Hf] = rgbToOklch(f);
  const [Lt, Ct, Ht] = rgbToOklch(t);

  const L = Math.min(1, Math.max(0, Ld + (Lt - Lf)));

  const grayFrom = Cf < 0.02;

  const C = grayFrom ? Cd + Ct : Cd * Math.min(4, Ct / Cf);

  const H = grayFrom || Cd < 0.02 ? Ht : Hd + (Ht - Hf);

  return rgbToHex(oklchToRgb([L, Math.max(0, C), (H + 360) % 360]));
}
