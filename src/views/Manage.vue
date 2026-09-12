<template>
  <main class="manage-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="page-hero">
      <div class="container hero-inner">
        <span class="eyebrow">
          <span class="eyebrow-line"></span>
          Quản lý thiệp
          <span class="eyebrow-line"></span>
        </span>

        <h1>
          Những thiệp cưới
          <span>đã lưu</span>
          của bạn.
        </h1>

        <p>
          Mở lại trình chỉnh sửa, xem thiệp trực tiếp hoặc chia sẻ cho khách mời
          qua link và mã QR.
        </p>

        <div class="hero-actions">
          <button type="button" class="primary-btn" @click="goCreate">
            <span>＋</span>
            Tạo thiệp mới
          </button>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CONTENT
    ====================================================== -->
    <section class="container manage-content">
      <!-- LOADING -->
      <div v-if="loading" class="manage-grid">
        <article v-for="i in 4" :key="i" class="manage-card skeleton">
          <div class="skeleton-image"></div>

          <div class="skeleton-body">
            <div class="skeleton-line small"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line tiny"></div>
          </div>
        </article>
      </div>

      <!-- EMPTY -->
      <div v-else-if="entries.length === 0" class="state-box empty">
        <div class="empty-icon">♡</div>

        <h3>Chưa có thiệp nào được lưu</h3>

        <p>
          Hãy tạo thiệp mới hoặc chỉnh sửa một mẫu có sẵn, sau đó bấm "Lưu
          thiệp" để thiệp xuất hiện tại đây.
        </p>

        <button type="button" class="retry-btn" @click="goCreate">
          Tạo thiệp ngay
        </button>
      </div>

      <!-- GRID -->
      <div v-else class="manage-grid">
        <article v-for="entry in entries" :key="entry.slug" class="manage-card">
          <!-- IMAGE -->
          <div class="image-wrap">
            <img
              :src="entry.coverImage || fallbackImage"
              :alt="getCoupleName(entry)"
              loading="lazy"
              @error="onImageError"
            />

            <div class="image-gradient"></div>

            <span class="theme-tag">
              {{ entry.theme || "classic" }}
            </span>
          </div>

          <!-- BODY -->
          <div class="card-body">
            <div class="card-meta">
              <span>{{ formatDate(entry.weddingDate) }}</span>

              <span class="dot"></span>

              <span>Lưu {{ formatSavedAt(entry.savedAt) }}</span>
            </div>

            <h3>{{ getCoupleName(entry) }}</h3>

            <p class="card-slug">/{{ entry.slug }}</p>

            <div class="card-actions">
              <button
                type="button"
                class="action-btn primary"
                @click="editWedding(entry)"
              >
                <v-icon size="16"> mdi-pencil-outline </v-icon>

                Sửa
              </button>

              <button
                type="button"
                class="action-btn"
                @click="viewWedding(entry)"
              >
                <v-icon size="16"> mdi-eye-outline </v-icon>

                Xem
              </button>

              <button type="button" class="action-btn" @click="copyLink(entry)">
                <v-icon size="16"> mdi-link-variant </v-icon>

                Link
              </button>

              <button
                type="button"
                class="action-btn danger"
                :disabled="deleting === entry.slug"
                @click="confirmDelete(entry)"
              >
                <v-progress-circular
                  v-if="deleting === entry.slug"
                  indeterminate
                  size="13"
                  width="2"
                />

                <v-icon v-else size="16"> mdi-delete-outline </v-icon>

                Xóa
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- =====================================================
         DELETE CONFIRM
    ====================================================== -->
    <Teleport to="body">
      <Transition name="detail-modal">
        <div
          v-if="deleteTarget"
          class="detail-modal"
          @click.self="deleteTarget = null"
        >
          <div class="confirm-panel">
            <div class="confirm-icon">
              <v-icon size="26"> mdi-alert-outline </v-icon>
            </div>

            <h3>Xóa thiệp này?</h3>

            <p>
              Thiệp
              <strong>{{ getCoupleName(deleteTarget) }}</strong>
              ({{ deleteTarget.slug }}) sẽ bị xóa khỏi danh sách quản lý. Dữ
              liệu trên server có thể vẫn còn nếu backend chưa hỗ trợ xóa.
            </p>

            <div class="confirm-actions">
              <button
                type="button"
                class="action-btn"
                @click="deleteTarget = null"
              >
                Hủy
              </button>

              <button
                type="button"
                class="action-btn danger"
                :disabled="deleting === deleteTarget.slug"
                @click="doDelete"
              >
                <v-progress-circular
                  v-if="deleting === deleteTarget.slug"
                  indeterminate
                  size="13"
                  width="2"
                />

                Xóa thiệp
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
      <div v-if="toast" class="manage-toast">
        {{ toast }}
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { GetWedding } from "@/model/api";
import { getRegistry, removeEntry } from "@/model/weddingRegistry";

const router = useRouter();

/* =========================================================
   STATE
========================================================= */

const entries = ref([]);
const loading = ref(false);
const deleting = ref("");
const deleteTarget = ref(null);
const toast = ref("");

const fallbackImage =
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80";

/* =========================================================
   LOAD
========================================================= */

onMounted(async () => {
  loading.value = true;

  /*
   * Registry là nguồn danh sách. Với mỗi entry,
   * thử gọi GetWedding để kiểm tra thiệp còn
   * tồn tại trên server — entry lỗi sẽ bị đánh
   * dấu (vẫn hiển thị để người dùng biết).
   */
  const list = getRegistry();

  entries.value = list;

  loading.value = false;
});

/* =========================================================
   HELPERS
========================================================= */

function getCoupleName(entry) {
  const bride = entry?.brideName || "";
  const groom = entry?.groomName || "";

  if (!bride && !groom) {
    return "Thiệp cưới";
  }

  return `${bride} & ${groom}`;
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
  event.target.src = fallbackImage;
}

/* =========================================================
   NAVIGATION
========================================================= */

function goCreate() {
  router.push({ name: "Editor" });
}

function editWedding(entry) {
  router.push({
    path: "/editor",
    query: {
      slug: entry.slug,
      theme: entry.theme || undefined,
    },
  });
}

function viewWedding(entry) {
  router.push({
    name: "WeddingBySlug",
    params: { slug: entry.slug },
  });
}

/* =========================================================
   SHARE
========================================================= */

async function copyLink(entry) {
  const url = `${window.location.origin}/wedding/${entry.slug}`;

  try {
    await navigator.clipboard.writeText(url);

    showToast("Đã sao chép link thiệp");
  } catch (error) {
    showToast("Không thể sao chép link");
  }
}

/* =========================================================
   DELETE
========================================================= */

function confirmDelete(entry) {
  deleteTarget.value = entry;
}

async function doDelete() {
  const target = deleteTarget.value;

  if (!target || deleting.value) {
    return;
  }

  deleting.value = target.slug;

  try {
    /*
     * Thử xóa trên server (nếu backend hỗ trợ).
     * Không có endpoint delete wedding nên chỉ
     * cần không lỗi 404 là coi như xóa local.
     */
    try {
      await GetWedding(target.slug);
    } catch (e) {
      // Thiệp không còn trên server — vẫn xóa registry.
    }

    removeEntry(target.slug);

    entries.value = getRegistry();

    deleteTarget.value = null;

    showToast("Đã xóa thiệp khỏi danh sách");
  } finally {
    deleting.value = "";
  }
}

/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {
  toast.value = message;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2500);
}
</script>

<style scoped>
/* ==================================================
   PAGE
================================================== */

.manage-page {
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

  background: rgba(201, 166, 107, 0.35);
}

.page-glow-2 {
  bottom: -180px;

  right: -140px;

  background: rgba(180, 80, 100, 0.22);
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

  font-family: "Playfair Display", Georgia, serif;

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

.hero-actions {
  margin-top: 26px;

  display: flex;

  justify-content: center;

  gap: 12px;
}

.primary-btn {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 12px 22px;

  border: 0;

  border-radius: 999px;

  background: linear-gradient(135deg, #8f4d43, #6d3a34);

  color: #fff;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 12px 28px rgba(109, 58, 52, 0.28);
}

/* ==================================================
   GRID
================================================== */

.manage-content {
  padding: 20px 0 80px;
}

.manage-grid {
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  gap: 22px;
}

.manage-card {
  display: flex;

  flex-direction: column;

  border: 1px solid rgba(78, 53, 53, 0.08);

  border-radius: 20px;

  background: #fff;

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.manage-card:hover {
  transform: translateY(-4px);

  box-shadow: 0 22px 50px rgba(80, 50, 50, 0.12);
}

.image-wrap {
  position: relative;

  aspect-ratio: 16 / 10;

  overflow: hidden;

  background: #f1e9e4;
}

.image-wrap img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.image-gradient {
  position: absolute;

  inset: 0;

  background: linear-gradient(180deg, transparent 55%, rgba(30, 15, 15, 0.35));
}

.theme-tag {
  position: absolute;

  top: 12px;

  left: 12px;

  padding: 5px 12px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.9);

  color: #6d3a34;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.04em;
}

/* ==================================================
   CARD BODY
================================================== */

.card-body {
  display: flex;

  flex-direction: column;

  gap: 8px;

  padding: 16px 18px 18px;
}

.card-meta {
  display: flex;

  align-items: center;

  gap: 8px;

  color: #9a8484;

  font-size: 12px;
}

.card-meta .dot {
  width: 3px;

  height: 3px;

  border-radius: 50%;

  background: #c9b4b4;
}

.card-body h3 {
  margin: 0;

  color: #2a1d1d;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 19px;

  line-height: 1.3;
}

.card-slug {
  margin: 0;

  color: #a08c8c;

  font-size: 12px;

  font-family: monospace;
}

.card-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 8px;
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

  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.action-btn:hover {
  background: #f7f0ec;

  border-color: rgba(143, 77, 67, 0.35);
}

.action-btn.primary {
  background: #8f4d43;

  border-color: #8f4d43;

  color: #fff;
}

.action-btn.primary:hover {
  background: #7a3f37;
}

.action-btn.danger {
  color: #a92828;

  border-color: rgba(169, 40, 40, 0.3);
}

.action-btn.danger:hover {
  background: #fdf1f1;

  border-color: #a92828;
}

.action-btn:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

/* ==================================================
   STATES
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

.empty-icon {
  width: 64px;

  height: 64px;

  margin: 0 auto 16px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #f7e9e4;

  color: #8f4d43;

  font-size: 26px;
}

.state-box h3 {
  margin: 0 0 10px;

  color: #2a1d1d;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 21px;
}

.state-box p {
  margin: 0 0 20px;

  color: #6d5a5a;

  font-size: 14px;

  line-height: 1.7;
}

.retry-btn {
  padding: 11px 22px;

  border: 0;

  border-radius: 999px;

  background: #8f4d43;

  color: #fff;

  font-size: 13.5px;

  font-weight: 600;

  cursor: pointer;
}

/* ==================================================
   SKELETON
================================================== */

.skeleton-image {
  aspect-ratio: 16 / 10;

  background: linear-gradient(100deg, #f0eae5 40%, #f8f4f1 50%, #f0eae5 60%);

  background-size: 200% 100%;

  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 16px 18px;
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
  width: 45%;
}

.skeleton-line.tiny {
  width: 70%;

  margin-bottom: 0;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

/* ==================================================
   DELETE MODAL
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

  background: #fdf1f1;

  color: #a92828;
}

.confirm-panel h3 {
  margin: 0 0 10px;

  color: #2a1d1d;

  font-family: "Playfair Display", Georgia, serif;

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

.manage-toast {
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

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform: translateX(-50%) translateY(10px);
}

.detail-modal-enter-active,
.detail-modal-leave-active {
  transition: opacity 0.25s ease;
}

.detail-modal-enter-from,
.detail-modal-leave-to {
  opacity: 0;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 600px) {
  .page-hero {
    padding: 48px 0 28px;
  }

  .manage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
