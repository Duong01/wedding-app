import { deleteMedia } from "@/model/api";

import { useWeddingEditorStore } from "@/stores/weddingEditor";

/*
 * Xóa file media trên R2 ngay khi người dùng bỏ ảnh/nhạc khỏi thiệp.
 *
 * Vì sao cần: nếu chỉ xóa URL khỏi dữ liệu thì file gốc vẫn nằm
 * trên bucket R2 vĩnh viễn — dung lượng chỉ tăng, không bao giờ
 * giảm. Gọi API này ngay lúc xóa để giải phóng tức thì.
 *
 * Đây là việc PHỤ, chạy best-effort:
 *   - Không await ở nơi gọi — thao tác trên giao diện phải tức thì.
 *   - Lỗi mạng / 401 / chưa đăng nhập đều bị nuốt, chỉ log.
 *   - Nếu lần gọi này thất bại thì lần LƯU kế tiếp vẫn dọn được
 *     file mồ côi (backend: CleanupOrphanMediaAfterSave).
 *
 * Chỉ gửi URL thuộc bucket R2 — URL ngoài (Google, data URI, ảnh
 * local cũ) bỏ qua ngay tại client để khỏi tốn 1 request vô ích.
 */

/*
 * Tiền tố URL công khai của R2. Không hard-code vì mỗi môi trường
 * một bucket — nhận diện qua đuôi ".r2.dev" hoặc "/Uploads/" trong
 * đường dẫn, đủ để loại ảnh ngoài.
 */
function looksLikeOurUpload(url) {
  if (typeof url !== "string" || !url.trim()) {
    return false;
  }

  const value = url.trim();

  if (value.startsWith("data:") || value.startsWith("blob:")) {
    return false;
  }

  // Ảnh local cũ (đường dẫn tương đối) — server không quản lý
  if (!/^https?:\/\//i.test(value)) {
    return false;
  }

  return value.includes("/Uploads/") || value.includes(".r2.dev/");
}

/**
 * Gửi yêu cầu xóa file trên R2. Không bao giờ ném exception.
 *
 * @param {string} url URL công khai của file cần xóa
 */
export function deleteMediaFile(url) {
  if (!looksLikeOurUpload(url)) {
    return;
  }

  let slug = "";

  try {
    slug = useWeddingEditorStore().wedding?.slug || "";
  } catch (error) {
    // Store chưa khởi tạo (gọi ngoài ngữ cảnh editor) — bỏ qua
    return;
  }

  if (!slug) {
    /*
     * Thiệp chưa có slug (chưa lưu lần đầu) → chưa có file nào
     * trên R2 thuộc thiệp này. Bỏ qua.
     */
    return;
  }

  deleteMedia(slug, url).catch((error) => {
    console.warn(
      "[useMediaCleanup] Không xóa được file trên R2 (sẽ dọn ở lần lưu sau):",
      error?.response?.status || error?.message
    );
  });
}

/**
 * Xóa nhiều file một lượt (dùng khi xóa cả thư viện ảnh).
 *
 * @param {Array<string>} urls
 */
export function deleteMediaFiles(urls) {
  if (!Array.isArray(urls)) {
    return;
  }

  urls.forEach((url) => deleteMediaFile(url));
}

export function useMediaCleanup() {
  return { deleteMediaFile, deleteMediaFiles };
}
