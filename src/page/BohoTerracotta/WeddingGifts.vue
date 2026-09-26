<template>
  <section class="bq-gifts">
    <h2 class="bq-heading">HỘP QUÀ MỪNG</h2>

    <!-- =====================================================
         PHONG BÌ MỪNG CƯỚI
    ====================================================== -->
    <button type="button" class="bq-envelope" aria-label="Mở hộp mừng cưới" @click="openGift">
      <span class="bq-envelope__spark bq-envelope__spark--1" aria-hidden="true">✦</span>
      <span class="bq-envelope__spark bq-envelope__spark--2" aria-hidden="true">✦</span>
      <span class="bq-envelope__spark bq-envelope__spark--3" aria-hidden="true">✦</span>
      <span class="bq-envelope__spark bq-envelope__spark--4" aria-hidden="true">✦</span>

      <!-- Phong bì sau — lật ngược, nghiêng lệch ra sau -->
      <span class="bq-envelope__body bq-envelope__body--back" aria-hidden="true">
        <span class="bq-envelope__flap"></span>

        <span class="bq-envelope__seal">
          <img :src="goldenLine" alt="" draggable="false" />
        </span>
      </span>

      <!-- Phong bì trước -->
      <span class="bq-envelope__body bq-envelope__body--front">
        <span class="bq-envelope__flap" aria-hidden="true"></span>

        <span class="bq-envelope__seal" aria-hidden="true">
          <img :src="goldenLine" alt="" draggable="false" />
        </span>
      </span>

      <span class="bq-envelope__hint">CHẠM ĐỂ MỞ</span>
    </button>

    <!-- =====================================================
         HỘP THOẠI THÔNG TIN TÀI KHOẢN
    ====================================================== -->
    <Teleport to="body">
      <Transition name="bq-gift">
        <div v-if="showGiftDialog" class="bq-gift-dialog" @click.self="closeGift">
          <div class="bq-gift-dialog__card" role="dialog" aria-modal="true">
            <button
              type="button"
              class="bq-gift-dialog__close"
              aria-label="Đóng hộp quà mừng"
              @click="closeGift"
            >
              ×
            </button>

            <h3 class="bq-gift-dialog__title">Hộp quà mừng</h3>

            <p class="bq-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có thể
              chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="bq-accounts">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="bq-account">
                <div class="bq-account__head">
                  <span class="bq-account__label">
                    {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                  </span>

                  <span v-if="item.BankName" class="bq-account__bank">
                    {{ item.BankName }}
                  </span>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="bq-account__qr"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" />

                  <span>CHẠM VÀO QR ĐỂ XEM LỚN</span>
                </button>

                <div class="bq-account__row">
                  <span class="bq-account__row-label">CHỦ TÀI KHOẢN</span>

                  <span class="bq-account__row-value">
                    {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                  </span>
                </div>

                <div class="bq-account__row">
                  <span class="bq-account__row-label">SỐ TÀI KHOẢN</span>

                  <span class="bq-account__row-value bq-account__number">
                    {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                  </span>

                  <button
                    type="button"
                    class="bq-account__copy"
                    title="Sao chép số tài khoản"
                    aria-label="Sao chép số tài khoản"
                    @click="copyAccount(item)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>

                <p v-if="item.Description" class="bq-account__desc">
                  {{ item.Description }}
                </p>
              </article>
            </div>

            <p v-else class="bq-gift-dialog__desc">
              Thông tin chuyển khoản đang được cập nhật.
            </p>
          </div>
        </div>
      </Transition>

      <!-- XEM QR LỚN -->
      <Transition name="bq-gift">
        <div v-if="previewQr" class="bq-qr-preview" @click.self="closeQr">
          <div class="bq-qr-preview__card">
            <button
              type="button"
              class="bq-gift-dialog__close"
              aria-label="Đóng QR"
              @click="closeQr"
            >
              ×
            </button>

            <p class="bq-qr-preview__title">{{ previewQr.Name || "QR MỪNG CƯỚI" }}</p>

            <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />

            <p class="bq-qr-preview__hint">Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="bq-qr-preview__save"
            >
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

import { goldenLine } from "./bohoTerracottaAssets";

const props = defineProps({
  gifts: { type: Array, default: () => [] },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("bq-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("bq-gift-dialog-open");
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

  document.body.classList.remove("bq-gift-dialog-open");
});
</script>

<style scoped>
.bq-gifts {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  padding: 32px 24px;

  text-align: center;

  color: var(--bq-ink);
}

.bq-heading {
  margin: 0 0 16px;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

/* =========================================================
   PHONG BÌ
========================================================= */

.bq-envelope {
  position: relative;

  display: inline-flex;
  flex-direction: column;
  align-items: center;

  width: 210px;
  height: 287px;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;
}

.bq-envelope__body {
  position: absolute;

  left: 0;
  bottom: 48px;

  display: block;

  width: 100%;
  height: 190px;

  border: 1px solid var(--bq-line);
  border-radius: 4px;

  background: linear-gradient(160deg, var(--bq-bg-2), var(--bq-bg));

  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);

  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/*
 * Hai phong bì chồng nhau — phong bì sau lật ngược
 * (scale âm theo trục X) rồi nghiêng lệch ra sau, phong
 * bì trước nằm đè lên hơi xoay. Mọi màu vẫn lấy từ
 * biến --bq-* của theme để đồng bộ bảng màu.
 */
.bq-envelope__body--back {
  z-index: 1;

  transform-origin: 50% 100%;

  transform: translateX(20%) translateY(-10%) scale(-0.8, 0.8) rotate(-15deg);

  opacity: 0.92;
}

.bq-envelope__body--front {
  z-index: 2;

  transform: rotate(-10deg);
}

.bq-envelope:hover .bq-envelope__body--back {
  transform: translateX(26%) translateY(-14%) scale(-0.84, 0.84) rotate(-18deg);
}

.bq-envelope:hover .bq-envelope__body--front {
  transform: rotate(-7deg) translateY(-6px);
}

/* Nắp phong bì */
.bq-envelope__flap {
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100px;

  border-bottom: 1px solid var(--bq-line);

  background: linear-gradient(180deg, var(--bq-bg-2), rgba(var(--bq-accent-rgb), 0.16));

  clip-path: polygon(0 0, 100% 0, 50% 100%);

  border-radius: 4px 4px 0 0;
}

/* Con dấu */
.bq-envelope__seal {
  position: absolute;

  top: 50%;
  left: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 78px;
  height: 78px;

  transform: translate(-50%, -50%);

  border: 1px solid var(--bq-line);
  border-radius: 50%;

  background: rgba(var(--bq-bg-rgb), 0.9);

  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.bq-envelope__seal img {
  width: 58px;
  height: auto;

  object-fit: contain;
}

.bq-envelope__spark {
  position: absolute;

  /* Trên cả hai phong bì (phong bì trước cũng z-index 2). */
  z-index: 3;

  color: var(--bq-ink);

  pointer-events: none;

  animation: bq-spark-twinkle 3.4s ease-in-out infinite;
}

.bq-envelope__spark--1 {
  top: 6%;
  left: 12%;

  font-size: 16.5px;
}

.bq-envelope__spark--2 {
  top: 14%;
  right: 8%;

  font-size: 12px;

  animation-delay: -0.9s;
}

.bq-envelope__spark--3 {
  top: 34%;
  left: 3%;

  font-size: 10.5px;

  animation-delay: -1.8s;
}

.bq-envelope__spark--4 {
  top: 24%;
  right: 3%;

  font-size: 10.5px;

  animation-delay: -2.6s;
}

.bq-envelope__hint {
  position: absolute;

  bottom: 0;
  left: 0;

  width: 100%;

  color: var(--bq-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.24em;
  text-indent: 0.24em;
}

/* =========================================================
   HỘP THOẠI
========================================================= */

.bq-gift-dialog,
.bq-qr-preview {
  position: fixed;
  inset: 0;

  z-index: 3000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(var(--bq-bg-rgb), 0.72);

  backdrop-filter: blur(3px);
}

.bq-gift-dialog__card,
.bq-qr-preview__card {
  position: relative;

  width: min(100%, 420px);
  max-height: 88vh;

  padding: 26px 20px 22px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid var(--bq-line);
  border-radius: 6px;

  background: var(--bq-bg-2);

  color: var(--bq-ink);
}

.bq-gift-dialog__close {
  position: absolute;

  top: 10px;
  right: 12px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: var(--bq-accent);

  background: rgba(var(--bq-accent-rgb), 0.14);

  font-size: 19px;
  line-height: 1;

  cursor: pointer;
}

.bq-gift-dialog__title {
  margin: 0 0 6px;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 22px;
  font-weight: 700;

  text-transform: uppercase;
}

.bq-gift-dialog__desc {
  margin: 0 0 18px;

  color: var(--bq-soft);

  font-size: 12px;

  line-height: 1.65;
}

/* =========================================================
   TÀI KHOẢN
========================================================= */

.bq-accounts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bq-account {
  padding: 16px 14px;

  text-align: left;

  border: 1px solid var(--bq-line);
  border-radius: 6px;

  background: rgba(var(--bq-accent-rgb), 0.06);
}

.bq-account__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;

  margin-bottom: 12px;
}

.bq-account__label {
  color: var(--bq-accent);

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.bq-account__bank {
  color: var(--bq-muted);

  font-size: 11px;
}

.bq-account__qr {
  display: block;

  width: 100%;

  margin-bottom: 12px;
  padding: 10px;

  border: 1px solid var(--bq-accent);
  border-radius: 6px;

  background: #fff;

  cursor: pointer;
}

.bq-account__qr img {
  display: block;

  width: 100%;
  max-width: 190px;

  margin: 0 auto;

  aspect-ratio: 1;

  object-fit: contain;
}

.bq-account__qr span {
  display: block;

  margin-top: 8px;

  color: #6b5a4a;

  font-size: 10px;

  letter-spacing: 0.14em;
}

.bq-account__row {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 0;

  border-top: 1px solid var(--bq-line);
}

.bq-account__row-label {
  flex: 0 0 auto;

  color: var(--bq-muted);

  font-size: 10px;

  letter-spacing: 0.14em;
}

.bq-account__row-value {
  flex: 1 1 auto;

  min-width: 0;

  color: var(--bq-ink);

  font-size: 13px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.bq-account__number {
  letter-spacing: 0.06em;
}

.bq-account__copy {
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  border: 1px solid var(--bq-accent);
  border-radius: 50%;

  background: transparent;

  color: var(--bq-accent);

  cursor: pointer;
}

.bq-account__copy svg {
  width: 14px;
  height: 14px;
}

.bq-account__desc {
  margin: 10px 0 0;

  color: var(--bq-soft);

  font-size: 11px;

  line-height: 1.6;
}

/* =========================================================
   XEM QR LỚN
========================================================= */

.bq-qr-preview__title {
  margin: 0 0 14px;

  color: var(--bq-accent);

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.16em;

  text-transform: uppercase;
}

.bq-qr-preview__card img {
  display: block;

  width: 100%;
  max-width: 280px;

  margin: 0 auto;

  aspect-ratio: 1;

  object-fit: contain;

  border: 1px solid var(--bq-accent);
  border-radius: 6px;

  background: #fff;
}

.bq-qr-preview__hint {
  margin: 12px 0 14px;

  color: var(--bq-muted);

  font-size: 11px;
}

.bq-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 11px 24px;

  border: 0;
  border-radius: 999px;

  color: var(--bq-deep);

  background: var(--bq-accent);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;

  text-decoration: none;
}

/* =========================================================
   CHUYỂN ĐỘNG
========================================================= */

.bq-gift-enter-active,
.bq-gift-leave-active {
  transition: opacity 0.25s ease;
}

.bq-gift-enter-from,
.bq-gift-leave-to {
  opacity: 0;
}

@keyframes bq-spark-twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.85);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-heading {
    font-size: 24px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bq-envelope__spark {
    animation: none;
  }

  .bq-envelope__body,
  .bq-envelope__body--back,
  .bq-envelope__body--front {
    transition: none;
  }
}

:global(body.bq-gift-dialog-open) {
  overflow: hidden;
}
</style>
