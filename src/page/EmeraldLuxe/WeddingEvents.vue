<template>
  <section class="el-events" ref="sectionRef">
    <div class="el-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="el-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- EVENT TITLE -->
        <div class="el-event-heading">
          <h2>{{ event.Title || "TIỆC CƯỚI" }}</h2>

          <div class="el-mini-divider">
            <span></span>
            <i>❦</i>
            <span></span>
          </div>
        </div>

        <!-- DATE -->
        <div v-if="event.hasDate" class="el-event-date">
          <div class="el-event-weekday">{{ event.weekday }}</div>

          <div class="el-event-main-date">
            <div class="el-date-side">
              <span>THÁNG</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="el-date-number">{{ event.day }}</div>

            <div class="el-date-side">
              <span>NĂM</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="el-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- TIME -->
        <div v-if="event.time" class="el-event-time">
          <div>
            <small>THỜI GIAN</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- SCHEDULE -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="el-event-schedule">
          <div v-if="event.receptionTime" class="el-schedule-row">
            <div class="el-schedule-dot"><span>❦</span></div>

            <div class="el-schedule-content">
              <span>ĐÓN KHÁCH</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="el-schedule-row">
            <div class="el-schedule-dot"><span>✦</span></div>

            <div class="el-schedule-content">
              <span>KHAI TIỆC</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- CALENDAR -->
        <div v-if="event.date && event.calendarDays?.length" class="el-calendar">
          <div class="el-calendar__header">
            <span>LỊCH</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="el-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="el-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="el-calendar__cell"
              :class="{ empty: !day, active: day === Number(event.day) }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.day)" class="el-active-day">
                  <span class="el-active-sun">✦</span>
                  <span>{{ day }}</span>
                </div>

                <span v-else class="el-normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="el-calendar-btn"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="el-rsvp-btn" @click="openConfirmModal(event)">
          <span>❦</span>
          XÁC NHẬN THAM DỰ
          <span>❦</span>
        </button>

        <div class="el-event-bottom">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>
      </article>
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="el-modal">
        <div v-if="showConfirmModal" class="el-confirm-overlay" @click.self="closeConfirmModal">
          <div class="el-confirm-modal">
            <button type="button" class="el-modal-close" @click="closeConfirmModal">×</button>

            <div class="el-modal-header">
              <div class="el-modal-symbol">✦</div>

              <span>THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="el-recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="el-form-group">
              <label>Họ và tên</label>

              <input v-model.trim="form.name" type="text" maxlength="100" placeholder="Nhập tên của bạn" />
            </div>

            <!-- ATTENDANCE -->
            <div class="el-form-group">
              <label>Bạn có tham dự không?</label>

              <div class="el-attendance">
                <button
                  type="button"
                  class="el-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="el-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="el-form-group">
              <label>Số người tham dự</label>

              <div class="el-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="el-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="el-form-success">{{ successMessage }}</div>

            <button type="button" class="el-modal-submit" :disabled="submitting" @click="submitConfirmation">
              {{ submitting ? "ĐANG GỬI..." : "GỬI XÁC NHẬN" }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { Confirm } from "@/model/api";

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

      const weekdays = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];

      weekday = weekdays[date.day()];
    }

    const calendarDays = item.calendarDays || buildCalendarDays(Number(year), Number(month));

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

      receptionTime: item.ReceptionTime || item.receptionTime || "",

      ceremonyTime: item.CeremonyTime || item.ceremonyTime || "",

      location: item.Location || item.location || "",

      address: item.Address || item.address || "",

      map: item.Map || item.map || "",

      rsvpUrl: item.RsvpUrl || item.rsvpUrl || item.RSVPUrl || "",

      calendarUrl: item.CalendarUrl || item.calendarUrl || "",

      calendarDays,
    };
  });
});

/* =========================================
   CALENDAR
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
  observer?.disconnect();

  document.body.style.overflow = "";
});
</script>

<style scoped>
.el-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   EVENTS LIST
===================================================== */

.el-events__list {
  width: min(100%, 680px);
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 34px;
}

/* =====================================================
   EVENT CARD
===================================================== */

.el-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: #2e3d36;

  border: 1px solid rgba(201, 164, 92, 0.6);
  border-radius: 999px 999px 26px 26px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.94), rgba(240, 234, 216, 0.88));

  box-shadow: 0 18px 44px rgba(12, 43, 33, 0.12);

  overflow: hidden;
}

.el-event-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(201, 164, 92, 0.3);
  border-radius: 999px 999px 20px 20px;

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.el-event-heading {
  width: 100%;
  text-align: center;
}

.el-event-heading h2 {
  margin: 0 0 8px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: #123b2e;
}

.el-mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: #c9a45c;
}

.el-mini-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.85));
}

.el-mini-divider span:last-child {
  transform: rotate(180deg);
}

.el-mini-divider i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   DATE
===================================================== */

.el-event-date {
  width: 100%;
  text-align: center;
}

.el-event-weekday {
  margin-top: 14px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;

  color: #8a7a52;
}

.el-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;

  margin: 8px 0;
}

.el-date-number {
  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(44px, 13vw, 76px);
  font-weight: 600;

  line-height: 0.85;

  color: #123b2e;
}

.el-date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 8px;

  letter-spacing: 0.14em;

  color: #8a7a52;
}

.el-date-side strong {
  font-size: 18px;
  font-weight: 600;

  color: #123b2e;
}

.el-event-lunar {
  font-size: 14px;
  font-style: italic;

  color: #6b7a70;
}

/* =====================================================
   TIME
===================================================== */

.el-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px solid rgba(201, 164, 92, 0.45);
}

.el-event-time div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.el-event-time small {
  font-size: 8px;

  letter-spacing: 0.2em;

  color: #8a7a52;
}

.el-event-time strong {
  font-size: 23px;
  font-weight: 600;

  color: #123b2e;
}

/* =====================================================
   SCHEDULE
===================================================== */

.el-event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.el-event-schedule::before {
  content: "";
  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(201, 164, 92, 0.6);
}

.el-schedule-row {
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;

  min-height: 42px;
}

.el-schedule-dot {
  position: absolute;
  left: -28px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid #c9a45c;

  background: #f7f1e3;

  z-index: 2;
}

.el-schedule-dot span {
  font-size: 7px;

  color: #8a7a52;
}

.el-schedule-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.el-schedule-content span {
  font-size: 9px;

  letter-spacing: 0.16em;

  color: #6b7a70;
}

.el-schedule-content strong {
  font-size: 21px;
  font-weight: 600;

  color: #123b2e;
}

/* =====================================================
   CALENDAR
===================================================== */

.el-calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.el-calendar__header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.el-calendar__header span {
  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #8a7a52;
}

.el-calendar__header strong {
  font-size: 9px;

  letter-spacing: 0.1em;

  color: #123b2e;
}

.el-calendar__weekdays,
.el-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.el-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(201, 164, 92, 0.4);
}

.el-calendar__weekdays span {
  font-size: 8px;
  font-weight: 700;

  color: #8a7a52;
}

.el-calendar__cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.el-normal-day {
  font-size: 12px;

  color: #55645b;
}

.el-active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.el-active-sun {
  position: absolute;

  font-size: 31px;

  color: #c9a45c;
}

.el-active-day span:last-child {
  position: relative;

  font-weight: 700;

  color: #10281f;
}

.el-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 15px;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  color: #8a7a52;
}

/* =====================================================
   RSVP
===================================================== */

.el-rsvp-btn {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  padding: 13px 18px;

  border: 1px solid rgba(201, 164, 92, 0.85);
  border-radius: 999px;

  color: #10281f;

  background: linear-gradient(135deg, #e8d3a2, #c9a45c);

  box-shadow: 0 10px 24px rgba(201, 164, 92, 0.32);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.el-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(201, 164, 92, 0.42);
}

/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.el-event-bottom {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: #c9a45c;
}

.el-event-bottom span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.75));
}

.el-event-bottom span:last-child {
  transform: rotate(180deg);
}

.el-event-bottom i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   REVEAL
===================================================== */

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

/* =====================================================
   MODAL
===================================================== */

.el-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(10, 30, 23, 0.5);

  backdrop-filter: blur(6px);
}

.el-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid rgba(201, 164, 92, 0.65);
  border-radius: 999px 999px 26px 26px;

  background: linear-gradient(172deg, #fdfaf2, #efe9d6);

  box-shadow: 0 30px 80px rgba(5, 20, 15, 0.35);

  text-align: center;

  color: #2e3d36;
}

.el-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: #c9a45c;

  background: transparent;

  cursor: pointer;
}

.el-modal-header {
  text-align: center;
}

.el-modal-symbol {
  font-size: 20px;

  margin-bottom: 8px;

  color: #c9a45c;
}

.el-modal-header > span {
  font-size: 8px;

  letter-spacing: 0.28em;

  color: #8a7a52;
}

.el-modal-header h3 {
  margin: 8px 0;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 32px;
  font-weight: 600;

  color: #123b2e;
}

.el-modal-header p {
  margin: 0;

  font-size: 14px;

  color: #55645b;
}

/* =====================================================
   FORM
===================================================== */

.el-form-group {
  margin-top: 20px;

  text-align: left;
}

.el-form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: #8a7a52;
}

.el-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid rgba(201, 164, 92, 0.55);
  border-radius: 14px;

  outline: none;

  font-size: 16px;

  color: #2e3d36;

  background: rgba(255, 255, 255, 0.9);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.el-form-group input:focus {
  border-color: #c9a45c;

  box-shadow: 0 0 0 3px rgba(201, 164, 92, 0.18);
}

.el-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.el-attendance-option {
  padding: 12px 14px;

  border: 1px solid rgba(201, 164, 92, 0.55);
  border-radius: 14px;

  text-align: left;

  font-size: 13px;

  color: #2e3d36;

  background: rgba(255, 255, 255, 0.8);

  cursor: pointer;

  transition: all 0.25s ease;
}

.el-attendance-option.selected {
  border-color: #c9a45c;

  background: rgba(201, 164, 92, 0.16);

  font-weight: 600;
}

.el-attendance-option span {
  margin-right: 8px;

  color: #8a7a52;
}

.el-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.el-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid #c9a45c;
  border-radius: 50%;

  font-size: 20px;

  color: #123b2e;

  background: #f7f1e3;

  cursor: pointer;
}

.el-people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;

  color: #123b2e;
}

.el-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px solid rgba(201, 164, 92, 0.6);
  border-radius: 999px 999px 16px 16px;

  text-align: center;

  background: rgba(255, 255, 255, 0.7);
}

.el-recipient-box span {
  display: block;

  font-size: 8px;

  letter-spacing: 0.22em;

  color: #8a7a52;
}

.el-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "Great Vibes", cursive;
  font-size: 28px;
  font-weight: 400;

  color: #123b2e;
}

.el-form-error,
.el-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 10px;

  text-align: center;

  font-size: 12px;
}

.el-form-error {
  color: #a34d3d;

  background: rgba(163, 77, 61, 0.08);
}

.el-form-success {
  color: #3d6b4f;

  background: rgba(61, 107, 79, 0.12);
}

.el-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 1px solid rgba(201, 164, 92, 0.85);
  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #10281f;

  background: linear-gradient(135deg, #e8d3a2, #c9a45c);

  box-shadow: 0 10px 24px rgba(201, 164, 92, 0.32);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.el-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.el-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.el-modal-enter-active,
.el-modal-leave-active {
  transition: opacity 0.3s ease;
}

.el-modal-enter-from,
.el-modal-leave-to {
  opacity: 0;
}

.el-modal-enter-active .el-confirm-modal {
  animation: el-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes el-modal-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {
  .el-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .el-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .el-event-heading h2 {
    font-size: 26px;
  }

  .el-event-main-date {
    gap: 14px;
  }

  .el-date-number {
    font-size: 62px;
  }

  .el-date-side strong {
    font-size: 16px;
  }

  .el-event-schedule {
    width: min(100%, 340px);
  }

  .el-schedule-content strong {
    font-size: 19px;
  }

  .el-calendar {
    width: min(100%, 360px);
  }

  .el-rsvp-btn {
    width: min(100%, 360px);
  }

  .el-confirm-modal {
    padding: 35px 20px 25px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;

    transform: none;

    transition: none;
  }

  .el-rsvp-btn,
  .el-modal-submit {
    transition: none;
  }
}
</style>
