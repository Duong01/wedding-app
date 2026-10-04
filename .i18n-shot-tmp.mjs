// Tạm: chụp trang theo từng ngôn ngữ + gom lỗi console / chữ tiếng Việt còn sót.
import { spawn } from "node:child_process";
import fs from "node:fs";
const [OUT, PATH_, ...LOCALES] = process.argv.slice(2);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const W = +(process.env.W || 1366), H = +(process.env.H || 900);
const proc = spawn(CHROME, ["--headless=new", "--remote-debugging-port=9341", `--window-size=${W},${H}`, "--hide-scrollbars", `--user-data-dir=${OUT}/profile9`, "about:blank"]);
await new Promise((r) => setTimeout(r, 4500));
const list = await (await fetch("http://127.0.0.1:9341/json")).json();
const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const logs = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === "Runtime.exceptionThrown") logs.push("EXC " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 300)); if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") logs.push("ERR " + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 300)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 600 });
for (const loc of LOCALES) {
  await send("Page.navigate", { url: "http://localhost:5199/" }); await sleep(1500);
  await ev(`localStorage.setItem('thiepduyen-locale','${loc}')`);
  logs.length = 0;
  await send("Page.navigate", { url: `http://localhost:5199${PATH_}` }); await sleep(6000);
  if (process.env.CLICK) { await ev(`(()=>{ const el=[...document.querySelectorAll('${process.env.CLICK}')][${process.env.IDX || 0}]; el && el.click(); })()`); await sleep(1500); }
  const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 60 });
  const name = PATH_.replace(/[^a-z0-9]+/gi, "_");
  fs.writeFileSync(`${OUT}/i18n-${name}-${process.env.TAG || ""}${loc}.jpg`, Buffer.from(shot.result.data, "base64"));
  // chữ tiếng Việt còn hiển thị (bỏ nội dung thiệp trong iframe preview)
  const vi = await ev(`(()=>{ const VI=/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i; const out=new Set(); const w=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while(w.nextNode()){ const n=w.currentNode; const t=n.textContent.trim(); if(t && VI.test(t) && n.parentElement && n.parentElement.offsetParent!==null) out.add(t.slice(0,70)); } document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{ for (const a of ['placeholder','title','aria-label']){ const v=el.getAttribute(a); if(v && VI.test(v)) out.add('@'+a+': '+v.slice(0,60)); } }); return [...out]; })()`);
  console.log(`== ${loc} ${PATH_}  errors=${logs.length}`);
  logs.slice(0, 5).forEach((l) => console.log("   " + l));
  if (loc !== "vi") (vi || []).slice(0, 40).forEach((t) => console.log("   VI> " + t));
}
ws.close(); proc.kill();
