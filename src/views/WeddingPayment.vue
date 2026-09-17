<template>
  <main class="payment-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <!-- =====================================================
         BACK TO MANAGE
    ====================================================== -->
    <div class="container back-row">
      <button type="button" class="back-btn" @click="goManage">
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
          Kích hoạt thiệp
          <span class="eyebrow-line"></span>
        </span>

        <h1>
          Thanh toán
          <span>kích hoạt thiệp</span>
        </h1>

        <p>
          Chuyển khoản theo thông tin bên dưới với nội dung
          <strong class="slug-strong">/{{ slug }}</strong>
          — thiệp sẽ được kích hoạt ngay sau khi admin xác nhận.
        </p>
      </div>
    </section>

    <!-- =====================================================
         CONTENT
    ====================================================== -->
    <section class="container payment-content">
      <!-- LOADING -->
      <div v-if="loading" class="payment-grid">
        <div class="pay-card skeleton">
          <div class="skeleton-line"></div>

          <div class="skeleton-line small"></div>

          <div class="skeleton-line tiny"></div>

          <div class="skeleton-qr"></div>
        </div>

        <div class="pay-card skeleton">
          <div class="skeleton-line"></div>

          <div class="skeleton-line small"></div>

          <div class="skeleton-line tiny"></div>
        </div>
      </div>

      <!-- ERROR -->
      <div v-else-if="loadError" class="state-box">
        <div class="empty-icon">⚠</div>

        <h3>Không tải được thông tin thanh toán</h3>

        <p>{{ loadError }}</p>

        <button type="button" class="retry-btn" @click="loadAll">
          Thử lại
        </button>
      </div>

      <!-- ALREADY ACTIVE -->
      <div v-else-if="isActivated" class="state-box activated">
        <div class="empty-icon activated-icon">✓</div>

        <h3>Thiệp đã được kích hoạt</h3>

        <p>
          Thiệp <strong class="slug-strong">/{{ slug }}</strong>
          đang hoạt động — khách mời có thể mở link bình thường.
        </p>

        <div class="state-actions">
          <button type="button" class="retry-btn" @click="goView">
            Xem thiệp
          </button>

          <button type="button" class="ghost-btn" @click="goManage">
            Về quản lý thiệp
          </button>
        </div>
      </div>

      <!-- PAYMENT -->
      <div v-else class="payment-grid">
        <!-- ==============================================
             LEFT — THÔNG TIN TÀI KHOẢN NHẬN
        =============================================== -->
        <div class="pay-card">
          <div class="pay-card-head">
            <span class="pay-card-title">
              <v-icon size="18"> mdi-bank-outline </v-icon>

              Tài khoản nhận thanh toán
            </span>

            <span
              v-if="statusLabel"
              class="status-chip"
              :class="statusChipClass"
            >
              {{ statusLabel }}
            </span>
          </div>

          <!-- CẢNH BÁO: API chưa có / đang dùng thông tin mẫu -->
          <div v-if="usingFallbackInfo" class="fallback-warning">
            <v-icon size="16"> mdi-information-outline </v-icon>

            <span>
              API <code>getPaymentInfo</code> chưa sẵn sàng — đang hiển thị
              thông tin mẫu. Admin cần gọi
              <code>updatePaymentInfo</code> hoặc cập nhật fallback trong
              <code>WeddingPayment.vue</code>.
            </span>
          </div>

          <!-- QR -->
          <div class="qr-wrap">
            <img
              v-if="qrUrl"
              :src="qrUrl"
              alt="Mã QR chuyển khoản"
              class="qr-image"
            />

            <div v-else class="qr-placeholder">
              <v-icon size="30"> mdi-qrcode </v-icon>

              <span> Không tạo được mã QR </span>
            </div>

            <p class="qr-hint">
              Quét bằng app ngân hàng — thông tin đã điền sẵn
            </p>
          </div>

          <!-- BANK ROWS -->
          <div class="bank-rows">
            <div class="bank-row">
              <span class="bank-label">Ngân hàng</span>

              <span class="bank-value">
                {{ paymentInfo.bankName }}
              </span>
            </div>

            <div class="bank-row">
              <span class="bank-label">Chủ tài khoản</span>

              <span class="bank-value">
                {{ paymentInfo.accountName }}
              </span>
            </div>

            <div class="bank-row copyable" @click="copyValue('Số tài khoản', paymentInfo.accountNumber)">
              <span class="bank-label">Số tài khoản</span>

              <span class="bank-value mono">
                {{ paymentInfo.accountNumber }}
              </span>

              <button
                type="button"
                class="copy-btn"
                title="Sao chép số tài khoản"
              >
                <v-icon size="15"> mdi-content-copy </v-icon>
              </button>
            </div>

            <div class="bank-row copyable" @click="copyValue('Số tiền', String(amount))">
              <span class="bank-label">Số tiền</span>

              <span class="bank-value strong">
                {{ formatVnd(amount) }}
              </span>

              <button type="button" class="copy-btn" title="Sao chép số tiền">
                <v-icon size="15"> mdi-content-copy </v-icon>
              </button>
            </div>

            <div
              class="bank-row copyable"
              @click="copyValue('Nội dung chuyển khoản', transferContent)"
            >
              <span class="bank-label">Nội dung CK</span>

              <span class="bank-value mono">
                {{ transferContent }}
              </span>

              <button
                type="button"
                class="copy-btn"
                title="Sao chép nội dung chuyển khoản"
              >
                <v-icon size="15"> mdi-content-copy </v-icon>
              </button>
            </div>
          </div>

          <p class="pay-note">
            Nội dung chuyển khoản chính là
            <strong>slug của thiệp</strong> — giúp admin đối soát và kích hoạt
            đúng thiệp của bạn.
          </p>
        </div>

        <!-- ==============================================
             RIGHT — XÁC NHẬN ĐÃ CHUYỂN KHOẢN
        =============================================== -->
        <div class="pay-card">
          <div class="pay-card-head">
            <span class="pay-card-title">
              <v-icon size="18"> mdi-check-decagram-outline </v-icon>

              Xác nhận thanh toán
            </span>
          </div>

          <!-- ĐÃ BÁO THÀNH CÔNG -->
          <div v-if="noticeDone" class="notice-success">
            <div class="notice-success-icon">
              <v-icon size="26"> mdi-check-circle-outline </v-icon>
            </div>

            <h4>Đã ghi nhận yêu cầu</h4>

            <p>
              Hệ thống đã nhận báo cáo chuyển khoản của bạn. Admin sẽ đối soát
              và kích hoạt thiệp trong thời gian sớm nhất.
            </p>

            <div class="state-actions">
              <button type="button" class="retry-btn" @click="goManage">
                Về quản lý thiệp
              </button>

              <button type="button" class="ghost-btn" @click="goView">
                Xem thiệp
              </button>
            </div>
          </div>

          <!-- FORM BÁO CHUYỂN KHOẢN -->
          <template v-else>
            <p v-if="paymentPending" class="pending-note">
              <v-icon size="15"> mdi-clock-outline </v-icon>

              Bạn đã báo chuyển khoản trước đó — đang chờ admin duyệt. Gửi lại
              chỉ khi bạn chuyển khoản lần mới.
            </p>

            <label class="field-label" for="pay-amount">
              Số tiền bạn đã chuyển (VNĐ)
            </label>

            <input
              id="pay-amount"
              v-model.number="amount"
              type="number"
              min="0"
              step="1000"
              class="field-input"
            />

            <p v-if="amountMismatch" class="field-warn">
              Số tiền nhập khác với giá gói
              ({{ formatVnd(paymentInfo.amount) }}) — admin vẫn sẽ đối soát
              theo sao kê.
            </p>

            <label class="field-label" for="pay-time">
              Thời gian chuyển khoản
            </label>

            <input
              id="pay-time"
              v-model="transferAt"
              type="datetime-local"
              class="field-input"
            />

            <label class="field-label" for="pay-content">
              Nội dung chuyển khoản
            </label>

            <input
              id="pay-content"
              :value="transferContent"
              type="text"
              class="field-input mono"
              readonly
            />

            <button
              type="button"
              class="submit-btn"
              :disabled="submitting || !amount || amount <= 0"
              @click="submitNotice"
            >
              <v-progress-circular
                v-if="submitting"
                indeterminate
                size="15"
                width="2"
                color="#fff"
              />

              <v-icon v-else size="17"> mdi-send-outline </v-icon>

              Tôi đã chuyển khoản
            </button>

            <p class="submit-hint">
              Sau khi gửi, admin sẽ kiểm tra sao kê ngân hàng và kích hoạt
              thiệp của bạn.
            </p>
          </template>
        </div>
      </div>
    </section>

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

import { useRoute, useRouter } from "vue-router";

import {
  getPaymentInfo,
  getPaymentStatus,
  getWeddingStatus,
  submitPaymentNotice,
} from "@/model/api";

import { WEDDING_STATUS } from "@/model/weddingAdmin";

defineOptions({
  name: "WeddingPayment",
});

/* =========================================================
   ROUTER
========================================================= */

const route = useRoute();
const router = useRouter();

const slug = computed(() => {
  const value = route.params.slug;

  return typeof value === "string" ? value.trim() : "";
});

/* =========================================================
   FALLBACK — thông tin tài khoản MẪU
   Dùng khi API getPaymentInfo chưa có.
   ⚠ Thay bằng thông tin thật của admin (hoặc gọi
   updatePaymentInfo để lưu vào server).
========================================================= */

const FALLBACK_PAYMENT_INFO = {
  bankName: "Vietcombank",

  bankId: "970436",

  accountName: "CONG TY THIET KE THIEP CUOI",

  accountNumber: "0123456789",

  amount: 50000,
};

/* =========================================================
   STATE
========================================================= */

const loading = ref(true);

const loadError = ref("");

const status = ref("");

const paymentInfo = ref({ ...FALLBACK_PAYMENT_INFO });

const usingFallbackInfo = ref(false);

const amount = ref(FALLBACK_PAYMENT_INFO.amount);

const transferAt = ref(nowLocalInput());

const submitting = ref(false);

const noticeDone = ref(false);

const paymentPending = ref(false);

const toast = ref("");

/* =========================================================
   LOAD
========================================================= */

async function loadAll() {
  loading.value = true;

  loadError.value = "";

  try {
    /*
     * 1. Trạng thái thiệp — để biết đã kích hoạt chưa.
     *    API getWeddingStatus hiện chưa có [AllowAnonymous]
     *    nên có thể 401: không chặn trang, chỉ cảnh báo.
     */
    let statusKnown = false;

    try {
      const statusResponse = await getWeddingStatus({ slug: slug.value });

      const statusResult = statusResponse?.data;

      if (
        statusResult &&
        statusResult.status === "success" &&
        statusResult.data
      ) {
        status.value =
          statusResult.data.Status || statusResult.data.status || "";

        statusKnown = true;
      } else if (statusResult && statusResult.status !== "success") {
        loadError.value =
          statusResult.message || "Không tìm thấy thiệp này.";

        return;
      }
    } catch (statusError) {
      console.warn("[WeddingPayment] getWeddingStatus error:", statusError);
    }

    /*
     * 2. Thông tin tài khoản nhận thanh toán.
     *    API chưa có → dùng fallback và báo rõ trên UI.
     */
    try {
      const infoResponse = await getPaymentInfo();

      const infoResult = infoResponse?.data;

      if (
        infoResult &&
        infoResult.status === "success" &&
        infoResult.data &&
        typeof infoResult.data === "object"
      ) {
        const data = infoResult.data;

        paymentInfo.value = {
          bankName: data.BankName || data.bankName || FALLBACK_PAYMENT_INFO.bankName,

          bankId: data.BankId || data.bankId || FALLBACK_PAYMENT_INFO.bankId,

          accountName:
            data.AccountName || data.accountName || FALLBACK_PAYMENT_INFO.accountName,

          accountNumber:
            data.AccountNumber ||
            data.accountNumber ||
            FALLBACK_PAYMENT_INFO.accountNumber,

          amount: Number(
            data.Amount || data.amount || FALLBACK_PAYMENT_INFO.amount
          ),
        };

        usingFallbackInfo.value = false;

        amount.value = paymentInfo.value.amount;
      } else {
        usingFallbackInfo.value = true;
      }
    } catch (infoError) {
      console.warn("[WeddingPayment] getPaymentInfo error:", infoError);

      usingFallbackInfo.value = true;
    }

    /*
     * 3. Trạng thái thanh toán (đã báo chưa / đã duyệt chưa).
     *    API chưa có → bỏ qua im lặng.
     */
    try {
      const payResponse = await getPaymentStatus({ slug: slug.value });

      const payResult = payResponse?.data;

      if (payResult && payResult.status === "success" && payResult.data) {
        const data = payResult.data;

        const payStatus = data.Status || data.status || "";

        paymentPending.value =
          data.HasPendingRequest === true ||
          payStatus === "Pending" ||
          payStatus === "Waiting";
      }
    } catch (payError) {
      console.warn("[WeddingPayment] getPaymentStatus error:", payError);
    }

    /*
     * Không xác định được trạng thái thiệp (401...) →
     * vẫn cho phép thanh toán, chỉ cảnh báo nhẹ.
     */
    if (!statusKnown && !status.value) {
      status.value = "";
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (!slug.value) {
    loadError.value = "Đường dẫn không hợp lệ — thiếu slug thiệp.";

    loading.value = false;

    return;
  }

  loadAll();
});

/* =========================================================
   COMPUTED
========================================================= */

const isActivated = computed(() => {
  return status.value === WEDDING_STATUS.ACTIVE;
});

const transferContent = computed(() => {
  return slug.value;
});

const statusLabel = computed(() => {
  if (status.value === WEDDING_STATUS.ACTIVE) return "Đã kích hoạt";

  if (status.value === WEDDING_STATUS.LOCKED) return "Đã khóa";

  return "Chờ duyệt";
});

const statusChipClass = computed(() => {
  if (status.value === WEDDING_STATUS.ACTIVE) return "chip-active";

  if (status.value === WEDDING_STATUS.LOCKED) return "chip-locked";

  return "chip-pending";
});

const amountMismatch = computed(() => {
  return (
    Boolean(paymentInfo.value.amount) &&
    Number(amount.value) > 0 &&
    Number(amount.value) !== Number(paymentInfo.value.amount)
  );
});

/*
 * Mã QR VietQR — chuẩn img.vietqr.io:
 * /image/{bankId}-{accountNo}-{template}.png?amount=&addInfo=&accountName=
 */
const qrUrl = computed(() => {
  const info = paymentInfo.value;

  if (!info.bankId || !info.accountNumber) {
    return "";
  }

  const params = new URLSearchParams();

  if (Number(amount.value) > 0) {
    params.set("amount", String(Math.round(Number(amount.value))));
  }

  if (transferContent.value) {
    params.set("addInfo", transferContent.value);
  }

  if (info.accountName) {
    params.set("accountName", info.accountName);
  }

  return `https://img.vietqr.io/image/${info.bankId}-${info.accountNumber}-compact2.png?${params.toString()}`;
});

/* =========================================================
   SUBMIT — báo đã chuyển khoản
========================================================= */

async function submitNotice() {
  if (submitting.value || !slug.value) {
    return;
  }

  submitting.value = true;

  try {
    const response = await submitPaymentNotice({
      Slug: slug.value,

      Amount: Math.round(Number(amount.value)),

      Content: transferContent.value,

      TransferAt: new Date(transferAt.value).toISOString(),
    });

    const result = response?.data;

    if (result && result.status === "success") {
      noticeDone.value = true;

      paymentPending.value = true;
    } else {
      showToast(result?.message || "Không thể gửi báo cáo thanh toán.");
    }
  } catch (error) {
    console.error("[WeddingPayment] submitPaymentNotice error:", error);

    showToast(
      error?.response?.data?.message ||
        "Không thể gửi báo cáo. API submitPaymentNotice có thể chưa sẵn sàng."
    );
  } finally {
    submitting.value = false;
  }
}

/* =========================================================
   HELPERS
========================================================= */

function nowLocalInput() {
  const date = new Date();

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return date.toISOString().slice(0, 16);
}

function formatVnd(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return "—";
  }

  return `${new Intl.NumberFormat("vi-VN").format(number)} ₫`;
}

async function copyValue(label, value) {
  try {
    await navigator.clipboard.writeText(value);

    showToast(`Đã sao chép ${label.toLowerCase()}`);
  } catch (error) {
    showToast("Không thể sao chép");
  }
}

let toastTimer = null;

function showToast(message) {
  toast.value = message;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2500);
}

/* =========================================================
   NAVIGATION
========================================================= */

function goManage() {
  router.push({ name: "Manage" });
}

function goView() {
  router.push({
    name: "WeddingBySlug",
    params: { slug: slug.value },
  });
}
</script>

<style scoped>
/* ==================================================
   PAGE
================================================== */

.payment-page {
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
  width: min(1100px, calc(100% - 32px));

  margin: 0 auto;
}

/* ==================================================
   BACK ROW
================================================== */

.back-row {
  padding-top: 20px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border: 1px solid rgba(78, 53, 53, 0.14);
  border-radius: 999px;
  background: #fff;
  color: #5c4646;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.back-btn:hover {
  background: #f7f0ec;
  border-color: rgba(143, 77, 67, 0.35);
  color: #8f4d43;
}

/* ==================================================
   HERO
================================================== */

.page-hero {
  position: relative;

  padding: 64px 0 36px;

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

  font-size: clamp(28px, 4vw, 42px);

  line-height: 1.2;
}

.page-hero h1 span {
  color: #8f4d43;
}

.page-hero p {
  max-width: 580px;

  margin: 0 auto;

  color: #6d5a5a;

  font-size: 15px;

  line-height: 1.7;
}

.slug-strong {
  color: #8f4d43;

  font-weight: 700;
}

/* ==================================================
   CONTENT GRID
================================================== */

.payment-content {
  padding-bottom: 80px;
}

.payment-grid {
  display: grid;

  grid-template-columns: 1.1fr 0.9fr;

  gap: 22px;

  align-items: start;
}

/* ==================================================
   CARD
================================================== */

.pay-card {
  background: #fff;

  border: 1px solid rgba(78, 53, 53, 0.12);

  border-radius: 20px;

  padding: 26px 26px 24px;

  box-shadow: 0 14px 40px rgba(78, 53, 53, 0.06);
}

.pay-card-head {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 18px;
}

.pay-card-title {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: #2a1d1d;

  font-size: 16px;

  font-weight: 700;
}

.pay-card-title .v-icon {
  color: #8f4d43;
}

/* ==================================================
   STATUS CHIP
================================================== */

.status-chip {
  padding: 4px 12px;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.02em;

  white-space: nowrap;
}

.chip-active {
  color: #1a6b3c;

  background: rgba(26, 107, 60, 0.1);
}

.chip-pending {
  color: #9a6b1f;

  background: rgba(201, 166, 89, 0.16);
}

.chip-locked {
  color: #a03030;

  background: rgba(160, 48, 48, 0.1);
}

/* ==================================================
   FALLBACK WARNING
================================================== */

.fallback-warning {
  display: flex;

  align-items: flex-start;

  gap: 8px;

  margin-bottom: 16px;

  padding: 10px 13px;

  border: 1px dashed rgba(154, 107, 31, 0.45);

  border-radius: 12px;

  background: rgba(201, 166, 89, 0.1);

  color: #7a5a1c;

  font-size: 12px;

  line-height: 1.55;
}

.fallback-warning .v-icon {
  flex-shrink: 0;

  margin-top: 1px;
}

.fallback-warning code {
  font-size: 11px;

  background: rgba(122, 90, 28, 0.12);

  padding: 1px 5px;

  border-radius: 5px;
}

/* ==================================================
   QR
================================================== */

.qr-wrap {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 8px;

  margin-bottom: 20px;
}

.qr-image {
  width: 210px;

  height: 210px;

  object-fit: contain;

  border: 1px solid rgba(78, 53, 53, 0.12);

  border-radius: 14px;

  background: #fff;
}

.qr-placeholder {
  width: 210px;

  height: 210px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 8px;

  border: 1px dashed rgba(78, 53, 53, 0.25);

  border-radius: 14px;

  color: #a08b8b;

  font-size: 12px;
}

.qr-hint {
  margin: 0;

  color: #9a8686;

  font-size: 12px;
}

/* ==================================================
   BANK ROWS
================================================== */

.bank-rows {
  display: flex;

  flex-direction: column;
}

.bank-row {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 12px 4px;

  border-bottom: 1px solid rgba(78, 53, 53, 0.08);
}

.bank-row:last-child {
  border-bottom: 0;
}

.bank-row.copyable {
  cursor: pointer;

  border-radius: 10px;

  transition: background 0.15s ease;
}

.bank-row.copyable:hover {
  background: #faf5f0;
}

.bank-label {
  width: 118px;

  flex-shrink: 0;

  color: #9a8686;

  font-size: 12px;

  font-weight: 600;
}

.bank-value {
  flex: 1;

  color: #2a1d1d;

  font-size: 14px;

  font-weight: 600;

  word-break: break-word;
}

.bank-value.mono {
  font-family: "SF Mono", "Consolas", monospace;

  letter-spacing: 0.04em;
}

.bank-value.strong {
  color: #8f4d43;

  font-size: 16px;

  font-weight: 800;
}

.copy-btn {
  flex-shrink: 0;

  width: 30px;

  height: 30px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 1px solid rgba(78, 53, 53, 0.14);

  border-radius: 8px;

  background: #fff;

  color: #8f4d43;

  cursor: pointer;

  transition: background 0.15s ease, border-color 0.15s ease;
}

.copy-btn:hover {
  background: #f7f0ec;

  border-color: rgba(143, 77, 67, 0.4);
}

.pay-note {
  margin: 16px 0 0;

  padding-top: 14px;

  border-top: 1px dashed rgba(78, 53, 53, 0.14);

  color: #8a7676;

  font-size: 12px;

  line-height: 1.6;
}

.pay-note strong {
  color: #8f4d43;
}

/* ==================================================
   FORM
================================================== */

.field-label {
  display: block;

  margin: 14px 0 6px;

  color: #6d5a5a;

  font-size: 12px;

  font-weight: 700;
}

.field-input {
  width: 100%;

  padding: 11px 14px;

  border: 1px solid rgba(78, 53, 53, 0.18);

  border-radius: 12px;

  background: #fff;

  color: #2a1d1d;

  font-size: 14px;

  font-weight: 600;

  outline: none;

  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field-input:focus {
  border-color: #8f4d43;

  box-shadow: 0 0 0 3px rgba(143, 77, 67, 0.12);
}

.field-input.mono {
  font-family: "SF Mono", "Consolas", monospace;

  letter-spacing: 0.04em;

  background: #faf7f2;
}

.field-warn {
  margin: 7px 0 0;

  color: #9a6b1f;

  font-size: 12px;

  line-height: 1.5;
}

.pending-note {
  display: flex;

  align-items: flex-start;

  gap: 7px;

  margin: 0 0 14px;

  padding: 10px 13px;

  border: 1px dashed rgba(154, 107, 31, 0.45);

  border-radius: 12px;

  background: rgba(201, 166, 89, 0.1);

  color: #7a5a1c;

  font-size: 12px;

  line-height: 1.55;
}

.pending-note .v-icon {
  flex-shrink: 0;

  margin-top: 1px;
}

/* ==================================================
   SUBMIT
================================================== */

.submit-btn {
  width: 100%;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-top: 20px;

  padding: 13px 20px;

  border: 0;

  border-radius: 999px;

  background: #8f4d43;

  color: #fff;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #7d423a;

  transform: translateY(-1px);

  box-shadow: 0 10px 26px rgba(143, 77, 67, 0.28);
}

.submit-btn:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

.submit-hint {
  margin: 12px 0 0;

  color: #9a8686;

  font-size: 12px;

  line-height: 1.6;

  text-align: center;
}

/* ==================================================
   SUCCESS / NOTICE STATES
================================================== */

.notice-success {
  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  padding: 18px 6px 6px;
}

.notice-success-icon {
  width: 58px;

  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: rgba(26, 107, 60, 0.1);

  color: #1a6b3c;

  margin-bottom: 14px;
}

.notice-success h4 {
  margin: 0 0 8px;

  color: #2a1d1d;

  font-size: 17px;
}

.notice-success p {
  margin: 0 0 18px;

  color: #6d5a5a;

  font-size: 13px;

  line-height: 1.65;
}

/* ==================================================
   STATE BOX (loading error / activated)
================================================== */

.state-box {
  width: min(560px, 100%);

  margin: 30px auto 0;

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  gap: 8px;

  padding: 44px 30px;

  background: #fff;

  border: 1px solid rgba(78, 53, 53, 0.12);

  border-radius: 20px;

  box-shadow: 0 14px 40px rgba(78, 53, 53, 0.06);
}

.state-box .empty-icon {
  width: 58px;

  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: rgba(143, 77, 67, 0.1);

  color: #8f4d43;

  font-size: 24px;

  margin-bottom: 6px;
}

.state-box .empty-icon.activated-icon {
  background: rgba(26, 107, 60, 0.1);

  color: #1a6b3c;
}

.state-box h3 {
  margin: 0;

  color: #2a1d1d;

  font-size: 19px;
}

.state-box p {
  margin: 0 0 10px;

  color: #6d5a5a;

  font-size: 13px;

  line-height: 1.65;
}

.state-actions {
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 10px;

  margin-top: 6px;
}

.retry-btn {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 10px 20px;

  border: 0;

  border-radius: 999px;

  background: #8f4d43;

  color: #fff;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition: background 0.2s ease, transform 0.2s ease;
}

.retry-btn:hover {
  background: #7d423a;

  transform: translateY(-1px);
}

.ghost-btn {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 10px 20px;

  border: 1px solid rgba(78, 53, 53, 0.18);

  border-radius: 999px;

  background: #fff;

  color: #5c4646;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.ghost-btn:hover {
  background: #f7f0ec;

  border-color: rgba(143, 77, 67, 0.35);

  color: #8f4d43;
}

/* ==================================================
   SKELETON
================================================== */

.skeleton-line {
  height: 16px;

  border-radius: 8px;

  background: linear-gradient(90deg, #f1ebe4 25%, #f8f3ee 50%, #f1ebe4 75%);

  background-size: 200% 100%;

  animation: shimmer 1.4s infinite;

  margin-bottom: 14px;
}

.skeleton-line.small {
  width: 70%;
}

.skeleton-line.tiny {
  width: 45%;

  margin-bottom: 0;
}

.skeleton-qr {
  width: 210px;

  height: 210px;

  margin: 10px auto 0;

  border-radius: 14px;

  background: linear-gradient(90deg, #f1ebe4 25%, #f8f3ee 50%, #f1ebe4 75%);

  background-size: 200% 100%;

  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

/* ==================================================
   TOAST
================================================== */

.manage-toast {
  position: fixed;

  left: 50%;

  bottom: 28px;

  transform: translateX(-50%);

  z-index: 3000;

  padding: 11px 20px;

  color: #fff;

  background: #2a1d1d;

  border-radius: 999px;

  font-size: 13px;

  font-weight: 600;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.22);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform: translateX(-50%) translateY(12px);
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 860px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-hero {
    padding: 44px 0 28px;
  }

  .pay-card {
    padding: 20px 18px;
  }

  .bank-label {
    width: 96px;
  }

  .qr-image,
  .qr-placeholder,
  .skeleton-qr {
    width: 180px;

    height: 180px;
  }
}
</style>
