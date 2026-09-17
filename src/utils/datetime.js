/*
 * Tiện ích parse / chuyển đổi ngày giờ dùng chung.
 *
 * Hệ thống lưu ngày giờ theo định dạng ISO:
 *
 *   "2026-11-14T08:00:00"   (dấu "T" — chuẩn ISO 8601)
 *
 * Định dạng này new Date() hiểu được trên MỌI trình
 * duyệt (kể cả Safari), nên parse không cần xử lý gì
 * thêm. parseWeddingDate vẫn hỗ trợ dữ liệu cũ có dấu
 * cách ("2026-11-14 08:00:00") để tương thích ngược.
 */

/*
 * Parse mọi biến thể ngày giờ của hệ thống:
 *
 * - "2026-11-14T08:00:00"  (ISO — định dạng lưu trữ/API)
 * - "2026-11-14 08:00:00"  (dấu cách — dữ liệu cũ, vẫn hỗ trợ)
 * - "2026-11-14"           (chỉ ngày)
 * - Date object
 *
 * Trả về Date hoặc null nếu không parse được.
 */
export function parseWeddingDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  let raw = String(value).trim();

  /*
   * Dữ liệu cũ "2026-11-14 08:00:00" → "2026-11-14T08:00:00"
   * (Safari không hiểu new Date với dấu cách).
   */
  if (/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}/.test(raw)) {
    raw = raw.replace(" ", "T");
  }

  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
}

function pad2(number) {
  return String(number).padStart(2, "0");
}

/*
 * Giá trị lưu trữ ("2026-11-14T08:00:00") → giá trị cho
 * input datetime-local ("2026-11-14T08:00" — input không
 * nhận phần giây).
 */
export function toDatetimeLocal(value) {
  const date = parseWeddingDate(value);

  if (!date) {
    return "";
  }

  return (
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}` +
    `T${pad2(date.getHours())}:${pad2(date.getMinutes())}`
  );
}

/*
 * Giá trị từ input datetime-local ("2026-11-14T08:00") →
 * định dạng lưu trữ ISO "2026-11-14T08:00:00".
 */
export function fromDatetimeLocal(value) {
  const date = parseWeddingDate(value);

  if (!date) {
    return "";
  }

  return (
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}` +
    `T${pad2(date.getHours())}:${pad2(date.getMinutes())}:00`
  );
}
