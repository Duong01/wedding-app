<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: 'Hướng dẫn' }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">Hướng dẫn</p>

        <h1>
          Từ số không tới thiệp hoàn chỉnh
          <em>trong một buổi tối.</em>
        </h1>

        <p class="mk-hero__lead">
          Bạn không cần biết thiết kế, không cần biết lập trình. Chỉ cần chuẩn
          bị sẵn nội dung và làm theo ba bước dưới đây.
        </p>

        <div class="mk-hero__actions">
          <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
            Vào editor tạo thiệp
          </router-link>

          <a href="#chuan-bi" class="mk-btn mk-btn--ghost">
            Xem checklist chuẩn bị
          </a>
        </div>
      </div>
    </section>

    <!-- =====================================================
         BA BƯỚC CHI TIẾT
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Ba bước</p>

          <h2>
            Làm lần lượt,
            <em>không bỏ sót gì.</em>
          </h2>
        </header>

        <div class="steps">
          <article
            v-for="(step, index) in DETAILED_STEPS"
            :key="step.title"
            class="step"
          >
            <div class="step-media">
              <img
                :src="step.image"
                :alt="step.title"
                loading="lazy"
                @error="handleImageError"
              />

              <span class="step-seal" aria-hidden="true">
                {{ step.seal }}
              </span>
            </div>

            <div class="step-body">
              <p class="step-kicker">Bước {{ index + 1 }}</p>

              <h3>{{ step.title }}</h3>

              <p class="step-text">{{ step.text }}</p>

              <ul class="step-points">
                <li v-for="point in step.points" :key="point">
                  <span class="tick" aria-hidden="true">✦</span>
                  {{ point }}
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CHECKLIST CHUẨN BỊ
    ====================================================== -->
    <section id="chuan-bi" class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Chuẩn bị</p>

          <h2>
            Gom đủ những thứ này
            <em>trước khi bắt đầu.</em>
          </h2>

          <p>
            Chuẩn bị trước giúp bạn điền một mạch, không phải dừng lại tìm
            thông tin giữa chừng.
          </p>
        </header>

        <RailHint text="Vuốt ngang để xem đủ ba nhóm" />

        <div class="mk-grid mk-grid--3">
          <article
            v-for="group in GUIDE_CHECKLIST"
            :key="group.group"
            class="mk-card"
          >
            <h3>{{ group.group }}</h3>

            <ul class="check-list">
              <li v-for="item in group.items" :key="item">
                <span class="box" aria-hidden="true"></span>
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         MẸO
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Mẹo nhỏ</p>

          <h2>
            Bốn điều giúp thiệp
            <em>đẹp hơn hẳn.</em>
          </h2>
        </header>

        <RailHint text="Vuốt ngang để xem đủ bốn mẹo" />

        <div class="mk-grid mk-grid--4">
          <article v-for="tip in GUIDE_TIPS" :key="tip.title" class="mk-card">
            <span class="mk-orn" aria-hidden="true">{{ tip.orn }}</span>

            <h3>{{ tip.title }}</h3>

            <p>{{ tip.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         VIDEO
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Video</p>

          <h2>
            Xem làm mẫu
            <em>trong 2 phút.</em>
          </h2>
        </header>

        <div class="video-frame">
          <iframe
            v-if="playing"
            :src="embedUrl"
            title="Video hướng dẫn tạo thiệp cưới"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>

          <button
            v-else
            type="button"
            class="video-poster"
            @click="playing = true"
          >
            <span class="video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>

            <span class="video-label">Phát video hướng dẫn</span>
          </button>
        </div>
      </div>
    </section>

    <!-- =====================================================
         FAQ
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container faq-grid">
        <header class="faq-head">
          <p class="mk-eyebrow">Giải đáp</p>

          <h2>
            Vẫn còn
            <em>vướng mắc?</em>
          </h2>

          <p>
            Nếu câu trả lời không có ở đây, nhắn tụi mình — luôn có người thật
            trả lời.
          </p>

          <router-link
            :to="{ name: 'Contact' }"
            class="mk-btn mk-btn--outline mk-btn--sm"
          >
            Liên hệ hỗ trợ
          </router-link>
        </header>

        <FaqAccordion :items="FAQS" />
      </div>
    </section>

    <FinalCta
      title="Đã đủ tự tin?"
      title-accent="Bắt đầu thôi."
      text="Mở editor, chọn một mẫu bạn thích và thử điền vài dòng. Không mất phí, không cần đăng nhập."
    />
  </main>
</template>

<script setup>
import { computed, ref } from "vue";

import PageBreadcrumb from "@/components/marketing/PageBreadcrumb.vue";
import FaqAccordion from "@/components/marketing/FaqAccordion.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";
import RailHint from "@/components/marketing/RailHint.vue";

import { useSeo, faqJsonLd } from "@/composables/useSeo";

import { FAQS, GUIDE_CHECKLIST, GUIDE_TIPS } from "@/data/siteContent";
import { previewByStem } from "@/utils/weddingCard";

const VIDEO_ID = "PggDHkV0nGU";

const playing = ref(false);

const embedUrl = computed(
  () => `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`
);

const DETAILED_STEPS = [
  {
    seal: "壹",
    title: "Chọn mẫu thiệp",
    image: previewByStem("song_hy_red"),
    text: "Mở thư viện mẫu và lọc theo bộ sưu tập bạn thích. Bấm vào một mẫu để xem thử toàn bộ thiệp trước khi quyết định.",
    points: [
      "Lọc theo bộ sưu tập: Á Đông, Kim tuyến, Lãng mạn, Thiên nhiên, Tối giản",
      "Xem trước đúng như khách mời sẽ thấy",
      "Đổi mẫu bất cứ lúc nào — nội dung đã điền được giữ nguyên",
    ],
  },
  {
    seal: "贰",
    title: "Điền nội dung",
    image: previewByStem("jasmine_white"),
    text: "Editor chia theo từng mục: cô dâu chú rể, sự kiện, album ảnh, câu chuyện, mừng cưới. Điền tới đâu xem trước tới đó.",
    points: [
      "Mọi thay đổi hiển thị ngay ở khung xem trước bên cạnh",
      "Bỏ trống ô nào thì mẫu dùng nội dung mặc định của nó",
      "Đổi được tên các mục hiển thị trên thiệp",
      "Lưu nháp bất cứ lúc nào, quay lại làm tiếp sau",
    ],
  },
  {
    seal: "叁",
    title: "Xuất bản và gửi",
    image: previewByStem("cherry_blossom_pink"),
    text: "Bấm xuất bản để lấy đường link chia sẻ. Gửi qua Zalo, Messenger, Facebook hoặc in mã QR lên thiệp giấy.",
    points: [
      "Đường link dạng thiepduyen.com/ten-hai-ban, dễ đọc",
      "Khách mở là xem được, không cần cài ứng dụng",
      "Dùng thử 3 ngày đầy đủ tính năng trước khi thanh toán",
      "Sửa nội dung sau khi gửi vẫn được, link không đổi",
    ],
  },
];

function handleImageError(event) {
  const fallback = previewByStem("song_hy_red");

  if (fallback && event.target.src !== fallback) {
    event.target.src = fallback;
  }
}

useSeo({
  title: "Hướng dẫn tạo thiệp cưới",
  description:
    "Hướng dẫn tạo thiệp cưới online từng bước: chọn mẫu, điền nội dung, " +
    "xuất bản và gửi khách mời. Kèm checklist chuẩn bị và mẹo làm thiệp đẹp.",
  path: "/huong-dan",
  jsonLd: faqJsonLd(FAQS),
});
</script>

<style scoped>
/* =====================================================
   BA BƯỚC
===================================================== */

.steps {
  display: flex;
  flex-direction: column;

  gap: 20px;
}

.step {
  display: grid;
  grid-template-columns: 1fr;

  gap: 22px;
  align-items: center;

  padding: 22px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 26px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 20px 48px rgba(43, 33, 24, 0.06);
}

.step-media {
  position: relative;

  overflow: hidden;

  border-radius: 18px;

  background: var(--studio-paper-deep, #efe6d4);
}

.step-media img {
  display: block;

  width: 100%;

  aspect-ratio: 4 / 3;

  object-fit: cover;
  object-position: center top;
}

.step-seal {
  position: absolute;

  top: 12px;
  left: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  border-radius: 12px;

  background: rgba(166, 58, 46, 0.92);
  color: #fff;

  font-family: var(--font-symbol);
  font-size: 19px;
}

.step-kicker {
  margin: 0 0 6px;

  color: var(--studio-foil, #b9975b);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.step-body h3 {
  margin: 0 0 10px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(21px, 2.4vw, 28px);
  font-weight: 600;

  line-height: 1.2;
}

.step-text {
  margin: 0 0 18px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15px;

  line-height: 1.75;
}

.step-points {
  margin: 0;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 10px;
}

.step-points li {
  display: flex;

  gap: 10px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.6;
}

.tick {
  flex-shrink: 0;

  color: var(--studio-foil, #b9975b);

  font-size: 12px;

  line-height: 1.6;
}

/* =====================================================
   CHECKLIST
===================================================== */

.check-list {
  margin: 0;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 11px;
}

.check-list li {
  display: flex;

  gap: 10px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;

  line-height: 1.6;
}

.box {
  flex-shrink: 0;

  width: 15px;
  height: 15px;

  margin-top: 3px;

  border: 1.5px solid rgba(185, 151, 91, 0.6);
  border-radius: 4px;
}

/* =====================================================
   VIDEO
===================================================== */

.video-frame {
  position: relative;

  width: min(760px, 100%);

  margin: 0 auto;

  aspect-ratio: 16 / 9;

  overflow: hidden;

  border: 1px solid rgba(185, 151, 91, 0.4);
  border-radius: 22px;

  background:
    radial-gradient(circle at 70% 20%, rgba(185, 151, 91, 0.28), transparent 60%),
    linear-gradient(135deg, #241b12, #4a3a28);

  box-shadow: 0 24px 56px rgba(43, 33, 24, 0.2);
}

.video-frame iframe {
  width: 100%;
  height: 100%;

  border: 0;
}

.video-poster {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 16px;

  width: 100%;
  height: 100%;

  border: 0;

  background: transparent;

  cursor: pointer;
}

.video-play {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 68px;
  height: 68px;

  border-radius: 50%;

  background: rgba(247, 241, 230, 0.94);
  color: var(--studio-seal, #a63a2e);

  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.3);

  transition: transform 0.25s ease;
}

.video-play svg {
  width: 28px;
  height: 28px;

  margin-left: 3px;
}

.video-poster:hover .video-play {
  transform: scale(1.08);
}

.video-label {
  color: rgba(247, 241, 230, 0.9);

  font-size: 14px;
  font-weight: 600;
}

/* =====================================================
   FAQ
===================================================== */

.faq-grid {
  display: grid;
  grid-template-columns: 1fr;

  gap: 28px;
}

.faq-head h2 {
  margin: 0 0 12px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 600;

  line-height: 1.15;
}

.faq-head h2 em {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.faq-head p {
  max-width: 420px;

  margin: 0 0 20px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15px;

  line-height: 1.75;
}

@media (min-width: 768px) {
  .step {
    grid-template-columns: 1fr 1fr;

    gap: 36px;

    padding: 28px;
  }

  .faq-grid {
    grid-template-columns: 0.8fr 1.2fr;

    gap: 48px;
  }

  .faq-head {
    position: sticky;
    top: 96px;

    align-self: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-play {
    transition: none;
  }
}
</style>
