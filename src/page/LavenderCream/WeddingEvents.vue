<template>
  <section class="lc-events" ref="sectionRef">
    <header v-if="eyebrow || heading" class="lc-events__head">
      <p v-if="eyebrow" class="lc-eyebrow">{{ eyebrow }}</p>

      <h2 v-if="heading">{{ heading }}</h2>
    </header>

    <div class="lc-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="lc-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- EVENT TITLE -->
        <div class="lc-event-heading">
          <h2>{{ event.Title || $t("TIỆC CƯỚI") }}</h2>

          <div class="lc-mini-divider">
            <span></span>
            <i>❀</i>
            <span></span>
          </div>
        </div>

        <!-- DATE -->
        <div v-if="event.hasDate" class="lc-event-date">
          <div class="lc-event-weekday">{{ event.weekday }}</div>

          <div class="lc-event-main-date">
            <div class="lc-date-side">
              <span>{{ $t("THÁNG") }}</span>
              <strong>{{ event.month }}</strong>
            </div>

            <div class="lc-date-number">{{ event.day }}</div>

            <div class="lc-date-side">
              <span>{{ $t("NĂM") }}</span>
              <strong>{{ event.year }}</strong>
            </div>
          </div>

          <div v-if="event.lunar" class="lc-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- TIME -->
        <div v-if="event.time" class="lc-event-time">
          <div>
            <small>{{ $t("THỜI GIAN") }}</small>
            <strong>{{ event.time }}</strong>
          </div>
        </div>

        <!-- SCHEDULE -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="lc-event-schedule">
          <div v-if="event.receptionTime" class="lc-schedule-row">
            <div class="lc-schedule-dot"><span>❀</span></div>

            <div class="lc-schedule-content">
              <span>{{ $t("ĐÓN KHÁCH") }}</span>
              <strong>{{ event.receptionTime }}</strong>
            </div>
          </div>

          <div v-if="event.ceremonyTime" class="lc-schedule-row">
            <div class="lc-schedule-dot"><span>✦</span></div>

            <div class="lc-schedule-content">
              <span>{{ $t("KHAI TIỆC") }}</span>
              <strong>{{ event.ceremonyTime }}</strong>
            </div>
          </div>
        </div>

        <!-- CALENDAR -->
        <div v-if="index === 0 && event.date && event.calendarDays?.length" class="lc-calendar">
          <div class="lc-calendar__header">
            <span>{{ $t("LỊCH") }}</span>
            <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
          </div>

          <div class="lc-calendar__weekdays">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          <div class="lc-calendar__days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="lc-calendar__cell"
              :class="{ empty: !day, active: day === Number(event.day) }"
            >
              <template v-if="day">
                <div v-if="day === Number(event.day)" class="lc-active-day">
                  <span class="lc-active-bloom">❀</span>
                  <span>{{ day }}</span>
                </div>

                <span v-else class="lc-normal-day">{{ day }}</span>
              </template>
            </div>
          </div>

          <a
            v-if="index === 0 && event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="lc-calendar-btn"
          >
            <span>＋</span>
            {{ $t("THÊM VÀO LỊCH") }}
          </a>
        </div>

        <!-- RSVP -->
        <button type="button" class="lc-rsvp-btn" @click="openConfirmModal(event)">
          <span>❀</span>
          {{ $t("XÁC NHẬN THAM DỰ") }}
          <span>❀</span>
        </button>

        <div class="lc-event-bottom">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>
      <EventMap v-if="index === 0 && showMap" :event="event" />
      </article>
      
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="lc-modal">
        <div v-if="showConfirmModal" class="lc-confirm-overlay" @click.self="closeConfirmModal">
          <div class="lc-confirm-modal">
            <button type="button" class="lc-modal-close" @click="closeConfirmModal">{{ "×" }}</button>

            <div class="lc-modal-header">
              <div class="lc-modal-symbol">❀</div>

              <span>THE CELEBRATION</span>

              <h3>{{ $t("Xác nhận tham dự") }}</h3>

              <p>{{ $t("Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.") }}</p>
            </div>

            <!-- RECIPIENT -->
            <div v-if="hasRecipient" class="lc-recipient-box">
              <span>{{ $t("TRÂN TRỌNG KÍNH MỜI") }}</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- NAME -->
            <div v-else class="lc-form-group">
              <label>{{ $t("Họ và tên") }}</label>

              <input v-model.trim="form.name" type="text" maxlength="100" :placeholder="$t('Nhập tên của bạn')" />
            </div>

            <!-- ATTENDANCE -->
            <div class="lc-form-group">
              <label>{{ $t("Bạn có tham dự không?") }}</label>

              <div class="lc-attendance">
                <button
                  type="button"
                  class="lc-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  {{ $t("Có, tôi sẽ tham dự") }}
                </button>

                <button
                  type="button"
                  class="lc-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>{{ "×" }}</span>
                  {{ $t("Rất tiếc, tôi không thể tham dự") }}
                </button>
              </div>
            </div>

            <!-- PEOPLE -->
            <div v-if="form.attendance === 'attending'" class="lc-form-group">
              <label>{{ $t("Số người tham dự") }}</label>

              <div class="lc-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="lc-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="lc-form-success">{{ successMessage }}</div>

            <button type="button" class="lc-modal-submit" :disabled="submitting" @click="submitConfirmation">
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
.lc-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   SECTION HEADING
===================================================== */

.lc-events__head {
  margin-bottom: 34px;

  text-align: center;
}

.lc-eyebrow {
  margin: 0;

  color: var(--tc-766384, #766384);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lc-events__head h2 {
  margin: 6px 0 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: var(--tc-584a5b, #584a5b);
}

/* =====================================================
   EVENTS LIST
===================================================== */

.lc-events__list {
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

.lc-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: var(--tc-584a5b, #584a5b);

  border: 1px solid rgba(var(--tc-a086b4-rgb, 160, 134, 180), 0.35);
  border-radius: 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.8), rgba(var(--tc-f6f0fa-rgb, 246, 240, 250), 0.65));

  box-shadow: 0 18px 44px rgba(var(--tc-584a5b-rgb, 88, 74, 91), 0.08);

  overflow: hidden;
}

.lc-event-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(var(--tc-b9a0d0-rgb, 185, 160, 208), 0.25);
  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.lc-event-heading {
  width: 100%;
  text-align: center;
}

.lc-event-heading h2 {
  margin: 0 0 8px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: 0.04em;

  color: var(--tc-584a5b, #584a5b);
}

.lc-mini-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: var(--tc-736482, #736482);
}

.lc-mini-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b9a0d0-rgb, 185, 160, 208), 0.7));
}

.lc-mini-divider span:last-child {
  transform: rotate(180deg);
}

.lc-mini-divider i {
  font-size: 12px;
  font-style: normal;
}

/* =====================================================
   DATE
===================================================== */

.lc-event-date {
  width: 100%;
  text-align: center;
}

.lc-event-weekday {
  margin-top: 14px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;

  color: var(--tc-766384, #766384);
}

.lc-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;

  margin: 8px 0;
}

.lc-date-number {
  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(44px, 13vw, 76px);
  font-weight: 600;

  line-height: 0.85;

  color: var(--tc-584a5b, #584a5b);
}

.lc-date-side {
  display: flex;
  flex-direction: column;
  gap: 3px;

  font-size: 10px;

  letter-spacing: 0.14em;

  color: var(--tc-766384, #766384);
}

.lc-date-side strong {
  font-size: 18px;
  font-weight: 600;

  color: var(--tc-584a5b, #584a5b);
}

.lc-event-lunar {
  font-size: 14px;
  font-style: italic;

  color: var(--tc-736877, #736877);
}

/* =====================================================
   TIME
===================================================== */

.lc-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px auto 0;
  padding: 15px 0;

  border-bottom: 1px solid rgba(var(--tc-b9a0d0-rgb, 185, 160, 208), 0.3);
}

.lc-event-time div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.lc-event-time small {
  font-size: 10px;

  letter-spacing: 0.2em;

  color: var(--tc-766384, #766384);
}

.lc-event-time strong {
  font-size: 23px;
  font-weight: 600;

  color: var(--tc-584a5b, #584a5b);
}

/* =====================================================
   SCHEDULE
===================================================== */

.lc-event-schedule {
  position: relative;

  width: min(100%, 380px);

  margin: 20px auto 0;
  padding-left: 28px;

  text-align: left;
}

.lc-event-schedule::before {
  content: "";
  position: absolute;

  left: 6px;
  top: 12px;
  bottom: 12px;

  width: 1px;

  background: rgba(var(--tc-b9a0d0-rgb, 185, 160, 208), 0.45);
}

.lc-schedule-row {
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;

  min-height: 42px;
}

.lc-schedule-dot {
  position: absolute;
  left: -28px;

  width: 13px;
  height: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid var(--tc-736482, #736482);

  background: var(--tc-faf8fc, #faf8fc);

  z-index: 2;
}

.lc-schedule-dot span {
  font-size: 11px;

  color: var(--tc-766384, #766384);
}

.lc-schedule-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.lc-schedule-content span {
  font-size: 11px;

  letter-spacing: 0.16em;

  color: var(--tc-736877, #736877);
}

.lc-schedule-content strong {
  font-size: 21px;
  font-weight: 600;

  color: var(--tc-584a5b, #584a5b);
}

/* =====================================================
   CALENDAR
===================================================== */

.lc-calendar {
  width: min(100%, 400px);

  margin: 25px auto 0;

  text-align: center;
}

.lc-calendar__header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.lc-calendar__header span {
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: var(--tc-766384, #766384);
}

.lc-calendar__header strong {
  font-size: 11px;

  letter-spacing: 0.1em;

  color: var(--tc-584a5b, #584a5b);
}

.lc-calendar__weekdays,
.lc-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.lc-calendar__weekdays {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(var(--tc-b9a0d0-rgb, 185, 160, 208), 0.25);
}

.lc-calendar__weekdays span {
  font-size: 10px;
  font-weight: 700;

  color: var(--tc-766384, #766384);
}

.lc-calendar__cell {
  min-height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.lc-normal-day {
  font-size: 12px;

  color: var(--tc-6f5f74, #6f5f74);
}

.lc-active-day {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.lc-active-bloom {
  position: absolute;

  font-size: 31px;

  color: var(--tc-736482, #736482);
}

.lc-active-day span:last-child {
  position: relative;

  font-weight: 700;

  color: var(--tc-fbf9ff, #fbf9ff);
}

.lc-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 15px;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  color: var(--tc-766384, #766384);
}

/* =====================================================
   RSVP
===================================================== */

.lc-rsvp-btn {
  width: min(100%, 400px);

  margin: 25px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  padding: 13px 18px;

  border: 0;
  border-radius: 999px;

  color: var(--tc-fbf9ff, #fbf9ff);

  background: linear-gradient(135deg, var(--tc-766384, #766384), var(--tc-7d6390, #7d6390));

  box-shadow: 0 10px 24px rgba(var(--tc-584a5b-rgb, 88, 74, 91), 0.24);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.lc-rsvp-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(var(--tc-584a5b-rgb, 88, 74, 91), 0.32);
}

/* =====================================================
   BOTTOM ORNAMENT
===================================================== */

.lc-event-bottom {
  width: 100%;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: var(--tc-736482, #736482);
}

.lc-event-bottom span {
  width: 60px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b9a0d0-rgb, 185, 160, 208), 0.6));
}

.lc-event-bottom span:last-child {
  transform: rotate(180deg);
}

.lc-event-bottom i {
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

.lc-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(var(--tc-433846-rgb, 67, 56, 70), 0.45);

  backdrop-filter: blur(6px);
}

.lc-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid rgba(var(--tc-a086b4-rgb, 160, 134, 180), 0.45);
  border-radius: 26px;

  background: linear-gradient(170deg, var(--tc-fdfcfe, #fdfcfe), var(--tc-f1ebf4, #f1ebf4));

  box-shadow: 0 30px 80px rgba(var(--tc-433846-rgb, 67, 56, 70), 0.3);

  text-align: center;

  color: var(--tc-584a5b, #584a5b);
}

.lc-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: var(--tc-766384, #766384);

  background: transparent;

  cursor: pointer;
}

.lc-modal-header {
  text-align: center;
}

.lc-modal-symbol {
  font-size: 20px;

  margin-bottom: 8px;

  color: var(--tc-736482, #736482);
}

.lc-modal-header > span {
  font-size: 10px;

  letter-spacing: 0.28em;

  color: var(--tc-766384, #766384);
}

.lc-modal-header h3 {
  margin: 8px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 32px;
  font-weight: 600;

  color: var(--tc-584a5b, #584a5b);
}

.lc-modal-header p {
  margin: 0;

  font-size: 14px;

  color: var(--tc-6f5f74, #6f5f74);
}

/* =====================================================
   FORM
===================================================== */

.lc-form-group {
  margin-top: 20px;

  text-align: left;
}

.lc-form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: var(--tc-766384, #766384);
}

.lc-form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid rgba(var(--tc-a086b4-rgb, 160, 134, 180), 0.4);
  border-radius: 12px;

  outline: none;

  font-size: 16px;

  color: var(--tc-584a5b, #584a5b);

  background: rgba(var(--tc-fdfcfe-rgb, 253, 252, 254), 0.9);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.lc-form-group input:focus {
  border-color: var(--tc-766384, #766384);

  box-shadow: 0 0 0 3px rgba(var(--tc-a086b4-rgb, 160, 134, 180), 0.14);
}

.lc-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lc-attendance-option {
  padding: 12px 14px;

  border: 1px solid rgba(var(--tc-a086b4-rgb, 160, 134, 180), 0.4);
  border-radius: 12px;

  text-align: left;

  font-size: 13px;

  color: var(--tc-584a5b, #584a5b);

  background: rgba(var(--tc-fdfcfe-rgb, 253, 252, 254), 0.8);

  cursor: pointer;

  transition: all 0.25s ease;
}

.lc-attendance-option.selected {
  border-color: var(--tc-766384, #766384);

  background: rgba(var(--tc-a086b4-rgb, 160, 134, 180), 0.12);

  font-weight: 600;
}

.lc-attendance-option span {
  margin-right: 8px;

  color: var(--tc-736482, #736482);
}

.lc-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.lc-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid var(--tc-736482, #736482);
  border-radius: 50%;

  font-size: 20px;

  color: var(--tc-584a5b, #584a5b);

  background: var(--tc-faf8fc, #faf8fc);

  cursor: pointer;
}

.lc-people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;

  color: var(--tc-584a5b, #584a5b);
}

.lc-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px dashed rgba(var(--tc-a086b4-rgb, 160, 134, 180), 0.5);
  border-radius: 16px;

  text-align: center;

  background: rgba(var(--tc-fcfaff-rgb, 252, 250, 255), 0.7);
}

.lc-recipient-box span {
  display: block;

  font-size: 10px;

  letter-spacing: 0.22em;

  color: var(--tc-766384, #766384);
}

.lc-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "Allura", cursive;
  font-size: 28px;
  font-weight: 400;

  color: var(--tc-584a5b, #584a5b);
}

.lc-form-error,
.lc-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 10px;

  text-align: center;

  font-size: 12px;
}

.lc-form-error {
  color: var(--tc-a34d6b, #a34d6b);

  background: rgba(var(--tc-a34d6b-rgb, 163, 77, 107), 0.08);
}

.lc-form-success {
  color: var(--tc-5c7354, #5c7354);

  background: rgba(var(--tc-66805d-rgb, 102, 128, 93), 0.08);
}

.lc-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 14px;

  border: 0;
  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: var(--tc-fbf9ff, #fbf9ff);

  background: linear-gradient(135deg, var(--tc-766384, #766384), var(--tc-7d6390, #7d6390));

  box-shadow: 0 10px 24px rgba(var(--tc-584a5b-rgb, 88, 74, 91), 0.24);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.lc-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.lc-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.lc-modal-enter-active,
.lc-modal-leave-active {
  transition: opacity 0.3s ease;
}

.lc-modal-enter-from,
.lc-modal-leave-to {
  opacity: 0;
}

.lc-modal-enter-active .lc-confirm-modal {
  animation: lc-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes lc-modal-in {
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
  .lc-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .lc-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .lc-event-heading h2 {
    font-size: 26px;
  }

  .lc-event-main-date {
    gap: 14px;
  }

  .lc-date-number {
    font-size: 62px;
  }

  .lc-date-side strong {
    font-size: 16px;
  }

  .lc-event-schedule {
    width: min(100%, 340px);
  }

  .lc-schedule-content strong {
    font-size: 19px;
  }

  .lc-calendar {
    width: min(100%, 360px);
  }

  .lc-rsvp-btn {
    width: min(100%, 360px);
  }

  .lc-confirm-modal {
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

  .lc-rsvp-btn,
  .lc-modal-submit {
    transition: none;
  }
}
</style>
