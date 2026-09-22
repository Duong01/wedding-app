<template>
  <section class="gifts">
    <!-- =========================
         HEADER
    ========================== -->
    <div class="gg-eyebrow">GỬI YÊU THƯƠNG</div>

    <h2 class="gg-title">Hộp Quà Mừng</h2>

    <p class="gg-lead">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <!-- =========================
         GIFT BOX
    ========================== -->
    <div class="gift-stage">
      <button
        type="button"
        class="gift-box-button"
        aria-label="Mở hộp mừng cưới"
        @click="openGift"
      >
        <!-- Lấp lánh -->
        <span class="gift-sparkle sparkle-1">✦</span>
        <span class="gift-sparkle sparkle-2">✦</span>
        <span class="gift-sparkle sparkle-3">✦</span>
        <span class="gift-sparkle sparkle-4">✦</span>

        <!-- Confetti -->
        <span
          v-for="(color, index) in confetti"
          :key="index"
          class="gift-confetti"
          :class="`confetti-${index + 1}`"
          :style="{ backgroundColor: color }"
        ></span>

        <!-- Hộp quà -->
        <span class="gift-bob">
          <img :src="gift" alt="Hộp mừng cưới" loading="lazy" decoding="async" />
        </span>

        <!-- Bóng đổ -->
        <span class="gift-shadow"></span>
      </button>

      <p class="gift-hint">CHẠM ĐỂ MỞ</p>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="gift-dialog">
        <div v-if="showGiftDialog" class="gift-dialog" @click.self="closeGift">
          <div class="gift-dialog-backdrop" @click="closeGift"></div>

          <div
            class="gift-dialog-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-dialog-title"
          >
            <button
              type="button"
              class="dialog-close"
              aria-label="Đóng hộp mừng cưới"
              @click="closeGift"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="dialog-eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="gift-dialog-title">Hộp Quà Mừng</h3>

            <p class="dialog-description">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có
              thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <!-- =================================================
                 BANK ACCOUNTS
            ================================================== -->
            <div v-if="gifts.length" class="account-grid">
              <article
                v-for="(item, index) in gifts"
                :key="item.Id || index"
                class="account-card"
              >
                <div class="account-heading">
                  <div class="account-label">
                    {{
                      item.Name || item.BankName || `TÀI KHOẢN ${index + 1}`
                    }}
                  </div>

                  <div v-if="item.BankName" class="account-bank">
                    {{ item.BankName }}
                  </div>
                </div>

                <!-- QR -->
                <button
                  v-if="item.QrCode"
                  type="button"
                  class="qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <img
                    :src="item.QrCode"
                    :alt="item.Name || 'QR mừng cưới'"
                    class="qr-code"
                  />

                  <span class="qr-hint">CHẠM VÀO QR ĐỂ XEM LỚN</span>
                </button>

                <!-- Account information -->
                <div class="account-info">
                  <div class="info-row">
                    <span class="info-label">CHỦ TÀI KHOẢN</span>

                    <span class="info-value">
                      {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                    </span>
                  </div>

                  <div class="info-divider"></div>

                  <div class="info-row">
                    <span class="info-label">SỐ TÀI KHOẢN</span>

                    <span class="info-value account-number">
                      {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                    </span>

                    <button
                      type="button"
                      class="copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="account-description">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="account-description">
              Thông tin chuyển khoản đang được cập nhật.
            </div>
          </div>
        </div>
      </Transition>

      <!-- =====================================================
           QR PREVIEW
      ====================================================== -->
      <Transition name="qr-preview">
        <div v-if="previewQr" class="qr-preview" @click.self="closeQr">
          <div class="qr-preview-backdrop" @click="closeQr"></div>

          <div class="qr-preview-card">
            <button
              type="button"
              class="qr-preview-close"
              aria-label="Đóng QR"
              @click="closeQr"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <img
              :src="previewQr.QrCode"
              :alt="previewQr.Name || 'QR mừng cưới'"
            />

            <p>{{ previewQr.Name || previewQr.BankName || "QR mừng cưới" }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import gift from "@/assets/romatic-pink/gift.webp";

const props = defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },
});

const confetti = [
  "#ec4899",
  "var(--gg-deep, #933845)",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#facc15",
  "var(--gg-rose, #cb5d6c)",
  "#f97316",
];

const showGiftDialog = ref(false);
const previewQr = ref(null);

/**
 * Mở hộp quà
 */
function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("gift-dialog-open");
}

/**
 * Đóng hộp quà
 */
function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("gift-dialog-open");
}

/**
 * Mở QR lớn
 */
function openQr(item) {
  if (!item?.QrCode) return;

  previewQr.value = item;
}

/**
 * Đóng QR
 */
function closeQr() {
  previewQr.value = null;
}

/**
 * Copy số tài khoản
 */
async function copyAccount(item) {
  const number = item?.AccountNumber || item?.Number;

  if (!number) return;

  try {
    await navigator.clipboard.writeText(String(number));

    console.log("Đã sao chép số tài khoản");
  } catch (error) {
    console.warn("Không thể sao chép số tài khoản", error);
  }
}

/**
 * ESC để đóng popup
 */
function handleEscape(event) {
  if (event.key !== "Escape") return;

  if (previewQr.value) {
    closeQr();
    return;
  }

  if (showGiftDialog.value) {
    closeGift();
  }
}

document.addEventListener("keydown", handleEscape);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);

  document.body.classList.remove("gift-dialog-open");
});
</script>

<style scoped>
.gifts {
  text-align: center;
}

/* =====================================================
   GIFT STAGE
===================================================== */

.gift-stage {
  margin-top: 26px;
}

.gift-box-button {
  position: relative;

  width: 260px;
  height: 280px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: transparent;

  cursor: pointer;
}

/* =====================================================
   HỘP QUÀ
===================================================== */

.gift-bob {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 200px;
  height: 220px;

  animation: gift-bob 3.2s ease-in-out infinite;
}

.gift-bob img {
  width: 170px;
  max-height: 220px;

  object-fit: contain;

  filter: drop-shadow(0 12px 22px rgba(147, 56, 69, 0.28));
}

@keyframes gift-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Bóng đổ dưới hộp */
.gift-shadow {
  position: absolute;
  bottom: 22px;
  left: 50%;

  width: 144px;
  height: 12px;

  transform: translateX(-50%);

  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.45);
  filter: blur(4px);

  animation: gift-shadow 3.2s ease-in-out infinite;
}

@keyframes gift-shadow {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.45;
  }
  50% {
    transform: translateX(-50%) scale(0.88);
    opacity: 0.3;
  }
}

/* =====================================================
   LẤP LÁNH
===================================================== */

.gift-sparkle {
  position: absolute;
  z-index: 3;

  color: var(--gg-deep, #933845);
  font-size: 14px;

  animation: sparkle 2.4s ease-in-out infinite;
}

.sparkle-1 {
  top: 34px;
  left: 34px;
}

.sparkle-2 {
  top: 58px;
  right: 30px;
  animation-delay: 0.6s;
}

.sparkle-3 {
  bottom: 62px;
  left: 26px;
  animation-delay: 1.2s;
}

.sparkle-4 {
  bottom: 40px;
  right: 38px;
  animation-delay: 1.8s;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

/* =====================================================
   CONFETTI
===================================================== */

.gift-confetti {
  position: absolute;
  z-index: 1;

  width: 7px;
  height: 7px;

  border-radius: 2px;

  opacity: 0;

  animation: confetti 3.6s ease-in-out infinite;
}

.confetti-1 {
  top: 20px;
  left: 60px;
  animation-delay: 0s;
}

.confetti-2 {
  top: 44px;
  right: 66px;
  animation-delay: 0.45s;
}

.confetti-3 {
  top: 96px;
  left: 22px;
  animation-delay: 0.9s;
}

.confetti-4 {
  top: 120px;
  right: 20px;
  animation-delay: 1.35s;
}

.confetti-5 {
  bottom: 96px;
  left: 44px;
  animation-delay: 1.8s;
}

.confetti-6 {
  bottom: 70px;
  right: 52px;
  animation-delay: 2.25s;
}

.confetti-7 {
  bottom: 30px;
  left: 78px;
  animation-delay: 2.7s;
}

.confetti-8 {
  top: 70px;
  left: 50%;
  animation-delay: 3.15s;
}

@keyframes confetti {
  0% {
    opacity: 0;
    transform: translateY(6px) rotate(0deg);
  }
  25% {
    opacity: 0.9;
  }
  60% {
    opacity: 0.7;
    transform: translateY(-14px) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-26px) rotate(360deg);
  }
}

/* =====================================================
   HINT
===================================================== */

.gift-hint {
  margin: 6px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.22em;

  opacity: 0.7;
}

/* =====================================================
   DIALOG
===================================================== */

.gift-dialog {
  position: fixed;
  inset: 0;
  z-index: 3000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 18px;
}

.gift-dialog-backdrop {
  position: absolute;
  inset: 0;

  background-color: rgba(147, 56, 69, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.gift-dialog-card {
  position: relative;
  z-index: 1;

  width: min(100%, 420px);
  max-height: 88vh;
  overflow-y: auto;

  padding: 28px 20px 24px;

  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);

  background-color: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: 0 24px 60px -10px rgba(147, 56, 69, 0.4);

  text-align: center;
}

.dialog-close {
  position: absolute;
  top: 12px;
  right: 14px;

  width: 30px;
  height: 30px;

  border: none;
  border-radius: 50%;

  background-color: rgba(203, 93, 108, 0.12);
  color: var(--gg-deep, #933845);

  cursor: pointer;
}

.dialog-eyebrow {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 9px;
  letter-spacing: 0.24em;

  opacity: 0.7;
}

.gift-dialog-card h3 {
  margin: 6px 0 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
}

.dialog-description {
  margin: 10px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  line-height: 1.65;

  opacity: 0.85;
}

/* =====================================================
   ACCOUNTS
===================================================== */

.account-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;

  margin-top: 20px;
}

.account-card {
  padding: 16px;

  border-radius: 16px;
  border: 1px solid rgba(203, 93, 108, 0.3);

  background-color: #ffffff;

  text-align: left;
}

.account-label {
  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 16px;
  font-weight: 600;
}

.account-bank {
  margin-top: 2px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;

  opacity: 0.7;
}

.qr-button {
  display: block;
  width: 100%;

  margin-top: 12px;
  padding: 0;

  border: none;
  background: transparent;

  cursor: pointer;
}

.qr-code {
  width: 150px;
  height: 150px;

  margin: 0 auto;

  display: block;

  object-fit: contain;

  border-radius: 10px;
  border: 1px solid rgba(203, 93, 108, 0.25);
}

.qr-hint {
  display: block;
  margin-top: 6px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 9px;
  letter-spacing: 0.12em;

  opacity: 0.6;
}

.account-info {
  margin-top: 14px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  flex: 0 0 auto;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 9px;
  letter-spacing: 0.14em;

  opacity: 0.65;
}

.info-value {
  flex: 1;

  color: var(--gg-deep, #933845);
  font-family: "EB Garamond", serif;
  font-size: 15px;
  font-weight: 500;
}

.account-number {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

.info-divider {
  height: 1px;
  margin: 10px 0;

  background-color: rgba(203, 93, 108, 0.2);
}

.copy-button {
  flex: 0 0 auto;

  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background-color: rgba(203, 93, 108, 0.12);
  color: var(--gg-rose, #cb5d6c);

  cursor: pointer;
}

.account-description {
  margin-top: 12px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  line-height: 1.6;

  opacity: 0.8;
}

/* =====================================================
   QR PREVIEW
===================================================== */

.qr-preview {
  position: fixed;
  inset: 0;
  z-index: 3100;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.qr-preview-backdrop {
  position: absolute;
  inset: 0;

  background-color: rgba(147, 56, 69, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.qr-preview-card {
  position: relative;
  z-index: 1;

  padding: 20px;

  border-radius: 20px;
  background-color: #ffffff;

  box-shadow: 0 24px 60px -10px rgba(147, 56, 69, 0.45);

  text-align: center;
}

.qr-preview-card img {
  width: min(70vw, 300px);
  height: auto;

  display: block;

  object-fit: contain;
}

.qr-preview-card p {
  margin: 12px 0 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 15px;
  font-weight: 600;
}

.qr-preview-close {
  position: absolute;
  top: 8px;
  right: 10px;

  width: 30px;
  height: 30px;

  border: none;
  border-radius: 50%;

  background-color: rgba(203, 93, 108, 0.12);
  color: var(--gg-deep, #933845);

  cursor: pointer;
}

/* =====================================================
   TRANSITIONS
===================================================== */

.gift-dialog-enter-active,
.gift-dialog-leave-active,
.qr-preview-enter-active,
.qr-preview-leave-active {
  transition: opacity 0.3s ease;
}

.gift-dialog-enter-from,
.gift-dialog-leave-to,
.qr-preview-enter-from,
.qr-preview-leave-to {
  opacity: 0;
}

/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .gift-box-button {
    width: 300px;
    height: 320px;
  }

  .gift-bob {
    width: 230px;
    height: 250px;
  }

  .gift-bob img {
    width: 200px;
    max-height: 250px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gift-bob,
  .gift-shadow,
  .gift-sparkle,
  .gift-confetti {
    animation: none;
  }
}
</style>
