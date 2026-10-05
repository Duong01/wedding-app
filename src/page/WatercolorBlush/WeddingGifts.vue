<template>
  <section class="wb-gifts">
    <div class="wb-gifts__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p v-if="eyebrow" class="wb-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <p v-if="intro" class="wb-gifts__intro">
      {{ intro }}
    </p>

    <div class="wb-gifts__list">
      <article class="wb-gifts__item">
        <button type="button" class="wb-gift-btn" :aria-label="$t('Mở hộp mừng cưới')" @click="openGift">
          <div class="wb-gift-glow"></div>

          <div class="wb-gift-box">
            <div class="wb-gift-icon">
              <v-icon size="52" color="#fefafb">mdi-gift-outline</v-icon>
            </div>

            <span class="wb-gift-sparkle wb-gift-sparkle--1">❁</span>
            <span class="wb-gift-sparkle wb-gift-sparkle--2">✧</span>
            <span class="wb-gift-sparkle wb-gift-sparkle--3">❁</span>
            <span class="wb-gift-sparkle wb-gift-sparkle--4">✧</span>
          </div>

          <div class="wb-gift-shadow"></div>

          <div class="wb-gift-hint">
            <span>{{ $t("CHẠM ĐỂ MỞ") }}</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <div class="wb-gifts__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="wb-gift-dialog">
        <div v-if="showGiftDialog" class="wb-gift-dialog" @click.self="closeGift">
          <div class="wb-gift-dialog__backdrop" @click="closeGift"></div>

          <div class="wb-gift-dialog__card" role="dialog" aria-modal="true" aria-labelledby="wb-gift-dialog-title">
            <div class="wb-gift-dialog__glow"></div>

            <div class="wb-gift-dialog__decoration">
              <span></span>

              <div class="wb-gift-dialog__heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <button type="button" class="wb-gift-dialog__close" :aria-label="$t('Đóng hộp mừng cưới')" @click="closeGift">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="wb-gift-dialog__eyebrow">{{ $t("MỘT CHÚT YÊU THƯƠNG") }}</div>

            <h3 id="wb-gift-dialog-title">{{ $t("Hộp mừng cưới") }}</h3>

            <p class="wb-gift-dialog__desc">
              {{ $t("Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có thể chuyển khoản qua các tài khoản bên dưới.") }}
            </p>

            <div v-if="gifts.length" class="wb-account-grid">
              <article v-for="(item, index) in gifts" :key="item.Id || index" class="wb-account-card">
                <div class="wb-account-heading">
                  <div class="wb-account-icon">
                    <v-icon size="17">mdi-bank-outline</v-icon>
                  </div>

                  <div>
                    <div class="wb-account-label">
                      {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                    </div>

                    <div v-if="item.BankName" class="wb-account-bank">
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <button
                  v-if="item.QrCode"
                  type="button"
                  class="wb-qr-button"
                  :aria-label="$t('Xem QR lớn')"
                  @click="openQr(item)"
                >
                  <div class="wb-qr-frame">
                    <div class="wb-qr-corner wb-qr-corner--tl"></div>
                    <div class="wb-qr-corner wb-qr-corner--tr"></div>
                    <div class="wb-qr-corner wb-qr-corner--bl"></div>
                    <div class="wb-qr-corner wb-qr-corner--br"></div>

                    <div class="wb-qr-inner">
                      <img :src="item.QrCode" :alt="item.Name || $t('QR mừng cưới')" class="wb-qr-code" />
                    </div>
                  </div>

                  <div class="wb-qr-hint">
                    <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                    {{ $t("CHẠM VÀO QR ĐỂ XEM LỚN") }}
                  </div>
                </button>

                <div class="wb-account-info">
                  <div class="wb-info-row">
                    <div class="wb-info-left">
                      <span class="wb-info-label">{{ $t("CHỦ TÀI KHOẢN") }}</span>

                      <span class="wb-info-value">
                        {{ item.AccountName || item.Owner || $t("Chưa cập nhật") }}
                      </span>
                    </div>
                  </div>

                  <div class="wb-info-divider"></div>

                  <div class="wb-info-row">
                    <div class="wb-info-left">
                      <span class="wb-info-label">{{ $t("SỐ TÀI KHOẢN") }}</span>

                      <span class="wb-info-value wb-account-number">
                        {{ item.AccountNumber || item.Number || $t("Chưa cập nhật") }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="wb-copy-button"
                      :title="$t('Sao chép số tài khoản')"
                      :aria-label="$t('Sao chép số tài khoản')"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">mdi-content-copy</v-icon>
                    </button>
                  </div>
                </div>

                <div v-if="item.Description" class="wb-account-desc">
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <div v-else class="wb-account-desc">
              {{ $t("Thông tin chuyển khoản đang được cập nhật.") }}
            </div>

            <div class="wb-gift-dialog__footer">
              <span></span>

              <v-icon size="13">mdi-flower-outline</v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->
      <Transition name="wb-qr-preview">
        <div v-if="previewQr" class="wb-qr-preview" @click.self="closeQr">
          <div class="wb-qr-preview__backdrop" @click="closeQr"></div>

          <div class="wb-qr-preview__card">
            <button type="button" class="wb-qr-preview__close" :aria-label="$t('Đóng QR')" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="wb-qr-preview__title">
              {{ previewQr.Name || $t("QR MỪNG CƯỚI") }}
            </div>

            <div class="wb-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || $t('QR mừng cưới')" />
            </div>

            <p>{{ $t("Nhấn giữ vào ảnh để lưu QR về điện thoại") }}</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="wb-qr-preview__save"
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

  document.body.classList.add("wb-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("wb-gift-dialog-open");
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

  document.body.classList.remove("wb-gift-dialog-open");
});
</script>

<style scoped>
.wb-gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--tc-8a4a5c, #8a4a5c);

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(var(--tc-fef4f7-rgb, 254, 244, 247), 0.4));

  box-shadow: 0 12px 35px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.09);

  overflow: hidden;
}

.wb-gifts::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.wb-gifts__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: var(--tc-a05a6e, #a05a6e);
}

.wb-gifts__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.7));
}

.wb-gifts__ornament span:last-child {
  transform: rotate(180deg);
}

.wb-eyebrow {
  position: relative;

  margin: 0;

  color: var(--tc-a5586c, #a5586c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.wb-gifts h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: var(--tc-8a4a5c, #8a4a5c);
}

.wb-gifts__intro {
  position: relative;

  margin: 0 0 27px;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 14px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   GIFT BOX
========================================================= */

.wb-gifts__list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.wb-gifts__item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.wb-gift-btn {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.3);
  border-radius: 23px;

  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(var(--tc-fef4f7-rgb, 254, 244, 247), 0.25));

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

.wb-gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(var(--tc-f2ccd8-rgb, 242, 204, 216), 0.5),
    rgba(var(--tc-f2ccd8-rgb, 242, 204, 216), 0.14) 45%,
    transparent 72%
  );

  filter: blur(4px);

  animation: wb-gift-glow 3.5s ease-in-out infinite;
}

.wb-gift-box {
  position: relative;
  z-index: 3;

  width: 150px;
  height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background: linear-gradient(140deg, var(--tc-a5586c, #a5586c), var(--tc-b06a80, #b06a80) 60%, var(--tc-8a4a5c, #8a4a5c));

  box-shadow:
    0 20px 40px rgba(var(--tc-b06a80-rgb, 176, 106, 128), 0.35),
    inset 0 2px 6px rgba(var(--tc-fff8fa-rgb, 255, 248, 250), 0.4);

  animation: wb-gift-float 3.5s ease-in-out infinite;

  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
}

.wb-gift-box::before {
  content: "";
  position: absolute;
  inset: 10px;

  border: 1px dashed rgba(var(--tc-fff8fa-rgb, 255, 248, 250), 0.5);
  border-radius: 24px;
}

.wb-gift-btn:hover .wb-gift-box {
  animation-play-state: paused;

  transform: translateY(-10px) rotate(-2deg) scale(1.035);

  filter: brightness(1.05);
}

.wb-gift-btn:active .wb-gift-box {
  transform: translateY(2px) scale(0.93) rotate(2deg);
}

.wb-gift-shadow {
  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.16);

  filter: blur(8px);

  animation: wb-gift-shadow 3.5s ease-in-out infinite;
}

.wb-gift-sparkle {
  position: absolute;
  z-index: 6;

  color: var(--tc-a05a6e, #a05a6e);

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.25);

  pointer-events: none;

  animation: wb-sparkle 2.6s ease-in-out infinite;
}

.wb-gift-sparkle--1 { top: 58px; left: calc(50% - 108px); font-size: 15px; }
.wb-gift-sparkle--2 { top: 91px; right: calc(50% - 116px); font-size: 11px; animation-delay: 0.6s; }
.wb-gift-sparkle--3 { bottom: 105px; left: calc(50% - 125px); font-size: 10px; animation-delay: 1.2s; }
.wb-gift-sparkle--4 { right: calc(50% - 124px); bottom: 93px; font-size: 12px; animation-delay: 1.7s; }

.wb-gift-hint {
  position: absolute;
  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  transform: translateX(-50%);

  color: var(--tc-b06a80, #b06a80);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.wb-gift-hint::after {
  content: "";
  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, var(--tc-a05a6e, #a05a6e), transparent);
}

/* =========================================================
   DIALOG
========================================================= */

.wb-gift-dialog {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.wb-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle at center, rgba(var(--tc-fff9fb-rgb, 255, 249, 251), 0.4), rgba(var(--tc-5a3f4a-rgb, 90, 63, 74), 0.6));

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.wb-gift-dialog__card {
  position: relative;
  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.45);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(var(--tc-fffcfd-rgb, 255, 252, 253), 0.98), rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.97));

  box-shadow:
    0 30px 90px rgba(var(--tc-5a3f4a-rgb, 90, 63, 74), 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.35) transparent;
}

.wb-gift-dialog__card::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.22);
  border-radius: 21px;

  pointer-events: none;
}

.wb-gift-dialog__glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(var(--tc-f2ccd8-rgb, 242, 204, 216), 0.45), transparent 70%);

  filter: blur(5px);

  pointer-events: none;
}

.wb-gift-dialog__decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 8px;
}

.wb-gift-dialog__decoration span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.65));
}

.wb-gift-dialog__decoration span:last-child {
  transform: rotate(180deg);
}

.wb-gift-dialog__heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--tc-a5586c, #a5586c), var(--tc-b06a80, #b06a80));

  box-shadow: 0 7px 18px rgba(var(--tc-b06a80-rgb, 176, 106, 128), 0.25);

  animation: wb-heart-pulse 2.5s ease-in-out infinite;
}

.wb-gift-dialog__close {
  position: absolute;
  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-b06a80, #b06a80);

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.wb-gift-dialog__close:hover {
  transform: rotate(90deg);

  background: white;
}

.wb-gift-dialog__eyebrow {
  position: relative;

  margin-top: 6px;

  color: var(--tc-a5586c, #a5586c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.wb-gift-dialog__card h3 {
  position: relative;

  margin: 3px 0 2px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;

  color: var(--tc-8a4a5c, #8a4a5c);
}

.wb-gift-dialog__desc {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   ACCOUNTS
========================================================= */

.wb-account-grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  text-align: left;
}

.wb-account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.32);
  border-radius: 19px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(var(--tc-fef4f7-rgb, 254, 244, 247), 0.75));

  box-shadow: 0 8px 25px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.07);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wb-account-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 13px 30px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.11);
}

.wb-account-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
}

.wb-account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--tc-b06a80, #b06a80);

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, var(--tc-fae8ed, #fae8ed));
}

.wb-account-label {
  color: var(--tc-8a4a5c, #8a4a5c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.wb-account-bank {
  margin-top: 2px;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.wb-qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.wb-qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.wb-qr-inner {
  padding: 7px;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.35);

  background: white;

  box-shadow: 0 7px 20px rgba(var(--tc-5a3f4a-rgb, 90, 63, 74), 0.08);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wb-qr-button:hover .wb-qr-inner {
  transform: scale(1.025);

  box-shadow: 0 10px 25px rgba(var(--tc-5a3f4a-rgb, 90, 63, 74), 0.13);
}

.wb-qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

.wb-qr-corner {
  position: absolute;
  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: var(--tc-a05a6e, #a05a6e);
  border-style: solid;

  pointer-events: none;
}

.wb-qr-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.wb-qr-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.wb-qr-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.wb-qr-corner--br { right: 0; bottom: 0; border-width: 0 1px 1px 0; }

.wb-qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 7px;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.wb-account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.2);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.55);
}

.wb-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.wb-info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wb-info-label {
  color: var(--tc-a5586c, #a5586c);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.wb-info-value {
  color: var(--tc-8a4a5c, #8a4a5c);

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.wb-account-number {
  color: var(--tc-b06a80, #b06a80);

  letter-spacing: 0.06em;
}

.wb-info-divider {
  height: 1px;

  margin: 8px 0;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.28), transparent);
}

.wb-copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: var(--tc-b06a80, #b06a80);

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.3);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.wb-copy-button:hover {
  transform: scale(1.08);

  background: white;
}

.wb-account-desc {
  margin-top: 9px;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

.wb-gift-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 20px;

  color: var(--tc-a05a6e, #a05a6e);
}

.wb-gift-dialog__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.5));
}

.wb-gift-dialog__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.wb-qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.wb-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(var(--tc-4a333c-rgb, 74, 51, 60), 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.wb-qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.45);
  border-radius: 24px;

  background: linear-gradient(170deg, var(--tc-fffcfd, #fffcfd), var(--tc-fdf0f3, #fdf0f3));

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.wb-qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-b06a80, #b06a80);

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.82);

  cursor: pointer;
}

.wb-qr-preview__title {
  margin-bottom: 15px;

  color: var(--tc-8a4a5c, #8a4a5c);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.wb-qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.4);

  background: white;

  box-shadow: 0 10px 30px rgba(var(--tc-5a3f4a-rgb, 90, 63, 74), 0.12);
}

.wb-qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.wb-qr-preview__card p {
  margin: 14px 0;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 11px;
  font-style: italic;
}

.wb-qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--tc-a5586c, #a5586c), var(--tc-b06a80, #b06a80));

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-decoration: none;

  box-shadow: 0 7px 18px rgba(var(--tc-b06a80-rgb, 176, 106, 128), 0.22);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.wb-gift-dialog-enter-active,
.wb-gift-dialog-leave-active {
  transition: opacity 0.35s ease;
}

.wb-gift-dialog-enter-active .wb-gift-dialog__card,
.wb-gift-dialog-leave-active .wb-gift-dialog__card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.wb-gift-dialog-enter-from {
  opacity: 0;
}

.wb-gift-dialog-enter-from .wb-gift-dialog__card {
  opacity: 0;

  transform: translateY(35px) scale(0.88) rotateX(8deg);
}

.wb-gift-dialog-leave-to {
  opacity: 0;
}

.wb-gift-dialog-leave-to .wb-gift-dialog__card {
  opacity: 0;

  transform: translateY(20px) scale(0.94);
}

.wb-qr-preview-enter-active,
.wb-qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.wb-qr-preview-enter-active .wb-qr-preview__card,
.wb-qr-preview-leave-active .wb-qr-preview__card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.wb-qr-preview-enter-from {
  opacity: 0;
}

.wb-qr-preview-enter-from .wb-qr-preview__card {
  opacity: 0;

  transform: scale(0.85) translateY(20px);
}

.wb-qr-preview-leave-to {
  opacity: 0;
}

.wb-qr-preview-leave-to .wb-qr-preview__card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes wb-gift-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes wb-gift-shadow {
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

@keyframes wb-gift-glow {
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

@keyframes wb-sparkle {
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

@keyframes wb-heart-pulse {
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
  .wb-gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .wb-gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .wb-gifts__intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .wb-gifts__item,
  .wb-gift-btn {
    min-height: 295px;
  }

  .wb-gift-box {
    width: 130px;
    height: 130px;
  }

  .wb-gift-glow {
    width: 190px;
    height: 190px;
  }

  .wb-gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .wb-gift-dialog__card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .wb-gift-dialog__card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .wb-gift-dialog__card h3 {
    font-size: 26px;
  }

  .wb-gift-dialog__desc {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .wb-account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .wb-account-card {
    padding: 14px;
  }

  .wb-qr-code {
    width: 135px;
    height: 135px;
  }

  .wb-account-info {
    margin-top: 11px;
  }

  .wb-qr-preview {
    padding: 14px;
  }

  .wb-qr-preview__card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .wb-gift-box {
    width: 115px;
    height: 115px;
  }

  .wb-gifts__item,
  .wb-gift-btn {
    min-height: 280px;
  }

  .wb-qr-code {
    width: 125px;
    height: 125px;
  }

  .wb-account-label {
    font-size: 11px;
  }

  .wb-info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .wb-gift-box,
  .wb-gift-shadow,
  .wb-gift-glow,
  .wb-gift-sparkle,
  .wb-gift-dialog__heart {
    animation: none;
  }

  .wb-gift-dialog-enter-active,
  .wb-gift-dialog-leave-active,
  .wb-qr-preview-enter-active,
  .wb-qr-preview-leave-active {
    transition: none;
  }
}

:global(body.wb-gift-dialog-open) {
  overflow: hidden;
}
</style>
