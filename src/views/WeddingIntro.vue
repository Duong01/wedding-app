<template>
  <main class="intro-page">
    <!-- =========================================================
         TOPBAR — quay lại danh sách + chia sẻ
    ========================================================== -->
    <div class="intro-topbar">
      <div class="topbar-inner">
        <button
          type="button"
          class="back-btn"
          @click="goTemplates"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path d="M19 12H5"></path>
            <path d="m11 18-6-6 6-6"></path>
          </svg>

          {{ $t('intro.templateList') }}
        </button>

        <button
          type="button"
          class="share-btn"
          @click="shareTemplate"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.3 10.8 7.4-4.4" />
            <path d="m8.3 13.2 7.4 4.4" />
          </svg>

          {{ $t('mobile.shareShort') }}
        </button>
      </div>
    </div>

    <!-- =========================================================
         LOADING
    ========================================================== -->
    <div v-if="store.loading" class="intro-state">
      <div class="state-orn">{{ FALLBACK_ORN }}</div>

      <div class="state-title">{{ $t('intro.loading') }}</div>

      <div class="state-spinner"></div>
    </div>

    <!-- =========================================================
         ERROR
    ========================================================== -->
    <div v-else-if="store.error || !wedding" class="intro-state">
      <div class="state-orn">{{ FALLBACK_ORN }}</div>

      <h1>{{ $t('intro.notFound') }}</h1>

      <p>
        {{ $t('intro.notFoundText') }}
      </p>

      <button type="button" class="state-btn" @click="goTemplates">
        {{ $t('intro.viewList') }}
      </button>
    </div>

    <!-- =========================================================
         TRANG GIỚI THIỆU MẪU — đầy đủ nội dung

         0. Giới thiệu mẫu: tên, cặp đôi, mô tả ngắn
         1. Hero: ảnh xem trước + thông tin + hành động
         2. Điểm nổi bật
         3. Giới thiệu + toàn cảnh thiệp (khung cuộn được)
         4. Phù hợp cho + link hướng dẫn
         5. Tính năng
         6. Câu hỏi thường gặp
         7. Mẫu thiệp liên quan
         8. Bài viết liên quan
         9. CTA cuối trang
    ========================================================== -->
    <template v-else>
      <!-- =========================================
           0. GIỚI THIỆU MẪU — khối chào trên cùng:
           tên thiết kế, cặp đôi, mô tả ngắn gọn.
      ========================================== -->
      <section class="intro-brief">
        <div class="brief-inner">
          <span class="brief-orn">{{ meta.orn }}</span>

          <h1 class="brief-title">
            {{ getThemeLabel(wedding) }}
          </h1>

          <p class="brief-couple">
            {{ getCoupleName(wedding) }}
          </p>

          <p class="brief-desc">
            {{ meta.desc }}
          </p>
        </div>
      </section>

      <!-- =========================================
           1. HERO — một màn: ảnh xem trước + thông tin
      ========================================== -->
      <section class="intro-hero">
        <div class="hero-inner">
          <!-- XEM TRƯỚC — thẻ ảnh 9/16 vừa màn hình.

               Trên điện thoại, ảnh chụp nguyên trang thiệp
               (tỉ lệ ~1:12, nằm trong template-preview) được
               TỰ CUỘN chậm rãi từ đầu đến cuối ngay trong
               khung — xem trọn bộ thiết kế không cần bấm. -->
          <aside class="preview-col">
            <div
              ref="heroFrame"
              class="preview-card"
              @pointerdown="pauseHeroAutoScroll"
              @pointerup="resumeHeroAutoScroll"
              @pointercancel="resumeHeroAutoScroll"
              @pointerleave="resumeHeroAutoScroll"
            >
              <img
                ref="heroImg"
                :src="previewFor(wedding)"
                :alt="getThemeLabel(wedding)"
                @load="onHeroImageLoad"
                @error="onImageError"
              />
            </div>
          </aside>

          <!-- THÔNG TIN MẪU -->
          <div class="info-col">
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <router-link :to="{ name: 'Home' }">
                {{ $t('nav.home') }}
              </router-link>

              <span class="sep">/</span>

              <router-link :to="{ name: 'Templates' }">
                {{ $t('editor.header.template') }}
              </router-link>

              <span class="sep">/</span>

              <span class="current">
                {{ getThemeLabel(wedding) }}
              </span>
            </nav>

            <span class="info-eyebrow">
              {{ meta.orn }} {{ getCollectionLabel(wedding) }}
            </span>

            <h2 class="info-title">
              {{ getThemeLabel(wedding) }}
            </h2>

            <p class="info-couple">
              {{ getCoupleName(wedding) }}
            </p>

            <!-- ngày cưới + địa điểm — lấy từ sự kiện đầu tiên -->
            <div v-if="mainEvent" class="info-event">
              <div class="event-date">
                <span class="date-day">{{ mainEvent.Day }}</span>

                <span class="date-rest">
                  {{ $t("intro.monthYear", { month: mainEvent.Month, year: mainEvent.Year }) }} </span> </div> <p class="event-meta"> {{ mainEvent.Title }} · {{ mainEvent.EventTime }} · {{ mainEvent.Location }} </p> </div> <p class="info-desc"> {{ meta.desc }} </p> <!-- từ khóa phong cách --> <div class="info-tags"> <span v-for="tag in meta.tags" :key="tag" class="info-tag" > {{ tag }} </span> </div> <p class="info-updated"> {{ $t("intro.updated", { date: updatedLabel }) }} </p> <!-- HÀNH ĐỘNG — tin cậy + hai nút --> <div class="cta-block"> <p class="cta-trust"> {{ $t('hero.badge') }} </p> <div class="cta-actions"> <button type="button" class="primary-btn" @click="goEditor" > <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" > <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /> </svg> {{ $t('intro.useThis') }} </button> <button type="button" class="outline-btn" @click="goOpen" > <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" > <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" /> </svg> Xem demo </button> </div> <p class="cta-note"> {{ $t('intro.switchAnytime') }} </p> </div> </div> </div> </section> <!-- ========================================= THANH HÀNH ĐỘNG CỐ ĐỊNH — chỉ trên điện thoại Bản mobile của khối CTA: dòng tin cậy + ghi chú + 2 nút, dính đáy màn hình. ========================================== --> <div class="mobile-cta"> <p class="mobile-trust"> {{ $t('hero.badge') }} </p> <p class="mobile-note"> {{ $t('intro.switchAnytime') }} </p> <div class="mobile-actions"> <button type="button" class="primary-btn" @click="goEditor" > <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" > <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /> </svg> {{ $t('intro.useThis') }} </button> <button type="button" class="outline-btn" @click="goOpen" > <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" > <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" /> </svg> Xem demo </button> </div> </div> <template v-if="content"> <!-- ========================================= 2. ĐIỂM NỔI BẬT ========================================== --> <section class="detail-section"> <div class="container"> <span class="eyebrow"> <span class="eyebrow-line"></span> {{ $t('intro.highlights') }} <span class="eyebrow-line"></span> </span> <h2 class="section-title"> {{ $t("intro.whyChoose", { name: getThemeLabel(wedding) }) }} </h2> <ul class="highlights-grid"> <li v-for="item in content.highlights" :key="item.text" > <span class="hl-orn">{{ item.orn }}</span> <p>{{ item.text }}</p> </li> </ul> </div> </section> <!-- ========================================= 3. GIỚI THIỆU + TOÀN CẢNH THIỆP Khung phải hiển thị ảnh xem trước DÀI đầy đủ (toàn bộ thiệp) trong khung cuộn được — khách xem trọn bộ thiết kế mà không rời trang. Khung dính (sticky) trên máy tính để vừa đọc giới thiệu vừa xem thiệp. ========================================== --> <section class="detail-section"> <div class="container"> <span class="eyebrow"> <span class="eyebrow-line"></span> {{ $t('nav.about') }} <span class="eyebrow-line"></span> </span> <h2 class="section-title"> {{ $t("intro.templateNamed", { name: getThemeLabel(wedding) }) }} </h2> <div class="overview-grid"> <div class="overview-text"> <p v-for="(paragraph, index) in content.paragraphs" :key="index" > {{ paragraph }} </p> <!-- 4. PHÙ HỢP CHO + link hướng dẫn --> <div class="suitable"> <h3>{{ $t('intro.suitableFor') }}</h3> <div class="suitable-tags"> <span v-for="item in content.suitable" :key="item" class="info-tag" > {{ item }} </span> </div> <button type="button" class="guide-link" @click="goGuide" > {{ $t('intro.guideLink') }} </button> </div> </div> <figure class="overview-frame"> <div class="frame-scroll"> <img :src="previewFor(wedding)" :alt="$t('intro.fullViewAlt', { name: getThemeLabel(wedding) })" loading="lazy" @error="onImageError" /> </div> <figcaption class="frame-hint"> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" > <path stroke-linecap="round" d="M12 5v14" /> <path stroke-linecap="round" stroke-linejoin="round" d="m19 12-7 7-7-7" /> </svg> {{ $t('intro.scrollFrame') }} </figcaption> </figure> </div> </div> </section> <!-- ========================================= 5. TÍNH NĂNG ========================================== --> <section class="detail-section sec-features"> <div class="container"> <span class="eyebrow"> <span class="eyebrow-line"></span> {{ $t('pricing.feature') }} <span class="eyebrow-line"></span> </span> <h2 class="section-title"> {{ $t('intro.featuresTitle') }} </h2> <p class="section-lead"> {{ $t('intro.featuresLead') }} </p> <ul class="features-grid"> <li v-for="feature in FEATURES" :key="feature.label" > <span class="feat-orn">{{ feature.orn }}</span> {{ feature.label }} </li> </ul> </div> </section> <!-- ========================================= 6. CÂU HỎI THƯỜNG GẶP ========================================== --> <section class="detail-section"> <div class="container"> <span class="eyebrow"> <span class="eyebrow-line"></span> {{ $t('intro.faq') }} <span class="eyebrow-line"></span> </span> <h2 class="section-title"> {{ $t("intro.aboutTemplate", { name: getThemeLabel(wedding) }) }} </h2> <div class="faq-wrap"> <FaqAccordion :items="content.faqs" /> </div> </div> </section> <!-- ========================================= 7. MẪU THIỆP LIÊN QUAN — cùng bộ sưu tập trước ========================================== --> <section v-if="relatedTemplates.length" class="detail-section" > <div class="container"> <span class="eyebrow"> <span class="eyebrow-line"></span> {{ $t('intro.related') }} <span class="eyebrow-line"></span> </span> <h2 class="section-title"> {{ $t('intro.sameStyle') }} </h2> <div class="related-grid"> <article v-for="tpl in relatedTemplates" :key="tpl.slug" class="related-card" @click="goRelated(tpl.slug)" > <div class="related-thumb" @mouseenter="relatedScroll.start" @mouseleave="relatedScroll.stop" > <img :src="tpl.src" :alt="tpl.label" loading="lazy" @error="onImageError" /> </div> <div class="related-body"> <span class="related-collection"> {{ tpl.collection }} </span> <h3 class="related-name"> {{ tpl.label }} </h3> <p class="related-desc"> {{ tpl.desc }} </p> <span class="related-more">{{ $t('intro.viewTemplate') }}</span> </div> </article> </div> </div> </section> <!-- ========================================= 8. BÀI VIẾT LIÊN QUAN ========================================== --> <section class="detail-section"> <div class="container"> <span class="eyebrow"> <span class="eyebrow-line"></span> {{ $t('intro.articles') }} <span class="eyebrow-line"></span> </span> <h2 class="section-title"> {{ $t('intro.readFirst') }} </h2> <div class="articles-grid"> <article v-for="article in RELATED_ARTICLES" :key="article.title" class="article-card" @click="goArticle(article)" > <h3>{{ article.title }}</h3> <p>{{ article.desc }}</p> <span class="article-more">{{ $t('intro.readMore') }}</span> </article> </div> </div> </section> </template> <!-- ========================================= 9. CTA CUỐI TRANG ========================================== --> <section class="final-cta"> <div class="final-inner"> <span class="final-orn">{{ meta.orn }}</span> <h2>{{ $t("intro.likeIt", { name: getThemeLabel(wedding) }) }}</h2> <p> {{ $t('intro.finalText') }} </p> <div class="final-actions"> <button type="button" class="primary-btn" @click="goEditor" > {{ $t('intro.useThis') }} </button> <button type="button" class="outline-btn" @click="goOpen" > Xem demo </button> </div> </div> </section> </template> <!-- ===================================================== TOAST ====================================================== --> <Transition name="toast"> <div v-if="toast" class="toast-message"> <span>✓</span> {{ toast }} </div> </Transition> </main> </template> <script setup> import { useI18n } from "vue-i18n"; import { computed, onBeforeUnmount, ref, watch } from "vue"; import { useRoute, useRouter } from "vue-router"; import { useWeddingStore } from "@/stores/wedding"; import { getCollection, getThemeMeta, } from "@/data/templateCollections"; import { handleImageError, previewFor, } from "@/utils/weddingCard"; import { BRAND } from "@/data/siteContent"; import { faqJsonLd, useSeo } from "@/composables/useSeo"; import { useHoverAutoScroll } from "@/composables/useHoverAutoScroll"; import FaqAccordion from "@/components/marketing/FaqAccordion.vue"; const { t } = useI18n(); /* ========================================================= TRANG GIỚI THIỆU MẪU — trang đích đầy đủ nội dung cho từng mẫu thiệp (kiểu trang landing mẫu): hero một màn → điểm nổi bật → giới thiệu + toàn cảnh → phù hợp cho → tính năng → hỏi đáp → mẫu liên quan → bài viết liên quan → CTA cuối. Luồng: /wedding/:slug (ở đây) → /open (phong bì) → /view Toàn trang dùng hệ màu studio chung (giấy dó, mực nho, vàng foil) — bản sắc từng mẫu nằm ở ảnh, tên, mô tả, từ khóa và nội dung dựng từ THEME_META. ========================================================= */ const route = useRoute(); const router = useRouter(); const store = useWeddingStore(); const wedding = computed(() => store.wedding); const FALLBACK_ORN = "囍"; /* getWeddingMeta nhận cả object thiệp (trước đây truyền nhầm tên mẫu → luôn rơi về FALLBACK_META) */ const meta = computed(() => getWeddingMeta(wedding.value)); /* ========================================================= HELPERS — đọc dữ liệu hiển thị của mẫu ========================================================= */ function themeNameOf(item) { return item?.theme?.Name || item?.theme || ""; } function getWeddingMeta(item) { return getThemeMeta(themeNameOf(item)); } function getCoupleName(item) { const bride = item?.couple?.Bride?.Name || ""; const groom = item?.couple?.Groom?.Name || ""; if (!bride && !groom) { return t("sections.couple");
  }

  return `${bride} & ${groom}`;
}

function getThemeLabel(item) {
  const themeName = themeNameOf(item);

  return getThemeMeta(themeName).name || themeName || "Classic";
}

function getCollectionLabel(item) {
  return getCollection(getWeddingMeta(themeNameOf(item)).collection).name;
}

/*
 * Sự kiện chính — Lễ Thành Hôn nếu có, không thì sự kiện
 * đầu tiên. Hiển thị ngày giờ địa điểm gọn trên trang.
 */
const mainEvent = computed(() => {
  const events = wedding.value?.events || [];

  return (
    events.find((event) => event.EventType === "tanthanh") || events[0] || null
  );
});

function onImageError(event) {
  handleImageError(event);
}

/* =========================================================
   TỰ CUỘN ẢNH XEM TRƯỚC — CHỈ TRÊN ĐIỆN THOẠI
   ---------------------------------------------------------
   Ảnh trong template-preview là ảnh chụp NGUYÊN TRANG thiệp
   (tỉ lệ ~1:12) — khung 9/16 chỉ hiện được khoảng 1/7. Trên
   điện thoại, ảnh được cuộn tự động từ đầu đến cuối để khách
   xem trọn bộ thiết kế ngay tại trang giới thiệu:

     - cuộn xuống chậm rãi, hết ảnh thì cuộn ngược lên
     - chạm vào ảnh để tạm dừng, nhấc tay là chạy tiếp
     - prefers-reduced-motion: tắt hiệu ứng, cho cuộn tay
     - màn > 640px: ảnh tĩnh như cũ (desktop đã có khung
       "Toàn cảnh" cuộn tay ở section Giới thiệu)
========================================================= */

const heroFrame = ref(null);
const heroImg = ref(null);

let heroScrollAnim = null;
let heroResumeTimer = null;
let heroResizeObserver = null;

/* Tốc độ cuộn (px/giây) — ảnh ~3000px hết trong ~30s. */
const AUTO_SCROLL_SPEED = 100;

function stopHeroAutoScroll() {
  clearTimeout(heroResumeTimer);

  if (heroScrollAnim) {
    heroScrollAnim.cancel();

    heroScrollAnim = null;
  }
}

function startHeroAutoScroll() {
  stopHeroAutoScroll();

  const frame = heroFrame.value;
  const img = heroImg.value;

  if (!frame || !img) {
    return;
  }

  /* Desktop/tablet (và môi trường không có matchMedia): ảnh tĩnh. */
  if (
    typeof window.matchMedia !== "function" ||
    !window.matchMedia("(max-width: 640px)").matches
  ) {
    frame.classList.remove("is-manual");

    return;
  }

  const distance = img.offsetHeight - frame.clientHeight;

  const noMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Ảnh ngắn hơn khung hoặc tắt hiệu ứng → cho cuộn tay. */
  if (distance <= 40 || noMotion) {
    frame.classList.add("is-manual");

    return;
  }

  frame.classList.remove("is-manual");

  const duration = Math.min(
    60000,
    Math.max(15000, (distance / AUTO_SCROLL_SPEED) * 1000)
  );

  heroScrollAnim = img.animate(
    [
      { transform: "translateY(0)" },
      { transform: `translateY(-${distance}px)` },
    ],
    {
      duration,

      /* đứng một nhịp ở đầu ảnh cho khách kịp thấy trang bìa */
      delay: 600,

      iterations: Infinity,
      direction: "alternate",
      easing: "ease-in-out",
    }
  );
}

/* Chạm vào ảnh → dừng lại xem kỹ; nhấc tay → chạy tiếp. */
function pauseHeroAutoScroll() {
  if (!heroScrollAnim) {
    return;
  }

  clearTimeout(heroResumeTimer);

  heroScrollAnim.pause();
}

function resumeHeroAutoScroll() {
  if (!heroScrollAnim || heroScrollAnim.playState !== "paused") {
    return;
  }

  clearTimeout(heroResumeTimer);

  heroResumeTimer = setTimeout(() => {
    heroScrollAnim?.play();
  }, 1200);
}

function onHeroImageLoad() {
  /* Đợi layout tính xong chiều cao ảnh rồi mới đo. */
  requestAnimationFrame(() => startHeroAutoScroll());
}

/*
 * Khung ảnh mount/unmount theo v-if (loading → error → hero)
 * — mỗi lần khung mới xuất hiện thì đo lại. ResizeObserver
 * lo phần xoay ngang / đổi kích thước màn hình.
 */
watch(heroFrame, (frame) => {
  stopHeroAutoScroll();

  heroResizeObserver?.disconnect();

  if (frame && typeof ResizeObserver !== "undefined") {
    if (!heroResizeObserver) {
      heroResizeObserver = new ResizeObserver(() => startHeroAutoScroll());
    }

    heroResizeObserver.observe(frame);
  }
});

/* Đổi mẫu (thẻ liên quan) → dừng cuộn cũ, chờ ảnh mới load. */
watch(
  () => wedding.value?.slug,
  () => {
    stopHeroAutoScroll();

    relatedScroll.stop();
  }
);

onBeforeUnmount(() => {
  stopHeroAutoScroll();

  heroResizeObserver?.disconnect();
});

/* =========================================================
   NỘI DUNG DÀNH RIÊNG CHO TỪNG MẪU
   ---------------------------------------------------------
   Dựng từ bản sắc theme (THEME_META) + dữ liệu demo trong
   wedding.json: mọi mẫu đều có đủ "Điểm nổi bật", "Giới
   thiệu", "Phù hợp cho" và 4 câu hỏi thường gặp riêng —
   không phải viết tay 19 bộ nội dung.
========================================================= */

/*
 * Tag màu — chọn theo KEY ổn định (tagKeys), không theo chữ:
 * tags đã dịch theo ngôn ngữ giao diện nên regex tiếng Việt
 * cũ ("đỏ|xanh|vàng...") không còn dùng được.
 */
const COLOR_TAG_KEYS = new Set([
  "tpl.tag.vermilion",
  "tpl.tag.deepRed",
  "tpl.tag.darkRed",
  "tpl.tag.rosyRed",
  "tpl.tag.gold",
  "tpl.tag.brass",
  "tpl.tag.pink",
  "tpl.tag.blush",
  "tpl.tag.peach",
  "tpl.tag.peachPink",
  "tpl.tag.purple",
  "tpl.tag.lavender",
  "tpl.tag.cream",
  "tpl.tag.creamPaper",
  "tpl.tag.white",
  "tpl.tag.ivory",
  "tpl.tag.silk",
  "tpl.tag.darkBg",
  "tpl.tag.darkBg2",
  "tpl.tag.moss",
  "tpl.tag.green",
  "tpl.tag.terracotta",
  "tpl.tag.champagne",
]);

/* Tên gọi của ký tự họa tiết đặc trưng (orn) trong câu văn. */
const ORN_KEYS = {
  "囍": "intro.orn.xi",
  "✦": "intro.orn.foil",
  "❀": "intro.orn.pattern",
  "❧": "intro.orn.leaf",
  "❦": "intro.orn.baroque",
};

/* Bộ sưu tập → hậu tố key (khách hợp / cảm giác / loại tiệc) */
const COLLECTION_KEY = {
  "truyen-thong": "traditional",
  "lang-man": "romantic",
  "hien-dai": "modern",
  "co-dien": "classic",
  "nghe-thuat": "art",
  "thien-nhien": "nature",
  "a-dong": "asian",
};

const SUITABLE_BY_COLLECTION = {
  traditional: ["intro.event.traditional", "intro.event.ancestral", "intro.event.formalParty"],
  romantic: ["intro.event.outdoor", "intro.event.modern", "intro.event.garden"],
  modern: ["intro.event.luxuryParty", "intro.event.restaurant", "intro.event.city"],
  classic: ["intro.event.luxuryParty", "intro.event.formalCeremony", "intro.event.restaurant"],
  art: ["intro.event.outdoor", "intro.event.creative", "intro.event.garden"],
  nature: ["intro.event.outdoor", "intro.event.nature", "intro.event.garden"],
  asian: ["intro.event.traditional", "intro.event.ancestral", "intro.event.formalParty"],
};

/* Các mục nội dung của thiệp — đọc từ settings trong wedding.json. */
const SECTION_LABELS = [
  ["ShowStory", "intro.sec.story"],
  ["ShowEvents", "intro.sec.events"],
  ["ShowCountdown", "intro.sec.countdown"],
  ["ShowTimeline", "intro.sec.timeline"],
  ["ShowGallery", "intro.sec.gallery"],
  ["ShowMap", "intro.sec.map"],
  ["ShowGuestBook", "intro.sec.guestbook"],
  ["ShowGift", "intro.sec.gift"],
];

const content = computed(() => {
  const item = wedding.value;

  if (!item) {
    return null;
  }

  const m = meta.value;

  const collection = getCollection(m.collection);

  /* Danh sách nối theo ngôn ngữ ("a, b, c" · "a、b、c") */
  const join = (list) => list.join(t("intro.listSep"));

  const tagKeys = m.tagKeys?.length ? m.tagKeys : ["tpl.tag.classic"];

  const label = (key) => (key.startsWith("raw:") ? key.slice(4) : t(key));

  const colorKey = tagKeys.find((key) => COLOR_TAG_KEYS.has(key)) || tagKeys[0];

  const motifKey = tagKeys.filter((key) => key !== colorKey).pop() || tagKeys[0];

  const colorTag = label(colorKey);

  const colorLower = colorTag.toLowerCase();

  const ornLabel = t(ORN_KEYS[m.orn] || "intro.orn.default");

  /* Tránh lặp khi theme chỉ có 1 tag ("Cổ điển" cả hai vai). */
  const motifText = motifKey !== colorKey ? label(motifKey).toLowerCase() : ornLabel;

  const settings = item.settings || {};

  const sections = SECTION_LABELS.filter(([key]) => settings[key]).map(([, key]) => t(key));

  const colKey = COLLECTION_KEY[m.collection] || "classic";

  const suitable = SUITABLE_BY_COLLECTION[colKey].map((key) => t(key));

  const audience = COLLECTION_KEY[m.collection] ? t(`intro.audience.${colKey}`) : t("intro.audience.default");

  const feeling = COLLECTION_KEY[m.collection] ? t(`intro.feeling.${colKey}`) : t("intro.feeling.default");

  const couple = getCoupleName(item);

  const sectionList = sections.length ? join(sections.slice(0, 5)) : t("intro.allSections");

  const seal = m.orn === "囍" ? t("intro.seal") : "";

  const base = { name: m.name, collection: collection.name, color: colorLower, orn: ornLabel, seal, desc: m.desc };

  const highlights = [
    { orn: m.orn, text: t("intro.hl.accent", { color: colorTag, motif: motifText }) },
    { orn: "✉", text: t("intro.hl.envelope", base) },
    {
      orn: "❊",
      text: sections.length
        ? t("intro.hl.sections", { list: join(sections.slice(0, 3)) })
        : t("intro.hl.complete"),
    },
    { orn: "❦", text: t("intro.hl.interactive") },
  ];

  const paragraphs = [
    t("intro.p1", { ...base, audience, feeling, bg: t(m.dark ? "intro.onDark" : "intro.onWarm") }),
    t("intro.p2", { ...base, list: sectionList, couple }),
    t("intro.p3", { ...base, brand: BRAND.name }),
  ];

  const faqs = [
    { q: t("intro.faq1.q", base), a: t("intro.faq1.a", { ...base, motif: motifText }) },
    {
      q: t("intro.faq2.q", base),
      a:
        m.collection === "a-dong"
          ? t("intro.faq2.aAsian", base)
          : t("intro.faq2.a", { ...base, s1: suitable[0].toLowerCase(), s2: suitable[1].toLowerCase() }),
    },
    { q: t("intro.faq3.q", base), a: t("intro.faq3.a", base) },
    { q: t("intro.faq4.q", base), a: t("intro.faq4.a", { list: join(suitable.map((s) => s.toLowerCase())) }) },
  ];

  return { highlights, paragraphs, suitable, faqs };
});

/* =========================================================
   TÍNH NĂNG & BÀI VIẾT — nội dung chung cho mọi mẫu
========================================================= */

const FEATURES = [
  { orn: "❊", get label() { return t("intro.f1"); } },
  { orn: "✦", get label() { return t("intro.f2"); } },
  { orn: "◈", get label() { return t("intro.f3"); } },
  { orn: "♪", get label() { return t("intro.f4"); } },
  { orn: "✉", get label() { return t("intro.f5"); } },
  { orn: "❋", get label() { return t("intro.f6"); } },
  { orn: "✓", get label() { return t("intro.f7"); } },
  { orn: "❦", get label() { return t("intro.f8"); } },
];

const RELATED_ARTICLES = [
  {
    get title() { return t("intro.article1.title"); },
    get desc() { return t("intro.article1.desc"); },
    route: { name: "Guide" },
  },
  {
    get title() { return t("intro.article2.title"); },
    get desc() { return t("intro.article2.desc"); },
    route: { name: "Pricing" },
  },
];

/* =========================================================
   MẪU LIÊN QUAN — cùng bộ sưu tập lên trước, đủ 3 mẫu

   Đọc thẳng wedding.json (đã nằm trong bundle, cùng chunk
   với store) nên không tốn thêm request.
========================================================= */

const allTemplates = ref([]);

let templatesLoaded = false;

function loadAllTemplates() {
  if (templatesLoaded) {
    return;
  }

  templatesLoaded = true;

  import("@/mock/wedding.json")
    .then((module) => {
      allTemplates.value = Array.isArray(module.default) ? module.default : [];
    })
    .catch(() => {
      templatesLoaded = false;
    });
}

const relatedTemplates = computed(() => {
  const list = allTemplates.value;

  const item = wedding.value;

  if (!list.length || !item) {
    return [];
  }

  const currentSlug = item.slug || route.params.slug;

  const currentCollection = meta.value.collection;

  const collectionOf = (w) =>
    getThemeMeta(themeNameOf(w)).collection;

  const decorate = (w) => ({
    slug: w.slug,
    src: previewFor(w),
    label: getThemeLabel(w),
    collection: getCollectionLabel(w),
    desc: getWeddingMeta(w).desc,
  });

  const sameCollection = list.filter(
    (w) => w.slug !== currentSlug && collectionOf(w) === currentCollection
  );

  const others = list.filter(
    (w) => w.slug !== currentSlug && collectionOf(w) !== currentCollection
  );

  return [...sameCollection, ...others].slice(0, 3).map(decorate);
});

/*
 * Thẻ mẫu liên quan — hover để tự cuộn ảnh nguyên trang
 * (hiệu ứng nằm ở composables/useHoverAutoScroll.js).
 */
const relatedScroll = useHoverAutoScroll();

/* =========================================================
   CẬP NHẬT — nhãn "Cập nhật T9/2026" dưới từ khóa
========================================================= */

const updatedLabel = computed(() => {
  const now = new Date();

  return `T${now.getMonth() + 1}/${now.getFullYear()}`;
});

/* =========================================================
   LINK BƯỚC 2 — chia sẻ phải mở đúng phong bì,
   không phải trang giới thiệu này.
========================================================= */

const openUrl = computed(() => {
  const slug = wedding.value?.slug || route.params.slug || "";

  return slug ? `${window.location.origin}/wedding/${slug}/open` : "";
});

/* =========================================================
   SEO — mỗi mẫu một thẻ riêng để chia sẻ lên Facebook/Zalo
   hiện đúng tên thiết kế và ảnh xem trước.

   JSON-LD gộp 3 khối: BreadcrumbList (đường dẫn), FAQPage
   (hỏi đáp cuối trang — đủ điều kiện rich snippet) và
   CreativeWork (chính mẫu thiệp này).
========================================================= */

useSeo(() => {
  const item = wedding.value;

  if (!item) {
    return {
      get title() { return t("nav.templatesTitle"); },
      get description() { return t("intro.previewDesc"); },
      path: route.path,
    };
  }

  const label = getThemeLabel(item);

  const faqs = content.value?.faqs || [];

  return {
    title: `${label} — Mẫu thiệp cưới`,
    description:
      meta.value.desc ||
      item.story?.Description ||
      `Mẫu thiệp cưới ${label}. Xem trước và tùy chỉnh theo ngày cưới của bạn.`,
    path: route.path,
    image: previewFor(item),
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              get name() { return t("nav.home"); },
              item: BRAND.siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              get name() { return t("editor.header.template"); },
              item: `${BRAND.siteUrl}/mau-thiep-cuoi`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: label,
            },
          ],
        },
        faqJsonLd(faqs),
        {
          "@type": "CreativeWork",
          name: `${label} — Mẫu thiệp cưới online`,
          description: meta.value.desc,
          image: previewFor(item),
          url: `${BRAND.siteUrl}${route.path}`,
          keywords: (meta.value.tags || []).join(", "),
        },
      ],
    },
  };
});

/* =========================================================
   LOAD

   loadWeddingNoApi: trang này là bước 1 của luồng XEM MẪU
   (/wedding/:slug) — dữ liệu lấy thẳng từ wedding.json có
   sẵn trong bundle, không gọi API. Thiệp thật của khách mời
   không đi qua đây (link khách là /:slug/:token).
========================================================= */

async function loadWedding(slug) {
  if (typeof slug !== "string" || !slug.trim()) {
    store.wedding = null;
    store.error = t("intro.badLink");

    return;
  }

  try {
    await store.loadWeddingNoApi(slug);

    loadAllTemplates();
  } catch (error) {
    console.error("[WeddingIntro] load error:", error);
  }
}

watch(
  () => route.params.slug,
  (slug, oldSlug) => {
    if (slug === oldSlug) {
      return;
    }

    loadWedding(slug);
  },
  { immediate: true },
);

/* =========================================================
   ĐIỀU HƯỚNG
========================================================= */

function goTemplates() {
  router.push({ name: "Templates" });
}

/* Bước 2 — phong bì */
function goOpen() {
  const slug = wedding.value?.slug || route.params.slug;

  if (!slug) {
    return;
  }

  /*
   * Mở demo ở TAB MỚI — khách xem thiệp xong đóng tab là
   * quay lại đúng trang giới thiệu mẫu đang đọc dở.
   */
  const { href } = router.resolve({ name: "WeddingOpen", params: { slug } });

  window.open(href, "_blank", "noopener");
}

function goEditor() {
  const themeName = themeNameOf(wedding.value);

  router.push({
    name: "Editor",
    query: themeName ? { theme: themeName } : {},
  });
}

/* Mẫu liên quan — cùng component, đổi slug là tự tải lại. */
function goRelated(slug) {
  if (!slug) {
    return;
  }

  router.push({ name: "WeddingIntro", params: { slug } });
}

function goGuide() {
  router.push({ name: "Guide" });
}

function goArticle(article) {
  if (article?.route) {
    router.push(article.route);
  }
}

/* =========================================================
   SHARE
========================================================= */

const toast = ref("");

let toastTimer = null;

function showToast(message) {
  toast.value = message;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2500);
}

async function shareTemplate() {
  if (!openUrl.value) {
    return;
  }

  try {
    if (navigator.share) {
      await navigator.share({
        title: getThemeLabel(wedding.value),
        get text() { return t("intro.shareText"); },
        url: openUrl.value,
      });

      return;
    }

    await navigator.clipboard.writeText(openUrl.value);

    showToast(t("intro.linkCopied"));
  } catch (error) {
    // Người dùng đóng hộp thoại share
  }
}
</script>

<style scoped>
/* =========================================================
   TRANG — khung sáng "giấy dó", đồng nhất với Templates.vue:
   nền kem sáng, chữ mực nho, vàng foil, đỏ ấn son.
========================================================= */

.intro-page {
  --text: var(--studio-ink, #2b2118);
  --muted: var(--studio-ink-faint, #8a7a68);

  min-height: 100vh;
  min-height: 100dvh;

  background:
    radial-gradient(
      circle at 8% 4%,
      rgba(185, 151, 91, 0.1),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #fdfbf5 0%,
      #faf7ef 50%,
      #f6f1e4 100%
    );

  color: var(--text);

  padding-bottom: 80px;
}

/* =========================================================
   TOPBAR
========================================================= */

.intro-topbar {
  position: sticky;
  top: 0;
  z-index: 50;

  padding: 14px 0;

  background: var(--studio-glass-strong, rgba(250, 246, 238, 0.85));

  backdrop-filter: blur(14px);

  border-bottom: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
}

.topbar-inner {
  width: min(1200px, calc(100% - 32px));

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 0 auto;
}

.back-btn,
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  min-height: 40px;
  padding: 0 16px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 999px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.back-btn svg {
  width: 15px;
  height: 15px;
}

.share-btn svg {
  width: 14px;
  height: 14px;
}

.back-btn:hover,
.share-btn:hover {
  transform: translateY(-1px);

  border-color: rgba(185, 151, 91, 0.5);

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-seal, #a63a2e);
}

/* =========================================================
   LOADING / ERROR
========================================================= */

.intro-state {
  width: min(100%, 460px);

  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;

  margin: 90px auto 0;
  padding: 48px 30px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 22px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 20px 50px rgba(43, 33, 24, 0.12);
}

.state-orn {
  width: 64px;
  height: 64px;

  display: grid;
  place-items: center;

  margin-bottom: 18px;

  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol, serif);

  font-size: 26px;
}

.intro-state h1 {
  margin: 0 0 10px;

  font-family: var(--font-heading), Georgia, serif;

  font-size: var(--text-2xl);

  font-weight: 500;
}

.intro-state p {
  margin: 0 0 24px;

  color: var(--muted);

  font-size: var(--text-md);

  line-height: 1.8;
}

.state-title {
  color: var(--studio-ink-soft, #5c4f43);

  font-size: var(--text-md);
}

.state-spinner {
  width: 28px;
  height: 28px;

  margin-top: 20px;

  border-radius: 50%;

  border: 3px solid rgba(185, 151, 91, 0.25);
  border-top-color: var(--studio-foil, #b9975b);

  animation: spinner 0.8s linear infinite;
}

.state-btn {
  border: 0;
  padding: 12px 24px;

  border-radius: 999px;

  background: var(--studio-seal, #a63a2e);

  color: #fff;

  font-size: var(--text-sm);

  font-weight: 600;

  cursor: pointer;

  transition: transform 0.25s ease;
}

.state-btn:hover {
  transform: translateY(-2px);
}

/* =========================================================
   GIỚI THIỆU MẪU — khối chào trên cùng
========================================================= */

.intro-brief {
  padding: clamp(28px, 5vw, 56px) 0 0;

  text-align: center;
}

.brief-inner {
  width: min(760px, calc(100% - 32px));

  margin: 0 auto;
}

.brief-orn {
  display: inline-grid;
  place-items: center;

  width: clamp(44px, 6vw, 56px);
  height: clamp(44px, 6vw, 56px);

  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol, serif);

  font-size: clamp(18px, 2.4vw, 22px);
}

.brief-title {
  margin: 14px 0 0;

  font-family: var(--font-heading), "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 4.5vw, 44px);

  line-height: 1.1;

  font-weight: 500;

  letter-spacing: -0.02em;

  color: var(--text);
}

.brief-couple {
  margin: 8px 0 0;

  color: var(--muted);

  font-size: clamp(13px, 1.6vw, 15px);
}

.brief-desc {
  max-width: 560px;

  margin: 12px auto 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(13.5px, 1.6vw, 15px);

  line-height: 1.75;
}

/* =========================================================
   HERO — một màn: ảnh xem trước + thông tin
========================================================= */

.intro-hero {
  /* chiếm đúng phần còn lại của màn, nhưng dài thêm được
   * nếu nội dung (breadcrumb, sự kiện...) tràn trên màn thấp */
  min-height: calc(100vh - 68px);
  min-height: calc(100dvh - 68px);

  display: flex;
  align-items: center;

  padding: clamp(16px, 3vw, 28px) 0;
}

.hero-inner {
  width: min(1200px, calc(100% - 32px));

  display: grid;

  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);

  gap: clamp(28px, 4vw, 56px);

  margin: 0 auto;

  align-items: center;
}

/* =========================================================
   PREVIEW — thẻ ảnh 9/16 vừa chiều cao màn hình
========================================================= */

.preview-col {
  display: flex;
  justify-content: center;
}

.preview-card {
  width: min(360px, 100%);
  max-height: calc(100vh - 220px);
  max-height: calc(100dvh - 220px);

  aspect-ratio: 9 / 16;

  overflow: hidden;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: clamp(16px, 2.5vw, 24px);

  background: #fff;

  box-shadow:
    0 24px 60px rgba(43, 33, 24, 0.16),
    0 0 0 4px rgba(185, 151, 91, 0.16);
}

/*
 * Ảnh trong template-preview là ảnh chụp NGUYÊN TRANG thiệp
 * (tỉ lệ ~1:12) — height:auto cho ảnh tràn xuống dưới khung,
 * phần tràn bị overflow:hidden che đi. Desktop thấy phần đầu
 * trang; điện thoại tự cuộn ảnh bằng translateY (xem script).
 */
.preview-card img {
  width: 100%;
  height: auto;

  display: block;
}

/* Không chạy hiệu ứng (reduced-motion / ảnh ngắn) → cuộn tay */
.preview-card.is-manual {
  overflow-y: auto;

  overscroll-behavior: contain;

  scrollbar-width: none;
}

.preview-card.is-manual::-webkit-scrollbar {
  display: none;
}

/* =========================================================
   INFO — breadcrumb, tên thiết kế, mô tả, từ khóa, hành động
========================================================= */

.info-col {
  min-width: 0;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 7px;

  margin-bottom: 14px;

  color: var(--muted);

  font-size: 12px;
}

.breadcrumb a {
  color: inherit;

  text-decoration: none;

  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: var(--studio-seal, #a63a2e);
}

.breadcrumb .sep {
  opacity: 0.45;
}

.breadcrumb .current {
  color: var(--studio-ink-soft, #5c4f43);

  font-weight: 600;
}

.info-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: var(--studio-seal, #a63a2e);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.info-title {
  margin: 14px 0 0;

  font-family: var(--font-heading), "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 3.6vw, 46px);

  line-height: 1.05;

  font-weight: 500;

  letter-spacing: -0.02em;

  color: var(--text);
}

.info-couple {
  margin: 10px 0 0;

  color: var(--muted);

  font-size: clamp(13px, 1.4vw, 15px);
}

/* =========================================================
   NGÀY CƯỚI — khối ngày + giờ + địa điểm gọn
========================================================= */

.info-event {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 14px;

  margin-top: 18px;
  padding: 12px 18px;

  border: 1px solid rgba(185, 151, 91, 0.35);
  border-radius: 16px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 8px 24px rgba(43, 33, 24, 0.06);
}

.event-date {
  display: flex;
  align-items: baseline;

  gap: 6px;
}

.date-day {
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-num, var(--font-heading)), Georgia, serif;

  font-size: clamp(26px, 3vw, 34px);
  font-weight: 600;

  line-height: 1;
}

.date-rest {
  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(12px, 1.3vw, 13px);
  font-weight: 600;
}

.event-meta {
  flex: 1;

  min-width: 200px;

  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(12px, 1.3vw, 13px);

  line-height: 1.6;
}

.info-desc {
  max-width: 520px;

  margin: 16px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(13.5px, 1.5vw, 15.5px);

  line-height: 1.75;
}

/* từ khóa phong cách — cùng dạng pill với thẻ ở gallery */

.info-tags {
  display: flex;
  flex-wrap: wrap;

  gap: 6px;

  margin-top: 18px;
}

.info-tag {
  display: inline-flex;
  align-items: center;

  padding: 5px 12px;

  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.24));

  border-radius: 999px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(11px, 1.2vw, 11.5px);
  font-weight: 600;

  letter-spacing: 0.02em;
}

.info-updated {
  margin: 14px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 11.5px;

  letter-spacing: 0.04em;
}

/* =========================================================
   CTA — dòng tin cậy + hai nút hành động
========================================================= */

.cta-block {
  margin-top: 18px;
  padding-top: 20px;

  border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  text-align: left;
}

.cta-trust {
  margin: 0;

  color: var(--muted);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.06em;
}

.cta-note {
  margin: 10px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  opacity: 0.75;

  font-size: 12px;
}

.cta-actions,
.final-actions {
  display: flex;
  flex-wrap: wrap;

  gap: 10px;

  margin-top: 14px;
}

.primary-btn,
.outline-btn {
  min-height: 50px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 0 26px;

  border-radius: 999px;

  font-size: clamp(13px, 1.4vw, 14px);
  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease;
}

.primary-btn:hover,
.outline-btn:hover {
  transform: translateY(-2px);
}

.cta-actions svg {
  width: 17px;
  height: 17px;
}

.primary-btn {
  border: 1px solid var(--studio-contrast-bg, #2b2118);

  background: var(--studio-contrast-bg, #2b2118);

  color: var(--studio-contrast-ink, #f7f1e6);

  box-shadow: 0 14px 32px rgba(43, 33, 24, 0.22);
}

.primary-btn:hover {
  box-shadow: 0 20px 42px rgba(43, 33, 24, 0.3);
}

.outline-btn {
  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  background: var(--studio-glass, rgba(255, 255, 255, 0.7));

  color: var(--text);
}

.outline-btn:hover {
  border-color: var(--studio-ink, #2b2118);

  background: var(--studio-glass-strong, #fff);
}

/* =========================================================
   THANH HÀNH ĐỘNG CỐ ĐỊNH — chỉ hiện trên điện thoại
   (nội dung đặt trong media query 640px phía dưới)
========================================================= */

.mobile-cta {
  display: none;
}

/* =========================================================
   KHUNG CHUNG CỦA CÁC SECTION NỘI DUNG
========================================================= */

.detail-section {
  padding: 64px 0 8px;

  text-align: center;
}

.detail-section .container {
  width: min(1080px, calc(100% - 32px));

  margin: 0 auto;
}

.eyebrow {
  display: inline-flex;
  align-items: center;

  gap: 12px;

  color: var(--studio-seal, #a63a2e);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.eyebrow-line {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 151, 91, 0.8));
}

.eyebrow-line:last-child {
  background: linear-gradient(90deg, rgba(185, 151, 91, 0.8), transparent);
}

.section-title {
  margin: 16px 0 0;

  font-family: var(--font-heading), "Cormorant Garamond", Georgia, serif;

  font-size: clamp(22px, 3.2vw, 38px);

  line-height: 1.15;

  font-weight: 500;

  color: var(--text);
}

.section-lead {
  max-width: 560px;

  margin: 14px auto 0;

  color: var(--muted);

  font-size: clamp(13px, 1.4vw, 15px);

  line-height: 1.75;
}

/* =========================================================
   ĐIỂM NỔI BẬT — lưới 2 cột, mỗi ô một câu
========================================================= */

.highlights-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 14px;

  margin: 32px 0 0;
  padding: 0;

  list-style: none;

  text-align: left;
}

.highlights-grid li {
  display: flex;

  gap: 14px;

  padding: 20px 18px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 16px;

  background: var(--studio-card, #fffdf8);

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.highlights-grid li:hover {
  transform: translateY(-3px);

  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 16px 34px rgba(43, 33, 24, 0.12);
}

.hl-orn {
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  border-radius: 12px;

  background: color-mix(
    in srgb,
    var(--studio-foil, #b9975b) 14%,
    transparent
  );

  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol, var(--font-heading), serif);

  font-size: 17px;

  line-height: 1;
}

.highlights-grid p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(13px, 1.4vw, 14px);

  line-height: 1.7;
}

/* =========================================================
   GIỚI THIỆU + TOÀN CẢNH — chữ trái, khung thiệp phải

   Khung phải chứa ảnh xem trước DÀI (tỉ lệ ~1:12) trong
   vùng cuộn nội bộ: xem được trọn bộ thiệp mà không làm
   trang dài hàng chục nghìn pixel.
========================================================= */

.overview-grid {
  display: grid;

  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);

  gap: clamp(28px, 4vw, 48px);

  margin-top: 34px;

  align-items: start;

  text-align: left;
}

.overview-text p {
  margin: 0 0 14px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(13.5px, 1.5vw, 15.5px);

  line-height: 1.85;
}

.overview-frame {
  position: sticky;
  top: 88px;

  width: min(340px, 100%);

  margin: 0 auto;

  overflow: hidden;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: clamp(14px, 2vw, 20px);

  background: #fff;

  box-shadow:
    0 20px 50px rgba(43, 33, 24, 0.14),
    0 0 0 4px rgba(185, 151, 91, 0.14);
}

.frame-scroll {
  max-height: min(64vh, 620px);

  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: rgba(185, 151, 91, 0.5) transparent;
}

.frame-scroll::-webkit-scrollbar {
  width: 6px;
}

.frame-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;

  background: rgba(185, 151, 91, 0.5);
}

.frame-scroll img {
  width: 100%;

  display: block;
}

.frame-hint {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 11px 12px;

  border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  background: var(--studio-card, #fffdf8);

  color: var(--muted);

  font-size: 12px;
  font-weight: 600;
}

.frame-hint svg {
  width: 14px;
  height: 14px;

  animation: hintBounce 2s ease-in-out infinite;
}

/* =========================================================
   PHÙ HỢP CHO — pill + link hướng dẫn
========================================================= */

.suitable {
  margin-top: 24px;
  padding: 20px 22px;

  border: 1px solid rgba(185, 151, 91, 0.35);
  border-radius: 16px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 8px 24px rgba(43, 33, 24, 0.06);
}

.suitable h3 {
  margin: 0 0 12px;

  color: var(--studio-seal, #a63a2e);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.suitable-tags {
  display: flex;
  flex-wrap: wrap;

  gap: 6px;
}

.guide-link {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  margin-top: 14px;
  padding: 0;

  border: 0;

  background: none;

  color: var(--studio-seal, #a63a2e);

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;
}

.guide-link:hover {
  text-decoration: underline;
}

/* =========================================================
   TÍNH NĂNG — lưới chip 4 cột
========================================================= */

.features-grid {
  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 12px;

  margin: 32px 0 0;
  padding: 0;

  list-style: none;

  text-align: left;
}

.features-grid li {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 15px 16px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 14px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(12.5px, 1.4vw, 13.5px);
  font-weight: 600;

  line-height: 1.4;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.features-grid li:hover {
  transform: translateY(-2px);

  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 12px 26px rgba(43, 33, 24, 0.1);
}

.feat-orn {
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  border-radius: 10px;

  background: color-mix(
    in srgb,
    var(--studio-foil, #b9975b) 14%,
    transparent
  );

  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol, serif);

  font-size: 15px;

  line-height: 1;
}

/* =========================================================
   FAQ — accordion dùng component FaqAccordion (style
   mk-faq-* nằm ở marketing.css, dùng chung với trang chủ).
========================================================= */

.faq-wrap {
  max-width: 760px;

  margin: 30px auto 0;

  text-align: left;
}

/* =========================================================
   MẪU THIỆP LIÊN QUAN — 3 thẻ
========================================================= */

.related-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 16px;

  margin: 32px 0 0;
}

.related-card {
  display: flex;
  flex-direction: column;

  overflow: hidden;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 18px;

  background: var(--studio-card, #fffdf8);

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.related-card:hover {
  transform: translateY(-4px);

  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 18px 40px rgba(43, 33, 24, 0.14);
}

.related-thumb {
  aspect-ratio: 3 / 4;

  overflow: hidden;

  background: #fff;
}

/*
 * Ảnh thẻ là ảnh nguyên trang (~1:12) — height:auto, phần
 * tràn nằm dưới khung 3/4 nên bình thường chỉ thấy trang
 * bìa. Hover: ảnh tự cuộn xuống bằng translateY (xem
 * composables/useHoverAutoScroll.js), rời chuột thì về đầu.
 */
.related-thumb img {
  width: 100%;
  height: auto;

  display: block;
}

.related-body {
  display: flex;
  flex-direction: column;

  gap: 6px;

  padding: 16px 16px 18px;
}

.related-collection {
  color: var(--studio-seal, #a63a2e);

  font-size: 10.5px;
  font-weight: 700;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.related-name {
  margin: 0;

  font-family: var(--font-heading), Georgia, serif;

  font-size: clamp(16px, 1.8vw, 18px);
  font-weight: 600;

  color: var(--text);
}

.related-desc {
  margin: 0;

  color: var(--muted);

  font-size: clamp(12px, 1.3vw, 12.5px);

  line-height: 1.65;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

.related-more {
  margin-top: 4px;

  color: var(--studio-seal, #a63a2e);

  font-size: 12px;
  font-weight: 700;
}

/* =========================================================
   BÀI VIẾT LIÊN QUAN — 2 thẻ
========================================================= */

.articles-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 16px;

  max-width: 780px;

  margin: 32px auto 0;
}

.article-card {
  padding: 24px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 18px;

  background: var(--studio-card, #fffdf8);

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.article-card:hover {
  transform: translateY(-3px);

  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 16px 34px rgba(43, 33, 24, 0.12);
}

.article-card h3 {
  margin: 0 0 8px;

  font-family: var(--font-heading), Georgia, serif;

  font-size: clamp(15px, 1.8vw, 17px);
  font-weight: 600;

  color: var(--text);
}

.article-card p {
  margin: 0 0 12px;

  color: var(--muted);

  font-size: clamp(12.5px, 1.4vw, 13px);

  line-height: 1.7;
}

.article-more {
  color: var(--studio-seal, #a63a2e);

  font-size: 12.5px;
  font-weight: 700;
}

/* =========================================================
   CTA CUỐI TRANG
========================================================= */

.final-cta {
  padding: 72px 0 24px;
}

.final-inner {
  width: min(680px, calc(100% - 32px));

  margin: 0 auto;
  padding: 44px 28px;

  border: 1px solid rgba(185, 151, 91, 0.35);
  border-radius: 24px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 24px 60px rgba(43, 33, 24, 0.12);

  text-align: center;
}

.final-orn {
  width: 56px;
  height: 56px;

  display: grid;
  place-items: center;

  margin: 0 auto 16px;

  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol, serif);

  font-size: 22px;
}

.final-inner h2 {
  margin: 0 0 10px;

  font-family: var(--font-heading), "Cormorant Garamond", Georgia, serif;

  font-size: clamp(22px, 3vw, 34px);

  font-weight: 500;
}

.final-inner p {
  max-width: 460px;

  margin: 0 auto 22px;

  color: var(--muted);

  font-size: clamp(13.5px, 1.5vw, 14.5px);

  line-height: 1.75;
}

.final-actions {
  justify-content: center;
}

/* =========================================================
   TOAST
========================================================= */

.toast-message {
  position: fixed;

  left: 50%;
  bottom: 28px;

  z-index: 10001;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 12px 17px;

  transform: translateX(-50%);

  border: 1px solid rgba(43, 33, 24, 0.1);
  border-radius: 999px;

  background: rgba(43, 33, 24, 0.92);

  backdrop-filter: blur(15px);

  color: #fff;

  box-shadow: 0 15px 35px rgba(43, 33, 24, 0.25);

  font-size: var(--text-sm);
}

.toast-message span {
  color: var(--studio-foil, #b9975b);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform: translate(-50%, 12px);
}

/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

@keyframes hintBounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(3px);
  }
}

/* =========================================================
   TABLET — hero xếp chồng, khung toàn cảnh về 1 cột
========================================================= */

@media (max-width: 1024px) {
  .intro-brief {
    padding-top: clamp(20px, 4vw, 32px);
  }

  .intro-hero {
    align-items: stretch;
  }

  .hero-inner {
    grid-template-columns: 1fr;

    gap: 24px;
  }

  .preview-col {
    justify-content: stretch;
  }

  .preview-card {
    width: min(320px, 100%);

    margin: 0 auto;

    max-height: 52vh;
  }

  .overview-grid {
    grid-template-columns: 1fr;

    gap: 28px;
  }

  .overview-frame {
    position: static;
  }

  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* =========================================================
   MOBILE — ảnh to gần toàn màn, nội dung gọn
========================================================= */

@media (max-width: 640px) {
  .intro-page {
    padding-bottom: 140px; /* chừa chỗ cho thanh CTA cố định */
  }

  .intro-topbar {
    padding: 10px 0;
  }

  .back-btn,
  .share-btn {
    min-height: 36px;

    padding: 0 13px;

    font-size: 12px;
  }

  .intro-hero {
    min-height: auto;

    padding: 12px 0 0;
  }

  .hero-inner {
    width: calc(100% - 24px);
  }

  /* ---- điện thoại CHỈ giữ: GIỚI THIỆU + ẢNH + MỤC TÍNH NĂNG ----

     Cột chữ của hero lẫn mọi section khác (điểm nổi
     bật, giới thiệu, hỏi đáp, mẫu liên quan, bài viết,
     CTA cuối) đều ẩn — nội dung đầy đủ xem trên máy
     tính. Hành động chuyển đổi nằm ở thanh cố định dưới
     đáy màn hình. */

  .info-col,
  .final-cta {
    display: none;
  }

  /* mặc định ẩn mọi section — chỉ hiện mục được đánh dấu */
  .detail-section {
    display: none;
  }

  .detail-section.sec-features {
    display: block;

    padding: 40px 0 8px;
  }

  .detail-section .container {
    width: calc(100% - 24px);
  }

  /* thẻ ảnh chiếm trọn bề rộng — khung cho ảnh tự cuộn */
  .preview-card {
    width: 100%;

    max-height: 64vh;

    border-radius: 16px;

    box-shadow: 0 18px 44px rgba(43, 33, 24, 0.16);
  }

  .features-grid {
    gap: 8px;

    margin-top: 24px;
  }

  .features-grid li {
    padding: 12px;

    font-size: 12.5px;
  }

  .feat-orn {
    width: 30px;
    height: 30px;

    font-size: 13px;
  }

  /* ---- thanh hành động cố định dưới màn hình ---- */

  .mobile-cta {
    position: fixed;

    left: 0;
    right: 0;
    bottom: 0;

    z-index: 60;

    display: flex;
    flex-direction: column;

    gap: 9px;

    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));

    background: var(--studio-glass-strong, rgba(250, 246, 238, 0.92));

    backdrop-filter: blur(14px);

    border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  }

  .mobile-trust {
    margin: 0;

    text-align: center;

    color: var(--muted);

    font-size: 11px;
    font-weight: 600;

    letter-spacing: 0.06em;
  }

  .mobile-note {
    margin: 0;

    text-align: center;

    color: var(--studio-ink-faint, #8a7a68);

    font-size: 11px;

    opacity: 0.75;
  }

  .mobile-actions {
    display: flex;

    gap: 10px;
  }

  .mobile-actions .primary-btn,
  .mobile-actions .outline-btn {
    flex: 1;

    min-height: 48px;

    padding: 0 12px;

    font-size: var(--text-sm);
  }

  .mobile-actions svg {
    width: 16px;
    height: 16px;
  }
}

/* =========================================================
   VERY SMALL PHONE
========================================================= */

@media (max-width: 380px) {
  .hero-inner {
    width: calc(100% - 20px);
  }

  .brief-inner {
    width: calc(100% - 20px);
  }

  .brief-title {
    font-size: 24px;
  }

  .detail-section .container {
    width: calc(100% - 20px);
  }

  .features-grid li {
    font-size: 12px;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: 0.01ms !important;
  }
}
</style>
