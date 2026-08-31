<template>
  <section
    class="red-opening"
    :class="{
      'is-opening': isOpening,
      'is-opened': isOpened,
    }"
  >

    <!-- =====================================================
         BACKGROUND
    ====================================================== -->

    <div class="red-opening__bg"></div>

    <div
      class="red-opening__pattern red-opening__pattern--top"
    ></div>

    <div
      class="red-opening__pattern red-opening__pattern--bottom"
    ></div>


    <!-- =====================================================
         ENVELOPE
    ====================================================== -->

    <div class="red-envelope">

      <!-- BACK -->
      <div class="red-envelope__back">

        <div class="red-envelope__border">

          <div class="red-envelope__inner">

            <div class="red-envelope__ornament">

              <div class="red-envelope__symbol">
                <span>囍</span>
              </div>

            </div>

          </div>

        </div>

      </div>


      <!-- =================================================
           INVITATION CARD
      ================================================== -->

      <div class="red-card">

        <div class="red-card__outer">

          <div class="red-card__inner">

            <!-- TOP -->
            <div class="red-card__top">

              <span></span>

              <div class="red-card__double-happiness">
                囍
              </div>

              <span></span>

            </div>


            <!-- TITLE -->

            <p class="red-card__kicker">
              THIỆP MỜI
            </p>

            <h1 class="red-card__title">
              LỄ THÀNH HÔN
            </h1>


            <div class="red-card__ornament">

              <span></span>

              <b>❖</b>

              <span></span>

            </div>


            <!-- INVITATION -->

            <p class="red-card__invite">
              Trân trọng kính mời
            </p>


            <!-- =================================================
                 GUEST NAME
            ================================================== -->

            <div
              v-if="recipient"
              class="red-card__guest"
            >

              <span class="red-card__guest-line"></span>

              <strong>
                {{ recipient }}
              </strong>

              <span class="red-card__guest-line"></span>

            </div>


            <!-- NAMES -->

            <div class="red-card__names">

              <div class="red-card__name">
                {{ wedding?.GroomName || "Chú Rể" }}
              </div>

              <div class="red-card__amp">
                &
              </div>

              <div class="red-card__name">
                {{ wedding?.BrideName || "Cô Dâu" }}
              </div>

            </div>


            <!-- DATE -->

            <div class="red-card__date">

              <span
                class="red-card__date-line"
              ></span>

              <div>
                {{ dateLabel }}
              </div>

              <span
                class="red-card__date-line"
              ></span>

            </div>


            <!-- MESSAGE -->

            <p class="red-card__message">
              Sự hiện diện của Quý khách<br />
              là niềm vinh hạnh của gia đình chúng tôi
            </p>


            <!-- BOTTOM -->

            <div class="red-card__bottom">

              <span>✦</span>

              <small>
                WEDDING INVITATION
              </small>

              <span>✦</span>

            </div>

          </div>

        </div>

      </div>


      <!-- =================================================
           FRONT ENVELOPE
      ================================================== -->

      <div class="red-envelope__front">

        <div
          class="
            red-front-flower
            red-front-flower--left
          "
        >
          ❀
        </div>

        <div
          class="
            red-front-flower
            red-front-flower--right
          "
        >
          ❀
        </div>


        <!-- SEAL -->

        <div class="red-seal">

          <span>囍</span>

        </div>

      </div>

    </div>


    <!-- =====================================================
         OPEN BUTTON
         NẰM NGOÀI PHONG BÌ
    ====================================================== -->

    <Transition name="open-button">

      <button
        v-if="!isOpening"
        type="button"
        class="red-open-button"
        @click="openInvitation"
      >

        <span class="red-open-button__border">

          <span class="red-open-button__text">
            MỞ THIỆP
          </span>

          <span class="red-open-button__arrow">
            ↓
          </span>

        </span>

      </button>

    </Transition>


    <!-- =====================================================
         BOTTOM TEXT
    ====================================================== -->

    <div
      class="red-opening__bottom"
      :class="{ 'is-hidden': isOpening }"
    >

      <span>✦</span>

      <small>
        HÂN HẠNH ĐÓN TIẾP
      </small>

      <span>✦</span>

    </div>

  </section>
</template>


<script setup>
import {
  computed,
  ref,
} from "vue";


const props = defineProps({

  wedding: {
    type: Object,
    required: true,
  },

  monogram: {
    type: String,
    default: "G&B",
  },

  dateLabel: {
    type: String,
    default: "",
  },

});


const emit = defineEmits([
  "open",
]);


const isOpening = ref(false);
const isOpened = ref(false);


/* =========================================================
   GUEST NAME
========================================================= */

const guestName = computed(() => {

  return (
    props.guestName ||
    props.wedding?.guestName ||
    props.wedding?.inviteeName ||
    props.wedding?.recipientName ||
    props.wedding?.guest?.name ||
    ""
  );

});

const recipient = computed(() => {

  const firstRecipient =
    props.wedding?.recipientName?.[0];

  return firstRecipient?.Name || null;

});
/* =========================================================
   OPEN INVITATION
========================================================= */

function openInvitation() {

  if (isOpening.value) {
    return;
  }

  isOpening.value = true;


  /*
   * Giai đoạn 1:
   *
   * Phong bì bắt đầu mở.
   */

  setTimeout(() => {

    isOpened.value = true;

  }, 380);


  /*
   * Giai đoạn 2:
   *
   * Đợi animation hoàn tất rồi
   * mới chuyển sang trang chính.
   *
   * Không emit quá sớm để tránh cảm giác giật.
   */

  setTimeout(() => {

    emit("open");

  }, 1250);

}
</script>


<style scoped>

/* =========================================================
   VARIABLES
========================================================= */

.red-opening {

  --red-dark: #650b11;
  --red: #8f111b;
  --red-light: #a91b25;

  --gold: #d4a84f;
  --gold-light: #f0d99a;
  --gold-dark: #a97825;

  --paper: #fff9eb;

  position: fixed;

  inset: 0;

  z-index: 9999;

  width: 100%;
  height: 100dvh;

  overflow: hidden;

  display: flex;

  align-items: center;
  justify-content: center;

  background: var(--red-dark);

  color: #4d211c;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

}


/* =========================================================
   BACKGROUND
========================================================= */

.red-opening__bg {

  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at 50% 45%,
      #a91b25 0%,
      #850f17 43%,
      #5d080e 100%
    );

}


.red-opening__bg::after {

  content: "";

  position: absolute;

  inset: 0;

  opacity: .1;

  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(255,255,255,.2) 0,
      rgba(255,255,255,.2) 1px,
      transparent 1px,
      transparent 4px
    );

}


/* =========================================================
   BACKGROUND ORNAMENT
========================================================= */

.red-opening__pattern {

  position: absolute;

  width: 300px;
  height: 300px;

  border:
    1px solid
    rgba(212,168,79,.15);

  transform: rotate(45deg);

  pointer-events: none;

}


.red-opening__pattern::before {

  content: "";

  position: absolute;

  inset: 15px;

  border:
    1px solid
    rgba(240,217,154,.08);

}


.red-opening__pattern--top {

  top: -210px;
  left: -110px;

}


.red-opening__pattern--bottom {

  right: -110px;
  bottom: -210px;

}


/* =========================================================
   ENVELOPE
========================================================= */

.red-envelope {

  position: relative;

  width:
    min(86vw, 470px);

  height:
    min(76vh, 640px);

  min-height: 480px;

  perspective: 1200px;

  transform: translateZ(0);

}


/* =========================================================
   BACK
========================================================= */

.red-envelope__back {

  position: absolute;

  inset: 0;

  z-index: 1;

  padding: 8px;

  background:
    linear-gradient(
      135deg,
      var(--gold-dark),
      var(--gold),
      var(--gold-light),
      var(--gold-dark)
    );

  box-shadow:
    0 30px 70px
    rgba(35,0,0,.45);

}


.red-envelope__border {

  width: 100%;
  height: 100%;

  padding: 6px;

  background:
    var(--red-dark);

}


.red-envelope__inner {

  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  border:
    1px solid
    rgba(240,217,154,.45);

  background:
    radial-gradient(
      circle at center,
      #9c1721,
      #730b12
    );

}


/* =========================================================
   BACK ORNAMENT
========================================================= */

.red-envelope__ornament {

  position: absolute;

  inset: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(240,217,154,.2);

}


.red-envelope__ornament::before {

  content: "";

  position: absolute;

  inset: 12px;

  border:
    1px solid
    rgba(240,217,154,.1);

}


.red-envelope__symbol {

  width: 110px;
  height: 110px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    2px solid
    rgba(212,168,79,.55);

  transform: rotate(45deg);

}


.red-envelope__symbol::before {

  content: "";

  position: absolute;

  inset: 8px;

  border:
    1px solid
    rgba(240,217,154,.4);

}


.red-envelope__symbol span {

  transform: rotate(-45deg);

  font-family:
    "Noto Serif SC",
    serif;

  font-size: 62px;

  color: var(--gold-light);

}


/* =========================================================
   CARD
========================================================= */

.red-card {

  position: absolute;

  z-index: 3;

  left: 50%;
  top: 50%;

  width: 88%;
  height: 90%;

  /*
   * Trạng thái ban đầu:
   * thiệp nằm trong phong bì.
   */

  transform:
    translate3d(-50%, -46%, 0)
    scale(.985);

  opacity: .98;

  will-change:
    transform,
    opacity;

  transition:
    transform 900ms
      cubic-bezier(.16, 1, .3, 1),
    opacity 500ms ease;

}


/*
 * Khi mở:
 *
 * Thiệp trượt lên rất nhẹ.
 *
 * Không dùng rotateX cho card.
 * Đây là phần giúp animation mượt hơn.
 */

.red-opening.is-opened
.red-card {

  transform:
    translate3d(-50%, -76%, 0)
    scale(1);

  opacity: 1;

}


/* =========================================================
   CARD OUTER
========================================================= */

.red-card__outer {

  width: 100%;
  height: 100%;

  padding: 5px;

  background:
    linear-gradient(
      135deg,
      #b9872c,
      #f1d58e,
      #a97825,
      #e8c86e
    );

  box-shadow:
    0 20px 55px
    rgba(30,0,0,.35);

}


.red-card__inner {

  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding:
    45px 25px;

  text-align: center;

  background:
    radial-gradient(
      circle at center,
      #fffdf4,
      #f7edd7
    );

}


/* =========================================================
   CARD BORDER
========================================================= */

.red-card__inner::before {

  content: "";

  position: absolute;

  inset: 12px;

  border:
    1px solid
    rgba(143,17,27,.35);

  pointer-events: none;

}


.red-card__inner::after {

  content: "";

  position: absolute;

  inset: 17px;

  border:
    1px solid
    rgba(212,168,79,.25);

  pointer-events: none;

}


/* =========================================================
   TOP
========================================================= */

.red-card__top {

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-bottom: 15px;

}


.red-card__top span {

  width: 45px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      var(--gold)
    );

}


.red-card__top span:last-child {

  background:
    linear-gradient(
      to left,
      transparent,
      var(--gold)
    );

}


.red-card__double-happiness {

  font-family:
    "Noto Serif SC",
    serif;

  font-size: 35px;

  line-height: 1;

  color: var(--red);

}


/* =========================================================
   TITLE
========================================================= */

.red-card__kicker {

  margin: 0 0 6px;

  font-size: 9px;

  letter-spacing: .38em;

  color: #9a6d3d;

}


.red-card__title {

  margin: 0;

  font-family:
    "Noto Serif SC",
    Georgia,
    serif;

  font-size:
    clamp(22px, 5vw, 32px);

  font-weight: 600;

  letter-spacing: .15em;

  color: var(--red-dark);

}


/* =========================================================
   ORNAMENT
========================================================= */

.red-card__ornament {

  width: 75%;

  display: flex;

  align-items: center;

  gap: 8px;

  margin: 13px 0;

}


.red-card__ornament span {

  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      var(--gold)
    );

}


.red-card__ornament span:last-child {

  background:
    linear-gradient(
      to left,
      transparent,
      var(--gold)
    );

}


.red-card__ornament b {

  color: var(--gold-dark);

  font-size: 9px;

}


/* =========================================================
   INVITE
========================================================= */

.red-card__invite {

  margin: 0 0 5px;

  font-size: 14px;

  color: #72534a;

}


/* =========================================================
   GUEST NAME
========================================================= */

.red-card__guest {

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  width: 100%;

  margin:
    3px 0
    10px;

}


.red-card__guest strong {

  max-width: 80%;

  color: var(--red);

  font-family:
    Georgia,
    serif;

  font-size:
    clamp(14px, 3.5vw, 18px);

  font-weight: 700;

  line-height: 1.25;

  letter-spacing: .03em;

}


.red-card__guest-line {

  width: 22px;

  height: 1px;

  background:
    var(--gold);

  opacity: .7;

}


/* =========================================================
   NAMES
========================================================= */

.red-card__names {

  display: flex;

  flex-direction: column;

  align-items: center;

}


.red-card__name {

  font-family:
    "Allura",
    "Cormorant Garamond",
    cursive;

  font-size:
    clamp(43px, 9vw, 62px);

  line-height: .95;

  color: var(--red-dark);

}


.red-card__amp {

  margin: 2px 0;

  font-family:
    "Cormorant Garamond",
    serif;

  font-size: 20px;

  font-style: italic;

  color: var(--gold-dark);

}


/* =========================================================
   DATE
========================================================= */

.red-card__date {

  margin-top: 15px;

  display: flex;

  align-items: center;

  gap: 12px;

  font-size: 14px;

  letter-spacing: .1em;

  color: #5f4a40;

}


.red-card__date-line {

  width: 35px;

  height: 1px;

  background:
    var(--gold);

}


/* =========================================================
   MESSAGE
========================================================= */

.red-card__message {

  margin:
    14px
    0
    18px;

  font-size: 12px;

  line-height: 1.7;

  color: #92786c;

}


/* =========================================================
   FRONT ENVELOPE
========================================================= */

.red-envelope__front {

  position: absolute;

  z-index: 6;

  left: 0;
  right: 0;
  bottom: 0;

  height: 37%;

  background:
    linear-gradient(
      145deg,
      #8d111a,
      #6e0d13
    );

  clip-path:
    polygon(
      0 0,
      50% 70%,
      100% 0,
      100% 100%,
      0 100%
    );

  border-top:
    1px solid
    rgba(212,168,79,.45);

  transform-origin:
    center bottom;

  will-change:
    transform;

  transition:
    transform
    850ms
    cubic-bezier(.16,1,.3,1);

}


/*
 * Chỉ mở phong bì.
 *
 * Không scale,
 * không rotate card.
 */

.red-opening.is-opening
.red-envelope__front {

  transform:
    translate3d(0, 105%, 0);

}


/* =========================================================
   FLOWERS
========================================================= */

.red-front-flower {

  position: absolute;

  top: 15%;

  font-size: 45px;

  color:
    rgba(
      212,
      168,
      79,
      .3
    );

}


.red-front-flower--left {

  left: 8%;

}


.red-front-flower--right {

  right: 8%;

  transform:
    scaleX(-1);

}


/* =========================================================
   SEAL
========================================================= */

.red-seal {

  position: absolute;

  left: 50%;
  top: 33%;

  width: 64px;
  height: 64px;

  transform:
    translate(-50%, -50%);

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      #bd9130,
      #8e6418
    );

  border:
    2px solid
    #f0d99a;

  box-shadow:
    0 7px 20px
    rgba(20,0,0,.3);

  transition:
    opacity 350ms ease,
    transform 700ms
      cubic-bezier(.16,1,.3,1);

}


/*
 * Seal đi xuống cùng mặt phong bì.
 */

.red-opening.is-opening
.red-seal {

  transform:
    translate(-50%, 130%)
    scale(.85);

  opacity: 0;

}


.red-seal::before {

  content: "";

  position: absolute;

  inset: 5px;

  border:
    1px solid
    rgba(255,255,255,.5);

  border-radius: 50%;

}


.red-seal span {

  position: relative;

  font-family:
    "Noto Serif SC",
    serif;

  font-size: 30px;

  color: #fff0bd;

}


/* =========================================================
   OPEN BUTTON
   NGOÀI PHONG BÌ
========================================================= */

.red-open-button {

  position: absolute;

  z-index: 20;

  left: 50%;

  /*
   * Nằm ngay bên dưới phong bì.
   */

  bottom:
    max(55px, 7vh);

  transform:
    translateX(-50%);

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  -webkit-tap-highlight-color:
    transparent;

}


.red-open-button__border {

  min-width: 160px;

  padding: 11px 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  border:
    1px solid
    var(--gold-dark);

  background:
    linear-gradient(
      135deg,
      var(--red),
      var(--red-dark)
    );

  box-shadow:
    inset 0 0 0 2px
    rgba(240,217,154,.15),

    0 8px 22px
    rgba(70,0,0,.28);

  color:
    #f7e6b2;

  transition:
    transform .3s ease,
    box-shadow .3s ease,
    background .3s ease;

}


.red-open-button__text {

  font-family:
    Georgia,
    serif;

  font-size: 10px;

  letter-spacing: .3em;

}


.red-open-button__arrow {

  font-size: 15px;

  transition:
    transform .3s ease;

}


.red-open-button:hover
.red-open-button__border {

  transform:
    translateY(-3px);

  background:
    linear-gradient(
      135deg,
      #a91b25,
      #6e0d13
    );

  box-shadow:
    0 12px 28px
    rgba(70,0,0,.35);

}


.red-open-button:hover
.red-open-button__arrow {

  transform:
    translateY(4px);

}


.red-open-button:active
.red-open-button__border {

  transform:
    translateY(0)
    scale(.97);

}


/* =========================================================
   BUTTON TRANSITION
========================================================= */

.open-button-enter-active,
.open-button-leave-active {

  transition:
    opacity .35s ease,
    transform .4s
      cubic-bezier(.16,1,.3,1);

}


.open-button-enter-from,
.open-button-leave-to {

  opacity: 0;

  transform:
    translateX(-50%)
    translateY(18px)
    scale(.96);

}


/* =========================================================
   BOTTOM
========================================================= */

.red-opening__bottom {

  position: absolute;

  left: 50%;

  bottom: 20px;

  transform:
    translateX(-50%);

  display: flex;

  align-items: center;

  gap: 12px;

  color: #e1c27a;

  transition:
    opacity .35s ease;

}


.red-opening__bottom.is-hidden {

  opacity: 0;

}


.red-opening__bottom span {

  font-size: 8px;

}


.red-opening__bottom small {

  font-family:
    Georgia,
    serif;

  font-size: 7px;

  letter-spacing: .3em;

  white-space: nowrap;

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

  .red-envelope {

    width: 88vw;

    height: 73vh;

    min-height: 460px;

    max-height: 620px;

  }


  .red-envelope__symbol {

    width: 80px;
    height: 80px;

  }


  .red-envelope__symbol span {

    font-size: 48px;

  }


  .red-card {

    width: 88%;

    height: 90%;

  }


  .red-card__inner {

    padding:
      32px 17px;

  }


  .red-card__top {

    margin-bottom: 10px;

  }


  .red-card__double-happiness {

    font-size: 28px;

  }


  .red-card__title {

    font-size: 23px;

  }


  .red-card__guest {

    margin-bottom: 8px;

  }


  .red-card__guest strong {

    font-size: 14px;

  }


  .red-card__name {

    font-size:
      clamp(
        40px,
        12vw,
        55px
      );

  }


  .red-card__message {

    font-size: 11px;

  }


  .red-open-button {

    bottom: 45px;

  }


  .red-open-button__border {

    min-width: 145px;

    padding:
      10px 18px;

  }


  .red-seal {

    width: 56px;
    height: 56px;

  }


  .red-seal span {

    font-size: 26px;

  }

}


/* =========================================================
   SMALL PHONE
========================================================= */

@media (max-width: 380px) {

  .red-envelope {

    width: 91vw;

    height: 69vh;

    min-height: 430px;

  }


  .red-card__inner {

    padding:
      25px 12px;

  }


  .red-card__kicker {

    font-size: 8px;

  }


  .red-card__title {

    font-size: 20px;

  }


  .red-card__guest strong {

    font-size: 13px;

  }


  .red-card__name {

    font-size: 37px;

  }


  .red-card__date {

    font-size: 12px;

  }


  .red-card__message {

    margin:
      10px 0;

  }


  .red-card__bottom {

    margin-top: 10px;

  }


  .red-open-button {

    bottom: 38px;

  }

}


/* =========================================================
   REDUCE MOTION
========================================================= */

@media (
  prefers-reduced-motion: reduce
) {

  *,
  *::before,
  *::after {

    transition: none !important;

    animation: none !important;

  }

}

</style>
