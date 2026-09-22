<template>
  <section class="mw-events">
    <h2 class="mw-title">Thông tin tiệc cưới</h2>

    <div
      v-for="(event, index) in normalizedEvents"
      :key="event.Id || index"
      class="mw-event"
    >
      <p class="mw-event__lead">Tiệc cưới sẽ diễn ra vào lúc:</p>

      <div v-if="event.time" class="mw-event__time">{{ event.time }}</div>

      <div class="mw-event__row">
        <span v-if="event.weekday" class="mw-event__weekday">{{ event.weekday }}</span>

        <span class="mw-event__bar" aria-hidden="true"></span>

        <span v-if="event.day" class="mw-event__day">{{ event.day }}</span>

        <span class="mw-event__bar" aria-hidden="true"></span>

        <span v-if="event.month" class="mw-event__month">THÁNG {{ event.month }}</span>
      </div>

      <div v-if="event.year" class="mw-event__year">{{ event.year }}</div>

      <div v-if="event.lunar" class="mw-event__lunar">( {{ event.lunar }} )</div>

      <!-- =================================================
           LỊCH
      ================================================== -->

      <div v-if="event.calendarDays.length" class="mw-calendar">
        <div class="mw-calendar__head">
          Tháng {{ event.month }} / {{ event.year }}
        </div>

        <div class="mw-calendar__weekdays">
          <span v-for="label in WEEKDAYS" :key="label">{{ label }}</span>
        </div>

        <div class="mw-calendar__days">
          <div
            v-for="(day, dayIndex) in event.calendarDays"
            :key="dayIndex"
            class="mw-calendar__cell"
          >
            <template v-if="day">
              <span v-if="day === Number(event.day)" class="mw-calendar__heart">
                <svg viewBox="0 0 24 22" fill="currentColor" aria-hidden="true">
                  <path
                    d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z"
                  />
                </svg>

                <b>{{ day }}</b>
              </span>

              <span v-else class="mw-calendar__day">{{ day }}</span>
            </template>
          </div>
        </div>

        <a
          v-if="event.calendarUrl"
          :href="event.calendarUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mw-calendar__link"
        >
          Thêm vào lịch
        </a>
      </div>

      <!-- =================================================
           ĐÓN KHÁCH / KHAI TIỆC
      ================================================== -->

      <div
        v-if="event.receptionTime || event.ceremonyTime"
        class="mw-event__schedule"
      >
        <div v-if="event.receptionTime" class="mw-event__schedule-item">
          <span class="mw-event__schedule-label">Đón khách</span>

          <strong>{{ event.receptionTime }}</strong>
        </div>

        <div v-if="event.ceremonyTime" class="mw-event__schedule-item">
          <span class="mw-event__schedule-label">Khai tiệc</span>

          <strong>{{ event.ceremonyTime }}</strong>
        </div>
      </div>

      <!-- =================================================
           ĐỊA ĐIỂM
      ================================================== -->

      <div v-if="event.location || event.address" class="mw-event__place">
        <strong v-if="event.location">{{ event.location }}</strong>

        <span v-if="event.address">{{ event.address }}</span>
      </div>

      <!-- =================================================
           RSVP
      ================================================== -->

      <button type="button" class="mw-pill mw-event__rsvp" @click="openConfirmModal">
        XÁC NHẬN THAM DỰ
      </button>
    </div>

    <!-- =====================================================
         CONFIRM MODAL
    ====================================================== -->

    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="mw-confirm"
        @click.self="closeConfirmModal"
      >
        <div class="mw-confirm__card">
          <button
            type="button"
            class="mw-confirm__close"
            aria-label="Đóng"
            @click="closeConfirmModal"
          >
            ×
          </button>

          <h3 class="mw-confirm__title">Xác nhận tham dự</h3>

          <p class="mw-confirm__lead">
            Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.
          </p>

          <div v-if="hasRecipient" class="mw-confirm__recipient">
            <span>TRÂN TRỌNG KÍNH MỜI</span>

            <strong>{{ recipientDisplayName }}</strong>
          </div>

          <div v-else class="mw-confirm__group">
            <label>Họ và tên</label>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="100"
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div class="mw-confirm__group">
            <label>Bạn có tham dự không?</label>

            <div class="mw-attendance">
              <button
                type="button"
                class="mw-attendance__option"
                :class="{ selected: form.attendance === 'attending' }"
                @click="form.attendance = 'attending'"
              >
                Có, tôi sẽ tham dự
              </button>

              <button
                type="button"
                class="mw-attendance__option"
                :class="{ selected: form.attendance === 'not_attending' }"
                @click="form.attendance = 'not_attending'"
              >
                Rất tiếc, tôi không thể tham dự
              </button>
            </div>
          </div>

          <div v-if="form.attendance === 'attending'" class="mw-confirm__group">
            <label>Số người tham dự</label>

            <div class="mw-people">
              <button type="button" @click="decreasePeople">−</button>

              <span>{{ form.numberOfPeople }}</span>

              <button type="button" @click="increasePeople">+</button>
            </div>
          </div>

          <p v-if="errorMessage" class="mw-confirm__error">{{ errorMessage }}</p>

          <p v-if="successMessage" class="mw-confirm__success">{{ successMessage }}</p>

          <button
            type="button"
            class="mw-pill mw-confirm__submit"
            :disabled="submitting"
            @click="submitConfirmation"
          >
            {{ submitting ? "ĐANG GỬI..." : "GỬI XÁC NHẬN" }}
          </button>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

import { Confirm } from "@/model/api";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

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

const hasRecipient = computed(() => Boolean(recipientDisplayName.value));

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

  form.name = hasRecipient.value ? recipientDisplayName.value : "";
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

  if (!form.name) {
    errorMessage.value = "Vui lòng nhập họ tên.";

    return;
  }

  if (!form.attendance) {
    errorMessage.value = "Vui lòng chọn xác nhận tham dự.";

    return;
  }

  const slug = route.params.token
    ? `${route.params.slug}/${route.params.token}`
    : route.params.slug || "";

  const payload = {
    Slug: slug,
    RecipientToken: route.params.token || null,
    GuestName: form.name,
    Attendance: form.attendance === "attending" ? "Có tham dự" : "Không tham dự",
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
    errorMessage.value = error?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
  } finally {
    submitting.value = false;
  }
}

/* =========================================================
   NORMALIZE EVENTS
========================================================= */

const normalizedEvents = computed(() =>
  (props.events || []).map((event, index) => {
    const item = event || {};

    const date = item.EventDate ? dayjs(item.EventDate) : null;

    const validDate = date?.isValid() ? date : null;

    return {
      ...item,

      Id: item.Id || index,

      time: item.EventTime || "",

      weekday: item.Weekday || "",

      day: item.Day
        ? String(item.Day).padStart(2, "0")
        : validDate?.format("DD") || "",

      month: item.Month
        ? String(item.Month).padStart(2, "0")
        : validDate?.format("MM") || "",

      year: item.Year || validDate?.format("YYYY") || "",

      lunar: item.Lunar || "",

      location: item.Location || "",

      address: item.Address || "",

      receptionTime: item.ReceptionTime || item.Reception_time || "",

      ceremonyTime: item.CeremonyTime || item.Ceremony_time || "",

      calendarUrl: buildCalendarUrl(item, validDate),

      calendarDays: buildCalendarDays(item, validDate),
    };
  })
);

/* =========================================================
   CALENDAR DAYS — tuần bắt đầu từ thứ Hai
========================================================= */

function buildCalendarDays(event, date) {
  const year = Number(event?.Year) || date?.year();
  const month = Number(event?.Month) || (date ? date.month() + 1 : 0);

  if (!year || !month) {
    return [];
  }

  const firstDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);

  const daysInMonth = firstDay.daysInMonth();

  const startOffset = (firstDay.day() + 6) % 7;

  const days = [];

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

/* =========================================================
   GOOGLE CALENDAR
========================================================= */

function buildCalendarUrl(event, date) {
  if (!date) {
    return "";
  }

  const [hour, minute] = String(event?.EventTime || "00:00")
    .split(":")
    .map((value) => Number(value) || 0);

  const start = date.hour(hour).minute(minute).second(0);

  const end = start.add(3, "hour");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event?.Title || "Đám cưới",
    dates: `${start.format("YYYYMMDDTHHmmss")}/${end.format("YYYYMMDDTHHmmss")}`,
    details: "Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi.",
    location: event?.Address || event?.Location || "",
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}
</script>

<style scoped>
.mw-events {
  text-align: center;
}

.mw-event {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  margin-top: 32px;
}

.mw-event + .mw-event {
  margin-top: 48px;
  padding-top: 40px;

  border-top: 1px solid var(--mw-hairline-soft);
}

.mw-event__lead {
  margin: 0;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mw-event__time {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.05em;
}

.mw-event__row {
  display: flex;
  align-items: center;
  gap: 24px;

  color: var(--mw-blue);
}

.mw-event__weekday,
.mw-event__month {
  font-family: var(--mw-font-serif);
  font-size: 12px;
  font-weight: 400;

  letter-spacing: 0.05em;
}

.mw-event__bar {
  width: 2px;
  height: 24px;

  background-color: var(--mw-blue);
}

.mw-event__day {
  font-family: var(--mw-font-serif);
  font-size: 30px;
  font-weight: 400;
}

.mw-event__year {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 18px;
  font-weight: 400;

  letter-spacing: 0.05em;
}

.mw-event__lunar {
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 12px;
  font-weight: 400;

  letter-spacing: 0.25em;
  text-transform: uppercase;
}

/* =========================================================
   LỊCH
========================================================= */

.mw-calendar {
  width: 296px;
  max-width: 100%;

  margin-top: 16px;

  overflow: hidden;

  border: 1px solid var(--mw-hairline);
  border-radius: 8px;

  color: var(--mw-blue);
}

.mw-calendar__head {
  padding: 10px 0;

  border-bottom: 1px solid var(--mw-hairline);

  font-family: var(--mw-font-serif);
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.05em;
}

.mw-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));

  border-bottom: 2px solid var(--mw-blue);
}

.mw-calendar__weekdays span {
  padding: 6px 0;

  font-family: var(--mw-font-serif);
  font-size: 10px;
  font-weight: 500;

  opacity: 0.6;
}

.mw-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  row-gap: 2px;

  padding: 8px 4px;
}

.mw-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30px;
}

.mw-calendar__day {
  font-family: var(--mw-font-serif);
  font-size: 12px;
}

.mw-calendar__heart {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 24px;
}

.mw-calendar__heart svg {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  color: var(--mw-blue);
}

.mw-calendar__heart b {
  position: relative;
  z-index: 1;

  color: #ffffff;

  font-family: var(--mw-font-serif);
  font-size: 11px;
  font-weight: 700;
}

.mw-calendar__link {
  display: inline-block;

  margin: 8px 0 12px;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  letter-spacing: 0.05em;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.mw-calendar__link:hover {
  opacity: 0.7;
}

/* =========================================================
   ĐÓN KHÁCH / KHAI TIỆC
========================================================= */

.mw-event__schedule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;

  margin-top: 16px;
}

.mw-event__schedule-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.mw-event__schedule-label {
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 12px;

  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mw-event__schedule-item strong {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 18px;
  font-weight: 500;
}

/* =========================================================
   ĐỊA ĐIỂM
========================================================= */

.mw-event__place {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  max-width: 320px;

  margin-top: 16px;
}

.mw-event__place strong {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 16px;
  font-weight: 400;

  letter-spacing: 0.05em;
}

.mw-event__place span {
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  letter-spacing: 0.05em;
  line-height: 1.6;
}

.mw-event__rsvp {
  margin-top: 20px;
}

/* =========================================================
   CONFIRM MODAL
========================================================= */

.mw-confirm {
  position: fixed;
  inset: 0;
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background-color: rgba(0, 0, 0, 0.55);
}

.mw-confirm__card {
  position: relative;

  width: min(100%, 420px);
  max-height: 90vh;

  padding: 32px 24px 28px;

  overflow-y: auto;

  border-radius: 18px;

  background-color: var(--mw-paper);

  text-align: center;
}

.mw-confirm__close {
  position: absolute;
  top: 12px;
  right: 14px;

  border: none;

  background: none;
  color: var(--mw-ink-soft);

  font-size: 24px;
  line-height: 1;

  cursor: pointer;
}

.mw-confirm__title {
  margin: 0;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 24px;
  font-weight: 400;

  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mw-confirm__lead {
  margin: 10px 0 0;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  line-height: 1.6;
}

.mw-confirm__recipient {
  display: flex;
  flex-direction: column;
  gap: 4px;

  margin-top: 20px;
  padding: 14px;

  border: 1px solid var(--mw-hairline-soft);
  border-radius: 12px;

  background-color: var(--mw-blue-mist);
}

.mw-confirm__recipient span {
  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 11px;

  letter-spacing: 0.2em;
}

.mw-confirm__recipient strong {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 18px;
  font-weight: 600;
}

.mw-confirm__group {
  margin-top: 18px;

  text-align: left;
}

.mw-confirm__group label {
  display: block;

  margin-bottom: 8px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 13px;

  letter-spacing: 0.05em;
}

.mw-confirm__group input {
  width: 100%;

  padding: 10px 14px;

  border: 1px solid var(--mw-hairline);
  border-radius: 10px;

  background-color: var(--mw-paper);
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  outline: none;
}

.mw-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mw-attendance__option {
  padding: 10px 14px;

  border: 1px solid var(--mw-hairline);
  border-radius: 10px;

  background-color: var(--mw-paper);
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  text-align: left;

  cursor: pointer;

  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.mw-attendance__option.selected {
  border-color: var(--mw-blue);

  background-color: var(--mw-blue-mist);
  color: var(--mw-blue);
}

.mw-people {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mw-people button {
  width: 36px;
  height: 36px;

  border: 1px solid var(--mw-blue);
  border-radius: 50%;

  background-color: var(--mw-paper);
  color: var(--mw-blue);

  font-size: 18px;
  line-height: 1;

  cursor: pointer;
}

.mw-people span {
  min-width: 24px;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 18px;
  font-weight: 600;

  text-align: center;
}

.mw-confirm__error {
  margin: 16px 0 0;

  color: #c0392b;

  font-family: var(--mw-font-serif);
  font-size: 13px;
}

.mw-confirm__success {
  margin: 16px 0 0;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 13px;
}

.mw-confirm__submit {
  width: 100%;

  margin-top: 22px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-event__lead {
    font-size: 26px;
  }

  .mw-event__time {
    font-size: 30px;
  }

  .mw-event__weekday,
  .mw-event__month {
    font-size: 16px;
  }

  .mw-event__bar {
    height: 32px;
  }

  .mw-event__day {
    font-size: 40px;
  }

  .mw-event__year {
    font-size: 24px;
  }

  .mw-event__lunar {
    font-size: 14px;
  }

  .mw-calendar {
    width: 352px;
  }

  .mw-calendar__head {
    font-size: 14px;
  }

  .mw-calendar__weekdays span {
    font-size: 11px;
  }

  .mw-calendar__cell {
    height: 34px;
  }

  .mw-calendar__day {
    font-size: 13px;
  }

  .mw-calendar__heart {
    width: 30px;
    height: 28px;
  }

  .mw-calendar__heart b {
    font-size: 12px;
  }

  .mw-event__schedule-item strong {
    font-size: 20px;
  }
}
</style>
