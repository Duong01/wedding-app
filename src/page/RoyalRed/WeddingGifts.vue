<template>
  <section class="rr-section gift-section">
    <div class="rr-frame">

      <!-- HEADER -->
      <div class="rr-kicker">
        A LITTLE GIFT
      </div>

      <h2 class="rr-title">
        Hộp Mừng Cưới
      </h2>

      <p class="intro">
        Sự hiện diện và lời chúc của bạn là món quà quý giá nhất.
        Nếu muốn gửi thêm lời chúc phúc, bạn có thể gửi một chút
        yêu thương đến cô dâu chú rể.
      </p>


      <!-- =====================================================
           GIFT STAGE
      ====================================================== -->

      <div
        class="gift-stage"
        :class="{ opened: isOpened }"
      >

        <!-- ===============================================
             QR AREA
        ================================================ -->

        <Transition name="royal-qr">

          <div
            v-if="isOpened"
            class="qr-stage"
          >

            <!-- QR 1 -->

            <div
              v-if="gifts[0]"
              class="qr-card qr-card-left"
            >

              <div class="qr-corner qr-corner-tl"></div>
              <div class="qr-corner qr-corner-br"></div>

              <div class="qr-label">
                MỪNG CƯỚI
              </div>

              <div class="qr-box">

                <img
                  v-if="
                    gifts[0].QrCode ||
                    gifts[0].Qr ||
                    gifts[0].Image
                  "
                  :src="
                    gifts[0].QrCode ||
                    gifts[0].Qr ||
                    gifts[0].Image
                  "
                  alt="QR mừng cưới"
                />

                <span v-else>♥</span>

              </div>

              <div class="qr-name">
                {{
                  gifts[0].Title ||
                  gifts[0].Name ||
                  "CÔ DÂU"
                }}
              </div>

            </div>


            <!-- CENTER SYMBOL -->

            <div class="qr-center-symbol">
              <span>囍</span>
            </div>


            <!-- QR 2 -->

            <div
              v-if="gifts[1]"
              class="qr-card qr-card-right"
            >

              <div class="qr-corner qr-corner-tl"></div>
              <div class="qr-corner qr-corner-br"></div>

              <div class="qr-label">
                MỪNG CƯỚI
              </div>

              <div class="qr-box">

                <img
                  v-if="
                    gifts[1].QrCode ||
                    gifts[1].Qr ||
                    gifts[1].Image
                  "
                  :src="
                    gifts[1].QrCode ||
                    gifts[1].Qr ||
                    gifts[1].Image
                  "
                  alt="QR mừng cưới"
                />

                <span v-else>♥</span>

              </div>

              <div class="qr-name">
                {{
                  gifts[1].Title ||
                  gifts[1].Name ||
                  "CHÚ RỂ"
                }}
              </div>

            </div>

          </div>

        </Transition>


        <!-- ===============================================
             ENVELOPES
        ================================================ -->

        <div
          class="envelope-stage"
          :class="{ opened: isOpened }"
        >

          <!-- LEFT ENVELOPE -->

          <button
            v-if="gifts[0]"
            type="button"
            class="red-envelope envelope-left"
            @click="toggleGift"
          >

            <div class="envelope-image">

              <img
                :src="lixi"
                alt="Túi lì xì"
              />

            </div>

            <span class="envelope-glow"></span>

            <div class="envelope-content">

              <span class="envelope-small">
                {{ isOpened ? "ĐÃ MỞ" : "CHẠM ĐỂ MỞ" }}
              </span>

              <strong>囍</strong>

              <span class="envelope-role">
                {{
                  gifts[0].Title ||
                  gifts[0].Name ||
                  "CÔ DÂU"
                }}
              </span>

            </div>

          </button>


          <!-- RIGHT ENVELOPE -->

          <button
            v-if="gifts[1]"
            type="button"
            class="red-envelope envelope-right"
            @click="toggleGift"
          >

            <div class="envelope-image">

              <img
                :src="lixi"
                alt="Túi lì xì"
              />

            </div>

            <span class="envelope-glow"></span>

            <div class="envelope-content">

              <span class="envelope-small">
                {{ isOpened ? "ĐÃ MỞ" : "CHẠM ĐỂ MỞ" }}
              </span>

              <strong>囍</strong>

              <span class="envelope-role">
                {{
                  gifts[1].Title ||
                  gifts[1].Name ||
                  "CHÚ RỂ"
                }}
              </span>

            </div>

          </button>


          <!-- CENTER INSTRUCTION -->

          <div
            v-if="!isOpened"
            class="gift-hint"
          >
            <span></span>

            <b>CHẠM VÀO PHONG BAO</b>

            <span></span>
          </div>

        </div>


        <!-- ===============================================
             BANK INFORMATION
        ================================================ -->

        <Transition name="info-reveal">

          <div
            v-if="isOpened"
            class="gift-information"
          >

            <div
              v-for="(g, i) in gifts.slice(0, 2)"
              :key="i"
              class="account"
            >

              <div class="account-line">
                <span></span>

                <b>囍</b>

                <span></span>
              </div>

              <h3>
                {{
                  g.Title ||
                  g.Name ||
                  "Hộp mừng cưới"
                }}
              </h3>

              <p
                v-if="g.BankName || g.Bank"
                class="bank-name"
              >
                {{ g.BankName || g.Bank }}
              </p>

              <p
                v-if="g.AccountName || g.Owner"
                class="account-name"
              >
                {{ g.AccountName || g.Owner }}
              </p>

              <div
                v-if="g.AccountNumber || g.Number"
                class="account-number"
              >

                <span>
                  {{ g.AccountNumber || g.Number }}
                </span>

                <button
                  type="button"
                  @click.stop="
                    copy(
                      g.AccountNumber ||
                      g.Number
                    )
                  "
                >
                  SAO CHÉP
                </button>

              </div>

            </div>

          </div>

        </Transition>


        <!-- ===============================================
             BOTTOM ORNAMENT
        ================================================ -->

        <div
          v-if="isOpened"
          class="gift-bottom"
        >
          <span></span>

          <i>✦</i>

          <b>囍</b>

          <i>✦</i>

          <span></span>
        </div>

      </div>

    </div>
  </section>
</template>


<script setup>
import { ref } from "vue";
import lixi from "@/assets/royal-red/royal.webp";

defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },
});

const isOpened = ref(false);

function toggleGift() {
  isOpened.value = !isOpened.value;
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
   ROYAL RED GIFT
========================================================= */

.gift-section {
  position: relative;
  width: 100%;
  padding: 90px 16px;
  color: #f5e6c5;
}

.rr-frame {
  width: min(820px, 100%);
  margin: 0 auto;
}


/* =========================================================
   HEADER
========================================================= */

.rr-kicker {
  text-align: center;
  color: #cda45f;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: .42em;
  margin-bottom: 15px;
}

.rr-title {
  margin: 0;
  text-align: center;

  color: #f2d590;

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: clamp(34px, 7vw, 52px);
  font-weight: 500;
  letter-spacing: .03em;
}

.rr-title::after {
  content: "囍";

  display: block;

  margin-top: 14px;

  color: #b9873d;

  font-size: 21px;
}

.intro {
  width: min(570px, 100%);

  margin: 25px auto 60px;

  text-align: center;

  color: rgba(245, 230, 197, .68);

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 15px;
  line-height: 1.9;
}


/* =========================================================
   GIFT STAGE
========================================================= */

.gift-stage {
  position: relative;

  width: 100%;

  min-height: 460px;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: visible;
}


/* =========================================================
   ENVELOPE STAGE
========================================================= */

.envelope-stage {
  position: relative;

  width: 390px;
  height: 350px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    transform .8s cubic-bezier(.22,.61,.36,1);
}


/* =========================================================
   ENVELOPE
========================================================= */

.red-envelope {
  position: absolute;

  width: 205px;
  height: 275px;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  appearance: none;

  z-index: 3;

  transition:
    transform 1s cubic-bezier(.22,.61,.36,1),
    filter .5s ease;
}


/* LEFT */

.envelope-left {
  transform:
    translateX(-38px)
    rotate(-7deg);
}


/* RIGHT */

.envelope-right {
  transform:
    translateX(38px)
    rotate(7deg);

  z-index: 2;
}


/* =========================================================
   HOVER
========================================================= */

.envelope-left:hover {
  transform:
    translateX(-48px)
    translateY(-10px)
    rotate(-7deg)
    scale(1.035);

  z-index: 5;
}

.envelope-right:hover {
  transform:
    translateX(48px)
    translateY(-10px)
    rotate(7deg)
    scale(1.035);

  z-index: 5;
}


/* =========================================================
   OPENED POSITION
========================================================= */

.envelope-stage.opened .envelope-left {
  transform:
    translateX(-155px)
    translateY(15px)
    rotate(-9deg)
    scale(.82);

  z-index: 2;
}

.envelope-stage.opened .envelope-right {
  transform:
    translateX(155px)
    translateY(15px)
    rotate(9deg)
    scale(.82);

  z-index: 2;
}


/* =========================================================
   ENVELOPE IMAGE
========================================================= */

.envelope-image {
  position: absolute;

  inset: 0;

  overflow: hidden;

  border-radius: 5px;

  box-shadow:
    0 30px 65px rgba(0, 0, 0, .48),
    0 5px 15px rgba(0, 0, 0, .25);

  transition:
    box-shadow .6s ease;
}

.envelope-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  transition:
    transform 1s cubic-bezier(.22,.61,.36,1),
    filter .6s ease;
}

.red-envelope:hover .envelope-image img {
  transform: scale(1.055);

  filter:
    brightness(1.08)
    saturate(1.08);
}


/* =========================================================
   GOLD GLOW
========================================================= */

.envelope-glow {
  position: absolute;

  inset: -2px;

  border-radius: 6px;

  pointer-events: none;

  opacity: 0;

  box-shadow:
    0 0 0 1px rgba(226, 185, 92, .5),
    0 0 35px rgba(205, 157, 67, .22);

  transition:
    opacity .5s ease;
}

.red-envelope:hover .envelope-glow {
  opacity: 1;
}


/* =========================================================
   ENVELOPE CONTENT
========================================================= */

.envelope-content {
  position: absolute;

  inset: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  pointer-events: none;

  text-shadow:
    0 3px 12px rgba(50, 0, 0, .6);
}

.envelope-small {
  color: #f6dca0;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: .28em;

  margin-bottom: 10px;
}

.envelope-content strong {
  color: #efcf83;

  font-family: serif;

  font-size: 54px;

  line-height: 1;
}

.envelope-role {
  margin-top: 12px;

  color: rgba(250, 225, 166, .8);

  font-size: 8px;

  letter-spacing: .2em;
}


/* =========================================================
   HINT
========================================================= */

.gift-hint {
  position: absolute;

  bottom: -4px;

  width: 300px;

  display: flex;

  align-items: center;

  gap: 12px;

  color: rgba(221, 181, 100, .7);

  font-size: 8px;

  letter-spacing: .25em;
}

.gift-hint span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(205, 163, 86, .45)
    );
}

.gift-hint span:last-child {
  background:
    linear-gradient(
      90deg,
      rgba(205, 163, 86, .45),
      transparent
    );
}


/* =========================================================
   QR STAGE
========================================================= */

.qr-stage {
  position: absolute;

  top: 0;

  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 22px;

  z-index: 6;

  pointer-events: none;
}


/* =========================================================
   QR CARD
========================================================= */

.qr-card {
  position: relative;

  width: 205px;

  padding: 13px 13px 16px;

  text-align: center;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.98),
      rgba(247,241,226,.98)
    );

  box-shadow:
    0 28px 65px rgba(0,0,0,.38),
    0 5px 18px rgba(0,0,0,.18);

  color: #6f1116;

  transition:
    transform .8s cubic-bezier(.22,.61,.36,1);
}

.qr-card-left {
  transform:
    translateY(12px)
    rotate(-3deg);
}

.qr-card-right {
  transform:
    translateY(12px)
    rotate(3deg);
}


/* =========================================================
   QR CORNERS
========================================================= */

.qr-corner {
  position: absolute;

  width: 18px;
  height: 18px;

  border-color: #c39a4d;
}

.qr-corner-tl {
  top: 5px;
  left: 5px;

  border-top: 1px solid;
  border-left: 1px solid;
}

.qr-corner-br {
  right: 5px;
  bottom: 5px;

  border-right: 1px solid;
  border-bottom: 1px solid;
}


/* =========================================================
   QR LABEL
========================================================= */

.qr-label {
  margin-bottom: 10px;

  color: #9a702e;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: .24em;
}


/* =========================================================
   QR
========================================================= */

.qr-box {
  width: 175px;
  height: 175px;

  margin: auto;

  padding: 5px;

  background: #fff;
}

.qr-box img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: contain;
}

.qr-box span {
  width: 100%;
  height: 100%;

  display: grid;
  place-items: center;

  color: #8d1118;

  font-size: 38px;
}

.qr-name {
  margin-top: 11px;

  color: #6f1116;

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 13px;

  letter-spacing: .12em;
}


/* =========================================================
   CENTER DOUBLE HAPPINESS
========================================================= */

.qr-center-symbol {
  position: absolute;

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%);

  width: 42px;
  height: 42px;

  display: grid;
  place-items: center;

  border-radius: 50%;

  background: #8d1118;

  box-shadow:
    0 8px 25px rgba(0,0,0,.3),
    0 0 0 5px rgba(210,169,87,.15);

  z-index: 10;
}

.qr-center-symbol span {
  color: #f0cf82;

  font-family: serif;

  font-size: 21px;
}


/* =========================================================
   QR REVEAL
========================================================= */

.royal-qr-enter-active {
  animation:
    royalQrIn
    1s
    cubic-bezier(.16,1,.3,1);
}

.royal-qr-leave-active {
  animation:
    royalQrOut
    .4s
    ease forwards;
}

@keyframes royalQrIn {

  0% {
    opacity: 0;

    transform:
      translateY(70px)
      scale(.75);
  }

  45% {
    opacity: 1;

    transform:
      translateY(-10px)
      scale(1.035);
  }

  70% {
    transform:
      translateY(4px)
      scale(.99);
  }

  100% {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }
}

@keyframes royalQrOut {

  to {
    opacity: 0;

    transform:
      translateY(35px)
      scale(.9);
  }
}


/* =========================================================
   INFORMATION
========================================================= */

.gift-information {
  width: min(760px, 100%);

  margin-top: 15px;

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 45px;
}

.account {
  text-align: center;
}

.account-line {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 17px;
}

.account-line span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(199,158,78,.45)
    );
}

.account-line span:last-child {
  background:
    linear-gradient(
      90deg,
      rgba(199,158,78,.45),
      transparent
    );
}

.account-line b {
  color: #c49a4b;

  font-family: serif;

  font-size: 17px;
}

.account h3 {
  margin: 0 0 8px;

  color: #efd18b;

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 21px;

  font-weight: 500;
}

.bank-name {
  margin: 0 0 5px;

  color: rgba(245,230,197,.68);

  font-size: 12px;

  letter-spacing: .08em;
}

.account-name {
  margin: 0 0 15px;

  color: #e8cb87;

  font-size: 12px;

  letter-spacing: .1em;
}

.account-number {
  display: inline-flex;

  align-items: center;

  gap: 12px;
}

.account-number span {
  color: #f1d99e;

  font-family:
    "Courier New",
    monospace;

  font-size: 14px;

  letter-spacing: .1em;
}

.account-number button {
  border: 0;

  background: transparent;

  color: #c69b50;

  font-size: 8px;

  letter-spacing: .14em;

  cursor: pointer;

  transition:
    color .3s ease,
    transform .3s ease;
}

.account-number button:hover {
  color: #f0d38b;

  transform: translateY(-2px);
}


/* =========================================================
   INFO REVEAL
========================================================= */

.info-reveal-enter-active {
  animation:
    infoIn
    .75s
    .12s
    both
    cubic-bezier(.22,.61,.36,1);
}

.info-reveal-leave-active {
  animation:
    infoOut
    .3s
    ease
    forwards;
}

@keyframes infoIn {

  from {
    opacity: 0;

    transform:
      translateY(25px);
  }

  to {
    opacity: 1;

    transform:
      translateY(0);
  }
}

@keyframes infoOut {

  to {
    opacity: 0;

    transform:
      translateY(-15px);
  }
}


/* =========================================================
   BOTTOM
========================================================= */

.gift-bottom {
  width: min(500px, 80%);

  margin-top: 45px;

  display: flex;

  align-items: center;

  gap: 13px;
}

.gift-bottom span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(194,151,72,.4)
    );
}

.gift-bottom span:nth-child(5) {
  background:
    linear-gradient(
      90deg,
      rgba(194,151,72,.4),
      transparent
    );
}

.gift-bottom i {
  color: #b88a42;

  font-size: 9px;

  font-style: normal;
}

.gift-bottom b {
  color: #d0a457;

  font-family: serif;

  font-size: 17px;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 650px) {

  .gift-section {
    padding: 70px 12px;
  }

  .intro {
    margin-bottom: 45px;

    font-size: 14px;
  }

  .gift-stage {
    min-height: 430px;
  }

  .envelope-stage {
    width: 320px;
    height: 315px;
  }

  .red-envelope {
    width: 165px;
    height: 230px;
  }

  .envelope-left {
    transform:
      translateX(-28px)
      rotate(-7deg);
  }

  .envelope-right {
    transform:
      translateX(28px)
      rotate(7deg);
  }

  .envelope-stage.opened .envelope-left {
    transform:
      translateX(-120px)
      translateY(15px)
      rotate(-8deg)
      scale(.72);
  }

  .envelope-stage.opened .envelope-right {
    transform:
      translateX(120px)
      translateY(15px)
      rotate(8deg)
      scale(.72);
  }

  .envelope-content strong {
    font-size: 43px;
  }

  .qr-stage {
    gap: 8px;
  }

  .qr-card {
    width: 145px;

    padding: 9px 9px 12px;
  }

  .qr-box {
    width: 125px;
    height: 125px;
  }

  .qr-label {
    font-size: 6px;
  }

  .qr-name {
    font-size: 10px;
  }

  .qr-center-symbol {
    width: 34px;
    height: 34px;
  }

  .qr-center-symbol span {
    font-size: 17px;
  }

  .gift-information {
    gap: 25px;
  }

  .account-number {
    flex-direction: column;

    gap: 5px;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 400px) {

  .envelope-stage {
    width: 290px;
  }

  .red-envelope {
    width: 145px;
    height: 205px;
  }

  .envelope-left {
    transform:
      translateX(-24px)
      rotate(-7deg);
  }

  .envelope-right {
    transform:
      translateX(24px)
      rotate(7deg);
  }

  .envelope-stage.opened .envelope-left {
    transform:
      translateX(-105px)
      translateY(15px)
      rotate(-8deg)
      scale(.68);
  }

  .envelope-stage.opened .envelope-right {
    transform:
      translateX(105px)
      translateY(15px)
      rotate(8deg)
      scale(.68);
  }

  .qr-card {
    width: 130px;
  }

  .qr-box {
    width: 112px;
    height: 112px;
  }

  .gift-information {
    grid-template-columns: 1fr;
  }

}
</style>


