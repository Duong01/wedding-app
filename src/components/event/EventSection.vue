<template>
  <div class="invitation-section">

  <!-- =========================
       HEADER
       ========================= -->

  <div class="invitation-heading">
    <h2 class="invitation-title">
      THÔNG TIN TIỆC CƯỚI
    </h2>

    <div class="invitation-ornament">
      <span></span>
      <i>✦</i>
      <span></span>
    </div>

    <p class="desc">
      Tiệc cưới sẽ diễn ra
    </p>

  </div>

  <!-- =========================
       EVENT TIME
       ========================= -->

  <div class="event-info">

    <div class="time-label">
      VÀO LÚC
    </div>

    <div class="time">
      {{ firstEvent.time }}
    </div>


    <div class="calendar-date">

      <span class="weekday">
        {{ firstEvent.weekday }}
      </span>
      <div class="date-separator"></div>
      <div class="date-number">
        {{ firstEvent.day }}
      </div>
<div class="date-separator"></div>
      <span class="month">
        THÁNG {{ firstEvent.month }}
      </span>

    </div>


    <div class="year">
      {{ firstEvent.year }}
    </div>


    <div class="lunar">
      {{ firstEvent.lunar }}
    </div>

  </div>


  <!-- =========================
       CALENDAR
       ========================= -->

  <div class="calendar-card">

    <div class="calendar-top">

      <div class="calendar-label">
        SAVE THE DATE
      </div>

      <div class="calendar-header">
        Tháng {{ firstEvent.month }} / {{ firstEvent.year }}
      </div>

    </div>


    <div class="calendar-week">

      <div
        v-for="d in weekDays"
        :key="d"
      >
        {{ d }}
      </div>

    </div>


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
            class="heart-day"
          >
            <span class="heart">
              ♥
            </span>

            <span class="heart-number">
              {{ day }}
            </span>
          </div>

          <span v-else>
            {{ day }}
          </span>

        </template>

      </div>

    </div>

  </div>


  <!-- =========================
       ACTION
       ========================= -->

  <div class="action">

    <a
      class="calendar-link"
      :href="calendarUrl"
      target="_blank"
      rel="noopener"
    >
      <span class="calendar-icon">＋</span>

      <span>
        Thêm vào lịch
      </span>
    </a>


    <button
      class="confirm-btn"
      type="button"
      @click="$emit('confirm')"
    >
      <span>
        XÁC NHẬN THAM DỰ
      </span>

      <i>→</i>
    </button>

  </div>

</div>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();

const firstEvent = computed(() => store.wedding.events?.[0] ?? {});

const calendarUrl = computed(() => {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE`;
});

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const calendarDays = computed(() => {
  const year = Number(firstEvent.value.year);
  const month = Number(firstEvent.value.month);

  if (!year || !month) return [];

  const firstDate = new Date(year, month - 1, 1);

  let start = firstDate.getDay();

  // đổi Chủ nhật thành cuối tuần
  start = start === 0 ? 6 : start - 1;

  const totalDays = new Date(year, month, 0).getDate();

  const result = [];

  for (let i = 0; i < start; i++) {
    result.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    result.push(i);
  }

  while (result.length % 7 !== 0) {
    result.push(null);
  }

  return result;
});
</script>

<style scoped>

.invitation-section {
    position: relative;
    background: #f8f5ed;
    width: 100%;
    max-width: 680px;

    margin: 0 auto;

    padding: 20px 16px 60px;

    color: var(--text);
}


/* =========================================================
   HEADER
   ========================================================= */

.invitation-heading {
    max-width: 520px;

    margin: 0 auto 32px;

    text-align: center;
}


/* WEDDING INVITATION */

.invitation-kicker {
    margin-bottom: 8px;


    font-size: 8px;

    font-weight: 500;

    letter-spacing: 3px;

    color: var(--gold);

    text-transform: uppercase;
}


/* Title */

.invitation-title {
    margin: 0;


    font-size: clamp(20px, 8vw, 30px);

    font-weight: 600;


    line-height: 1.05;

    color: var(--primary);
}


/* Ornament */

.invitation-ornament {
    display: flex;

    align-items: center;
    justify-content: center;

    gap: 10px;

    margin: 14px auto 14px;
}


.invitation-ornament span {
    width: 42px;
    height: 1px;

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(216,180,109,.7)
        );
}


.invitation-ornament span:last-child {
    background:
        linear-gradient(
            90deg,
            rgba(216,180,109,.7),
            transparent
        );
}


.invitation-ornament i {

    font-size: 14px;

    font-style: normal;

    color: var(--gold);
}


/* Description */

.invitation-heading .desc {
    max-width: 420px;

    margin: 0 auto;


    font-size: 12px;

    font-weight: 300;

    line-height: 1.8;

    color: var(--sub-text);
}


/* =========================================================
   EVENT INFORMATION
   ========================================================= */

.event-info {
    position: relative;

    text-align: center;

    margin: 0 auto 32px;

    color: var(--primary);
}

.date-separator {
  width: 1px;
  height: 28px;

  flex-shrink: 0;

  background: rgba(123, 13, 13, 0.38);
}
/* VÀO LÚC */

.time-label {
    margin-bottom: 2px;


    font-size: 8px;

    font-weight: 500;

    letter-spacing: 2.5px;

    color: var(--gold);

    text-transform: uppercase;
}


/* 09:00 */

.time {
    margin-bottom: 16px;


    font-size: 25px;

    font-weight: 600;

    line-height: 1;

    color: var(--primary);
}


/* =========================================================
   DATE
   ========================================================= */

.calendar-date {
    display: flex;

    align-items: center;
    justify-content: center;

    gap: 13px;
}


/* THỨ */

.calendar-date .weekday {
    font-size: 15px;

    font-weight: 600;

    text-transform: uppercase;

    color: var(--primary);
}


/* NGÀY */

.date-number {
    position: relative;

    padding: 0 14px;


    font-size: 48px;

    font-weight: 500;

    line-height: .9;

    color: var(--primary);
}


/* line hai bên */

.date-number::before,
.date-number::after {
    content: "";

    position: absolute;

    top: 50%;

    width: 25px;

    height: 1px;

    background: rgba(123,13,13,.22);
}


.date-number::before {
    right: 100%;
}


.date-number::after {
    left: 100%;
}


/* THÁNG */

.calendar-date .month {

    font-size: 14px;

    font-weight: 600;

    color: var(--primary);

    white-space: nowrap;
}


/* =========================================================
   YEAR
   ========================================================= */

.event-info .year {
    margin-top: 13px;


    font-size: 24px;

    font-weight: 600;

    color: var(--primary);
}


/* Lunar */

.lunar {
    margin-top: 8px;


    font-size: 12px;

    font-style: italic;

    color: var(--sub-text);
}


/* =========================================================
   CALENDAR CARD
   ========================================================= */

.calendar-card {
    position: relative;

    width: 100%;

    max-width: 520px;

    margin: 0 auto 28px;

    padding: 20px;

    border-radius: 20px;

    background:
        rgba(255,255,255,.68);

    border: 1px solid rgba(123,13,13,.1);

    box-shadow:
        0 15px 45px rgba(78,46,35,.07);

    backdrop-filter: blur(8px);

    -webkit-backdrop-filter: blur(8px);
}


/* =========================================================
   CALENDAR HEADER
   ========================================================= */

.calendar-top {
    text-align: center;

    margin-bottom: 18px;
}


.calendar-label {
    margin-bottom: 5px;

    font-size: 7px;

    font-weight: 500;

    letter-spacing: 3px;

    color: var(--gold);
}


.calendar-header {

    font-size: 22px;

    font-weight: 600;

    color: var(--primary);
}


/* =========================================================
   WEEK
   ========================================================= */

.calendar-week {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    padding-bottom: 8px;

    border-bottom: 1px solid rgba(123,13,13,.08);
}


.calendar-week > div {
    text-align: center;


    font-size: 8px;

    font-weight: 500;

    color: var(--sub-text);

    text-transform: uppercase;
}


/* =========================================================
   DAYS
   ========================================================= */

.calendar-days {
    display: grid;

    grid-template-columns:
        repeat(7, 1fr);

    row-gap: 5px;

    padding-top: 8px;
}


.calendar-cell {
    position: relative;

    min-height: 38px;

    display: flex;

    align-items: center;
    justify-content: center;


    font-size: 15px;

    color: var(--text);
}


.calendar-cell.empty {
    pointer-events: none;
}


/* =========================================================
   ACTIVE DAY
   ========================================================= */

.heart-day {
    position: relative;

    width: 34px;
    height: 34px;

    display: flex;

    align-items: center;
    justify-content: center;
}


.heart {
    position: absolute;

    inset: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    font-size: 55px;

    color: var(--primary);

    line-height: 1;
}


.heart-number {
    position: relative;

    z-index: 2;

    margin-top: 1px;


    font-size: 15px;

    font-weight: 600;

    color: #fff;
}
/* =========================================================
   ACTION
   ========================================================= */

.action {
    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 10px;

    width: 100%;

    max-width: 420px;

    margin: 0 auto;
}


/* =========================================================
   ADD TO CALENDAR
   ========================================================= */

.calendar-link {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 7px;

    min-height: 42px;

    padding: 0 20px;

    border: 1px solid rgba(123,13,13,.18);

    border-radius: 999px;

    background: transparent;

    color: var(--primary);

    font-size: 10px;

    font-weight: 500;

    text-decoration: none;

    transition:
        background .3s ease,
        color .3s ease,
        transform .3s ease;
}


.calendar-icon {
    font-size: 15px;

    color: var(--gold);
}


.calendar-link:hover {
    background: var(--primary);

    color: #fff;

    transform: translateY(-2px);
}


/* =========================================================
   CONFIRM
   ========================================================= */

.confirm-btn {
    position: relative;

    width: 100%;

    min-height: 50px;

    display: flex;

    align-items: center;
    justify-content: center;

    gap: 18px;

    padding: 0 24px;

    border: none;

    border-radius: 999px;

    background:
        linear-gradient(
            135deg,
            #7b0d0d,
            #941c1c
        );

    color: #fff;


    font-size: 10px;

    font-weight: 500;

    letter-spacing: 1.2px;

    cursor: pointer;

    box-shadow:
        0 10px 25px rgba(123,13,13,.18);

    transition:
        transform .3s ease,
        box-shadow .3s ease;
}


.confirm-btn:hover {
    transform: translateY(-2px);

    box-shadow:
        0 14px 30px rgba(123,13,13,.25);
}


.confirm-btn i {
    font-size: 16px;

    font-style: normal;

    color: var(--gold);

    transition:
        transform .3s ease;
}


.confirm-btn:hover i {
    transform: translateX(4px);
}
@media (max-width: 600px) {

    .invitation-section {
        padding:
            10px
            14px
            45px;
    }


    .invitation-heading {
        margin-bottom: 26px;
    }


    .invitation-kicker {
        font-size: 7px;

        letter-spacing: 2.5px;
    }


    .invitation-title {
        font-size: 20px;
    }


    .invitation-heading .desc {
        max-width: 330px;

        font-size: 11px;

        line-height: 1.75;
    }


    /* EVENT */

    .time-label {
        font-size: 7px;

        letter-spacing: 2px;
    }


    .time {
        font-size: 23px;

        margin-bottom: 14px;
    }


    .calendar-date {
        gap: 9px;
    }


    .calendar-date .weekday {
        font-size: 13px;
    }


    .date-number {
        font-size: 44px;

        padding: 0 10px;
    }


    .date-number::before,
    .date-number::after {
        width: 17px;
    }


    .calendar-date .month {
        font-size: 12px;
    }


    .event-info .year {
        font-size: 22px;
    }


    .lunar {
        font-size: 11px;
    }


    /* CALENDAR */

    .calendar-card {
        padding: 16px 12px;

        border-radius: 17px;
    }


    .calendar-label {
        font-size: 6px;

        letter-spacing: 2.5px;
    }


    .calendar-header {
        font-size: 20px;
    }


    .calendar-cell {
        min-height: 34px;

        font-size: 14px;
    }


    .heart-day {
        width: 31px;
        height: 31px;
    }


    .heart {
        font-size: 31px;
    }


    .heart-number {
        font-size: 12px;
    }


    /* BUTTON */

    .action {
        max-width: 100%;
    }


    .calendar-link {
        min-height: 40px;

        font-size: 9px;
    }


    .confirm-btn {
        min-height: 48px;

        font-size: 9px;

        letter-spacing: 1px;
    }
}
</style>
