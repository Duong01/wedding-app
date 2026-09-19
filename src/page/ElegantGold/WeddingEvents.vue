<template>
  <section class="eg-events" ref="sectionRef">
    <div class="eg-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="eg-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- EVENT TITLE -->
        <div class="eg-event-heading">
          <h2>{{ event.Title || "TIỆC CƯỚI" }}</h2>

          <div class="eg-mini-divider">
            <span></span>
            <i>❦</i>
            <span></span>
          </div>
        </div>

        <!-- DATE -->
        <div v-if="event.hasDate" class="eg-event-date">
          <div class="eg-event-weekday">{{ event.weekday }}</div>

          <div class="eg-event-main-date">
            <div class="eg-date-side">
              <span>THÁNG</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="eg-date-number">{{ event.day }}</div>

            <div class="eg-date-side">
              <span>NĂM</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="eg-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- TIME -->
        <div v-if="event.time" class="eg-event-time">
          <div>
            <small>THỜI GIAN</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- SCHEDULE -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="eg-event-schedule">
          <div v-if="event.receptionTime" class="eg-schedule-row">
            <div class="eg-schedule-dot"><span>❦</span></div>

            <div class="eg-schedule-content">
              <span>ĐÓN KHÁCH</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="eg-schedule-row">
            <div class="eg-schedule-dot"><span>✦</span></div>

            <div class="eg-schedule-content">
              <span>KHAI TIỆC</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- LOCATION -->
        <div v-if="event.location || event.address" class="eg-event-location">
          <small>ĐỊA ĐIỂM</small>
          <strong>{{ event.location }}</strong>
          <span v-if="event.address">{{ event.address }}</span>
        </div>

        <!-- CALENDAR -->
        <div v-if="event.date && event.calendarDays?.length" class="eg-calendar">
          <div class="eg-calendar__header">
            <span>LỊCH</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="eg-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="eg-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="eg-calendar__cell"
              :class="{ empty: !day, active: day === Number(event.day) }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.day)" class="eg-active-day">
                  <span class="eg-active-sun">✦</span>
                  <span>{{ day }}</span>
                </div>

                <span v-else class="eg-normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="eg-calendar-btn"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="eg-rsvp-btn" @click="openConfirmModal(event)">
          <span>❦</span>
          XÁC NHẬN THAM DỰ
          <span>❦</span>
        </button>

        <div class="eg-event-bottom">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>
      </article>
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="eg-modal">
        <div v-if="showConfirmModal" class="eg-confirm-overlay" @click.self="closeConfirmModal">
          <div class="eg-confirm-modal">
            <button type="button" class="eg-modal-close" @click="closeConfirmModal">×</button>

            <div class="eg-modal-header">
              <div class="eg-modal-symbol">✦</div>

              <span>THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="eg-recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="eg-form-group">
              <label>Họ và tên</label>

              <input v-model.trim="form.name" type="text" maxlength="100" placeholder="Nhập tên của bạn" />
            </div>

            <!-- ATTENDANCE -->
            <div class="eg-form-group">
              <label>Bạn có tham dự không?</label>

              <div class="eg-attendance">
                <button
                  type="button"
                  class="eg-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="eg-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="eg-form-group">
              <label>Số người tham dự</label>

              <div class="eg-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="eg-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="eg-form-success">{{ successMessage }}</div>

            <button type="button" class="eg-modal-submit" :disabled="submitting" @click="submitConfirmation">
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
.eg-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   EVENTS LIST
===================================================== */

.eg-events__list {
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

.eg-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: #5f4f38;

  border: 1px solid rgba(181, 138, 69, 0.6);
  border-radius: 999px 999px 26px 26px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.94), rgba(246, 236, 217, 0.88));

  box-shadow: 0 18px 44px rgba(93, 69, 42, 0.12);

  overflow: hidden;
}

.eg-event-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(181, 138, 69, 0.3);
  border-radius: 999px 999px 20px 20px;

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.eg-event-heading {
  width: 100%;
  text-align: center;
}

.eg-event-heading h2 {
  margin: 0 0 8px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: #5d452a;
}

.eg-mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: #b58a45;
}

.eg-mini-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.85));
}

.eg-mini-divider span:last-child {
  transform: rotate(180deg);
}

.eg-mini-divider i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   DATE
===================================================== */

.eg-event-date {
  width: 100%;
  text-align: center;
}

.eg-event-weekday {
  margin-top: 14px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;

  color: #8a7a52;
}

.eg-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;

  margin: 8px 0;
}

.eg-date-number {
  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(44px, 13vw, 76px);
  font-weight: 600;

  line-height: 0.85;

  color: #5d452a;
}

.eg-date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 10px;

  letter-spacing: 0.14em;

  color: #8a7a52;
}

.eg-date-side strong {
  font-size: 18px;
  font-weight: 600;

  color: #5d452a;
}

.eg-event-lunar {
  font-size: 14px;
  font-style: italic;

  color: #8a7657;
}

/* =====================================================
   TIME
===================================================== */

.eg-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px solid rgba(181, 138, 69, 0.45);
}

.eg-event-time div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.eg-event-time small {
  font-size: 10px;

  letter-spacing: 0.2em;

  color: #8a7a52;
}

.eg-event-time strong {
  font-size: 23px;
  font-weight: 600;

  color: #5d452a;
}

/* =====================================================
   SCHEDULE
===================================================== */

.eg-event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.eg-event-schedule::before {
  content: "";
  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(181, 138, 69, 0.6);
}

.eg-schedule-row {
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;

  min-height: 42px;
}

.eg-schedule-dot {
  position: absolute;
  left: -28px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid #b58a45;

  background: #faf8f3;

  z-index: 2;
}

.eg-schedule-dot span {
  font-size: 11px;

  color: #8a7a52;
}

.eg-schedule-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.eg-schedule-content span {
  font-size: 11px;

  letter-spacing: 0.16em;

  color: #8a7657;
}

.eg-schedule-content strong {
  font-size: 21px;
  font-weight: 600;

  color: #5d452a;
}

/* =====================================================
   LOCATION
===================================================== */

.eg-event-location {
  width: 100%;

  margin-top: 18px;
  padding: 14px 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  border: 1px solid rgba(181, 138, 69, 0.4);
  border-radius: 16px;

  background: rgba(255, 255, 255, 0.55);
}

.eg-event-location small {
  font-size: 10px;

  letter-spacing: 0.2em;

  color: #8a7a52;
}

.eg-event-location strong {
  font-size: 16px;
  font-weight: 600;

  color: #5d452a;
}

.eg-event-location span {
  font-size: 12px;

  color: #8a7657;

  line-height: 1.5;
}

/* =====================================================
   CALENDAR
===================================================== */

.eg-calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.eg-calendar__header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.eg-calendar__header span {
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #8a7a52;
}

.eg-calendar__header strong {
  font-size: 11px;

  letter-spacing: 0.1em;

  color: #5d452a;
}

.eg-calendar__weekdays,
.eg-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.eg-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(181, 138, 69, 0.4);
}

.eg-calendar__weekdays span {
  font-size: 10px;
  font-weight: 700;

  color: #8a7a52;
}

.eg-calendar__cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.eg-normal-day {
  font-size: 12px;

  color: #6d5c42;
}

.eg-active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.eg-active-sun {
  position: absolute;

  font-size: 31px;

  color: #b58a45;
}

.eg-active-day span:last-child {
  position: relative;

  font-weight: 700;

  color: #4a3620;
}

.eg-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 15px;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  color: #8a7a52;
}

/* =====================================================
   RSVP
===================================================== */

.eg-rsvp-btn {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  padding: 13px 18px;

  border: 1px solid rgba(181, 138, 69, 0.85);
  border-radius: 999px;

  color: #4a3620;

  background: linear-gradient(135deg, #efe3c8, #d7bb82);

  box-shadow: 0 10px 24px rgba(181, 138, 69, 0.32);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.eg-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(181, 138, 69, 0.42);
}

/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.eg-event-bottom {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: #b58a45;
}

.eg-event-bottom span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.75));
}

.eg-event-bottom span:last-child {
  transform: rotate(180deg);
}

.eg-event-bottom i {
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

.eg-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(48, 34, 16, 0.5);

  backdrop-filter: blur(6px);
}

.eg-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid rgba(181, 138, 69, 0.65);
  border-radius: 999px 999px 26px 26px;

  background: linear-gradient(172deg, #fdfaf2, #f3e9d3);

  box-shadow: 0 30px 80px rgba(30, 20, 8, 0.35);

  text-align: center;

  color: #5f4f38;
}

.eg-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: #b58a45;

  background: transparent;

  cursor: pointer;
}

.eg-modal-header {
  text-align: center;
}

.eg-modal-symbol {
  font-size: 20px;

  margin-bottom: 8px;

  color: #b58a45;
}

.eg-modal-header > span {
  font-size: 10px;

  letter-spacing: 0.28em;

  color: #8a7a52;
}

.eg-modal-header h3 {
  margin: 8px 0;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 32px;
  font-weight: 600;

  color: #5d452a;
}

.eg-modal-header p {
  margin: 0;

  font-size: 14px;

  color: #6d5c42;
}

/* =====================================================
   FORM
===================================================== */

.eg-form-group {
  margin-top: 20px;

  text-align: left;
}

.eg-form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: #8a7a52;
}

.eg-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid rgba(181, 138, 69, 0.55);
  border-radius: 14px;

  outline: none;

  font-size: 16px;

  color: #5f4f38;

  background: rgba(255, 255, 255, 0.9);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.eg-form-group input:focus {
  border-color: #b58a45;

  box-shadow: 0 0 0 3px rgba(181, 138, 69, 0.18);
}

.eg-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.eg-attendance-option {
  padding: 12px 14px;

  border: 1px solid rgba(181, 138, 69, 0.55);
  border-radius: 14px;

  text-align: left;

  font-size: 13px;

  color: #5f4f38;

  background: rgba(255, 255, 255, 0.8);

  cursor: pointer;

  transition: all 0.25s ease;
}

.eg-attendance-option.selected {
  border-color: #b58a45;

  background: rgba(181, 138, 69, 0.16);

  font-weight: 600;
}

.eg-attendance-option span {
  margin-right: 8px;

  color: #8a7a52;
}

.eg-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.eg-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid #b58a45;
  border-radius: 50%;

  font-size: 20px;

  color: #5d452a;

  background: #faf8f3;

  cursor: pointer;
}

.eg-people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;

  color: #5d452a;
}

.eg-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px solid rgba(181, 138, 69, 0.6);
  border-radius: 999px 999px 16px 16px;

  text-align: center;

  background: rgba(255, 255, 255, 0.7);
}

.eg-recipient-box span {
  display: block;

  font-size: 10px;

  letter-spacing: 0.22em;

  color: #8a7a52;
}

.eg-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "Great Vibes", cursive;
  font-size: 28px;
  font-weight: 400;

  color: #5d452a;
}

.eg-form-error,
.eg-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 10px;

  text-align: center;

  font-size: 12px;
}

.eg-form-error {
  color: #a34d3d;

  background: rgba(163, 77, 61, 0.08);
}

.eg-form-success {
  color: #6b6136;

  background: rgba(181, 138, 69, 0.14);
}

.eg-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 1px solid rgba(181, 138, 69, 0.85);
  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #4a3620;

  background: linear-gradient(135deg, #efe3c8, #d7bb82);

  box-shadow: 0 10px 24px rgba(181, 138, 69, 0.32);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.eg-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.eg-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.eg-modal-enter-active,
.eg-modal-leave-active {
  transition: opacity 0.3s ease;
}

.eg-modal-enter-from,
.eg-modal-leave-to {
  opacity: 0;
}

.eg-modal-enter-active .eg-confirm-modal {
  animation: eg-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes eg-modal-in {
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
  .eg-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .eg-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .eg-event-heading h2 {
    font-size: 26px;
  }

  .eg-event-main-date {
    gap: 14px;
  }

  .eg-date-number {
    font-size: 62px;
  }

  .eg-date-side strong {
    font-size: 16px;
  }

  .eg-event-schedule {
    width: min(100%, 340px);
  }

  .eg-schedule-content strong {
    font-size: 19px;
  }

  .eg-calendar {
    width: min(100%, 360px);
  }

  .eg-rsvp-btn {
    width: min(100%, 360px);
  }

  .eg-confirm-modal {
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

  .eg-rsvp-btn,
  .eg-modal-submit {
    transition: none;
  }
}
</style>
