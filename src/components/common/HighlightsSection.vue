<template>
  <section class="highlights-section">
    <!-- =====================================================
         DECORATIVE BACKGROUND
    ====================================================== -->

    <div class="section-pattern"></div>

    <!-- =====================================================
         MAIN CARD
    ====================================================== -->

    <div class="wedding-info-card">
      <!-- ===================================================
           TOP DECORATION
      ==================================================== -->

      <div class="top-decoration">
        <span class="decoration-line"></span>

        <span class="decoration-symbol"> 囍 </span>

        <span class="decoration-line"></span>
      </div>

      <!-- ===================================================
           TITLE
      ==================================================== -->

      <div class="section-heading">
        <span class="section-subtitle"> TRÂN TRỌNG KÍNH MỜI </span>

        <h2>THÔNG TIN LỄ CƯỚI</h2>

        <span class="heading-line"></span>
      </div>

      <!-- ===================================================
           COUPLE / FAMILY
      ==================================================== -->

      <div class="family-grid">
        <!-- BRIDE -->

        <div class="family-column bride-column">
          <span class="family-role"> NHÀ GÁI </span>

          <h3>
            {{ couple?.bride?.name || "Cô dâu" }}
          </h3>

          <div class="family-divider"></div>

          <p v-if="couple?.bride?.father">
            <span>Ông</span>
            {{ couple.bride.father }}
          </p>

          <p v-if="couple?.bride?.mother">
            <span>Bà</span>
            {{ couple.bride.mother }}
          </p>
        </div>

        <!-- CENTER -->

        <div class="family-center">
          <div class="center-ornament">
            <span></span>
            <b>♥</b>
            <span></span>
          </div>

          <div class="ampersand">&</div>

          <div class="center-ornament">
            <span></span>
            <b>♥</b>
            <span></span>
          </div>
        </div>

        <!-- GROOM -->

        <div class="family-column groom-column">
          <span class="family-role"> NHÀ TRAI </span>

          <h3>
            {{ couple?.groom?.name || "Chú rể" }}
          </h3>

          <div class="family-divider"></div>

          <p v-if="couple?.groom?.father">
            <span>Ông</span>
            {{ couple.groom.father }}
          </p>

          <p v-if="couple?.groom?.mother">
            <span>Bà</span>
            {{ couple.groom.mother }}
          </p>
        </div>
      </div>

      <!-- ===================================================
           WEDDING DATE
      ==================================================== -->

      <div class="wedding-date">
        <div class="date-top">
          <span class="date-line"></span>

          <span class="weekday">
            {{ weddingWeekday }}
          </span>

          <span class="date-line"></span>
        </div>

        <div class="date-main">
          <div class="date-side">
            <span>THÁNG</span>

            <strong>
              {{ weddingMonth }}
            </strong>
          </div>

          <div class="date-day">
            {{ weddingDay }}
          </div>

          <div class="date-side">
            <span>NĂM</span>

            <strong>
              {{ weddingYear }}
            </strong>
          </div>
        </div>

        <div v-if="weddingLunar" class="lunar-date">
          ({{ weddingLunar }})
        </div>
      </div>


    </div>
  </section>
</template>


<script setup>
import { computed } from "vue";

const props = defineProps({
  couple: {
    type: Object,
    default: () => ({}),
  },

  events: {
    type: Array,
    default: () => [],
  },
});

/* =========================================================
   WEDDING DATE
========================================================= */

const mainEvent = computed(() => {
  return props.events?.[0] || null;
});

const weddingDate = computed(() => {
  if (mainEvent.value?.date) {
    return new Date(mainEvent.value.date);
  }

  return new Date();
});

const weddingDay = computed(() => {
  if (mainEvent.value?.day) {
    return String(mainEvent.value.day).padStart(2, "0");
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
  }).format(weddingDate.value);
});

const weddingMonth = computed(() => {
  if (mainEvent.value?.month) {
    return String(mainEvent.value.month).padStart(2, "0");
  }

  return new Intl.DateTimeFormat("vi-VN", {
    month: "2-digit",
  }).format(weddingDate.value);
});

const weddingYear = computed(() => {
  if (mainEvent.value?.year) {
    return mainEvent.value.year;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
  }).format(weddingDate.value);
});

const weddingWeekday = computed(() => {
  if (mainEvent.value?.weekday) {
    return mainEvent.value.weekday;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
  })
    .format(weddingDate.value)
    .toUpperCase();
});

const weddingLunar = computed(() => {
  return mainEvent.value?.lunar || "";
});
</script>


<style scoped lang="scss">
/* =========================================================
   SECTION
========================================================= */

.highlights-section {
  position: relative;

  width: 100%;

  padding: 28px 14px 35px;


  color: #5d332c;

  overflow: hidden;

  isolation: isolate;
}

/* =========================================================
   PAPER TEXTURE
========================================================= */

.highlights-section::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: -1;

  background-image: radial-gradient(
    rgba(123, 13, 13, 0.035) 1px,
    transparent 1px
  );

  background-size: 7px 7px;

  pointer-events: none;
}

/* =========================================================
   DECORATIVE PATTERN
========================================================= */

.section-pattern {
  position: absolute;

  inset: 0;

  z-index: -1;


  opacity: 0.025;

  pointer-events: none;
}

/* =========================================================
   CARD
========================================================= */

.wedding-info-card {
  position: relative;

  width: 100%;

  max-width: 390px;

  margin: 0 auto;

  padding: 30px 20px 32px;

  overflow: hidden;
}

/* =========================================================
   INNER BORDER
========================================================= */

.wedding-info-card::before {
  content: "";

  position: absolute;

  inset: 8px;

  pointer-events: none;
}

/* =========================================================
   TOP DECORATION
========================================================= */

.top-decoration,
.bottom-decoration {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;
}

.top-decoration {
  margin-bottom: 22px;
}

.decoration-line {
  width: 45px;

  height: 1px;

}

.decoration-symbol {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 30px;

  height: 30px;

  border-radius: 50%;

  color: #8b1515;

  font-family: "Noto Serif", serif;

  font-size: 19px;

}

/* =========================================================
   HEADING
========================================================= */

.section-heading {
  text-align: center;

  margin-bottom: 28px;
}

.section-subtitle {
  display: block;

  margin-bottom: 5px;

  color: #a56b45;

  font-family: var(--font-main), serif;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.24em;
}

.section-heading h2 {
  margin: 0;

  color: #841616;

  font-family: var(--font-heading), serif;

  font-size: 21px;

  font-weight: 600;

  letter-spacing: 0.08em;
}

.heading-line {
  display: block;

  width: 65px;

  height: 1px;

  margin: 9px auto 0;

}

/* =========================================================
   FAMILY
========================================================= */

.family-grid {
  display: grid;

  grid-template-columns:
    1fr
    26px
    1fr;

  align-items: center;

  margin-bottom: 27px;
}

.family-column {
  text-align: center;
}

.family-role {
  display: block;

  margin-bottom: 7px;

  color: #a36a48;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.18em;
}

.family-column h3 {
  margin: 0;

  color: #7c1717;

  font-family: var(--font-heading), serif;

  font-size: 18px;

  font-weight: 600;
}

.family-divider {
  width: 35px;

  height: 1px;

  margin: 8px auto;

}

.family-column p {
  margin: 2px 0;

  color: #80665b;

  font-size: 12px;

  line-height: 1.5;
}

.family-column p span {
  color: #a06e50;

  margin-right: 3px;
}

.family-center {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 5px;
}

.ampersand {
  color: #9a2620;

  font-family: var(--font-script), cursive;

  font-size: 24px;

  line-height: 1;
}

.center-ornament {
  display: flex;

  align-items: center;

  gap: 3px;
}

.center-ornament span {
  width: 5px;

  height: 1px;

}

.center-ornament b {
  color: #b67b52;

  font-size: 12px;
}

/* =========================================================
   DATE
========================================================= */

.wedding-date {
  position: relative;

  margin: 5px 0 30px;

  padding: 20px 0 17px;
}

.date-top {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin-bottom: 12px;
}

.date-line {
  width: 32px;

  height: 1px;

}

.weekday {
  color: #8a1717;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 0.17em;
}

.date-main {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 15px;
}

.date-side {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 2px;

  min-width: 40px;
}

.date-side span {
  color: #a2765c;

  font-size: 11px;

  letter-spacing: 0.15em;
}

.date-side strong {
  color: #8b2520;

  font-family: var(--font-heading), serif;

  font-size: 16px;

  font-weight: 600;
}

.date-day {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 75px;

  height: 75px;

  color: #8c1616;

  font-family: var(--font-heading), serif;

  font-size: 53px;

  font-weight: 500;

  line-height: 1;



  box-shadow: inset 0 0 0 4px rgba(139, 22, 22, 0.035);
}

.lunar-date {
  margin-top: 13px;
  text-align: center;
  color: #8c7063;

  font-size: 12px;

  line-height: 1.5;
}

/* =========================================================
   EVENTS
========================================================= */

.events-wrapper {
  display: flex;

  flex-direction: column;

  gap: 16px;
}

.event-card {
  position: relative;

  padding: 17px 15px 18px;

}

/* =========================================================
   EVENT HEADER
========================================================= */

.event-header {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;
}

.event-header h3 {
  margin: 0;

  color: #861818;

  font-family: var(--font-heading), serif;

  font-size: 17px;

  font-weight: 600;
}

.event-icon {
  color: #b27b52;

  font-size: 8px;
}

/* =========================================================
   EVENT TIME
========================================================= */

.event-time {
  margin-top: 8px;

  text-align: center;
}

.event-time span {
  color: #8e2820;

  font-family: var(--font-heading), serif;

  font-size: 21px;

  font-weight: 600;
}

.event-location {
  margin-top: 6px;

  text-align: center;
}

.event-location strong {
  display: block;

  color: #624a40;

  font-size: 10px;

  font-weight: 600;
}

.event-location p {
  margin: 4px 0 0;

  color: #8a746a;

  font-size: 12px;

  line-height: 1.5;
}

/* =========================================================
   MAP BUTTON
========================================================= */

.map-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  margin-top: 11px;

  padding: 6px 12px;

  color: #8b2520;

  font-size: 12px;

  text-decoration: none;


  transition: background 0.25s ease, color 0.25s ease;
}

.map-button:hover {
  background: #8b2520;

  color: white;
}

/* =========================================================
   BOTTOM
========================================================= */

.bottom-decoration {
  margin-top: 27px;
}

.double-heart {
  color: #a83b2c;

  font-size: 13px;
}

/* =========================================================
   TABLET
========================================================= */

@media (min-width: 600px) {
  .highlights-section {
    padding: 38px 20px 45px;
  }

  .wedding-info-card {
    max-width: 410px;

    padding: 36px 25px 38px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 430px) {
  .highlights-section {
    padding: 20px 10px 30px;
  }

  .wedding-info-card {
    max-width: 100%;

    padding: 27px 17px 30px;

    box-shadow: 0 5px 20px rgba(80, 30, 20, 0.06);
  }

  .section-heading h2 {
    font-size: 19px;
  }

  .family-column h3 {
    font-size: 16px;
  }

  .date-day {
    width: 68px;

    height: 68px;

    font-size: 48px;
  }
}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 360px) {
  .highlights-section {
    padding-left: 7px;
    padding-right: 7px;
  }

  .wedding-info-card {
    padding-left: 13px;
    padding-right: 13px;
  }

  .family-grid {
    grid-template-columns:
      1fr
      20px
      1fr;
  }

  .family-column h3 {
    font-size: 15px;
  }

  .family-column p {
    font-size: 12px;
  }

  .date-main {
    gap: 9px;
  }

  .date-day {
    width: 64px;

    height: 64px;

    font-size: 44px;
  }
}
</style>