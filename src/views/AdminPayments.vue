<template>
  <main class="admin-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <!-- =====================================================
         BACK — header site bị ẩn trên /admin/* nên trang này
         phải tự có đường quay lại.
    ====================================================== -->
    <div class="container back-row">
      <button type="button" class="back-btn" @click="goAdminWeddings">
        <v-icon size="16"> mdi-arrow-left </v-icon>

        Quản lý thiệp
      </button>
    </div>

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
          Duyệt
          <span>thanh toán</span>
        </h1>

        <p>
          Người dùng báo đã chuyển khoản — đối chiếu với sao kê ngân hàng
          rồi duyệt để kích hoạt thiệp, hoặc từ chối kèm lý do.
        </p>

        <div class="hero-stats">
          <div class="hero-stat">
            <strong>{{ requests.length }}</strong>
            <span>Tổng yêu cầu</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong class="stat-pending">{{ countByStatus(STATUS.PENDING) }}</strong>
            <span>Chờ duyệt</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ countByStatus(STATUS.APPROVED) }}</strong>
            <span>Đã duyệt</span>
          </div>

          <div class="hero-stat-divider"></div>

          <div class="hero-stat">
            <strong>{{ countByStatus(STATUS.REJECTED) }}</strong>
            <span>Từ chối</span>
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
            <span>Hiển thị</span>
            <strong>{{ filteredRequests.length }}</strong>
            <span>yêu cầu</span>
          </div>
        </div>

        <div class="toolbar-right">
          <div class="filter-control">
            <span class="control-icon">◈</span>

            <select v-model="statusFilter">
              <option value="">Tất cả trạng thái</option>

              <option :value="STATUS.PENDING">Chờ duyệt</option>

              <option :value="STATUS.APPROVED">Đã duyệt</option>

              <option :value="STATUS.REJECTED">Từ chối</option>
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
              placeholder="Tìm slug / tên cặp đôi / email"
            />

            <button v-if="q" class="clear-search" type="button" @click="q = ''">
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="request-list">
        <article v-for="i in 3" :key="i" class="request-card">
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

        <button type="button" class="retry-btn" @click="loadRequests">
          Thử lại
        </button>
      </div>

      <!-- EMPTY -->
      <div v-else-if="filteredRequests.length === 0" class="state-box">
        <div class="state-icon">
          <v-icon size="26"> mdi-cash-check </v-icon>
        </div>

        <h3>Không có yêu cầu nào</h3>

        <p>
          Chưa có yêu cầu thanh toán nào khớp bộ lọc. Khi người dùng bấm
          “Tôi đã chuyển khoản”, yêu cầu sẽ hiện ở đây.
        </p>
      </div>

      <!-- LIST -->
      <div v-else class="request-list">
        <article
          v-for="item in filteredRequests"
          :key="item.id"
          class="request-card"
          :class="{ pending: item.status === STATUS.PENDING }"
        >
          <!-- INFO -->
          <div class="request-info">
            <div class="request-name-row">
              <h3>{{ getCoupleName(item) }}</h3>

              <span class="status-badge" :class="statusClass(item.status)">
                {{ statusLabel(item.status) }}
              </span>

              <span class="request-id">#{{ item.id }}</span>
            </div>

            <p class="request-slug">/{{ item.slug }}</p>

            <p class="request-meta">
              <span class="amount">
                <v-icon size="13"> mdi-cash </v-icon>
                {{ formatVnd(item.amount) }}
              </span>

              <span v-if="item.transferAt">
                <v-icon size="13"> mdi-bank-transfer </v-icon>
                CK {{ formatDateTime(item.transferAt) }}
              </span>

              <span>
                <v-icon size="13"> mdi-clock-outline </v-icon>
                Báo {{ formatDateTime(item.createdAt) }}
              </span>

              <span v-if="item.ownerEmail">
                <v-icon size="13"> mdi-account-outline </v-icon>
                {{ item.ownerName ? `${item.ownerName} — ` : "" }}{{ item.ownerEmail }}
              </span>
            </p>

            <p v-if="item.content" class="request-content">
              Nội dung CK: <code>{{ item.content }}</code>
            </p>

            <p v-if="item.adminNote" class="request-note">
              <v-icon size="13"> mdi-information-outline </v-icon>
              Lý do từ chối: {{ item.adminNote }}
            </p>
          </div>

          <!-- ACTIONS -->
          <div class="request-actions">
            <button
              type="button"
              class="action-btn"
              @click="viewWedding(item)"
            >
              <v-icon size="16"> mdi-eye-outline </v-icon>
              Xem thiệp
            </button>

            <template v-if="item.status === STATUS.PENDING">
              <button
                type="button"
                class="action-btn danger"
                :disabled="reviewingId === item.id"
                @click="openReview(item, false)"
              >
                <v-icon size="16"> mdi-close-circle-outline </v-icon>
                Từ chối
              </button>

              <button
                type="button"
                class="action-btn primary"
                :disabled="reviewingId === item.id"
                @click="openReview(item, true)"
              >
                <v-progress-circular
                  v-if="reviewingId === item.id"
                  indeterminate
                  size="13"
                  width="2"
                />

                <v-icon v-else size="16"> mdi-check-decagram-outline </v-icon>
                Duyệt
              </button>
            </template>
          </div>
        </article>
      </div>

      <!-- =====================================================
           CẤU HÌNH TÀI KHOẢN NHẬN TIỀN
           Bảng PaymentInfo rỗng thì trang thanh toán tự khoá lại
           (không hiện số nào) — khối này là chỗ điền.
      ====================================================== -->
      <div class="config-card">
        <div class="config-head">
          <span class="config-title">
            <v-icon size="18"> mdi-bank-cog-outline </v-icon>
            Tài khoản nhận thanh toán
          </span>

          <span
            class="status-chip"
            :class="hasConfig ? 'chip-active' : 'chip-pending'"
          >
            {{ hasConfig ? "Đã cấu hình" : "Chưa cấu hình" }}
          </span>
        </div>

        <p class="config-warn">
          <v-icon size="15"> mdi-alert-outline </v-icon>
          <span>
            Thông tin này hiển thị công khai cho người chuyển khoản và đi
            thẳng vào mã QR. <strong>Kiểm tra kỹ số tài khoản trước khi lưu</strong>
            — sai một chữ số là tiền đi sai chỗ.
          </span>
        </p>

        <div class="config-grid">
          <label class="config-field">
            <span>Tên ngân hàng</span>
            <input v-model="form.bankName" type="text" placeholder="Vietcombank" />
          </label>

          <label class="config-field">
            <span>Mã BIN (VietQR)</span>
            <input v-model="form.bankId" type="text" placeholder="970436" />
          </label>

          <label class="config-field">
            <span>Chủ tài khoản</span>
            <input
              v-model="form.accountName"
              type="text"
              placeholder="NGUYEN VAN A"
            />
          </label>

          <label class="config-field">
            <span>Số tài khoản</span>
            <input
              v-model="form.accountNumber"
              type="text"
              class="mono"
              placeholder="0123456789"
            />
          </label>

          <label class="config-field">
            <span>Giá kích hoạt 1 thiệp (VNĐ)</span>
            <input v-model.number="form.amount" type="number" min="0" step="1000" />
          </label>
        </div>

        <p class="config-hint">
          Mã BIN tra tại
          <a
            href="https://api.vietqr.io/v2/banks"
            target="_blank"
            rel="noopener"
          >api.vietqr.io/v2/banks</a>
          — ví dụ Vietcombank 970436, Techcombank 970407, MB 970422.
        </p>

        <button
          type="button"
          class="action-btn primary save-config"
          :disabled="savingConfig"
          @click="saveConfig"
        >
          <v-progress-circular
            v-if="savingConfig"
            indeterminate
            size="13"
            width="2"
          />

          <v-icon v-else size="16"> mdi-content-save-outline </v-icon>

          Lưu thông tin tài khoản
        </button>
      </div>
    </section>

    <!-- =====================================================
         REVIEW CONFIRM
    ====================================================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="reviewTarget"
          class="detail-modal"
          @click.self="closeReview"
        >
          <div class="confirm-panel">
            <div class="confirm-icon" :class="{ danger: !reviewTarget.approve }">
              <v-icon size="26">
                {{
                  reviewTarget.approve
                    ? "mdi-check-decagram-outline"
                    : "mdi-close-circle-outline"
                }}
              </v-icon>
            </div>

            <h3>
              {{ reviewTarget.approve ? "Duyệt thanh toán này?" : "Từ chối yêu cầu này?" }}
            </h3>

            <p>
              <template v-if="reviewTarget.approve">
                Thiệp <strong>/{{ reviewTarget.item.slug }}</strong> của
                {{ getCoupleName(reviewTarget.item) }} sẽ được
                <strong>kích hoạt vĩnh viễn</strong> và mở cho khách mời xem.
                Chỉ xác nhận sau khi bạn đã thấy giao dịch
                {{ formatVnd(reviewTarget.item.amount) }} trong sao kê.
              </template>

              <template v-else>
                Yêu cầu <strong>#{{ reviewTarget.item.id }}</strong> sẽ bị từ
                chối. Chủ thiệp sẽ đọc được lý do bạn nhập bên dưới — hãy nói
                rõ để họ biết đường xử lý.
              </template>
            </p>

            <label v-if="!reviewTarget.approve" class="reject-field">
              <span>Lý do từ chối (bắt buộc)</span>

              <textarea
                v-model="reviewNote"
                rows="3"
                placeholder="Ví dụ: Chưa thấy giao dịch trong sao kê ngày 24/09. Bạn kiểm tra lại giúp mình nhé."
              ></textarea>
            </label>

            <div class="confirm-actions">
              <button type="button" class="action-btn" @click="closeReview">
                Hủy
              </button>

              <button
                type="button"
                class="action-btn primary"
                :disabled="reviewingId === reviewTarget.item.id"
                @click="doReview"
              >
                <v-progress-circular
                  v-if="reviewingId === reviewTarget.item.id"
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
      <div v-if="toast" class="admin-toast" :class="{ error: toastError }">
        {{ toast }}
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { useRouter } from "vue-router";

import {
  getPaymentInfo,
  getPaymentRequests,
  reviewPaymentRequest,
  updatePaymentInfo,
} from "@/model/api";

defineOptions({
  name: "AdminPayments",
});

const router = useRouter();

/* =========================================================
   TRẠNG THÁI YÊU CẦU
========================================================= */

const STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

/* =========================================================
   STATE
========================================================= */

const requests = ref([]);

const loading = ref(false);

const loadError = ref("");

const reviewingId = ref(0);

const reviewTarget = ref(null);

const reviewNote = ref("");

const statusFilter = ref("");

const q = ref("");

const toast = ref("");

const toastError = ref(false);

/* Cấu hình tài khoản nhận tiền */
const hasConfig = ref(false);

const savingConfig = ref(false);

const form = ref({
  bankName: "",
  bankId: "",
  accountName: "",
  accountNumber: "",
  amount: 0,
});

/* =========================================================
   LOAD
========================================================= */

async function loadRequests() {
  loading.value = true;

  loadError.value = "";

  try {
    /*
     * Lấy TẤT CẢ rồi lọc ở client — bộ lọc trạng thái đổi tức thì,
     * không phải gọi lại API mỗi lần đổi select. Số yêu cầu ở mức
     * vài chục nên không đáng lo.
     *
     * Vẫn phải truyền { status: "" } để api.js gắn ?status= vào URL
     * (xem ghi chú route shadowing trong model/api.js).
     */
    const response = await getPaymentRequests({ status: "" });

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      requests.value = result.data.map(normalize);
    } else {
      loadError.value = result?.message || "Không thể tải danh sách yêu cầu.";
    }
  } catch (error) {
    console.error("[AdminPayments] getPaymentRequests error:", error);

    loadError.value =
      error?.response?.data?.message ||
      "Không thể tải danh sách yêu cầu. Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
}

async function loadConfig() {
  try {
    const response = await getPaymentInfo();

    const result = response?.data;

    if (
      result &&
      result.status === "success" &&
      result.data &&
      typeof result.data === "object"
    ) {
      const data = result.data;

      form.value = {
        bankName: data.BankName || data.bankName || "",
        bankId: data.BankId || data.bankId || "",
        accountName: data.AccountName || data.accountName || "",
        accountNumber: data.AccountNumber || data.accountNumber || "",
        amount: Number(data.Amount || data.amount || 0),
      };

      hasConfig.value = Boolean(form.value.bankId && form.value.accountNumber);
    } else {
      hasConfig.value = false;
    }
  } catch (error) {
    console.warn("[AdminPayments] getPaymentInfo error:", error);

    hasConfig.value = false;
  }
}

onMounted(() => {
  loadRequests();
  loadConfig();
});

/* =========================================================
   NORMALIZE — API trả PascalCase, UI dùng camelCase
========================================================= */

function normalize(raw) {
  return {
    id: Number(raw.Id || raw.id || 0),
    slug: raw.Slug || raw.slug || "",
    amount: Number(raw.Amount || raw.amount || 0),
    content: raw.Content || raw.content || "",
    transferAt: raw.TransferAt || raw.transferAt || "",
    status: raw.Status || raw.status || STATUS.PENDING,
    createdAt: raw.CreatedAt || raw.createdAt || "",
    reviewedAt: raw.ReviewedAt || raw.reviewedAt || "",
    adminNote: raw.AdminNote || raw.adminNote || "",
    ownerName: raw.OwnerName || raw.ownerName || "",
    ownerEmail: raw.OwnerEmail || raw.ownerEmail || "",
    groomName: raw.GroomName || raw.groomName || "",
    brideName: raw.BrideName || raw.brideName || "",
  };
}

/* =========================================================
   HELPERS
========================================================= */

function countByStatus(status) {
  return requests.value.filter((item) => item.status === status).length;
}

function statusLabel(status) {
  if (status === STATUS.APPROVED) return "Đã duyệt";

  if (status === STATUS.REJECTED) return "Từ chối";

  return "Chờ duyệt";
}

function statusClass(status) {
  if (status === STATUS.APPROVED) return "status-active";

  if (status === STATUS.REJECTED) return "status-locked";

  return "status-pending";
}

function getCoupleName(item) {
  const groom = item?.groomName || "";
  const bride = item?.brideName || "";

  if (!groom && !bride) {
    return "Thiệp cưới";
  }

  return `${groom} & ${bride}`;
}

function formatVnd(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return "—";
  }

  return `${new Intl.NumberFormat("vi-VN").format(number)} ₫`;
}

function formatDateTime(value) {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

const filteredRequests = computed(() => {
  const keyword = q.value.trim().toLowerCase();

  return requests.value.filter((item) => {
    if (statusFilter.value && item.status !== statusFilter.value) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    return (
      getCoupleName(item).toLowerCase().includes(keyword) ||
      item.slug.toLowerCase().includes(keyword) ||
      item.ownerEmail.toLowerCase().includes(keyword) ||
      String(item.id) === keyword
    );
  });
});

/* =========================================================
   VIEW
========================================================= */

function viewWedding(item) {
  window.open(`/${item.slug}`, "_blank");
}

function goAdminWeddings() {
  router.push({ name: "AdminWeddings" });
}

/* =========================================================
   REVIEW
========================================================= */

function openReview(item, approve) {
  reviewTarget.value = { item, approve };

  reviewNote.value = "";
}

function closeReview() {
  reviewTarget.value = null;

  reviewNote.value = "";
}

async function doReview() {
  const target = reviewTarget.value;

  if (!target || reviewingId.value) {
    return;
  }

  if (!target.approve && !reviewNote.value.trim()) {
    showToast("Vui lòng nhập lý do từ chối.", true);

    return;
  }

  reviewingId.value = target.item.id;

  try {
    const response = await reviewPaymentRequest({
      Id: target.item.id,
      Approve: target.approve,
      Note: target.approve ? "" : reviewNote.value.trim(),
    });

    const result = response?.data;

    if (!result || result.status !== "success") {
      showToast(result?.message || "Không thể xử lý yêu cầu.", true);

      return;
    }

    /*
     * Cập nhật tại chỗ — không gọi lại toàn bộ danh sách.
     */
    const item = requests.value.find((r) => r.id === target.item.id);

    if (item) {
      item.status = target.approve ? STATUS.APPROVED : STATUS.REJECTED;

      item.reviewedAt = new Date().toISOString();

      item.adminNote = target.approve ? "" : reviewNote.value.trim();
    }

    closeReview();

    showToast(
      result.message ||
        (target.approve
          ? `Đã kích hoạt thiệp /${target.item.slug}.`
          : `Đã từ chối yêu cầu #${target.item.id}.`)
    );
  } catch (error) {
    console.error("[AdminPayments] reviewPaymentRequest error:", error);

    showToast(
      error?.response?.data?.message || "Không thể xử lý yêu cầu.",
      true
    );
  } finally {
    reviewingId.value = 0;
  }
}

/* =========================================================
   CẤU HÌNH TÀI KHOẢN
========================================================= */

async function saveConfig() {
  if (savingConfig.value) {
    return;
  }

  const data = form.value;

  if (
    !data.bankName.trim() ||
    !data.bankId.trim() ||
    !data.accountName.trim() ||
    !data.accountNumber.trim()
  ) {
    showToast("Vui lòng nhập đầy đủ thông tin ngân hàng.", true);

    return;
  }

  savingConfig.value = true;

  try {
    const response = await updatePaymentInfo({
      BankName: data.bankName.trim(),
      BankId: data.bankId.trim(),
      AccountName: data.accountName.trim(),
      AccountNumber: data.accountNumber.trim(),
      Amount: Number(data.amount) || 0,
    });

    const result = response?.data;

    if (!result || result.status !== "success") {
      showToast(result?.message || "Không thể lưu thông tin tài khoản.", true);

      return;
    }

    hasConfig.value = true;

    showToast(result.message || "Đã lưu thông tin tài khoản nhận thanh toán.");
  } catch (error) {
    console.error("[AdminPayments] updatePaymentInfo error:", error);

    showToast(
      error?.response?.data?.message || "Không thể lưu thông tin tài khoản.",
      true
    );
  } finally {
    savingConfig.value = false;
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
   PAGE — chrome chung (page-glow, back-btn, page-hero,
   hero-stat, toolbar, filter/search, action-btn,
   state-box, skeleton, modal, toast) đã gom vào app.css.
================================================== */

.admin-page {
  position: relative;

  min-height: 100vh;

  background: var(--studio-paper, #f7f1e6);

  overflow: hidden;
}

.hero-stat strong {
  font-family: var(--font-heading);

  font-size: 26px;
}

.hero-stat strong.stat-pending {
  color: var(--app-warn, #9a6b1f);
}

.hero-stat-divider {
  width: 1px;

  height: 34px;

  background: var(--studio-line, rgba(43, 33, 24, 0.14));
}

.admin-content {
  padding: 10px 0 80px;
}

.result-count {
  display: flex;

  align-items: center;

  gap: 6px;
}

.result-count strong {
  color: var(--studio-seal, #a63a2e);

  font-size: 16px;
}

.toolbar-right {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-wrap: wrap;
}

.control-icon {
  color: var(--studio-foil, #b9975b);

  font-size: 13px;
}

.filter-control select {
  border: 0;

  background: transparent;

  color: var(--studio-ink, #2b2118);

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

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;

  pointer-events: none;
}

.search-icon {
  display: flex;

  color: var(--studio-ink-faint, #8a7a68);

  margin-right: 8px;
}

.search-icon svg {
  width: 16px;

  height: 16px;
}

/* ==================================================
   REQUEST LIST
================================================== */

.request-list {
  display: flex;

  flex-direction: column;

  gap: 14px;
}

.request-card {
  display: flex;

  align-items: center;

  gap: 16px;

  padding: 16px 20px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 18px;

  background: var(--studio-card, #fffdf8);

  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.request-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 16px 40px rgba(43, 33, 24, 0.1);
}

/* Chờ duyệt là việc cần làm — viền vàng để nổi lên khỏi danh sách */
.request-card.pending {
  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 0 0 3px var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
}

.request-info {
  flex: 1;

  min-width: 0;
}

.request-name-row {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-wrap: wrap;
}

.request-name-row h3 {
  margin: 0;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);

  font-size: 17px;
}

.request-id {
  color: var(--studio-ink-faint, #8a7a68);

  font-family: "SF Mono", "Consolas", monospace;

  font-size: 12px;

  font-weight: 700;
}

.status-badge {
  padding: 3px 10px;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.03em;
}

.status-badge.status-active {
  background: var(--app-ok-soft, rgba(46, 107, 63, 0.1));

  color: var(--app-ok, #2e6b3f);
}

.status-badge.status-pending {
  background: var(--app-warn-soft, rgba(185, 151, 91, 0.18));

  color: var(--app-warn, #9a6b1f);
}

.status-badge.status-locked {
  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));

  color: var(--app-danger, #a03030);
}

.request-slug {
  margin: 3px 0 0;

  color: var(--app-gold-text, #8a6a2f);

  font-size: 13px;

  font-weight: 600;
}

.request-meta {
  display: flex;

  gap: 16px;

  flex-wrap: wrap;

  margin: 6px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;
}

.request-meta span {
  display: inline-flex;

  align-items: center;

  gap: 4px;
}

.request-meta .amount {
  color: var(--studio-seal, #a63a2e);

  font-size: 13px;

  font-weight: 800;
}

.request-content {
  margin: 6px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12px;
}

.request-content code {
  padding: 1px 6px;

  border-radius: 5px;

  background: var(--studio-paper, #f7f1e6);

  font-family: "SF Mono", "Consolas", monospace;
}

.request-note {
  display: flex;

  align-items: center;

  gap: 5px;

  margin: 6px 0 0;

  color: var(--app-danger, #a03030);

  font-size: 12px;
}

.request-actions {
  display: flex;

  align-items: center;

  gap: 8px;

  flex-shrink: 0;

  flex-wrap: wrap;
}

/* ==================================================
   CẤU HÌNH TÀI KHOẢN
================================================== */

.config-card {
  margin-top: 26px;

  padding: 24px 26px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 20px;

  background: var(--studio-card, #fffdf8);
}

.config-head {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 14px;
}

.config-title {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: var(--studio-ink, #2b2118);

  font-size: 16px;

  font-weight: 700;
}

.config-title .v-icon {
  color: var(--studio-seal, #a63a2e);
}

.config-warn {
  display: flex;

  align-items: flex-start;

  gap: 8px;

  margin: 0 0 18px;

  padding: 10px 13px;

  border: 1px dashed rgba(154, 107, 31, 0.45);

  border-radius: 12px;

  background: var(--app-warn-soft, rgba(185, 151, 91, 0.18));

  color: #7a5a1c;

  font-size: 12px;

  line-height: 1.6;
}

.config-warn .v-icon {
  flex-shrink: 0;

  margin-top: 1px;
}

.config-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  gap: 14px;
}

.config-field {
  display: flex;

  flex-direction: column;

  gap: 6px;
}

.config-field span {
  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12px;

  font-weight: 700;
}

.config-field input {
  width: 100%;

  padding: 10px 13px;

  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  border-radius: 11px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink, #2b2118);

  font-size: 13.5px;

  font-weight: 600;

  outline: none;

  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.config-field input.mono {
  font-family: "SF Mono", "Consolas", monospace;

  letter-spacing: 0.04em;
}

.config-field input:focus {
  border-color: var(--studio-foil, #b9975b);

  box-shadow: 0 0 0 3px var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
}

.config-hint {
  margin: 14px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;

  line-height: 1.6;
}

.config-hint a {
  color: var(--studio-seal, #a63a2e);
}

.save-config {
  margin-top: 18px;
}

/* ==================================================
   MODAL — ô nhập lý do từ chối
================================================== */

.reject-field {
  display: flex;

  flex-direction: column;

  gap: 6px;

  margin: 0 0 20px;

  text-align: left;
}

.reject-field span {
  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12px;

  font-weight: 700;
}

.reject-field textarea {
  width: 100%;

  padding: 10px 13px;

  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  border-radius: 11px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink, #2b2118);

  font-family: inherit;

  font-size: 13px;

  line-height: 1.6;

  resize: vertical;

  outline: none;
}

.reject-field textarea:focus {
  border-color: var(--studio-foil, #b9975b);

  box-shadow: 0 0 0 3px var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
}

/* ==================================================
   STATES / SKELETON
================================================== */

.state-icon {
  width: 58px;

  height: 58px;

  margin: 0 auto 14px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--app-gold-text, #8a6a2f);
}

.skeleton-body {
  flex: 1;
}

.skeleton-status {
  width: 200px;

  height: 38px;

  border-radius: 999px;

  background: linear-gradient(100deg, #efe7d8 40%, #f7f2e7 50%, #efe7d8 60%);

  background-size: 200% 100%;

  animation: shimmer 1.4s infinite;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 720px) {
  .request-card {
    flex-wrap: wrap;
  }

  .request-actions {
    width: 100%;

    justify-content: flex-end;
  }

  .search-control {
    width: 100%;
  }

  .config-card {
    padding: 18px;
  }
}
</style>
