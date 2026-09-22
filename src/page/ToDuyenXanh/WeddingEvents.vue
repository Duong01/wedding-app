<template>
  <section class="tdx-events" ref="sectionRef">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-events__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />

      <img
        :src="ribbonDecoration"
        alt=""
        class="tdx-decor tdx-decor--ribbon"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-events__inner">
      <h2 class="tdx-heading">THÔNG TIN TIỆC CƯỚI</h2>

      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="tdx-event reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- GIỜ + NGÀY -->
        <div v-if="event.hasDate" class="tdx-event__when">
          <p v-if="event.time" class="tdx-event__time">VÀO LÚC {{ event.time }}</p>

          <p class="tdx-event__weekday">{{ event.weekday }}</p>

          <div class="tdx-event__date">
            <span class="tdx-event__day">{{ event.day }}</span>

            <div class="tdx-event__date-line" aria-hidden="true"></div>

            <div class="tdx-event__date-side">
              <span>THÁNG {{ event.month }}</span>
              <span>{{ event.year }}</span>
            </div>
          </div>

          <p v-if="event.lunar" class="tdx-event__lunar">{{ event.lunar }}</p>
        </div>

        <!-- ĐẾM NGƯỢC -->
        <div v-if="event.hasDate" class="tdx-countdown">
          <p class="tdx-countdown__label">CÙNG ĐẾM NGƯỢC</p>

          <div class="tdx-countdown__grid">
            <div class="tdx-countdown__cell">
              <strong>{{ countdown.days }}</strong>
              <span>NGÀY</span>
            </div>

            <div class="tdx-countdown__cell">
              <strong>{{ countdown.hours }}</strong>
              <span>GIỜ</span>
            </div>

            <div class="tdx-countdown__cell">
              <strong>{{ countdown.minutes }}</strong>
              <span>PHÚT</span>
            </div>

            <div class="tdx-countdown__cell">
              <strong>{{ countdown.seconds }}</strong>
              <span>GIÂY</span>
            </div>
          </div>
        </div>

        <!-- ĐỊA ĐIỂM -->
        <div v-if="event.location || event.address" class="tdx-event__place">
          <p v-if="event.location" class="tdx-event__place-name">{{ event.location }}</p>

          <p v-if="event.address" class="tdx-event__place-address">{{ event.address }}</p>
        </div>

        <!-- LỊCH THÁNG -->
        <div v-if="event.hasDate && event.calendarDays.length" class="tdx-calendar">
          <p class="tdx-calendar__month">Tháng {{ event.month }}</p>

          <div class="tdx-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="tdx-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="tdx-calendar__cell"
            >
              <template v-if="day">
                <span v-if="day === Number(event.day)" class="tdx-calendar__heart">
                  <svg viewBox="0 0 32 30" aria-hidden="true">
                    <path
                      d="M16 29S1 19.5 1 10.2A8.2 8.2 0 0 1 16 5.6 8.2 8.2 0 0 1 31 10.2C31 19.5 16 29 16 29Z"
                      fill="currentColor"
                    />
                  </svg>

                  <b>{{ day }}</b>
                </span>

                <span v-else class="tdx-calendar__day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="tdx-calendar__link"
          >
            <span aria-hidden="true">＋</span>
            THÊM VÀO LỊCH
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="tdx-rsvp-btn" @click="openConfirmModal(event)">
          XÁC NHẬN THAM DỰ
        </button>
      </article>
    </div>

    <!-- =====================================================
         MODAL XÁC NHẬN
    ====================================================== -->

    <Teleport to="body">
      <Transition name="tdx-modal">
        <div v-if="showConfirmModal" class="tdx-confirm-overlay" @click.self="closeConfirmModal">
          <div class="tdx-confirm-modal">
            <button type="button" class="tdx-modal-close" @click="closeConfirmModal">×</button>

            <div class="tdx-modal-header">
              <span>THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
            </div>

            <!-- KHÁCH ĐƯỢC MỜI -->
            <div v-if="hasRecipient" class="tdx-recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- HỌ TÊN -->
            <div v-else class="tdx-form-group">
              <label>Họ và tên</label>

              <input
                v-model.trim="form.name"
                type="text"
                maxlength="100"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <!-- THAM DỰ -->
            <div class="tdx-form-group">
              <label>Bạn có tham dự không?</label>

              <div class="tdx-attendance">
                <button
                  type="button"
                  class="tdx-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="tdx-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- SỐ NGƯỜI -->
            <div v-if="form.attendance === 'attending'" class="tdx-form-group">
              <label>Số người tham dự</label>

              <div class="tdx-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="tdx-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="tdx-form-success">{{ successMessage }}</div>

            <button
              type="button"
              class="tdx-modal-submit"
              :disabled="submitting"
              @click="submitConfirmation"
            >
              {{ submitting ? "ĐANG GỬI..." : "GỬI XÁC NHẬN" }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { Confirm } from "@/model/api";

import {
  flowerDecoration,
  lineDecoration,
  ribbonDecoration,
} from "./toDuyenXanhAssets";

const props = defineProps({
  events: { type: Array, default: () => [] },
  recipientName: { type: [Object, Array, String], default: null },
});

const route = useRoute();

const sectionRef = ref(null);

const showConfirmModal = ref(false);
const selectedEvent = ref(null);

const form = ref({
  name: "",
  attendance: "",
  numberOfPeople: 1,
});

const submitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const recipientName = computed(() => {
  const value = props.recipientName;

  if (!value) return "";

  if (typeof value === "string") return value.trim();

  if (Array.isArray(value)) return value[0]?.Name || "";

  return value.Name || "";
});

const hasRecipient = computed(() => !!recipientName.value);

/* =========================================
   NORMALIZE EVENTS
========================================= */

const normalizedEvents = computed(() => {
  return (props.events || []).map((item) => {
    const rawDate = item.EventDate || item.Date || item.StartDate;

    const date = dayjs(rawDate);

    let month = "";
    let day = "";
    let year = "";
    let weekday = "";

    if (date.isValid()) {
      day = date.format("DD");
      month = date.format("MM");
      year = date.format("YYYY");

      const weekdays = [
        "CHỦ NHẬT",
        "THỨ HAI",
        "THỨ BA",
        "THỨ TƯ",
        "THỨ NĂM",
        "THỨ SÁU",
        "THỨ BẢY",
      ];

      weekday = weekdays[date.day()];
    }

    const calendarDays =
      item.calendarDays || buildCalendarDays(Number(year), Number(month));

    return {
      ...item,

      hasDate: date.isValid(),

      time:
        item.EventTime ||
        item.Time ||
        item.StartTime ||
        (date.isValid() ? date.format("HH:mm") : ""),

      day,
      month,
      year,
      weekday,

      date: rawDate,

      lunar: item.LunarDate || item.lunar || "",

      location: item.Location || item.location || "",

      address: item.Address || item.address || "",

      calendarUrl: item.CalendarUrl || item.calendarUrl || "",

      calendarDays,
    };
  });
});

/* =========================================
   ĐẾM NGƯỢC
========================================= */

const now = ref(Date.now());

let countdownTimer;

const targetTime = computed(() => {
  const first = normalizedEvents.value.find((event) => event.hasDate);

  if (!first) return null;

  const date = dayjs(first.date);

  if (!date.isValid()) return null;

  const [hour, minute] = String(first.time || "00:00")
    .split(":")
    .map((part) => Number(part) || 0);

  return date.hour(hour).minute(minute).second(0).valueOf();
});

const countdown = computed(() => {
  const pad = (value) => String(Math.max(0, value)).padStart(2, "0");

  if (!targetTime.value) {
    return { days: "--", hours: "--", minutes: "--", seconds: "--" };
  }

  const distance = targetTime.value - now.value;

  if (distance <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const seconds = Math.floor(distance / 1000);

  return {
    days: pad(Math.floor(seconds / 86400)),
    hours: pad(Math.floor((seconds % 86400) / 3600)),
    minutes: pad(Math.floor((seconds % 3600) / 60)),
    seconds: pad(seconds % 60),
  };
});

/* =========================================
   LỊCH THÁNG
========================================= */

function buildCalendarDays(year, month) {
  if (!year || !month) return [];

  const firstDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);

  const daysInMonth = firstDay.daysInMonth();

  const startDay = firstDay.day();

  const result = [];

  for (let i = 0; i < startDay; i++) {
    result.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    result.push(i);
  }

  return result;
}

/* =========================================
   RSVP
========================================= */

function openConfirmModal(event) {
  selectedEvent.value = event;

  form.value = {
    name: recipientName.value || "",
    attendance: "attending",
    numberOfPeople: 1,
  };

  errorMessage.value = "";
  successMessage.value = "";

  showConfirmModal.value = true;

  document.body.style.overflow = "hidden";
}

function closeConfirmModal() {
  showConfirmModal.value = false;

  document.body.style.overflow = "";
}

function increasePeople() {
  if (form.value.numberOfPeople < 10) {
    form.value.numberOfPeople++;
  }
}

function decreasePeople() {
  if (form.value.numberOfPeople > 1) {
    form.value.numberOfPeople--;
  }
}

async function submitConfirmation() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!hasRecipient.value && !form.value.name) {
    errorMessage.value = "Vui lòng nhập họ và tên.";
    return;
  }

  if (!form.value.attendance) {
    errorMessage.value = "Vui lòng chọn xác nhận tham dự.";
    return;
  }

  submitting.value = true;

  try {
    const slug = route.params.slug
      ? route.params.token
        ? `${route.params.slug}/${route.params.token}`
        : route.params.slug
      : "";

    const payload = {
      Slug: slug,
      RecipientToken: route.params.token || null,
      GuestName: form.value.name,
      Attendance:
        form.value.attendance === "attending" ? "Có tham dự" : "Không tham dự",
      NumberOfPeople:
        form.value.attendance === "attending" ? form.value.numberOfPeople : 0,
    };

    const response = await Confirm(payload);

    const result = response?.data;

    if (!result || result.status !== "success") {
      throw new Error(result?.message || "Không thể gửi xác nhận.");
    }

    successMessage.value = "Cảm ơn bạn đã xác nhận tham dự ❤️";

    setTimeout(() => {
      closeConfirmModal();
    }, 1800);
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Có lỗi xảy ra. Vui lòng thử lại.";
  } finally {
    submitting.value = false;
  }
}

/* =========================================
   SCROLL REVEAL
========================================= */

let observer;

onMounted(() => {
  countdownTimer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  sectionRef.value?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
});

onBeforeUnmount(() => {
  window.clearInterval(countdownTimer);

  observer?.disconnect();

  document.body.style.overflow = "";
});
</script>

<style scoped>
.tdx-events {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);
  --tdx-cream: var(--accent-light, #f3dfc5);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-events__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 120px;
  right: -70px;

  width: 198px;
  height: 420px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: 90px;
  right: -80px;

  width: 190px;
  height: 190px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

.tdx-decor--ribbon {
  bottom: -10px;
  left: -365px;

  width: 700px;
  height: 155px;

  object-fit: contain;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-events__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 2.5% 10% 22%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

  text-align: start;
}

.tdx-heading {
  margin: 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.tdx-event {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}

/* =========================================================
   GIỜ + NGÀY
========================================================= */

.tdx-event__when {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  font-family: Baskerville, "Times New Roman", serif;
}

.tdx-event__time {
  margin: 0;

  color: var(--tdx-green);

  font-size: 12px;

  text-transform: uppercase;
}

.tdx-event__weekday {
  margin: 0;

  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 12px;

  text-transform: uppercase;
}

.tdx-event__date {
  display: flex;
  align-items: center;
  gap: 9px;

  color: var(--tdx-green);
}

.tdx-event__day {
  font-family: Baskerville, "Times New Roman", serif;
  font-size: 57px;

  line-height: 1;
}

.tdx-event__date-line {
  width: 1px;
  height: 46px;

  background: var(--tdx-green);
}

.tdx-event__date-side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  font-family: "Times New Roman", serif;
  font-size: 17px;

  text-transform: uppercase;
}

.tdx-event__lunar {
  margin: 0;

  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 12px;

  text-transform: uppercase;
}

/* =========================================================
   ĐẾM NGƯỢC
========================================================= */

.tdx-countdown {
  width: 100%;

  padding: 16px 0;

  border-top: 1px solid var(--tdx-line);
  border-bottom: 1px solid var(--tdx-line);
}

.tdx-countdown__label {
  margin: 0 0 12px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;
  text-indent: 0.24em;

  text-transform: uppercase;
}

.tdx-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.tdx-countdown__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tdx-countdown__cell strong {
  font-family: Baskerville, "Times New Roman", serif;
  font-size: 26px;
  font-weight: 400;

  line-height: 1;

  color: var(--tdx-green);
}

.tdx-countdown__cell span {
  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 9px;

  letter-spacing: 0.16em;
}

/* =========================================================
   ĐỊA ĐIỂM
========================================================= */

.tdx-event__place {
  width: 100%;
}

.tdx-event__place-name {
  margin: 0 0 4px;

  color: var(--tdx-green);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 15px;
  font-weight: 600;

  line-height: 1.4;
}

.tdx-event__place-address {
  margin: 0;

  color: var(--tdx-ink);

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 11px;

  line-height: 1.5;

  white-space: pre-line;
}

/* =========================================================
   LỊCH THÁNG
========================================================= */

.tdx-calendar {
  width: 100%;
}

.tdx-calendar__month {
  margin: 0 0 10px;

  color: var(--tdx-green);

  font-family: "The Nautigal", cursive;
  font-size: 40px;
  font-weight: 400;

  line-height: 1;
}

.tdx-calendar__weekdays,
.tdx-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.tdx-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid var(--tdx-line);
}

.tdx-calendar__weekdays span {
  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;
}

.tdx-calendar__cell {
  min-height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.tdx-calendar__day {
  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;
}

.tdx-calendar__heart {
  position: relative;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tdx-green);
}

.tdx-calendar__heart svg {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
}

.tdx-calendar__heart b {
  position: relative;

  color: var(--tdx-bg);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;
  font-weight: 400;
}

.tdx-calendar__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-top: 14px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;
}

/* =========================================================
   NÚT RSVP
========================================================= */

.tdx-rsvp-btn {
  width: 100%;

  padding: 13px 18px;

  border: 0;
  border-radius: 7px;

  color: #fefbf4;

  background: var(--tdx-green);

  box-shadow: 0 12px 26px rgba(94, 129, 60, 0.3);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tdx-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 16px 32px rgba(94, 129, 60, 0.4);
}

/* =========================================================
   REVEAL
========================================================= */

.reveal {
  opacity: 0;

  transform: translateY(35px);

  transition:
    opacity 0.8s ease var(--delay, 0ms),
    transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay, 0ms);
}

.reveal.visible {
  opacity: 1;

  transform: translateY(0);
}

/* =========================================================
   MODAL
========================================================= */

.tdx-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(26, 53, 0, 0.45);

  backdrop-filter: blur(6px);
}

.tdx-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: #fefbf4;

  box-shadow: 0 30px 80px rgba(26, 53, 0, 0.28);

  text-align: center;

  color: var(--tdx-ink);
}

.tdx-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: var(--tdx-green);

  background: transparent;

  cursor: pointer;
}

.tdx-modal-header > span {
  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;

  letter-spacing: 0.28em;
}

.tdx-modal-header h3 {
  margin: 8px 0;

  color: var(--tdx-green);

  font-family: Carattere, cursive;
  font-size: 34px;
  font-weight: 400;
}

.tdx-modal-header p {
  margin: 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;
}

/* =========================================================
   FORM
========================================================= */

.tdx-form-group {
  margin-top: 20px;

  text-align: left;
}

.tdx-form-group label {
  display: block;

  margin-bottom: 8px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

.tdx-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  outline: none;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 16px;

  color: var(--tdx-ink);

  background: #ffffff;

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.tdx-form-group input:focus {
  border-color: var(--tdx-green);

  box-shadow: 0 0 0 3px rgba(94, 129, 60, 0.14);
}

.tdx-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tdx-attendance-option {
  padding: 12px 14px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  text-align: left;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;

  color: var(--tdx-ink);

  background: #ffffff;

  cursor: pointer;

  transition: all 0.25s ease;
}

.tdx-attendance-option.selected {
  border-color: var(--tdx-green);

  background: rgba(94, 129, 60, 0.1);

  font-weight: 600;
}

.tdx-attendance-option span {
  margin-right: 8px;

  color: var(--tdx-green);
}

.tdx-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.tdx-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid var(--tdx-green);
  border-radius: 50%;

  font-size: 20px;

  color: var(--tdx-ink);

  background: #fefbf4;

  cursor: pointer;
}

.tdx-people-control strong {
  min-width: 25px;

  text-align: center;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 18px;

  color: var(--tdx-ink);
}

.tdx-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px dashed var(--tdx-line);
  border-radius: 4px;

  text-align: center;

  background: rgba(243, 223, 197, 0.35);
}

.tdx-recipient-box span {
  display: block;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;

  letter-spacing: 0.22em;
}

.tdx-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: Carattere, cursive;
  font-size: 30px;
  font-weight: 400;

  color: var(--tdx-green);
}

.tdx-form-error,
.tdx-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 4px;

  text-align: center;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;
}

.tdx-form-error {
  color: #a34d4d;

  background: rgba(163, 77, 77, 0.08);
}

.tdx-form-success {
  color: #2e7d6b;

  background: rgba(46, 125, 107, 0.08);
}

.tdx-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 0;
  border-radius: 7px;

  color: #fefbf4;

  background: var(--tdx-green);

  box-shadow: 0 12px 26px rgba(94, 129, 60, 0.3);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease;
}

.tdx-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.tdx-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================================================
   MODAL ANIMATION
========================================================= */

.tdx-modal-enter-active,
.tdx-modal-leave-active {
  transition: opacity 0.3s ease;
}

.tdx-modal-enter-from,
.tdx-modal-leave-to {
  opacity: 0;
}

.tdx-modal-enter-active .tdx-confirm-modal {
  animation: tdx-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes tdx-modal-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-events__inner {
    width: min(100%, 600px);

    padding: 2.5% 5px 22%;

    gap: 28px;
  }

  .tdx-decor--line-right {
    top: 160px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 560px;
  }

  .tdx-decor--flower-right {
    top: 80px;
    left: -300px;
    right: auto;

    width: 420px;
    height: 420px;
  }

  .tdx-decor--ribbon {
    bottom: 20px;
    left: -538px;

    width: 1403px;
    height: 246px;
  }

  .tdx-heading {
    font-size: 27px;
  }

  .tdx-event__time,
  .tdx-event__weekday,
  .tdx-event__lunar {
    font-size: 16px;
  }

  .tdx-event__day {
    font-size: 78px;
  }

  .tdx-event__date-line {
    height: 63px;
  }

  .tdx-event__date-side {
    font-size: 23px;
  }

  .tdx-countdown__cell strong {
    font-size: 34px;
  }

  .tdx-countdown__cell span {
    font-size: 11px;
  }

  .tdx-event__place-name {
    font-size: 19px;
  }

  .tdx-event__place-address {
    font-size: 14px;
  }

  .tdx-calendar__month {
    font-size: 52px;
  }

  .tdx-calendar__day,
  .tdx-calendar__heart b {
    font-size: 14px;
  }

  .tdx-calendar__cell {
    min-height: 40px;
  }

  .tdx-calendar__heart {
    width: 40px;
    height: 40px;
  }

  .tdx-rsvp-btn {
    font-size: 13px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;

    transform: none;

    transition: none;
  }

  .tdx-rsvp-btn,
  .tdx-modal-submit {
    transition: none;
  }
}
</style>
