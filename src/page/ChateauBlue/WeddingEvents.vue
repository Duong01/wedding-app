<template>
  <section class="ct-events" ref="sectionRef">
    <header v-if="eyebrow || heading" class="ct-events__head">
      <p v-if="eyebrow" class="ct-eyebrow">{{ eyebrow }}</p>

      <h2 v-if="heading">{{ heading }}</h2>
    </header>

    <div class="ct-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="ct-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- EVENT TITLE -->
        <div class="ct-event-heading">
          <h2>{{ event.Title || $t("TIỆC CƯỚI") }}</h2>

          <div class="ct-mini-divider">
            <span></span>
            <i>❦</i>
            <span></span>
          </div>
        </div>

        <!-- DATE -->
        <div v-if="event.hasDate" class="ct-event-date">
          <div class="ct-event-weekday">{{ event.weekday }}</div>

          <div class="ct-event-main-date">
            <div class="ct-date-side">
              <span>{{ $t("THÁNG") }}</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="ct-date-number">{{ event.day }}</div>

            <div class="ct-date-side">
              <span>{{ $t("NĂM") }}</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="ct-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- TIME -->
        <div v-if="event.time" class="ct-event-time">
          <div>
            <small>{{ $t("THỜI GIAN") }}</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- SCHEDULE -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="ct-event-schedule">
          <div v-if="event.receptionTime" class="ct-schedule-row">
            <div class="ct-schedule-dot"><span>❦</span></div>

            <div class="ct-schedule-content">
              <span>{{ $t("ĐÓN KHÁCH") }}</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="ct-schedule-row">
            <div class="ct-schedule-dot"><span>✦</span></div>

            <div class="ct-schedule-content">
              <span>{{ $t("KHAI TIỆC") }}</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- CALENDAR -->
        <div v-if="index === 0 && event.date && event.calendarDays?.length" class="ct-calendar">
          <div class="ct-calendar__header">
            <span>{{ $t("LỊCH") }}</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="ct-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="ct-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="ct-calendar__cell"
              :class="{ empty: !day, active: day === Number(event.day) }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.day)" class="ct-active-day">
                  <span class="ct-active-bloom">❦</span>
                  <span>{{ day }}</span>
                </div>

                <span v-else class="ct-normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="index === 0 && event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="ct-calendar-btn"
          >
            <span>＋</span>
            {{ $t("THÊM VÀO LỊCH") }}
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="ct-rsvp-btn" @click="openConfirmModal(event)">
          <span>❦</span>
          {{ $t("XÁC NHẬN THAM DỰ") }}
          <span>❦</span>
        </button>

        <div class="ct-event-bottom">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>
      <EventMap v-if="index === 0 && showMap" :event="event" />
      </article>
      
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="ct-modal">
        <div v-if="showConfirmModal" class="ct-confirm-overlay" @click.self="closeConfirmModal">
          <div class="ct-confirm-modal">
            <button type="button" class="ct-modal-close" @click="closeConfirmModal">{{ "×" }}</button>

            <div class="ct-modal-header">
              <div class="ct-modal-symbol">❦</div>

              <span>THE CELEBRATION</span>

              <h3>{{ $t("Xác nhận tham dự") }}</h3>

              <p>{{ $t("Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.") }}</p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="ct-recipient-box">
              <span>{{ $t("TRÂN TRỌNG KÍNH MỜI") }}</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="ct-form-group">
              <label>{{ $t("Họ và tên") }}</label>

              <input v-model.trim="form.name" type="text" maxlength="100" :placeholder="$t('Nhập tên của bạn')" />
            </div>

            <!-- ATTENDANCE -->
            <div class="ct-form-group">
              <label>{{ $t("Bạn có tham dự không?") }}</label>

              <div class="ct-attendance">
                <button
                  type="button"
                  class="ct-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  {{ $t("Có, tôi sẽ tham dự") }}
                </button>

                <button
                  type="button"
                  class="ct-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>{{ "×" }}</span>
                  {{ $t("Rất tiếc, tôi không thể tham dự") }}
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="ct-form-group">
              <label>{{ $t("Số người tham dự") }}</label>

              <div class="ct-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="ct-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="ct-form-success">{{ successMessage }}</div>

            <button type="button" class="ct-modal-submit" :disabled="submitting" @click="submitConfirmation">
              {{ submitting ? $t("ĐANG GỬI...") : $t("GỬI XÁC NHẬN") }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import EventMap from "@/components/common/EventMap.vue";
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { Confirm } from "@/model/api";
import { sectionText } from "@/data/sectionTitles";
import { t } from "@/lang";
/*
 * Bản đồ gộp vào từng sự kiện — gate bằng ShowMap.
 */
const showMap = computed(() => props.settings?.ShowMap === true);


const props = defineProps({
  events: { type: Array, default: () => [] },
  recipientName: { type: [Object, Array, String], default: null },
  sections: { type: Object, default: () => ({}) },
  settings: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "events", "Eyebrow", t("TIỆC BÁO HỶ"))
);

const heading = computed(() =>
  sectionText(props.sections, "events", "Heading", t("Thông tin tiệc báo hỷ"))
);

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

      const weekdays = [t("CHỦ NHẬT"), t("THỨ HAI"), t("THỨ BA"), t("THỨ TƯ"), t("THỨ NĂM"), t("THỨ SÁU"), t("THỨ BẢY")];

      weekday = t(weekdays[date.day()]);
    }

    const calendarDays = item.calendarDays || buildCalendarDays(Number(year), Number(month));

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

      lunar: item.LunarDate || item.lunar || "",

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
   CALENDAR
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
    errorMessage.value = t("Vui lòng nhập họ và tên.");
    return;
  }

  if (!form.value.attendance) {
    errorMessage.value = t("Vui lòng chọn xác nhận tham dự.");
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
        form.value.attendance === "attending" ? t("Có tham dự") : t("Không tham dự"),
      NumberOfPeople:
        form.value.attendance === "attending" ? form.value.numberOfPeople : 0,
    };

    const response = await Confirm(payload);

    const result = response?.data;

    if (!result || result.status !== "success") {
      throw new Error(result?.message || t("Không thể gửi xác nhận."));
    }

    successMessage.value = t("Cảm ơn bạn đã xác nhận tham dự ❤️");

    setTimeout(() => {
      closeConfirmModal();
    }, 1800);
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      t("Có lỗi xảy ra. Vui lòng thử lại.");
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
.ct-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   SECTION HEADING
===================================================== */

.ct-events__head {
  margin-bottom: 34px;

  text-align: center;
}

.ct-eyebrow {
  margin: 0;

  color: var(--tc-48546e, #48546e);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ct-events__head h2 {
  margin: 6px 0 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: var(--tc-2f3e5c, #2f3e5c);
}

/* =====================================================
   EVENTS LIST
===================================================== */

.ct-events__list {
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

.ct-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: var(--tc-2f3e5c, #2f3e5c);

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.35);
  border-radius: 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.8), rgba(var(--tc-f4f7fb-rgb, 244, 247, 251), 0.65));

  box-shadow: 0 18px 44px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.08);

  overflow: hidden;
}

.ct-event-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.25);
  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.ct-event-heading {
  width: 100%;
  text-align: center;
}

.ct-event-heading h2 {
  margin: 0 0 8px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: var(--tc-4d5a75, #4d5a75);
}

.ct-mini-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.7));
}

.ct-mini-divider span:last-child {
  transform: rotate(180deg);
}

.ct-mini-divider i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   DATE
===================================================== */

.ct-event-date {
  width: 100%;
  text-align: center;
}

.ct-event-weekday {
  margin-top: 14px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;

  color: var(--tc-48546e, #48546e);
}

.ct-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;

  margin: 8px 0;
}

.ct-date-number {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(44px, 13vw, 76px);
  font-weight: 600;

  line-height: 0.85;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 10px;

  letter-spacing: 0.14em;

  color: var(--tc-48546e, #48546e);
}

.ct-date-side strong {
  font-size: 18px;
  font-weight: 600;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-event-lunar {
  font-size: 14px;
  font-style: italic;

  color: var(--tc-505d78, #505d78);
}

/* =====================================================
   TIME
===================================================== */

.ct-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.3);
}

.ct-event-time div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ct-event-time small {
  font-size: 10px;

  letter-spacing: 0.2em;

  color: var(--tc-48546e, #48546e);
}

.ct-event-time strong {
  font-size: 23px;
  font-weight: 600;

  color: var(--tc-2f3e5c, #2f3e5c);
}

/* =====================================================
   SCHEDULE
===================================================== */

.ct-event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.ct-event-schedule::before {
  content: "";
  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.45);
}

.ct-schedule-row {
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;

  min-height: 42px;
}

.ct-schedule-dot {
  position: absolute;
  left: -28px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid var(--tc-4d5a75, #4d5a75);

  background: var(--tc-fafbfd, #fafbfd);

  z-index: 2;
}

.ct-schedule-dot span {
  font-size: 11px;

  color: var(--tc-48546e, #48546e);
}

.ct-schedule-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.ct-schedule-content span {
  font-size: 11px;

  letter-spacing: 0.16em;

  color: var(--tc-505d78, #505d78);
}

.ct-schedule-content strong {
  font-size: 21px;
  font-weight: 600;

  color: var(--tc-2f3e5c, #2f3e5c);
}

/* =====================================================
   CALENDAR
===================================================== */

.ct-calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.ct-calendar__header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.ct-calendar__header span {
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: var(--tc-48546e, #48546e);
}

.ct-calendar__header strong {
  font-size: 11px;

  letter-spacing: 0.1em;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-calendar__weekdays,
.ct-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.ct-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.25);
}

.ct-calendar__weekdays span {
  font-size: 10px;
  font-weight: 700;

  color: var(--tc-48546e, #48546e);
}

.ct-calendar__cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.ct-normal-day {
  font-size: 12px;

  color: var(--tc-5a6378, #5a6378);
}

.ct-active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.ct-active-bloom {
  position: absolute;

  font-size: 31px;

  color: var(--tc-4d5a75, #4d5a75);
}

.ct-active-day span:last-child {
  position: relative;

  font-weight: 700;

  color: var(--tc-fcfdfe, #fcfdfe);
}

.ct-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 15px;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  color: var(--tc-48546e, #48546e);
}

/* =====================================================
   RSVP
===================================================== */

.ct-rsvp-btn {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  padding: 13px 18px;

  border: 0;
  border-radius: 999px;

  color: var(--tc-fcfdfe, #fcfdfe);

  background: linear-gradient(135deg, var(--tc-48546e, #48546e), var(--tc-5c6d8f, #5c6d8f));

  box-shadow: 0 10px 24px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.24);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ct-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.32);
}

/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.ct-event-bottom {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: var(--tc-4d5a75, #4d5a75);
}

.ct-event-bottom span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.6));
}

.ct-event-bottom span:last-child {
  transform: rotate(180deg);
}

.ct-event-bottom i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   REVEAL
===================================================== */

.reveal {
  opacity: 0;

  transform: translateY(35px);

  transition:
    opacity 0.8s ease var(--delay, 0ms),
    transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay, 0ms);
}

.reveal.visible {
  opacity: 1;

  transform: translateY(0);
}

/* =====================================================
   MODAL
===================================================== */

.ct-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(var(--tc-2c3242-rgb, 44, 50, 66), 0.45);

  backdrop-filter: blur(6px);
}

.ct-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.45);
  border-radius: 26px;

  background: linear-gradient(170deg, var(--tc-fdfdfe, #fdfdfe), var(--tc-eff2f8, #eff2f8));

  box-shadow: 0 30px 80px rgba(var(--tc-2c3242-rgb, 44, 50, 66), 0.3);

  text-align: center;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: var(--tc-48546e, #48546e);

  background: transparent;

  cursor: pointer;
}

.ct-modal-header {
  text-align: center;
}

.ct-modal-symbol {
  font-size: 20px;

  margin-bottom: 8px;

  color: var(--tc-4d5a75, #4d5a75);
}

.ct-modal-header > span {
  font-size: 10px;

  letter-spacing: 0.28em;

  color: var(--tc-48546e, #48546e);
}

.ct-modal-header h3 {
  margin: 8px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 32px;
  font-weight: 600;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-modal-header p {
  margin: 0;

  font-size: 14px;

  color: var(--tc-5a6378, #5a6378);
}

/* =====================================================
   FORM
===================================================== */

.ct-form-group {
  margin-top: 20px;

  text-align: left;
}

.ct-form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: var(--tc-48546e, #48546e);
}

.ct-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.4);
  border-radius: 12px;

  outline: none;

  font-size: 16px;

  color: var(--tc-2f3e5c, #2f3e5c);

  background: rgba(var(--tc-fdfdfe-rgb, 253, 253, 254), 0.9);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ct-form-group input:focus {
  border-color: var(--tc-48546e, #48546e);

  box-shadow: 0 0 0 3px rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.14);
}

.ct-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ct-attendance-option {
  padding: 12px 14px;

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.4);
  border-radius: 12px;

  text-align: left;

  font-size: 13px;

  color: var(--tc-2f3e5c, #2f3e5c);

  background: rgba(var(--tc-fdfdfe-rgb, 253, 253, 254), 0.8);

  cursor: pointer;

  transition: all 0.25s ease;
}

.ct-attendance-option.selected {
  border-color: var(--tc-48546e, #48546e);

  background: rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.12);

  font-weight: 600;
}

.ct-attendance-option span {
  margin-right: 8px;

  color: var(--tc-4d5a75, #4d5a75);
}

.ct-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.ct-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid var(--tc-4d5a75, #4d5a75);
  border-radius: 50%;

  font-size: 20px;

  color: var(--tc-2f3e5c, #2f3e5c);

  background: var(--tc-fafbfd, #fafbfd);

  cursor: pointer;
}

.ct-people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px dashed rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.5);
  border-radius: 16px;

  text-align: center;

  background: rgba(var(--tc-fcfcfd-rgb, 252, 252, 253), 0.7);
}

.ct-recipient-box span {
  display: block;

  font-size: 10px;

  letter-spacing: 0.22em;

  color: var(--tc-48546e, #48546e);
}

.ct-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "Allura", cursive;
  font-size: 28px;
  font-weight: 400;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-form-error,
.ct-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 10px;

  text-align: center;

  font-size: 12px;
}

.ct-form-error {
  color: var(--tc-8a6a3a, #8a6a3a);

  background: rgba(var(--tc-8a6a3a-rgb, 138, 106, 58), 0.08);
}

.ct-form-success {
  color: var(--tc-8a7354, #8a7354);

  background: rgba(var(--tc-8a7354-rgb, 138, 115, 84), 0.08);
}

.ct-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 0;
  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: var(--tc-fcfdfe, #fcfdfe);

  background: linear-gradient(135deg, var(--tc-48546e, #48546e), var(--tc-5c6d8f, #5c6d8f));

  box-shadow: 0 10px 24px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.24);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.ct-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.ct-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.ct-modal-enter-active,
.ct-modal-leave-active {
  transition: opacity 0.3s ease;
}

.ct-modal-enter-from,
.ct-modal-leave-to {
  opacity: 0;
}

.ct-modal-enter-active .ct-confirm-modal {
  animation: ct-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes ct-modal-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
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
  .ct-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .ct-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .ct-event-heading h2 {
    font-size: 26px;
  }

  .ct-event-main-date {
    gap: 14px;
  }

  .ct-date-number {
    font-size: 62px;
  }

  .ct-date-side strong {
    font-size: 16px;
  }

  .ct-event-schedule {
    width: min(100%, 340px);
  }

  .ct-schedule-content strong {
    font-size: 19px;
  }

  .ct-calendar {
    width: min(100%, 360px);
  }

  .ct-rsvp-btn {
    width: min(100%, 360px);
  }

  .ct-confirm-modal {
    padding: 35px 20px 25px;
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

  .ct-rsvp-btn,
  .ct-modal-submit {
    transition: none;
  }
}
</style>
