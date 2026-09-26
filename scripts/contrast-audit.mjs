/*
 * Phân tích độ tương phản màu chữ trong các component của theme.
 * Mỗi rule CSS có `color` + `background` → tính tỷ lệ tương phản WCAG.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function luminance(hex) {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg, bg) {
  try {
    const l1 = luminance(fg);
    const l2 = luminance(bg);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (hi + 0.05) / (lo + 0.05);
  } catch {
    return null;
  }
}

const themesDir = "src/page";
const themes = readdirSync(themesDir).filter((t) => {
  try {
    return readdirSync(join(themesDir, t)).some((f) => f.endsWith(".vue"));
  } catch {
    return false;
  }
});

for (const theme of themes.sort()) {
  const files = readdirSync(join(themesDir, theme)).filter((f) => f.endsWith(".vue"));
  const findings = [];

  for (const file of files) {
    const src = readFileSync(join(themesDir, theme, file), "utf8");

    // tách các rule CSS: selector { ... }
    const ruleRe = /([^{}]+)\{([^{}]+)\}/g;
    let m;
    while ((m = ruleRe.exec(src))) {
      const body = m[1];
      const decls = m[2];

      if (decls.includes("var(")) continue; // chỉ phân tích hex cứng

      const colorM = decls.match(/(?:^|;)\s*color:\s*(#[0-9a-fA-F]{3,8})\s*;/);
      const bgM = decls.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{3,8})\s*;/);

      if (colorM && bgM) {
        const ratio = contrast(colorM[1], bgM[1]);
        if (ratio !== null && ratio < 4.5) {
          findings.push(`${file}: ${body.trim().slice(0, 40)} → ${colorM[1]} trên ${bgM[1]} = ${ratio.toFixed(2)}:1`);
        }
      }
    }
  }

  if (findings.length) {
    console.log(`\n=== ${theme} ===`);
    findings.forEach((f) => console.log("  " + f));
  }
}
