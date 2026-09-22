/*
 * Truy cập tiêu đề mục theo dạng rút gọn cho các mẫu thiệp.
 *
 * Dữ liệu gốc nằm ở wedding.sections dạng object lồng nhau:
 *
 *   sections[key][field] = "giá trị người dùng nhập"
 *
 * với field là Eyebrow / Heading / Intro / Kicker / Invite /
 * Button / Hint (xem SECTION_TITLES ở @/data/sectionTitles).
 *
 * Hai hàm dưới đây trả về giá trị người dùng nhập, hoặc mặc
 * định của mẫu khi ô đó còn trống.
 */

import { SECTION_TITLES } from "@/data/sectionTitles";

function defaultField(key, field) {
  const section = SECTION_TITLES.find((item) => item.key === key);

  return section?.fields.find((item) => item.name === field)?.default || "";
}

/*
 * Giá trị người dùng nhập cho 1 ô, "" nếu chưa nhập.
 */
function override(sections, key, field) {
  const value = sections?.[key]?.[field];

  return typeof value === "string" ? value.trim() : "";
}

/*
 * Tiêu đề chính của mục. `fallback` dùng khi người dùng
 * chưa đặt tiêu đề riêng (ví dụ story.Title).
 */
export function sectionTitle(sections, key, fallback = "") {
  return override(sections, key, "Heading") || fallback || defaultField(key, "Heading");
}

/*
 * Dòng phụ phía trên tiêu đề. Trả về chuỗi rỗng nếu người
 * dùng đã xoá — component tự ẩn khi rỗng.
 */
export function sectionSubtitle(sections, key, fallback = "") {
  return override(sections, key, "Eyebrow") || fallback || defaultField(key, "Eyebrow");
}

/*
 * Một ô bất kỳ (Intro, Kicker, Invite, Button, Hint...).
 */
export function sectionField(sections, key, field, fallback = "") {
  return override(sections, key, field) || fallback || defaultField(key, field);
}
