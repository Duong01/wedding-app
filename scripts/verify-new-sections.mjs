/*
 * Verify các section mới: VideoSection, GameSection (vòng quay),
 * StoryMilestones, EventMap gộp trong từng sự kiện.
 *
 * 1. Static: 26 orchestrator có import + tag, 0 chữ WeddingMap,
 *    26 WeddingEvents có EventMap, MapPanel/WeddingMap không còn tồn tại.
 * 2. SSR: base (flags off) → không marker mới; mock bật đủ →
 *    đủ marker (iframe video autoplay+mute, wheel, milestones).
 * 3. Pure: parseVideoUrl + mapEmbedUrl/mapDirectionsUrl.
 *
 * Chạy: node scripts/verify-new-sections.mjs
 */

import fs from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createPinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { createVuetify } from "vuetify";

import { parseVideoUrl } from "../src/utils/videoEmbed.js";
import { mapEmbedUrl, mapDirectionsUrl } from "../src/utils/mapEmbed.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let failed = 0;

function check(name, ok) {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  if (!ok) failed++;
}

/* =========================================================
   STUB BROWSER (giống verify-sections.mjs — theme import
   @/model/https → router dùng createWebHistory cần window)
========================================================= */

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

/* =========================================================
   1. STATIC CHECKS
========================================================= */

const THEMES = fs
  .readdirSync("src/themes")
  .filter((f) => f.endsWith(".vue"))
  .map((f) => f.replace(".vue", ""));

check("26 themes", THEMES.length === 26);

for (const theme of THEMES) {
  const src = fs.readFileSync(`src/themes/${theme}.vue`, "utf8");

  check(`${theme}: VideoSection`, src.includes("VideoSection"));
  check(`${theme}: GameSection`, src.includes("GameSection"));
  check(`${theme}: StoryMilestones`, src.includes("StoryMilestones"));
  check(`${theme}: no WeddingMap`, !src.includes("WeddingMap"));

  /*
   * :settings phải nằm trong CHÍNH thẻ <WeddingEvents ...> —
   * match từng thẻ (không quét xuyên file) rồi đếm.
   */
  const eventTags = src.match(/<WeddingEvents[\s\S]*?\/>/g) || [];
  const withSettings = eventTags.filter((tag) => tag.includes(':settings="settings"'));

  check(
    `${theme}: events get settings`,
    eventTags.length > 0 && eventTags.length === withSettings.length
  );

  /*
   * Thứ tự mục: video + game phải nằm SAU mục sự kiện (nơi
   * chứa bản đồ EventMap). Dùng lastIndexOf("</template>") vì
   * vài theme có <template v-if> lồng bên trong.
   */
  const tpl = src.slice(0, src.lastIndexOf("</template>"));

  const iVideo = tpl.search(/<VideoSection/);
  const iGame = tpl.search(/<GameSection/);
  const iEvents = tpl.search(/<WeddingEvents/);

  check(
    `${theme}: video + game sau sự kiện`,
    iVideo > iEvents && iGame > iEvents
  );
}

for (const theme of THEMES) {
  const events = fs.readFileSync(`src/page/${theme}/WeddingEvents.vue`, "utf8");
  check(`${theme}/WeddingEvents: EventMap`, events.includes("EventMap"));

  /*
   * Mọi sự kiện phải được render — WeddingEvents phải có v-for
   * trên danh sách sự kiện (TraditionalRed từng chỉ render
   * events[0], khách thêm 2 tiệc chỉ thấy tiệc đầu).
   */
  check(
    `${theme}/WeddingEvents: v-for mọi sự kiện`,
    /v-for=.*\bin\s+(normalizedEvents|events)\b/.test(events)
  );

  /*
   * Lịch tháng + bản đồ chỉ hiện MỘT lần (sự kiện đầu) — trước
   * đây mỗi sự kiện render 1 lịch + 1 map, khách thêm 2 tiệc là
   * thấy 2 lịch / 2 bản đồ trùng nhau.
   */
  check(
    `${theme}/WeddingEvents: map chỉ sự kiện đầu`,
    /<EventMap v-if="index === 0 && showMap"/.test(events)
  );

  /*
   * Mọi v-if gắn với lịch tháng (calendarDays / event.date) đều
   * phải khoá vào sự kiện đầu. DongSon không có lịch → bỏ qua.
   */
  const calIfs = events.match(/v-if="[^"]*(?:calendarDays|event\.date)[^"]*"/g) || [];

  check(
    `${theme}/WeddingEvents: lịch chỉ sự kiện đầu`,
    calIfs.every((v) => v.includes("index === 0"))
  );

  const linkIfs = events.match(/v-if="[^"]*calendarUrl[^"]*"/g) || [];

  check(
    `${theme}/WeddingEvents: link lịch chỉ sự kiện đầu`,
    linkIfs.every((v) => v.includes("index === 0")) &&
      (/v-if="index === 0"\s*\n\s*:href="event\.calendarUrl/.test(events) ||
        linkIfs.length > 0 ||
        !events.includes("calendarUrl"))
  );
}

check("MapPanel deleted", !fs.existsSync("src/components/editor/panels/MapPanel.vue"));

const mapFiles = fs
  .readdirSync("src/page")
  .flatMap((dir) => {
    const p = `src/page/${dir}/WeddingMap.vue`;
    return fs.existsSync(p) ? [p] : [];
  });

check("26 WeddingMap deleted", mapFiles.length === 0);

/* =========================================================
   1b. STATIC — 4 LOẠI GAME + QUÀ
========================================================= */

const gameDataSrc = fs.readFileSync("src/data/gameData.js", "utf8");

check(
  "gameData: 4 loại game",
  ["lucky-wheel", "couple-quiz", "scratch-card", "memory-match"].every((t) =>
    gameDataSrc.includes(`"${t}"`)
  )
);

const gameSectionSrc = fs.readFileSync("src/components/common/GameSection.vue", "utf8");

check(
  "GameSection: render đủ 4 game + PrizeClaim",
  ["LuckyWheel", "CoupleQuiz", "ScratchCard", "MemoryMatch", "PrizeClaim"].every(
    (c) => gameSectionSrc.includes(c)
  )
);

const gamePanelSrc = fs.readFileSync(
  "src/components/editor/panels/GamePanel.vue",
  "utf8"
);

check(
  "GamePanel: chọn được 4 loại + cấu hình quà",
  ["couple-quiz", "memory-match", "gamePrizes", "gameQuestions", "gameImages"].every(
    (k) => gamePanelSrc.includes(k)
  )
);

const manageSrc = fs.readFileSync("src/views/Manage.vue", "utf8");

check(
  "Manage: modal winners + gọi getGameWinners",
  manageSrc.includes("winnersTarget") && manageSrc.includes("getGameWinners")
);

const apiSrc = fs.readFileSync("src/model/api.js", "utf8");

check(
  "api.js: claimGamePrize + getGameWinners",
  apiSrc.includes("claimGamePrize") && apiSrc.includes("getGameWinners")
);

const shapeSrc = fs.readFileSync("src/utils/weddingShape.js", "utf8");

check(
  "weddingShape: back-fill quà / câu hỏi / ảnh",
  ["gamePrizes", "gameQuestions", "gameImages"].every((k) => shapeSrc.includes(k))
);

/* =========================================================
   3. PURE UTILS (chạy trước khi spin up Vite)
========================================================= */

const yt1 = parseVideoUrl("https://www.youtube.com/watch?v=PggDHkV0nGU");
check("parse: youtube watch", yt1?.provider === "youtube" && yt1.videoId === "PggDHkV0nGU");

const yt2 = parseVideoUrl("https://youtu.be/PggDHkV0nGU?t=5");
check("parse: youtu.be", yt2?.videoId === "PggDHkV0nGU");

const yt3 = parseVideoUrl("https://www.youtube.com/shorts/abc123XYZ_-");
check("parse: shorts", yt3?.videoId === "abc123XYZ_-");

const tt = parseVideoUrl("https://www.tiktok.com/@user/video/7301234567890123456");
check("parse: tiktok", tt?.provider === "tiktok" && tt.videoId === "7301234567890123456");

check("parse: garbage → null", parseVideoUrl("https://example.com/random") === null);
check("parse: empty → null", parseVideoUrl("") === null);

const evCoords = { Map: "https://maps.google.com/?q=21.123456,105.123456" };
check(
  "mapEmbed: coords",
  mapEmbedUrl(evCoords).includes("q=21.123456,105.123456")
);

const evEmbed = { Map: "https://www.google.com/maps/embed?pb=XYZ&output=embed" };
check("mapEmbed: output=embed passthrough", mapEmbedUrl(evEmbed) === evEmbed.Map);

const evAddr = { Location: "Tư gia nhà gái", Address: "Bắc Ninh" };
check("mapEmbed: address fallback", mapEmbedUrl(evAddr).includes("q=") && mapEmbedUrl(evAddr).includes("output=embed"));

check("mapEmbed: empty", mapEmbedUrl({}) === "");

check(
  "directions: raw Map passthrough",
  mapDirectionsUrl(evCoords) === evCoords.Map
);

check(
  "directions: from address",
  mapDirectionsUrl(evAddr).includes("destination=")
);

/* --- Pure: game helpers --- */

const { gameTypeMeta, pickRandomPrize, GAME_TYPES } = await import(
  "../src/data/gameData.js"
);

check("game: 4 GAME_TYPES", GAME_TYPES.length === 4);

check(
  "game: gameTypeMeta fallback vòng quay",
  gameTypeMeta("không-biết").value === "lucky-wheel" &&
    gameTypeMeta("couple-quiz").label === "Trắc nghiệm về cặp đôi"
);

check(
  "game: pickRandomPrize",
  pickRandomPrize(["A", "B"]).length > 0 && pickRandomPrize([]) === ""
);

/* =========================================================
   2. SSR CHECKS
========================================================= */

const { createServer } = await import("vite");

const stubCss = {
  name: "stub-css",
  enforce: "pre",
  load(id) {
    if (id.endsWith(".css")) return "";
  },
};

async function renderTheme(wedding, themeName = "ChampagneBlush") {
  const viteServer = await createServer({
    root,
    logLevel: "error",
    plugins: [stubCss],
    cacheDir: "node_modules/.vite-verify-new-sections",
    optimizeDeps: { noDiscovery: true, include: [] },
    ssr: { noExternal: ["vuetify"] },
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });

  const mod = await viteServer.ssrLoadModule(`/src/themes/${themeName}.vue`);
  const mock = (await viteServer.ssrLoadModule("/src/mock/wedding.json")).default;

  const data = wedding || mock.find((w) => w.slug === "minh-anh-quoc-huy");

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }],
  });

  const app = createSSRApp({
    render: () => h(mod.default, { wedding: data, startOpened: true }),
  });

  app.use(createPinia());
  app.use(router);
  app.use(createVuetify());

  const html = await renderToString(app);
  await viteServer.close();
  return { html, mock };
}

/* --- Base: flags off → không marker mới --- */

const { mock } = await renderTheme(null);

const base = mock.find((w) => w.slug === "thu-ha-minh-quan");

{
  /*
   * Mock đã điền sẵn video/game cho mọi mẫu (yêu cầu "tất cả
   * thiệp đều có đầy đủ nội dung") — nên phải TẮT cờ tại đây
   * mới kiểm tra được nhánh ẩn.
   */
  const off = JSON.parse(JSON.stringify(base));

  off.settings.ShowVideo = false;
  off.settings.ShowGame = false;

  const { html } = await renderTheme(off);

  check("base: no video section", !html.includes("video-section"));
  check("base: no game section", !html.includes("game-section"));
  check("base: no milestone", !html.includes("milestone"));
}

/* --- Mọi mẫu thiệp đều có đủ nội dung video + game --- */

check(
  "mock: 26 mẫu đủ video + game",
  mock.length === 26 &&
    mock.every(
      (w) =>
        (w.video?.Url || "").trim() &&
        w.settings?.ShowVideo === true &&
        w.settings?.ShowGame === true
    )
);

/* --- Feature: bật đủ video + game + milestones --- */

{
  const feature = JSON.parse(JSON.stringify(base));

  feature.settings.ShowVideo = true;
  feature.video = {
    Enabled: true,
    Url: "https://www.youtube.com/watch?v=PggDHkV0nGU",
    Title: "Video cưới",
  };

  feature.settings.ShowGame = true;
  feature.game = { Enabled: true, GameType: "lucky-wheel", Title: "Vòng quay" };

  feature.story.Mode = "milestones";
  feature.storyMilestones = [
    { Id: 1, Date: "2018", Title: "Gặp nhau", Description: "Mô tả 1", Image: "" },
    { Id: 2, Date: "2020", Title: "Tỏ tình", Description: "Mô tả 2", Image: "" },
  ];

  const { html } = await renderTheme(feature);

  check("feature: video section", html.includes("video-section"));
  check(
    "feature: video iframe hiện ngay (autoplay + mute)",
    html.includes("youtube.com/embed/PggDHkV0nGU") &&
      html.includes("autoplay=1") &&
      html.includes("mute=1")
  );
  check("feature: game section", html.includes("game-section"));
  check("feature: wheel", html.includes("wheel"));
  check("feature: milestone 1", html.includes("Gặp nhau"));
  check("feature: milestone 2", html.includes("Tỏ tình"));
  check("feature: no story text block", !html.includes("Từ những người bạn"));
}

/* --- EventMap: chỉ MỘT bản đồ cho cả mục sự kiện --- */

{
  const withMap = JSON.parse(JSON.stringify(base));

  withMap.settings.ShowMap = true;

  /* Nhân đôi sự kiện — trước đây mỗi sự kiện render 1 lịch + 1 map */
  withMap.events = [
    ...withMap.events,
    { ...withMap.events[0], Id: 999, Title: "Tiệc nhà trai" },
  ];

  const { html } = await renderTheme(withMap);

  const mapCount = (html.match(/class="event-map"/g) || []).length;
  const calCount = (html.match(/calendar-days|calendar__days|calendarDays/g) || [])
    .length;

  check(
    `feature: 2 sự kiện → 1 EventMap (${mapCount})`,
    mapCount === 1
  );

  check(
    `feature: 2 sự kiện → 1 lịch tháng (${calCount})`,
    calCount === 1
  );

  check(
    "feature: 2 sự kiện vẫn hiện đủ tiêu đề",
    html.includes("Tiệc nhà trai")
  );
}

/* --- 4 loại game: SSR render đúng component --- */

{
  /* Trắc nghiệm — có câu hỏi, không quà (chế độ vui) */
  const quiz = JSON.parse(JSON.stringify(base));

  quiz.settings.ShowGame = true;
  quiz.game = { Enabled: true, GameType: "couple-quiz", Title: "" };
  quiz.gameQuestions = [
    {
      Id: 1,
      Question: "Hai người gặp nhau ở đâu?",
      OptionA: "Ở trường",
      OptionB: "Qua bạn bè",
      OptionC: "Trong chuyến đi",
      OptionD: "Tại chỗ làm",
      CorrectIndex: 1,
    },
  ];

  const { html } = await renderTheme(quiz);

  check(
    "game: couple-quiz render câu hỏi",
    html.includes("couple-quiz") && html.includes("Hai người gặp nhau ở đâu?")
  );
}

{
  /* Trắc nghiệm KHÔNG câu hỏi → fallback vòng quay (không mục chết) */
  const noQuiz = JSON.parse(JSON.stringify(base));

  noQuiz.settings.ShowGame = true;
  noQuiz.game = { Enabled: true, GameType: "couple-quiz", Title: "" };
  noQuiz.gameQuestions = [];

  const { html } = await renderTheme(noQuiz);

  check(
    "game: quiz thiếu câu hỏi → fallback wheel",
    html.includes("lucky-wheel")
  );
}

{
  /* Cào trúng thưởng — chế độ quà */
  const scratch = JSON.parse(JSON.stringify(base));

  scratch.settings.ShowGame = true;
  scratch.game = { Enabled: true, GameType: "scratch-card", Title: "" };
  scratch.gamePrizes = [
    { Id: 1, Title: "Thiệp cảm ơn", Description: "" },
    { Id: 2, Title: "Hộp kẹo dâu", Description: "" },
  ];

  const { html } = await renderTheme(scratch);

  check(
    "game: scratch-card render",
    html.includes("scratch-card") && html.includes("CÀO ĐỂ NHẬN QUÀ")
  );
}

{
  /* Ghép hình — ảnh riêng */
  const memory = JSON.parse(JSON.stringify(base));

  memory.settings.ShowGame = true;
  memory.game = { Enabled: true, GameType: "memory-match", Title: "" };
  memory.gameImages = [
    { Id: 1, Image: "https://example.com/a.jpg" },
    { Id: 2, Image: "https://example.com/b.jpg" },
  ];

  const { html } = await renderTheme(memory);

  check(
    "game: memory-match render",
    html.includes("memory-match") && html.includes("Nước đi")
  );
}

{
  /* Vòng quay chế độ quà — title quà nằm trên vòng */
  const wheelPrize = JSON.parse(JSON.stringify(base));

  wheelPrize.settings.ShowGame = true;
  wheelPrize.game = { Enabled: true, GameType: "lucky-wheel", Title: "" };
  wheelPrize.gamePrizes = [
    { Id: 1, Title: "Thiệp cảm ơn", Description: "" },
    { Id: 2, Title: "Voucher cà phê", Description: "" },
  ];

  const { html } = await renderTheme(wheelPrize);

  check(
    "game: wheel prize mode — quà trên vòng",
    html.includes("lucky-wheel") &&
      html.includes("Thiệp cảm ơn") &&
      html.includes("Voucher cà phê")
  );
}

/* --- Cả 26 theme render đủ video + game + map --- */

{
  const full = JSON.parse(JSON.stringify(mock.find((w) => w.slug === "thu-ha-minh-quan")));

  /* 2 sự kiện — kiểm tra lịch/map không bị nhân đôi ở MỌI theme */
  full.events = [
    ...full.events,
    { ...full.events[0], Id: 999, Title: "Tiệc nhà trai" },
  ];

  /*
   * 2 sự kiện — kiểm tra lịch/map không bị nhân đôi ở MỌI theme.
   * (Vài theme không in event.Title nên không assert tiêu đề ở đây;
   *  việc render đủ sự kiện đã có check tĩnh v-for + check
   *  "2 sự kiện vẫn hiện đủ tiêu đề" ở theme đại diện.)
   */
  const broken = [];

  for (const theme of THEMES) {
    const { html } = await renderTheme(full, theme);

    const ok =
      html.includes("video-section") &&
      html.includes("youtube.com/embed/") &&
      html.includes("autoplay=1") &&
      html.includes("mute=1") &&
      html.includes("game-section") &&
      html.includes("wheel") &&
      (html.match(/class="event-map"/g) || []).length === 1;

    if (!ok) broken.push(theme);
  }

  check(
    `26 theme: 2 sự kiện → 1 map, đủ video + game${broken.length ? ` — lỗi: ${broken.join(", ")}` : ""}`,
    broken.length === 0
  );
}

console.log(failed ? `\n${failed} FAIL` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
