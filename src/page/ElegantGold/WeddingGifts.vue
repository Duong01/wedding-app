<template>
  <section class="la-gifts">
    <h2 class="la-title">Hộp Quà Mừng</h2>

    <button type="button" class="la-gift" aria-label="Mở hộp mừng cưới" @click="openGift">
      <span class="la-gift__sparkle la-gift__sparkle--1">✦</span>
      <span class="la-gift__sparkle la-gift__sparkle--2">✦</span>
      <span class="la-gift__sparkle la-gift__sparkle--3">✦</span>
      <span class="la-gift__sparkle la-gift__sparkle--4">✦</span>

      <span class="la-gift__stage">
        <span class="la-gift__shadow"></span>

        <img :src="envelope" alt="" class="la-gift__back" aria-hidden="true" />

        <img :src="envelope" alt="" class="la-gift__card" aria-hidden="true" />
      </span>

      <span class="la-gift__hint">Nhấn để mở</span>
    </button>

    <!-- =====================================================
         DIALOG THÔNG TIN CHUYỂN KHOẢN
    ====================================================== -->
    <Teleport to="body">
      <Transition name="la-gift-dialog">
        <div v-if="showGiftDialog" class="la-gift-dialog" @click.self="closeGift">
          <div class="la-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="la-gift-dialog__card" role="dialog" aria-modal="true">
            <div class="la-gift-dialog__head">
              <button type="button" class="la-gift-dialog__close" aria-label="Đóng" @click="closeGift">
                ×
              </button>

              <h3>Hộp Quà Mừng</h3>
            </div>

            <div class="la-gift-dialog__body">
              <div v-if="gifts.length" class="la-account-grid">
                <article v-for="(item, index) in gifts" :key="item.Id || index" class="la-account">
                  <h4 class="la-account__title">
                    {{ item.Name || item.BankName || `Tài khoản ${index + 1}` }}
                  </h4>

                  <button
                    v-if="item.QrCode"
                    type="button"
                    class="la-account__qr"
                    aria-label="Xem QR lớn"
                    @click="openQr(item)"
                  >
                    <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" />
                  </button>

                  <div class="la-account__info">
                    <p v-if="item.BankName">{{ item.BankName }}</p>

                    <p class="la-account__number">
                      {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                    </p>

                    <p class="la-account__owner">
                      {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                    </p>
                  </div>

                  <button
                    v-if="item.QrCode"
                    type="button"
                    class="la-account__save"
                    @click="openQr(item)"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>

                    Lưu QR
                  </button>

                  <button
                    v-else
                    type="button"
                    class="la-account__save"
                    @click="copyAccount(item)"
                  >
                    Sao chép số tài khoản
                  </button>
                </article>
              </div>

              <p v-else class="la-gift-dialog__empty">
                Thông tin chuyển khoản đang được cập nhật.
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- =====================================================
           XEM QR LỚN
      ====================================================== -->
      <Transition name="la-qr-preview">
        <div v-if="previewQr" class="la-qr-preview" @click.self="closeQr">
          <div class="la-qr-preview__backdrop" @click="closeQr"></div>

          <div class="la-qr-preview__card">
            <button type="button" class="la-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              ×
            </button>

            <p class="la-qr-preview__title">{{ previewQr.Name || "QR MỪNG CƯỚI" }}</p>

            <div class="la-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p class="la-qr-preview__hint">Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="la-pill la-qr-preview__save"
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

import envelope from "@/assets/romatic-pink/mini/hoa_tinh_red.webp";

const props = defineProps({
  gifts: { type: Array, default: () => [] },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("la-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("la-gift-dialog-open");
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

  document.body.classList.remove("la-gift-dialog-open");
});
</script>

<style scoped>
.la-gifts {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  text-align: center;
}

/* =========================================================
   HỘP QUÀ
========================================================= */

.la-gift {
  position: relative;

  width: 250px;
  height: 357px;

  margin-top: 16px;

  border: 0;

  background: transparent;

  cursor: pointer;

  outline: none;

  -webkit-tap-highlight-color: transparent;
}

.la-gift__stage {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 100%;
  height: 100%;

  padding-bottom: 48px;
}

.la-gift__shadow {
  position: absolute;
  z-index: 0;

  left: 50%;
  bottom: -6px;

  width: 125px;
  height: 11px;

  margin-left: -63px;

  border-radius: 50%;

  background-color: rgba(0, 0, 0, 0.45);

  filter: blur(4px);

  animation: la-gift-shadow 3.6s ease-in-out infinite;
}

.la-gift__back,
.la-gift__card {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;
  object-position: center bottom;

  transform-origin: 50% 100%;

  pointer-events: none;
}

.la-gift__back {
  z-index: 1;

  transform: translateX(20%) translateY(-10%) scale(-0.8, 0.8) rotate(-15deg);

  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18));

  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.la-gift__card {
  z-index: 2;

  transform: rotate(-10deg);

  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22));

  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.la-gift:hover .la-gift__back {
  transform: translateX(26%) translateY(-14%) scale(-0.84, 0.84) rotate(-19deg);
}

.la-gift:hover .la-gift__card {
  transform: rotate(-6deg) translateY(-8px);
}

.la-gift__sparkle {
  position: absolute;
  z-index: 20;

  color: var(--la-ink);

  pointer-events: none;

  animation: la-sparkle 2.6s ease-in-out infinite;
}

.la-gift__sparkle--1 { top: 6%; left: 12%; font-size: 21px; }
.la-gift__sparkle--2 { top: 14%; right: 8%; font-size: 15px; animation-delay: 0.6s; }
.la-gift__sparkle--3 { top: 34%; left: 3%; font-size: 13px; animation-delay: 1.2s; }
.la-gift__sparkle--4 { top: 24%; right: 3%; font-size: 13px; animation-delay: 1.7s; }

.la-gift__hint {
  position: absolute;
  bottom: 0;
  left: 50%;

  transform: translateX(-50%);

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;
}

/* =========================================================
   DIALOG
========================================================= */

.la-gift-dialog {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.la-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background-color: rgba(0, 0, 0, 0.5);

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.la-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(560px, 100%);
  max-height: 90vh;

  overflow-y: auto;

  border-radius: 16px;

  background-color: var(--la-paper);

  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
}

.la-gift-dialog__head {
  position: relative;

  padding: 20px 24px 16px;

  background-color: var(--la-red);

  text-align: center;
}

.la-gift-dialog__head h3 {
  margin: 0;

  color: var(--la-paper);

  font-family: var(--la-font-display);
  font-size: 24px;
  font-weight: 700;

  letter-spacing: 0.05em;
  text-transform: uppercase;

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.la-gift-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;

  width: 32px;
  height: 32px;

  border: 0;
  border-radius: 50%;

  background-color: transparent;
  color: rgba(255, 255, 255, 0.8);

  font-size: 24px;
  line-height: 1;

  cursor: pointer;

  transition: background-color 0.25s ease, color 0.25s ease;
}

.la-gift-dialog__close:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--la-paper);
}

.la-gift-dialog__body {
  padding: 18px 20px 22px;
}

.la-gift-dialog__empty {
  margin: 0;

  color: var(--la-ink-soft);

  font-family: var(--la-font-hand);
  font-size: 13px;

  text-align: center;
}

/* =========================================================
   TÀI KHOẢN
========================================================= */

.la-account-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
}

.la-account {
  display: flex;
  flex: 1 1 180px;
  flex-direction: column;
  align-items: center;

  max-width: 220px;
}

.la-account__title {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  min-height: 2rem;
  margin: 0 0 8px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 12px;
  font-weight: 500;

  line-height: 1.3;
  text-align: center;
}

.la-account__qr {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 128px;
  height: 128px;

  padding: 8px;

  border: 2px solid var(--la-hairline-soft);
  border-radius: 12px;

  background-color: var(--la-paper);

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

  cursor: pointer;
}

.la-account__qr img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.la-account__info {
  margin-top: 8px;

  text-align: center;
}

.la-account__info p {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 10px;
}

.la-account__number {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

.la-account__owner {
  font-weight: 600;
}

.la-account__save {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  margin-top: 6px;
  padding: 4px 8px;

  border: 0;
  border-radius: 999px;

  background-color: var(--la-hairline-soft);
  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 500;

  cursor: pointer;

  transition: background-color 0.25s ease;
}

.la-account__save svg {
  width: 12px;
  height: 12px;
}

.la-account__save:hover {
  background-color: var(--la-hairline);
}

/* =========================================================
   XEM QR LỚN
========================================================= */

.la-qr-preview {
  position: fixed;
  inset: 0;
  z-index: 100000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.la-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background-color: rgba(0, 0, 0, 0.75);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.la-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 24px 20px 20px;

  border-radius: 16px;

  background-color: var(--la-paper);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);

  text-align: center;
}

.la-qr-preview__close {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  background-color: transparent;
  color: var(--la-red);

  font-size: 22px;
  line-height: 1;

  cursor: pointer;
}

.la-qr-preview__title {
  margin: 0 0 14px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.la-qr-preview__image {
  width: fit-content;

  margin: 0 auto;
  padding: 12px;

  border: 1px solid var(--la-hairline);

  background-color: var(--la-paper);
}

.la-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.la-qr-preview__hint {
  margin: 14px 0;

  color: var(--la-ink-soft);

  font-family: var(--la-font-hand);
  font-size: 11px;
  font-style: italic;
}

.la-qr-preview__save {
  text-decoration: none;
}

/* =========================================================
   ANIMATION
========================================================= */

.la-gift-dialog-enter-active,
.la-gift-dialog-leave-active,
.la-qr-preview-enter-active,
.la-qr-preview-leave-active {
  transition: opacity 0.3s ease;
}

.la-gift-dialog-enter-from,
.la-gift-dialog-leave-to,
.la-qr-preview-enter-from,
.la-qr-preview-leave-to {
  opacity: 0;
}

.la-gift-dialog-enter-active .la-gift-dialog__card {
  animation: la-dialog-in 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes la-dialog-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes la-gift-shadow {
  0%,
  100% {
    transform: scaleX(1);
    opacity: 0.45;
  }

  50% {
    transform: scaleX(0.78);
    opacity: 0.25;
  }
}

@keyframes la-sparkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(0.65) rotate(0deg);
  }

  50% {
    opacity: 1;
    transform: scale(1.2) rotate(20deg);
  }
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-gift {
    width: 300px;
    height: 400px;
  }

  .la-account__qr {
    width: 160px;
    height: 160px;
  }

  .la-account__info p {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .la-gift__shadow,
  .la-gift__sparkle {
    animation: none;
  }

  .la-gift__back,
  .la-gift__card {
    transition: none;
  }
}

:global(body.la-gift-dialog-open) {
  overflow: hidden;
}
</style>
