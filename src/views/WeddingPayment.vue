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
          Quét mã QR bên dưới bằng app ngân hàng, sau đó bấm
          <strong>“Tôi đã chuyển khoản”</strong> để chúng tôi đối soát và
          kích hoạt thiệp <strong class="slug-strong">/{{ slug }}</strong>.
        </p>
      </div>
    </section>

    <!-- =====================================================
         CONTENT
    ====================================================== -->
    <section class="container payment-content">
      <!-- LOADING -->
      <div v-if="loading" class="payment-grid">
        <div class="pay-card">
          <div class="skeleton-line"></div>

          <div class="skeleton-line small"></div>

          <div class="skeleton-line tiny"></div>

          <div class="skeleton-qr"></div>
        </div>

        <div class="pay-card">
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

          <!-- ==========================================
               CHƯA CẤU HÌNH TÀI KHOẢN
               Cố ý KHÔNG hiện số nào. Thà không thanh toán
               được còn hơn chỉ sai số tài khoản.
          =========================================== -->
          <div v-if="!hasPaymentInfo" class="not-configured">
            <div class="not-configured-icon">
              <v-icon size="26"> mdi-bank-off-outline </v-icon>
            </div>

            <h4>Chưa có thông tin tài khoản nhận thanh toán</h4>

            <p>
              Hệ thống chưa được cấu hình tài khoản nhận tiền, nên
              <strong>chưa thể hiển thị mã QR</strong>. Vui lòng liên hệ hỗ
              trợ để được kích hoạt thủ công — bạn chưa cần chuyển khoản gì.
            </p>

            <div class="state-actions">
              <a
                v-if="supportPhone"
                :href="`tel:${phoneHref(supportPhone)}`"
                class="retry-btn"
              >
                Gọi {{ supportPhone }}
              </a>

              <a
                v-if="supportEmail"
                :href="`mailto:${supportEmail}`"
                class="ghost-btn"
              >
                Gửi email hỗ trợ
              </a>
            </div>
          </div>

          <!-- ==========================================
               ĐÃ CẤU HÌNH — QR + THÔNG TIN
          =========================================== -->
          <template v-else>
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
                Quét bằng app ngân hàng — số tiền và nội dung đã điền sẵn
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

              <div
                class="bank-row copyable"
                @click="copyValue('Số tài khoản', paymentInfo.accountNumber)"
              >
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

              <div
                class="bank-row copyable"
                @click="copyValue('Số tiền', String(payAmount))"
              >
                <span class="bank-label">Số tiền</span>

                <span class="bank-value strong">
                  {{ formatVnd(payAmount) }}
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
              <strong>slug của thiệp</strong> — giúp chúng tôi đối soát và
              kích hoạt đúng thiệp của bạn.
            </p>
          </template>
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

          <!-- ==========================================
               ĐÃ GỬI — TIẾN ĐỘ THẬT
          =========================================== -->
          <div v-if="currentRequest" class="notice-block">
            <div
              class="notice-success-icon"
              :class="{ rejected: isRejected }"
            >
              <v-icon size="26">
                {{
                  isRejected
                    ? "mdi-alert-circle-outline"
                    : "mdi-check-circle-outline"
                }}
              </v-icon>
            </div>

            <h4>
              {{ isRejected ? "Yêu cầu chưa được chấp nhận" : "Đã ghi nhận yêu cầu" }}
            </h4>

            <!-- BẰNG CHỨNG CẦM TAY — mã yêu cầu + giờ gửi -->
            <div class="receipt">
              <div class="receipt-row">
                <span>Mã yêu cầu</span>
                <strong>#{{ currentRequest.id }}</strong>
              </div>

              <div class="receipt-row">
                <span>Gửi lúc</span>
                <strong>{{ formatDateTime(currentRequest.createdAt) }}</strong>
              </div>

              <div class="receipt-row">
                <span>Số tiền</span>
                <strong>{{ formatVnd(currentRequest.amount) }}</strong>
              </div>

              <div class="receipt-row">
                <span>Nội dung CK</span>
                <strong class="mono">{{ currentRequest.content }}</strong>
              </div>
            </div>

            <!-- LÝ DO TỪ CHỐI -->
            <div v-if="isRejected && currentRequest.adminNote" class="reject-note">
              <v-icon size="15"> mdi-information-outline </v-icon>

              <span>
                <strong>Lý do:</strong>
                {{ currentRequest.adminNote }}
              </span>
            </div>

            <!-- THANH TIẾN ĐỘ 3 BƯỚC -->
            <ol class="timeline">
              <li
                v-for="step in timeline"
                :key="step.key"
                class="timeline-step"
                :class="step.state"
              >
                <span class="timeline-dot">
                  <v-icon v-if="step.state === 'done'" size="12">
                    mdi-check
                  </v-icon>
                </span>

                <span class="timeline-body">
                  <span class="timeline-label">{{ step.label }}</span>

                  <span v-if="step.time" class="timeline-time">
                    {{ step.time }}
                  </span>

                  <span v-else-if="step.hint" class="timeline-hint">
                    {{ step.hint }}
                  </span>
                </span>
              </li>
            </ol>

            <p class="notice-copy">
              Thông thường chúng tôi xác nhận trong
              <strong>khoảng 5 phút</strong> (giờ hành chính
              {{ supportHours }}). Quá 30 phút chưa thấy cập nhật, bạn gọi
              <strong v-if="supportPhone">{{ supportPhone }}</strong>
              <strong v-else>số hỗ trợ</strong> để được kiểm tra ngay.
            </p>

            <div class="state-actions">
              <button
                type="button"
                class="retry-btn"
                :disabled="checking"
                @click="loadAll"
              >
                <v-progress-circular
                  v-if="checking"
                  indeterminate
                  size="13"
                  width="2"
                />

                Kiểm tra trạng thái
              </button>

              <button
                v-if="isRejected"
                type="button"
                class="ghost-btn"
                @click="resetNotice"
              >
                Gửi lại
              </button>

              <button v-else type="button" class="ghost-btn" @click="goManage">
                Về quản lý thiệp
              </button>
            </div>
          </div>

          <!-- ==========================================
               CHƯA GỬI — 1 NÚT DUY NHẤT
          =========================================== -->
          <template v-else>
            <p class="confirm-copy">
              Sau khi chuyển khoản xong, bấm nút bên dưới để chúng tôi biết
              mà kiểm tra sao kê. Bạn <strong>không cần nhập gì thêm</strong>.
            </p>

            <button
              type="button"
              class="submit-btn"
              :disabled="submitting || !hasPaymentInfo"
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

            <ul class="reassure">
              <li>
                <v-icon size="14"> mdi-shield-check-outline </v-icon>
                Bạn <strong>không cần chuyển khoản lại</strong> — nếu đã
                chuyển rồi thì bỏ qua bước này.
              </li>

              <li>
                <v-icon size="14"> mdi-shield-check-outline </v-icon>
                Nội dung thiệp của bạn <strong>vẫn được giữ nguyên</strong>
                trong lúc chờ xác nhận.
              </li>

              <li v-if="refundPolicy">
                <v-icon size="14"> mdi-shield-check-outline </v-icon>
                {{ refundPolicy }}
              </li>

              <li>
                <v-icon size="14"> mdi-shield-check-outline </v-icon>
                Thanh toán <strong>một lần</strong> — không phí gia hạn hằng
                năm, không tự động trừ tiền.
              </li>
            </ul>
          </template>
        </div>
      </div>

      <!-- =====================================================
           KHỐI NIỀM TIN — ai nhận tiền, liên hệ ai
      ====================================================== -->
      <div v-if="!loading && !loadError && !isActivated" class="trust-card">
        <div class="trust-head">
          <v-icon size="18"> mdi-domain </v-icon>

          <span>Đơn vị cung cấp dịch vụ</span>
        </div>

        <dl class="trust-rows">
          <template v-if="business.legalName">
            <dt>Đơn vị</dt>
            <dd>{{ business.legalName }}</dd>
          </template>

          <template v-if="business.taxCode">
            <dt>Mã số thuế</dt>
            <dd class="mono">{{ business.taxCode }}</dd>
          </template>

          <template v-if="business.address">
            <dt>Địa chỉ</dt>
            <dd>{{ business.address }}</dd>
          </template>

          <template v-if="supportPhone">
            <dt>Hỗ trợ</dt>
            <dd>
              <a :href="`tel:${phoneHref(supportPhone)}`">{{ supportPhone }}</a>
            </dd>
          </template>

          <template v-if="supportEmail">
            <dt>Email</dt>
            <dd>
              <a :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>
            </dd>
          </template>

          <template v-if="supportHours">
            <dt>Giờ làm việc</dt>
            <dd>{{ supportHours }}</dd>
          </template>
        </dl>

        <p class="trust-note">
          <v-icon size="14"> mdi-information-outline </v-icon>
          Thông tin trên là của đơn vị vận hành website này. Nếu có bất kỳ
          điểm nào bạn thấy chưa rõ, hãy liên hệ trước khi chuyển khoản —
          chúng tôi không cần bạn vội.
        </p>
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

import { PUBLISH_STATE, WEDDING_STATUS } from "@/model/weddingAdmin";

import {
  BUSINESS,
  CONTACT,
  PAID_PLAN,
  REFUND_POLICY,
  phoneHref,
} from "@/data/siteContent";

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
   STATE
========================================================= */

const loading = ref(true);

const checking = ref(false);

const loadError = ref("");

const status = ref("");

/*
 * Trạng thái xuất bản / dùng thử (Draft | Trial | Expired | Active | Locked).
 * Trang này là nơi chủ thiệp hết hạn dùng thử đổ về, nên phải phân biệt
 * "đã thanh toán" với "đang dùng thử" — cột Status thô không làm được
 * (cả hai đều là 'Active').
 */
const publishState = ref("");

/*
 * Thông tin tài khoản nhận tiền. null = server CHƯA cấu hình.
 *
 * Trước đây chỗ này rơi về một object hardcode (Vietcombank /
 * 0123456789 / "CONG TY THIET KE THIEP CUOI") nên khách quét QR là
 * chuyển tiền vào số không tồn tại. Nay null thì hiện khối "chưa cấu
 * hình" và KHÔNG hiện số nào.
 */
const paymentInfo = ref(null);

/* Yêu cầu thanh toán mới nhất của thiệp (từ server). */
const paymentStatus = ref(null);

/* Bản ghi vừa gửi trong phiên này — hiện ngay, không chờ gọi lại API. */
const notice = ref(null);

const submitting = ref(false);

const toast = ref("");

/* =========================================================
   LOAD
========================================================= */

async function loadAll() {
  // Lần đầu thì hiện skeleton; các lần "Kiểm tra trạng thái" sau chỉ
  // xoay nút, không làm trang nhấp nháy.
  if (loading.value) {
    loading.value = true;
  } else {
    checking.value = true;
  }

  loadError.value = "";

  try {
    /*
     * 1. Trạng thái thiệp — để biết đã kích hoạt chưa.
     *    getWeddingStatus là API công khai ([AllowAnonymous]) nên
     *    khách mở trang thanh toán không cần đăng nhập vẫn đọc được.
     */
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

        publishState.value =
          statusResult.data.PublishState ||
          statusResult.data.publishState ||
          "";
      } else if (statusResult && statusResult.status !== "success") {
        loadError.value = statusResult.message || "Không tìm thấy thiệp này.";

        return;
      }
    } catch (statusError) {
      console.warn("[WeddingPayment] getWeddingStatus error:", statusError);
    }

    /*
     * 2. Thông tin tài khoản nhận thanh toán.
     *    Server trả error khi chưa cấu hình → paymentInfo giữ null →
     *    UI hiện khối "chưa cấu hình", không hiện số nào.
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
          bankName: data.BankName || data.bankName || "",

          bankId: data.BankId || data.bankId || "",

          accountName: data.AccountName || data.accountName || "",

          accountNumber: data.AccountNumber || data.accountNumber || "",

          amount: Number(data.Amount || data.amount || 0),
        };
      } else {
        paymentInfo.value = null;
      }
    } catch (infoError) {
      console.warn("[WeddingPayment] getPaymentInfo error:", infoError);

      paymentInfo.value = null;
    }

    /*
     * 3. Trạng thái thanh toán — dựng thanh tiến độ 3 bước từ đây.
     */
    try {
      const payResponse = await getPaymentStatus({ slug: slug.value });

      const payResult = payResponse?.data;

      if (payResult && payResult.status === "success" && payResult.data) {
        const data = payResult.data;

        paymentStatus.value = {
          id: Number(data.Id || data.id || 0),

          amount: Number(data.Amount || data.amount || 0),

          content: data.Content || data.content || "",

          status: data.Status || data.status || "",

          createdAt: data.CreatedAt || data.createdAt || "",

          reviewedAt: data.ReviewedAt || data.reviewedAt || "",

          adminNote: data.AdminNote || data.adminNote || "",
        };
      } else {
        paymentStatus.value = null;
      }
    } catch (payError) {
      console.warn("[WeddingPayment] getPaymentStatus error:", payError);

      paymentStatus.value = null;
    }
  } finally {
    loading.value = false;

    checking.value = false;
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
  return publishState.value === PUBLISH_STATE.ACTIVE;
});

/*
 * Chỉ coi là "đã cấu hình" khi có đủ số tài khoản + mã ngân hàng.
 * Thiếu một trong hai thì QR sẽ trỏ sai chỗ → coi như chưa cấu hình.
 */
const hasPaymentInfo = computed(() => {
  const info = paymentInfo.value;

  return Boolean(info && info.bankId && info.accountNumber);
});

const transferContent = computed(() => {
  return slug.value;
});

/*
 * Số tiền hiển thị: ưu tiên giá server cấu hình, chưa có thì lấy giá
 * gói đang bán (PAID_PLAN) để QR vẫn điền sẵn số tiền.
 */
const payAmount = computed(() => {
  const configured = Number(paymentInfo.value?.amount || 0);

  if (configured > 0) {
    return configured;
  }

  return Number(PAID_PLAN?.price || 0);
});

const statusLabel = computed(() => {
  if (publishState.value === PUBLISH_STATE.ACTIVE) return "Đã kích hoạt";

  if (publishState.value === PUBLISH_STATE.TRIAL) return "Đang dùng thử";

  if (publishState.value === PUBLISH_STATE.EXPIRED) return "Hết hạn dùng thử";

  if (publishState.value === PUBLISH_STATE.LOCKED) return "Đã khóa";

  if (status.value === WEDDING_STATUS.LOCKED) return "Đã khóa";

  return "Chờ duyệt";
});

const statusChipClass = computed(() => {
  if (publishState.value === PUBLISH_STATE.ACTIVE) return "chip-active";

  if (publishState.value === PUBLISH_STATE.TRIAL) return "chip-trial";

  if (publishState.value === PUBLISH_STATE.EXPIRED) return "chip-locked";

  if (publishState.value === PUBLISH_STATE.LOCKED) return "chip-locked";

  if (status.value === WEDDING_STATUS.LOCKED) return "chip-locked";

  return "chip-pending";
});

/*
 * Yêu cầu đang hiển thị: bản vừa gửi trong phiên này, hoặc bản mới nhất
 * đọc từ server (trường hợp khách quay lại trang sau).
 */
const currentRequest = computed(() => {
  if (notice.value) {
    return notice.value;
  }

  const fromServer = paymentStatus.value;

  if (fromServer && fromServer.id > 0) {
    return fromServer;
  }

  return null;
});

const isRejected = computed(() => {
  return currentRequest.value?.status === "Rejected";
});

/*
 * Thanh tiến độ 3 bước — dựng từ trạng thái THẬT của server, không phải
 * animation trang trí. Bước 1 luôn xong (đã có yêu cầu), bước 2 xong khi
 * Admin đã xử lý, bước 3 xong khi thiệp thật sự được kích hoạt.
 */
const timeline = computed(() => {
  const request = currentRequest.value;

  const approved = request?.status === "Approved";

  const rejected = request?.status === "Rejected";

  const activated = publishState.value === PUBLISH_STATE.ACTIVE;

  return [
    {
      key: "sent",
      label: "Đã gửi yêu cầu",
      state: "done",
      time: formatDateTime(request?.createdAt),
      hint: "",
    },
    {
      key: "review",
      label: rejected ? "Đã kiểm tra — chưa khớp" : "Đang đối soát sao kê",
      state: rejected ? "failed" : approved || activated ? "done" : "active",
      time: approved || rejected ? formatDateTime(request?.reviewedAt) : "",
      hint:
        rejected || approved || activated
          ? ""
          : "Chúng tôi đang kiểm tra giao dịch trong sao kê ngân hàng",
    },
    {
      key: "active",
      label: "Đã kích hoạt thiệp",
      state: activated ? "done" : "pending",
      time: activated ? "" : "",
      hint: activated ? "" : "Thiệp mở cho khách mời ngay khi bước 2 xong",
    },
  ];
});

/* =========================================================
   TRUST BLOCK
========================================================= */

const business = BUSINESS;

const supportPhone = computed(() => {
  return BUSINESS.supportPhone || CONTACT.phone || "";
});

const supportEmail = computed(() => {
  return BUSINESS.supportEmail || CONTACT.email || "";
});

const supportHours = computed(() => {
  return CONTACT.hours || "";
});

const refundPolicy = REFUND_POLICY;

/* =========================================================
   QR — chuẩn img.vietqr.io
   /image/{bankId}-{accountNo}-{template}.png?amount=&addInfo=&accountName=
========================================================= */

const qrUrl = computed(() => {
  const info = paymentInfo.value;

  if (!hasPaymentInfo.value) {
    return "";
  }

  const params = new URLSearchParams();

  if (payAmount.value > 0) {
    params.set("amount", String(Math.round(payAmount.value)));
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
  if (submitting.value || !slug.value || !hasPaymentInfo.value) {
    return;
  }

  submitting.value = true;

  try {
    const response = await submitPaymentNotice({
      Slug: slug.value,

      Amount: Math.round(payAmount.value),

      Content: transferContent.value,

      // Khách bấm nút ngay sau khi chuyển khoản → giờ hiện tại là mốc
      // gần đúng nhất. Không bắt khách tự nhập lại thời gian.
      TransferAt: new Date().toISOString(),
    });

    const result = response?.data;

    if (result && result.status === "success") {
      const saved = result.data || {};

      notice.value = {
        id: Number(saved.Id || saved.id || 0),

        amount: Number(saved.Amount || saved.amount || payAmount.value),

        content: saved.Content || saved.content || transferContent.value,

        status: saved.Status || saved.status || "Pending",

        createdAt: saved.CreatedAt || saved.createdAt || new Date().toISOString(),

        reviewedAt: "",

        adminNote: "",
      };

      showToast("Đã ghi nhận. Chúng tôi sẽ kiểm tra và kích hoạt thiệp.");
    } else {
      showToast(result?.message || "Không thể gửi báo chuyển khoản.");
    }
  } catch (error) {
    console.error("[WeddingPayment] submitPaymentNotice error:", error);

    showToast(
      error?.response?.data?.message ||
        "Không thể gửi báo chuyển khoản. Vui lòng thử lại."
    );
  } finally {
    submitting.value = false;
  }
}

/* Bị từ chối → cho gửi lại: xoá bản ghi tạm để hiện lại nút. */
function resetNotice() {
  notice.value = null;

  paymentStatus.value = null;
}

/* =========================================================
   HELPERS
========================================================= */

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
   PAGE — chrome chung (page-glow, back-btn, page-hero,
   status-chip, state-box, retry/ghost-btn, skeleton,
   toast) đã gom vào app.css.
================================================== */

.payment-page {
  position: relative;

  min-height: 100vh;

  background: var(--studio-paper, #f7f1e6);

  overflow: hidden;
}

.container {
  width: min(1100px, calc(100% - 32px));

  margin: 0 auto;
}

.slug-strong {
  color: var(--studio-seal, #a63a2e);

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
  background: var(--studio-card, #fffdf8);

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 20px;

  padding: 26px 26px 24px;

  box-shadow: 0 14px 40px rgba(43, 33, 24, 0.06);
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

  color: var(--studio-ink, #2b2118);

  font-size: 16px;

  font-weight: 700;
}

.pay-card-title .v-icon {
  color: var(--studio-seal, #a63a2e);
}

/* ==================================================
   CHƯA CẤU HÌNH TÀI KHOẢN
================================================== */

.not-configured {
  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  gap: 10px;

  padding: 26px 8px 8px;
}

.not-configured-icon {
  width: 58px;

  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: var(--app-warn-soft, rgba(185, 151, 91, 0.18));

  color: var(--app-warn, #9a6b1f);
}

.not-configured h4 {
  margin: 0;

  color: var(--studio-ink, #2b2118);

  font-size: 16px;
}

.not-configured p {
  margin: 0;

  max-width: 380px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13px;

  line-height: 1.7;
}

.not-configured .state-actions {
  margin-top: 6px;
}

.not-configured a {
  text-decoration: none;
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

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

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

  border: 1px dashed var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  border-radius: 14px;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;
}

.qr-hint {
  margin: 0;

  color: var(--studio-ink-faint, #8a7a68);

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

  border-bottom: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
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
  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
}

.bank-label {
  width: 118px;

  flex-shrink: 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;

  font-weight: 600;
}

.bank-value {
  flex: 1;

  color: var(--studio-ink, #2b2118);

  font-size: 14px;

  font-weight: 600;

  word-break: break-word;
}

.bank-value.mono {
  font-family: "SF Mono", "Consolas", monospace;

  letter-spacing: 0.04em;
}

.bank-value.strong {
  color: var(--studio-seal, #a63a2e);

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

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 8px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-seal, #a63a2e);

  cursor: pointer;

  transition: background 0.15s ease, border-color 0.15s ease;
}

.copy-btn:hover {
  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  border-color: rgba(185, 151, 91, 0.55);
}

.pay-note {
  margin: 16px 0 0;

  padding-top: 14px;

  border-top: 1px dashed var(--studio-line, rgba(43, 33, 24, 0.14));

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12px;

  line-height: 1.6;
}

.pay-note strong {
  color: var(--studio-seal, #a63a2e);
}

/* ==================================================
   XÁC NHẬN
================================================== */

.confirm-copy {
  margin: 0 0 4px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13px;

  line-height: 1.7;
}


.submit-btn {
  width: 100%;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-top: 18px;

  padding: 13px 20px;

  border: 0;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);

  color: #fdf6ec;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow: 0 10px 26px rgba(166, 58, 46, 0.28);
}

.submit-btn:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

/* ==================================================
   TRẤN AN — đặt ngay dưới nút, đúng chỗ khách do dự
================================================== */

.reassure {
  list-style: none;

  margin: 18px 0 0;

  padding: 0;

  display: flex;

  flex-direction: column;

  gap: 9px;
}

.reassure li {
  display: flex;

  align-items: flex-start;

  gap: 8px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12.5px;

  line-height: 1.6;
}

.reassure .v-icon {
  flex-shrink: 0;

  margin-top: 2px;

  color: var(--app-ok, #2e6b3f);
}

.reassure strong {
  color: var(--studio-ink, #2b2118);
}

/* ==================================================
   ĐÃ GỬI — BIÊN NHẬN + TIẾN ĐỘ
================================================== */

.notice-block {
  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  padding: 6px 0 0;
}

.notice-success-icon {
  width: 58px;

  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: var(--app-ok-soft, rgba(46, 107, 63, 0.1));

  color: var(--app-ok, #2e6b3f);

  margin-bottom: 14px;
}

.notice-success-icon.rejected {
  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));

  color: var(--app-danger, #a03030);
}

.notice-block h4 {
  margin: 0 0 16px;

  color: var(--studio-ink, #2b2118);

  font-size: 17px;
}

/* Biên nhận — bằng chứng cầm tay để khách đối chiếu khi cần hỗ trợ */
.receipt {
  width: 100%;

  padding: 12px 14px;

  border: 1px dashed var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  border-radius: 12px;

  background: var(--studio-paper, #f7f1e6);

  text-align: left;
}

.receipt-row {
  display: flex;

  align-items: baseline;

  justify-content: space-between;

  gap: 12px;

  padding: 5px 0;

  font-size: 12.5px;
}

.receipt-row span {
  color: var(--studio-ink-faint, #8a7a68);
}

.receipt-row strong {
  color: var(--studio-ink, #2b2118);

  font-weight: 700;

  word-break: break-word;

  text-align: right;
}

.receipt-row strong.mono {
  font-family: "SF Mono", "Consolas", monospace;
}

.reject-note {
  width: 100%;

  display: flex;

  align-items: flex-start;

  gap: 7px;

  margin-top: 12px;

  padding: 10px 13px;

  border-radius: 12px;

  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));

  color: var(--app-danger, #a03030);

  font-size: 12.5px;

  line-height: 1.6;

  text-align: left;
}

.reject-note .v-icon {
  flex-shrink: 0;

  margin-top: 2px;
}

/* Thanh tiến độ 3 bước */
.timeline {
  list-style: none;

  width: 100%;

  margin: 18px 0 0;

  padding: 0;

  text-align: left;
}

.timeline-step {
  position: relative;

  display: flex;

  align-items: flex-start;

  gap: 11px;

  padding-bottom: 16px;
}

.timeline-step:last-child {
  padding-bottom: 0;
}

/* Đường nối giữa các bước */
.timeline-step:not(:last-child)::before {
  content: "";

  position: absolute;

  left: 8px;

  top: 20px;

  bottom: 2px;

  width: 1px;

  background: var(--studio-line, rgba(43, 33, 24, 0.14));
}

.timeline-dot {
  position: relative;

  z-index: 1;

  flex-shrink: 0;

  width: 17px;

  height: 17px;

  margin-top: 1px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  border: 1.5px solid var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  background: var(--studio-card, #fffdf8);

  color: #fff;
}

.timeline-step.done .timeline-dot {
  border-color: var(--app-ok, #2e6b3f);

  background: var(--app-ok, #2e6b3f);
}

.timeline-step.active .timeline-dot {
  border-color: var(--app-warn, #9a6b1f);

  background: var(--app-warn-soft, rgba(185, 151, 91, 0.18));
}

.timeline-step.failed .timeline-dot {
  border-color: var(--app-danger, #a03030);

  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));
}

.timeline-body {
  display: flex;

  flex-direction: column;

  gap: 2px;

  min-width: 0;
}

.timeline-label {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 13px;

  font-weight: 600;
}

.timeline-step.done .timeline-label,
.timeline-step.active .timeline-label,
.timeline-step.failed .timeline-label {
  color: var(--studio-ink, #2b2118);
}

.timeline-time {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 11.5px;
}

.timeline-hint {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 11.5px;

  line-height: 1.5;
}

.notice-copy {
  margin: 18px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12.5px;

  line-height: 1.7;
}

.notice-copy strong {
  color: var(--studio-seal, #a63a2e);
}

.notice-block .state-actions {
  margin-top: 18px;
}

/* ==================================================
   KHỐI NIỀM TIN
================================================== */

.trust-card {
  margin-top: 22px;

  padding: 22px 26px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 20px;

  background: var(--studio-card, #fffdf8);
}

.trust-head {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 14px;

  color: var(--studio-ink, #2b2118);

  font-size: 15px;

  font-weight: 700;
}

.trust-head .v-icon {
  color: var(--studio-foil, #b9975b);
}

.trust-rows {
  display: grid;

  grid-template-columns: 130px 1fr;

  gap: 8px 16px;

  margin: 0;
}

.trust-rows dt {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;

  font-weight: 600;
}

.trust-rows dd {
  margin: 0;

  color: var(--studio-ink, #2b2118);

  font-size: 13px;

  font-weight: 600;

  word-break: break-word;
}

.trust-rows dd.mono {
  font-family: "SF Mono", "Consolas", monospace;
}

.trust-rows a {
  color: var(--studio-seal, #a63a2e);

  text-decoration: none;
}

.trust-rows a:hover {
  text-decoration: underline;
}

.trust-note {
  display: flex;

  align-items: flex-start;

  gap: 7px;

  margin: 16px 0 0;

  padding-top: 14px;

  border-top: 1px dashed var(--studio-line, rgba(43, 33, 24, 0.14));

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;

  line-height: 1.6;
}

.trust-note .v-icon {
  flex-shrink: 0;

  margin-top: 2px;
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

  .trust-card {
    padding: 18px;
  }

  .trust-rows {
    grid-template-columns: 1fr;

    gap: 2px;
  }

  .trust-rows dd {
    margin-bottom: 8px;
  }
}
</style>
