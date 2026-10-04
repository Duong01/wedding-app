/*
 * =========================================================
 * TIỆN ÍCH TƯƠNG PHẢN MÀU (WCAG 2.x)
 * =========================================================
 * Dùng cho các mục dùng chung (video / game) — tự chọn màu
 * chữ, nút, viền đủ tương phản trên nền thật của từng thiệp
 * thay vì tin bảng màu (chủ thiệp chỉnh Colors trong editor
 * có thể tạo cặp màu chìm vào nhau).
 *
 * Chỉ nhận hex (#rgb / #rrggbb) — giá trị khác (rgba, tên
 * màu...) trả về null để caller rơi về màu dự phòng.
 */

export function parseHex(value) {
  if (typeof value !== "string") {
    return null;
  }

  let hex = value.trim().replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return null;
  }

  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

export function toHex(rgb) {
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

export function isHex(value) {
  return parseHex(value) !== null;
}

export function luminance(color) {
  const rgb = parseHex(color);

  if (!rgb) {
    return 0;
  }

  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;

    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/*
 * background có thể là 1 màu hoặc mảng màu (nền gradient —
 * lấy tỉ lệ THẤP NHẤT để chữ đọc được ở mọi điểm của nền).
 */
export function contrast(color, background) {
  const list = Array.isArray(background) ? background : [background];

  const la = luminance(color);

  return Math.min(
    ...list.map((bg) => {
      const lb = luminance(bg);

      return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    })
  );
}

/*
 * Nền tối = chữ trắng đọc rõ hơn chữ đen trên nền đó.
 */
export function isDark(background) {
  const color = Array.isArray(background) ? background[0] : background;

  return contrast(color, "#ffffff") > contrast(color, "#000000");
}

/*
 * Trộn màu a với b theo tỉ lệ amount (0 = a, 1 = b).
 */
export function mix(a, b, amount) {
  const ra = parseHex(a);
  const rb = parseHex(b);

  if (!ra || !rb) {
    return a;
  }

  return toHex(ra.map((c, i) => c + (rb[i] - c) * amount));
}

/*
 * Kéo màu dần về đen (nền sáng) hoặc trắng (nền tối) tới khi
 * đạt tỉ lệ tương phản yêu cầu — giữ sắc độ của màu gốc thay
 * vì nhảy thẳng sang đen/trắng.
 */
export function ensureContrast(color, background, ratio = 4.5) {
  if (!isHex(color)) {
    return isDark(background) ? "#ffffff" : "#1a1a1a";
  }

  if (contrast(color, background) >= ratio) {
    return color;
  }

  const target = isDark(background) ? "#ffffff" : "#000000";

  for (let step = 1; step <= 20; step += 1) {
    const candidate = mix(color, target, step / 20);

    if (contrast(candidate, background) >= ratio) {
      return candidate;
    }
  }

  return target;
}

/*
 * Màu đầu tiên trong danh sách đạt tương phản; không màu
 * nào đạt thì chỉnh màu đầu tiên hợp lệ cho đủ.
 */
export function pickReadable(candidates, background, ratio = 4.5) {
  const valid = candidates.filter(isHex);

  const found = valid.find((c) => contrast(c, background) >= ratio);

  if (found) {
    return found;
  }

  return ensureContrast(valid[0], background, ratio);
}

/*
 * Đọc nền THẬT phía sau 1 phần tử (đi ngược lên cha) — cho
 * các theme nền không khai báo trong bảng màu.
 *
 * Trả về hex của nền đặc đầu tiên; gặp gradient / ảnh nền
 * mà không có màu đặc (không đo được chính xác) thì trả về
 * null để caller dùng bảng khai báo tay.
 */
export function measureSurface(element) {
  if (typeof window === "undefined" || !element) {
    return null;
  }

  for (let node = element.parentElement; node; node = node.parentElement) {
    const style = window.getComputedStyle(node);

    const parts = (style.backgroundColor.match(/[\d.]+/g) || []).map(Number);

    const alpha = parts.length >= 4 ? parts[3] : parts.length === 3 ? 1 : 0;

    const hasImage = style.backgroundImage && style.backgroundImage !== "none";

    if (alpha >= 0.95) {
      /* Ảnh thật (url) phủ lên màu nền — màu không phản ánh nền nhìn thấy */
      if (hasImage && /url\(/i.test(style.backgroundImage)) {
        return null;
      }

      return toHex(parts.slice(0, 3));
    }

    if (hasImage || alpha > 0.05) {
      return null;
    }
  }

  return null;
}
