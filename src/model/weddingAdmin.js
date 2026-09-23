/*
 * Trạng thái kích hoạt của thiệp — nguồn duy nhất là server
 * (cột Status / IsActive trong bảng Weddings, quản lý qua
 * API getWeddingStatus / updateWeddingStatus).
 *
 * File này chỉ giữ hằng số trạng thái dùng chung cho
 * frontend (AdminWeddings, WeddingApi...). Không còn lưu
 * localStorage — mọi trạng thái đọc trực tiếp từ API.
 */

export const WEDDING_STATUS = {
  PENDING: "Pending",

  ACTIVE: "Active",

  LOCKED: "Locked",
};

/*
 * Trạng thái xuất bản / dùng thử — server suy ra trong SQL
 * (WeddingStatusInfo.PublishState) rồi trả về, frontend chỉ
 * đọc chứ không tự tính.
 *
 *   DRAFT   — chưa bấm Xuất bản, khách mời mở link không xem được
 *   TRIAL   — đã xuất bản, còn trong N ngày dùng thử
 *   EXPIRED — hết hạn dùng thử và chưa thanh toán, thiệp tạm ẩn
 *   ACTIVE  — đã thanh toán, thiệp hoạt động vĩnh viễn
 *   LOCKED  — Admin khóa thiệp
 */
export const PUBLISH_STATE = {
  DRAFT: "Draft",

  TRIAL: "Trial",

  EXPIRED: "Expired",

  ACTIVE: "Active",

  LOCKED: "Locked",
};
