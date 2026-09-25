<template>
  <main class="templates-page">
    <!-- =====================================================
         BACK TO HOME
    ====================================================== -->
    <div class="container back-row">
      <button type="button" class="back-btn" @click="goHome">
        <v-icon size="16"> mdi-arrow-left </v-icon>

        Trang chủ
      </button>
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="page-hero">
      <div class="container hero-inner">
        <span class="eyebrow">
          <span class="eyebrow-line"></span>
          Bộ sưu tập thiệp cưới
          <span class="eyebrow-line"></span>
        </span>

        <h1>
          Mỗi mẫu là một
          <span>bản sắc</span>
          riêng.
        </h1>

        <p class="hero-lead">
          Năm bộ sưu tập — từ đỏ son Á Đông, lụa vàng kim tuyến đến tối giản
          hiện đại — mỗi mẫu mang bảng màu, họa tiết và nhịp điệu riêng.
          Chọn mẫu bạn thích và tùy chỉnh cho ngày cưới của bạn.
        </p>

        <!-- hai lối vào chính: xem mẫu nổi bật, hoặc bắt tay tạo thiệp -->
        <div class="hero-actions">
          <button
            type="button"
            class="hero-btn hero-btn-primary"
            @click="goToFeatured"
          >
            <span>Xem mẫu nổi bật</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="m13 6 6 6-6 6"></path>
            </svg>
          </button>

          <button
            type="button"
            class="hero-btn hero-btn-ghost"
            @click="goToEditor()"
          >
            Tạo thiệp của bạn
          </button>
        </div>

        <!-- dòng tin cậy: gỡ rào cản trước khi người dùng bấm -->
        <ul class="hero-trust">
          <li>
            <span class="trust-dot"></span>
            Tạo miễn phí
          </li>

          <li>
            <span class="trust-dot"></span>
            Dùng thử 3 ngày
          </li>

          <li>
            <span class="trust-dot"></span>
            Đẹp mới thanh toán
          </li>
        </ul>

        <div class="hero-stats">
          <div class="hero-stat">
            <strong>{{ weddings.length }}</strong>
            <span>Mẫu thiệp</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ themes.length }}</strong>
            <span>Phong cách</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>100%</strong>
            <span>Tùy chỉnh</span>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CONTENT
    ====================================================== -->
    <section class="container templates-content">

      <!-- ===================================================
           COLLECTION STRIP (bộ sưu tập)
      ==================================================== -->
      <div class="collection-strip">

        <button
          type="button"
          class="collection-chip"
          :class="{ 'is-active': !activeCollectionIds.length }"
          @click="clearCollections"
        >
          <span class="chip-swatches">
            <span class="chip-swatch chip-swatch-ink"></span>
            <span class="chip-swatch chip-swatch-foil"></span>
            <span class="chip-swatch chip-swatch-paper"></span>
          </span>

          Tất cả
        </button>

        <button
          v-for="col in activeCollections"
          :key="col.id"
          type="button"
          class="collection-chip"
          :class="{ 'is-active': activeCollectionIds.includes(col.id) }"
          @click="toggleCollection(col.id)"
        >
          <span class="chip-swatches">
            <span
              v-for="(swatch, swatchIndex) in col.swatches"
              :key="swatchIndex"
              class="chip-swatch"
              :style="{ background: swatch }"
            ></span>
          </span>

          <span class="chip-text">
            <strong>{{ col.name }}</strong>
            <small>{{ col.sub }}</small>
          </span>
        </button>

      </div>

      <!-- ===================================================
           TOOLBAR
      ==================================================== -->
      <div class="toolbar">

        <div class="toolbar-left">
          <div class="result-count">
            <span>Khám phá</span>
            <strong>{{ filteredWeddings.length }}</strong>
            <span>mẫu thiệp</span>
          </div>
        </div>

        <div class="toolbar-right">

          <!-- Theme -->
          <div class="filter-control">
            <span class="control-icon">◈</span>

            <select v-model="selectedTheme">
              <option value="">Tất cả phong cách</option>

              <option
                v-for="theme in themeOptions"
                :key="theme.value"
                :value="theme.value"
              >
                {{ theme.label }}
              </option>
            </select>

            <span class="select-arrow">⌄</span>
          </div>

          <!-- Sắp xếp -->
          <div class="filter-control">
            <span class="control-icon">⇅</span>

            <select v-model="sortMode">
              <option value="">Mặc định</option>
              <option value="noi-bat">Nổi bật</option>
              <option value="yeu-thich">Được yêu thích</option>
            </select>

            <span class="select-arrow">⌄</span>
          </div>

          <!-- Search -->
          <div class="search-control">
            <span class="search-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m20 20-4-4"></path>
              </svg>
            </span>

            <input
              v-model="q"
              type="search"
              placeholder="Tìm tên cô dâu, chú rể hoặc phong cách"
            />

            <button
              v-if="q"
              class="clear-search"
              type="button"
              @click="q = ''"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- ===================================================
           LOADING
      ==================================================== -->
      <div
        v-if="store.loading"
        class="template-grid"
      >
        <article
          v-for="i in 8"
          :key="i"
          class="skeleton-card"
        >
          <div class="skeleton-image"></div>

          <div class="skeleton-body">
            <div class="skeleton-line small"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line tiny"></div>
          </div>
        </article>
      </div>

      <!-- ===================================================
           ERROR
      ==================================================== -->
      <div
        v-else-if="store.error"
        class="state-box error"
      >
        <div class="state-icon">!</div>

        <h3>Không thể tải mẫu thiệp</h3>

        <p>{{ store.error }}</p>

        <button
          type="button"
          class="retry-btn"
          @click="store.loadWeddings()"
        >
          Thử lại
        </button>
      </div>

      <!-- ===================================================
           EMPTY
      ==================================================== -->
      <div
        v-else-if="filteredWeddings.length === 0"
        class="state-box empty"
      >
        <div class="empty-icon">
          囍
        </div>

        <h3>Không tìm thấy mẫu phù hợp</h3>

        <p>
          Hãy thử thay đổi từ khóa, chọn bộ sưu tập hoặc phong cách khác.
        </p>

        <button
          type="button"
          class="retry-btn"
          @click="resetFilters"
        >
          Xóa bộ lọc
        </button>
      </div>

      <!-- ===================================================
           TEMPLATE GRID
      ==================================================== -->
      <div
        v-else
        class="template-grid"
      >
        <article
          v-for="wedding in filteredWeddings"
          :key="wedding.id || wedding.slug || wedding.Id"
          class="template-card"
          :class="{
            'is-featured': isFavorite(wedding)
          }"
          :style="getCardStyle(wedding)"
          @click="goToIntro(wedding)"
        >
          <!-- IMAGE -->
          <div class="image-wrap">

            <img
              :src="getPreviewSrc(wedding)"
              :alt="getThemeLabel(wedding)"
              loading="lazy"
              @error="onImageError"
            />

            <!-- image gradient -->
            <div class="image-gradient"></div>

            <!-- hover overlay -->
            <div class="card-hover">

              <div class="preview-circle">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                  />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              </div>

              <span>Xem mẫu</span>
            </div>

            <!-- top-right: nút yêu thích -->
            <div class="card-top">
              <button
                type="button"
                class="favorite-btn"
                :class="{ 'is-on': isFavorite(wedding) }"
                aria-label="Yêu thích"
                @click.stop="toggleFavorite(wedding)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path
                    d="M20.8 8.7c0 5.5-8.8 10.1-8.8 10.1S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"
                  />
                </svg>
              </button>
            </div>

            <!-- featured: mẫu đang được người dùng lưu yêu thích -->
            <div
              v-if="isFavorite(wedding)"
              class="featured-label"
            >
              <span>{{ getWeddingMeta(wedding).orn }}</span>
              Được yêu thích
            </div>
          </div>

          <!-- BODY -->
          <div class="card-body">

            <div class="card-meta">
              <span>
                {{ formatDate(wedding.weddingDate) }}
              </span>

              <span class="dot"></span>

              <span>
                {{ getCollectionLabel(wedding) }}
              </span>
            </div>

            <h3>
              {{ getThemeLabel(wedding) }}
            </h3>

            <!-- tên cặp đôi của mẫu — dòng phụ dưới tên thiết kế -->
            <p class="card-couple">
              {{ getCoupleName(wedding) }}
            </p>

            <!-- mô tả thiết kế — nội dung chính của thẻ -->
            <p class="card-desc">
              {{ getWeddingMeta(wedding).desc }}
            </p>

            <!-- dải màu nhận diện của mẫu -->
            <div class="identity-row">
              <span
                v-for="(swatch, swatchIndex) in getWeddingMeta(wedding).palette"
                :key="swatchIndex"
                class="identity-swatch"
                :style="{ background: swatch }"
              ></span>

              <span class="identity-orn">
                {{ getWeddingMeta(wedding).orn }}
              </span>
            </div>

            <!-- từ khóa phong cách — bấm để lọc nhanh -->
            <div class="card-tags">
              <button
                v-for="tag in getWeddingMeta(wedding).tags"
                :key="tag"
                type="button"
                class="card-tag"
                @click.stop="searchFor(tag)"
              >
                {{ tag }}
              </button>
            </div>

            <div class="card-footer">

              <span class="view-detail">
                Xem chi tiết
                <span>→</span>
              </span>

              <button
                type="button"
                class="use-template-btn"
                @click.stop="goToEditor(wedding)"
              >
                Dùng mẫu này
              </button>

            </div>
          </div>
        </article>
      </div>

      <!-- ===================================================
           COLLECTION FOOTNOTE
      ==================================================== -->
      <div class="collection-note">
        <p class="note-line">
          囍 Mỗi mẫu thuộc một bộ sưu tập với bảng màu riêng — chọn
          <strong>bộ sưu tập</strong> phía trên để xem theo phong cách.
        </p>

        <button
          type="button"
          class="note-cta"
          @click="goToEditor()"
        >
          Chưa chọn được mẫu? Bắt đầu tạo thiệp của bạn →
        </button>
      </div>
    </section>

    <!-- =====================================================
         FEATURES — mọi mẫu đều có đủ tính năng
    ====================================================== -->
    <section class="tpl-features">
      <div class="container">
        <span class="eyebrow">
          <span class="eyebrow-line"></span>
          Đủ mọi tính năng
          <span class="eyebrow-line"></span>
        </span>

        <h2>Mỗi mẫu là một thiệp hoàn chỉnh</h2>

        <p class="section-lead">
          Không chỉ là một trang đẹp — mọi mẫu đều đi kèm đầy đủ
          tính năng để mời và lưu giữ trọn vẹn ngày cưới của bạn.
        </p>

        <ul class="features-grid">
          <li
            v-for="feature in TEMPLATE_FEATURES"
            :key="feature.title"
          >
            <span class="feature-orn">{{ feature.orn }}</span>

            <div>
              <strong>{{ feature.title }}</strong>
              <p>{{ feature.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- =====================================================
         FAQ
    ====================================================== -->
    <section class="tpl-faq">
      <div class="container">
        <span class="eyebrow">
          <span class="eyebrow-line"></span>
          Câu hỏi thường gặp
          <span class="eyebrow-line"></span>
        </span>

        <h2>Chọn mẫu thiệp</h2>

        <p class="section-lead">
          Vài điều bạn nên biết trước khi chọn mẫu cho ngày cưới của mình.
        </p>

        <FaqAccordion :items="TEMPLATE_FAQS" />
      </div>
    </section>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Transition name="toast">
      <div
        v-if="toast"
        class="toast-message"
      >
        <span>✓</span>
        {{ toast }}
      </div>
    </Transition>
  </main>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch
} from "vue";

import { useRoute, useRouter } from "vue-router";
import { useWeddingStore } from "@/stores/wedding";

import {
  COLLECTIONS,
  getThemeMeta,
} from "@/data/templateCollections";

import {
  cardStyle,
  collectionLabel,
  coupleName,
  formatDate,
  handleImageError,
  previewFor,
  themeLabel,
  themeMeta,
} from "@/utils/weddingCard";

import FaqAccordion from "@/components/marketing/FaqAccordion.vue";
import { BRAND } from "@/data/siteContent";
import { faqJsonLd, useSeo } from "@/composables/useSeo";

// ======================================================
// Router / Store
// ======================================================

const route = useRoute();
const router = useRouter();
const store = useWeddingStore();

function goHome() {
  router.push({ name: "Home" });
}

/* Lối vào nhanh ở hero — nhảy sang route SEO "mẫu nổi bật". */
function goToFeatured() {
  router.push({ name: "TemplatesFeatured" });
}

// ======================================================
// State
// ======================================================

const q = ref("");
const selectedTheme = ref("");

/*
 * Bộ sưu tập đang chọn — luôn là mảng để vừa chọn được
 * một mục, vừa nhận được preset nhiều mục từ route SEO
 * (/thiep-cuoi-hien-dai gộp "tối giản" + "lãng mạn").
 */
const activeCollectionIds = ref([]);

/*
 * Sắp xếp — "noi-bat" đẩy các mẫu nổi bật lên đầu.
 * Mặc định giữ nguyên thứ tự trả về từ API.
 */
const sortMode = ref("");

/*
 * ======================================================
 * PRESET THEO ĐƯỜNG DẪN
 * ======================================================
 * Bốn route SEO (/mau-thiep-cuoi, /mau-thiep-cuoi-dep,
 * /thiep-cuoi-hien-dai, /thiep-cuoi-truyen-thong) dùng
 * chung component này. Mỗi route mang bộ lọc mặc định
 * riêng, đọc từ query để link chia sẻ được vẫn giữ đúng
 * bộ lọc người dùng đang xem.
 */

const ROUTE_PRESETS = {
  TemplatesFeatured: { sort: "noi-bat" },
  TemplatesModern: { collections: ["toi-gian", "lang-man"] },
  TemplatesTraditional: { collections: ["a-dong"] },
};

function applyRoutePreset() {
  const preset = ROUTE_PRESETS[route.name] || {};

  const queryCollections = String(route.query["bo-suu-tap"] || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  activeCollectionIds.value = queryCollections.length
    ? queryCollections
    : [...(preset.collections || [])];

  sortMode.value = String(route.query["sap-xep"] || preset.sort || "");

  q.value = String(route.query["tu-khoa"] || "");
}

/*
 * Ghi lại bộ lọc hiện tại lên query — để copy link là
 * chia sẻ được đúng khung đang xem.
 */
function syncQuery() {
  const query = {};

  if (activeCollectionIds.value.length) {
    query["bo-suu-tap"] = activeCollectionIds.value.join(",");
  }

  if (sortMode.value) {
    query["sap-xep"] = sortMode.value;
  }

  if (q.value.trim()) {
    query["tu-khoa"] = q.value.trim();
  }

  router.replace({ query }).catch(() => {});
}

function toggleCollection(id) {
  const list = activeCollectionIds.value;

  activeCollectionIds.value = list.includes(id)
    ? list.filter((item) => item !== id)
    : [...list, id];
}

function clearCollections() {
  activeCollectionIds.value = [];
}

const favorites = ref(
  JSON.parse(
    localStorage.getItem("wedding-template-favorites") || "[]"
  )
);

const toast = ref("");

// ======================================================
// Computed
// ======================================================

const weddings = computed(() => {
  return store.weddings || [];
});

const themes = computed(() => {
  const set = new Set();

  (store.weddings || []).forEach((w) => {
    const themeName =
      w?.theme?.Name ||
      w?.theme ||
      "";

    if (themeName) {
      set.add(themeName);
    }
  });

  return Array.from(set).sort();
});

/*
 * Danh sách phong cách cho bộ lọc — dùng tên hiển thị
 * tiếng Việt từ bản sắc theme thay vì key kỹ thuật.
 */
const themeOptions = computed(() => {
  return themes.value
    .map((theme) => ({
      value: theme,
      label: getThemeMeta(theme).name,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, "vi")
    );
});

/*
 * Bộ sưu tập có ít nhất một mẫu trong danh sách —
 * bộ rỗng không hiển thị.
 */
const activeCollections = computed(() => {
  const present = new Set(
    themes.value.map(
      (theme) => getThemeMeta(theme).collection
    )
  );

  return COLLECTIONS.filter((col) =>
    present.has(col.id)
  );
});

const filteredWeddings = computed(() => {
  let list = weddings.value;

  // bộ sưu tập — người dùng có thể chọn nhiều mục
  if (activeCollectionIds.value.length) {
    list = list.filter((w) => {
      const themeName =
        w?.theme?.Name ||
        w?.theme ||
        "";

      return activeCollectionIds.value.includes(
        getThemeMeta(themeName).collection
      );
    });
  }

  // theme
  if (selectedTheme.value) {
    list = list.filter((w) => {
      return (
        w?.theme?.Name ||
        w?.theme ||
        ""
      ) === selectedTheme.value;
    });
  }

  // search
  if (q.value && q.value.trim()) {
    const keyword = q.value
      .trim()
      .toLowerCase();

    list = list.filter((w) => {
      const bride =
        w?.couple?.Bride?.Name ||
        "";

      const groom =
        w?.couple?.Groom?.Name ||
        "";

      const themeName =
        w?.theme?.Name ||
        w?.theme ||
        "";

      const meta = getThemeMeta(themeName);

      /*
       * Khớp cả từ khóa phong cách và mô tả thiết kế —
       * để bấm tag trên thẻ ("Song hỷ", "Truyền thống"...)
       * luôn ra kết quả.
       */
      const haystack = [
        bride,
        groom,
        themeName,
        meta.name,
        meta.desc,
        ...meta.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }

  /*
   * "noi-bat" — mẫu có ngày cưới đầy đủ lên trước, vì đó là
   * những mẫu xem được trọn vẹn nhất.
   *
   * "yeu-thich" — mẫu người dùng đã lưu yêu thích lên đầu.
   */
  if (sortMode.value === "noi-bat") {
    list = [...list].sort((a, b) => {
      const score = (w) => (w?.weddingDate ? 1 : 0);

      return score(b) - score(a);
    });
  } else if (sortMode.value === "yeu-thich") {
    list = [...list].sort((a, b) => {
      const score = (w) => (isFavorite(w) ? 1 : 0);

      return score(b) - score(a);
    });
  }

  return list;
});

// ======================================================
// Nội dung hiển thị — tính năng & hỏi đáp của trang mẫu
// ======================================================

/*
 * Tính năng đi kèm mọi mẫu — nội dung khối "Mỗi mẫu là một
 * thiệp hoàn chỉnh" cuối trang. Đặt ở đây thay vì siteContent
 * vì chỉ trang gallery dùng.
 */
const TEMPLATE_FEATURES = [
  {
    orn: "❊",
    title: "Tùy chỉnh toàn bộ",
    text: "Đổi tên, ngày giờ, địa điểm, ảnh và màu sắc — giữ khung thiết kế, thay nội dung thành của bạn.",
  },
  {
    orn: "✦",
    title: "Ảnh không giới hạn",
    text: "Album ảnh cưới, câu chuyện tình yêu và từng khoảnh khắc — tất cả trong một link.",
  },
  {
    orn: "◈",
    title: "Bản đồ & lịch trình",
    text: "Google Maps dẫn đường đến tiệc, kèm lịch trình từng khoảnh khắc của ngày cưới.",
  },
  {
    orn: "♪",
    title: "Nhạc nền riêng",
    text: "Chọn bài hát của hai bạn — thiệp mở lên là có âm nhạc.",
  },
  {
    orn: "✉",
    title: "Xác nhận tham dự",
    text: "Khách mời bấm RSVP ngay trong thiệp — hai bạn nhận danh sách dự tiệc tức thì.",
  },
  {
    orn: "❦",
    title: "Sổ lưu bút & mừng cưới",
    text: "Lời chúc và tiền mừng qua QR — mọi thứ được lưu giữ vĩnh viễn.",
  },
];

/*
 * Hỏi đáp riêng cho trang mẫu — tập trung vào việc chọn và
 * dùng mẫu (khác FAQS chung ở trang chủ, vốn nói về sản phẩm).
 */
const TEMPLATE_FAQS = [
  {
    q: "Chọn mẫu xong có đổi được mẫu khác không?",
    a: "Được. Bạn đổi mẫu bất cứ lúc nào trong trình soạn thảo — toàn bộ nội dung đã điền (tên, ngày giờ, địa điểm, ảnh) được giữ nguyên và tự xếp vào bố cục mới.",
  },
  {
    q: "Mẫu hiển thị có đúng như xem trước không?",
    a: "Có. Ảnh xem trước chính là thiệp thật chạy trên trình duyệt — bấm vào bất kỳ mẫu nào để mở bản demo đầy đủ, cuộn và nghe nhạc được như thiệp đã xuất bản.",
  },
  {
    q: "Tôi có chỉnh được màu sắc và hình ảnh của mẫu không?",
    a: "Được. Mỗi mẫu có bảng màu nhận diện riêng, nhưng bạn có thể đổi màu, thay ảnh, chỉnh cỡ chữ và thêm bớt các mục trong trình soạn thảo.",
  },
  {
    q: "Dùng mẫu này có tốn phí không?",
    a: "Tạo và chỉnh sửa hoàn toàn miễn phí, không cần đăng ký thẻ. Sau khi xuất bản bạn được dùng thử 3 ngày chia sẻ cho khách mời — ưng ý rồi mới thanh toán một lần để giữ thiệp vĩnh viễn.",
  },
  {
    q: "Mẫu có hiển thị tốt trên điện thoại không?",
    a: "Có. Khách mời chủ yếu mở thiệp trên điện thoại nên mọi mẫu đều được dựng responsive — hiển thị đúng trên điện thoại, tablet và máy tính, không cần cài ứng dụng.",
  },
  {
    q: "Có mẫu nào phù hợp với đám cưới truyền thống không?",
    a: "Có. Bộ sưu tập Á Đông Sang Trọng gồm đỏ son, vàng son, trống đồng, song hỷ và long phụng — dành riêng cho lễ cưới đậm nét truyền thống.",
  },
];

// ======================================================
// SEO — mỗi route SEO có tiêu đề và mô tả riêng
// ======================================================

const SEO_BY_ROUTE = {
  Templates: {
    title: "Mẫu thiệp cưới đẹp",
    description:
      "Thư viện mẫu thiệp cưới online đẹp thuộc năm bộ sưu tập: Á Đông sang trọng, " +
      "kim tuyến & lụa, lãng mạn đương đại, thiên nhiên & vintage, tối giản hiện đại.",
    path: "/mau-thiep-cuoi",
  },
  TemplatesFeatured: {
    title: "Mẫu thiệp cưới đẹp nhất",
    description:
      "Tuyển chọn những mẫu thiệp cưới online đẹp nhất — bố cục chỉn chu, " +
      "bảng màu hài hoà, hiển thị sắc nét trên mọi thiết bị.",
    path: "/mau-thiep-cuoi-dep",
  },
  TemplatesModern: {
    title: "Thiệp cưới hiện đại",
    description:
      "Thiệp cưới online phong cách hiện đại: tối giản, nhiều khoảng trắng, " +
      "nét mực gọn và điểm nhấn tinh tế. Tạo miễn phí, dùng thử 3 ngày.",
    path: "/thiep-cuoi-hien-dai",
  },
  TemplatesTraditional: {
    title: "Thiệp cưới truyền thống",
    description:
      "Thiệp cưới online phong cách truyền thống Á Đông: đỏ son, vàng son, " +
      "họa tiết trống đồng và chữ song hỷ. Tạo miễn phí, dùng thử 3 ngày.",
    path: "/thiep-cuoi-truyen-thong",
  },
};

/*
 * JSON-LD cho trang gallery:
 *
 * - ItemList: danh sách mẫu có cấu trúc — Google hiểu đây là
 *   một thư viện nhiều mẫu thay vì một trang đơn lẻ, mỗi mục
 *   kèm tên, mô tả và đường dẫn riêng.
 * - FAQPage: khối hỏi đáp cuối trang — đủ điều kiện hiện rich
 *   snippet trên kết quả tìm kiếm.
 *
 * Gộp bằng @graph để một thẻ script phục vụ cả hai.
 */
function templatesJsonLd() {
  const items = (store.weddings || []).map((wedding, index) => {
    const meta = getThemeMeta(
      wedding?.theme?.Name || wedding?.theme || ""
    );

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: `${meta.name} — ${BRAND.name}`,
        description: meta.desc,
        url: `${BRAND.siteUrl}/wedding/${wedding.slug}`,
        keywords: meta.tags.join(", "),
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Mẫu thiệp cưới",
        numberOfItems: items.length,
        itemListElement: items,
      },
      faqJsonLd(TEMPLATE_FAQS),
    ],
  };
}

useSeo(() => ({
  ...(SEO_BY_ROUTE[route.name] || SEO_BY_ROUTE.Templates),
  jsonLd: templatesJsonLd(),
}));

// ======================================================
// Load
// ======================================================

onMounted(async () => {
  applyRoutePreset();

  await store.loadWeddings();
});

/*
 * Điều hướng giữa các route SEO dùng chung component
 * (Vue tái sử dụng instance) → đọc lại preset.
 */
watch(
  () => route.name,
  () => {
    applyRoutePreset();
  }
);

/*
 * Người dùng đổi bộ lọc → ghi lên query để link chia sẻ
 * được giữ đúng khung đang xem.
 */
watch([activeCollectionIds, sortMode, q], syncQuery);

// ======================================================
// Helpers
// ======================================================

/*
 * Các helper hiển thị thẻ (tên cặp đôi, nhãn theme, bảng màu,
 * ảnh xem trước, ngày cưới) dùng chung từ weddingCard.js —
 * nơi đã gom để gallery, trang chủ và trang đích SEO không
 * lệch nhau sau vài lần sửa.
 */

function getCoupleName(wedding) {
  return coupleName(wedding);
}

function getThemeLabel(wedding) {
  return themeLabel(wedding);
}

function getWeddingMeta(wedding) {
  return themeMeta(wedding);
}

function getCardStyle(wedding) {
  return cardStyle(wedding);
}

function getCollectionLabel(wedding) {
  return collectionLabel(wedding);
}

function getPreviewSrc(wedding) {
  return previewFor(wedding);
}

// ======================================================
// Navigation
// ======================================================

/*
 * Bước 1 của luồng xem thiệp — trang giới thiệu mẫu.
 *
 * Trước đây chỗ này mở một modal chi tiết ngay trong trang.
 * Modal đó đã chuyển thành WeddingIntro.vue để mỗi bước có
 * URL riêng, chia sẻ được và Google index được.
 */
function goToIntro(wedding) {
  if (!wedding?.slug) {
    return;
  }

  router.push({
    name: "WeddingIntro",
    params: {
      slug: wedding.slug
    }
  });
}

/*
 * Mở trình tạo thiệp. Gọi kèm mẫu thì mang sẵn theme của mẫu
 * đó; gọi rỗng (nút ở hero) thì mở trình tạo trắng để người
 * dùng tự chọn phong cách bên trong.
 */
function goToEditor(wedding) {
  const themeName =
    wedding?.theme?.Name ||
    wedding?.theme ||
    "";

  router.push({
    name: "Editor",
    query: themeName ? { theme: themeName } : {}
  });
}

// ======================================================
// Favorite
// ======================================================

function getWeddingId(wedding) {
  return (
    wedding?.id ||
    wedding?.Id ||
    wedding?.slug
  );
}

function isFavorite(wedding) {
  return favorites.value.includes(
    getWeddingId(wedding)
  );
}

function toggleFavorite(wedding) {
  const id = getWeddingId(wedding);

  if (!id) {
    return;
  }

  if (isFavorite(wedding)) {
    favorites.value =
      favorites.value.filter(
        (item) => item !== id
      );

    showToast("Đã bỏ khỏi yêu thích");
  } else {
    favorites.value.push(id);

    showToast("Đã thêm vào yêu thích");
  }

  localStorage.setItem(
    "wedding-template-favorites",
    JSON.stringify(favorites.value)
  );
}

// ======================================================
// Filter
// ======================================================

function resetFilters() {
  q.value = "";
  selectedTheme.value = "";
  activeCollectionIds.value = [];
  sortMode.value = "";
}

/*
 * Bấm từ khóa trên thẻ → đổ vào ô tìm kiếm và cuộn lên đầu
 * danh sách. Từ khóa khớp theo tên thiết kế và tên cặp đôi
 * nên kết quả luôn có ít nhất mẫu vừa bấm.
 */
function searchFor(keyword) {
  q.value = keyword;

  document
    .querySelector(".templates-content")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ======================================================
// Toast
// ======================================================

let toastTimer = null;

function showToast(message) {
  toast.value = message;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2500);
}

// ======================================================
// Image error
// ======================================================

/*
 * Ảnh lỗi (đường dẫn hỏng) quay về ảnh xem trước dự phòng
 * chung — handleImageError của weddingCard.js.
 */
function onImageError(event) {
  handleImageError(event);
}
</script>

<style scoped>
/* =========================================================
   DESIGN TOKENS

   Trang dùng thẳng token studio toàn cục từ theme.css
   (--studio-ink / -foil / -seal / -card / -line...) —
   không định nghĩa lại ở đây để hai nơi không lệch nhau.
========================================================= */

.templates-page {
  /* bí danh ngắn cho chữ chính / chữ phụ trong trang này */
  --text: var(--studio-ink, #2b2118);
  --muted: var(--studio-ink-faint, #8a7a68);

  min-height: 100vh;
  position: relative;
  overflow: hidden;

  /* Giấy dó ấm — nền studio thay vì trắng phẳng */
  background:
    radial-gradient(
      circle at 8% 6%,
      rgba(185, 151, 91, 0.12),
      transparent 30%
    ),
    radial-gradient(
      circle at 92% 24%,
      rgba(166, 58, 46, 0.05),
      transparent 28%
    ),
    linear-gradient(
      180deg,
      #faf6ee 0%,
      #f7f1e6 45%,
      #f4ecdd 100%
    );

  color: var(--text);
}

/*
 * Độ rộng khung khớp .mk-container của marketing.css —
 * mọi trang marketing đều 1200px nên gallery không rộng hơn.
 */
.container {
  width: min(
    1200px,
    calc(100% - 32px)
  );

  margin: 0 auto;
}

/* =========================================================
   BACK ROW
========================================================= */

.back-row {
  padding-top: 20px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
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
    color 0.2s ease;
}

.back-btn:hover {
  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
  border-color: rgba(185, 151, 91, 0.5);
  color: var(--studio-seal, #a63a2e);
}

/* =========================================================
   HERO
========================================================= */

.page-hero {
  position: relative;
  padding: 90px 0 64px;

  text-align: center;
}

.hero-inner {
  position: relative;
}

.eyebrow {
  display: inline-flex;

  align-items: center;
  gap: 13px;

  color: var(--studio-seal, #a63a2e);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.eyebrow-line {
  width: 28px;
  height: 1px;

  background: var(--studio-foil, #b9975b);
}

.page-hero h1 {
  max-width: 900px;

  margin: 22px auto 0;

  font-family: var(--font-heading),
    "Cormorant Garamond",
    Georgia,
    serif;

  /*
   * Cỡ chữ chảy theo bề rộng màn hình: 34px ở máy nhỏ, phình
   * dần tới 76px ở màn rộng. Một công thức dùng chung cho mọi
   * thiết bị nên không có bậc nhảy cỡ chữ ở mốc breakpoint.
   */
  font-size: clamp(
    34px,
    6.2vw,
    76px
  );

  line-height: 1.02;

  letter-spacing: -0.025em;

  font-weight: 500;

  color: var(--text);
}

.page-hero h1 span {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.hero-lead {
  max-width: 640px;

  margin: 22px auto 0;

  color: var(--muted);

  font-size: clamp(
    14px,
    1.6vw,
    17px
  );

  line-height: 1.8;
}

/* =========================================================
   HERO ACTIONS
========================================================= */

.hero-actions {
  display: flex;

  flex-wrap: wrap;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-top: 30px;
}

.hero-btn {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  min-height: 50px;

  padding: 0 26px;

  border-radius: 999px;

  font-size: clamp(
    13px,
    1.4vw,
    15px
  );

  font-weight: 600;

  letter-spacing: 0.01em;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease;
}

.hero-btn svg {
  width: 17px;
  height: 17px;

  transition: transform 0.25s ease;
}

.hero-btn-primary {
  border: 1px solid
    var(--studio-ink, #2b2118);

  background:
    var(--studio-ink, #2b2118);

  color: #f7f1e6;

  box-shadow:
    0 14px 32px
      rgba(43, 33, 24, 0.2);
}

.hero-btn-primary:hover {
  transform: translateY(-2px);

  box-shadow:
    0 20px 42px
      rgba(43, 33, 24, 0.26);
}

.hero-btn-primary:hover svg {
  transform: translateX(4px);
}

.hero-btn-ghost {
  border: 1px solid
    var(--studio-line-strong, rgba(43, 33, 24, 0.2));

  background:
    rgba(255, 255, 255, 0.7);

  color: var(--studio-ink, #2b2118);
}

.hero-btn-ghost:hover {
  transform: translateY(-2px);

  border-color:
    var(--studio-ink, #2b2118);

  background: #fff;
}

/* =========================================================
   HERO TRUST
========================================================= */

.hero-trust {
  display: flex;

  flex-wrap: wrap;

  align-items: center;
  justify-content: center;

  gap: 8px 20px;

  margin: 22px 0 0;

  padding: 0;

  list-style: none;

  color: var(--muted);

  font-size: clamp(
    11.5px,
    1.2vw,
    13px
  );
}

.hero-trust li {
  display: inline-flex;

  align-items: center;

  gap: 7px;
}

.trust-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    var(--studio-foil, #b9975b);
}

.hero-stats {
  display: inline-flex;

  align-items: center;

  margin-top: 30px;

  padding: 13px 22px;

  border: 1px solid
    rgba(95, 63, 68, 0.08);

  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.72);

  backdrop-filter: blur(12px);

  box-shadow:
    0 12px 35px
      rgba(61, 39, 42, 0.05);
}

.hero-stat {
  display: flex;

  align-items: baseline;

  gap: 7px;

  padding: 0 18px;
}

.hero-stat strong {
  color: var(--studio-ink, #2b2118);

  font-family:
    var(--font-heading),
    Georgia,
    serif;

  font-size: 22px;

  font-weight: 600;

  /* Số đếm lên liên tục nên phải cố định bề rộng chữ số,
     nếu không cả cụm sẽ rung khi số nhảy. */
  font-variant-numeric: tabular-nums;
}

.hero-stat span {
  color: var(--muted);

  font-size: 11px;

  text-transform: uppercase;

  letter-spacing: 0.08em;
}

.hero-stat-divider {
  width: 1px;
  height: 24px;

  background:
    rgba(70, 45, 49, 0.12);
}

/* =========================================================
   COLLECTION STRIP (bộ sưu tập)
========================================================= */

.collection-strip {
  display: flex;

  flex-wrap: wrap;

  gap: 10px;

  margin-bottom: 26px;
}

.collection-chip {
  display: inline-flex;

  align-items: center;

  gap: 10px;

  padding: 9px 16px 9px 12px;

  border: 1px solid var(--studio-line);

  border-radius: 999px;

  background: var(--studio-card);

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(
    12px,
    1.15vw,
    13.5px
  );

  cursor: pointer;

  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.collection-chip:hover {
  border-color: var(--studio-line-strong);

  transform: translateY(-1px);

  box-shadow:
    0 8px 22px rgba(43, 33, 24, 0.07);
}

.collection-chip.is-active {
  border-color: var(--studio-ink);

  background: var(--studio-ink);

  color: #f7f1e6;

  box-shadow:
    0 10px 26px rgba(43, 33, 24, 0.18);
}

.collection-chip.is-active .chip-swatch {
  border-color: rgba(43, 33, 24, 0.35);

  box-shadow: 0 0 0 1px rgba(247, 241, 230, 0.35);
}

.chip-swatches {
  display: inline-flex;

  flex-shrink: 0;
}

.chip-swatch {
  width: 14px;
  height: 14px;

  border-radius: 50%;

  border: 1.5px solid rgba(255, 255, 255, 0.9);

  box-shadow: 0 0 0 1px rgba(43, 33, 24, 0.12);
}

.chip-swatch + .chip-swatch {
  margin-left: -5px;
}

.chip-swatch-ink {
  background: var(--studio-ink);
}

.chip-swatch-foil {
  background: var(--studio-foil);
}

.chip-swatch-paper {
  background: var(--studio-paper);
}

.chip-text {
  display: flex;

  flex-direction: column;

  align-items: flex-start;

  line-height: 1.25;
}

.chip-text strong {
  font-size: clamp(
    12px,
    1.15vw,
    13.5px
  );

  font-weight: 700;
}

.chip-text small {
  font-size: 10.5px;

  opacity: 0.72;
}

/* =========================================================
   TOOLBAR
========================================================= */

.templates-content {
  padding-bottom: 24px;
}

.toolbar {
  display: flex;

  flex-wrap: wrap;

  align-items: center;
  justify-content: space-between;

  gap: 16px 20px;

  margin-bottom: 30px;

  padding-bottom: 18px;

  border-bottom:
    1px solid rgba(
      64,
      40,
      44,
      0.08
    );
}

.result-count {
  display: flex;

  align-items: baseline;

  gap: 7px;

  color: var(--muted);

  font-size: clamp(
    12.5px,
    1.2vw,
    14px
  );
}

.result-count strong {
  color: var(--text);

  font-family:
    var(--font-heading),
    Georgia,
    serif;

  font-size: clamp(
    20px,
    2vw,
    25px
  );
}

.toolbar-right {
  display: flex;

  align-items: center;

  gap: 10px;
}

.filter-control,
.search-control {
  position: relative;

  display: flex;

  align-items: center;

  min-height: 44px;

  border: 1px solid
    rgba(43, 33, 24, 0.12);

  border-radius: 12px;

  background:
    rgba(255, 253, 248, 0.85);

  box-shadow:
    0 5px 18px
      rgba(43, 33, 24, 0.04);

  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.filter-control:focus-within,
.search-control:focus-within {
  border-color:
    rgba(185, 151, 91, 0.55);

  box-shadow:
    0 8px 24px
      rgba(185, 151, 91, 0.14);
}

.filter-control {
  padding-left: 13px;
}

.control-icon {
  color: var(--studio-foil, #b9975b);

  font-size: 13px;
}

.filter-control select {
  appearance: none;

  min-width: 148px;

  padding: 0 30px 0 9px;

  border: none;
  outline: none;

  background: transparent;

  color: var(--text);

  font-size: 13px;

  cursor: pointer;
}

.select-arrow {
  position: absolute;

  right: 13px;

  top: 50%;

  transform: translateY(-55%);

  color: var(--muted);

  pointer-events: none;
}

.search-control {
  width: 240px;

  padding: 0 13px;
}

.search-icon {
  width: 18px;
  height: 18px;

  flex: 0 0 auto;

  color: #8a7a76;
}

.search-icon svg {
  width: 100%;
  height: 100%;
}

.search-control input {
  width: 100%;

  min-width: 0;

  padding: 0 9px;

  border: none;
  outline: none;

  background: transparent;

  color: var(--text);

  font-size: 13px;
}

.search-control input::placeholder {
  color: #9a8a86;
}

.clear-search {
  width: 24px;
  height: 24px;

  display: grid;
  place-items: center;

  padding: 0;

  border: none;

  border-radius: 50%;

  background: #eee7e2;

  color: #675853;

  cursor: pointer;
}

/* =========================================================
   GRID
========================================================= */

.template-grid {
  display: grid;

  /*
   * Bốn cột trên khung 1200px — thẻ rộng ~276px, vừa khít
   * bậc thẻ của các trang marketing (mk-grid--4).
   */
  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 18px;
}

/* =========================================================
   CARD
========================================================= */

.template-card {
  position: relative;

  overflow: hidden;

  border:
    1px solid
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 30%,
      transparent
    );

  border-radius: 20px;

  /*
   * Nền thẻ nhuộm theo bảng màu của từng mẫu (giống
   * carousel trang chủ) — mỗi thẻ mang đúng "giấy" của
   * thiết kế nó thay vì một màu trắng chung.
   */
  background:
    color-mix(
      in srgb,
      var(--card-bg, #fffdf8) 88%,
      var(--card-accent, #b9975b)
    );

  cursor: pointer;

  box-shadow:
    0 12px 35px
      rgba(43, 33, 24, 0.06);

  transition:
    transform 0.45s
      cubic-bezier(.2,.8,.2,1),
    box-shadow 0.45s
      cubic-bezier(.2,.8,.2,1),
    border-color 0.3s ease;
}

.template-card:hover {
  transform:
    translateY(-10px);

  border-color:
    var(--card-accent, rgba(166, 58, 46, 0.18));

  box-shadow:
    0 28px 65px
      rgba(43, 33, 24, 0.14);
}

/*
 * Thẻ đang được lưu yêu thích mang viền màu bản sắc đậm hơn —
 * phân biệt với các thẻ còn lại mà không cần animation.
 */
.template-card.is-featured {
  border-color:
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 55%,
      transparent
    );

  box-shadow:
    0 12px 35px rgba(43, 33, 24, 0.06),
    0 0 0 4px
      color-mix(
        in srgb,
        var(--card-accent, #b9975b) 12%,
        transparent
      );
}

.image-wrap {
  position: relative;

  overflow: hidden;

  /*
   * Tỷ lệ chuẩn 3/4 — giống carousel trang chủ
   * (TemplateCarousel3D) để cùng một mẫu hiện giống nhau
   * ở mọi nơi. Nền dự phòng pha theo bảng màu của mẫu
   * (hiện khi ảnh chưa tải xong hoặc lỗi).
   */
  aspect-ratio: 3 / 4;

  background: color-mix(
    in srgb,
    var(--card-bg, #f7f1e6) 82%,
    var(--card-accent, #b9975b)
  );
}

.image-wrap img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  transition:
    transform 0.9s
      cubic-bezier(.2,.8,.2,1),
    filter 0.6s ease;
}

.template-card:hover
.image-wrap img {
  transform: scale(1.07);

  filter:
    saturate(1.05)
    contrast(1.01);
}

.image-gradient {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      180deg,
      rgba(0,0,0,0.05) 0%,
      transparent 42%,
      rgba(30,15,15,0.28) 100%
    );

  pointer-events: none;
}

/* =========================================================
   CARD HOVER
========================================================= */

.card-hover {
  position: absolute;

  inset: 0;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 12px;

  color: #fff;

  /*
   * Lớp phủ hover nhuộm màu ấn son của từng mẫu —
   * đồng nhất với veil của carousel trang chủ, thay vì
   * một màu nâu chung cho mọi thẻ.
   */
  background:
    color-mix(
      in srgb,
      var(--card-seal, #a63a2e) 44%,
      rgba(20, 12, 8, 0.4)
    );

  opacity: 0;

  transform: scale(0.98);

  transition:
    opacity 0.4s ease,
    transform 0.5s ease;
}

.template-card:hover
.card-hover {
  opacity: 1;

  transform: scale(1);
}

.preview-circle {
  width: 52px;
  height: 52px;

  display: grid;
  place-items: center;

  border: 1px solid
    rgba(255,255,255,0.75);

  border-radius: 50%;

  background:
    rgba(255,255,255,0.08);

  backdrop-filter: blur(10px);

  transform:
    translateY(12px)
    scale(0.85);

  transition:
    transform 0.45s
      cubic-bezier(.2,.8,.2,1);
}

.template-card:hover
.preview-circle {
  transform:
    translateY(0)
    scale(1);
}

.preview-circle svg {
  width: 22px;
  height: 22px;
}

.card-hover > span {
  font-size: 12px;

  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  transform:
    translateY(8px);

  transition:
    transform 0.45s ease 0.04s;
}

.template-card:hover
.card-hover > span {
  transform:
    translateY(0);
}

/* =========================================================
   CARD TOP — nút yêu thích
========================================================= */

.card-top {
  position: absolute;

  top: 14px;
  right: 14px;

  z-index: 3;
}

.favorite-btn {
  width: 34px;
  height: 34px;

  display: grid;
  place-items: center;

  padding: 0;

  border:
    1px solid
    rgba(255,255,255,0.45);

  border-radius: 50%;

  background:
    rgba(44, 25, 30, 0.32);

  backdrop-filter: blur(12px);

  color: #fff;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);

  background:
    color-mix(
      in srgb,
      var(--card-seal, #a63a2e) 85%,
      transparent
    );
}

/*
 * Trạng thái đã lưu: trái tim tô đầy và nảy lên một nhịp. Nhịp
 * nảy chỉ chạy khi class vừa được thêm nên mỗi lần bấm là một
 * lần phản hồi, không phải rung liên tục.
 */
.favorite-btn.is-on {
  background:
    color-mix(
      in srgb,
      var(--card-seal, #a63a2e) 92%,
      transparent
    );

  border-color:
    rgba(255, 255, 255, 0.85);

  animation: heart-pop 0.45s
    cubic-bezier(.2,1.4,.4,1);
}

.favorite-btn.is-on svg {
  fill: currentColor;
}

@keyframes heart-pop {
  0% {
    transform: scale(1);
  }

  45% {
    transform: scale(1.28);
  }

  100% {
    transform: scale(1);
  }
}

.favorite-btn svg {
  width: 16px;
  height: 16px;
}

.featured-label {
  position: absolute;

  left: 14px;
  bottom: 14px;

  display: flex;

  align-items: center;
  gap: 6px;

  padding: 7px 11px;

  border-radius: 999px;

  background:
    rgba(255,255,255,0.88);

  backdrop-filter: blur(12px);

  /*
   * Chữ dùng mực studio cố định — với theme nền sẫm, màu
   * seal là vàng kim nên đặt làm màu chữ trên nền trắng
   * sẽ khó đọc. Ký tự orn phía trước vẫn mang màu bản sắc.
   */
  color: var(--studio-ink, #2b2118);

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  z-index: 3;
}

.featured-label span {
  color: var(--card-accent, #b9975b);
}

/* =========================================================
   CARD BODY
========================================================= */

.card-body {
  padding: 17px 17px 18px;
}

.card-meta {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-bottom: 7px;

  color: var(--card-soft, #8a7a68);

  font-size: 10px;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.card-meta .dot {
  width: 3px;
  height: 3px;

  border-radius: 50%;

  background: var(--card-accent, #b9975b);
}

.card-body h3 {
  margin: 0;

  font-family:
    var(--font-heading),
    "Cormorant Garamond",
    Georgia,
    serif;

  /*
   * Cỡ chữ theo bề rộng khung nhìn: thẻ nằm trong lưới 2–4 cột
   * nên bề rộng thẻ cũng co giãn theo màn hình — dùng chung một
   * công thức thì chữ và thẻ luôn cân nhau.
   */
  font-size: clamp(
    19px,
    1.9vw,
    26px
  );

  line-height: 1.12;

  font-weight: 600;

  color: var(--card-ink, var(--text));
}

/*
 * Tên cặp đôi của mẫu — dòng phụ dưới tên thiết kế. Cắt sau
 * một dòng để các thẻ trong cùng hàng luôn cao bằng nhau.
 */
.card-couple {
  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;

  margin: 7px 0 0;

  color: var(--card-soft, #8a7a76);

  font-size: clamp(
    11px,
    1.05vw,
    12.5px
  );

  line-height: 1.55;
}

/*
 * Mô tả thiết kế — nội dung chính của thẻ. Giới hạn hai dòng
 * để thẻ không cao lệch nhau khi mô tả dài ngắn khác nhau.
 */
.card-desc {
  display: -webkit-box;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  overflow: hidden;

  margin: 8px 0 0;

  color: var(--card-soft, #8a7a68);

  font-size: clamp(
    11px,
    1.05vw,
    12.5px
  );

  line-height: 1.6;
}

/* =========================================================
   CARD TAGS (từ khóa phong cách — bấm để lọc)
========================================================= */

.card-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 5px;

  margin-top: 9px;
}

.card-tag {
  padding: 3px 9px;

  border: 1px solid
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 32%,
      transparent
    );

  border-radius: 999px;

  background: transparent;

  color: var(--card-ink, var(--text));

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.02em;

  cursor: pointer;

  opacity: 0.78;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
}

.card-tag:hover {
  border-color:
    var(--card-accent, #b9975b);

  background:
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 12%,
      transparent
    );

  opacity: 1;
}

/* =========================================================
   IDENTITY ROW (dải màu bản sắc từng mẫu)
========================================================= */

.identity-row {
  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 10px;
}

.identity-swatch {
  width: 16px;
  height: 5px;

  border-radius: 999px;

  box-shadow:
    inset 0 0 0 1px
      rgba(43, 33, 24, 0.08);

  opacity: 0.9;
}

.identity-swatch:first-child {
  width: 26px;
}

.identity-orn {
  margin-left: auto;

  color: var(--card-accent, #b9975b);

  font-family: var(--font-symbol, var(--font-heading));

  font-size: 14px;

  line-height: 1;
}

/* =========================================================
   COLLECTION NOTE
========================================================= */

.collection-note {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 16px;

  margin: 40px 0 0;

  text-align: center;
}

.note-line {
  margin: 0;

  color: var(--muted);

  font-size: clamp(
    12px,
    1.2vw,
    13.5px
  );

  letter-spacing: 0.02em;
}

.collection-note strong {
  color: var(--studio-ink);
}

/*
 * Lối thoát cho người xem hết lưới mà chưa chọn được mẫu —
 * đặt ngay cuối danh sách, đúng lúc họ đang lưỡng lự.
 */
.note-cta {
  padding: 12px 22px;

  border: 1px dashed
    var(--studio-line-strong, rgba(43, 33, 24, 0.24));

  border-radius: 999px;

  background: transparent;

  color: var(--studio-ink, #2b2118);

  font-size: clamp(
    12px,
    1.2vw,
    13.5px
  );

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease;
}

.note-cta:hover {
  transform: translateY(-2px);

  border-color:
    var(--studio-ink, #2b2118);

  border-style: solid;

  background:
    rgba(255, 255, 255, 0.8);
}

/* =========================================================
   FEATURES & FAQ — hai khối cuối trang
   (dùng chung .eyebrow / .eyebrow-line đã có ở hero)
========================================================= */

.tpl-features,
.tpl-faq {
  padding: 64px 0 8px;

  text-align: center;
}

.tpl-faq {
  padding-bottom: 96px;
}

.tpl-features h2,
.tpl-faq h2 {
  margin: 18px auto 0;

  font-family:
    var(--font-heading),
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(
    26px,
    3.4vw,
    40px
  );

  line-height: 1.15;

  font-weight: 500;

  color: var(--text);
}

.section-lead {
  max-width: 560px;

  margin: 14px auto 0;

  color: var(--muted);

  font-size: clamp(
    13px,
    1.4vw,
    15px
  );

  line-height: 1.75;
}

/*
 * Lưới tính năng 3 cột — mỗi ô một tính năng, ký tự họa tiết
 * đóng vai trò biểu tượng thay vì icon vector.
 */
.features-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 14px;

  margin: 34px 0 0;

  padding: 0;

  list-style: none;

  text-align: left;
}

.features-grid li {
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

.features-grid li:hover {
  transform: translateY(-3px);

  border-color:
    rgba(185, 151, 91, 0.5);

  box-shadow:
    0 16px 34px
      rgba(43, 33, 24, 0.08);
}

.feature-orn {
  flex-shrink: 0;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  border-radius: 12px;

  background:
    color-mix(
      in srgb,
      var(--studio-foil, #b9975b) 14%,
      transparent
    );

  color: var(--studio-seal, #a63a2e);

  font-family:
    var(--font-symbol),
    var(--font-heading),
    serif;

  font-size: 17px;

  line-height: 1;
}

.features-grid strong {
  display: block;

  color: var(--text);

  font-size: 14.5px;

  font-weight: 700;
}

.features-grid p {
  margin: 5px 0 0;

  color: var(--muted);

  font-size: 12.5px;

  line-height: 1.65;
}

/*
 * FAQ — accordion dùng component FaqAccordion (style
 * mk-faq-* nằm ở marketing.css, dùng chung với trang chủ).
 * Chỉ cần căn khung và giới hạn bề rộng cho dễ đọc.
 */
.tpl-faq :deep(.mk-faq-list) {
  max-width: 760px;

  margin: 30px auto 0;

  text-align: left;
}

.card-footer {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-top: 16px;
}

.view-detail {
  color: var(--card-soft, #8a7a76);

  font-size: 11px;

  transition:
    color 0.25s ease;
}

.view-detail span {
  margin-left: 4px;

  transition:
    transform 0.25s ease;
}

.template-card:hover
.view-detail {
  color: var(--card-seal, #a63a2e);
}

.template-card:hover
.view-detail span {
  display: inline-block;

  transform: translateX(4px);
}

.use-template-btn {
  padding: 9px 12px;

  border: 1px solid
    color-mix(
      in srgb,
      var(--card-seal, #a63a2e) 30%,
      transparent
    );

  border-radius: 999px;

  background:
    color-mix(
      in srgb,
      var(--card-seal, #a63a2e) 6%,
      transparent
    );

  color: var(--card-seal, #a63a2e);

  font-size: 10px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;
}

.use-template-btn:hover {
  background: var(--card-seal, #a63a2e);

  color: #fff;

  transform: translateY(-1px);
}

/* =========================================================
   SKELETON
========================================================= */

.skeleton-card {
  overflow: hidden;

  border-radius: 18px;

  background: var(--studio-card);

  border: 1px solid var(--studio-line);
}

.skeleton-image {
  aspect-ratio: 3 / 4;

  background:
    linear-gradient(
      100deg,
      #ece4d4 20%,
      #f6f0e3 40%,
      #ece4d4 60%
    );

  background-size: 200% 100%;

  animation:
    skeleton-loading 1.5s
    infinite;
}

.skeleton-body {
  padding: 20px;
}

.skeleton-line {
  width: 70%;
  height: 18px;

  border-radius: 6px;

  background: #ece4d4;

  margin-bottom: 12px;
}

.skeleton-line.small {
  width: 32%;
  height: 10px;
}

.skeleton-line.tiny {
  width: 45%;
  height: 10px;
}

@keyframes skeleton-loading {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

/* =========================================================
   STATES
========================================================= */

.state-box {
  min-height: 320px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 50px 25px;

  border:
    1px solid var(--studio-line);

  border-radius: 22px;

  background:
    rgba(255, 253, 248, 0.72);
}

.state-icon,
.empty-icon {
  width: 54px;
  height: 54px;

  display: grid;
  place-items: center;

  margin-bottom: 17px;

  border-radius: 50%;

  background:
    var(--studio-foil-soft);

  color: var(--studio-seal);

  font-family: var(--font-symbol, serif);

  font-size: 22px;
}

.state-box h3 {
  margin: 0 0 7px;

  font-family:
    var(--font-heading),
    Georgia,
    serif;

  font-size: 28px;
}

.state-box p {
  max-width: 500px;

  margin: 0;

  color: var(--muted);

  line-height: 1.7;
}

.state-box.error .state-icon {
  background: #fdf1f1;
  color: #c62828;
}

.retry-btn {
  margin-top: 22px;

  padding: 11px 18px;

  border: none;

  border-radius: 999px;

  background: var(--studio-ink);

  color: #f7f1e6;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.25s ease;
}

.retry-btn:hover {
  background: #443627;
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

  transform:
    translateX(-50%);

  border:
    1px solid
    rgba(255,255,255,0.1);

  border-radius: 999px;

  background:
    rgba(43,33,24,0.92);

  backdrop-filter: blur(15px);

  color: #fff;

  box-shadow:
    0 15px 35px
      rgba(0,0,0,0.25);

  font-size: 12px;
}

.toast-message span {
  color: var(--studio-foil, #b9975b);
}

/* =========================================================
   ANIMATIONS
========================================================= */

/* toast */
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform:
    translate(-50%, 12px);
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1180px) {
  .template-grid {
    grid-template-columns:
      repeat(3, minmax(0,1fr));

    gap: 16px;
  }
}

/* =========================================================
   TABLET SMALL
========================================================= */

@media (max-width: 900px) {
  .collection-strip {
    gap: 8px;

    margin-bottom: 20px;
  }

  .collection-chip {
    padding: 7px 13px 7px 10px;

    font-size: 12px;
  }

  .chip-text small {
    display: none;
  }

  .page-hero {
    padding-top: 65px;
  }

  .toolbar {
    align-items: stretch;

    flex-direction: column;

    gap: 15px;
  }

  .toolbar-right {
    width: 100%;
  }

  .filter-control {
    flex: 0 0 auto;
  }

  .search-control {
    flex: 1;

    width: auto;
  }

  .features-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 640px) {
  .collection-strip {
    gap: 7px;

    margin-bottom: 16px;
  }

  .collection-chip {
    padding: 6px 12px 6px 8px;

    font-size: 11.5px;
  }

  .chip-swatch {
    width: 12px;
    height: 12px;
  }

  .page-hero {
    padding:
      52px 0 38px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .eyebrow-line {
    width: 18px;
  }

  .page-hero h1 {
    font-size:
      clamp(
        32px,
        10.5vw,
        46px
      );

    line-height: 1.04;
  }

  .hero-lead {
    margin-top: 16px;

    padding: 0 6px;

    font-size: 13.5px;

    line-height: 1.72;
  }

  .hero-actions {
    gap: 10px;

    margin-top: 22px;
  }

  .hero-btn {
    flex: 1 1 auto;

    min-height: 46px;

    padding: 0 18px;

    font-size: 13px;
  }

  .hero-trust {
    gap: 6px 14px;

    margin-top: 16px;

    font-size: 11.5px;
  }

  .hero-stats {
    width: 100%;

    justify-content: center;

    padding: 11px 5px;

    margin-top: 22px;
  }

  .hero-stat {
    padding:
      0 8px;

    flex-direction: column;

    align-items: center;

    gap: 1px;
  }

  .hero-stat strong {
    font-size: 18px;
  }

  .hero-stat span {
    font-size: 10px;
  }

  .hero-stat-divider {
    height: 22px;
  }

  .templates-content {
    padding-bottom: 60px;
  }

  .toolbar {
    margin-bottom: 20px;
  }

  /*
   * Giữ lại dòng đếm số mẫu trên điện thoại — đó là thông tin
   * người xem cần biết trước khi cuộn qua cả danh sách.
   */
  .toolbar-left {
    text-align: center;
  }

  .result-count {
    justify-content: center;
  }

  .toolbar-right {
    flex-direction: column;

    gap: 8px;
  }

  .filter-control,
  .search-control {
    width: 100%;
  }

  .filter-control select {
    width: 100%;
  }

  .template-grid {
    grid-template-columns:
      repeat(2, minmax(0,1fr));

    gap: 14px;
  }

  .template-card {
    border-radius: 16px;
  }

  .image-wrap {
    aspect-ratio: 3 / 4;
  }

  .card-top {
    top: 8px;
    right: 8px;
  }

  .favorite-btn {
    width: 28px;
    height: 28px;
  }

  .favorite-btn svg {
    width: 13px;
    height: 13px;
  }

  .featured-label {
    left: 8px;
    bottom: 8px;

    padding: 5px 8px;

    font-size: 11px;
  }

  .card-body {
    padding:
      11px 10px 12px;
  }

  .card-meta {
    margin-bottom: 5px;

    font-size: 11px;
  }

  .card-body h3 {
    font-size: 18px;
  }

  .card-couple {
    margin-top: 5px;

    font-size: 11px;

    line-height: 1.5;
  }

  .identity-row {
    margin-top: 7px;
  }

  .identity-swatch {
    width: 12px;
  }

  .identity-swatch:first-child {
    width: 20px;
  }

  .identity-orn {
    font-size: 11px;
  }

  .collection-note {
    gap: 12px;

    margin-top: 26px;
  }

  .note-line {
    font-size: 11.5px;
  }

  .note-cta {
    width: 100%;

    padding: 11px 16px;

    font-size: 12px;
  }

  /* khối tính năng & FAQ cuối trang */
  .tpl-features,
  .tpl-faq {
    padding-top: 44px;
  }

  .tpl-faq {
    padding-bottom: 72px;
  }

  .features-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 10px;

    margin-top: 22px;
  }

  .features-grid li {
    flex-direction: column;

    gap: 10px;

    padding: 15px 14px;
  }

  .features-grid strong {
    font-size: 13px;
  }

  .features-grid p {
    font-size: 11.5px;
  }

  .card-footer {
    margin-top: 10px;
  }

  /*
   * Thẻ trên điện thoại chỉ rộng chừng nửa màn hình — để hai
   * thứ nằm cạnh nhau thì nút bị bóp lại. Cả thẻ vốn đã bấm
   * được nên bỏ dòng "Xem chi tiết", nhường chỗ cho nút.
   */
  .view-detail {
    display: none;
  }

  .use-template-btn {
    width: 100%;

    padding: 9px 10px;

    font-size: 11.5px;
  }

  .state-box {
    min-height: 250px;
  }

  .back-btn {
    padding: 8px 14px;

    font-size: 12px;
  }
}

/* =========================================================
   VERY SMALL PHONE
========================================================= */

@media (max-width: 380px) {
  .template-grid {
    gap: 10px;
  }

  .card-body h3 {
    font-size: 16px;
  }

  .card-couple {
    display: none;
  }

  .card-desc {
    -webkit-line-clamp: 2;

    font-size: 10.5px;
  }

  .card-tags {
    gap: 4px;
  }

  .card-tag {
    padding: 2px 7px;

    font-size: 9.5px;
  }

  .identity-row {
    gap: 4px;
  }

  .identity-swatch {
    width: 10px;
  }

  .identity-swatch:first-child {
    width: 16px;
  }

  .use-template-btn {
    padding: 8px 8px;

    font-size: 11px;
  }

  .hero-btn {
    flex: 1 1 100%;
  }

  .back-btn {
    padding: 7px 12px;

    font-size: 11.5px;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration:
      0.01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      0.01ms !important;
  }
}
</style>