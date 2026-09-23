<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: 'Thiệp cưới online' }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">Thiệp cưới online</p>

        <h1>
          Thiệp cưới online —
          <em>trao lời yêu, gửi một đời duyên.</em>
        </h1>

        <p class="mk-hero__lead">
          Một đường link thay cho xấp thiệp giấy. Khách mời mở là thấy ảnh
          cưới, giờ tiệc, bản đồ chỉ đường, lời chúc và cả QR mừng cưới — tất
          cả trong một trang.
        </p>

        <div class="mk-hero__actions">
          <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
            Tạo thiệp ngay
          </router-link>

          <router-link :to="{ name: 'Templates' }" class="mk-btn mk-btn--ghost">
            Xem mẫu thiệp
          </router-link>
        </div>

        <ul class="mk-hero__stats">
          <li v-for="stat in STATS" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- =====================================================
         THIỆP GIẤY VS THIỆP ONLINE
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Khác biệt</p>

          <h2>
            Thiệp giấy không sai —
            <em>chỉ là thiếu khả năng sửa.</em>
          </h2>
        </header>

        <div class="mk-grid mk-grid--2">
          <article class="mk-card compare-card is-muted">
            <h3>Thiệp giấy truyền thống</h3>

            <ul class="compare-list">
              <li v-for="item in PAPER_CONS" :key="item">
                <span class="cross" aria-hidden="true">—</span>
                {{ item }}
              </li>
            </ul>
          </article>

          <article class="mk-card compare-card is-strong">
            <h3>Thiệp cưới online</h3>

            <ul class="compare-list">
              <li v-for="item in ONLINE_PROS" :key="item">
                <span class="tick" aria-hidden="true">✦</span>
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CÓ GÌ TRONG THIỆP
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Nội dung</p>

          <h2>
            Một tấm thiệp,
            <em>mười thứ bên trong.</em>
          </h2>
        </header>

        <RailHint text="Vuốt ngang để xem đủ mười mục" />

        <div class="mk-grid mk-grid--4">
          <article v-for="item in CONTENTS" :key="item.title" class="mk-card">
            <span class="mk-orn" aria-hidden="true">{{ item.orn }}</span>

            <h3>{{ item.title }}</h3>

            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         BỘ SƯU TẬP
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Phong cách</p>

          <h2>
            Chọn theo
            <em>tinh thần đám cưới.</em>
          </h2>
        </header>

        <RailHint text="Vuốt ngang để xem đủ bộ sưu tập" />

        <div class="mk-grid mk-grid--3">
          <router-link
            v-for="col in collectionCards"
            :key="col.id"
            :to="{ name: col.routeName }"
            class="mk-card link-card"
          >
            <span class="swatches" aria-hidden="true">
              <span
                v-for="(swatch, index) in col.swatches"
                :key="index"
                class="swatch"
                :style="{ background: swatch }"
              ></span>
            </span>

            <h3>{{ col.title }}</h3>

            <p>{{ col.text }}</p>

            <span class="link-more">
              Xem mẫu <span aria-hidden="true">→</span>
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- =====================================================
         QUY TRÌNH
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Cách làm</p>

          <h2>
            Ba bước,
            <em>một buổi tối.</em>
          </h2>
        </header>

        <ol class="flow">
          <li v-for="(step, index) in STEPS" :key="step.title" class="flow-step">
            <span class="flow-seal" aria-hidden="true">{{ step.seal }}</span>

            <div>
              <p class="flow-kicker">Bước {{ index + 1 }}</p>

              <h3>{{ step.title }}</h3>

              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>

        <div class="mk-cta">
          <router-link :to="{ name: 'Guide' }" class="mk-btn mk-btn--outline">
            Xem hướng dẫn chi tiết
            <span aria-hidden="true">→</span>
          </router-link>
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
            Câu hỏi
            <em>thường gặp.</em>
          </h2>

          <p>
            Những điều các cặp đôi hỏi trước khi bắt đầu làm thiệp online.
          </p>

          <router-link
            :to="{ name: 'Contact' }"
            class="mk-btn mk-btn--outline mk-btn--sm"
          >
            Hỏi trực tiếp
          </router-link>
        </header>

        <FaqAccordion :items="FAQS" />
      </div>
    </section>

    <FinalCta
      title="Thử một tấm thiệp"
      title-accent="cho ngày của bạn."
      text="Tạo miễn phí, dùng thử 3 ngày — chỉ thanh toán khi bạn thật sự ưng ý."
    />
  </main>
</template>

<script setup>
import { computed } from "vue";

import PageBreadcrumb from "@/components/marketing/PageBreadcrumb.vue";
import FaqAccordion from "@/components/marketing/FaqAccordion.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";
import RailHint from "@/components/marketing/RailHint.vue";

import { useSeo, faqJsonLd } from "@/composables/useSeo";

import { COLLECTIONS } from "@/data/templateCollections";
import {
  BRAND,
  COLLECTION_LANDING,
  FAQS,
  STATS,
  STEPS,
} from "@/data/siteContent";

const PAPER_CONS = [
  "In sai một chữ là phải in lại toàn bộ",
  "Gửi đi rồi không sửa được nữa",
  "Không biết khách đã nhận hay chưa",
  "Không xem được ảnh cưới, không có bản đồ",
  "Chi phí in tăng theo số lượng khách",
];

const ONLINE_PROS = [
  "Sửa một lần, mọi khách mở link đều thấy nội dung mới",
  "Gửi qua Zalo, Messenger, Facebook hoặc mã QR",
  "Xem được lượt mở và danh sách khách xác nhận",
  "Có album ảnh, bản đồ chỉ đường, nhạc nền",
  "Không giới hạn số khách mời, không phí in",
];

const CONTENTS = [
  {
    orn: "囍",
    title: "Thiệp mời chính",
    text: "Tên cô dâu chú rể, tên cha mẹ hai bên, ngày giờ và địa điểm lễ thành hôn.",
  },
  {
    orn: "✦",
    title: "Đồng hồ đếm ngược",
    text: "Đếm từng ngày tới giờ cưới — khách mở thiệp là thấy còn bao lâu nữa.",
  },
  {
    orn: "❀",
    title: "Album ảnh cưới",
    text: "Trình bày dạng album lật hoặc lưới, tải lên không giới hạn số ảnh.",
  },
  {
    orn: "❖",
    title: "Câu chuyện tình yêu",
    text: "Dòng thời gian những mốc quan trọng — gặp nhau, yêu nhau, về chung nhà.",
  },
  {
    orn: "◈",
    title: "Sự kiện & lễ cưới",
    text: "Lễ ăn hỏi, lễ thành hôn, tiệc cưới — mỗi mục có giờ và địa điểm riêng.",
  },
  {
    orn: "✽",
    title: "Bản đồ chỉ đường",
    text: "Khách bấm là mở Google Maps, không cần hỏi lại địa chỉ.",
  },
  {
    orn: "❝",
    title: "Sổ lưu bút",
    text: "Khách gửi lời chúc trực tiếp lên thiệp, lưu lại vĩnh viễn.",
  },
  {
    orn: "❦",
    title: "QR mừng cưới",
    text: "Hiển thị số tài khoản dạng mã QR cho cả hai bên, khách quét là chuyển được.",
  },
];

const collectionCards = computed(() =>
  COLLECTIONS.map((col) => {
    const landing = COLLECTION_LANDING[col.id] || {};

    return {
      id: col.id,
      swatches: col.swatches,
      title: landing.title || col.name,
      text: landing.text || col.sub,
      routeName: landing.routeName || "Templates",
    };
  })
);

useSeo({
  title: "Thiệp cưới online",
  description:
    "Thiệp cưới online là gì, có gì bên trong và khác gì thiệp giấy? " +
    `${BRAND.name} — tạo thiệp cưới điện tử miễn phí, gửi khách mời trong vài phút.`,
  path: "/thiep-cuoi-online",
  jsonLd: faqJsonLd(FAQS),
});
</script>

<style scoped>
.compare-card h3 {
  margin-bottom: 16px;
}

.compare-card.is-muted {
  background: rgba(255, 253, 248, 0.6);
}

.compare-card.is-strong {
  border-color: rgba(166, 58, 46, 0.34);

  box-shadow: 0 22px 52px rgba(166, 58, 46, 0.12);
}

.compare-list {
  margin: 0;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 12px;
}

.compare-list li {
  display: flex;

  gap: 10px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.65;
}

.tick {
  flex-shrink: 0;

  color: var(--studio-foil, #b9975b);

  font-size: 12px;

  line-height: 1.65;
}

.cross {
  flex-shrink: 0;

  color: rgba(43, 33, 24, 0.3);

  font-size: 12px;

  line-height: 1.65;
}

/* =====================================================
   BỘ SƯU TẬP
===================================================== */

.link-card {
  display: flex;
  flex-direction: column;

  text-decoration: none;
}

.swatches {
  display: flex;

  gap: 6px;

  margin-bottom: 16px;
}

.swatch {
  width: 24px;
  height: 24px;

  border: 1px solid rgba(43, 33, 24, 0.1);
  border-radius: 50%;
}

.link-more {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  margin-top: 16px;

  color: var(--studio-seal, #a63a2e);

  font-size: 13px;
  font-weight: 650;
}

/* =====================================================
   QUY TRÌNH
===================================================== */

.flow {
  display: grid;
  grid-template-columns: 1fr;

  gap: 16px;

  margin: 0;
  padding: 0;

  list-style: none;
}

.flow-step {
  display: flex;

  gap: 16px;

  padding: 22px 20px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 22px;

  background: rgba(255, 253, 248, 0.75);
}

.flow-seal {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 46px;
  height: 46px;

  border: 1px solid rgba(185, 151, 91, 0.4);
  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol);
  font-size: 19px;
}

.flow-kicker {
  margin: 0 0 4px;

  color: var(--studio-foil, #b9975b);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.flow-step h3 {
  margin: 0 0 6px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 600;
}

.flow-step p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.7;
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
  .flow {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 20px;
  }

  .flow-step {
    flex-direction: column;

    gap: 14px;

    padding: 28px 24px;
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
</style>
