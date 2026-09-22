<template>
  <section ref="sectionRef" class="cr-events">
    <img
      :src="decorativeDiamond"
      alt=""
      aria-hidden="true"
      class="cr-events__diamond"
      draggable="false"
    />

    <header class="cr-heading">
      <h2 class="cr-heading__vi">Thông tin tiệc cưới</h2>

      <p class="cr-heading__zh">婚宴資訊</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>
    </header>

    <div class="cr-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="cr-event reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <h3 class="cr-event__title">{{ event.Title || "TIỆC CƯỚI" }}</h3>

        <div class="cr-event__ornament" aria-hidden="true">
          <span></span>
          <i>❀</i>
          <span></span>
        </div>

        <!-- NGÀY -->
        <div v-if="event.hasDate" class="cr-event__date">
          <div class="cr-event__weekday">{{ event.weekday }}</div>

          <div class="cr-event__date-main">
            <div class="cr-date-side">
              <span>THÁNG</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="cr-event__day">{{ event.day }}</div>

            <div class="cr-date-side">
              <span>NĂM</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="cr-event__lunar">{{ event.lunar }}</div>
        </div>

        <!-- GIỜ -->
        <div v-if="event.time" class="cr-event__time">
          <span>THỜI GIAN</span>
          <strong>{{ event.time }}</strong>
        </div>

        <!-- ĐÓN KHÁCH / KHAI TIỆC -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="cr-event__schedule">
          <div v-if="event.receptionTime" class="cr-schedule-row">
            <span class="cr-schedule-row__dot" aria-hidden="true">❀</span>

            <div>
              <span>ĐÓN KHÁCH</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="cr-schedule-row">
            <span class="cr-schedule-row__dot" aria-hidden="true">❀</span>

            <div>
              <span>KHAI TIỆC</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- ĐỊA ĐIỂM -->
        <div v-if="event.location || event.address" class="cr-event__place">
          <span class="cr-event__place-label">ĐỊA ĐIỂM</span>

          <p v-if="event.location" class="cr-event__place-name">{{ event.location }}</p>

          <p v-if="event.address" class="cr-event__place-address">{{ event.address }}</p>
        </div>

        <!-- LỊCH -->
        <div v-if="event.date && event.calendarDays?.length" class="cr-calendar">
          <div class="cr-calendar__header">
            <span>LỊCH</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="cr-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="cr-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="cr-calendar__cell"
              :class="{ 'is-empty': !day, 'is-active': day === Number(event.day) }"
            >
              <template v-if="day">
                <span v-if="day === Number(event.day)" class="cr-calendar__heart">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d="M12 21s-7.5-4.7-9.3-9A5.3 5.3 0 0 1 12 6.6a5.3 5.3 0 0 1 9.3 5.4C19.5 16.3 12 21 12 21z"
                    />
                  </svg>

                  <b>{{ day }}</b>
                </span>

                <span v-else class="cr-calendar__day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="cr-calendar__btn"
          >
            ＋ THÊM VÀO LỊCH
          </a>
        </div>

        <!-- XÁC NHẬN -->
        <button type="button" class="cr-rsvp-btn" @click="openConfirmModal(event)">
          XÁC NHẬN THAM DỰ
        </button>
      </article>
    </div>

    <!-- =====================================================
         MODAL XÁC NHẬN
    ====================================================== -->
    <Teleport to="body">
      <Transition name="cr-modal">
        <div v-if="showConfirmModal" class="cr-confirm" @click.self="closeConfirmModal">
          <div class="cr-confirm__card">
            <button type="button" class="cr-confirm__close" @click="closeConfirmModal">×</button>

            <img
              :src="doubleHappiness"
              alt="囍"
              class="cr-confirm__happiness"
              draggable="false"
            />

            <h3 class="cr-confirm__title">Xác nhận tham dự</h3>

            <p class="cr-confirm__desc">
              Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.
            </p>

            <div v-if="hasRecipient" class="cr-confirm__recipient">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <div v-else class="cr-field">
              <label>Họ và tên</label>

              <input
                v-model.trim="form.name"
                type="text"
                maxlength="100"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div class="cr-field">
              <label>Bạn có tham dự không?</label>

              <div class="cr-attendance">
                <button
                  type="button"
                  class="cr-attendance__option"
                  :class="{ 'is-selected': form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="cr-attendance__option"
                  :class="{ 'is-selected': form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <div v-if="form.attendance === 'attending'" class="cr-field">
              <label>Số người tham dự</label>

              <div class="cr-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <p v-if="errorMessage" class="cr-form-error">{{ errorMessage }}</p>
            <p v-if="successMessage" class="cr-form-success">{{ successMessage }}</p>

            <button
              type="button"
              class="cr-confirm__submit"
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

import { decorativeDiamond, doubleHappiness } from "./emeraldLuxeAssets";

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
   CHUẨN HOÁ SỰ KIỆN
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
   LỊCH THÁNG
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
   XÁC NHẬN THAM DỰ
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
   HIỆN DẦN KHI CUỘN
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
.cr-events {
  position: relative;

  width: 100%;

  overflow: hidden;

  color: var(--cr-ink);
}

.cr-events__diamond {
  position: absolute;

  top: 40px;
  left: -18px;

  width: 84px;
  height: 84px;

  object-fit: contain;

  opacity: 0.5;

  pointer-events: none;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cr-heading {
  position: relative;

  text-align: center;

  margin-bottom: 26px;
}

.cr-heading__vi {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-heading__zh {
  margin: 4px 0 0;

  font-family: "Noto Serif SC", serif;

  font-size: 0.85em;

  letter-spacing: 0.3em;
  text-indent: 0.3em;

  opacity: 0.7;

  color: var(--cr-soft);
}

.cr-heading__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 12px;

  color: var(--cr-accent);
}

.cr-heading__ornament span {
  width: 52px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-heading__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-heading__ornament i {
  font-size: 13px;
  font-style: normal;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.cr-events__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.cr-event {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 26px 20px 24px;

  text-align: center;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.18);
  border-radius: 18px;

  background: rgba(var(--cr-surface-rgb), 0.88);

  box-shadow: 0 14px 34px rgba(var(--cr-ink-rgb), 0.08);

  opacity: 0;

  transform: translateY(24px);

  transition: opacity 0.7s ease var(--delay, 0ms),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms);
}

.cr-event.visible {
  opacity: 1;

  transform: none;
}

.cr-event__title {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(20px, 5.5vw, 26px);
  font-weight: 400;

  letter-spacing: 0.08em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-event__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 10px 0 18px;

  color: var(--cr-accent);
}

.cr-event__ornament span {
  width: 40px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-event__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-event__ornament i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   NGÀY
========================================================= */

.cr-event__weekday {
  color: var(--cr-ink);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.26em;
}

.cr-event__date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 280px;

  margin: 10px auto 0;
}

.cr-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.cr-date-side span {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.cr-date-side strong {
  color: var(--cr-ink);

  font-size: 18px;
  font-weight: 600;
}

.cr-event__day {
  padding: 0 18px;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 56px;

  line-height: 0.95;

  color: var(--cr-ink);
}

.cr-event__lunar {
  margin-top: 10px;

  color: var(--cr-soft);

  font-size: 11px;
  font-style: italic;
}

/* =========================================================
   GIỜ
========================================================= */

.cr-event__time {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 16px;
  padding-top: 14px;

  border-top: 1px solid rgba(var(--cr-accent-rgb), 0.9);
}

.cr-event__time span {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.cr-event__time strong {
  margin-top: 2px;

  color: var(--cr-ink);

  font-size: 20px;
  font-weight: 600;
}

/* =========================================================
   ĐÓN KHÁCH / KHAI TIỆC
========================================================= */

.cr-event__schedule {
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-top: 16px;
}

.cr-schedule-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 10px 14px;

  border: 1px solid rgba(var(--cr-accent-rgb), 0.9);
  border-radius: 12px;

  background: rgba(var(--cr-bg-rgb), 0.7);
}

.cr-schedule-row__dot {
  color: var(--cr-accent);

  font-size: 13px;
}

.cr-schedule-row div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cr-schedule-row span {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.18em;
}

.cr-schedule-row strong {
  color: var(--cr-ink);

  font-size: 15px;
  font-weight: 600;
}

/* =========================================================
   ĐỊA ĐIỂM
========================================================= */

.cr-event__place {
  margin-top: 16px;
  padding-top: 14px;

  border-top: 1px solid rgba(var(--cr-accent-rgb), 0.9);
}

.cr-event__place-label {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.cr-event__place-name {
  margin: 4px 0 0;

  color: var(--cr-ink);

  font-size: 14px;
  font-weight: 600;

  line-height: 1.45;
}

.cr-event__place-address {
  margin: 4px 0 0;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.55;
}

/* =========================================================
   LỊCH
========================================================= */

.cr-calendar {
  margin-top: 18px;
  padding: 16px 12px 14px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.16);
  border-radius: 14px;

  background: rgba(var(--cr-bg-rgb), 0.6);
}

.cr-calendar__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-bottom: 12px;
}

.cr-calendar__header span {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.cr-calendar__header strong {
  color: var(--cr-ink);

  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.14em;
}

.cr-calendar__weekdays,
.cr-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.cr-calendar__weekdays {
  margin-bottom: 6px;
}

.cr-calendar__weekdays span {
  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  text-align: center;
}

.cr-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;

  aspect-ratio: 1;

  font-size: 12px;
}

.cr-calendar__day {
  color: var(--cr-soft);
}

.cr-calendar__heart {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
}

.cr-calendar__heart svg {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  color: var(--cr-accent);
}

.cr-calendar__heart b {
  position: relative;

  color: var(--cr-ink);

  font-size: 12px;
  font-weight: 700;
}

.cr-calendar__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-top: 14px;
  padding: 9px 20px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 999px;

  color: var(--cr-ink);

  background: linear-gradient(135deg, var(--cr-accent-light), var(--cr-accent));

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.16em;

  text-decoration: none;

  transition: transform 0.2s ease;
}

.cr-calendar__btn:hover {
  transform: translateY(-2px);
}

/* =========================================================
   NÚT XÁC NHẬN
========================================================= */

.cr-rsvp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-top: 18px;
  padding: 12px 30px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 999px;

  color: var(--cr-ink);

  background: linear-gradient(135deg, var(--cr-accent-light), var(--cr-accent));

  box-shadow: 0 10px 24px rgba(var(--cr-accent-rgb), 0.45);

  font-family: inherit;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cr-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(var(--cr-accent-rgb), 0.6);
}

/* =========================================================
   MODAL
========================================================= */

.cr-confirm {
  position: fixed;
  inset: 0;

  z-index: 3000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(var(--cr-ink-rgb), 0.5);

  backdrop-filter: blur(3px);
}

.cr-confirm__card {
  position: relative;

  width: min(100%, 400px);
  max-height: 88vh;

  padding: 28px 22px 24px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-radius: 18px;

  background: var(--cr-surface);

  color: var(--cr-ink);
}

.cr-confirm__close {
  position: absolute;

  top: 10px;
  right: 12px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: var(--cr-soft);

  background: rgba(var(--cr-accent-rgb), 0.35);

  font-size: 19px;
  line-height: 1;

  cursor: pointer;
}

.cr-confirm__happiness {
  width: 52px;
  height: 52px;

  object-fit: contain;
}

.cr-confirm__title {
  margin: 8px 0 6px;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 24px;
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;
}

.cr-confirm__desc {
  margin: 0 0 18px;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.6;
}

.cr-confirm__recipient {
  display: flex;
  flex-direction: column;
  gap: 3px;

  margin-bottom: 16px;
  padding: 12px;

  border: 1px solid rgba(var(--cr-accent-rgb), 0.9);
  border-radius: 12px;

  background: rgba(var(--cr-bg-rgb), 0.7);
}

.cr-confirm__recipient span {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.cr-confirm__recipient strong {
  font-family: "Babylonica", "Great Vibes", cursive;

  font-size: 26px;
  font-weight: 400;
}

.cr-field {
  margin-bottom: 16px;

  text-align: left;
}

.cr-field label {
  display: block;

  margin-bottom: 6px;

  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.18em;

  text-transform: uppercase;
}

.cr-field input {
  width: 100%;

  padding: 11px 14px;

  box-sizing: border-box;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 10px;

  background: #fff;

  color: var(--cr-ink);

  font-family: inherit;
  font-size: 14px;

  outline: none;
}

.cr-field input:focus {
  border-color: var(--cr-accent);
}

.cr-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cr-attendance__option {
  padding: 11px 14px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 10px;

  background: #fff;

  color: var(--cr-soft);

  font-family: inherit;
  font-size: 13px;

  text-align: left;

  cursor: pointer;

  transition: border-color 0.2s ease, background 0.2s ease;
}

.cr-attendance__option.is-selected {
  border-color: var(--cr-accent);

  background: rgba(var(--cr-accent-rgb), 0.28);

  color: var(--cr-ink);

  font-weight: 600;
}

.cr-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;

  padding: 8px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 10px;

  background: #fff;
}

.cr-people-control button {
  width: 32px;
  height: 32px;

  border: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-radius: 50%;

  background: rgba(var(--cr-bg-rgb), 0.9);

  color: var(--cr-ink);

  font-size: 17px;
  line-height: 1;

  cursor: pointer;
}

.cr-people-control strong {
  min-width: 26px;

  font-size: 17px;
}

.cr-form-error,
.cr-form-success {
  margin: 0 0 12px;

  font-size: 12px;

  line-height: 1.5;
}

.cr-form-error {
  color: #b3261e;
}

.cr-form-success {
  color: #2e7d32;
}

.cr-confirm__submit {
  width: 100%;

  padding: 13px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 999px;

  color: var(--cr-ink);

  background: linear-gradient(135deg, var(--cr-accent-light), var(--cr-accent));

  font-family: inherit;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;

  cursor: pointer;
}

.cr-confirm__submit:disabled {
  opacity: 0.65;
  cursor: default;
}

/* =========================================================
   CHUYỂN ĐỘNG MODAL
========================================================= */

.cr-modal-enter-active,
.cr-modal-leave-active {
  transition: opacity 0.25s ease;
}

.cr-modal-enter-from,
.cr-modal-leave-to {
  opacity: 0;
}

.cr-modal-enter-active .cr-confirm__card {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.cr-modal-enter-from .cr-confirm__card {
  transform: translateY(20px) scale(0.96);
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .cr-event {
    padding: 22px 14px 20px;
  }

  .cr-event__day {
    padding: 0 12px;

    font-size: 48px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cr-event {
    opacity: 1;

    transform: none;

    transition: none;
  }
}
</style>
