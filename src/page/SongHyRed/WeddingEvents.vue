<template>
  <section class="shy-events" ref="sectionRef">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shy-bar">THÔNG TIN TIỆC CƯỚI</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-events__inner">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="shy-event reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- GIỜ + NGÀY -->
        <template v-if="event.hasDate">
          <h3 class="shy-event__title">Tiệc cưới sẽ diễn ra vào lúc:</h3>

          <p v-if="event.time" class="shy-event__time">{{ event.time }}</p>

          <div class="shy-event__date-row">
            <span class="shy-event__weekday">{{ event.weekday }}</span>

            <span class="shy-event__sep" aria-hidden="true"></span>

            <span class="shy-event__day">{{ event.day }}</span>

            <span class="shy-event__sep" aria-hidden="true"></span>

            <span class="shy-event__weekday">THÁNG {{ event.month }}</span>
          </div>

          <p class="shy-event__year">{{ event.year }}</p>

          <p v-if="event.lunar" class="shy-event__lunar">({{ event.lunar }})</p>

          <!-- ĐẾM NGƯỢC -->
          <div class="shy-countdown">
            <p class="shy-countdown__label">CÙNG ĐẾM NGƯỢC</p>

            <div class="shy-countdown__grid">
              <div class="shy-countdown__cell">
                <strong>{{ countdown.days }}</strong>
                <span>NGÀY</span>
              </div>

              <div class="shy-countdown__cell">
                <strong>{{ countdown.hours }}</strong>
                <span>GIỜ</span>
              </div>

              <div class="shy-countdown__cell">
                <strong>{{ countdown.minutes }}</strong>
                <span>PHÚT</span>
              </div>

              <div class="shy-countdown__cell">
                <strong>{{ countdown.seconds }}</strong>
                <span>GIÂY</span>
              </div>
            </div>
          </div>

          <!-- LỊCH THÁNG -->
          <div v-if="event.calendarDays.length" class="shy-calendar">
            <p class="shy-calendar__month">Tháng {{ Number(event.month) }} / {{ event.year }}</p>

            <div class="shy-calendar__weekdays">
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span>CN</span>
            </div>

            <div class="shy-calendar__days">
              <div
                v-for="(day, dayIndex) in event.calendarDays"
                :key="dayIndex"
                class="shy-calendar__cell"
              >
                <template v-if="day">
                  <span v-if="day === Number(event.day)" class="shy-calendar__heart">
                    <svg viewBox="0 0 24 22" aria-hidden="true">
                      <path
                        d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z"
                        fill="currentColor"
                      />
                    </svg>

                    <b>{{ day }}</b>
                  </span>

                  <span v-else class="shy-calendar__day">{{ day }}</span>
                </template>
              </div>
            </div>

            <a
              v-if="event.calendarUrl"
              :href="event.calendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="shy-calendar__link"
            >
              Thêm vào lịch
            </a>
          </div>
        </template>

        <!-- ĐỊA ĐIỂM -->
        <div v-if="event.location || event.address" class="shy-event__place">
          <p v-if="event.location" class="shy-event__place-name">{{ event.location }}</p>

          <p v-if="event.address" class="shy-event__place-address">{{ event.address }}</p>
        </div>

        <!-- RSVP -->
        <button type="button" class="shy-rsvp-btn" @click="openConfirmModal(event)">
          XÁC NHẬN THAM DỰ
        </button>
      </article>
    </div>

    <!-- =====================================================
         MODAL XÁC NHẬN
    ====================================================== -->

    <Teleport to="body">
      <Transition name="shy-modal">
        <div v-if="showConfirmModal" class="shy-confirm-overlay" @click.self="closeConfirmModal">
          <div class="shy-confirm-modal">
            <button type="button" class="shy-modal-close" @click="closeConfirmModal">×</button>

            <div class="shy-modal-header">
              <span>THE CELEBRATION</span>

              <h3>Xác nhận tham dự</h3>

              <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
            </div>

            <!-- KHÁCH ĐƯỢC MỜI -->
            <div v-if="hasRecipient" class="shy-recipient-box">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- HỌ TÊN -->
            <div v-else class="shy-form-group">
              <label>Họ và tên</label>

              <input
                v-model.trim="form.name"
                type="text"
                maxlength="100"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <!-- THAM DỰ -->
            <div class="shy-form-group">
              <label>Bạn có tham dự không?</label>

              <div class="shy-attendance">
                <button
                  type="button"
                  class="shy-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="shy-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>×</span>
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <!-- SỐ NGƯỜI -->
            <div v-if="form.attendance === 'attending'" class="shy-form-group">
              <label>Số người tham dự</label>

              <div class="shy-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="shy-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="shy-form-success">{{ successMessage }}</div>

            <button
              type="button"
              class="shy-modal-submit"
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

      lunar: item.LunarDate || item.Lunar || item.lunar || "",

      location: item.Location || item.location || "",

      address: item.Address || item.address || "",

      calendarUrl: item.CalendarUrl || item.calendarUrl || "",

      calendarDays,
    };
  });
});

/* =========================================
   ĐẾM NGƯỢC
========================================= */

const now = ref(Date.now());

let countdownTimer;

const targetTime = computed(() => {
  const first = normalizedEvents.value.find((event) => event.hasDate);

  if (!first) return null;

  const date = dayjs(first.date);

  if (!date.isValid()) return null;

  const [hour, minute] = String(first.time || "00:00")
    .split(":")
    .map((part) => Number(part) || 0);

  return date.hour(hour).minute(minute).second(0).valueOf();
});

const countdown = computed(() => {
  const pad = (value) => String(Math.max(0, value)).padStart(2, "0");

  if (!targetTime.value) {
    return { days: "--", hours: "--", minutes: "--", seconds: "--" };
  }

  const distance = targetTime.value - now.value;

  if (distance <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const seconds = Math.floor(distance / 1000);

  return {
    days: pad(Math.floor(seconds / 86400)),
    hours: pad(Math.floor((seconds % 86400) / 3600)),
    minutes: pad(Math.floor((seconds % 3600) / 60)),
    seconds: pad(seconds % 60),
  };
});

/* =========================================
   LỊCH THÁNG
========================================= */

function buildCalendarDays(year, month) {
  if (!year || !month) return [];

  const firstDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);

  const daysInMonth = firstDay.daysInMonth();

  /* Lịch bắt đầu từ thứ Hai */
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
  countdownTimer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);

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
  window.clearInterval(countdownTimer);

  observer?.disconnect();

  document.body.style.overflow = "";
});
</script>

<style scoped>
.shy-events {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-events__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 24px 8px 32px;

  text-align: center;
}

.shy-event + .shy-event {
  margin-top: 40px;
  padding-top: 32px;

  border-top: 1px solid color-mix(in srgb, var(--shy-red) 18%, transparent);
}

/* =========================================================
   GIỜ + NGÀY
========================================================= */

.shy-event__title {
  margin: 0;

  color: var(--shy-red);

  font-size: 16px;
  font-weight: 400;

  text-transform: uppercase;
}

.shy-event__time {
  margin: 8px 0 0;

  color: var(--shy-red);

  font-size: 20px;
  font-weight: 600;
}

.shy-event__date-row {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 20px;
}

.shy-event__weekday {
  width: 70px;

  color: var(--shy-ink);

  font-size: 14px;

  white-space: nowrap;

  text-transform: uppercase;
}

.shy-event__weekday:first-child {
  text-align: right;
}

.shy-event__weekday:last-child {
  text-align: left;
}

.shy-event__sep {
  width: 1px;
  height: 25px;

  margin: 0 12px;

  background: color-mix(in srgb, var(--shy-ink) 50%, transparent);
}

.shy-event__day {
  color: var(--shy-red);

  font-size: 32px;
}

.shy-event__year {
  margin: 8px 0 0;

  color: var(--shy-ink);

  font-size: 20px;
}

.shy-event__lunar {
  margin: 8px 0 0;

  color: var(--shy-ink);

  font-size: 13px;
}

/* =========================================================
   ĐẾM NGƯỢC
========================================================= */

.shy-countdown {
  margin-top: 24px;
}

.shy-countdown__label {
  margin: 0 0 10px;

  color: var(--shy-red);

  font-size: 11px;

  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

.shy-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.shy-countdown__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  padding: 10px 4px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 22%, transparent);
  border-radius: 8px;

  background: color-mix(in srgb, var(--shy-red) 4%, transparent);
}

.shy-countdown__cell strong {
  color: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 22px;
  font-weight: 700;

  font-variant-numeric: tabular-nums;
}

.shy-countdown__cell span {
  color: var(--shy-ink);

  font-size: 10px;

  letter-spacing: 0.12em;
}

/* =========================================================
   LỊCH THÁNG
========================================================= */

.shy-calendar {
  width: 100%;
  max-width: 296px;

  margin: 24px auto 0;

  border: 1px solid color-mix(in srgb, var(--shy-red) 27%, transparent);
  border-radius: 8px;

  overflow: hidden;
}

.shy-calendar__month {
  margin: 0;

  padding: 10px 0;

  border-bottom: 1px solid color-mix(in srgb, var(--shy-red) 27%, transparent);

  color: var(--shy-red);

  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.05em;
}

.shy-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  border-bottom: 2px solid var(--shy-red);
}

.shy-calendar__weekdays span {
  padding: 6px 0;

  color: var(--shy-ink);

  font-size: 10px;
  font-weight: 500;

  opacity: 0.6;
}

.shy-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 2px;

  padding: 8px 4px;
}

.shy-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30px;
}

.shy-calendar__day {
  color: var(--shy-ink);

  font-size: 12px;
}

.shy-calendar__heart {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 24px;

  color: var(--shy-red);
}

.shy-calendar__heart svg {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
}

.shy-calendar__heart b {
  position: relative;
  z-index: 1;

  color: #ffffff;

  font-size: 11px;
  font-weight: 700;
}

.shy-calendar__link {
  display: inline-block;

  margin: 4px 0 14px;

  color: var(--shy-red);

  font-size: 13px;

  letter-spacing: 0.05em;

  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;

  transition: opacity 0.25s ease;
}

.shy-calendar__link:hover {
  opacity: 0.7;
}

/* =========================================================
   ĐỊA ĐIỂM
========================================================= */

.shy-event__place {
  margin-top: 20px;
}

.shy-event__place-name {
  margin: 0;

  color: var(--shy-red);

  font-size: 15px;
  font-weight: 600;
}

.shy-event__place-address {
  margin: 4px 0 0;

  color: var(--shy-ink);

  font-size: 13px;

  line-height: 1.5;
}

/* =========================================================
   NÚT RSVP
========================================================= */

.shy-rsvp-btn {
  margin-top: 24px;
  padding: 10px 18px;

  border: 0;
  border-radius: 10px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 14px;
  font-weight: 600;

  letter-spacing: 0.05em;

  cursor: pointer;

  transition: transform 0.25s ease;
}

.shy-rsvp-btn:hover {
  transform: scale(1.03);
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

.reveal {
  opacity: 0;

  transform: translateY(22px);

  transition: opacity 0.7s ease var(--delay, 0ms),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms);
}

.reveal.visible {
  opacity: 1;

  transform: none;
}

/* =========================================================
   MODAL XÁC NHẬN
========================================================= */

.shy-confirm-overlay {
  position: fixed;
  z-index: 3000;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(40, 0, 0, 0.6);

  backdrop-filter: blur(3px);
}

.shy-confirm-modal {
  position: relative;

  width: min(100%, 420px);
  max-height: 90vh;

  padding: 26px 22px 22px;

  border-radius: 12px;

  background: var(--shy-bg, #fff7eb);

  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.3);

  overflow-y: auto;

  font-family: Baskerville, "Times New Roman", serif;
}

.shy-modal-close {
  position: absolute;

  right: 12px;
  top: 10px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: var(--shy-red, #800000);

  background: transparent;

  font-size: 22px;
  line-height: 1;

  cursor: pointer;
}

.shy-modal-header {
  text-align: center;
}

.shy-modal-header span {
  color: var(--shy-red, #800000);

  font-size: 10px;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shy-modal-header h3 {
  margin: 6px 0 6px;

  color: var(--shy-red, #800000);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 26px;
  font-weight: 500;
}

.shy-modal-header p {
  margin: 0;

  color: var(--shy-ink, #666666);

  font-size: 13px;

  line-height: 1.5;
}

.shy-recipient-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  margin-top: 18px;
  padding: 12px;

  border: 1px solid color-mix(in srgb, var(--shy-red, #800000) 22%, transparent);
  border-radius: 8px;
}

.shy-recipient-box span {
  color: var(--shy-ink, #666666);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.shy-recipient-box strong {
  color: var(--shy-red, #800000);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 20px;
  font-weight: 500;
}

.shy-form-group {
  margin-top: 16px;
}

.shy-form-group label {
  display: block;

  margin-bottom: 6px;

  color: var(--shy-red, #800000);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.08em;
}

.shy-form-group input {
  width: 100%;

  padding: 11px 12px;

  border: 1px solid color-mix(in srgb, var(--shy-red, #800000) 25%, transparent);
  border-radius: 8px;

  outline: 0;

  color: var(--shy-ink, #666666);

  background: #ffffff;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 15px;
}

.shy-form-group input:focus {
  border-color: var(--shy-red, #800000);
}

.shy-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shy-attendance-option {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 11px 12px;

  border: 1px solid color-mix(in srgb, var(--shy-red, #800000) 25%, transparent);
  border-radius: 8px;

  color: var(--shy-ink, #666666);

  background: #ffffff;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 14px;

  text-align: left;

  cursor: pointer;

  transition: border-color 0.2s ease, background 0.2s ease;
}

.shy-attendance-option span {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  border-radius: 50%;

  color: #ffffff;

  background: color-mix(in srgb, var(--shy-red, #800000) 35%, transparent);

  font-size: 12px;
}

.shy-attendance-option.selected {
  border-color: var(--shy-red, #800000);

  background: color-mix(in srgb, var(--shy-red, #800000) 7%, transparent);
}

.shy-attendance-option.selected span {
  background: var(--shy-red, #800000);
}

.shy-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.shy-people-control button {
  width: 34px;
  height: 34px;

  border: 1px solid color-mix(in srgb, var(--shy-red, #800000) 30%, transparent);
  border-radius: 50%;

  color: var(--shy-red, #800000);

  background: #ffffff;

  font-size: 18px;
  line-height: 1;

  cursor: pointer;
}

.shy-people-control strong {
  min-width: 30px;

  color: var(--shy-red, #800000);

  font-size: 20px;

  text-align: center;
}

.shy-form-error,
.shy-form-success {
  margin-top: 14px;
  padding: 10px 12px;

  border-radius: 8px;

  font-size: 13px;

  text-align: center;
}

.shy-form-error {
  color: #a11;
  background: rgba(170, 17, 17, 0.08);
}

.shy-form-success {
  color: #1c6b3a;
  background: rgba(28, 107, 58, 0.1);
}

.shy-modal-submit {
  width: 100%;

  margin-top: 18px;
  padding: 13px;

  border: 0;
  border-radius: 10px;

  color: var(--shy-cream, #ffeed2);

  background: var(--shy-red, #800000);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 14px;
  font-weight: 600;

  letter-spacing: 0.1em;

  cursor: pointer;

  transition: opacity 0.25s ease;
}

.shy-modal-submit:disabled {
  cursor: not-allowed;

  opacity: 0.6;
}

/* =========================================================
   TRANSITION
========================================================= */

.shy-modal-enter-active,
.shy-modal-leave-active {
  transition: opacity 0.3s ease;
}

.shy-modal-enter-from,
.shy-modal-leave-to {
  opacity: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-events__inner {
    width: min(100%, 600px);

    padding: 32px 5px 44px;
  }

  .shy-event__title {
    font-size: 20px;
  }

  .shy-event__time {
    font-size: 24px;
  }

  .shy-event__weekday {
    width: 85px;

    font-size: 15px;
  }

  .shy-event__sep {
    margin: 0 16px;
  }

  .shy-event__day {
    font-size: 38px;
  }

  .shy-event__year {
    font-size: 22px;
  }

  .shy-event__lunar {
    font-size: 14px;
  }

  .shy-countdown__cell strong {
    font-size: 28px;
  }

  .shy-calendar {
    max-width: 352px;
  }

  .shy-calendar__cell {
    height: 34px;
  }

  .shy-calendar__day {
    font-size: 13px;
  }

  .shy-calendar__heart {
    width: 30px;
    height: 28px;
  }

  .shy-calendar__heart b {
    font-size: 12px;
  }

  .shy-event__place-name {
    font-size: 18px;
  }

  .shy-event__place-address {
    font-size: 15px;
  }

  .shy-rsvp-btn {
    font-size: 16px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;

    transform: none;

    transition: none;
  }

  .shy-rsvp-btn,
  .shy-modal-enter-active,
  .shy-modal-leave-active {
    transition: none;
  }
}
</style>
