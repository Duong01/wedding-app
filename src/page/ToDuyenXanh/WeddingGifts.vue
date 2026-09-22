<template>
  <section class="tdx-gifts">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-gifts__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />

      <img
        :src="ribbonDecoration"
        alt=""
        class="tdx-decor tdx-decor--ribbon"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-gifts__inner">
      <h2 class="tdx-heading">Hộp mừng cưới</h2>

      <p class="tdx-gifts__intro">
        Những lời chúc và tình cảm của bạn
        là món quà quý giá nhất dành cho chúng mình
      </p>

      <button type="button" class="tdx-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
        <span class="tdx-gift-glow" aria-hidden="true"></span>

        <span class="tdx-gift-box">
          <v-icon size="52" color="#fefbf4">mdi-gift-outline</v-icon>

          <span class="tdx-gift-sparkle tdx-gift-sparkle--1" aria-hidden="true">✧</span>
          <span class="tdx-gift-sparkle tdx-gift-sparkle--2" aria-hidden="true">❀</span>
          <span class="tdx-gift-sparkle tdx-gift-sparkle--3" aria-hidden="true">✧</span>
          <span class="tdx-gift-sparkle tdx-gift-sparkle--4" aria-hidden="true">❀</span>
        </span>

        <span class="tdx-gift-shadow" aria-hidden="true"></span>

        <span class="tdx-gift-hint">CHẠM ĐỂ MỞ</span>
      </button>
    </div>

    <!-- =====================================================
         HỘP MỪNG CƯỚI
    ====================================================== -->

    <Teleport to="body">
      <Transition name="tdx-gift-dialog">
        <div v-if="showGiftDialog" class="tdx-gift-dialog" @click.self="closeGift">
          <div class="tdx-gift-dialog__backdrop" @click="closeGift"></div>

          <div
            class="tdx-gift-dialog__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tdx-gift-dialog-title"
          >
            <button
              type="button"
              class="tdx-gift-dialog__close"
              aria-label="Đóng hộp mừng cưới"
              @click="closeGift"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="tdx-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="tdx-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="tdx-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="tdx-account-grid">
              <article
                v-for="(item, index) in gifts"
                :key="item.Id || index"
                class="tdx-account-card"
              >
                <div class="tdx-account-heading">
                  <div class="tdx-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="tdx-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="tdx-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="tdx-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="tdx-qr-frame">
                    <div class="tdx-qr-corner tdx-qr-corner--tl"></div>
                    <div class="tdx-qr-corner tdx-qr-corner--tr"></div>
                    <div class="tdx-qr-corner tdx-qr-corner--bl"></div>
                    <div class="tdx-qr-corner tdx-qr-corner--br"></div>

                    <div class="tdx-qr-inner">
                      <img
                        :src="item.QrCode"
                        :alt="item.Name || 'QR mừng cưới'"
                        class="tdx-qr-code"
                      />
                    </div>
                  </div>

                  <div class="tdx-qr-hint">CHẠM VÀO QR ĐỂ XEM LỚN</div>
                </button>

                <div class="tdx-account-info">
                  <div class="tdx-info-row">
                    <div class="tdx-info-left">
                      <span class="tdx-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="tdx-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="tdx-info-divider"></div>

                  <div class="tdx-info-row">
                    <div class="tdx-info-left">
                      <span class="tdx-info-label">SỐ TÀI KHOẢN</span>

                      <span class="tdx-info-value tdx-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="tdx-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="tdx-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="tdx-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>
          </div>
        </div>
      </Transition>

      <!-- XEM TRƯỚC QR -->
      <Transition name="tdx-qr-preview">
        <div v-if="previewQr" class="tdx-qr-preview" @click.self="closeQr">
          <div class="tdx-qr-preview__backdrop" @click="closeQr"></div>

          <div class="tdx-qr-preview__card">
            <button
              type="button"
              class="tdx-qr-preview__close"
              aria-label="Đóng QR"
              @click="closeQr"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="tdx-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="tdx-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="tdx-qr-preview__save"
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

import {
  flowerDecoration,
  lineDecoration,
  ribbonDecoration,
} from "./toDuyenXanhAssets";

const props = defineProps({
  gifts: { type: Array, default: () => [] },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("tdx-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("tdx-gift-dialog-open");
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

  document.body.classList.remove("tdx-gift-dialog-open");
});
</script>

<style scoped>
.tdx-gifts {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);
  --tdx-cream: var(--accent-light, #f3dfc5);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-gifts__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 60px;
  right: -70px;

  width: 198px;
  height: 420px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: 30px;
  right: -80px;

  width: 190px;
  height: 190px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

.tdx-decor--ribbon {
  bottom: -10px;
  left: -365px;

  width: 700px;
  height: 155px;

  object-fit: contain;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-gifts__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 2.5% 10% 20%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  text-align: start;
}

.tdx-heading {
  margin: 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.tdx-gifts__intro {
  margin: 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.6;

  white-space: pre-line;
}

/* =========================================================
   HỘP QUÀ
========================================================= */

.tdx-gift-btn {
  position: relative;

  width: 100%;
  min-height: 260px;

  margin-top: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: rgba(255, 255, 255, 0.6);

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.tdx-gift-glow {
  position: absolute;

  width: 210px;
  height: 210px;

  left: 50%;
  top: 20px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(209, 219, 156, 0.6),
    rgba(209, 219, 156, 0.18) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: tdx-gift-glow 3.5s ease-in-out infinite;
}

.tdx-gift-box {
  position: relative;
  z-index: 3;

  width: 140px;
  height: 140px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;

  background: var(--tdx-green);

  box-shadow: 0 20px 40px rgba(26, 53, 0, 0.28);

  animation: tdx-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.tdx-gift-box::before {
  content: "";
  position: absolute;
  inset: 9px;

  border: 1px dashed rgba(254, 251, 244, 0.5);
}

.tdx-gift-btn:hover .tdx-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.06);
}

.tdx-gift-btn:active .tdx-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.tdx-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 52px;

  width: 130px;
  height: 20px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(26, 53, 0, 0.16);

  filter: blur(8px);

  animation: tdx-gift-shadow 3.5s ease-in-out infinite;
}

.tdx-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: var(--tdx-cream);

  font-family: Georgia, serif;

  pointer-events: none;

  animation: tdx-sparkle 2.6s ease-in-out infinite;
}

.tdx-gift-sparkle--1 { top: 52px; left: calc(50% - 100px); font-size: 15px; }
.tdx-gift-sparkle--2 { top: 84px; right: calc(50% - 108px); font-size: 11px; animation-delay: 0.6s; }
.tdx-gift-sparkle--3 { bottom: 96px; left: calc(50% - 116px); font-size: 10px; animation-delay: 1.2s; }
.tdx-gift-sparkle--4 { right: calc(50% - 115px); bottom: 84px; font-size: 12px; animation-delay: 1.7s; }

.tdx-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 20px;

  transform: translateX(-50%);

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

/* =========================================================
   DIALOG
========================================================= */

.tdx-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.tdx-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(26, 53, 0, 0.55);

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.tdx-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: #fefbf4;

  box-shadow: 0 30px 90px rgba(26, 53, 0, 0.3);

  scrollbar-width: thin;
  scrollbar-color: rgba(94, 129, 60, 0.35) transparent;
}

.tdx-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(209, 219, 156, 0.7);

  pointer-events: none;
}

.tdx-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tdx-green);

  border: 1px solid var(--tdx-line);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.tdx-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: #ffffff;
}

.tdx-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.tdx-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  color: var(--tdx-green);

  font-family: Carattere, cursive;
  font-size: 34px;
  font-weight: 400;
}

.tdx-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   TÀI KHOẢN
========================================================= */

.tdx-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.tdx-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: rgba(255, 255, 255, 0.75);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tdx-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(26, 53, 0, 0.1);
}

.tdx-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.tdx-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--tdx-green);

  border: 1px solid var(--tdx-line);
  border-radius: 50%;

  background: #ffffff;
}

.tdx-account-label {
  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.tdx-account-bank {
  margin-top: 2px;

  color: var(--tdx-green);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.tdx-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.tdx-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.tdx-qr-inner {
  padding: 7px;

  border: 1px solid var(--tdx-line);

  background: #ffffff;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tdx-qr-button:hover .tdx-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(26, 53, 0, 0.12);
}

.tdx-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.tdx-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: var(--tdx-green);
  border-style: solid;

  pointer-events: none;
}

.tdx-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.tdx-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.tdx-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.tdx-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.tdx-qr-hint {
  margin-top: 7px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-align: center;
}

/* =========================================================
   THÔNG TIN TÀI KHOẢN
========================================================= */

.tdx-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: rgba(255, 255, 255, 0.7);
}

.tdx-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.tdx-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tdx-info-label {
  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.tdx-info-value {
  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.tdx-account-number {
  color: var(--tdx-green);

  letter-spacing: 0.06em;
}

.tdx-info-divider {
  height: 1px;

  margin: 8px 0;

  background: var(--tdx-line);
}

.tdx-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--tdx-green);

  border: 1px solid var(--tdx-line);
  border-radius: 50%;

  background: #ffffff;

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.tdx-copy-button:hover {
  transform: scale(1.08);

  background: #ffffff;
}

.tdx-account-desc {
  margin-top: 9px;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

/* =========================================================
   XEM TRƯỚC QR
========================================================= */

.tdx-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.tdx-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(26, 53, 0, 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.tdx-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: #fefbf4;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.tdx-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tdx-green);

  border: 1px solid var(--tdx-line);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.85);

  cursor: pointer;
}

.tdx-qr-preview__title {
  margin-bottom: 15px;

  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.tdx-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid var(--tdx-line);

  background: #ffffff;
}

.tdx-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.tdx-qr-preview__card p {
  margin: 14px 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
}

.tdx-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 10px 18px;

  border-radius: 7px;

  color: #fefbf4;

  background: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 12px 26px rgba(94, 129, 60, 0.3);
}

/* =========================================================
   HIỆU ỨNG
========================================================= */

.tdx-gift-dialog-enter-active,
.tdx-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.tdx-gift-dialog-enter-active .tdx-gift-dialog__card,
.tdx-gift-dialog-leave-active .tdx-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.tdx-gift-dialog-enter-from {
  opacity: 0;
}

.tdx-gift-dialog-enter-from .tdx-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88);
}

.tdx-gift-dialog-leave-to {
  opacity: 0;
}

.tdx-gift-dialog-leave-to .tdx-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.tdx-qr-preview-enter-active,
.tdx-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.tdx-qr-preview-enter-active .tdx-qr-preview__card,
.tdx-qr-preview-leave-active .tdx-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.tdx-qr-preview-enter-from {
  opacity: 0;
}

.tdx-qr-preview-enter-from .tdx-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.tdx-qr-preview-leave-to {
  opacity: 0;
}

.tdx-qr-preview-leave-to .tdx-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes tdx-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes tdx-gift-shadow {
  0%,
  100% {
    transform: translateX(-50%) scaleX(1);
    opacity: 0.16;
  }

  50% {
    transform: translateX(-50%) scaleX(0.76);
    opacity: 0.08;
  }
}

@keyframes tdx-gift-glow {
  0%,
  100% {
    opacity: 0.65;

    transform: translateX(-50%) scale(0.94);
  }

  50% {
    opacity: 1;

    transform: translateX(-50%) scale(1.08);
  }
}

@keyframes tdx-sparkle {
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
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-gifts__inner {
    width: min(100%, 600px);

    padding: 2.5% 5px 20%;

    gap: 16px;
  }

  .tdx-decor--line-right {
    top: 80px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 560px;
  }

  .tdx-decor--flower-right {
    top: 20px;
    left: -300px;
    right: auto;

    width: 420px;
    height: 420px;
  }

  .tdx-decor--ribbon {
    bottom: 20px;
    left: -538px;

    width: 1403px;
    height: 246px;
  }

  .tdx-heading {
    font-size: 27px;
  }

  .tdx-gifts__intro {
    font-size: 16px;
  }

  .tdx-gift-btn {
    min-height: 320px;
  }

  .tdx-gift-box {
    width: 170px;
    height: 170px;
  }

  .tdx-gift-glow {
    width: 260px;
    height: 260px;
  }

  .tdx-gift-hint {
    font-size: 13px;
  }

  .tdx-gift-dialog__card h3 {
    font-size: 42px;
  }

  .tdx-gift-dialog__desc {
    font-size: 15px;
  }

  .tdx-account-label,
  .tdx-account-bank,
  .tdx-info-label,
  .tdx-info-value,
  .tdx-account-desc {
    font-size: 13px;
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .tdx-gift-box {
    width: 118px;
    height: 118px;
  }

  .tdx-gift-btn {
    min-height: 240px;
  }

  .tdx-qr-code {
    width: 125px;
    height: 125px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .tdx-gift-box,
  .tdx-gift-shadow,
  .tdx-gift-glow,
  .tdx-gift-sparkle {
    animation: none;
  }

  .tdx-gift-dialog-enter-active,
  .tdx-gift-dialog-leave-active,
  .tdx-qr-preview-enter-active,
  .tdx-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.tdx-gift-dialog-open) {
  overflow: hidden;
}
</style>
