import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createMemoryHistory, createRouter } from "vue-router";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---- DOM stubs (same as theme-test.mjs) ---- */
function makeElement(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    style: new Proxy({}, { get: () => "", set: () => true }),
    classList: { add() {}, remove() {}, contains: () => false },
    setAttribute() {}, getAttribute: () => null,
    appendChild() {}, removeChild() {},
    addEventListener() {}, removeEventListener() {},
    attachShadow() { return makeElement("div"); },
    dataset: {},
    children: [],
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
  clipboard: { writeText: async () => {} },
};
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: fakeNavigator,
});
globalThis.window.navigator = fakeNavigator;
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
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
  ["marquee container", html.includes("shc-wish-marquee")],
  ["marquee track", html.includes("shc-wish-marquee__track")],
  ["wish name Minh Anh", html.includes("Minh Anh")],
  ["wish message trăng soi", html.includes("Trăng soi đôi hạc")],
  ["wish name Quốc Bảo", html.includes("Quốc Bảo")],
  ["duplicated items (seamless loop)", (html.match(/shc-wish-marquee__item/g) || []).length === 4],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  if (!ok) failed++;
}
process.exit(failed ? 1 : 0);
