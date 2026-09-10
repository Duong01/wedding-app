<template>
  <main class="landing-page">
    <section class="hero-shell">
      <div class="hero-content container">
        <div class="hero-copy">
          <div class="eyebrow">Ngày Chung Đôi</div>
          <h1>Tạo thiệp cưới đẹp, đúng phong cách, và mang cảm xúc của hai bạn.</h1>
          <p>
            Khởi đầu từ mẫu thiết kế hiện có, bạn có thể lựa chọn layout, theme,
            typography và nội dung theo đúng phong cách gia đình, lễ cưới và câu chuyện yêu thương.
          </p>

          <div class="cta-row">
            <button class="primary" type="button" @click="scrollToGallery">
              Xem mẫu thiệp
            </button>
            <button class="secondary" type="button" @click="openCreateFlow">
              Tạo thiệp ngay
            </button>
          </div>

          <div class="hero-stats">
            <div>
              <strong>12+</strong>
              <span>Mẫu thiệp</span>
            </div>
            <div>
              <strong>3x</strong>
              <span>Nhanh hơn</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Responsive</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-card glass-card">
            <div class="mini-card top-card">
              <span class="kicker">Wedding Invitation</span>
              <h3>Hà Uyên & Trần Hiếu</h3>
              <p>14.11.2026</p>
            </div>

            <div class="mini-card bottom-card">
              <div class="dot" />
              <div>
                <span>Elegant Gold</span>
                <small>Theme</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section container">
      <div class="section-heading">
        <span class="eyebrow muted">Tính năng</span>
        <h2>Hệ thống thiệp cưới được xây dựng để làm việc thật nhanh, đẹp thật hiệu quả.</h2>
      </div>

      <div class="feature-grid">
        <article class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="steps-section container">
      <div class="section-heading align-left">
        <span class="eyebrow muted">Cách sử dụng</span>
        <h2>Chỉ với 3 bước, bạn đã có một thiệp cưới hoàn chỉnh.</h2>
      </div>

      <div class="steps-grid">
        <article class="step-card" v-for="(step, index) in steps" :key="step.title">
          <span class="step-index">0{{ index + 1 }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </article>
      </div>
    </section>

    <section id="gallery" class="templates-section container">
      <div class="section-heading split">
        <div>
          <span class="eyebrow muted">Mẫu thiệp</span>
          <h2>Chọn một phong cách phù hợp với ngày trọng đại của bạn.</h2>
        </div>

        <div class="controls">
          <div class="filter-theme">
            <label>Chủ đề</label>
            <select v-model="selectedTheme">
              <option value="">Tất cả</option>
              <option v-for="t in themes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div class="search">
            <input
              type="search"
              placeholder="Tìm theo tên"
              v-model="q"
            />
          </div>
        </div>
      </div>

      <div v-if="store.loading" class="loading">Đang tải...</div>
      <div v-else-if="store.error" class="error-message">{{ store.error }}</div>
      <div v-else-if="weddings.length === 0" class="empty-message">Chưa có mẫu thiệp cưới nào.</div>

      <v-row v-else class="template-grid">
        <v-col
          v-for="wedding in filteredWeddings"
          :key="wedding.id || wedding.slug || wedding.Id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <article class="wedding-card" @click="openWedding(wedding)">
            <div class="wedding-cover">
              <img
                :src="wedding.coverImage"
                :alt="getCoupleName(wedding)"
                loading="lazy"
                @error="handleImageError"
              />

              <div class="cover-overlay">
                <span>Xem thiệp</span>
              </div>
            </div>

            <div class="wedding-info">
              <div class="badge-row">
                <span class="theme-badge">{{ getThemeLabel(wedding) }}</span>
              </div>

              <h3>
                {{ wedding.couple?.Bride?.Name || "" }}
                &
                {{ wedding.couple?.Groom?.Name || "" }}
              </h3>

              <p>{{ formatDate(wedding.weddingDate) }}</p>

              <button type="button" @click.stop="openWedding(wedding)">Xem thiệp</button>
            </div>
          </article>
        </v-col>
      </v-row>
    </section>

    <section class="cta-section container">
      <div class="cta-box">
        <div>
          <span class="eyebrow muted">Tạo thiệp của riêng bạn</span>
          <h2>Thiết kế thiệp cưới theo cá tính của hai bạn.</h2>
        </div>

        <button type="button" class="primary" @click="openCreateFlow">Bắt đầu ngay</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useWeddingStore } from "@/stores/wedding";

const router = useRouter();
const store = useWeddingStore();

const q = ref("");
const selectedTheme = ref("");

const features = [
  {
    icon: "✦",
    title: "Template đa dạng",
    text: "Mỗi mẫu thiệp đều theo phong cách riêng, từ cổ điển, sang trọng đến hiện đại và romantics.",
  },
  {
    icon: "⚙️",
    title: "Editor linh hoạt",
    text: "Cập nhật nội dung, section, font, màu sắc và bố cục theo đúng cảm nhận của bạn.",
  },
  {
    icon: "📱",
    title: "Responsive tối ưu",
    text: "Thiệp hiển thị đẹp trên desktop, tablet và điện thoại với trải nghiệm mượt mà.",
  },
  {
    icon: "🎵",
    title: "Tùy chọn âm nhạc",
    text: "Thêm nhịp điệu, âm thanh và những chi tiết riêng để thiệp có cảm xúc đậm hơn.",
  },
];

const steps = [
  {
    title: "Chọn mẫu",
    text: "Duyệt qua các mẫu thiệp theo phong cách mà bạn thích ở danh sách dưới đây.",
  },
  {
    title: "Điều chỉnh",
    text: "Chỉnh chữ, theme, màu, font và các phần như story, gallery, gifts, map.",
  },
  {
    title: "Chia sẻ",
    text: "Lưu và gửi cho khách mời ngay sau khi thiệp đã sẵn sàng để hiển thị.",
  },
];

const weddings = computed(() => store.weddings || []);

const themes = computed(() => {
  const set = new Set();

  (store.weddings || []).forEach((w) => {
    const t = w.theme?.Name || w.theme || "";
    if (t) set.add(t);
  });

  return Array.from(set).sort();
});

const filteredWeddings = computed(() => {
  let list = weddings.value || [];

  if (selectedTheme.value) {
    list = list.filter((w) => {
      const t = w.theme?.Name || w.theme || "";
      return t === selectedTheme.value;
    });
  }

  if (q.value && q.value.trim()) {
    const keyword = q.value.trim().toLowerCase();
    list = list.filter((w) => {
      const bride = (w.couple?.Bride?.Name || "").toLowerCase();
      const groom = (w.couple?.Groom?.Name || "").toLowerCase();
      return bride.includes(keyword) || groom.includes(keyword);
    });
  }

  return list;
});

onMounted(async () => {
  await store.loadWeddings();
});

function scrollToGallery() {
  router.push({ name: "Templates" });
}

function openCreateFlow() {
  router.push({ name: "Editor" });
}

function getCoupleName(wedding) {
  const bride = wedding?.couple?.Bride?.Name || "";
  const groom = wedding?.couple?.Groom?.Name || "";
  return `${bride} & ${groom}`;
}

function getThemeLabel(wedding) {
  return wedding?.theme?.Name || wedding?.theme || "Classic";
}

function handleImageError(event) {
  event.target.src = "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80";
}

function openWedding(wedding) {
  router.push({
    name: "WeddingBySlug",
    params: { slug: wedding.slug },
  });
}

function formatDate(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}
</script>

<style scoped>
.container {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
}

.landing-page {
  background:
    radial-gradient(circle at top left, rgba(201, 166, 107, 0.12), transparent 28%),
    linear-gradient(180deg, #fffaf7 0%, #fffdfb 38%, #fff7f1 100%);
  color: #2f1d1d;
}

.hero-shell {
  padding: 72px 0 24px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 48px;
  align-items: center;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  color: #a76d37;
  font-size: 12px;
  letter-spacing: 0.24em;
  font-weight: 700;
  text-transform: uppercase;
}

.eyebrow.muted {
  color: #7d5a52;
}

.hero-copy h1 {
  margin: 0;
  max-width: 600px;
  color: #1d1717;
  font-family: var(--font-heading);
  font-size: clamp(44px, 6vw, 72px);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.hero-copy p {
  max-width: 620px;
  margin-top: 20px;
  color: #5d4b4b;
  font-size: 18px;
  line-height: 1.8;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}

button.primary,
button.secondary {
  border: none;
  border-radius: 999px;
  padding: 15px 26px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

button.primary {
  background: linear-gradient(135deg, #1f1a1a, #5f3a3d);
  color: #fff;
  box-shadow: 0 18px 36px rgba(72, 44, 44, 0.22);
}

button.secondary {
  background: rgba(255, 255, 255, 0.7);
  color: #3f2a2a;
  border: 1px solid rgba(70, 48, 48, 0.1);
}

button.primary:hover,
button.secondary:hover {
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 38px;
}

.hero-stats div {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.hero-stats strong {
  font-size: 28px;
  color: #201718;
}

.hero-stats span {
  color: #7a605f;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.hero-card {
  position: relative;
  width: min(440px, 100%);
  min-height: 520px;
  border-radius: 32px;
  background: linear-gradient(160deg, rgba(255,255,255,0.74), rgba(250,243,235,0.82));
  border: 1px solid rgba(94, 68, 68, 0.08);
  box-shadow: 0 28px 90px rgba(59, 34, 30, 0.14);
  overflow: hidden;
}

.hero-card::before {
  content: "";
  position: absolute;
  inset: 30px 40px auto auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,166,107,0.22), transparent 70%);
}

.glass-card {
  padding: 30px;
}

.mini-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(90, 58, 58, 0.05);
  box-shadow: 0 18px 35px rgba(42, 28, 28, 0.08);
  backdrop-filter: blur(8px);
}

.top-card {
  left: 36px;
  right: 36px;
  top: 44px;
  padding: 30px 22px;
  border-radius: 30px;
  text-align: center;
}

.kicker {
  color: #8c6a5f;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.top-card h3 {
  margin: 14px 0 6px;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.1;
  color: #2a1c1d;
  font-family: var(--font-heading);
}

.top-card p {
  margin: 0;
  color: #7a5d58;
}

.bottom-card {
  left: 52px;
  right: 52px;
  bottom: 42px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 18px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d7b576, #a86b40);
  box-shadow: 0 0 0 7px rgba(215, 181, 118, 0.14);
}

.bottom-card span {
  display: block;
  font-weight: 700;
  color: #2a1d1d;
}

.bottom-card small {
  color: #7a655d;
}

.features-section,
.steps-section,
.templates-section,
.cta-section {
  padding: 48px 0 30px;
}

.section-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 28px;
}

.section-heading.align-left {
  align-items: flex-start;
  text-align: left;
}

.section-heading.split {
  align-items: end;
  justify-content: space-between;
  flex-direction: row;
  text-align: left;
  gap: 16px;
}

.section-heading h2 {
  max-width: 760px;
  margin: 0;
  color: #221819;
  font-family: var(--font-heading);
  font-size: clamp(30px, 4vw, 50px);
  line-height: 1.05;
}

.feature-grid,
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.feature-card,
.step-card {
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(102, 74, 74, 0.06);
  border-radius: 26px;
  padding: 28px 22px;
  box-shadow: 0 18px 40px rgba(88, 64, 58, 0.06);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(201,166,107,0.2), rgba(157,91,80,0.12));
  font-size: 24px;
}

.feature-card h3,
.step-card h3 {
  margin: 0 0 10px;
  color: #1d1919;
  font-family: var(--font-heading);
  font-size: 26px;
}

.feature-card p,
.step-card p {
  margin: 0;
  color: #5f4d4c;
  line-height: 1.7;
}

.steps-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.step-index {
  display: inline-flex;
  margin-bottom: 14px;
  color: #a36c48;
  font-size: 12px;
  letter-spacing: 0.14em;
  font-weight: 700;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
}

.filter-theme,
.search {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-theme label {
  font-size: 13px;
  font-weight: 600;
  color: #5c4b4d;
}

.controls select,
.controls input[type="search"] {
  min-height: 42px;
  padding: 9px 14px;
  border: 1px solid rgba(82, 53, 53, 0.08);
  border-radius: 999px;
  background: rgba(255,255,255,0.8);
  color: #2f1d1d;
}

.controls input[type="search"] {
  min-width: 220px;
}

.template-grid {
  margin-top: 24px;
}

.wedding-card {
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border: 1px solid rgba(205, 166, 152, 0.18);
  border-radius: 24px;
  box-shadow: 0 15px 45px rgba(93, 61, 54, 0.08);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.wedding-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 60px rgba(93, 61, 54, 0.15);
}

.wedding-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #f5eeee;
}

.wedding-cover img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.wedding-card:hover .wedding-cover img {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background: rgba(67, 35, 40, 0.35);
  transition: opacity 0.35s ease;
}

.wedding-card:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay span {
  padding: 11px 22px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.7);
  border-radius: 999px;
}

.wedding-info {
  padding: 20px;
}

.badge-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.theme-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  background: rgba(201,166,107,0.12);
  border-radius: 999px;
  color: #7d5a2b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.wedding-info h3 {
  margin: 0 0 8px;
  color: #4d3537;
  font-family: var(--font-heading);
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 600;
  text-align: left;
}

.wedding-info p {
  margin: 0 0 18px;
  color: #a16f76;
  font-size: 14px;
  text-align: left;
}

.wedding-info button {
  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, #c97885, #ad5d6d);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.loading,
.error-message,
.empty-message {
  margin-top: 24px;
  padding: 26px 20px;
  border-radius: 18px;
  text-align: center;
}

.loading {
  background: rgba(255,255,255,0.5);
  color: #6d5454;
}

.error-message {
  background: #fff0f2;
  color: #b64c5f;
}

.empty-message {
  background: rgba(255,255,255,0.45);
  color: #6a4c4d;
}

.cta-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 32px 36px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(34, 20, 20, 1), rgba(76, 52, 46, 0.96));
  color: #fff;
  box-shadow: 0 28px 60px rgba(29, 19, 19, 0.18);
}

.cta-box h2 {
  margin: 0;
  color: #fff;
  font-family: var(--font-heading);
  font-size: clamp(30px, 3vw, 48px);
  line-height: 1.1;
}

@media (max-width: 980px) {
  .hero-content,
  .feature-grid,
  .steps-grid {
    grid-template-columns: 1fr 1fr;
  }

  .hero-content {
    grid-template-columns: 1fr;
  }

  .section-heading.split {
    flex-direction: column;
    align-items: flex-start;
  }

  .controls {
    justify-content: flex-start;
  }
}

@media (max-width: 700px) {
  .hero-shell {
    padding-top: 48px;
  }

  .feature-grid,
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .cta-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .controls {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
  }

  .controls select,
  .controls input[type="search"] {
    width: 100%;
  }
}
</style>