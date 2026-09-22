<template>
  <section class="tr-gift">
    <h2 class="tr-gift__title">Hộp Quà Mừng</h2>

    <!-- =====================================================
         PHONG BÌ
    ====================================================== -->

    <button
      type="button"
      class="tr-gift__envelope"
      aria-label="Mở hộp mừng cưới"
      @click="openGift"
    >
      <span class="tr-gift__sparkle tr-gift__sparkle--1" aria-hidden="true">✦</span>
      <span class="tr-gift__sparkle tr-gift__sparkle--2" aria-hidden="true">✦</span>
      <span class="tr-gift__sparkle tr-gift__sparkle--3" aria-hidden="true">✦</span>
      <span class="tr-gift__sparkle tr-gift__sparkle--4" aria-hidden="true">✦</span>

      <span class="tr-gift__envelope-stage">
        <span class="tr-gift__shadow" aria-hidden="true"></span>

        <img
          :src="envelope"
          alt=""
          aria-hidden="true"
          class="tr-gift__envelope-back"
        />

        <img
          :src="envelope"
          alt=""
          aria-hidden="true"
          class="tr-gift__envelope-card"
        />
      </span>

      <span class="tr-gift__hint">Nhấn để mở</span>
    </button>

    <!-- =====================================================
         MODAL
    ====================================================== -->

    <Transition name="tr-gift-modal">
      <div
        v-if="isOpened"
        class="tr-gift__modal"
        role="dialog"
        aria-modal="true"
        aria-label="Hộp quà mừng"
        @click.self="closeGift"
      >
        <div class="tr-gift__box">
          <header class="tr-gift__box-head">
            <h2>Hộp Quà Mừng</h2>

            <button
              type="button"
              class="tr-gift__box-close"
              aria-label="Đóng"
              @click="closeGift"
            >
              ✕
            </button>
          </header>

          <div class="tr-gift__box-body">
            <div v-if="!gifts.length" class="tr-gift__empty">
              Chưa có thông tin mừng cưới.
            </div>

            <div v-else class="tr-gift__cards">
              <div
                v-for="(gift, index) in gifts"
                :key="gift.Id || index"
                class="tr-gift__card"
              >
                <h3 class="tr-gift__card-name">
                  {{ gift.Name || gift.AccountName || "Mừng cưới" }}
                </h3>

                <div v-if="gift.QrCode" class="tr-gift__qr">
                  <img :src="gift.QrCode" :alt="`QR ${gift.AccountName || ''}`" />
                </div>

                <div class="tr-gift__card-info">
                  <p v-if="gift.BankName">{{ gift.BankName }}</p>

                  <p v-if="gift.AccountNumber" class="tr-gift__account">
                    {{ gift.AccountNumber }}
                  </p>

                  <p v-if="gift.AccountName" class="tr-gift__holder">
                    {{ gift.AccountName }}
                  </p>
                </div>

                <button
                  v-if="gift.AccountNumber"
                  type="button"
                  class="tr-gift__copy"
                  @click="copy(gift.AccountNumber)"
                >
                  Sao chép số tài khoản
                </button>

                <p v-if="gift.Description" class="tr-gift__note">
                  {{ gift.Description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref } from "vue";

import { envelope } from "./traditionalRedAssets";

defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },

  wedding: {
    type: Object,
    default: () => ({}),
  },
});

const isOpened = ref(false);

function openGift() {
  isOpened.value = true;

  document.body.style.overflow = "hidden";
}

function closeGift() {
  isOpened.value = false;

  document.body.style.overflow = "";
}

async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);

    alert("Đã sao chép số tài khoản");
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.tr-gift {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 32px 16px 48px;
}

.tr-gift__title {
  margin: 0 0 16px;

  text-align: center;

  text-transform: uppercase;

  color: #ffe3b1;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;
}

/* =========================================================
   PHONG BÌ
========================================================= */

.tr-gift__envelope {
  position: relative;

  width: 250px;
  height: 357px;

  padding: 0;

  border: none;

  background: transparent;

  cursor: pointer;

  outline: none;
}

.tr-gift__envelope-stage {
  position: relative;

  display: flex;

  align-items: flex-end;
  justify-content: center;

  width: 100%;
  height: 100%;

  padding-bottom: 48px;
}

.tr-gift__shadow {
  position: absolute;

  left: 50%;
  bottom: -6px;

  width: 125px;
  height: 11px;

  margin-left: -63px;

  border-radius: 50%;

  background-color: rgba(0, 0, 0, 0.45);

  filter: blur(4px);
}

.tr-gift__envelope-back,
.tr-gift__envelope-card {
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;

  object-position: center bottom;

  pointer-events: none;
}

.tr-gift__envelope-back {
  transform-origin: 50% 100%;

  transform: translateX(20%) translateY(-10%) scale(-0.8, 0.8) rotate(-15deg);

  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18));

  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.tr-gift__envelope-card {
  transform: rotate(-10deg);

  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22));

  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.tr-gift__envelope:hover .tr-gift__envelope-back {
  transform: translateX(26%) translateY(-14%) scale(-0.84, 0.84) rotate(-18deg);
}

.tr-gift__envelope:hover .tr-gift__envelope-card {
  transform: rotate(-7deg) translateY(-6px);
}

.tr-gift__hint {
  position: absolute;

  bottom: 0;
  left: 50%;

  transform: translateX(-50%);

  white-space: nowrap;

  color: #ffe3b1;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 12px;

  font-weight: 500;
}

/* =========================================================
   LẤP LÁNH
========================================================= */

.tr-gift__sparkle {
  position: absolute;

  z-index: 20;

  color: #ffe3b1;

  pointer-events: none;

  animation: tr-gift-twinkle 2.4s ease-in-out infinite;
}

.tr-gift__sparkle--1 {
  top: 6%;
  left: 12%;

  font-size: 21px;
}

.tr-gift__sparkle--2 {
  top: 14%;
  right: 8%;

  font-size: 15px;

  animation-delay: 0.6s;
}

.tr-gift__sparkle--3 {
  top: 34%;
  left: 3%;

  font-size: 13px;

  animation-delay: 1.2s;
}

.tr-gift__sparkle--4 {
  top: 24%;
  right: 3%;

  font-size: 13px;

  animation-delay: 1.8s;
}

@keyframes tr-gift-twinkle {
  0%,
  100% {
    opacity: 0.25;

    transform: scale(0.85);
  }

  50% {
    opacity: 1;

    transform: scale(1.1);
  }
}

/* =========================================================
   MODAL
========================================================= */

.tr-gift__modal {
  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: flex-end;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.85);
}

.tr-gift__box {
  width: 100%;
  max-width: 576px;

  max-height: 90vh;

  overflow-y: auto;

  border-radius: 16px 16px 0 0;

  background-color: #f5f0e8;
}

.tr-gift__box-head {
  position: relative;

  padding: 24px 24px 16px;

  text-align: center;

  background-color: #680e0e;
}

.tr-gift__box-head h2 {
  margin: 0;

  text-transform: uppercase;

  color: #fff;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.tr-gift__box-close {
  position: absolute;

  top: 12px;
  right: 12px;

  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 50%;

  cursor: pointer;

  background: transparent;

  color: rgba(255, 255, 255, 0.8);

  font-size: 15px;
}

.tr-gift__box-close:hover {
  background-color: rgba(255, 255, 255, 0.2);

  color: #fff;
}

.tr-gift__box-body {
  padding: 16px;
}

.tr-gift__empty {
  padding: 24px 0;

  text-align: center;

  color: #680e0e;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 14px;
}

/* =========================================================
   THẺ MỪNG CƯỚI
========================================================= */

.tr-gift__cards {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 24px;
}

.tr-gift__card {
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  max-width: 220px;

  color: #680e0e;

  font-family: "Baskerville", "Times New Roman", serif;
}

.tr-gift__card-name {
  margin: 0 0 8px;

  min-height: 2rem;

  text-align: center;

  font-size: 12px;

  font-weight: 500;

  line-height: 1.4;
}

.tr-gift__qr {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 128px;
  height: 128px;

  padding: 8px;

  border: 2px solid rgba(104, 14, 14, 0.13);

  border-radius: 12px;

  background-color: #fff;

  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.tr-gift__qr img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.tr-gift__card-info {
  margin-top: 8px;

  text-align: center;
}

.tr-gift__card-info p {
  margin: 0;

  font-size: 11px;
}

.tr-gift__account {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.tr-gift__holder {
  font-weight: 600;
}

.tr-gift__copy {
  margin-top: 6px;

  padding: 4px 8px;

  border: none;

  border-radius: 999px;

  cursor: pointer;

  background-color: rgba(104, 14, 14, 0.08);

  color: #680e0e;

  font-family: inherit;

  font-size: 10px;

  font-weight: 500;
}

.tr-gift__note {
  margin: 8px 0 0;

  text-align: center;

  font-size: 11px;

  opacity: 0.75;
}

/* =========================================================
   TRANSITION
========================================================= */

.tr-gift-modal-enter-active,
.tr-gift-modal-leave-active {
  transition: opacity 0.25s ease;
}

.tr-gift-modal-enter-from,
.tr-gift-modal-leave-to {
  opacity: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 640px) {
  .tr-gift__modal {
    align-items: center;

    padding: 24px;
  }

  .tr-gift__box {
    border-radius: 16px;
  }

  .tr-gift__box-body {
    padding: 24px;
  }

  .tr-gift__cards {
    flex-direction: row;

    flex-wrap: wrap;

    align-items: flex-start;

    justify-content: center;
  }

  .tr-gift__card {
    flex: 1;

    max-width: none;
  }

  .tr-gift__qr {
    width: 160px;
    height: 160px;
  }
}

@media (min-width: 768px) {
  .tr-gift {
    padding: 40px 32px 64px;
  }

  .tr-gift__title {
    font-size: 24px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .tr-gift__sparkle {
    animation: none;

    opacity: 0.6;
  }

  .tr-gift__envelope-back,
  .tr-gift__envelope-card,
  .tr-gift-modal-enter-active,
  .tr-gift-modal-leave-active {
    transition: none;
  }
}
</style>
