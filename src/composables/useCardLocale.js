import { computed, toValue } from "vue";

import i18n, { LOCALE_CODES } from "@/lang";

/*
 * =========================================================
 * NGÔN NGỮ THIỆP (khách mời xem)
 * =========================================================
 * Khác với ngôn ngữ giao diện web (localStorage): chữ trên
 * thiệp theo lựa chọn của CHỦ THIỆP trong editor
 * (wedding.language — GeneralPanel "Ngôn ngữ thiệp").
 *
 * Dùng trong các component trang thiệp (src/page/**,
 * src/components/common/**, src/components/gallery/**):
 *
 *   const { ct } = useCardLocale(() => props.wedding);
 *   ct("card.rsvp.submit")  // → "GỬI XÁC NHẬN" / "SEND RSVP" / ...
 *
 * ct() gọi được trong computed / template và tự cập nhật khi
 * wedding.language đổi (đổi ngôn ngữ trong editor là preview
 * đổi theo ngay).
 *
 * Ngôn ngữ không hợp lệ / thiếu → "vi" (mọi thiệp đã xuất
 * bản giữ nguyên như trước).
 */

const DEFAULT_CARD_LOCALE = "vi";

/*
 * Tag BCP-47 cho Intl (định dạng ngày giờ) — map tường minh
 * cho chắc chắn.
 */
const INTL_TAGS = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  ko: "ko-KR",
  ja: "ja-JP",
};

export function cardLocale(wedding) {
  const code = toValue(wedding)?.language;

  return LOCALE_CODES.includes(code) ? code : DEFAULT_CARD_LOCALE;
}

export function useCardLocale(wedding) {
  const locale = computed(() => cardLocale(wedding));

  /*
   * Tra chuỗi theo ngôn ngữ THIỆP qua t(key, locale) —
   * không đổi locale toàn cục (giao diện web giữ ngôn ngữ
   * của người xem). Thiếu bản dịch → fallbackLocale "vi".
   */
  const ct = (key) => i18n.global.t(key, locale.value);

  return {
    locale,
    ct,
    intlTag: computed(() => INTL_TAGS[locale.value] || INTL_TAGS.vi),
  };
}

/*
 * Tag Intl theo ngôn ngữ thiệp — dùng cho toLocaleDateString
 * / toLocaleTimeString đang nằm trong các theme.
 */
export function cardIntlTag(wedding) {
  return INTL_TAGS[cardLocale(wedding)] || INTL_TAGS.vi;
}
