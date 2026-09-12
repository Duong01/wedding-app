<template>
  <section class="vs-gifts">
    <div class="vs-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="vs-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="vs-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="vs-gifts__list">
      <article class="vs-gifts__item">
        <button type="button" class="vs-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="vs-gift-glow"></div>

          <div class="vs-gift-box">
            <div class="vs-gift-icon">
              <v-icon size="52" color="#ead9bd">mdi-gift-outline</v-icon>
            </div>

            <span class="vs-gift-sparkle vs-gift-sparkle--1">✦</span>
            <span class="vs-gift-sparkle vs-gift-sparkle--2">✧</span>
            <span class="vs-gift-sparkle vs-gift-sparkle--3">✦</span>
            <span class="vs-gift-sparkle vs-gift-sparkle--4">✧</span>
          </div>

          <div class="vs-gift-shadow"></div>

          <div class="vs-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="vs-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="vs-gift-dialog">
        <div v-if="showGiftDialog" class="vs-gift-dialog" @click.self="closeGift">
          <div class="vs-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="vs-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="vs-gift-dialog-title">
            <div class="vs-gift-dialog__decoration">
              <span></span>

              <div class="vs-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="vs-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="vs-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="vs-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="vs-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="vs-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="vs-account-card">
                <div class="vs-account-heading">
                  <div class="vs-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="vs-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="vs-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="vs-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="vs-qr-frame">
                    <div class="vs-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="vs-qr-code" />
                    </div>
                  </div>

                  <div class="vs-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="vs-account-info">
                  <div class="vs-info-row">
                    <div class="vs-info-left">
                      <span class="vs-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="vs-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="vs-info-divider"></div>

                  <div class="vs-info-row">
                    <div class="vs-info-left">
                      <span class="vs-info-label">SỐ TÀI KHOẢN</span>

                      <span class="vs-info-value vs-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="vs-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="vs-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="vs-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="vs-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="vs-qr-preview">
        <div v-if="previewQr" class="vs-qr-preview" @click.self="closeQr">
          <div class="vs-qr-preview__backdrop" @click="closeQr"></div>

          <div class="vs-qr-preview__card">
            <button type="button" class="vs-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="vs-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="vs-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="vs-qr-preview__save"
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

  document.body.classList.add("vs-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("vs-gift-dialog-open");
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

  document.body.classList.remove("vs-gift-dialog-open");
});
</script>

<style scoped>
.vs-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.4);
  border-radius: 10px;

  background: #fbf5e6;

  box-shadow: 0 12px 35px rgba(61, 47, 36, 0.1);

  overflow: hidden;
}

.vs-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px dashed rgba(107, 79, 58, 0.28);
  border-radius: 6px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.vs-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #c2a878;
}

.vs-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.55));
}

.vs-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.vs-eyebrow {
  position: relative;

  margin: 0;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.vs-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #4a3a2c;
}

.vs-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #97745a;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   GIFT BOX
========================================================= */

.vs-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.vs-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(107, 79, 58, 0.3);
  border-radius: 8px;

  background: radial-gradient(circle at center, rgba(255, 253, 246, 0.7), rgba(240, 229, 205, 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.vs-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(194, 168, 120, 0.4),
    rgba(194, 168, 120, 0.12) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: vs-gift-glow 3.5s ease-in-out infinite;
}

.vs-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;

  background: radial-gradient(circle at 34% 28%, #8a6a4f, #6b4f3a 55%, #4a3a2c 100%);

  box-shadow:
    0 20px 40px rgba(74, 58, 44, 0.4),
    inset 0 2px 6px rgba(234, 217, 189, 0.3);

  animation: vs-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.vs-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(234, 217, 189, 0.45);

  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;
}

.vs-gift-btn:hover .vs-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.vs-gift-btn:active .vs-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.vs-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(45, 33, 26, 0.18);

  filter: blur(8px);

  animation: vs-gift-shadow 3.5s ease-in-out infinite;
}

.vs-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #c2a878;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 253, 246, 0.95),
    0 0 14px rgba(194, 168, 120, 0.25);

  pointer-events: none;

  animation: vs-sparkle 2.6s ease-in-out infinite;
}

.vs-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.vs-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.vs-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.vs-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.vs-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #6b4f3a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.vs-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #c2a878, transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.vs-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.vs-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(240, 229, 205, 0.35), rgba(45, 33, 26, 0.65));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.vs-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(107, 79, 58, 0.5);
  border-radius: 10px;

  background: #fbf5e6;

  box-shadow:
    0 30px 90px rgba(45, 33, 26, 0.35),
    inset 0 0 0 1px rgba(255, 253, 246, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(107, 79, 58, 0.35) transparent;
}

.vs-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px dashed rgba(107, 79, 58, 0.25);
  border-radius: 6px;

  pointer-events: none;
}

.vs-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.vs-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.55));
}

.vs-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.vs-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ead9bd;

  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;

  background: radial-gradient(circle at 34% 28%, #8a6a4f, #6b4f3a 55%, #4a3a2c 100%);

  box-shadow: 0 7px 18px rgba(74, 58, 44, 0.3);

  animation: vs-heart-pulse 2.5s ease-in-out infinite;
}

.vs-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.3);
  border-radius: 50%;

  background: rgba(255, 253, 246, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.vs-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: #fffdf6;
}

.vs-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.vs-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #4a3a2c;
}

.vs-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #97745a;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.vs-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.vs-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(107, 79, 58, 0.32);
  border-radius: 8px;

  background: rgba(255, 253, 246, 0.85);

  box-shadow: 0 8px 25px rgba(61, 47, 36, 0.08);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.vs-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(61, 47, 36, 0.13);
}

.vs-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.vs-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.35);
  border-radius: 50%;

  background: rgba(255, 253, 246, 0.9);
}

.vs-account-label {
  color: #4a3a2c;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.vs-account-bank {
  margin-top: 2px;

  color: #97745a;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.vs-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.vs-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.vs-qr-inner {
  padding: 7px;

  border: 1px solid rgba(107, 79, 58, 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(45, 33, 26, 0.1);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.vs-qr-button:hover .vs-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(45, 33, 26, 0.15);
}

.vs-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.vs-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.vs-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px dashed rgba(107, 79, 58, 0.3);
  border-radius: 8px;

  background: rgba(255, 253, 246, 0.55);
}

.vs-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.vs-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vs-info-label {
  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.vs-info-value {
  color: #4a3a2c;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.vs-account-number {
  color: #6b4f3a;

  letter-spacing: 0.06em;
}

.vs-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.28), transparent);
}

.vs-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.3);
  border-radius: 50%;

  background: rgba(255, 253, 246, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.vs-copy-button:hover {
  transform: scale(1.08);

  background: #fffdf6;
}

.vs-account-desc {
  margin-top: 9px;

  color: #97745a;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.vs-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #c2a878;
}

.vs-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.5));
}

.vs-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.vs-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.vs-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(30, 22, 16, 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.vs-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(107, 79, 58, 0.5);
  border-radius: 10px;

  background: #fbf5e6;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.vs-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.28);
  border-radius: 50%;

  background: rgba(255, 253, 246, 0.82);

  cursor: pointer;
}

.vs-qr-preview__title {
  margin-bottom: 15px;

  color: #4a3a2c;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.vs-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(107, 79, 58, 0.4);

  background: white;

  box-shadow: 0 10px 30px rgba(45, 33, 26, 0.14);
}

.vs-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.vs-qr-preview__card p {
  margin: 14px 0;

  color: #97745a;

  font-size: 11px;
  font-style: italic;
}

.vs-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: #ead9bd;

  border: 1px solid #2c211a;
  border-radius: 8px;

  background: linear-gradient(160deg, #4a3a2c, #3d2f24 60%, #2c211a);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(74, 58, 44, 0.28);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.vs-gift-dialog-enter-active,
.vs-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.vs-gift-dialog-enter-active .vs-gift-dialog__card,
.vs-gift-dialog-leave-active .vs-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.vs-gift-dialog-enter-from {
  opacity: 0;
}

.vs-gift-dialog-enter-from .vs-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.vs-gift-dialog-leave-to {
  opacity: 0;
}

.vs-gift-dialog-leave-to .vs-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.vs-qr-preview-enter-active,
.vs-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.vs-qr-preview-enter-active .vs-qr-preview__card,
.vs-qr-preview-leave-active .vs-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.vs-qr-preview-enter-from {
  opacity: 0;
}

.vs-qr-preview-enter-from .vs-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.vs-qr-preview-leave-to {
  opacity: 0;
}

.vs-qr-preview-leave-to .vs-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes vs-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes vs-gift-shadow {
  0%,
  100% {
    transform: translateX(-50%) scaleX(1);
    opacity: 0.18;
  }

  50% {
    transform: translateX(-50%) scaleX(0.76);
    opacity: 0.08;
  }
}

@keyframes vs-gift-glow {
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

@keyframes vs-sparkle {
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

@keyframes vs-heart-pulse {
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
  .vs-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .vs-gifts::before {
    inset: 6px;
  }

  .vs-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .vs-gifts__item,
  .vs-gift-btn {
    min-height: 295px;
  }

  .vs-gift-box {
    width: 130px;
    height: 130px;
  }

  .vs-gift-glow {
    width: 190px;
    height: 190px;
  }

  .vs-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .vs-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;
  }

  .vs-gift-dialog__card::before {
    inset: 6px;
  }

  .vs-gift-dialog__card h3 {
    font-size: 26px;
  }

  .vs-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .vs-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .vs-account-card {
    padding: 14px;
  }

  .vs-qr-code {
    width: 135px;
    height: 135px;
  }

  .vs-account-info {
    margin-top: 11px;
  }

  .vs-qr-preview {
    padding: 14px;
  }

  .vs-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .vs-gift-box {
    width: 115px;
    height: 115px;
  }

  .vs-gifts__item,
  .vs-gift-btn {
    min-height: 280px;
  }

  .vs-qr-code {
    width: 125px;
    height: 125px;
  }

  .vs-account-label {
    font-size: 9px;
  }

  .vs-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .vs-gift-box,
  .vs-gift-shadow,
  .vs-gift-glow,
  .vs-gift-sparkle,
  .vs-gift-dialog__heart {
    animation: none;
  }

  .vs-gift-dialog-enter-active,
  .vs-gift-dialog-leave-active,
  .vs-qr-preview-enter-active,
  .vs-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.vs-gift-dialog-open) {
  overflow: hidden;
}
</style>
