<template>
  <section class="bl-gifts">
    <div class="bl-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p v-if="eyebrow" class="bl-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <p v-if="intro" class="bl-gifts__intro">
      {{ intro }}
    </p>

    <div class="bl-gifts__list">
      <article class="bl-gifts__item">
        <button type="button" class="bl-gift-btn" aria-label="Mở hộp mừng cưới" @click="openGift">
          <div class="bl-gift-glow"></div>

          <div class="bl-gift-box">
            <div class="bl-gift-icon">
              <v-icon size="52" color="#fbfcfa">mdi-gift-outline</v-icon>
            </div>

            <span class="bl-gift-sparkle bl-gift-sparkle--1">✤</span>
            <span class="bl-gift-sparkle bl-gift-sparkle--2">✧</span>
            <span class="bl-gift-sparkle bl-gift-sparkle--3">✤</span>
            <span class="bl-gift-sparkle bl-gift-sparkle--4">✧</span>
          </div>

          <div class="bl-gift-shadow"></div>

          <div class="bl-gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="bl-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="bl-gift-dialog">
        <div v-if="showGiftDialog" class="bl-gift-dialog" @click.self="closeGift">
          <div class="bl-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="bl-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="bl-gift-dialog-title">
            <div class="bl-gift-dialog__glow"></div>

            <div class="bl-gift-dialog__decoration">
              <span></span>

              <div class="bl-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="bl-gift-dialog__close" aria-label="Đóng hộp mừng cưới" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="bl-gift-dialog__eyebrow">MỘT CHÚT YÊU THƯƠNG</div>

            <h3 id="bl-gift-dialog-title">Hộp mừng cưới</h3>

            <p class="bl-gift-dialog__desc">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể,
              bạn có thể chuyển khoản qua các tài khoản bên dưới.
            </p>

            <div v-if="gifts.length" class="bl-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="bl-account-card">
                <div class="bl-account-heading">
                  <div class="bl-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="bl-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="bl-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="bl-qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="bl-qr-frame">
                    <div class="bl-qr-corner bl-qr-corner--tl"></div>
                    <div class="bl-qr-corner bl-qr-corner--tr"></div>
                    <div class="bl-qr-corner bl-qr-corner--bl"></div>
                    <div class="bl-qr-corner bl-qr-corner--br"></div>

                    <div class="bl-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || 'QR mừng cưới'" class="bl-qr-code" />
                    </div>
                  </div>

                  <div class="bl-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <div class="bl-account-info">
                  <div class="bl-info-row">
                    <div class="bl-info-left">
                      <span class="bl-info-label">CHỦ TÀI KHOẢN</span>

                      <span class="bl-info-value">
                        {{ item.AccountName || item.Owner || "Chưa cập nhật" }}
                      </span>
                    </div>
                  </div>

                  <div class="bl-info-divider"></div>

                  <div class="bl-info-row">
                    <div class="bl-info-left">
                      <span class="bl-info-label">SỐ TÀI KHOẢN</span>

                      <span class="bl-info-value bl-account-number">
                        {{ item.AccountNumber || item.Number || "Chưa cập nhật" }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="bl-copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="bl-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="bl-account-desc">
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <div class="bl-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="bl-qr-preview">
        <div v-if="previewQr" class="bl-qr-preview" @click.self="closeQr">
          <div class="bl-qr-preview__backdrop" @click="closeQr"></div>

          <div class="bl-qr-preview__card">
            <button type="button" class="bl-qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="bl-qr-preview__title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="bl-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || 'QR mừng cưới'" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="bl-qr-preview__save"
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
import { computed, onBeforeUnmount, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";

const props = defineProps({
  gifts: { type: Array, default: () => [] },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "gifts", "Eyebrow", "GỬI YÊU THƯƠNG")
);

const heading = computed(() =>
  sectionText(props.sections, "gifts", "Heading", "Hộp mừng cưới")
);

const intro = computed(() =>
  sectionText(
    props.sections,
    "gifts",
    "Intro",
    "Những lời chúc và tình cảm của bạn\nlà món quà quý giá nhất dành cho chúng mình"
  )
);

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("bl-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("bl-gift-dialog-open");
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

  document.body.classList.remove("bl-gift-dialog-open");
});
</script>

<style scoped>
.bl-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #3d5a47;

  border: 1px solid rgba(127, 163, 137, 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(244, 250, 245, 0.4));

  box-shadow: 0 12px 35px rgba(61, 90, 71, 0.09);

  overflow: hidden;
}

.bl-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(181, 208, 186, 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.bl-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #4f6b58;
}

.bl-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.7));
}

.bl-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.bl-eyebrow {
  position: relative;

  margin: 0;

  color: #4a6653;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bl-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #3d5a47;
}

.bl-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: #526e5a;

  font-size: 14px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   GIFT BOX
========================================================= */

.bl-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.bl-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bl-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(127, 163, 137, 0.3);
  border-radius: 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(244, 250, 245, 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.bl-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(207, 227, 210, 0.5),
    rgba(207, 227, 210, 0.14) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: bl-gift-glow 3.5s ease-in-out infinite;
}

.bl-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, #4a6653, #57806a 60%, #3d5a47);

  box-shadow:
    0 20px 40px rgba(87, 128, 106, 0.35),
    inset 0 2px 6px rgba(249, 252, 249, 0.4);

  animation: bl-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.bl-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(249, 252, 249, 0.5);
  border-radius: 24px;
}

.bl-gift-btn:hover .bl-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.bl-gift-btn:active .bl-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.bl-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(61, 90, 71, 0.16);

  filter: blur(8px);

  animation: bl-gift-shadow 3.5s ease-in-out infinite;
}

.bl-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: #4f6b58;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(181, 208, 186, 0.25);

  pointer-events: none;

  animation: bl-sparkle 2.6s ease-in-out infinite;
}

.bl-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.bl-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.bl-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.bl-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.bl-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: #57806a;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.bl-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #4f6b58, transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.bl-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.bl-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(250, 252, 250, 0.4), rgba(47, 58, 51, 0.6));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.bl-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(127, 163, 137, 0.45);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(253, 254, 253, 0.98), rgba(241, 235, 244, 0.97));

  box-shadow:
    0 30px 90px rgba(47, 58, 51, 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(127, 163, 137, 0.35) transparent;
}

.bl-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(181, 208, 186, 0.22);
  border-radius: 21px;

  pointer-events: none;
}

.bl-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(207, 227, 210, 0.45), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.bl-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.bl-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.65));
}

.bl-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.bl-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background: linear-gradient(135deg, #4a6653, #57806a);

  box-shadow: 0 7px 18px rgba(87, 128, 106, 0.25);

  animation: bl-heart-pulse 2.5s ease-in-out infinite;
}

.bl-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #57806a;

  border: 1px solid rgba(127, 163, 137, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.bl-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.bl-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: #4a6653;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.bl-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: #3d5a47;
}

.bl-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #526e5a;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.bl-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.bl-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(127, 163, 137, 0.32);
  border-radius: 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(244, 250, 245, 0.75));

  box-shadow: 0 8px 25px rgba(61, 90, 71, 0.07);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bl-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(61, 90, 71, 0.11);
}

.bl-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.bl-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #57806a;

  border: 1px solid rgba(127, 163, 137, 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, #e9f2ea);
}

.bl-account-label {
  color: #3d5a47;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.bl-account-bank {
  margin-top: 2px;

  color: #526e5a;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.bl-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.bl-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.bl-qr-inner {
  padding: 7px;

  border: 1px solid rgba(127, 163, 137, 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(47, 58, 51, 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bl-qr-button:hover .bl-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(47, 58, 51, 0.13);
}

.bl-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.bl-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #4f6b58;
  border-style: solid;

  pointer-events: none;
}

.bl-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.bl-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.bl-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.bl-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.bl-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: #526e5a;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.bl-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(127, 163, 137, 0.2);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.55);
}

.bl-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.bl-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bl-info-label {
  color: #4a6653;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.bl-info-value {
  color: #3d5a47;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.bl-account-number {
  color: #57806a;

  letter-spacing: 0.06em;
}

.bl-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(127, 163, 137, 0.28), transparent);
}

.bl-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #57806a;

  border: 1px solid rgba(127, 163, 137, 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.bl-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.bl-account-desc {
  margin-top: 9px;

  color: #526e5a;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.bl-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: #4f6b58;
}

.bl-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.5));
}

.bl-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.bl-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.bl-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(38, 48, 42, 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.bl-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(127, 163, 137, 0.45);
  border-radius: 24px;

  background: linear-gradient(170deg, #fdfefd, #f1f7f2);

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.bl-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #57806a;

  border: 1px solid rgba(127, 163, 137, 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.82);

  cursor: pointer;
}

.bl-qr-preview__title {
  margin-bottom: 15px;

  color: #3d5a47;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.bl-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(127, 163, 137, 0.4);

  background: white;

  box-shadow: 0 10px 30px rgba(47, 58, 51, 0.12);
}

.bl-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.bl-qr-preview__card p {
  margin: 14px 0;

  color: #526e5a;

  font-size: 11px;
  font-style: italic;
}

.bl-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background: linear-gradient(135deg, #4a6653, #57806a);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(87, 128, 106, 0.22);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.bl-gift-dialog-enter-active,
.bl-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.bl-gift-dialog-enter-active .bl-gift-dialog__card,
.bl-gift-dialog-leave-active .bl-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.bl-gift-dialog-enter-from {
  opacity: 0;
}

.bl-gift-dialog-enter-from .bl-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.bl-gift-dialog-leave-to {
  opacity: 0;
}

.bl-gift-dialog-leave-to .bl-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.bl-qr-preview-enter-active,
.bl-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.bl-qr-preview-enter-active .bl-qr-preview__card,
.bl-qr-preview-leave-active .bl-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.bl-qr-preview-enter-from {
  opacity: 0;
}

.bl-qr-preview-enter-from .bl-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.bl-qr-preview-leave-to {
  opacity: 0;
}

.bl-qr-preview-leave-to .bl-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes bl-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes bl-gift-shadow {
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

@keyframes bl-gift-glow {
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

@keyframes bl-sparkle {
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

@keyframes bl-heart-pulse {
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
  .bl-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .bl-gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .bl-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .bl-gifts__item,
  .bl-gift-btn {
    min-height: 295px;
  }

  .bl-gift-box {
    width: 130px;
    height: 130px;
  }

  .bl-gift-glow {
    width: 190px;
    height: 190px;
  }

  .bl-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .bl-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .bl-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .bl-gift-dialog__card h3 {
    font-size: 26px;
  }

  .bl-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .bl-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .bl-account-card {
    padding: 14px;
  }

  .bl-qr-code {
    width: 135px;
    height: 135px;
  }

  .bl-account-info {
    margin-top: 11px;
  }

  .bl-qr-preview {
    padding: 14px;
  }

  .bl-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .bl-gift-box {
    width: 115px;
    height: 115px;
  }

  .bl-gifts__item,
  .bl-gift-btn {
    min-height: 280px;
  }

  .bl-qr-code {
    width: 125px;
    height: 125px;
  }

  .bl-account-label {
    font-size: 11px;
  }

  .bl-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bl-gift-box,
  .bl-gift-shadow,
  .bl-gift-glow,
  .bl-gift-sparkle,
  .bl-gift-dialog__heart {
    animation: none;
  }

  .bl-gift-dialog-enter-active,
  .bl-gift-dialog-leave-active,
  .bl-qr-preview-enter-active,
  .bl-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.bl-gift-dialog-open) {
  overflow: hidden;
}
</style>
