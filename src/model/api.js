import https from "./https";

// api GetWedding
export const GetWedding = (slug, token) => {
  return https.Get( `/wedding/${encodeURIComponent(slug)}/${encodeURIComponent(token)}`,);
};
export const Confirm = (param, success, error) => {return https.Post(`/wedding/confirm`, param, success, error);};
export const AddDataWedding = (param, success, error) => {return https.Post(`/wedding/AddDataWedding`, param, success, error);};

export const addRecipient = (param, success, error) => {
  const { slug, Token, Name } = param || {};

  return https.Post(
    `/wedding/addRecipient?slug=${encodeURIComponent(slug || "")}`,
    { Token, Name },
    success,
    error
  );
};
export const getRecipients = (param, success, error) => {return https.Get(`/wedding/getRecipients`, param, success, error);};
export const updateRecipient = (param, success, error) => {
  const { slug, Token, Name } = param || {};

  return https.Put(
    `/wedding/updateRecipient?slug=${encodeURIComponent(slug || "")}`,
    { Token, Name },
    success,
    error
  );
};
export const deleteRecipient = (param, success, error) => {return https.Delete(`/wedding/deleteRecipient`, param, success, error);};

export const addWish = (param, success, error) => {
  const { slug, guestName, message } = param || {};

  // Model GuestMessage bên API có Name / Message
  return https.Post(
    `/wedding/addWish?slug=${encodeURIComponent(slug || "")}`,
    { Name: guestName, Message: message },
    success,
    error
  );
};
export const getAllWishes = (param, success, error) => {return https.Get(`/wedding/getAllWishes`, param, success, error);};
export const deleteWish = (param, success, error) => {return https.Delete(`/wedding/deleteWish`, param, success, error);};

export const uploadMedia = (file, success, error) => {
  const form = new FormData();

  form.append("file", file);

  return https.PostFile(`/wedding/uploadMedia`, form, success, error);
};

/* ======================
   TÀI KHOẢN / ĐĂNG NHẬP
====================== */

export const Login = (param, success, error) => {return https.Post(`/AccountApi/Login`, param, success, error);};
export const RegisterAccount = (param, success, error) => {return https.Post(`/AccountApi/Register`, param, success, error);};
export const CheckSession = (success, error) => {return https.Get(`/AccountApi/CheckSession`, {}, success, error);};
export const LogOut = (success, error) => {return https.Post(`/AccountApi/LogOut`, {}, success, error);};
export const UpdateProfile = (param, success, error) => {return https.Post(`/AccountApi/UpdateProfile`, param, success, error);};
export const ForgotPassword = (param, success, error) => {return https.Post(`/AccountApi/ForgotPassword`, param, success, error);};

/* ======================
   QUẢN TRỊ - PHÂN QUYỀN
   (Admin)
====================== */

export const GetAllAccounts = (success, error) => {return https.Get(`/AccountApi/GetAllAccounts`, {}, success, error);};
export const UpdateAccountRole = (param, success, error) => {return https.Post(`/AccountApi/UpdateRole`, param, success, error);};
export const DeleteAccount = (param, success, error) => {return https.Post(`/AccountApi/DeleteAccount`, param, success, error);};

/* ======================
   QUẢN LÝ THIỆP (ADMIN)
   - getAllWeddings: danh sách tất cả thiệp (chỉ Admin)
   - getWeddingStatus: trạng thái 1 thiệp theo slug
     (công khai — dùng để chặn thiệp chưa kích hoạt
     khi khách mở link, không cần đăng nhập)
   - updateWeddingStatus: đổi trạng thái
     Active / Locked / Pending (chỉ Admin)
====================== */

export const getAllWeddings = (success, error) => {return https.Get(`/wedding/getAllWeddings`, {}, success, error);};
export const getWeddingStatus = (param, success, error) => {return https.GetPublic(`/wedding/getWeddingStatus`, param, success, error);};
export const updateWeddingStatus = (param, success, error) => {return https.Post(`/wedding/updateWeddingStatus`, param, success, error);};

/* ======================
   THANH TOÁN KÍCH HOẠT THIỆP
   (chuyển khoản ngân hàng)
====================== */

/*
 * Thông tin tài khoản ngân hàng nhận thanh toán
 * (số TK, ngân hàng, chủ TK, số tiền, nội dung CK...)
 * — frontend đọc để hiển thị + tạo mã QR VietQR.
 */
export const getPaymentInfo = (success, error) => {return https.GetPublic(`/wedding/getPaymentInfo`, {}, success, error);};

/*
 * Người dùng báo đã chuyển khoản cho thiệp của mình.
 * Body: { Slug, Amount, Content, TransferAt } — server lưu
 * lại để Admin đối soát và kích hoạt thiệp.
 */
export const submitPaymentNotice = (param, success, error) => {return https.Post(`/wedding/submitPaymentNotice`, param, success, error);};

/*
 * Trạng thái thanh toán của 1 thiệp
 * (đã báo chuyển khoản chưa / đã được duyệt chưa).
 */
export const getPaymentStatus = (param, success, error) => {return https.GetPublic(`/wedding/getPaymentStatus`, param, success, error);};

/*
 * Admin: danh sách các yêu cầu thanh toán chờ duyệt.
 */
export const getPaymentRequests = (success, error) => {return https.Get(`/wedding/getPaymentRequests`, {}, success, error);};

/*
 * Admin: xác nhận / từ chối 1 yêu cầu thanh toán.
 * Body: { Id, Approve } — Approve = true → kích hoạt thiệp.
 */
export const reviewPaymentRequest = (param, success, error) => {return https.Post(`/wedding/reviewPaymentRequest`, param, success, error);};

/*
 * Admin: cập nhật thông tin tài khoản nhận thanh toán
 * (số TK, ngân hàng, chủ TK, giá gói...).
 * Body: PaymentInfo model.
 */
export const updatePaymentInfo = (param, success, error) => {return https.Post(`/wedding/updatePaymentInfo`, param, success, error);};

/* ======================
   THIỆP CỦA TÔI (người dùng)
====================== */

/*
 * Danh sách thiệp của tài khoản đang đăng nhập
 * (kèm trạng thái kích hoạt) — dùng cho trang
 * "Quản lý thiệp" (/manage).
 */
export const getMyWeddings = (success, error) => {return https.Get(`/wedding/getMyWeddings`, {}, success, error);};
