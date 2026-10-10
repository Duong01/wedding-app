import { createI18n } from "vue-i18n";

/*
 * Bản dịch "chữ trên thiệp" theo từng ngôn ngữ — key là
 * chuỗi tiếng Việt gốc (dạng 1 file 1 ngôn ngữ, xem đầu
 * các file đó). Nạp vào messages cùng bảng modules/*.js.
 */
import enUS from "./en_US.js";
import zhCN from "./zh_CN.js";
import koKR from "./ko_KR.js";
import jaJP from "./ja_JP.js";

/*
 * =========================================================
 * ĐA NGÔN NGỮ — WEBSITE + TRANG CHỈNH SỬA
 * =========================================================
 * 5 ngôn ngữ: vi (gốc) · en · zh · ko · ja.
 *
 * Bản dịch chia theo khu vực ở src/lang/modules/*.js —
 * mỗi key ghi đủ 5 ngôn ngữ trên 1 dòng theo thứ tự
 * LOCALE_CODES:
 *
 *   "nav.templates": ["Mẫu thiệp cưới", "Wedding templates", "婚礼请柬模板", "청첩장 템플릿", "招待状テンプレート"],
 *
 * → dễ soát thiếu / lệch giữa các ngôn ngữ. Thiếu bản dịch
 * (chuỗi rỗng) thì rơi về tiếng Việt.
 *
 * Riêng CHỮ TRÊN THIỆP (khách mời xem): key là chuỗi tiếng
 * Việt gốc, bản dịch nằm ở src/lang/en_US.js, zh_CN.js,
 * ko_KR.js, ja_JP.js (dạng 1 file 1 ngôn ngữ — xem đầu
 * file đó). $t("Chuỗi tiếng Việt") tự tra theo ngôn ngữ
 * thiệp (setCardLocale — xem cuối file này).
 *
 * Nội dung thiệp cưới (khách mời xem) KHÔNG đi theo ngôn
 * ngữ giao diện — giữ đúng chữ chủ thiệp nhập.
 */

export const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", short: "VI", flag: "🇻🇳", htmlLang: "vi" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧", htmlLang: "en" },
  { code: "zh", label: "中文", short: "中", flag: "🇨🇳", htmlLang: "zh-CN" },
  { code: "ko", label: "한국어", short: "한", flag: "🇰🇷", htmlLang: "ko" },
  { code: "ja", label: "日本語", short: "日", flag: "🇯🇵", htmlLang: "ja" },
];

export const LOCALE_CODES = LANGUAGES.map((item) => item.code);

const DEFAULT_LOCALE = "vi";

/*
 * Key localStorage — tiền tố thiepnhaminh (thương hiệu mới).
 * Người dùng cũ có khóa thiepduyen-locale được script inline
 * trong index.html chuyển sang trước khi module này chạy.
 */
const STORAGE_KEY = "thiepnhaminh-locale";

/*
 * Gom mọi module (import.meta.glob — thêm file mới trong
 * modules/ là tự nhận, không phải sửa ở đây).
 */
const modules = import.meta.glob("./modules/*.js", { eager: true });

function setDeep(target, path, value) {
  const parts = path.split(".");

  let node = target;

  for (let i = 0; i < parts.length - 1; i += 1) {
    node = node[parts[i]] = node[parts[i]] || {};
  }

  node[parts[parts.length - 1]] = value;
}

function buildMessages() {
  const messages = Object.fromEntries(LOCALE_CODES.map((code) => [code, {}]));

  for (const mod of Object.values(modules)) {
    const table = mod.default || {};

    for (const [key, values] of Object.entries(table)) {
      LOCALE_CODES.forEach((code, index) => {
        const text = Array.isArray(values) ? values[index] : undefined;

        /* Thiếu bản dịch → bỏ trống để fallback về tiếng Việt */
        if (typeof text === "string" && text !== "") {
          setDeep(messages[code], key, text);
        }
      });
    }
  }

  /*
   * Gộp bảng "chữ trên thiệp" (key = chuỗi tiếng Việt gốc)
   * vào messages — không đè key trùng của modules/*.js vì
   * key dạng câu tiếng Việt không bao giờ trùng key dạng
   * "nav.templates".
   */
  const CARD_TABLES = { en: enUS, zh: zhCN, ko: koKR, ja: jaJP };

  for (const [code, table] of Object.entries(CARD_TABLES)) {
    Object.assign(messages[code], table);
  }

  return messages;
}

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/*
 * Lần đầu vào: theo ngôn ngữ trình duyệt (vd. "ko-KR" → ko),
 * không khớp thì tiếng Việt.
 */
function detectLocale() {
  const stored = readStored();

  if (LOCALE_CODES.includes(stored)) {
    return stored;
  }

  const preferred =
    typeof navigator !== "undefined"
      ? navigator.languages || [navigator.language]
      : [];

  for (const lang of preferred) {
    const code = String(lang || "").toLowerCase().slice(0, 2);

    if (LOCALE_CODES.includes(code)) {
      return code;
    }
  }

  return DEFAULT_LOCALE;
}

function applyHtmlLang(code) {
  if (typeof document === "undefined") {
    return;
  }

  const lang = LANGUAGES.find((item) => item.code === code);

  document.documentElement.lang = lang?.htmlLang || code;
}

const initialLocale = detectLocale();

applyHtmlLang(initialLocale);

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: buildMessages(),
  missingWarn: false,
  fallbackWarn: false,
});

/*
 * Đổi ngôn ngữ: cập nhật i18n (mọi $t() tự render lại),
 * lưu lựa chọn, đổi <html lang>.
 */
export function setLocale(code) {
  if (!LOCALE_CODES.includes(code)) {
    return;
  }

  i18n.global.locale.value = code;

  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* chế độ riêng tư chặn storage — vẫn đổi được trong phiên */
  }

  applyHtmlLang(code);
}

export function currentLocale() {
  return i18n.global.locale.value;
}

/*
 * Dịch ngoài component (store, utils, thông báo lỗi...).
 */
export const t = (...args) => i18n.global.t(...args);

/*
 * =========================================================
 * NGÔN NGỮ THIỆP (khác ngôn ngữ giao diện web)
 * =========================================================
 * Chữ trên thiệp (khách mời xem) theo lựa chọn của CHỦ
 * THIỆP trong editor — wedding.language. Trang khách xem
 * gọi setCardLocale(wedding.language) sau khi tải thiệp;
 * mọi $t() trong theme tự hiển thị đúng ngôn ngữ thiệp.
 *
 * Rời trang thiệp → clearCardLocale() trả về ngôn ngữ
 * giao diện (tránh ảnh hưởng các trang web khác).
 */

let cardLocaleCode = null;

export function setCardLocale(code) {
  if (!LOCALE_CODES.includes(code)) {
    return;
  }

  cardLocaleCode = code;

  i18n.global.locale.value = code;
}

export function clearCardLocale() {
  if (cardLocaleCode === null) {
    return;
  }

  cardLocaleCode = null;

  i18n.global.locale.value = detectLocale();
}

export function isCardLocaleActive() {
  return cardLocaleCode !== null;
}

/*
 * Tag BCP-47 cho Intl (toLocaleDateString / toLocaleTimeString)
 * theo ngôn ngữ hiện tại — dùng trong các theme khi format
 * ngày giờ trên thiệp.
 */
const INTL_TAGS = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  ko: "ko-KR",
  ja: "ja-JP",
};

export function localeTag() {
  return INTL_TAGS[i18n.global.locale.value] || INTL_TAGS.vi;
}

export default i18n;
