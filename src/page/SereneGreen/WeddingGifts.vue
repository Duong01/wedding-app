<template>
  <section class="sg-gifts">
    <div class="sg-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="sg-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="sg-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="sg-gifts__list">
      <article class="sg-gifts__item">
        <button type="button" class="sg-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="sg-gift-glow"></div>

          <div class="sg-gift-box">
            <div class="sg-gift-icon">
              <v-icon size="52" color="#f2f8f0">mdi-gift-outline</v-icon>
            </div>

            <span class="sg-gift-sparkle sg-gift-sparkle--1">✦</span>
            <span class="sg-gift-sparkle sg-gift-sparkle--2">✧</span>
            <span class="sg-gift-sparkle sg-gift-sparkle--3">✦</span>
            <span class="sg-gift-sparkle sg-gift-sparkle--4">✧</span>
          </div>

          <div class="sg-gift-shadow"></div>

          <div class="sg-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="sg-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-leaf</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="sg-gift-dialog">
        <div v-if="showGiftDialog" class="sg-gift-dialog" @click.self="closeGift">
          <div class="sg-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="sg-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="sg-gift-dialog-title">
            <div class="sg-gift-dialog__glow"></div>

            <div class="sg-gift-dialog__decoration">
              <span></span>

              <div class="sg-gift-dialog__heart">
                <v-icon size="17">mdi-leaf</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="sg-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="sg-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="sg-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="sg-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="sg-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="sg-account-card">
                <div class="sg-account-heading">
                  <div class="sg-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="sg-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="sg-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="sg-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="sg-qr-frame">
                    <div class="sg-qr-corner sg-qr-corner--tl"></div>
                    <div class="sg-qr-corner sg-qr-corner--tr"></div>
                    <div class="sg-qr-corner sg-qr-corner--bl"></div>
                    <div class="sg-qr-corner sg-qr-corner--br"></div>

                    <div class="sg-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="sg-qr-code" />
                    </div>
                  </div>

                  <div class="sg-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="sg-account-info">
                  <div class="sg-info-row">
                    <div class="sg-info-left">
                      <span class="sg-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="sg-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="sg-info-divider"></div>

                  <div class="sg-info-row">
                    <div class="sg-info-left">
                      <span class="sg-info-label">SỐ TÀI KHOẢN</span>

                      <span class="sg-info-value sg-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="sg-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="sg-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="sg-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="sg-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="sg-qr-preview">
        <div v-if="previewQr" class="sg-qr-preview" @click.self="closeQr">
          <div class="sg-qr-preview__backdrop" @click="closeQr"></div>

          <div class="sg-qr-preview__card">
            <button type="button" class="sg-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="sg-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="sg-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="sg-qr-preview__save"
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

  document.body.classList.add("sg-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("sg-gift-dialog-open");
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

  document.body.classList.remove("sg-gift-dialog-open");
});
</script>

<style scoped>
.sg-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #28514b;

  border: 1px solid rgba(108, 142, 122, 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(240, 246, 238, 0.4));

  box-shadow: 0 12px 35px rgba(40, 81, 75, 0.09);

  overflow: hidden;
}

.sg-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(108, 142, 122, 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.sg-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #8fae9b;
}

.sg-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.7));
}

.sg-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.sg-eyebrow {
  position: relative;

  margin: 0;

  color: #6c8e7a;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sg-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #28514b;
}

.sg-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #7a8a80;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   GIFT BOX
========================================================= */

.sg-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.sg-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.sg-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(108, 142, 122, 0.3);
  border-radius: 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(240, 246, 238, 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.sg-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(200, 212, 195, 0.5),
    rgba(200, 212, 195, 0.14) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: sg-gift-glow 3.5s ease-in-out infinite;
}

.sg-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, #6c8e7a, #3f6f63 60%, #28514b);

  box-shadow:
    0 20px 40px rgba(63, 111, 99, 0.35),
    inset 0 2px 6px rgba(245, 248, 244, 0.4);

  animation: sg-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.sg-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(245, 248, 244, 0.5);
  border-radius: 24px;
}

.sg-gift-btn:hover .sg-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.sg-gift-btn:active .sg-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.sg-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(40, 81, 75, 0.16);

  filter: blur(8px);

  animation: sg-gift-shadow 3.5s ease-in-out infinite;
}

.sg-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #8fae9b;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(143, 174, 155, 0.25);

  pointer-events: none;

  animation: sg-sparkle 2.6s ease-in-out infinite;
}

.sg-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.sg-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.sg-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.sg-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.sg-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #3f6f63;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.sg-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #8fae9b, transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.sg-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.sg-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(245, 248, 244, 0.4), rgba(30, 58, 52, 0.6));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.sg-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(108, 142, 122, 0.5);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(251, 253, 250, 0.98), rgba(237, 244, 235, 0.97));

  box-shadow:
    0 30px 90px rgba(30, 58, 52, 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(143, 174, 155, 0.35) transparent;
}

.sg-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(108, 142, 122, 0.22);
  border-radius: 21px;

  pointer-events: none;
}

.sg-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(200, 212, 195, 0.45), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.sg-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.sg-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.65));
}

.sg-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.sg-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background: linear-gradient(135deg, #6c8e7a, #3f6f63);

  box-shadow: 0 7px 18px rgba(63, 111, 99, 0.25);

  animation: sg-heart-pulse 2.5s ease-in-out infinite;
}

.sg-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #3f6f63;

  border: 1px solid rgba(108, 142, 122, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.sg-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.sg-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #6c8e7a;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.sg-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #28514b;
}

.sg-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #7a8a80;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.sg-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.sg-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(108, 142, 122, 0.32);
  border-radius: 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(240, 246, 238, 0.75));

  box-shadow: 0 8px 25px rgba(40, 81, 75, 0.07);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sg-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(40, 81, 75, 0.11);
}

.sg-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.sg-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #3f6f63;

  border: 1px solid rgba(108, 142, 122, 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, #e3efe0);
}

.sg-account-label {
  color: #28514b;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.sg-account-bank {
  margin-top: 2px;

  color: #7a8a80;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.sg-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.sg-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.sg-qr-inner {
  padding: 7px;

  border: 1px solid rgba(108, 142, 122, 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(40, 81, 75, 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sg-qr-button:hover .sg-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(40, 81, 75, 0.13);
}

.sg-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.sg-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #8fae9b;
  border-style: solid;

  pointer-events: none;
}

.sg-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.sg-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.sg-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.sg-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.sg-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #7a8a80;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.sg-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(108, 142, 122, 0.2);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.55);
}

.sg-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.sg-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sg-info-label {
  color: #6c8e7a;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.sg-info-value {
  color: #28514b;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.sg-account-number {
  color: #3f6f63;

  letter-spacing: 0.06em;
}

.sg-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.28), transparent);
}

.sg-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #3f6f63;

  border: 1px solid rgba(108, 142, 122, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.sg-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.sg-account-desc {
  margin-top: 9px;

  color: #7a8a80;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.sg-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #8fae9b;
}

.sg-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.5));
}

.sg-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.sg-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.sg-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(24, 44, 39, 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.sg-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(108, 142, 122, 0.5);
  border-radius: 24px;

  background: linear-gradient(170deg, #fbfdfa, #edf4eb);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.sg-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #3f6f63;

  border: 1px solid rgba(108, 142, 122, 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.82);

  cursor: pointer;
}

.sg-qr-preview__title {
  margin-bottom: 15px;

  color: #28514b;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.sg-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(108, 142, 122, 0.4);

  background: white;

  box-shadow: 0 10px 30px rgba(40, 81, 75, 0.12);
}

.sg-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.sg-qr-preview__card p {
  margin: 14px 0;

  color: #7a8a80;

  font-size: 11px;
  font-style: italic;
}

.sg-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background: linear-gradient(135deg, #6c8e7a, #3f6f63);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(63, 111, 99, 0.22);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.sg-gift-dialog-enter-active,
.sg-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.sg-gift-dialog-enter-active .sg-gift-dialog__card,
.sg-gift-dialog-leave-active .sg-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.sg-gift-dialog-enter-from {
  opacity: 0;
}

.sg-gift-dialog-enter-from .sg-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.sg-gift-dialog-leave-to {
  opacity: 0;
}

.sg-gift-dialog-leave-to .sg-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.sg-qr-preview-enter-active,
.sg-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.sg-qr-preview-enter-active .sg-qr-preview__card,
.sg-qr-preview-leave-active .sg-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.sg-qr-preview-enter-from {
  opacity: 0;
}

.sg-qr-preview-enter-from .sg-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.sg-qr-preview-leave-to {
  opacity: 0;
}

.sg-qr-preview-leave-to .sg-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes sg-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes sg-gift-shadow {
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

@keyframes sg-gift-glow {
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

@keyframes sg-sparkle {
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

@keyframes sg-heart-pulse {
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
  .sg-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .sg-gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .sg-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .sg-gifts__item,
  .sg-gift-btn {
    min-height: 295px;
  }

  .sg-gift-box {
    width: 130px;
    height: 130px;
  }

  .sg-gift-glow {
    width: 190px;
    height: 190px;
  }

  .sg-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .sg-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .sg-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .sg-gift-dialog__card h3 {
    font-size: 26px;
  }

  .sg-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .sg-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .sg-account-card {
    padding: 14px;
  }

  .sg-qr-code {
    width: 135px;
    height: 135px;
  }

  .sg-account-info {
    margin-top: 11px;
  }

  .sg-qr-preview {
    padding: 14px;
  }

  .sg-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .sg-gift-box {
    width: 115px;
    height: 115px;
  }

  .sg-gifts__item,
  .sg-gift-btn {
    min-height: 280px;
  }

  .sg-qr-code {
    width: 125px;
    height: 125px;
  }

  .sg-account-label {
    font-size: 9px;
  }

  .sg-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sg-gift-box,
  .sg-gift-shadow,
  .sg-gift-glow,
  .sg-gift-sparkle,
  .sg-gift-dialog__heart {
    animation: none;
  }

  .sg-gift-dialog-enter-active,
  .sg-gift-dialog-leave-active,
  .sg-qr-preview-enter-active,
  .sg-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.sg-gift-dialog-open) {
  overflow: hidden;
}
</style>
