<template>
  <section class="events-section" ref="sectionRef">
    <!-- =========================================
         HEADER
    ========================================== -->
    <div class="events-heading">
      <div class="gg-eyebrow">TRÂN TRỌNG KÍNH MỜI</div>

      <h2 class="gg-title">Thông tin tiệc cưới</h2>
    </div>

    <!-- =========================================
         EVENTS
    ========================================== -->
    <div class="events-list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- =====================================
             EVENT TITLE
        ====================================== -->
        <div class="event-heading">
          <h3 class="event-title">
            {{ event.Title || "TIỆC CƯỚI" }}
          </h3>
        </div>

        <!-- =====================================
             DATE
        ====================================== -->
        <div v-if="event.hasDate" class="event-date-area">
          <p class="event-lead">Tiệc cưới sẽ diễn ra vào lúc:</p>

          <p v-if="event.time" class="event-time">
            {{ event.time }}
          </p>

          <div class="event-date-row">
            <span class="date-weekday">{{ event.weekday }}</span>

            <span class="date-sep"></span>

            <span class="date-day">{{ event.day }}</span>

            <span class="date-sep"></span>

            <span class="date-month">THÁNG {{ event.month }}</span>

            <span class="date-sep"></span>

            <span class="date-year">{{ event.year }}</span>
          </div>

          <p v-if="event.lunar" class="event-lunar">
            ( Tức ngày {{ event.lunar }} )
          </p>
        </div>

        <!-- =====================================
             SCHEDULE
        ====================================== -->
        <div
          v-if="event.receptionTime || event.ceremonyTime"
          class="event-schedule"
        >
          <div v-if="event.receptionTime" class="schedule-row">
            <span class="schedule-label">Đón khách</span>
            <strong class="schedule-value">{{ event.receptionTime }}</strong>
          </div>

          <div v-if="event.ceremonyTime" class="schedule-row">
            <span class="schedule-label">Khai tiệc</span>
            <strong class="schedule-value">{{ event.ceremonyTime }}</strong>
          </div>
        </div>

        <!-- =====================================
             CALENDAR
        ====================================== -->
        <div
          v-if="event.date && event.calendarDays?.length"
          class="calendar"
        >
          <div class="calendar-header">
            Tháng {{ event.month }} / {{ event.year }}
          </div>

          <div class="calendar-weekdays">
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span>CN</span>
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
                <div v-if="day === Number(event.day)" class="active-day">
                  <img :src="calendarHeart" alt="" aria-hidden="true" />
                  <span>{{ day }}</span>
                </div>

                <span v-else class="normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="calendar-button"
          >
            Thêm vào lịch
          </a>
        </div>

        <!-- =====================================
             RSVP
        ====================================== -->
        <button
          type="button"
          class="rsvp-button"
          @click="openConfirmModal(event)"
        >
          XÁC NHẬN THAM DỰ
        </button>
      </article>
    </div>

    <!-- =========================================
         RSVP MODAL
    ========================================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showConfirmModal"
          class="confirm-overlay"
          @click.self="closeConfirmModal"
        >
          <div class="confirm-modal">
            <button
              type="button"
              class="modal-close"
              @click="closeConfirmModal"
            >
              ×
            </button>

            <div class="modal-header">
              <span class="modal-eyebrow">THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>
                Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.
              </p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>

              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="form-group">
              <label>Họ và tên</label>

              <input
                v-model.trim="form.name"
                type="text"
                maxlength="100"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <!-- ATTENDANCE -->
            <div class="form-group">
              <label>Bạn có tham dự không?</label>

              <div class="attendance-options">
                <button
                  type="button"
                  class="attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="form-group">
              <label>Số người tham dự</label>

              <div class="people-control">
                <button type="button" @click="decreasePeople">−</button>

                <strong>{{ form.numberOfPeople }}</strong>

                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <!-- ERROR -->
            <div v-if="errorMessage" class="form-error">
              {{ errorMessage }}
            </div>

            <!-- SUCCESS -->
            <div v-if="successMessage" class="form-success">
              {{ successMessage }}
            </div>

            <!-- SUBMIT -->
            <button
              type="button"
              class="modal-submit"
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
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { Confirm } from "@/model/api";
import calendarHeart from "@/assets/glass-garden-pink/calendar-heart.webp";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  recipientName: {
    type: [Object, Array, String],
    default: null,
  },
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

  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value[0]?.Name || "";
  }

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

    const time =
      item.EventTime ||
      item.Time ||
      item.StartTime ||
      (date.isValid() ? date.format("HH:mm") : "");

    const location = item.Location || item.location || "";
    const address = item.Address || item.address || "";

    return {
      ...item,

      hasDate: date.isValid(),

      time,

      day,
      month,
      year,
      weekday,

      date: rawDate,

      lunar: item.LunarDate || item.lunar || "",

      receptionTime: item.ReceptionTime || item.receptionTime || "",

      ceremonyTime: item.CeremonyTime || item.ceremonyTime || "",

      location,
      address,

      map: item.Map || item.map || "",

      rsvpUrl: item.RsvpUrl || item.rsvpUrl || item.RSVPUrl || "",

      calendarUrl:
        item.CalendarUrl ||
        item.calendarUrl ||
        buildCalendarUrl({
          date,
          time,
          title: item.Title || "Lễ Thành Hôn",
          location: location || address,
        }),

      calendarDays,
    };
  });
});

/* =========================================
   CALENDAR
========================================= */

function buildCalendarDays(year, month) {
  if (!year || !month) {
    return [];
  }

  const firstDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);

  const daysInMonth = firstDay.daysInMonth();

  /* Lưới bắt đầu từ Thứ Hai */
  const startDay = (firstDay.day() + 6) % 7;

  const result = [];

  for (let i = 0; i < startDay; i++) {
    result.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    result.push(i);
  }

  return result;
}

/*
 * Link "Thêm vào lịch" của Google Calendar.
 * Chỉ tạo khi có ngày hợp lệ.
 */
function buildCalendarUrl({ date, time, title, location }) {
  if (!date?.isValid()) {
    return "";
  }

  const [hour, minute] = String(time || "00:00")
    .split(":")
    .map((value) => Number(value) || 0);

  const start = date.hour(hour).minute(minute).second(0);

  const end = start.add(3, "hour");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start.format("YYYYMMDDTHHmmss")}/${end.format(
      "YYYYMMDDTHHmmss"
    )}`,
    details: "Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi.",
    location: location || "",
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
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
    {
      threshold: 0.12,
    }
  );

  sectionRef.value
    ?.querySelectorAll(".reveal")
    .forEach((el) => observer.observe(el));
});

onBeforeUnmount(() => {
  observer?.disconnect();

  document.body.style.overflow = "";
});
</script>

<style scoped>
/* =====================================================
   SECTION
===================================================== */

.events-section {
  position: relative;
  text-align: center;
}

.events-heading {
  margin-bottom: 26px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

/* =====================================================
   EVENT CARD
===================================================== */

.event-card {
  position: relative;

  padding: 26px 18px 24px;

  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.35);

  background-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.45),
    inset -1.5px -1.5px 3px rgba(180, 120, 130, 0.12),
    0 18px 50px -6px rgba(147, 56, 69, 0.3),
    0 6px 20px 2px rgba(147, 56, 69, 0.14);

  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease var(--delay, 0ms),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms);
}

.event-card.visible {
  opacity: 1;
  transform: none;
}

/* =====================================================
   EVENT TITLE
===================================================== */

.event-title {
  margin: 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "Times New Roman", Times, serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* =====================================================
   DATE
===================================================== */

.event-date-area {
  margin-top: 18px;
}

.event-lead {
  margin: 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.event-time {
  margin: 6px 0 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 26px;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.event-date-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;

  margin-top: 14px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.date-sep {
  width: 1px;
  height: 24px;

  background-color: var(--gg-deep, #933845);
  opacity: 0.6;
}

.date-day {
  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0;
}

.event-lunar {
  margin: 10px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
  opacity: 0.75;
}

/* =====================================================
   SCHEDULE
===================================================== */

.event-schedule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 34px;

  margin-top: 20px;
}

.schedule-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.schedule-label {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.85;
}

.schedule-value {
  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 18px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* =====================================================
   CALENDAR
===================================================== */

.calendar {
  max-width: 330px;
  margin: 24px auto 0;
  padding: 20px;

  border: 1px solid var(--gg-deep, #933845);
  border-radius: 28px;
}

.calendar-header {
  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  margin-top: 12px;
  padding-bottom: 8px;

  border-bottom: 2px solid var(--gg-rose, #cb5d6c);

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.04em;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: center;

  margin-top: 6px;
}

.calendar-cell {
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.normal-day {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.active-day {
  position: relative;

  width: 26px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.active-day img {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;
}

.active-day span {
  position: relative;
  z-index: 1;

  color: #ffffff;
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.calendar-button {
  display: inline-block;

  margin-top: 16px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}

/* =====================================================
   RSVP
===================================================== */

.rsvp-button {
  margin-top: 22px;
  padding: 9px 26px;

  border: none;
  border-radius: 999px;

  background-color: var(--gg-rose, #cb5d6c);
  color: #ffffff;

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;

  cursor: pointer;
}

.rsvp-button:hover {
  background-color: var(--gg-deep, #933845);
}

/* =====================================================
   RSVP MODAL
===================================================== */

.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 18px;

  background-color: rgba(147, 56, 69, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.confirm-modal {
  position: relative;

  width: min(100%, 400px);
  max-height: 88vh;
  overflow-y: auto;

  padding: 28px 22px 24px;

  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);

  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: 0 24px 60px -10px rgba(147, 56, 69, 0.4);

  text-align: center;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;

  width: 30px;
  height: 30px;

  border: none;
  border-radius: 50%;

  background-color: rgba(203, 93, 108, 0.12);
  color: var(--gg-deep, #933845);

  font-size: 19px;
  line-height: 1;

  cursor: pointer;
}

.modal-eyebrow {
  display: block;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 9px;
  letter-spacing: 0.24em;
  opacity: 0.7;
}

.modal-header h3 {
  margin: 6px 0 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
}

.modal-header p {
  margin: 8px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  line-height: 1.6;
  opacity: 0.85;
}

.recipient-box {
  margin-top: 18px;
  padding: 12px;

  border-radius: 14px;
  border: 1px solid rgba(203, 93, 108, 0.35);

  background-color: rgba(203, 93, 108, 0.06);
}

.recipient-box span {
  display: block;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 9px;
  letter-spacing: 0.2em;
  opacity: 0.7;
}

.recipient-box strong {
  display: block;
  margin-top: 4px;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 19px;
  font-weight: 600;
}

.form-group {
  margin-top: 18px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 6px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;

  border: 1px solid rgba(203, 93, 108, 0.35);
  border-radius: 12px;

  background-color: #ffffff;
  color: var(--gg-deep, #933845);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 14px;

  outline: none;
}

.form-group input:focus {
  border-color: var(--gg-rose, #cb5d6c);
}

.attendance-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attendance-option {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 14px;

  border: 1px solid rgba(203, 93, 108, 0.3);
  border-radius: 12px;

  background-color: #ffffff;
  color: var(--gg-deep, #933845);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  text-align: left;

  cursor: pointer;
}

.attendance-option.selected {
  border-color: var(--gg-rose, #cb5d6c);
  background-color: rgba(203, 93, 108, 0.1);
  color: var(--gg-rose, #cb5d6c);
  font-weight: 600;
}

.people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  padding: 6px;

  border: 1px solid rgba(203, 93, 108, 0.3);
  border-radius: 12px;

  background-color: #ffffff;
}

.people-control button {
  width: 32px;
  height: 32px;

  border: none;
  border-radius: 50%;

  background-color: rgba(203, 93, 108, 0.12);
  color: var(--gg-rose, #cb5d6c);

  font-size: 17px;
  line-height: 1;

  cursor: pointer;
}

.people-control strong {
  min-width: 26px;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 19px;
  font-weight: 600;
}

.form-error,
.form-success {
  margin-top: 14px;
  padding: 9px 12px;

  border-radius: 10px;

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
}

.form-error {
  background-color: rgba(203, 93, 108, 0.12);
  color: var(--gg-deep, #933845);
}

.form-success {
  background-color: rgba(34, 197, 94, 0.12);
  color: #166534;
}

.modal-submit {
  width: 100%;
  margin-top: 20px;
  padding: 11px;

  border: none;
  border-radius: 999px;

  background-color: var(--gg-rose, #cb5d6c);
  color: #ffffff;

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;

  cursor: pointer;
}

.modal-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* =====================================================
   TRANSITION
===================================================== */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .event-card {
    padding: 34px 30px 30px;
  }

  .event-title {
    font-size: 20px;
  }

  .event-lead {
    font-size: 15px;
  }

  .event-time {
    font-size: 30px;
  }

  .calendar {
    max-width: 400px;
    padding: 26px;
  }

  .calendar-cell {
    height: 34px;
  }

  .active-day {
    width: 30px;
    height: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .event-card {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
