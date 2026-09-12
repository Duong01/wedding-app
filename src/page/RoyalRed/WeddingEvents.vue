<template>
  <section class="events">
    <!-- =========================================
         HEADER SECTION
    ========================================== -->

    <div class="section-heading">
      <div class="heading-line"></div>

      <div class="heading-content">
        <span class="heading-subtitle"> TRÂN TRỌNG KÍNH MỜI </span>

        <h2>THÔNG TIN TIỆC CƯỚI</h2>

        <div class="heading-symbol">囍</div>
      </div>

      <div class="heading-line"></div>
    </div>

    <!-- =========================================
         EVENT CARDS
    ========================================== -->

    <div
      v-for="(event, index) in normalizedEvents"
      :key="event.Id || index"
      class="event-card"
    >
      <!-- Viền trang trí -->

      <div class="card-border"></div>

      <div class="corner corner-tl">❖</div>
      <div class="corner corner-tr">❖</div>
      <div class="corner corner-bl">❖</div>
      <div class="corner corner-br">❖</div>

      <div class="event-inner">
        <!-- =====================================
             EVENT TITLE
        ====================================== -->

        <div class="event-title-wrap">
          <span class="event-kicker">
            {{ event.typeLabel }}
          </span>

          <h3>
            {{ event.Title || "THÔNG TIN TIỆC CƯỚI" }}
          </h3>

          <div class="title-decoration">
            <span></span>
            <b>囍</b>
            <span></span>
          </div>
        </div>

        <!-- =====================================
             TIME + DATE
        ====================================== -->

        <div v-if="event.hasDate" class="event-date-block">
          <!-- GIỜ -->

          <div v-if="event.time" class="event-time">
            {{ event.time }}
          </div>

          <!-- THỨ + NGÀY + THÁNG -->

          <div class="event-date">
            <span v-if="event.weekday" class="weekday">
              {{ event.weekday }}
            </span>

            <strong v-if="event.day" class="day">
              {{ event.day }}
            </strong>

            <span v-if="event.month" class="month">
              THÁNG {{ event.month }}
            </span>
          </div>

          <!-- NĂM -->

          <div v-if="event.year" class="event-year">
            {{ event.year }}
          </div>

          <!-- ÂM LỊCH -->

          <div v-if="event.lunar" class="event-lunar">
            {{ event.lunar }}
          </div>
        </div>

        <!-- =====================================
             RECEPTION / CEREMONY
        ====================================== -->

        <div v-if="event.receptionTime || event.ceremonyTime" class="schedule">
          <div v-if="event.receptionTime" class="schedule-item">
            <span class="schedule-icon"> ♡ </span>

            <span class="schedule-label"> ĐÓN KHÁCH </span>

            <strong>
              {{ event.receptionTime }}
            </strong>
          </div>

          <div v-if="event.ceremonyTime" class="schedule-item">
            <span class="schedule-icon"> ✦ </span>

            <span class="schedule-label"> KHAI TIỆC </span>

            <strong>
              {{ event.ceremonyTime }}
            </strong>
          </div>
        </div>

        <!-- =====================================
             CALENDAR
        ====================================== -->

        <div v-if="event.date" class="calendar">
          <div class="calendar-top">
            <span class="calendar-label"> LỊCH </span>

            <strong> THÁNG {{ event.month }} · {{ event.year }} </strong>
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
                active: day === Number(event.Day),
              }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.Day)" class="active-day">
                  <span class="heart"> ♥ </span>

                  <span class="active-number">
                    {{ day }}
                  </span>
                </div>

                <span v-else class="normal-day">
                  {{ day }}
                </span>
              </template>
            </div>
          </div>

          <!-- ADD TO CALENDAR -->

          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE"
            target="_blank"
            rel="noopener noreferrer"
            class="calendar-link"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>
        </div>
        <!-- =====================================
             RSVP
        ====================================== -->
        <button class="rsvp-button" type="button" @click="openConfirmModal">
          <span> XÁC NHẬN THAM DỰ </span>

          <span> → </span>
        </button>

        <!-- =====================================
             BOTTOM ORNAMENT
        ====================================== -->

        <div class="bottom-ornament">
          <span></span>

          <b>囍</b>

          <span></span>
        </div>
      </div>
    </div>
    <!-- =====================================================
         CONFIRM MODAL
    ====================================================== -->

    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="confirm-overlay"
        @click.self="closeConfirmModal"
      >
        <div class="confirm-modal">
          <!-- CLOSE -->
          <button class="modal-close" type="button" @click="closeConfirmModal">
            ×
          </button>

          <!-- HEADER -->
          <div class="modal-header">
            <div class="modal-symbol">❖</div>

            <h3>XÁC NHẬN THAM DỰ</h3>

            <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
          </div>

          <!-- =================================================
               TH1: CÓ NGƯỜI ĐƯỢC MỜI
          ================================================== -->

          <template v-if="hasRecipient">
            <div class="recipient-box">
              <div class="recipient-label">TRÂN TRỌNG KÍNH MỜI</div>

              <div class="recipient-name">
                {{ recipientName }}
              </div>
            </div>
          </template>

          <!-- =================================================
               TH2: KHÔNG CÓ NGƯỜI ĐƯỢC MỜI
          ================================================== -->

          <template v-else>
            <div class="form-group">
              <label> Họ và tên </label>

              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Nhập tên của bạn"
                maxlength="100"
              />
            </div>
          </template>

          <!-- ATTEND -->
          <div class="form-group">
            <label> Bạn có tham dự không? </label>

            <div class="attendance-options">
              <button
                type="button"
                class="attendance-option"
                :class="{
                  selected: form.attendance === 'attending',
                }"
                @click="form.attendance = 'attending'"
              >
                <span class="option-icon"> ✓ </span>

                <span> Có, tôi sẽ tham dự </span>
              </button>

              <button
                type="button"
                class="attendance-option"
                :class="{
                  selected: form.attendance === 'not_attending',
                }"
                @click="form.attendance = 'not_attending'"
              >
                <span class="option-icon"> × </span>

                <span> Rất tiếc, tôi không thể tham dự </span>
              </button>
            </div>
          </div>

          <!-- NUMBER OF PEOPLE -->
          <div v-if="form.attendance === 'attending'" class="form-group">
            <label> Số người tham dự </label>

            <div class="people-control">
              <button type="button" @click="decreasePeople">−</button>

              <span>
                {{ form.numberOfPeople }}
              </span>

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
            class="modal-submit"
            type="button"
            :disabled="submitting"
            @click="submitConfirmation"
          >
            <span v-if="!submitting"> GỬI XÁC NHẬN </span>

            <span v-else> ĐANG GỬI... </span>
          </button>
        </div>
      </div>
    </Teleport>
  </section>
</template>


<script setup>
import { computed, reactive, ref } from "vue";
import { Confirm } from "@/model/api";
import { useRoute } from "vue-router";
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
const showConfirmModal = ref(false);

const submitting = ref(false);

const errorMessage = ref("");

const successMessage = ref("");

/* =========================================================
   FORM
========================================================= */

const form = reactive({
  name: "",
  attendance: "attending",
  numberOfPeople: 1,
});

const hasRecipient = computed(() => {
  if (!props.recipientName) {
    return false;
  }

  if (typeof props.recipientName === "string") {
    return props.recipientName.trim().length > 0;
  }

  if (Array.isArray(props.recipientName)) {
    return props.recipientName.length > 0;
  }

  return !!props.recipientName.Name;
});

function openConfirmModal() {
  errorMessage.value = "";

  successMessage.value = "";

  /*
   * Nếu có người được mời
   * thì tự động dùng tên người nhận.
   */
  if (hasRecipient.value) {
    form.name = props.recipientName.Name;
  } else {
    form.name = "";
  }
  form.attendance = "attending";
  form.numberOfPeople = 1;
  showConfirmModal.value = true;
}

/* =========================================================
   CLOSE MODAL
========================================================= */

function closeConfirmModal() {
  if (submitting.value) {
    return;
  }

  showConfirmModal.value = false;
}

/* =========================================================
   PEOPLE
========================================================= */

function increasePeople() {
  if (form.numberOfPeople < 20) {
    form.numberOfPeople++;
  }
}

function decreasePeople() {
  if (form.numberOfPeople > 1) {
    form.numberOfPeople--;
  }
}

/* =========================================================
   SUBMIT
========================================================= */

async function submitConfirmation() {
  errorMessage.value = "";

  successMessage.value = "";

  /* =========================
     VALIDATE
  ========================== */

  if (!form.name) {
    errorMessage.value = "Vui lòng nhập họ tên.";

    return;
  }

  if (!form.attendance) {
    errorMessage.value = "Vui lòng chọn xác nhận tham dự.";

    return;
  }

  /* =========================
     PAYLOAD
  ========================== */
  const slug = route.params.slug
    ? route.params.token
      ? `${route.params.slug}/${route.params.token}`
      : route.params.slug
    : "";
  const payload = {
    Slug: slug,
    RecipientToken: route.params.token || null,
    GuestName: form.name,
    Attendance:
      form.attendance === "attending" ? "Có tham dự" : "Không tham dự",
    NumberOfPeople: form.attendance === "attending" ? form.numberOfPeople : 0,
  };

  /* =========================
     REQUEST
  ========================== */

  submitting.value = true;

  try {
    Confirm(
      payload,
      (result) => {
        if (!result || result.status !== "success") {
          throw new Error(result?.message || "Không thể gửi xác nhận.");
        }
        successMessage.value =
          "Cảm ơn bạn! Xác nhận của bạn đã được gửi thành công ❤️";
        setTimeout(() => {
          showConfirmModal.value = false;
        }, 2500);
      },
      (error) => {
        errorMessage.value =
          error?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      }
    );
  } catch (error) {
    errorMessage.value = error?.message || "Đã xảy ra lỗi. Vui lòng thử lại!.";
  } finally {
    submitting.value = false;
  }
}

/* =====================================================
   NORMALIZE EVENTS
===================================================== */

const normalizedEvents = computed(() => {
  return (props.events || []).map((event, index) => {
    const item = event || {};

    return {
      ...item,

      id: item.Id || index,

      title: item.Title || "",

      time: item.EventTime || "",

      weekday: item.Weekday || "",

      day: item.Day || "",

      month: item.Month || "",

      year: item.Year || "",

      date: item.EventDate || "",

      lunar: item.Lunar || "",

      location: item.Location || "",

      address: item.Address || "",

      map: item.Map || "",

      receptionTime: item.ReceptionTime || item.Reception_time || "",

      ceremonyTime: item.CeremonyTime || item.Ceremony_time || "",

      calendarUrl: item.calendarUrl || item.calendar_url || "",

      rsvpUrl: item.rsvpUrl || item.rsvp_url || "",

      typeLabel: getTypeLabel(item.EventType),

      calendarDays: createCalendarDays(item),

      hasDate: Boolean(
        item.EventTime || item.Weekday || item.Day || item.Month || item.Year
      ),
    };
  });
});

/* =====================================================
   EVENT TYPE
===================================================== */

function getTypeLabel(type) {
  const labels = {
    vuquy: "LỄ VU QUY",

    cuoi: "LỄ CƯỚI",

    tiec: "TIỆC CƯỚI",

    thanhhon: "LỄ THÀNH HÔN",
  };

  return labels[type] || "NGÀY TRỌNG ĐẠI";
}

/* =====================================================
   CREATE CALENDAR
   LẤY HOÀN TOÀN TỪ API
===================================================== */

function createCalendarDays(event) {
  if (!event?.EventDate || !event?.Year || !event?.Month) {
    return [];
  }

  const year = Number(event.Year);
  const month = Number(event.Month);

  if (!year || !month) {
    return [];
  }

  /*
   * Ngày đầu tháng.
   *
   * 0 = CN
   * 1 = T2
   * ...
   * 6 = T7
   */

  const firstDay = new Date(year, month - 1, 1).getDay();

  /*
   * Số ngày trong tháng.
   */

  const totalDays = new Date(year, month, 0).getDate();

  const days = [];

  /*
   * Ô trống đầu tháng.
   */

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  /*
   * Ngày trong tháng.
   */

  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  return days;
}

const firstEvent = computed(() => {
  return normalizedEvents.value[0] || null;
});
</script>

<style scoped>
/* =========================================================
   ROYAL RED WEDDING EVENTS
   Không background riêng
   Không border card
   Không khung viền
========================================================= */

.events {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  color: #f5dfb0;
  font-family: "Cormorant Garamond", "Times New Roman", serif;
}

/* =========================================================
   SECTION HEADING
========================================================= */

.section-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin-bottom: 70px;
}

.heading-line {
  flex: 1;
  max-width: 120px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(198, 151, 67, 0.75),
    transparent
  );
}

.heading-content {
  position: relative;
  text-align: center;
  min-width: 260px;
}

.heading-subtitle {
  display: block;
  margin-bottom: 12px;

  color: #c99b4a;

  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.34em;
  text-transform: uppercase;
}

.heading-content h2 {
  margin: 0;

  color: #f3d58f;

  font-size: clamp(28px, 5vw, 42px);
  font-weight: 500;

  letter-spacing: 0.08em;
  line-height: 1.15;

  text-shadow: 0 1px 12px rgba(173, 25, 35, 0.25);
}

.heading-symbol {
  margin-top: 16px;

  color: #b88938;

  font-family: serif;
  font-size: 22px;

  line-height: 1;

  text-shadow: 0 0 12px rgba(211, 166, 78, 0.25);
}

/* =========================================================
   EVENT CARD
   Không border / không background
========================================================= */

.event-card {
  position: relative;

  width: 100%;
  margin-bottom: 75px;

  background: transparent;
  border: 0;
  box-shadow: none;
}

.event-card:last-child {
  margin-bottom: 0;
}

/* ẨN KHUNG CŨ */

.card-border {
  display: none;
}

/* =========================================================
   CORNER ORNAMENT
========================================================= */

.corner {
  position: absolute;

  color: rgba(190, 142, 57, 0.65);

  font-size: 13px;

  opacity: 0.75;

  pointer-events: none;
}

.corner-tl {
  top: 0;
  left: 5%;
}

.corner-tr {
  top: 0;
  right: 5%;
}

.corner-bl {
  bottom: 0;
  left: 5%;
}

.corner-br {
  bottom: 0;
  right: 5%;
}

/* =========================================================
   EVENT INNER
========================================================= */

.event-inner {
  position: relative;

  max-width: 680px;
  margin: 0 auto;
}

/* =========================================================
   EVENT TITLE
========================================================= */

.event-title-wrap {
  text-align: center;
  margin-bottom: 38px;
}

.event-kicker {
  display: block;

  margin-bottom: 10px;

  color: #a87532;

  font-family: "Montserrat", sans-serif;
  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.32em;
}

.event-title-wrap h3 {
  margin: 0;

  color: #f0cf82;

  font-size: clamp(23px, 4vw, 31px);
  font-weight: 500;

  letter-spacing: 0.07em;
  line-height: 1.3;

  text-transform: uppercase;
}

/* =========================================================
   TITLE DECORATION
========================================================= */

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 13px;

  margin-top: 18px;
}

.title-decoration span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(191, 143, 57, 0.75));
}

.title-decoration span:last-child {
  background: linear-gradient(90deg, rgba(191, 143, 57, 0.75), transparent);
}

.title-decoration b {
  color: #bd8d39;

  font-size: 18px;
  font-weight: 400;
}

/* =========================================================
   DATE BLOCK
========================================================= */

.event-date-block {
  text-align: center;

  margin: 0 auto 38px;
}

/* GIỜ */

.event-time {
  margin-bottom: 12px;

  color: #fff0c5;

  font-family: "Cormorant Garamond", serif;

  font-size: clamp(34px, 7vw, 52px);
  font-weight: 500;

  line-height: 1;

  letter-spacing: 0.04em;

  text-shadow: 0 3px 18px rgba(107, 10, 20, 0.5);
}

/* NGÀY */

.event-date {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #d5a653;

  text-transform: uppercase;
}

.weekday {
  font-family: "Montserrat", sans-serif;

  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.18em;
}

.day {
  color: #f5d88f;

  font-family: "Cormorant Garamond", serif;

  font-size: 32px;
  font-weight: 500;

  line-height: 1;
}

.month {
  font-family: "Montserrat", sans-serif;

  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.14em;
}

/* NĂM */

.event-year {
  margin-top: 8px;

  color: #b9893e;

  font-family: "Montserrat", sans-serif;

  font-size: 10px;
  font-weight: 500;

  letter-spacing: 0.32em;
}

/* ÂM LỊCH */

.event-lunar {
  margin-top: 8px;

  color: rgba(236, 210, 154, 0.62);

  font-family: "Montserrat", sans-serif;

  font-size: 9px;

  letter-spacing: 0.08em;
}

/* =========================================================
   SCHEDULE
========================================================= */

.schedule {
  display: flex;
  justify-content: center;
  align-items: stretch;

  gap: 0;

  margin: 35px auto;

  max-width: 470px;
}

.schedule-item {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

.schedule-item + .schedule-item {
  border-left: 1px solid rgba(190, 142, 57, 0.28);
}

.schedule-icon {
  margin-bottom: 7px;

  color: #c29342;

  font-size: 16px;
}

.schedule-label {
  margin-bottom: 5px;

  color: #a97b38;

  font-family: "Montserrat", sans-serif;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 0.2em;
}

.schedule-item strong {
  color: #f1d493;

  font-family: "Cormorant Garamond", serif;

  font-size: 22px;
  font-weight: 500;
}

/* =========================================================
   CALENDAR
========================================================= */

.calendar {
  width: 100%;
  max-width: 390px;

  margin: 45px auto 0;

  text-align: center;
}

/* HEADER */

.calendar-top {
  display: flex;
  flex-direction: column;
  gap: 5px;

  margin-bottom: 20px;
}

.calendar-label {
  color: #a97834;

  font-family: "Montserrat", sans-serif;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 0.28em;
}

.calendar-top strong {
  color: #e8c779;

  font-family: "Montserrat", sans-serif;

  font-size: 10px;
  font-weight: 500;

  letter-spacing: 0.15em;
}

/* WEEK DAYS */

.calendar-weekdays,
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-weekdays {
  margin-bottom: 7px;
}

.calendar-weekdays span {
  color: #a87a39;

  font-family: "Montserrat", sans-serif;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 0.05em;
}

/* DAYS */

.calendar-cell {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 38px;

  color: rgba(239, 216, 170, 0.72);

  font-family: "Montserrat", sans-serif;

  font-size: 10px;
}

.calendar-cell.empty {
  visibility: hidden;
}

.normal-day {
  opacity: 0.75;
}

/* ACTIVE DAY */

.active-day {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 31px;
  height: 31px;
}

.heart {
  position: absolute;

  color: #a91627;

  font-size: 31px;

  line-height: 1;

  filter: drop-shadow(0 2px 8px rgba(151, 17, 34, 0.4));
}

.active-number {
  position: relative;
  z-index: 2;

  color: #f9e7b1;

  font-family: "Montserrat", sans-serif;

  font-size: 9px;
  font-weight: 600;
}

/* CALENDAR LINK */

.calendar-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 20px;

  color: #c89945;

  font-family: "Montserrat", sans-serif;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 0.18em;

  text-decoration: none;

  transition: color 0.25s ease, transform 0.25s ease;
}

.calendar-link span {
  font-size: 15px;
}

.calendar-link:hover {
  color: #f1d38c;

  transform: translateY(-2px);
}

/* =========================================================
   LOCATION
========================================================= */

.location {
  margin: 48px auto 0;

  text-align: center;

  max-width: 560px;
}

.location-symbol {
  margin-bottom: 12px;

  color: #b98536;

  font-size: 18px;
}

.location-name {
  color: #eed08b;

  font-family: "Cormorant Garamond", serif;

  font-size: 22px;
  font-weight: 500;

  letter-spacing: 0.03em;
}

.location-address {
  margin-top: 7px;
  color: rgba(238, 214, 169, 0.65);
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  line-height: 1.7;
}

.map-link {
  display: inline-block;
  margin-top: 14px;
  color: #c39440;
  font-family: "Montserrat", sans-serif;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-decoration: none;
  transition: color 0.25s ease;
}

.map-link:hover {
  color: #f0d28c;
}

/* =========================================================
   RSVP BUTTON
   Không border
========================================================= */

.rsvp-button {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  width: fit-content;

  margin: 40px auto 0;

  color: #f3d797;

  font-family: "Montserrat", sans-serif;

  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.18em;

  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}

.rsvp-button span {
  font-size: 15px;
}

.rsvp-button:hover {
  color: #fff1c5;

  transform: translateY(-2px);

  box-shadow: 0 12px 30px rgba(94, 7, 18, 0.48);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.bottom-ornament {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-top: 48px;
}

.bottom-ornament span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(180, 133, 49, 0.55));
}

.bottom-ornament span:last-child {
  background: linear-gradient(90deg, rgba(180, 133, 49, 0.55), transparent);
}

.bottom-ornament b {
  color: #b98739;

  font-size: 17px;
  font-weight: 400;
}

/* =========================================================
   CONFIRM OVERLAY
========================================================= */

.confirm-overlay {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(35, 3, 8, 0.78);

  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

/* =========================================================
   MODAL
========================================================= */

.confirm-modal {
  position: relative;

  width: 100%;
  max-width: 500px;

  max-height: 90vh;

  overflow-y: auto;

  color: #ead5a5;

  background: linear-gradient(145deg, #520b15, #650d19 45%, #460812);

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.55);

  animation: royalModalIn 0.3s ease;
}

@keyframes royalModalIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* CLOSE */

.modal-close {
  position: absolute;

  top: 13px;
  right: 16px;

  width: 32px;
  height: 32px;

  border: 0;

  background: transparent;

  color: rgba(241, 212, 145, 0.65);

  font-size: 27px;

  cursor: pointer;

  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #f4d792;
}

/* =========================================================
   MODAL HEADER
========================================================= */

.modal-header {
  text-align: center;

  margin-bottom: 30px;
}

.modal-symbol {
  margin-bottom: 12px;

  color: #c69642;

  font-size: 20px;
}

.modal-header h3 {
  margin: 0;

  color: #f2d590;

  font-family: "Cormorant Garamond", serif;

  font-size: 27px;
  font-weight: 500;

  letter-spacing: 0.08em;
}

.modal-header p {
  max-width: 350px;

  margin: 12px auto 0;

  color: rgba(238, 215, 171, 0.65);

  font-family: "Montserrat", sans-serif;

  font-size: 10px;

  line-height: 1.7;
}

/* =========================================================
   RECIPIENT
========================================================= */

.recipient-box {
  margin-bottom: 25px;

  text-align: center;
}

.recipient-label {
  margin-bottom: 8px;

  color: #b98438;

  font-family: "Montserrat", sans-serif;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 0.2em;
}

.recipient-name {
  color: #f3d895;

  font-family: "Cormorant Garamond", serif;

  font-size: 26px;
}

/* =========================================================
   FORM
========================================================= */

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;

  margin-bottom: 9px;

  color: #c6974b;

  font-family: "Montserrat", sans-serif;

  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.12em;
}

.form-group input {
  width: 100%;

  box-sizing: border-box;

  padding: 12px 0;

  border: 0;
  border-bottom: 1px solid rgba(217, 172, 91, 0.35);

  outline: none;

  background: transparent;

  color: #f5dfa9;

  font-family: "Montserrat", sans-serif;

  font-size: 12px;
}

.form-group input::placeholder {
  color: rgba(236, 213, 170, 0.4);
}

.form-group input:focus {
  border-bottom-color: #d5a552;
}

/* =========================================================
   ATTENDANCE
========================================================= */

.attendance-options {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.attendance-option {
  display: flex;
  align-items: center;

  gap: 11px;

  width: 100%;

  padding: 12px 13px;

  border: 0;

  background: rgba(255, 255, 255, 0.035);

  color: rgba(240, 216, 171, 0.7);

  font-family: "Montserrat", sans-serif;

  font-size: 10px;

  text-align: left;

  cursor: pointer;

  transition: background 0.2s ease, color 0.2s ease;
}

.attendance-option:hover,
.attendance-option.selected {
  background: rgba(177, 31, 49, 0.3);

  color: #f2d48f;
}

.option-icon {
  width: 20px;

  color: #c49342;

  font-size: 15px;

  text-align: center;
}

/* =========================================================
   PEOPLE CONTROL
========================================================= */

.people-control {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 25px;
}

.people-control button {
  width: 32px;
  height: 32px;

  border: 0;

  background: rgba(255, 255, 255, 0.06);

  color: #d3a04d;

  font-size: 18px;

  cursor: pointer;

  transition: background 0.2s ease, color 0.2s ease;
}

.people-control button:hover {
  background: rgba(175, 29, 47, 0.35);

  color: #f3d58f;
}

.people-control span {
  min-width: 25px;

  color: #f4d997;

  font-family: "Cormorant Garamond", serif;

  font-size: 23px;

  text-align: center;
}

/* =========================================================
   ERROR / SUCCESS
========================================================= */

.form-error,
.form-success {
  margin: 15px 0;

  font-family: "Montserrat", sans-serif;

  font-size: 10px;

  line-height: 1.6;

  text-align: center;
}

.form-error {
  color: #ffb0b8;
}

.form-success {
  color: #e6cb83;
}

/* =========================================================
   SUBMIT
========================================================= */

.modal-submit {
  display: block;

  width: 100%;

  margin-top: 25px;

  padding: 14px 20px;

  border: 0;

  background: linear-gradient(135deg, #9a1628, #b21d32, #861321);

  color: #f6dfa1;

  font-family: "Montserrat", sans-serif;

  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.2em;

  cursor: pointer;

  box-shadow: 0 8px 25px rgba(60, 3, 11, 0.35);

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 12px 30px rgba(53, 2, 9, 0.45);
}

.modal-submit:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .events {
    padding: 50px 14px;
  }

  .section-heading {
    gap: 10px;

    margin-bottom: 50px;
  }

  .heading-line {
    max-width: 45px;
  }

  .heading-content {
    min-width: 0;
  }

  .heading-subtitle {
    font-size: 8px;

    letter-spacing: 0.22em;
  }

  .heading-content h2 {
    font-size: 27px;

    letter-spacing: 0.04em;
  }

  .event-inner {
    padding: 10px;
  }

  .event-card {
    margin-bottom: 60px;
  }

  .corner {
    font-size: 10px;
  }

  .schedule {
    max-width: 100%;
  }

  .schedule-item {
    padding: 5px 12px;
  }

  .schedule-item strong {
    font-size: 19px;
  }

  .calendar {
    max-width: 340px;
  }

  .calendar-cell {
    min-height: 34px;
  }

  .confirm-modal {
    padding: 35px 22px;
  }

  .modal-header h3 {
    font-size: 23px;
  }
}

/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 380px) {
  .heading-line {
    display: none;
  }

  .event-date {
    gap: 7px;
  }

  .day {
    font-size: 29px;
  }

  .schedule-item {
    padding: 5px 8px;
  }

  .schedule-item strong {
    font-size: 17px;
  }

  .calendar {
    max-width: 300px;
  }
}
</style>
