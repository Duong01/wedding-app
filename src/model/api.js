import https from "./https";

// api GetWedding
export const GetWedding = (slug, token) => {
  return https.Get( `/wedding/${encodeURIComponent(slug)}/${encodeURIComponent(token)}`,);
};
export const Confirm = (param, success, error) => {return https.Post(`/wedding/confirm`, param, success, error);};
export const AddDataWedding = (param, success, error) => {return https.Post(`/wedding/AddDataWedding`, param, success, error);};
export const addRecipient = (param, success, error) => {return https.Post(`/wedding/addRecipient`, param, success, error);};
export const getRecipients = (param, success, error) => {return https.Get(`/wedding/getRecipients`, param, success, error);};
export const updateRecipient = (param, success, error) => {return https.Put(`/wedding/updateRecipient`, param, success, error);};
export const deleteRecipient = (param, success, error) => {return https.Delete(`/wedding/deleteRecipient`, param, success, error);};
export const addWish = (param, success, error) => {return https.Post(`/wedding/addWish`, param, success, error);};
export const getAllWishes = (param, success, error) => {return https.Get(`/wedding/getAllWishes`, param, success, error);};
export const deleteWish = (param, success, error) => {return https.Delete(`/wedding/deleteWish`, param, success, error);};

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

