<template>
  <section class="shc-gifts">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gifts', 'Eyebrow')" class="shc-top-custom-head">
      <p v-if="sectionOverride(sections, 'gifts', 'Eyebrow')" class="shc-top-custom-head__eyebrow">{{ sectionOverride(sections, "gifts", "Eyebrow") }}</p>
    </header>

    <h2 class="shc-gifts__title">{{ sectionText(sections, "gifts", "Heading", $t("Hộp Quà Mừng")) }}</h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gifts', 'Intro')" class="shc-sub-custom-head">
      <p v-if="sectionOverride(sections, 'gifts', 'Intro')" class="shc-sub-custom-head__intro">{{ sectionOverride(sections, "gifts", "Intro") }}</p>
    </header>


    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shc-gifts__inner">
      <button
        type="button"
        class="shc-gift-btn"
        :aria-label="$t('Mở hộp mừng cưới')"
        @click="openGift"
      >
        <span class="shc-gift-sparkle shc-gift-sparkle--1" aria-hidden="true">✦</span>
        <span class="shc-gift-sparkle shc-gift-sparkle--2" aria-hidden="true">✦</span>
        <span class="shc-gift-sparkle shc-gift-sparkle--3" aria-hidden="true">✦</span>
        <span class="shc-gift-sparkle shc-gift-sparkle--4" aria-hidden="true">✦</span>

        <span class="shc-gift-stage">
          <span class="shc-gift-shadow" aria-hidden="true"></span>

          <img
            class="shc-gift-envelope shc-gift-envelope--back"
            :src="envelope"
            alt=""
            draggable="false"
          />

          <img
            class="shc-gift-envelope shc-gift-envelope--front"
            :src="envelope"
            alt=""
            draggable="false"
          />
        </span>

        <span class="shc-gift-hint">{{ $t("Nhấn để mở") }}</span>
      </button>
    </div>

    

    <!-- =====================================================
         HỘP MỪNG CƯỚI
    ====================================================== -->

    <Teleport to="body">
      <Transition name="shc-gift-dialog">
        <div v-if="showGiftDialog" class="shc-gift-dialog" @click.self="closeGift">
          <div class="shc-gift-dialog__backdrop" @click="closeGift"></div>

          <div
            class="shc-gift-dialog__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shc-gift-dialog-title"
          >
            <button
              type="button"
              class="shc-gift-dialog__close"
              :aria-label="$t('Đóng hộp mừng cưới')"
              @click="closeGift"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="shc-gift-dialog__header">
              <h3 id="shc-gift-dialog-title">{{ $t("Hộp Quà Mừng") }}</h3>
            </div>

            <div class="shc-gift-dialog__body">
              <p class="shc-gift-dialog__desc">
                {{ $t("Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có thể chuyển khoản qua các tài khoản bên dưới.") }}
              </p>

              <div v-if="gifts.length" class="shc-account-grid">
                <article
                  v-for="(item, index) in gifts"
                  :key="item.Id || index"
                  class="shc-account-card"
                >
                  <div class="shc-account-heading">
                    <div class="shc-account-icon">
                      <v-icon size="17">mdi-bank-outline</v-icon>
                    </div>

                    <div>
                      <div class="shc-account-label">
                        {{ item.Name || item.BankName || `TÀI KHOẢN ${index + 1}` }}
                      </div>

                      <div v-if="item.BankName" class="shc-account-bank">
                        {{ item.BankName }}
                      </div>
                    </div>
                  </div>

                  <button
                    v-if="item.QrCode"
                    type="button"
                    class="shc-qr-button"
                    :aria-label="$t('Xem QR lớn')"
                    @click="openQr(item)"
                  >
                    <div class="shc-qr-frame">
                      <img
                        :src="item.QrCode"
                        :alt="item.Name || $t('QR mừng cưới')"
                        class="shc-qr-code"
                      />
                    </div>

                    <div class="shc-qr-hint">
                      <v-icon size="12">mdi-magnify-plus-outline</v-icon>

                      {{ $t("CHẠM VÀO QR ĐỂ XEM LỚN") }}
                    </div>
                  </button>

                  <div class="shc-account-info">
                    <div class="shc-info-row">
                      <span class="shc-info-label">{{ $t("CHỦ TÀI KHOẢN") }}</span>

                      <span class="shc-info-value">
                        {{ item.AccountName || item.Owner || $t("Chưa cập nhật") }}
                      </span>
                    </div>

                    <div class="shc-info-divider"></div>

                    <div class="shc-info-row">
                      <span class="shc-info-label">{{ $t("SỐ TÀI KHOẢN") }}</span>

                      <span class="shc-info-value shc-account-number">
                        {{ item.AccountNumber || item.Number || $t("Chưa cập nhật") }}
                      </span>

                      <button
                        type="button"
                        class="shc-copy-button"
                        :title="$t('Sao chép số tài khoản')"
                        :aria-label="$t('Sao chép số tài khoản')"
                        @click="copyAccount(item)"
                      >
                        <v-icon size="14">mdi-content-copy</v-icon>
                      </button>
                    </div>
                  </div>

                  <div v-if="item.Description" class="shc-account-desc">
                    {{ item.Description }}
                  </div>
                </article>
              </div>

              <div v-else class="shc-account-desc">
                {{ $t("Thông tin chuyển khoản đang được cập nhật.") }}
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- QR PREVIEW -->

      <Transition name="shc-qr-preview">
        <div v-if="previewQr" class="shc-qr-preview" @click.self="closeQr">
          <div class="shc-qr-preview__backdrop" @click="closeQr"></div>

          <div class="shc-qr-preview__card">
            <button
              type="button"
              class="shc-qr-preview__close"
              :aria-label="$t('Đóng QR')"
              @click="closeQr"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="shc-qr-preview__title">
              {{ previewQr.Name || $t("QR MỪNG CƯỚI") }}
            </div>

            <div class="shc-qr-preview__image">
              <img :src="previewQr.QrCode" :alt="previewQr.Name || $t('QR mừng cưới')" />
            </div>

            <p>{{ $t("Nhấn giữ vào ảnh để lưu QR về điện thoại") }}</p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="shc-qr-preview__save"
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
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, onBeforeUnmount, ref } from "vue";

import envelope from "@/assets/longphung/envelope.webp";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  gifts: { type: Array, default: () => [] },
  wishes: { type: Array, default: () => [] },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);



function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("shc-gift-dialog-open");
}

function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("shc-gift-dialog-open");
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

  document.body.classList.remove("shc-gift-dialog-open");
});
</script>

<style scoped>
.shc-gifts {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);
  --shc-frame-red: var(--secondary, #990000);

  position: relative;

  overflow: hidden;

  margin-top: 23px;

  color: var(--shc-cream, #ffe8a4);

  background-color: var(--shc-red, #920002);

  font-family: "Times New Roman", Times, serif;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.shc-gifts__title {
  margin: 0;

  padding: 12px 16px;

  color: var(--shc-cream, #ffe8a4);

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-gifts__inner {
  display: flex;
  justify-content: center;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 28px 8px 36px;
}

/* =========================================================
   PHONG BÌ
========================================================= */

.shc-gift-btn {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 250px;
  height: 357px;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;
}

.shc-gift-stage {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 190px;
  height: 275px;

  padding-bottom: 48px;
}

.shc-gift-shadow {
  position: absolute;

  left: 50%;
  bottom: -6px;

  width: 125px;
  height: 11px;

  margin-left: -63px;

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.45);

  filter: blur(4px);
}

.shc-gift-envelope {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;
  object-position: center bottom;

  transform-origin: 50% 100%;

  pointer-events: none;

  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.shc-gift-envelope--back {
  z-index: 1;

  transform: translateX(20%) translateY(-10%) scale(-0.8, 0.8) rotate(-15deg);

  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18));
}

.shc-gift-envelope--front {
  z-index: 2;

  transform: rotate(-10deg);

  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22));
}

.shc-gift-btn:hover .shc-gift-envelope--back {
  transform: translateX(26%) translateY(-14%) scale(-0.84, 0.84) rotate(-18deg);
}

.shc-gift-btn:hover .shc-gift-envelope--front {
  transform: rotate(-7deg) translateY(-4px);
}

.shc-gift-hint {
  position: absolute;

  left: 50%;
  bottom: 0;

  transform: translateX(-50%);

  color: var(--shc-cream, #ffe8a4);

  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;
}

/* =========================================================
   TIA SÁNG
========================================================= */

.shc-gift-sparkle {
  position: absolute;
  z-index: 20;

  color: var(--shc-cream, #ffe8a4);

  pointer-events: none;

  animation: shc-sparkle 2.4s ease-in-out infinite;
}

.shc-gift-sparkle--1 {
  top: 6%;
  left: 12%;

  font-size: 21px;
}

.shc-gift-sparkle--2 {
  top: 14%;
  right: 8%;

  font-size: 15px;

  animation-delay: 0.4s;
}

.shc-gift-sparkle--3 {
  top: 34%;
  left: 3%;

  font-size: 13px;

  animation-delay: 0.8s;
}

.shc-gift-sparkle--4 {
  top: 24%;
  right: 3%;

  font-size: 13px;

  animation-delay: 1.2s;
}

@keyframes shc-sparkle {
  0%,
  100% {
    opacity: 0.35;

    transform: scale(0.85);
  }

  50% {
    opacity: 1;

    transform: scale(1.15);
  }
}

/* =========================================================
   DIALOG
========================================================= */

.shc-gift-dialog {
  position: fixed;
  z-index: 3000;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.shc-gift-dialog__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(40, 0, 0, 0.6);

  backdrop-filter: blur(3px);
}

.shc-gift-dialog__card {
  position: relative;

  width: min(100%, 560px);
  max-height: 90vh;

  border-radius: 12px;

  background: #fffaf0;

  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.3);

  overflow-y: auto;
}

.shc-gift-dialog__close {
  position: absolute;
  z-index: 3;

  right: 12px;
  top: 12px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: rgba(255, 255, 255, 0.8);

  background: transparent;

  cursor: pointer;
}

.shc-gift-dialog__close:hover {
  color: #ffffff;

  background: rgba(255, 255, 255, 0.2);
}

.shc-gift-dialog__header {
  padding: 22px 24px 18px;

  background: var(--secondary, #990000);

  text-align: center;
}

.shc-gift-dialog__header h3 {
  margin: 0;

  color: #ffe8a4;

  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  text-transform: uppercase;
}

.shc-gift-dialog__body {
  padding: 18px 20px 22px;
}

.shc-gift-dialog__desc {
  margin: 0 0 16px;

  color: #001232;

  font-size: 13px;

  line-height: 1.6;

  text-align: center;
}

/* =========================================================
   TÀI KHOẢN
========================================================= */

.shc-account-grid {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

.shc-account-card {
  padding: 16px;

  border: 1px solid color-mix(in srgb, var(--secondary, #990000) 18%, transparent);
  border-radius: 10px;

  background: #ffffff;
}

.shc-account-heading {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-bottom: 12px;
}

.shc-account-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  border-radius: 50%;

  color: var(--secondary, #990000);

  background: color-mix(in srgb, var(--secondary, #990000) 10%, transparent);
}

.shc-account-label {
  color: var(--secondary, #990000);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.06em;

  text-transform: uppercase;
}

.shc-account-bank {
  color: rgba(0, 18, 50, 0.75);

  font-size: 12px;
}

.shc-qr-button {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  width: 100%;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;
}

.shc-qr-frame {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 150px;
  height: 150px;

  padding: 8px;

  border: 2px solid color-mix(in srgb, var(--secondary, #990000) 13%, transparent);
  border-radius: 12px;

  background: #ffffff;

  box-shadow: 0 8px 20px rgba(146, 0, 2, 0.1);
}

.shc-qr-code {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.shc-qr-hint {
  display: flex;
  align-items: center;

  gap: 4px;

  color: rgba(0, 18, 50, 0.7);

  font-size: 10px;

  letter-spacing: 0.08em;
}

.shc-account-info {
  margin-top: 14px;
}

.shc-info-row {
  display: flex;
  align-items: center;

  gap: 8px;
}

.shc-info-label {
  display: block;

  color: rgba(0, 18, 50, 0.7);

  font-size: 10px;

  letter-spacing: 0.14em;
}

.shc-info-value {
  display: block;

  margin-top: 2px;

  color: #001232;

  font-size: 14px;
  font-weight: 600;
}

.shc-account-number {
  font-family: "Courier New", ui-monospace, monospace;

  letter-spacing: 0.06em;
}

.shc-info-divider {
  height: 1px;

  margin: 10px 0;

  background: color-mix(in srgb, var(--secondary, #990000) 12%, transparent);
}

.shc-copy-button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  margin-left: auto;

  border: 0;
  border-radius: 50%;

  color: var(--secondary, #990000);

  background: color-mix(in srgb, var(--secondary, #990000) 10%, transparent);

  cursor: pointer;

  transition: background 0.2s ease;
}

.shc-copy-button:hover {
  background: color-mix(in srgb, var(--secondary, #990000) 20%, transparent);
}

.shc-account-desc {
  margin-top: 12px;

  color: rgba(0, 18, 50, 0.8);

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   QR PREVIEW
========================================================= */

.shc-qr-preview {
  position: fixed;
  z-index: 3100;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.shc-qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(0, 0, 0, 0.85);
}

.shc-qr-preview__card {
  position: relative;

  width: min(100%, 360px);

  padding: 22px 20px 20px;

  border-radius: 12px;

  background: #fffaf0;

  text-align: center;
}

.shc-qr-preview__close {
  position: absolute;

  right: 10px;
  top: 8px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: var(--secondary, #990000);

  background: transparent;

  cursor: pointer;
}

.shc-qr-preview__title {
  margin-bottom: 14px;

  color: var(--secondary, #990000);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}

.shc-qr-preview__image {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;

  border-radius: 10px;

  background: #ffffff;
}

.shc-qr-preview__image img {
  width: 100%;
  max-width: 260px;

  height: auto;

  object-fit: contain;
}

.shc-qr-preview__card p {
  margin: 12px 0 0;

  color: rgba(0, 18, 50, 0.75);

  font-size: 12px;
}

.shc-qr-preview__save {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  margin-top: 14px;
  padding: 10px 18px;

  border-radius: 999px;

  color: var(--accent, #ffe8a4);

  background: var(--secondary, #990000);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.08em;

  text-decoration: none;
}

/* =========================================================
   TRANSITION
========================================================= */

.shc-gift-dialog-enter-active,
.shc-gift-dialog-leave-active,
.shc-qr-preview-enter-active,
.shc-qr-preview-leave-active {
  transition: opacity 0.3s ease;
}

.shc-gift-dialog-enter-from,
.shc-gift-dialog-leave-to,
.shc-qr-preview-enter-from,
.shc-qr-preview-leave-to {
  opacity: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-gifts__title {
    padding: 16px;

    font-size: 24px;
  }

  .shc-gifts__inner {
    width: min(100%, 600px);

    padding: 36px 5px 44px;
  }


  .shc-gift-dialog__header h3 {
    font-size: 24px;
  }

  .shc-gift-dialog__desc {
    font-size: 15px;
  }

  .shc-account-grid {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .shc-account-card {
    flex: 1;

    min-width: 240px;
  }

  .shc-qr-frame {
    width: 170px;
    height: 170px;
  }
}


/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
