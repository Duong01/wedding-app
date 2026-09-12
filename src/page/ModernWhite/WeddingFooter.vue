<template>
  <footer class="footer">

    <div class="footer-cloud cloud-1"></div>
    <div class="footer-cloud cloud-2"></div>

    <div class="footer-inner">

      <div class="footer-symbol">
        囍
      </div>

      <div class="footer-monogram">
        {{ monogram }}
      </div>

      <h2>
        {{ groomName }}
        <span>&</span>
        {{ brideName }}
      </h2>

      <div class="footer-line">
        <span></span>
        <i>❖</i>
        <span></span>
      </div>

      <p>
        CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI
        CÙNG CHÚNG MÌNH
      </p>

      <div class="footer-date">
        {{ weddingDate }}
      </div>

      <small>
        © {{ currentYear }}
      </small>

    </div>

  </footer>
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

  currentYear: {
    type: Number,
    default: 2026,
  },
});

const wedding = computed(() => props.wedding || {});

const groomName = computed(() => {
  return wedding.value?.GroomName ||
    wedding.value?.groom?.name ||
    "Chú Rể";
});

const brideName = computed(() => {
  return wedding.value?.BrideName ||
    wedding.value?.bride?.name ||
    "Cô Dâu";
});

const weddingDate = computed(() => {
  return (
    wedding.value?.weddingDate ||
    wedding.value?.hero?.weddingDate ||
    ""
  );
});
</script>

<style scoped>

/* =====================================================
   FOOTER
===================================================== */

.footer {
  position: relative;

  width: 100%;
  min-height: 390px;

  overflow: hidden;

  box-sizing: border-box;

  color: #711519;

  text-align: center;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  background:
    linear-gradient(
      180deg,
      #fffaf0 0%,
      #f8edd9 52%,
      #f0dfc1 100%
    );

}


/* =====================================================
   DECORATIVE FRAME
===================================================== */

.footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border:
    1px solid
    rgba(169, 126, 61, .35);

  pointer-events: none;
}


.footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(169, 126, 61, .14);

  pointer-events: none;
}


/* =====================================================
   INNER
===================================================== */

.footer-inner {
  position: relative;

  z-index: 3;

  display: flex;

  flex-direction: column;

  align-items: center;

  box-sizing: border-box;

  min-height: 390px;

  padding:
    48px
    24px
    28px;
}


/* =====================================================
   DOUBLE HAPPINESS
===================================================== */

.footer-symbol {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: clamp(52px, 16vw, 66px);
  height: clamp(52px, 16vw, 66px);

  color: #9a171b;

  font-family:
    "Times New Roman",
    serif;

  font-size: clamp(42px, 13vw, 55px);

  font-weight: 700;

  line-height: 1;

  border:
    1px solid
    rgba(164, 117, 52, .5);

  background:
    rgba(255,250,238,.72);

  box-shadow:
    0 5px 18px
    rgba(112, 53, 24, .07);
}


/*
 * Góc trang trí nhỏ
 */

.footer-symbol::before,
.footer-symbol::after {
  content: "";

  position: absolute;

  width: 7px;
  height: 7px;

  border:
    1px solid
    #b58a48;

  transform: rotate(45deg);

  background: #fff8e9;
}


.footer-symbol::before {
  top: -5px;
  left: -5px;
}


.footer-symbol::after {
  right: -5px;
  bottom: -5px;
}


/* =====================================================
   MONOGRAM
===================================================== */

.footer-monogram {
  margin-top: 15px;

  color: #a77c3e;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 4px;

  text-transform: uppercase;
}


/* =====================================================
   NAMES
===================================================== */

.footer h2 {
  margin:
    13px
    0
    0;

  color: #761519;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 22px;

  font-weight: 800;

  letter-spacing: .8px;

  line-height: 1.4;
}


.footer h2 span {
  display: inline-block;

  margin:
    0
    7px;

  color: #b28a4c;

  font-family:
    Georgia,
    serif;

  font-size: 17px;

  font-weight: 400;
}


/* =====================================================
   DECORATION
===================================================== */

.footer-line {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  width: 100%;

  margin:
    16px
    0
    15px;
}


.footer-line span {
  width: 42px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b58a49
    );
}


.footer-line span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b58a49
    );
}


.footer-line i {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 19px;
  height: 19px;

  color: #a0171b;

  font-family:
    "Times New Roman",
    serif;

  font-size: 12px;

  font-style: normal;

  border:
    1px solid
    rgba(181, 138, 73, .45);

  transform: rotate(45deg);
}


.footer-line i::first-letter {
  transform: rotate(-45deg);
}


/* =====================================================
   THANK YOU
===================================================== */

.footer p {
  max-width: 280px;

  margin: 0 auto;

  color: #78614b;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 10px;

  font-weight: 500;

  line-height: 1.8;

  letter-spacing: 1.5px;
}


/* =====================================================
   WEDDING DATE
===================================================== */

.footer-date {
  margin-top: 18px;

  padding:
    7px
    15px;

  color: #861519;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 2px;

  border-top:
    1px solid
    rgba(181, 138, 73, .35);

  border-bottom:
    1px solid
    rgba(181, 138, 73, .35);
}


/* =====================================================
   COPYRIGHT
===================================================== */

.footer small {
  display: block;

  margin-top: auto;

  padding-top: 23px;

  color: #a68b66;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 8px;

  font-weight: 500;

  letter-spacing: 1px;
}


/* =====================================================
   CLOUD
===================================================== */

.footer-cloud {
  position: absolute;

  z-index: 1;

  width: 190px;
  height: 90px;

  opacity: .13;

  pointer-events: none;

  background:
    radial-gradient(
      circle at 22% 70%,
      #9d743a 0 18%,
      transparent 19%
    ),
    radial-gradient(
      circle at 45% 42%,
      #9d743a 0 28%,
      transparent 29%
    ),
    radial-gradient(
      circle at 68% 67%,
      #9d743a 0 22%,
      transparent 23%
    ),
    radial-gradient(
      circle at 88% 55%,
      #9d743a 0 14%,
      transparent 15%
    );
}


.cloud-1 {
  left: -75px;
  bottom: 12px;

  transform:
    rotate(-4deg);
}


.cloud-2 {
  right: -75px;
  bottom: 72px;

  transform:
    scaleX(-1)
    rotate(-4deg);
}


/* =====================================================
   SMALL DECORATIVE DIAMONDS
===================================================== */

.footer-inner::before,
.footer-inner::after {
  content: "✦";

  position: absolute;

  z-index: -1;

  color: rgba(165, 122, 59, .35);

  font-size: 18px;
}


.footer-inner::before {
  top: 32px;
  left: 25px;
}


.footer-inner::after {
  top: 32px;
  right: 25px;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {

  .footer {
    min-height: 370px;
  }


  .footer::before {
    inset: 10px;
  }


  .footer::after {
    inset: 15px;
  }


  .footer-inner {
    min-height: 370px;

    padding:
      42px
      20px
      24px;
  }


  .footer-symbol {
    width: 60px;
    height: 60px;

    font-size: 50px;
  }


  .footer-monogram {
    margin-top: 13px;

    font-size: 8px;

    letter-spacing: 3px;
  }


  .footer h2 {
    margin-top: 11px;

    font-size: 19px;

    letter-spacing: .5px;
  }


  .footer h2 span {
    margin:
      0
      5px;

    font-size: 15px;
  }


  .footer-line {
    margin:
      14px
      0;
  }


  .footer-line span {
    width: 34px;
  }


  .footer p {
    max-width: 250px;

    font-size: 9px;

    line-height: 1.8;

    letter-spacing: 1.2px;
  }


  .footer-date {
    margin-top: 16px;

    font-size: 10px;

    letter-spacing: 1.5px;
  }


  .footer small {
    font-size: 7px;
  }

}
</style>
