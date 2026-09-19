<template>
  <main class="landing-page">
    <section class="hero-shell">
      <div class="hero-content container">
        <div class="hero-copy">
          <div class="eyebrow">Nền tảng thiệp cưới</div>
          <h1>
            Mỗi thiệp là một
            <em>bản sắc</em>
            — kể câu chuyện của hai bạn.
          </h1>
          <p>
            Bộ sưu tập thiệp cưới lấy cảm hứng Á Đông: đỏ son, lụa ngà, vàng
            foil, ấn son. Chọn mẫu, nhập nội dung — thiệp hoàn chỉnh trong vài
            phút.
          </p>

          <div class="cta-row">
            <button class="primary" type="button" @click="scrollToGallery">
              Xem bộ sưu tập
            </button>
            <button class="secondary" type="button" @click="openCreateFlow">
              Tạo thiệp ngay
            </button>
          </div>

          <p class="trial-hint">
            <span class="trial-hint-icon">囍</span>
            Dùng thử 3 ngày miễn phí — ưng thì mới thanh toán
          </p>

          <div class="hero-stats">
            <div>
              <strong>20+</strong>
              <span>Mẫu thiệp</span>
            </div>
            <div>
              <strong>5</strong>
              <span>Bộ sưu tập</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Responsive</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-card">
            <div class="hero-card-frame">
              <span class="hero-card-orn">囍</span>

              <span class="hero-card-kicker">Trân trọng báo hỷ</span>

              <h3>
                <span class="hero-card-name">Hà Uyên</span>
                <span class="hero-card-amp">&</span>
                <span class="hero-card-name">Trần Hiếu</span>
              </h3>

              <div class="hero-card-rule">
                <i></i>
                <span>14 · 11 · 2026</span>
                <i></i>
              </div>

              <p class="hero-card-place">Trung tâm Hội nghị Quốc gia — Hà Nội</p>
            </div>

            <div class="hero-card-tag">
              <span class="hero-card-tag-orn">✦</span>

              <div>
                <strong>Á Đông Sang Trọng</strong>
                <small>Bộ sưu tập · 5 mẫu</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section container">
      <div class="section-heading">
        <span class="eyebrow muted">Vì sao chọn chúng tôi</span>
        <h2>
          Thiệp cưới được thiết kế như một
          <span class="heading-accent">tác phẩm</span>
          — không phải một biểu mẫu.
        </h2>
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
          <span class="trial-badge-icon">囍</span>

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
            <span class="trial-step-num">壹</span>

            <div>
              <strong>Tạo & chỉnh sửa</strong>

              <p>
                Chọn mẫu, nhập nội dung — mọi tính năng đều mở trong thời gian
                dùng thử.
              </p>
            </div>
          </div>

          <div class="trial-step">
            <span class="trial-step-num">贰</span>

            <div>
              <strong>Xem trước 3 ngày</strong>

              <p>
                Kiểm tra thiệp trên điện thoại, máy tính, gửi cho người thân
                góp ý trước khi quyết định.
              </p>
            </div>
          </div>

          <div class="trial-step">
            <span class="trial-step-num">叁</span>

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
          <span class="eyebrow muted">Bộ sưu tập</span>
          <h2>
            Chọn một
            <span class="heading-accent">bản sắc</span>
            phù hợp với ngày trọng đại của bạn.
          </h2>
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
          :style="getCardStyle(wedding)"
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
              <span class="theme-badge">
                <i class="badge-orn">{{ getWeddingMeta(wedding).orn }}</i>
                {{ getThemeLabel(wedding) }}
              </span>
            </div>

            <h3>
              {{ wedding.couple?.Bride?.Name || "" }}
              <span class="amp">&</span>
              {{ wedding.couple?.Groom?.Name || "" }}
            </h3>

            <p>{{ formatDate(wedding.weddingDate) }} · {{ getCollectionLabel(wedding) }}</p>

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
          <h2>
            Thiết kế thiệp cưới theo
            <span class="cta-accent">cá tính</span>
            của hai bạn.
          </h2>
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
import { getThemeMeta, getCollection } from "@/data/templateCollections";

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
    icon: "囍",
    title: "Bộ sưu tập Á Đông",
    text: "5 bộ sưu tập với bản sắc riêng — từ đỏ son truyền thống, lụa ngà kim tuyến đến tối giản hiện đại.",
  },
  {
    icon: "✦",
    title: "Editor linh hoạt",
    text: "Cập nhật nội dung, section, font, màu sắc và bố cục theo đúng cảm nhận của bạn.",
  },
  {
    icon: "❀",
    title: "Responsive tối ưu",
    text: "Thiệp hiển thị đẹp trên desktop, tablet và điện thoại với trải nghiệm mượt mà.",
  },
  {
    icon: "♪",
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
    icon: "✦",
    title: "20+ mẫu thiệp",
    text: "5 bộ sưu tập — Á Đông, Kim Tuyến, Lãng Mạn, Thiên Nhiên, Tối Giản — luôn có mẫu hợp gu.",
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
    icon: "♪",
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
  const themeName = wedding?.theme?.Name || wedding?.theme || "";
  return getThemeMeta(themeName).name || themeName || "Classic";
}

function getWeddingMeta(wedding) {
  const themeName = wedding?.theme?.Name || wedding?.theme || "";
  return getThemeMeta(themeName);
}

function getCardStyle(wedding) {
  const meta = getWeddingMeta(wedding);
  const palette = meta.palette;

  return {
    "--card-ink": palette.ink,
    "--card-accent": palette.accent,
    "--card-seal": palette.seal,
    "--card-bg": palette.bg,
  };
}

function getCollectionLabel(wedding) {
  return getCollection(getWeddingMeta(wedding).collection).name;
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
  position: relative;

  background:
    radial-gradient(circle at 8% 4%, rgba(185, 151, 91, 0.12), transparent 34%),
    radial-gradient(circle at 92% 10%, rgba(166, 58, 46, 0.05), transparent 30%),
    linear-gradient(180deg, #faf6ee 0%, #f7f1e6 40%, #f2ead9 100%);

  color: var(--studio-ink);
}

/* Ấn son trang trí góc phải hero — tiết chế như dấu triện */
.landing-page::before {
  content: "囍";

  position: absolute;

  top: 96px;

  right: 4%;

  z-index: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 88px;

  height: 88px;

  border: 2px solid rgba(166, 58, 46, 0.14);

  border-radius: 14px;

  color: rgba(166, 58, 46, 0.2);

  font-family: var(--font-symbol);

  font-size: 44px;

  transform: rotate(6deg);

  pointer-events: none;
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
  color: var(--studio-foil);
  font-size: 12px;
  letter-spacing: 0.24em;
  font-weight: 700;
  text-transform: uppercase;
}

.eyebrow::before {
  content: "";
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, var(--studio-foil), transparent);
}

.eyebrow.muted {
  color: var(--studio-ink-faint);
}

.hero-copy h1 {
  margin: 0;
  max-width: 620px;
  color: var(--studio-ink);
  font-family: var(--font-heading);
  font-size: clamp(42px, 5.6vw, 68px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  font-weight: 600;
}

.hero-copy h1 em {
  font-style: italic;
  color: var(--studio-seal);
}

.hero-copy p {
  max-width: 620px;
  margin-top: 20px;
  color: var(--studio-ink-soft);
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
  background: linear-gradient(135deg, var(--studio-seal), #7c2a20);
  color: #f7f1e6;
  box-shadow: 0 16px 34px rgba(166, 58, 46, 0.26);
}

button.secondary {
  background: rgba(255, 253, 248, 0.8);
  color: var(--studio-ink);
  border: 1px solid var(--studio-line-strong);
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
  color: var(--studio-ink);
}

.hero-stats span {
  color: var(--studio-ink-faint);
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
  background: var(--studio-foil-soft);
  color: #7c6234;
  font-size: 13px;
  font-weight: 600;
}

.trial-hint-icon {
  color: var(--studio-seal);
  font-family: var(--font-symbol);
  font-size: 13px;
}

.hero-visual {
  display: flex;
  justify-content: center;
}

/*
 * Thiệp mockup hero — thiệp giấy dó viền foil,
 * ấn son 囍, tên bằng chữ heading, ngày có kim tuyến.
 */
.hero-card {
  position: relative;
  width: min(400px, 100%);
  padding: 14px;
  border-radius: 22px;
  background: linear-gradient(160deg, #fffdf8, #f6efdf);
  border: 1px solid var(--studio-line);
  box-shadow: 0 30px 80px rgba(43, 33, 24, 0.16);
}

.hero-card-frame {
  position: relative;
  padding: 52px 30px 44px;
  border: 1px solid rgba(185, 151, 91, 0.45);
  border-radius: 12px;
  background:
    radial-gradient(circle at 50% 0%, rgba(185, 151, 91, 0.1), transparent 55%),
    #fffdf8;
  text-align: center;
}

.hero-card-orn {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--studio-seal);
  font-family: var(--font-symbol);
  font-size: 30px;
  line-height: 1;
}

.hero-card-kicker {
  display: block;
  margin-top: 26px;
  color: var(--studio-ink-faint);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.hero-card-frame h3 {
  margin: 14px 0 0;
  color: var(--studio-ink);
  font-family: var(--font-heading);
  font-size: clamp(30px, 3vw, 40px);
  font-weight: 600;
  line-height: 1.15;
}

.hero-card-name {
  display: block;
}

.hero-card-amp {
  display: block;
  margin: 2px 0;
  color: var(--studio-foil);
  font-family: var(--font-script);
  font-size: 30px;
  line-height: 1;
}

.hero-card-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 18px;
}

.hero-card-rule i {
  width: 34px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--studio-foil));
}

.hero-card-rule i:last-child {
  background: linear-gradient(90deg, var(--studio-foil), transparent);
}

.hero-card-rule span {
  color: var(--studio-seal);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.hero-card-place {
  margin: 12px 0 0;
  color: var(--studio-ink-faint);
  font-size: 12px;
  line-height: 1.6;
}

.hero-card-tag {
  position: absolute;
  left: 50%;
  bottom: -18px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 999px;
  background: var(--studio-ink);
  color: #f7f1e6;
  box-shadow: 0 16px 36px rgba(43, 33, 24, 0.3);
  white-space: nowrap;
}

.hero-card-tag strong {
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.hero-card-tag small {
  color: rgba(247, 241, 230, 0.66);
  font-size: 11px;
}

.hero-card-tag-orn {
  color: var(--studio-foil-bright);
  font-family: var(--font-symbol);
  font-size: 15px;
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
  color: var(--studio-ink);
  font-family: var(--font-heading);
  font-size: clamp(30px, 4vw, 50px);
  line-height: 1.05;
}

.heading-accent {
  color: var(--studio-seal);
  font-style: italic;
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
    radial-gradient(circle at 88% 12%, rgba(185, 151, 91, 0.18), transparent 42%),
    linear-gradient(135deg, #fffdf8, #f6efdf);
  border: 1px solid rgba(185, 151, 91, 0.4);
  box-shadow: 0 24px 60px rgba(43, 33, 24, 0.08);
  text-align: center;
}

.trial-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  background: var(--studio-ink);
  color: #f7f1e6;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 10px 24px rgba(43, 33, 24, 0.24);
}

.trial-badge-icon {
  color: var(--studio-foil-bright);
  font-family: var(--font-symbol);
  font-size: 13px;
}

.trial-box h2 {
  max-width: 640px;
  margin: 20px auto 0;
  color: var(--studio-ink);
  font-family: var(--font-heading);
  font-size: clamp(28px, 3.6vw, 44px);
  line-height: 1.12;
}

.trial-box h2 span {
  color: var(--studio-seal);
  font-style: italic;
}

.trial-desc {
  max-width: 620px;
  margin: 16px auto 0;
  color: var(--studio-ink-soft);
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
  background: rgba(255, 253, 248, 0.8);
  border: 1px solid var(--studio-line);
}

.trial-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--studio-foil-soft);
  border: 1px solid rgba(185, 151, 91, 0.4);
  color: var(--studio-seal);
  font-family: var(--font-symbol);
  font-size: 15px;
  font-weight: 700;
}

.trial-step strong {
  display: block;
  margin-bottom: 6px;
  color: var(--studio-ink);
  font-size: 15px;
}

.trial-step p {
  margin: 0;
  color: var(--studio-ink-soft);
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
  background: rgba(166, 58, 46, 0.07);
  color: var(--studio-seal);
  font-size: 13.5px;
  font-weight: 600;
}

.trial-note-icon {
  color: var(--studio-seal);
  font-size: 15px;
}

/* ==================================================
   PERKS (đãi ngộ)
================================================== */

.perks-section .heading-accent {
  display: block;
  color: var(--studio-seal);
}

.perks-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.perk-card {
  padding: 26px 22px;
  border-radius: 24px;
  background: var(--studio-card);
  border: 1px solid var(--studio-line);
  box-shadow: 0 18px 40px rgba(43, 33, 24, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.perk-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 52px rgba(43, 33, 24, 0.1);
}

.perk-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 16px;
  border-radius: 16px;
  background: var(--studio-foil-soft);
  border: 1px solid rgba(185, 151, 91, 0.28);
  font-size: 24px;
}

.perk-card h3 {
  margin: 0 0 8px;
  color: var(--studio-ink);
  font-family: var(--font-heading);
  font-size: 20px;
}

.perk-card p {
  margin: 0;
  color: var(--studio-ink-soft);
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
  background: var(--studio-card);
  border: 1px solid var(--studio-line);
  border-radius: 26px;
  padding: 28px 22px;
  box-shadow: 0 18px 40px rgba(43, 33, 24, 0.05);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 18px;
  border-radius: 16px;
  background: var(--studio-foil-soft);
  border: 1px solid rgba(185, 151, 91, 0.28);
  color: var(--studio-seal);
  font-family: var(--font-symbol);
  font-size: 22px;
}

.feature-card h3,
.step-card h3 {
  margin: 0 0 10px;
  color: var(--studio-ink);
  font-family: var(--font-heading);
  font-size: 26px;
}

.feature-card p,
.step-card p {
  margin: 0;
  color: var(--studio-ink-soft);
  line-height: 1.7;
}

.step-index {
  display: inline-flex;
  margin-bottom: 14px;
  color: var(--studio-foil);
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

  border: 1px solid var(--studio-line-strong);

  border-radius: 999px;

  background: var(--studio-card);

  color: var(--studio-ink);

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

  background: #fffdf8;

  box-shadow: 0 14px 30px rgba(43, 33, 24, 0.14);
}

.view-all-button:hover span {
  transform: translateX(4px);
}

.wedding-card {
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  background: var(--studio-card);
  border: 1px solid color-mix(in srgb, var(--card-accent, var(--studio-foil)) 32%, transparent);
  border-radius: 24px;
  box-shadow: 0 15px 45px rgba(43, 33, 24, 0.07);
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}

.wedding-card:hover {
  transform: translateY(-8px);
  border-color: color-mix(in srgb, var(--card-accent, var(--studio-foil)) 70%, transparent);
  box-shadow: 0 25px 60px rgba(43, 33, 24, 0.14);
}

.wedding-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: color-mix(in srgb, var(--card-bg, #f7f1e6) 82%, var(--card-accent, #b9975b));
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
  background: color-mix(in srgb, var(--card-seal, #a63a2e) 42%, rgba(20, 12, 8, 0.4));
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
  gap: 6px;
  padding: 7px 11px;
  background: color-mix(in srgb, var(--card-seal, #a63a2e) 12%, transparent);
  border-radius: 999px;
  color: var(--card-seal, #a63a2e);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.badge-orn {
  font-family: var(--font-symbol);
  font-style: normal;
  font-size: 12px;
}

.wedding-info h3 {
  margin: 0 0 8px;
  color: var(--card-ink, var(--studio-ink));
  font-family: var(--font-heading);
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 600;
  text-align: left;
}

.wedding-info h3 .amp {
  color: var(--card-accent, var(--studio-foil));
  font-family: var(--font-script);
  font-size: 0.85em;
  padding: 0 2px;
}

.wedding-info p {
  margin: 0 0 18px;
  color: var(--studio-ink-faint);
  font-size: 14px;
  text-align: left;
}

.wedding-info button {
  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-radius: 999px;
  color: #f7f1e6;
  background: linear-gradient(135deg, var(--card-seal, #a63a2e), color-mix(in srgb, var(--card-seal, #a63a2e) 78%, #1a1210));
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.wedding-info button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--card-seal, #a63a2e) 34%, transparent);
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
  background: rgba(255, 253, 248, 0.6);
  color: var(--studio-ink-soft);
}

.error-message {
  background: rgba(166, 58, 46, 0.08);
  color: var(--studio-seal);
}

.empty-message {
  background: rgba(255, 253, 248, 0.55);
  color: var(--studio-ink-faint);
}

.cta-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 36px 40px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 85% 20%, rgba(185, 151, 91, 0.24), transparent 45%),
    linear-gradient(135deg, #241b12, #4a3a28);
  color: #f7f1e6;
  box-shadow: 0 28px 60px rgba(43, 33, 24, 0.24);
}

.cta-box h2 {
  margin: 0;
  color: #f7f1e6;
  font-family: var(--font-heading);
  font-size: clamp(30px, 3vw, 46px);
  line-height: 1.1;
}

.cta-accent {
  color: var(--studio-foil-bright);
  font-style: italic;
}

.cta-box .eyebrow.muted {
  color: rgba(247, 241, 230, 0.66);
}

.cta-sub {
  margin: 12px 0 0;
  color: rgba(247, 241, 230, 0.8);
  font-size: 15px;
  line-height: 1.7;
}

.cta-box button.primary {
  background: #f7f1e6;
  color: var(--studio-ink);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
}

@media (max-width: 980px) {
  .landing-page::before {
    display: none;
  }

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

  .landing-page::before {
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

    font-size: 11.5px;
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