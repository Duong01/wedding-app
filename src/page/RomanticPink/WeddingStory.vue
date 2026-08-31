<template>
  <section class="story">

    <!-- DECORATION -->
    <img
      :src="may"
      class="story-cloud story-cloud-top"
      alt=""
    />

    <img
      :src="may"
      class="story-cloud story-cloud-bottom"
      alt=""
    />

    <!-- CARD -->
    <div class="story-card">

      <div class="story-card-inner">

        <!-- HEADER -->
        <div class="story-header">

          <span class="story-eyebrow">
            CÂU CHUYỆN CỦA CHÚNG MÌNH
          </span>

          <div class="story-title-row">

            <span class="title-line"></span>

            <h2>
              THÔNG TIN VỀ CHÚNG MÌNH
            </h2>

            <span class="title-line"></span>

          </div>

          <div class="story-symbol">
            囍
          </div>

        </div>


        <!-- CONTENT -->
        <div
          v-if="storyText"
          class="story-content"
        >

          <span class="quote quote-left">
            “
          </span>

          <p>
            {{ storyText }}
          </p>

          <span class="quote quote-right">
            ”
          </span>

        </div>


        <!-- BOTTOM DECORATION -->
        <div class="story-footer">

          <span></span>

          <b>✦</b>

          <span></span>

        </div>

      </div>

    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";
import { may } from "./nhatBinhDoAssets";

const props = defineProps({
  story: {
    type: [String, Object],
    default: "",
  },
});


const storyText = computed(() => {

  if (typeof props.story === "string") {
    return props.story;
  }

  return (
    props.story?.Content ||
    props.story?.Description ||
    props.story?.Text ||
    ""
  );
});
</script>


<style scoped>

/* =========================================================
   ROOT
========================================================= */

.story {
  position: relative;

  width: 100%;

  padding:
    15px
    8px
    25px;

  color: #541b1d;

  text-align: center;

  overflow: hidden;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;
}


/* =========================================================
   DECORATIVE CLOUD
========================================================= */

.story-cloud {
  position: absolute;

  pointer-events: none;

  user-select: none;

  z-index: 0;

  opacity: .16;

  filter:
    saturate(.7);
}


.story-cloud-top {
  width: 150px;

  top: -25px;
  right: -55px;

  transform:
    rotate(3deg);
}


.story-cloud-bottom {
  width: 125px;

  bottom: -35px;
  left: -55px;

  opacity: .11;

  transform:
    rotate(180deg);
}


/* =========================================================
   CARD
========================================================= */

.story-card {
  position: relative;

  z-index: 2;

  width: min(100%, 650px);

  margin: 0 auto;

  padding: 1px;

  background:
    linear-gradient(
      135deg,
      rgba(151, 112, 53, .8),
      rgba(221, 196, 145, .45),
      rgba(151, 112, 53, .8)
    );

  box-shadow:
    0 12px 35px
    rgba(84, 25, 25, .07);
}


/* =========================================================
   INNER FRAME
========================================================= */

.story-card-inner {
  position: relative;

  padding:
    38px
    28px
    30px;

  background:
    linear-gradient(
      180deg,
      #fffdf9 0%,
      #faf7ef 100%
    );

  border:
    1px solid
    rgba(155, 112, 55, .35);
}


/* =========================================================
   CORNER DECORATION
========================================================= */

.story-card-inner::before,
.story-card-inner::after {
  content: "";

  position: absolute;

  width: 22px;
  height: 22px;

  border-color:
    rgba(157, 116, 57, .65);

  pointer-events: none;
}


/* top-left */

.story-card-inner::before {
  top: 10px;
  left: 10px;

  border-top: 1px solid;
  border-left: 1px solid;
}


/* bottom-right */

.story-card-inner::after {
  right: 10px;
  bottom: 10px;

  border-right: 1px solid;
  border-bottom: 1px solid;
}


/* =========================================================
   HEADER
========================================================= */

.story-header {
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;
}


/* =========================================================
   EYEBROW
========================================================= */

.story-eyebrow {
  display: block;

  margin-bottom: 10px;

  color: #a27a3c;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 3px;

  line-height: 1.4;
}


/* =========================================================
   TITLE ROW
========================================================= */

.story-title-row {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  width: 100%;
}


.story-title-row h2 {
  margin: 0;

  color: #761418;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 18px;

  font-weight: 700;

  letter-spacing: 1.2px;

  line-height: 1.3;

  white-space: nowrap;
}


.Title-line {
  width: 38px;
  height: 1px;

  flex-shrink: 1;

  background:
    linear-gradient(
      to right,
      transparent,
      #b18a4d
    );
}


.Title-line:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b18a4d
    );
}


/* =========================================================
   DOUBLE HAPPINESS
========================================================= */

.story-symbol {
  position: relative;

  margin-top: 12px;

  color: #9a151a;

  font-family:
    "Times New Roman",
    serif;

  font-size: 34px;

  font-weight: 700;

  line-height: 1;

  text-shadow:
    0 2px 5px
    rgba(140, 20, 25, .12);
}


/* =========================================================
   CONTENT
========================================================= */

.story-content {
  position: relative;

  max-width: 510px;

  margin:
    27px
    auto
    0;

  padding:
    25px
    35px;

  background:
    rgba(255, 255, 255, .55);

  border:
    1px solid
    rgba(170, 132, 72, .18);

  box-shadow:
    inset 0 0 0 4px
    rgba(181, 140, 77, .035);
}


.story-content p {
  position: relative;

  z-index: 2;

  margin: 0;

  color: #51483f;

  font-size: 14px;

  font-weight: 500;

  line-height: 2;

  letter-spacing: .15px;
}


/* =========================================================
   QUOTES
========================================================= */

.quote {
  position: absolute;

  color: #a77b3c;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 42px;

  font-weight: 700;

  line-height: 1;

  opacity: .55;
}


.quote-left {
  top: 8px;
  left: 12px;
}


.quote-right {
  right: 12px;
  bottom: -7px;
}


/* =========================================================
   FOOTER DECORATION
========================================================= */

.story-footer {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-top: 24px;
}


.story-footer span {
  width: 45px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b58a45
    );
}


.story-footer span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b58a45
    );
}


.story-footer b {
  color: #9a161a;

  font-size: 8px;

  font-weight: 700;
}


/* =========================================================
   HOVER
========================================================= */

@media (hover: hover) {

  .story-card {
    transition:
      transform .3s ease,
      box-shadow .3s ease;
  }

  .story-card:hover {
    transform: translateY(-2px);

    box-shadow:
      0 16px 42px
      rgba(84, 25, 25, .10);
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 520px) {

  .story {
    padding:
      10px
      5px
      20px;
  }


  .story-card-inner {
    padding:
      30px
      15px
      25px;
  }


  .story-eyebrow {
    font-size: 8px;

    letter-spacing: 2.2px;
  }


  .story-title-row {
    gap: 7px;
  }


  .story-title-row h2 {
    font-size: 17px;

    letter-spacing: .8px;
  }


  .Title-line {
    width: 24px;
  }


  .story-symbol {
    margin-top: 10px;

    font-size: 31px;
  }


  .story-content {
    margin-top: 23px;

    padding:
      22px
      23px;
  }


  .story-content p {
    font-size: 13px;

    line-height: 1.9;
  }


  .quote {
    font-size: 34px;
  }


  .story-cloud-top {
    width: 120px;
  }


  .story-cloud-bottom {
    width: 100px;
  }

}


/* =========================================================
   VERY SMALL SCREEN
========================================================= */

@media (max-width: 360px) {

  .story-card-inner {
    padding-left: 12px;
    padding-right: 12px;
  }


  .story-title-row h2 {
    font-size: 15px;
  }


  .Title-line {
    width: 18px;
  }


  .story-content {
    padding:
      20px
      18px;
  }

}

</style>
