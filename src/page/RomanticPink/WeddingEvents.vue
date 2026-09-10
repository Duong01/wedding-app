
<template>
  <section class="events-section" ref="sectionRef">
    <!-- =========================================
         HEADER
    ========================================== -->
    

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

          <h2>
            {{ event.Title || "TIỆC CƯỚI" }}
          </h2>

          <div class="mini-divider">
            <span></span>
            <b>❦</b>
            <span></span>
          </div>
        </div>

        <!-- =====================================
             DATE
        ====================================== -->
        <div
          v-if="event.hasDate"
          class="event-date-area"
        >

          <div class="event-weekday">
            {{ event.weekday }}
          </div>

          <div class="event-main-date">

            <div class="date-side">
              <span>THÁNG</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="date-number">
              {{ event.day }}
            </div>

            <div class="date-side">
              <span>NĂM</span>
              <strong>{{ event.year }}</strong>
            </div>

          </div>

          <div
            v-if="event.lunar"
            class="event-lunar"
          >
            {{ event.lunar }}
          </div>

        </div>

        <!-- =====================================
             TIME
        ====================================== -->
        <div
          v-if="event.time"
          class="event-time-box"
        >
          <div>
            <small>THỜI GIAN</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- =====================================
             SCHEDULE
        ====================================== -->
        <div
          v-if="event.receptionTime || event.ceremonyTime"
          class="event-schedule"
        >

          <div
            v-if="event.receptionTime"
            class="schedule-row"
          >
            <div class="schedule-dot">
              <span>♡</span>
            </div>

            <div class="schedule-content">
              <span>ĐÓN KHÁCH</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div
            v-if="event.ceremonyTime"
            class="schedule-row"
          >
            <div class="schedule-dot">
              <span>✦</span>
            </div>

            <div class="schedule-content">
              <span>KHAI TIỆC</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
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
            <span>LỊCH</span>
            <strong>
              THÁNG {{ event.month }} · {{ event.year }}
            </strong>
          </div>

          <div class="calendar-weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="calendar-days">

            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="calendar-cell"
              :class="{
                empty: !day,
                active: day === Number(event.day)
              }"
            >

              <template v-if="day">

                <div
                  v-if="day === Number(event.day)"
                  class="active-day"
                >
                  <span class="active-heart">♥</span>
                  <span>{{ day }}</span>
                </div>

                <span
                  v-else
                  class="normal-day"
                >
                  {{ day }}
                </span>

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
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>

        </div>


        <!-- =====================================
             RSVP
        ====================================== -->
        <button
          v-if="event.rsvpUrl"
          type="button"
          class="rsvp-button"
          @click="openConfirmModal(event)"
        >
          <span>♡</span>
          XÁC NHẬN THAM DỰ
          <span>♡</span>
        </button>

        <!-- BOTTOM -->
        <div class="event-bottom-ornament">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

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

              <div class="modal-symbol">
                ✦
              </div>

              <span>
                THE CELEBRATION
              </span>

              <h3>
                Xác nhận tham dự
              </h3>

              <p>
                Sự hiện diện của bạn là niềm vui
                đối với gia đình chúng tôi.
              </p>

            </div>

            <!-- RECIPIENT -->
            <div
              v-if="hasRecipient"
              class="recipient-box"
            >
              <span>TRÂN TRỌNG KÍNH MỜI</span>

              <strong>
                {{ recipientName }}
              </strong>
            </div>

            <!-- NAME -->
            <div
              v-else
              class="form-group"
            >
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

              <label>
                Bạn có tham dự không?
              </label>

              <div class="attendance-options">

                <button
                  type="button"
                  class="attendance-option"
                  :class="{
                    selected: form.attendance === 'attending'
                  }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="attendance-option"
                  :class="{
                    selected: form.attendance === 'not_attending'
                  }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>

              </div>

            </div>

            <!-- PEOPLE -->
            <div
              v-if="form.attendance === 'attending'"
              class="form-group"
            >

              <label>
                Số người tham dự
              </label>

              <div class="people-control">

                <button
                  type="button"
                  @click="decreasePeople"
                >
                  −
                </button>

                <strong>
                  {{ form.numberOfPeople }}
                </strong>

                <button
                  type="button"
                  @click="increasePeople"
                >
                  +
                </button>

              </div>

            </div>

            <!-- ERROR -->
            <div
              v-if="errorMessage"
              class="form-error"
            >
              {{ errorMessage }}
            </div>

            <!-- SUCCESS -->
            <div
              v-if="successMessage"
              class="form-success"
            >
              {{ successMessage }}
            </div>

            <!-- SUBMIT -->
            <button
              type="button"
              class="modal-submit"
              :disabled="submitting"
              @click="submitConfirmation"
            >
              {{ submitting
                ? "ĐANG GỬI..."
                : "GỬI XÁC NHẬN"
              }}
            </button>

          </div>

        </div>

      </Transition>

    </Teleport>

  </section>
</template>


<script setup>
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref
} from "vue";
import dayjs from "dayjs";

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
});

const sectionRef = ref(null);

const showConfirmModal = ref(false);
const selectedEvent = ref(null);

const form = ref({
  name: "",
  attendance: "",
  numberOfPeople: 1
});

const submitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const recipientName = ref("");
const hasRecipient = computed(() => !!recipientName.value);


/* =========================================
   NORMALIZE EVENTS
========================================= */

const normalizedEvents = computed(() => {
  return (props.events || []).map(item => {

    const rawDate =
      item.EventDate ||
      item.Date ||
      item.StartDate;

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
        "THỨ BẢY"
      ];

      weekday = weekdays[date.day()];
    }

    const calendarDays =
      item.calendarDays ||
      buildCalendarDays(
        Number(year),
        Number(month)
      );

    return {
      ...item,

      hasDate: date.isValid(),

      time:
        item.EventTime ||
        item.Time ||
        item.StartTime ||
        (date.isValid()
          ? date.format("HH:mm")
          : ""),

      day,
      month,
      year,
      weekday,

      date: rawDate,

      lunar:
        item.LunarDate ||
        item.lunar ||
        "",

      receptionTime:
        item.ReceptionTime ||
        item.receptionTime ||
        "",

      ceremonyTime:
        item.CeremonyTime ||
        item.ceremonyTime ||
        "",

      location:
        item.Location ||
        item.location ||
        "",

      address:
        item.Address ||
        item.address ||
        "",

      map:
        item.Map ||
        item.map ||
        "",

      rsvpUrl:
        item.RsvpUrl ||
        item.rsvpUrl ||
        item.RSVPUrl ||
        "",

      calendarUrl:
        item.CalendarUrl ||
        item.calendarUrl ||
        "",

      calendarDays
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

  const firstDay = dayjs(
    `${year}-${String(month).padStart(2, "0")}-01`
  );

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
   ICON
========================================= */

function eventIcon(index) {

  const icons = [
    "♡",
    "✦",
    "❦",
    "♢"
  ];

  return icons[index % icons.length];
}


/* =========================================
   RSVP
========================================= */

function openConfirmModal(event) {

  selectedEvent.value = event;

  form.value = {
    name: "",
    attendance: "",
    numberOfPeople: 1
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
    errorMessage.value =
      "Vui lòng nhập họ và tên.";
    return;
  }

  if (!form.value.attendance) {
    errorMessage.value =
      "Vui lòng chọn xác nhận tham dự.";
    return;
  }

  submitting.value = true;

  try {

    /*
      TODO:
      Gọi API RSVP của bạn tại đây.

      Ví dụ:

      await api.post("/wedding/rsvp", {
        eventId: selectedEvent.value.Id,
        name: form.value.name,
        attendance: form.value.attendance,
        numberOfPeople: form.value.numberOfPeople
      });
    */

    await new Promise(resolve =>
      setTimeout(resolve, 700)
    );

    successMessage.value =
      "Cảm ơn bạn đã xác nhận tham dự ❤️";

    setTimeout(() => {
      closeConfirmModal();
    }, 1800);

  } catch (error) {

    errorMessage.value =
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
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.12
    }
  );

  sectionRef.value
    ?.querySelectorAll(".reveal")
    .forEach(el => observer.observe(el));
});


onBeforeUnmount(() => {

  observer?.disconnect();

  document.body.style.overflow = "";

});
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */
.events-section {
  position: relative;
  width: 100%;
  overflow: hidden;
}


/* =====================================================
   HEADER
===================================================== */

.events-header {
  max-width: 620px;
  text-align: center;
}

.events-header p {
  max-width: 430px;
  font-size: 18px;
  line-height: 1.6;
}


/* =====================================================
   GOLD DIVIDER
===================================================== */

.gold-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
}

.gold-divider span {
  width: 65px;
  height: 1px;

}

.gold-divider span:last-child {
  transform: rotate(180deg);
}

.gold-divider i {

  font-size: 13px;

  font-style: normal;
}

/* =====================================================
   EVENTS LIST
===================================================== */

.events-list {
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

.event-card {
  position: relative;
  width: 100%;
  max-width: 520px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}


/* =====================================================
   EVENT HEADING
===================================================== */

.event-heading {
  width: 100%;
  text-align: center;
}


/* =====================================================
   DATE
===================================================== */

.event-date-area {
  width: 100%;
  text-align: center;
}

.event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin: 8px 0;
}


/* =====================================================
   TIME
===================================================== */

.event-time-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px solid rgba(190, 151, 78, .22);
}

.event-time-box div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}


/* =====================================================
   SCHEDULE - CĂN GIỮA
===================================================== */

.event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.event-schedule::before {
  content: "";

  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(190, 151, 78, .35);
}

.schedule-row {
  position: relative;

  display: flex;
  align-items: center;

  gap: 16px;

  min-height: 42px;
}

.schedule-dot {
  position: absolute;
  left: -28px;
  width: 13px;
  height: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #c8a45e;
  background: var(--background, transparent);
  z-index: 2;
}

.schedule-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.schedule-content span {
  font-size: 12px;
  letter-spacing: .14em;
}

.schedule-content strong {
  font-size: 21px;
  white-space: nowrap;
}


/* =====================================================
   CALENDAR - CĂN GIỮA
===================================================== */

.calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.calendar-header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.calendar-weekdays,
.calendar-days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.calendar-weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(190, 151, 78, .15);
}

.calendar-cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  margin-top: 15px;

  font-size: 9px;
  font-weight: 700;
  letter-spacing: .16em;

  text-decoration: none;
}


/* =====================================================
   RSVP
===================================================== */

.rsvp-button {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 13px;

  font-size: 9px;
  font-weight: 700;
  letter-spacing: .18em;

  cursor: pointer;
}


/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.event-bottom-ornament {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;
}

.event-bottom-ornament span {
  width: 60px;
  height: 1px;
}

.event-bottom-ornament i {
  font-size: 12px;
  font-style: normal;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {

  .events-list {
    width: 100%;
    padding: 0 18px;
    gap: 28px;
  }

  .event-card {
    width: 100%;
    max-width: 430px;
  }

  .event-main-date {
    gap: 14px;
  }

  .date-number {
    font-size: 65px;
  }

  .date-side strong {
    font-size: 16px;
  }

  .event-schedule {
    width: min(100%, 340px);
  }

  .schedule-content strong {
    font-size: 19px;
  }

  .calendar {
    width: min(100%, 360px);
  }

  .rsvp-button {
    width: min(100%, 360px);
  }
}


/* =====================================================
   EVENT HEADING
===================================================== */

.event-heading {
  text-align: center;
}

.event-heading h2 {
  margin-top: 20px;
  font-size: 31px;

  font-weight: 500;

  letter-spacing: .04em;
}

.mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;
}

.mini-divider span {
  width: 35px;
  height: 1px;

}

.mini-divider b {

  font-size: 13px;

  font-weight: 400;
}


/* =====================================================
   DATE
===================================================== */

.event-date-area {

  text-align: center;
}

.event-weekday {

  font-size: 10px;
  font-weight: 700;

  letter-spacing: .22em;
}

.event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 22px;

  margin: 8px 0;
}

.date-number {
  font-size: 76px;

  font-weight: 500;

  line-height: .85;
}

.date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 8px;

  letter-spacing: .14em;
}

.date-side strong {
  font-size: 18px;

  font-weight: 500;
}

.event-lunar {
  font-size: 14px;

  font-style: italic;
}


/* =====================================================
   TIME
===================================================== */

.event-time-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  border-bottom: 1px solid rgba(190,151,78,.22);
}


.event-time-box div {
  display: flex;
  flex-direction: column;

  text-align: center;
}

.event-time-box small {
  font-size: 8px;

  letter-spacing: .18em;
}

.event-time-box strong {
  font-size: 23px;

  font-weight: 600;
}


/* =====================================================
   SCHEDULE
===================================================== */

.event-schedule {
  position: relative;
  width: min(100%, 400px);
  padding-left: 26px;
}

.event-schedule::before {
  content: "";

  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

}

.schedule-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;

}

.schedule-dot {
  position: absolute;

  left: -26px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;


  border: 1px solid #c8a45e;
}

.schedule-dot span {

  font-size: 7px;
}

.schedule-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  gap: 15px;
}

.schedule-content span {

  font-size: 9px;

  letter-spacing: .14em;
}

.schedule-content strong {
  font-size: 21px;
}


/* =====================================================
   CALENDAR
===================================================== */

.calendar {
  max-width: 400px;

}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-header span {
  font-size: 9px;

  font-weight: 700;

  letter-spacing: .2em;
}

.calendar-header strong {
  font-size: 9px;

  letter-spacing: .1em;
}

.calendar-weekdays,
.calendar-days {
  display: grid;

  grid-template-columns:
    repeat(7, 1fr);

  text-align: center;
}

.calendar-weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(190,151,78,.15);
}

.calendar-weekdays span {
  font-size: 8px;

  font-weight: 700;
}

.calendar-cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.normal-day {
  font-size: 12px;
}

.active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.active-heart {
  position: absolute;
  font-size: 31px;
}

.active-day span:last-child {
  position: relative;
  font-weight: 700;
  color:#fff;
}

.calendar-button {
  display: block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .16em;
  text-decoration: none;
}


/* =====================================================
   LOCATION
===================================================== */

.event-location {

  border-top: 1px solid rgba(190,151,78,.2);

  text-align: center;
}

.location-icon {
  width: 40px;
  height: 40px;

  margin: 0 auto 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  border: 1px solid rgba(190,151,78,.35);

  font-size: 20px;
}

.location-content {
  display: flex;
  flex-direction: column;

  gap: 5px;
}

.location-label {

  font-size: 8px;
  font-weight: 700;

  letter-spacing: .2em;
}

.location-content strong {
  font-size: 22px;

  font-weight: 600;
}

.location-content p {
  margin: 0 auto;

  max-width: 440px;

  font-size: 15px;

  line-height: 1.5;
}

.map-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(190,151,78,.3);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .14em;
  text-decoration: none;
  transition: .3s ease;
}


/* =====================================================
   RSVP
===================================================== */

.rsvp-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 13px;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: .18em;

  cursor: pointer;

}




/* =====================================================
   REVEAL
===================================================== */

.reveal {
  opacity: 0;

  transform:
    translateY(35px);

  transition:
    opacity .8s ease var(--delay, 0ms),
    transform .8s cubic-bezier(.2,.8,.2,1) var(--delay, 0ms);
}

.reveal.visible {
  opacity: 1;

  transform: translateY(0);
}


/* =====================================================
   MODAL
===================================================== */

.confirm-overlay {
  position: fixed;

  inset: 0;

  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

}

.confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

}

.modal-close {
  position: absolute;

  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;
  border: 0;
  font-size: 27px;

  cursor: pointer;
}

.modal-header {
  text-align: center;
}

.modal-symbol {

  font-size: 20px;

  margin-bottom: 8px;
}

.modal-header > span {

  font-size: 8px;

  letter-spacing: .25em;
}

.modal-header h3 {
  margin: 8px 0;
  font-size: 32px;

  font-weight: 500;
}

.modal-header p {
  margin: 0;
  font-size: 15px;
}


/* =====================================================
   FORM
===================================================== */

.form-group {
  margin-top: 20px;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: .1em;
}

.form-group input {
  width: 100%;

  padding: 13px 14px;

  outline: none;
  font-size: 17px;
}

.attendance-options {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.attendance-option {
  padding: 12px;


  text-align: left;

  cursor: pointer;

  transition: .25s ease;
}

.attendance-option span {
  margin-right: 8px;

}


.people-control {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 25px;
}

.people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid #c7a663;


  font-size: 20px;

  cursor: pointer;
}

.people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;
}

.recipient-box {
  margin: 20px 0;

  padding: 18px;

  text-align: center;

}

.recipient-box span {
  display: block;


  font-size: 8px;

  letter-spacing: .2em;
}

.recipient-box strong {
  display: block;
  margin-top: 6px;
  font-size: 24px;
}

.form-error,
.form-success {
  margin-top: 15px;

  padding: 10px;

  text-align: center;

  font-size: 12px;
}

.form-error {
  color: #a34d4d;

}

.form-success {
  color: #66805d;

}

.modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 0;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: .18em;

  cursor: pointer;
}

.modal-submit:disabled {
  opacity: .6;

  cursor: not-allowed;
}


/* =====================================================
   MODAL ANIMATION
===================================================== */

.modal-enter-active,
.modal-leave-active {
  transition: opacity .3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .confirm-modal {
  animation: modalIn .4s cubic-bezier(.2,.8,.2,1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(.96);
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


  .events-header p {
    font-size: 16px;
  }

  .events-list {
    gap: 25px;
  }

  .event-heading h3 {
    font-size: 27px;
  }

  .date-number {
    font-size: 65px;
  }

  .event-main-date {
    gap: 14px;
  }

  .date-side strong {
    font-size: 16px;
  }

  .schedule-content strong {
    font-size: 19px;
  }

  .calendar {
    padding: 13px;
  }

  .location-content strong {
    font-size: 20px;
  }

  .confirm-modal {
    padding:
      35px
      20px
      25px;
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

  .event-card,
  .rsvp-button {
    transition: none;
  }

}

</style>

