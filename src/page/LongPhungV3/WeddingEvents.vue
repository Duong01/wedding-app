<template>
  <section class="lp-events" ref="sectionRef">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'events', 'Eyebrow') || sectionOverride(sections, 'events', 'Heading')" class="lp-custom-head">
      <p v-if="sectionOverride(sections, 'events', 'Eyebrow')" class="lp-custom-head__eyebrow">{{ sectionOverride(sections, "events", "Eyebrow") }}</p>
      <h2 v-if="sectionOverride(sections, 'events', 'Heading')" class="lp-custom-head__heading">{{ sectionOverride(sections, "events", "Heading") }}</h2>
    </header>

    <div class="lp-events__list">
      <article
        v-for="(event, index) in normalizedEvents"
        :key="event.Id || event.id || index"
        class="lp-event-card reveal"
        :style="{ '--delay': `${index * 120}ms` }"
      >
        <!-- TIÊU ĐỀ CÓ KHUNG -->
        <div class="lp-section-title">
          <h2>{{ event.Title || $t("TIỆC CƯỚI") }}</h2>
        </div>

        <!-- NGÀY -->
        <div v-if="event.hasDate" class="lp-event-date">
          <div class="lp-event-weekday">{{ event.weekday }}</div>

          <div class="lp-event-main-date">
            <span class="lp-date-part">{{ event.month }}</span>

            <span class="lp-date-day">{{ event.day }}</span>

            <span class="lp-date-part">{{ event.year }}</span>
          </div>

          <div v-if="event.lunar" class="lp-event-lunar">{{ event.lunar }}</div>
        </div>

        <!-- GIỜ -->
        <div v-if="event.time" class="lp-event-time">
          <span class="lp-time-divider" aria-hidden="true"></span>

          <strong>{{ event.time }}</strong>

          <span class="lp-time-divider" aria-hidden="true"></span>
        </div>

        <!-- LỊCH TRÌNH -->
        <div v-if="event.receptionTime || event.ceremonyTime" class="lp-event-schedule">
          <div v-if="event.receptionTime" class="lp-schedule-row">
            <span>{{ $t("ĐÓN KHÁCH") }}</span>
            <strong>{{ event.receptionTime }}</strong>
          </div>

          <div v-if="event.ceremonyTime" class="lp-schedule-row">
            <span>{{ $t("KHAI TIỆC") }}</span>
            <strong>{{ event.ceremonyTime }}</strong>
          </div>
        </div>

        <!-- LỊCH ÂM DƯƠNG — khung frame-calendar -->
        <div v-if="index === 0 && event.date && event.calendarDays?.length" class="lp-calendar">
          <div class="lp-calendar__inner">
            <div class="lp-calendar__header">
              <strong>THÁNG {{ event.month }} · {{ event.year }}</strong>
            </div>

            <div class="lp-calendar__weekdays">
              <span>CN</span>
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
            </div>

            <div class="lp-calendar__days">
              <div
                v-for="(day, dayIndex) in event.calendarDays"
                :key="dayIndex"
                class="lp-calendar__cell"
                :class="{ 'lp-calendar__cell--active': day === Number(event.day) }"
              >
                <span v-if="day">{{ day }}</span>
              </div>
            </div>

            <a
              v-if="index === 0 && event.calendarUrl"
              :href="event.calendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="lp-calendar-btn"
            >
              {{ $t("＋ THÊM VÀO LỊCH") }}
            </a>
          </div>
        </div>

        <!-- RSVP -->
        <button type="button" class="lp-rsvp-btn" @click="openConfirmModal(event)">
          {{ $t("XÁC NHẬN THAM DỰ") }}
        </button>
      <EventMap v-if="index === 0 && showMap" :event="event" />
      </article>
      
    </div>

    <!-- RSVP MODAL -->
    <Teleport to="body">
      <Transition name="lp-modal">
        <div v-if="showConfirmModal" class="lp-confirm-overlay" @click.self="closeConfirmModal">
          <div class="lp-confirm-modal">
            <button type="button" class="lp-modal-close" @click="closeConfirmModal">{{ "×" }}</button>

            <div class="lp-modal-header">
              <img :src="chuHy" alt="" aria-hidden="true" class="lp-modal-symbol" />

              <h3>{{ $t("Xác nhận tham dự") }}</h3>

              <p>{{ $t("Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.") }}</p>
            </div>

            <!-- NGƯỜI NHẬN -->
            <div v-if="hasRecipient" class="lp-recipient-box">
              <span>{{ $t("TRÂN TRỌNG KÍNH MỜI") }}</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- TÊN -->
            <div v-else class="lp-form-group">
              <label>{{ $t("Họ và tên") }}</label>

              <input v-model.trim="form.name" type="text" maxlength="100" :placeholder="$t('Nhập tên của bạn')" />
            </div>

            <!-- THAM DỰ -->
            <div class="lp-form-group">
              <label>{{ $t("Bạn có tham dự không?") }}</label>

              <div class="lp-attendance">
                <button
                  type="button"
                  class="lp-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  {{ $t("Có, tôi sẽ tham dự") }}
                </button>

                <button
                  type="button"
                  class="lp-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>{{ "×" }}</span>
                  {{ $t("Rất tiếc, tôi không thể tham dự") }}
                </button>
              </div>
            </div>

            <!-- SỐ NGƯỜI -->
            <div v-if="form.attendance === 'attending'" class="lp-form-group">
              <label>{{ $t("Số người tham dự") }}</label>

              <div class="lp-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="lp-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="lp-form-success">{{ successMessage }}</div>

            <button type="button" class="lp-modal-submit" :disabled="submitting" @click="submitConfirmation">
              {{ submitting ? $t("ĐANG GỬI...") : $t("GỬI XÁC NHẬN") }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { sectionOverride } from "@/data/sectionTitles";
import EventMap from "@/components/common/EventMap.vue";
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { Confirm } from "@/model/api";
import chuHy from "@/assets/decor/longphung-v3/chu-hy.webp";
import { t } from "@/lang";
/*
 * Bản đồ gộp vào từng sự kiện — gate bằng ShowMap.
 */
const showMap = computed(() => props.settings?.ShowMap === true);


const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  events: { type: Array, default: () => [] },
  recipientName: { type: [Object, Array, String], default: null },
  settings: { type: Object, default: () => ({}) },
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
.lp-events {
  position: relative;

  width: 100%;

  overflow: hidden;
}

/* =====================================================
   DANH SÁCH SỰ KIỆN
===================================================== */

.lp-events__list {
  width: min(100%, 680px);
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 34px;
}

/* =====================================================
   THẺ SỰ KIỆN
===================================================== */

.lp-event-card {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 30px 24px 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  color: var(--tc-ffbe89, #ffbe89);

  border: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.35);
  border-radius: 14px;

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.06);

  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.25);

  overflow: hidden;
}

/* =====================================================
   TIÊU ĐỀ CÓ KHUNG frame-title
===================================================== */

.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 14px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: var(--tc-ffbe89, #ffbe89);
}

/* =====================================================
   NGÀY
===================================================== */

.lp-event-date {
  width: 100%;
  text-align: center;
}

.lp-event-weekday {
  margin-top: 10px;

  font-size: 12px;

  letter-spacing: 0.2em;

  opacity: 0.8;
}

.lp-event-main-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  margin: 8px 0;
}

.lp-date-part {
  width: 70px;

  text-transform: uppercase;

  font-size: 13px;

  opacity: 0.75;
}

@media (min-width: 768px) {
  .lp-date-part {
    width: 85px;

    font-size: 14px;
  }
}

.lp-date-day {
  font-family: "Big Caslon", "Baskerville", "Times New Roman", serif;

  font-size: 30px;

  color: var(--tc-ffbe89, #ffbe89);
}

@media (min-width: 768px) {
  .lp-date-day {
    font-size: 36px;
  }
}

.lp-event-lunar {
  font-size: 12px;

  opacity: 0.6;
}

/* =====================================================
   GIỜ
===================================================== */

.lp-event-time {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  margin: 10px auto 0;
  padding: 12px 0;
}

.lp-event-time strong {
  font-size: 20px;
  font-weight: 600;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-time-divider {
  width: 1px;
  height: 20px;

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.55);
}

/* =====================================================
   LỊCH TRÌNH
===================================================== */

.lp-event-schedule {
  width: min(100%, 340px);

  margin: 14px auto 0;

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lp-schedule-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 6px 4px;

  border-bottom: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.2);
}

.lp-schedule-row span {
  font-size: 11px;

  letter-spacing: 0.14em;

  opacity: 0.7;
}

.lp-schedule-row strong {
  font-size: 17px;
  font-weight: 600;

  color: var(--tc-ffbe89, #ffbe89);
}

/* =====================================================
   LỊCH — KHUNG frame-calendar
===================================================== */

.lp-calendar {
  width: 360px;
  max-width: 100%;

  margin: 22px auto 0;
}

@media (min-width: 768px) {
  .lp-calendar {
    width: 420px;
  }
}

.lp-calendar__inner {
  width: 100%;

  aspect-ratio: 2100 / 1608;

  background-image: url("@/assets/decor/longphung-v3/frame-calendar.webp");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 9% 10% 8%;
}

.lp-calendar__header {
  margin-bottom: 6px;
}

.lp-calendar__header strong {
  font-family: "Times New Roman", Times, serif;

  font-size: clamp(15px, 4.5vw, 20px);
  font-weight: 700;

  letter-spacing: 0.06em;

  color: var(--tc-7a0014, #7a0014);
}

.lp-calendar__weekdays,
.lp-calendar__days {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);

  text-align: center;
}

.lp-calendar__weekdays {
  padding-bottom: 4px;
}

.lp-calendar__weekdays span {
  font-size: clamp(8px, 2.4vw, 11px);
  font-weight: 700;

  color: rgba(var(--tc-7a0014-rgb, 122, 0, 20), 0.75);
}

.lp-calendar__days {
  flex: 1;

  align-content: center;
}

.lp-calendar__cell {
  min-height: clamp(20px, 6vw, 30px);

  display: flex;
  align-items: center;
  justify-content: center;
}

.lp-calendar__cell span {
  font-size: clamp(9px, 2.8vw, 13px);

  color: var(--tc-7a0014, #7a0014);
}

.lp-calendar__cell--active {
  position: relative;
}

.lp-calendar__cell--active span {
  width: clamp(22px, 6.4vw, 30px);
  height: clamp(22px, 6.4vw, 30px);

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--tc-7a0014, #7a0014);

  color: var(--tc-ffbe89, #ffbe89) !important;

  font-weight: 700;
}

.lp-calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 8px;

  font-family: "Times New Roman", Times, serif;

  font-size: clamp(10px, 3vw, 13px);

  letter-spacing: 0.08em;

  text-decoration: underline;
  text-underline-offset: 4px;

  color: var(--tc-7a0014, #7a0014);
}

/* =====================================================
   RSVP
===================================================== */

.lp-rsvp-btn {
  width: min(100%, 400px);

  margin: 24px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px 20px;

  border: 1.5px solid var(--tc-ffbe89, #ffbe89);
  border-radius: 10px;

  color: var(--tc-ffbe89, #ffbe89);

  background: transparent;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 14px;
  font-weight: 600;

  letter-spacing: 0.08em;

  cursor: pointer;

  transition: transform 0.25s ease, background 0.25s ease;
}

.lp-rsvp-btn:hover {
  transform: scale(1.03);

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.12);
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

.lp-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(40, 0, 4, 0.6);

  backdrop-filter: blur(6px);
}

.lp-confirm-modal {
  position: relative;

  width: min(100%, 470px);

  max-height: 90vh;

  overflow-y: auto;

  padding: 40px 30px;

  border: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.5);
  border-radius: 16px;

  background: linear-gradient(172deg, var(--tc-5a000e, #5a000e), var(--tc-450001, #450001));

  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);

  text-align: center;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  font-size: 27px;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.8);

  background: transparent;

  cursor: pointer;
}

.lp-modal-header {
  text-align: center;
}

.lp-modal-symbol {
  width: 44px;
  height: 44px;

  object-fit: contain;

  margin-bottom: 8px;
}

.lp-modal-header h3 {
  margin: 8px 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 26px;
  font-weight: 700;

  letter-spacing: 0.04em;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-modal-header p {
  margin: 0;

  font-size: 13px;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.75);
}

/* =====================================================
   FORM
===================================================== */

.lp-form-group {
  margin-top: 20px;

  text-align: left;
}

.lp-form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.8);
}

.lp-form-group input {
  width: 100%;

  padding: 12px 14px;

  border: 1px solid var(--tc-ffbe89, #ffbe89);
  border-radius: 6px;

  outline: none;

  font-size: 16px;

  color: var(--tc-ffbe89, #ffbe89);

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.1);

  transition: box-shadow 0.2s ease;
}

.lp-form-group input::placeholder {
  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.45);
}

.lp-form-group input:focus {
  box-shadow: 0 0 0 3px rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.18);
}

.lp-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lp-attendance-option {
  padding: 12px 14px;

  border: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.6);
  border-radius: 6px;

  text-align: left;

  font-size: 13px;

  color: var(--tc-ffbe89, #ffbe89);

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.08);

  cursor: pointer;

  transition: all 0.25s ease;
}

.lp-attendance-option.selected {
  border-color: var(--tc-ffbe89, #ffbe89);

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.2);

  font-weight: 600;
}

.lp-attendance-option span {
  margin-right: 8px;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.8);
}

.lp-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

.lp-people-control button {
  width: 38px;
  height: 38px;

  border: 1px solid var(--tc-ffbe89, #ffbe89);
  border-radius: 50%;

  font-size: 20px;

  color: var(--tc-ffbe89, #ffbe89);

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.1);

  cursor: pointer;
}

.lp-people-control strong {
  min-width: 25px;

  text-align: center;

  font-size: 18px;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-recipient-box {
  margin: 20px 0;

  padding: 18px;

  border: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.5);
  border-radius: 12px;

  text-align: center;

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.08);
}

.lp-recipient-box span {
  display: block;

  font-size: 11px;

  letter-spacing: 0.2em;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.7);
}

.lp-recipient-box strong {
  display: block;
  margin-top: 6px;

  font-family: "EB Garamond", "Baskerville", "Times New Roman", serif;
  font-size: 26px;
  font-weight: 500;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-form-error,
.lp-form-success {
  margin-top: 15px;

  padding: 10px;

  border-radius: 10px;

  text-align: center;

  font-size: 12px;
}

.lp-form-error {
  color: var(--tc-ffb4a4, #ffb4a4);

  background: rgba(255, 100, 80, 0.12);
}

.lp-form-success {
  border: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.6);

  color: var(--tc-4b0606, #4b0606);

  background: var(--tc-fff4de, #fff4de);
}

.lp-modal-submit {
  width: 100%;

  margin-top: 22px;

  padding: 13px;

  border: 0;
  border-radius: 999px;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.14em;

  color: var(--tc-710001, #710001);

  background: var(--tc-ffbe89, #ffbe89);

  box-shadow: 0 10px 24px rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.3);

  cursor: pointer;

  transition: transform 0.25s ease;
}

.lp-modal-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.lp-modal-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =====================================================
   MODAL ANIMATION
===================================================== */

.lp-modal-enter-active,
.lp-modal-leave-active {
  transition: opacity 0.3s ease;
}

.lp-modal-enter-from,
.lp-modal-leave-to {
  opacity: 0;
}

.lp-modal-enter-active .lp-confirm-modal {
  animation: lp-modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes lp-modal-in {
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
  .lp-events__list {
    width: 100%;
    padding: 0 18px;
    gap: 25px;
  }

  .lp-event-card {
    max-width: 430px;

    padding: 26px 18px 22px;
  }

  .lp-event-main-date {
    gap: 12px;
  }

  .lp-confirm-modal {
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

  .lp-rsvp-btn,
  .lp-modal-submit {
    transition: none;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.lp-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.lp-custom-head__eyebrow {
  margin: 0 0 6px;
  color: var(--tc-ffbe89, #ffbe89);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lp-custom-head__heading {
  margin: 0;
  color: var(--tc-ffbe89, #ffbe89);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.lp-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.85);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
