<template>
  <section class="mw-gifts">
    <h2 class="mw-title">Hộp Quà Mừng</h2>

    <!-- =====================================================
         MỘT PHONG BÌ — 2 phong bì chồng nhau (sau + trước),
         bấm vào mở hộp thoại liệt kê tất cả tài khoản.
    ====================================================== -->
    <button
      v-if="normalizedGifts.length"
      type="button"
      class="mw-gift"
      aria-label="Mở hộp mừng cưới"
      @click="openGift(0)"
    >
      <span class="mw-gift__sparkle mw-gift__sparkle--1" aria-hidden="true">✦</span>
      <span class="mw-gift__sparkle mw-gift__sparkle--2" aria-hidden="true">✦</span>
      <span class="mw-gift__sparkle mw-gift__sparkle--3" aria-hidden="true">✦</span>
      <span class="mw-gift__sparkle mw-gift__sparkle--4" aria-hidden="true">✦</span>

      <span class="mw-gift__stage">
        <span class="mw-gift__shadow" aria-hidden="true"></span>

        <span class="mw-gift__box">
          <img :src="envelope" alt="" class="mw-gift__back" />

          <img :src="envelope" alt="" class="mw-gift__card" />
        </span>
      </span>

      <span class="mw-gift__hint">Nhấn để mở</span>
    </button>

    <p v-else class="mw-gift-empty">Chưa có thông tin mừng cưới</p>

    <!-- =====================================================
         GIFT DIALOG
    ====================================================== -->

    <Teleport to="body">
      <Transition name="mw-gift-dialog">
        <div v-if="dialog" class="mw-gift-modal" @click.self="closeGift">
          <div class="mw-gift-modal__card">
            <div class="mw-gift-modal__head">
              <h3>Hộp Quà Mừng</h3>

              <button
                type="button"
                class="mw-gift-modal__close"
                aria-label="Đóng"
                @click="closeGift"
              >
                ×
              </button>
            </div>

            <div class="mw-gift-modal__body">
              <div
                v-for="(gift, index) in normalizedGifts"
                :key="gift.Id || index"
                class="mw-account"
              >
                <h4 class="mw-account__title">{{ gift.title }}</h4>

                <button
                  v-if="gift.qr"
                  type="button"
                  class="mw-account__qr"
                  @click="openQr(gift)"
                >
                  <img :src="gift.qr" :alt="`QR ${gift.title}`" />
                </button>

                <div class="mw-account__info">
                  <p v-if="gift.bankName">{{ gift.bankName }}</p>

                  <p v-if="gift.accountNumber" class="mw-account__number">
                    {{ gift.accountNumber }}
                  </p>

                  <p v-if="gift.accountName" class="mw-account__name">
                    {{ gift.accountName }}
                  </p>
                </div>

                <button
                  v-if="gift.accountNumber"
                  type="button"
                  class="mw-account__save"
                  @click="copyAccount(gift)"
                >
                  Sao chép số tài khoản
                </button>
              </div>
            </div>

            <p v-if="copyState" class="mw-gift-modal__toast">{{ copyState }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         QR PREVIEW
    ====================================================== -->

    <Teleport to="body">
      <Transition name="mw-gift-dialog">
        <div v-if="qrDialog" class="mw-gift-modal" @click.self="closeQr">
          <div class="mw-qr-card">
            <img v-if="selectedQr" :src="selectedQr.qr" :alt="selectedQr.title" />

            <a
              v-if="selectedQr"
              :href="selectedQr.qr"
              download
              class="mw-pill mw-qr-card__save"
            >
              Lưu ảnh QR
            </a>

            <button type="button" class="mw-qr-card__close" @click="closeQr">
              Đóng
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";

import envelope from "@/assets/romatic-pink/mini/spring_garden_blue.webp";

const props = defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },
});

/* =========================================================
   NORMALIZE
========================================================= */

const normalizedGifts = computed(() =>
  (props.gifts || [])
    .map((gift, index) => {
      const item = gift || {};

      return {
        ...item,

        Id: item.Id || index,

        title:
          item.Title ||
          item.Name ||
          (index === 0 ? "Mừng cưới nhà trai" : "Mừng cưới nhà gái"),

        bankName: item.BankName || item.bank_name || "",

        accountName: item.AccountName || item.account_name || "",

        accountNumber: item.AccountNumber || item.account_number || "",

        qr: item.qr || item.QrCode || item.qr_url || "",
      };
    })
    .slice(0, 2)
);

/* =========================================================
   DIALOG
========================================================= */

const dialog = ref(false);

const qrDialog = ref(false);

const currentIndex = ref(0);

const selectedQr = computed(
  () => normalizedGifts.value[currentIndex.value] || null
);

function openGift(index) {
  currentIndex.value = index;

  dialog.value = true;

  document.body.classList.add("mw-gift-dialog-open");
}

function closeGift() {
  dialog.value = false;

  document.body.classList.remove("mw-gift-dialog-open");
}

function openQr(gift) {
  currentIndex.value = normalizedGifts.value.indexOf(gift);

  qrDialog.value = true;
}

function closeQr() {
  qrDialog.value = false;
}

/* =========================================================
   ESC
========================================================= */

function handleEscape(event) {
  if (event.key !== "Escape") {
    return;
  }

  if (qrDialog.value) {
    closeQr();

    return;
  }

  if (dialog.value) {
    closeGift();
  }
}

window.addEventListener("keydown", handleEscape);

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEscape);

  document.body.classList.remove("mw-gift-dialog-open");
});

/* =========================================================
   COPY
========================================================= */

const copyState = ref("");

let copyTimer = null;

async function copyAccount(gift) {
  const number = gift?.accountNumber;

  if (!number) {
    return;
  }

  try {
    await navigator.clipboard.writeText(String(number));

    copyState.value = "Đã sao chép số tài khoản ✓";
  } catch (error) {
    console.warn("Không thể sao chép số tài khoản", error);

    copyState.value = "Không thể sao chép, vui lòng chép thủ công";
  }

  window.clearTimeout(copyTimer);

  copyTimer = window.setTimeout(() => {
    copyState.value = "";
  }, 2200);
}
</script>

<style scoped>
.mw-gifts {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

/* =========================================================
   HỘP QUÀ
========================================================= */

.mw-gift {
  position: relative;

  width: 250px;
  height: 357px;

  padding: 0;

  border: none;

  background: none;

  cursor: pointer;
}

.mw-gift__stage {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 100%;
  height: 100%;

  padding-bottom: 48px;
}

.mw-gift__sparkle {
  position: absolute;
  z-index: 20;

  color: var(--mw-blue-soft);

  pointer-events: none;

  animation: mw-sparkle 3.2s ease-in-out infinite;
}

.mw-gift__sparkle--1 {
  top: 6%;
  left: 12%;

  font-size: 21px;
}

.mw-gift__sparkle--2 {
  top: 14%;
  right: 8%;

  font-size: 15px;

  animation-delay: -0.8s;
}

.mw-gift__sparkle--3 {
  top: 34%;
  left: 3%;

  font-size: 13px;

  animation-delay: -1.6s;
}

.mw-gift__sparkle--4 {
  top: 24%;
  right: 3%;

  font-size: 13px;

  animation-delay: -2.4s;
}

@keyframes mw-sparkle {
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

.mw-gift__shadow {
  position: absolute;
  bottom: -6px;
  left: 50%;

  width: 125px;
  height: 11px;

  margin-left: -63px;

  border-radius: 50%;

  background-color: rgba(0, 0, 0, 0.45);

  filter: blur(4px);
}

.mw-gift__box {
  position: relative;

  width: 190px;
  height: 275px;
}

.mw-gift__back,
.mw-gift__card {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;
  object-position: center bottom;

  pointer-events: none;

  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.mw-gift__back {
  z-index: 1;

  transform-origin: 50% 100%;
  transform: translateX(20%) translateY(-10%) scale(-0.8, 0.8) rotate(-15deg);

  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18));
}

.mw-gift__card {
  z-index: 2;

  transform: rotate(-10deg);

  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22));
}

.mw-gift:hover .mw-gift__back {
  transform: translateX(26%) translateY(-14%) scale(-0.86, 0.86) rotate(-18deg);
}

.mw-gift:hover .mw-gift__card {
  transform: rotate(-6deg) translateY(-6px);
}

.mw-gift__hint {
  position: absolute;
  bottom: 0;
  left: 50%;

  transform: translateX(-50%);

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;
}

.mw-gift-empty {
  margin: 24px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 14px;
}

/* =========================================================
   GIFT DIALOG
========================================================= */

.mw-gift-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background-color: rgba(0, 0, 0, 0.55);
}

.mw-gift-modal__card {
  width: min(100%, 560px);
  max-height: 90vh;

  overflow-y: auto;

  border-radius: 18px;

  background-color: var(--mw-paper);
}

.mw-gift-modal__head {
  position: relative;

  padding: 22px 24px 16px;

  background-color: var(--mw-blue);

  text-align: center;
}

.mw-gift-modal__head h3 {
  margin: 0;

  color: #ffffff;

  font-family: var(--mw-font-serif);
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mw-gift-modal__close {
  position: absolute;
  top: 12px;
  right: 14px;

  border: none;

  background: none;
  color: rgba(255, 255, 255, 0.8);

  font-size: 24px;
  line-height: 1;

  cursor: pointer;
}

.mw-gift-modal__body {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;

  padding: 24px;
}

.mw-account {
  display: flex;
  flex-direction: column;
  align-items: center;

  flex: 1 1 180px;
  max-width: 220px;
}

.mw-account__title {
  margin: 0 0 10px;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 12px;
  font-weight: 500;

  line-height: 1.5;
  text-align: center;
}

.mw-account__qr {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 128px;
  height: 128px;

  padding: 8px;

  border: 2px solid var(--mw-hairline-soft);
  border-radius: 12px;

  background-color: #ffffff;

  cursor: pointer;
}

.mw-account__qr img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.mw-account__info {
  margin-top: 10px;

  text-align: center;
}

.mw-account__info p {
  margin: 0;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 10px;
}

.mw-account__number {
  font-family: monospace !important;
}

.mw-account__name {
  font-weight: 600;
}

.mw-account__save {
  margin-top: 8px;
  padding: 5px 12px;

  border: none;
  border-radius: 999px;

  background-color: var(--mw-hairline-soft);
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 10px;
  font-weight: 500;

  cursor: pointer;
}

.mw-gift-modal__toast {
  margin: 0 0 20px;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 12px;

  text-align: center;
}

/* =========================================================
   QR PREVIEW
========================================================= */

.mw-qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  padding: 24px;

  border-radius: 18px;

  background-color: var(--mw-paper);
}

.mw-qr-card img {
  width: min(70vw, 320px);
  height: auto;
}

.mw-qr-card__close {
  border: none;

  background: none;
  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 13px;

  cursor: pointer;
}

/* =========================================================
   TRANSITION
========================================================= */

.mw-gift-dialog-enter-active,
.mw-gift-dialog-leave-active {
  transition: opacity 0.25s ease;
}

.mw-gift-dialog-enter-from,
.mw-gift-dialog-leave-to {
  opacity: 0;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-gift {
    width: 300px;
    height: 400px;
  }

  .mw-gift__box {
    width: 228px;
    height: 330px;
  }

  .mw-account__qr {
    width: 160px;
    height: 160px;
  }

  .mw-account__info p {
    font-size: 11px;
  }
}
</style>
