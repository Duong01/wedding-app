<template>
  <main class="templates-page">
    <!-- =====================================================
         BACKGROUND DECORATION
    ====================================================== -->
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>
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

        <p>
          Năm bộ sưu tập — từ đỏ son Á Đông, lụa vàng kim tuyến đến tối giản
          hiện đại — mỗi mẫu mang bảng màu, họa tiết và nhịp điệu riêng.
          Chọn mẫu bạn thích và tùy chỉnh cho ngày cưới của bạn.
        </p>

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
          :class="{ 'is-active': !selectedCollection }"
          @click="selectedCollection = ''"
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
          :class="{ 'is-active': selectedCollection === col.id }"
          @click="selectedCollection = col.id"
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

            <select v-model="selectedCollection">
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
          @click="openTemplateDetail(wedding)"
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
                Sử dụng mẫu
              </button>

            </div>
          </div>
        </article>
      </div>

      <!-- ===================================================
           COLLECTION FOOTNOTE
      ==================================================== -->
      <p class="collection-note">
        囍 Mỗi mẫu thuộc một bộ sưu tập với bảng màu riêng — chọn
        <strong>bộ sưu tập</strong> phía trên để xem theo phong cách.
      </p>
    </section>

    <!-- =====================================================
         DETAIL MODAL
    ====================================================== -->
    <Teleport to="body">
      <Transition name="detail-modal">
        <div
          v-if="selectedWedding"
          class="detail-modal"
          @click.self="closeTemplateDetail"
        >

          <div class="detail-panel">

            <!-- =========================================
                 CLOSE
            ========================================== -->
            <button
              type="button"
              class="close-btn"
              aria-label="Đóng"
              @click="closeTemplateDetail"
            >
              <span></span>
              <span></span>
            </button>

            <!-- =========================================
                 LEFT PREVIEW
            ========================================== -->
            <div
              class="detail-preview"
              :style="getCardStyle(selectedWedding)"
            >

              <div class="preview-header">
                <span>PREVIEW</span>

                <div class="preview-device">
                  <span class="device-dot"></span>
                  Mobile
                </div>
              </div>

              <div class="preview-stage">

                <div class="preview-phone">

                  <div class="phone-top">
                    <span></span>
                  </div>

                  <div class="phone-screen">
                    <img
                      :src="selectedWedding.coverImage"
                      :alt="getCoupleName(selectedWedding)"
                      @error="onImageError"
                    />
                  </div>

                  <div class="phone-bottom">
                    <span></span>
                  </div>
                </div>

                <!-- decoration -->
                <div class="preview-decoration decoration-1">
                  {{ getWeddingMeta(selectedWedding).orn }}
                </div>

                <div class="preview-decoration decoration-2">
                  {{ getWeddingMeta(selectedWedding).orn }}
                </div>

              </div>

              <div class="preview-footer">
                <span>
                  Thiết kế responsive
                </span>

                <span>
                  •
                </span>

                <span>
                  Tối ưu điện thoại
                </span>
              </div>
            </div>

            <!-- =========================================
                 RIGHT CONTENT
            ========================================== -->
            <div
              class="detail-content"
              :style="getCardStyle(selectedWedding)"
            >

              <div class="detail-scroll">

                <!-- badge -->
                <div class="detail-topline">

                  <span class="info-badge">
                    {{ getThemeLabel(selectedWedding) }}
                  </span>

                  <span class="template-code">
                    #{{ selectedWedding.id || "WEDDING" }}
                  </span>
                </div>

                <!-- title -->
                <h2>
                  {{ getCoupleName(selectedWedding) }}
                </h2>

                <p class="detail-date">
                  {{ formatDate(selectedWedding.weddingDate) }}
                </p>

                <!-- dải màu bản sắc của mẫu -->
                <div class="detail-identity">
                  <span
                    v-for="(swatch, swatchIndex) in getWeddingMeta(selectedWedding).palette"
                    :key="swatchIndex"
                    class="identity-swatch"
                    :style="{ background: swatch }"
                  ></span>

                  <span class="detail-collection">
                    {{ getCollectionLabel(selectedWedding) }}
                  </span>
                </div>

                <div class="gold-rule">
                  <span></span>
                  <i>{{ getWeddingMeta(selectedWedding).orn }}</i>
                  <span></span>
                </div>

                <!-- description -->
                <p class="description">
                  {{
                    selectedWedding.story?.Description ||
                    "Thiệp cưới được thiết kế theo phong cách hiện đại, đầy cảm xúc và dễ tùy chỉnh theo thông tin ngày cưới của bạn."
                  }}
                </p>

                <!-- =====================================
                     INFORMATION
                ====================================== -->
                <div class="detail-information">

                  <div class="information-item">

                    <span class="information-icon">
                      ♡
                    </span>

                    <div>
                      <span class="meta-label">
                        Cặp đôi
                      </span>

                      <strong>
                        {{ getCoupleName(selectedWedding) }}
                      </strong>
                    </div>
                  </div>

                  <div class="information-item">

                    <span class="information-icon">
                      ◷
                    </span>

                    <div>
                      <span class="meta-label">
                        Thời gian
                      </span>

                      <strong>
                        {{
                          formatFullDate(selectedWedding.weddingDate) ||
                          selectedWedding.hero?.Title ||
                          "Save the date"
                        }}
                      </strong>
                    </div>
                  </div>

                  <div class="information-item">

                    <span class="information-icon">
                      ♧
                    </span>

                    <div>
                      <span class="meta-label">
                        Địa điểm
                      </span>

                      <strong>
                        {{
                          selectedWedding.hero?.Location ||
                          "Chưa cập nhật"
                        }}
                      </strong>
                    </div>
                  </div>

                </div>

                <!-- =====================================
                     FEATURES
                ====================================== -->
                <div class="features-section">

                  <div class="section-heading">
                    <span>Tính năng</span>
                    <i></i>
                  </div>

                  <div class="features-grid">

                    <div class="feature-item">
                      <span>✦</span>
                      <p>Tùy chỉnh nội dung</p>
                    </div>

                    <div class="feature-item">
                      <span>◉</span>
                      <p>Ảnh không giới hạn</p>
                    </div>

                    <div class="feature-item">
                      <span>⌖</span>
                      <p>Google Maps</p>
                    </div>

                    <div class="feature-item">
                      <span>♪</span>
                      <p>Nhạc nền</p>
                    </div>

                    <div class="feature-item">
                      <span>♧</span>
                      <p>Ghi tên khách mời</p>
                    </div>

                    <div class="feature-item">
                      <span>↗</span>
                      <p>Chia sẻ qua link</p>
                    </div>

                    <div class="feature-item">
                      <span>♡</span>
                      <p>Xác nhận tham dự</p>
                    </div>

                    <div class="feature-item">
                      <span>○</span>
                      <p>Nhận lời chúc</p>
                    </div>

                  </div>
                </div>

                <!-- =====================================
                     QR
                ====================================== -->
                <div class="demo-section">

                  <div class="qr-box">

                    <img
                      :src="getQrUrl(selectedWedding)"
                      alt="QR xem demo"
                    />

                  </div>

                  <div class="qr-content">

                    <strong>
                      Xem thiệp trên điện thoại
                    </strong>

                    <p>
                      Quét mã QR để mở bản demo trực tiếp
                      trên điện thoại.
                    </p>

                    <span>
                      Không cần đăng nhập
                    </span>

                  </div>
                </div>

                <!-- =====================================
                     ACTIONS
                ====================================== -->
                <div class="detail-actions">

                  <button
                    type="button"
                    class="primary-btn"
                    @click="goToEditor(selectedWedding)"
                  >
                    <span>＋</span>
                    Tạo thiệp theo mẫu này
                  </button>

                  <button
                    type="button"
                    class="secondary-btn"
                    @click="goToWedding(selectedWedding)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                    >
                      <path
                        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                      />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>

                    Xem demo
                  </button>

                </div>

                <!-- share -->
                <button
                  type="button"
                  class="share-btn"
                  @click="shareTemplate(selectedWedding)"
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

                  Chia sẻ mẫu thiệp
                </button>

              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

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
  ref,
  watch
} from "vue";

import { useRouter } from "vue-router";
import { useWeddingStore } from "@/stores/wedding";

import {
  COLLECTIONS,
  getCollection,
  getThemeMeta,
} from "@/data/templateCollections";

// ======================================================
// Router / Store
// ======================================================

const router = useRouter();
const store = useWeddingStore();

function goHome() {
  router.push({ name: "Home" });
}

// ======================================================
// State
// ======================================================

const q = ref("");
const selectedTheme = ref("");
const selectedWedding = ref(null);
const selectedCollection = ref("");

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

  // bộ sưu tập
  if (selectedCollection.value) {
    list = list.filter((w) => {
      const themeName =
        w?.theme?.Name ||
        w?.theme ||
        "";

      return (
        getThemeMeta(themeName).collection ===
        selectedCollection.value
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

  return list;
});

// ======================================================
// Load
// ======================================================

onMounted(async () => {
  await store.loadWeddings();

  document.addEventListener(
    "keydown",
    handleKeydown
  );
});

onBeforeUnmount(() => {
  document.removeEventListener(
    "keydown",
    handleKeydown
  );

  document.body.style.overflow = "";
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
    return "Ngày Chung Đôi";
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

/*
 * Ngày + giờ đầy đủ cho modal chi tiết
 * (vd: "14/11/2026 · 08:00").
 */
function formatFullDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const day = new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(parsed);

  const time = new Intl.DateTimeFormat(
    "vi-VN",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(parsed);

  return `${day} · ${time}`;
}

// ======================================================
// Modal
// ======================================================

function openTemplateDetail(wedding) {
  selectedWedding.value = wedding;

  // khóa scroll background
  document.body.style.overflow = "hidden";
}

function closeTemplateDetail() {
  selectedWedding.value = null;

  document.body.style.overflow = "";
}

function handleKeydown(event) {
  if (
    event.key === "Escape" &&
    selectedWedding.value
  ) {
    closeTemplateDetail();
  }
}

// ======================================================
// Navigation
// ======================================================

function goToWedding(wedding) {
  if (!wedding?.slug) {
    return;
  }

  closeTemplateDetail();

  router.push({
    name: "WeddingBySlug",
    params: {
      slug: wedding.slug
    }
  });
}

function goToEditor(wedding) {
  if (!wedding) {
    return;
  }

  closeTemplateDetail();

  router.push({
    name: "Editor",
    query: {
      theme: wedding.theme.Name
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
// Share
// ======================================================

async function shareTemplate(wedding) {
  const url = `${window.location.origin}/wedding/${wedding?.slug || ""}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: getCoupleName(wedding),
        text: "Xem mẫu thiệp cưới này",
        url
      });

      return;
    }

    await navigator.clipboard.writeText(url);

    showToast("Đã sao chép link mẫu thiệp");
  } catch (error) {
    // Người dùng đóng hộp thoại share
  }
}

// ======================================================
// QR
// ======================================================

function getQrUrl(wedding) {
  const url =
    `${window.location.origin}/wedding/` +
    `${wedding?.slug || ""}`;

  return (
    "https://api.qrserver.com/v1/create-qr-code/" +
    `?size=180x180&margin=8&data=${encodeURIComponent(url)}`
  );
}

// ======================================================
// Filter
// ======================================================

function resetFilters() {
  q.value = "";
  selectedTheme.value = "";
  selectedCollection.value = "";
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

// ======================================================
// Close modal when route changes
// ======================================================

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    if (selectedWedding.value) {
      closeTemplateDetail();
    }
  }
);
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
}

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

  font-size: clamp(
    42px,
    5.4vw,
    76px
  );

  line-height: 0.98;

  letter-spacing: -0.025em;

  font-weight: 500;

  color: var(--text);
}

.page-hero h1 span {
  color: var(--studio-seal, var(--wine));

  font-style: italic;
}

.page-hero p {
  max-width: 680px;

  margin: 25px auto 0;

  color: var(--muted);

  font-size: 16px;

  line-height: 1.85;
}

.hero-stats {
  display: inline-flex;

  align-items: center;

  margin-top: 38px;

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

  font-size: 12.5px;

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
  font-size: 12.5px;

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

  font-size: 13px;
}

.result-count strong {
  color: var(--text);

  font-family:
    var(--font-heading),
    Georgia,
    serif;

  font-size: 23px;
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

.template-card:hover {
  transform:
    translateY(-10px);

  border-color:
    var(--card-accent, rgba(166, 58, 46, 0.18));

  box-shadow:
    0 28px 65px
      rgba(43, 33, 24, 0.14);
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

  font-size: 26px;

  line-height: 1.1;

  font-weight: 600;

  color: var(--card-ink, var(--text));
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

  color: var(--card-accent, var(--gold));

  font-family: var(--font-symbol, var(--font-heading));

  font-size: 14px;

  line-height: 1;
}

/* =========================================================
   COLLECTION NOTE
========================================================= */

.collection-note {
  margin: 34px 0 0;

  text-align: center;

  color: var(--muted);

  font-size: 12.5px;

  letter-spacing: 0.02em;
}

.collection-note strong {
  color: var(--studio-ink);
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
   DETAIL MODAL
========================================================= */

.detail-modal {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 30px;

  background:
    rgba(18, 11, 13, 0.78);

  backdrop-filter:
    blur(13px);
}

.detail-panel {
  position: relative;

  width: min(
    1100px,
    100%
  );

  max-height:
    min(850px, calc(100vh - 60px));

  display: grid;

  grid-template-columns:
    minmax(0, 1.02fr)
    minmax(390px, 0.98fr);

  overflow: hidden;

  border:
    1px solid
    rgba(255,255,255,0.12);

  border-radius: 25px;

  background:
    linear-gradient(
      135deg,
      #3a2c28 0%,
      #241a18 100%
    );

  color: #fff;

  box-shadow:
    0 40px 100px
      rgba(0,0,0,0.5);
}

/* =========================================================
   CLOSE
========================================================= */

.close-btn {
  position: absolute;

  top: 15px;
  right: 15px;

  z-index: 20;

  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  padding: 0;

  border:
    1px solid
    rgba(255,255,255,0.25);

  border-radius: 50%;

  background:
    rgba(43, 33, 24, 0.6);

  backdrop-filter: blur(12px);

  cursor: pointer;

  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.close-btn:hover {
  transform: rotate(90deg);

  background:
    rgba(255,255,255,0.15);
}

.close-btn span {
  position: absolute;

  width: 16px;
  height: 1.5px;

  background: #fff;

  border-radius: 999px;
}

.close-btn span:first-child {
  transform: rotate(45deg);
}

.close-btn span:last-child {
  transform: rotate(-45deg);
}

/* =========================================================
   PREVIEW
========================================================= */

.detail-preview {
  position: relative;

  min-height: 680px;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 40%,
      color-mix(
        in srgb,
        var(--card-accent, #b9975b) 16%,
        transparent
      ),
      transparent 38%
    ),
    linear-gradient(
      145deg,
      color-mix(
        in srgb,
        var(--card-seal, #3a2c28) 78%,
        #1a1210
      ),
      #1a1210
    );
}

.preview-header {
  position: absolute;

  top: 22px;
  left: 25px;
  right: 25px;

  display: flex;

  justify-content: space-between;

  z-index: 5;

  color:
    rgba(255,255,255,0.52);

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.18em;
}

.preview-device {
  display: flex;

  align-items: center;
  gap: 7px;

  letter-spacing: 0.05em;
}

.device-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: var(--card-accent, #b9975b);

  box-shadow:
    0 0 10px
      color-mix(
        in srgb,
        var(--card-accent, #b9975b) 80%,
        transparent
      );
}

.preview-stage {
  position: absolute;

  inset: 55px 30px 45px;

  display: flex;

  align-items: center;
  justify-content: center;
}

.preview-phone {
  position: relative;

  width: min(
    330px,
    75%
  );

  height: min(
    620px,
    82%
  );

  overflow: hidden;

  border:
    7px solid
    #1a1210;

  border-radius: 34px;

  background: #eee;

  box-shadow:
    0 30px 70px
      rgba(0,0,0,0.55),

    0 0 0 1px
      rgba(255,255,255,0.1);

  transform:
    rotate(-1deg);

  transition:
    transform 0.5s ease;
}

.detail-panel:hover
.preview-phone {
  transform:
    rotate(0deg)
    translateY(-4px);
}

.phone-top {
  position: absolute;

  top: 0;
  left: 50%;

  transform: translateX(-50%);

  width: 90px;
  height: 19px;

  z-index: 5;

  border-radius:
    0 0 14px 14px;

  background: #1a1210;
}

.phone-top span {
  position: absolute;

  left: 50%;
  top: 6px;

  width: 28px;
  height: 4px;

  transform:
    translateX(-50%);

  border-radius: 999px;

  background: #2c211e;
}

.phone-screen {
  width: 100%;
  height: 100%;

  overflow: hidden;
}

.phone-screen img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.phone-bottom {
  position: absolute;

  bottom: 5px;
  left: 50%;

  transform:
    translateX(-50%);

  width: 80px;
  height: 4px;

  border-radius: 999px;

  background:
    rgba(255,255,255,0.75);

  z-index: 5;
}

.preview-decoration {
  position: absolute;

  color:
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 65%,
      transparent
    );

  font-family: var(--font-heading);

  font-size: 24px;

  animation:
    floating 4s ease-in-out infinite;
}

.decoration-1 {
  top: 23%;
  left: 13%;
}

.decoration-2 {
  bottom: 20%;
  right: 12%;

  animation-delay: -1.5s;
}

.preview-footer {
  position: absolute;

  bottom: 17px;
  left: 0;
  right: 0;

  display: flex;

  justify-content: center;

  gap: 8px;

  color:
    rgba(255,255,255,0.4);

  font-size: 11px;

  letter-spacing: 0.04em;
}

/* =========================================================
   DETAIL CONTENT
========================================================= */

.detail-content {
  min-width: 0;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.045),
      rgba(255,255,255,0.018)
    );
}

.detail-scroll {
  height: 100%;

  overflow-y: auto;

  padding:
    46px 36px 30px;

  scrollbar-width: thin;

  scrollbar-color:
    rgba(255,255,255,0.15)
    transparent;
}

.detail-topline {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.info-badge {
  display: inline-flex;

  align-items: center;

  min-height: 25px;

  padding: 0 10px;

  border:
    1px solid
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 35%,
      transparent
    );

  border-radius: 999px;

  color: var(--card-accent, #b9975b);

  background:
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 8%,
      transparent
    );

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.template-code {
  color:
    rgba(255,255,255,0.25);

  font-size: 11px;

  letter-spacing: 0.08em;
}

.detail-content h2 {
  margin: 17px 0 6px;

  font-family:
    var(--font-heading),
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(
    36px,
    4vw,
    53px
  );

  line-height: 0.98;

  font-weight: 500;

  letter-spacing: -0.025em;

  color: #fff;
}

.detail-date {
  margin: 0;

  color:
    rgba(255,255,255,0.5);

  font-size: 13px;
}

/* =========================================================
   DETAIL IDENTITY (dải màu + bộ sưu tập trong modal)
========================================================= */

.detail-identity {
  display: flex;

  align-items: center;

  gap: 6px;

  margin-top: 14px;
}

.detail-identity .identity-swatch {
  width: 22px;
  height: 6px;

  border-radius: 999px;

  opacity: 0.9;
}

.detail-identity .identity-swatch:first-child {
  width: 34px;
}

.detail-collection {
  margin-left: auto;

  color:
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 75%,
      #ffffff
    );

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 0.14em;

  text-transform: uppercase;
}

.gold-rule {
  display: flex;

  align-items: center;

  gap: 10px;

  margin: 20px 0;
}

.gold-rule span {
  width: 38px;
  height: 1px;

  background:
    color-mix(
      in srgb,
      var(--card-accent, #b9975b) 45%,
      transparent
    );
}

.gold-rule i {
  color: var(--card-accent, #b9975b);

  font-family: var(--font-symbol, var(--font-heading));

  font-size: 13px;

  font-style: normal;

  line-height: 1;
}

.description {
  margin: 0;

  color:
    rgba(255,255,255,0.58);

  font-size: 13px;

  line-height: 1.8;
}

/* =========================================================
   INFORMATION
========================================================= */

.detail-information {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0,1fr));

  gap: 8px;

  margin-top: 24px;
}

.information-item {
  min-width: 0;

  display: flex;

  gap: 9px;

  padding: 11px;

  border:
    1px solid
    rgba(255,255,255,0.06);

  border-radius: 10px;

  background:
    rgba(255,255,255,0.025);
}

.information-icon {
  flex: 0 0 auto;

  color: var(--card-accent, #b9975b);

  font-size: 15px;
}

.information-item > div {
  min-width: 0;
}

.meta-label {
  display: block;

  margin-bottom: 4px;

  color:
    rgba(255,255,255,0.3);

  font-size: 10px;

  text-transform: uppercase;

  letter-spacing: 0.09em;
}

.information-item strong {
  display: block;

  overflow: hidden;

  color:
    rgba(255,255,255,0.8);

  font-size: 10px;

  font-weight: 500;

  line-height: 1.4;

  text-overflow: ellipsis;

  white-space: nowrap;
}

/* =========================================================
   FEATURES
========================================================= */

.features-section {
  margin-top: 27px;
}

.section-heading {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 12px;

  color:
    rgba(255,255,255,0.78);

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.09em;

  text-transform: uppercase;
}

.section-heading i {
  flex: 1;

  height: 1px;

  background:
    rgba(255,255,255,0.07);
}

.features-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 9px 20px;
}

.feature-item {
  display: flex;

  align-items: center;

  gap: 8px;
}

.feature-item > span {
  width: 15px;

  color: var(--card-accent, #b9975b);

  font-size: 10px;

  text-align: center;
}

.feature-item p {
  margin: 0;

  color:
    rgba(255,255,255,0.53);

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.demo-section {
  display: flex;

  align-items: center;

  gap: 15px;

  margin-top: 27px;

  padding-top: 21px;

  border-top:
    1px solid
    rgba(255,255,255,0.07);
}

.qr-box {
  width: 86px;
  height: 86px;

  flex: 0 0 auto;

  display: grid;
  place-items: center;

  padding: 6px;

  border-radius: 9px;

  background: #fff;

  box-shadow:
    0 10px 25px
      rgba(0,0,0,0.18);
}

.qr-box img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.qr-content strong {
  display: block;

  margin-bottom: 4px;

  color:
    rgba(255,255,255,0.82);

  font-size: 11px;
}

.qr-content p {
  max-width: 230px;

  margin: 0;

  color:
    rgba(255,255,255,0.4);

  font-size: 11px;

  line-height: 1.55;
}

.qr-content span {
  display: block;

  margin-top: 5px;

  color:
    rgba(255,255,255,0.25);

  font-size: 10px;
}

/* =========================================================
   ACTIONS
========================================================= */

.detail-actions {
  display: grid;

  grid-template-columns:
    1.2fr 1fr;

  gap: 9px;

  margin-top: 20px;
}

.detail-actions button {
  min-height: 44px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  border-radius: 10px;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.detail-actions button:hover {
  transform:
    translateY(-2px);
}

.primary-btn {
  border: none;

  background:
    linear-gradient(
      135deg,
      var(--card-seal, #a63a2e),
      color-mix(
        in srgb,
        var(--card-seal, #7c2a20) 70%,
        #1a1210
      )
    );

  color: #fff;

  box-shadow:
    0 8px 25px
      color-mix(
        in srgb,
        var(--card-seal, #7c2a20) 30%,
        transparent
      );
}

.primary-btn span {
  font-size: 18px;

  font-weight: 400;
}

.secondary-btn {
  border:
    1px solid
    rgba(255,255,255,0.35);

  background:
    transparent;

  color:
    rgba(255,255,255,0.78);
}

.secondary-btn svg {
  width: 15px;
  height: 15px;
}

.share-btn {
  width: 100%;

  min-height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 9px;

  border: none;

  border-radius: 9px;

  background:
    rgba(255,255,255,0.035);

  color:
    rgba(255,255,255,0.4);

  font-size: 10px;

  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease;
}

.share-btn:hover {
  background:
    rgba(255,255,255,0.07);

  color:
    rgba(255,255,255,0.75);
}

.share-btn svg {
  width: 14px;
  height: 14px;
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

/* modal */
.detail-modal-enter-active,
.detail-modal-leave-active {
  transition:
    opacity 0.35s ease;
}

.detail-modal-enter-active
.detail-panel,
.detail-modal-leave-active
.detail-panel {
  transition:
    transform 0.4s
      cubic-bezier(.2,.8,.2,1),
    opacity 0.35s ease;
}

.detail-modal-enter-from,
.detail-modal-leave-to {
  opacity: 0;
}

.detail-modal-enter-from
.detail-panel {
  transform:
    translateY(25px)
    scale(0.97);
  opacity: 0;
}

.detail-modal-leave-to
.detail-panel {
  transform:
    translateY(15px)
    scale(0.985);
  opacity: 0;
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

  .detail-panel {
    grid-template-columns:
      1fr 1fr;
  }

  .detail-information {
    grid-template-columns:
      1fr;
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

  .detail-modal {
    padding: 18px;
  }

  .detail-panel {
    max-height:
      calc(100vh - 36px);

    grid-template-columns:
      1fr;
  }

  .detail-preview {
    min-height: 370px;

    height: 43vh;
  }

  .detail-scroll {
    padding:
      28px 28px 26px;
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
        38px,
        12vw,
        54px
      );

    line-height: 0.98;
  }

  .page-hero p {
    margin-top: 18px;

    padding: 0 7px;

    font-size: 13px;

    line-height: 1.75;
  }

  .hero-stats {
    width: 100%;

    justify-content: center;

    padding: 11px 5px;

    margin-top: 25px;
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

  .toolbar-left {
    display: none;
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
    font-size: 20px;
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
    margin-top: 22px;

    font-size: 11.5px;
  }

  .card-footer {
    margin-top: 10px;
  }

  .view-detail {
    font-size: 11px;
  }

  .use-template-btn {
    padding:
      7px 8px;

    font-size: 10px;
  }

  /* ===============================
     MODAL MOBILE
  =============================== */

  .detail-modal {
    padding: 0;

    align-items: flex-end;
  }

  .detail-panel {
    width: 100%;

    max-height: 100dvh;

    height: 100dvh;

    border-radius:
      22px 22px 0 0;

    grid-template-rows:
      43dvh
      57dvh;

    grid-template-columns: 1fr;
  }

  .detail-preview {
    min-height: 0;

    height: auto;
  }

  .preview-header {
    top: 13px;
    left: 16px;
    right: 62px;
  }

  .preview-stage {
    inset:
      35px 15px 30px;
  }

  .preview-phone {
    width: min(
      220px,
      56vw
    );

    height: 88%;

    border-width: 5px;

    border-radius: 24px;
  }

  .phone-top {
    width: 62px;
    height: 13px;
  }

  .phone-top span {
    top: 4px;

    width: 20px;
    height: 3px;
  }

  .phone-bottom {
    bottom: 3px;

    width: 55px;
    height: 3px;
  }

  .preview-footer {
    bottom: 10px;

    font-size: 11px;
  }

  .preview-decoration {
    font-size: 17px;
  }

  .detail-scroll {
    padding:
      25px 18px 28px;
  }

  .detail-content h2 {
    font-size: 34px;
  }

  .detail-date {
    font-size: 11px;
  }

  .detail-identity {
    margin-top: 10px;
  }

  .detail-identity .identity-swatch {
    width: 16px;
    height: 5px;
  }

  .detail-identity .identity-swatch:first-child {
    width: 26px;
  }

  .detail-collection {
    font-size: 9px;
  }

  .description {
    font-size: 11px;

    line-height: 1.7;
  }

  .detail-information {
    grid-template-columns:
      repeat(3, minmax(0,1fr));

    gap: 6px;

    margin-top: 17px;
  }

  .information-item {
    padding: 8px;

    display: block;
  }

  .information-icon {
    display: none;
  }

  .meta-label {
    font-size: 11px;
  }

  .information-item strong {
    font-size: 10px;
  }

  .features-section {
    margin-top: 19px;
  }

  .features-grid {
    gap:
      7px 10px;
  }

  .feature-item {
    gap: 5px;
  }

  .feature-item > span {
    width: 11px;

    font-size: 10px;
  }

  .feature-item p {
    font-size: 10px;
  }

  .demo-section {
    margin-top: 18px;

    padding-top: 15px;
  }

  .qr-box {
    width: 65px;
    height: 65px;
  }

  .qr-content strong {
    font-size: 11px;
  }

  .qr-content p {
    font-size: 11px;
  }

  .qr-content span {
    font-size: 11px;
  }

  .detail-actions {
    margin-top: 15px;
  }

  .detail-actions button {
    min-height: 42px;

    font-size: 11px;
  }

  .share-btn {
    min-height: 34px;

    font-size: 10px;
  }

  .close-btn {
    top: 10px;
    right: 10px;

    width: 34px;
    height: 34px;
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
    font-size: 17px;
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

  .card-footer {
    display: block;
  }

  .use-template-btn {
    width: 100%;

    margin-top: 8px;
  }

  .detail-panel {
    grid-template-rows:
      39dvh
      61dvh;
  }

  .preview-phone {
    width: 190px;
  }

  .detail-content h2 {
    font-size: 30px;
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