<template>
  <section class="cb-gifts">
    <div class="cb-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="cb-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="cb-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="cb-gifts__list">
      <article class="cb-gifts__item">
        <button type="button" class="cb-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="cb-gift-glow"></div>

          <div class="cb-gift-box">
            <div class="cb-gift-icon">
              <v-icon size="52" color="#fff8ee">mdi-gift-outline</v-icon>
            </div>

            <span class="cb-gift-sparkle cb-gift-sparkle--1">✦</span>
            <span class="cb-gift-sparkle cb-gift-sparkle--2">✧</span>
            <span class="cb-gift-sparkle cb-gift-sparkle--3">✦</span>
            <span class="cb-gift-sparkle cb-gift-sparkle--4">✧</span>
          </div>

          <div class="cb-gift-shadow"></div>

          <div class="cb-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="cb-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="cb-gift-dialog">
        <div v-if="showGiftDialog" class="cb-gift-dialog" @click.self="closeGift">
          <div class="cb-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="cb-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="cb-gift-dialog-title">
            <div class="cb-gift-dialog__glow"></div>

            <div class="cb-gift-dialog__decoration">
              <span></span>

              <div class="cb-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="cb-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="cb-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="cb-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="cb-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="cb-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="cb-account-card">
                <div class="cb-account-heading">
                  <div class="cb-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="cb-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="cb-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="cb-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="cb-qr-frame">
                    <div class="cb-qr-corner cb-qr-corner--tl"></div>
                    <div class="cb-qr-corner cb-qr-corner--tr"></div>
                    <div class="cb-qr-corner cb-qr-corner--bl"></div>
                    <div class="cb-qr-corner cb-qr-corner--br"></div>

                    <div class="cb-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="cb-qr-code" />
                    </div>
                  </div>

                  <div class="cb-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="cb-account-info">
                  <div class="cb-info-row">
                    <div class="cb-info-left">
                      <span class="cb-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="cb-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="cb-info-divider"></div>

                  <div class="cb-info-row">
                    <div class="cb-info-left">
                      <span class="cb-info-label">SỐ TÀI KHOẢN</span>

                      <span class="cb-info-value cb-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="cb-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="cb-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="cb-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="cb-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="cb-qr-preview">
        <div v-if="previewQr" class="cb-qr-preview" @click.self="closeQr">
          <div class="cb-qr-preview__backdrop" @click="closeQr"></div>

          <div class="cb-qr-preview__card">
            <button type="button" class="cb-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="cb-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="cb-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="cb-qr-preview__save"
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

  document.body.classList.add("cb-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("cb-gift-dialog-open");
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

  document.body.classList.remove("cb-gift-dialog-open");
});
</script>

<style scoped>
.cb-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #6c4b4a;

  border: 1px solid rgba(201, 160, 106, 0.4);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.6), rgba(250, 240, 230, 0.4));

  box-shadow: 0 12px 35px rgba(108, 75, 74, 0.09);

  overflow: hidden;
}

.cb-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(201, 160, 106, 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.cb-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #c9a06a;
}

.cb-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.7));
}

.cb-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.cb-eyebrow {
  position: relative;

  margin: 0;

  color: #b67f7d;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cb-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #6c4b4a;
}

.cb-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #9a7a72;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   GIFT BOX
========================================================= */

.cb-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.cb-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.cb-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(201, 160, 106, 0.3);
  border-radius: 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(250, 240, 230, 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.cb-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(234, 210, 182, 0.5),
    rgba(234, 210, 182, 0.14) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: cb-gift-glow 3.5s ease-in-out infinite;
}

.cb-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, #c9a06a, #a97f4c 60%, #8f6a3e);

  box-shadow:
    0 20px 40px rgba(143, 106, 62, 0.35),
    inset 0 2px 6px rgba(255, 248, 238, 0.4);

  animation: cb-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.cb-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(255, 248, 238, 0.5);
  border-radius: 24px;
}

.cb-gift-btn:hover .cb-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.cb-gift-btn:active .cb-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.cb-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(91, 60, 40, 0.16);

  filter: blur(8px);

  animation: cb-gift-shadow 3.5s ease-in-out infinite;
}

.cb-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #c9a06a;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(201, 160, 106, 0.25);

  pointer-events: none;

  animation: cb-sparkle 2.6s ease-in-out infinite;
}

.cb-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.cb-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.cb-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.cb-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.cb-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #8f5a56;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.cb-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #c9a06a, transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.cb-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.cb-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(255, 250, 244, 0.4), rgba(72, 50, 40, 0.6));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.cb-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(201, 160, 106, 0.5);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.98), rgba(248, 237, 226, 0.97));

  box-shadow:
    0 30px 90px rgba(64, 42, 38, 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(201, 160, 106, 0.35) transparent;
}

.cb-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(201, 160, 106, 0.22);
  border-radius: 21px;

  pointer-events: none;
}

.cb-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(234, 210, 182, 0.45), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.cb-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.cb-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.65));
}

.cb-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.cb-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background: linear-gradient(135deg, #c9a06a, #a97f4c);

  box-shadow: 0 7px 18px rgba(169, 127, 76, 0.25);

  animation: cb-heart-pulse 2.5s ease-in-out infinite;
}

.cb-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8f5a56;

  border: 1px solid rgba(201, 160, 106, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.cb-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.cb-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #b67f7d;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.cb-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #6c4b4a;
}

.cb-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #9a7a72;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.cb-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.cb-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(201, 160, 106, 0.32);
  border-radius: 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(253, 244, 235, 0.75));

  box-shadow: 0 8px 25px rgba(108, 75, 74, 0.07);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cb-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(108, 75, 74, 0.11);
}

.cb-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.cb-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #8f5a56;

  border: 1px solid rgba(201, 160, 106, 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, #f5e6d6);
}

.cb-account-label {
  color: #6c4b4a;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.cb-account-bank {
  margin-top: 2px;

  color: #9a7a72;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.cb-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.cb-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.cb-qr-inner {
  padding: 7px;

  border: 1px solid rgba(201, 160, 106, 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(80, 50, 40, 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cb-qr-button:hover .cb-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(80, 50, 40, 0.13);
}

.cb-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.cb-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #c9a06a;
  border-style: solid;

  pointer-events: none;
}

.cb-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.cb-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.cb-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.cb-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.cb-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #9a7a72;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.cb-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(201, 160, 106, 0.2);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.55);
}

.cb-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.cb-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cb-info-label {
  color: #b67f7d;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.cb-info-value {
  color: #6c4b4a;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.cb-account-number {
  color: #8f5a56;

  letter-spacing: 0.06em;
}

.cb-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.28), transparent);
}

.cb-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #8f5a56;

  border: 1px solid rgba(201, 160, 106, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.cb-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.cb-account-desc {
  margin-top: 9px;

  color: #9a7a72;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.cb-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #c9a06a;
}

.cb-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.5));
}

.cb-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.cb-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.cb-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(45, 32, 26, 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.cb-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(201, 160, 106, 0.5);
  border-radius: 24px;

  background: linear-gradient(170deg, #fffdfb, #f8ede2);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.cb-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8f5a56;

  border: 1px solid rgba(201, 160, 106, 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.82);

  cursor: pointer;
}

.cb-qr-preview__title {
  margin-bottom: 15px;

  color: #6c4b4a;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.cb-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(201, 160, 106, 0.4);

  background: white;

  box-shadow: 0 10px 30px rgba(83, 50, 40, 0.12);
}

.cb-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.cb-qr-preview__card p {
  margin: 14px 0;

  color: #9a7a72;

  font-size: 11px;
  font-style: italic;
}

.cb-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background: linear-gradient(135deg, #c9a06a, #a97f4c);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(169, 127, 76, 0.22);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.cb-gift-dialog-enter-active,
.cb-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.cb-gift-dialog-enter-active .cb-gift-dialog__card,
.cb-gift-dialog-leave-active .cb-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.cb-gift-dialog-enter-from {
  opacity: 0;
}

.cb-gift-dialog-enter-from .cb-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.cb-gift-dialog-leave-to {
  opacity: 0;
}

.cb-gift-dialog-leave-to .cb-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.cb-qr-preview-enter-active,
.cb-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.cb-qr-preview-enter-active .cb-qr-preview__card,
.cb-qr-preview-leave-active .cb-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.cb-qr-preview-enter-from {
  opacity: 0;
}

.cb-qr-preview-enter-from .cb-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.cb-qr-preview-leave-to {
  opacity: 0;
}

.cb-qr-preview-leave-to .cb-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes cb-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes cb-gift-shadow {
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

@keyframes cb-gift-glow {
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

@keyframes cb-sparkle {
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

@keyframes cb-heart-pulse {
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
  .cb-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .cb-gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .cb-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .cb-gifts__item,
  .cb-gift-btn {
    min-height: 295px;
  }

  .cb-gift-box {
    width: 130px;
    height: 130px;
  }

  .cb-gift-glow {
    width: 190px;
    height: 190px;
  }

  .cb-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .cb-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .cb-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .cb-gift-dialog__card h3 {
    font-size: 26px;
  }

  .cb-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .cb-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .cb-account-card {
    padding: 14px;
  }

  .cb-qr-code {
    width: 135px;
    height: 135px;
  }

  .cb-account-info {
    margin-top: 11px;
  }

  .cb-qr-preview {
    padding: 14px;
  }

  .cb-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .cb-gift-box {
    width: 115px;
    height: 115px;
  }

  .cb-gifts__item,
  .cb-gift-btn {
    min-height: 280px;
  }

  .cb-qr-code {
    width: 125px;
    height: 125px;
  }

  .cb-account-label {
    font-size: 9px;
  }

  .cb-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cb-gift-box,
  .cb-gift-shadow,
  .cb-gift-glow,
  .cb-gift-sparkle,
  .cb-gift-dialog__heart {
    animation: none;
  }

  .cb-gift-dialog-enter-active,
  .cb-gift-dialog-leave-active,
  .cb-qr-preview-enter-active,
  .cb-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.cb-gift-dialog-open) {
  overflow: hidden;
}
</style>
