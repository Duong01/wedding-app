/*
 * Registry cục bộ cho các thiệp đã lưu lên server.
 *
 * Backend hiện chưa có endpoint "lấy danh sách tất cả thiệp"
 * nên mỗi lần lưu thiệp thành công (AddDataWedding) ta ghi lại
 * thông tin tóm tắt vào localStorage. Trang quản lý dùng
 * registry này làm danh sách, dữ liệu chi tiết vẫn load
 * từ API thật (GetWedding).
 */

const STORAGE_KEY = "wedding-saved-registry";

export function getRegistry() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("[weddingRegistry] Không đọc được registry:", e);

    return [];
  }
}

function saveRegistry(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("[weddingRegistry] Không ghi được registry:", e);
  }
}

/*
 * Ghi nhận / cập nhật 1 thiệp sau khi lưu thành công.
 */
export function addEntry(wedding) {
  if (!wedding?.slug) {
    return;
  }

  const list = getRegistry();

  const entry = {
    slug: wedding.slug,

    groomName: wedding.groomName || "",

    brideName: wedding.brideName || "",

    weddingDate: wedding.weddingDate || "",

    theme: wedding.theme?.Name || "",

    coverImage: wedding.coverImage || "",

    savedAt: new Date().toISOString(),
  };

  const index = list.findIndex((item) => item.slug === entry.slug);

  if (index >= 0) {
    list[index] = entry;
  } else {
    list.unshift(entry);
  }

  saveRegistry(list);
}

export function removeEntry(slug) {
  const list = getRegistry().filter((item) => item.slug !== slug);

  saveRegistry(list);
}

export function hasEntry(slug) {
  return getRegistry().some((item) => item.slug === slug);
}
