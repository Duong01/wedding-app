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

          <p class="trial-hint">
            <span class="trial-hint-icon">✦</span>
            Dùng thử 3 ngày miễn phí — ưng thì mới thanh toán
          </p>

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

    <section class="trial-section container">
      <div class="trial-box">
        <div class="trial-badge">
          <span class="trial-badge-icon">✦</span>

          Dùng thử 3 ngày
        </div>

        <h2>
          Dùng thử 3 ngày —
          <span>ưng thì mới thanh toán.</span>
        </h2>

        <p class="trial-desc">
          Tạo thiệp, chỉnh sửa thoải mái và xem trước toàn bộ thiệp trong 3
          ngày. Chỉ khi bạn thực sự ưng ý, thiệp mới được kích hoạt vĩnh viễn
          và chia sẻ cho khách mời. Không ràng buộc, không trả trước.
        </p>

        <div class="trial-steps">
          <div class="trial-step">
            <span class="trial-step-num">1</span>

            <div>
              <strong>Tạo & chỉnh sửa</strong>

              <p>
                Chọn mẫu, nhập nội dung — mọi tính năng đều mở trong thời gian
                dùng thử.
              </p>
            </div>
          </div>

          <div class="trial-step">
            <span class="trial-step-num">2</span>

            <div>
              <strong>Xem trước 3 ngày</strong>

              <p>
                Kiểm tra thiệp trên điện thoại, máy tính, gửi cho người thân
                góp ý trước khi quyết định.
              </p>
            </div>
          </div>

          <div class="trial-step">
            <span class="trial-step-num">3</span>

            <div>
              <strong>Ưng thì thanh toán</strong>

              <p>
                Chỉ thanh toán khi bạn hài lòng. Thiệp được kích hoạt vĩnh
                viễn, không phát sinh chi phí.
              </p>
            </div>
          </div>
        </div>

        <div class="trial-note">
          <span class="trial-note-icon">♡</span>

          Miễn phí hoàn toàn trong 3 ngày đầu — không cần thẻ, không cần đặt
          cọc.
        </div>
      </div>
    </section>

    <section class="perks-section container">
      <div class="section-heading">
        <span class="eyebrow muted">Đãi ngộ</span>

        <h2>
          Tất cả những gì bạn nhận được
          <span class="heading-accent">khi tạo thiệp tại đây.</span>
        </h2>
      </div>

      <div class="perks-grid">
        <article
          v-for="perk in perks"
          :key="perk.title"
          class="perk-card"
        >
          <div class="perk-icon">{{ perk.icon }}</div>

          <h3>{{ perk.title }}</h3>

          <p>{{ perk.text }}</p>
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
      <div class="section-heading">
        <div>
          <span class="eyebrow muted">Mẫu thiệp</span>
          <h2>Chọn một phong cách phù hợp với ngày trọng đại của bạn.</h2>
        </div>
      </div>

      <div v-if="store.loading" class="loading">Đang tải...</div>
      <div v-else-if="store.error" class="error-message">{{ store.error }}</div>
      <div v-else-if="weddings.length === 0" class="empty-message">Chưa có mẫu thiệp cưới nào.</div>

      <div v-else class="template-grid">
        <article
          v-for="wedding in featuredWeddings"
          :key="wedding.id || wedding.slug || wedding.Id"
          class="wedding-card"
          @click="openWedding(wedding)"
        >
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
      </div>

      <div v-if="!store.loading && weddings.length > 0" class="templates-more">
        <button type="button" class="view-all-button" @click="goTemplates">
          Xem tất cả {{ weddings.length }} mẫu thiệp
          <span>→</span>
        </button>
      </div>
    </section>

    <section class="cta-section container">
      <div class="cta-box">
        <div>
          <span class="eyebrow muted">Tạo thiệp của riêng bạn</span>
          <h2>Thiết kế thiệp cưới theo cá tính của hai bạn.</h2>
          <p class="cta-sub">
            Dùng thử 3 ngày miễn phí — chỉ thanh toán khi bạn thực sự ưng ý.
          </p>
        </div>

        <button type="button" class="primary" @click="openCreateFlow">Bắt đầu ngay</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWeddingStore } from "@/stores/wedding";

const router = useRouter();
const store = useWeddingStore();

/*
 * Trang Home chỉ hiển thị đại diện (8 mẫu đầu) —
 * danh sách đầy đủ + bộ lọc/tìm kiếm nằm ở trang
 * "Mẫu thiệp" để trang chủ tải nhẹ và gọn gàng.
 */
const FEATURED_COUNT = 8;

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

const perks = [
  {
    icon: "💌",
    title: "Miễn phí 3 ngày",
    text: "Dùng thử toàn bộ tính năng 3 ngày, ưng thì mới thanh toán — không ràng buộc.",
  },
  {
    icon: "🎨",
    title: "17+ mẫu thiệp",
    text: "Từ truyền thống đỏ vàng đến hiện đại tối giản, luôn có mẫu hợp với gu của hai bạn.",
  },
  {
    icon: "✍️",
    title: "Chỉnh sửa dễ dàng",
    text: "Nhập tên, ngày cưới, sự kiện một lần — hiển thị đồng bộ khắp thiệp, không nhập lại.",
  },
  {
    icon: "📱",
    title: "Hiển thị mọi thiết bị",
    text: "Thiệp tự động chuẩn trên điện thoại, tablet và máy tính — khách mời mở là đẹp.",
  },
  {
    icon: "🗺️",
    title: "Bản đồ & lịch nhắc",
    text: "Chỉ đường đến địa điểm lễ và thêm sự kiện vào lịch điện thoại chỉ với một chạm.",
  },
  {
    icon: "🎁",
    title: "Mừng cưới online",
    text: "Quét QR chuyển khoản mừng cưới tiện lợi, khách mời không lo chuẩn bị phong bì.",
  },
  {
    icon: "📖",
    title: "Sổ lưu bút số",
    text: "Khách mời gửi lời chúc trực tiếp trên thiệp, hai bạn đọc lại mãi về sau.",
  },
  {
    icon: "🎵",
    title: "Nhạc nền thiệp",
    text: "Thêm bài hát ý nghĩa mở ra cùng thiệp, cảm xúc thêm phần trọn vẹn.",
  },
];

const weddings = computed(() => store.weddings || []);

const featuredWeddings = computed(() => {
  return weddings.value.slice(0, FEATURED_COUNT);
});

onMounted(async () => {
  await store.loadWeddings();
});

function scrollToGallery() {
  const target = document.getElementById("gallery");

  if (target) {
    target.scrollIntoView({ behavior: "smooth" });

    return;
  }

  router.push({ name: "Templates" });
}

function goTemplates() {
  router.push({ name: "Templates" });
}

function openCreateFlow() {
  router.push({ name: "Templates" });
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
    radial-gradient(circle at top left, rgba(201, 166, 89, 0.14), transparent 30%),
    radial-gradient(circle at 85% 12%, rgba(143, 77, 67, 0.08), transparent 32%),
    linear-gradient(180deg, #fffaf7 0%, #fffdfb 38%, #faf5ef 100%);
  color: #2f1d1d;
}

.hero-shell {
  padding: 84px 0 32px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 48px;
  align-items: center;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  color: #a3702f;
  font-size: 12px;
  letter-spacing: 0.24em;
  font-weight: 700;
  text-transform: uppercase;
}

.eyebrow::before {
  content: "";
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, #c9a659, transparent);
}

.eyebrow.muted {
  color: #8a6a55;
}

.hero-copy h1 {
  margin: 0;
  max-width: 600px;
  color: #241a1a;
  font-family: var(--font-heading);
  font-size: clamp(42px, 5.6vw, 68px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  font-weight: 600;
}

.hero-copy p {
  max-width: 620px;
  margin-top: 20px;
  color: #5d4b4b;
  font-size: 17px;
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
  padding: 15px 28px;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

button.primary {
  background: linear-gradient(135deg, #8f4d43, #6d3a34);
  color: #fff;
  box-shadow: 0 16px 34px rgba(109, 58, 52, 0.28);
}

button.secondary {
  background: rgba(255, 255, 255, 0.75);
  color: #6d3a34;
  border: 1px solid rgba(109, 58, 52, 0.22);
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
  font-family: var(--font-heading);
  font-size: 30px;
  color: #241a1a;
}

.hero-stats span {
  color: #7a605f;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.trial-hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0 0;
  padding: 9px 16px;
  border-radius: 999px;
  background: rgba(201, 166, 89, 0.14);
  color: #8a6a2f;
  font-size: 13px;
  font-weight: 600;
}

.trial-hint-icon {
  color: #c9a659;
  font-size: 12px;
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
  background: linear-gradient(160deg, rgba(255,255,255,0.78), rgba(250,243,235,0.85));
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
  background: radial-gradient(circle, rgba(201,166,89,0.24), transparent 70%);
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
  background: linear-gradient(135deg, #c9a659, #8f4d43);
  box-shadow: 0 0 0 7px rgba(201, 166, 89, 0.16);
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
.trial-section,
.perks-section,
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

.section-heading h2 {
  max-width: 760px;
  margin: 0;
  color: #221819;
  font-family: var(--font-heading);
  font-size: clamp(30px, 4vw, 50px);
  line-height: 1.05;
}

/* ==================================================
   TRIAL POLICY (3 ngày dùng thử)
================================================== */

.trial-section {
  padding-top: 30px;
}

.trial-box {
  position: relative;
  overflow: hidden;
  padding: 44px 40px;
  border-radius: 30px;
  background:
    radial-gradient(circle at 88% 12%, rgba(201, 166, 89, 0.2), transparent 42%),
    linear-gradient(135deg, #fffaf5, #fdf3e9);
  border: 1px solid rgba(201, 166, 89, 0.35);
  box-shadow: 0 24px 60px rgba(109, 58, 52, 0.1);
  text-align: center;
}

.trial-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #c9a659, #8f4d43);
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 10px 24px rgba(143, 77, 67, 0.28);
}

.trial-badge-icon {
  font-size: 13px;
}

.trial-box h2 {
  max-width: 640px;
  margin: 20px auto 0;
  color: #241a1a;
  font-family: var(--font-heading);
  font-size: clamp(28px, 3.6vw, 44px);
  line-height: 1.12;
}

.trial-box h2 span {
  color: #8f4d43;
}

.trial-desc {
  max-width: 620px;
  margin: 16px auto 0;
  color: #5d4b4b;
  font-size: 15.5px;
  line-height: 1.8;
}

.trial-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 32px;
  text-align: left;
}

.trial-step {
  display: flex;
  gap: 14px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(143, 77, 67, 0.1);
}

.trial-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c9a659, #8f4d43);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.trial-step strong {
  display: block;
  margin-bottom: 6px;
  color: #2a1d1d;
  font-size: 15px;
}

.trial-step p {
  margin: 0;
  color: #6d5a5a;
  font-size: 13.5px;
  line-height: 1.65;
}

.trial-note {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 28px;
  padding: 12px 22px;
  border-radius: 999px;
  background: rgba(143, 77, 67, 0.08);
  color: #6d3a34;
  font-size: 13.5px;
  font-weight: 600;
}

.trial-note-icon {
  color: #8f4d43;
  font-size: 15px;
}

/* ==================================================
   PERKS (đãi ngộ)
================================================== */

.perks-section .heading-accent {
  display: block;
  color: #8f4d43;
}

.perks-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.perk-card {
  padding: 26px 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(102, 74, 74, 0.06);
  box-shadow: 0 18px 40px rgba(88, 64, 58, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.perk-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 52px rgba(88, 64, 58, 0.12);
}

.perk-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(201, 166, 89, 0.22), rgba(143, 77, 67, 0.14));
  font-size: 24px;
}

.perk-card h3 {
  margin: 0 0 8px;
  color: #1d1919;
  font-family: var(--font-heading);
  font-size: 20px;
}

.perk-card p {
  margin: 0;
  color: #5f4d4c;
  font-size: 14px;
  line-height: 1.7;
}

/* ==================================================
   STEPS
================================================== */

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.feature-grid {
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
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(201,166,89,0.22), rgba(143,77,67,0.14));
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

.step-index {
  display: inline-flex;
  margin-bottom: 14px;
  color: #a3702f;
  font-size: 12px;
  letter-spacing: 0.14em;
  font-weight: 700;
}

.template-grid {
  margin-top: 24px;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 24px;
}

.templates-more {
  display: flex;

  justify-content: center;

  margin-top: 34px;
}

.view-all-button {
  display: inline-flex;

  align-items: center;

  gap: 9px;

  padding: 14px 30px;

  border: 1px solid rgba(109, 58, 52, 0.22);

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.75);

  color: #6d3a34;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.view-all-button span {
  transition: transform 0.25s ease;
}

.view-all-button:hover {
  transform: translateY(-2px);

  background: #fff;

  box-shadow: 0 14px 30px rgba(109, 58, 52, 0.16);
}

.view-all-button:hover span {
  transform: translateX(4px);
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
  background: rgba(201,166,89,0.14);
  border-radius: 999px;
  color: #8a6a2f;
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
  background: linear-gradient(135deg, #8f4d43, #6d3a34);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.wedding-info button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(109, 58, 52, 0.28);
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
  padding: 36px 40px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 85% 20%, rgba(201, 166, 89, 0.22), transparent 45%),
    linear-gradient(135deg, #3a2320, #6d3a34);
  color: #fff;
  box-shadow: 0 28px 60px rgba(29, 19, 19, 0.2);
}

.cta-box h2 {
  margin: 0;
  color: #fff;
  font-family: var(--font-heading);
  font-size: clamp(30px, 3vw, 46px);
  line-height: 1.1;
}

.cta-box .eyebrow.muted {
  color: rgba(255, 255, 255, 0.72);
}

.cta-sub {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
  line-height: 1.7;
}

.cta-box button.primary {
  background: #fff;
  color: #6d3a34;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
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

  .perks-grid {
    grid-template-columns: 1fr 1fr;
  }

  .trial-steps {
    grid-template-columns: 1fr;
  }

  .template-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .hero-shell {
    padding-top: 40px;
  }

  .hero-copy h1 {
    font-size: clamp(30px, 8vw, 38px);
  }

  .hero-copy p {
    margin-top: 14px;

    font-size: 15px;

    line-height: 1.65;
  }

  .eyebrow {
    margin-bottom: 12px;

    font-size: 11px;
  }

  .cta-row {
    flex-direction: column;

    gap: 10px;

    margin-top: 22px;
  }

  .cta-row button {
    width: 100%;

    padding: 13px 22px;
  }

  .trial-hint {
    align-items: flex-start;
    border-radius: 14px;
    font-size: 12.5px;
    line-height: 1.5;
  }

  .hero-stats {
    gap: 12px;

    margin-top: 26px;
  }

  .hero-stats div {
    min-width: 0;

    flex: 1;
  }

  .hero-stats strong {
    font-size: 22px;
  }

  .hero-stats span {
    font-size: 11px;
  }

  /*
   * Hero card ẩn trên mobile — chỉ là trang trí,
   * bỏ bớt để trang ngắn hơn, không phải vuốt nhiều.
   */
  .hero-visual {
    display: none;
  }

  /*
   * Thu gọn khoảng cách các section trên mobile.
   */
  .features-section,
  .trial-section,
  .perks-section,
  .steps-section,
  .templates-section,
  .cta-section {
    padding: 30px 0 18px;
  }

  .section-heading {
    margin-bottom: 18px;
  }

  .section-heading h2 {
    font-size: clamp(22px, 6vw, 30px);

    line-height: 1.15;
  }

  /*
   * Tính năng: lưới 2 cột gọn, card nhỏ lại.
   */
  .feature-grid {
    grid-template-columns: 1fr 1fr;

    gap: 10px;
  }

  .feature-card,
  .step-card {
    padding: 16px 14px;

    border-radius: 18px;
  }

  .feature-icon {
    width: 40px;

    height: 40px;

    margin-bottom: 10px;

    font-size: 19px;
  }

  .feature-card h3,
  .step-card h3 {
    margin-bottom: 6px;

    font-size: 15.5px;
  }

  .feature-card p,
  .step-card p {
    font-size: 12.5px;

    line-height: 1.55;
  }

  /*
   * Đãi ngộ: 2 cột gọn thay vì 1 cột dài.
   */
  .perks-grid {
    grid-template-columns: 1fr 1fr;

    gap: 10px;
  }

  .perk-card {
    padding: 16px 14px;

    border-radius: 18px;
  }

  .perk-icon {
    width: 40px;

    height: 40px;

    margin-bottom: 10px;

    font-size: 19px;
  }

  .perk-card h3 {
    margin-bottom: 6px;

    font-size: 15px;
  }

  .perk-card p {
    font-size: 12.5px;

    line-height: 1.55;
  }

  /*
   * 3 bước: dồn thành 1 cột nhưng card nhỏ gọn.
   */
  .steps-grid {
    gap: 10px;
  }

  .step-index {
    margin-bottom: 8px;

    font-size: 11px;
  }

  /*
   * Dùng thử 3 ngày: box + steps thu gọn.
   */
  .trial-box {
    padding: 26px 16px;
    border-radius: 20px;
  }

  .trial-box h2 {
    font-size: clamp(21px, 5.6vw, 28px);
  }

  .trial-desc {
    margin-top: 12px;

    font-size: 13.5px;

    line-height: 1.65;
  }

  .trial-steps {
    gap: 10px;

    margin-top: 20px;
  }

  .trial-step {
    padding: 14px 12px;

    gap: 10px;

    border-radius: 14px;
  }

  .trial-step-num {
    width: 28px;

    height: 28px;

    font-size: 12.5px;
  }

  .trial-step strong {
    margin-bottom: 4px;

    font-size: 13.5px;
  }

  .trial-step p {
    font-size: 12px;

    line-height: 1.55;
  }

  .trial-note {
    margin-top: 18px;

    padding: 10px 14px;

    font-size: 12px;

    text-align: left;
  }

  .trial-badge {
    padding: 7px 14px;

    font-size: 11px;
  }

  /*
   * Mẫu thiệp: 2 cột, ảnh thấp hơn, bớt khoảng trống.
   */
  .template-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 10px;

    margin-top: 14px;
  }

  .wedding-card {
    border-radius: 16px;
  }

  .wedding-cover {
    aspect-ratio: 3 / 4;
  }

  .wedding-info {
    padding: 10px 12px 12px;
  }

  .badge-row {
    margin-bottom: 6px;
  }

  .theme-badge {
    padding: 4px 8px;

    font-size: 9.5px;
  }

  .wedding-info h3 {
    margin-bottom: 4px;

    font-size: 14px;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
  }

  .wedding-info p {
    margin-bottom: 10px;

    font-size: 11.5px;
  }

  .wedding-info button {
    padding: 9px 12px;

    font-size: 12px;
  }

  .templates-more {
    margin-top: 20px;
  }

  .view-all-button {
    width: 100%;

    justify-content: center;

    padding: 12px 20px;

    font-size: 13px;
  }

  /*
   * CTA cuối trang thu gọn.
   */
  .cta-box {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 18px;

    border-radius: 20px;
  }

  .cta-box h2 {
    font-size: clamp(20px, 5.4vw, 26px);
  }

  .cta-sub {
    margin-top: 8px;

    font-size: 13px;

    line-height: 1.6;
  }

  .cta-box button.primary {
    width: 100%;

    margin-top: 4px;

    padding: 13px 20px;
  }
}

@media (max-width: 420px) {
  .hero-stats {
    gap: 10px;
  }

  .hero-stats div {
    min-width: 0;
  }

  .trial-step {
    padding: 12px 10px;
    gap: 9px;
  }

  /*
   * Màn nhỏ: vẫn giữ 2 cột cho mẫu thiệp + perk
   * để trang không bị dài — card đã đủ nhỏ.
   */
  .template-grid,
  .perks-grid,
  .feature-grid {
    grid-template-columns: 1fr 1fr;

    gap: 8px;
  }

  .wedding-info button {
    padding: 9px 10px;

    font-size: 11.5px;
  }
}

/* ==================================================
   REDUCE MOTION
================================================== */

@media (prefers-reduced-motion: reduce) {
  .perk-card,
  .wedding-card {
    transition: none;
  }
}
</style>