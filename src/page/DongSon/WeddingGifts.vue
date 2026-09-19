<template>
  <section class="gifts">
    <div class="gift-symbol">
      ✦
    </div>

    <div class="title">
      <small>A LITTLE GIFT</small>
      <h2>Hộp quà mừng cưới</h2>
      <p>
        Sự hiện diện của bạn đã là món quà quý giá nhất.
      </p>
    </div>

    <div class="gift-list">
      <article
        v-for="(gift, index) in gifts"
        :key="gift.id || gift.Id || index"
        class="gift-card"
      >
        <div class="gift-top">
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <b>✦</b>
        </div>

        <h3>
          {{ gift.name || gift.Name || gift.title || "Mừng cưới" }}
        </h3>

        <button
          v-if="giftQr(gift)"
          type="button"
          class="qr-button"
          aria-label="Xem QR lớn"
          @click="openQr(gift)"
        >
          <div class="qr-placeholder">
            <img :src="giftQr(gift)" alt="QR" loading="lazy" decoding="async" />
          </div>

          <div class="qr-hint">
            <span>◈</span> CHẠM ĐỂ XEM QR LỚN
          </div>
        </button>

        <div v-else class="qr-placeholder qr-placeholder--empty">
          <span>QR</span>
        </div>

        <p>
          {{ gift.accountName || gift.AccountName || gift.owner || "" }}
        </p>

        <div class="account-row">
          <strong>
            {{ gift.accountNumber || gift.AccountNumber || gift.number || "" }}
          </strong>

          <button
            v-if="gift.accountNumber || gift.AccountNumber || gift.number"
            type="button"
            class="copy-button"
            aria-label="Sao chép số tài khoản"
            @click="copyAccount(gift)"
          >
            <v-icon size="14">mdi-content-copy</v-icon>
          </button>
        </div>

        <div v-if="copyState" class="copy-toast">{{ copyState }}</div>
      </article>
    </div>

    <!-- QR PREVIEW -->
    <Teleport to="body">
      <Transition name="qr-preview">
        <div v-if="previewQr" class="qr-preview" @click.self="closeQr">
          <div class="qr-preview__backdrop" @click="closeQr"></div>

          <div class="qr-preview__card">
            <button type="button" class="qr-preview__close" aria-label="Đóng QR" @click="closeQr">
              <v-icon size="18">mdi-close</v-icon>
            </button>

            <div class="qr-preview__title">
              {{ previewQr.name || previewQr.Name || "QR MỪNG CƯỚI" }}
            </div>

            <div class="qr-preview__image">
              <img :src="previewQrSrc" alt="QR mừng cưới" />
            </div>

            <p>Nhấn giữ vào ảnh để lưu QR về điện thoại</p>

            <a
              :href="previewQrSrc"
              target="_blank"
              rel="noopener"
              download
              class="qr-preview__save"
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

defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },
});

const previewQr = ref(null);
const copyState = ref("");

const previewQrSrc = computed(() => {
  const item = previewQr.value;

  if (!item) return "";

  return item.qrCode || item.QrCode || item.qr || "";
});

function giftQr(gift) {
  return gift?.qrCode || gift?.QrCode || gift?.qr || "";
}

function openQr(gift) {
  if (!giftQr(gift)) return;

  previewQr.value = gift;
}

function closeQr() {
  previewQr.value = null;
}

async function copyAccount(gift) {
  const number =
    gift?.accountNumber || gift?.AccountNumber || gift?.number;

  if (!number) return;

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

let copyTimer = null;

function handleEscape(event) {
  if (event.key === "Escape" && previewQr.value) {
    closeQr();
  }
}

document.addEventListener("keydown", handleEscape);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);

  window.clearTimeout(copyTimer);
});
</script>

<style scoped>
.gifts {
  padding: 70px 20px;
  background: #f3ead8;
  color: #641914;
  text-align: center;
}

.gift-symbol {
  width: 55px;
  height: 55px;
  margin: auto;
  display: grid;
  place-items: center;
  border: 1px solid #a96b32;
  border-radius: 50%;
  color: #a96b32;
}

.title {
  margin: 22px auto 35px;
  max-width: 450px;
}

.title small {
  font-size: 10px;
  letter-spacing: .4em;
  color: #a96b32;
}

h2 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.title p {
  font-family: Georgia, serif;
  font-style: italic;
  color: #80675f;
  line-height: 1.7;
}

.gift-list {
  display: grid;
  gap: 20px;
  max-width: 570px;
  margin: auto;
}

.gift-card {
  padding: 25px;
  border: 1px solid rgba(143,36,28,.35);
  background: rgba(255,255,255,.2);
}

.gift-top {
  display: flex;
  justify-content: space-between;
  color: #a96b32;
  font-size: 11px;
}

.gift-card h3 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: 400;
}

/* QR */
.qr-button {
  display: block;

  width: 100%;

  margin: 20px auto 0;
  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}

.qr-placeholder {
  width: 145px;
  height: 145px;
  margin: auto;
  display: grid;
  place-items: center;
  border: 1px solid #a96b32;
  background: #fffaf0;

  transition: transform .25s ease, box-shadow .25s ease;
}

.qr-button:hover .qr-placeholder {
  transform: scale(1.03);

  box-shadow: 0 10px 24px rgba(143,36,28,.14);
}

.qr-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-placeholder--empty span {
  color: #a96b32;
  font-size: 12px;
}

.qr-hint {
  margin-top: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  font-size: 10px;
  letter-spacing: .16em;
  color: #a96b32;
}

/* ACCOUNT */
.gift-card p {
  margin: 14px 0 5px;
  color: #80675f;
  font-size: 12px;
}

.account-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}

.gift-card strong {
  color: #641914;
  letter-spacing: .1em;
}

.copy-button {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #a96b32;
  border-radius: 50%;

  color: #641914;
  background: rgba(255,255,255,.5);

  cursor: pointer;

  transition: transform .2s ease, background .2s ease;
}

.copy-button:hover {
  transform: scale(1.08);

  background: #fffaf0;
}

.copy-toast {
  margin-top: 12px;

  font-size: 11px;
  letter-spacing: .06em;
  color: #741c17;
}

/* QR PREVIEW */
.qr-preview {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.qr-preview__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(26, 10, 8, 0.78);
}

.qr-preview__card {
  position: relative;
  z-index: 2;

  width: min(380px, 100%);

  padding: 27px 22px 23px;

  text-align: center;

  border: 1px solid rgba(201,149,82,.65);
  border-radius: 4px;

  background: #f3ead8;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.qr-preview__close {
  position: absolute;

  top: 11px;
  right: 11px;

  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #641914;

  border: 1px solid rgba(169,107,50,.5);
  border-radius: 50%;

  background: rgba(255,255,255,.7);

  cursor: pointer;
}

.qr-preview__title {
  margin-bottom: 15px;

  color: #641914;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: .16em;
}

.qr-preview__image {
  width: fit-content;

  margin: 0 auto;

  padding: 12px;

  border: 1px solid #a96b32;

  background: #fffaf0;

  box-shadow: 0 10px 30px rgba(143,36,28,.12);
}

.qr-preview__image img {
  display: block;

  width: min(280px, 70vw);
  height: min(280px, 70vw);

  object-fit: contain;
}

.qr-preview__card p {
  margin: 14px 0;

  color: #80675f;

  font-size: 11px;
  font-style: italic;
}

.qr-preview__save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 9px 15px;

  color: #f3ead8;

  border: 1px solid #a96b32;

  background: #741c17;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: .12em;

  text-decoration: none;
}

/* TRANSITION */
.qr-preview-enter-active,
.qr-preview-leave-active {
  transition: opacity .25s ease;
}

.qr-preview-enter-active .qr-preview__card,
.qr-preview-leave-active .qr-preview__card {
  transition: transform .3s cubic-bezier(.22, 1, .36, 1), opacity .3s ease;
}

.qr-preview-enter-from,
.qr-preview-leave-to {
  opacity: 0;
}

.qr-preview-enter-from .qr-preview__card {
  opacity: 0;

  transform: scale(.85) translateY(20px);
}

.qr-preview-leave-to .qr-preview__card {
  opacity: 0;

  transform: scale(.92);
}

@media (max-width: 480px) {
  .gifts {
    padding: 54px 14px;
  }

  .gift-card {
    padding: 18px 14px;
  }

  .qr-preview {
    padding: 14px;
  }

  .qr-preview__card {
    padding: 25px 15px 19px;
  }
}
</style>
