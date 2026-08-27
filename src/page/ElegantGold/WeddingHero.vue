<template>
  <section class="eg-hero">

    <!-- DECORATIVE BACKGROUND -->

    <div class="hero-pattern"></div>

    <div class="hero-inner">

      <!-- TOP -->

      <div class="hero-top">

        <div class="hero-label">
          OUR WEDDING DAY
        </div>

        <div class="hero-script">
          Together with love
        </div>

      </div>

      <!-- IMAGE -->

      <div class="hero-photo-wrap">

        <div class="photo-decoration photo-left">
          <span></span>
        </div>

        <div class="photo-decoration photo-right">
          <span></span>
        </div>

        <div class="hero-photo">

          <img
            :src="heroImage"
            :alt="coupleAlt"
          />

          <div class="photo-overlay"></div>

          <div class="photo-monogram">
            {{ monogram }}
          </div>

        </div>

      </div>

      <!-- MONOGRAM -->

      <div class="hero-monogram">

        <span></span>

        <div>
          {{ monogram }}
        </div>

        <span></span>

      </div>

      <!-- NAMES -->

      <h1 class="hero-names">

        <span>
          {{ groomName }}
        </span>

        <small>&</small>

        <span>
          {{ brideName }}
        </span>

      </h1>

      <!-- DATE -->

      <div class="hero-date">
        {{ dateLabel }}
      </div>

      <!-- ORNAMENT -->

      <div class="hero-ornament">

        <span></span>

        <i>✦</i>

        <span></span>

      </div>

      <!-- MESSAGE -->

      <p class="hero-message">
        "Hai người xa lạ,
        <br />
        tìm thấy nhau giữa hàng triệu người."
      </p>

      <!-- SCROLL -->

      <div class="hero-scroll">

        <span>
          SCROLL TO DISCOVER
        </span>

        <div class="scroll-line">
          <i></i>
        </div>

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
    default: "G&B",
  },

  dateLabel: {
    type: String,
    default: "",
  },
});

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

const heroImage = computed(() => {
  return (
    props.wedding?.hero?.Image ||
    props.wedding?.hero?.coverImage ||
    props.wedding?.coverImage ||
    props.wedding?.couple?.bride?.avatar ||
    ""
  );
});

const coupleAlt = computed(() => {
  return `${groomName.value} & ${brideName.value}`;
});
</script>

<style scoped>
/* =====================================================
   ROOT
===================================================== */

.eg-hero {
  position: relative;

  min-height:
    100svh;

  display: flex;

  align-items: center;
  justify-content: center;

  padding:
    100px 25px 80px;

  box-sizing: border-box;

  overflow: hidden;

  background:
    #f7f2e8;

  color: #342d24;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;
}

/* =====================================================
   BACKGROUND
===================================================== */

.hero-pattern {
  position: absolute;

  inset: 0;

  pointer-events: none;

  opacity: .5;

  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(212,175,55,.09),
      transparent 22%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(212,175,55,.07),
      transparent 25%
    );
}

.hero-pattern::before {
  content: "";

  position: absolute;

  inset: 25px;

  border:
    1px solid
    rgba(174,138,57,.13);
}

/* =====================================================
   INNER
===================================================== */

.hero-inner {
  position: relative;

  z-index: 2;

  width: min(
    100%,
    650px
  );

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  animation:
    heroReveal 1.2s
    cubic-bezier(.22,1,.36,1)
    both;
}

/* =====================================================
   TOP
===================================================== */

.hero-top {
  margin-bottom: 30px;
}

.hero-label {
  color: #a7894a;

  font-family:
    Arial,
    sans-serif;

  font-size: 8px;

  letter-spacing: 4px;
}

.hero-script {
  margin-top: 11px;

  color: #bd9541;

  font-family:
    "Allura",
    cursive;

  font-size: 31px;

  line-height: 1;
}

/* =====================================================
   PHOTO
===================================================== */

.hero-photo-wrap {
  position: relative;

  width:
    min(78vw, 350px);

  aspect-ratio:
    3 / 4;

  margin:
    0 auto 28px;
}

.hero-photo {
  position: absolute;

  inset: 11px;

  overflow: hidden;

  background:
    #e8dfcf;

  border:
    1px solid
    rgba(169,132,49,.5);

  box-shadow:
    0 20px 50px
    rgba(70,55,30,.14);
}

.hero-photo img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  object-position: center;

  filter:
    saturate(.88)
    contrast(.98);

  transition:
    transform 1.2s
    cubic-bezier(.22,1,.36,1);
}

.eg-hero:hover
.hero-photo img {
  transform:
    scale(1.035);
}

.photo-overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      180deg,
      transparent 55%,
      rgba(30,25,18,.28)
    );
}

.photo-monogram {
  position: absolute;

  left: 50%;
  bottom: 20px;

  transform:
    translateX(-50%);

  width: 52px;
  height: 52px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(239,217,156,.75);

  border-radius: 50%;

  background:
    rgba(35,29,20,.25);

  backdrop-filter:
    blur(4px);

  color: #f6e7bd;

  font-size: 14px;

  letter-spacing: 2px;
}

/* =====================================================
   PHOTO DECORATION
===================================================== */

.photo-decoration {
  position: absolute;

  top: 0;
  bottom: 0;

  width: 20px;
}

.photo-decoration span {
  position: absolute;

  top: 50%;

  width: 8px;
  height: 8px;

  border:
    1px solid
    #bd9541;

  transform:
    translateY(-50%)
    rotate(45deg);
}

.photo-left {
  left: -13px;

  border-left:
    1px solid
    rgba(189,149,65,.5);
}

.photo-left span {
  left: -4px;
}

.photo-right {
  right: -13px;

  border-right:
    1px solid
    rgba(189,149,65,.5);
}

.photo-right span {
  right: -4px;
}

/* =====================================================
   MONOGRAM
===================================================== */

.hero-monogram {
  display: flex;

  align-items: center;

  gap: 15px;

  margin-bottom: 15px;
}

.hero-monogram span {
  width: 48px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(172,135,51,.6)
    );
}

.hero-monogram span:last-child {
  background:
    linear-gradient(
      90deg,
      rgba(172,135,51,.6),
      transparent
    );
}

.hero-monogram div {
  color: #a27e36;

  font-size: 18px;

  letter-spacing: 3px;
}

/* =====================================================
   NAMES
===================================================== */

.hero-names {
  display: flex;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 9px;

  margin: 0;

  color: #312a21;

  font-size:
    clamp(38px, 8vw, 58px);

  font-weight: 400;

  line-height: .9;

  letter-spacing: -.5px;
}

.hero-names small {
  color: #bb9340;

  font-family:
    "Allura",
    cursive;

  font-size:
    clamp(31px, 7vw, 43px);

  font-weight: 400;
}

/* =====================================================
   DATE
===================================================== */

.hero-date {
  margin-top: 18px;

  color: #87745a;

  font-size: 15px;

  letter-spacing: 2.5px;
}

/* =====================================================
   ORNAMENT
===================================================== */

.hero-ornament {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-top: 17px;
}

.hero-ornament span {
  width: 50px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(180,140,52,.55)
    );
}

.hero-ornament span:last-child {
  background:
    linear-gradient(
      90deg,
      rgba(180,140,52,.55),
      transparent
    );
}

.hero-ornament i {
  color: #c39c42;

  font-size: 7px;

  font-style: normal;
}

/* =====================================================
   MESSAGE
===================================================== */

.hero-message {
  margin:
    18px auto 0;

  max-width: 390px;

  color: #897b67;

  font-size: 16px;

  font-style: italic;

  line-height: 1.5;
}

/* =====================================================
   SCROLL
===================================================== */

.hero-scroll {
  margin-top: 42px;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 9px;

  color:
    rgba(125,108,80,.65);

  font-family:
    Arial,
    sans-serif;

  font-size: 7px;

  letter-spacing: 3px;
}

.scroll-line {
  position: relative;

  width: 1px;

  height: 38px;

  overflow: hidden;

  background:
    rgba(170,137,68,.18);
}

.scroll-line i {
  position: absolute;

  top: -10px;
  left: 0;

  width: 1px;
  height: 15px;

  background:
    #ae883b;

  animation:
    scrollDown 2s
    ease-in-out
    infinite;
}

/* =====================================================
   ANIMATION
===================================================== */

@keyframes heroReveal {
  from {
    opacity: 0;

    transform:
      translateY(35px);
  }

  to {
    opacity: 1;

    transform:
      translateY(0);
  }
}

@keyframes scrollDown {
  0% {
    transform:
      translateY(0);
  }

  70%,
  100% {
    transform:
      translateY(50px);
  }
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {
  .eg-hero {
    min-height:
      auto;

    padding:
      85px 20px 70px;
  }

  .hero-pattern::before {
    inset: 12px;
  }

  .hero-photo-wrap {
    width:
      min(78vw, 310px);

    margin-bottom: 25px;
  }

  .hero-top {
    margin-bottom: 25px;
  }

  .hero-script {
    font-size: 28px;
  }

  .hero-names {
    font-size:
      clamp(35px, 10vw, 50px);
  }

  .hero-date {
    font-size: 13px;

    letter-spacing: 2px;
  }

  .hero-message {
    font-size: 15px;
  }

  .hero-scroll {
    margin-top: 35px;
  }
}
</style>