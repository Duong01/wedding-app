<template>
  <section class="opening">
    <!-- ================= BACKGROUND ================= -->
    <div class="bg-pattern"></div>
    <div class="bg-glow"></div>

    <!-- Floating gold dust -->
    <div class="gold-dust">
      <i v-for="n in 14" :key="n"></i>
    </div>

    <!-- ================= OUTER DECORATION ================= -->
    <div class="outer-frame">
      <span class="frame-line top"></span>
      <span class="frame-line right"></span>
      <span class="frame-line bottom"></span>
      <span class="frame-line left"></span>

      <span class="corner tl">❧</span>
      <span class="corner tr">❧</span>
      <span class="corner bl">❧</span>
      <span class="corner br">❧</span>
    </div>

    <!-- ================= INVITATION ================= -->
    <div class="invitation-card">

      <!-- Gold border -->
      <div class="card-border"></div>

      <div class="card-content">

        <!-- ================= TOP ================= -->
        <header class="header">
          <div class="royal-symbol">
            <span></span>
            <b>✦</b>
            <span></span>
          </div>

          <div class="title">
            THIỆP MỜI
          </div>

          <div class="subtitle">
            WEDDING INVITATION
          </div>
        </header>

        <!-- ================= ORNAMENT ================= -->
        <div class="ornament">
          <span></span>
          <b>❦</b>
          <span></span>
        </div>

        <!-- ================= GUEST ================= -->
        <section class="guest-section">
          <div class="guest-label">
            TRÂN TRỌNG KÍNH MỜI
          </div>

          <div class="guest-name">
            {{ guestName }}
          </div>

          <div class="guest-description">
            đến tham dự lễ thành hôn của chúng tôi
          </div>
        </section>

        <!-- ================= COUPLE ================= -->
        <section class="couple">

          <div class="couple-name">
            {{ groom }}
          </div>

          <div class="couple-middle">
            <span></span>
            <i>&</i>
            <span></span>
          </div>

          <div class="couple-name">
            {{ bride }}
          </div>

        </section>

        <!-- ================= DATE ================= -->
        <section class="date-section">

          <div class="date-line"></div>

          <div class="date-label">
            HÔN LỄ
          </div>

          <div class="date">
            {{ dateLabel }}
          </div>

          <div class="date-line"></div>

        </section>

        <!-- ================= MESSAGE ================= -->
        <div class="message">
          <div class="quote-mark">“</div>

          <p>
            Sự hiện diện của quý khách<br />
            là niềm vinh hạnh lớn lao<br />
            đối với gia đình chúng tôi.
          </p>

          <div class="quote-mark bottom">”</div>
        </div>

        <!-- ================= OPEN BUTTON ================= -->
        <div class="open-area">

          <button
            class="open-btn"
            type="button"
            @click="$emit('open')"
          >
            <span class="btn-left">❧</span>

            <span class="btn-text">
              MỞ THIỆP
            </span>

            <span class="btn-right">❧</span>
          </button>

          <div class="open-hint">
            Chạm để mở thiệp cưới
          </div>

        </div>

        <!-- ================= FOOTER ================= -->
        <footer class="footer">

          <span></span>

          <div class="footer-center">
            <b>♥</b>
            <small>WITH LOVE</small>
          </div>

          <span></span>

        </footer>

      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  monogram: {
    type: String,
    default: "",
  },

  dateLabel: {
    type: String,
    default: "",
  },

  guestName: {
    type: String,
    default: "Quý Khách",
  },
});

const groom = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    "Chú Rể"
);

const bride = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    "Cô Dâu"
);
</script>

<style scoped>

/* =========================================================
   ROYAL RED WEDDING
   ========================================================= */

.opening {
  --red-1: #230004;
  --red-2: #390007;
  --red-3: #570810;
  --red-4: #790e18;

  --gold-1: #fff0b2;
  --gold-2: #e6c36d;
  --gold-3: #bd8b38;
  --gold-4: #80571d;

  position: relative;

  min-height: 100svh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 30px 15px;

  overflow: hidden;

  color: var(--gold-1);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  background:
    radial-gradient(
      ellipse at 50% 18%,
      rgba(139, 18, 31, .85),
      transparent 42%
    ),
    radial-gradient(
      ellipse at 50% 100%,
      rgba(125, 10, 21, .4),
      transparent 50%
    ),
    linear-gradient(
      145deg,
      var(--red-3),
      var(--red-2) 45%,
      var(--red-1)
    );
}


/* =========================================================
   BACKGROUND
   ========================================================= */

.bg-pattern {
  position: absolute;
  inset: 0;

  opacity: .15;

  background-image:
    radial-gradient(
      circle at center,
      transparent 0 55px,
      rgba(240, 208, 132, .12) 56px,
      transparent 57px
    );

  background-size: 170px 170px;

  mask-image:
    linear-gradient(
      to bottom,
      transparent,
      black 20%,
      black 80%,
      transparent
    );
}

.bg-glow {
  position: absolute;

  width: 500px;
  height: 500px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(236, 192, 91, .09),
      transparent 68%
    );

  filter: blur(20px);

  animation: glow 8s ease-in-out infinite;
}


/* =========================================================
   GOLD DUST
   ========================================================= */

.gold-dust {
  position: absolute;
  inset: 0;

  pointer-events: none;
}

.gold-dust i {
  position: absolute;

  width: 3px;
  height: 3px;

  border-radius: 50%;

  background: var(--gold-2);

  box-shadow:
    0 0 7px var(--gold-2);

  opacity: 0;

  animation:
    dust 5s ease-in-out infinite;
}

.gold-dust i:nth-child(1) {
  left: 14%;
  top: 18%;
  animation-delay: .3s;
}

.gold-dust i:nth-child(2) {
  left: 82%;
  top: 25%;
  animation-delay: 1.2s;
}

.gold-dust i:nth-child(3) {
  left: 10%;
  top: 52%;
  animation-delay: 2.1s;
}

.gold-dust i:nth-child(4) {
  left: 88%;
  top: 61%;
  animation-delay: 1.7s;
}

.gold-dust i:nth-child(5) {
  left: 23%;
  top: 76%;
  animation-delay: 2.8s;
}

.gold-dust i:nth-child(6) {
  left: 74%;
  top: 82%;
  animation-delay: 3.4s;
}

.gold-dust i:nth-child(7) {
  left: 34%;
  top: 13%;
  animation-delay: 1.5s;
}

.gold-dust i:nth-child(8) {
  left: 68%;
  top: 14%;
  animation-delay: 2.7s;
}

.gold-dust i:nth-child(9) {
  left: 6%;
  top: 72%;
  animation-delay: 1.9s;
}

.gold-dust i:nth-child(10) {
  left: 94%;
  top: 39%;
  animation-delay: 3s;
}

.gold-dust i:nth-child(11) {
  left: 38%;
  top: 88%;
  animation-delay: 1.1s;
}

.gold-dust i:nth-child(12) {
  left: 60%;
  top: 91%;
  animation-delay: 2.3s;
}

.gold-dust i:nth-child(13) {
  left: 28%;
  top: 41%;
  animation-delay: 3.1s;
}

.gold-dust i:nth-child(14) {
  left: 77%;
  top: 48%;
  animation-delay: .8s;
}


/* =========================================================
   OUTER FRAME
   ========================================================= */

.outer-frame {
  position: absolute;

  inset: 11px;

  border:
    1px solid
    rgba(230, 195, 109, .38);

  pointer-events: none;
}

.outer-frame::before {
  content: "";

  position: absolute;

  inset: 6px;

  border:
    1px solid
    rgba(230, 195, 109, .12);
}

.frame-line {
  position: absolute;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--gold-3),
      transparent
    );
}

.frame-line.top,
.frame-line.bottom {
  width: 70%;
  height: 1px;

  left: 15%;
}

.frame-line.top {
  top: 6px;
}

.frame-line.bottom {
  bottom: 6px;
}

.frame-line.right,
.frame-line.left {
  width: 1px;
  height: 70%;

  top: 15%;

  background:
    linear-gradient(
      180deg,
      transparent,
      var(--gold-3),
      transparent
    );
}

.frame-line.left {
  left: 6px;
}

.frame-line.right {
  right: 6px;
}


/* =========================================================
   CORNERS
   ========================================================= */

.corner {
  position: absolute;

  width: 45px;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family:
    "Great Vibes",
    cursive;

  font-size: 31px;

  color: var(--gold-2);

  opacity: .7;
}

.corner.tl {
  top: -5px;
  left: -4px;
}

.corner.tr {
  top: -5px;
  right: -4px;
  transform: scaleX(-1);
}

.corner.bl {
  bottom: -5px;
  left: -4px;
  transform: scaleY(-1);
}

.corner.br {
  bottom: -5px;
  right: -4px;
  transform: scale(-1);
}


/* =========================================================
   CARD
   ========================================================= */

.invitation-card {
  position: relative;

  z-index: 5;

  width: min(100%, 440px);

  background:
    linear-gradient(
      145deg,
      rgba(119, 10, 20, .98),
      rgba(68, 3, 9, .99)
    );

  border:
    1px solid
    rgba(236, 203, 119, .85);

  box-shadow:
    0 30px 90px rgba(0, 0, 0, .55),
    0 0 40px rgba(0, 0, 0, .25),
    inset 0 0 50px rgba(0, 0, 0, .18);

  animation:
    cardReveal 1s
    cubic-bezier(.22,1,.36,1)
    both;
}

.card-border {
  position: absolute;

  inset: 7px;

  border:
    1px solid
    rgba(240, 213, 139, .28);

  pointer-events: none;
}

.card-border::before {
  content: "";

  position: absolute;

  inset: 7px;

  border:
    1px solid
    rgba(240, 213, 139, .08);
}


/* =========================================================
   CONTENT
   ========================================================= */

.card-content {
  position: relative;

  padding:
    38px
    30px
    30px;

  text-align: center;
}


/* =========================================================
   HEADER
   ========================================================= */

.header {
  text-align: center;
}

.royal-symbol {
  display: flex;

  justify-content: center;
  align-items: center;

  gap: 10px;

  margin-bottom: 9px;
}

.royal-symbol span {
  width: 25px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--gold-3)
    );
}

.royal-symbol span:last-child {
  transform: rotate(180deg);
}

.royal-symbol b {
  color: var(--gold-1);

  font-size: 9px;
}

.title {
  color: var(--gold-1);

  font-size: 23px;
  font-weight: 600;

  letter-spacing: .2em;
}

.subtitle {
  margin-top: 5px;

  font-family: Arial, sans-serif;

  font-size: 7px;

  letter-spacing: .35em;

  color:
    rgba(240, 213, 139, .55);
}


/* =========================================================
   ORNAMENT
   ========================================================= */

.ornament {
  display: flex;

  align-items: center;

  gap: 9px;

  width: 170px;

  margin:
    19px
    auto
    24px;
}

.ornament span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--gold-3)
    );
}

.ornament span:last-child {
  transform: rotate(180deg);
}

.ornament b {
  font-family:
    "Great Vibes",
    cursive;

  font-size: 25px;

  font-weight: 400;

  color: var(--gold-1);
}


/* =========================================================
   GUEST
   ========================================================= */

.guest-section {
  margin-bottom: 25px;
}

.guest-label {
  font-size: 9px;

  letter-spacing: .28em;

  color:
    rgba(240, 213, 139, .72);
}

.guest-name {
  margin-top: 9px;

  color: #fff2c6;

  font-size: 28px;

  font-weight: 600;

  line-height: 1.2;

  text-shadow:
    0 3px 12px rgba(0,0,0,.3);
}

.guest-description {
  margin-top: 6px;

  color:
    rgba(255, 239, 194, .62);

  font-size: 12px;

  font-style: italic;
}


/* =========================================================
   COUPLE
   ========================================================= */

.couple-name {
  font-family:
    "Great Vibes",
    "Brush Script MT",
    cursive;
  font-weight: 400;
  font-size: 51px;

  line-height: .95;

  color: #fff1c5;

  text-shadow:
    0 3px 10px rgba(0,0,0,.35);
}

.couple-middle {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  margin: 8px auto;
}

.couple-middle span {
  width: 32px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--gold-3)
    );
}

.couple-middle span:last-child {
  transform: rotate(180deg);
}

.couple-middle i {
  color: var(--gold-1);

  font-size: 19px;

  font-style: italic;
}


/* =========================================================
   DATE
   ========================================================= */

.date-section {
  margin-top: 23px;
}

.date-line {
  width: 100px;

  height: 1px;

  margin: 0 auto 9px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--gold-3),
      transparent
    );
}

.date-section .date-line:last-child {
  margin:
    9px
    auto
    0;
}

.date-label {
  font-family: Arial, sans-serif;

  font-size: 7px;

  letter-spacing: .32em;

  color:
    rgba(240, 213, 139, .6);
}

.date {
  margin-top: 5px;

  font-size: 13px;

  letter-spacing: .22em;

  color: var(--gold-1);
}


/* =========================================================
   MESSAGE
   ========================================================= */

.message {
  position: relative;

  margin:
    22px
    auto
    24px;

  max-width: 290px;

  color:
    rgba(255, 239, 194, .68);

  font-size: 12px;

  line-height: 1.7;

  font-style: italic;
}

.message p {
  margin: 0;
}

.quote-mark {
  position: absolute;

  left: -7px;
  top: -14px;

  font-family: Georgia, serif;

  font-size: 28px;

  color:
    rgba(215, 174, 88, .45);
}

.quote-mark.bottom {
  left: auto;
  top: auto;

  right: -7px;
  bottom: -18px;
}


/* =========================================================
   OPEN BUTTON
   ========================================================= */

.open-area {
  margin-top: 5px;
}

.open-btn {
  position: relative;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 15px;

  min-width: 190px;

  height: 47px;

  padding: 0 25px;

  border:
    1px solid
    var(--gold-2);

  background:
    linear-gradient(
      135deg,
      rgba(231, 194, 103, .12),
      rgba(231, 194, 103, .03)
    );

  color: var(--gold-1);

  font-family:
    "Cormorant Garamond",
    serif;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: .25em;

  cursor: pointer;

  overflow: hidden;

  transition:
    .3s ease;
}

.open-btn::before {
  content: "";

  position: absolute;

  inset: 3px;

  border:
    1px solid
    rgba(240, 213, 139, .18);
}

.open-btn::after {
  content: "";

  position: absolute;

  top: 0;
  left: -100%;

  width: 60%;
  height: 100%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.18),
      transparent
    );

  transform: skewX(-20deg);

  animation:
    buttonShine 4s
    ease-in-out
    infinite;
}

.open-btn:hover {
  background:
    linear-gradient(
      135deg,
      var(--gold-2),
      var(--gold-3)
    );

  color: var(--red-dark);

  transform: translateY(-2px);

  box-shadow:
    0 10px 30px rgba(0,0,0,.3),
    0 0 25px rgba(230,195,109,.15);
}

.open-btn:active {
  transform: scale(.97);
}

.btn-left,
.btn-right {
  position: relative;

  z-index: 2;

  font-family:
    "Great Vibes",
    cursive;

  font-size: 18px;
}

.btn-right {
  transform: scaleX(-1);
}

.btn-text {
  position: relative;

  z-index: 2;
}

.open-hint {
  margin-top: 10px;

  font-size: 9px;

  letter-spacing: .08em;

  color:
    rgba(255,239,194,.38);
}


/* =========================================================
   FOOTER
   ========================================================= */

.footer {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-top: 25px;
}

.footer > span {
  width: 45px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(215,174,88,.35)
    );
}

.footer > span:last-child {
  transform: rotate(180deg);
}

.footer-center {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 2px;
}

.footer-center b {
  color:
    rgba(240,213,139,.7);

  font-size: 9px;
}

.footer-center small {
  font-family: Arial, sans-serif;

  font-size: 5px;

  letter-spacing: .25em;

  color:
    rgba(240,213,139,.35);
}


/* =========================================================
   ANIMATION
   ========================================================= */

@keyframes cardReveal {

  from {
    opacity: 0;

    transform:
      translateY(30px)
      scale(.97);
  }

  to {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }

}

@keyframes glow {

  0%,
  100% {
    transform: scale(.95);

    opacity: .6;
  }

  50% {
    transform: scale(1.08);

    opacity: 1;
  }

}

@keyframes dust {

  0%,
  100% {
    opacity: 0;

    transform:
      translateY(8px)
      scale(.5);
  }

  40% {
    opacity: .8;
  }

  70% {
    opacity: .25;

    transform:
      translateY(-18px)
      scale(1);
  }

}

@keyframes buttonShine {

  0%,
  55% {
    left: -100%;
  }

  75%,
  100% {
    left: 140%;
  }

}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 480px) {

  .opening {
    padding: 20px 12px;
  }

  .card-content {
    padding:
      32px
      22px
      25px;
  }

  .title {
    font-size: 21px;
  }

  .guest-name {
    font-size: 25px;
  }

  .couple-name {
    font-size: 45px;
  }

  .invitation-card {
    width: 100%;
  }

  .outer-frame {
    inset: 8px;
  }

  .message {
    font-size: 11px;
  }

}


/* =========================================================
   ACCESSIBILITY
   ========================================================= */

@media (prefers-reduced-motion: reduce) {

  .invitation-card,
  .bg-glow,
  .gold-dust i,
  .open-btn::after {
    animation: none !important;
  }

}
</style>
