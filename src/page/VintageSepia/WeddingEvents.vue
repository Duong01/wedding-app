<template>
  <section class="vs-events" ref="sectionRef">
    <div class="vs-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="vs-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- EVENT TITLE -->
        <div class="vs-event-heading">
          <h2>{{ event.Title || "TIỆC CƯỚI" }}</h2>

          <div class="vs-mini-divider">
            <span></span>
            <i>❦</i>
            <span></span>
          </div>
        </div>

        <!-- DATE -->
        <div v-if="event.hasDate" class="vs-event-date">
          <div class="vs-event-weekday">{{ event.weekday }}</div>

          <div class="vs-event-main-date">
            <div class="vs-date-side">
              <span>THÁNG</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="vs-date-number">{{ event.day }}</div>

            <div class="vs-date-side">
              <span>NĂM</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="vs-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- TIME -->
        <div v-if="event.time" class="vs-event-time">
          <div>
            <small>THỜI GIAN</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- SCHEDULE -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="vs-event-schedule">
          <div v-if="event.receptionTime" class="vs-schedule-row">
            <div class="vs-schedule-dot"><span>❦</span></div>

            <div class="vs-schedule-content">
              <span>ĐÓN KHÁCH</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="vs-schedule-row">
            <div class="vs-schedule-dot"><span>✦</span></div>

            <div class="vs-schedule-content">
              <span>KHAI TIỆC</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- CALENDAR -->
        <div v-if="event.date && event.calendarDays?.length" class="vs-calendar">
          <div class="vs-calendar__header">
            <span>LỊCH</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="vs-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="vs-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="vs-calendar__cell"
              :class="{ empty: !day, active: day === Number(event.day) }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.day)" class="vs-active-day">
                  <span class="vs-active-mark">❦</span>
                  <span>{{ day }}</span>
                </div>

                <span v-else class="vs-normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="vs-calendar-btn"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="vs-rsvp-btn" @click="openConfirmModal(event)">
          <span>❦</span>
          XÁC NHẬN THAM DỰ
          <span>❦</span>
        </button>

        <div class="vs-event-bottom">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>
      </article>
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="vs-modal">
        <div v-if="showConfirmModal" class="vs-confirm-overlay" @click.self="closeConfirmModal">
          <div class="vs-confirm-modal">
            <button type="button" class="vs-modal-close" @click="closeConfirmModal">×</button>

            <div class="vs-modal-header">
              <div class="vs-modal-symbol">❦</div>

              <span>THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="vs-recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="vs-form-group">
              <label>Họ và tên</label>

              <input v-model.trim="form.name" type="text" maxlength="100" placeholder="Nhập tên của bạn" />
            </div>

            <!-- ATTENDANCE -->
            <div class="vs-form-group">
              <label>Bạn có tham dự không?</label>

              <div class="vs-attendance">
                <button
                  type="button"
                  class="vs-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="vs-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="vs-form-group">
              <label>Số người tham dự</label>

              <div class="vs-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="vs-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="vs-form-success">{{ successMessage }}</div>

            <button type="button" class="vs-modal-submit" :disabled="submitting" @click="submitConfirmation">
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
.vs-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   EVENTS LIST
===================================================== */

.vs-events__list {
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

.vs-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.4);
  border-radius: 10px;

  background: #fbf5e6;

  box-shadow: 0 18px 44px rgba(61, 47, 36, 0.12);

  overflow: hidden;
}

.vs-event-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px dashed rgba(107, 79, 58, 0.28);
  border-radius: 6px;

  pointer-events: none;
}

/* Tape strip across the top of the card */
.vs-event-card::after {
  content: "";
  position: absolute;

  top: -10px;
  left: 50%;

  width: 120px;
  height: 24px;

  transform: translateX(-50%) rotate(-1.5deg);

  background: rgba(194, 168, 120, 0.35);

  box-shadow: 0 1px 3px rgba(61, 47, 36, 0.12);

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.vs-event-heading {
  width: 100%;
  text-align: center;
}

.vs-event-heading h2 {
  margin: 0 0 8px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: #4a3a2c;
}

.vs-mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: #c2a878;
}

.vs-mini-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.55));
}

.vs-mini-divider span:last-child {
  transform: rotate(180deg);
}

.vs-mini-divider i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   DATE
===================================================== */

.vs-event-date {
  width: 100%;
  text-align: center;
}

.vs-event-weekday {
  margin-top: 14px;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;

  color: #97745a;
}

.vs-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;

  margin: 8px 0;
}

.vs-date-number {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(44px, 13vw, 76px);
  font-weight: 600;

  line-height: 0.85;

  color: #4a3a2c;
}

.vs-date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;

  letter-spacing: 0.14em;

  color: #97745a;
}

.vs-date-side strong {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 18px;
  font-weight: 600;

  color: #4a3a2c;
}

.vs-event-lunar {
  font-size: 14px;
  font-style: italic;

  color: #97745a;
}

/* =====================================================
   TIME
===================================================== */

.vs-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px dashed rgba(107, 79, 58, 0.35);
}

.vs-event-time div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.vs-event-time small {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;

  letter-spacing: 0.2em;

  color: #97745a;
}

.vs-event-time strong {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 23px;
  font-weight: 600;

  color: #4a3a2c;
}

/* =====================================================
   SCHEDULE
===================================================== */

.vs-event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.vs-event-schedule::before {
  content: "";
  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(107, 79, 58, 0.4);
}

.vs-schedule-row {
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;

  min-height: 42px;
}

.vs-schedule-dot {
  position: absolute;
  left: -28px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid #c2a878;

  background: #fbf5e6;

  z-index: 2;
}

.vs-schedule-dot span {
  font-size: 7px;

  color: #97745a;
}

.vs-schedule-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.vs-schedule-content span {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;

  letter-spacing: 0.16em;

  color: #97745a;
}

.vs-schedule-content strong {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 21px;
  font-weight: 600;

  color: #4a3a2c;
}

/* =====================================================
   CALENDAR
===================================================== */

.vs-calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.vs-calendar__header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.vs-calendar__header span {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #97745a;
}

.vs-calendar__header strong {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;

  letter-spacing: 0.1em;

  color: #4a3a2c;
}

.vs-calendar__weekdays,
.vs-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.vs-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(107, 79, 58, 0.25);
}

.vs-calendar__weekdays span {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;
  font-weight: 700;

  color: #97745a;
}

.vs-calendar__cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-normal-day {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 12px;

  color: #6b4f3a;
}

.vs-active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-active-mark {
  position: absolute;

  font-size: 31px;

  color: #c2a878;
}

.vs-active-day span:last-child {
  position: relative;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-weight: 700;

  color: #3d2f24;
}

.vs-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 15px;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  color: #97745a;
}

/* =====================================================
   RSVP
===================================================== */

.vs-rsvp-btn {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  padding: 13px 18px;

  border: 1px solid #2c211a;
  border-radius: 8px;

  color: #ead9bd;

  background: linear-gradient(160deg, #4a3a2c, #3d2f24 60%, #2c211a);

  box-shadow: 0 10px 24px rgba(61, 47, 36, 0.28);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.vs-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(61, 47, 36, 0.36);
}

/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.vs-event-bottom {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: #c2a878;
}

.vs-event-bottom span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.5));
}

.vs-event-bottom span:last-child {
  transform: rotate(180deg);
}

.vs-event-bottom i {
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

.vs-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(45, 33, 26, 0.5);

  backdrop-filter: blur(6px);
}

.vs-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid rgba(107, 79, 58, 0.5);
  border-radius: 10px;

  background: #fbf5e6;

  box-shadow: 0 30px 80px rgba(45, 33, 26, 0.35);

  text-align: center;

  color: #6b4f3a;
}

.vs-confirm-modal::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px dashed rgba(107, 79, 58, 0.3);
  border-radius: 6px;

  pointer-events: none;
}

.vs-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: #97745a;

  background: transparent;

  cursor: pointer;
}

.vs-modal-header {
  position: relative;

  text-align: center;
}

.vs-modal-symbol {
  font-size: 20px;

  margin-bottom: 8px;

  color: #c2a878;
}

.vs-modal-header > span {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;

  letter-spacing: 0.28em;

  color: #97745a;
}

.vs-modal-header h3 {
  margin: 8px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 32px;
  font-weight: 600;

  color: #4a3a2c;
}

.vs-modal-header p {
  margin: 0;

  font-size: 14px;

  color: #6b4f3a;
}

/* =====================================================
   FORM
===================================================== */

.vs-form-group {
  position: relative;

  margin-top: 20px;

  text-align: left;
}

.vs-form-group label {
  display: block;

  margin-bottom: 8px;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: #97745a;
}

.vs-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid rgba(107, 79, 58, 0.4);
  border-radius: 8px;

  outline: none;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 16px;

  color: #4a3a2c;

  background: rgba(255, 253, 246, 0.9);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.vs-form-group input:focus {
  border-color: #97745a;

  box-shadow: 0 0 0 3px rgba(151, 116, 90, 0.16);
}

.vs-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vs-attendance-option {
  padding: 12px 14px;

  border: 1px solid rgba(107, 79, 58, 0.4);
  border-radius: 8px;

  text-align: left;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;

  color: #4a3a2c;

  background: rgba(255, 253, 246, 0.8);

  cursor: pointer;

  transition: all 0.25s ease;
}

.vs-attendance-option.selected {
  border-color: #6b4f3a;

  background: rgba(194, 168, 120, 0.18);

  font-weight: 600;
}

.vs-attendance-option span {
  margin-right: 8px;

  color: #c2a878;
}

.vs-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.vs-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid #c2a878;
  border-radius: 50%;

  font-size: 20px;

  color: #4a3a2c;

  background: #fbf5e6;

  cursor: pointer;
}

.vs-people-control strong {
  min-width: 25px;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 18px;

  color: #4a3a2c;
}

.vs-recipient-box {
  position: relative;

  margin: 20px 0;

  padding: 18px;

  border: 1px dashed rgba(107, 79, 58, 0.5);
  border-radius: 8px;

  text-align: center;

  background: rgba(255, 253, 246, 0.7);
}

.vs-recipient-box span {
  display: block;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;

  letter-spacing: 0.22em;

  color: #97745a;
}

.vs-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "Allura", cursive;
  font-size: 28px;
  font-weight: 400;

  color: #4a3a2c;
}

.vs-form-error,
.vs-form-success {
  position: relative;

  margin-top: 15px;

  padding: 10px;

  border-radius: 8px;

  text-align: center;

  font-size: 12px;
}

.vs-form-error {
  color: #8a3d2e;

  background: rgba(138, 61, 46, 0.08);
}

.vs-form-success {
  color: #5c6b3c;

  background: rgba(92, 107, 60, 0.08);
}

.vs-modal-submit {
  position: relative;

  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 1px solid #2c211a;
  border-radius: 8px;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #ead9bd;

  background: linear-gradient(160deg, #4a3a2c, #3d2f24 60%, #2c211a);

  box-shadow: 0 10px 24px rgba(61, 47, 36, 0.28);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.vs-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.vs-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.vs-modal-enter-active,
.vs-modal-leave-active {
  transition: opacity 0.3s ease;
}

.vs-modal-enter-from,
.vs-modal-leave-to {
  opacity: 0;
}

.vs-modal-enter-active .vs-confirm-modal {
  animation: vs-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes vs-modal-in {
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
  .vs-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .vs-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .vs-event-heading h2 {
    font-size: 26px;
  }

  .vs-event-main-date {
    gap: 14px;
  }

  .vs-date-number {
    font-size: 62px;
  }

  .vs-date-side strong {
    font-size: 16px;
  }

  .vs-event-schedule {
    width: min(100%, 340px);
  }

  .vs-schedule-content strong {
    font-size: 19px;
  }

  .vs-calendar {
    width: min(100%, 360px);
  }

  .vs-rsvp-btn {
    width: min(100%, 360px);
  }

  .vs-confirm-modal {
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

  .vs-rsvp-btn,
  .vs-modal-submit {
    transition: none;
  }
}
</style>
