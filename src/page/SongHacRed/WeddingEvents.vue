<template>
  <section class="shc-events" ref="sectionRef">
    <!-- =====================================================
         KHUNG HOẠ TIẾT
    ====================================================== -->

    <div class="shc-events__frame">
      <!-- HOẠ TIẾT GÓC KHUNG -->

      <div class="shc-events__ornaments" aria-hidden="true">
        <img
          class="shc-events__ornament shc-events__ornament--cloud-top"
          :src="cloud1Decoration"
          alt=""
          draggable="false"
        />

        <img
          class="shc-events__ornament shc-events__ornament--flower-right"
          :src="flower1Decoration"
          alt=""
          draggable="false"
        />

        <img
          class="shc-events__ornament shc-events__ornament--cloud-bottom"
          :src="cloud2Decoration"
          alt=""
          draggable="false"
        />
      </div>

      <!-- NỘI DUNG -->

      <div class="shc-events__content">
        <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
        <header v-if="sectionOverride(sections, 'events', 'Eyebrow')" class="shc-top-custom-head">
          <p v-if="sectionOverride(sections, 'events', 'Eyebrow')" class="shc-top-custom-head__eyebrow">{{ sectionOverride(sections, "events", "Eyebrow") }}</p>
        </header>

        <h2 class="shc-events__title">{{ sectionText(sections, "events", "Heading", $t("THÔNG TIN TIỆC CƯỚI")) }}</h2>

        <article
          v-for="(event, index) in normalizedEvents"
          :key="event.Id || event.id || index"
          class="shc-event reveal"
          :style="{ '--delay': `${index * 120}ms` }"
        >
          <!-- GIỜ + NGÀY -->

          <template v-if="event.hasDate">
            <h3 class="shc-event__heading">{{ $t("Tiệc cưới sẽ diễn ra vào lúc:") }}</h3>

            <div class="shc-event__time-row">
              <span>{{ event.time }}</span>
              <span>{{ event.weekday }}</span>
            </div>

            <div class="shc-event__date-big">
              <span class="shc-event__day">{{ event.day }}</span>

              <span class="shc-event__sep" aria-hidden="true"></span>

              <span class="shc-event__month-year">
                <span>THÁNG {{ event.month }}</span>
                <span>{{ event.year }}</span>
              </span>
            </div>

            <p v-if="event.lunar" class="shc-event__lunar">({{ event.lunar }})</p>

            <!-- ĐÓN KHÁCH / KHAI TIỆC -->

            <div class="shc-event__phases">
              <div class="shc-event__phase">
                <span class="shc-event__phase-label">{{ $t("Đón khách") }}</span>
                <strong class="shc-event__phase-time">{{ event.receptionTime }}</strong>
              </div>

              <div class="shc-event__phase">
                <span class="shc-event__phase-label">{{ $t("Khai tiệc") }}</span>
                <strong class="shc-event__phase-time">{{ event.time }}</strong>
              </div>
            </div>

            <!-- ĐẾM NGƯỢC -->

            <div class="shc-countdown">
              <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
              <header v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="shc-cd-custom-head">
                <p v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="shc-cd-custom-head__eyebrow">{{ sectionOverride(sections, "countdown", "Eyebrow") }}</p>
              </header>

              <h4 class="shc-countdown__label">{{ sectionText(sections, "countdown", "Heading", $t("Cùng đếm ngược")) }}</h4>

              <div class="shc-countdown__value">
                {{ countdownText }}
              </div>
            </div>

            <!-- LỊCH THÁNG -->

            <div v-if="index === 0 && event.calendarDays.length" class="shc-calendar">
              <p class="shc-calendar__month">Tháng {{ Number(event.month) }} / {{ event.year }}</p>

              <div class="shc-calendar__weekdays">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>

              <div class="shc-calendar__days">
                <div
                  v-for="(day, dayIndex) in event.calendarDays"
                  :key="dayIndex"
                  class="shc-calendar__cell"
                >
                  <template v-if="day">
                    <span v-if="day === Number(event.day)" class="shc-calendar__heart">
                      <img :src="heart" alt="" aria-hidden="true" />

                      <b>{{ day }}</b>
                    </span>

                    <span v-else class="shc-calendar__day">{{ day }}</span>
                  </template>
                </div>
              </div>
            </div>

            <a
              v-if="index === 0 && event.calendarUrl"
              :href="event.calendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="shc-calendar__link"
            >
              {{ $t("Thêm vào lịch") }}
            </a>
          </template>

          <!-- RSVP -->

          <button type="button" class="shc-rsvp-btn" @click="openConfirmModal(event)">
            {{ $t("XÁC NHẬN THAM DỰ") }}
          </button>
        <EventMap v-if="index === 0 && showMap" :event="event" />
        </article>
        
      </div>
    </div>

    <!-- =====================================================
         MODAL XÁC NHẬN
    ====================================================== -->

    <Teleport to="body">
      <Transition name="shc-modal">
        <div v-if="showConfirmModal" class="shc-confirm-overlay" @click.self="closeConfirmModal">
          <div class="shc-confirm-modal">
            <button type="button" class="shc-modal-close" @click="closeConfirmModal">{{ "×" }}</button>

            <div class="shc-modal-header">
              <span>THE CELEBRATION</span>

              <h3>{{ $t("Xác nhận tham dự") }}</h3>

              <p>{{ $t("Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.") }}</p>
            </div>

            <!-- KHÁCH ĐƯỢC MỜI -->

            <div v-if="hasRecipient" class="shc-recipient-box">
              <span>{{ $t("TRÂN TRỌNG KÍNH MỜI") }}</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <!-- HỌ TÊN -->

            <div v-else class="shc-form-group">
              <label>{{ $t("Họ và tên") }}</label>

              <input
                v-model.trim="form.name"
                type="text"
                maxlength="100"
                :placeholder="$t('Nhập tên của bạn')"
              />
            </div>

            <!-- THAM DỰ -->

            <div class="shc-form-group">
              <label>{{ $t("Bạn có tham dự không?") }}</label>

              <div class="shc-attendance">
                <button
                  type="button"
                  class="shc-attendance-option"
                  :class="{ selected: form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  <span>✓</span>
                  {{ $t("Có, tôi sẽ tham dự") }}
                </button>

                <button
                  type="button"
                  class="shc-attendance-option"
                  :class="{ selected: form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  <span>{{ "×" }}</span>
                  {{ $t("Rất tiếc, tôi không thể tham dự") }}
                </button>
              </div>
            </div>

            <!-- SỐ NGƯỜI -->

            <div v-if="form.attendance === 'attending'" class="shc-form-group">
              <label>{{ $t("Số người tham dự") }}</label>

              <div class="shc-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <div v-if="errorMessage" class="shc-form-error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="shc-form-success">{{ successMessage }}</div>

            <button
              type="button"
              class="shc-modal-submit"
              :disabled="submitting"
              @click="submitConfirmation"
            >
              {{ submitting ? $t("ĐANG GỬI...") : $t("GỬI XÁC NHẬN") }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { t } from "@/lang";
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import EventMap from "@/components/common/EventMap.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { Confirm } from "@/model/api";
/*
 * Bản đồ gộp vào từng sự kiện — gate bằng ShowMap.
 */
const showMap = computed(() => props.settings?.ShowMap === true);


import {
  cloud1Decoration,
  cloud2Decoration,
  flower1Decoration,
  heart,
} from "./songHacRedAssets";

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
  return (props.events || []).slice(0, 1).map((item) => {
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
        t("CHỦ NHẬT"),
        t("THỨ HAI"),
        t("THỨ BA"),
        t("THỨ TƯ"),
        t("THỨ NĂM"),
        t("THỨ SÁU"),
        t("THỨ BẢY"),
      ];

      weekday = t(weekdays[date.day()]);
    }

    const calendarDays =
      item.calendarDays || buildCalendarDays(Number(year), Number(month));

    const time =
      item.EventTime ||
      item.Time ||
      item.StartTime ||
      (date.isValid() ? date.format("HH:mm") : "");

    /*
     * Giờ đón khách: mốc timeline "Đón khách" nếu có,
     * không thì sớm hơn giờ khai tiệc 1 tiếng.
     */
    const receptionTime = item.ReceptionTime || shiftTime(time, -60);

    return {
      ...item,

      hasDate: date.isValid(),

      time,

      receptionTime,

      day,
      month,
      year,
      weekday,

      date: rawDate,

      lunar: item.LunarDate || item.Lunar || item.lunar || "",

      calendarUrl: item.CalendarUrl || item.calendarUrl || "",

      calendarDays,
    };
  });
});

function shiftTime(time, minutes) {
  if (!time || typeof time !== "string") return "";

  const [hour, minute] = time.split(":").map((part) => Number(part) || 0);

  const total = hour * 60 + minute + minutes;

  if (total < 0) return time;

  const shiftedHour = Math.floor(total / 60) % 24;
  const shiftedMinute = total % 60;

  return `${String(shiftedHour).padStart(2, "0")}:${String(shiftedMinute).padStart(2, "0")}`;
}

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

const countdownText = computed(() => {
  if (!targetTime.value) {
    return t("Đang tính toán...");
  }

  const distance = targetTime.value - now.value;

  if (distance <= 0) {
    return t("Chúng mình đã về chung một nhà ❤️");
  }

  const seconds = Math.floor(distance / 1000);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];

  if (days > 0) parts.push(`${days}${t(" ngày")}`);
  if (hours > 0) parts.push(`${hours}${t(" giờ")}`);
  if (minutes > 0) parts.push(`${minutes}${t(" phút")}`);

  return parts.length ? `${t("Còn ")}${parts.join(" ")}` : t("Sắp diễn ra!");
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
.shc-events {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);
  --shc-navy: var(--text-secondary, #001232);
  --shc-frame-red: var(--secondary, #990000);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  margin-top: 23px;

  color: var(--shc-frame-red);

  background-color: var(--shc-red);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   KHUNG HOẠ TIẾT (border-image) — giống Timeline
========================================================= */

.shc-events__frame {
  position: relative;

  width: min(100% - 16px, 460px);

  margin: 0 auto;

  border: 65px solid transparent;

  /* url() trực tiếp — xem ghi chú ở WeddingCouple (v-bind làm khung vô hiệu) */
  border-image-source: url("@/assets/song-hac-do/timeline-panel.webp");
  border-image-slice: 130 fill;
  border-image-repeat: stretch;
}

/* =========================================================
   HOẠ TIẾT GÓC KHUNG
========================================================= */

.shc-events__ornaments {
  position: absolute;
  inset: 0;
  z-index: 1;

  pointer-events: none;
}

.shc-events__ornaments img {
  position: absolute;

  max-width: none;

  object-fit: contain;
}

.shc-events__ornament--cloud-top {
  left: 5.74%;
  top: -25px;

  width: 57.62%;
}

.shc-events__ornament--flower-right {
  left: 86.78%;
  top: 20%;

  width: 24.94%;
}

.shc-events__ornament--cloud-bottom {
  left: -12%;
  bottom: -14px;

  width: 40.16%;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-events__content {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0 8px 37.5px;

  text-align: center;
}

.shc-events__title {
  margin: 0;

  color: var(--shc-frame-red);

  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

.shc-event {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  margin-top: 28px;

  text-align: center;
}

.shc-event__heading {
  margin: 0;

  color: var(--shc-navy);

  font-size: 18px;
  font-weight: 700;

  text-transform: uppercase;
}

.shc-event__time-row {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-top: 10px;

  color: var(--shc-navy);

  font-family: "Times New Roman", Times, serif;
  font-size: 15px;
  font-weight: 700;

  text-transform: uppercase;

  white-space: nowrap;
}

.shc-event__date-big {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-top: 10px;

  color: var(--shc-frame-red);
}

.shc-event__day {
  font-family: Baskerville, "Times New Roman", serif;
  font-size: 57px;
  font-weight: 600;

  line-height: 1;
}

.shc-event__sep {
  width: 1px;
  height: 46px;

  background: var(--shc-frame-red);
}

.shc-event__month-year {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 4px;

  font-family: "Times New Roman", Times, serif;
  font-size: 17px;
  font-weight: 600;

  line-height: 1;

  text-align: left;
  text-transform: uppercase;
}

.shc-event__lunar {
  margin: 6px 0 0;

  color: var(--shc-navy);

  font-size: 12px;
  font-weight: 700;

  text-transform: uppercase;
}

/* =========================================================
   ĐÓN KHÁCH / KHAI TIỆC
========================================================= */

.shc-event__phases {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 32px;

  margin-top: 16px;
}

.shc-event__phase {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.shc-event__phase-label {
  color: var(--shc-navy);

  font-size: 11px;
  font-weight: 600;

  text-transform: uppercase;
}

.shc-event__phase-time {
  margin-top: 4px;

  color: var(--shc-frame-red);

  font-size: 20px;
  font-weight: 700;
}

/* =========================================================
   ĐẾM NGƯỢC
========================================================= */

.shc-countdown {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 16px;
}

.shc-countdown__label {
  margin: 0;

  color: var(--shc-navy);

  font-size: 20px;
  font-weight: 600;

  text-transform: uppercase;
}

.shc-countdown__value {
  margin-top: 8px;

  color: var(--shc-navy);

  font-size: 20px;
  font-weight: 700;
}

/* =========================================================
   LỊCH THÁNG
========================================================= */

.shc-calendar {
  width: 100%;
  max-width: 280px;

  margin-top: 32px;

  border: 1px solid color-mix(in srgb, var(--shc-frame-red) 27%, transparent);
  border-radius: 8px;

  overflow: hidden;

  color: var(--shc-frame-red);

  font-size: 11px;
}

.shc-calendar__month {
  margin: 0;
  padding: 10px 0;

  border-bottom: 1px solid color-mix(in srgb, var(--shc-frame-red) 27%, transparent);

  font-family: "The Nautigal", cursive;
  font-size: 25px;

  line-height: 1;

  text-align: center;
}

.shc-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  border-bottom: 2px solid var(--shc-frame-red);
}

.shc-calendar__weekdays span {
  padding: 6px 0;

  font-size: 10px;
  font-weight: 500;

  opacity: 0.6;

  text-align: center;
}

.shc-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 2px;

  padding: 8px 4px;
}

.shc-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30px;
}

.shc-calendar__day {
  font-size: 12px;
}

.shc-calendar__heart {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 24px;
}

.shc-calendar__heart img {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;
}

.shc-calendar__heart b {
  position: relative;
  z-index: 1;

  color: #f6efea;

  font-size: 11px;
  font-weight: 700;
}

.shc-calendar__link {
  display: inline-block;

  margin-top: 16px;

  color: var(--shc-navy);

  font-family: "Times New Roman", Times, serif;
  font-size: 14px;

  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;

  transition: opacity 0.25s ease;
}

.shc-calendar__link:hover {
  opacity: 0.7;
}

/* =========================================================
   NÚT RSVP
========================================================= */

.shc-rsvp-btn {
  margin-top: 24px;
  padding: 8px 20px;

  border: 0;
  border-radius: 7px;

  color: var(--shc-cream);

  background: var(--shc-frame-red);

  font-family: "Times New Roman", Times, serif;
  font-size: 14px;

  letter-spacing: 0.05em;

  cursor: pointer;

  transition: transform 0.25s ease;
}

.shc-rsvp-btn:hover {
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

.shc-confirm-overlay {
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

.shc-confirm-modal {
  position: relative;

  width: min(100%, 420px);
  max-height: 90vh;

  padding: 26px 22px 22px;

  border-radius: 12px;

  background: #fffaf0;

  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.3);

  overflow-y: auto;

  font-family: Baskerville, "Times New Roman", serif;
}

.shc-modal-close {
  position: absolute;

  right: 12px;
  top: 10px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: var(--secondary, #990000);

  background: transparent;

  font-size: 22px;
  line-height: 1;

  cursor: pointer;
}

.shc-modal-header {
  text-align: center;
}

.shc-modal-header span {
  color: var(--secondary, #990000);

  font-size: 10px;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-modal-header h3 {
  margin: 6px 0;

  color: var(--secondary, #990000);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 26px;
  font-weight: 500;
}

.shc-modal-header p {
  margin: 0;

  color: var(--text-secondary, #001232);

  font-size: 13px;

  line-height: 1.5;
}

.shc-recipient-box {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;

  margin-top: 18px;
  padding: 12px;

  border: 1px solid color-mix(in srgb, var(--secondary, #990000) 22%, transparent);
  border-radius: 8px;
}

.shc-recipient-box span {
  color: var(--text-secondary, #001232);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.shc-recipient-box strong {
  color: var(--secondary, #990000);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 20px;
  font-weight: 500;
}

.shc-form-group {
  margin-top: 16px;
}

.shc-form-group label {
  display: block;

  margin-bottom: 6px;

  color: var(--secondary, #990000);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.08em;
}

.shc-form-group input {
  width: 100%;

  padding: 11px 12px;

  border: 1px solid color-mix(in srgb, var(--secondary, #990000) 25%, transparent);
  border-radius: 8px;

  outline: 0;

  color: var(--text-secondary, #001232);

  background: #ffffff;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 15px;
}

.shc-form-group input:focus {
  border-color: var(--secondary, #990000);
}

.shc-attendance {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.shc-attendance-option {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 11px 12px;

  border: 1px solid color-mix(in srgb, var(--secondary, #990000) 25%, transparent);
  border-radius: 8px;

  color: var(--text-secondary, #001232);

  background: #ffffff;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 14px;

  text-align: left;

  cursor: pointer;

  transition: border-color 0.2s ease, background 0.2s ease;
}

.shc-attendance-option span {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  border-radius: 50%;

  color: #ffffff;

  background: color-mix(in srgb, var(--secondary, #990000) 35%, transparent);

  font-size: 12px;
}

.shc-attendance-option.selected {
  border-color: var(--secondary, #990000);

  background: color-mix(in srgb, var(--secondary, #990000) 7%, transparent);
}

.shc-attendance-option.selected span {
  background: var(--secondary, #990000);
}

.shc-people-control {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 18px;
}

.shc-people-control button {
  width: 34px;
  height: 34px;

  border: 1px solid color-mix(in srgb, var(--secondary, #990000) 30%, transparent);
  border-radius: 50%;

  color: var(--secondary, #990000);

  background: #ffffff;

  font-size: 18px;
  line-height: 1;

  cursor: pointer;
}

.shc-people-control strong {
  min-width: 30px;

  color: var(--secondary, #990000);

  font-size: 20px;

  text-align: center;
}

.shc-form-error,
.shc-form-success {
  margin-top: 14px;
  padding: 10px 12px;

  border-radius: 8px;

  font-size: 13px;

  text-align: center;
}

.shc-form-error {
  color: #a11;

  background: rgba(170, 17, 17, 0.08);
}

.shc-form-success {
  color: #1c6b3a;

  background: rgba(28, 107, 58, 0.1);
}

.shc-modal-submit {
  width: 100%;

  margin-top: 18px;
  padding: 13px;

  border: 0;
  border-radius: 10px;

  color: var(--accent, #ffe8a4);

  background: var(--secondary, #990000);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 14px;
  font-weight: 600;

  letter-spacing: 0.1em;

  cursor: pointer;

  transition: opacity 0.25s ease;
}

.shc-modal-submit:disabled {
  cursor: not-allowed;

  opacity: 0.6;
}

/* =========================================================
   TRANSITION
========================================================= */

.shc-modal-enter-active,
.shc-modal-leave-active {
  transition: opacity 0.3s ease;
}

.shc-modal-enter-from,
.shc-modal-leave-to {
  opacity: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-events {
    margin-top: 31px;
    padding: 54px 0 71px;
  }

  .shc-events__frame {
    width: min(100% - 32px, 640px);

    border-width: 88px;
  }

  .shc-events__ornament--cloud-top {
    top: -27px;
  }

  .shc-events__ornament--cloud-bottom {
    bottom: -19px;
  }

  .shc-events__content {
    padding: 0 14px 51px;
  }

  .shc-events__title {
    font-size: 27px;
  }

  .shc-event__heading {
    font-size: 24px;
  }

  .shc-event__time-row {
    font-size: 20px;
  }

  .shc-event__day {
    font-size: 78px;
  }

  .shc-event__sep {
    height: 63px;
  }

  .shc-event__month-year {
    font-size: 23px;
  }

  .shc-event__lunar {
    font-size: 16px;
  }

  .shc-event__phase-label {
    font-size: 13px;
  }

  .shc-event__phase-time {
    font-size: 27px;
  }

  .shc-countdown__label {
    font-size: 27px;
  }

  .shc-countdown__value {
    font-size: 27px;
  }

  .shc-calendar {
    max-width: 310px;

    font-size: 15px;
  }

  .shc-calendar__month {
    font-size: 34px;
  }

  .shc-calendar__weekdays span {
    font-size: 11px;
  }

  .shc-calendar__cell {
    height: 34px;
  }

  .shc-calendar__day {
    font-size: 13px;
  }

  .shc-calendar__heart {
    width: 30px;
    height: 28px;
  }

  .shc-calendar__heart b {
    font-size: 12px;
  }

  .shc-calendar__link {
    font-size: 19px;
  }

  .shc-rsvp-btn {
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

  .shc-rsvp-btn,
  .shc-modal-enter-active,
  .shc-modal-leave-active {
    transition: none;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-cd-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-cd-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-cd-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-cd-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
