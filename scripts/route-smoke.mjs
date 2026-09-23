/*
 * =========================================================
 * SMOKE TEST — render từng route bằng SSR
 * =========================================================
 * Build chỉ bắt được lỗi resolve/compile. Script này render
 * thật từng trang để bắt lỗi runtime trong setup()/template
 * (truy cập thuộc tính undefined, thiếu import, vòng lặp vô
 * hạn…) mà build không thấy.
 *
 * Chạy: node scripts/route-smoke.mjs
 * =========================================================
 */
import { createServer } from "vite";
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createRouter, createMemoryHistory } from "vue-router";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";

const ROUTES = [
  "/",
  "/mau-thiep-cuoi",
  "/mau-thiep-cuoi-dep",
  "/thiep-cuoi-hien-dai",
  "/thiep-cuoi-truyen-thong",
  "/thiep-cuoi-online",
  "/tao-thiep-cuoi",
  "/gioi-thieu",
  "/bang-gia",
  "/huong-dan",
  "/lien-he",
];

/* ---------------------------------------------------------
   DOM tối thiểu — useSeo và vài component chạm tới document
   ngay trong setup(), nên phải có sẵn trước khi render.
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
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
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

/*
 * Vuetify đọc navigator.maxTouchPoints ngay khi nạp module
 * (qua window.navigator). Node 22 đã có `navigator` chỉ-đọc
 * nên phải ghi đè bằng defineProperty thay vì gán thẳng.
 */
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
   Vite: bỏ qua CSS khi SSR (Vuetify import .css trực tiếp)
--------------------------------------------------------- */

const stubCss = {
  name: "stub-css",
  enforce: "pre",
  resolveId(id) {
    /*
     * Chỉ chặn file CSS thật (ví dụ Vuetify import .css
     * trực tiếp). Không đụng tới module style ảo của SFC
     * (`?vue&type=style`) — plugin Vue tự xử lý phần đó.
     */
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

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
  plugins: [stubCss],
  /*
   * Tắt quét dependency trước — script này chỉ render
   * trong bộ nhớ, không cần Vite tối ưu gì cho trình duyệt.
   */
  optimizeDeps: { noDiscovery: true, include: [] },
  /*
   * Vuetify import file .css trực tiếp trong ESM — để Node
   * tự nạp sẽ vỡ. Ép Vite xử lý riêng Vuetify, còn lại vẫn
   * externalize bình thường (Vue phải để Node nạp).
   */
  ssr: { noExternal: ["vuetify"] },
});

let failed = 0;
let routes = [];
let setupRouterGuards = null;

try {
  ({ default: routes } = await vite.ssrLoadModule("/src/router/routes.js"));

  ({ setupRouterGuards } = await vite.ssrLoadModule("/src/router/guards.js"));

  for (const path of ROUTES) {
    /* Mỗi route bắt đầu với <head> sạch để đọc đúng thẻ của nó. */
    head.children.length = 0;
    document.title = "";

    const router = createRouter({ history: createMemoryHistory(), routes });

    const app = createSSRApp({ template: "<router-view />" });

    app.use(createPinia());
    app.use(createVuetify());
    app.use(router);

    const warnings = [];
    app.config.warnHandler = (msg) => warnings.push(msg);

    try {
      await router.push(path);
      await router.isReady();

      const html = await renderToString(app);

      const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "";
      const clean = h1.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

      const sections = (html.match(/<section/g) || []).length;

      console.log(
        `ok   ${path.padEnd(24)} ${String(html.length).padStart(6)}b  ` +
          `${String(sections).padStart(2)} section  h1="${clean.slice(0, 52)}"`
      );

      /*
       * useSeo ghi thẻ vào document.head — đọc lại để xác
       * nhận mỗi route có title/description/JSON-LD riêng.
       */
      const meta = (key) => {
        const tag = head.children.find(
          (el) => el.attributes.name === key || el.attributes.property === key
        );

        return tag?.attributes.content || "";
      };

      const jsonLd = head.children.find(
        (el) => el.id === "page-json-ld" || el.attributes.id === "page-json-ld"
      );

      let ldType = "";

      if (jsonLd?.textContent) {
        try {
          const parsed = JSON.parse(jsonLd.textContent);
          ldType = parsed["@graph"]
            ? parsed["@graph"].map((n) => n["@type"]).join("+")
            : parsed["@type"];
        } catch {
          ldType = "invalid-json";
        }
      }

      console.log(`     title: ${document.title}`);
      console.log(`     desc : ${meta("description").slice(0, 90)}…`);
      console.log(`     ld   : ${ldType || "(none)"}`);

      if (warnings.length) {
        console.log(`     ⚠ ${warnings.length} warning(s)`);
        warnings.slice(0, 2).forEach((w) => console.log(`       - ${w.slice(0, 150)}`));
      }
    } catch (error) {
      failed += 1;
      console.log(`FAIL ${path}`);
      console.log(`     ${String(error.message).slice(0, 300)}`);
    }
  }

  /* -------------------------------------------------------
     ĐIỀU HƯỚNG: /templates phải nhảy sang /mau-thiep-cuoi,
     và không route công khai nào bị đá về /login.
  ------------------------------------------------------- */

  const navRouter = createRouter({ history: createMemoryHistory(), routes });

  setupRouterGuards(navRouter);

  const navApp = createSSRApp({ template: "<router-view />" });

  navApp.use(createPinia());
  navApp.use(createVuetify());
  navApp.use(navRouter);

  for (const path of ["/templates", ...ROUTES]) {
    await navRouter.push(path).catch(() => {});

    const landed = navRouter.currentRoute.value;

    const bounced = landed.name === "Login" && path !== "/login";

    if (bounced) {
      failed += 1;
    }

    console.log(
      `${bounced ? "FAIL" : "ok  "} ${path.padEnd(24)} → ` +
        `${landed.path}  (name=${String(landed.name)})`
    );
  }
} finally {
  await vite.close();
}

console.log(failed ? `\n${failed} route(s) failed` : "\nAll routes rendered");
process.exit(failed ? 1 : 0);
