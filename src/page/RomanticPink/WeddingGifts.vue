<template>
  <section class="gifts">
    <!-- =========================
         HEADER
    ========================== -->
    <div class="gift-ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <div class="eyebrow">GỬI YÊU THƯƠNG</div>

    <h2>Hộp mừng cưới</h2>

    <p class="gift-intro">
      Những lời chúc và tình cảm của bạn<br />
      là món quà quý giá nhất dành cho chúng mình
    </p>

    <!-- =========================
         ONLY ONE GIFT BOX
    ========================== -->
    <div class="gift-list">
      <article class="gift-item">
        <button
          type="button"
          class="gift-box-button"
          aria-label="Mở hộp mừng cưới"
          @click="openGift"
        >
          <div class="gift-glow"></div>

          <div class="gift-box">
            <img
              :src="gift"
              alt="Hộp mừng cưới"
            />

            <span class="gift-sparkle sparkle-1">✦</span>
            <span class="gift-sparkle sparkle-2">✧</span>
            <span class="gift-sparkle sparkle-3">✦</span>
            <span class="gift-sparkle sparkle-4">✧</span>
          </div>

          <div class="gift-shadow"></div>

          <div class="gift-hint">
            <span>CHẠM ĐỂ MỞ</span>
            <v-icon size="14">mdi-heart-outline</v-icon>
          </div>
        </button>
      </article>
    </div>

    <!-- =========================
         BOTTOM ORNAMENT
    ========================== -->
    <div class="gift-bottom-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>

    <!-- =====================================================
         BANK INFORMATION DIALOG
    ====================================================== -->
    <Teleport to="body">
      <Transition name="gift-dialog">
        <div
          v-if="showGiftDialog"
          class="gift-dialog"
          @click.self="closeGift"
        >
          <div
            class="gift-dialog-backdrop"
            @click="closeGift"
          ></div>

          <div
            class="gift-dialog-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-dialog-title"
          >
            <div class="dialog-glow"></div>

            <!-- Top decoration -->
            <div class="dialog-decoration">
              <span></span>

              <div class="dialog-heart">
                <v-icon size="17">mdi-heart</v-icon>
              </div>

              <span></span>
            </div>

            <!-- Close -->
            <button
              type="button"
              class="dialog-close"
              aria-label="Đóng hộp mừng cưới"
              @click="closeGift"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <!-- Header -->
            <div class="dialog-eyebrow">
              MỘT CHÚT YÊU THƯƠNG
            </div>

            <h3 id="gift-dialog-title">
              Hộp mừng cưới
            </h3>

            <p class="dialog-description">
              Nếu bạn muốn gửi lời chúc và món quà nhỏ đến
              cô dâu chú rể, bạn có thể chuyển khoản qua
              các tài khoản bên dưới.
            </p>

            <!-- =================================================
                 BANK ACCOUNTS
            ================================================== -->
            <div
              v-if="gifts.length"
              class="account-grid"
            >
              <article
                v-for="(item, index) in gifts"
                :key="item.Id || index"
                class="account-card"
              >
                <!-- Account heading -->
                <div class="account-heading">
                  <div class="account-icon">
                    <v-icon size="17">
                      mdi-bank-outline
                    </v-icon>
                  </div>

                  <div>
                    <div class="account-label">
                      {{
                        item.Name ||
                        item.BankName ||
                        `TÀI KHOẢN ${index + 1}`
                      }}
                    </div>

                    <div
                      v-if="item.BankName"
                      class="account-bank"
                    >
                      {{ item.BankName }}
                    </div>
                  </div>
                </div>

                <!-- QR -->
                <button
                  v-if="item.QrCode"
                  type="button"
                  class="qr-button"
                  aria-label="Xem QR lớn"
                  @click="openQr(item)"
                >
                  <div class="qr-frame">
                    <div class="qr-corner qr-corner--tl"></div>
                    <div class="qr-corner qr-corner--tr"></div>
                    <div class="qr-corner qr-corner--bl"></div>
                    <div class="qr-corner qr-corner--br"></div>

                    <div class="qr-inner">
                      <img
                        :src="item.QrCode"
                        :alt="item.Name || 'QR mừng cưới'"
                        class="qr-code"
                      />
                    </div>
                  </div>

                  <div class="qr-hint">
                    <v-icon size="12">
                      mdi-magnify-plus-outline
                    </v-icon>

                    CHẠM VÀO QR ĐỂ XEM LỚN
                  </div>
                </button>

                <!-- Account information -->
                <div class="account-info">
                  <!-- Account owner -->
                  <div class="info-row">
                    <div class="info-left">
                      <span class="info-label">
                        CHỦ TÀI KHOẢN
                      </span>

                      <span class="info-value">
                        {{
                          item.AccountName ||
                          item.Owner ||
                          "Chưa cập nhật"
                        }}
                      </span>
                    </div>
                  </div>

                  <div class="info-divider"></div>

                  <!-- Account number -->
                  <div class="info-row">
                    <div class="info-left">
                      <span class="info-label">
                        SỐ TÀI KHOẢN
                      </span>

                      <span class="info-value account-number">
                        {{
                          item.AccountNumber ||
                          item.Number ||
                          "Chưa cập nhật"
                        }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="copy-button"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                      @click="copyAccount(item)"
                    >
                      <v-icon size="14">
                        mdi-content-copy
                      </v-icon>
                    </button>
                  </div>
                </div>

                <!-- Description -->
                <div
                  v-if="item.Description"
                  class="account-description"
                >
                  {{ item.Description }}
                </div>
              </article>
            </div>

            <!-- Empty state -->
            <div
              v-else
              class="account-description"
            >
              Thông tin chuyển khoản đang được cập nhật.
            </div>

            <!-- Footer -->
            <div class="dialog-footer">
              <span></span>

              <v-icon size="13">
                mdi-flower-outline
              </v-icon>

              <span></span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- =====================================================
           QR PREVIEW
      ====================================================== -->
      <Transition name="qr-preview">
        <div
          v-if="previewQr"
          class="qr-preview"
          @click.self="closeQr"
        >
          <div
            class="qr-preview-backdrop"
            @click="closeQr"
          ></div>

          <div class="qr-preview-card">
            <button
              type="button"
              class="qr-preview-close"
              aria-label="Đóng QR"
              @click="closeQr"
            >
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="qr-preview-title">
              {{ previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="qr-preview-image">
              <img
                :src="previewQr.QrCode"
                :alt="previewQr.Name || 'QR mừng cưới'"
              />
            </div>

            <p>
              Nhấn giữ vào ảnh để lưu QR về điện thoại
            </p>

            <a
              :href="previewQr.QrCode"
              target="_blank"
              rel="noopener"
              download
              class="qr-save-button"
            >
              <v-icon size="15">
                mdi-download
              </v-icon>

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
import gift from "@/assets/romatic-pink/gift.webp";

const props = defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },
});

const showGiftDialog = ref(false);
const previewQr = ref(null);

/**
 * Mở hộp quà
 */
function openGift() {
  showGiftDialog.value = true;

  document.body.classList.add("gift-dialog-open");
}

/**
 * Đóng hộp quà
 */
function closeGift() {
  previewQr.value = null;
  showGiftDialog.value = false;

  document.body.classList.remove("gift-dialog-open");
}

/**
 * Mở QR lớn
 */
function openQr(item) {
  if (!item?.QrCode) return;

  previewQr.value = item;
}

/**
 * Đóng QR
 */
function closeQr() {
  previewQr.value = null;
}

/**
 * Copy số tài khoản
 */
async function copyAccount(item) {
  const number =
    item?.AccountNumber ||
    item?.Number;

  if (!number) return;

  try {
    await navigator.clipboard.writeText(
      String(number)
    );

    console.log("Đã sao chép số tài khoản");
  } catch (error) {
    console.warn(
      "Không thể sao chép số tài khoản",
      error
    );
  }
}

/**
 * ESC để đóng popup
 */
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

document.addEventListener(
  "keydown",
  handleEscape
);

onBeforeUnmount(() => {
  document.removeEventListener(
    "keydown",
    handleEscape
  );

  document.body.classList.remove(
    "gift-dialog-open"
  );
});
</script>

<style scoped>
/* =========================================================
   MAIN
========================================================= */

.gifts {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #805363;

  border: 1px solid rgba(198, 160, 106, 0.38);
  border-radius: 28px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 250, 249, 0.32),
      rgba(250, 230, 237, 0.18)
    );

  box-shadow:
    0 12px 35px rgba(137, 67, 84, 0.09),
    inset 0 0 0 1px rgba(255, 255, 255, 0.65);

  overflow: hidden;
}

.gifts::before {
  content: "";

  position: absolute;
  inset: 8px;

  border: 1px solid rgba(198, 160, 106, 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.gift-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-bottom: 12px;

  color: #c6a06a;
}

.gift-ornament span {
  width: 45px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(198, 160, 106, 0.7)
    );
}

.gift-ornament span:last-child {
  transform: rotate(180deg);
}

.eyebrow {
  position: relative;

  color: #b17486;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
}

.gifts h2 {
  position: relative;

  margin: 5px 0 4px;

  color: #9b4b61;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;
}

.gift-intro {
  position: relative;

  margin: 0 0 27px;

  color: #956476;

  font-size: 14px;
  line-height: 1.7;
}

/* =========================================================
   GIFT LIST
========================================================= */

.gift-list {
  position: relative;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  gap: 18px;
}

.gift-item {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* =========================================================
   GIFT BUTTON
========================================================= */

.gift-box-button {
  position: relative;

  width: 100%;
  min-height: 315px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(198, 160, 106, 0.28);
  border-radius: 23px;

  background:
    radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.65),
      rgba(250, 229, 236, 0.2)
    );

  cursor: pointer;

  appearance: none;

  font-family: inherit;

  overflow: hidden;

  -webkit-tap-highlight-color: transparent;
}

/* =========================================================
   GLOW
========================================================= */

.gift-glow {
  position: absolute;

  width: 230px;
  height: 230px;

  left: 50%;
  top: 35px;

  transform: translateX(-50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(230, 183, 197, 0.42),
      rgba(230, 183, 197, 0.12) 45%,
      transparent 72%
    );

  filter: blur(4px);

  animation: giftGlow 3.5s ease-in-out infinite;
}

/* =========================================================
   GIFT IMAGE
========================================================= */

.gift-box {
  position: relative;

  z-index: 3;

  width: 210px;

  animation: giftFloat 3.5s ease-in-out infinite;

  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.35s ease;
}

.gift-box img {
  display: block;

  width: 100%;
  height: auto;

  object-fit: contain;

  filter:
    drop-shadow(0 18px 15px rgba(105, 44, 61, 0.17));
}

.gift-box-button:hover .gift-box {
  animation-play-state: paused;

  transform:
    translateY(-10px)
    rotate(-2deg)
    scale(1.035);

  filter: brightness(1.05);
}

.gift-box-button:active .gift-box {
  transform:
    translateY(2px)
    scale(0.93)
    rotate(2deg);
}

/* =========================================================
   SHADOW
========================================================= */

.gift-shadow {
  position: absolute;

  z-index: 2;

  left: 50%;
  bottom: 58px;

  width: 135px;
  height: 22px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(91, 40, 55, 0.16);

  filter: blur(8px);

  animation: giftShadow 3.5s ease-in-out infinite;
}

/* =========================================================
   SPARKLES
========================================================= */

.gift-sparkle {
  position: absolute;

  z-index: 6;

  color: #c6a06a;

  font-family: Georgia, serif;

  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 14px rgba(198, 160, 106, 0.25);

  pointer-events: none;

  animation: sparkle 2.6s ease-in-out infinite;
}

.sparkle-1 {
  top: 58px;
  left: calc(50% - 108px);

  font-size: 15px;
}

.sparkle-2 {
  top: 91px;
  right: calc(50% - 116px);

  font-size: 11px;

  animation-delay: 0.6s;
}

.sparkle-3 {
  bottom: 105px;
  left: calc(50% - 125px);

  font-size: 10px;

  animation-delay: 1.2s;
}

.sparkle-4 {
  right: calc(50% - 124px);
  bottom: 93px;

  font-size: 12px;

  animation-delay: 1.7s;
}

/* =========================================================
   HINT
========================================================= */

.gift-hint {
  position: absolute;

  z-index: 8;

  left: 50%;
  bottom: 21px;

  display: inline-flex;
  align-items: center;

  gap: 7px;

  transform: translateX(-50%);

  color: #a8566c;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  white-space: nowrap;
}

.gift-hint::after {
  content: "";

  position: absolute;

  left: 50%;
  bottom: -7px;

  width: 34px;
  height: 1px;

  transform: translateX(-50%);

  background:
    linear-gradient(
      90deg,
      transparent,
      #c6a06a,
      transparent
    );
}

/* =========================================================
   DIALOG
========================================================= */

.gift-dialog {
  position: fixed;

  z-index: 99999;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  overflow-y: auto;
}

.gift-dialog-backdrop {
  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at center,
      rgba(255, 246, 248, 0.52),
      rgba(72, 37, 47, 0.58)
    );

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

/* =========================================================
   DIALOG CARD
========================================================= */

.gift-dialog-card {
  position: relative;

  z-index: 2;

  width: min(760px, 100%);

  max-height: min(90vh, 850px);

  padding: 31px 28px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(198, 160, 106, 0.45);
  border-radius: 28px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 252, 251, 0.98),
      rgba(250, 232, 237, 0.97)
    );

  box-shadow:
    0 30px 90px rgba(64, 29, 42, 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  scrollbar-width: thin;
  scrollbar-color: rgba(198, 160, 106, 0.35) transparent;
}

.gift-dialog-card::before {
  content: "";

  position: absolute;

  inset: 8px;

  border: 1px solid rgba(198, 160, 106, 0.22);
  border-radius: 21px;

  pointer-events: none;
}

.dialog-glow {
  position: absolute;

  width: 300px;
  height: 180px;

  top: -100px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(231, 185, 199, 0.38),
      transparent 70%
    );

  filter: blur(5px);

  pointer-events: none;
}

/* =========================================================
   DIALOG DECORATION
========================================================= */

.dialog-decoration {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-bottom: 8px;
}

.dialog-decoration span {
  width: 60px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(198, 160, 106, 0.65)
    );
}

.dialog-decoration span:last-child {
  transform: rotate(180deg);
}

.dialog-heart {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #cf8198,
      #a84f68
    );

  box-shadow:
    0 7px 18px rgba(160, 73, 97, 0.2);

  animation: heartPulse 2.5s ease-in-out infinite;
}

/* =========================================================
   CLOSE
========================================================= */

.dialog-close {
  position: absolute;

  z-index: 10;

  top: 15px;
  right: 15px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #9e6274;

  border: 1px solid rgba(198, 160, 106, 0.28);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.68);

  cursor: pointer;

  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.dialog-close:hover {
  transform: rotate(90deg);

  background: white;
}

/* =========================================================
   DIALOG HEADER
========================================================= */

.dialog-eyebrow {
  position: relative;

  margin-top: 6px;

  color: #b17486;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.24em;
}

.gift-dialog-card h3 {
  position: relative;

  margin: 3px 0 2px;

  color: #954e63;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 29px;
  font-weight: 600;
}

.dialog-description {
  position: relative;

  max-width: 450px;

  margin: 0 auto 22px;

  color: #956476;

  font-size: 12px;
  line-height: 1.6;
}

/* =========================================================
   ACCOUNT GRID
========================================================= */

.account-grid {
  position: relative;

  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(250px, 1fr)
    );

  gap: 16px;

  text-align: left;
}

/* =========================================================
   ACCOUNT CARD
========================================================= */

.account-card {
  position: relative;

  padding: 17px;

  border: 1px solid rgba(198, 160, 106, 0.3);
  border-radius: 19px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.84),
      rgba(255, 247, 248, 0.72)
    );

  box-shadow:
    0 8px 25px rgba(118, 55, 72, 0.07);

  overflow: hidden;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.account-card:hover {
  transform: translateY(-3px);

  box-shadow:
    0 13px 30px rgba(118, 55, 72, 0.11);
}

/* =========================================================
   ACCOUNT HEADING
========================================================= */

.account-heading {
  display: flex;
  align-items: center;

  gap: 9px;

  margin-bottom: 13px;
}

.account-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #a6536b;

  border: 1px solid rgba(198, 160, 106, 0.3);
  border-radius: 50%;

  background:
    linear-gradient(
      145deg,
      #fff,
      #f8e4e9
    );
}

.account-label {
  color: #9b4b61;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.09em;
}

.account-bank {
  margin-top: 2px;

  color: #ad7a88;

  font-size: 10px;
}

/* =========================================================
   QR
========================================================= */

.qr-button {
  position: relative;

  width: 100%;

  display: block;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.qr-frame {
  position: relative;

  width: fit-content;

  margin: 0 auto;

  padding: 8px;
}

.qr-inner {
  padding: 7px;

  border: 1px solid rgba(198, 160, 106, 0.32);

  background: white;

  box-shadow:
    0 7px 20px rgba(80, 37, 50, 0.08);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.qr-button:hover .qr-inner {
  transform: scale(1.025);

  box-shadow:
    0 10px 25px rgba(80, 37, 50, 0.13);
}

.qr-code {
  display: block;

  width: 150px;
  height: 150px;

  object-fit: contain;
}

/* QR corners */

.qr-corner {
  position: absolute;

  z-index: 2;

  width: 18px;
  height: 18px;

  border-color: #c6a06a;
  border-style: solid;

  pointer-events: none;
}

.qr-corner--tl {
  top: 0;
  left: 0;

  border-width: 1px 0 0 1px;
}

.qr-corner--tr {
  top: 0;
  right: 0;

  border-width: 1px 1px 0 0;
}

.qr-corner--bl {
  bottom: 0;
  left: 0;

  border-width: 0 0 1px 1px;
}

.qr-corner--br {
  right: 0;
  bottom: 0;

  border-width: 0 1px 1px 0;
}

.qr-hint {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 5px;

  margin-top: 7px;

  color: #ad7081;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.11em;
}

/* =========================================================
   ACCOUNT INFO
========================================================= */

.account-info {
  margin-top: 13px;

  padding: 11px 12px;

  border: 1px solid rgba(198, 160, 106, 0.18);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.52);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;
}

.info-left {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 2px;
}

.info-label {
  color: #b17486;

  font-size: 7px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

.info-value {
  color: #714b5a;

  font-size: 11px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.account-number {
  color: #994d64;

  letter-spacing: 0.06em;
}

.info-divider {
  height: 1px;

  margin: 8px 0;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(198, 160, 106, 0.25),
      transparent
    );
}

/* =========================================================
   COPY
========================================================= */

.copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  color: #a45b70;

  border: 1px solid rgba(198, 160, 106, 0.27);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.copy-button:hover {
  transform: scale(1.08);

  background: white;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.account-description {
  margin-top: 9px;

  color: #986779;

  font-size: 10px;
  font-style: italic;

  line-height: 1.5;

  text-align: center;
}

/* =========================================================
   DIALOG FOOTER
========================================================= */

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-top: 20px;

  color: #c6a06a;
}

.dialog-footer span {
  width: 55px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(198, 160, 106, 0.5)
    );
}

.dialog-footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   QR PREVIEW
========================================================= */

.qr-preview {
  position: fixed;

  z-index: 100000;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.qr-preview-backdrop {
  position: absolute;

  inset: 0;

  background: rgba(45, 24, 31, 0.72);

  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.qr-preview-card {
  position: relative;

  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(198, 160, 106, 0.45);
  border-radius: 24px;

  background:
    linear-gradient(
      145deg,
      #fffdfc,
      #fae9ee
    );

  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.3);
}

.qr-preview-close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #986073;

  border: 1px solid rgba(198, 160, 106, 0.25);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);

  cursor: pointer;
}

.qr-preview-title {
  margin-bottom: 15px;

  color: #9b4b61;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.15em;
}

.qr-preview-image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid rgba(198, 160, 106, 0.35);

  background: white;

  box-shadow:
    0 10px 30px rgba(83, 37, 51, 0.12);
}

.qr-preview-image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.qr-preview-card p {
  margin: 14px 0;

  color: #976879;

  font-size: 11px;
  font-style: italic;
}

.qr-save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 9px 15px;

  color: white;

  border-radius: 999px;

  background:
    linear-gradient(
      135deg,
      #c87891,
      #a9516b
    );

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  box-shadow:
    0 7px 18px rgba(160, 73, 97, 0.18);
}

/* =========================================================
   DIALOG ANIMATION
========================================================= */

.gift-dialog-enter-active,
.gift-dialog-leave-active {
  transition:
    opacity 0.35s ease;
}

.gift-dialog-enter-active .gift-dialog-card,
.gift-dialog-leave-active .gift-dialog-card {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.gift-dialog-enter-from {
  opacity: 0;
}

.gift-dialog-enter-from .gift-dialog-card {
  opacity: 0;

  transform:
    translateY(35px)
    scale(0.88)
    rotateX(8deg);
}

.gift-dialog-leave-to {
  opacity: 0;
}

.gift-dialog-leave-to .gift-dialog-card {
  opacity: 0;

  transform:
    translateY(20px)
    scale(0.94);
}

/* =========================================================
   QR PREVIEW ANIMATION
========================================================= */

.qr-preview-enter-active,
.qr-preview-leave-active {
  transition: opacity 0.25s ease;
}

.qr-preview-enter-active .qr-preview-card,
.qr-preview-leave-active .qr-preview-card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

.qr-preview-enter-from {
  opacity: 0;
}

.qr-preview-enter-from .qr-preview-card {
  opacity: 0;

  transform:
    scale(0.85)
    translateY(20px);
}

.qr-preview-leave-to {
  opacity: 0;
}

.qr-preview-leave-to .qr-preview-card {
  opacity: 0;

  transform: scale(0.92);
}

/* =========================================================
   GIFT ANIMATIONS
========================================================= */

@keyframes giftFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes giftShadow {
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

@keyframes giftGlow {
  0%,
  100% {
    opacity: 0.65;

    transform:
      translateX(-50%)
      scale(0.94);
  }

  50% {
    opacity: 1;

    transform:
      translateX(-50%)
      scale(1.08);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.2;

    transform:
      scale(0.65)
      rotate(0deg);
  }

  50% {
    opacity: 1;

    transform:
      scale(1.2)
      rotate(20deg);
  }
}

@keyframes heartPulse {
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
  .gifts {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .gifts::before {
    inset: 6px;

    border-radius: 18px;
  }

  .gift-intro {
    margin-bottom: 22px;

    font-size: 13px;
  }

  .gift-item {
    min-height: 295px;
  }

  .gift-box-button {
    min-height: 295px;
  }

  .gift-box {
    width: 185px;
  }

  .gift-glow {
    width: 190px;
    height: 190px;
  }

  .gift-dialog {
    align-items: flex-end;

    padding: 10px;
  }

  .gift-dialog-card {
    width: 100%;

    max-height: 92vh;

    padding: 27px 13px 19px;

    border-radius: 25px 25px 20px 20px;
  }

  .gift-dialog-card::before {
    inset: 6px;

    border-radius: 19px 19px 15px 15px;
  }

  .gift-dialog-card h3 {
    font-size: 26px;
  }

  .dialog-description {
    margin-bottom: 18px;

    padding: 0 10px;

    font-size: 11px;
  }

  .account-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .account-card {
    padding: 14px;
  }

  .qr-code {
    width: 135px;
    height: 135px;
  }

  .account-info {
    margin-top: 11px;
  }

  .qr-preview {
    padding: 14px;
  }

  .qr-preview-card {
    padding: 25px 15px 19px;
  }
}

@media (max-width: 380px) {
  .gift-box {
    width: 165px;
  }

  .gift-item,
  .gift-box-button {
    min-height: 280px;
  }

  .qr-code {
    width: 125px;
    height: 125px;
  }

  .account-label {
    font-size: 9px;
  }

  .info-value {
    font-size: 10px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .gift-box,
  .gift-shadow,
  .gift-glow,
  .gift-sparkle,
  .dialog-heart {
    animation: none;
  }

  .gift-dialog-enter-active,
  .gift-dialog-leave-active,
  .qr-preview-enter-active,
  .qr-preview-leave-active {
    transition: none;
  }
}
:global(body.gift-dialog-open) {
  overflow: hidden;
}
</style>
