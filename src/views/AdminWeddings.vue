<template>
  <main class="admin-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="page-hero">
      <div class="container hero-inner">
        <span class="eyebrow">
          <span class="eyebrow-line"></span>
          Quản trị hệ thống
          <span class="eyebrow-line"></span>
        </span>

        <h1>
          Quản lý
          <span>thiệp</span>
        </h1>

        <p>
          Duyệt thiệp người dùng tạo — kích hoạt sau khi thanh toán
          đúng quy định, hoặc khóa thiệp vi phạm.
        </p>

        <div class="hero-stats">
          <div class="hero-stat">
            <strong>{{ weddings.length }}</strong>
            <span>Tổng thiệp</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ countByStatus(STATUS.ACTIVE) }}</strong>
            <span>Đã kích hoạt</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ countByStatus(STATUS.PENDING) }}</strong>
            <span>Chờ duyệt</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ countByStatus(STATUS.LOCKED) }}</strong>
            <span>Đã khóa</span>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CONTENT
    ====================================================== -->
    <section class="container admin-content">
      <!-- TOOLBAR -->
      <div class="toolbar">
        <div class="toolbar-left">
          <div class="result-count">
            <span>Tổng cộng</span>
            <strong>{{ filteredWeddings.length }}</strong>
            <span>thiệp</span>
          </div>
        </div>

        <div class="toolbar-right">
          <div class="filter-control">
            <span class="control-icon">◈</span>

            <select v-model="statusFilter">
              <option value="">Tất cả trạng thái</option>

              <option :value="STATUS.ACTIVE">Đã kích hoạt</option>

              <option :value="STATUS.PENDING">Chờ duyệt</option>

              <option :value="STATUS.LOCKED">Đã khóa</option>
            </select>

            <span class="select-arrow">⌄</span>
          </div>

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
              placeholder="Tìm tên cặp đôi / slug / email"
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

      <!-- LOADING -->
      <div v-if="loading" class="wedding-list">
        <article
          v-for="i in 4"
          :key="i"
          class="wedding-card skeleton"
        >
          <div class="skeleton-thumb"></div>

          <div class="skeleton-body">
            <div class="skeleton-line small"></div>

            <div class="skeleton-line tiny"></div>
          </div>

          <div class="skeleton-status"></div>
        </article>
      </div>

      <!-- ERROR -->
      <div v-else-if="loadError" class="state-box">
        <div class="state-icon">
          <v-icon size="26"> mdi-alert-circle-outline </v-icon>
        </div>

        <h3>Không tải được danh sách</h3>

        <p>{{ loadError }}</p>

        <button type="button" class="retry-btn" @click="retryLoad">
          Thử lại
        </button>
      </div>

      <!-- EMPTY -->
      <div
        v-else-if="filteredWeddings.length === 0"
        class="state-box"
      >
        <div class="state-icon">
          <v-icon size="26"> mdi-card-search-outline </v-icon>
        </div>

        <h3>Không có thiệp nào</h3>

        <p>
          Chưa có thiệp nào trong hệ thống. Thử đổi bộ lọc trạng
          thái hoặc từ khóa tìm kiếm.
        </p>
      </div>

      <!-- LIST -->
      <div v-else class="wedding-list">
        <article
          v-for="item in filteredWeddings"
          :key="item.slug || item.Slug"
          class="wedding-card"
          :class="{ locked: currentStatus(item) === STATUS.LOCKED }"
        >
          <!-- COVER -->
          <div class="thumb-wrap">
            <img
              v-if="item.coverImage || item.CoverImage"
              :src="item.coverImage || item.CoverImage"
              :alt="getCoupleName(item)"
              loading="lazy"
              @error="onImageError"
            />

            <span v-else class="thumb-fallback">
              <v-icon size="22"> mdi-image-outline </v-icon>
            </span>
          </div>

          <!-- INFO -->
          <div class="wedding-info">
            <div class="wedding-name-row">
              <h3>{{ getCoupleName(item) }}</h3>

              <span
                class="status-badge"
                :class="statusClass(currentStatus(item))"
              >
                {{ statusLabel(currentStatus(item)) }}
              </span>
            </div>

            <p class="wedding-slug">/{{ item.slug || item.Slug }}</p>

            <p class="wedding-meta">
              <span v-if="item.themeName || item.ThemeName">
                <v-icon size="13"> mdi-palette-outline </v-icon>
                {{ item.themeName || item.ThemeName }}
              </span>

              <span v-if="item.weddingDate || item.WeddingDate">
                <v-icon size="13"> mdi-calendar-heart </v-icon>
                {{ formatDate(item.weddingDate || item.WeddingDate) }}
              </span>

              <span v-if="item.createdAt || item.CreatedAt">
                <v-icon size="13"> mdi-clock-outline </v-icon>
                Tạo {{ formatSavedAt(item.createdAt || item.CreatedAt) }}
              </span>

              <span v-if="item.ownerEmail || item.OwnerEmail">
                <v-icon size="13"> mdi-account-outline </v-icon>
                {{ item.ownerEmail || item.OwnerEmail }}
              </span>
            </p>
          </div>

          <!-- STATUS + ACTIONS -->
          <div class="wedding-actions">
            <div class="status-select">
              <span class="control-icon">◈</span>

              <select
                :value="currentStatus(item) || STATUS.PENDING"
                :disabled="updatingSlug === (item.slug || item.Slug)"
                @change="confirmStatus(item, $event.target.value)"
              >
                <option :value="STATUS.PENDING">Chờ duyệt</option>

                <option :value="STATUS.ACTIVE">Kích hoạt</option>

                <option :value="STATUS.LOCKED">Khóa thiệp</option>
              </select>

              <span class="select-arrow">⌄</span>
            </div>

            <button
              type="button"
              class="action-btn"
              @click="viewWedding(item)"
            >
              <v-icon size="16"> mdi-eye-outline </v-icon>

              Xem
            </button>
          </div>
        </article>
      </div>

      <!-- NOTE -->
      <p class="storage-note">
        <v-icon size="14"> mdi-information-outline </v-icon>
        Trạng thái thiệp được lưu trên server — thiệp "Chờ duyệt" hoặc
        "Đã khóa" sẽ không hiển thị với khách mời cho đến khi được kích hoạt.
      </p>
    </section>

    <!-- =====================================================
         STATUS CONFIRM
    ====================================================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="statusTarget"
          class="detail-modal"
          @click.self="statusTarget = null"
        >
          <div class="confirm-panel">
            <div
              class="confirm-icon"
              :class="{ danger: statusTarget.status === STATUS.LOCKED }"
            >
              <v-icon size="26">
                {{
                  statusTarget.status === STATUS.ACTIVE
                    ? "mdi-check-decagram-outline"
                    : "mdi-lock-outline"
                }}
              </v-icon>
            </div>

            <h3>{{ confirmTitle }}</h3>

            <p>{{ confirmMessage }}</p>

            <div class="confirm-actions">
              <button
                type="button"
                class="action-btn"
                @click="statusTarget = null"
              >
                Hủy
              </button>

              <button
                type="button"
                class="action-btn primary"
                :disabled="updatingSlug === (statusTarget.slug || statusTarget.Slug)"
                @click="doChangeStatus"
              >
                <v-progress-circular
                  v-if="updatingSlug === (statusTarget.slug || statusTarget.Slug)"
                  indeterminate
                  size="13"
                  width="2"
                />

                Xác nhận
              </button>
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
        class="admin-toast"
        :class="{ error: toastError }"
      >
        {{ toast }}
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { useRouter } from "vue-router";

import {
  getAllWeddings,
  updateWeddingStatus,
} from "@/model/api";

import { WEDDING_STATUS as STATUS } from "@/model/weddingAdmin";

defineOptions({
  name: "AdminWeddings",
});

const router = useRouter();

/* =========================================================
   STATE
========================================================= */

const weddings = ref([]);

const loading = ref(false);

const loadError = ref("");

const updatingSlug = ref("");

const statusTarget = ref(null);

const statusFilter = ref("");

const q = ref("");

const toast = ref("");

const toastError = ref(false);

/* =========================================================
   LOAD — danh sách thiệp từ API (chỉ Admin)
========================================================= */

async function loadWeddings() {
  loading.value = true;

  loadError.value = "";

  try {
    const response = await getAllWeddings();

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      weddings.value = result.data;
    } else {
      loadError.value =
        result?.message || "Không thể tải danh sách thiệp.";
    }
  } catch (error) {
    console.error("[AdminWeddings] getAllWeddings error:", error);

    loadError.value =
      error?.response?.data?.message ||
      "Không thể tải danh sách thiệp. Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadWeddings();
});

/* =========================================================
   HELPERS
========================================================= */

function countByStatus(status) {
  return weddings.value.filter(
    (w) => (currentStatus(w) || STATUS.PENDING) === status
  ).length;
}

function currentStatus(item) {
  return item.status || item.Status || STATUS.PENDING;
}

function statusLabel(status) {
  if (status === STATUS.ACTIVE) return "Đã kích hoạt";

  if (status === STATUS.LOCKED) return "Đã khóa";

  if (status === STATUS.PENDING) return "Chờ duyệt";

  return "Chưa duyệt";
}

function statusClass(status) {
  if (status === STATUS.ACTIVE) return "status-active";

  if (status === STATUS.LOCKED) return "status-locked";

  return "status-pending";
}

function getCoupleName(item) {
  const bride = item?.brideName || item?.BrideName || "";
  const groom = item?.groomName || item?.GroomName || "";

  if (!bride && !groom) {
    return "Thiệp cưới";
  }

  return `${groom} & ${bride}`;
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function formatSavedAt(iso) {
  if (!iso) {
    return "";
  }

  const parsed = new Date(iso);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(parsed);
}

function onImageError(event) {
  event.target.style.display = "none";
}

const filteredWeddings = computed(() => {
  const keyword = q.value.trim().toLowerCase();

  return weddings.value.filter((item) => {
    const status = currentStatus(item) || STATUS.PENDING;

    if (statusFilter.value && status !== statusFilter.value) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const name = getCoupleName(item).toLowerCase();
    const slug = (item.slug || item.Slug || "").toLowerCase();
    const owner = (item.ownerEmail || item.OwnerEmail || "").toLowerCase();

    return (
      name.includes(keyword) ||
      slug.includes(keyword) ||
      owner.includes(keyword)
    );
  });
});

/* =========================================================
   VIEW
========================================================= */

function viewWedding(item) {
  const slug = item.slug || item.Slug;

  window.open(`/${slug}`, "_blank");
}

/* =========================================================
   STATUS CHANGE
========================================================= */

const confirmTitle = computed(() => {
  if (!statusTarget.value) return "";

  if (statusTarget.value.status === STATUS.ACTIVE) {
    return "Kích hoạt thiệp này?";
  }

  if (statusTarget.value.status === STATUS.PENDING) {
    return "Chuyển về chờ duyệt?";
  }

  return "Khóa thiệp này?";
});

const confirmMessage = computed(() => {
  if (!statusTarget.value) return "";

  const name = getCoupleName(statusTarget.value);

  const slug = statusTarget.value.slug || statusTarget.value.Slug;

  if (statusTarget.value.status === STATUS.ACTIVE) {
    return `Thiệp ${name} (/${slug}) sẽ được mở cho khách mời xem sau khi xác nhận thanh toán hợp lệ.`;
  }

  if (statusTarget.value.status === STATUS.PENDING) {
    return `Thiệp ${name} (/${slug}) sẽ chuyển về trạng thái chờ duyệt — khách mời tạm thời không xem được.`;
  }

  return `Thiệp ${name} (/${slug}) sẽ bị khóa — khách mời không xem được nội dung cho đến khi được kích hoạt lại.`;
});

function confirmStatus(item, status) {
  const current = currentStatus(item) || STATUS.PENDING;

  if (current === status) {
    return;
  }

  statusTarget.value = {
    ...item,
    status,
  };
}

/* =========================================================
   RETRY
========================================================= */

function retryLoad() {
  loadWeddings();
}

async function doChangeStatus() {
  const target = statusTarget.value;

  if (!target || updatingSlug.value) {
    return;
  }

  updatingSlug.value = target.slug || target.Slug;

  try {
    /*
     * Gọi API đổi trạng thái (chỉ Admin).
     * Body: { Slug, Status } — server đồng bộ cả
     * cột IsActive (Active = 1, còn lại = 0).
     */
    const response = await updateWeddingStatus({
      Slug: target.slug || target.Slug,
      Status: target.status,
    });

    const result = response?.data;

    if (!result || result.status !== "success") {
      showToast(
        result?.message || "Không thể cập nhật trạng thái thiệp.",
        true
      );

      return;
    }

    /*
     * Cập nhật lại trạng thái trong danh sách
     * (không cần gọi lại API lấy toàn bộ danh sách).
     */
    const item = weddings.value.find(
      (w) => (w.slug || w.Slug) === (target.slug || target.Slug)
    );

    if (item) {
      item.status = target.status;

      item.Status = target.status;

      item.isActive = target.status === STATUS.ACTIVE;

      item.IsActive = target.status === STATUS.ACTIVE;
    }

    statusTarget.value = null;

    showToast(
      result.message ||
        (target.status === STATUS.ACTIVE
          ? `Đã kích hoạt thiệp ${getCoupleName(target)}.`
          : `Đã cập nhật trạng thái thiệp ${getCoupleName(target)}.`)
    );
  } catch (error) {
    console.error("[AdminWeddings] updateWeddingStatus error:", error);

    showToast(
      error?.response?.data?.message ||
        "Không thể cập nhật trạng thái thiệp.",
      true
    );
  } finally {
    updatingSlug.value = "";
  }
}

/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message, isError = false) {
  toast.value = message;

  toastError.value = isError;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.value = "";
    toastError.value = false;
  }, 2800);
}
</script>

<style scoped>
/* ==================================================
   PAGE
================================================== */

.admin-page {
  position: relative;

  min-height: 100vh;

  background: #faf7f2;

  overflow: hidden;
}

.page-glow {
  position: absolute;

  width: 420px;

  height: 420px;

  border-radius: 50%;

  filter: blur(90px);

  opacity: 0.35;

  pointer-events: none;
}

.page-glow-1 {
  top: -160px;

  left: -120px;

  background: rgba(201, 166, 89, 0.3);
}

.page-glow-2 {
  bottom: -180px;

  right: -140px;

  background: rgba(143, 77, 67, 0.18);
}

.container {
  width: min(1200px, calc(100% - 32px));

  margin: 0 auto;
}

/* ==================================================
   HERO
================================================== */

.page-hero {
  position: relative;

  padding: 72px 0 40px;

  text-align: center;
}

.eyebrow {
  display: inline-flex;

  align-items: center;

  gap: 12px;

  color: #8f4d43;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 0.18em;

  text-transform: uppercase;
}

.eyebrow-line {
  width: 36px;

  height: 1px;

  background: rgba(143, 77, 67, 0.4);
}

.page-hero h1 {
  margin: 18px 0 14px;

  color: #2a1d1d;

  font-family: var(--font-heading);

  font-size: clamp(30px, 4.4vw, 46px);

  line-height: 1.2;
}

.page-hero h1 span {
  color: #8f4d43;
}

.page-hero p {
  max-width: 560px;

  margin: 0 auto;

  color: #6d5a5a;

  font-size: 15px;

  line-height: 1.7;
}

.hero-stats {
  margin-top: 26px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 22px;

  flex-wrap: wrap;
}

.hero-stat {
  display: flex;

  flex-direction: column;

  gap: 2px;
}

.hero-stat strong {
  color: #2a1d1d;

  font-family: var(--font-heading);

  font-size: 26px;
}

.hero-stat span {
  color: #9a8484;

  font-size: 12px;
}

.hero-stat-divider {
  width: 1px;

  height: 34px;

  background: rgba(78, 53, 53, 0.14);
}

/* ==================================================
   TOOLBAR
================================================== */

.admin-content {
  padding: 10px 0 80px;
}

.toolbar {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 14px;

  flex-wrap: wrap;

  margin-bottom: 24px;
}

.result-count {
  display: flex;

  align-items: center;

  gap: 6px;

  color: #9a8484;

  font-size: 13.5px;
}

.result-count strong {
  color: #8f4d43;

  font-size: 16px;
}

.toolbar-right {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-wrap: wrap;
}

.filter-control {
  position: relative;

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 0 12px;

  border: 1px solid rgba(78, 53, 53, 0.14);

  border-radius: 999px;

  background: #fff;

  height: 42px;
}

.control-icon {
  color: #c9a26a;

  font-size: 13px;
}

.filter-control select {
  border: 0;

  background: transparent;

  color: #4e3636;

  font-size: 13px;

  font-weight: 600;

  outline: none;

  cursor: pointer;

  appearance: none;

  padding-right: 14px;
}

.select-arrow {
  position: absolute;

  right: 12px;

  color: #9a8484;

  font-size: 12px;

  pointer-events: none;
}

.search-control {
  position: relative;

  display: inline-flex;

  align-items: center;

  height: 42px;

  width: 240px;

  border: 1px solid rgba(78, 53, 53, 0.14);

  border-radius: 999px;

  background: #fff;

  padding: 0 14px;
}

.search-icon {
  display: flex;

  color: #9a8484;

  margin-right: 8px;
}

.search-icon svg {
  width: 16px;

  height: 16px;
}

.search-control input {
  flex: 1;

  border: 0;

  background: transparent;

  color: #2a1d1d;

  font-size: 13.5px;

  outline: none;
}

.clear-search {
  border: 0;

  background: transparent;

  color: #9a8484;

  font-size: 16px;

  cursor: pointer;

  padding: 0 2px;
}

/* ==================================================
   WEDDING LIST
================================================== */

.wedding-list {
  display: flex;

  flex-direction: column;

  gap: 14px;
}

.wedding-card {
  display: flex;

  align-items: center;

  gap: 16px;

  padding: 14px 20px;

  border: 1px solid rgba(78, 53, 53, 0.08);

  border-radius: 18px;

  background: #fff;

  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.wedding-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 16px 40px rgba(80, 50, 50, 0.1);
}

.wedding-card.locked {
  background: #faf6f6;
}

.wedding-card.locked .wedding-info {
  opacity: 0.75;
}

.thumb-wrap {
  width: 76px;

  height: 76px;

  flex-shrink: 0;

  border-radius: 14px;

  overflow: hidden;

  background: #f7e9e4;

  display: flex;

  align-items: center;

  justify-content: center;
}

.thumb-wrap img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.thumb-fallback {
  color: #c9a26a;
}

.wedding-info {
  flex: 1;

  min-width: 0;
}

.wedding-name-row {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-wrap: wrap;
}

.wedding-name-row h3 {
  margin: 0;

  color: #2a1d1d;

  font-family: var(--font-heading);

  font-size: 17px;
}

.status-badge {
  padding: 3px 10px;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.03em;
}

.status-badge.status-active {
  background: rgba(46, 125, 50, 0.12);

  color: #2e7d32;
}

.status-badge.status-pending {
  background: rgba(233, 161, 59, 0.16);

  color: #a06a1a;
}

.status-badge.status-locked {
  background: rgba(169, 40, 40, 0.12);

  color: #a92828;
}

.wedding-slug {
  margin: 3px 0 0;

  color: #8f4d43;

  font-size: 13px;

  font-weight: 600;
}

.wedding-meta {
  display: flex;

  gap: 16px;

  flex-wrap: wrap;

  margin: 6px 0 0;

  color: #9a8484;

  font-size: 12px;
}

.wedding-meta span {
  display: inline-flex;

  align-items: center;

  gap: 4px;
}

/* ==================================================
   ACTIONS
================================================== */

.wedding-actions {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-shrink: 0;
}

.status-select {
  position: relative;

  display: inline-flex;

  align-items: center;

  gap: 8px;

  height: 38px;

  padding: 0 12px;

  border: 1px solid rgba(78, 53, 53, 0.14);

  border-radius: 999px;

  background: #fff;
}

.status-select select {
  border: 0;

  background: transparent;

  color: #4e3636;

  font-size: 12.5px;

  font-weight: 600;

  outline: none;

  cursor: pointer;

  appearance: none;

  padding-right: 14px;
}

.status-select select:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}

.action-btn {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 8px 13px;

  border: 1px solid rgba(78, 53, 53, 0.14);

  border-radius: 999px;

  background: #fff;

  color: #5c4646;

  font-size: 12.5px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  border-color: #8f4d43;

  color: #8f4d43;
}

.action-btn.primary {
  border-color: #8f4d43;

  background: #8f4d43;

  color: #fff;
}

.action-btn.primary:hover:not(:disabled) {
  background: #7a3f36;

  color: #fff;
}

.action-btn:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

/* ==================================================
   NOTE
================================================== */

.storage-note {
  display: flex;

  align-items: center;

  gap: 6px;

  margin: 22px 0 0;

  color: #9a8484;

  font-size: 12.5px;
}

/* ==================================================
   STATE BOX
================================================== */

.state-box {
  max-width: 460px;

  margin: 40px auto;

  padding: 44px 30px;

  border: 1px dashed rgba(143, 77, 67, 0.3);

  border-radius: 22px;

  background: rgba(255, 255, 255, 0.7);

  text-align: center;
}

.state-icon {
  width: 58px;

  height: 58px;

  margin: 0 auto 14px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #f7e9e4;

  color: #8f4d43;
}

.state-box h3 {
  margin: 0 0 10px;

  color: #2a1d1d;

  font-family: var(--font-heading);

  font-size: 20px;
}

.state-box p {
  margin: 0 0 20px;

  color: #6d5a5a;

  font-size: 13.5px;

  line-height: 1.7;
}

.retry-btn {
  padding: 10px 22px;

  border: 0;

  border-radius: 999px;

  background: #8f4d43;

  color: #fff;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #7a3f36;
}

/* ==================================================
   SKELETON
================================================== */

.skeleton-thumb {
  width: 76px;

  height: 76px;

  border-radius: 14px;

  background: linear-gradient(100deg, #f0eae5 40%, #f8f4f1 50%, #f0eae5 60%);

  background-size: 200% 100%;

  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  flex: 1;
}

.skeleton-line {
  height: 13px;

  border-radius: 6px;

  margin-bottom: 10px;

  background: linear-gradient(100deg, #f0eae5 40%, #f8f4f1 50%, #f0eae5 60%);

  background-size: 200% 100%;

  animation: shimmer 1.4s infinite;
}

.skeleton-line.small {
  width: 40%;
}

.skeleton-line.tiny {
  width: 60%;

  margin-bottom: 0;
}

.skeleton-status {
  width: 130px;

  height: 38px;

  border-radius: 999px;

  background: linear-gradient(100deg, #f0eae5 40%, #f8f4f1 50%, #f0eae5 60%);

  background-size: 200% 100%;

  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

/* ==================================================
   MODAL
================================================== */

.detail-modal {
  position: fixed;

  inset: 0;

  z-index: 2000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 24px;

  background: rgba(30, 15, 15, 0.45);

  backdrop-filter: blur(6px);
}

.confirm-panel {
  width: min(420px, 100%);

  padding: 30px 26px;

  border-radius: 22px;

  background: #fff;

  text-align: center;

  box-shadow: 0 30px 80px rgba(30, 15, 15, 0.3);
}

.confirm-icon {
  width: 58px;

  height: 58px;

  margin: 0 auto 14px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: rgba(46, 125, 50, 0.1);

  color: #2e7d32;
}

.confirm-icon.danger {
  background: #fdf1f1;

  color: #a92828;
}

.confirm-panel h3 {
  margin: 0 0 10px;

  color: #2a1d1d;

  font-family: var(--font-heading);

  font-size: 20px;
}

.confirm-panel p {
  margin: 0 0 22px;

  color: #6d5a5a;

  font-size: 13.5px;

  line-height: 1.7;
}

.confirm-actions {
  display: flex;

  justify-content: center;

  gap: 10px;
}

/* ==================================================
   TOAST
================================================== */

.admin-toast {
  position: fixed;

  left: 50%;

  bottom: 28px;

  z-index: 3000;

  padding: 11px 18px;

  border-radius: 999px;

  background: #2a1d1d;

  color: #fff;

  font-size: 13px;

  font-weight: 600;

  box-shadow: 0 15px 40px rgba(30, 15, 15, 0.3);

  transform: translateX(-50%);
}

.admin-toast.error {
  background: #a92828;
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

  transform: translateX(-50%) translateY(10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 720px) {
  .page-hero {
    padding: 48px 0 28px;
  }

  .wedding-card {
    flex-wrap: wrap;
  }

  .wedding-actions {
    width: 100%;

    justify-content: flex-end;
  }

  .search-control {
    width: 100%;
  }
}
</style>
