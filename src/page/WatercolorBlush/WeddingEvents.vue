<template>
  <section class="wb-events" ref="sectionRef">
    <header v-if="eyebrow || heading" class="wb-events__head">
      <p v-if="eyebrow" class="wb-eyebrow">{{ eyebrow }}</p>

      <h2 v-if="heading">{{ heading }}</h2>
    </header>

    <div class="wb-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="wb-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- EVENT TITLE -->
        <div class="wb-event-heading">
          <h2>{{ event.Title || "TIỆC CƯỚI" }}</h2>

          <div class="wb-mini-divider">
            <span></span>
            <i>❀</i>
            <span></span>
          </div>
        </div>

        <!-- DATE -->
        <div v-if="event.hasDate" class="wb-event-date">
          <div class="wb-event-weekday">{{ event.weekday }}</div>

          <div class="wb-event-main-date">
            <div class="wb-date-side">
              <span>THÁNG</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="wb-date-number">{{ event.day }}</div>

            <div class="wb-date-side">
              <span>NĂM</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="wb-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- TIME -->
        <div v-if="event.time" class="wb-event-time">
          <div>
            <small>THỜI GIAN</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- SCHEDULE -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="wb-event-schedule">
          <div v-if="event.receptionTime" class="wb-schedule-row">
            <div class="wb-schedule-dot"><span>❀</span></div>

            <div class="wb-schedule-content">
              <span>ĐÓN KHÁCH</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="wb-schedule-row">
            <div class="wb-schedule-dot"><span>❁</span></div>

            <div class="wb-schedule-content">
              <span>KHAI TIỆC</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- CALENDAR -->
        <div v-if="index === 0 && event.date && event.calendarDays?.length" class="wb-calendar">
          <div class="wb-calendar__header">
            <span>LỊCH</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="wb-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="wb-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="wb-calendar__cell"
              :class="{ empty: !day, active: day === Number(event.day) }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.day)" class="wb-active-day">
                  <span class="wb-active-bloom">❀</span>
                  <span>{{ day }}</span>
                </div>

                <span v-else class="wb-normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="index === 0 && event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="wb-calendar-btn"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="wb-rsvp-btn" @click="openConfirmModal(event)">
          <span>❀</span>
          XÁC NHẬN THAM DỰ
          <span>❀</span>
        </button>

        <div class="wb-event-bottom">
          <span></span>
          <i>❁</i>
          <span></span>
        </div>
      <EventMap v-if="index === 0 && showMap" :event="event" />
      </article>
      
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="wb-modal">
        <div v-if="showConfirmModal" class="wb-confirm-overlay" @click.self="closeConfirmModal">
          <div class="wb-confirm-modal">
            <button type="button" class="wb-modal-close" @click="closeConfirmModal">×</button>

            <div class="wb-modal-header">
              <div class="wb-modal-symbol">❀</div>

              <span>THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="wb-recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="wb-form-group">
              <label>Họ và tên</label>

              <input v-model.trim="form.name" type="text" maxlength="100" placeholder="Nhập tên của bạn" />
            </div>

            <!-- ATTENDANCE -->
            <div class="wb-form-group">
              <label>Bạn có tham dự không?</label>

              <div class="wb-attendance">
                <button
                  type="button"
                  class="wb-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="wb-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="wb-form-group">
              <label>Số người tham dự</label>

              <div class="wb-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="wb-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="wb-form-success">{{ successMessage }}</div>

            <button type="button" class="wb-modal-submit" :disabled="submitting" @click="submitConfirmation">
              {{ submitting ? "ĐANG GỬI..." : "GỬI XÁC NHẬN" }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import EventMap from "@/components/common/EventMap.vue";
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { Confirm } from "@/model/api";
import { sectionText } from "@/data/sectionTitles";
/*
 * Bản đồ gộp vào từng sự kiện — gate bằng ShowMap.
 */
const showMap = computed(() => props.settings?.ShowMap === true);


const props = defineProps({
  events: { type: Array, default: () => [] },
  recipientName: { type: [Object, Array, String], default: null },
  sections: { type: Object, default: () => ({}) },
  settings: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "events", "Eyebrow", "TIỆC BÁO HỶ")
);

const heading = computed(() =>
  sectionText(props.sections, "events", "Heading", "Thông tin tiệc báo hỷ")
);

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
.wb-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   SECTION HEADING
===================================================== */

.wb-events__head {
  margin-bottom: 34px;

  text-align: center;
}

.wb-eyebrow {
  margin: 0;

  color: #a5586c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.wb-events__head h2 {
  margin: 6px 0 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: #8a4a5c;
}

/* =====================================================
   EVENTS LIST
===================================================== */

.wb-events__list {
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

.wb-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: #8a4a5c;

  border: 1px solid rgba(217, 140, 160, 0.35);
  border-radius: 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.8), rgba(254, 244, 247, 0.65));

  box-shadow: 0 18px 44px rgba(138, 74, 92, 0.08);

  overflow: hidden;
}

.wb-event-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(232, 180, 196, 0.25);
  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.wb-event-heading {
  width: 100%;
  text-align: center;
}

.wb-event-heading h2 {
  margin: 0 0 8px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: #8a4a5c;
}

.wb-mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: #a05a6e;
}

.wb-mini-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(232, 180, 196, 0.7));
}

.wb-mini-divider span:last-child {
  transform: rotate(180deg);
}

.wb-mini-divider i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   DATE
===================================================== */

.wb-event-date {
  width: 100%;
  text-align: center;
}

.wb-event-weekday {
  margin-top: 14px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;

  color: #a5586c;
}

.wb-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;

  margin: 8px 0;
}

.wb-date-number {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(44px, 13vw, 76px);
  font-weight: 600;

  line-height: 0.85;

  color: #8a4a5c;
}

.wb-date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 10px;

  letter-spacing: 0.14em;

  color: #a5586c;
}

.wb-date-side strong {
  font-size: 18px;
  font-weight: 600;

  color: #8a4a5c;
}

.wb-event-lunar {
  font-size: 14px;
  font-style: italic;

  color: #9d5f6d;
}

/* =====================================================
   TIME
===================================================== */

.wb-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px solid rgba(232, 180, 196, 0.3);
}

.wb-event-time div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.wb-event-time small {
  font-size: 10px;

  letter-spacing: 0.2em;

  color: #a5586c;
}

.wb-event-time strong {
  font-size: 23px;
  font-weight: 600;

  color: #8a4a5c;
}

/* =====================================================
   SCHEDULE
===================================================== */

.wb-event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.wb-event-schedule::before {
  content: "";
  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(232, 180, 196, 0.45);
}

.wb-schedule-row {
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;

  min-height: 42px;
}

.wb-schedule-dot {
  position: absolute;
  left: -28px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid #a05a6e;

  background: #fdf8fa;

  z-index: 2;
}

.wb-schedule-dot span {
  font-size: 11px;

  color: #a5586c;
}

.wb-schedule-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.wb-schedule-content span {
  font-size: 11px;

  letter-spacing: 0.16em;

  color: #9d5f6d;
}

.wb-schedule-content strong {
  font-size: 21px;
  font-weight: 600;

  color: #8a4a5c;
}

/* =====================================================
   CALENDAR
===================================================== */

.wb-calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.wb-calendar__header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.wb-calendar__header span {
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #a5586c;
}

.wb-calendar__header strong {
  font-size: 11px;

  letter-spacing: 0.1em;

  color: #8a4a5c;
}

.wb-calendar__weekdays,
.wb-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.wb-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(232, 180, 196, 0.25);
}

.wb-calendar__weekdays span {
  font-size: 10px;
  font-weight: 700;

  color: #a5586c;
}

.wb-calendar__cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.wb-normal-day {
  font-size: 12px;

  color: #a06a7c;
}

.wb-active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.wb-active-bloom {
  position: absolute;

  font-size: 31px;

  color: #a05a6e;
}

.wb-active-day span:last-child {
  position: relative;

  font-weight: 700;

  color: #fefafb;
}

.wb-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 15px;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  color: #a5586c;
}

/* =====================================================
   RSVP
===================================================== */

.wb-rsvp-btn {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  padding: 13px 18px;

  border: 0;
  border-radius: 999px;

  color: #fefafb;

  background: linear-gradient(135deg, #a5586c, #b06a80);

  box-shadow: 0 10px 24px rgba(138, 74, 92, 0.24);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wb-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(138, 74, 92, 0.32);
}

/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.wb-event-bottom {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: #a05a6e;
}

.wb-event-bottom span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(232, 180, 196, 0.6));
}

.wb-event-bottom span:last-child {
  transform: rotate(180deg);
}

.wb-event-bottom i {
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

.wb-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(90, 63, 74, 0.45);

  backdrop-filter: blur(6px);
}

.wb-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid rgba(217, 140, 160, 0.45);
  border-radius: 26px;

  background: linear-gradient(170deg, #fffcfd, #fdf0f3);

  box-shadow: 0 30px 80px rgba(90, 63, 74, 0.3);

  text-align: center;

  color: #8a4a5c;
}

.wb-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: #a5586c;

  background: transparent;

  cursor: pointer;
}

.wb-modal-header {
  text-align: center;
}

.wb-modal-symbol {
  font-size: 20px;

  margin-bottom: 8px;

  color: #a05a6e;
}

.wb-modal-header > span {
  font-size: 10px;

  letter-spacing: 0.28em;

  color: #a5586c;
}

.wb-modal-header h3 {
  margin: 8px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 32px;
  font-weight: 600;

  color: #8a4a5c;
}

.wb-modal-header p {
  margin: 0;

  font-size: 14px;

  color: #a06a7c;
}

/* =====================================================
   FORM
===================================================== */

.wb-form-group {
  margin-top: 20px;

  text-align: left;
}

.wb-form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: #a5586c;
}

.wb-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid rgba(217, 140, 160, 0.4);
  border-radius: 12px;

  outline: none;

  font-size: 16px;

  color: #8a4a5c;

  background: rgba(255, 252, 253, 0.9);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.wb-form-group input:focus {
  border-color: #a5586c;

  box-shadow: 0 0 0 3px rgba(217, 140, 160, 0.14);
}

.wb-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wb-attendance-option {
  padding: 12px 14px;

  border: 1px solid rgba(217, 140, 160, 0.4);
  border-radius: 12px;

  text-align: left;

  font-size: 13px;

  color: #8a4a5c;

  background: rgba(255, 252, 253, 0.8);

  cursor: pointer;

  transition: all 0.25s ease;
}

.wb-attendance-option.selected {
  border-color: #a5586c;

  background: rgba(217, 140, 160, 0.12);

  font-weight: 600;
}

.wb-attendance-option span {
  margin-right: 8px;

  color: #a05a6e;
}

.wb-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.wb-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid #a05a6e;
  border-radius: 50%;

  font-size: 20px;

  color: #8a4a5c;

  background: #fdf8fa;

  cursor: pointer;
}

.wb-people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;

  color: #8a4a5c;
}

.wb-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px dashed rgba(217, 140, 160, 0.5);
  border-radius: 16px;

  text-align: center;

  background: rgba(255, 250, 252, 0.7);
}

.wb-recipient-box span {
  display: block;

  font-size: 10px;

  letter-spacing: 0.22em;

  color: #a5586c;
}

.wb-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "Allura", cursive;
  font-size: 28px;
  font-weight: 400;

  color: #8a4a5c;
}

.wb-form-error,
.wb-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 10px;

  text-align: center;

  font-size: 12px;
}

.wb-form-error {
  color: #b04a62;

  background: rgba(176, 74, 98, 0.08);
}

.wb-form-success {
  color: #7a9e9b;

  background: rgba(122, 158, 155, 0.08);
}

.wb-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 0;
  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #fefafb;

  background: linear-gradient(135deg, #a5586c, #b06a80);

  box-shadow: 0 10px 24px rgba(138, 74, 92, 0.24);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.wb-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.wb-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.wb-modal-enter-active,
.wb-modal-leave-active {
  transition: opacity 0.3s ease;
}

.wb-modal-enter-from,
.wb-modal-leave-to {
  opacity: 0;
}

.wb-modal-enter-active .wb-confirm-modal {
  animation: wb-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes wb-modal-in {
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
  .wb-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .wb-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .wb-event-heading h2 {
    font-size: 26px;
  }

  .wb-event-main-date {
    gap: 14px;
  }

  .wb-date-number {
    font-size: 62px;
  }

  .wb-date-side strong {
    font-size: 16px;
  }

  .wb-event-schedule {
    width: min(100%, 340px);
  }

  .wb-schedule-content strong {
    font-size: 19px;
  }

  .wb-calendar {
    width: min(100%, 360px);
  }

  .wb-rsvp-btn {
    width: min(100%, 360px);
  }

  .wb-confirm-modal {
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

  .wb-rsvp-btn,
  .wb-modal-submit {
    transition: none;
  }
}
</style>
