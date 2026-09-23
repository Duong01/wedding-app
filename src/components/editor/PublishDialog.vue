<template>
  <Teleport to="body">
    <Transition name="publish">
      <div class="publish-overlay" @click.self="emit('close')">
        <div
          class="publish-box"
          role="dialog"
          aria-modal="true"
          aria-label="Chia sẻ thiệp"
        >
          <button
            type="button"
            class="publish-close"
            title="Đóng"
            @click="emit('close')"
          >
            <v-icon size="18"> mdi-close </v-icon>
          </button>

          <div class="publish-head">
            <div class="publish-icon">
              <v-icon size="24"> mdi-rocket-launch-outline </v-icon>
            </div>

            <h3 class="publish-title">
              {{ isExpired ? "Thiệp đang tạm ẩn" : "Thiệp đã được xuất bản" }}
            </h3>

            <p class="publish-sub">
              <template v-if="isExpired">
                Thời gian dùng thử đã kết thúc. Nội dung thiệp vẫn được giữ
                nguyên — thanh toán một lần để mở lại cho khách mời.
              </template>

              <template v-else-if="isPaid">
                Thiệp đang hoạt động. Gửi link hoặc mã QR dưới đây cho khách
                mời.
              </template>

              <template v-else>
                Dùng thử miễn phí <strong>{{ trialDays }}</strong> ngày<template
                  v-if="trialEndsAtText"
                >
                  , đến {{ trialEndsAtText }}</template
                >. Sau đó cần thanh toán một lần để thiệp tiếp tục hoạt động.
              </template>
            </p>
          </div>

          <!-- ĐẾM NGƯỢC DÙNG THỬ -->
          <div v-if="!isExpired && !isPaid" class="publish-trial">
            <v-icon size="16"> mdi-timer-sand </v-icon>

            <span>
              Còn <strong>{{ daysLeft }}</strong> ngày dùng thử
            </span>
          </div>

          <!--
            GIÁ GÓI TRẢ PHÍ
            Đây là lần duy nhất chủ thiệp thấy con số cụ thể
            trước khi bấm sang trang thanh toán — nếu để trống
            thì họ phải mở trang thanh toán mới biết giá.
          -->
          <div v-if="!isPaid" class="publish-price">
            <div class="publish-price__row">
              <span class="publish-price__label">
                {{ PAID_PLAN.name }} — thanh toán một lần
              </span>

              <strong class="publish-price__value">
                {{ PAID_PLAN.priceLabel }}
              </strong>
            </div>

            <p class="publish-price__note">
              Giữ thiệp vĩnh viễn, sửa nội dung bất cứ lúc nào. Không phí
              gia hạn hằng năm.
            </p>
          </div>

          <!-- LINK KHÁCH MỜI -->
          <label class="publish-label">Link gửi khách mời</label>

          <div class="publish-link">
            <input :value="guestLink" type="text" readonly @focus="$event.target.select()" />

            <button type="button" class="publish-copy" @click="copyLink">
              <v-icon size="16">
                {{ copied ? "mdi-check" : "mdi-content-copy" }}
              </v-icon>

              <span>{{ copied ? "Đã chép" : "Sao chép" }}</span>
            </button>
          </div>

          <!-- QR -->
          <div v-if="qrUrl" class="publish-qr">
            <img :src="qrUrl" alt="Mã QR mở thiệp" />

            <span>Khách quét mã để mở thiệp</span>
          </div>

          <div class="publish-actions">
            <button type="button" class="publish-btn ghost" @click="emit('close')">
              Đóng
            </button>

            <button
              v-if="!isExpired"
              type="button"
              class="publish-btn ghost"
              @click="openWedding"
            >
              <v-icon size="16"> mdi-open-in-new </v-icon>

              <span>Mở thiệp</span>
            </button>

            <button
              type="button"
              class="publish-btn primary"
              @click="emit('payment')"
            >
              <v-icon size="16"> mdi-credit-card-outline </v-icon>

              <span>{{ isPaid ? "Thông tin thanh toán" : "Thanh toán ngay" }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref } from "vue";

import { PUBLISH_STATE } from "@/model/weddingAdmin";
import { PAID_PLAN } from "@/data/siteContent";

const props = defineProps({
  /* Link đầy đủ gửi khách mời (đã gồm origin). */
  guestLink: { type: String, default: "" },

  trialEndsAt: { type: [String, Date], default: null },
  daysLeft: { type: Number, default: 0 },

  /* Draft | Trial | Expired | Active | Locked */
  publishState: { type: String, default: PUBLISH_STATE.TRIAL },
});

const emit = defineEmits(["close", "payment"]);

const copied = ref(false);

const isExpired = computed(() => props.publishState === PUBLISH_STATE.EXPIRED);

const isPaid = computed(() => props.publishState === PUBLISH_STATE.ACTIVE);

/*
 * Số ngày dùng thử hiển thị trong câu mô tả. Khi đã hết hạn thì
 * DaysLeft = 0 nên phải suy từ TrialEndsAt - PublishedAt là không
 * cần thiết: chỉ hiển thị khi còn hạn.
 */
const trialDays = computed(() => props.daysLeft || 3);

const trialEndsAtText = computed(() => {
  if (!props.trialEndsAt) {
    return "";
  }

  const date = new Date(props.trialEndsAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

/*
 * QR sinh qua dịch vụ công khai — cùng cách Templates.vue
 * đang làm cho hộp thoại chia sẻ demo.
 */
const qrUrl = computed(() => {
  if (!props.guestLink) {
    return "";
  }

  return (
    "https://api.qrserver.com/v1/create-qr-code/" +
    `?size=180x180&margin=8&data=${encodeURIComponent(props.guestLink)}`
  );
});

async function copyLink() {
  if (!props.guestLink) {
    return;
  }

  try {
    await navigator.clipboard.writeText(props.guestLink);

    copied.value = true;

    window.setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("[PublishDialog] copy error:", error);
  }
}

function openWedding() {
  if (props.guestLink) {
    window.open(props.guestLink, "_blank", "noopener");
  }
}
</script>

<style scoped>
.publish-overlay {
  position: fixed;

  inset: 0;

  z-index: 4000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background: rgba(30, 20, 14, 0.42);

  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

.publish-box {
  position: relative;

  width: 100%;

  max-width: 420px;

  max-height: calc(100vh - 40px);

  overflow-y: auto;

  padding: 26px 24px 20px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 20px;

  background: #fffdfb;

  box-shadow: 0 30px 70px rgba(60, 35, 20, 0.28);
}

.publish-close {
  position: absolute;

  top: 12px;

  right: 12px;

  width: 30px;

  height: 30px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 0;

  border-radius: 9px;

  background: transparent;

  color: #8a7a68;

  cursor: pointer;
}

.publish-close:hover {
  background: #f4eee6;
}

.publish-head {
  text-align: center;
}

.publish-icon {
  width: 52px;

  height: 52px;

  margin: 0 auto 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 16px;

  color: #8a6a1f;

  background: #fdf6e3;
}

.publish-title {
  margin: 0;

  color: #2b2118;

  font-family: var(--font-heading), Georgia, serif;
  font-size: 20px;
  font-weight: 600;

  line-height: 1.25;
}

.publish-sub {
  margin: 9px 0 0;

  color: #6b5a4e;

  font-size: 12.5px;

  line-height: 1.6;
}

.publish-trial {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  margin-top: 14px;

  padding: 9px 12px;

  border: 1px solid #ecd9a8;
  border-radius: 11px;

  background: #fdf6e3;

  color: #8a6a1f;

  font-size: 12.5px;
}

.publish-label {
  display: block;

  margin: 18px 0 6px;

  color: #8a7a68;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

/* =====================================================
   GIÁ GÓI TRẢ PHÍ
===================================================== */

.publish-price {
  margin-top: 12px;

  padding: 12px 14px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 12px;

  background: #f9f5ef;
}

.publish-price__row {
  display: flex;

  align-items: baseline;

  justify-content: space-between;

  gap: 12px;
}

.publish-price__label {
  color: #6b5a4e;

  font-size: 12.5px;

  font-weight: 600;
}

.publish-price__value {
  flex: 0 0 auto;

  color: var(--wine, #a63a2e);

  font-family: var(--font-heading), Georgia, serif;

  font-size: 20px;

  font-weight: 700;

  line-height: 1.1;
}

.publish-price__note {
  margin: 6px 0 0;

  color: #8a7a68;

  font-size: 11.5px;

  line-height: 1.55;
}

.publish-link {
  display: flex;

  gap: 8px;
}

.publish-link input {
  flex: 1 1 auto;

  min-width: 0;

  height: 40px;

  padding: 0 12px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 10px;

  background: #f9f5ef;

  color: #4e453c;

  font-family: inherit;
  font-size: 12.5px;
}

.publish-copy {
  flex: 0 0 auto;

  height: 40px;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 0 13px;

  border: 1px solid var(--wine-dark, #7c2a20);
  border-radius: 10px;

  background: linear-gradient(135deg, var(--wine, #a63a2e), #7c2a20);

  color: #fdf6ec;

  font-family: inherit;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
}

.publish-qr {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 7px;

  margin-top: 16px;

  color: #8a7a68;

  font-size: 11.5px;
}

.publish-qr img {
  width: 150px;

  height: 150px;

  padding: 8px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 14px;

  background: #fff;
}

.publish-actions {
  display: flex;

  gap: 9px;

  margin-top: 20px;
}

.publish-btn {
  flex: 1;

  height: 42px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  border: 0;

  border-radius: 11px;

  font-family: inherit;
  font-size: 12.5px;
  font-weight: 650;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.publish-btn.ghost {
  background: #f4eee6;

  color: #6b5a4e;
}

.publish-btn.ghost:hover {
  background: #ece4d9;
}

.publish-btn.primary {
  background: linear-gradient(135deg, var(--wine, #a63a2e), #7c2a20);

  color: #fdf6ec;

  box-shadow: 0 8px 20px rgba(166, 58, 46, 0.24);
}

.publish-btn:hover {
  transform: translateY(-1px);
}

.publish-enter-active,
.publish-leave-active {
  transition: opacity 0.2s ease;
}

.publish-enter-active .publish-box,
.publish-leave-active .publish-box {
  transition: transform 0.22s ease;
}

.publish-enter-from,
.publish-leave-to {
  opacity: 0;
}

.publish-enter-from .publish-box,
.publish-leave-to .publish-box {
  transform: translateY(10px) scale(0.97);
}

@media (max-width: 420px) {
  .publish-actions {
    flex-wrap: wrap;
  }

  .publish-btn {
    flex: 1 1 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .publish-enter-active,
  .publish-leave-active,
  .publish-enter-active .publish-box,
  .publish-leave-active .publish-box {
    transition: none;
  }
}
</style>
