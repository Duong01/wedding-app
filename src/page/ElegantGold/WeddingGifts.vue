<template>
  <section class="eg-gifts">
    <div class="eg-gifts__ornament">
      <span></span>
      <i>❦</i>
      <span></span>
    </div>

    <p class="eg-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="eg-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="eg-gifts__list">
      <article class="eg-gifts__item">
        <button type="button" class="eg-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="eg-gift-glow"></div>

          <div class="eg-gift-box">
            <div class="eg-gift-icon">
              <v-icon size="52" color="#4a3620">mdi-gift-outline</v-icon>
            </div>

            <span class="eg-gift-sparkle eg-gift-sparkle--1">✦</span>
            <span class="eg-gift-sparkle eg-gift-sparkle--2">❦</span>
            <span class="eg-gift-sparkle eg-gift-sparkle--3">✦</span>
            <span class="eg-gift-sparkle eg-gift-sparkle--4">❦</span>
          </div>

          <div class="eg-gift-shadow"></div>

          <div class="eg-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="eg-gifts__footer-ornament">
      <span></span>
      <i>✦</i>
      <span></span>
    </div>

    <!-- BANK INFORMATION DIALOG -->
    <Teleport to="body">
      <Transition name="eg-gift-dialog">
        <div v-if="showGiftDialog" class="eg-gift-dialog" @click.self="closeGift">
          <div class="eg-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="eg-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="eg-gift-dialog-title">
            <div class="eg-gift-dialog__glow"></div>

            <div class="eg-gift-dialog__decoration">
              <span></span>

              <div class="eg-gift-dialog__sun">
                <i>✦</i>
              </div>

              <span></span>
            </div>

            <button type="button" class="eg-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="eg-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="eg-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="eg-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="eg-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="eg-account-card">
                <div class="eg-account-heading">
                  <div class="eg-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="eg-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="eg-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="eg-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="eg-qr-frame">
                    <div class="eg-qr-corner eg-qr-corner--tl"></div>
                    <div class="eg-qr-corner eg-qr-corner--tr"></div>
                    <div class="eg-qr-corner eg-qr-corner--bl"></div>
                    <div class="eg-qr-corner eg-qr-corner--br"></div>

                    <div class="eg-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="eg-qr-code" />
                    </div>
                  </div>

                  <div class="eg-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="eg-account-info">
                  <div class="eg-info-row">
                    <div class="eg-info-left">
                      <span class="eg-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="eg-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="eg-info-divider"></div>

                  <div class="eg-info-row">
                    <div class="eg-info-left">
                      <span class="eg-info-label">SỐ TÀI KHOẢN</span>

                      <span class="eg-info-value eg-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="eg-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="eg-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="eg-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="eg-gift-dialog__footer">
              <span></span>

              <i>❦</i>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="eg-qr-preview">
        <div v-if="previewQr" class="eg-qr-preview" @click.self="closeQr">
          <div class="eg-qr-preview__backdrop" @click="closeQr"></div>

          <div class="eg-qr-preview__card">
            <button type="button" class="eg-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="eg-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="eg-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="eg-qr-preview__save"
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

  document.body.classList.add("eg-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("eg-gift-dialog-open");
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

  document.body.classList.remove("eg-gift-dialog-open");
});
</script>

<style scoped>
.eg-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #5f4f38;

  border: 1px solid rgba(181, 138, 69, 0.55);
  border-radius: 60% 60% 28px 28px / 12% 12% 28px 28px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.7), rgba(246, 236, 217, 0.5));

  box-shadow: 0 12px 35px rgba(93, 69, 42, 0.1);

  overflow: hidden;
}

/* Fine gold lattice texture */
.eg-gifts::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(181, 138, 69, 0.7) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(181, 138, 69, 0.7) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* HEADER */
.eg-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #b58a45;
}

.eg-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.85));
}

.eg-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.eg-gifts__ornament i {
  font-size: 14px;
  font-style: normal;
}

.eg-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.eg-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #5d452a;
}

.eg-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #8a7657;

  font-size: 14px;

  line-height: 1.7;
}

/* GIFT BOX */
.eg-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.eg-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.eg-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(181, 138, 69, 0.45);
  border-radius: 999px 999px 23px 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.75), rgba(246, 236, 217, 0.3));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.eg-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(181, 138, 69, 0.45),
    rgba(181, 138, 69, 0.12) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: eg-gift-glow 3.5s ease-in-out infinite;
}

.eg-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(140deg, #efe3c8, #d7bb82 60%, #b58a45);

  box-shadow:
    0 20px 40px rgba(181, 138, 69, 0.4),
    inset 0 2px 6px rgba(255, 255, 255, 0.5);

  animation: eg-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.eg-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(74, 54, 32, 0.35);
  border-radius: 50%;
}

.eg-gift-btn:hover .eg-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-3deg) scale(1.035);

  filter: brightness(1.05);
}

.eg-gift-btn:active .eg-gift-box {
  transform: translateY(2px) scale(0.93) rotate(3deg);
}

.eg-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(93, 69, 42, 0.16);

  filter: blur(8px);

  animation: eg-gift-shadow 3.5s ease-in-out infinite;
}

.eg-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #b58a45;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(181, 138, 69, 0.35);

  pointer-events: none;

  animation: eg-sparkle 2.6s ease-in-out infinite;
}

.eg-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.eg-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.eg-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.eg-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.eg-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #5d452a;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.eg-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #b58a45, transparent);
}

/* DIALOG */
.eg-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.eg-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(250, 248, 243, 0.35), rgba(48, 34, 16, 0.65));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.eg-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(181, 138, 69, 0.65);
  border-radius: 999px 999px 28px 28px;

  background: linear-gradient(172deg, rgba(253, 250, 242, 0.98), rgba(246, 236, 217, 0.97));

  box-shadow:
    0 30px 90px rgba(30, 20, 8, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(181, 138, 69, 0.4) transparent;
}

.eg-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(181, 138, 69, 0.3);
  border-radius: 999px 999px 21px 21px;

  pointer-events: none;
}

.eg-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(181, 138, 69, 0.4), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.eg-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.eg-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.75));
}

.eg-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.eg-gift-dialog__sun {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #4a3620;

  border-radius: 50%;

  background: linear-gradient(135deg, #efe3c8, #d7bb82);

  box-shadow: 0 7px 18px rgba(181, 138, 69, 0.32);

  animation: eg-sun-pulse 2.5s ease-in-out infinite;
}

.eg-gift-dialog__sun i {
  font-size: 17px;
  font-style: normal;
}

.eg-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #5d452a;

  border: 1px solid rgba(181, 138, 69, 0.45);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.eg-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.eg-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.eg-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #5d452a;
}

.eg-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #8a7657;

  font-size: 12px;

  line-height: 1.6;
}

/* ACCOUNTS */
.eg-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.eg-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(181, 138, 69, 0.45);
  border-radius: 20px 20px 19px 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(250, 248, 243, 0.78));

  box-shadow: 0 8px 25px rgba(93, 69, 42, 0.08);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.eg-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(93, 69, 42, 0.13);
}

.eg-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.eg-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #5d452a;

  border: 1px solid rgba(181, 138, 69, 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, #fdfaf2, #f3ead4);
}

.eg-account-label {
  color: #5f4f38;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.eg-account-bank {
  margin-top: 2px;

  color: #8a7657;

  font-size: 10px;
}

/* QR */
.eg-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.eg-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.eg-qr-inner {
  padding: 7px;

  border: 1px solid rgba(181, 138, 69, 0.45);

  background: white;

  box-shadow: 0 7px 20px rgba(93, 69, 42, 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.eg-qr-button:hover .eg-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(93, 69, 42, 0.13);
}

.eg-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.eg-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #b58a45;
  border-style: solid;

  pointer-events: none;
}

.eg-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.eg-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.eg-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.eg-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.eg-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #8a7657;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* ACCOUNT INFO */
.eg-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(181, 138, 69, 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.6);
}

.eg-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.eg-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.eg-info-label {
  color: #8a7a52;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.eg-info-value {
  color: #5f4f38;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.eg-account-number {
  color: #5d452a;

  letter-spacing: 0.06em;
}

.eg-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.35), transparent);
}

.eg-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #5d452a;

  border: 1px solid rgba(181, 138, 69, 0.45);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.eg-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.eg-account-desc {
  margin-top: 9px;

  color: #8a7657;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.eg-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #b58a45;
}

.eg-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.6));
}

.eg-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

.eg-gift-dialog__footer i {
  font-size: 12px;
  font-style: normal;
}

/* QR PREVIEW */
.eg-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.eg-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(38, 27, 12, 0.75);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.eg-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(181, 138, 69, 0.65);
  border-radius: 999px 999px 24px 24px;

  background: linear-gradient(172deg, #fdfaf2, #f3ead4);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.eg-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #5d452a;

  border: 1px solid rgba(181, 138, 69, 0.4);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.85);

  cursor: pointer;
}

.eg-qr-preview__title {
  margin-bottom: 15px;

  color: #5f4f38;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.eg-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(181, 138, 69, 0.5);

  background: white;

  box-shadow: 0 10px 30px rgba(93, 69, 42, 0.12);
}

.eg-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.eg-qr-preview__card p {
  margin: 14px 0;

  color: #8a7657;

  font-size: 11px;
  font-style: italic;
}

.eg-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: #4a3620;

  border-radius: 999px;

  background: linear-gradient(135deg, #efe3c8, #d7bb82);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(181, 138, 69, 0.28);
}

/* DIALOG ANIMATION */
.eg-gift-dialog-enter-active,
.eg-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.eg-gift-dialog-enter-active .eg-gift-dialog__card,
.eg-gift-dialog-leave-active .eg-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.eg-gift-dialog-enter-from {
  opacity: 0;
}

.eg-gift-dialog-enter-from .eg-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.eg-gift-dialog-leave-to {
  opacity: 0;
}

.eg-gift-dialog-leave-to .eg-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.eg-qr-preview-enter-active,
.eg-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.eg-qr-preview-enter-active .eg-qr-preview__card,
.eg-qr-preview-leave-active .eg-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.eg-qr-preview-enter-from {
  opacity: 0;
}

.eg-qr-preview-enter-from .eg-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.eg-qr-preview-leave-to {
  opacity: 0;
}

.eg-qr-preview-leave-to .eg-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* KEYFRAMES */
@keyframes eg-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(2deg);
  }
}

@keyframes eg-gift-shadow {
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

@keyframes eg-gift-glow {
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

@keyframes eg-sparkle {
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

@keyframes eg-sun-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }
}

/* MOBILE */
@media (max-width: 620px) {
  .eg-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .eg-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .eg-gifts__item,
  .eg-gift-btn {
    min-height: 295px;
  }

  .eg-gift-box {
    width: 130px;
    height: 130px;
  }

  .eg-gift-glow {
    width: 190px;
    height: 190px;
  }

  .eg-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .eg-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 999px 999px 20px 20px;
  }

  .eg-gift-dialog__card::before {
    inset: 6px;

    border-radius: 999px 999px 15px 15px;
  }

  .eg-gift-dialog__card h3 {
    font-size: 26px;
  }

  .eg-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .eg-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .eg-account-card {
    padding: 14px;
  }

  .eg-qr-code {
    width: 135px;
    height: 135px;
  }

  .eg-account-info {
    margin-top: 11px;
  }

  .eg-qr-preview {
    padding: 14px;
  }

  .eg-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .eg-gift-box {
    width: 115px;
    height: 115px;
  }

  .eg-gifts__item,
  .eg-gift-btn {
    min-height: 280px;
  }

  .eg-qr-code {
    width: 125px;
    height: 125px;
  }

  .eg-account-label {
    font-size: 11px;
  }

  .eg-info-value {
    font-size: 10px;
  }
}

/* REDUCE MOTION */
@media (prefers-reduced-motion: reduce) {
  .eg-gift-box,
  .eg-gift-shadow,
  .eg-gift-glow,
  .eg-gift-sparkle,
  .eg-gift-dialog__sun {
    animation: none;
  }

  .eg-gift-dialog-enter-active,
  .eg-gift-dialog-leave-active,
  .eg-qr-preview-enter-active,
  .eg-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.eg-gift-dialog-open) {
  overflow: hidden;
}
</style>
