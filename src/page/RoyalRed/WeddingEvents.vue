<template>
  <section class="rr-events">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="rr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         TỪNG SỰ KIỆN
    ====================================================== -->

    <div
      v-for="(event, index) in normalizedEvents"
      :key="event.id || index"
      class="rr-events__item"
    >

      <!-- ===============================================
           LỜI DẪN
      ================================================ -->

      <h3 class="rr-events__lead">
        {{ event.typeLabel }}
      </h3>


      <!-- ===============================================
           GIỜ
      ================================================ -->

      <p v-if="event.time" class="rr-events__time">
        {{ event.time }}
      </p>


      <!-- ===============================================
           THỨ / NGÀY / THÁNG
      ================================================ -->

      <div v-if="event.hasDate" class="rr-events__date">

        <span v-if="event.weekday" class="rr-events__weekday">
          {{ event.weekday }}
        </span>

        <span class="rr-events__sep" aria-hidden="true">/</span>

        <span v-if="event.day" class="rr-events__day">
          {{ event.day }}
        </span>

        <span class="rr-events__sep" aria-hidden="true">/</span>

        <span v-if="event.month" class="rr-events__month">
          THÁNG {{ event.month }}
        </span>

      </div>


      <!-- ===============================================
           NĂM + ÂM LỊCH
      ================================================ -->

      <p v-if="event.year" class="rr-events__year">
        {{ event.year }}
      </p>

      <p v-if="event.lunar" class="rr-events__lunar">
        {{ event.lunar }}
      </p>


      <!-- ===============================================
           ĐÓN KHÁCH / KHAI TIỆC
      ================================================ -->

      <div
        v-if="event.receptionTime || event.ceremonyTime"
        class="rr-events__schedule"
      >

        <div v-if="event.receptionTime" class="rr-events__schedule-item">
          <span class="rr-events__schedule-label">
            {{ receptionLabel }}
          </span>

          <strong class="rr-events__schedule-time">
            {{ event.receptionTime }}
          </strong>
        </div>

        <div v-if="event.ceremonyTime" class="rr-events__schedule-item">
          <span class="rr-events__schedule-label">
            {{ ceremonyLabel }}
          </span>

          <strong class="rr-events__schedule-time">
            {{ event.ceremonyTime }}
          </strong>
        </div>

      </div>


      <!-- ===============================================
           LỊCH THÁNG
      ================================================ -->

      <div v-if="event.date" class="rr-events__calendar">

        <div class="rr-events__calendar-head">
          Tháng {{ event.month }} / {{ event.year }}
        </div>

        <div class="rr-events__calendar-week">
          <span v-for="label in WEEKDAYS" :key="label">
            {{ label }}
          </span>
        </div>

        <div class="rr-events__calendar-days">

          <div
            v-for="(day, dayIndex) in event.calendarDays"
            :key="dayIndex"
            class="rr-events__calendar-cell"
          >
            <template v-if="day">
              <span
                v-if="day === Number(event.day)"
                class="rr-events__calendar-active"
              >
                <svg
                  class="rr-events__heart"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12 21s-7.5-4.6-9.6-9A5.6 5.6 0 0 1 12 5.6 5.6 5.6 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z"
                  />
                </svg>

                <span class="rr-events__calendar-number is-active">
                  {{ day }}
                </span>
              </span>

              <span v-else class="rr-events__calendar-number">
                {{ day }}
              </span>
            </template>
          </div>

        </div>

        <a
          :href="event.calendarUrl || defaultCalendarUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="rr-link rr-events__calendar-link"
        >
          {{ calendarLabel }}
        </a>

      </div>


      <!-- ===============================================
           XÁC NHẬN THAM DỰ
      ================================================ -->

      <button
        type="button"
        class="rr-pill rr-events__rsvp"
        @click="openConfirmModal"
      >
        {{ rsvpLabel }}
      </button>

    </div>


    <!-- =====================================================
         MODAL XÁC NHẬN
    ====================================================== -->

    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="rr-confirm"
        @click.self="closeConfirmModal"
      >
        <div class="rr-confirm__box">

          <button
            type="button"
            class="rr-confirm__close"
            aria-label="Đóng"
            @click="closeConfirmModal"
          >
            ×
          </button>

          <div class="rr-confirm__head">
            <h3>{{ rsvpLabel }}</h3>

            <p>
              Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.
            </p>
          </div>

          <div class="rr-confirm__body">

            <!-- CÓ NGƯỜI ĐƯỢC MỜI -->

            <div v-if="hasRecipient" class="rr-confirm__recipient">
              <span class="rr-confirm__recipient-label">
                {{ inviteLabel }}
              </span>

              <strong class="rr-confirm__recipient-name">
                {{ recipientDisplay }}
              </strong>
            </div>

            <!-- KHÔNG CÓ NGƯỜI ĐƯỢC MỜI -->

            <div v-else class="rr-confirm__field">
              <label>Họ và tên</label>

              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Nhập tên của bạn"
                maxlength="100"
              />
            </div>


            <!-- THAM DỰ -->

            <div class="rr-confirm__field">
              <label>Bạn có tham dự không?</label>

              <div class="rr-confirm__options">

                <button
                  type="button"
                  class="rr-confirm__option"
                  :class="{ 'is-selected': form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="rr-confirm__option"
                  :class="{
                    'is-selected': form.attendance === 'not_attending',
                  }"
                  @click="form.attendance = 'not_attending'"
                >
                  Rất tiếc, tôi không thể tham dự
                </button>

              </div>
            </div>


            <!-- SỐ NGƯỜI -->

            <div
              v-if="form.attendance === 'attending'"
              class="rr-confirm__field"
            >
              <label>Số người tham dự</label>

              <div class="rr-confirm__people">
                <button type="button" @click="decreasePeople">−</button>

                <span>{{ form.numberOfPeople }}</span>

                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>


            <p v-if="errorMessage" class="rr-confirm__error">
              {{ errorMessage }}
            </p>

            <p v-if="successMessage" class="rr-confirm__success">
              {{ successMessage }}
            </p>


            <button
              type="button"
              class="rr-pill rr-confirm__submit"
              :disabled="submitting"
              @click="submitConfirmation"
            >
              {{ submitting ? "ĐANG GỬI..." : submitLabel }}
            </button>

          </div>

        </div>
      </div>
    </Teleport>

  </section>
</template>


<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { Confirm } from "@/model/api";
import { sectionText } from "@/data/sectionTitles";


/* =========================================================
   PROPS
========================================================= */

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },

  recipientName: {
    type: [Object, Array, String],
    default: null,
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


const route = useRoute();


/* =========================================================
   TIÊU ĐỀ MỤC
========================================================= */

const heading = computed(() =>
  sectionText(props.sections, "events", "Heading", "Thông tin tiệc cưới")
);

const inviteLabel = computed(() =>
  sectionText(props.sections, "events", "Eyebrow", "Trân trọng kính mời")
);

const rsvpLabel = "XÁC NHẬN THAM DỰ";

const submitLabel = "GỬI XÁC NHẬN";

const calendarLabel = "Thêm vào lịch";

const receptionLabel = "Đón khách";

const ceremonyLabel = "Khai tiệc";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];


/* =========================================================
   STATE
========================================================= */

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


/* =========================================================
   NGƯỜI ĐƯỢC MỜI
========================================================= */

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

const recipientDisplay = computed(() => {
  const value = props.recipientName;

  if (Array.isArray(value)) {
    return value[0]?.Name || "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value?.Name || "";
});


/* =========================================================
   MỞ / ĐÓNG MODAL
========================================================= */

function openConfirmModal() {
  errorMessage.value = "";

  successMessage.value = "";

  /*
   * Nếu có người được mời
   * thì tự động dùng tên người nhận.
   */
  form.name = hasRecipient.value ? recipientDisplay.value : "";

  form.attendance = "attending";

  form.numberOfPeople = 1;

  showConfirmModal.value = true;
}

function closeConfirmModal() {
  if (submitting.value) {
    return;
  }

  showConfirmModal.value = false;
}


/* =========================================================
   SỐ NGƯỜI
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
   GỬI XÁC NHẬN
========================================================= */

async function submitConfirmation() {
  errorMessage.value = "";

  successMessage.value = "";

  if (!form.name) {
    errorMessage.value = "Vui lòng nhập họ tên.";

    return;
  }

  if (!form.attendance) {
    errorMessage.value = "Vui lòng chọn xác nhận tham dự.";

    return;
  }

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
    errorMessage.value =
      error?.message || "Đã xảy ra lỗi. Vui lòng thử lại!.";
  } finally {
    submitting.value = false;
  }
}


/* =====================================================
   CHUẨN HOÁ SỰ KIỆN
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
   LOẠI SỰ KIỆN
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
   LỊCH THÁNG
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
   *
   * Lưới bắt đầu từ thứ Hai nên CN (0) lùi về cuối.
   */
  const offset = (firstDay + 6) % 7;

  for (let i = 0; i < offset; i++) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  return days;
}


/* =====================================================
   LINK LỊCH MẶC ĐỊNH
===================================================== */

const defaultCalendarUrl = computed(() => {
  const event = normalizedEvents.value[0];

  if (!event?.date) {
    return "https://calendar.google.com/calendar/render?action=TEMPLATE";
  }

  const start = event.date.replace(/-/g, "");

  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&dates=${start}/${start}`
  );
});
</script>


<style scoped>
/* =========================================================
   SECTION
========================================================= */

.rr-events {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 40px;

  width: 100%;

  padding: 0 24px;

  color: var(--rr-red);

  text-align: center;
}

.rr-events__item {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  width: 100%;
}


/* =========================================================
   LỜI DẪN + GIỜ
========================================================= */

.rr-events__lead {
  margin: 0;

  font-family: var(--rr-font-body);
  font-size: 18px;
  font-weight: 400;

  line-height: 1.4;

  text-transform: uppercase;
}

.rr-events__time {
  margin: 0;

  font-size: 18px;
  font-weight: 600;

  line-height: 1.4;
}


/* =========================================================
   NGÀY
========================================================= */

.rr-events__date {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;
}

.rr-events__weekday,
.rr-events__month {
  font-size: 18px;
  font-weight: 600;

  line-height: 1.4;

  text-transform: uppercase;
}

.rr-events__sep {
  font-size: 14px;

  opacity: 0.5;
}

.rr-events__day {
  font-size: 30px;
  font-weight: 600;

  line-height: 1.1;
}

.rr-events__year {
  margin: 0;

  font-size: 20px;

  line-height: 1.3;
}

.rr-events__lunar {
  margin: 0;

  font-size: 13px;

  line-height: 1.5;
}


/* =========================================================
   ĐÓN KHÁCH / KHAI TIỆC
========================================================= */

.rr-events__schedule {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  gap: 32px;

  margin-top: 8px;
}

.rr-events__schedule-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;
}

.rr-events__schedule-label {
  font-size: 11px;

  letter-spacing: 0.05em;
  line-height: 1.4;

  text-transform: uppercase;
}

.rr-events__schedule-time {
  font-size: 18px;
  font-weight: 600;

  line-height: 1.3;
}


/* =========================================================
   LỊCH THÁNG
========================================================= */

.rr-events__calendar {
  width: 296px;
  max-width: 100%;

  margin-top: 8px;

  overflow: hidden;

  border: 1px solid var(--rr-hairline);
  border-radius: 8px;
}

.rr-events__calendar-head {
  padding: 10px 0;

  border-bottom: 1px solid var(--rr-hairline);

  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.02em;
}

.rr-events__calendar-week {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));

  border-bottom: 2px solid var(--rr-red);
}

.rr-events__calendar-week span {
  padding: 6px 0;

  font-size: 10px;
  font-weight: 500;

  opacity: 0.6;
}

.rr-events__calendar-days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));

  row-gap: 2px;

  padding: 8px 4px;
}

.rr-events__calendar-cell {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30px;
}

.rr-events__calendar-number {
  font-size: 12px;

  line-height: 1;
}

.rr-events__calendar-number.is-active {
  position: relative;

  z-index: 1;

  color: #ffffff;
  font-weight: 700;
}

.rr-events__calendar-active {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 24px;
}

.rr-events__heart {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  color: var(--rr-red);
}

.rr-events__calendar-link {
  display: inline-flex;

  margin: 8px 0 12px;

  font-size: 14px;
}


/* =========================================================
   XÁC NHẬN THAM DỰ
========================================================= */

.rr-events__rsvp {
  margin-top: 8px;
}


/* =========================================================
   MODAL
========================================================= */

.rr-confirm {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  padding: 16px;

  background-color: rgba(0, 0, 0, 0.5);
}

.rr-confirm__box {
  position: relative;

  width: 100%;
  max-width: 520px;
  max-height: 90vh;

  overflow-y: auto;

  border-radius: 12px;

  background-color: var(--rr-cream, #f4eee2);

  color: var(--rr-red, #5c080c);
}

.rr-confirm__close {
  position: absolute;

  top: 12px;
  right: 12px;

  z-index: 2;

  display: grid;
  place-items: center;

  width: 30px;
  height: 30px;

  border: none;
  border-radius: 50%;

  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;

  font-size: 20px;
  line-height: 1;

  cursor: pointer;
}

.rr-confirm__head {
  padding: 24px 24px 16px;

  background-color: var(--rr-red, #5c080c);

  color: #ffffff;

  text-align: center;
}

.rr-confirm__head h3 {
  margin: 0;

  font-family: var(--rr-font-heading, "Times New Roman", serif);
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  text-transform: uppercase;
}

.rr-confirm__head p {
  margin: 8px 0 0;

  font-size: 13px;

  line-height: 1.5;

  opacity: 0.85;
}

.rr-confirm__body {
  display: flex;
  flex-direction: column;

  gap: 18px;

  padding: 20px 24px 24px;
}

.rr-confirm__recipient {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;

  padding: 14px;

  border: 1px solid var(--rr-hairline, rgba(92, 8, 12, 0.27));
  border-radius: 8px;
}

.rr-confirm__recipient-label {
  font-size: 11px;

  letter-spacing: 0.2em;

  text-transform: uppercase;

  opacity: 0.75;
}

.rr-confirm__recipient-name {
  font-size: 18px;
  font-weight: 700;
}

.rr-confirm__field {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.rr-confirm__field label {
  font-size: 13px;

  letter-spacing: 0.05em;
}

.rr-confirm__field input {
  width: 100%;

  padding: 10px 14px;

  border: 1px solid var(--rr-red, #5c080c);
  border-radius: 6px;

  background-color: #ffffff;
  color: var(--rr-red, #5c080c);

  font-size: 14px;
}

.rr-confirm__field input:focus {
  outline: none;

  box-shadow: 0 0 0 2px var(--rr-hairline-soft, rgba(92, 8, 12, 0.13));
}

.rr-confirm__options {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.rr-confirm__option {
  padding: 11px 14px;

  border: 1px solid var(--rr-hairline, rgba(92, 8, 12, 0.27));
  border-radius: 8px;

  background-color: transparent;
  color: var(--rr-red, #5c080c);

  font-size: 14px;

  text-align: left;

  cursor: pointer;

  transition: background-color 0.2s ease, color 0.2s ease;
}

.rr-confirm__option.is-selected {
  background-color: var(--rr-red, #5c080c);
  color: #ffffff;
}

.rr-confirm__people {
  display: inline-flex;
  align-items: center;

  gap: 16px;

  align-self: flex-start;

  padding: 6px 12px;

  border: 1px solid var(--rr-hairline, rgba(92, 8, 12, 0.27));
  border-radius: 8px;
}

.rr-confirm__people button {
  width: 28px;
  height: 28px;

  border: none;
  border-radius: 50%;

  background-color: var(--rr-hairline-soft, rgba(92, 8, 12, 0.13));
  color: var(--rr-red, #5c080c);

  font-size: 16px;
  line-height: 1;

  cursor: pointer;
}

.rr-confirm__people span {
  min-width: 24px;

  font-size: 16px;
  font-weight: 600;

  text-align: center;
}

.rr-confirm__error {
  margin: 0;

  color: #b3261e;

  font-size: 13px;

  text-align: center;
}

.rr-confirm__success {
  margin: 0;

  color: var(--rr-red, #5c080c);

  font-size: 13px;
  font-weight: 600;

  text-align: center;
}

.rr-confirm__submit {
  width: 100%;
}


/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .rr-events {
    gap: 48px;

    padding: 0 40px;
  }

  .rr-events__lead,
  .rr-events__time {
    font-size: 20px;
  }

  .rr-events__weekday,
  .rr-events__month {
    font-size: 20px;
  }

  .rr-events__day {
    font-size: 36px;
  }

  .rr-events__year {
    font-size: 22px;
  }

  .rr-events__lunar {
    font-size: 14px;
  }

  .rr-events__schedule {
    gap: 48px;
  }

  .rr-events__schedule-time {
    font-size: 20px;
  }

  .rr-events__calendar {
    width: 352px;
  }

  .rr-events__calendar-head {
    font-size: 14px;
  }

  .rr-events__calendar-week span {
    font-size: 11px;
  }

  .rr-events__calendar-cell {
    height: 34px;
  }

  .rr-events__calendar-number {
    font-size: 13px;
  }

  .rr-events__calendar-active {
    width: 30px;
    height: 28px;
  }

  .rr-confirm {
    align-items: center;
  }

  .rr-confirm__head h3 {
    font-size: 24px;
  }
}
</style>
