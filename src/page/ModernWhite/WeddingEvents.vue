<template>
  <section class="events">

    <!-- =========================================
         HEADER SECTION
    ========================================== -->

    <div class="section-heading">

      <div class="heading-line"></div>

      <div class="heading-content">

        <span class="heading-subtitle">
          TRÂN TRỌNG KÍNH MỜI
        </span>

        <h2>
          THÔNG TIN TIỆC CƯỚI
        </h2>

        <div class="heading-symbol">
          囍
        </div>

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

        <div
          v-if="event.hasDate"
          class="event-date-block"
        >

          <!-- GIỜ -->

          <div
            v-if="event.time"
            class="event-time"
          >
            {{ event.time }}
          </div>


          <!-- THỨ + NGÀY + THÁNG -->

          <div class="event-date">

            <span
              v-if="event.weekday"
              class="weekday"
            >
              {{ event.weekday }}
            </span>

            <strong
              v-if="event.day"
              class="day"
            >
              {{ event.day }}
            </strong>

            <span
              v-if="event.month"
              class="month"
            >
              THÁNG {{ event.month }}
            </span>

          </div>


          <!-- NĂM -->

          <div
            v-if="event.year"
            class="event-year"
          >
            {{ event.year }}
          </div>

          <!-- ÂM LỊCH -->

          <div
            v-if="event.lunar"
            class="event-lunar"
          >
            {{ event.lunar }}
          </div>

        </div>


        <!-- =====================================
             RECEPTION / CEREMONY
        ====================================== -->

        <div
          v-if="event.receptionTime || event.ceremonyTime"
          class="schedule"
        >

          <div
            v-if="event.receptionTime"
            class="schedule-item"
          >

            <span class="schedule-icon">
              ♡
            </span>

            <span class="schedule-label">
              ĐÓN KHÁCH
            </span>

            <strong>
              {{ event.receptionTime }}
            </strong>

          </div>


          <div
            v-if="event.ceremonyTime"
            class="schedule-item"
          >

            <span class="schedule-icon">
              ✦
            </span>

            <span class="schedule-label">
              KHAI TIỆC
            </span>

            <strong>
              {{ event.ceremonyTime }}
            </strong>

          </div>

        </div>


        <!-- =====================================
             CALENDAR
        ====================================== -->

        <div
          v-if="event.date"
          class="calendar"
        >

          <div class="calendar-top">

            <span class="calendar-label">
              LỊCH
            </span>

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
                active: day === Number(event.day),
              }"
            >

              <template v-if="day">

                <div
                  v-if="day === Number(event.day)"
                  class="active-day"
                >

                  <span class="heart">
                    ♥
                  </span>

                  <span class="active-number">
                    {{ day }}
                  </span>

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


          <!-- ADD TO CALENDAR -->

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="calendar-link"
          >
            <span>＋</span>
            THÊM VÀO LỊCH
          </a>

        </div>


        <!-- =====================================
             LOCATION
        ====================================== -->

        <div
          v-if="event.location || event.address"
          class="location"
        >

          <div class="location-symbol">
            ◈
          </div>

          <div
            v-if="event.location"
            class="location-name"
          >
            {{ event.location }}
          </div>

          <div
            v-if="event.address"
            class="location-address"
          >
            {{ event.address }}
          </div>

          <a
            v-if="event.map"
            :href="event.map"
            target="_blank"
            rel="noopener noreferrer"
            class="map-link"
          >
            XEM VỊ TRÍ TRÊN BẢN ĐỒ
          </a>

        </div>


        <!-- =====================================
             RSVP
        ====================================== -->

        <button
          type="button"
          class="rsvp-button"
          @click="openConfirmModal"
        >
          <span>♡</span>
          XÁC NHẬN THAM DỰ
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
                {{ recipientDisplayName }}
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
   RECIPIENT
   recipientName có thể là Array (store),
   Object hoặc String.
========================================================= */

const recipientDisplayName = computed(() => {
  const value = props.recipientName;

  if (Array.isArray(value)) {
    return value[0]?.Name || "";
  }

  if (value && typeof value === "object") {
    return value.Name || "";
  }

  return typeof value === "string" ? value : "";
});

const hasRecipient = computed(() => {
  return Boolean(recipientDisplayName.value);
});

/* =========================================================
   FORM
========================================================= */

const form = reactive({
  name: "",
  attendance: "attending",
  numberOfPeople: 1,

});

function openConfirmModal() {
  errorMessage.value = "";

  successMessage.value = "";

  /*
   * Nếu có người được mời
   * thì tự động dùng tên người nhận.
   */
  if (hasRecipient.value) {
    form.name = recipientDisplayName.value;
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
  const slug = route.params.token
    ? `${route.params.slug}/${route.params.token}`
    : route.params.slug || "";

  const payload = {
    Slug: slug,
    RecipientToken: route.params.token || null,
    GuestName: form.name,
    Attendance: form.attendance === "attending" ? "Có tham dự" : "Không tham dự",
    NumberOfPeople: form.attendance === "attending" ? form.numberOfPeople : 0
  };

  /* =========================
     REQUEST
  ========================== */

  submitting.value = true;

  try {
    Confirm(payload, (result) =>{
      if (!result || result.status !== "success") {
        throw new Error(result?.message || "Không thể gửi xác nhận.");
      }
      successMessage.value = "Cảm ơn bạn! Xác nhận của bạn đã được gửi thành công ❤️";
      setTimeout(() => {
        showConfirmModal.value = false;
      }, 2500);
    },(error) =>{
      errorMessage.value = error?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
    })



  } catch (error) {
    errorMessage.value = error?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
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

      id:
        item.Id ||
        index,

      title:
        item.Title ||
        "",

      time:
        item.EventTime ||
        "",

      weekday:
        item.Weekday ||
        "",

      day:
        item.Day ||
        "",

      month:
        item.Month ||
        "",

      year:
        item.Year ||
        "",

      date:
        item.EventDate ||
        "",

      lunar:
        item.Lunar ||
        "",

      location:
        item.Location ||
        "",

      address:
        item.Address ||
        "",

      map:
        item.Map ||
        "",

      receptionTime:
        item.ReceptionTime ||
        item.Reception_time ||
        "",

      ceremonyTime:
        item.CeremonyTime ||
        item.Ceremony_time ||
        "",

      calendarUrl:
        item.calendarUrl ||
        item.calendar_url ||
        "",

      rsvpUrl:
        item.rsvpUrl ||
        item.rsvp_url ||
        "",

      typeLabel:
        getTypeLabel(item.EventType),

      calendarDays:
        createCalendarDays(item),

      hasDate:
        Boolean(
          item.EventTime ||
          item.Weekday ||
          item.Day ||
          item.Month ||
          item.Year
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

  if (
    !event?.EventDate ||
    !event?.Year ||
    !event?.Month
  ) {
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

  const firstDay = new Date(
    year,
    month - 1,
    1
  ).getDay();


  /*
   * Số ngày trong tháng.
   */

  const totalDays = new Date(
    year,
    month,
    0
  ).getDate();


  const days = [];


  /*
   * Ô trống đầu tháng.
   */

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    days.push(null);
  }


  /*
   * Ngày trong tháng.
   */

  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {
    days.push(day);
  }


  return days;
}


const firstEvent = computed(() => {

  return normalizedEvents.value[0] || null;

});
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.events {
  --red: #7f151a;
  --red-dark: #681014;
  --red-soft: #a52b2f;

  --gold: #ad8240;
  --gold-light: #c8a66a;

  --text: #554b43;
  --text-soft: #75685c;

  position: relative;
  width: 100%;

  padding: 12px 8px 20px;

  color: var(--text);

  text-align: center;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  box-sizing: border-box;
}


/* =====================================================
   MAIN HEADING
===================================================== */

.section-heading {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-bottom: 28px;
}

.heading-content {
  flex-shrink: 0;
}

.heading-line {
  width: 42px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      var(--gold)
    );
}

.heading-line:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      var(--gold)
    );
}

.heading-subtitle {
  display: block;

  margin-bottom: 6px;

  color: #a07839;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 2.5px;
}

.section-heading h2 {
  margin: 0;

  color: var(--red);

  font-size: 22px;
  font-weight: 800;

  letter-spacing: 1.2px;

  line-height: 1.25;
}

.heading-symbol {
  margin-top: 7px;

  color: #9b171c;

  font-family:
    "Times New Roman",
    serif;

  font-size: 26px;
  font-weight: 700;

  line-height: 1;
}


/* =====================================================
   EVENT CARD
===================================================== */

.event-card {
  position: relative;

  width: 100%;
  max-width: 430px;

  margin:
    0
    auto
    28px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 251, 243, .98),
      rgba(250, 242, 225, .96)
    );

  border:
    1px solid
    rgba(166, 122, 54, .42);

  box-shadow:
    0 12px 30px
    rgba(92, 43, 21, .08);

  box-sizing: border-box;
}


/*
 * Viền kép bên trong
 */

.event-card::before {
  content: "";

  position: absolute;

  inset: 6px;

  border:
    1px solid
    rgba(174, 132, 65, .25);

  pointer-events: none;

  z-index: 1;
}


/*
 * Viền trang trí chính
 */

.card-border {
  position: absolute;

  inset: 12px;

  z-index: 2;

  border:
    1px solid
    rgba(169, 123, 54, .38);

  pointer-events: none;
}


/* =====================================================
   CORNERS
===================================================== */

.corner {
  position: absolute;

  z-index: 5;

  width: 25px;
  height: 25px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #a87c39;

  background:
    linear-gradient(
      135deg,
      #fffaf0,
      #f7ecd6
    );

  border:
    1px solid
    rgba(169, 123, 54, .35);

  font-size: 9px;

  line-height: 1;
}

.corner-tl {
  top: 1px;
  left: 1px;
}

.corner-tr {
  top: 1px;
  right: 1px;
}

.corner-bl {
  bottom: 1px;
  left: 1px;
}

.corner-br {
  right: 1px;
  bottom: 1px;
}


/* =====================================================
   CONTENT
===================================================== */

.event-inner {
  position: relative;

  z-index: 3;

  display: flex;

  flex-direction: column;

  align-items: center;

  padding:
    31px
    25px
    27px;
}


/* =====================================================
   EVENT TITLE
===================================================== */

.event-title-wrap {
  margin-bottom: 24px;
}

.event-kicker {
  display: block;

  margin-bottom: 7px;

  color: #a37b3e;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 2px;
}

.event-title-wrap h3 {
  margin: 0;

  color: var(--red);

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 22px;
  font-weight: 700;

  letter-spacing: .8px;

  line-height: 1.3;
}

.Title-decoration {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 10px;
}

.Title-decoration span {
  width: 35px;
  height: 1px;

  background: var(--gold-light);
}

.Title-decoration b {
  color: #98161b;

  font-family:
    "Times New Roman",
    serif;

  font-size: 16px;
}


/* =====================================================
   DATE BLOCK
===================================================== */

.event-date-block {
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
}


/* =====================================================
   TIME
===================================================== */

.event-time {
  margin-bottom: 14px;

  color: var(--red-dark);

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 27px;
  font-weight: 700;

  letter-spacing: 1.5px;

  line-height: 1;
}


/* =====================================================
   DATE
===================================================== */

.event-date {
  display: flex;

  align-items: baseline;
  justify-content: center;

  gap: 9px;

  width: 100%;
}

.weekday {
  color: #6d5b49;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: .8px;
}


/*
 * Ngày nổi bật
 */

.day {
  color: #97161b;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: clamp(40px, 11vw, 58px);
  font-weight: 900;

  line-height: .8;

  letter-spacing: -2px;
}

.month {
  color: #6d5741;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 1px;
}


/* =====================================================
   YEAR
===================================================== */

.event-year {
  margin-top: 11px;

  color: #80623e;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 15px;
  font-weight: 700;

  letter-spacing: 4px;
}


/* =====================================================
   LUNAR
===================================================== */

.event-lunar {
  margin-top: 7px;

  color: #927657;

  font-size: 10px;
  font-weight: 500;

  letter-spacing: .8px;
}


/* =====================================================
   SCHEDULE
===================================================== */

.schedule {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  width: 100%;
  max-width: 310px;

  margin-top: 27px;

  overflow: hidden;

  background:
    rgba(255, 255, 255, .45);

  border:
    1px solid
    rgba(170, 126, 58, .3);

  border-radius: 2px;
}

.schedule-item {
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  min-height: 78px;

  padding:
    11px
    6px;
}

.schedule-item + .schedule-item {
  border-left:
    1px solid
    rgba(170, 126, 58, .3);
}

.schedule-icon {
  margin-bottom: 5px;

  color: #ad8142;

  font-size: 14px;
}

.schedule-label {
  margin-bottom: 7px;

  color: #98723d;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 1.2px;
}

.schedule-item strong {
  color: var(--red);

  font-size: 18px;
  font-weight: 700;

  letter-spacing: .4px;
}


/* =====================================================
   CALENDAR
===================================================== */

.calendar {
  width: 100%;
  max-width: 300px;

  margin-top: 28px;

  padding:
    17px
    14px
    15px;

  background:
    rgba(255, 255, 255, .55);

  border:
    1px solid
    rgba(169, 124, 55, .32);

  box-shadow:
    inset 0 0 0 3px
    rgba(187, 145, 77, .055);

  box-sizing: border-box;
}


/* =====================================================
   CALENDAR HEADER
===================================================== */

.calendar-top {
  display: flex;

  flex-direction: column;

  align-items: center;

  margin-bottom: 12px;
}

.calendar-label {
  margin-bottom: 4px;

  color: #a07839;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 2px;
}

.calendar-top strong {
  color: var(--red);

  font-size: 15px;
  font-weight: 700;

  letter-spacing: 1px;
}


/* =====================================================
   WEEKDAYS
===================================================== */

.calendar-weekdays {
  display: grid;

  grid-template-columns:
    repeat(7, 1fr);

  padding:
    7px
    0;

  border-top:
    1px solid
    rgba(169, 124, 55, .22);

  border-bottom:
    1px solid
    rgba(169, 124, 55, .22);
}

.calendar-weekdays span {
  color: #725c43;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: .3px;
}


/* =====================================================
   CALENDAR DAYS
===================================================== */

.calendar-days {
  display: grid;

  grid-template-columns:
    repeat(7, 1fr);

  row-gap: 5px;

  padding-top: 9px;
}

.calendar-cell {
  display: flex;

  align-items: center;
  justify-content: center;

  height: 34px;
}

.calendar-cell.empty {
  pointer-events: none;
}


/* =====================================================
   NORMAL DAY
===================================================== */

.normal-day {
  color: #4e4740;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 12px;
  font-weight: 600;

  line-height: 1;
}


/* =====================================================
   ACTIVE DAY
===================================================== */

.active-day {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;
}


/*
 * Tim đỏ lớn
 */

.heart {
  position: absolute;

  top: 50%;
  left: 50%;

  color: #78070b;

  font-size: 45px;
  font-weight: 900;

  line-height: 1;

  transform:
    translate(-50%, -50%);

  text-shadow:
    0 2px 5px
    rgba(90, 0, 0, .15);
}


/*
 * Số ngày nằm giữa tim
 */

.active-number {
  position: relative;

  z-index: 2;

  color: #fff;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

  font-size: 13px;
  font-weight: 800;

  line-height: 1;

  text-shadow:
    0 1px 2px
    rgba(50, 0, 0, .35);
}


/* =====================================================
   ADD TO CALENDAR
===================================================== */

.calendar-link {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 4px;

  margin-top: 15px;

  color: #89651f;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 1.3px;

  text-decoration: none;

  border-bottom:
    1px solid
    rgba(137, 101, 31, .4);

  padding-bottom: 3px;
}

.calendar-link span {
  font-size: 12px;
}


/* =====================================================
   LOCATION
===================================================== */

.location {
  width: 100%;

  margin-top: 27px;

  padding-top: 20px;

  border-top:
    1px solid
    rgba(169, 124, 55, .23);
}

.location-symbol {
  margin-bottom: 7px;

  color: #a77c3d;

  font-size: 15px;
}

.location-name {
  color: var(--red);

  font-size: 14px;
  font-weight: 700;

  letter-spacing: .2px;
}

.location-address {
  max-width: 310px;

  margin:
    6px
    auto
    0;

  color: #685b4f;

  font-size: 11px;
  font-weight: 500;

  line-height: 1.65;
}

.map-link {
  display: inline-block;

  margin-top: 11px;

  color: #89651f;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 1.2px;

  text-decoration: none;

  border-bottom:
    1px solid
    rgba(137, 101, 31, .4);

  padding-bottom: 3px;
}


/* =====================================================
   RSVP
===================================================== */

.rsvp-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  min-width: 205px;
  min-height: 44px;

  margin-top: 23px;

  padding:
    10px
    22px;

  color: #fffaf0;

  background:
    linear-gradient(
      135deg,
      #94171c,
      #741014
    );

  border:
    1px solid
    #a42a2e;

  box-shadow:
    0 6px 16px
    rgba(117, 17, 22, .15);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 1.3px;

  text-decoration: none;

  font-family: inherit;

  cursor: pointer;

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.rsvp-button span {
  font-size: 14px;
}

.rsvp-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 9px 20px
    rgba(117, 17, 22, .2);
}


/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.bottom-ornament {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  width: 100%;

  margin-top: 27px;
}

.bottom-ornament span {
  width: 38px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b68b49
    );
}

.bottom-ornament span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b68b49
    );
}

.bottom-ornament b {
  color: #981519;

  font-family:
    "Times New Roman",
    serif;

  font-size: 17px;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {

  .events {
    padding:
      10px
      4px
      18px;
  }

  .section-heading {
    gap: 7px;
  }

  .heading-line {
    width: 28px;
  }

  .heading-subtitle {
    font-size: 9px;
    letter-spacing: 2px;
  }

  .section-heading h2 {
    font-size: 19px;
  }

  .event-card {
    width: 100%;
  }

  .event-inner {
    padding:
      30px
      17px
      25px;
  }

  .event-kicker {
    font-size: 9px;
  }

  .event-title-wrap h3 {
    font-size: 20px;
  }

  .event-time {
    font-size: 25px;
  }

  .weekday {
    font-size: 10px;
  }

  .day {
    font-size: 52px;
  }

  .month {
    font-size: 11px;
  }

  .event-year {
    font-size: 14px;
    letter-spacing: 3px;
  }

  .schedule-item {
    min-height: 74px;
  }

  .schedule-label {
    font-size: 8px;
  }

  .schedule-item strong {
    font-size: 17px;
  }

  .calendar {
    max-width: 292px;
  }

  .calendar-top strong {
    font-size: 14px;
  }

  .calendar-weekdays span {
    font-size: 8px;
  }

  .normal-day {
    font-size: 11px;
  }

  .active-day {
    width: 45px;
    height: 45px;
  }

  .heart {
    font-size: 43px;
  }

  .active-number {
    font-size: 12px;
  }

  .location-name {
    font-size: 13px;
  }

  .location-address {
    font-size: 11px;
  }

  .rsvp-button {
    min-width: 190px;
    min-height: 42px;

    font-size: 9px;
  }
}
/* =========================================================
   CONFIRM MODAL
   ĐỘC LẬP HOÀN TOÀN VỚI CSS CHUNG
========================================================= */

.confirm-overlay {
  position: fixed;
  inset: 0;

  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;

  /*
     * Overlay tối, không dùng màu theme
     */
  background: rgba(0, 0, 0, 0.62);

  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

/* =========================================================
   MODAL
========================================================= */

.confirm-modal {
  position: relative;

  width: 100%;
  max-width: 460px;

  max-height: calc(100vh - 32px);

  overflow-y: auto;

  padding: 0;

  /*
     * QUAN TRỌNG:
     * ÉP BACKGROUND RIÊNG CHO MODAL
     *
     * Không dùng:
     * var(--p-background)
     * var(--p-primary)
     * background chung
     */

  background: #fffaf4 !important;

  color: #4f4039 !important;

  border: 1px solid #e6d5b8;

  border-radius: 24px;

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.32);

  /*
     * Không cho background của body / section
     * ảnh hưởng vào modal
     */

  isolation: isolate;

  font-family: var(--font-main), "Cormorant Garamond", serif;
}

/* =========================================================
   SCROLLBAR
========================================================= */

.confirm-modal::-webkit-scrollbar {
  width: 5px;
}

.confirm-modal::-webkit-scrollbar-track {
  background: transparent;
}

.confirm-modal::-webkit-scrollbar-thumb {
  background: #d8b46d;
  border-radius: 20px;
}

/* =========================================================
   CLOSE
========================================================= */

.modal-close {
  position: absolute;

  top: 14px;
  right: 15px;

  z-index: 10;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;
  border-radius: 50%;

  background: #f3eadb !important;

  color: #6b5146 !important;

  font-family: Arial, sans-serif;

  font-size: 23px;
  font-weight: 400;

  line-height: 1;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.modal-close:hover {
  background: #7b0d0d !important;

  color: #fffaf4 !important;

  transform: rotate(90deg);
}

/* =========================================================
   HEADER
========================================================= */

.modal-header {
  padding: 32px 28px 22px;

  text-align: center;

  /*
     * Header có màu riêng
     */
  background: linear-gradient(180deg, #f8eee0 0%, #fffaf4 100%);

  border-bottom: 1px solid #eadcc7;
}

/* =========================================================
   SYMBOL
========================================================= */

.modal-symbol {
  margin-bottom: 8px;

  color: #a97931 !important;

  font-size: 23px;

  line-height: 1;
}

/* =========================================================
   TITLE
========================================================= */

.modal-header h3 {
  margin: 0;

  color: #7b0d0d !important;

  font-family: var(--font-heading), "Cormorant Garamond", serif;

  font-size: 25px;

  font-weight: 700;

  line-height: 1.2;

  letter-spacing: 0.06em;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.modal-header p {
  max-width: 330px;

  margin: 10px auto 0;

  color: #76655c !important;

  font-family: var(--font-main), "Cormorant Garamond", serif;

  font-size: 14px;

  line-height: 1.6;
}

/* =========================================================
   RECIPIENT
========================================================= */

.recipient-box {
  margin: 22px 28px 20px;

  padding: 15px 18px;

  text-align: center;

  background: #f8f1e6 !important;

  border: 1px solid #ddc79f;

  border-radius: 14px;
}

.recipient-label {
  margin-bottom: 5px;

  color: #a97931 !important;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.12em;
}

.recipient-name {
  color: #7b0d0d !important;

  font-family: var(--font-heading), "Cormorant Garamond", serif;

  font-size: 18px;

  font-weight: 700;
}

/* =========================================================
   FORM
========================================================= */

.form-group {
  margin: 18px 28px;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  color: #5c4d46 !important;

  font-size: 14px;

  font-weight: 700;
}

/* =========================================================
   INPUT
========================================================= */

.form-group input {
  width: 100%;

  min-height: 46px;

  padding: 11px 14px;

  border: 1px solid #d9cbb8 !important;

  border-radius: 12px;

  outline: none;

  background: #ffffff !important;

  color: #4f4039 !important;

  font-family: var(--font-main), "Cormorant Garamond", serif;

  font-size: 14px;

  box-sizing: border-box;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: #9a8b80 !important;
}

.form-group input:focus {
  border-color: #a97931 !important;

  box-shadow: 0 0 0 3px rgba(169, 121, 49, 0.1);
}

/* =========================================================
   ATTENDANCE OPTIONS
========================================================= */

.attendance-options {
  display: flex;

  flex-direction: column;

  gap: 9px;
}

.attendance-option {
  width: 100%;

  min-height: 48px;

  display: flex;

  align-items: center;

  gap: 11px;

  padding: 10px 13px;

  border: 1px solid #ded1bf !important;

  border-radius: 12px;

  background: #ffffff !important;

  color: #5c4d46 !important;

  font-family: var(--font-main), "Cormorant Garamond", serif;

  font-size: 14px;

  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.attendance-option:hover {
  border-color: #b89455 !important;

  background: #fffaf4 !important;
}

.attendance-option.selected {
  border-color: #7b0d0d !important;

  background: #fbf1ec !important;

  color: #7b0d0d !important;
}

/* =========================================================
   OPTION ICON
========================================================= */

.option-icon {
  width: 29px;
  height: 29px;

  flex: 0 0 29px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #f1e4cc !important;

  color: #7b0d0d !important;

  font-family: Arial, sans-serif;

  font-size: 14px;

  font-weight: 700;
}

.attendance-option.selected .option-icon {
  background: #7b0d0d !important;

  color: #fffaf4 !important;
}

/* =========================================================
   NUMBER OF PEOPLE
========================================================= */

.people-control {
  width: 135px;
  height: 44px;

  display: flex;

  align-items: center;

  margin: 0 auto;

  overflow: hidden;

  border: 1px solid #d9cbb8;

  border-radius: 12px;

  background: #ffffff !important;
}

.people-control button {
  width: 43px;
  height: 100%;

  padding: 0;

  border: none;

  background: transparent !important;

  color: #7b0d0d !important;

  font-size: 20px;

  cursor: pointer;
}

.people-control button:hover {
  background: #f8eee0 !important;
}

.people-control span {
  flex: 1;

  text-align: center;

  color: #4f4039 !important;

  font-family: var(--font-heading), "Cormorant Garamond", serif;

  font-size: 18px;

  font-weight: 700;
}

/* =========================================================
   ERROR
========================================================= */

.form-error {
  margin: 0 28px 15px;

  padding: 10px 13px;

  border-radius: 10px;

  background: #fbe9e7 !important;

  color: #b3261e !important;

  font-size: 13px;

  line-height: 1.5;
}

/* =========================================================
   SUCCESS
========================================================= */

.form-success {
  margin: 0 28px 15px;

  padding: 10px 13px;

  border-radius: 10px;

  background: #edf6ed !important;

  color: #36743a !important;

  font-size: 13px;

  line-height: 1.5;
}

/* =========================================================
   SUBMIT
========================================================= */

.modal-submit {
  width: calc(100% - 56px);

  min-height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin: 6px 28px 28px;

  padding: 10px 20px;

  border: 1px solid #7b0d0d !important;

  border-radius: 13px;

  background: linear-gradient(135deg, #7b0d0d, #620909) !important;

  color: #fffaf4 !important;

  font-family: var(--font-main), "Cormorant Garamond", serif;

  font-size: 14px;

  font-weight: 700;

  letter-spacing: 0.08em;

  cursor: pointer;

  box-shadow: 0 7px 18px rgba(123, 13, 13, 0.18);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.modal-submit:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow: 0 10px 24px rgba(123, 13, 13, 0.25);
}

.modal-submit:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .confirm-overlay {
    padding: 12px;
  }

  .confirm-modal {
    max-height: calc(100vh - 24px);

    border-radius: 20px;
  }

  .modal-header {
    padding: 28px 20px 20px;
  }

  .modal-header h3 {
    font-size: 21px;
  }

  .recipient-box {
    margin: 18px 20px;
    padding: 13px 15px;
  }

  .form-group {
    margin: 16px 20px;
  }

  .modal-submit {
    width: calc(100% - 40px);

    margin: 5px 20px 22px;
  }

  .form-error,
  .form-success {
    margin-left: 20px;
    margin-right: 20px;
  }
}

/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 359px) {
  .confirm-overlay {
    padding: 8px;
  }

  .confirm-modal {
    border-radius: 18px;
  }

  .modal-header {
    padding: 24px 16px 18px;
  }

  .form-group {
    margin: 14px 16px;
  }

  .modal-submit {
    width: calc(100% - 32px);

    margin: 5px 16px 18px;
  }
}
</style>


