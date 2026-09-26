<template>
  <section class="cr-gifts">
    <img
      :src="decorativeDiamond"
      alt=""
      aria-hidden="true"
      class="cr-gifts__diamond"
      draggable="false"
    />

    <header class="cr-heading">
      <h2 class="cr-heading__vi">Hộp quà mừng</h2>

      <p class="cr-heading__zh">禮物盒</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="cr-heading__intro">
        Những lời chúc và tình cảm của bạn<br />
        là món quà quý giá nhất dành cho chúng mình
      </p>
    </header>

    <!-- =====================================================
         PHONG BÌ MỪNG CƯỚI
    ====================================================== -->
    <button type="button" class="cr-envelope" aria-label="Mở hộp quà mừng" @click="openGift">
      <span class="cr-envelope__glow" aria-hidden="true"></span>

      <!-- Phong bì sau — lật ngược, nghiêng lệch ra sau -->
      <span class="cr-envelope__body cr-envelope__body--back" aria-hidden="true">
        <span class="cr-envelope__flap"></span>

        <span class="cr-envelope__seal">
          <img :src="doubleHappiness" alt="" draggable="false" />
        </span>
      </span>

      <!-- Phong bì trước -->
      <span class="cr-envelope__body cr-envelope__body--front">
        <span class="cr-envelope__flap" aria-hidden="true"></span>

        <span class="cr-envelope__seal" aria-hidden="true">
          <img :src="doubleHappiness" alt="" draggable="false" />
        </span>

        <span class="cr-envelope__spark cr-envelope__spark--1" aria-hidden="true">❀</span>
        <span class="cr-envelope__spark cr-envelope__spark--2" aria-hidden="true">❀</span>
        <span class="cr-envelope__spark cr-envelope__spark--3" aria-hidden="true">❀</span>
      </span>

      <span class="cr-envelope__hint">CHẠM ĐỂ MỞ</span>
    </button>

    <!-- =====================================================
         HỘP THOẠI THÔNG TIN TÀI KHOẢN
    ====================================================== -->
    <Teleport to="body">
      <Transition name="cr-gift">
        <div v-if="showGiftDialog" class="cr-gift-dialog" @click.self="closeGift">
          <div class="cr-gift-dialog__card" role="dialog" aria-modal="true">
            <button
              type="button"
              class="cr-gift-dialog__close"
              aria-label="Đóng hộp quà mừng"
              @click="closeGift"
            >
              ×
            </button>

            <img
              :src="doubleHappiness"
              alt="囍"
              class="cr-gift-dialog__happiness"
              draggable="false"
            />

            <h3 class="cr-gift-dialog__title">Hộp quà mừng</h3>

            <p class="cr-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có thể
              chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="cr-accounts">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="cr-account">
                <div class="cr-account__head">
                  <span class="cr-account__label">
                    {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                  </span>

                  <span v-if="item.BankName" class="cr-account__bank">
                    {{ item.BankName }}
                  </span>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="cr-account__qr"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" />

                  <span>CHẠM VÀO QR ĐỂ XEM LỚN</span>
                </button>

                <div class="cr-account__row">
                  <span class="cr-account__row-label">CHỦ TÀI KHOẢN</span>

                  <span class="cr-account__row-value">
                    {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                  </span>
                </div>

                <div class="cr-account__row">
                  <span class="cr-account__row-label">SỐ TÀI KHOẢN</span>

                  <span class="cr-account__row-value cr-account__number">
                    {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                  </span>

                  <button
                    type="button"
                    class="cr-account__copy"
                    title="Sao chép số tài khoản"
                    aria-label="Sao chép số tài khoản"
                    @click="copyAccount(item)"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>

                <p v-if="item.Description" class="cr-account__desc">
                  {{ item.Description }}
                </p>
              </article>
            </div>

            <p v-else class="cr-gift-dialog__desc">
              Thông tin chuyển khoản đang được cập nhật.
            </p>
          </div>
        </div>
      </Transition>

      <!-- XEM QR LỚN -->
      <Transition name="cr-gift">
        <div v-if="previewQr" class="cr-qr-preview" @click.self="closeQr">
          <div class="cr-qr-preview__card">
            <button
              type="button"
              class="cr-gift-dialog__close"
              aria-label="Đóng QR"
              @click="closeQr"
            >
              ×
            </button>

            <p class="cr-qr-preview__title">{{ previewQr.Name || "QR MỪNG CƯỚI" }}</p>

            <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />

            <p class="cr-qr-preview__hint">Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="cr-qr-preview__save"
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

import { decorativeDiamond, doubleHappiness } from "./emeraldLuxeAssets";

const props = defineProps({
  gifts: { type: Array, default: () => [] },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("cr-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("cr-gift-dialog-open");
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

  document.body.classList.remove("cr-gift-dialog-open");
});
</script>

<style scoped>
.cr-gifts {
  position: relative;

  text-align: center;

  color: var(--cr-ink);
}

.cr-gifts__diamond {
  position: absolute;

  top: 20px;
  left: -16px;

  width: 76px;
  height: 76px;

  object-fit: contain;

  opacity: 0.5;

  pointer-events: none;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cr-heading {
  position: relative;

  text-align: center;

  margin-bottom: 24px;
}

.cr-heading__vi {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-heading__zh {
  margin: 4px 0 0;

  font-family: "Noto Serif SC", serif;

  font-size: 0.85em;

  letter-spacing: 0.3em;
  text-indent: 0.3em;

  opacity: 0.7;

  color: var(--cr-soft);
}

.cr-heading__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 12px;

  color: var(--cr-accent);
}

.cr-heading__ornament span {
  width: 52px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-heading__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-heading__ornament i {
  font-size: 13px;
  font-style: normal;
}

.cr-heading__intro {
  margin: 12px 0 0;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.7;
}

/* =========================================================
   PHONG BÌ
========================================================= */

.cr-envelope {
  position: relative;

  display: inline-flex;
  flex-direction: column;
  align-items: center;

  padding: 0;

  border: 0;

  background: none;

  cursor: pointer;
}

.cr-envelope__glow {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 240px;
  height: 240px;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(var(--cr-accent-rgb), 0.55), transparent 68%);

  pointer-events: none;

  animation: cr-envelope-breathe 4.5s ease-in-out infinite;
}

.cr-envelope__body {
  position: relative;

  display: block;

  width: 220px;
  height: 150px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.22);
  border-radius: 12px;

  background: linear-gradient(160deg, var(--cr-surface), var(--cr-bg-2));

  box-shadow: 0 18px 40px rgba(var(--cr-ink-rgb), 0.16);

  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/*
 * Hai phong bì chồng nhau — phong bì sau lật ngược
 * (scale âm theo trục X) rồi nghiêng lệch ra sau, phong
 * bì trước nằm đè lên hơi xoay. Màu vẫn lấy từ biến
 * --cr-* của theme để đồng bộ bảng màu.
 */
.cr-envelope__body--back {
  position: absolute;

  top: 0;
  left: 0;

  z-index: 1;

  transform-origin: 50% 100%;

  transform: translateX(20%) translateY(-10%) scale(-0.8, 0.8) rotate(-15deg);

  opacity: 0.92;
}

.cr-envelope__body--front {
  z-index: 2;

  transform: rotate(-10deg);
}

.cr-envelope:hover .cr-envelope__body--back {
  transform: translateX(26%) translateY(-14%) scale(-0.84, 0.84) rotate(-18deg);
}

.cr-envelope:hover .cr-envelope__body--front {
  transform: rotate(-7deg) translateY(-6px);
}

/* Nắp phong bì */
.cr-envelope__flap {
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 78px;

  border-bottom: 1px solid rgba(var(--cr-ink-rgb), 0.16);

  background: linear-gradient(180deg, var(--cr-bg-2), var(--cr-accent-light));

  clip-path: polygon(0 0, 100% 0, 50% 100%);

  border-radius: 12px 12px 0 0;
}

/* Con dấu song hỷ */
.cr-envelope__seal {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 62px;
  height: 62px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%);

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 50%;

  background: var(--cr-surface);

  box-shadow: 0 6px 16px rgba(var(--cr-ink-rgb), 0.14);
}

.cr-envelope__seal img {
  width: 40px;
  height: 40px;

  object-fit: contain;
}

.cr-envelope__spark {
  position: absolute;

  color: var(--cr-accent);

  font-size: 13px;

  animation: cr-spark-twinkle 3.4s ease-in-out infinite;
}

.cr-envelope__spark--1 {
  top: 12px;
  left: 16px;
}

.cr-envelope__spark--2 {
  top: 20px;
  right: 18px;

  animation-delay: -1.1s;
}

.cr-envelope__spark--3 {
  bottom: 14px;
  right: 30px;

  font-size: 11px;

  animation-delay: -2.2s;
}

.cr-envelope__hint {
  margin-top: 16px;

  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.24em;
  text-indent: 0.24em;
}

/* =========================================================
   HỘP THOẠI
========================================================= */

.cr-gift-dialog,
.cr-qr-preview {
  position: fixed;
  inset: 0;

  z-index: 3000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(var(--cr-ink-rgb), 0.5);

  backdrop-filter: blur(3px);
}

.cr-gift-dialog__card,
.cr-qr-preview__card {
  position: relative;

  width: min(100%, 420px);
  max-height: 88vh;

  padding: 26px 20px 22px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-radius: 18px;

  background: var(--cr-surface);

  color: var(--cr-ink);
}

.cr-gift-dialog__close {
  position: absolute;

  top: 10px;
  right: 12px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: var(--cr-soft);

  background: rgba(var(--cr-accent-rgb), 0.35);

  font-size: 19px;
  line-height: 1;

  cursor: pointer;
}

.cr-gift-dialog__happiness {
  width: 50px;
  height: 50px;

  object-fit: contain;
}

.cr-gift-dialog__title {
  margin: 8px 0 6px;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 24px;
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;
}

.cr-gift-dialog__desc {
  margin: 0 0 18px;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.65;
}

/* =========================================================
   TÀI KHOẢN
========================================================= */

.cr-accounts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cr-account {
  padding: 16px 14px;

  text-align: left;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.16);
  border-radius: 14px;

  background: rgba(var(--cr-bg-rgb), 0.6);
}

.cr-account__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;

  margin-bottom: 12px;
}

.cr-account__label {
  color: var(--cr-ink);

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.cr-account__bank {
  color: var(--cr-muted);

  font-size: 11px;
}

.cr-account__qr {
  display: block;

  width: 100%;

  margin-bottom: 12px;
  padding: 10px;

  border: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-radius: 12px;

  background: #fff;

  cursor: pointer;
}

.cr-account__qr img {
  display: block;

  width: 100%;
  max-width: 190px;

  margin: 0 auto;

  aspect-ratio: 1;

  object-fit: contain;
}

.cr-account__qr span {
  display: block;

  margin-top: 8px;

  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.14em;
}

.cr-account__row {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 0;

  border-top: 1px solid rgba(var(--cr-accent-rgb), 0.9);
}

.cr-account__row-label {
  flex: 0 0 auto;

  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.14em;
}

.cr-account__row-value {
  flex: 1 1 auto;

  min-width: 0;

  color: var(--cr-ink);

  font-size: 13px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.cr-account__number {
  letter-spacing: 0.06em;
}

.cr-account__copy {
  flex: 0 0 auto;

  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-radius: 50%;

  background: #fff;

  color: var(--cr-ink);

  cursor: pointer;
}

.cr-account__copy svg {
  width: 14px;
  height: 14px;
}

.cr-account__desc {
  margin: 10px 0 0;

  color: var(--cr-soft);

  font-size: 11px;

  line-height: 1.6;
}

/* =========================================================
   XEM QR LỚN
========================================================= */

.cr-qr-preview__title {
  margin: 0 0 14px;

  color: var(--cr-ink);

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.16em;

  text-transform: uppercase;
}

.cr-qr-preview__card img {
  display: block;

  width: 100%;
  max-width: 280px;

  margin: 0 auto;

  aspect-ratio: 1;

  object-fit: contain;

  border: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-radius: 12px;

  background: #fff;
}

.cr-qr-preview__hint {
  margin: 12px 0 14px;

  color: var(--cr-muted);

  font-size: 11px;
}

.cr-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 11px 24px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 999px;

  color: var(--cr-ink);

  background: linear-gradient(135deg, var(--cr-accent-light), var(--cr-accent));

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;

  text-decoration: none;
}

/* =========================================================
   CHUYỂN ĐỘNG
========================================================= */

.cr-gift-enter-active,
.cr-gift-leave-active {
  transition: opacity 0.25s ease;
}

.cr-gift-enter-from,
.cr-gift-leave-to {
  opacity: 0;
}

@keyframes cr-envelope-breathe {
  0%,
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(0.94);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.06);
  }
}

@keyframes cr-spark-twinkle {
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
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cr-envelope__glow,
  .cr-envelope__spark {
    animation: none;
  }

  .cr-envelope__body,
  .cr-envelope__body--back,
  .cr-envelope__body--front {
    transition: none;
  }
}

:global(body.cr-gift-dialog-open) {
  overflow: hidden;
}
</style>
