/*
 * Asset dùng riêng cho theme TraditionalRed.
 *
 * Bộ hoa văn long phụng (rồng – phượng – mây – chữ hỷ)
 * lấy từ mẫu thiệp Long Phụng V2 Đỏ.
 */

import bgFrame from "@/assets/longphung/bg-frame.jpg";
import chuHy from "@/assets/longphung/chu-hy.webp";
import cloud from "@/assets/longphung/cloud.webp";
import envelope from "@/assets/longphung/envelope.webp";
import phuong from "@/assets/longphung/phuong.webp";
import rong from "@/assets/longphung/rong.webp";
import rongPhuong from "@/assets/longphung/rong-phuong.webp";

/*
 * Ảnh phong bì hộp quà mừng.
 *
 * Mẫu gốc dùng /images/envelope/dragon_phoenix_v2.webp — hiện chưa có
 * trong repo nên tạm dùng chung envelope.webp của bộ long phụng.
 * Khi có file mới, chỉ cần đổi import này.
 */
const envelopeDragonPhoenix = envelope;

export {
  bgFrame,
  chuHy,
  cloud,
  envelope,
  envelopeDragonPhoenix,
  phuong,
  rong,
  rongPhuong,
};
