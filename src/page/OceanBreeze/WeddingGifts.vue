<template>
  <section class="ob-gifts">
    <div class="ob-gifts__ornament">
      <span></span>
      <i>〜</i>
      <span class="ob-gifts__ornament-flip"></span>
    </div>

    <p class="ob-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="ob-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="ob-gifts__list">
      <article class="ob-gifts__item">
        <button type="button" class="ob-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="ob-gift-glow"></div>

          <div class="ob-gift-box">
            <div class="ob-gift-icon">
              <v-icon size="52" color="#ffffff">mdi-gift-outline</v-icon>
            </div>

            <span class="ob-gift-sparkle ob-gift-sparkle--1">✧</span>
            <span class="ob-gift-sparkle ob-gift-sparkle--2">❊</span>
            <span class="ob-gift-sparkle ob-gift-sparkle--3">✧</span>
            <span class="ob-gift-sparkle ob-gift-sparkle--4">〜</span>
          </div>

          <div class="ob-gift-shadow"></div>

          <div class="ob-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="ob-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span class="ob-gifts__footer-flip"></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="ob-gift-dialog">
        <div v-if="showGiftDialog" class="ob-gift-dialog" @click.self="closeGift">
          <div class="ob-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="ob-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="ob-gift-dialog-title">
            <div class="ob-gift-dialog__glow"></div>

            <div class="ob-gift-dialog__decoration">
              <span></span>

              <div class="ob-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span class="ob-gift-dialog__deco-flip"></span>
            </div>

            <button type="button" class="ob-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="ob-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="ob-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="ob-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="ob-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="ob-account-card">
                <div class="ob-account-heading">
                  <div class="ob-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="ob-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="ob-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="ob-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="ob-qr-frame">
                    <div class="ob-qr-corner ob-qr-corner--tl"></div>
                    <div class="ob-qr-corner ob-qr-corner--tr"></div>
                    <div class="ob-qr-corner ob-qr-corner--bl"></div>
                    <div class="ob-qr-corner ob-qr-corner--br"></div>

                    <div class="ob-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="ob-qr-code" />
                    </div>
                  </div>

                  <div class="ob-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="ob-account-info">
                  <div class="ob-info-row">
                    <div class="ob-info-left">
                      <span class="ob-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="ob-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="ob-info-divider"></div>

                  <div class="ob-info-row">
                    <div class="ob-info-left">
                      <span class="ob-info-label">SỐ TÀI KHOẢN</span>

                      <span class="ob-info-value ob-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="ob-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="ob-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="ob-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="ob-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span class="ob-gift-dialog__footer-flip"></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="ob-qr-preview">
        <div v-if="previewQr" class="ob-qr-preview" @click.self="closeQr">
          <div class="ob-qr-preview__backdrop" @click="closeQr"></div>

          <div class="ob-qr-preview__card">
            <button type="button" class="ob-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="ob-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="ob-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="ob-qr-preview__save"
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

  document.body.classList.add("ob-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("ob-gift-dialog-open");
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

  document.body.classList.remove("ob-gift-dialog-open");
});
</script>

<style scoped>
.ob-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #274b5c;

  border: 1px solid rgba(74, 154, 184, 0.35);
  border-radius: 24px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.65), rgba(244, 250, 252, 0.45));

  box-shadow: 0 12px 35px rgba(29, 106, 142, 0.09);

  overflow: hidden;
}

.ob-gifts::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;

  background:
    radial-gradient(circle at 12px 8px, transparent 9px, rgba(168, 208, 220, 0.55) 10px, transparent 11px) repeat-x;
  background-size: 24px 10px;
  background-position: 0 0;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.ob-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #4a9ab8;
}

.ob-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.7));
}

.ob-gifts__ornament-flip {
  transform: rotate(180deg);
}

.ob-gifts__ornament i {
  font-size: 14px;
  font-style: normal;

  color: #e8927c;
}

.ob-eyebrow {
  position: relative;

  margin: 0;

  color: #4a9ab8;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ob-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #1d6a8e;
}

.ob-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #5b8296;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   GIFT BOX
========================================================= */

.ob-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.ob-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.ob-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(74, 154, 184, 0.3);
  border-radius: 24px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.75), rgba(226, 241, 245, 0.3));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.ob-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(168, 208, 220, 0.55),
    rgba(168, 208, 220, 0.16) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: ob-gift-glow 3.5s ease-in-out infinite;
}

.ob-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, #4a9ab8, #1d6a8e 60%, #14506c);

  box-shadow:
    0 20px 40px rgba(20, 80, 108, 0.35),
    inset 0 2px 6px rgba(255, 255, 255, 0.4);

  animation: ob-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.ob-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(255, 255, 255, 0.5);
  border-radius: 24px;
}

.ob-gift-btn:hover .ob-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.ob-gift-btn:active .ob-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.ob-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(23, 74, 96, 0.18);

  filter: blur(8px);

  animation: ob-gift-shadow 3.5s ease-in-out infinite;
}

.ob-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #e8927c;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(232, 146, 124, 0.3);

  pointer-events: none;

  animation: ob-sparkle 2.6s ease-in-out infinite;
}

.ob-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.ob-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.ob-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.ob-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.ob-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #1d6a8e;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.ob-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #4a9ab8, transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.ob-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.ob-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(244, 250, 252, 0.4), rgba(15, 52, 70, 0.62));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.ob-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(74, 154, 184, 0.5);
  border-radius: 24px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.98), rgba(244, 250, 252, 0.97));

  box-shadow:
    0 30px 90px rgba(15, 52, 70, 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(74, 154, 184, 0.35) transparent;
}

.ob-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(74, 154, 184, 0.22);
  border-radius: 18px;

  pointer-events: none;
}

.ob-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(168, 208, 220, 0.5), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.ob-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.ob-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.65));
}

.ob-gift-dialog__deco-flip {
  transform: rotate(180deg);
}

.ob-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background: linear-gradient(135deg, #4a9ab8, #1d6a8e);

  box-shadow: 0 7px 18px rgba(29, 106, 142, 0.28);

  animation: ob-heart-pulse 2.5s ease-in-out infinite;
}

.ob-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #1d6a8e;

  border: 1px solid rgba(74, 154, 184, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.ob-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.ob-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #e8927c;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.ob-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #1d6a8e;
}

.ob-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #5b8296;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.ob-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.ob-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(74, 154, 184, 0.32);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(244, 250, 252, 0.78));

  box-shadow: 0 8px 25px rgba(29, 106, 142, 0.07);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ob-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(29, 106, 142, 0.11);
}

.ob-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.ob-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #1d6a8e;

  border: 1px solid rgba(74, 154, 184, 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #ffffff, #e2f1f5);
}

.ob-account-label {
  color: #274b5c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.ob-account-bank {
  margin-top: 2px;

  color: #5b8296;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.ob-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.ob-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.ob-qr-inner {
  padding: 7px;

  border: 1px solid rgba(74, 154, 184, 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(23, 74, 96, 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ob-qr-button:hover .ob-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(23, 74, 96, 0.13);
}

.ob-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.ob-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #4a9ab8;
  border-style: solid;

  pointer-events: none;
}

.ob-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.ob-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.ob-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.ob-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.ob-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #5b8296;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.ob-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(74, 154, 184, 0.2);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.6);
}

.ob-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ob-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ob-info-label {
  color: #e8927c;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.ob-info-value {
  color: #274b5c;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.ob-account-number {
  color: #1d6a8e;

  letter-spacing: 0.06em;
}

.ob-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.28), transparent);
}

.ob-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #1d6a8e;

  border: 1px solid rgba(74, 154, 184, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.ob-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.ob-account-desc {
  margin-top: 9px;

  color: #5b8296;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.ob-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #4a9ab8;
}

.ob-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.5));
}

.ob-gift-dialog__footer-flip {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.ob-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.ob-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(10, 40, 54, 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.ob-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(74, 154, 184, 0.5);
  border-radius: 24px;

  background: linear-gradient(170deg, #ffffff, #f4fafc);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.ob-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #1d6a8e;

  border: 1px solid rgba(74, 154, 184, 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.85);

  cursor: pointer;
}

.ob-qr-preview__title {
  margin-bottom: 15px;

  color: #274b5c;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.ob-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(74, 154, 184, 0.4);

  background: white;

  box-shadow: 0 10px 30px rgba(23, 74, 96, 0.12);
}

.ob-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.ob-qr-preview__card p {
  margin: 14px 0;

  color: #5b8296;

  font-size: 11px;
  font-style: italic;
}

.ob-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background: linear-gradient(135deg, #4a9ab8, #1d6a8e);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(29, 106, 142, 0.24);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.ob-gift-dialog-enter-active,
.ob-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.ob-gift-dialog-enter-active .ob-gift-dialog__card,
.ob-gift-dialog-leave-active .ob-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.ob-gift-dialog-enter-from {
  opacity: 0;
}

.ob-gift-dialog-enter-from .ob-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.ob-gift-dialog-leave-to {
  opacity: 0;
}

.ob-gift-dialog-leave-to .ob-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.ob-qr-preview-enter-active,
.ob-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.ob-qr-preview-enter-active .ob-qr-preview__card,
.ob-qr-preview-leave-active .ob-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.ob-qr-preview-enter-from {
  opacity: 0;
}

.ob-qr-preview-enter-from .ob-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.ob-qr-preview-leave-to {
  opacity: 0;
}

.ob-qr-preview-leave-to .ob-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes ob-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes ob-gift-shadow {
  0%,
  100% {
    transform: translateX(-50%) scaleX(1);
    opacity: 0.18;
  }

  50% {
    transform: translateX(-50%) scaleX(0.76);
    opacity: 0.09;
  }
}

@keyframes ob-gift-glow {
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

@keyframes ob-sparkle {
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

@keyframes ob-heart-pulse {
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
  .ob-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 20px;
  }

  .ob-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .ob-gifts__item,
  .ob-gift-btn {
    min-height: 295px;
  }

  .ob-gift-box {
    width: 130px;
    height: 130px;
  }

  .ob-gift-glow {
    width: 190px;
    height: 190px;
  }

  .ob-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .ob-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .ob-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .ob-gift-dialog__card h3 {
    font-size: 26px;
  }

  .ob-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .ob-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .ob-account-card {
    padding: 14px;
  }

  .ob-qr-code {
    width: 135px;
    height: 135px;
  }

  .ob-account-info {
    margin-top: 11px;
  }

  .ob-qr-preview {
    padding: 14px;
  }

  .ob-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .ob-gift-box {
    width: 115px;
    height: 115px;
  }

  .ob-gifts__item,
  .ob-gift-btn {
    min-height: 280px;
  }

  .ob-qr-code {
    width: 125px;
    height: 125px;
  }

  .ob-account-label {
    font-size: 9px;
  }

  .ob-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ob-gift-box,
  .ob-gift-shadow,
  .ob-gift-glow,
  .ob-gift-sparkle,
  .ob-gift-dialog__heart {
    animation: none;
  }

  .ob-gift-dialog-enter-active,
  .ob-gift-dialog-leave-active,
  .ob-qr-preview-enter-active,
  .ob-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.ob-gift-dialog-open) {
  overflow: hidden;
}
</style>
