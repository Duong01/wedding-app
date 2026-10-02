/*
 * Verify SeasonFx — hiệu ứng mùa theo ngày cưới:
 *
 *  1. Ngày cưới tháng 3 (xuân) → hoa rơi (season-fx--spring).
 *  2. Tháng 6 (hè) → nắng (season-fx--summer + sunbeam).
 *  3. Tháng 9 (thu) → lá rơi (season-fx--autumn).
 *  4. Tháng 12 (đông) → tuyết (season-fx--winter).
 *  5. settings.ShowSeasonFx = false → không render.
 *  6. settings.SeasonOverride = "winter" → tuyết dù cưới hè.
 *  7. Không ngày cưới → không render.
 *  8. SeasonFx có mặt trong cả 26 theme wrapper (grep).
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { readdirSync } from "node:fs";

const root = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(root, "..");

/* =========================================================
   DOM STUB (pattern theme-test.mjs)
========================================================= */

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
      top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0,
    }),
    scrollIntoView() {},
    focus() {},
    closest: () => null,
  };
  return el;
}

const fakeNavigator = { userAgent: "node", language: "vi-VN", maxTouchPoints: 0 };
const fakeLocation = {
  href: "http://localhost:5173/", origin: "http://localhost:5173",
  protocol: "http:", host: "localhost:5173", pathname: "/",
  search: "", hash: "", hostname: "localhost", port: "5173",
};

const fakeWindow = {
  document: {
    createElement: makeElement,
    createTextNode: (t) => String(t),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener() {}, removeEventListener() {},
    head: makeElement("head"), body: makeElement("body"),
    documentElement: makeElement("html"),
    visibilityState: "visible", hidden: false,
  },
  location: fakeLocation,
  history: { state: null, pushState() {}, replaceState() {}, go() {}, back() {}, forward() {} },
  navigator: fakeNavigator,
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame: clearTimeout,
  setTimeout, clearTimeout, setInterval, clearInterval,
  getComputedStyle: () => ({ getPropertyValue: () => "" }),
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  scrollTo() {}, scrollX: 0, scrollY: 0,
  innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
  postMessage() {},
};
fakeWindow.parent = fakeWindow;
fakeWindow.top = fakeWindow;

globalThis.window = fakeWindow;
globalThis.document = fakeWindow.document;
Object.defineProperty(globalThis, "navigator", {
  configurable: true, value: fakeNavigator,
});
globalThis.location = fakeLocation;
globalThis.history = fakeWindow.history;
globalThis.localStorage = fakeWindow.localStorage;
globalThis.sessionStorage = fakeWindow.sessionStorage;
globalThis.matchMedia = fakeWindow.matchMedia;
globalThis.requestAnimationFrame = fakeWindow.requestAnimationFrame;
globalThis.cancelAnimationFrame = fakeWindow.cancelAnimationFrame;
globalThis.CustomEvent = class CustomEvent {
  constructor(type, opts = {}) { this.type = type; Object.assign(this, opts); }
};
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

/* =========================================================
   VITE SSR
========================================================= */

import { createServer } from "vite";

const stubCss = {
  name: "stub-css",
  enforce: "pre",
  resolveId(id) {
    const clean = id.split("?")[0];
    if (/\.(css|webp|svg|png|jpe?g|woff2?)$/.test(clean)) {
      return `\0stub-css:${id}`;
    }
    return null;
  },
  load(id) {
    if (id.startsWith("\0stub-css:")) return "export default {}";
    return null;
  },
};

const vite = await createServer({
  root: appDir,
  logLevel: "error",
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] },
  ssr: { noExternal: ["vuetify"] },
  cacheDir: "node_modules/.vite-theme-test",
  plugins: [stubCss],
});

const { createSSRApp, h } = await import("vue");
const { renderToString } = await import("@vue/server-renderer");
const { createPinia } = await import("pinia");
const { createMemoryHistory, createRouter } = await import("vue-router");
const { createVuetify } = await import("vuetify");

const SeasonFx = (await vite.ssrLoadModule("/src/components/common/SeasonFx.vue")).default;

/* =========================================================
   TESTS
========================================================= */

let failures = 0;

function check(label, ok, extra = "") {
  if (ok) console.log(`ok   ${label}`);
  else { failures++; console.log(`FAIL ${label} ${extra}`); }
}

async function render(wedding) {
  const app = createSSRApp({ render: () => h(SeasonFx, { wedding }) });
  app.use(createPinia());
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }],
  });
  app.use(router);
  app.use(createVuetify());
  await router.push("/");
  await router.isReady();
  return renderToString(app);
}

/* 1-4: bốn mùa theo tháng */

const CASES = [
  ["2027-03-15T09:00:00", "spring", "xuân (T3) → hoa rơi"],
  ["2027-06-15T09:00:00", "summer", "hè (T6) → nắng"],
  ["2027-09-15T09:00:00", "autumn", "thu (T9) → lá rơi"],
  ["2027-12-15T09:00:00", "winter", "đông (T12) → tuyết"],
  ["2027-01-15T09:00:00", "winter", "T1 → tuyết (mùa đông kéo sang năm mới)"],
  ["2027-04-30T09:00:00", "spring", "T4 → hoa rơi"],
  ["2027-11-02T09:00:00", "winter", "T11 → tuyết"],
];

for (const [date, season, label] of CASES) {
  const html = await render({ weddingDate: date, settings: {} });
  check(
    label,
    html.includes(`season-fx--${season}`),
    `(thấy: ${(html.match(/season-fx--[a-z]+/) || ["không"])[0]})`,
  );
}

/* 5: tắt qua settings */

const off = await render({
  weddingDate: "2027-03-15T09:00:00",
  settings: { ShowSeasonFx: false },
});
check("ShowSeasonFx=false → ẩn hiệu ứng", !off.includes("season-fx--"));

/* 6: override mùa */

const override = await render({
  weddingDate: "2027-06-15T09:00:00",
  settings: { SeasonOverride: "winter" },
});
check(
  "SeasonOverride=winter → tuyết dù cưới hè",
  override.includes("season-fx--winter"),
);

/* 7: không ngày cưới */

const nodate = await render({ settings: {} });
check("không ngày cưới → không render", !nodate.includes("season-fx--"));

/* 8: số hạt mỗi mùa */

const spring = await render({ weddingDate: "2027-03-15", settings: {} });
/* Mỗi <i> có 2 class chứa "season-fx__flake" (base + variant) —
 * đếm theo thẻ mở. */
const flakes = (spring.match(/<i [^>]*class="season-fx__flake/g) || []).length;
check("xuân có 15 hạt", flakes === 15, `(thấy ${flakes})`);

const autumn = await render({ weddingDate: "2027-09-15", settings: {} });
const leaves = (autumn.match(/<i [^>]*class="season-fx__flake/g) || []).length;
check("thu có 15 lá", leaves === 15, `(thấy ${leaves})`);

const winter = await render({ weddingDate: "2027-12-15", settings: {} });
const snow = (winter.match(/<i [^>]*class="season-fx__flake/g) || []).length;
check("đông có 18 hạt tuyết (giảm nhẹ)", snow === 18, `(thấy ${snow})`);

const summer = await render({ weddingDate: "2027-06-15", settings: {} });
const sun = (summer.match(/<i [^>]*class="season-fx__flake/g) || []).length;
check("hè có 8 đốm nắng", sun === 8, `(thấy ${sun})`);

check(
  "hè có sunbeam",
  summer.includes("season-fx__sunbeam"),
);

/* 9: SeasonFx trong 26 wrapper */

const wrappers = readdirSync(path.join(appDir, "src/themes"))
  .filter((f) => f.endsWith(".vue"));

const missing = wrappers.filter(
  (f) =>
    !fs
    .readFileSync(path.join(appDir, "src/themes", f), "utf8")
    .includes("SeasonFx :wedding")
);

check(
  "SeasonFx có trong cả 26 wrapper",
  missing.length === 0,
  missing.length ? `(thiếu: ${missing.join(", ")})` : `(${wrappers.length} wrapper)`,
);

/* =========================================================
   KẾT QUẢ
========================================================= */

console.log("");

if (failures) {
  console.log(`${failures} FAIL`);
  process.exitCode = 1;
} else {
  console.log("SeasonFx — all checks passed");
}

await vite.close();
