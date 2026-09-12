<template>
  <section class="bt-events" ref="sectionRef">
    <div class="bt-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="bt-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- EVENT TITLE -->
        <div class="bt-event-heading">
          <h2>{{ event.Title || "TIỆC CƯỚI" }}</h2>

          <div class="bt-mini-divider">
            <span></span>
            <i>❋</i>
            <span></span>
          </div>
        </div>

        <!-- DATE -->
        <div v-if="event.hasDate" class="bt-event-date">
          <div class="bt-event-weekday">{{ event.weekday }}</div>

          <div class="bt-event-main-date">
            <div class="bt-date-side">
              <span>THÁNG</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="bt-date-number">{{ event.day }}</div>

            <div class="bt-date-side">
              <span>NĂM</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="bt-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- TIME -->
        <div v-if="event.time" class="bt-event-time">
          <div>
            <small>THỜI GIAN</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- SCHEDULE -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="bt-event-schedule">
          <div v-if="event.receptionTime" class="bt-schedule-row">
            <div class="bt-schedule-dot"><span>❋</span></div>

            <div class="bt-schedule-content">
              <span>ĐÓN KHÁCH</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="bt-schedule-row">
            <div class="bt-schedule-dot"><span>✽</span></div>

            <div class="bt-schedule-content">
              <span>KHAI TIỆC</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- CALENDAR -->
        <div v-if="event.date && event.calendarDays?.length" class="bt-calendar">
          <div class="bt-calendar__header">
            <span>LỊCH</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="bt-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="bt-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="bt-calendar__cell"
              :class="{ empty: !day, active: day === Number(event.day) }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.day)" class="bt-active-day">
                  <span class="bt-active-sun">☼</span>
                  <span>{{ day }}</span>
                </div>

                <span v-else class="bt-normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="bt-calendar-btn"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="bt-rsvp-btn" @click="openConfirmModal(event)">
          <span>❋</span>
          XÁC NHẬN THAM DỰ
          <span>❋</span>
        </button>

        <div class="bt-event-bottom">
          <span></span>
          <i>✽</i>
          <span></span>
        </div>
      </article>
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="bt-modal">
        <div v-if="showConfirmModal" class="bt-confirm-overlay" @click.self="closeConfirmModal">
          <div class="bt-confirm-modal">
            <button type="button" class="bt-modal-close" @click="closeConfirmModal">×</button>

            <div class="bt-modal-header">
              <div class="bt-modal-symbol">☼</div>

              <span>THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="bt-recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="bt-form-group">
              <label>Họ và tên</label>

              <input v-model.trim="form.name" type="text" maxlength="100" placeholder="Nhập tên của bạn" />
            </div>

            <!-- ATTENDANCE -->
            <div class="bt-form-group">
              <label>Bạn có tham dự không?</label>

              <div class="bt-attendance">
                <button
                  type="button"
                  class="bt-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="bt-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="bt-form-group">
              <label>Số người tham dự</label>

              <div class="bt-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="bt-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="bt-form-success">{{ successMessage }}</div>

            <button type="button" class="bt-modal-submit" :disabled="submitting" @click="submitConfirmation">
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
.bt-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   EVENTS LIST
===================================================== */

.bt-events__list {
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

.bt-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: #5c4636;

  border: 2px dashed rgba(156, 91, 63, 0.45);
  border-radius: 999px 999px 26px 26px;

  background: linear-gradient(172deg, rgba(255, 251, 245, 0.94), rgba(242, 226, 208, 0.85));

  box-shadow: 0 18px 44px rgba(92, 70, 54, 0.12);

  overflow: hidden;
}

.bt-event-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(156, 91, 63, 0.22);
  border-radius: 999px 999px 20px 20px;

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.bt-event-heading {
  width: 100%;
  text-align: center;
}

.bt-event-heading h2 {
  margin: 0 0 8px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: #9c5b3f;
}

.bt-mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: #c97b5d;
}

.bt-mini-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-mini-divider span:last-child {
  transform: rotate(180deg);
}

.bt-mini-divider i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   DATE
===================================================== */

.bt-event-date {
  width: 100%;
  text-align: center;
}

.bt-event-weekday {
  margin-top: 14px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;

  color: #8a9b7c;
}

.bt-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;

  margin: 8px 0;
}

.bt-date-number {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(44px, 13vw, 76px);
  font-weight: 600;

  line-height: 0.85;

  color: #9c5b3f;
}

.bt-date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 8px;

  letter-spacing: 0.14em;

  color: #8a9b7c;
}

.bt-date-side strong {
  font-size: 18px;
  font-weight: 600;

  color: #9c5b3f;
}

.bt-event-lunar {
  font-size: 14px;
  font-style: italic;

  color: #8a6f5c;
}

/* =====================================================
   TIME
===================================================== */

.bt-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px dashed rgba(156, 91, 63, 0.35);
}

.bt-event-time div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.bt-event-time small {
  font-size: 8px;

  letter-spacing: 0.2em;

  color: #8a9b7c;
}

.bt-event-time strong {
  font-size: 23px;
  font-weight: 600;

  color: #9c5b3f;
}

/* =====================================================
   SCHEDULE
===================================================== */

.bt-event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.bt-event-schedule::before {
  content: "";
  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(156, 91, 63, 0.45);
}

.bt-schedule-row {
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;

  min-height: 42px;
}

.bt-schedule-dot {
  position: absolute;
  left: -28px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid #c97b5d;

  background: #faf3ec;

  z-index: 2;
}

.bt-schedule-dot span {
  font-size: 7px;

  color: #8a9b7c;
}

.bt-schedule-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.bt-schedule-content span {
  font-size: 9px;

  letter-spacing: 0.16em;

  color: #8a6f5c;
}

.bt-schedule-content strong {
  font-size: 21px;
  font-weight: 600;

  color: #9c5b3f;
}

/* =====================================================
   CALENDAR
===================================================== */

.bt-calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.bt-calendar__header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.bt-calendar__header span {
  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #8a9b7c;
}

.bt-calendar__header strong {
  font-size: 9px;

  letter-spacing: 0.1em;

  color: #9c5b3f;
}

.bt-calendar__weekdays,
.bt-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.bt-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px dashed rgba(156, 91, 63, 0.3);
}

.bt-calendar__weekdays span {
  font-size: 8px;
  font-weight: 700;

  color: #8a9b7c;
}

.bt-calendar__cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bt-normal-day {
  font-size: 12px;

  color: #7d6350;
}

.bt-active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bt-active-sun {
  position: absolute;

  font-size: 31px;

  color: #c97b5d;
}

.bt-active-day span:last-child {
  position: relative;

  font-weight: 700;

  color: #fff6ec;
}

.bt-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 15px;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  color: #8a9b7c;
}

/* =====================================================
   RSVP
===================================================== */

.bt-rsvp-btn {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  padding: 13px 18px;

  border: 0;
  border-radius: 999px;

  color: #fff6ec;

  background: linear-gradient(135deg, #c97b5d, #9c5b3f);

  box-shadow: 0 10px 24px rgba(156, 91, 63, 0.28);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bt-rsvp-btn:hover {
  transform: translateY(-2px) rotate(-0.5deg);

  box-shadow: 0 14px 30px rgba(156, 91, 63, 0.36);
}

/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.bt-event-bottom {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: #c97b5d;
}

.bt-event-bottom span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.6));
}

.bt-event-bottom span:last-child {
  transform: rotate(180deg);
}

.bt-event-bottom i {
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

.bt-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(74, 52, 38, 0.45);

  backdrop-filter: blur(6px);
}

.bt-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 2px dashed rgba(156, 91, 63, 0.5);
  border-radius: 999px 999px 26px 26px;

  background: linear-gradient(172deg, #fffbf5, #f2e2d0);

  box-shadow: 0 30px 80px rgba(74, 52, 38, 0.3);

  text-align: center;

  color: #5c4636;
}

.bt-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: #c97b5d;

  background: transparent;

  cursor: pointer;
}

.bt-modal-header {
  text-align: center;
}

.bt-modal-symbol {
  font-size: 20px;

  margin-bottom: 8px;

  color: #c97b5d;
}

.bt-modal-header > span {
  font-size: 8px;

  letter-spacing: 0.28em;

  color: #8a9b7c;
}

.bt-modal-header h3 {
  margin: 8px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 32px;
  font-weight: 600;

  color: #9c5b3f;
}

.bt-modal-header p {
  margin: 0;

  font-size: 14px;

  color: #7d6350;
}

/* =====================================================
   FORM
===================================================== */

.bt-form-group {
  margin-top: 20px;

  text-align: left;
}

.bt-form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: #8a9b7c;
}

.bt-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px dashed rgba(156, 91, 63, 0.45);
  border-radius: 14px;

  outline: none;

  font-size: 16px;

  color: #5c4636;

  background: rgba(255, 251, 245, 0.9);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.bt-form-group input:focus {
  border-color: #c97b5d;

  box-shadow: 0 0 0 3px rgba(201, 123, 93, 0.16);
}

.bt-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bt-attendance-option {
  padding: 12px 14px;

  border: 1px dashed rgba(156, 91, 63, 0.45);
  border-radius: 14px;

  text-align: left;

  font-size: 13px;

  color: #5c4636;

  background: rgba(255, 251, 245, 0.8);

  cursor: pointer;

  transition: all 0.25s ease;
}

.bt-attendance-option.selected {
  border-color: #c97b5d;
  border-style: solid;

  background: rgba(201, 123, 93, 0.14);

  font-weight: 600;
}

.bt-attendance-option span {
  margin-right: 8px;

  color: #8a9b7c;
}

.bt-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.bt-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid #c97b5d;
  border-radius: 50%;

  font-size: 20px;

  color: #9c5b3f;

  background: #faf3ec;

  cursor: pointer;
}

.bt-people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;

  color: #9c5b3f;
}

.bt-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px dashed rgba(156, 91, 63, 0.5);
  border-radius: 999px 999px 16px 16px;

  text-align: center;

  background: rgba(255, 251, 245, 0.7);
}

.bt-recipient-box span {
  display: block;

  font-size: 8px;

  letter-spacing: 0.22em;

  color: #8a9b7c;
}

.bt-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "Allura", cursive;
  font-size: 28px;
  font-weight: 400;

  color: #9c5b3f;
}

.bt-form-error,
.bt-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 10px;

  text-align: center;

  font-size: 12px;
}

.bt-form-error {
  color: #a34d3d;

  background: rgba(163, 77, 61, 0.08);
}

.bt-form-success {
  color: #66805d;

  background: rgba(138, 155, 124, 0.14);
}

.bt-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 0;
  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #fff6ec;

  background: linear-gradient(135deg, #c97b5d, #9c5b3f);

  box-shadow: 0 10px 24px rgba(156, 91, 63, 0.28);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.bt-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.bt-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.bt-modal-enter-active,
.bt-modal-leave-active {
  transition: opacity 0.3s ease;
}

.bt-modal-enter-from,
.bt-modal-leave-to {
  opacity: 0;
}

.bt-modal-enter-active .bt-confirm-modal {
  animation: bt-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes bt-modal-in {
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
  .bt-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .bt-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .bt-event-heading h2 {
    font-size: 26px;
  }

  .bt-event-main-date {
    gap: 14px;
  }

  .bt-date-number {
    font-size: 62px;
  }

  .bt-date-side strong {
    font-size: 16px;
  }

  .bt-event-schedule {
    width: min(100%, 340px);
  }

  .bt-schedule-content strong {
    font-size: 19px;
  }

  .bt-calendar {
    width: min(100%, 360px);
  }

  .bt-rsvp-btn {
    width: min(100%, 360px);
  }

  .bt-confirm-modal {
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

  .bt-rsvp-btn,
  .bt-modal-submit {
    transition: none;
  }
}
</style>
