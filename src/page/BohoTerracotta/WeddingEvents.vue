<template>
  <section ref="sectionRef" class="bq-events">
    <img
      :src="flower3"
      alt=""
      aria-hidden="true"
      class="bq-events__flower bq-events__flower--tl"
      draggable="false"
    />

    <img
      :src="flower3"
      alt=""
      aria-hidden="true"
      class="bq-events__flower bq-events__flower--tr"
      draggable="false"
    />

    <img
      :src="flower4"
      alt=""
      aria-hidden="true"
      class="bq-events__flower bq-events__flower--bl"
      draggable="false"
    />

    <img
      :src="flower4"
      alt=""
      aria-hidden="true"
      class="bq-events__flower bq-events__flower--br"
      draggable="false"
    />

    <div class="bq-events__inner">
      <h2 class="bq-heading">THÔNG TIN TIỆC CƯỚI</h2>

      <img
        :src="line2"
        alt=""
        aria-hidden="true"
        class="bq-events__line"
        draggable="false"
      />

      <div class="bq-events__list">
        <article
          v-for="(event, index) in normalizedEvents"
          :key="event.Id || event.id || index"
          class="bq-event reveal"
          :style="{ '--delay': `${index * 120}ms` }"
        >
          <h3 class="bq-event__title">
            {{ event.Title || "Tiệc cưới sẽ diễn ra vào lúc:" }}
          </h3>

          <!-- NGÀY GIỜ -->
          <div v-if="event.hasDate" class="bq-event__when">
            <span v-if="event.weekday">{{ event.weekday }}</span>
            <span v-if="event.time">{{ event.time }}</span>
          </div>

          <div v-if="event.hasDate" class="bq-event__date">
            <img
              :src="line4"
              alt=""
              aria-hidden="true"
              class="bq-event__date-line"
              draggable="false"
            />

            <span class="bq-event__day">{{ event.day }}</span>

            <span class="bq-event__bar" aria-hidden="true"></span>

            <div class="bq-event__side">
              <span>THÁNG {{ event.month }}</span>
              <span>{{ event.year }}</span>
            </div>

            <img
              :src="line4"
              alt=""
              aria-hidden="true"
              class="bq-event__date-line bq-event__date-line--flip"
              draggable="false"
            />
          </div>

          <p v-if="event.lunar" class="bq-event__lunar">({{ event.lunar }})</p>

          <!-- ĐÓN KHÁCH / KHAI TIỆC -->
          <div v-if="event.receptionTime || event.ceremonyTime" class="bq-event__schedule">
            <div v-if="event.receptionTime" class="bq-schedule">
              <span class="bq-schedule__label">Đón khách</span>
              <strong class="bq-schedule__time">{{ event.receptionTime }}</strong>
            </div>

            <div v-if="event.ceremonyTime" class="bq-schedule">
              <span class="bq-schedule__label">Khai tiệc</span>
              <strong class="bq-schedule__time">{{ event.ceremonyTime }}</strong>
            </div>
          </div>

          <!-- ĐỊA ĐIỂM -->
          <div v-if="event.location || event.address" class="bq-event__place">
            <span class="bq-event__place-label">ĐỊA ĐIỂM</span>

            <p v-if="event.location" class="bq-event__place-name">{{ event.location }}</p>

            <p v-if="event.address" class="bq-event__place-address">{{ event.address }}</p>
          </div>

          <!-- LỊCH -->
          <div v-if="event.date && event.calendarDays?.length" class="bq-calendar">
            <div class="bq-calendar__header">
              Tháng {{ event.month }} / {{ event.year }}
            </div>

            <div class="bq-calendar__weekdays">
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span>CN</span>
            </div>

            <div class="bq-calendar__days">
              <div
                v-for="(day, dayIndex) in event.calendarDays"
                :key="dayIndex"
                class="bq-calendar__cell"
                :class="{ 'is-empty': !day, 'is-active': day === Number(event.day) }"
              >
                <template v-if="day">
                  <span v-if="day === Number(event.day)" class="bq-calendar__heart">
                    <svg viewBox="0 0 24 22" fill="currentColor" aria-hidden="true">
                      <path
                        d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z"
                      />
                    </svg>

                    <b>{{ day }}</b>
                  </span>

                  <span v-else class="bq-calendar__day">{{ day }}</span>
                </template>
              </div>
            </div>
          </div>

          <a
            v-if="event.calendarUrl"
            :href="event.calendarUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="bq-event__calendar-link"
          >
            Thêm vào lịch
          </a>
        </article>
      </div>

      <!-- XÁC NHẬN THAM DỰ -->
      <button type="button" class="bq-rsvp-btn" @click="openConfirmModal(normalizedEvents[0])">
        XÁC NHẬN THAM DỰ
      </button>
    </div>

    <!-- =====================================================
         MODAL XÁC NHẬN
    ====================================================== -->
    <Teleport to="body">
      <Transition name="bq-modal">
        <div v-if="showConfirmModal" class="bq-confirm" @click.self="closeConfirmModal">
          <div class="bq-confirm__card">
            <button type="button" class="bq-confirm__close" @click="closeConfirmModal">×</button>

            <h3 class="bq-confirm__title">Xác nhận tham dự</h3>

            <p class="bq-confirm__desc">
              Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.
            </p>

            <div v-if="hasRecipient" class="bq-confirm__recipient">
              <span>TRÂN TRỌNG KÍNH MỜI</span>
              <strong>{{ recipientName }}</strong>
            </div>

            <div v-else class="bq-field">
              <label>Họ và tên</label>

              <input
                v-model.trim="form.name"
                type="text"
                maxlength="100"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div class="bq-field">
              <label>Bạn có tham dự không?</label>

              <div class="bq-attendance">
                <button
                  type="button"
                  class="bq-attendance__option"
                  :class="{ 'is-selected': form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="bq-attendance__option"
                  :class="{ 'is-selected': form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>

            <div v-if="form.attendance === 'attending'" class="bq-field">
              <label>Số người tham dự</label>

              <div class="bq-people-control">
                <button type="button" @click="decreasePeople">−</button>
                <strong>{{ form.numberOfPeople }}</strong>
                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>

            <p v-if="errorMessage" class="bq-form-error">{{ errorMessage }}</p>
            <p v-if="successMessage" class="bq-form-success">{{ successMessage }}</p>

            <button
              type="button"
              class="bq-confirm__submit"
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

import { flower3, flower4, line2, line4 } from "./bohoTerracottaAssets";

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
   Tuần bắt đầu từ thứ Hai (T2 → CN).
========================================= */

function buildCalendarDays(year, month) {
  if (!year || !month) return [];

  const firstDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);

  const daysInMonth = firstDay.daysInMonth();

  /* dayjs: 0 = Chủ nhật → đổi sang cột T2..CN */
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
   XÁC NHẬN THAM DỰ
========================================= */

function openConfirmModal(event) {
  selectedEvent.value = event || null;

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
.bq-events {
  position: relative;
  isolation: isolate;

  width: 100%;

  overflow: hidden;

  text-align: center;

  color: var(--bq-ink);
}

/* =========================================================
   HOA VĂN BỐN GÓC
========================================================= */

.bq-events__flower {
  position: absolute;

  z-index: 1;

  max-width: none;
  height: auto;

  object-fit: contain;

  pointer-events: none;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

.bq-events__flower--tl {
  top: -13px;
  left: -13%;

  width: 46.3%;

  transform: scaleX(-1);
}

.bq-events__flower--tr {
  top: -13px;
  right: -13%;

  width: 46.3%;
}

.bq-events__flower--bl {
  bottom: 9px;
  left: -9.5%;

  width: 40.7%;
}

.bq-events__flower--br {
  right: -9.5%;
  bottom: 9px;

  width: 40.7%;

  transform: scaleX(-1);
}

.bq-events__inner {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 400px;

  margin: 0 auto;

  padding: 76px 20px 40px;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.bq-heading {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.bq-events__line {
  display: block;

  width: 143px;
  max-width: none;
  height: auto;

  margin: 10px auto 12px;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

/* =========================================================
   SỰ KIỆN
========================================================= */

.bq-events__list {
  display: flex;
  flex-direction: column;
  gap: 34px;

  width: 100%;
}

.bq-event {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  width: 100%;

  opacity: 0;
  transform: translateY(18px);

  transition: opacity 0.7s ease var(--delay, 0ms),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms);
}

.bq-event.visible {
  opacity: 1;
  transform: none;
}

.bq-event__title {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 17px;
  font-weight: 600;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.bq-event__when {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;

  color: var(--bq-ink);

  font-size: 14px;
  font-weight: 600;

  text-transform: uppercase;
}

/* =========================================================
   NGÀY
========================================================= */

.bq-event__date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
}

.bq-event__date-line {
  display: block;

  height: 84px;
  width: auto;
  max-width: none;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

.bq-event__date-line--flip {
  transform: scaleX(-1);
}

.bq-event__day {
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 52px;

  line-height: 1;
}

.bq-event__bar {
  width: 1px;
  height: 46px;

  background-color: var(--bq-accent);
}

.bq-event__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;

  text-align: left;

  font-size: 16px;

  text-transform: uppercase;
}

.bq-event__lunar {
  margin: 0;

  color: var(--bq-ink);

  font-size: 12px;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

/* =========================================================
   ĐÓN KHÁCH / KHAI TIỆC
========================================================= */

.bq-event__schedule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;

  margin-top: 6px;
}

.bq-schedule {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bq-schedule__label {
  color: var(--bq-ink);

  font-size: 11px;

  text-transform: uppercase;
}

.bq-schedule__time {
  margin-top: 4px;

  color: var(--bq-accent);

  font-size: 20px;
  font-weight: 600;
}

/* =========================================================
   ĐỊA ĐIỂM
========================================================= */

.bq-event__place {
  margin-top: 6px;
}

.bq-event__place-label {
  display: block;

  color: var(--bq-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.2em;
}

.bq-event__place-name {
  margin: 6px 0 0;

  color: var(--bq-accent);

  font-size: 15px;
  font-weight: 600;

  line-height: 1.45;
}

.bq-event__place-address {
  max-width: 300px;
  margin: 4px auto 0;

  color: var(--bq-ink);

  font-family: "Roboto", "Helvetica Neue", sans-serif;
  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   LỊCH
========================================================= */

.bq-calendar {
  width: 100%;
  max-width: 300px;

  margin-top: 10px;

  color: var(--bq-accent);
}

.bq-calendar__header {
  padding: 10px 0;

  border-bottom: 1px solid var(--bq-line);

  font-family: "Times New Roman", serif;
  font-size: 18px;
  font-weight: 600;
}

.bq-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  border-bottom: 2px solid var(--bq-accent);
}

.bq-calendar__weekdays span {
  padding: 6px 0;

  font-size: 10px;
  font-weight: 500;

  opacity: 0.6;
}

.bq-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px 0;

  padding: 8px 4px;
}

.bq-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30px;
}

.bq-calendar__day {
  font-size: 12px;
}

.bq-calendar__heart {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 24px;
}

.bq-calendar__heart svg {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
}

.bq-calendar__heart b {
  position: relative;
  z-index: 1;

  color: var(--bq-deep);

  font-size: 11px;
  font-weight: 700;
}

/* =========================================================
   THÊM VÀO LỊCH
========================================================= */

.bq-event__calendar-link {
  margin-top: 6px;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 14px;

  text-decoration: underline;
  text-underline-offset: 4px;
}

/* =========================================================
   NÚT XÁC NHẬN
========================================================= */

.bq-rsvp-btn {
  margin-top: 30px;
  padding: 6px 32px;

  border: 0;
  border-radius: 999px;

  color: var(--bq-deep);

  background: var(--bq-accent);

  font-family: "Roboto", "Helvetica Neue", sans-serif;
  font-size: 13px;

  cursor: pointer;

  transition: transform 0.2s ease;
}

.bq-rsvp-btn:hover {
  transform: scale(1.03);
}

/* =========================================================
   MODAL
========================================================= */

.bq-confirm {
  position: fixed;
  inset: 0;

  z-index: 3000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(var(--bq-bg-rgb), 0.72);

  backdrop-filter: blur(3px);
}

.bq-confirm__card {
  position: relative;

  width: min(100%, 400px);
  max-height: 88vh;

  padding: 26px 20px 22px;

  overflow-y: auto;

  text-align: center;

  border: 1px solid var(--bq-line);
  border-radius: 6px;

  background: var(--bq-bg-2);

  color: var(--bq-ink);
}

.bq-confirm__close {
  position: absolute;

  top: 10px;
  right: 12px;

  width: 30px;
  height: 30px;

  border: 0;
  border-radius: 50%;

  color: var(--bq-accent);

  background: rgba(var(--bq-accent-rgb), 0.14);

  font-size: 19px;
  line-height: 1;

  cursor: pointer;
}

.bq-confirm__title {
  margin: 0 0 6px;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 22px;
  font-weight: 700;

  text-transform: uppercase;
}

.bq-confirm__desc {
  margin: 0 0 18px;

  color: var(--bq-soft);

  font-size: 12px;

  line-height: 1.65;
}

.bq-confirm__recipient {
  display: flex;
  flex-direction: column;
  gap: 4px;

  margin-bottom: 16px;
  padding: 12px;

  border: 1px solid var(--bq-line);
  border-radius: 6px;
}

.bq-confirm__recipient span {
  color: var(--bq-muted);

  font-size: 10px;

  letter-spacing: 0.18em;
}

.bq-confirm__recipient strong {
  color: var(--bq-accent);

  font-family: "Ms Madi", cursive;
  font-size: 26px;
  font-weight: 400;
}

/* =========================================================
   Ô NHẬP
========================================================= */

.bq-field {
  margin-bottom: 14px;

  text-align: left;
}

.bq-field label {
  display: block;

  margin-bottom: 6px;

  color: var(--bq-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.18em;

  text-transform: uppercase;
}

.bq-field input {
  width: 100%;

  padding: 11px 14px;

  box-sizing: border-box;

  border: 1px solid var(--bq-accent);
  border-radius: 6px;

  background: transparent;

  color: var(--bq-ink);

  font-family: "Roboto", "Helvetica Neue", sans-serif;
  font-size: 14px;

  outline: none;
}

.bq-field input::placeholder {
  color: rgba(var(--bq-ink-rgb), 0.4);
}

.bq-attendance {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bq-attendance__option {
  padding: 11px 14px;

  border: 1px solid var(--bq-line);
  border-radius: 6px;

  background: transparent;

  color: var(--bq-soft);

  font-family: inherit;
  font-size: 13px;

  text-align: left;

  cursor: pointer;

  transition: border-color 0.2s ease, color 0.2s ease;
}

.bq-attendance__option.is-selected {
  border-color: var(--bq-accent);

  color: var(--bq-accent);

  background: rgba(var(--bq-accent-rgb), 0.1);
}

.bq-people-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.bq-people-control button {
  width: 34px;
  height: 34px;

  border: 1px solid var(--bq-accent);
  border-radius: 50%;

  background: transparent;

  color: var(--bq-accent);

  font-size: 17px;
  line-height: 1;

  cursor: pointer;
}

.bq-people-control strong {
  min-width: 30px;

  color: var(--bq-accent);

  font-size: 18px;
}

.bq-form-error,
.bq-form-success {
  margin: 0 0 12px;

  font-size: 12px;
}

.bq-form-error {
  color: #ff9d9d;
}

.bq-form-success {
  color: var(--bq-accent);
}

.bq-confirm__submit {
  width: 100%;

  padding: 12px;

  border: 0;
  border-radius: 999px;

  color: var(--bq-deep);

  background: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
}

.bq-confirm__submit:disabled {
  opacity: 0.6;
  cursor: default;
}

/* =========================================================
   CHUYỂN ĐỘNG
========================================================= */

.bq-modal-enter-active,
.bq-modal-leave-active {
  transition: opacity 0.25s ease;
}

.bq-modal-enter-from,
.bq-modal-leave-to {
  opacity: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-events__inner {
    max-width: 560px;

    padding: 92px 32px 40px;
  }

  .bq-heading {
    font-size: 24px;
  }

  .bq-events__line {
    width: 180px;
  }

  .bq-event__title {
    font-size: 19px;
  }

  .bq-event__when {
    font-size: 15px;
  }

  .bq-event__date-line {
    height: 91px;
  }

  .bq-event__day {
    font-size: 57px;
  }

  .bq-event__side {
    font-size: 17px;
  }

  .bq-event__lunar {
    font-size: 14px;
  }

  .bq-schedule__label {
    font-size: 13px;
  }

  .bq-calendar {
    max-width: 360px;
  }

  .bq-calendar__cell {
    height: 34px;
  }

  .bq-calendar__heart {
    width: 30px;
    height: 28px;
  }

  .bq-calendar__heart b {
    font-size: 12px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bq-event {
    opacity: 1;
    transform: none;

    transition: none;
  }
}
</style>
