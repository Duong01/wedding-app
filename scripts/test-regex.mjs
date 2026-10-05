/* Test regex trên dòng lỗi thật */
const line = `      <img :src="chuHy" :alt="$t('Chữ Hỷ') class="tr-hero__band-mark" />`;

// Thử nhiều pattern
const patterns = [
  /(:[\w-]+)="(\$t\('[^']*'?)(\s+\w[\w-]*=)/,
  /(:[\w-]+)="(\$t\([^"]*?)(\s+[\w-]+=)/,
  /(:[\w-]+)="(\$t\(.*?)(\s+[\w-]+=)/,
];

for (const re of patterns) {
  const m = line.match(re);
  console.log(re.source.slice(0, 40), "→", m ? "MATCH" : "null");
  if (m) {
    console.log("  groups:", JSON.stringify(m.slice(1)));
  }
}

