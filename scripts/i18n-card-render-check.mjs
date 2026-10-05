/*
 * Kiểm tra chữ trên thiệp đổi theo wedding.language: render
 * một mẫu với language=en/zh/ko/ja rồi soi HTML xem có chuỗi
 * đã dịch không (thay vì tiếng Việt).
 *
 * Chạy: node scripts/i18n-card-render-check.mjs
 */
import { createServer } from "vite";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createMemoryHistory, createRouter } from "vue-router";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { readFileSync, writeFileSync } from "node:fs";

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
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    removeAttribute(k) { delete this.attributes[k]; },
    appendChild(c) { this.children.push(c); return c; },
    remove() {},
    contains: () => false,
    addEventListener() {},
    removeEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    scrollIntoView() {},
    focus() {},
    closest: () => null,
  };
  return el;
}

globalThis.document = {
  head: makeElement("head"),
  body: makeElement("body"),
  documentElement: makeElement("html"),
  createElement: (t) => makeElement(t),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  getElementById: () => null,
};
globalThis.window = {
  location: { origin: "http://localhost", href: "http://localhost/", pathname: "/", search: "", hash: "" },
  history: {
    state: {},
    pushState() {},
    replaceState() {},
    go() {},
    back() {},
    forward() {},
    length: 1,
    scrollRestoration: "auto",
  },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  addEventListener() {},
  removeEventListener() {},
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame() {},
  scrollTo() {},
  innerWidth: 1280,
  innerHeight: 800,
  navigator: { language: "vi", languages: ["vi"] },
};
globalThis.localStorage = {
  getItem: () => null,
  setItem() {},
  removeItem() {},
};
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
  ssr: { noExternal: ["vuetify"] },
});

const { default: i18n, setCardLocale } = await vite.ssrLoadModule("/src/lang/index.js");

const mock = JSON.parse(readFileSync("src/mock/wedding.json", "utf8"));
const sample = Array.isArray(mock) ? mock[0] : mock;

const themesMod = await vite.ssrLoadModule("/src/themes/index.js");
const themes = themesMod.default || themesMod;
const ThemeComponent = themes["traditional-red"];

/* Async component: chờ loader xong để SSR render ra HTML thật. */
if (ThemeComponent?.__asyncLoader) {
  await ThemeComponent.__asyncLoader();
}

const CASES = [
  { code: "vi", expect: "XÁC NHẬN THAM DỰ" },
  { code: "en", expect: "SEND RSVP" },
  { code: "zh", expect: "发送确认" },
  { code: "ko", expect: "확인 전송" },
  { code: "ja", expect: "確認を送信" },
];

/* Chuỗi dò riêng — bản dịch en của "XÁC NHẬN THAM DỰ" là "RSVP"
   nên dùng câu dài hơn để chắc chắn khác tiếng Việt. */
const PROBES = {
  vi: "Tiệc cưới sẽ diễn ra vào lúc:",
  en: "The wedding banquet will be held at:",
  zh: "婚宴将于以下时间举行：",
  ko: "피로연이 아래 시간에 진행됩니다:",
  ja: "披露宴は以下の時間に行われます:",
};

let fail = 0;

for (const { code } of CASES) {
  setCardLocale(code);

  const expect = PROBES[code];

  const wedding = { ...sample, language: code };

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }],
  });

  const app = createSSRApp({
    render: () => h(ThemeComponent, { wedding, startOpened: true }),
  });

  app.use(createPinia());
  app.use(createVuetify());
  app.use(router);
  app.use(i18n);

  await router.push("/");
  await router.isReady();

  const html = await renderToString(app);
  const hit = html.includes(expect);
  if (!hit) writeFileSync(`render-${code}.html`, html);

  console.log(`${hit ? "ok  " : "FAIL"} [${code}] tìm "${expect}" → ${hit ? "có" : "KHÔNG"}`);
  if (!hit) fail += 1;
}

await vite.close();
console.log(fail ? `\nFAIL — ${fail} ngôn ngữ không render đúng` : "\nOK — chữ trên thiệp đổi theo wedding.language");
process.exit(fail ? 1 : 0);
