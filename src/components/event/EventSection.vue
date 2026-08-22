<template>
  <section class="event-section">

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="event-header">
      <h2 class="event-title">
        THÔNG TIN TIỆC CƯỚI
      </h2>

      <div class="title-decoration">
        <span></span>
        <i>✦</i>
        <span></span>
      </div>

      <p class="event-description">
        Trân trọng kính mời quý khách đến chung vui
        cùng gia đình chúng tôi trong ngày trọng đại.
      </p>

    </header>


    <!-- =====================================================
         MAIN DATE
    ====================================================== -->

    <div class="main-date">

      <div class="time-label">
        TIỆC CƯỚI ĐƯỢC TỔ CHỨC VÀO LÚC
      </div>

      <div class="event-time">
        {{ firstEvent.time }}
      </div>


      <div class="date-display">

        <div class="date-side">
          <span>
            {{ firstEvent.weekday }}
          </span>
        </div>


        <div class="date-center">

          <span class="date-number">
            {{ firstEvent.day }}
          </span>

          <span class="date-month">
            THÁNG {{ firstEvent.month }}
          </span>

        </div>


        <div class="date-side">
          <span>
            {{ firstEvent.year }}
          </span>
        </div>

      </div>


      <div
        v-if="firstEvent.lunar"
        class="lunar-date"
      >
        {{ firstEvent.lunar }}
      </div>

    </div>


    <!-- =====================================================
         DECORATIVE DIVIDER
    ====================================================== -->

    <div class="gold-divider">

      <span></span>

      <div class="divider-diamond">
        ◆
      </div>

      <span></span>

    </div>


    <!-- =====================================================
         CALENDAR
    ====================================================== -->

    <div class="calendar-card">

      <!-- Calendar header -->

      <div class="calendar-header">

        <div class="calendar-month">
          THÁNG {{ firstEvent.month }}
        </div>

        <div class="calendar-year">
          {{ firstEvent.year }}
        </div>

      </div>


      <!-- Week -->

      <div class="calendar-week">

        <div
          v-for="day in weekDays"
          :key="day"
        >
          {{ day }}
        </div>

      </div>


      <!-- Days -->

      <div class="calendar-days">

        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="{
            empty: !day,
            active: day === Number(firstEvent.day),
          }"
        >

          <template v-if="day">

            <div
              v-if="day === Number(firstEvent.day)"
              class="active-day"
            >

              <span class="heart">
                ♥
              </span>

              <span class="active-number">
                {{ day }}
              </span>

            </div>

            <span
              v-else
              class="normal-day"
            >
              {{ day }}
            </span>

          </template>

        </div>

      </div>

    </div>

    <!-- =====================================================
         ACTION
    ====================================================== -->

    <div class="event-actions">

      <a
        class="calendar-button"
        :href="calendarUrl"
        target="_blank"
        rel="noopener"
      >

        <span class="button-icon">
          ＋
        </span>

        <span>
          THÊM VÀO LỊCH
        </span>

      </a>


      <button
        class="confirm-button"
        type="button"
        @click="$emit('confirm')"
      >

        <span>
          XÁC NHẬN THAM DỰ
        </span>

        <span class="button-arrow">
          →
        </span>

      </button>

    </div>


    <!-- =====================================================
         BOTTOM ORNAMENT
    ====================================================== -->

    <div class="section-ornament bottom-ornament">

      <span class="ornament-line"></span>

      <span class="ornament-symbol">
        ❖
      </span>

      <span class="ornament-line"></span>

    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["confirm"]);


/* =========================================================
   FIRST EVENT
========================================================= */

const firstEvent = computed(() => {
  return props.events?.[0] ?? {};
});


/* =========================================================
   GOOGLE CALENDAR
========================================================= */

const calendarUrl = computed(() => {
  return "https://calendar.google.com/calendar/render?action=TEMPLATE";
});


/* =========================================================
   WEEK DAYS
========================================================= */

const weekDays = [
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "CN",
];


/* =========================================================
   CALENDAR DAYS
========================================================= */

const calendarDays = computed(() => {

  const year = Number(firstEvent.value.year);
  const month = Number(firstEvent.value.month);

  if (!year || !month) {
    return [];
  }

  const firstDate = new Date(
    year,
    month - 1,
    1
  );

  let start = firstDate.getDay();

  // Chủ nhật đưa xuống cuối tuần
  start = start === 0
    ? 6
    : start - 1;

  const totalDays =
    new Date(
      year,
      month,
      0
    ).getDate();

  const result = [];


  // Ô trống đầu tháng
  for (
    let i = 0;
    i < start;
    i++
  ) {
    result.push(null);
  }


  // Ngày
  for (
    let i = 1;
    i <= totalDays;
    i++
  ) {
    result.push(i);
  }


  // Đủ hàng
  while (
    result.length % 7 !== 0
  ) {
    result.push(null);
  }


  return result;
});
</script>


<style scoped>

/* =========================================================
   EVENT SECTION
   Mobile first
   Font: Times New Roman
========================================================= */

.event-section {
  --event-red: #7b0d0d;
  --event-red-dark: #620909;
  --event-gold: #a97931;
  --event-gold-light: #c9a45c;
  --event-text: #4f4039;
  --event-muted: #76655c;
  --event-line: rgba(123, 13, 13, 0.18);

  position: relative;

  width: 100%;
  max-width: 100%;

  margin: 0 auto;

  padding:
    42px
    16px
    50px;

  box-sizing: border-box;

  color: var(--event-text);

  font-family:var(--font-base);

  text-align: center;

  overflow: hidden;
}


/* =========================================================
   RESET FONT
========================================================= */

.event-section *,
.event-section *::before,
.event-section *::after {
  font-family:var(--font-base);

  box-sizing: border-box;
}


/* =========================================================
   HEADER
========================================================= */

.event-header {
  width: 100%;
  max-width: 520px;

  margin:
    0
    auto
    30px;
}


/* =========================================================
   TITLE
========================================================= */

.event-title {
  margin: 0;

  color: var(--event-red);

  font-family:var(--font-base);

  font-size: 25px;

  font-weight: 700;

  line-height: 1.2;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}


/* =========================================================
   TITLE DECORATION
========================================================= */

.title-decoration {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin:
    12px
    auto
    13px;
}


.title-decoration span {
  width: 42px;

  max-width: 15vw;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--event-gold),
      transparent
    );
}


.title-decoration i {
  flex: 0 0 auto;

  color: var(--event-gold);

  font-family:var(--font-base);

  font-size: 13px;

  font-style: normal;

  line-height: 1;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.event-description {
  width: 100%;
  max-width: 330px;

  margin: 0 auto;

  color: var(--event-muted);

  font-family:var(--font-base);

  font-size: 14px;

  font-weight: 400;

  line-height: 1.65;

  letter-spacing: 0.01em;
}


/* =========================================================
   MAIN DATE
========================================================= */

.main-date {
  width: 100%;
  max-width: 500px;

  margin:
    0
    auto
    26px;

  text-align: center;
}


/* =========================================================
   TIME LABEL
========================================================= */

.time-label {
  margin-bottom: 7px;

  color: var(--event-gold);

  font-family:var(--font-base);

  font-size: 11px;

  font-weight: 700;

  line-height: 1.3;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}


/* =========================================================
   EVENT TIME
========================================================= */

.event-time {
  margin-bottom: 20px;

  color: var(--event-red);

  font-family:var(--font-base);

  font-size: 28px;

  font-weight: 700;

  line-height: 1.1;

  letter-spacing: 0.02em;
}


/* =========================================================
   DATE DISPLAY
========================================================= */

.date-display {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 13px;

  width: 100%;

  margin: 0 auto;
}


/* =========================================================
   DATE SIDE
========================================================= */

.date-side {
  flex: 0 1 70px;

  min-width: 0;

  color: var(--event-red);

  font-family:var(--font-base);

  font-size: 13px;

  font-weight: 700;

  line-height: 1.35;

  letter-spacing: 0.03em;

  text-transform: uppercase;

  overflow-wrap: break-word;
}


/* =========================================================
   DATE CENTER
========================================================= */

.date-center {
  position: relative;

  flex: 0 0 auto;

  min-width: 94px;

  padding:
    9px
    13px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}


/* =========================================================
   DATE CENTER LINES
========================================================= */

.date-center::before,
.date-center::after {
  content: "";

  position: absolute;

  left: 0;
  right: 0;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(169, 121, 49, 0.55),
      transparent
    );
}


.date-center::before {
  top: 0;
}


.date-center::after {
  bottom: 0;
}


/* =========================================================
   DATE NUMBER
========================================================= */

.date-number {
  color: var(--event-red);

  font-family:var(--font-base);

  font-size: 58px;

  font-weight: 700;

  line-height: 0.85;

  letter-spacing: -0.025em;
}


/* =========================================================
   DATE MONTH
========================================================= */

.date-month {
  margin-top: 9px;

  color: var(--event-gold);
font-family:var(--font-base);

  font-size: 10px;

  font-weight: 700;

  line-height: 1.2;

  letter-spacing: 0.13em;

  white-space: nowrap;
}


/* =========================================================
   LUNAR DATE
========================================================= */

.lunar-date {
  margin-top: 13px;

  color: var(--event-muted);

 font-family:var(--font-base);

  font-size: 13px;

  font-style: italic;

  line-height: 1.4;
}


/* =========================================================
   GOLD DIVIDER
========================================================= */

.gold-divider {
  display: flex;

  align-items: center;

  gap: 10px;

  width: min(230px, 70%);

  margin:
    26px
    auto
    25px;
}


.gold-divider span {
  flex: 1;

  min-width: 0;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(169, 121, 49, 0.55)
    );
}


.gold-divider span:last-child {
  background:
    linear-gradient(
      90deg,
      rgba(169, 121, 49, 0.55),
      transparent
    );
}


.divider-diamond {
  flex: 0 0 auto;

  color: var(--event-gold);

  font-family:var(--font-base);
  font-size: 9px;

  line-height: 1;
}


/* =========================================================
   CALENDAR CARD
========================================================= */

.calendar-card {
  width: 100%;
  max-width: 350px;

  margin:
    0
    auto
    30px;

  padding:
    22px
    17px
    20px;

  border:
    1px solid
    rgba(123, 13, 13, 0.16);

  background: transparent;

  box-shadow:
    0 8px 24px
    rgba(80, 40, 20, 0.035);
}


/* =========================================================
   CALENDAR HEADER
========================================================= */

.calendar-header {
  margin-bottom: 18px;
}


.calendar-month {
  color: var(--event-red);
    font-family:var(--font-base);   
  font-size: 22px;

  font-weight: 700;

  line-height: 1.1;
}


.calendar-year {
  margin-top: 4px;

  color: var(--event-muted);

  font-family:var(--font-base);

  font-size: 12px;

  line-height: 1.2;

  letter-spacing: 0.12em;
}


/* =========================================================
   WEEK
========================================================= */

.calendar-week {
  display: grid;

  grid-template-columns:
    repeat(7, minmax(0, 1fr));

  width: 100%;

  padding:
    0
    0
    8px;

  border-bottom:
    1px solid
    rgba(123, 13, 13, 0.14);
}


.calendar-week > div {
  color: var(--event-gold);

  font-family:var(--font-base);

  font-size: 11px;

  font-weight: 700;

  line-height: 1.2;
}


/* =========================================================
   CALENDAR DAYS
========================================================= */

.calendar-days {
  display: grid;

  grid-template-columns:
    repeat(7, minmax(0, 1fr));

  width: 100%;

  row-gap: 3px;

  padding-top: 8px;
}


.calendar-cell {
  position: relative;

  min-width: 0;

  min-height: 36px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: var(--event-text);

  font-family:var(--font-base);

  font-size: 15px;

  font-weight: 400;

  line-height: 1;
}


.calendar-cell.empty {
  pointer-events: none;
}


/* =========================================================
   ACTIVE DAY
========================================================= */

.active-day {
  position: relative;

  width: 45px;
  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;
}


.heart {
  position: absolute;

  inset: -2px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: var(--event-red);

  font-family:var(--font-base);

  font-size: 39px;

  line-height: 1;
}


.active-number {
  position: relative;

  z-index: 2;

  margin-top: 1px;

  color: #fffaf4;

  font-family:var(--font-base);

  font-size: 12px;

  font-weight: 700;

  line-height: 1;
}


.normal-day {
  color: var(--event-text);

  opacity: 0.9;
}


/* =========================================================
   LOCATION
========================================================= */

.event-location {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  width: 100%;
  max-width: 340px;

  margin:
    0
    auto
    28px;

  padding:
    14px
    10px;

  border-top:
    1px solid
    rgba(169, 121, 49, 0.22);

  border-bottom:
    1px solid
    rgba(169, 121, 49, 0.22);
}


.location-icon {
  flex: 0 0 auto;

  color: var(--event-gold);

  font-family:var(--font-base);

  font-size: 21px;

  line-height: 1;
}


.location-content {
  min-width: 0;

  text-align: left;
}


.location-title {
  margin-bottom: 4px;

  color: var(--event-gold);

  font-family:var(--font-base);

  font-size: 10px;

  font-weight: 700;

  line-height: 1.2;

  letter-spacing: 0.14em;
}


.location-name {
  color: var(--event-red);

  font-family:var(--font-base);

  font-size: 15px;

  font-weight: 700;

  line-height: 1.35;
}


.location-address {
  margin-top: 3px;

  color: var(--event-muted);

  font-family:var(--font-base);

  font-size: 13px;

  font-weight: 400;

  line-height: 1.45;
}


/* =========================================================
   ACTIONS
========================================================= */

.event-actions {
  display: flex;

  flex-direction: column;

  align-items: stretch;

  gap: 10px;

  width: 100%;
  max-width: 340px;

  margin:
    0
    auto;
}


/* =========================================================
   CALENDAR BUTTON
========================================================= */

.calendar-button {
  width: 100%;

  min-height: 44px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  padding:
    8px
    18px;

  border:
    1px solid
    rgba(123, 13, 13, 0.22);

  color: var(--event-red);

  background: transparent;

  font-family:var(--font-base);

  font-size: 12px;

  font-weight: 700;

  line-height: 1.2;

  letter-spacing: 0.06em;

  text-decoration: none;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}


.button-icon {
  color: var(--event-gold);

  font-family:var(--font-base);

  font-size: 17px;

  line-height: 1;
}


.calendar-button:hover,
.calendar-button:focus-visible {
  color: #fffaf4;

  background: var(--event-red);

  border-color: var(--event-red);
}


/* =========================================================
   CONFIRM BUTTON
========================================================= */

.confirm-button {
  width: 100%;

  min-height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 15px;

  padding:
    8px
    18px;

  border: 1px solid var(--event-red);

  color: #fffaf4;

  background:
    linear-gradient(
      135deg,
      var(--event-red),
      var(--event-red-dark)
    );

 font-family:var(--font-base);

  font-size: 12px;

  font-weight: 700;

  line-height: 1.2;

  letter-spacing: 0.07em;

  cursor: pointer;

  box-shadow:
    0 7px 18px
    rgba(123, 13, 13, 0.14);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}


.confirm-button:hover {
  transform: translateY(-1px);

  box-shadow:
    0 10px 22px
    rgba(123, 13, 13, 0.20);
}


.confirm-button:active {
  transform: translateY(0);

  box-shadow:
    0 4px 10px
    rgba(123, 13, 13, 0.15);
}


.button-arrow {
  color: #f2d08b;

  font-family:var(--font-base);

  font-size: 17px;

  line-height: 1;

  transition:
    transform 0.2s ease;
}


.confirm-button:hover .button-arrow {
  transform: translateX(3px);
}


/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.section-ornament {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  width: 100%;
  max-width: 180px;

  margin:
    0
    auto;
}


.bottom-ornament {
  margin-top: 34px;
}


.ornament-line {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(169, 121, 49, 0.45),
      transparent
    );
}


.ornament-symbol {
  flex: 0 0 auto;

  color: var(--event-gold);

  font-family:var(--font-base);

  font-size: 12px;

  line-height: 1;
}


/* =========================================================
   VERY SMALL MOBILE
   320 - 359px
========================================================= */

@media (max-width: 359px) {

  .event-section {
    padding:
      34px
      12px
      42px;
  }


  .event-title {
    font-size: 22px;

    letter-spacing: 0.025em;
  }


  .event-description {
    max-width: 290px;

    font-size: 13px;

    line-height: 1.6;
  }


  .event-header {
    margin-bottom: 27px;
  }


  .time-label {
    font-size: 10px;

    letter-spacing: 0.08em;
  }


  .event-time {
    font-size: 26px;

    margin-bottom: 18px;
  }


  .date-display {
    gap: 8px;
  }


  .date-side {
    flex-basis: 58px;

    font-size: 12px;
  }


  .date-center {
    min-width: 88px;

    padding:
      8px
      10px;
  }


  .date-number {
    font-size: 53px;
  }


  .date-month {
    font-size: 9px;

    letter-spacing: 0.1em;
  }


  .calendar-card {
    max-width: 100%;

    padding:
      20px
      10px
      18px;
  }


  .calendar-cell {
    min-height: 34px;

    font-size: 14px;
  }


  .active-day {
    width: 34px;
    height: 34px;
  }


  .heart {
    font-size: 37px;
  }


  .location-name {
    font-size: 14px;
  }


  .location-address {
    font-size: 12px;
  }


  .calendar-button,
  .confirm-button {
    font-size: 11px;
  }
}


/* =========================================================
   TABLET
========================================================= */

@media (min-width: 601px) {

  .event-section {
    max-width: 680px;

    padding:
      60px
      28px
      70px;
  }


  .event-header {
    max-width: 560px;

    margin-bottom: 38px;
  }


  .event-title {
    font-size: 30px;
  }


  .event-description {
    max-width: 450px;

    font-size: 15px;
  }


  .event-time {
    font-size: 31px;
  }


  .date-display {
    gap: 22px;
  }


  .date-side {
    flex-basis: 90px;

    font-size: 14px;
  }


  .date-center {
    min-width: 110px;
  }


  .date-number {
    font-size: 66px;
  }


  .calendar-card {
    max-width: 390px;

    padding:
      25px
      22px
      23px;
  }


  .calendar-month {
    font-size: 25px;
  }


  .calendar-cell {
    min-height: 40px;

    font-size: 16px;
  }


  .event-location,
  .event-actions {
    max-width: 390px;
  }


  .calendar-button,
  .confirm-button {
    font-size: 13px;
  }
}


/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 1024px) {

  .event-section {
    max-width: 760px;

    padding:
      72px
      30px
      82px;
  }


  .event-title {
    font-size: 34px;
  }


  .event-description {
    font-size: 16px;
  }


  .event-time {
    font-size: 34px;
  }


  .date-number {
    font-size: 72px;
  }


  .calendar-card {
    max-width: 420px;
  }


  .calendar-cell {
    min-height: 42px;

    font-size: 17px;
  }


  .event-location,
  .event-actions {
    max-width: 420px;
  }
}


/* =========================================================
   TOUCH DEVICES
========================================================= */

@media (hover: none) {

  .calendar-button:hover,
  .confirm-button:hover {
    transform: none;
  }


  .confirm-button:hover {
    box-shadow:
      0 7px 18px
      rgba(123, 13, 13, 0.14);
  }


  .confirm-button:hover .button-arrow {
    transform: none;
  }
}


/* =========================================================
   ACCESSIBILITY
========================================================= */

.calendar-button:focus-visible,
.confirm-button:focus-visible {
  outline:
    2px solid
    var(--event-gold);

  outline-offset: 3px;
}


/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .event-section *,
  .event-section *::before,
  .event-section *::after {
    transition: none !important;
  }
}

</style>
