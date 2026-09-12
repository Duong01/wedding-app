<template>
  <section class="dh-gifts">
    <div class="dh-gifts__ornament">
      <span></span>
      <i>囍</i>
      <span></span>
    </div>

    <p class="dh-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="dh-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="dh-gifts__list">
      <article class="dh-gifts__item">
        <button type="button" class="dh-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="dh-gift-glow"></div>

          <div class="dh-gift-box">
            <span class="dh-gift-xi" aria-hidden="true">囍</span>

            <span class="dh-gift-sparkle dh-gift-sparkle--1">✦</span>
            <span class="dh-gift-sparkle dh-gift-sparkle--2">✧</span>
            <span class="dh-gift-sparkle dh-gift-sparkle--3">✦</span>
            <span class="dh-gift-sparkle dh-gift-sparkle--4">✧</span>
          </div>

          <div class="dh-gift-shadow"></div>

          <div class="dh-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="dh-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="dh-gift-dialog">
        <div v-if="showGiftDialog" class="dh-gift-dialog" @click.self="closeGift">
          <div class="dh-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="dh-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="dh-gift-dialog-title">
            <div class="dh-gift-dialog__glow"></div>

            <div class="dh-gift-dialog__decoration">
              <span></span>

              <div class="dh-gift-dialog__seal">囍</div>

              <span></span>
            </div>

            <button type="button" class="dh-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="dh-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="dh-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="dh-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="dh-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="dh-account-card">
                <div class="dh-account-heading">
                  <div class="dh-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="dh-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="dh-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="dh-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="dh-qr-frame">
                    <div class="dh-qr-corner dh-qr-corner--tl"></div>
                    <div class="dh-qr-corner dh-qr-corner--tr"></div>
                    <div class="dh-qr-corner dh-qr-corner--bl"></div>
                    <div class="dh-qr-corner dh-qr-corner--br"></div>

                    <div class="dh-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="dh-qr-code" />
                    </div>
                  </div>

                  <div class="dh-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="dh-account-info">
                  <div class="dh-info-row">
                    <div class="dh-info-left">
                      <span class="dh-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="dh-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="dh-info-divider"></div>

                  <div class="dh-info-row">
                    <div class="dh-info-left">
                      <span class="dh-info-label">SỐ TÀI KHOẢN</span>

                      <span class="dh-info-value dh-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="dh-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="dh-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="dh-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="dh-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="dh-qr-preview">
        <div v-if="previewQr" class="dh-qr-preview" @click.self="closeQr">
          <div class="dh-qr-preview__backdrop" @click="closeQr"></div>

          <div class="dh-qr-preview__card">
            <button type="button" class="dh-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="dh-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="dh-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="dh-qr-preview__save"
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

  document.body.classList.add("dh-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("dh-gift-dialog-open");
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

  document.body.classList.remove("dh-gift-dialog-open");
});
</script>

<style scoped>
.dh-gifts {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-red-dark: #5c0e10;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;

  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--dh-ink);

  border: 1px solid rgba(217, 164, 65, 0.55);
  border-radius: 14px;

  background: linear-gradient(170deg, rgba(253, 246, 236, 0.7), rgba(243, 217, 164, 0.4));

  box-shadow: 0 12px 35px rgba(60, 10, 12, 0.1);

  overflow: hidden;
}

/* Inner gold line — double border frame */
.dh-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(217, 164, 65, 0.3);
  border-radius: 9px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.dh-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: var(--dh-gold);
}

.dh-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.75));
}

.dh-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.dh-gifts__ornament i {
  font-size: 14px;
  font-style: normal;
}

.dh-eyebrow {
  position: relative;

  margin: 0;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.dh-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: var(--dh-red);
}

.dh-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #8a6a52;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   GIFT BOX
========================================================= */

.dh-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.dh-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.dh-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(217, 164, 65, 0.35);
  border-radius: 14px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(243, 217, 164, 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.dh-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(243, 217, 164, 0.55),
    rgba(243, 217, 164, 0.16) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: dh-gift-glow 3.5s ease-in-out infinite;
}

.dh-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 18px;

  background: linear-gradient(140deg, var(--dh-red-bright), var(--dh-red) 60%, var(--dh-red-dark));

  box-shadow:
    0 20px 40px rgba(60, 10, 12, 0.4),
    inset 0 2px 6px rgba(243, 217, 164, 0.35);

  animation: dh-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.dh-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(243, 217, 164, 0.5);
  border-radius: 12px;
}

.dh-gift-xi {
  color: var(--dh-gold-light);

  font-size: 58px;
  line-height: 1;

  text-shadow: 0 2px 8px rgba(20, 3, 4, 0.4);
}

.dh-gift-btn:hover .dh-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.08);
}

.dh-gift-btn:active .dh-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.dh-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(60, 10, 12, 0.18);

  filter: blur(8px);

  animation: dh-gift-shadow 3.5s ease-in-out infinite;
}

.dh-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: var(--dh-gold);

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 250, 238, 0.95),
    0 0 14px rgba(217, 164, 65, 0.3);

  pointer-events: none;

  animation: dh-sparkle 2.6s ease-in-out infinite;
}

.dh-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.dh-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.dh-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.dh-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.dh-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: var(--dh-red-bright);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.dh-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, var(--dh-gold), transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.dh-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.dh-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(243, 217, 164, 0.25), rgba(40, 6, 8, 0.72));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.dh-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(217, 164, 65, 0.6);
  border-radius: 14px;

  background: linear-gradient(170deg, rgba(253, 246, 236, 0.99), rgba(247, 230, 196, 0.97));

  box-shadow:
    0 30px 90px rgba(30, 4, 6, 0.42),
    inset 0 0 0 1px rgba(255, 252, 244, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(217, 164, 65, 0.4) transparent;
}

.dh-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(217, 164, 65, 0.28);
  border-radius: 9px;

  pointer-events: none;
}

.dh-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(243, 217, 164, 0.5), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.dh-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.dh-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.7));
}

.dh-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.dh-gift-dialog__seal {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-red-dark);

  font-size: 18px;
  line-height: 1;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--dh-gold-light), var(--dh-gold));

  box-shadow: 0 7px 18px rgba(140, 95, 25, 0.3);

  animation: dh-seal-pulse 2.5s ease-in-out infinite;
}

.dh-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-red-bright);

  border: 1px solid rgba(217, 164, 65, 0.35);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.dh-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.dh-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: var(--dh-red-bright);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.dh-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: var(--dh-red);
}

.dh-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #8a6a52;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.dh-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.dh-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(217, 164, 65, 0.38);
  border-radius: 12px;

  background: linear-gradient(145deg, rgba(255, 253, 250, 0.88), rgba(253, 246, 236, 0.78));

  box-shadow: 0 8px 25px rgba(60, 10, 12, 0.08);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dh-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(60, 10, 12, 0.13);
}

.dh-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.dh-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--dh-red);

  border: 1px solid rgba(217, 164, 65, 0.4);
  border-radius: 50%;

  background: linear-gradient(145deg, #fffdf8, var(--dh-gold-light));
}

.dh-account-label {
  color: var(--dh-red);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.dh-account-bank {
  margin-top: 2px;

  color: #8a6a52;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.dh-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.dh-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.dh-qr-inner {
  padding: 7px;

  border: 1px solid rgba(217, 164, 65, 0.4);

  background: white;

  box-shadow: 0 7px 20px rgba(60, 10, 12, 0.1);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dh-qr-button:hover .dh-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(60, 10, 12, 0.15);
}

.dh-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.dh-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: var(--dh-gold);
  border-style: solid;

  pointer-events: none;
}

.dh-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.dh-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.dh-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.dh-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.dh-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #8a6a52;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.dh-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(217, 164, 65, 0.25);
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.55);
}

.dh-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dh-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dh-info-label {
  color: var(--dh-red-bright);

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.dh-info-value {
  color: var(--dh-red);

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.dh-account-number {
  color: var(--dh-red-bright);

  letter-spacing: 0.06em;
}

.dh-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.32), transparent);
}

.dh-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--dh-red);

  border: 1px solid rgba(217, 164, 65, 0.35);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.dh-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.dh-account-desc {
  margin-top: 9px;

  color: #8a6a52;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.dh-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: var(--dh-gold);
}

.dh-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.55));
}

.dh-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.dh-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.dh-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(30, 4, 6, 0.78);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.dh-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(217, 164, 65, 0.6);
  border-radius: 14px;

  background: linear-gradient(170deg, #fdf6ec, #f7e6c4);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
}

.dh-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-red-bright);

  border: 1px solid rgba(217, 164, 65, 0.32);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.82);

  cursor: pointer;
}

.dh-qr-preview__title {
  margin-bottom: 15px;

  color: var(--dh-red);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.dh-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(217, 164, 65, 0.45);

  background: white;

  box-shadow: 0 10px 30px rgba(60, 10, 12, 0.14);
}

.dh-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.dh-qr-preview__card p {
  margin: 14px 0;

  color: #8a6a52;

  font-size: 11px;
  font-style: italic;
}

.dh-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: var(--dh-red-dark);

  border: 1px solid rgba(243, 217, 164, 0.7);
  border-radius: 999px;

  background: linear-gradient(135deg, var(--dh-gold-light), var(--dh-gold) 60%, #c08f34);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(140, 95, 25, 0.28);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.dh-gift-dialog-enter-active,
.dh-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.dh-gift-dialog-enter-active .dh-gift-dialog__card,
.dh-gift-dialog-leave-active .dh-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.dh-gift-dialog-enter-from {
  opacity: 0;
}

.dh-gift-dialog-enter-from .dh-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.dh-gift-dialog-leave-to {
  opacity: 0;
}

.dh-gift-dialog-leave-to .dh-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.dh-qr-preview-enter-active,
.dh-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.dh-qr-preview-enter-active .dh-qr-preview__card,
.dh-qr-preview-leave-active .dh-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.dh-qr-preview-enter-from {
  opacity: 0;
}

.dh-qr-preview-enter-from .dh-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.dh-qr-preview-leave-to {
  opacity: 0;
}

.dh-qr-preview-leave-to .dh-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes dh-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes dh-gift-shadow {
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

@keyframes dh-gift-glow {
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

@keyframes dh-sparkle {
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

@keyframes dh-seal-pulse {
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
  .dh-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 12px;
  }

  .dh-gifts::before {
    inset: 6px;

    border-radius: 8px;
  }

  .dh-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .dh-gifts__item,
  .dh-gift-btn {
    min-height: 295px;
  }

  .dh-gift-box {
    width: 130px;
    height: 130px;
  }

  .dh-gift-xi {
    font-size: 50px;
  }

  .dh-gift-glow {
    width: 190px;
    height: 190px;
  }

  .dh-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .dh-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 14px 14px 12px 12px;
  }

  .dh-gift-dialog__card::before {
    inset: 6px;

    border-radius: 9px 9px 8px 8px;
  }

  .dh-gift-dialog__card h3 {
    font-size: 26px;
  }

  .dh-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .dh-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .dh-account-card {
    padding: 14px;
  }

  .dh-qr-code {
    width: 135px;
    height: 135px;
  }

  .dh-account-info {
    margin-top: 11px;
  }

  .dh-qr-preview {
    padding: 14px;
  }

  .dh-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .dh-gift-box {
    width: 115px;
    height: 115px;
  }

  .dh-gifts__item,
  .dh-gift-btn {
    min-height: 280px;
  }

  .dh-qr-code {
    width: 125px;
    height: 125px;
  }

  .dh-account-label {
    font-size: 9px;
  }

  .dh-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .dh-gift-box,
  .dh-gift-shadow,
  .dh-gift-glow,
  .dh-gift-sparkle,
  .dh-gift-dialog__seal {
    animation: none;
  }

  .dh-gift-dialog-enter-active,
  .dh-gift-dialog-leave-active,
  .dh-qr-preview-enter-active,
  .dh-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.dh-gift-dialog-open) {
  overflow: hidden;
}
</style>
