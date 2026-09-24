<template>
  <main class="templates-page">
    <!-- =====================================================
         BACKGROUND DECORATION
    ====================================================== -->
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>
    <div class="page-glow page-glow-3"></div>
    <div class="page-seal">囍</div>

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
      <div class="hero-aurora" aria-hidden="true"></div>

      <div class="container hero-inner">
        <div class="hero-decoration hero-decoration-left">
          囍
        </div>

        <div class="hero-decoration hero-decoration-right">
          囍
        </div>

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
            <strong>{{ templateCount }}</strong>
            <span>Mẫu thiệp</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ styleCount }}</strong>
            <span>Phong cách</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ customPercent }}%</strong>
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

          <!-- Collection -->
          <div class="filter-control">
            <span class="control-icon">✦</span>

            <select v-model="collectionSelect">
              <option value="">Tất cả bộ sưu tập</option>

              <option
                v-for="col in activeCollections"
                :key="col.id"
                :value="col.id"
              >
                {{ col.name }}
              </option>
            </select>

            <span class="select-arrow">⌄</span>
          </div>

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
          v-for="(wedding, index) in filteredWeddings"
          :key="wedding.id || wedding.slug || wedding.Id"
          class="template-card"
          :class="{
            'is-featured': index === 0
          }"
          :style="getCardStyle(wedding)"
          @click="goToIntro(wedding)"
          @pointermove="trackSpotlight"
          @pointerleave="clearSpotlight"
        >
          <!-- IMAGE -->
          <div class="image-wrap">

            <img
              :src="wedding.coverImage"
              :alt="getCoupleName(wedding)"
              loading="lazy"
              @error="onImageError"
            />

            <!-- image gradient -->
            <div class="image-gradient"></div>

            <!-- vệt sáng chạy ngang qua ảnh -->
            <div class="image-sheen" aria-hidden="true"></div>

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

            <!-- top badges -->
            <div class="card-top">

              <span class="theme-tag">
                {{ getThemeLabel(wedding) }}
              </span>

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

            <!-- featured -->
            <div
              v-if="index === 0"
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
              {{ getCoupleName(wedding) }}
            </h3>

            <!-- một dòng mô tả phong cách — cho người xem biết
                 mẫu này đẹp ở chỗ nào trước khi bấm vào -->
            <p class="card-desc">
              {{ getCollectionSub(wedding) }}
            </p>

            <!-- dải màu nhận diện của mẫu -->
            <div class="identity-row">
              <span
                v-for="(swatch, swatchIndex) in getWeddingMeta(wedding).palette"
                :key="swatchIndex"
                class="identity-swatch"
                :style="{
                  background: swatch,
                  '--swatch-delay': `${swatchIndex * 90}ms`
                }"
              ></span>

              <span class="identity-orn">
                {{ getWeddingMeta(wedding).orn }}
              </span>
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
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";

import { useRoute, useRouter } from "vue-router";
import { useWeddingStore } from "@/stores/wedding";

import {
  COLLECTIONS,
  getCollection,
  getThemeMeta,
} from "@/data/templateCollections";

import { useSeo } from "@/composables/useSeo";

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

/*
 * Ô chọn bộ sưu tập trong toolbar chỉ chọn được một mục —
 * khi preset đang gộp nhiều mục thì hiển thị "Tất cả".
 */
const collectionSelect = computed({
  get() {
    return activeCollectionIds.value.length === 1
      ? activeCollectionIds.value[0]
      : "";
  },

  set(value) {
    activeCollectionIds.value = value ? [value] : [];
  },
});

const favorites = ref(
  JSON.parse(
    localStorage.getItem("wedding-template-favorites") || "[]"
  )
);

const toast = ref("");

// ======================================================
// HIỆU ỨNG CHUYỂN ĐỘNG
// ======================================================

/*
 * ======================================================
 * SỐ LIỆU ĐẾM LÊN
 * ======================================================
 * Ba con số ở hero đếm dần từ 0 thay vì hiện ra nguyên con.
 * Đích đến là giá trị thật (số mẫu, số phong cách) nên khi
 * dữ liệu về muộn thì số vẫn chạy tới đúng chỗ.
 */
const counters = reactive({
  templates: 0,
  styles: 0,
  custom: 0,
});

const templateCount = computed(() => counters.templates);
const styleCount = computed(() => counters.styles);
const customPercent = computed(() => counters.custom);

/*
 * Mỗi con số giữ một khung hình riêng. Dùng chung một biến thì
 * lần chạy sau sẽ huỷ lần chạy trước — gọi ba lần liên tiếp
 * chỉ còn con số cuối cùng chạy.
 */
const counterFrames = new Map();

/*
 * Chạy một con số từ giá trị hiện tại tới đích trong `duration`
 * mili-giây. Dùng easeOutCubic để đoạn cuối chậm lại — cảm giác
 * "dừng đúng số" thay vì bị cắt ngang.
 */
function runCounter(key, target, duration = 1100) {
  const from = counters[key];

  if (from === target) {
    return;
  }

  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    counters[key] = Math.round(from + (target - from) * eased);

    if (progress < 1) {
      counterFrames.set(key, requestAnimationFrame(step));
    } else {
      counterFrames.delete(key);
    }
  }

  cancelAnimationFrame(counterFrames.get(key));

  counterFrames.set(key, requestAnimationFrame(step));
}

function prefersReducedMotion() {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
    false
  );
}

/*
 * ======================================================
 * VỆT SÁNG THEO CON TRỎ
 * ======================================================
 * Thẻ mẫu có một vệt sáng mờ đi theo ngón tay / con trỏ, giống
 * ánh kim loại bắt sáng khi nghiêng tấm thiệp. Toạ độ ghi vào
 * biến CSS của chính thẻ đó nên mỗi thẻ sáng theo vị trí riêng.
 */
function trackSpotlight(event) {
  if (prefersReducedMotion()) {
    return;
  }

  const card = event.currentTarget;

  const rect = card.getBoundingClientRect();

  card.style.setProperty(
    "--spot-x",
    `${((event.clientX - rect.left) / rect.width) * 100}%`
  );

  card.style.setProperty(
    "--spot-y",
    `${((event.clientY - rect.top) / rect.height) * 100}%`
  );
}

function clearSpotlight(event) {
  const card = event.currentTarget;

  card.style.removeProperty("--spot-x");
  card.style.removeProperty("--spot-y");
}

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

      const themeLabel = getThemeMeta(themeName).name;

      return (
        bride.toLowerCase().includes(keyword) ||
        groom.toLowerCase().includes(keyword) ||
        themeName.toLowerCase().includes(keyword) ||
        themeLabel.toLowerCase().includes(keyword)
      );
    });
  }

  /*
   * "noi-bat" — mẫu có ảnh bìa và ngày cưới đầy đủ lên
   * trước, vì đó là những mẫu xem được trọn vẹn nhất.
   */
  if (sortMode.value === "noi-bat") {
    list = [...list].sort((a, b) => {
      const score = (w) =>
        (w?.coverImage ? 2 : 0) + (w?.weddingDate ? 1 : 0);

      return score(b) - score(a);
    });
  }

  return list;
});

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

useSeo(() => SEO_BY_ROUTE[route.name] || SEO_BY_ROUTE.Templates);

// ======================================================
// Load
// ======================================================

onMounted(async () => {
  applyRoutePreset();

  await store.loadWeddings();

  runCounter("templates", weddings.value.length);
  runCounter("styles", themes.value.length, 900);
  runCounter("custom", 100, 1300);
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

onBeforeUnmount(() => {
  counterFrames.forEach((frame) => cancelAnimationFrame(frame));

  counterFrames.clear();
});

// ======================================================
// Helpers
// ======================================================

function getCoupleName(wedding) {
  const bride =
    wedding?.couple?.Bride?.Name ||
    "";

  const groom =
    wedding?.couple?.Groom?.Name ||
    "";

  if (!bride && !groom) {
    return "Cô dâu & Chú rể";
  }

  return `${bride} & ${groom}`;
}

function getThemeLabel(wedding) {
  const themeName =
    wedding?.theme?.Name ||
    wedding?.theme ||
    "";

  return (
    getThemeMeta(themeName).name ||
    themeName ||
    "Classic"
  );
}

/*
 * Bản sắc màu của mẫu — dùng cho viền card, tag phong
 * cách và dải màu nhận diện dưới tên cặp đôi.
 */
function getWeddingMeta(wedding) {
  const themeName =
    wedding?.theme?.Name ||
    wedding?.theme ||
    "";

  return getThemeMeta(themeName);
}

/*
 * CSS variables theo bản sắc từng mẫu — mỗi card
 * mang màu riêng của theme (viền, tag, dải màu).
 */
function getCardStyle(wedding) {
  const meta = getWeddingMeta(wedding);
  const p = meta.palette;

  return {
    "--card-ink": p.ink,
    "--card-accent": p.accent,
    "--card-seal": p.seal,
    "--card-bg": p.bg,
  };
}

/*
 * Tên bộ sưu tập của mẫu (dùng trong modal chi tiết).
 */
function getCollectionLabel(wedding) {
  const meta = getWeddingMeta(wedding);

  return getCollection(meta.collection).name;
}

/*
 * Mô tả ngắn của bộ sưu tập — hiện dưới tên cặp đôi trên thẻ,
 * để người xem biết ngay mẫu này thuộc phong cách nào.
 */
function getCollectionSub(wedding) {
  const meta = getWeddingMeta(wedding);

  return getCollection(meta.collection).sub;
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(parsed);
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

function onImageError(event) {
  event.target.src =
    "https://images.unsplash.com/" +
    "photo-1520854221256-17451cc331bf" +
    "?auto=format&fit=crop&w=900&q=80";
}
</script>

<style scoped>
/* =========================================================
   DESIGN TOKENS
========================================================= */

.templates-page {
  --wine: var(--studio-seal, #a63a2e);
  --wine-dark: #7c2a20;
  --wine-soft: #b07a6e;

  --gold: var(--studio-foil, #b9975b);
  --gold-light: #d8bc7e;

  --cream: #f7f1e6;
  --cream-dark: #efe6d4;

  --text: var(--studio-ink, #2b2118);
  --muted: var(--studio-ink-faint, #8a7a68);

  --border: rgba(43, 33, 24, 0.1);

  /* Studio tokens (đồng bộ theme.css) */
  --studio-ink: #2b2118;
  --studio-paper: #f7f1e6;
  --studio-card: #fffdf8;
  --studio-foil: #b9975b;
  --studio-seal: #a63a2e;

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

.container {
  width: min(
    1380px,
    calc(100% - 56px)
  );

  margin: 0 auto;
}

/* =========================================================
   BACKGROUND
========================================================= */

.page-glow {
  position: absolute;
  width: 460px;
  height: 460px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(70px);
  opacity: 0.5;

  /* Ba quầng trôi lệch nhịp nhau, mỗi quầng một chu kỳ riêng
     nên chúng không bao giờ trùng pha — nền vì thế luôn đổi
     chỗ sáng tối một cách tự nhiên. */
  animation: glow-drift 22s ease-in-out infinite;
}

@keyframes glow-drift {
  0%,
  100% {
    transform:
      translate(0, 0)
      scale(1);
  }

  33% {
    transform:
      translate(40px, -30px)
      scale(1.12);
  }

  66% {
    transform:
      translate(-30px, 25px)
      scale(0.94);
  }
}

.page-glow-1 {
  top: 260px;
  left: -350px;

  background: rgba(
    201,
    166,
    89,
    0.1
  );
}

.page-glow-2 {
  top: 900px;
  right: -350px;

  background: rgba(
    143,
    77,
    67,
    0.07
  );

  animation-duration: 28s;
  animation-delay: -8s;
}

/*
 * Quầng thứ ba nằm sâu trong trang, chỗ lưới mẫu — giữ cho
 * nền không phẳng dần khi cuộn xuống.
 */
.page-glow-3 {
  top: 1900px;
  left: -280px;

  background: rgba(
    201,
    166,
    89,
    0.08
  );

  animation-duration: 34s;
  animation-delay: -16s;
}

/* =========================================================
   ẤN SON
========================================================= */

/*
 * Ấn son lớn mờ ở góc trang — điểm nhấn Á Đông
 * rất tiết chế, chỉ hiện trên màn hình rộng.
 */
.page-seal {
  position: absolute;

  top: 120px;
  right: 4%;

  width: 92px;
  height: 92px;

  display: grid;
  place-items: center;

  border: 2px solid
    rgba(166, 58, 46, 0.16);

  border-radius: 14px;

  color: rgba(166, 58, 46, 0.14);

  font-family: var(--font-symbol, serif);

  font-size: 54px;

  font-weight: 700;

  transform: rotate(6deg);

  pointer-events: none;

  user-select: none;

  /* Lắc lư rất chậm, như tờ giấy bị gió thổi — đủ để mắt nhận
     ra trang đang sống mà không gây nhiễu. */
  animation: seal-sway 9s ease-in-out infinite;
}

@keyframes seal-sway {
  0%,
  100% {
    transform:
      rotate(6deg)
      translateY(0);
  }

  50% {
    transform:
      rotate(3deg)
      translateY(-10px);
  }
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

/*
 * Quầng sáng chuyển động chậm phía sau tiêu đề. Ba lớp màu
 * (son, vàng kim, hồng đất) trôi lệch nhịp nhau nên vùng sáng
 * không đứng yên một chỗ — mắt thấy trang "thở" dù không có
 * gì di chuyển hẳn.
 *
 * Đặt sau nội dung và chặn sự kiện chuột để không ảnh hưởng
 * tới việc bấm nút.
 */
.hero-aurora {
  position: absolute;

  top: -140px;
  left: 50%;

  width: min(1100px, 130vw);
  height: 620px;

  transform: translateX(-50%);

  pointer-events: none;

  background:
    radial-gradient(
      circle at 30% 40%,
      rgba(166, 58, 46, 0.13),
      transparent 55%
    ),
    radial-gradient(
      circle at 70% 55%,
      rgba(185, 151, 91, 0.16),
      transparent 58%
    ),
    radial-gradient(
      circle at 50% 20%,
      rgba(176, 122, 110, 0.1),
      transparent 60%
    );

  filter: blur(30px);

  animation: aurora-drift 18s ease-in-out infinite;
}

@keyframes aurora-drift {
  0%,
  100% {
    transform:
      translateX(-50%)
      translateY(0)
      scale(1);
  }

  50% {
    transform:
      translateX(-50%)
      translateY(-26px)
      scale(1.06);
  }
}

.hero-inner {
  position: relative;
}

.hero-decoration {
  position: absolute;

  color: var(--studio-foil, var(--gold));

  font-family: var(--font-symbol, var(--font-heading));

  opacity: 0.4;

  font-size: 26px;

  animation: floating 5s ease-in-out infinite;
}

.hero-decoration-left {
  left: 18%;
  top: 20px;
}

.hero-decoration-right {
  right: 18%;
  top: 80px;

  animation-delay: -2s;
}

.eyebrow {
  display: inline-flex;

  align-items: center;
  gap: 13px;

  color: var(--studio-seal, var(--wine));

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.eyebrow-line {
  width: 28px;
  height: 1px;

  background: var(--studio-foil, var(--gold));
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
  color: var(--studio-seal, var(--wine));

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
    var(--studio-foil, var(--gold));
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
  color: var(--studio-ink, var(--wine));

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
  padding-bottom: 100px;
}

.toolbar {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 24px;

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
  color: var(--gold);

  font-size: 13px;
}

.filter-control select {
  appearance: none;

  min-width: 170px;

  padding: 0 34px 0 9px;

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
  width: 280px;

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

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 28px;
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

  border-radius: 18px;

  background: var(--studio-card);

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

/*
 * Vệt sáng bám theo con trỏ — như ánh kim loại bắt sáng khi
 * nghiêng tấm thiệp. Toạ độ do JS ghi vào --spot-x/--spot-y;
 * chưa rê chuột thì vệt nằm ngoài khung nên không thấy gì.
 *
 * Chỉ hiện trên thiết bị có con trỏ thật: trên điện thoại
 * không có "hover" nên lớp này chỉ tổ vẽ thừa.
 */
@media (hover: hover) and (pointer: fine) {
  .template-card::after {
    content: "";

    position: absolute;

    inset: 0;

    z-index: 4;

    pointer-events: none;

    opacity: 0;

    background:
      radial-gradient(
        260px circle at var(--spot-x, -20%) var(--spot-y, -20%),
        color-mix(
          in srgb,
          var(--card-accent, #b9975b) 22%,
          transparent
        ),
        transparent 70%
      );

    transition: opacity 0.4s ease;
  }

  .template-card:hover::after {
    opacity: 1;
  }
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
 * Thẻ nổi bật tự phát sáng nhịp nhàng — không cần rê chuột vẫn
 * thấy nó khác các thẻ còn lại. Chu kỳ 4.5s đủ chậm để không
 * gây phân tâm khi đang đọc.
 */
.template-card.is-featured {
  animation: featured-glow 4.5s ease-in-out infinite;
}

@keyframes featured-glow {
  0%,
  100% {
    box-shadow:
      0 12px 35px rgba(43, 33, 24, 0.06),
      0 0 0 0
        color-mix(
          in srgb,
          var(--card-accent, #b9975b) 0%,
          transparent
        );
  }

  50% {
    box-shadow:
      0 18px 45px rgba(43, 33, 24, 0.1),
      0 0 0 6px
        color-mix(
          in srgb,
          var(--card-accent, #b9975b) 14%,
          transparent
        );
  }
}

/* Đang rê chuột thì nhường hiệu ứng cho trạng thái hover. */
.template-card.is-featured:hover {
  animation: none;
}

.image-wrap {
  position: relative;

  overflow: hidden;

  aspect-ratio: 0.76;
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

/*
 * Vệt sáng chạy chéo qua ảnh — chạy một lần mỗi khi rê chuột
 * vào thẻ, như ánh sáng quét qua mặt giấy bóng.
 *
 * Đặt sẵn ngoài khung (translateX(-120%)) rồi trượt sang phải;
 * chỉ chạy khi hover nên không tốn gì lúc trang đứng yên.
 */
.image-sheen {
  position: absolute;

  top: -50%;
  left: 0;

  width: 55%;
  height: 200%;

  pointer-events: none;

  background:
    linear-gradient(
      100deg,
      transparent 0%,
      rgba(255, 255, 255, 0.34) 50%,
      transparent 100%
    );

  transform: translateX(-160%) rotate(8deg);

  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .template-card:hover .image-sheen {
    animation: sheen-sweep 1.1s cubic-bezier(.3,.7,.3,1);
  }
}

@keyframes sheen-sweep {
  0% {
    transform: translateX(-160%) rotate(8deg);

    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  100% {
    transform: translateX(320%) rotate(8deg);

    opacity: 0;
  }
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

  background:
    linear-gradient(
      180deg,
      rgba(58, 30, 26, 0.08),
      rgba(58, 30, 26, 0.52)
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
   CARD TOP
========================================================= */

.card-top {
  position: absolute;

  top: 14px;
  left: 14px;
  right: 14px;

  display: flex;

  justify-content: space-between;

  z-index: 3;
}

.theme-tag {
  display: inline-flex;

  align-items: center;

  min-height: 28px;

  padding: 0 11px;

  border:
    1px solid
    rgba(255,255,255,0.45);

  border-radius: 999px;

  background:
    color-mix(
      in srgb,
      var(--card-seal, #2c1e1e) 55%,
      transparent
    );

  backdrop-filter:
    blur(12px);

  color: #fff;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;
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

  color: var(--card-seal, var(--wine));

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  z-index: 3;

  /* Nhấp nhô nhẹ — huy hiệu "đang được chú ý" chứ không phải
     một nhãn tĩnh nằm im. */
  animation: badge-bob 3.2s ease-in-out infinite;
}

@keyframes badge-bob {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

.featured-label span {
  color: var(--card-accent, var(--gold));
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

  color: #9a8a86;

  font-size: 10px;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.card-meta .dot {
  width: 3px;
  height: 3px;

  border-radius: 50%;

  background: var(--card-accent, var(--gold));
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
 * Một dòng mô tả phong cách của mẫu. Cắt sau hai dòng để các
 * thẻ trong cùng hàng luôn cao bằng nhau dù mô tả dài ngắn khác
 * nhau.
 */
.card-desc {
  display: -webkit-box;

  -webkit-line-clamp: 2;
  line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

  margin: 7px 0 0;

  color: #8a7a76;

  font-size: clamp(
    11px,
    1.05vw,
    12.5px
  );

  line-height: 1.55;
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

  /*
   * Dải màu bản sắc nở dần từ trái sang khi thẻ hiện ra — mỗi
   * ô lệch nhau 90ms (do template đặt) nên chạy như một làn
   * sóng nhỏ chạy ngang qua dải.
   */
  transform-origin: left center;

  transition:
    transform 0.5s cubic-bezier(.2,.8,.2,1),
    opacity 0.5s ease;

  transition-delay: var(--swatch-delay, 0ms);
}

.identity-swatch:first-child {
  width: 26px;
}

.identity-orn {
  margin-left: auto;

  color: var(--card-accent, var(--gold));

  font-family: var(--font-symbol, var(--font-heading));

  font-size: 14px;

  line-height: 1;

  /* Ấn ký xoay chậm — chi tiết nhỏ nhưng làm thẻ có sức sống
     ngay cả khi người dùng không chạm vào. */
  animation: orn-turn 14s linear infinite;
}

@keyframes orn-turn {
  to {
    transform: rotate(360deg);
  }
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

.card-footer {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-top: 16px;
}

.view-detail {
  color: #8a7a76;

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
  color: var(--card-seal, var(--wine));
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

  color: var(--card-seal, var(--wine));

  font-size: 10px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;
}

.use-template-btn:hover {
  background: var(--card-seal, var(--wine));

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
  aspect-ratio: 0.76;

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

@keyframes floating {
  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-8px);
  }
}

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

    gap: 22px;
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

  .container {
    width:
      min(
        100% - 36px,
        700px
      );
  }

  .page-hero {
    padding-top: 65px;
  }

  .hero-decoration {
    display: none;
  }

  /*
   * Quầng sáng lớn và nhoè rất tốn cho GPU điện thoại, mà màn
   * nhỏ thì gần như không thấy khác biệt — bỏ hẳn.
   */
  .hero-aurora {
    display: none;
  }

  .page-seal {
    display: none;
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
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 640px) {
  .container {
    width:
      calc(100% - 24px);
  }

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

    gap: 12px;
  }

  .template-card {
    border-radius: 14px;
  }

  .image-wrap {
    aspect-ratio: 0.72;
  }

  .card-top {
    top: 8px;
    left: 8px;
    right: 8px;
  }

  .theme-tag {
    max-width: 105px;

    overflow: hidden;

    min-height: 23px;

    padding: 0 8px;

    font-size: 11px;

    white-space: nowrap;

    text-overflow: ellipsis;
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

  .card-desc {
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
    gap: 8px;
  }

  .card-body h3 {
    font-size: 16px;
  }

  .card-desc {
    display: none;
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