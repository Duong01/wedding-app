<template>
  <section class="rr-gifts">
    <div class="rr-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p v-if="eyebrow" class="rr-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <p v-if="intro" class="rr-gifts__intro">
      {{ intro }}
    </p>

    <div class="rr-gifts__list">
      <article class="rr-gifts__item">
        <button type="button" class="rr-gift-btn" :aria-label="$t('Mở hộp mừng cưới')" @click="openGift">
          <div class="rr-gift-glow"></div>

          <div class="rr-gift-box">
            <div class="rr-gift-icon">
              <v-icon size="52" color="#fef9fa">mdi-gift-outline</v-icon>
            </div>

            <span class="rr-gift-sparkle rr-gift-sparkle--1">♥</span>
            <span class="rr-gift-sparkle rr-gift-sparkle--2">✧</span>
            <span class="rr-gift-sparkle rr-gift-sparkle--3">♥</span>
            <span class="rr-gift-sparkle rr-gift-sparkle--4">✧</span>
          </div>

          <div class="rr-gift-shadow"></div>

          <div class="rr-gift-hint">
            <span>{{ $t("CHẠM ĐỂ MỞ") }}</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="rr-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="rr-gift-dialog">
        <div v-if="showGiftDialog" class="rr-gift-dialog" @click.self="closeGift">
          <div class="rr-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="rr-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="rr-gift-dialog-title">
            <div class="rr-gift-dialog__glow"></div>

            <div class="rr-gift-dialog__decoration">
              <span></span>

              <div class="rr-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="rr-gift-dialog__close" :aria-label="$t('Đóng hộp mừng cưới')" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="rr-gift-dialog__eyebrow">{{ $t("MỘT CHÚT YÊU THƯƠNG") }}</div>

            <h3 id="rr-gift-dialog-title">{{ $t("Hộp mừng cưới") }}</h3>

            <p class="rr-gift-dialog__desc">
              {{ $t("Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có thể chuyển khoản qua các tài khoản bên dưới.") }}
            </p>

            <div v-if="gifts.length" class="rr-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="rr-account-card">
                <div class="rr-account-heading">
                  <div class="rr-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="rr-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="rr-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="rr-qr-button"
                  :aria-label="$t('Xem QR lớn')"
                  @click="openQr(item)"
                >
                  <div class="rr-qr-frame">
                    <div class="rr-qr-corner rr-qr-corner--tl"></div>
                    <div class="rr-qr-corner rr-qr-corner--tr"></div>
                    <div class="rr-qr-corner rr-qr-corner--bl"></div>
                    <div class="rr-qr-corner rr-qr-corner--br"></div>

                    <div class="rr-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || $t('QR mừng cưới')" class="rr-qr-code" />
                    </div>
                  </div>

                  <div class="rr-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    {{ $t("CHẠM VÀO QR ĐỂ XEM LỚN") }}
                  </div>
                </button>

                <div class="rr-account-info">
                  <div class="rr-info-row">
                    <div class="rr-info-left">
                      <span class="rr-info-label">{{ $t("CHỦ TÀI KHOẢN") }}</span>

                      <span class="rr-info-value">
                        {{ item.AccountName || item.Owner || $t("Chưa cập nhật") }}
                      </span>
                    </div>
                  </div>

                  <div class="rr-info-divider"></div>

                  <div class="rr-info-row">
                    <div class="rr-info-left">
                      <span class="rr-info-label">{{ $t("SỐ TÀI KHOẢN") }}</span>

                      <span class="rr-info-value rr-account-number">
                        {{ item.AccountNumber || item.Number || $t("Chưa cập nhật") }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="rr-copy-button"
                      :title="$t('Sao chép số tài khoản')"
                      :aria-label="$t('Sao chép số tài khoản')"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="rr-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="rr-account-desc">
              {{ $t("Thông tin chuyển khoản đang được cập nhật.") }}
            </div>

            <div class="rr-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="rr-qr-preview">
        <div v-if="previewQr" class="rr-qr-preview" @click.self="closeQr">
          <div class="rr-qr-preview__backdrop" @click="closeQr"></div>

          <div class="rr-qr-preview__card">
            <button type="button" class="rr-qr-preview__close" :aria-label="$t('Đóng QR')" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="rr-qr-preview__title">
              {{ previewQr.Name || $t("QR MỪNG CƯỚI") }}
            </div>

            <div class="rr-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || $t('QR mừng cưới')" />
            </div>

            <p>{{ $t("Nhấn giữ vào ảnh để lưu QR về điện thoại") }}</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="rr-qr-preview__save"
            >
              <v-icon size="15">mdi-download</v-icon>

              {{ $t("MỞ / LƯU ẢNH QR") }}
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
import { t } from "@/lang";
const props = defineProps({
  gifts: { type: Array, default: () => [] },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "gifts", "Eyebrow", t("GỬI YÊU THƯƠNG"))
);

const heading = computed(() =>
  sectionText(props.sections, "gifts", "Heading", t("Hộp mừng cưới"))
);

const intro = computed(() =>
  sectionText(
    props.sections,
    "gifts",
    "Intro",
    t("Những lời chúc và tình cảm của bạn\nlà món quà quý giá nhất dành cho chúng mình")
  )
);

const showGiftDialog = ref(false);
const previewQr = ref(null);

function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("rr-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("rr-gift-dialog-open");
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

  document.body.classList.remove("rr-gift-dialog-open");
});
</script>

<style scoped>
.rr-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--tc-8c2f42, #8c2f42);

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(var(--tc-fae4e9-rgb, 250, 228, 233), 0.4));

  box-shadow: 0 12px 35px rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.09);

  overflow: hidden;
}

.rr-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.rr-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: var(--tc-6e3844, #6e3844);
}

.rr-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.7));
}

.rr-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.rr-eyebrow {
  position: relative;

  margin: 0;

  color: var(--tc-683440, #683440);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.rr-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: var(--tc-8c2f42, #8c2f42);
}

.rr-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: var(--tc-703a46, #703a46);

  font-size: 14px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   GIFT BOX
========================================================= */

.rr-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.rr-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.rr-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.3);
  border-radius: 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(var(--tc-fae4e9-rgb, 250, 228, 233), 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.rr-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(var(--tc-e8b4be-rgb, 232, 180, 190), 0.5),
    rgba(var(--tc-e8b4be-rgb, 232, 180, 190), 0.14) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: rr-gift-glow 3.5s ease-in-out infinite;
}

.rr-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, var(--tc-683440, #683440), var(--tc-8c4452, #8c4452) 60%, var(--tc-8c2f42, #8c2f42));

  box-shadow:
    0 20px 40px rgba(var(--tc-8c4452-rgb, 140, 68, 82), 0.35),
    inset 0 2px 6px rgba(var(--tc-fdf7f8-rgb, 253, 247, 248), 0.4);

  animation: rr-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.rr-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(var(--tc-fdf7f8-rgb, 253, 247, 248), 0.5);
  border-radius: 24px;
}

.rr-gift-btn:hover .rr-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.rr-gift-btn:active .rr-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.rr-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.16);

  filter: blur(8px);

  animation: rr-gift-shadow 3.5s ease-in-out infinite;
}

.rr-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: var(--tc-6e3844, #6e3844);

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.25);

  pointer-events: none;

  animation: rr-sparkle 2.6s ease-in-out infinite;
}

.rr-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.rr-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.rr-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.rr-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.rr-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: var(--tc-8c4452, #8c4452);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.rr-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, var(--tc-6e3844, #6e3844), transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.rr-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.rr-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(var(--tc-fdf7f9-rgb, 253, 247, 249), 0.4), rgba(var(--tc-4a232a-rgb, 74, 35, 42), 0.6));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.rr-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.45);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(var(--tc-fefcfd-rgb, 254, 252, 253), 0.98), rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.97));

  box-shadow:
    0 30px 90px rgba(var(--tc-4a232a-rgb, 74, 35, 42), 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.35) transparent;
}

.rr-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.22);
  border-radius: 21px;

  pointer-events: none;
}

.rr-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(var(--tc-e8b4be-rgb, 232, 180, 190), 0.45), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.rr-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.rr-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.65));
}

.rr-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.rr-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--tc-683440, #683440), var(--tc-8c4452, #8c4452));

  box-shadow: 0 7px 18px rgba(var(--tc-8c4452-rgb, 140, 68, 82), 0.25);

  animation: rr-heart-pulse 2.5s ease-in-out infinite;
}

.rr-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-8c4452, #8c4452);

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.rr-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.rr-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: var(--tc-683440, #683440);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.rr-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: var(--tc-8c2f42, #8c2f42);
}

.rr-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: var(--tc-703a46, #703a46);

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.rr-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.rr-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.32);
  border-radius: 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(var(--tc-fae4e9-rgb, 250, 228, 233), 0.75));

  box-shadow: 0 8px 25px rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.07);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.rr-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.11);
}

.rr-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.rr-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--tc-8c4452, #8c4452);

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, var(--tc-f7dce2, #f7dce2));
}

.rr-account-label {
  color: var(--tc-8c2f42, #8c2f42);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.rr-account-bank {
  margin-top: 2px;

  color: var(--tc-703a46, #703a46);

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.rr-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.rr-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.rr-qr-inner {
  padding: 7px;

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(var(--tc-4a232a-rgb, 74, 35, 42), 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.rr-qr-button:hover .rr-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(var(--tc-4a232a-rgb, 74, 35, 42), 0.13);
}

.rr-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.rr-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: var(--tc-6e3844, #6e3844);
  border-style: solid;

  pointer-events: none;
}

.rr-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.rr-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.rr-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.rr-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.rr-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: var(--tc-703a46, #703a46);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.rr-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.2);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.55);
}

.rr-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.rr-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rr-info-label {
  color: var(--tc-683440, #683440);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.rr-info-value {
  color: var(--tc-8c2f42, #8c2f42);

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.rr-account-number {
  color: var(--tc-8c4452, #8c4452);

  letter-spacing: 0.06em;
}

.rr-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.28), transparent);
}

.rr-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--tc-8c4452, #8c4452);

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.rr-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.rr-account-desc {
  margin-top: 9px;

  color: var(--tc-703a46, #703a46);

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.rr-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: var(--tc-6e3844, #6e3844);
}

.rr-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.5));
}

.rr-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.rr-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.rr-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(var(--tc-3a1c22-rgb, 58, 28, 34), 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.rr-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.45);
  border-radius: 24px;

  background: linear-gradient(170deg, var(--tc-fefcfc, #fefcfc), var(--tc-fce8ec, #fce8ec));

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.rr-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-8c4452, #8c4452);

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.82);

  cursor: pointer;
}

.rr-qr-preview__title {
  margin-bottom: 15px;

  color: var(--tc-8c2f42, #8c2f42);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.rr-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.4);

  background: white;

  box-shadow: 0 10px 30px rgba(var(--tc-4a232a-rgb, 74, 35, 42), 0.12);
}

.rr-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.rr-qr-preview__card p {
  margin: 14px 0;

  color: var(--tc-703a46, #703a46);

  font-size: 11px;
  font-style: italic;
}

.rr-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--tc-683440, #683440), var(--tc-8c4452, #8c4452));

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(var(--tc-8c4452-rgb, 140, 68, 82), 0.22);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.rr-gift-dialog-enter-active,
.rr-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.rr-gift-dialog-enter-active .rr-gift-dialog__card,
.rr-gift-dialog-leave-active .rr-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.rr-gift-dialog-enter-from {
  opacity: 0;
}

.rr-gift-dialog-enter-from .rr-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.rr-gift-dialog-leave-to {
  opacity: 0;
}

.rr-gift-dialog-leave-to .rr-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.rr-qr-preview-enter-active,
.rr-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.rr-qr-preview-enter-active .rr-qr-preview__card,
.rr-qr-preview-leave-active .rr-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.rr-qr-preview-enter-from {
  opacity: 0;
}

.rr-qr-preview-enter-from .rr-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.rr-qr-preview-leave-to {
  opacity: 0;
}

.rr-qr-preview-leave-to .rr-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes rr-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes rr-gift-shadow {
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

@keyframes rr-gift-glow {
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

@keyframes rr-sparkle {
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

@keyframes rr-heart-pulse {
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
  .rr-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .rr-gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .rr-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .rr-gifts__item,
  .rr-gift-btn {
    min-height: 295px;
  }

  .rr-gift-box {
    width: 130px;
    height: 130px;
  }

  .rr-gift-glow {
    width: 190px;
    height: 190px;
  }

  .rr-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .rr-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .rr-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .rr-gift-dialog__card h3 {
    font-size: 26px;
  }

  .rr-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .rr-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .rr-account-card {
    padding: 14px;
  }

  .rr-qr-code {
    width: 135px;
    height: 135px;
  }

  .rr-account-info {
    margin-top: 11px;
  }

  .rr-qr-preview {
    padding: 14px;
  }

  .rr-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .rr-gift-box {
    width: 115px;
    height: 115px;
  }

  .rr-gifts__item,
  .rr-gift-btn {
    min-height: 280px;
  }

  .rr-qr-code {
    width: 125px;
    height: 125px;
  }

  .rr-account-label {
    font-size: 11px;
  }

  .rr-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .rr-gift-box,
  .rr-gift-shadow,
  .rr-gift-glow,
  .rr-gift-sparkle,
  .rr-gift-dialog__heart {
    animation: none;
  }

  .rr-gift-dialog-enter-active,
  .rr-gift-dialog-leave-active,
  .rr-qr-preview-enter-active,
  .rr-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.rr-gift-dialog-open) {
  overflow: hidden;
}
</style>
