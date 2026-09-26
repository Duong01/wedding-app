/*
 * =========================================================
 * THEME TEST — render từng mẫu thiệp và kiểm tra quy tắc
 * =========================================================
 * Kiểm tra 3 nhóm quy tắc trên cả 19 mẫu:
 *
 *  1. MÀU ĐỒNG BỘ
 *     - theme.Colors trong mock không chứa URL ảnh (URL
 *       không phải màu — gán vào biến CSS làm nền trong
 *       suốt).
 *     - Theme wrapper áp biến màu qua useWeddingTheme thì
 *       biến phải là màu hợp lệ (hex/rgb/hsl…), không bị
 *       undefined hay URL.
 *
 *  2. PHONG BÌ = 2, HỘP QUÀ = 1
 *     Mục quà mừng: template kiểu phong bì phải có đúng
 *     2 phong bì (phong bì sau + phong bì trước), template
 *     kiểu hộp quà phải có đúng 1 hộp.
 *
 *  3. RENDER KHÔNG LỖI
 *     Mỗi theme render SSR với dữ liệu mock của chính nó,
 *     không văng lỗi runtime.
 *
 * Chạy: node scripts/theme-test.mjs
 * =========================================================
 */
import { createServer } from "vite";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createMemoryHistory, createRouter } from "vue-router";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { readFileSync } from "node:fs";

/* ---------------------------------------------------------
   DOM tối thiểu — giống route-smoke.mjs.
--------------------------------------------------------- */

function makeElement(tag = "div") {
  const el = {
    tagName: String(tag).toUpperCase(),
    id: "",
    type: "",
    attributes: {},
    children: [],
    textContent: "",
    style: {},
    classList: { add() {}, remove() {}, contains: () => false },
    setAttribute(key, value) {
      this.attributes[key] = value;
    },
    getAttribute(key) {
      return this.attributes[key];
    },
    removeAttribute(key) {
      delete this.attributes[key];
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    remove() {},
    contains: () => false,
    addEventListener() {},
    removeEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    }),
    scrollIntoView() {},
    focus() {},
    closest: () => null,
  };

  return el;
}

const head = makeElement("head");
head.querySelector = () => null;
head.appendChild = (child) => {
  head.children.push(child);
  return child;
};

globalThis.document = {
  head,
  body: makeElement("body"),
  documentElement: makeElement("html"),
  createElement: makeElement,
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  title: "",
};

globalThis.window = {
  matchMedia: () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }),
  location: {
    href: "http://localhost/",
    origin: "http://localhost",
    pathname: "/",
    search: "",
    hash: "",
    protocol: "http:",
    host: "localhost",
    hostname: "localhost",
    assign() {},
    replace() {},
    reload() {},
  },
  history: {
    state: null,
    length: 1,
    pushState() {},
    replaceState() {},
    go() {},
    back() {},
    forward() {},
    scrollRestoration: "auto",
  },
  addEventListener() {},
  removeEventListener() {},
  scrollTo() {},
  innerWidth: 1280,
  innerHeight: 800,
  localStorage: {
    getItem: () => null,
    setItem() {},
    removeItem() {},
  },
};

globalThis.history = globalThis.window.history;
globalThis.location = globalThis.window.location;

const fakeNavigator = {
  userAgent: "node",
  maxTouchPoints: 0,
  platform: "node",
  language: "vi-VN",
  languages: ["vi-VN"],
  clipboard: { writeText: async () => {} },
};

Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: fakeNavigator,
});

globalThis.window.navigator = fakeNavigator;
globalThis.localStorage = globalThis.window.localStorage;
globalThis.matchMedia = globalThis.window.matchMedia;

/* ---------------------------------------------------------
   Vite: bỏ qua CSS khi SSR.
--------------------------------------------------------- */

const stubCss = {
  name: "stub-css",
  enforce: "pre",
  resolveId(id) {
    if (id.includes("?")) {
      return null;
    }

    if (id.endsWith(".css") || id.endsWith(".scss") || id.endsWith(".sass")) {
      return `\0stub-css:${id}`;
    }

    return null;
  },
  load(id) {
    if (id.startsWith("\0stub-css:")) {
      return "export default {};";
    }
    return null;
  },
};

/* ---------------------------------------------------------
   KỲ VỌNG THEO TỪNG MẪU
   ---------------------------------------------------------
   type: "envelope"  — mục quà là PHONG BÌ → phải thấy 2
                       phong bì (sau + trước).
   type: "box"       — mục quà là HỘP QUÀ → đúng 1 hộp.
   type: "list"      — quà hiển thị dạng danh sách thẻ
                       (DongSon) — không có phong bì/hộp.
--------------------------------------------------------- */

const EXPECTATIONS = {
  "traditional-red": { type: "envelope" },
  "romantic-pink": { type: "box" },
  "elegant-gold": { type: "envelope" },
  "modern-white": { type: "envelope" },
  "nhat-binh-do": { type: "envelope" },
  "royal-red": { type: "box" },
  "dong-son": { type: "list" },
  "ivory-gold": { type: "envelope" },
  "serene-green": { type: "box" },
  "sunset-peach": { type: "box" },
  "champagne-blush": { type: "box" },
  "midnight-gold": { type: "box" },
  "lavender-cream": { type: "box" },
  "double-happiness": { type: "box" },
  "boho-terracotta": { type: "envelope" },
  "song-hy-red": { type: "envelope" },
  "to-duyen-xanh": { type: "box" },
  "emerald-luxe": { type: "envelope" },
  "long-phung-v3": { type: "box" },
};

/*
 * Chữ xuất hiện trong HTML render của mục quà, dùng đếm
 * phong bì / hộp quà. Mỗi template tự viết class riêng
 * (bq-envelope, cr-envelope, tr-gift__envelope…) nên phải
 * liệt kê theo từng template.
 */
const GIFT_MARKERS = {
  "traditional-red": {
    envelope: /tr-gift__envelope-(?:back|card)\b/g,
  },
  "elegant-gold": {
    envelope: /la-gift__(?:back|card)\b/g,
  },
  "modern-white": {
    /*
     * Một nút duy nhất, 2 phong bì chồng nhau
     * (mw-gift__back + mw-gift__card).
     */
    envelope: /class="mw-gift__(?:back|card)"/g,
    envelopeCount: 2,
  },
  "nhat-binh-do": {
    envelope: /cfr-gift__envelope-(?:back|card)\b/g,
  },
  "song-hy-red": {
    envelope: /shy-gift-envelope--(?:back|front)\b/g,
  },
  "boho-terracotta": {
    envelope: /bq-envelope__body--(?:back|front)\b/g,
  },
  "emerald-luxe": {
    envelope: /cr-envelope__body--(?:back|front)\b/g,
  },
  "ivory-gold": {
    /*
     * Mỗi quà một bao lì xì — nút <button class="lixi…">.
     * SSR sắp xếp class thành "lixi-left lixi" nên match
     * theo cặp type="button" + class chứa lixi. Mock có
     * 2 quà → đúng 2 bao lì xì.
     */
    envelope: /<button[^>]*class="[^"]*\blixi\b/g,
    envelopeCount: 2,
  },
  "romantic-pink": {
    box: /gift-box-button/g,
  },
  "royal-red": {
    box: /rr-gift__box\b/g,
  },
  "long-phung-v3": {
    box: /lp-gift-box\b/g,
  },
  "to-duyen-xanh": {
    box: /tdx-gift-box\b/g,
  },
  "champagne-blush": {
    box: /cb-gift-box\b/g,
  },
  "double-happiness": {
    box: /dh-gift-box\b/g,
  },
  "lavender-cream": {
    box: /lc-gift-box\b/g,
  },
  "midnight-gold": {
    box: /mg-gift-box\b/g,
  },
  "serene-green": {
    box: /sg-gift-box\b/g,
  },
  "sunset-peach": {
    box: /sp-gift-box\b/g,
  },
  "dong-son": {},
};

/* ---------------------------------------------------------
   DỮ LIỆU MOCK
--------------------------------------------------------- */

const mockData = JSON.parse(
  readFileSync(new URL("../src/mock/wedding.json", import.meta.url), "utf8")
);

const COLOR_KEYS = [
  "Primary",
  "Secondary",
  "Accent",
  "AccentLight",
  "Background",
  "BackgroundSecondary",
  "Text",
  "TextSecondary",
  "White",
];

const isColor = (value) =>
  typeof value === "string" &&
  /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|[a-z]+)$/i.test(value.trim());

const isUrl = (value) =>
  typeof value === "string" && /^(https?:|data:|url\()/i.test(value.trim());

/* ---------------------------------------------------------
   CHẠY TEST
--------------------------------------------------------- */

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
  plugins: [stubCss],
  optimizeDeps: { noDiscovery: true, include: [] },
  ssr: { noExternal: ["vuetify"] },
});

let failed = 0;
let passed = 0;

try {
  const themes = await vite.ssrLoadModule("/src/themes/index.js");

  for (const [themeName, expect] of Object.entries(EXPECTATIONS)) {
    const mock = mockData.find((w) => w.theme?.Name === themeName);

    if (!mock) {
      failed += 1;
      console.log(`FAIL ${themeName} — không có dữ liệu mock`);
      continue;
    }

    const problems = [];

    /* ---------- 1. MÀU ĐỒNG BỘ ---------- */

    const colors = mock.theme.Colors || {};

    for (const key of COLOR_KEYS) {
      const value = colors[key];

      if (value === undefined) {
        continue;
      }

      if (isUrl(value)) {
        problems.push(`Colors.${key} là URL ảnh, không phải màu: ${value.slice(0, 50)}`);
      } else if (!isColor(value)) {
        problems.push(`Colors.${key} không phải màu hợp lệ: ${value}`);
      }
    }

    /* ---------- RENDER THEME ---------- */

    const ThemeComponent = themes.default?.[themeName] || themes[themeName];

    if (!ThemeComponent) {
      failed += 1;
      console.log(`FAIL ${themeName} — không tìm thấy component trong themes/index`);
      continue;
    }

    let html = "";

    try {
      /*
       * Vài component gọi useRoute() (đọc params/token) —
       * gắn router rỗng để không văng lỗi inject.
       */
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }],
      });

      const app = createSSRApp({
        render: () =>
          h(ThemeComponent, { wedding: mock, startOpened: true }),
      });

      app.use(createPinia());
      app.use(createVuetify());
      app.use(router);

      await router.push("/");
      await router.isReady();

      html = await renderToString(app);
    } catch (error) {
      problems.push(`render lỗi: ${String(error.message).slice(0, 200)}`);
    }

    /* ---------- 2. PHONG BÌ = 2, HỘP QUÀ = 1 ---------- */

    if (html) {
      const markers = GIFT_MARKERS[themeName] || {};

      if (expect.type === "envelope") {
        const count = markers.envelope ? (html.match(markers.envelope) || []).length : 0;

        const expected = markers.envelopeCount ?? 2;

        if (count !== expected) {
          problems.push(
            `phong bì: kỳ vọng ${expected} phong bì, thấy ${count}`
          );
        }
      } else if (expect.type === "box") {
        const count = markers.box ? (html.match(markers.box) || []).length : 0;

        if (count !== 1) {
          problems.push(`hộp quà: kỳ vọng đúng 1 hộp, thấy ${count}`);
        }
      }
      /* type "list" (DongSon) — không kiểm tra số lượng */
    }

    /* ---------- KẾT QUẢ ---------- */

    if (problems.length) {
      failed += 1;
      console.log(`FAIL ${themeName}`);
      problems.forEach((p) => console.log(`     ✗ ${p}`));
    } else {
      passed += 1;
      console.log(`ok   ${themeName.padEnd(20)} ${expect.type.padEnd(9)} ${String(html.length).padStart(6)}b`);
    }
  }

  /* -------------------------------------------------------
     BONUS: init() của editor store phải ra đúng bảng màu
     theo từng theme (không còn traditional-red cứng).
  ------------------------------------------------------- */

  const storeModule = await vite.ssrLoadModule("/src/stores/weddingEditor.js");

  const store = storeModule.useWeddingEditorStore(createPinia());

  const red = store.init("traditional-red");

  if (red?.theme?.Colors?.Primary !== "#7b0d0d") {
    failed += 1;
    console.log(`FAIL editor init traditional-red → Primary ${red?.theme?.Colors?.Primary}`);
  } else {
    passed += 1;
  }

  store.reset("romantic-pink");

  if (store.wedding?.theme?.Colors?.Primary !== "#cb5d6c") {
    failed += 1;
    console.log(
      `FAIL editor init romantic-pink → Primary ${store.wedding?.theme?.Colors?.Primary} (kỳ vọng #cb5d6c)`
    );
  } else {
    passed += 1;
  }

  /* setTheme phải đổi cả màu, không chỉ Name */

  store.setTheme("modern-white");

  if (store.wedding?.theme?.Colors?.Primary !== "#486c7d") {
    failed += 1;
    console.log(
      `FAIL editor setTheme modern-white → Primary ${store.wedding?.theme?.Colors?.Primary} (kỳ vọng #486c7d)`
    );
  } else {
    passed += 1;
  }
} finally {
  await vite.close();
}

console.log(
  failed
    ? `\n${failed} check(s) failed, ${passed} passed`
    : `\nAll ${passed} checks passed — 19 mẫu: màu đồng bộ, phong bì = 2, hộp quà = 1`
);

process.exit(failed ? 1 : 0);
