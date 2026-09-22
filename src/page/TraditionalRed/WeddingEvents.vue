<template>
  <section class="tr-events">
    <!-- =====================================================
         TIỆC CƯỚI
    ====================================================== -->

    <h2 class="tr-events__title">Thông tin tiệc cưới</h2>

    <div class="tr-events__reception">
      <h3 class="tr-events__reception-lead">Tiệc cưới sẽ diễn ra vào lúc:</h3>

      <div v-if="receptionTime" class="tr-events__reception-time">
        {{ receptionTime }}
      </div>

      <div v-if="hasDate" class="tr-events__date">
        <span class="tr-events__date-side">{{ weekday }}</span>

        <span class="tr-events__date-sep" aria-hidden="true">|</span>

        <span class="tr-events__date-day">{{ day }}</span>

        <span class="tr-events__date-sep" aria-hidden="true">|</span>

        <span class="tr-events__date-side">{{ monthLabel }}</span>
      </div>

      <div v-if="year" class="tr-events__year">{{ year }}</div>

      <div v-if="lunar" class="tr-events__lunar">({{ lunar }})</div>

      <!-- ĐÓN KHÁCH / KHAI TIỆC -->

      <div v-if="guestTime || receptionTime" class="tr-events__milestones">
        <div v-if="guestTime" class="tr-events__milestone">
          <span class="tr-events__milestone-label">Đón khách</span>

          <span class="tr-events__milestone-time">{{ guestTime }}</span>
        </div>

        <div v-if="receptionTime" class="tr-events__milestone">
          <span class="tr-events__milestone-label">Khai tiệc</span>

          <span class="tr-events__milestone-time">{{ receptionTime }}</span>
        </div>
      </div>

      <!-- ĐẾM NGƯỢC -->

      <WeddingCountdown v-if="showCountdown" :target="countdownTarget" />

      <!-- LỊCH THÁNG -->

      <div v-if="calendarDays.length" class="tr-events__calendar-wrap">
        <div class="tr-events__calendar">
          <div class="tr-events__calendar-head">
            Tháng {{ monthNumber }} / {{ year }}
          </div>

          <div class="tr-events__calendar-week">
            <div v-for="label in WEEK_LABELS" :key="label">{{ label }}</div>
          </div>

          <div class="tr-events__calendar-grid">
            <div
              v-for="(value, index) in calendarDays"
              :key="index"
              class="tr-events__calendar-cell"
            >
              <div v-if="value === weddingDay" class="tr-events__heart">
                <svg viewBox="0 0 24 22" fill="#680e0e" aria-hidden="true">
                  <path
                    d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z"
                  />
                </svg>

                <span>{{ value }}</span>
              </div>

              <span v-else-if="value">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- THÊM VÀO LỊCH -->

      <a
        v-if="calendarUrl"
        :href="calendarUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="tr-events__calendar-link"
      >
        Thêm vào lịch
      </a>
    </div>

    <!-- =====================================================
         XÁC NHẬN THAM DỰ
    ====================================================== -->

    <div class="tr-events__rsvp">
      <button type="button" class="tr-events__rsvp-button" @click="openConfirm">
        XÁC NHẬN THAM DỰ
      </button>
    </div>

    <!-- =====================================================
         MODAL XÁC NHẬN
    ====================================================== -->

    <Transition name="tr-modal">
      <div
        v-if="showConfirmModal"
        class="tr-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Xác nhận tham dự"
        @click.self="closeConfirm"
      >
        <div class="tr-modal__box">
          <header class="tr-modal__head">
            <h3>Xác nhận tham dự</h3>

            <button
              type="button"
              class="tr-modal__close"
              aria-label="Đóng"
              @click="closeConfirm"
            >
              ✕
            </button>
          </header>

          <div class="tr-modal__body">
            <label class="tr-modal__field">
              <span>Họ và tên</span>

              <input v-model.trim="form.name" type="text" placeholder="Họ và tên" />
            </label>

            <div class="tr-modal__field">
              <span>Bạn sẽ tham dự chứ?</span>

              <div class="tr-modal__choices">
                <button
                  type="button"
                  :class="{ 'is-active': form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  Có tham dự
                </button>

                <button
                  type="button"
                  :class="{ 'is-active': form.attendance === 'absent' }"
                  @click="form.attendance = 'absent'"
                >
                  Không tham dự
                </button>
              </div>
            </div>

            <div v-if="form.attendance === 'attending'" class="tr-modal__field">
              <span>Số người tham dự</span>

              <div class="tr-modal__counter">
                <button type="button" @click="decreasePeople">−</button>

                <strong>{{ form.numberOfPeople }}</strong>

                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <p v-if="errorMessage" class="tr-modal__error">{{ errorMessage }}</p>

            <p v-if="successMessage" class="tr-modal__success">
              {{ successMessage }}
            </p>

            <button
              type="button"
              class="tr-modal__submit"
              :disabled="submitting"
              @click="submitConfirmation"
            >
              {{ submitting ? "Đang gửi..." : "GỬI XÁC NHẬN" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

import { useRoute } from "vue-router";

import { Confirm } from "@/model/api";

import WeddingCountdown from "./WeddingCountdown.vue";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },

  recipientName: {
    type: [Object, Array, String],
    default: null,
  },

  countdown: {
    type: Object,
    default: () => ({}),
  },

  settings: {
    type: Object,
    default: () => ({}),
  },

  wedding: {
    type: Object,
    default: () => ({}),
  },
});

const route = useRoute();

/* =========================================================
   SỰ KIỆN ĐẦU TIÊN
========================================================= */

const firstEvent = computed(() => {
  const list = Array.isArray(props.events) ? props.events : [];

  return list[0] || null;
});

const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const WEEKDAYS = [
  "CHỦ NHẬT",
  "THỨ HAI",
  "THỨ BA",
  "THỨ TƯ",
  "THỨ NĂM",
  "THỨ SÁU",
  "THỨ BẢY",
];

function toTimeLabel(raw) {
  if (!raw) return "";

  const value = String(raw);

  if (value.includes("T")) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  }

  return value.slice(0, 5);
}

const receptionTime = computed(() =>
  toTimeLabel(
    firstEvent.value?.ReceptionTime ||
      firstEvent.value?.Reception_time ||
      firstEvent.value?.EventTime
  )
);

const guestTime = computed(() =>
  toTimeLabel(
    firstEvent.value?.GuestTime ||
      firstEvent.value?.Guest_time ||
      firstEvent.value?.CeremonyTime ||
      firstEvent.value?.Ceremony_time
  )
);

/* =========================================================
   NGÀY
========================================================= */

const dateObject = computed(() => {
  const raw = firstEvent.value?.EventDate || "";

  if (!raw) return null;

  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
});

const hasDate = computed(() => Boolean(dateObject.value));

const weekday = computed(() => {
  if (firstEvent.value?.Weekday) {
    return String(firstEvent.value.Weekday).toUpperCase();
  }

  return dateObject.value ? WEEKDAYS[dateObject.value.getDay()] : "";
});

const day = computed(() => {
  if (firstEvent.value?.Day) {
    return String(firstEvent.value.Day).padStart(2, "0");
  }

  return dateObject.value
    ? String(dateObject.value.getDate()).padStart(2, "0")
    : "";
});

const monthNumber = computed(() => {
  if (firstEvent.value?.Month) {
    return String(firstEvent.value.Month).padStart(2, "0");
  }

  return dateObject.value
    ? String(dateObject.value.getMonth() + 1).padStart(2, "0")
    : "";
});

const monthLabel = computed(() =>
  monthNumber.value ? `THÁNG ${monthNumber.value}` : ""
);

const year = computed(() => {
  if (firstEvent.value?.Year) {
    return String(firstEvent.value.Year);
  }

  return dateObject.value ? String(dateObject.value.getFullYear()) : "";
});

const lunar = computed(() => firstEvent.value?.Lunar || "");

const weddingDay = computed(() => {
  const value = Number(day.value);

  return Number.isFinite(value) && value > 0 ? value : null;
});

/* =========================================================
   ĐẾM NGƯỢC
========================================================= */

const showCountdown = computed(
  () => props.settings?.ShowCountdown ?? props.countdown?.Enabled ?? false
);

const countdownTarget = computed(
  () =>
    props.countdown?.Target ||
    props.countdown?.Date ||
    firstEvent.value?.EventDate ||
    null
);

/* =========================================================
   LỊCH THÁNG
========================================================= */

const calendarDays = computed(() => {
  const y = Number(year.value);
  const m = Number(monthNumber.value);

  if (!y || !m) return [];

  const firstDay = new Date(y, m - 1, 1).getDay();
  const totalDays = new Date(y, m, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }

  return days;
});

/* =========================================================
   GOOGLE CALENDAR
========================================================= */

const calendarUrl = computed(() => {
  const event = firstEvent.value;

  if (!event) return "";

  const explicit = event.calendarUrl || event.calendar_url;

  if (explicit) return explicit;

  const raw = event.EventDate;

  if (!raw) return "";

  const start = new Date(raw);

  if (Number.isNaN(start.getTime())) return "";

  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const stamp = (date) =>
    date.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";

  const title = `Đám cưới ${groomName.value} & ${brideName.value}`;

  const location = event.Address || event.Location || "";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: "Asia/Saigon",
    details: `Tiệc cưới của ${groomName.value} & ${brideName.value}`,
    location,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
});

/* =========================================================
   LỊCH THÁNG
========================================================= */

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.couple?.Groom?.Name ||
    "Chú rể"
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Cô dâu"
);

/* =========================================================
   XÁC NHẬN THAM DỰ
========================================================= */

const showConfirmModal = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const form = reactive({
  name: "",
  attendance: "attending",
  numberOfPeople: 1,
});

const recipientLabel = computed(() => {
  const value = props.recipientName;

  if (!value) return "";

  if (typeof value === "string") return value.trim();

  if (Array.isArray(value)) return value[0]?.Name || "";

  return value.Name || "";
});

function openConfirm() {
  errorMessage.value = "";
  successMessage.value = "";

  form.name = recipientLabel.value;
  form.attendance = "attending";
  form.numberOfPeople = 1;

  showConfirmModal.value = true;
}

function closeConfirm() {
  if (submitting.value) return;

  showConfirmModal.value = false;
}

function increasePeople() {
  if (form.numberOfPeople < 20) form.numberOfPeople++;
}

function decreasePeople() {
  if (form.numberOfPeople > 1) form.numberOfPeople--;
}

async function submitConfirmation() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!form.name) {
    errorMessage.value = "Vui lòng nhập họ tên.";

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
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.tr-events {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  align-items: center;

  color: #680e0e;

  font-family: "Baskerville", "Times New Roman", serif;
}

.tr-events__title {
  margin: 0 0 16px;

  text-align: center;

  text-transform: uppercase;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;
}

/* =========================================================
   TIỆC CƯỚI
========================================================= */

.tr-events__reception {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 16px;

  text-align: center;
}

.tr-events__reception-lead {
  margin: 0;

  text-transform: uppercase;

  font-size: 18px;

  font-weight: 400;
}

.tr-events__reception-time {
  font-size: 18px;

  font-weight: 600;
}

.tr-events__date {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 16px;
}

.tr-events__date-side {
  text-transform: uppercase;

  font-size: 14px;
}

.tr-events__date-sep {
  font-size: 14px;

  opacity: 0.5;
}

.tr-events__date-day {
  font-size: 30px;

  font-weight: 600;
}

.tr-events__year {
  font-size: 20px;
}

.tr-events__lunar {
  font-size: 13px;
}

/* =========================================================
   ĐÓN KHÁCH / KHAI TIỆC
========================================================= */

.tr-events__milestones {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 32px;

  margin-top: 16px;
}

.tr-events__milestone {
  display: flex;

  flex-direction: column;

  align-items: center;
}

.tr-events__milestone-label {
  text-transform: uppercase;

  letter-spacing: 0.05em;

  font-size: 11px;
}

.tr-events__milestone-time {
  margin-top: 4px;

  font-size: 18px;

  font-weight: 600;
}

/* =========================================================
   LỊCH THÁNG
========================================================= */

.tr-events__calendar-wrap {
  width: 296px;
  max-width: 100%;

  margin: 8px auto 0;
}

.tr-events__calendar {
  width: 100%;

  border: 1px solid color-mix(in srgb, #680e0e 27%, transparent);

  border-radius: 8px;

  overflow: hidden;
}

.tr-events__calendar-head {
  padding: 10px 0;

  text-align: center;

  font-size: 13px;

  font-weight: 600;

  letter-spacing: 0.02em;

  border-bottom: 1px solid color-mix(in srgb, #680e0e 27%, transparent);
}

.tr-events__calendar-week {
  display: grid;

  grid-template-columns: repeat(7, minmax(0, 1fr));

  border-bottom: 2px solid #680e0e;
}

.tr-events__calendar-week div {
  padding: 6px 0;

  text-align: center;

  font-size: 10px;

  font-weight: 500;

  opacity: 0.6;
}

.tr-events__calendar-grid {
  display: grid;

  grid-template-columns: repeat(7, minmax(0, 1fr));

  row-gap: 2px;

  padding: 8px 4px;
}

.tr-events__calendar-cell {
  display: flex;

  align-items: center;
  justify-content: center;

  height: 30px;

  font-size: 12px;
}

.tr-events__heart {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 26px;
  height: 24px;
}

.tr-events__heart svg {
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;
}

.tr-events__heart span {
  position: relative;

  z-index: 1;

  color: #fff;

  font-size: 11px;

  font-weight: 700;
}

/* =========================================================
   THÊM VÀO LỊCH
========================================================= */

.tr-events__calendar-link {
  margin-top: 8px;

  color: #680e0e;

  font-size: 13px;

  text-decoration: underline;

  text-underline-offset: 4px;

  text-decoration-thickness: 1px;

  transition: opacity 0.2s ease;
}

.tr-events__calendar-link:hover {
  opacity: 0.7;
}

/* =========================================================
   RSVP
========================================================= */

.tr-events__rsvp {
  position: relative;

  z-index: 10;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  margin-top: 24px;
}

.tr-events__rsvp-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  padding: 8px 16px;

  border: none;

  border-radius: 10px;

  cursor: pointer;

  background-color: #680e0e;

  color: #ffe3b1;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 14px;

  font-weight: 600;

  transition: transform 0.2s ease;
}

.tr-events__rsvp-button:hover {
  transform: scale(1.03);
}

/* =========================================================
   MODAL
========================================================= */

.tr-modal {
  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: flex-end;
  justify-content: center;

  padding: 0;

  background-color: rgba(0, 0, 0, 0.6);
}

.tr-modal__box {
  width: 100%;
  max-width: 520px;

  max-height: 90vh;

  overflow-y: auto;

  border-radius: 16px 16px 0 0;

  background-color: #f5f0e8;

  color: #680e0e;
}

.tr-modal__head {
  position: relative;

  padding: 20px 24px 16px;

  text-align: center;

  background-color: #680e0e;
}

.tr-modal__head h3 {
  margin: 0;

  text-transform: uppercase;

  color: #fff;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.tr-modal__close {
  position: absolute;

  top: 12px;
  right: 12px;

  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 50%;

  cursor: pointer;

  background: transparent;

  color: rgba(255, 255, 255, 0.8);

  font-size: 15px;
}

.tr-modal__close:hover {
  background-color: rgba(255, 255, 255, 0.2);

  color: #fff;
}

.tr-modal__body {
  display: flex;

  flex-direction: column;

  gap: 16px;

  padding: 20px;
}

.tr-modal__field {
  display: flex;

  flex-direction: column;

  gap: 8px;
}

.tr-modal__field > span {
  font-size: 13px;

  font-weight: 600;
}

.tr-modal__field input {
  width: 100%;

  padding: 10px 14px;

  border: 1px solid color-mix(in srgb, #680e0e 27%, transparent);

  border-radius: 8px;

  background-color: #fff;

  color: #680e0e;

  font-family: inherit;

  font-size: 14px;

  outline: none;
}

.tr-modal__choices {
  display: flex;

  gap: 8px;
}

.tr-modal__choices button {
  flex: 1;

  padding: 10px;

  border: 1px solid color-mix(in srgb, #680e0e 27%, transparent);

  border-radius: 8px;

  cursor: pointer;

  background-color: transparent;

  color: #680e0e;

  font-family: inherit;

  font-size: 13px;

  transition: background-color 0.2s ease, color 0.2s ease;
}

.tr-modal__choices button.is-active {
  background-color: #680e0e;

  color: #ffe3b1;
}

.tr-modal__counter {
  display: flex;

  align-items: center;

  gap: 16px;
}

.tr-modal__counter button {
  width: 36px;
  height: 36px;

  border: 1px solid color-mix(in srgb, #680e0e 27%, transparent);

  border-radius: 8px;

  cursor: pointer;

  background-color: transparent;

  color: #680e0e;

  font-size: 18px;

  line-height: 1;
}

.tr-modal__counter strong {
  min-width: 24px;

  text-align: center;

  font-size: 16px;
}

.tr-modal__error {
  margin: 0;

  color: #b3261e;

  font-size: 13px;
}

.tr-modal__success {
  margin: 0;

  color: #1b6b3a;

  font-size: 13px;
}

.tr-modal__submit {
  padding: 12px;

  border: none;

  border-radius: 10px;

  cursor: pointer;

  background-color: #680e0e;

  color: #ffe3b1;

  font-family: inherit;

  font-size: 14px;

  font-weight: 600;
}

.tr-modal__submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================================================
   TRANSITION
========================================================= */

.tr-modal-enter-active,
.tr-modal-leave-active {
  transition: opacity 0.25s ease;
}

.tr-modal-enter-from,
.tr-modal-leave-to {
  opacity: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 640px) {
  .tr-modal {
    align-items: center;

    padding: 24px;
  }

  .tr-modal__box {
    border-radius: 16px;
  }
}

@media (min-width: 768px) {
  .tr-events__title {
    font-size: 24px;
  }

  .tr-events__reception-lead,
  .tr-events__reception-time {
    font-size: 20px;
  }

  .tr-events__date-side {
    font-size: 15px;
  }

  .tr-events__date-day {
    font-size: 36px;
  }

  .tr-events__year {
    font-size: 22px;
  }

  .tr-events__lunar {
    font-size: 14px;
  }

  .tr-events__milestone-time {
    font-size: 20px;
  }

  .tr-events__calendar-wrap {
    width: 352px;
  }

  .tr-events__calendar-head {
    font-size: 14px;
  }

  .tr-events__calendar-week div {
    font-size: 11px;
  }

  .tr-events__calendar-cell {
    height: 34px;

    font-size: 13px;
  }

  .tr-events__heart {
    width: 30px;
    height: 28px;
  }

  .tr-events__heart span {
    font-size: 12px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .tr-modal-enter-active,
  .tr-modal-leave-active {
    transition: none;
  }
}
</style>
