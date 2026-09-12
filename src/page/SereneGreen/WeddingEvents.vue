<template>
  <section class="sg-events" ref="sectionRef">
    <div class="sg-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="sg-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- EVENT TITLE -->
        <div class="sg-event-heading">
          <h2>{{ event.Title || "TIỆC CƯỚI" }}</h2>

          <div class="sg-mini-divider">
            <span></span>
            <i>❀</i>
            <span></span>
          </div>
        </div>

        <!-- DATE -->
        <div v-if="event.hasDate" class="sg-event-date">
          <div class="sg-event-weekday">{{ event.weekday }}</div>

          <div class="sg-event-main-date">
            <div class="sg-date-side">
              <span>THÁNG</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="sg-date-number">{{ event.day }}</div>

            <div class="sg-date-side">
              <span>NĂM</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="sg-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- TIME -->
        <div v-if="event.time" class="sg-event-time">
          <div>
            <small>THỜI GIAN</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- SCHEDULE -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="sg-event-schedule">
          <div v-if="event.receptionTime" class="sg-schedule-row">
            <div class="sg-schedule-dot"><span>❀</span></div>

            <div class="sg-schedule-content">
              <span>ĐÓN KHÁCH</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="sg-schedule-row">
            <div class="sg-schedule-dot"><span>✦</span></div>

            <div class="sg-schedule-content">
              <span>KHAI TIỆC</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- CALENDAR -->
        <div v-if="event.date && event.calendarDays?.length" class="sg-calendar">
          <div class="sg-calendar__header">
            <span>LỊCH</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="sg-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="sg-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="sg-calendar__cell"
              :class="{ empty: !day, active: day === Number(event.day) }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.day)" class="sg-active-day">
                  <span class="sg-active-bloom">❀</span>
                  <span>{{ day }}</span>
                </div>

                <span v-else class="sg-normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="sg-calendar-btn"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="sg-rsvp-btn" @click="openConfirmModal(event)">
          <span>❀</span>
          XÁC NHẬN THAM DỰ
          <span>❀</span>
        </button>

        <div class="sg-event-bottom">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>
      </article>
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="sg-modal">
        <div v-if="showConfirmModal" class="sg-confirm-overlay" @click.self="closeConfirmModal">
          <div class="sg-confirm-modal">
            <button type="button" class="sg-modal-close" @click="closeConfirmModal">×</button>

            <div class="sg-modal-header">
              <div class="sg-modal-symbol">❀</div>

              <span>THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="sg-recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="sg-form-group">
              <label>Họ và tên</label>

              <input v-model.trim="form.name" type="text" maxlength="100" placeholder="Nhập tên của bạn" />
            </div>

            <!-- ATTENDANCE -->
            <div class="sg-form-group">
              <label>Bạn có tham dự không?</label>

              <div class="sg-attendance">
                <button
                  type="button"
                  class="sg-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="sg-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="sg-form-group">
              <label>Số người tham dự</label>

              <div class="sg-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="sg-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="sg-form-success">{{ successMessage }}</div>

            <button type="button" class="sg-modal-submit" :disabled="submitting" @click="submitConfirmation">
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
.sg-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   EVENTS LIST
===================================================== */

.sg-events__list {
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

.sg-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: #28514b;

  border: 1px solid rgba(108, 142, 122, 0.35);
  border-radius: 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.82), rgba(240, 246, 238, 0.68));

  box-shadow: 0 18px 44px rgba(40, 81, 75, 0.08);

  overflow: hidden;
}

.sg-event-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(108, 142, 122, 0.22);
  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.sg-event-heading {
  width: 100%;
  text-align: center;
}

.sg-event-heading h2 {
  margin: 0 0 8px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: #28514b;
}

.sg-mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: #8fae9b;
}

.sg-mini-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.7));
}

.sg-mini-divider span:last-child {
  transform: rotate(180deg);
}

.sg-mini-divider i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   DATE
===================================================== */

.sg-event-date {
  width: 100%;
  text-align: center;
}

.sg-event-weekday {
  margin-top: 14px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;

  color: #6c8e7a;
}

.sg-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;

  margin: 8px 0;
}

.sg-date-number {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(44px, 13vw, 76px);
  font-weight: 600;

  line-height: 0.85;

  color: #28514b;
}

.sg-date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 8px;

  letter-spacing: 0.14em;

  color: #6c8e7a;
}

.sg-date-side strong {
  font-size: 18px;
  font-weight: 600;

  color: #28514b;
}

.sg-event-lunar {
  font-size: 14px;
  font-style: italic;

  color: #7a8a80;
}

/* =====================================================
   TIME
===================================================== */

.sg-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px solid rgba(108, 142, 122, 0.3);
}

.sg-event-time div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.sg-event-time small {
  font-size: 8px;

  letter-spacing: 0.2em;

  color: #6c8e7a;
}

.sg-event-time strong {
  font-size: 23px;
  font-weight: 600;

  color: #28514b;
}

/* =====================================================
   SCHEDULE
===================================================== */

.sg-event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.sg-event-schedule::before {
  content: "";
  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(143, 174, 155, 0.45);
}

.sg-schedule-row {
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;

  min-height: 42px;
}

.sg-schedule-dot {
  position: absolute;
  left: -28px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid #8fae9b;

  background: #f5f8f4;

  z-index: 2;
}

.sg-schedule-dot span {
  font-size: 7px;

  color: #6c8e7a;
}

.sg-schedule-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.sg-schedule-content span {
  font-size: 9px;

  letter-spacing: 0.16em;

  color: #7a8a80;
}

.sg-schedule-content strong {
  font-size: 21px;
  font-weight: 600;

  color: #28514b;
}

/* =====================================================
   CALENDAR
===================================================== */

.sg-calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.sg-calendar__header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.sg-calendar__header span {
  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #6c8e7a;
}

.sg-calendar__header strong {
  font-size: 9px;

  letter-spacing: 0.1em;

  color: #28514b;
}

.sg-calendar__weekdays,
.sg-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.sg-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(108, 142, 122, 0.25);
}

.sg-calendar__weekdays span {
  font-size: 8px;
  font-weight: 700;

  color: #6c8e7a;
}

.sg-calendar__cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.sg-normal-day {
  font-size: 12px;

  color: #7a8a80;
}

.sg-active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.sg-active-bloom {
  position: absolute;

  font-size: 31px;

  color: #8fae9b;
}

.sg-active-day span:last-child {
  position: relative;

  font-weight: 700;

  color: #f2f8f0;
}

.sg-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 15px;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  color: #6c8e7a;
}

/* =====================================================
   RSVP
===================================================== */

.sg-rsvp-btn {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  padding: 13px 18px;

  border: 0;
  border-radius: 999px;

  color: #f2f8f0;

  background: linear-gradient(135deg, #6c8e7a, #3f6f63);

  box-shadow: 0 10px 24px rgba(40, 81, 75, 0.24);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sg-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(40, 81, 75, 0.32);
}

/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.sg-event-bottom {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: #8fae9b;
}

.sg-event-bottom span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.6));
}

.sg-event-bottom span:last-child {
  transform: rotate(180deg);
}

.sg-event-bottom i {
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

.sg-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(30, 58, 52, 0.45);

  backdrop-filter: blur(6px);
}

.sg-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid rgba(108, 142, 122, 0.5);
  border-radius: 26px;

  background: linear-gradient(170deg, #fbfdfa, #edf4eb);

  box-shadow: 0 30px 80px rgba(30, 58, 52, 0.3);

  text-align: center;

  color: #28514b;
}

.sg-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: #6c8e7a;

  background: transparent;

  cursor: pointer;
}

.sg-modal-header {
  text-align: center;
}

.sg-modal-symbol {
  font-size: 20px;

  margin-bottom: 8px;

  color: #8fae9b;
}

.sg-modal-header > span {
  font-size: 8px;

  letter-spacing: 0.28em;

  color: #6c8e7a;
}

.sg-modal-header h3 {
  margin: 8px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 32px;
  font-weight: 600;

  color: #28514b;
}

.sg-modal-header p {
  margin: 0;

  font-size: 14px;

  color: #7a8a80;
}

/* =====================================================
   FORM
===================================================== */

.sg-form-group {
  margin-top: 20px;

  text-align: left;
}

.sg-form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: #6c8e7a;
}

.sg-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid rgba(108, 142, 122, 0.4);
  border-radius: 12px;

  outline: none;

  font-size: 16px;

  color: #28514b;

  background: rgba(251, 253, 250, 0.9);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.sg-form-group input:focus {
  border-color: #6c8e7a;

  box-shadow: 0 0 0 3px rgba(108, 142, 122, 0.14);
}

.sg-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sg-attendance-option {
  padding: 12px 14px;

  border: 1px solid rgba(108, 142, 122, 0.4);
  border-radius: 12px;

  text-align: left;

  font-size: 13px;

  color: #28514b;

  background: rgba(251, 253, 250, 0.8);

  cursor: pointer;

  transition: all 0.25s ease;
}

.sg-attendance-option.selected {
  border-color: #6c8e7a;

  background: rgba(108, 142, 122, 0.12);

  font-weight: 600;
}

.sg-attendance-option span {
  margin-right: 8px;

  color: #8fae9b;
}

.sg-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.sg-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid #8fae9b;
  border-radius: 50%;

  font-size: 20px;

  color: #28514b;

  background: #f5f8f4;

  cursor: pointer;
}

.sg-people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;

  color: #28514b;
}

.sg-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px dashed rgba(108, 142, 122, 0.5);
  border-radius: 16px;

  text-align: center;

  background: rgba(245, 248, 244, 0.7);
}

.sg-recipient-box span {
  display: block;

  font-size: 8px;

  letter-spacing: 0.22em;

  color: #6c8e7a;
}

.sg-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "Allura", cursive;
  font-size: 28px;
  font-weight: 400;

  color: #28514b;
}

.sg-form-error,
.sg-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 10px;

  text-align: center;

  font-size: 12px;
}

.sg-form-error {
  color: #a34d4d;

  background: rgba(163, 77, 77, 0.08);
}

.sg-form-success {
  color: #3f6f63;

  background: rgba(63, 111, 99, 0.08);
}

.sg-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 0;
  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #f2f8f0;

  background: linear-gradient(135deg, #6c8e7a, #3f6f63);

  box-shadow: 0 10px 24px rgba(40, 81, 75, 0.24);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.sg-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.sg-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.sg-modal-enter-active,
.sg-modal-leave-active {
  transition: opacity 0.3s ease;
}

.sg-modal-enter-from,
.sg-modal-leave-to {
  opacity: 0;
}

.sg-modal-enter-active .sg-confirm-modal {
  animation: sg-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes sg-modal-in {
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
  .sg-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .sg-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .sg-event-heading h2 {
    font-size: 26px;
  }

  .sg-event-main-date {
    gap: 14px;
  }

  .sg-date-number {
    font-size: 62px;
  }

  .sg-date-side strong {
    font-size: 16px;
  }

  .sg-event-schedule {
    width: min(100%, 340px);
  }

  .sg-schedule-content strong {
    font-size: 19px;
  }

  .sg-calendar {
    width: min(100%, 360px);
  }

  .sg-rsvp-btn {
    width: min(100%, 360px);
  }

  .sg-confirm-modal {
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

  .sg-rsvp-btn,
  .sg-modal-submit {
    transition: none;
  }
}
</style>
