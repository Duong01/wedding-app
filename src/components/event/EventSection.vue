<template>
  <section class="event-section">
    <!-- HEADER -->
    <header class="event-header">
      <h2 class="event-title">THÔNG TIN TIỆC CƯỚI</h2>

      <div class="title-decoration">
        <span></span>
        <i>✦</i>
        <span></span>
      </div>

      <p class="event-description">
        Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi
        trong ngày trọng đại.
      </p>
    </header>

    <!-- MAIN DATE -->
    <div class="main-date">
      <div class="time-label">TIỆC CƯỚI ĐƯỢC TỔ CHỨC VÀO LÚC</div>

      <div class="event-time">
        {{ firstEvent.EventTime || firstEvent.Time }}
      </div>

      <div class="date-display">
        <div class="date-side">
          <span>
            {{ firstEvent.Weekday }}
          </span>
        </div>

        <div class="date-center">
          <span class="date-number">
            {{ firstEvent.Day }}
          </span>

          <span class="date-month"> THÁNG {{ firstEvent.Month }} </span>
        </div>

        <div class="date-side">
          <span>
            {{ firstEvent.Year }}
          </span>
        </div>
      </div>

      <div v-if="firstEvent.Lunar" class="lunar-date">
        {{ firstEvent.Lunar }}
      </div>
    </div>

    <!-- DIVIDER -->
    <div class="gold-divider">
      <span></span>

      <div class="divider-diamond">◆</div>

      <span></span>
    </div>

    <!-- CALENDAR -->
    <div class="calendar-card">
      <div class="calendar-header">
        <div class="calendar-month">THÁNG {{ firstEvent.Month }}</div>

        <div class="calendar-year">
          {{ firstEvent.Year }}
        </div>
      </div>

      <div class="calendar-week">
        <div v-for="day in weekDays" :key="day">
          {{ day }}
        </div>
      </div>

      <div class="calendar-days">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="{
            empty: !day,
            active: day === Number(firstEvent.Day),
          }"
        >
          <template v-if="day">
            <div v-if="day === Number(firstEvent.Day)" class="active-day">
              <span class="heart"> ♥ </span>

              <span class="active-number">
                {{ day }}
              </span>
            </div>

            <span v-else class="normal-day">
              {{ day }}
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- ACTION -->
    <div class="event-actions">
      <a
        class="calendar-button"
        :href="calendarUrl"
        target="_blank"
        rel="noopener"
      >
        <span class="button-icon"> ＋ </span>

        <span> THÊM VÀO LỊCH </span>
      </a>

      <button class="confirm-button" type="button" @click="openConfirmModal">
        <span> XÁC NHẬN THAM DỰ </span>

        <span class="button-arrow"> → </span>
      </button>
    </div>

    <!-- BOTTOM ORNAMENT -->
    <div class="section-ornament bottom-ornament">
      <span class="ornament-line"></span>

      <span class="ornament-symbol"> ❖ </span>

      <span class="ornament-line"></span>
    </div>

    <!-- =====================================================
         CONFIRM MODAL
    ====================================================== -->

    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="confirm-overlay"
        @click.self="closeConfirmModal"
      >
        <div class="confirm-modal">
          <!-- CLOSE -->
          <button class="modal-close" type="button" @click="closeConfirmModal">
            ×
          </button>

          <!-- HEADER -->
          <div class="modal-header">
            <div class="modal-symbol">❖</div>

            <h3>XÁC NHẬN THAM DỰ</h3>

            <p>Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.</p>
          </div>

          <!-- =================================================
               TH1: CÓ NGƯỜI ĐƯỢC MỜI
          ================================================== -->

          <template v-if="hasRecipient">
            <div class="recipient-box">
              <div class="recipient-label">TRÂN TRỌNG KÍNH MỜI</div>

              <div class="recipient-name">
                {{ recipientName }}
              </div>
            </div>
          </template>

          <!-- =================================================
               TH2: KHÔNG CÓ NGƯỜI ĐƯỢC MỜI
          ================================================== -->

          <template v-else>
            <div class="form-group">
              <label> Họ và tên </label>

              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Nhập tên của bạn"
                maxlength="100"
              />
            </div>
          </template>

          <!-- ATTEND -->
          <div class="form-group">
            <label> Bạn có tham dự không? </label>

            <div class="attendance-options">
              <button
                type="button"
                class="attendance-option"
                :class="{
                  selected: form.attendance === 'attending',
                }"
                @click="form.attendance = 'attending'"
              >
                <span class="option-icon"> ✓ </span>

                <span> Có, tôi sẽ tham dự </span>
              </button>

              <button
                type="button"
                class="attendance-option"
                :class="{
                  selected: form.attendance === 'not_attending',
                }"
                @click="form.attendance = 'not_attending'"
              >
                <span class="option-icon"> × </span>

                <span> Rất tiếc, tôi không thể tham dự </span>
              </button>
            </div>
          </div>

          <!-- NUMBER OF PEOPLE -->
          <div v-if="form.attendance === 'attending'" class="form-group">
            <label> Số người tham dự </label>

            <div class="people-control">
              <button type="button" @click="decreasePeople">−</button>

              <span>
                {{ form.numberOfPeople }}
              </span>

              <button type="button" @click="increasePeople">+</button>
            </div>
          </div>

          <!-- ERROR -->
          <div v-if="errorMessage" class="form-error">
            {{ errorMessage }}
          </div>

          <!-- SUCCESS -->
          <div v-if="successMessage" class="form-success">
            {{ successMessage }}
          </div>

          <!-- SUBMIT -->
          <button
            class="modal-submit"
            type="button"
            :disabled="submitting"
            @click="submitConfirmation"
          >
            <span v-if="!submitting"> GỬI XÁC NHẬN </span>

            <span v-else> ĐANG GỬI... </span>
          </button>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
/* =========================================================
   PROPS
========================================================= */

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },

  token: {
    type: String,
    default: "",
  },

  recipientName: {
    type: [Object, Array, String],
    default: null,
  },
});

/* =========================================================
   FIRST EVENT
========================================================= */

const firstEvent = computed(() => {
  return props.events?.[0] ?? {};
});

/* =========================================================
   RECIPIENT
========================================================= */

const hasRecipient = computed(() => {
  if (!props.recipientName) {
    return false;
  }

  if (typeof props.recipientName === "string") {
    return props.recipientName.trim().length > 0;
  }

  if (Array.isArray(props.recipientName)) {
    return props.recipientName.length > 0;
  }

  return !!props.recipientName.Name;
});

const recipientName = computed(() => {
  if (typeof props.recipientName === "string") {
    return props.recipientName;
  }

  if (Array.isArray(props.recipientName)) {
    return props.recipientName?.[0]?.Name ?? "";
  }

  return props.recipientName?.Name ?? "";
});

const recipientToken = computed(() => {
  if (Array.isArray(props.recipientName)) {
    return props.recipientName?.[0]?.token ?? props.token;
  }

  if (props.recipientName && typeof props.recipientName === "object") {
    return props.recipientName.token ?? props.token;
  }

  return props.token;
});
const showConfirmModal = ref(false);

const submitting = ref(false);

const errorMessage = ref("");

const successMessage = ref("");

/* =========================================================
   FORM
========================================================= */

const form = reactive({
  name: "",
  attendance: "attending",
  numberOfPeople: 1,

});

function openConfirmModal() {
  errorMessage.value = "";

  successMessage.value = "";

  /*
   * Nếu có người được mời
   * thì tự động dùng tên người nhận.
   */
  if (hasRecipient.value) {
    form.name = recipientName.value;
  } else {
    form.name = "";
  }
  form.attendance = "attending";
  form.numberOfPeople = 1;
  showConfirmModal.value = true;
}

/* =========================================================
   CLOSE MODAL
========================================================= */

function closeConfirmModal() {
  if (submitting.value) {
    return;
  }

  showConfirmModal.value = false;
}

/* =========================================================
   PEOPLE
========================================================= */

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
   SUBMIT
========================================================= */

async function submitConfirmation() {
  errorMessage.value = "";

  successMessage.value = "";

  /* =========================
     VALIDATE
  ========================== */

  if (!form.name) {
    errorMessage.value = "Vui lòng nhập họ tên.";

    return;
  }

  if (!form.attendance) {
    errorMessage.value = "Vui lòng chọn xác nhận tham dự.";

    return;
  }

  /* =========================
     PAYLOAD
  ========================== */
  const slug = computed(() => {

    // /wedding/:slug
    if (route.params.slug) {
        return route.params.slug;
    }

    // /:slug/:token
    if (route.params.slug && route.params.token) {
        return `${route.params.slug}/${route.params.token}`;
    }

    return "";
});
  const payload = {
    Slug: slug,
    RecipientToken: recipientToken.value || null,
    GuestName: form.name,
    Attendance: form.attendance === "attending" ? "Có tham dự" : "Không tham dự",
    NumberOfPeople: form.attendance === "attending" ? form.numberOfPeople : 0
  };

  /* =========================
     REQUEST
  ========================== */

  submitting.value = true;

  try {
      successMessage.value = "Cảm ơn bạn! Xác nhận của bạn đã được gửi thành công ❤️";
      setTimeout(() => {
        showConfirmModal.value = false;
      }, 2000);
  } catch (error) {
    errorMessage.value = error?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
  } finally {
    submitting.value = false;
  }
}

/* =========================================================
   GOOGLE CALENDAR
========================================================= */

const calendarUrl = computed(() => {
  const event = firstEvent.value;

  if (!event.EventDate) {
    return "https://calendar.google.com/calendar/render?action=TEMPLATE";
  }

  const start = `${event.EventDate.replaceAll("-", "")}T${(event.EventTime || "00:00").replace(":", "")}00`;

  const end = `${event.EventDate.replaceAll("-", "")}T${(event.EventTime || "00:00").replace(":", "")}00`;

  const title = `Đám cưới ${event.Title || ""}`;

  const location = event.Address || event.Location || "";

  return (
    "https://calendar.google.com/calendar/render" +
    "?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&location=${encodeURIComponent(location)}`
  );
});

/* =========================================================
   WEEK DAYS
========================================================= */

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/* =========================================================
   CALENDAR DAYS
========================================================= */

const calendarDays = computed(() => {
  const year = Number(firstEvent.value.Year);

  const month = Number(firstEvent.value.Month);

  if (!year || !month) {
    return [];
  }

  const firstDate = new Date(year, month - 1, 1);

  let start = firstDate.getDay();

  start = start === 0 ? 6 : start - 1;

  const totalDays = new Date(year, month, 0).getDate();

  const result = [];

  for (let i = 0; i < start; i++) {
    result.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    result.push(i);
  }

  while (result.length % 7 !== 0) {
    result.push(null);
  }

  return result;
});
</script>

<style scoped>
/* =========================================================
   EVENT
========================================================= */

.event-section {
  --event-red: var(--p-primary, #7b0d0d);

  --event-red-dark: var(--p-primary-dark, #620909);

  --event-gold: var(--p-gold, #a97931);

  --event-gold-light: var(--p-gold-light, #f8dfad);

  --event-text: var(--p-ink, #4f4039);

  --event-muted: var(--p-muted, #76655c);

  position: relative;

  width: 100%;

  margin: 0 auto;

  padding: 42px 16px 50px;

  box-sizing: border-box;

  color: var(--event-text);

  font-family: var(--font-base);

  text-align: center;

  overflow: hidden;
}

.event-section *,
.event-section *::before,
.event-section *::after {
  box-sizing: border-box;

  font-family: var(--font-base);
}

/* =========================================================
   HEADER
========================================================= */

.event-header {
  width: 100%;

  max-width: 520px;

  margin: 0 auto 30px;
}

.event-title {
  margin: 0;

  color: var(--event-red);

  font-family: var(--font-heading);

  font-size: var(--text-2xl);

  font-weight: 700;

  line-height: 1.2;

  letter-spacing: 0.04em;
}

.title-decoration {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 12px auto 13px;
}

.title-decoration span {
  width: 42px;

  max-width: 15vw;

  height: 1px;

  background: linear-gradient(
    90deg,
    transparent,
    var(--event-gold),
    transparent
  );
}

.title-decoration i {
  flex: 0 0 auto;

  color: var(--event-gold);

  font-size: var(--text-xs);

  font-style: normal;
}

.event-description {
  width: 100%;

  max-width: 330px;

  margin: 0 auto;

  color: var(--event-muted);

  font-family: var(--font-main);

  font-size: var(--text-sm);

  line-height: 1.65;
}

/* =========================================================
   DATE
========================================================= */

.main-date {
  width: 100%;

  max-width: 500px;

  margin: 0 auto 26px;
}

.time-label {
  margin-bottom: 7px;

  color: var(--event-gold);

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.12em;
}

.event-time {
  margin-bottom: 20px;

  color: var(--event-red);

  font-family: var(--font-heading);

  font-size: var(--text-2xl);

  font-weight: 700;
}

.date-display {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 13px;
}

.date-side {
  flex: 0 1 70px;

  color: var(--event-red);

  font-size: var(--text-sm);

  font-weight: 700;
}

.date-center {
  position: relative;

  flex: 0 0 auto;

  min-width: 94px;

  padding: 9px 13px;

  display: flex;

  flex-direction: column;

  align-items: center;
}

.date-center::before,
.date-center::after {
  content: "";

  position: absolute;

  left: 0;

  right: 0;

  height: 1px;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(169, 121, 49, 0.55),
    transparent
  );
}

.date-center::before {
  top: 0;
}

.date-center::after {
  bottom: 0;
}

.date-number {
  color: var(--event-red);

  font-family: var(--font-heading);

  font-size: var(--text-display);

  font-weight: 700;

  line-height: 0.85;
}

.date-month {
  margin-top: 9px;

  color: var(--event-gold);

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.13em;

  white-space: nowrap;
}

.lunar-date {
  margin-top: 13px;

  color: var(--event-muted);

  font-size: var(--text-sm);

  font-style: italic;
}

/* =========================================================
   DIVIDER
========================================================= */

.gold-divider {
  display: flex;

  align-items: center;

  gap: 10px;

  width: min(230px, 70%);

  margin: 26px auto 25px;
}

.gold-divider span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(169, 121, 49, 0.55));
}

.gold-divider span:last-child {
  background: linear-gradient(90deg, rgba(169, 121, 49, 0.55), transparent);
}

.divider-diamond {
  color: var(--event-gold);
}

/* =========================================================
   CALENDAR
========================================================= */

.calendar-card {
  width: 100%;

  max-width: 350px;

  margin: 0 auto 30px;

  padding: 22px 17px 20px;

  border: 1px solid rgba(123, 13, 13, 0.16);

  box-shadow: 0 8px 24px rgba(80, 40, 20, 0.035);
}

.calendar-header {
  margin-bottom: 18px;
}

.calendar-month {
  color: var(--event-red);

  font-family: var(--font-heading);

  font-size: var(--text-xl);

  font-weight: 700;
}

.calendar-year {
  margin-top: 4px;

  color: var(--event-muted);

  font-size: var(--text-xs);

  letter-spacing: 0.12em;
}

.calendar-week,
.calendar-days {
  display: grid;

  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.calendar-week {
  padding-bottom: 8px;

  border-bottom: 1px solid rgba(123, 13, 13, 0.14);
}

.calendar-week > div {
  color: var(--event-gold);

  font-size: var(--text-xs);

  font-weight: 700;
}

.calendar-days {
  row-gap: 3px;

  padding-top: 8px;
}

.calendar-cell {
  min-height: 36px;

  display: flex;

  align-items: center;

  justify-content: center;
}

.active-day {
  position: relative;

  width: 45px;

  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;
}

.heart {
  position: absolute;

  inset: -2px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: var(--event-red);

  font-size: 39px;
}

.active-number {
  position: relative;

  z-index: 2;

  color: #fffaf4;

  font-size: var(--text-xs);

  font-weight: 700;
}

/* =========================================================
   ACTION
========================================================= */

.event-actions {
  display: flex;

  flex-direction: column;

  gap: 10px;

  width: 100%;

  max-width: 340px;

  margin: 0 auto;
}

.calendar-button,
.confirm-button {
  width: 100%;

  min-height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 10px 18px;

  font-size: var(--text-sm);

  font-weight: 700;

  letter-spacing: 0.06em;

  cursor: pointer;

  text-decoration: none;
}

.calendar-button {
  border: 1px solid rgba(123, 13, 13, 0.22);

  color: var(--event-red);

  background: transparent;
}

.confirm-button {
  border: 1px solid var(--event-red);

  color: #fffaf4;

  background: linear-gradient(135deg, var(--event-red), var(--event-red-dark));

  box-shadow: 0 7px 18px rgba(123, 13, 13, 0.14);
}

.button-arrow {
  color: #f2d08b;

  font-size: 17px;
}

/* =========================================================
   ORNAMENT
========================================================= */

.section-ornament {
  display: flex;

  align-items: center;

  gap: 9px;

  width: 100%;

  max-width: 180px;

  margin: 34px auto 0;
}

.ornament-line {
  flex: 1;

  height: 1px;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(169, 121, 49, 0.45),
    transparent
  );
}

.ornament-symbol {
  color: var(--event-gold);
}
/* =========================================================
   CONFIRM MODAL
   ĐỘC LẬP HOÀN TOÀN VỚI CSS CHUNG
========================================================= */

.confirm-overlay {
  position: fixed;
  inset: 0;

  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;

  /*
     * Overlay tối, không dùng màu theme
     */
  background: rgba(0, 0, 0, 0.62);

  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

/* =========================================================
   MODAL
========================================================= */

.confirm-modal {
  position: relative;

  width: 100%;
  max-width: 460px;

  max-height: calc(100vh - 32px);

  overflow-y: auto;

  padding: 0;

  /*
     * QUAN TRỌNG:
     * ÉP BACKGROUND RIÊNG CHO MODAL
     *
     * Không dùng:
     * var(--p-background)
     * var(--p-primary)
     * background chung
     */

  background: #fffaf4 !important;

  color: #4f4039 !important;

  border: 1px solid #e6d5b8;

  border-radius: 24px;

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.32);

  /*
     * Không cho background của body / section
     * ảnh hưởng vào modal
     */

  isolation: isolate;

  font-family: var(--font-main), "Cormorant Garamond", serif;
}

/* =========================================================
   SCROLLBAR
========================================================= */

.confirm-modal::-webkit-scrollbar {
  width: 5px;
}

.confirm-modal::-webkit-scrollbar-track {
  background: transparent;
}

.confirm-modal::-webkit-scrollbar-thumb {
  background: #d8b46d;
  border-radius: 20px;
}

/* =========================================================
   CLOSE
========================================================= */

.modal-close {
  position: absolute;

  top: 14px;
  right: 15px;

  z-index: 10;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;
  border-radius: 50%;

  background: #f3eadb !important;

  color: #6b5146 !important;

  font-family: Arial, sans-serif;

  font-size: 23px;
  font-weight: 400;

  line-height: 1;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.modal-close:hover {
  background: #7b0d0d !important;

  color: #fffaf4 !important;

  transform: rotate(90deg);
}

/* =========================================================
   HEADER
========================================================= */

.modal-header {
  padding: 32px 28px 22px;

  text-align: center;

  /*
     * Header có màu riêng
     */
  background: linear-gradient(180deg, #f8eee0 0%, #fffaf4 100%);

  border-bottom: 1px solid #eadcc7;
}

/* =========================================================
   SYMBOL
========================================================= */

.modal-symbol {
  margin-bottom: 8px;

  color: #a97931 !important;

  font-size: 23px;

  line-height: 1;
}

/* =========================================================
   TITLE
========================================================= */

.modal-header h3 {
  margin: 0;

  color: #7b0d0d !important;

  font-family: var(--font-heading), "Cormorant Garamond", serif;

  font-size: 25px;

  font-weight: 700;

  line-height: 1.2;

  letter-spacing: 0.06em;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.modal-header p {
  max-width: 330px;

  margin: 10px auto 0;

  color: #76655c !important;

  font-family: var(--font-main), "Cormorant Garamond", serif;

  font-size: 14px;

  line-height: 1.6;
}

/* =========================================================
   RECIPIENT
========================================================= */

.recipient-box {
  margin: 22px 28px 20px;

  padding: 15px 18px;

  text-align: center;

  background: #f8f1e6 !important;

  border: 1px solid #ddc79f;

  border-radius: 14px;
}

.recipient-label {
  margin-bottom: 5px;

  color: #a97931 !important;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.12em;
}

.recipient-name {
  color: #7b0d0d !important;

  font-family: var(--font-heading), "Cormorant Garamond", serif;

  font-size: 18px;

  font-weight: 700;
}

/* =========================================================
   FORM
========================================================= */

.form-group {
  margin: 18px 28px;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  color: #5c4d46 !important;

  font-size: 14px;

  font-weight: 700;
}

/* =========================================================
   INPUT
========================================================= */

.form-group input {
  width: 100%;

  min-height: 46px;

  padding: 11px 14px;

  border: 1px solid #d9cbb8 !important;

  border-radius: 12px;

  outline: none;

  background: #ffffff !important;

  color: #4f4039 !important;

  font-family: var(--font-main), "Cormorant Garamond", serif;

  font-size: 14px;

  box-sizing: border-box;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: #9a8b80 !important;
}

.form-group input:focus {
  border-color: #a97931 !important;

  box-shadow: 0 0 0 3px rgba(169, 121, 49, 0.1);
}

/* =========================================================
   ATTENDANCE OPTIONS
========================================================= */

.attendance-options {
  display: flex;

  flex-direction: column;

  gap: 9px;
}

.attendance-option {
  width: 100%;

  min-height: 48px;

  display: flex;

  align-items: center;

  gap: 11px;

  padding: 10px 13px;

  border: 1px solid #ded1bf !important;

  border-radius: 12px;

  background: #ffffff !important;

  color: #5c4d46 !important;

  font-family: var(--font-main), "Cormorant Garamond", serif;

  font-size: 14px;

  text-align: left;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.attendance-option:hover {
  border-color: #b89455 !important;

  background: #fffaf4 !important;
}

.attendance-option.selected {
  border-color: #7b0d0d !important;

  background: #fbf1ec !important;

  color: #7b0d0d !important;
}

/* =========================================================
   OPTION ICON
========================================================= */

.option-icon {
  width: 29px;
  height: 29px;

  flex: 0 0 29px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #f1e4cc !important;

  color: #7b0d0d !important;

  font-family: Arial, sans-serif;

  font-size: 14px;

  font-weight: 700;
}

.attendance-option.selected .option-icon {
  background: #7b0d0d !important;

  color: #fffaf4 !important;
}

/* =========================================================
   NUMBER OF PEOPLE
========================================================= */

.people-control {
  width: 135px;
  height: 44px;

  display: flex;

  align-items: center;

  margin: 0 auto;

  overflow: hidden;

  border: 1px solid #d9cbb8;

  border-radius: 12px;

  background: #ffffff !important;
}

.people-control button {
  width: 43px;
  height: 100%;

  padding: 0;

  border: none;

  background: transparent !important;

  color: #7b0d0d !important;

  font-size: 20px;

  cursor: pointer;
}

.people-control button:hover {
  background: #f8eee0 !important;
}

.people-control span {
  flex: 1;

  text-align: center;

  color: #4f4039 !important;

  font-family: var(--font-heading), "Cormorant Garamond", serif;

  font-size: 18px;

  font-weight: 700;
}

/* =========================================================
   ERROR
========================================================= */

.form-error {
  margin: 0 28px 15px;

  padding: 10px 13px;

  border-radius: 10px;

  background: #fbe9e7 !important;

  color: #b3261e !important;

  font-size: 13px;

  line-height: 1.5;
}

/* =========================================================
   SUCCESS
========================================================= */

.form-success {
  margin: 0 28px 15px;

  padding: 10px 13px;

  border-radius: 10px;

  background: #edf6ed !important;

  color: #36743a !important;

  font-size: 13px;

  line-height: 1.5;
}

/* =========================================================
   SUBMIT
========================================================= */

.modal-submit {
  width: calc(100% - 56px);

  min-height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin: 6px 28px 28px;

  padding: 10px 20px;

  border: 1px solid #7b0d0d !important;

  border-radius: 13px;

  background: linear-gradient(135deg, #7b0d0d, #620909) !important;

  color: #fffaf4 !important;

  font-family: var(--font-main), "Cormorant Garamond", serif;

  font-size: 14px;

  font-weight: 700;

  letter-spacing: 0.08em;

  cursor: pointer;

  box-shadow: 0 7px 18px rgba(123, 13, 13, 0.18);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.modal-submit:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow: 0 10px 24px rgba(123, 13, 13, 0.25);
}

.modal-submit:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .confirm-overlay {
    padding: 12px;
  }

  .confirm-modal {
    max-height: calc(100vh - 24px);

    border-radius: 20px;
  }

  .modal-header {
    padding: 28px 20px 20px;
  }

  .modal-header h3 {
    font-size: 21px;
  }

  .recipient-box {
    margin: 18px 20px;
    padding: 13px 15px;
  }

  .form-group {
    margin: 16px 20px;
  }

  .modal-submit {
    width: calc(100% - 40px);

    margin: 5px 20px 22px;
  }

  .form-error,
  .form-success {
    margin-left: 20px;
    margin-right: 20px;
  }
}

/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 359px) {
  .confirm-overlay {
    padding: 8px;
  }

  .confirm-modal {
    border-radius: 18px;
  }

  .modal-header {
    padding: 24px 16px 18px;
  }

  .form-group {
    margin: 14px 16px;
  }

  .modal-submit {
    width: calc(100% - 32px);

    margin: 5px 16px 18px;
  }
}
</style>
