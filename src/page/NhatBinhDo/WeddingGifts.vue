<template>
  <section class="cfr-gift">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="cfr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         PHONG BÌ
    ====================================================== -->

    <button
      type="button"
      class="cfr-gift__envelope"
      aria-label="Mở hộp mừng cưới"
      @click="openGift"
    >
      <span class="cfr-gift__sparkle cfr-gift__sparkle--1" aria-hidden="true">✦</span>
      <span class="cfr-gift__sparkle cfr-gift__sparkle--2" aria-hidden="true">✦</span>
      <span class="cfr-gift__sparkle cfr-gift__sparkle--3" aria-hidden="true">✦</span>
      <span class="cfr-gift__sparkle cfr-gift__sparkle--4" aria-hidden="true">✦</span>

      <span class="cfr-gift__stage">
        <span class="cfr-gift__shadow" aria-hidden="true"></span>

        <img
          :src="envelopeNhatBinhRed"
          alt=""
          aria-hidden="true"
          class="cfr-gift__envelope-back"
        />

        <img
          :src="envelopeNhatBinhRed"
          alt=""
          aria-hidden="true"
          class="cfr-gift__envelope-card"
        />
      </span>

      <span class="cfr-gift__hint">Nhấn để mở</span>
    </button>


    <!-- =====================================================
         MODAL
    ====================================================== -->

    <Teleport to="body">

      <Transition name="cfr-gift-fade">

        <div
          v-if="dialog"
          class="cfr-gift__modal"
          role="dialog"
          aria-modal="true"
          aria-label="Hộp quà mừng"
          @click.self="closeGift"
        >
          <div class="cfr-gift__box">

            <header class="cfr-gift__box-head">
              <h2>{{ heading }}</h2>

              <button
                type="button"
                class="cfr-gift__box-close"
                aria-label="Đóng"
                @click="closeGift"
              >
                ✕
              </button>
            </header>

            <div class="cfr-gift__box-body">

              <div v-if="!normalizedGifts.length" class="cfr-gift__empty">
                Chưa có thông tin mừng cưới.
              </div>

              <div v-else class="cfr-gift__cards">

                <div
                  v-for="gift in normalizedGifts"
                  :key="gift.id"
                  class="cfr-gift__card"
                >
                  <h3 class="cfr-gift__card-name">
                    {{ gift.title }}
                  </h3>

                  <div v-if="gift.qr" class="cfr-gift__qr">
                    <img :src="gift.qr" :alt="`QR ${gift.title}`" />
                  </div>

                  <div class="cfr-gift__card-info">
                    <p v-if="gift.bankName">{{ gift.bankName }}</p>

                    <p v-if="gift.accountNumber" class="cfr-gift__account">
                      {{ gift.accountNumber }}
                    </p>

                    <p v-if="gift.accountName" class="cfr-gift__holder">
                      {{ gift.accountName }}
                    </p>
                  </div>

                  <div class="cfr-gift__actions">
                    <button
                      v-if="gift.qr"
                      type="button"
                      class="cfr-gift__action"
                      @click="saveQr(gift)"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        ></path>
                      </svg>

                      Lưu QR
                    </button>

                    <button
                      v-if="gift.accountNumber"
                      type="button"
                      class="cfr-gift__action"
                      @click="copyAccount(gift.accountNumber)"
                    >
                      Sao chép số tài khoản
                    </button>
                  </div>

                  <p v-if="gift.description" class="cfr-gift__note">
                    {{ gift.description }}
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

      </Transition>

    </Teleport>

  </section>
</template>


<script setup>
import { computed, onUnmounted, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";

import { envelopeNhatBinhRed } from "./nhatBinhDoAssets";


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "gifts", "Heading")
);


/* =====================================================
   CHUẨN HÓA
===================================================== */

const normalizedGifts = computed(() =>
  (props.gifts || [])
    .map((gift, index) => {
      const item = gift || {};

      return {
        id: item.Id || index,

        title:
          item.Title ||
          item.Name ||
          (index === 0 ? "MỪNG CƯỚI NHÀ TRAI" : "MỪNG CƯỚI NHÀ GÁI"),

        bankName: item.BankName || item.bank_name || "",

        accountName: item.AccountName || item.account_name || "",

        accountNumber: item.AccountNumber || item.account_number || "",

        qr: item.QrCode || item.qr || item.qr_url || "",

        description: item.Description || "",
      };
    })
    .slice(0, 2)
);


/* =====================================================
   MODAL
===================================================== */

const dialog = ref(false);


function openGift() {
  dialog.value = true;

  document.body.style.overflow = "hidden";
}


function closeGift() {
  dialog.value = false;

  document.body.style.overflow = "";
}


onUnmounted(() => {
  document.body.style.overflow = "";
});


/* =====================================================
   SAO CHÉP SỐ TÀI KHOẢN
===================================================== */

async function copyAccount(number) {
  if (!number) return;

  try {
    await navigator.clipboard.writeText(String(number));

    alert("Đã sao chép số tài khoản");
  } catch (error) {
    console.warn("[NhatBinhDo] Không thể sao chép:", error);
  }
}


/* =====================================================
   LƯU QR
===================================================== */

/*
 * Ảnh QR có thể nằm khác origin (CDN) nên thẻ <a download> không
 * tải trực tiếp được — phải fetch về blob rồi mới lưu.
 */
async function saveQr(gift) {
  const url = gift?.qr;

  if (!url) return;

  const fileName = `qr-${gift.accountName || gift.title || "mung-cuoi"}.png`;

  try {
    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();

    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error("[NhatBinhDo] Không tải được QR:", error);

    window.open(url, "_blank", "noopener,noreferrer");
  }
}
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.cfr-gift {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 16px;

  width: 100%;
  max-width: 248px;

  margin: 0 auto;

  color: var(--cfr-red-deep);
}


/* =====================================================
   PHONG BÌ
===================================================== */

.cfr-gift__envelope {
  position: relative;

  width: 250px;
  height: 357px;

  padding: 0;

  border: none;

  background: transparent;

  cursor: pointer;

  outline: none;
}

.cfr-gift__stage {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 100%;
  height: 100%;

  padding-bottom: 48px;
}

.cfr-gift__shadow {
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

.cfr-gift__envelope-back,
.cfr-gift__envelope-card {
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;

  object-position: center bottom;

  pointer-events: none;
}

.cfr-gift__envelope-back {
  transform-origin: 50% 100%;

  transform: translateX(20%) translateY(-10%) scale(-0.8, 0.8) rotate(-15deg);

  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18));

  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.cfr-gift__envelope-card {
  transform: rotate(-10deg);

  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22));

  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.cfr-gift__envelope:hover .cfr-gift__envelope-back {
  transform: translateX(26%) translateY(-14%) scale(-0.84, 0.84) rotate(-18deg);
}

.cfr-gift__envelope:hover .cfr-gift__envelope-card {
  transform: rotate(-7deg) translateY(-6px);
}

.cfr-gift__hint {
  position: absolute;

  bottom: 0;
  left: 50%;

  transform: translateX(-50%);

  white-space: nowrap;

  color: var(--cfr-red-deep);

  font-size: 12px;

  font-weight: 500;
}


/* =====================================================
   LẤP LÁNH
===================================================== */

.cfr-gift__sparkle {
  position: absolute;

  z-index: 20;

  color: var(--cfr-red);

  pointer-events: none;

  animation: cfr-gift-twinkle 2.4s ease-in-out infinite;
}

.cfr-gift__sparkle--1 {
  top: 6%;
  left: 12%;

  font-size: 21px;
}

.cfr-gift__sparkle--2 {
  top: 14%;
  right: 8%;

  font-size: 15px;

  animation-delay: 0.6s;
}

.cfr-gift__sparkle--3 {
  top: 34%;
  left: 3%;

  font-size: 13px;

  animation-delay: 1.2s;
}

.cfr-gift__sparkle--4 {
  top: 24%;
  right: 3%;

  font-size: 13px;

  animation-delay: 1.8s;
}

@keyframes cfr-gift-twinkle {
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


/* =====================================================
   MODAL
===================================================== */

.cfr-gift__modal {
  position: fixed;

  inset: 0;

  z-index: 2000;

  display: flex;

  align-items: flex-end;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.6);
}

.cfr-gift__box {
  width: 100%;
  max-width: 576px;

  max-height: 90vh;

  overflow-y: auto;

  border-radius: 16px 16px 0 0;

  background-color: var(--cfr-cream);

  color: var(--cfr-red-deep);
}

.cfr-gift__box-head {
  position: relative;

  padding: 24px 24px 16px;

  text-align: center;

  background-color: var(--cfr-red);
}

.cfr-gift__box-head h2 {
  margin: 0;

  color: var(--white, #ffffff);

  font-family: var(--cfr-font-heading);
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.cfr-gift__box-close {
  position: absolute;

  top: 12px;
  right: 12px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background-color: rgba(255, 255, 255, 0.2);

  color: var(--white, #ffffff);

  font-size: 15px;

  cursor: pointer;
}

.cfr-gift__box-body {
  padding: 16px;
}

.cfr-gift__empty {
  padding: 24px 0;

  font-size: 14px;

  text-align: center;
}


/* =====================================================
   THẺ MỪNG CƯỚI
===================================================== */

.cfr-gift__cards {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;
}

.cfr-gift__card {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 180px;
}

.cfr-gift__card-name {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  min-height: 2rem;

  margin: 0 0 8px;

  color: var(--cfr-red);

  font-family: var(--cfr-font-heading);
  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.04em;
  line-height: 1.4;

  text-align: center;

  text-transform: uppercase;
}

.cfr-gift__qr {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 128px;
  height: 128px;

  padding: 8px;

  border: 2px solid var(--cfr-hairline-soft);
  border-radius: 12px;

  background-color: var(--white, #ffffff);

  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.cfr-gift__qr img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.cfr-gift__card-info {
  margin-top: 8px;

  text-align: center;
}

.cfr-gift__card-info p {
  margin: 0;

  font-size: 10px;
}

.cfr-gift__account {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.cfr-gift__holder {
  font-weight: 600;
}

.cfr-gift__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  gap: 6px;

  margin-top: 6px;
}

.cfr-gift__action {
  display: inline-flex;
  align-items: center;

  gap: 4px;

  padding: 4px 8px;

  border: none;
  border-radius: 999px;

  background-color: color-mix(in srgb, var(--cfr-red) 8%, transparent);

  color: var(--cfr-red);

  font-size: 10px;
  font-weight: 500;

  cursor: pointer;
}

.cfr-gift__action svg {
  width: 12px;
  height: 12px;

  flex-shrink: 0;
}

.cfr-gift__note {
  margin: 8px 0 0;

  font-size: 11px;

  text-align: center;

  opacity: 0.75;
}


/* =====================================================
   TRANSITION
===================================================== */

.cfr-gift-fade-enter-active,
.cfr-gift-fade-leave-active {
  transition: opacity 0.25s ease;
}

.cfr-gift-fade-enter-from,
.cfr-gift-fade-leave-to {
  opacity: 0;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 640px) {
  .cfr-gift__modal {
    align-items: center;

    padding: 24px;
  }

  .cfr-gift__box {
    border-radius: 16px;
  }

  .cfr-gift__box-body {
    padding: 24px;
  }

  .cfr-gift__cards {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
  }

  .cfr-gift__card {
    flex: 1;

    max-width: none;
  }

  .cfr-gift__qr {
    width: 160px;
    height: 160px;
  }
}


@media (min-width: 768px) {
  .cfr-gift {
    max-width: none;

    gap: 24px;
  }
}


/* =====================================================
   GIẢM CHUYỂN ĐỘNG
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .cfr-gift__sparkle {
    animation: none;

    opacity: 0.6;
  }

  .cfr-gift__envelope-back,
  .cfr-gift__envelope-card,
  .cfr-gift-fade-enter-active,
  .cfr-gift-fade-leave-active {
    transition: none;
  }
}
</style>
