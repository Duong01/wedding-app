<template>
  <section ref="sectionRef" class="la-events">
    <h2 class="la-title">Thông tin tiệc cưới</h2>

    <article
      v-for="(event, index) in normalizedEvents"
      :key="event.Id || event.id || index"
      class="la-event reveal"
      :style="{ '--delay': `${index * 120}ms` }"
    >
      <!-- =====================================================
           GIỜ TIỆC
      ====================================================== -->
      <h3 class="la-event__lead">Tiệc cưới sẽ diễn ra vào lúc:</h3>

      <p v-if="event.time" class="la-event__time">{{ event.time }}</p>

      <!-- =====================================================
           NGÀY
      ====================================================== -->
      <template v-if="event.hasDate">
        <div class="la-event__row">
          <span class="la-event__side">{{ event.weekday }}</span>

          <span class="la-event__bar"></span>

          <span class="la-event__day">{{ event.day }}</span>

          <span class="la-event__bar"></span>

          <span class="la-event__side">THÁNG {{ event.month }}</span>
        </div>

        <p class="la-event__year">{{ event.year }}</p>

        <p v-if="event.lunar" class="la-event__lunar">( Tức ngày {{ event.lunar }} )</p>
      </template>

      <!-- =====================================================
           ĐÓN KHÁCH / KHAI TIỆC
      ====================================================== -->
      <div v-if="event.receptionTime || event.ceremonyTime" class="la-event__schedule">
        <div v-if="event.receptionTime" class="la-schedule">
          <span class="la-schedule__label">Đón khách</span>

          <span class="la-schedule__value">{{ event.receptionTime }}</span>
        </div>

        <div v-if="event.ceremonyTime" class="la-schedule">
          <span class="la-schedule__label">Khai tiệc</span>

          <span class="la-schedule__value">{{ event.ceremonyTime }}</span>
        </div>
      </div>

      <!-- =====================================================
           LỊCH THÁNG
      ====================================================== -->
      <div v-if="event.hasDate && event.calendarDays.length" class="la-calendar">
        <img :src="calendarFrame" alt="" class="la-calendar__frame" aria-hidden="true" />

        <div class="la-calendar__body">
          <div class="la-calendar__month">Tháng {{ Number(event.month) }} / {{ event.year }}</div>

          <svg class="la-calendar__wave" viewBox="0 0 280 8" preserveAspectRatio="none" height="8" aria-hidden="true">
            <path
              d="M4,4 C30,2 60,6 90,4 C120,2 150,6 180,4 C210,2 240,5 276,4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              opacity="0.5"
            />
          </svg>

          <div class="la-calendar__weekdays">
            <span v-for="label in WEEKDAYS" :key="label">{{ label }}</span>
          </div>

          <svg class="la-calendar__wave la-calendar__wave--strong" viewBox="0 0 280 10" preserveAspectRatio="none" height="10" aria-hidden="true">
            <path
              d="M3,5 C20,3 50,7 80,5 C110,3 140,7 170,5 C200,3 230,7 277,5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>

          <div class="la-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="la-calendar__cell"
            >
              <template v-if="day">
                <span v-if="day === Number(event.day)" class="la-calendar__heart">
                  <img :src="calendarHeart" alt="" aria-hidden="true" />

                  <b>{{ day }}</b>
                </span>

                <span v-else class="la-calendar__day">{{ day }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- =====================================================
           THÊM VÀO LỊCH
      ====================================================== -->
      <a
        v-if="event.calendarUrl"
        :href="event.calendarUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="la-event__calendar-link"
      >
        Thêm vào lịch
      </a>

      <!-- =====================================================
           XÁC NHẬN THAM DỰ
      ====================================================== -->
      <button type="button" class="la-pill la-event__rsvp" @click="openConfirmModal(event)">
        XÁC NHẬN THAM DỰ
      </button>
    </article>

    <!-- =====================================================
         RSVP MODAL
    ====================================================== -->
    <Teleport to="body">
      <Transition name="la-modal">
        <div v-if="showConfirmModal" class="la-confirm" @click.self="closeConfirmModal">
          <div class="la-confirm__card">
            <button type="button" class="la-confirm__close" aria-label="Đóng" @click="closeConfirmModal">
              ×
            </button>

            <h3 class="la-confirm__title">Xác nhận tham dự</h3>

            <p class="la-confirm__desc">
              Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.
            </p>

            <div v-if="hasRecipient" class="la-confirm__recipient">
              <span>TRÂN TRỌNG KÍNH MỜI</span>

              <strong>{{ recipientName }}</strong>
            </div>

            <div v-else class="la-field">
              <label for="la-rsvp-name">Họ và tên</label>

              <input
                id="la-rsvp-name"
                v-model.trim="form.name"
                type="text"
                maxlength="100"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div class="la-field">
              <label>Bạn có tham dự không?</label>

              <div class="la-attendance">
                <button
                  type="button"
                  class="la-attendance__option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="la-attendance__option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <div v-if="form.attendance === 'attending'" class="la-field">
              <label>Số người tham dự</label>

              <div class="la-people">
                <button type="button" @click="decreasePeople">−</button>

                <strong>{{ form.numberOfPeople }}</strong>

                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <p v-if="errorMessage" class="la-confirm__error">{{ errorMessage }}</p>

            <p v-if="successMessage" class="la-confirm__success">{{ successMessage }}</p>

            <button
              type="button"
              class="la-pill la-confirm__submit"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";

import { Confirm } from "@/model/api";

import calendarFrame from "@/assets/love-art/lich.webp";
import calendarHeart from "@/assets/love-art/tim.webp";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

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

const normalizedEvents = computed(() =>
  (props.events || []).map((item) => {
    const rawDate = item.EventDate || item.Date || item.StartDate;

    const date = dayjs(rawDate);

    let day = "";
    let month = "";
    let year = "";
    let weekday = "";

    if (date.isValid()) {
      day = date.format("DD");
      month = date.format("MM");
      year = date.format("YYYY");

      const weekdays = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];

      weekday = weekdays[date.day()];
    }

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

      lunar: item.LunarDate || item.Lunar || item.lunar || "",

      receptionTime: item.ReceptionTime || item.receptionTime || "",

      ceremonyTime: item.CeremonyTime || item.ceremonyTime || "",

      location,
      address,

      calendarDays: buildCalendarDays(Number(year), Number(month)),

      calendarUrl:
        item.CalendarUrl ||
        item.calendarUrl ||
        buildCalendarUrl({
          date,
          time,
          title: item.Title || "Đám cưới",
          location: [location, address].filter(Boolean).join(", "),
        }),
    };
  })
);

/* =========================================
   CALENDAR
========================================= */

/* Lịch bắt đầu từ thứ Hai — khớp hàng tiêu đề T2…CN */
function buildCalendarDays(year, month) {
  if (!year || !month) return [];

  const firstDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);

  const daysInMonth = firstDay.daysInMonth();

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

function buildCalendarUrl({ date, time, title, location }) {
  if (!date?.isValid()) return "";

  const [hour, minute] = String(time || "00:00")
    .split(":")
    .map((value) => Number(value) || 0);

  const start = date.hour(hour).minute(minute).second(0);

  const end = start.add(3, "hour");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start.format("YYYYMMDDTHHmmss")}/${end.format("YYYYMMDDTHHmmss")}`,
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
      Attendance: form.value.attendance === "attending" ? "Có tham dự" : "Không tham dự",
      NumberOfPeople: form.value.attendance === "attending" ? form.value.numberOfPeople : 0,
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
      error?.response?.data?.message || error?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
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
.la-events {
  position: relative;

  width: 100%;

  text-align: center;
}

/* =========================================================
   THẺ SỰ KIỆN
========================================================= */

.la-event {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  margin-top: 22px;
}

.la-event__lead {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 16px;
  font-weight: 500;

  line-height: 1.35;
  text-transform: uppercase;
}

.la-event__time {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 20px;
  font-weight: 400;
}

/* =========================================================
   NGÀY
========================================================= */

.la-event__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  margin-top: 4px;

  color: var(--la-ink);
}

.la-event__side {
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-weight: 500;

  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.la-event__bar {
  flex: 0 0 auto;

  width: 1.5px;
  height: 28px;

  border-radius: 999px;

  background-color: var(--la-red);
}

.la-event__day {
  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 32px;
  font-weight: 500;

  line-height: 1;
}

.la-event__year {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 20px;
  font-weight: 500;
}

.la-event__lunar {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;

  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* =========================================================
   ĐÓN KHÁCH / KHAI TIỆC
========================================================= */

.la-event__schedule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;

  margin-top: 16px;
}

.la-schedule {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.la-schedule__label {
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 11px;
  font-weight: 300;

  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.la-schedule__value {
  margin-top: 4px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 20px;
  font-weight: 500;
}

/* =========================================================
   LỊCH THÁNG
========================================================= */

.la-calendar {
  position: relative;

  width: 290px;

  margin: 22px auto 0;
}

.la-calendar__frame {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: fill;

  pointer-events: none;
}

.la-calendar__body {
  position: relative;
  z-index: 10;

  padding: 40px 20px 20px;
}

.la-calendar__month {
  padding: 10px 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.02em;
  text-align: center;
}

.la-calendar__wave {
  display: block;

  width: 100%;

  color: var(--la-red);
}

.la-calendar__weekdays,
.la-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  width: 100%;

  text-align: center;
}

.la-calendar__weekdays span {
  padding: 6px 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 500;

  opacity: 0.6;
}

.la-calendar__days {
  row-gap: 2px;

  padding: 8px 4px;
}

.la-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30px;
}

.la-calendar__day {
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 12px;
}

.la-calendar__heart {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 24px;
}

.la-calendar__heart img {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;

  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.12));
}

.la-calendar__heart b {
  position: relative;
  z-index: 10;

  color: var(--la-paper);

  font-family: var(--la-font-hand);
  font-size: 11px;
  font-weight: 700;
}

/* =========================================================
   THÊM VÀO LỊCH
========================================================= */

.la-event__calendar-link {
  margin-top: 4px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;

  letter-spacing: 0.02em;

  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;

  transition: opacity 0.25s ease;
}

.la-event__calendar-link:hover {
  opacity: 0.7;
}

/* =========================================================
   RSVP
========================================================= */

.la-event__rsvp {
  margin-top: 8px;
}

/* =========================================================
   MODAL
========================================================= */

.la-confirm {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.la-confirm__card {
  position: relative;

  width: min(100%, 440px);
  max-height: 90vh;

  overflow-y: auto;

  padding: 32px 24px 26px;

  border: 1px solid var(--la-hairline);
  border-radius: 20px;

  background-color: var(--la-paper);

  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);

  text-align: center;
}

.la-confirm__close {
  position: absolute;
  top: 10px;
  right: 12px;

  width: 34px;
  height: 34px;

  border: 0;

  color: var(--la-red);

  background: transparent;

  font-size: 26px;
  line-height: 1;

  cursor: pointer;
}

.la-confirm__title {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-display);
  font-size: 24px;
  font-weight: 700;

  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.la-confirm__desc {
  margin: 8px 0 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;

  line-height: 1.5;
}

.la-confirm__recipient {
  margin: 20px 0 0;
  padding: 16px;

  border: 1px solid var(--la-hairline);
  border-radius: 14px;
}

.la-confirm__recipient span {
  display: block;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 300;

  letter-spacing: 0.2em;
}

.la-confirm__recipient strong {
  display: block;

  margin-top: 6px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 22px;
  font-weight: 500;
}

.la-field {
  margin-top: 18px;

  text-align: left;
}

.la-field label {
  display: block;

  margin-bottom: 7px;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 11px;
  font-weight: 300;

  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.la-field input {
  width: 100%;

  padding: 11px 13px;

  border: 1px solid var(--la-hairline);
  border-radius: 10px;

  outline: none;

  background-color: transparent;
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 15px;
}

.la-field input:focus {
  border-color: var(--la-red);
}

.la-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.la-attendance__option {
  padding: 11px 13px;

  border: 1px solid var(--la-hairline);
  border-radius: 10px;

  background-color: transparent;
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;

  text-align: left;

  cursor: pointer;

  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.la-attendance__option span {
  margin-right: 8px;

  color: var(--la-red);
}

.la-attendance__option.selected {
  border-color: var(--la-red);

  background-color: var(--la-hairline-soft);

  font-weight: 600;
}

.la-people {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.la-people button {
  width: 38px;
  height: 38px;

  border: 1px solid var(--la-red);
  border-radius: 50%;

  background-color: transparent;
  color: var(--la-red);

  font-size: 20px;

  cursor: pointer;
}

.la-people strong {
  min-width: 24px;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 18px;

  text-align: center;
}

.la-confirm__error,
.la-confirm__success {
  margin: 16px 0 0;

  padding: 10px;

  border-radius: 10px;

  font-family: var(--la-font-hand);
  font-size: 12px;
}

.la-confirm__error {
  color: #a30a15;

  background-color: rgba(215, 12, 27, 0.08);
}

.la-confirm__success {
  color: #1c6b3a;

  background-color: rgba(28, 107, 58, 0.1);
}

.la-confirm__submit {
  width: 100%;

  margin-top: 20px;
}

.la-confirm__submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================================================
   REVEAL
========================================================= */

.reveal {
  opacity: 0;

  transform: translateY(30px);

  transition:
    opacity 0.8s ease var(--delay, 0ms),
    transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay, 0ms);
}

.reveal.visible {
  opacity: 1;

  transform: translateY(0);
}

/* =========================================================
   MODAL ANIMATION
========================================================= */

.la-modal-enter-active,
.la-modal-leave-active {
  transition: opacity 0.3s ease;
}

.la-modal-enter-from,
.la-modal-leave-to {
  opacity: 0;
}

.la-modal-enter-active .la-confirm__card {
  animation: la-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes la-modal-in {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-event {
    margin-top: 28px;
  }

  .la-event__lead {
    font-size: 20px;
  }

  .la-event__time {
    font-size: 24px;
  }

  .la-event__side {
    font-size: 15px;
  }

  .la-event__day {
    font-size: 38px;
  }

  .la-event__year {
    font-size: 22px;
  }

  .la-event__lunar {
    font-size: 14px;
  }

  .la-schedule__label {
    font-size: 13px;
  }

  .la-schedule__value {
    font-size: 22px;
  }

  .la-calendar {
    width: 330px;
  }

  .la-calendar__body {
    padding: 44px 22px 22px;
  }

  .la-calendar__month {
    font-size: 14px;
  }

  .la-calendar__weekdays span {
    font-size: 11px;
  }

  .la-calendar__cell {
    height: 34px;
  }

  .la-calendar__day {
    font-size: 13px;
  }

  .la-calendar__heart {
    width: 30px;
    height: 28px;
  }

  .la-calendar__heart b {
    font-size: 12px;
  }

  .la-event__calendar-link {
    font-size: 15px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;

    transform: none;

    transition: none;
  }
}
</style>
