<template>
  <section class="shy-gifts">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shy-bar">Hộp Quà Mừng</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-gifts__inner">
      <button
        type="button"
        class="shy-gift-btn"
        aria-label="Mở hộp mừng cưới"
        @click="openGift"
      >
        <span class="shy-gift-sparkle shy-gift-sparkle--1" aria-hidden="true">✦</span>
        <span class="shy-gift-sparkle shy-gift-sparkle--2" aria-hidden="true">✦</span>
        <span class="shy-gift-sparkle shy-gift-sparkle--3" aria-hidden="true">✦</span>
        <span class="shy-gift-sparkle shy-gift-sparkle--4" aria-hidden="true">✦</span>

        <span class="shy-gift-stage">
          <span class="shy-gift-shadow" aria-hidden="true"></span>

          <img
            class="shy-gift-envelope shy-gift-envelope--back"
            :src="envelope"
            alt=""
            draggable="false"
          />

          <img
            class="shy-gift-envelope shy-gift-envelope--front"
            :src="envelope"
            alt=""
            draggable="false"
          />
        </span>

        <span class="shy-gift-hint">Nhấn để mở</span>
      </button>
    </div>

    <!-- =====================================================
         HỘP MỪNG CƯỚI
    ====================================================== -->

    <Teleport to="body">
      <Transition name="shy-gift-dialog">
        <div v-if="showGiftDialog" class="shy-gift-dialog" @click.self="closeGift">
          <div class="shy-gift-dialog__backdrop" @click="closeGift"></div>

          <div
            class="shy-gift-dialog__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shy-gift-dialog-title"
          >
            <button
              type="button"
              class="shy-gift-dialog__close"
              aria-label="Đóng hộp mừng cưới"
              @click="closeGift"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="shy-gift-dialog__header">
              <h3 id="shy-gift-dialog-title">Hộp Quà Mừng</h3>
            </div>

            <div class="shy-gift-dialog__body">
              <p class="shy-gift-dialog__desc">
                Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
                bạn có thể chuyển khoản qua các tài khoản bên dưới.
              </p>

              <div v-if="gifts.length" class="shy-account-grid">
                <article
                  v-for="(item, index) in gifts"
                  :key="item.Id || index"
                  class="shy-account-card"
                >
                  <div class="shy-account-heading">
                    <div class="shy-account-icon">
                      <v-icon size="17">mdi-bank-outline</v-icon>
                    </div>

                    <div>
                      <div class="shy-account-label">
                        {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                      </div>

                      <div v-if="item.BankName" class="shy-account-bank">
                        {{ item.BankName }}
                      </div>
                    </div>
                  </div>

                  <button
                    v-if="item.QrCode"
                    type="button"
                    class="shy-qr-button"
                    aria-label="Xem QR lớn"
                    @click="openQr(item)"
                  >
                    <div class="shy-qr-frame">
                      <img
                        :src="item.QrCode"
                        :alt="item.Name || 'QR mừng cưới'"
                        class="shy-qr-code"
                      />
                    </div>

                    <div class="shy-qr-hint">
                      <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                      CHẠM VÀO QR ĐỂ XEM LỚN
                    </div>
                  </button>

                  <div class="shy-account-info">
                    <div class="shy-info-row">
                      <span class="shy-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="shy-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <div class="shy-info-divider"></div>

                    <div class="shy-info-row">
                      <span class="shy-info-label">SỐ TÀI KHOẢN</span>

                      <span class="shy-info-value shy-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>

                      <button
                        type="button"
                        class="shy-copy-button"
                        title="Sao chép số tài khoản"
                        aria-label="Sao chép số tài khoản"
                        @click="copyAccount(item)"
                      >
                        <v-icon size="14">mdi-content-copy</v-icon>
                      </button>
                    </div>
                  </div>

                  <div v-if="item.Description" class="shy-account-desc">
                    {{ item.Description }}
                  </div>
                </article>
              </div>

              <div v-else class="shy-account-desc">
                Thông tin chuyển khoản đang được cập nhật.
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="shy-qr-preview">
        <div v-if="previewQr" class="shy-qr-preview" @click.self="closeQr">
          <div class="shy-qr-preview__backdrop" @click="closeQr"></div>

          <div class="shy-qr-preview__card">
            <button
              type="button"
              class="shy-qr-preview__close"
              aria-label="Đóng QR"
              @click="closeQr"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="shy-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="shy-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="shy-qr-preview__save"
            >
              <v-icon size="15">mdi-download</v-icon>

              MỞ / LƯU ẢNH QR
            </a>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";

import { envelope } from "./songHyRedAssets";

const props = defineProps({
  gifts: { type: Array, default: () => [] },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("shy-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("shy-gift-dialog-open");
}

function openQr(item) {
  if (!item?.QrCode) return;

  previewQr.value = item;
}

function closeQr() {
  previewQr.value = null;
}

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

  document.body.classList.remove("shy-gift-dialog-open");
});
</script>

<style scoped>
.shy-gifts {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);
  --shy-gold: var(--accent, #fbbf24);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-gifts__inner {
  display: flex;
  justify-content: center;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 28px 8px 36px;
}

/* =========================================================
   PHONG BÌ
========================================================= */

.shy-gift-btn {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 250px;
  height: 357px;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;
}

.shy-gift-stage {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 190px;
  height: 275px;

  padding-bottom: 48px;
}

.shy-gift-shadow {
  position: absolute;

  left: 50%;
  bottom: -6px;

  width: 125px;
  height: 11px;

  margin-left: -63px;

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.45);

  filter: blur(4px);
}

.shy-gift-envelope {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;
  object-position: center bottom;

  transform-origin: 50% 100%;

  pointer-events: none;

  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.shy-gift-envelope--back {
  z-index: 1;

  transform: translateX(20%) translateY(-10%) scale(-0.8, 0.8) rotate(-15deg);

  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18));
}

.shy-gift-envelope--front {
  z-index: 2;

  transform: rotate(-10deg);

  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22));
}

.shy-gift-btn:hover .shy-gift-envelope--back {
  transform: translateX(26%) translateY(-14%) scale(-0.84, 0.84) rotate(-18deg);
}

.shy-gift-btn:hover .shy-gift-envelope--front {
  transform: rotate(-7deg) translateY(-4px);
}

.shy-gift-hint {
  position: absolute;

  left: 50%;
  bottom: 0;

  transform: translateX(-50%);

  color: var(--shy-ink);

  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;
}

/* =========================================================
   TIA SÁNG
========================================================= */

.shy-gift-sparkle {
  position: absolute;
  z-index: 20;

  color: var(--shy-gold);

  pointer-events: none;

  animation: shy-sparkle 2.4s ease-in-out infinite;
}

.shy-gift-sparkle--1 {
  top: 6%;
  left: 12%;

  font-size: 21px;
}

.shy-gift-sparkle--2 {
  top: 14%;
  right: 8%;

  font-size: 15px;

  animation-delay: 0.4s;
}

.shy-gift-sparkle--3 {
  top: 34%;
  left: 3%;

  font-size: 13px;

  animation-delay: 0.8s;
}

.shy-gift-sparkle--4 {
  top: 24%;
  right: 3%;

  font-size: 13px;

  animation-delay: 1.2s;
}

@keyframes shy-sparkle {
  0%,
  100% {
    opacity: 0.35;

    transform: scale(0.85);
  }

  50% {
    opacity: 1;

    transform: scale(1.15);
  }
}

/* =========================================================
   DIALOG
========================================================= */

.shy-gift-dialog {
  position: fixed;
  z-index: 3000;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.shy-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(40, 0, 0, 0.6);

  backdrop-filter: blur(3px);
}

.shy-gift-dialog__card {
  position: relative;

  width: min(100%, 560px);
  max-height: 90vh;

  border-radius: 12px;

  background: var(--shy-bg);

  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.3);

  overflow-y: auto;
}

.shy-gift-dialog__close {
  position: absolute;
  z-index: 3;

  right: 12px;
  top: 12px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: rgba(255, 255, 255, 0.8);

  background: transparent;

  cursor: pointer;
}

.shy-gift-dialog__close:hover {
  color: #ffffff;

  background: rgba(255, 255, 255, 0.2);
}

.shy-gift-dialog__header {
  padding: 22px 24px 18px;

  background: var(--shy-red);

  text-align: center;
}

.shy-gift-dialog__header h3 {
  margin: 0;

  color: #ffffff;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  text-transform: uppercase;
}

.shy-gift-dialog__body {
  padding: 18px 20px 22px;
}

.shy-gift-dialog__desc {
  margin: 0 0 16px;

  color: var(--shy-ink);

  font-size: 13px;

  line-height: 1.6;

  text-align: center;
}

/* =========================================================
   TÀI KHOẢN
========================================================= */

.shy-account-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shy-account-card {
  padding: 16px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 18%, transparent);
  border-radius: 10px;

  background: #ffffff;
}

.shy-account-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 12px;
}

.shy-account-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  border-radius: 50%;

  color: var(--shy-red);

  background: color-mix(in srgb, var(--shy-red) 10%, transparent);
}

.shy-account-label {
  color: var(--shy-red);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.06em;

  text-transform: uppercase;
}

.shy-account-bank {
  color: color-mix(in srgb, var(--shy-ink) 75%, transparent);

  font-size: 12px;
}

.shy-qr-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  width: 100%;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;
}

.shy-qr-frame {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 150px;
  height: 150px;

  padding: 8px;

  border: 2px solid color-mix(in srgb, var(--shy-red) 13%, transparent);
  border-radius: 12px;

  background: #ffffff;

  box-shadow: 0 8px 20px rgba(128, 0, 0, 0.1);
}

.shy-qr-code {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.shy-qr-hint {
  display: flex;
  align-items: center;
  gap: 4px;

  color: color-mix(in srgb, var(--shy-ink) 70%, transparent);

  font-size: 10px;

  letter-spacing: 0.08em;
}

.shy-account-info {
  margin-top: 14px;
}

.shy-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shy-info-label {
  display: block;

  color: color-mix(in srgb, var(--shy-ink) 70%, transparent);

  font-size: 10px;

  letter-spacing: 0.14em;
}

.shy-info-value {
  display: block;

  margin-top: 2px;

  color: var(--shy-ink);

  font-size: 14px;
  font-weight: 600;
}

.shy-account-number {
  font-family: "Courier New", ui-monospace, monospace;

  letter-spacing: 0.06em;
}

.shy-info-divider {
  height: 1px;

  margin: 10px 0;

  background: color-mix(in srgb, var(--shy-red) 12%, transparent);
}

.shy-copy-button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  margin-left: auto;

  border: 0;
  border-radius: 50%;

  color: var(--shy-red);

  background: color-mix(in srgb, var(--shy-red) 10%, transparent);

  cursor: pointer;

  transition: background 0.2s ease;
}

.shy-copy-button:hover {
  background: color-mix(in srgb, var(--shy-red) 20%, transparent);
}

.shy-account-desc {
  margin-top: 12px;

  color: color-mix(in srgb, var(--shy-ink) 80%, transparent);

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   QR PREVIEW
========================================================= */

.shy-qr-preview {
  position: fixed;
  z-index: 3100;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.shy-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(0, 0, 0, 0.85);
}

.shy-qr-preview__card {
  position: relative;

  width: min(100%, 360px);

  padding: 22px 20px 20px;

  border-radius: 12px;

  background: var(--shy-bg);

  text-align: center;
}

.shy-qr-preview__close {
  position: absolute;

  right: 10px;
  top: 8px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: var(--shy-red);

  background: transparent;

  cursor: pointer;
}

.shy-qr-preview__title {
  margin-bottom: 14px;

  color: var(--shy-red);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}

.shy-qr-preview__image {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;

  border-radius: 10px;

  background: #ffffff;
}

.shy-qr-preview__image img {
  width: 100%;
  max-width: 260px;

  height: auto;

  object-fit: contain;
}

.shy-qr-preview__card p {
  margin: 12px 0 0;

  color: color-mix(in srgb, var(--shy-ink) 75%, transparent);

  font-size: 12px;
}

.shy-qr-preview__save {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-top: 14px;
  padding: 10px 18px;

  border-radius: 999px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.08em;

  text-decoration: none;
}

/* =========================================================
   TRANSITION
========================================================= */

.shy-gift-dialog-enter-active,
.shy-gift-dialog-leave-active,
.shy-qr-preview-enter-active,
.shy-qr-preview-leave-active {
  transition: opacity 0.3s ease;
}

.shy-gift-dialog-enter-from,
.shy-gift-dialog-leave-to,
.shy-qr-preview-enter-from,
.shy-qr-preview-leave-to {
  opacity: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-gifts__inner {
    width: min(100%, 600px);

    padding: 36px 5px 44px;
  }

  .shy-gift-dialog__header h3 {
    font-size: 24px;
  }

  .shy-gift-dialog__desc {
    font-size: 15px;
  }

  .shy-account-grid {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .shy-account-card {
    flex: 1;

    min-width: 240px;
  }

  .shy-qr-frame {
    width: 170px;
    height: 170px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .shy-gift-sparkle {
    animation: none;
  }

  .shy-gift-envelope,
  .shy-copy-button,
  .shy-gift-dialog-enter-active,
  .shy-gift-dialog-leave-active,
  .shy-qr-preview-enter-active,
  .shy-qr-preview-leave-active {
    transition: none;
  }
}
</style>
