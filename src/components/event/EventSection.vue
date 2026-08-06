<template>
  <section class="event-section">
    <v-container class="invite">
      <div class="event-card">
        <div class="section-head">
          <h2 class="title">THÔNG TIN TIỆC CƯỚI</h2>

          <p class="desc">
            Trân trọng kính mời Quý khách đến chung vui cùng gia đình
          </p>
        </div>

        <!-- Thời gian -->
        <div class="event-info">
          <div class="time">
            {{ firstEvent.time }}
          </div>

          <div class="calendar-date">
            <span>{{ firstEvent.weekday }}</span>

            <div class="day">
              {{ firstEvent.day }}
            </div>

            <span>THÁNG {{ firstEvent.month }}</span>
          </div>

          <div class="year">
            {{ firstEvent.year }}
          </div>

          <div class="lunar">
            {{ firstEvent.lunar }}
          </div>
        </div>

        <!-- Lịch -->
        <!-- Calendar -->
        <div class="calendar-card">
          <div class="calendar-header">
            Tháng {{ firstEvent.month }} / {{ firstEvent.year }}
          </div>

          <div class="calendar-week">
            <div v-for="d in weekDays" :key="d">
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
                <div v-if="day === Number(firstEvent.day)" class="heart-day">
                  ❤
                  <span>{{ day }}</span>
                </div>

                <span v-else>
                  {{ day }}
                </span>
              </template>
            </div>
          </div>
        </div>

        <!-- Button -->
        <div class="action">
          <a class="calendar-link" :href="calendarUrl" target="_blank">
            Thêm vào lịch
          </a>

          <button class="confirm-btn" @click="$emit('confirm')">
            XÁC NHẬN THAM DỰ
          </button>
        </div>
      </div>
    </v-container>
  </section>
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
.event-section {
  /* padding:90px 20px; */
  background: #f7f2ea;
  position: relative;
}

.event-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("/images/paper.webp");
  opacity: 0.12;
  pointer-events: none;
}

.invite {
  max-width: 820px;
  margin: auto;
}

/* ================= CARD ================= */

.event-card {
  background: #fffdfb;
  border: 1px solid #ead7d2;
  border-radius: 28px;
  padding: 55px 45px;
  text-align: center;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
  position: relative;
}

/* ================= TITLE ================= */

.sub-title {
  display: block;
  color: #b68d63;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-size: 13px;
  margin-bottom: 10px;
}

.title {
  color: #7b1f1f;
  font-size: 20px;
  font-family: "Cormorant Garamond", serif;
  margin-bottom: 15px;
}

.desc {
  color: #7d6f6b;
  font-size: 14px;
  line-height: 1.7;
}

/* ================= TIME ================= */

.time {
  margin: 35px 0 28px;
  font-size: 42px;
  color: #7b1f1f;
  font-weight: 700;
}

/* ================= DATE ================= */

.calendar-date {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 20px;
}

.calendar-date span {
  color: #7b1f1f;

  font-size: 18px;

  font-weight: 500;
}

.day {
  font-size: 72px;

  font-family: "Cormorant Garamond", serif;

  color: #7b1f1f;

  line-height: 1;

  padding: 0 18px;

  border-left: 1px solid #d9bfb8;

  border-right: 1px solid #d9bfb8;
}

.year {
  margin-top: 15px;

  font-size: 34px;

  color: #7b1f1f;
}

.lunar {
  margin-top: 10px;
  color: #9c8c87;
  font-size: 15px;
  font-style: italic;
}

/* ================= SCHEDULE ================= */

.schedule {
  margin: 45px auto;

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 20px;

  max-width: 450px;
}

.schedule-item {
  background: #faf7f4;

  border: 1px solid #ead7d2;

  border-radius: 18px;

  padding: 20px;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.schedule-item small {
  display: block;

  color: #8e6d63;

  letter-spacing: 2px;

  font-size: 12px;

  margin-bottom: 10px;
}

.schedule-item strong {
  color: #7b1f1f;

  font-size: 28px;
}

/* ================= CALENDAR ================= */

.calendar-card {
  margin: 45px auto;

  max-width: 450px;

  background: white;

  border-radius: 20px;

  overflow: hidden;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

  border: 1px solid #ead7d2;
}

/* ================= ACTION ================= */

.action {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 18px;
}

.calendar-link {
  align-items: center;

  justify-content: center;

  border-radius: 999px;

  color: #7b1f1f;

  transition: 0.3s;
}

.calendar-link:hover {
  color: #ccc;
}

.confirm-btn {
  width: 280px;

  height: 54px;

  border: none;

  border-radius: 999px;

  background: #7b1f1f;

  color: #fff;

  font-size: 16px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.3s;

  box-shadow: 0 12px 25px rgba(123, 31, 31, 0.28);
}

.confirm-btn:hover {
  transform: translateY(-3px);

  background: #641515;
}

/* ================= MOBILE ================= */

@media (max-width: 768px) {
  .event-card {
    padding: 35px 22px;
  }

  .title {
    font-size: 30px;
  }

  .desc {
    font-size: 15px;
  }

  .time {
    font-size: 32px;
  }

  .calendar-date {
    gap: 12px;
  }

  .calendar-date span {
    font-size: 15px;
  }

  .day {
    font-size: 56px;

    padding: 0 12px;
  }

  .year {
    font-size: 28px;
  }

  .schedule {
    grid-template-columns: 1fr;

    max-width: 280px;
  }

  .calendar-card {
    max-width: 100%;
  }

  .confirm-btn {
    width: 100%;

    max-width: 280px;
  }
}
.calendar-card {
  width: 420px;
  max-width: 100%;
  margin: 35px auto;
  background: #fffdf9;
  border: 1px solid #d9b6ae;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.calendar-header {
  padding: 18px;
  font-size: 22px;
  font-weight: 700;
  color: #7b1f1f;
  border-bottom: 1px solid #ead7d1;
  font-family: "Cormorant Garamond", serif;
}

.calendar-week,
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-week div {
  padding: 12px 0;
  text-align: center;
  font-size: 14px;
  color: #9a5a52;
  border-bottom: 1px solid #f2e5df;
}

.calendar-cell {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6a1f1f;
  font-size: 16px;
}

.calendar-cell.empty {
  visibility: hidden;
}

.heart-day {
  position: relative;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7b1f1f;
  font-size: 34px;
}

.heart-day span {
  position: absolute;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -58%);
}

@media (max-width: 768px) {
  .calendar-card {
    width: 100%;
  }

  .calendar-cell {
    height: 42px;
    font-size: 14px;
  }

  .calendar-header {
    font-size: 20px;
  }

  .heart-day {
    width: 30px;
    height: 30px;
    font-size: 30px;
  }

  .heart-day span {
    font-size: 11px;
  }
}
</style>
