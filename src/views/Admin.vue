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
          Phân quyền
          <span>tài khoản</span>
        </h1>

        <p>
          Quản lý người dùng hệ thống — gán quyền Admin, User hoặc Guest.
        </p>

        <div class="hero-stats">
          <div class="hero-stat">
            <strong>{{ accounts.length }}</strong>
            <span>Tài khoản</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ countByRole("Admin") }}</strong>
            <span>Admin</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ countByRole("User") }}</strong>
            <span>User</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ countByRole("Guest") }}</strong>
            <span>Guest</span>
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
            <strong>{{ filteredAccounts.length }}</strong>
            <span>tài khoản</span>
          </div>
        </div>

        <div class="toolbar-right">
          <div class="filter-control">
            <span class="control-icon">◈</span>

            <select v-model="roleFilter">
              <option value="">Tất cả quyền</option>

              <option
                v-for="role in roleOptions"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }}
              </option>
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
              placeholder="Tìm tên / email"
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
      <div v-if="loading" class="account-list">
        <article
          v-for="i in 5"
          :key="i"
          class="account-card skeleton"
        >
          <div class="skeleton-avatar"></div>

          <div class="skeleton-body">
            <div class="skeleton-line small"></div>

            <div class="skeleton-line tiny"></div>
          </div>

          <div class="skeleton-role"></div>
        </article>
      </div>

      <!-- ERROR -->
      <div v-else-if="loadError" class="state-box">
        <div class="state-icon error">
          <v-icon size="26"> mdi-alert-circle-outline </v-icon>
        </div>

        <h3>Không thể tải danh sách tài khoản</h3>

        <p>{{ loadError }}</p>

        <button type="button" class="retry-btn" @click="loadAccounts">
          Thử lại
        </button>
      </div>

      <!-- EMPTY -->
      <div v-else-if="filteredAccounts.length === 0" class="state-box">
        <div class="state-icon">
          <v-icon size="26"> mdi-account-search-outline </v-icon>
        </div>

        <h3>Không tìm thấy tài khoản nào</h3>

        <p>Thử đổi từ khóa tìm kiếm hoặc bộ lọc quyền.</p>
      </div>

      <!-- LIST -->
      <div v-else class="account-list">
        <article
          v-for="account in filteredAccounts"
          :key="account.Id"
          class="account-card"
        >
          <!-- AVATAR -->
          <div class="avatar-wrap">
            <img
              v-if="account.Avatar"
              :src="account.Avatar"
              :alt="getAccountName(account)"
              @error="onAvatarError"
            />

            <span v-else class="avatar-fallback">
              {{ getInitial(account) }}
            </span>
          </div>

          <!-- INFO -->
          <div class="account-info">
            <div class="account-name-row">
              <h3>{{ getAccountName(account) }}</h3>

              <span
                class="role-badge"
                :class="roleClass(account.Role)"
              >
                {{ roleLabel(account.Role) }}
              </span>
            </div>

            <p class="account-email">
              {{ account.Email || account.Username }}
            </p>

            <p class="account-meta">
              <span v-if="account.Username">
                <v-icon size="13"> mdi-account-outline </v-icon>
                {{ account.Username }}
              </span>

              <span v-if="account.Phone">
                <v-icon size="13"> mdi-phone-outline </v-icon>
                {{ account.Phone }}
              </span>

              <span v-if="account.LastLoginAt">
                <v-icon size="13"> mdi-clock-outline </v-icon>
                Đăng nhập {{ formatDate(account.LastLoginAt) }}
              </span>
            </p>
          </div>

          <!-- ROLE SELECT -->
          <div class="account-actions">
            <div class="role-select">
              <span class="control-icon">◈</span>

              <select
                :value="normalizeRole(account.Role)"
                :disabled="updatingId === account.Id || isSelf(account)"
                @change="changeRole(account, $event.target.value)"
              >
                <option
                  v-for="role in roleOptions"
                  :key="role.value"
                  :value="role.value"
                >
                  {{ role.label }}
                </option>
              </select>

              <span class="select-arrow">⌄</span>
            </div>

            <button
              type="button"
              class="action-btn danger"
              :disabled="deletingId === account.Id || isSelf(account)"
              :title="isSelf(account) ? 'Không thể thao tác trên chính mình' : ''"
              @click="confirmDelete(account)"
            >
              <v-progress-circular
                v-if="deletingId === account.Id"
                indeterminate
                size="13"
                width="2"
              />

              <v-icon v-else size="16"> mdi-delete-outline </v-icon>

              Xóa
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- =====================================================
         DELETE CONFIRM
    ====================================================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="deleteTarget"
          class="detail-modal"
          @click.self="deleteTarget = null"
        >
          <div class="confirm-panel">
            <div class="confirm-icon">
              <v-icon size="26"> mdi-alert-outline </v-icon>
            </div>

            <h3>Vô hiệu hóa tài khoản này?</h3>

            <p>
              Tài khoản
              <strong>{{ getAccountName(deleteTarget) }}</strong>
              ({{ deleteTarget.Email || deleteTarget.Username }}) sẽ bị vô
              hiệu hóa — không thể đăng nhập, dữ liệu thiệp liên quan được
              giữ lại.
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
                :disabled="deletingId === deleteTarget.Id"
                @click="doDelete"
              >
                <v-progress-circular
                  v-if="deletingId === deleteTarget.Id"
                  indeterminate
                  size="13"
                  width="2"
                />

                Vô hiệu hóa
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

import { useAuthStore, ROLES, ROLE_LABELS } from "@/stores/auth";
import {
  GetAllAccounts,
  UpdateAccountRole,
  DeleteAccount,
} from "@/model/api";

defineOptions({
  name: "AdminAccounts",
});

const auth = useAuthStore();

/* =========================================================
   STATE
========================================================= */

const accounts = ref([]);
const loading = ref(false);
const loadError = ref("");

const updatingId = ref(0);
const deletingId = ref(0);
const deleteTarget = ref(null);

const roleFilter = ref("");
const q = ref("");

const toast = ref("");
const toastError = ref(false);

const roleOptions = [
  { value: ROLES.ADMIN, label: "Quản trị viên (Admin)" },
  { value: ROLES.USER, label: "Người dùng (User)" },
  { value: ROLES.GUEST, label: "Khách (Guest)" },
];

/* =========================================================
   LOAD
========================================================= */

onMounted(() => {
  loadAccounts();
});

async function loadAccounts() {
  loading.value = true;
  loadError.value = "";

  try {
    const response = await GetAllAccounts();

    const result = response?.data;

    if (!result || result.status !== "success") {
      throw new Error(
        result?.message || "API chưa hỗ trợ lấy danh sách tài khoản."
      );
    }

    accounts.value = Array.isArray(result.data) ? result.data : [];
  } catch (e) {
    console.error("[Admin] loadAccounts error:", e);

    loadError.value =
      e?.response?.data?.message ||
      e?.message ||
      "Không thể tải danh sách tài khoản.";
  } finally {
    loading.value = false;
  }
}

/* =========================================================
   HELPERS
========================================================= */

function countByRole(role) {
  return accounts.value.filter(
    (a) => normalizeRole(a.Role) === role
  ).length;
}

function normalizeRole(value) {
  const role = (value || "").toString().trim();

  const match = Object.values(ROLES).find(
    (r) => r.toLowerCase() === role.toLowerCase()
  );

  return match || ROLES.GUEST;
}

function roleLabel(value) {
  const role = normalizeRole(value);

  return ROLE_LABELS[role] || role;
}

function roleClass(value) {
  return `role-${normalizeRole(value).toLowerCase()}`;
}

function getAccountName(account) {
  if (account.FullName) {
    return account.FullName;
  }

  if (account.Username) {
    return account.Username;
  }

  return account.Email || "Tài khoản";
}

function getInitial(account) {
  const name = getAccountName(account);

  return name.charAt(0).toUpperCase();
}

function onAvatarError(event) {
  event.target.style.display = "none";
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function isSelf(account) {
  return (
    auth.user &&
    (String(account.Id) === String(auth.user.Id) ||
      (account.Email &&
        auth.user.Email &&
        account.Email.toLowerCase() === auth.user.Email.toLowerCase()))
  );
}

const filteredAccounts = computed(() => {
  const keyword = q.value.trim().toLowerCase();

  return accounts.value.filter((account) => {
    if (roleFilter.value && normalizeRole(account.Role) !== roleFilter.value) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const name = getAccountName(account).toLowerCase();
    const email = (account.Email || "").toLowerCase();
    const username = (account.Username || "").toLowerCase();

    return (
      name.includes(keyword) ||
      email.includes(keyword) ||
      username.includes(keyword)
    );
  });
});

/* =========================================================
   ROLE CHANGE
========================================================= */

async function changeRole(account, newRole) {
  if (isSelf(account)) {
    showToast("Không thể đổi quyền của chính bạn.", true);

    return;
  }

  const oldRole = normalizeRole(account.Role);

  if (oldRole === newRole) {
    return;
  }

  updatingId.value = account.Id;

  try {
    const response = await UpdateAccountRole({
      Id: account.Id,
      // DB lưu 'ADMIN'/'USER' hoa — gửi chuẩn hóa để đồng nhất
      Role: newRole.toUpperCase(),
    });

    const result = response?.data;

    if (!result || result.status !== "success") {
      throw new Error(result?.message || "Không thể cập nhật quyền.");
    }

    account.Role = newRole.toUpperCase();

    showToast(
      `Đã gán quyền ${ROLE_LABELS[newRole] || newRole} cho ${getAccountName(account)}.`
    );
  } catch (e) {
    console.error("[Admin] changeRole error:", e);

    account.Role = oldRole;

    showToast(
      e?.response?.data?.message ||
        e?.message ||
        "Không thể cập nhật quyền.",
      true
    );
  } finally {
    updatingId.value = 0;
  }
}

/* =========================================================
   DELETE
========================================================= */

function confirmDelete(account) {
  if (isSelf(account)) {
    showToast("Không thể xóa tài khoản của chính bạn.", true);

    return;
  }

  deleteTarget.value = account;
}

async function doDelete() {
  const target = deleteTarget.value;

  if (!target || deletingId.value) {
    return;
  }

  deletingId.value = target.Id;

  try {
    const response = await DeleteAccount({ Id: target.Id });

    const result = response?.data;

    if (!result || result.status !== "success") {
      throw new Error(result?.message || "Không thể xóa tài khoản.");
    }

    accounts.value = accounts.value.filter((a) => a.Id !== target.Id);

    deleteTarget.value = null;

    showToast(`Đã vô hiệu hóa tài khoản ${getAccountName(target)}.`);
  } catch (e) {
    console.error("[Admin] deleteAccount error:", e);

    showToast(
      e?.response?.data?.message ||
        e?.message ||
        "Không thể xóa tài khoản.",
      true
    );
  } finally {
    deletingId.value = 0;
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

  font-family: "Playfair Display", Georgia, serif;

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
   ACCOUNT LIST
================================================== */

.account-list {
  display: flex;

  flex-direction: column;

  gap: 14px;
}

.account-card {
  display: flex;

  align-items: center;

  gap: 16px;

  padding: 16px 20px;

  border: 1px solid rgba(78, 53, 53, 0.08);

  border-radius: 18px;

  background: #fff;

  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.account-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 16px 40px rgba(80, 50, 50, 0.1);
}

.avatar-wrap {
  width: 52px;

  height: 52px;

  flex-shrink: 0;

  border-radius: 50%;

  overflow: hidden;

  background: #f7e9e4;

  display: flex;

  align-items: center;

  justify-content: center;
}

.avatar-wrap img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.avatar-fallback {
  color: #8f4d43;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 20px;

  font-weight: 700;
}

.account-info {
  flex: 1;

  min-width: 0;
}

.account-name-row {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-wrap: wrap;
}

.account-name-row h3 {
  margin: 0;

  color: #2a1d1d;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 17px;
}

.role-badge {
  padding: 3px 10px;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.03em;
}

.role-badge.role-admin {
  background: rgba(143, 77, 67, 0.12);

  color: #8f4d43;
}

.role-badge.role-user {
  background: rgba(46, 125, 50, 0.12);

  color: #2e7d32;
}

.role-badge.role-guest {
  background: rgba(120, 120, 140, 0.12);

  color: #5c5c70;
}

.account-email {
  margin: 3px 0 0;

  color: #6d5a5a;

  font-size: 13px;
}

.account-meta {
  display: flex;

  gap: 16px;

  flex-wrap: wrap;

  margin: 6px 0 0;

  color: #9a8484;

  font-size: 12px;
}

.account-meta span {
  display: inline-flex;

  align-items: center;

  gap: 4px;
}

/* ==================================================
   ACTIONS
================================================== */

.account-actions {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-shrink: 0;
}

.role-select {
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

.role-select select {
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

.role-select select:disabled {
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
  background: #f7f0ec;

  border-color: rgba(143, 77, 67, 0.35);
}

.action-btn.danger {
  color: #a92828;

  border-color: rgba(169, 40, 40, 0.3);
}

.action-btn.danger:hover:not(:disabled) {
  background: #fdf1f1;

  border-color: #a92828;
}

.action-btn:disabled {
  opacity: 0.5;

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

.state-icon.error {
  background: #fdf1f1;

  color: #a92828;
}

.state-box h3 {
  margin: 0 0 10px;

  color: #2a1d1d;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 20px;
}

.state-box p {
  margin: 0 0 20px;

  color: #6d5a5a;

  font-size: 13.5px;

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

.skeleton-avatar {
  width: 52px;

  height: 52px;

  border-radius: 50%;

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

.skeleton-role {
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

  .account-card {
    flex-wrap: wrap;
  }

  .account-actions {
    width: 100%;

    justify-content: flex-end;
  }

  .search-control {
    width: 100%;
  }
}
</style>
