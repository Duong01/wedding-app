<template>
  <section class="events">

    <!-- =========================================
         HEADER SECTION
    ========================================== -->

    <div class="section-heading">

      <div class="heading-line"></div>

      <div class="heading-content">

        <span class="heading-subtitle">
          TRÂN TRỌNG KÍNH MỜI
        </span>

        <h2>
          THÔNG TIN TIỆC CƯỚI
        </h2>

        <div class="heading-symbol">
          囍
        </div>

      </div>

      <div class="heading-line"></div>

    </div>


    <!-- =========================================
         EVENT CARDS
    ========================================== -->

    <div
      v-for="(event, index) in normalizedEvents"
      :key="event.Id || index"
      class="event-card"
    >

      <!-- Viền trang trí -->

      <div class="card-border"></div>

      <div class="corner corner-tl">❖</div>
      <div class="corner corner-tr">❖</div>
      <div class="corner corner-bl">❖</div>
      <div class="corner corner-br">❖</div>


      <div class="event-inner">

        <!-- =====================================
             EVENT TITLE
        ====================================== -->

        <div class="event-title-wrap">

          <span class="event-kicker">
            {{ event.typeLabel }}
          </span>

          <h3>
            {{ event.Title || "THÔNG TIN TIỆC CƯỚI" }}
          </h3>

          <div class="title-decoration">
            <span></span>
            <b>囍</b>
            <span></span>
          </div>

        </div>


        <!-- =====================================
             TIME + DATE
        ====================================== -->

        <div
          v-if="event.hasDate"
          class="event-date-block"
        >

          <!-- GIỜ -->

          <div
            v-if="event.time"
            class="event-time"
          >
            {{ event.time }}
          </div>


          <!-- THỨ + NGÀY + THÁNG -->

          <div class="event-date">

            <span
              v-if="event.weekday"
              class="weekday"
            >
              {{ event.weekday }}
            </span>

            <strong
              v-if="event.day"
              class="day"
            >
              {{ event.day }}
            </strong>

            <span
              v-if="event.month"
              class="month"
            >
              THÁNG {{ event.month }}
            </span>

          </div>


          <!-- NĂM -->

          <div
            v-if="event.year"
            class="event-year"
          >
            {{ event.year }}
          </div>

          <!-- ÂM LỊCH -->

          <div
            v-if="event.lunar"
            class="event-lunar"
          >
            {{ event.lunar }}
          </div>

        </div>


        <!-- =====================================
             RECEPTION / CEREMONY
        ====================================== -->

        <div
          v-if="event.receptionTime || event.ceremonyTime"
          class="schedule"
        >

          <div
            v-if="event.receptionTime"
            class="schedule-item"
          >

            <span class="schedule-icon">
              ♡
            </span>

            <span class="schedule-label">
              ĐÓN KHÁCH
            </span>

            <strong>
              {{ event.receptionTime }}
            </strong>

          </div>


          <div
            v-if="event.ceremonyTime"
            class="schedule-item"
          >

            <span class="schedule-icon">
              ✦
            </span>

            <span class="schedule-label">
              KHAI TIỆC
            </span>

            <strong>
              {{ event.ceremonyTime }}
            </strong>

          </div>

        </div>


        <!-- =====================================
             CALENDAR
        ====================================== -->

        <div
          v-if="event.date"
          class="calendar"
        >

          <div class="calendar-top">

            <span class="calendar-label">
              LỊCH
            </span>

            <strong>
              THÁNG {{ event.month }} · {{ event.year }}
            </strong>

          </div>


          <div class="calendar-weekdays">

            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>

          </div>


          <div class="calendar-days">

            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="calendar-cell"
              :class="{
                empty: !day,
                active: day === Number(event.day),
              }"
            >

              <template v-if="day">

                <div
                  v-if="day === Number(event.day)"
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


          <!-- ADD TO CALENDAR -->

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="calendar-link"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>

        </div>


        <!-- =====================================
             LOCATION
        ====================================== -->

        <div
          v-if="event.location || event.address"
          class="location"
        >

          <div class="location-symbol">
            ◈
          </div>

          <div
            v-if="event.location"
            class="location-name"
          >
            {{ event.location }}
          </div>

          <div
            v-if="event.address"
            class="location-address"
          >
            {{ event.address }}
          </div>

          <a
            v-if="event.map"
            :href="event.map"
            target="_blank"
            rel="noopener noreferrer"
            class="map-link"
          >
            XEM VỊ TRÍ TRÊN BẢN ĐỒ
          </a>

        </div>


        <!-- =====================================
             RSVP
        ====================================== -->

        <a
          v-if="event.rsvpUrl"
          :href="event.rsvpUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="rsvp-button"
        >
          <span>♡</span>
          XÁC NHẬN THAM DỰ
        </a>


        <!-- =====================================
             BOTTOM ORNAMENT
        ====================================== -->

        <div class="bottom-ornament">

          <span></span>

          <b>囍</b>

          <span></span>

        </div>

      </div>

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


/* =====================================================
   NORMALIZE EVENTS
===================================================== */

const normalizedEvents = computed(() => {

  return (props.events || []).map((event, index) => {

    const item = event || {};

    return {

      ...item,

      id:
        item.Id ||
        index,

      title:
        item.Title ||
        "",

      time:
        item.EventTime ||
        "",

      weekday:
        item.Weekday ||
        "",

      day:
        item.Day ||
        "",

      month:
        item.Month ||
        "",

      year:
        item.Year ||
        "",

      date:
        item.EventDate ||
        "",

      lunar:
        item.Lunar ||
        "",

      location:
        item.Location ||
        "",

      address:
        item.Address ||
        "",

      map:
        item.Map ||
        "",

      receptionTime:
        item.ReceptionTime ||
        item.Reception_time ||
        "",

      ceremonyTime:
        item.CeremonyTime ||
        item.Ceremony_time ||
        "",

      calendarUrl:
        item.calendarUrl ||
        item.calendar_url ||
        "",

      rsvpUrl:
        item.rsvpUrl ||
        item.rsvp_url ||
        "",

      typeLabel:
        getTypeLabel(item.EventType),

      calendarDays:
        createCalendarDays(item),

      hasDate:
        Boolean(
          item.EventTime ||
          item.Weekday ||
          item.Day ||
          item.Month ||
          item.Year
        ),

    };

  });

});


/* =====================================================
   EVENT TYPE
===================================================== */

function getTypeLabel(type) {

  const labels = {

    vuquy: "LỄ VU QUY",

    cuoi: "LỄ CƯỚI",

    tiec: "TIỆC CƯỚI",

    thanhhon: "LỄ THÀNH HÔN",

  };

  return labels[type] || "NGÀY TRỌNG ĐẠI";
}


/* =====================================================
   CREATE CALENDAR
   LẤY HOÀN TOÀN TỪ API
===================================================== */

function createCalendarDays(event) {

  if (
    !event?.EventDate ||
    !event?.Year ||
    !event?.Month
  ) {
    return [];
  }

  const year = Number(event.Year);
  const month = Number(event.Month);

  if (!year || !month) {
    return [];
  }


  /*
   * Ngày đầu tháng.
   *
   * 0 = CN
   * 1 = T2
   * ...
   * 6 = T7
   */

  const firstDay = new Date(
    year,
    month - 1,
    1
  ).getDay();


  /*
   * Số ngày trong tháng.
   */

  const totalDays = new Date(
    year,
    month,
    0
  ).getDate();


  const days = [];


  /*
   * Ô trống đầu tháng.
   */

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    days.push(null);
  }


  /*
   * Ngày trong tháng.
   */

  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {
    days.push(day);
  }


  return days;
}


const firstEvent = computed(() => {

  return normalizedEvents.value[0] || null;

});
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.events {
  --red: #7f151a;
  --red-dark: #681014;
  --red-soft: #a52b2f;

  --gold: #ad8240;
  --gold-light: #c8a66a;

  --text: #554b43;
  --text-soft: #75685c;

  position: relative;
  width: 100%;

  padding: 12px 8px 20px;

  color: var(--text);

  text-align: center;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  box-sizing: border-box;
}


/* =====================================================
   MAIN HEADING
===================================================== */

.section-heading {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-bottom: 28px;
}

.heading-content {
  flex-shrink: 0;
}

.heading-line {
  width: 42px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      var(--gold)
    );
}

.heading-line:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      var(--gold)
    );
}

.heading-subtitle {
  display: block;

  margin-bottom: 6px;

  color: #a07839;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 2.5px;
}

.section-heading h2 {
  margin: 0;

  color: var(--red);

  font-size: 22px;
  font-weight: 800;

  letter-spacing: 1.2px;

  line-height: 1.25;
}

.heading-symbol {
  margin-top: 7px;

  color: #9b171c;

  font-family:
    "Times New Roman",
    serif;

  font-size: 26px;
  font-weight: 700;

  line-height: 1;
}


/* =====================================================
   EVENT CARD
===================================================== */

.event-card {
  position: relative;

  width: 100%;
  max-width: 430px;

  margin:
    0
    auto
    28px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 251, 243, .98),
      rgba(250, 242, 225, .96)
    );

  border:
    1px solid
    rgba(166, 122, 54, .42);

  box-shadow:
    0 12px 30px
    rgba(92, 43, 21, .08);

  box-sizing: border-box;
}


/*
 * Viền kép bên trong
 */

.event-card::before {
  content: "";

  position: absolute;

  inset: 6px;

  border:
    1px solid
    rgba(174, 132, 65, .25);

  pointer-events: none;

  z-index: 1;
}


/*
 * Viền trang trí chính
 */

.card-border {
  position: absolute;

  inset: 12px;

  z-index: 2;

  border:
    1px solid
    rgba(169, 123, 54, .38);

  pointer-events: none;
}


/* =====================================================
   CORNERS
===================================================== */

.corner {
  position: absolute;

  z-index: 5;

  width: 25px;
  height: 25px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #a87c39;

  background:
    linear-gradient(
      135deg,
      #fffaf0,
      #f7ecd6
    );

  border:
    1px solid
    rgba(169, 123, 54, .35);

  font-size: 9px;

  line-height: 1;
}

.corner-tl {
  top: 1px;
  left: 1px;
}

.corner-tr {
  top: 1px;
  right: 1px;
}

.corner-bl {
  bottom: 1px;
  left: 1px;
}

.corner-br {
  right: 1px;
  bottom: 1px;
}


/* =====================================================
   CONTENT
===================================================== */

.event-inner {
  position: relative;

  z-index: 3;

  display: flex;

  flex-direction: column;

  align-items: center;

  padding:
    31px
    25px
    27px;
}


/* =====================================================
   EVENT TITLE
===================================================== */

.event-title-wrap {
  margin-bottom: 24px;
}

.event-kicker {
  display: block;

  margin-bottom: 7px;

  color: #a37b3e;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 2px;
}

.event-title-wrap h3 {
  margin: 0;

  color: var(--red);

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 22px;
  font-weight: 700;

  letter-spacing: .8px;

  line-height: 1.3;
}

.Title-decoration {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 10px;
}

.Title-decoration span {
  width: 35px;
  height: 1px;

  background: var(--gold-light);
}

.Title-decoration b {
  color: #98161b;

  font-family:
    "Times New Roman",
    serif;

  font-size: 16px;
}


/* =====================================================
   DATE BLOCK
===================================================== */

.event-date-block {
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
}


/* =====================================================
   TIME
===================================================== */

.event-time {
  margin-bottom: 14px;

  color: var(--red-dark);

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 27px;
  font-weight: 700;

  letter-spacing: 1.5px;

  line-height: 1;
}


/* =====================================================
   DATE
===================================================== */

.event-date {
  display: flex;

  align-items: baseline;
  justify-content: center;

  gap: 9px;

  width: 100%;

  white-space: nowrap;
}

.weekday {
  color: #6d5b49;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: .8px;
}


/*
 * Ngày nổi bật
 */

.day {
  color: #97161b;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 58px;
  font-weight: 900;

  line-height: .8;

  letter-spacing: -2px;
}

.month {
  color: #6d5741;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 1px;
}


/* =====================================================
   YEAR
===================================================== */

.event-year {
  margin-top: 11px;

  color: #80623e;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 15px;
  font-weight: 700;

  letter-spacing: 4px;
}


/* =====================================================
   LUNAR
===================================================== */

.event-lunar {
  margin-top: 7px;

  color: #927657;

  font-size: 10px;
  font-weight: 500;

  letter-spacing: .8px;
}


/* =====================================================
   SCHEDULE
===================================================== */

.schedule {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  width: 100%;
  max-width: 310px;

  margin-top: 27px;

  overflow: hidden;

  background:
    rgba(255, 255, 255, .45);

  border:
    1px solid
    rgba(170, 126, 58, .3);

  border-radius: 2px;
}

.schedule-item {
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  min-height: 78px;

  padding:
    11px
    6px;
}

.schedule-item + .schedule-item {
  border-left:
    1px solid
    rgba(170, 126, 58, .3);
}

.schedule-icon {
  margin-bottom: 5px;

  color: #ad8142;

  font-size: 14px;
}

.schedule-label {
  margin-bottom: 7px;

  color: #98723d;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 1.2px;
}

.schedule-item strong {
  color: var(--red);

  font-size: 18px;
  font-weight: 700;

  letter-spacing: .4px;
}


/* =====================================================
   CALENDAR
===================================================== */

.calendar {
  width: 100%;
  max-width: 300px;

  margin-top: 28px;

  padding:
    17px
    14px
    15px;

  background:
    rgba(255, 255, 255, .55);

  border:
    1px solid
    rgba(169, 124, 55, .32);

  box-shadow:
    inset 0 0 0 3px
    rgba(187, 145, 77, .055);

  box-sizing: border-box;
}


/* =====================================================
   CALENDAR HEADER
===================================================== */

.calendar-top {
  display: flex;

  flex-direction: column;

  align-items: center;

  margin-bottom: 12px;
}

.calendar-label {
  margin-bottom: 4px;

  color: #a07839;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 2px;
}

.calendar-top strong {
  color: var(--red);

  font-size: 15px;
  font-weight: 700;

  letter-spacing: 1px;
}


/* =====================================================
   WEEKDAYS
===================================================== */

.calendar-weekdays {
  display: grid;

  grid-template-columns:
    repeat(7, 1fr);

  padding:
    7px
    0;

  border-top:
    1px solid
    rgba(169, 124, 55, .22);

  border-bottom:
    1px solid
    rgba(169, 124, 55, .22);
}

.calendar-weekdays span {
  color: #725c43;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: .3px;
}


/* =====================================================
   CALENDAR DAYS
===================================================== */

.calendar-days {
  display: grid;

  grid-template-columns:
    repeat(7, 1fr);

  row-gap: 5px;

  padding-top: 9px;
}

.calendar-cell {
  display: flex;

  align-items: center;
  justify-content: center;

  height: 34px;
}

.calendar-cell.empty {
  pointer-events: none;
}


/* =====================================================
   NORMAL DAY
===================================================== */

.normal-day {
  color: #4e4740;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 12px;
  font-weight: 600;

  line-height: 1;
}


/* =====================================================
   ACTIVE DAY
===================================================== */

.active-day {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;
}


/*
 * Tim đỏ lớn
 */

.heart {
  position: absolute;

  top: 50%;
  left: 50%;

  color: #78070b;

  font-size: 45px;
  font-weight: 900;

  line-height: 1;

  transform:
    translate(-50%, -50%);

  text-shadow:
    0 2px 5px
    rgba(90, 0, 0, .15);
}


/*
 * Số ngày nằm giữa tim
 */

.active-number {
  position: relative;

  z-index: 2;

  color: #fff;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 13px;
  font-weight: 800;

  line-height: 1;

  text-shadow:
    0 1px 2px
    rgba(50, 0, 0, .35);
}


/* =====================================================
   ADD TO CALENDAR
===================================================== */

.calendar-link {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 4px;

  margin-top: 15px;

  color: #89651f;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 1.3px;

  text-decoration: none;

  border-bottom:
    1px solid
    rgba(137, 101, 31, .4);

  padding-bottom: 3px;
}

.calendar-link span {
  font-size: 12px;
}


/* =====================================================
   LOCATION
===================================================== */

.location {
  width: 100%;

  margin-top: 27px;

  padding-top: 20px;

  border-top:
    1px solid
    rgba(169, 124, 55, .23);
}

.location-symbol {
  margin-bottom: 7px;

  color: #a77c3d;

  font-size: 15px;
}

.location-name {
  color: var(--red);

  font-size: 14px;
  font-weight: 700;

  letter-spacing: .2px;
}

.location-address {
  max-width: 310px;

  margin:
    6px
    auto
    0;

  color: #685b4f;

  font-size: 11px;
  font-weight: 500;

  line-height: 1.65;
}

.map-link {
  display: inline-block;

  margin-top: 11px;

  color: #89651f;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 1.2px;

  text-decoration: none;

  border-bottom:
    1px solid
    rgba(137, 101, 31, .4);

  padding-bottom: 3px;
}


/* =====================================================
   RSVP
===================================================== */

.rsvp-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  min-width: 205px;
  min-height: 44px;

  margin-top: 23px;

  padding:
    10px
    22px;

  color: #fffaf0;

  background:
    linear-gradient(
      135deg,
      #94171c,
      #741014
    );

  border:
    1px solid
    #a42a2e;

  box-shadow:
    0 6px 16px
    rgba(117, 17, 22, .15);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 1.3px;

  text-decoration: none;

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.rsvp-button span {
  font-size: 14px;
}

.rsvp-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 9px 20px
    rgba(117, 17, 22, .2);
}


/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.bottom-ornament {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  width: 100%;

  margin-top: 27px;
}

.bottom-ornament span {
  width: 38px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b68b49
    );
}

.bottom-ornament span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b68b49
    );
}

.bottom-ornament b {
  color: #981519;

  font-family:
    "Times New Roman",
    serif;

  font-size: 17px;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {

  .events {
    padding:
      10px
      4px
      18px;
  }

  .section-heading {
    gap: 7px;
  }

  .heading-line {
    width: 28px;
  }

  .heading-subtitle {
    font-size: 9px;
    letter-spacing: 2px;
  }

  .section-heading h2 {
    font-size: 19px;
  }

  .event-card {
    width: 100%;
  }

  .event-inner {
    padding:
      30px
      17px
      25px;
  }

  .event-kicker {
    font-size: 9px;
  }

  .event-title-wrap h3 {
    font-size: 20px;
  }

  .event-time {
    font-size: 25px;
  }

  .weekday {
    font-size: 10px;
  }

  .day {
    font-size: 52px;
  }

  .month {
    font-size: 11px;
  }

  .event-year {
    font-size: 14px;
    letter-spacing: 3px;
  }

  .schedule-item {
    min-height: 74px;
  }

  .schedule-label {
    font-size: 8px;
  }

  .schedule-item strong {
    font-size: 17px;
  }

  .calendar {
    max-width: 292px;
  }

  .calendar-top strong {
    font-size: 14px;
  }

  .calendar-weekdays span {
    font-size: 8px;
  }

  .normal-day {
    font-size: 11px;
  }

  .active-day {
    width: 45px;
    height: 45px;
  }

  .heart {
    font-size: 43px;
  }

  .active-number {
    font-size: 12px;
  }

  .location-name {
    font-size: 13px;
  }

  .location-address {
    font-size: 11px;
  }

  .rsvp-button {
    min-width: 190px;
    min-height: 42px;

    font-size: 9px;
  }
}

</style>


