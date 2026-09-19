<template>
  <section class="lp-gifts">
    <div class="lp-section-title">
      <h2>HỘP MỪNG CƯỚI</h2>
    </div>

    <p class="lp-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="lp-gifts__list">
      <article class="lp-gifts__item">
        <button type="button" class="lp-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="lp-gift-glow"></div>

          <div class="lp-gift-box">
            <img :src="chuHy" alt="囍" class="lp-gift-icon" draggable="false" />

            <span class="lp-gift-sparkle lp-gift-sparkle--1">✦</span>
            <span class="lp-gift-sparkle lp-gift-sparkle--2">❦</span>
            <span class="lp-gift-sparkle lp-gift-sparkle--3">✦</span>
            <span class="lp-gift-sparkle lp-gift-sparkle--4">❦</span>
          </div>

          <div class="lp-gift-shadow"></div>

          <div class="lp-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <!-- =====================================================
         DIALOG THÔNG TIN TÀI KHOẢN
    ====================================================== -->
    <Teleport to="body">
      <Transition name="lp-gift-dialog">
        <div v-if="showGiftDialog" class="lp-gift-dialog" @click.self="closeGift">
          <div class="lp-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="lp-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="lp-gift-dialog-title">
            <button type="button" class="lp-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <img :src="chuHy" alt="" aria-hidden="true" class="lp-gift-dialog__symbol" />

            <h3 id="lp-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="lp-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="lp-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="lp-account-card">
                <div class="lp-account-heading">
                  <div class="lp-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="lp-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="lp-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="lp-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="lp-qr-frame">
                    <div class="lp-qr-corner lp-qr-corner--tl"></div>
                    <div class="lp-qr-corner lp-qr-corner--tr"></div>
                    <div class="lp-qr-corner lp-qr-corner--bl"></div>
                    <div class="lp-qr-corner lp-qr-corner--br"></div>

                    <div class="lp-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="lp-qr-code" />
                    </div>
                  </div>

                  <div class="lp-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="lp-account-info">
                  <div class="lp-info-row">
                    <div class="lp-info-left">
                      <span class="lp-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="lp-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="lp-info-divider"></div>

                  <div class="lp-info-row">
                    <div class="lp-info-left">
                      <span class="lp-info-label">SỐ TÀI KHOẢN</span>

                      <span class="lp-info-value lp-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="lp-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="lp-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="lp-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="lp-gift-dialog__footer">
              <span></span>

              <i>❦</i>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="lp-qr-preview">
        <div v-if="previewQr" class="lp-qr-preview" @click.self="closeQr">
          <div class="lp-qr-preview__backdrop" @click="closeQr"></div>

          <div class="lp-qr-preview__card">
            <button type="button" class="lp-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="lp-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="lp-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="lp-qr-preview__save"
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
import chuHy from "@/assets/decor/longphung-v3/chu-hy.webp";

const props = defineProps({
  gifts: { type: Array, default: () => [] },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("lp-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("lp-gift-dialog-open");
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

  document.body.classList.remove("lp-gift-dialog-open");
});
</script>

<style scoped>
.lp-gifts {
  position: relative;

  width: min(600px, calc(100% - 24px));

  margin: 24px auto 30px;
  padding: 30px 16px 28px;

  text-align: center;

  color: #ffbe89;
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 14px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: #ffbe89;
}

.lp-gifts__intro {
  margin: 0 0 24px;

  font-size: 13px;

  line-height: 1.7;

  color: rgba(255, 190, 137, 0.75);
}

/* =========================================================
   HỘP QUÀ
========================================================= */

.lp-gifts__list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.lp-gifts__item {
  width: 100%;
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.lp-gift-btn {
  position: relative;

  width: 100%;
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 190, 137, 0.3);
  border-radius: 14px;

  background: rgba(255, 190, 137, 0.05);

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.lp-gift-glow {
  position: absolute;

  width: 220px;
  height: 220px;

  left: 50%;
  top: 40px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(255, 190, 137, 0.35),
    rgba(255, 190, 137, 0.1) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: lp-gift-glow 3.5s ease-in-out infinite;
}

.lp-gift-box {
  position: relative;
  z-index: 3;

  width: 140px;
  height: 140px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(140deg, rgba(255, 190, 137, 0.2), rgba(212, 175, 55, 0.15));

  border: 1px solid rgba(255, 190, 137, 0.5);

  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.35),
    inset 0 2px 6px rgba(255, 190, 137, 0.2);

  animation: lp-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.lp-gift-icon {
  width: 84px;
  height: 84px;

  object-fit: contain;
}

.lp-gift-btn:hover .lp-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-3deg) scale(1.035);

  filter: brightness(1.1);
}

.lp-gift-btn:active .lp-gift-box {
  transform: translateY(2px) scale(0.93) rotate(3deg);
}

.lp-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 62px;

  width: 125px;
  height: 20px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.3);

  filter: blur(8px);

  animation: lp-gift-shadow 3.5s ease-in-out infinite;
}

.lp-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #d4af37;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 190, 137, 0.9),
    0 0 14px rgba(212, 175, 55, 0.35);

  pointer-events: none;

  animation: lp-sparkle 2.6s ease-in-out infinite;
}

.lp-gift-sparkle--1 { top: 58px; left: calc(50% - 105px); font-size: 15px; }
.lp-gift-sparkle--2 { top: 91px; right: calc(50% - 112px); font-size: 11px; animation-delay: 0.6s; }
.lp-gift-sparkle--3 { bottom: 105px; left: calc(50% - 120px); font-size: 10px; animation-delay: 1.2s; }
.lp-gift-sparkle--4 { right: calc(50% - 120px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.lp-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 22px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: rgba(255, 190, 137, 0.85);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

/* =========================================================
   DIALOG
========================================================= */

.lp-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.lp-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(30, 0, 4, 0.7);

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.lp-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 30px 26px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(255, 190, 137, 0.45);
  border-radius: 16px;

  background: #5a000e;

  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.5);

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 190, 137, 0.4) transparent;
}

.lp-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 14px;
  right: 14px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffbe89;

  border: 1px solid rgba(255, 190, 137, 0.4);
  border-radius: 50%;

  background: rgba(255, 190, 137, 0.1);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.lp-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: rgba(255, 190, 137, 0.2);
}

.lp-gift-dialog__symbol {
  width: 48px;
  height: 48px;

  object-fit: contain;

  margin-bottom: 6px;
}

.lp-gift-dialog__card h3 {
  margin: 0 0 4px;

  font-family: "Times New Roman", Times, serif;

  font-size: 26px;
  font-weight: 700;

  letter-spacing: 0.04em;

  color: #ffbe89;
}

.lp-gift-dialog__desc {
  max-width: 450px;

  margin: 0 auto 22px;

  font-size: 12px;

  line-height: 1.6;

  color: rgba(255, 190, 137, 0.75);
}

/* =========================================================
   TÀI KHOẢN
========================================================= */

.lp-account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.lp-account-card {
  padding: 16px;

  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 12px;

  background: rgba(255, 190, 137, 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.lp-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(0, 0, 0, 0.25);
}

.lp-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.lp-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #d4af37;

  border: 1px solid rgba(212, 175, 55, 0.5);
  border-radius: 50%;

  background: rgba(212, 175, 55, 0.1);
}

.lp-account-label {
  color: #ffbe89;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.lp-account-bank {
  margin-top: 2px;

  color: rgba(255, 190, 137, 0.65);

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.lp-qr-button {
  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.lp-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.lp-qr-inner {
  padding: 7px;

  border: 1px solid rgba(212, 175, 55, 0.45);

  background: white;

  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.2);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.lp-qr-button:hover .lp-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.lp-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.lp-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #d4af37;
  border-style: solid;

  pointer-events: none;
}

.lp-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.lp-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.lp-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.lp-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.lp-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: rgba(255, 190, 137, 0.6);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   THÔNG TIN TÀI KHOẢN
========================================================= */

.lp-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 10px;

  background: rgba(255, 190, 137, 0.05);
}

.lp-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.lp-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lp-info-label {
  color: rgba(255, 190, 137, 0.6);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.lp-info-value {
  color: #ffbe89;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.lp-account-number {
  color: #d4af37;

  letter-spacing: 0.06em;
}

.lp-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.35), transparent);
}

.lp-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #ffbe89;

  border: 1px solid rgba(255, 190, 137, 0.4);
  border-radius: 50%;

  background: rgba(255, 190, 137, 0.1);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.lp-copy-button:hover {
  transform: scale(1.08);

  background: rgba(255, 190, 137, 0.2);
}

.lp-account-desc {
  margin-top: 9px;

  color: rgba(255, 190, 137, 0.65);

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.lp-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: rgba(255, 190, 137, 0.6);
}

.lp-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(255, 190, 137, 0.5));
}

.lp-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

.lp-gift-dialog__footer i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   QR PREVIEW
========================================================= */

.lp-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.lp-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(20, 0, 3, 0.8);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.lp-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(255, 190, 137, 0.5);
  border-radius: 14px;

  background: #5a000e;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
}

.lp-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffbe89;

  border: 1px solid rgba(255, 190, 137, 0.4);
  border-radius: 50%;

  background: rgba(255, 190, 137, 0.1);

  cursor: pointer;
}

.lp-qr-preview__title {
  margin-bottom: 15px;

  color: #ffbe89;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.lp-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(212, 175, 55, 0.5);

  background: white;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.lp-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.lp-qr-preview__card p {
  margin: 14px 0;

  color: rgba(255, 190, 137, 0.7);

  font-size: 11px;
  font-style: italic;
}

.lp-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: #710001;

  border-radius: 999px;

  background: #ffbe89;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(255, 190, 137, 0.28);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.lp-gift-dialog-enter-active,
.lp-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.lp-gift-dialog-enter-active .lp-gift-dialog__card,
.lp-gift-dialog-leave-active .lp-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.lp-gift-dialog-enter-from {
  opacity: 0;
}

.lp-gift-dialog-enter-from .lp-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88);
}

.lp-gift-dialog-leave-to {
  opacity: 0;
}

.lp-gift-dialog-leave-to .lp-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.lp-qr-preview-enter-active,
.lp-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.lp-qr-preview-enter-active .lp-qr-preview__card,
.lp-qr-preview-leave-active .lp-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.lp-qr-preview-enter-from {
  opacity: 0;
}

.lp-qr-preview-enter-from .lp-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.lp-qr-preview-leave-to {
  opacity: 0;
}

.lp-qr-preview-leave-to .lp-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes lp-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(2deg);
  }
}

@keyframes lp-gift-shadow {
  0%,
  100% {
    transform: translateX(-50%) scaleX(1);
    opacity: 0.3;
  }

  50% {
    transform: translateX(-50%) scaleX(0.76);
    opacity: 0.15;
  }
}

@keyframes lp-gift-glow {
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

@keyframes lp-sparkle {
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
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .lp-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 24px;

    padding: 26px 12px 24px;
  }

  .lp-gifts__item,
  .lp-gift-btn {
    min-height: 280px;
  }

  .lp-gift-box {
    width: 120px;
    height: 120px;
  }

  .lp-gift-icon {
    width: 72px;
    height: 72px;
  }

  .lp-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .lp-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 26px 14px 20px;
  }

  .lp-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .lp-qr-code {
    width: 135px;
    height: 135px;
  }

  .lp-qr-preview {
    padding: 14px;
  }

  .lp-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lp-gift-box,
  .lp-gift-shadow,
  .lp-gift-glow,
  .lp-gift-sparkle {
    animation: none;
  }

  .lp-gift-dialog-enter-active,
  .lp-gift-dialog-leave-active,
  .lp-qr-preview-enter-active,
  .lp-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.lp-gift-dialog-open) {
  overflow: hidden;
}
</style>
