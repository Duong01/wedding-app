<template>
  <section class="el-gifts">
    <div class="el-gifts__ornament">
      <span></span>
      <i>❦</i>
      <span></span>
    </div>

    <p class="el-eyebrow">GỬI YÊU THƯƠNG</p>

    <h2>Hộp mừng cưới</h2>

    <p class="el-gifts__intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <div class="el-gifts__list">
      <article class="el-gifts__item">
        <button type="button" class="el-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="el-gift-glow"></div>

          <div class="el-gift-box">
            <div class="el-gift-icon">
              <v-icon size="52" color="#10281f">mdi-gift-outline</v-icon>
            </div>

            <span class="el-gift-sparkle el-gift-sparkle--1">✦</span>
            <span class="el-gift-sparkle el-gift-sparkle--2">❦</span>
            <span class="el-gift-sparkle el-gift-sparkle--3">✦</span>
            <span class="el-gift-sparkle el-gift-sparkle--4">❦</span>
          </div>

          <div class="el-gift-shadow"></div>

          <div class="el-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="el-gifts__footer-ornament">
      <span></span>
      <i>✦</i>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="el-gift-dialog">
        <div v-if="showGiftDialog" class="el-gift-dialog" @click.self="closeGift">
          <div class="el-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="el-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="el-gift-dialog-title">
            <div class="el-gift-dialog__glow"></div>

            <div class="el-gift-dialog__decoration">
              <span></span>

              <div class="el-gift-dialog__sun">
                <i>✦</i>
              </div>

              <span></span>
            </div>

            <button type="button" class="el-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="el-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="el-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="el-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="el-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="el-account-card">
                <div class="el-account-heading">
                  <div class="el-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="el-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="el-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="el-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="el-qr-frame">
                    <div class="el-qr-corner el-qr-corner--tl"></div>
                    <div class="el-qr-corner el-qr-corner--tr"></div>
                    <div class="el-qr-corner el-qr-corner--bl"></div>
                    <div class="el-qr-corner el-qr-corner--br"></div>

                    <div class="el-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="el-qr-code" />
                    </div>
                  </div>

                  <div class="el-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="el-account-info">
                  <div class="el-info-row">
                    <div class="el-info-left">
                      <span class="el-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="el-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="el-info-divider"></div>

                  <div class="el-info-row">
                    <div class="el-info-left">
                      <span class="el-info-label">SỐ TÀI KHOẢN</span>

                      <span class="el-info-value el-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="el-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="el-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="el-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="el-gift-dialog__footer">
              <span></span>

              <i>❦</i>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="el-qr-preview">
        <div v-if="previewQr" class="el-qr-preview" @click.self="closeQr">
          <div class="el-qr-preview__backdrop" @click="closeQr"></div>

          <div class="el-qr-preview__card">
            <button type="button" class="el-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="el-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="el-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="el-qr-preview__save"
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

  document.body.classList.add("el-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("el-gift-dialog-open");
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

  document.body.classList.remove("el-gift-dialog-open");
});
</script>

<style scoped>
.el-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #2e3d36;

  border: 1px solid rgba(201, 164, 92, 0.55);
  border-radius: 60% 60% 28px 28px / 12% 12% 28px 28px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.7), rgba(240, 234, 216, 0.5));

  box-shadow: 0 12px 35px rgba(12, 43, 33, 0.1);

  overflow: hidden;
}

/* Fine gold lattice texture */
.el-gifts::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.el-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #c9a45c;
}

.el-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.85));
}

.el-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.el-gifts__ornament i {
  font-size: 14px;
  font-style: normal;
}

.el-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.el-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #123b2e;
}

.el-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #6b7a70;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   GIFT BOX
========================================================= */

.el-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.el-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.el-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(201, 164, 92, 0.45);
  border-radius: 999px 999px 23px 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.75), rgba(240, 234, 216, 0.3));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.el-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(201, 164, 92, 0.45),
    rgba(201, 164, 92, 0.12) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: el-gift-glow 3.5s ease-in-out infinite;
}

.el-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(140deg, #e8d3a2, #c9a45c 60%, #a8873f);

  box-shadow:
    0 20px 40px rgba(201, 164, 92, 0.4),
    inset 0 2px 6px rgba(255, 255, 255, 0.5);

  animation: el-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.el-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(16, 40, 31, 0.35);
  border-radius: 50%;
}

.el-gift-btn:hover .el-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-3deg) scale(1.035);

  filter: brightness(1.05);
}

.el-gift-btn:active .el-gift-box {
  transform: translateY(2px) scale(0.93) rotate(3deg);
}

.el-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(12, 43, 33, 0.16);

  filter: blur(8px);

  animation: el-gift-shadow 3.5s ease-in-out infinite;
}

.el-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #c9a45c;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(201, 164, 92, 0.35);

  pointer-events: none;

  animation: el-sparkle 2.6s ease-in-out infinite;
}

.el-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.el-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.el-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.el-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.el-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #123b2e;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.el-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #c9a45c, transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.el-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.el-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(247, 241, 227, 0.35), rgba(10, 30, 23, 0.65));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.el-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(201, 164, 92, 0.65);
  border-radius: 999px 999px 28px 28px;

  background: linear-gradient(172deg, rgba(253, 250, 242, 0.98), rgba(240, 234, 216, 0.97));

  box-shadow:
    0 30px 90px rgba(5, 20, 15, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(201, 164, 92, 0.4) transparent;
}

.el-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(201, 164, 92, 0.3);
  border-radius: 999px 999px 21px 21px;

  pointer-events: none;
}

.el-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(201, 164, 92, 0.4), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.el-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.el-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.75));
}

.el-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.el-gift-dialog__sun {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #10281f;

  border-radius: 50%;

  background: linear-gradient(135deg, #e8d3a2, #c9a45c);

  box-shadow: 0 7px 18px rgba(201, 164, 92, 0.32);

  animation: el-sun-pulse 2.5s ease-in-out infinite;
}

.el-gift-dialog__sun i {
  font-size: 17px;
  font-style: normal;
}

.el-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #123b2e;

  border: 1px solid rgba(201, 164, 92, 0.45);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.el-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.el-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #8a7a52;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.el-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #123b2e;
}

.el-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #6b7a70;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.el-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.el-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(201, 164, 92, 0.45);
  border-radius: 20px 20px 19px 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(247, 241, 227, 0.78));

  box-shadow: 0 8px 25px rgba(12, 43, 33, 0.08);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.el-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(12, 43, 33, 0.13);
}

.el-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.el-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #123b2e;

  border: 1px solid rgba(201, 164, 92, 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, #fdfaf2, #efe9d6);
}

.el-account-label {
  color: #2e3d36;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.el-account-bank {
  margin-top: 2px;

  color: #6b7a70;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.el-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.el-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.el-qr-inner {
  padding: 7px;

  border: 1px solid rgba(201, 164, 92, 0.45);

  background: white;

  box-shadow: 0 7px 20px rgba(12, 43, 33, 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.el-qr-button:hover .el-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(12, 43, 33, 0.13);
}

.el-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.el-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #c9a45c;
  border-style: solid;

  pointer-events: none;
}

.el-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.el-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.el-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.el-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.el-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #6b7a70;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.el-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(201, 164, 92, 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.6);
}

.el-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.el-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.el-info-label {
  color: #8a7a52;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.el-info-value {
  color: #2e3d36;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.el-account-number {
  color: #123b2e;

  letter-spacing: 0.06em;
}

.el-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.35), transparent);
}

.el-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #123b2e;

  border: 1px solid rgba(201, 164, 92, 0.45);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.el-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.el-account-desc {
  margin-top: 9px;

  color: #6b7a70;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.el-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #c9a45c;
}

.el-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.6));
}

.el-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

.el-gift-dialog__footer i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   QR PREVIEW
========================================================= */

.el-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.el-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(8, 24, 18, 0.75);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.el-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(201, 164, 92, 0.65);
  border-radius: 999px 999px 24px 24px;

  background: linear-gradient(172deg, #fdfaf2, #efe9d6);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.el-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #123b2e;

  border: 1px solid rgba(201, 164, 92, 0.4);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.85);

  cursor: pointer;
}

.el-qr-preview__title {
  margin-bottom: 15px;

  color: #2e3d36;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.el-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(201, 164, 92, 0.5);

  background: white;

  box-shadow: 0 10px 30px rgba(12, 43, 33, 0.12);
}

.el-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.el-qr-preview__card p {
  margin: 14px 0;

  color: #6b7a70;

  font-size: 11px;
  font-style: italic;
}

.el-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: #10281f;

  border-radius: 999px;

  background: linear-gradient(135deg, #e8d3a2, #c9a45c);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(201, 164, 92, 0.28);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.el-gift-dialog-enter-active,
.el-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.el-gift-dialog-enter-active .el-gift-dialog__card,
.el-gift-dialog-leave-active .el-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.el-gift-dialog-enter-from {
  opacity: 0;
}

.el-gift-dialog-enter-from .el-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.el-gift-dialog-leave-to {
  opacity: 0;
}

.el-gift-dialog-leave-to .el-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.el-qr-preview-enter-active,
.el-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.el-qr-preview-enter-active .el-qr-preview__card,
.el-qr-preview-leave-active .el-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.el-qr-preview-enter-from {
  opacity: 0;
}

.el-qr-preview-enter-from .el-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.el-qr-preview-leave-to {
  opacity: 0;
}

.el-qr-preview-leave-to .el-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes el-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(2deg);
  }
}

@keyframes el-gift-shadow {
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

@keyframes el-gift-glow {
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

@keyframes el-sparkle {
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

@keyframes el-sun-pulse {
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
  .el-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .el-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .el-gifts__item,
  .el-gift-btn {
    min-height: 295px;
  }

  .el-gift-box {
    width: 130px;
    height: 130px;
  }

  .el-gift-glow {
    width: 190px;
    height: 190px;
  }

  .el-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .el-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 999px 999px 20px 20px;
  }

  .el-gift-dialog__card::before {
    inset: 6px;

    border-radius: 999px 999px 15px 15px;
  }

  .el-gift-dialog__card h3 {
    font-size: 26px;
  }

  .el-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .el-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .el-account-card {
    padding: 14px;
  }

  .el-qr-code {
    width: 135px;
    height: 135px;
  }

  .el-account-info {
    margin-top: 11px;
  }

  .el-qr-preview {
    padding: 14px;
  }

  .el-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .el-gift-box {
    width: 115px;
    height: 115px;
  }

  .el-gifts__item,
  .el-gift-btn {
    min-height: 280px;
  }

  .el-qr-code {
    width: 125px;
    height: 125px;
  }

  .el-account-label {
    font-size: 9px;
  }

  .el-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .el-gift-box,
  .el-gift-shadow,
  .el-gift-glow,
  .el-gift-sparkle,
  .el-gift-dialog__sun {
    animation: none;
  }

  .el-gift-dialog-enter-active,
  .el-gift-dialog-leave-active,
  .el-qr-preview-enter-active,
  .el-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.el-gift-dialog-open) {
  overflow: hidden;
}
</style>
