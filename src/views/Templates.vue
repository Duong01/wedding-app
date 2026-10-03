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
         HEADER GỌN
         Trang tập trung vào lưới thiệp — tiêu đề và số mẫu
         gọn một khối, không còn khối marketing lớn.
    ====================================================== -->
    <section class="page-head">
      <div class="container head-inner">
        <h1>{{ pageTitle }}</h1>

        <p class="head-count">
          <strong>{{ filteredWeddings.length }}</strong>
          mẫu thiệp
          <span class="head-sep">·</span>
          Tạo miễn phí, dùng thử 3 ngày
        </p>
      </div>
    </section>

    <!-- =====================================================
         CONTENT
    ====================================================== -->
    <section class="container templates-content">

      <!-- ===================================================
           TOOLBAR — chọn phong cách, sắp xếp, tìm kiếm
      ==================================================== -->
      <div class="toolbar">
        <div class="toolbar-right">

          <!-- Phong cách (bộ sưu tập) -->
          <div class="filter-control">
            <span class="control-icon">◈</span>

            <select v-model="styleValue">
              <option value="">Tất cả phong cách</option>

              <option
                v-for="style in styleOptions"
                :key="style.value"
                :value="style.value"
              >
                {{ style.label }}
              </option>

              <!-- preset route SEO gộp nhiều bộ sưu tập -->
              <option
                v-if="stylePresetOption"
                :value="stylePresetOption.value"
              >
                {{ stylePresetOption.label }}
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
          @click="goToIntro(wedding)"
        >
          <!-- IMAGE — ảnh phủ toàn thẻ, tên thiệp trên gradient.

               Ảnh là ảnh chụp NGUYÊN TRANG thiệp (~1:12) —
               hover vào thẻ, ảnh tự cuộn xuống cho xem trọn
               bộ thiết kế (useHoverAutoScroll). -->
          <div
            class="image-wrap"
            @mouseenter="cardScroll.start"
            @mouseleave="cardScroll.stop"
          >

            <img
              :src="getPreviewSrc(wedding)"
              :alt="getThemeLabel(wedding)"
              loading="lazy"
              @error="onImageError"
            />

            <!-- gradient chân ảnh — tách tên khỏi ảnh -->
            <div class="image-gradient"></div>

            <!-- badge theme mới ra mắt -->
            <span
              v-if="getWeddingMeta(wedding).isNew"
              class="new-badge"
            >
              Mới
            </span>

            <!-- tên thiệp nằm trên ảnh, kiểu gallery -->
            <div class="image-caption">
              <p class="caption-collection">
                {{ getCollectionLabel(wedding) }}
              </p>

              <h3>{{ getThemeLabel(wedding) }}</h3>
            </div>

            <!-- hover overlay — mô tả + nút hành động -->
            <div class="card-hover">
              <p class="hover-desc">
                {{ getWeddingMeta(wedding).desc }}
              </p>

              <div class="hover-tags">
                <span
                  v-for="tag in getWeddingMeta(wedding).tags"
                  :key="tag"
                  class="hover-tag"
                >
                  {{ tag }}
                </span>
              </div>

              <span class="hover-cta">Xem thiệp →</span>
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

        </article>
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
  collectionLabel,
  handleImageError,
  previewFor,
  themeLabel,
  themeMeta,
} from "@/utils/weddingCard";

import { BRAND } from "@/data/siteContent";
import { useSeo } from "@/composables/useSeo";
import { useHoverAutoScroll } from "@/composables/useHoverAutoScroll";

// ======================================================
// Router / Store
// ======================================================

const route = useRoute();
const router = useRouter();
const store = useWeddingStore();

/*
 * Thẻ mẫu trong gallery — hover để tự cuộn ảnh nguyên trang
 * (hiệu ứng nằm ở composables/useHoverAutoScroll.js).
 */
const cardScroll = useHoverAutoScroll();

function goHome() {
  router.push({ name: "Home" });
}

// ======================================================
// State
// ======================================================

const q = ref("");

/*
 * Phong cách đang chọn — dropdown duy nhất thay cho chip bộ
 * sưu tập + select theme riêng lẻ trước đây.
 *
 * Giá trị:
 *   ""            — tất cả
 *   "col:<id>"    — một bộ sưu tập (Truyền thống, Lãng mạn...)
 *   "theme:<key>" — một theme cụ thể
 *   "preset:..."  — preset route SEO gộp nhiều bộ sưu tập
 */
const styleValue = ref("");

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
  TemplatesModern: { collections: ["hien-dai", "lang-man", "nghe-thuat"] },
  TemplatesTraditional: { collections: ["truyen-thong", "a-dong"] },
};

/*
 * Preset gộp nhiều bộ sưu tập hiển thị thành một lựa chọn
 * riêng trong dropdown — chọn lại được sau khi đổi qua khác.
 */
const stylePresetOption = computed(() => {
  const preset = ROUTE_PRESETS[route.name];

  if (!preset?.collections) {
    return null;
  }

  const names = preset.collections
    .map((id) => COLLECTIONS.find((col) => col.id === id)?.name)
    .filter(Boolean);

  return {
    value: `preset:${route.name}`,
    label: names.join(" + "),
  };
});

function applyRoutePreset() {
  const preset = ROUTE_PRESETS[route.name] || {};

  const queryCollections = String(route.query["bo-suu-tap"] || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (queryCollections.length === 1) {
    styleValue.value = `col:${queryCollections[0]}`;
  } else if (queryCollections.length > 1) {
    styleValue.value = `preset:${queryCollections.join("+")}`;
  } else if (preset.collections) {
    styleValue.value = `preset:${route.name}`;
  } else {
    styleValue.value = "";
  }

  sortMode.value = String(route.query["sap-xep"] || preset.sort || "");

  q.value = String(route.query["tu-khoa"] || "");
}

/*
 * Ghi lại bộ lọc hiện tại lên query — để copy link là
 * chia sẻ được đúng khung đang xem.
 */
function syncQuery() {
  const query = {};

  const value = styleValue.value;

  if (value.startsWith("col:")) {
    query["bo-suu-tap"] = value.slice(4);
  } else if (value.startsWith("preset:")) {
    const key = value.slice(7);

    if (key === route.name) {
      // preset của chính route này — query rỗng là đủ
    } else {
      query["bo-suu-tap"] = key.split("+").join(",");
    }
  }

  if (sortMode.value) {
    query["sap-xep"] = sortMode.value;
  }

  if (q.value.trim()) {
    query["tu-khoa"] = q.value.trim();
  }

  router.replace({ query }).catch(() => {});
}

/*
 * Danh sách mẫu yêu thích — đọc từ localStorage.
 *
 * Bọc try/catch: giá trị hỏng (bị cắt giữa chừng khi đóng
 * tab, quota đầy, extension chèn rác...) văng exception
 * ngay trong setup → cả trang Templates trắng và F5 bao
 * nhiêu lần cũng trắng (giá trị hỏng vẫn nằm trong storage).
 * Đọc hỏng thì coi như chưa yêu thích mẫu nào.
 */
const favorites = ref(
  (() => {
    try {
      return JSON.parse(
        localStorage.getItem("wedding-template-favorites") || "[]"
      );
    } catch {
      return [];
    }
  })()
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
 * Danh sách phong cách cho dropdown — bộ sưu tập trước
 * (Truyền thống Việt Nam, Romantic / Lãng mạn...), rồi tới
 * từng theme cụ thể. Dùng tên hiển thị tiếng Việt từ bản
 * sắc theme thay vì key kỹ thuật.
 */
const styleOptions = computed(() => {
  const present = new Set(
    themes.value.map(
      (theme) => getThemeMeta(theme).collection
    )
  );

  const collections = COLLECTIONS
    .filter((col) => present.has(col.id))
    .map((col) => ({
      value: `col:${col.id}`,
      label: col.name,
    }));

  const singleThemes = themes.value
    .map((theme) => ({
      value: `theme:${theme}`,
      label: getThemeMeta(theme).name,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, "vi")
    );

  return [...collections, ...singleThemes];
});

const filteredWeddings = computed(() => {
  let list = weddings.value;

  // phong cách — bộ sưu tập, theme riêng lẻ, hoặc preset
  const value = styleValue.value;

  if (value.startsWith("col:")) {
    const colId = value.slice(4);

    list = list.filter((w) => {
      const themeName =
        w?.theme?.Name ||
        w?.theme ||
        "";

      return getThemeMeta(themeName).collection === colId;
    });
  } else if (value.startsWith("theme:")) {
    const themeKey = value.slice(6);

    list = list.filter((w) => {
      return (
        w?.theme?.Name ||
        w?.theme ||
        ""
      ) === themeKey;
    });
  } else if (value.startsWith("preset:")) {
    const key = value.slice(7);

    const colIds =
      key === route.name
        ? ROUTE_PRESETS[route.name]?.collections || []
        : key.split("+");

    list = list.filter((w) => {
      const themeName =
        w?.theme?.Name ||
        w?.theme ||
        "";

      return colIds.includes(
        getThemeMeta(themeName).collection
      );
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
// Nội dung hiển thị — tiêu đề trang theo route SEO
// ======================================================

const PAGE_TITLES = {
  Templates: "Mẫu thiệp cưới",
  TemplatesFeatured: "Mẫu thiệp cưới nổi bật",
  TemplatesModern: "Thiệp cưới hiện đại",
  TemplatesTraditional: "Thiệp cưới truyền thống",
};

const pageTitle = computed(
  () => PAGE_TITLES[route.name] || PAGE_TITLES.Templates
);

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
 * JSON-LD cho trang gallery: ItemList — Google hiểu đây là
 * một thư viện nhiều mẫu thay vì một trang đơn lẻ, mỗi mục
 * kèm tên, mô tả và đường dẫn riêng.
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
    "@type": "ItemList",
    name: "Mẫu thiệp cưới",
    numberOfItems: items.length,
    itemListElement: items,
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
watch([styleValue, sortMode, q], syncQuery);

// ======================================================
// Helpers
// ======================================================

/*
 * Các helper hiển thị thẻ (nhãn theme, bảng màu, ảnh xem
 * trước) dùng chung từ weddingCard.js — nơi đã gom để
 * gallery, trang chủ và trang đích SEO không lệch nhau
 * sau vài lần sửa.
 */

function getThemeLabel(wedding) {
  return themeLabel(wedding);
}

function getWeddingMeta(wedding) {
  return themeMeta(wedding);
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
  styleValue.value = "";
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
  min-height: 100dvh;
  position: relative;
  overflow: hidden;

  /* Giấy dó sáng — nền sáng khiến ảnh thiệp nổi bật */
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
      #fdfbf5 0%,
      #faf7ef 45%,
      #f6f1e4 100%
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
   PAGE HEAD — gọn: tiêu đề + số mẫu, một dòng
========================================================= */

.page-head {
  padding: 34px 0 26px;

  text-align: center;
}

.head-inner h1 {
  margin: 0;

  font-family: var(--font-heading),
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(
    26px,
    3.6vw,
    40px
  );

  line-height: 1.1;

  letter-spacing: -0.015em;

  font-weight: 500;

  color: var(--text);
}

.head-count {
  display: flex;

  flex-wrap: wrap;

  align-items: baseline;
  justify-content: center;

  gap: 6px;

  margin: 10px 0 0;

  color: var(--muted);

  font-size: clamp(
    12px,
    1.2vw,
    13.5px
  );
}

.head-count strong {
  color: var(--studio-seal, #a63a2e);

  font-family:
    var(--font-num),
    var(--font-heading),
    Georgia,
    serif;

  font-size: clamp(
    16px,
    1.8vw,
    20px
  );

  font-variant-numeric: tabular-nums;
}

.head-sep {
  opacity: 0.5;
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
  justify-content: center;

  gap: 16px 20px;

  margin-bottom: 30px;

  padding-bottom: 18px;

  border-bottom:
    1px solid var(--studio-line, rgba(64, 40, 44, 0.08));
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
    var(--studio-line, rgba(43, 33, 24, 0.12));

  border-radius: 12px;

  background:
    var(--studio-glass, rgba(255, 253, 248, 0.85));

  box-shadow:
    0 5px 18px
      rgba(43, 33, 24, 0.07);

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

  color: var(--muted, #8a7a76);
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
  color: var(--studio-ink-faint, #9a8a86);
}

.clear-search {
  width: 24px;
  height: 24px;

  display: grid;
  place-items: center;

  padding: 0;

  border: none;

  border-radius: 50%;

  background: var(--studio-foil-soft, #eee7e2);

  color: var(--studio-ink-soft, #675853);

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
    var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 20px;

  /*
   * Khung thẻ dùng hệ màu studio chung — mọi thẻ đồng nhất
   * như một bộ sưu tập. Bản sắc từng mẫu nằm ở nội dung:
   * ảnh, tên thiết kế, dải màu và từ khóa.
   */
  background: var(--studio-card, #ffffff);

  cursor: pointer;

  box-shadow:
    0 10px 28px
      rgba(43, 33, 24, 0.08);

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
    rgba(185, 151, 91, 0.55);

  box-shadow:
    0 28px 60px
      rgba(43, 33, 24, 0.16);
}

/*
 * Thẻ đang được lưu yêu thích mang viền vàng kim đậm hơn —
 * phân biệt với các thẻ còn lại mà không cần animation.
 */
.template-card.is-featured {
  border-color:
    rgba(185, 151, 91, 0.6);

  box-shadow:
    0 10px 28px rgba(43, 33, 24, 0.08),
    0 0 0 4px
      rgba(185, 151, 91, 0.18);
}

.image-wrap {
  position: relative;

  overflow: hidden;

  /*
   * Tỷ lệ chuẩn 3/4 — giống carousel trang chủ
   * (TemplateCarousel3D) để cùng một mẫu hiện giống nhau
   * ở mọi nơi. Nền dự phòng giấy dó chung cho mọi thẻ.
   */
  aspect-ratio: 3 / 4;

  background: var(--studio-paper-deep, #f1e9da);
}

.image-wrap img {
  /*
   * height:auto — ảnh nguyên trang tràn xuống dưới khung
   * 3/4, phần tràn bị overflow:hidden che. Bình thường chỉ
   * thấy trang bìa; hover: tự cuộn bằng translateY (xem
   * composables/useHoverAutoScroll.js), rời chuột về đầu.
   */
  width: 100%;
  height: auto;

  display: block;
}

.template-card:hover
.image-wrap img {
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
      rgba(0,0,0,0.14) 0%,
      transparent 30%,
      transparent 46%,
      rgba(24, 12, 10, 0.66) 100%
    );

  pointer-events: none;
}

/* =========================================================
   NEW BADGE — theme mới ra mắt
========================================================= */

.new-badge {
  position: absolute;

  top: 14px;
  left: 14px;

  z-index: 3;

  padding: 4px 11px;

  border-radius: 999px;

  background: var(--studio-seal, #a63a2e);

  color: #fff;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;
  text-transform: uppercase;

  box-shadow: 0 6px 16px rgba(166, 58, 46, 0.4);
}

/* =========================================================
   CAPTION — tên thiệp nằm trên gradient chân ảnh
========================================================= */

.image-caption {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  padding: 14px 16px 15px;

  color: #fff;

  pointer-events: none;
}

.caption-collection {
  margin: 0 0 3px;

  color: rgba(255, 255, 255, 0.82);

  font-size: 9.5px;
  font-weight: 700;

  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.image-caption h3 {
  margin: 0;

  font-family:
    var(--font-heading),
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(
    17px,
    1.7vw,
    22px
  );

  line-height: 1.15;

  font-weight: 600;

  color: #fff;

  /*
   * Tên dài không xuống dòng — cắt một dòng cho các thẻ
   * trong cùng hàng luôn cao bằng nhau.
   */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* =========================================================
   CARD HOVER — mô tả + từ khóa + CTA trượt lên từ chân ảnh
========================================================= */

.card-hover {
  position: absolute;

  inset: 0;

  display: flex;
  flex-direction: column;

  align-items: flex-start;
  justify-content: flex-end;

  gap: 10px;

  padding: 16px;

  color: #fff;

  background:
    linear-gradient(
      180deg,
      rgba(43, 33, 24, 0.06),
      rgba(43, 33, 24, 0.78) 62%
    );

  opacity: 0;

  transform: translateY(10px);

  transition:
    opacity 0.4s ease,
    transform 0.45s ease;
}

.template-card:hover
.card-hover {
  opacity: 1;

  transform: translateY(0);
}

.hover-desc {
  display: -webkit-box;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  overflow: hidden;

  margin: 0;

  color: rgba(255, 255, 255, 0.92);

  font-size: 12px;

  line-height: 1.55;
}

.hover-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 5px;
}

.hover-tag {
  padding: 3px 9px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.18);

  backdrop-filter: blur(6px);

  color: #fff;

  font-size: 10px;
  font-weight: 600;
}

.hover-cta {
  margin-top: 2px;

  color: #fff;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;
  text-transform: uppercase;
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
  position: relative;

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
    rgba(166, 58, 46, 0.85);
}

/*
 * Trạng thái đã lưu: trái tim tô đầy và nảy lên một nhịp. Nhịp
 * nảy chỉ chạy khi class vừa được thêm nên mỗi lần bấm là một
 * lần phản hồi, không phải rung liên tục.
 */
.favorite-btn.is-on {
  background:
    rgba(166, 58, 46, 0.92);

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
  color: var(--studio-foil, #b9975b);
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
      var(--studio-paper-deep, #ece4d4) 20%,
      var(--studio-card, #f6f0e3) 40%,
      var(--studio-paper-deep, #ece4d4) 60%
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

  background: var(--studio-paper-deep, #ece4d4);

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
    var(--studio-glass, rgba(255, 253, 248, 0.72));
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
  background: rgba(207, 91, 71, 0.16);
  color: var(--studio-seal, #c62828);
}

.retry-btn {
  margin-top: 22px;

  padding: 11px 18px;

  border: none;

  border-radius: 999px;

  background: var(--studio-contrast-bg, var(--studio-ink));

  color: var(--studio-contrast-ink, #f7f1e6);

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.25s ease;
}

.retry-btn:hover {
  background: var(--studio-foil, #443627);
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
    rgba(43, 33, 24, 0.1);

  border-radius: 999px;

  background:
    rgba(43, 33, 24, 0.92);

  backdrop-filter: blur(15px);

  color: #fff;

  box-shadow:
    0 15px 35px
      rgba(43, 33, 24, 0.25);

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
  .head-inner h1 {
    font-size:
      clamp(
        24px,
        8vw,
        34px
      );
  }

  .templates-content {
    padding-bottom: 60px;
  }

  .toolbar {
    margin-bottom: 20px;
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

  /*
   * Nút yêu thích phải đủ 44px để chạm trúng trên điện thoại.
   * Không phình nút thật (sẽ che ảnh) — giữ hình tròn 30px
   * nhưng nới vùng bấm bằng pseudo-element trong suốt.
   */
  .favorite-btn {
    width: 30px;
    height: 30px;
  }

  .favorite-btn::after {
    content: "";

    position: absolute;

    top: 50%;
    left: 50%;

    width: 44px;
    height: 44px;

    transform: translate(-50%, -50%);
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

  .image-caption {
    padding: 12px 12px 13px;
  }

  .image-caption h3 {
    font-size: 16px;
  }

  /*
   * Trên điện thoại không có hover — lớp phủ mô tả + từ khóa
   * không bao giờ hiện, nhưng vẫn nằm đè lên ảnh và chặn cú
   * chạm vào thẻ. Ẩn hẳn để cú chạm đi thẳng tới thẻ.
   */
  .card-hover {
    display: none;
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

  .image-caption {
    padding: 10px 10px 11px;
  }

  .image-caption h3 {
    font-size: 15px;
  }

  .caption-collection {
    font-size: 9px;
  }

  .hover-desc {
    font-size: 11px;
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