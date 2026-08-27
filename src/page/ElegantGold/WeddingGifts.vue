<template>
  <section class="eg-gifts">

    <div class="gift-inner">

      <!-- HEADER -->

      <header class="gift-header">

        <div class="section-label">
          WEDDING GIFT
        </div>

        <div class="script-title">
          Một chút yêu thương
        </div>

        <h2>
          Lời chúc của bạn
          <br />
          <em>là món quà quý giá nhất</em>
        </h2>

        <div class="gold-symbol">
          ◆
        </div>

        <p class="gift-description">
          Sự hiện diện của bạn trong ngày vui
          đã là niềm hạnh phúc lớn nhất
          đối với chúng mình.
        </p>

      </header>

      <!-- GIFT CARDS -->

      <div class="gift-list">

        <article
          v-for="(gift, index) in gifts"
          :key="gift.Id || index"
          class="gift-card"
        >

          <div class="gift-top">

            <span class="gift-number">
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <span class="gift-icon">
              ♡
            </span>

          </div>

          <div class="gift-content">

            <div class="gift-label">
              {{ gift.Title || "WEDDING GIFT" }}
            </div>

            <h3>
              {{ gift.name || gift.accountName }}
            </h3>

            <div
              v-if="gift.bank"
              class="bank-name"
            >
              {{ gift.bank }}
            </div>

            <div
              v-if="gift.accountNumber"
              class="account-row"
            >
              <span>
                {{ gift.accountNumber }}
              </span>

              <button
                type="button"
                @click="copyAccount(
                  gift.accountNumber
                )"
              >
                {{ copied === gift.accountNumber
                  ? "Đã sao chép"
                  : "Sao chép"
                }}
              </button>
            </div>

          </div>

          <!-- QR -->

          <div
            v-if="getQr(gift)"
            class="gift-qr"
          >
            <img
              :src="getQr(gift)"
              alt="QR mừng cưới"
            />
          </div>

        </article>

      </div>

    </div>

  </section>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },
});

const copied = ref("");

function getQr(gift) {
  return (
    gift?.qr ||
    gift?.qrCode ||
    gift?.qrImage ||
    ""
  );
}

async function copyAccount(number) {
  if (!number) return;

  try {
    await navigator.clipboard.writeText(
      String(number)
    );

    copied.value = number;

    setTimeout(() => {
      if (copied.value === number) {
        copied.value = "";
      }
    }, 1800);

  } catch {
    copied.value = "";
  }
}
</script>

<style scoped>
.eg-gifts {
  position: relative;

  padding:
    100px 30px;

  background:
    #201d17;

  color: #f6edda;
}

.eg-gifts::before {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(212,175,55,.13);
}

.gift-inner {
  position: relative;

  width: min(
    100%,
    700px
  );

  margin: auto;
}

/* HEADER */

.gift-header {
  text-align: center;

  margin-bottom: 50px;
}

.section-label {
  color: #d4af37;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.script-title {
  margin-top: 18px;

  color: #d4b96c;

  font-family:
    "Allura",
    cursive;

  font-size: 35px;
}

.gift-header h2 {
  margin:
    5px 0 18px;

  color: #fff7e4;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(33px, 6vw, 47px);

  font-weight: 400;

  line-height: .95;
}

.gift-header h2 em {
  color: #c9ae6d;

  font-style: italic;
}

.gold-symbol {
  color: #d4af37;

  font-size: 7px;
}

.gift-description {
  max-width: 480px;

  margin:
    25px auto 0;

  color:
    rgba(244,230,198,.62);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;

  line-height: 1.6;
}

/* CARD */

.gift-list {
  display: grid;

  gap: 18px;
}

.gift-card {
  position: relative;

  display: grid;

  grid-template-columns:
    45px 1fr auto;

  gap: 20px;

  padding: 28px;

  border:
    1px solid
    rgba(212,175,55,.3);

  background:
    rgba(255,255,255,.025);
}

.gift-top {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: space-between;
}

.gift-number {
  color:
    rgba(212,175,55,.5);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;
}

.gift-icon {
  color: #d4af37;

  font-size: 25px;
}

.gift-label {
  color:
    rgba(212,175,55,.75);

  font-family: Arial, sans-serif;

  font-size: 8px;

  letter-spacing: 2px;
}

.gift-content h3 {
  margin:
    5px 0 2px;

  color: #f8edcf;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 26px;

  font-weight: 400;
}

.bank-name {
  color:
    rgba(242,226,190,.6);

  font-size: 13px;
}

.account-row {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-top: 13px;

  color: #d8bb6c;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 19px;

  letter-spacing: 1px;
}

.account-row button {
  padding:
    5px 9px;

  border:
    1px solid
    rgba(212,175,55,.3);

  background: transparent;

  color:
    rgba(240,221,172,.7);

  font-size: 8px;

  cursor: pointer;
}

.gift-qr {
  width: 110px;
  height: 110px;

  padding: 6px;

  background: #fff;
}

.gift-qr img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

/* MOBILE */

@media (max-width:600px) {
  .eg-gifts {
    padding:
      75px 20px;
  }

  .eg-gifts::before {
    inset: 10px;
  }

  .gift-card {
    grid-template-columns:
      30px 1fr;

    padding: 22px;

    gap: 12px;
  }

  .gift-qr {
    grid-column: 2;

    width: 105px;
    height: 105px;
  }

  .account-row {
    flex-wrap: wrap;

    font-size: 17px;
  }
}
</style>