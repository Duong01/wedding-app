<template>
  <section class="sp-gifts">
    <div class="sp-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="sp-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="sp-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="sp-gifts__list">
      <article class="sp-gifts__item">
        <button type="button" class="sp-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="sp-gift-glow"></div>

          <div class="sp-gift-box">
            <div class="sp-gift-icon">
              <v-icon size="52" color="#fff6ef">mdi-gift-outline</v-icon>
            </div>

            <span class="sp-gift-sparkle sp-gift-sparkle--1">✧</span>
            <span class="sp-gift-sparkle sp-gift-sparkle--2">✧</span>
            <span class="sp-gift-sparkle sp-gift-sparkle--3">✧</span>
            <span class="sp-gift-sparkle sp-gift-sparkle--4">✧</span>
          </div>

          <div class="sp-gift-shadow"></div>

          <div class="sp-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="sp-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="sp-gift-dialog">
        <div v-if="showGiftDialog" class="sp-gift-dialog" @click.self="closeGift">
          <div class="sp-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="sp-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="sp-gift-dialog-title">
            <div class="sp-gift-dialog__glow"></div>

            <div class="sp-gift-dialog__decoration">
              <span></span>

              <div class="sp-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="sp-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="sp-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="sp-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="sp-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="sp-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="sp-account-card">
                <div class="sp-account-heading">
                  <div class="sp-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="sp-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="sp-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="sp-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="sp-qr-frame">
                    <div class="sp-qr-corner sp-qr-corner--tl"></div>
                    <div class="sp-qr-corner sp-qr-corner--tr"></div>
                    <div class="sp-qr-corner sp-qr-corner--bl"></div>
                    <div class="sp-qr-corner sp-qr-corner--br"></div>

                    <div class="sp-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="sp-qr-code" />
                    </div>
                  </div>

                  <div class="sp-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="sp-account-info">
                  <div class="sp-info-row">
                    <div class="sp-info-left">
                      <span class="sp-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="sp-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="sp-info-divider"></div>

                  <div class="sp-info-row">
                    <div class="sp-info-left">
                      <span class="sp-info-label">SỐ TÀI KHOẢN</span>

                      <span class="sp-info-value sp-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="sp-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="sp-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="sp-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="sp-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="sp-qr-preview">
        <div v-if="previewQr" class="sp-qr-preview" @click.self="closeQr">
          <div class="sp-qr-preview__backdrop" @click="closeQr"></div>

          <div class="sp-qr-preview__card">
            <button type="button" class="sp-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="sp-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="sp-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="sp-qr-preview__save"
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

  document.body.classList.add("sp-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("sp-gift-dialog-open");
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

  document.body.classList.remove("sp-gift-dialog-open");
});
</script>

<style scoped>
.sp-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #7a4a3d;

  border: 1px solid rgba(224, 163, 126, 0.45);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(255, 242, 232, 0.4));

  box-shadow: 0 12px 35px rgba(122, 74, 61, 0.09);

  overflow: hidden;
}

.sp-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(224, 163, 126, 0.28);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.sp-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #e0a37e;
}

.sp-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.7));
}

.sp-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.sp-eyebrow {
  position: relative;

  margin: 0;

  color: #d67a63;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sp-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #7a4a3d;
}

.sp-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #a3806f;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   GIFT BOX
========================================================= */

.sp-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.sp-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.sp-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(214, 122, 99, 0.3);
  border-radius: 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(255, 242, 232, 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.sp-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(244, 198, 169, 0.55),
    rgba(244, 198, 169, 0.16) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: sp-gift-glow 3.5s ease-in-out infinite;
}

.sp-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, #d67a63, #b85c48 60%, #9c4a38);

  box-shadow:
    0 20px 40px rgba(156, 74, 56, 0.35),
    inset 0 2px 6px rgba(255, 246, 238, 0.4);

  animation: sp-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.sp-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(255, 246, 238, 0.5);
  border-radius: 24px;
}

.sp-gift-btn:hover .sp-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.sp-gift-btn:active .sp-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.sp-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(122, 74, 61, 0.18);

  filter: blur(8px);

  animation: sp-gift-shadow 3.5s ease-in-out infinite;
}

.sp-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #e0a37e;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(224, 163, 126, 0.3);

  pointer-events: none;

  animation: sp-sparkle 2.6s ease-in-out infinite;
}

.sp-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.sp-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.sp-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.sp-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.sp-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #b85c48;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.sp-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #e0a37e, transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.sp-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.sp-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(255, 248, 240, 0.4), rgba(96, 52, 38, 0.6));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.sp-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(224, 163, 126, 0.55);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.98), rgba(253, 238, 228, 0.97));

  box-shadow:
    0 30px 90px rgba(96, 52, 38, 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(224, 163, 126, 0.35) transparent;
}

.sp-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(224, 163, 126, 0.25);
  border-radius: 21px;

  pointer-events: none;
}

.sp-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(244, 198, 169, 0.5), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.sp-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.sp-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.65));
}

.sp-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.sp-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background: linear-gradient(135deg, #d67a63, #b85c48);

  box-shadow: 0 7px 18px rgba(184, 92, 72, 0.28);

  animation: sp-heart-pulse 2.5s ease-in-out infinite;
}

.sp-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b85c48;

  border: 1px solid rgba(224, 163, 126, 0.35);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.sp-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.sp-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #d67a63;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.sp-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #7a4a3d;
}

.sp-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #a3806f;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.sp-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.sp-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(214, 122, 99, 0.32);
  border-radius: 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(255, 242, 232, 0.75));

  box-shadow: 0 8px 25px rgba(122, 74, 61, 0.07);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sp-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(122, 74, 61, 0.11);
}

.sp-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.sp-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #b85c48;

  border: 1px solid rgba(224, 163, 126, 0.4);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, #fdeee4);
}

.sp-account-label {
  color: #7a4a3d;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.sp-account-bank {
  margin-top: 2px;

  color: #a3806f;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.sp-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.sp-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.sp-qr-inner {
  padding: 7px;

  border: 1px solid rgba(224, 163, 126, 0.4);

  background: white;

  box-shadow: 0 7px 20px rgba(122, 74, 61, 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sp-qr-button:hover .sp-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(122, 74, 61, 0.13);
}

.sp-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.sp-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #e0a37e;
  border-style: solid;

  pointer-events: none;
}

.sp-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.sp-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.sp-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.sp-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.sp-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #a3806f;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.sp-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(224, 163, 126, 0.25);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.55);
}

.sp-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.sp-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sp-info-label {
  color: #d67a63;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.sp-info-value {
  color: #7a4a3d;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.sp-account-number {
  color: #b85c48;

  letter-spacing: 0.06em;
}

.sp-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.32), transparent);
}

.sp-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #b85c48;

  border: 1px solid rgba(224, 163, 126, 0.35);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.sp-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.sp-account-desc {
  margin-top: 9px;

  color: #a3806f;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.sp-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #e0a37e;
}

.sp-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.5));
}

.sp-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.sp-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.sp-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(70, 38, 28, 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.sp-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(224, 163, 126, 0.55);
  border-radius: 24px;

  background: linear-gradient(170deg, #fffdfb, #fdeee4);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.sp-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b85c48;

  border: 1px solid rgba(224, 163, 126, 0.32);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.82);

  cursor: pointer;
}

.sp-qr-preview__title {
  margin-bottom: 15px;

  color: #7a4a3d;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.sp-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(224, 163, 126, 0.45);

  background: white;

  box-shadow: 0 10px 30px rgba(122, 74, 61, 0.12);
}

.sp-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.sp-qr-preview__card p {
  margin: 14px 0;

  color: #a3806f;

  font-size: 11px;
  font-style: italic;
}

.sp-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background: linear-gradient(135deg, #d67a63, #b85c48);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(184, 92, 72, 0.25);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.sp-gift-dialog-enter-active,
.sp-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.sp-gift-dialog-enter-active .sp-gift-dialog__card,
.sp-gift-dialog-leave-active .sp-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.sp-gift-dialog-enter-from {
  opacity: 0;
}

.sp-gift-dialog-enter-from .sp-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.sp-gift-dialog-leave-to {
  opacity: 0;
}

.sp-gift-dialog-leave-to .sp-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.sp-qr-preview-enter-active,
.sp-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.sp-qr-preview-enter-active .sp-qr-preview__card,
.sp-qr-preview-leave-active .sp-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.sp-qr-preview-enter-from {
  opacity: 0;
}

.sp-qr-preview-enter-from .sp-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.sp-qr-preview-leave-to {
  opacity: 0;
}

.sp-qr-preview-leave-to .sp-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes sp-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes sp-gift-shadow {
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

@keyframes sp-gift-glow {
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

@keyframes sp-sparkle {
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

@keyframes sp-heart-pulse {
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
  .sp-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .sp-gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .sp-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .sp-gifts__item,
  .sp-gift-btn {
    min-height: 295px;
  }

  .sp-gift-box {
    width: 130px;
    height: 130px;
  }

  .sp-gift-glow {
    width: 190px;
    height: 190px;
  }

  .sp-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .sp-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .sp-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .sp-gift-dialog__card h3 {
    font-size: 26px;
  }

  .sp-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .sp-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .sp-account-card {
    padding: 14px;
  }

  .sp-qr-code {
    width: 135px;
    height: 135px;
  }

  .sp-account-info {
    margin-top: 11px;
  }

  .sp-qr-preview {
    padding: 14px;
  }

  .sp-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .sp-gift-box {
    width: 115px;
    height: 115px;
  }

  .sp-gifts__item,
  .sp-gift-btn {
    min-height: 280px;
  }

  .sp-qr-code {
    width: 125px;
    height: 125px;
  }

  .sp-account-label {
    font-size: 9px;
  }

  .sp-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sp-gift-box,
  .sp-gift-shadow,
  .sp-gift-glow,
  .sp-gift-sparkle,
  .sp-gift-dialog__heart {
    animation: none;
  }

  .sp-gift-dialog-enter-active,
  .sp-gift-dialog-leave-active,
  .sp-qr-preview-enter-active,
  .sp-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.sp-gift-dialog-open) {
  overflow: hidden;
}
</style>
