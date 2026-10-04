import { createI18n } from "vue-i18n";

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

const STORAGE_KEY = "thiepduyen-locale";

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

export default i18n;
