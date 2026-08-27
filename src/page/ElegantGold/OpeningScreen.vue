<template>
  <section
    class="eg-opening"
    :class="{ 'is-opening': isOpening }"
    :style="backgroundStyle"
  >
    <!-- BACKGROUND -->

    <div class="opening-backdrop"></div>

    <div class="opening-overlay"></div>

    <!-- DECORATIVE FRAME -->

    <div class="opening-frame">
      <span class="corner corner-tl"></span>
      <span class="corner corner-tr"></span>
      <span class="corner corner-bl"></span>
      <span class="corner corner-br"></span>
    </div>

    <!-- CONTENT -->

    <div class="opening-content">

      <!-- TOP LABEL -->

      <div class="opening-label">
        <span class="line"></span>

        <span>
          THE WEDDING INVITATION
        </span>

        <span class="line"></span>
      </div>

      <!-- SMALL SCRIPT -->

      <div class="opening-script">
        A beautiful beginning
      </div>

      <!-- MONOGRAM -->

      <div class="monogram-wrap">

        <div class="monogram-ring ring-outer"></div>

        <div class="monogram-ring ring-inner"></div>

        <div class="monogram">
          {{ monogram }}
        </div>

      </div>

      <!-- NAMES -->

      <h1 class="couple-name">

        <span>
          {{ groomName }}
        </span>

        <small>&</small>

        <span>
          {{ brideName }}
        </span>

      </h1>

      <!-- DATE -->

      <div class="opening-date">
        {{ dateLabel }}
      </div>

      <!-- ORNAMENT -->

      <div class="opening-ornament">
        <span></span>

        <i>✦</i>

        <span></span>
      </div>

      <!-- INVITATION -->

      <p class="opening-message">
        Trân trọng kính mời bạn
        <br />
        đến chung vui cùng chúng mình
      </p>

      <!-- OPEN BUTTON -->

      <button
        type="button"
        class="open-button"
        :disabled="isOpening"
        @click="openInvitation"
      >
        <span class="button-border"></span>

        <span class="button-content">

          <span class="button-label">
            {{ isOpening
              ? "Đang mở thiệp"
              : "Mở thiệp"
            }}
          </span>

          <span class="button-arrow">
            ↓
          </span>

        </span>
      </button>

      <!-- BOTTOM -->

      <div class="opening-bottom">
        <span>
          WITH LOVE
        </span>

        <i>·</i>

        <span>
          {{ currentYear }}
        </span>
      </div>

    </div>

    <!-- GOLD LIGHT -->

    <div class="gold-light"></div>

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
    default: () => ({}),
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

const currentYear =
  new Date().getFullYear();

const groomName = computed(() => {
  return (
    props.wedding?.GroomName ||
    props.wedding?.couple?.groom?.name ||
    "Groom"
  );
});

const brideName = computed(() => {
  return (
    props.wedding?.BrideName ||
    props.wedding?.couple?.bride?.name ||
    "Bride"
  );
});

const backgroundImage = computed(() => {
  return (
    props.wedding?.coverImage ||
    props.wedding?.hero?.background ||
    props.wedding?.hero?.Image ||
    props.wedding?.couple?.groom?.avatar ||
    ""
  );
});

const backgroundStyle = computed(() => {
  if (!backgroundImage.value) {
    return {};
  }

  return {
    "--eg-opening-image":
      `url("${backgroundImage.value}")`,
  };
});

function openInvitation() {
  if (isOpening.value) {
    return;
  }

  isOpening.value = true;

  setTimeout(() => {
    emit("open");
  }, 900);
}
</script>

<style scoped>
/* =====================================================
   ROOT
===================================================== */

.eg-opening {
  --gold: #d4af37;
  --gold-light: #e4ca82;
  --cream: #f8f1df;
  --dark: #211e18;

  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: center;
  justify-content: center;

  min-height: 100svh;

  overflow: hidden;

  isolation: isolate;

  color: var(--cream);

  background:
    #211e18;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  transition:
    opacity .9s ease,
    transform 1s cubic-bezier(.77,0,.18,1);
}

/* =====================================================
   BACKGROUND
===================================================== */

.opening-backdrop {
  position: absolute;

  inset: 0;

  z-index: -3;

  background:
    var(--eg-opening-image)
    center / cover
    no-repeat;

  transform:
    scale(1.04);

  filter:
    saturate(.65)
    contrast(1.05);

  animation:
    openingZoom 14s ease-out
    infinite alternate;
}

.opening-overlay {
  position: absolute;

  inset: 0;

  z-index: -2;

  background:
    linear-gradient(
      180deg,
      rgba(22,19,14,.72) 0%,
      rgba(22,19,14,.34) 42%,
      rgba(22,19,14,.78) 100%
    );
}

.opening-overlay::after {
  content: "";

  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at center,
      transparent 15%,
      rgba(15,12,8,.35) 100%
    );
}

/* =====================================================
   FRAME
===================================================== */

.opening-frame {
  position: absolute;

  inset: 24px;

  border:
    1px solid
    rgba(225,202,130,.38);

  pointer-events: none;
}

.opening-frame::before,
.opening-frame::after {
  content: "";

  position: absolute;

  left: 50%;

  width: 80px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--gold),
      transparent
    );

  transform:
    translateX(-50%);
}

.opening-frame::before {
  top: -1px;
}

.opening-frame::after {
  bottom: -1px;
}

.corner {
  position: absolute;

  width: 35px;
  height: 35px;

  border-color:
    rgba(228,202,130,.8);

  border-style: solid;
}

.corner-tl {
  top: -1px;
  left: -1px;

  border-width:
    1px 0 0 1px;
}

.corner-tr {
  top: -1px;
  right: -1px;

  border-width:
    1px 1px 0 0;
}

.corner-bl {
  bottom: -1px;
  left: -1px;

  border-width:
    0 0 1px 1px;
}

.corner-br {
  right: -1px;
  bottom: -1px;

  border-width:
    0 1px 1px 0;
}

/* =====================================================
   CONTENT
===================================================== */

.opening-content {
  position: relative;

  z-index: 5;

  width: min(
    calc(100% - 70px),
    700px
  );

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  animation:
    contentReveal 1.2s
    cubic-bezier(.22,1,.36,1)
    both;
}

/* =====================================================
   LABEL
===================================================== */

.opening-label {
  display: flex;

  align-items: center;

  gap: 12px;

  color:
    rgba(243,225,177,.8);

  font-family:
    Arial,
    sans-serif;

  font-size: 8px;

  letter-spacing: 4px;

  white-space: nowrap;
}

.opening-label .line {
  width: 35px;

  height: 1px;

  background:
    rgba(212,175,55,.6);
}

/* =====================================================
   SCRIPT
===================================================== */

.opening-script {
  margin-top: 22px;

  color:
    var(--gold-light);

  font-family:
    "Allura",
    cursive;

  font-size:
    clamp(27px, 6vw, 39px);

  line-height: 1;
}

/* =====================================================
   MONOGRAM
===================================================== */

.monogram-wrap {
  position: relative;

  width: 120px;
  height: 120px;

  margin:
    25px 0 22px;

  display: flex;

  align-items: center;
  justify-content: center;
}

.monogram-ring {
  position: absolute;

  border-radius: 50%;
}

.ring-outer {
  inset: 0;

  border:
    1px solid
    rgba(212,175,55,.75);
}

.ring-inner {
  inset: 8px;

  border:
    1px solid
    rgba(228,202,130,.35);
}

.monogram {
  color:
    #f5e4b5;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 28px;

  letter-spacing: 3px;

  text-shadow:
    0 2px 15px
    rgba(0,0,0,.4);
}

.monogram-wrap::before,
.monogram-wrap::after {
  content: "✦";

  position: absolute;

  color:
    rgba(225,198,113,.8);

  font-size: 7px;
}

.monogram-wrap::before {
  top: 2px;
}

.monogram-wrap::after {
  bottom: 2px;
}

/* =====================================================
   NAMES
===================================================== */

.couple-name {
  display: flex;

  flex-direction: column;

  align-items: center;

  margin: 0;

  color:
    #fff8e9;

  font-size:
    clamp(40px, 9vw, 72px);

  font-weight: 400;

  line-height: .78;

  letter-spacing: -.5px;

  text-shadow:
    0 3px 25px
    rgba(0,0,0,.45);
}

.couple-name small {
  margin:
    12px 0 10px;

  color:
    var(--gold-light);

  font-family:
    "Allura",
    cursive;

  font-size:
    clamp(32px, 7vw, 48px);

  font-weight: 400;

  line-height: 1;
}

/* =====================================================
   DATE
===================================================== */

.opening-date {
  margin-top: 27px;

  color:
    rgba(247,232,196,.9);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(14px, 3vw, 17px);

  letter-spacing: 3px;
}

/* =====================================================
   ORNAMENT
===================================================== */

.opening-ornament {
  display: flex;

  align-items: center;

  gap: 10px;

  margin:
    17px 0 10px;
}

.opening-ornament span {
  width: 55px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(212,175,55,.7)
    );
}

.opening-ornament span:last-child {
  background:
    linear-gradient(
      90deg,
      rgba(212,175,55,.7),
      transparent
    );
}

.opening-ornament i {
  color: var(--gold);

  font-size: 7px;

  font-style: normal;
}

/* =====================================================
   MESSAGE
===================================================== */

.opening-message {
  margin:
    0 0 25px;

  color:
    rgba(249,238,211,.72);

  font-size: 15px;

  line-height: 1.55;
}

/* =====================================================
   BUTTON
===================================================== */

.open-button {
  position: relative;

  min-width: 160px;

  padding: 0;

  border: 0;

  background: transparent;

  color: inherit;

  cursor: pointer;
}

.button-border {
  position: absolute;

  inset: 0;

  border:
    1px solid
    rgba(212,175,55,.65);

  transform:
    translate(5px, 5px);

  transition:
    transform .35s ease;
}

.button-content {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 15px;

  padding:
    13px 20px;

  border:
    1px solid
    rgba(235,214,155,.65);

  background:
    rgba(30,27,21,.22);

  backdrop-filter:
    blur(5px);

  color:
    #f6e8c3;

  font-family:
    Arial,
    sans-serif;

  font-size: 8px;

  letter-spacing: 3px;

  transition:
    background .35s ease,
    color .35s ease;
}

.button-arrow {
  font-size: 13px;

  transition:
    transform .35s ease;
}

.open-button:hover .button-border {
  transform:
    translate(2px, 2px);
}

.open-button:hover .button-content {
  background:
    rgba(212,175,55,.16);
}

.open-button:hover .button-arrow {
  transform:
    translateY(3px);
}

/* =====================================================
   BOTTOM
===================================================== */

.opening-bottom {
  margin-top: 28px;

  display: flex;

  gap: 9px;

  color:
    rgba(242,223,176,.35);

  font-family:
    Arial,
    sans-serif;

  font-size: 7px;

  letter-spacing: 3px;
}

.opening-bottom i {
  color:
    rgba(212,175,55,.7);

  font-style: normal;
}

/* =====================================================
   GOLD LIGHT
===================================================== */

.gold-light {
  position: absolute;

  z-index: 1;

  width: 450px;
  height: 450px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(212,175,55,.11),
      transparent 65%
    );

  pointer-events: none;

  animation:
    lightPulse 6s ease-in-out
    infinite;
}

/* =====================================================
   OPEN ANIMATION
===================================================== */

.eg-opening.is-opening {
  opacity: 0;

  transform:
    scale(1.04);

  pointer-events: none;
}

.eg-opening.is-opening
.opening-content {
  transform:
    translateY(-20px)
    scale(.97);

  opacity: 0;

  transition:
    all .65s ease;
}

/* =====================================================
   ANIMATIONS
===================================================== */

@keyframes openingZoom {
  from {
    transform: scale(1.04);
  }

  to {
    transform: scale(1.10);
  }
}

@keyframes contentReveal {
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

@keyframes lightPulse {
  0%,
  100% {
    opacity: .45;
  }

  50% {
    opacity: .9;
  }
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {
  .opening-frame {
    inset: 12px;
  }

  .opening-content {
    width:
      calc(100% - 55px);
  }

  .opening-label {
    font-size: 7px;

    letter-spacing: 3px;
  }

  .opening-label .line {
    width: 22px;
  }

  .monogram-wrap {
    width: 95px;
    height: 95px;

    margin:
      22px 0 20px;
  }

  .monogram {
    font-size: 23px;
  }

  .couple-name {
    font-size:
      clamp(38px, 12vw, 56px);
  }

  .opening-date {
    letter-spacing: 2px;
  }

  .opening-message {
    font-size: 14px;
  }
}
</style>