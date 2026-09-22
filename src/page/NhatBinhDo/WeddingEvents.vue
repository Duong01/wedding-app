<template>
  <section class="cfr-party">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="cfr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         TỪNG SỰ KIỆN
    ====================================================== -->

    <div
      v-for="event in normalizedEvents"
      :key="event.id"
      class="cfr-party__event"
    >

      <!-- =========================================
           GIỜ TIỆC
      ========================================== -->

      <h3 class="cfr-party__kicker">
        Tiệc báo hỷ sẽ diễn ra vào lúc:
      </h3>

      <div v-if="event.time" class="cfr-party__time">
        {{ event.time }}
      </div>


      <!-- =========================================
           NGÀY
      ========================================== -->

      <div v-if="event.hasDate" class="cfr-party__date">
        <span class="cfr-party__date-side">{{ event.weekday }}</span>

        <span class="cfr-party__date-sep" aria-hidden="true"></span>

        <span class="cfr-party__date-day">{{ event.day }}</span>

        <span class="cfr-party__date-sep" aria-hidden="true"></span>

        <span class="cfr-party__date-side">THÁNG {{ event.month }}</span>
      </div>

      <div v-if="event.year" class="cfr-party__year">
        {{ event.year }}
      </div>

      <div v-if="event.lunar" class="cfr-party__lunar">
        ({{ event.lunar }})
      </div>


      <!-- =========================================
           ĐÓN KHÁCH / KHAI TIỆC
      ========================================== -->

      <div
        v-if="event.receptionTime || event.ceremonyTime"
        class="cfr-party__milestones"
      >
        <div v-if="event.receptionTime" class="cfr-party__milestone">
          <span class="cfr-party__milestone-label">Đón khách</span>

          <span class="cfr-party__milestone-time">
            {{ event.receptionTime }}
          </span>
        </div>

        <div v-if="event.ceremonyTime" class="cfr-party__milestone">
          <span class="cfr-party__milestone-label">Khai tiệc</span>

          <span class="cfr-party__milestone-time">
            {{ event.ceremonyTime }}
          </span>
        </div>
      </div>


      <!-- =========================================
           LỊCH THÁNG
      ========================================== -->

      <div v-if="event.calendarDays.length" class="cfr-party__calendar">
        <img
          :src="calendarFrame"
          class="cfr-party__calendar-frame"
          alt=""
          aria-hidden="true"
        />

        <div class="cfr-party__calendar-body">

          <div class="cfr-party__calendar-head">
            Tháng {{ event.month }} / {{ event.year }}
          </div>

          <div class="cfr-party__calendar-weekdays">
            <span v-for="label in WEEKDAY_LABELS" :key="label">
              {{ label }}
            </span>
          </div>

          <div class="cfr-party__calendar-days">
            <div
              v-for="(day, dayIndex) in event.calendarDays"
              :key="dayIndex"
              class="cfr-party__calendar-cell"
            >
              <template v-if="day">
                <span
                  v-if="day === Number(event.day)"
                  class="cfr-party__calendar-active"
                >
                  <svg viewBox="0 0 24 22" aria-hidden="true">
                    <path
                      d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z"
                    />
                  </svg>

                  <span>{{ day }}</span>
                </span>

                <span v-else class="cfr-party__calendar-day">
                  {{ day }}
                </span>
              </template>
            </div>
          </div>

        </div>
      </div>


      <!-- =========================================
           THÊM VÀO LỊCH
      ========================================== -->

      <a
        v-if="event.calendarUrl"
        :href="event.calendarUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="cfr-link cfr-party__calendar-link"
      >
        Thêm vào lịch
      </a>


      <!-- =========================================
           XÁC NHẬN THAM DỰ
      ========================================== -->

      <button
        type="button"
        class="cfr-pill cfr-party__rsvp"
        @click="openConfirmModal"
      >
        XÁC NHẬN THAM DỰ
      </button>

    </div>


    <!-- =====================================================
         MODAL XÁC NHẬN
    ====================================================== -->

    <Teleport to="body">

      <div
        v-if="showConfirmModal"
        class="cfr-confirm"
        @click.self="closeConfirmModal"
      >
        <div class="cfr-confirm__box">

          <button
            type="button"
            class="cfr-confirm__close"
            aria-label="Đóng"
            @click="closeConfirmModal"
          >
            ✕
          </button>

          <div class="cfr-confirm__head">
            <h3>XÁC NHẬN THAM DỰ</h3>

            <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
          </div>

          <div class="cfr-confirm__body">

            <!-- NGƯỜI ĐƯỢC MỜI -->

            <div v-if="hasRecipient" class="cfr-confirm__recipient">
              <div class="cfr-confirm__recipient-label">
                TRÂN TRỌNG KÍNH MỜI
              </div>

              <div class="cfr-confirm__recipient-name">
                {{ recipientLabel }}
              </div>
            </div>

            <!-- TỰ NHẬP TÊN -->

            <div v-else class="cfr-confirm__group">
              <label>Họ và tên</label>

              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Nhập tên của bạn"
                maxlength="100"
              />
            </div>


            <!-- THAM DỰ -->

            <div class="cfr-confirm__group">
              <label>Bạn có tham dự không?</label>

              <div class="cfr-confirm__options">
                <button
                  type="button"
                  class="cfr-confirm__option"
                  :class="{ 'is-selected': form.attendance === 'attending' }"
                  @click="form.attendance = 'attending'"
                >
                  ✓ Có, tôi sẽ tham dự
                </button>

                <button
                  type="button"
                  class="cfr-confirm__option"
                  :class="{ 'is-selected': form.attendance === 'not_attending' }"
                  @click="form.attendance = 'not_attending'"
                >
                  ✕ Rất tiếc, tôi không thể tham dự
                </button>
              </div>
            </div>


            <!-- SỐ NGƯỜI -->

            <div
              v-if="form.attendance === 'attending'"
              class="cfr-confirm__group"
            >
              <label>Số người tham dự</label>

              <div class="cfr-confirm__people">
                <button type="button" @click="decreasePeople">−</button>

                <span>{{ form.numberOfPeople }}</span>

                <button type="button" @click="increasePeople">+</button>
              </div>
            </div>


            <div v-if="errorMessage" class="cfr-confirm__error">
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="cfr-confirm__success">
              {{ successMessage }}
            </div>


            <button
              type="button"
              class="cfr-pill cfr-confirm__submit"
              :disabled="submitting"
              @click="submitConfirmation"
            >
              {{ submitting ? "ĐANG GỬI..." : "GỬI XÁC NHẬN" }}
            </button>

          </div>

        </div>
      </div>

    </Teleport>

  </section>
</template>


<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { Confirm } from "@/model/api";
import { sectionText } from "@/data/sectionTitles";

import { calendarFrame } from "./crystalFloralAssets";


/* =========================================================
   PROPS
========================================================= */

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },

  recipientName: {
    type: [Object, Array, String],
    default: null,
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});

const route = useRoute();


/* =========================================================
   TIÊU ĐỀ MỤC
========================================================= */

const heading = computed(() =>
  sectionText(props.sections, "events", "Heading")
);


/* =========================================================
   NGƯỜI ĐƯỢC MỜI
========================================================= */

const recipientLabel = computed(() => {
  const value = props.recipientName;

  if (!value) return "";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value[0]?.Name || "";
  }

  return value.Name || "";
});

const hasRecipient = computed(() => Boolean(recipientLabel.value));


/* =========================================================
   LỊCH
========================================================= */

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];


/* =========================================================
   CHUẨN HÓA SỰ KIỆN
========================================================= */

const normalizedEvents = computed(() =>
  (props.events || []).map((event, index) => {
    const item = event || {};

    return {
      id: item.Id || index,

      time: item.EventTime || "",

      weekday: item.Weekday || "",

      day: item.Day || "",

      month: item.Month || "",

      year: item.Year || "",

      lunar: item.Lunar || "",

      receptionTime: item.ReceptionTime || item.Reception_time || "",

      ceremonyTime: item.CeremonyTime || item.Ceremony_time || "",

      calendarUrl: item.calendarUrl || item.calendar_url || "",

      calendarDays: createCalendarDays(item),

      hasDate: Boolean(
        item.EventTime ||
        item.Weekday ||
        item.Day ||
        item.Month ||
        item.Year
      ),
    };
  })
);


/*
 * Lưới lịch bắt đầu từ thứ Hai (T2) như mẫu gốc.
 */
function createCalendarDays(event) {
  const year = Number(event?.Year);
  const month = Number(event?.Month);

  if (!year || !month) {
    return [];
  }

  const firstWeekday = new Date(year, month - 1, 1).getDay();

  const totalDays = new Date(year, month, 0).getDate();

  /* getDay(): 0 = CN → đổi sang 0 = T2 */
  const leading = (firstWeekday + 6) % 7;

  const days = [];

  for (let i = 0; i < leading; i++) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  return days;
}


/* =========================================================
   FORM
========================================================= */

const form = reactive({
  name: "",
  attendance: "attending",
  numberOfPeople: 1,
});

const showConfirmModal = ref(false);

const submitting = ref(false);

const errorMessage = ref("");

const successMessage = ref("");


function openConfirmModal() {
  errorMessage.value = "";

  successMessage.value = "";

  form.name = hasRecipient.value ? recipientLabel.value : "";

  form.attendance = "attending";

  form.numberOfPeople = 1;

  showConfirmModal.value = true;
}


function closeConfirmModal() {
  if (submitting.value) return;

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
   GỬI XÁC NHẬN
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

  const slug = route.params.slug
    ? route.params.token
      ? `${route.params.slug}/${route.params.token}`
      : route.params.slug
    : "";

  const payload = {
    Slug: slug,
    RecipientToken: route.params.token || null,
    GuestName: form.name,
    Attendance:
      form.attendance === "attending" ? "Có tham dự" : "Không tham dự",
    NumberOfPeople:
      form.attendance === "attending" ? form.numberOfPeople : 0,
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
    errorMessage.value =
      error?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
  } finally {
    submitting.value = false;
  }
}
</script>


<style scoped>
/* =========================================================
   SECTION
========================================================== */

.cfr-party {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;

  color: var(--cfr-red-deep);

  text-align: center;
}

.cfr-party__event {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;

  width: 100%;
}


/* =========================================================
   GIỜ TIỆC
========================================================== */

.cfr-party__kicker {
  margin: 0;

  color: var(--cfr-red);

  font-size: 16px;
  font-weight: 600;

  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.cfr-party__time {
  color: var(--cfr-red-deep);

  font-size: 20px;
}


/* =========================================================
   NGÀY
========================================================== */

.cfr-party__date {
  display: flex;
  align-items: center;

  gap: 24px;
}

.cfr-party__date-side {
  font-size: 12px;

  text-transform: uppercase;
}

.cfr-party__date-side:first-child {
  text-align: right;
}

.cfr-party__date-side:last-child {
  text-align: left;
}

.cfr-party__date-sep {
  flex-shrink: 0;

  width: 2px;
  height: 24px;

  background-color: var(--cfr-red-deep);
}

.cfr-party__date-day {
  color: var(--cfr-red);

  font-size: 30px;

  line-height: 1;
}

.cfr-party__year {
  color: var(--cfr-red-deep);

  font-size: 18px;
}

.cfr-party__lunar {
  color: var(--cfr-red-deep);

  font-size: 12px;

  letter-spacing: 0.12em;
  text-transform: uppercase;
}


/* =========================================================
   ĐÓN KHÁCH / KHAI TIỆC
========================================================== */

.cfr-party__milestones {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 32px;

  margin-top: 16px;
}

.cfr-party__milestone {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cfr-party__milestone-label {
  color: var(--cfr-red-deep);

  font-size: 12px;

  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.cfr-party__milestone-time {
  margin-top: 4px;

  color: var(--cfr-red);

  font-size: 18px;
  font-weight: 500;
}


/* =========================================================
   LỊCH
========================================================== */

.cfr-party__calendar {
  position: relative;

  width: 100%;
  max-width: 360px;

  aspect-ratio: 358 / 304;

  margin-top: 32px;
}

.cfr-party__calendar-frame {
  position: absolute;
  inset: 0;

  z-index: 10;

  width: 100%;
  height: 100%;

  object-fit: fill;

  pointer-events: none;
}

.cfr-party__calendar-body {
  position: relative;
  z-index: 20;

  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  height: 100%;

  padding: 28px 32px;

  color: var(--cfr-red);
}

.cfr-party__calendar-head {
  padding: 10px 0;

  border-bottom: 1px solid var(--cfr-hairline);

  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.025em;
  text-align: center;
}

.cfr-party__calendar-weekdays {
  display: grid;

  grid-template-columns: repeat(7, minmax(0, 1fr));

  border-bottom: 2px solid var(--cfr-red);
}

.cfr-party__calendar-weekdays span {
  padding: 6px 0;

  font-size: 10px;
  font-weight: 500;

  text-align: center;

  opacity: 0.6;
}

.cfr-party__calendar-days {
  display: grid;

  grid-template-columns: repeat(7, minmax(0, 1fr));

  row-gap: 2px;

  padding: 8px 4px;
}

.cfr-party__calendar-cell {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30px;
}

.cfr-party__calendar-day {
  font-size: 12px;
}

.cfr-party__calendar-active {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 24px;
}

.cfr-party__calendar-active svg {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  fill: var(--cfr-red);
}

.cfr-party__calendar-active span {
  position: relative;
  z-index: 1;

  color: #ffffff;

  font-size: 11px;
  font-weight: 700;
}


/* =========================================================
   THÊM VÀO LỊCH
========================================================== */

.cfr-party__calendar-link {
  margin-top: 12px;
}


/* =========================================================
   RSVP
========================================================== */

.cfr-party__rsvp {
  margin-top: 8px;
}


/* =========================================================
   MODAL
========================================================== */

.cfr-confirm {
  position: fixed;
  inset: 0;

  z-index: 2000;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.6);
}

.cfr-confirm__box {
  position: relative;

  width: 100%;
  max-width: 576px;
  max-height: 90vh;

  overflow-y: auto;

  border-radius: 16px 16px 0 0;

  background-color: var(--cfr-cream);
  color: var(--cfr-red-deep);
}

.cfr-confirm__close {
  position: absolute;
  top: 12px;
  right: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;

  border: none;
  border-radius: 50%;

  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;

  font-size: 15px;

  cursor: pointer;
}

.cfr-confirm__head {
  padding: 24px 24px 16px;

  background-color: var(--cfr-red);
  color: #ffffff;

  text-align: center;
}

.cfr-confirm__head h3 {
  margin: 0;

  font-family: var(--cfr-font-heading);
  font-size: 21px;
  font-weight: 700;

  letter-spacing: 0.02em;
}

.cfr-confirm__head p {
  margin: 8px 0 0;

  font-size: 13px;

  opacity: 0.9;
}

.cfr-confirm__body {
  display: flex;
  flex-direction: column;

  gap: 16px;

  padding: 20px;
}

.cfr-confirm__recipient {
  padding: 14px;

  border: 1px solid var(--cfr-hairline);
  border-radius: 8px;

  text-align: center;
}

.cfr-confirm__recipient-label {
  font-size: 11px;

  letter-spacing: 0.15em;

  opacity: 0.7;
}

.cfr-confirm__recipient-name {
  margin-top: 6px;

  color: var(--cfr-red);

  font-size: 18px;
  font-weight: 700;
}

.cfr-confirm__group {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.cfr-confirm__group label {
  font-size: 13px;
  font-weight: 600;
}

.cfr-confirm__group input {
  width: 100%;

  padding: 12px 16px;

  border: 1px solid var(--cfr-hairline);
  border-radius: 8px;

  background-color: rgba(255, 255, 255, 0.6);
  color: var(--cfr-red-deep);

  font-size: 16px;

  outline: none;
}

.cfr-confirm__options {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.cfr-confirm__option {
  padding: 12px 16px;

  border: 1px solid var(--cfr-hairline);
  border-radius: 8px;

  background-color: transparent;
  color: var(--cfr-red-deep);

  font-size: 14px;

  text-align: left;

  cursor: pointer;

  transition: background-color 0.2s ease;
}

.cfr-confirm__option.is-selected {
  border-color: var(--cfr-red);

  background-color: var(--cfr-hairline-soft);
  color: var(--cfr-red);

  font-weight: 600;
}

.cfr-confirm__people {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 20px;
}

.cfr-confirm__people button {
  width: 36px;
  height: 36px;

  border: 1px solid var(--cfr-hairline);
  border-radius: 50%;

  background-color: transparent;
  color: var(--cfr-red-deep);

  font-size: 18px;

  cursor: pointer;
}

.cfr-confirm__people span {
  min-width: 32px;

  font-size: 18px;
}

.cfr-confirm__error {
  color: #b3261e;

  font-size: 13px;

  text-align: center;
}

.cfr-confirm__success {
  color: var(--cfr-red);

  font-size: 13px;

  text-align: center;
}

.cfr-confirm__submit {
  width: 100%;
}


/* =========================================================
   DESKTOP
========================================================== */

@media (min-width: 900px) {
  .cfr-party {
    gap: 32px;
  }

  .cfr-party__kicker {
    font-size: 18px;
  }

  .cfr-party__time {
    font-size: 30px;
  }

  .cfr-party__date {
    gap: 24px;
  }

  .cfr-party__date-side {
    font-size: 16px;
  }

  .cfr-party__date-sep {
    height: 32px;
  }

  .cfr-party__date-day {
    font-size: 40px;
  }

  .cfr-party__year {
    font-size: 24px;
  }

  .cfr-party__lunar {
    font-size: 14px;
  }

  .cfr-party__milestone-label {
    font-size: 13px;
  }

  .cfr-party__milestone-time {
    font-size: 20px;
  }

  .cfr-party__calendar {
    max-width: 440px;
  }

  .cfr-party__calendar-body {
    padding: 36px 44px;
  }

  .cfr-party__calendar-head {
    font-size: 14px;
  }

  .cfr-party__calendar-weekdays span {
    font-size: 11px;
  }

  .cfr-party__calendar-cell {
    height: 34px;
  }

  .cfr-party__calendar-day {
    font-size: 13px;
  }

  .cfr-party__calendar-active {
    width: 30px;
    height: 28px;
  }

  .cfr-party__calendar-active span {
    font-size: 12px;
  }

  .cfr-confirm {
    align-items: center;

    padding: 24px;
  }

  .cfr-confirm__box {
    border-radius: 16px;
  }
}
</style>
