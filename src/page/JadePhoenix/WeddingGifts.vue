<template>
  <section class="jp-gifts">
    <div class="jp-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p v-if="eyebrow" class="jp-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <p v-if="intro" class="jp-gifts__intro">
      {{ intro }}
    </p>

    <div class="jp-gifts__list">
      <article class="jp-gifts__item">
        <button type="button" class="jp-gift-btn" :aria-label="$t('Mở hộp mừng cưới')" @click="openGift">
          <div class="jp-gift-glow"></div>

          <div class="jp-gift-box">
            <div class="jp-gift-icon">
              <v-icon size="52" color="#fefbf6">mdi-gift-outline</v-icon>
            </div>

            <span class="jp-gift-sparkle jp-gift-sparkle--1">囍</span>
            <span class="jp-gift-sparkle jp-gift-sparkle--2">✧</span>
            <span class="jp-gift-sparkle jp-gift-sparkle--3">囍</span>
            <span class="jp-gift-sparkle jp-gift-sparkle--4">✧</span>
          </div>

          <div class="jp-gift-shadow"></div>

          <div class="jp-gift-hint">
            <span>{{ $t("CHẠM ĐỂ MỞ") }}</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="jp-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="jp-gift-dialog">
        <div v-if="showGiftDialog" class="jp-gift-dialog" @click.self="closeGift">
          <div class="jp-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="jp-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="jp-gift-dialog-title">
            <div class="jp-gift-dialog__glow"></div>

            <div class="jp-gift-dialog__decoration">
              <span></span>

              <div class="jp-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="jp-gift-dialog__close" :aria-label="$t('Đóng hộp mừng cưới')" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="jp-gift-dialog__eyebrow">{{ $t("MỘT CHÚT YÊU THƯƠNG") }}</div>

            <h3 id="jp-gift-dialog-title">{{ $t("Hộp mừng cưới") }}</h3>

            <p class="jp-gift-dialog__desc">
              {{ $t("Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có thể chuyển khoản qua các tài khoản bên dưới.") }}
            </p>

            <div v-if="gifts.length" class="jp-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="jp-account-card">
                <div class="jp-account-heading">
                  <div class="jp-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="jp-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="jp-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="jp-qr-button"
                  :aria-label="$t('Xem QR lớn')"
                  @click="openQr(item)"
                >
                  <div class="jp-qr-frame">
                    <div class="jp-qr-corner jp-qr-corner--tl"></div>
                    <div class="jp-qr-corner jp-qr-corner--tr"></div>
                    <div class="jp-qr-corner jp-qr-corner--bl"></div>
                    <div class="jp-qr-corner jp-qr-corner--br"></div>

                    <div class="jp-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || $t('QR mừng cưới')" class="jp-qr-code" />
                    </div>
                  </div>

                  <div class="jp-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    {{ $t("CHẠM VÀO QR ĐỂ XEM LỚN") }}
                  </div>
                </button>

                <div class="jp-account-info">
                  <div class="jp-info-row">
                    <div class="jp-info-left">
                      <span class="jp-info-label">{{ $t("CHỦ TÀI KHOẢN") }}</span>

                      <span class="jp-info-value">
                        {{ item.AccountName || item.Owner || $t("Chưa cập nhật") }}
                      </span>
                    </div>
                  </div>

                  <div class="jp-info-divider"></div>

                  <div class="jp-info-row">
                    <div class="jp-info-left">
                      <span class="jp-info-label">{{ $t("SỐ TÀI KHOẢN") }}</span>

                      <span class="jp-info-value jp-account-number">
                        {{ item.AccountNumber || item.Number || $t("Chưa cập nhật") }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="jp-copy-button"
                      :title="$t('Sao chép số tài khoản')"
                      :aria-label="$t('Sao chép số tài khoản')"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="jp-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="jp-account-desc">
              {{ $t("Thông tin chuyển khoản đang được cập nhật.") }}
            </div>

            <div class="jp-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="jp-qr-preview">
        <div v-if="previewQr" class="jp-qr-preview" @click.self="closeQr">
          <div class="jp-qr-preview__backdrop" @click="closeQr"></div>

          <div class="jp-qr-preview__card">
            <button type="button" class="jp-qr-preview__close" :aria-label="$t('Đóng QR')" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="jp-qr-preview__title">
              {{ previewQr.Name || $t("QR MỪNG CƯỚI") }}
            </div>

            <div class="jp-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || $t('QR mừng cưới')" />
            </div>

            <p>{{ $t("Nhấn giữ vào ảnh để lưu QR về điện thoại") }}</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="jp-qr-preview__save"
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

  document.body.classList.add("jp-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("jp-gift-dialog-open");
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

  document.body.classList.remove("jp-gift-dialog-open");
});
</script>

<style scoped>
.jp-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--tc-6e1f24, #6e1f24);

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(var(--tc-f8edd6-rgb, 248, 237, 214), 0.4));

  box-shadow: 0 12px 35px rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.09);

  overflow: hidden;
}

.jp-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.jp-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: var(--tc-6e2a30, #6e2a30);
}

.jp-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.7));
}

.jp-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.jp-eyebrow {
  position: relative;

  margin: 0;

  color: var(--tc-68262c, #68262c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.jp-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: var(--tc-6e1f24, #6e1f24);
}

.jp-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: var(--tc-702c32, #702c32);

  font-size: 14px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   GIFT BOX
========================================================= */

.jp-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.jp-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.jp-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.3);
  border-radius: 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(var(--tc-f8edd6-rgb, 248, 237, 214), 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.jp-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(var(--tc-e8c98a-rgb, 232, 201, 138), 0.5),
    rgba(var(--tc-e8c98a-rgb, 232, 201, 138), 0.14) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: jp-gift-glow 3.5s ease-in-out infinite;
}

.jp-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, var(--tc-68262c, #68262c), var(--tc-8a3a40, #8a3a40) 60%, var(--tc-6e1f24, #6e1f24));

  box-shadow:
    0 20px 40px rgba(var(--tc-8a3a40-rgb, 138, 58, 64), 0.35),
    inset 0 2px 6px rgba(var(--tc-fdfaf3-rgb, 253, 250, 243), 0.4);

  animation: jp-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.jp-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(var(--tc-fdfaf3-rgb, 253, 250, 243), 0.5);
  border-radius: 24px;
}

.jp-gift-btn:hover .jp-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.jp-gift-btn:active .jp-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.jp-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.16);

  filter: blur(8px);

  animation: jp-gift-shadow 3.5s ease-in-out infinite;
}

.jp-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: var(--tc-6e2a30, #6e2a30);

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.25);

  pointer-events: none;

  animation: jp-sparkle 2.6s ease-in-out infinite;
}

.jp-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.jp-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.jp-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.jp-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.jp-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: var(--tc-8a3a40, #8a3a40);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.jp-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, var(--tc-6e2a30, #6e2a30), transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.jp-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.jp-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(var(--tc-fdfaf4-rgb, 253, 250, 244), 0.4), rgba(var(--tc-4a2328-rgb, 74, 35, 40), 0.6));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.jp-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.45);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(var(--tc-fefdf9-rgb, 254, 253, 249), 0.98), rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.97));

  box-shadow:
    0 30px 90px rgba(var(--tc-4a2328-rgb, 74, 35, 40), 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.35) transparent;
}

.jp-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.22);
  border-radius: 21px;

  pointer-events: none;
}

.jp-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(var(--tc-e8c98a-rgb, 232, 201, 138), 0.45), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.jp-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.jp-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.65));
}

.jp-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.jp-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--tc-68262c, #68262c), var(--tc-8a3a40, #8a3a40));

  box-shadow: 0 7px 18px rgba(var(--tc-8a3a40-rgb, 138, 58, 64), 0.25);

  animation: jp-heart-pulse 2.5s ease-in-out infinite;
}

.jp-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-8a3a40, #8a3a40);

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.jp-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.jp-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: var(--tc-68262c, #68262c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.jp-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: var(--tc-6e1f24, #6e1f24);
}

.jp-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: var(--tc-702c32, #702c32);

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.jp-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.jp-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.32);
  border-radius: 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(var(--tc-f8edd6-rgb, 248, 237, 214), 0.75));

  box-shadow: 0 8px 25px rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.07);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.jp-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.11);
}

.jp-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.jp-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--tc-8a3a40, #8a3a40);

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, var(--tc-f5e8cd, #f5e8cd));
}

.jp-account-label {
  color: var(--tc-6e1f24, #6e1f24);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.jp-account-bank {
  margin-top: 2px;

  color: var(--tc-702c32, #702c32);

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.jp-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.jp-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.jp-qr-inner {
  padding: 7px;

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(var(--tc-4a2328-rgb, 74, 35, 40), 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.jp-qr-button:hover .jp-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(var(--tc-4a2328-rgb, 74, 35, 40), 0.13);
}

.jp-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.jp-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: var(--tc-6e2a30, #6e2a30);
  border-style: solid;

  pointer-events: none;
}

.jp-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.jp-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.jp-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.jp-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.jp-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: var(--tc-702c32, #702c32);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.jp-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.2);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.55);
}

.jp-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.jp-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jp-info-label {
  color: var(--tc-68262c, #68262c);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.jp-info-value {
  color: var(--tc-6e1f24, #6e1f24);

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.jp-account-number {
  color: var(--tc-8a3a40, #8a3a40);

  letter-spacing: 0.06em;
}

.jp-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.28), transparent);
}

.jp-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--tc-8a3a40, #8a3a40);

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.jp-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.jp-account-desc {
  margin-top: 9px;

  color: var(--tc-702c32, #702c32);

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.jp-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: var(--tc-6e2a30, #6e2a30);
}

.jp-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.5));
}

.jp-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.jp-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.jp-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(var(--tc-3a1c1e-rgb, 58, 28, 30), 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.jp-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.45);
  border-radius: 24px;

  background: linear-gradient(170deg, var(--tc-fefdf9, #fefdf9), var(--tc-f9f1de, #f9f1de));

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.jp-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-8a3a40, #8a3a40);

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.82);

  cursor: pointer;
}

.jp-qr-preview__title {
  margin-bottom: 15px;

  color: var(--tc-6e1f24, #6e1f24);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.jp-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.4);

  background: white;

  box-shadow: 0 10px 30px rgba(var(--tc-4a2328-rgb, 74, 35, 40), 0.12);
}

.jp-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.jp-qr-preview__card p {
  margin: 14px 0;

  color: var(--tc-702c32, #702c32);

  font-size: 11px;
  font-style: italic;
}

.jp-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--tc-68262c, #68262c), var(--tc-8a3a40, #8a3a40));

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(var(--tc-8a3a40-rgb, 138, 58, 64), 0.22);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.jp-gift-dialog-enter-active,
.jp-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.jp-gift-dialog-enter-active .jp-gift-dialog__card,
.jp-gift-dialog-leave-active .jp-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.jp-gift-dialog-enter-from {
  opacity: 0;
}

.jp-gift-dialog-enter-from .jp-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.jp-gift-dialog-leave-to {
  opacity: 0;
}

.jp-gift-dialog-leave-to .jp-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.jp-qr-preview-enter-active,
.jp-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.jp-qr-preview-enter-active .jp-qr-preview__card,
.jp-qr-preview-leave-active .jp-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.jp-qr-preview-enter-from {
  opacity: 0;
}

.jp-qr-preview-enter-from .jp-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.jp-qr-preview-leave-to {
  opacity: 0;
}

.jp-qr-preview-leave-to .jp-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes jp-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes jp-gift-shadow {
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

@keyframes jp-gift-glow {
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

@keyframes jp-sparkle {
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

@keyframes jp-heart-pulse {
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
  .jp-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .jp-gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .jp-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .jp-gifts__item,
  .jp-gift-btn {
    min-height: 295px;
  }

  .jp-gift-box {
    width: 130px;
    height: 130px;
  }

  .jp-gift-glow {
    width: 190px;
    height: 190px;
  }

  .jp-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .jp-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .jp-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .jp-gift-dialog__card h3 {
    font-size: 26px;
  }

  .jp-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .jp-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .jp-account-card {
    padding: 14px;
  }

  .jp-qr-code {
    width: 135px;
    height: 135px;
  }

  .jp-account-info {
    margin-top: 11px;
  }

  .jp-qr-preview {
    padding: 14px;
  }

  .jp-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .jp-gift-box {
    width: 115px;
    height: 115px;
  }

  .jp-gifts__item,
  .jp-gift-btn {
    min-height: 280px;
  }

  .jp-qr-code {
    width: 125px;
    height: 125px;
  }

  .jp-account-label {
    font-size: 11px;
  }

  .jp-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .jp-gift-box,
  .jp-gift-shadow,
  .jp-gift-glow,
  .jp-gift-sparkle,
  .jp-gift-dialog__heart {
    animation: none;
  }

  .jp-gift-dialog-enter-active,
  .jp-gift-dialog-leave-active,
  .jp-qr-preview-enter-active,
  .jp-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.jp-gift-dialog-open) {
  overflow: hidden;
}
</style>
