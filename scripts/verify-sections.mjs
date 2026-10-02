/*
 * Kiểm tra màu + marquee + nền giấy cho SongHacRed qua SSR:
 * - 7 mục (Couple, Events, Map, DressCode, Timeline, Wishes, Story) render đủ
 * - Marquee lời chúc nằm trong mục Gifts
 * - Wrapper có nền đỏ (giữ nguyên) — nền giấy chỉ áp @768px qua CSS
 */
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createMemoryHistory, createRouter } from "vue-router";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function makeElement(tag = "div") {
  const el = {
    tagName: String(tag).toUpperCase(),
    id: "", type: "", attributes: {}, children: [], textContent: "",
    style: { setProperty() {}, removeProperty() {}, getPropertyValue: () => "" },
    classList: { add() {}, remove() {}, contains: () => false },
    setAttribute(key, value) { this.attributes[key] = value; },
    getAttribute(key) { return this.attributes[key] ?? null; },
    appendChild() {}, removeChild() {},
    addEventListener() {}, removeEventListener() {},
    attachShadow() { return makeElement("div"); },
    dataset: {},
  };
  return el;
}

globalThis.document = {
  createElement: makeElement,
  createTextNode: () => ({}),
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  addEventListener() {}, removeEventListener() {},
  body: makeElement("body"),
  documentElement: makeElement("html"),
  head: makeElement("head"),
};

globalThis.window = {
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  location: {
    href: "http://localhost/", origin: "http://localhost", pathname: "/",
    search: "", hash: "", protocol: "http:", host: "localhost", hostname: "localhost",
    assign() {}, replace() {}, reload() {},
  },
  history: { state: null, length: 1, pushState() {}, replaceState() {}, go() {}, back() {}, forward() {}, scrollRestoration: "auto" },
  addEventListener() {}, removeEventListener() {}, scrollTo() {},
  innerWidth: 1280, innerHeight: 800,
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
};
globalThis.history = globalThis.window.history;
globalThis.location = globalThis.window.location;
globalThis.localStorage = globalThis.window.localStorage;

const fakeNavigator = {
  userAgent: "node", maxTouchPoints: 0, platform: "node", language: "vi-VN",
  clipboard: { writeText: async () => {} },
};
Object.defineProperty(globalThis, "navigator", { configurable: true, value: fakeNavigator });
globalThis.window.navigator = fakeNavigator;

globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

const stubCss = {
  name: "stub-css",
  enforce: "pre",
  resolveId(id) {
    if (id.includes("?")) return null;
    if (/\.(css|scss|sass|less|styl)$/.test(id)) return `\0stub-css:${id}`;
    return null;
  },
  load(id) {
    if (id.startsWith("\0stub-css:")) return "export default {};";
    return null;
  },
};

const vite = await createServer({
  root,
  logLevel: "error",
  plugins: [stubCss],
  cacheDir: "node_modules/.vite-theme-test",
  optimizeDeps: { noDiscovery: true, include: [] },
  ssr: { noExternal: ["vuetify"] },
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});

const mod = await vite.ssrLoadModule("/src/themes/SongHacRed.vue");
const mock = (await vite.ssrLoadModule("/src/mock/wedding.json")).default;
const wedding = mock.find((w) => w.slug === "quang-duy-ha-linh");

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }],
});

const app = createSSRApp({ render: () => h(mod.default, { wedding, startOpened: true }) });
app.use(createPinia());
app.use(router);
app.use(createVuetify());

const html = await renderToString(app);
await vite.close();

const checks = [
  ["Couple section", html.includes("shc-couple")],
  ["Events section", html.includes("shc-events")],
  /*
   * Map giờ gộp vào từng thẻ sự kiện (EventMap) — không còn
   * section shc-map standalone.
   */
  ["EventMap in events", html.includes("event-map")],
  ["DressCode section", html.includes("shc-dress")],
  ["Timeline section", html.includes("shc-timeline")],
  ["Wishes section", html.includes("shc-wishes")],
  ["Story section", html.includes("shc-story")],
  ["Gifts section", html.includes("shc-gifts")],
  ["marquee in gifts", html.includes("shc-wish-marquee")],
  ["wish 1 name", html.includes("Minh Anh")],
  ["wish 2 name", html.includes("Quốc Bảo")],
  ["navy text var on theme", html.includes("--text-secondary:#001232") || html.includes("--text-secondary: #001232")],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  if (!ok) failed++;
}
process.exit(failed ? 1 : 0);
