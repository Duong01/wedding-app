<template>
  <section class="mg-gifts">
    <div class="mg-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="mg-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="mg-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="mg-gifts__list">
      <article class="mg-gifts__item">
        <button type="button" class="mg-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="mg-gift-glow"></div>

          <div class="mg-gift-box">
            <div class="mg-gift-icon">
              <v-icon size="52" color="#261d23">mdi-gift-outline</v-icon>
            </div>

            <span class="mg-gift-sparkle mg-gift-sparkle--1">✦</span>
            <span class="mg-gift-sparkle mg-gift-sparkle--2">✧</span>
            <span class="mg-gift-sparkle mg-gift-sparkle--3">✦</span>
            <span class="mg-gift-sparkle mg-gift-sparkle--4">✧</span>
          </div>

          <div class="mg-gift-shadow"></div>

          <div class="mg-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="mg-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="mg-gift-dialog">
        <div v-if="showGiftDialog" class="mg-gift-dialog" @click.self="closeGift">
          <div class="mg-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="mg-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="mg-gift-dialog-title">
            <div class="mg-gift-dialog__glow"></div>

            <div class="mg-gift-dialog__decoration">
              <span></span>

              <div class="mg-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="mg-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="mg-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="mg-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="mg-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="mg-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="mg-account-card">
                <div class="mg-account-heading">
                  <div class="mg-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="mg-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="mg-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="mg-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="mg-qr-frame">
                    <div class="mg-qr-corner mg-qr-corner--tl"></div>
                    <div class="mg-qr-corner mg-qr-corner--tr"></div>
                    <div class="mg-qr-corner mg-qr-corner--bl"></div>
                    <div class="mg-qr-corner mg-qr-corner--br"></div>

                    <div class="mg-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="mg-qr-code" />
                    </div>
                  </div>

                  <div class="mg-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="mg-account-info">
                  <div class="mg-info-row">
                    <div class="mg-info-left">
                      <span class="mg-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="mg-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="mg-info-divider"></div>

                  <div class="mg-info-row">
                    <div class="mg-info-left">
                      <span class="mg-info-label">SỐ TÀI KHOẢN</span>

                      <span class="mg-info-value mg-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="mg-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="mg-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="mg-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="mg-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="mg-qr-preview">
        <div v-if="previewQr" class="mg-qr-preview" @click.self="closeQr">
          <div class="mg-qr-preview__backdrop" @click="closeQr"></div>

          <div class="mg-qr-preview__card">
            <button type="button" class="mg-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="mg-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="mg-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="mg-qr-preview__save"
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

const props = defineProps({
  gifts: { type: Array, default: () => [] },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("mg-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("mg-gift-dialog-open");
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

  document.body.classList.remove("mg-gift-dialog-open");
});
</script>

<style scoped>
.mg-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #f0e6d2;

  border: 1px solid rgba(216, 182, 118, 0.28);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);

  overflow: hidden;
}

.mg-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(216, 182, 118, 0.18);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.mg-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #d8b676;
}

.mg-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.7));
}

.mg-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.mg-eyebrow {
  position: relative;

  margin: 0;

  color: #d8b676;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mg-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #f0e6d2;
}

.mg-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #b9a88f;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   GIFT BOX
========================================================= */

.mg-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.mg-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.mg-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(216, 182, 118, 0.25);
  border-radius: 23px;

  background: radial-gradient(circle at center, rgba(216, 182, 118, 0.08), rgba(255, 255, 255, 0.02));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.mg-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(216, 182, 118, 0.28),
    rgba(216, 182, 118, 0.08) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: mg-gift-glow 3.5s ease-in-out infinite;
}

.mg-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, #eed9a8, #d8b676 60%, #9b7d4d);

  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(216, 182, 118, 0.2),
    inset 0 2px 6px rgba(255, 255, 255, 0.35);

  animation: mg-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.mg-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(38, 29, 35, 0.45);
  border-radius: 24px;
}

.mg-gift-btn:hover .mg-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.mg-gift-btn:active .mg-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.mg-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.45);

  filter: blur(8px);

  animation: mg-gift-shadow 3.5s ease-in-out infinite;
}

.mg-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #eed9a8;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(216, 182, 118, 0.85),
    0 0 14px rgba(216, 182, 118, 0.35);

  pointer-events: none;

  animation: mg-sparkle 2.6s ease-in-out infinite;
}

.mg-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.mg-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.mg-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.mg-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.mg-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #d8b676;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.mg-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #d8b676, transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.mg-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.mg-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(29, 22, 34, 0.55), rgba(10, 7, 12, 0.8));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.mg-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(216, 182, 118, 0.4);
  border-radius: 28px;

  background: linear-gradient(170deg, #221a28, #17121b);

  box-shadow:
    0 30px 90px rgba(0, 0, 0, 0.6),
    0 0 50px rgba(216, 182, 118, 0.1),
    inset 0 0 0 1px rgba(216, 182, 118, 0.12);

  scrollbar-width: thin;
  scrollbar-color: rgba(216, 182, 118, 0.35) transparent;
}

.mg-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(216, 182, 118, 0.18);
  border-radius: 21px;

  pointer-events: none;
}

.mg-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(216, 182, 118, 0.25), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.mg-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.mg-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.65));
}

.mg-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.mg-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #261d23;

  border-radius: 50%;

  background: linear-gradient(135deg, #d8b676, #9b7d4d);

  box-shadow: 0 7px 18px rgba(0, 0, 0, 0.45), 0 0 16px rgba(216, 182, 118, 0.2);

  animation: mg-heart-pulse 2.5s ease-in-out infinite;
}

.mg-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #d8b676;

  border: 1px solid rgba(216, 182, 118, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.06);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.mg-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: rgba(216, 182, 118, 0.15);
}

.mg-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #b9a88f;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.mg-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #d8b676;
}

.mg-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #b9a88f;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.mg-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.mg-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(216, 182, 118, 0.28);
  border-radius: 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mg-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(216, 182, 118, 0.1);
}

.mg-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.mg-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #d8b676;

  border: 1px solid rgba(216, 182, 118, 0.3);
  border-radius: 50%;

  background: rgba(216, 182, 118, 0.1);
}

.mg-account-label {
  color: #f0e6d2;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.mg-account-bank {
  margin-top: 2px;

  color: #b9a88f;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.mg-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.mg-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.mg-qr-inner {
  padding: 7px;

  border: 1px solid rgba(216, 182, 118, 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.35);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mg-qr-button:hover .mg-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45), 0 0 18px rgba(216, 182, 118, 0.15);
}

.mg-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.mg-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #d8b676;
  border-style: solid;

  pointer-events: none;
}

.mg-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.mg-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.mg-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.mg-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.mg-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #b9a88f;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.mg-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(216, 182, 118, 0.2);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.04);
}

.mg-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.mg-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mg-info-label {
  color: #b9a88f;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.mg-info-value {
  color: #f0e6d2;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.mg-account-number {
  color: #eed9a8;

  letter-spacing: 0.06em;
}

.mg-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.28), transparent);
}

.mg-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #d8b676;

  border: 1px solid rgba(216, 182, 118, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.06);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.mg-copy-button:hover {
  transform: scale(1.08);

  background: rgba(216, 182, 118, 0.15);
}

.mg-account-desc {
  margin-top: 9px;

  color: #b9a88f;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.mg-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #d8b676;
}

.mg-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.5));
}

.mg-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.mg-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.mg-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(10, 7, 12, 0.78);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.mg-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(216, 182, 118, 0.4);
  border-radius: 24px;

  background: linear-gradient(170deg, #221a28, #17121b);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6), 0 0 40px rgba(216, 182, 118, 0.1);
}

.mg-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #d8b676;

  border: 1px solid rgba(216, 182, 118, 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.06);

  cursor: pointer;
}

.mg-qr-preview__title {
  margin-bottom: 15px;

  color: #f0e6d2;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.mg-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(216, 182, 118, 0.35);

  background: white;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.mg-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.mg-qr-preview__card p {
  margin: 14px 0;

  color: #b9a88f;

  font-size: 11px;
  font-style: italic;
}

.mg-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: #261d23;

  border-radius: 999px;

  background: linear-gradient(135deg, #d8b676, #9b7d4d);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(0, 0, 0, 0.45), 0 0 16px rgba(216, 182, 118, 0.2);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.mg-gift-dialog-enter-active,
.mg-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.mg-gift-dialog-enter-active .mg-gift-dialog__card,
.mg-gift-dialog-leave-active .mg-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.mg-gift-dialog-enter-from {
  opacity: 0;
}

.mg-gift-dialog-enter-from .mg-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.mg-gift-dialog-leave-to {
  opacity: 0;
}

.mg-gift-dialog-leave-to .mg-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.mg-qr-preview-enter-active,
.mg-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.mg-qr-preview-enter-active .mg-qr-preview__card,
.mg-qr-preview-leave-active .mg-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.mg-qr-preview-enter-from {
  opacity: 0;
}

.mg-qr-preview-enter-from .mg-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.mg-qr-preview-leave-to {
  opacity: 0;
}

.mg-qr-preview-leave-to .mg-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes mg-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes mg-gift-shadow {
  0%,
  100% {
    transform: translateX(-50%) scaleX(1);
    opacity: 0.45;
  }

  50% {
    transform: translateX(-50%) scaleX(0.76);
    opacity: 0.25;
  }
}

@keyframes mg-gift-glow {
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

@keyframes mg-sparkle {
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

@keyframes mg-heart-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .mg-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .mg-gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .mg-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .mg-gifts__item,
  .mg-gift-btn {
    min-height: 295px;
  }

  .mg-gift-box {
    width: 130px;
    height: 130px;
  }

  .mg-gift-glow {
    width: 190px;
    height: 190px;
  }

  .mg-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .mg-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .mg-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .mg-gift-dialog__card h3 {
    font-size: 26px;
  }

  .mg-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .mg-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .mg-account-card {
    padding: 14px;
  }

  .mg-qr-code {
    width: 135px;
    height: 135px;
  }

  .mg-account-info {
    margin-top: 11px;
  }

  .mg-qr-preview {
    padding: 14px;
  }

  .mg-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .mg-gift-box {
    width: 115px;
    height: 115px;
  }

  .mg-gifts__item,
  .mg-gift-btn {
    min-height: 280px;
  }

  .mg-qr-code {
    width: 125px;
    height: 125px;
  }

  .mg-account-label {
    font-size: 9px;
  }

  .mg-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-gift-box,
  .mg-gift-shadow,
  .mg-gift-glow,
  .mg-gift-sparkle,
  .mg-gift-dialog__heart {
    animation: none;
  }

  .mg-gift-dialog-enter-active,
  .mg-gift-dialog-leave-active,
  .mg-qr-preview-enter-active,
  .mg-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.mg-gift-dialog-open) {
  overflow: hidden;
}
</style>
