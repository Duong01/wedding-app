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
