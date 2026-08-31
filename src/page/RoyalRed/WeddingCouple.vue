<template>
  <section class="rr-couple-section">
    <!-- ================= BACKGROUND ================= -->
    <div class="rr-couple-pattern"></div>
    <div class="rr-couple-glow"></div>

    <!-- ================= MAIN CARD ================= -->
    <div class="rr-couple-card">

      <!-- TOP ORNAMENT -->
      <div class="rr-top-decoration">
        <span class="rr-decoration-line"></span>
        <span class="rr-decoration-symbol">囍</span>
        <span class="rr-decoration-line"></span>
      </div>

      <!-- ================= HEADER ================= -->
      <header class="rr-event-header">
        <span class="rr-section-subtitle">
          TRÂN TRỌNG KÍNH MỜI
        </span>

        <h2 class="rr-event-title">
          THÔNG TIN TIỆC CƯỚI
        </h2>

        <div class="rr-title-decoration">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>
      </header>

      <!-- ================= GUEST ================= -->
      <section class="rr-guest-card">
        <div class="rr-guest-top">
          <span></span>
          <b>♥</b>
          <span></span>
        </div>

        <div class="rr-guest-label">
          KÍNH MỜI QUÝ KHÁCH
        </div>

        <div class="rr-guest-name">
          {{ guestName }}
        </div>

        <div class="rr-guest-note">
          thân mến đến tham dự
        </div>

        <div class="rr-guest-bottom">
          <span></span>
          <i>❦</i>
          <span></span>
        </div>
      </section>

      <!-- ================= INVITATION TEXT ================= -->
      <div class="rr-invitation-text">
        <p>
          Sự hiện diện của quý khách<br />
          là niềm vinh hạnh cho gia đình chúng tôi.
        </p>
      </div>

      <!-- ================= FAMILY / COUPLE ================= -->
      <div class="rr-family-grid">

        <!-- NHÀ GÁI -->
        <div class="rr-family-column rr-bride-column">

          <span class="rr-family-role">
            NHÀ GÁI
          </span>

          <h3>
            {{ brideName }}
          </h3>

          <div class="rr-family-divider"></div>

          <p v-if="brideFather">
            <span>Ông</span>
            {{ brideFather }}
          </p>

          <p v-if="brideMother">
            <span>Bà</span>
            {{ brideMother }}
          </p>

        </div>

        <!-- CENTER -->
        <div class="rr-family-center">

          <div class="rr-center-ornament">
            <span></span>
            <b>✦</b>
            <span></span>
          </div>

          <div class="rr-ampersand">
            &
          </div>

          <div class="rr-center-ornament">
            <span></span>
            <b>✦</b>
            <span></span>
          </div>

        </div>

        <!-- NHÀ TRAI -->
        <div class="rr-family-column rr-groom-column">

          <span class="rr-family-role">
            NHÀ TRAI
          </span>

          <h3>
            {{ groomName }}
          </h3>

          <div class="rr-family-divider"></div>

          <p v-if="groomFather">
            <span>Ông</span>
            {{ groomFather }}
          </p>

          <p v-if="groomMother">
            <span>Bà</span>
            {{ groomMother }}
          </p>

        </div>

      </div>

      <!-- ================= DATE ================= -->
      <div class="rr-wedding-date">

        <div class="rr-date-top">
          <span class="rr-date-line"></span>

          <span class="rr-weekday">
            {{ weddingWeekday }}
          </span>

          <span class="rr-date-line"></span>
        </div>

        <div class="rr-date-main">

          <div class="rr-date-side">
            <span>THÁNG</span>
            <strong>{{ weddingMonth }}</strong>
          </div>

          <div class="rr-date-day">
            {{ weddingDay }}
          </div>

          <div class="rr-date-side">
            <span>NĂM</span>
            <strong>{{ weddingYear }}</strong>
          </div>

        </div>

        <div
          v-if="weddingLunar"
          class="rr-lunar-date"
        >
          {{ weddingLunar }}
        </div>

      </div>

      <!-- ================= EVENT ================= -->
      <div
        v-if="mainEvent"
        class="rr-event-information"
      >

        <div class="rr-event-heading">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

        <div class="rr-event-time">

          <small>
            THỜI GIAN CỬ HÀNH HÔN LỄ
          </small>

          <strong>
            {{ eventTime }}
          </strong>

        </div>

        <div
          v-if="eventName || eventLocation || eventAddress"
          class="rr-event-location"
        >

          <strong v-if="eventName">
            {{ eventName }}
          </strong>

          <p v-if="eventLocation">
            {{ eventLocation }}
          </p>

          <p v-if="eventAddress">
            {{ eventAddress }}
          </p>

        </div>

        <a
          v-if="eventMapUrl"
          :href="eventMapUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="rr-map-button"
        >
          <span>⌖</span>
          XEM BẢN ĐỒ
        </a>

      </div>

      <!-- ================= BOTTOM ================= -->
      <div class="rr-bottom-decoration">
        <span></span>
        <b>♥</b>
        <span></span>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  couple: {
    type: Object,
    default: () => ({}),
  },

  events: {
    type: Array,
    default: () => [],
  },

  wedding: {
    type: Object,
    default: () => ({}),
  },

  /*
   * TÊN NGƯỜI ĐƯỢC MỜI
   *
   * Có thể truyền:
   *
   * <Component guest-name="Anh Nguyễn Văn A" />
   *
   * hoặc:
   *
   * :guest-name="guestName"
   */
  guestName: {
    type: String,
    default: "Quý Khách",
  },
});


/* =========================================================
   COUPLE
========================================================= */

const bride = computed(() => {
  return (
    props.couple?.Bride ||
    props.wedding?.couple?.Bride ||
    {}
  );
});

const groom = computed(() => {
  return (
    props.couple?.Groom ||
    props.wedding?.couple?.Groom ||
    {}
  );
});


const brideName = computed(() => {
  return (
    bride.value?.Name ||
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    "Cô dâu"
  );
});


const groomName = computed(() => {
  return (
    groom.value?.Name ||
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    "Chú rể"
  );
});


const brideFather = computed(() => {
  return (
    bride.value?.Father ||
    props.wedding?.BrideFather ||
    props.wedding?.brideFather ||
    ""
  );
});


const brideMother = computed(() => {
  return (
    bride.value?.Mother ||
    props.wedding?.BrideMother ||
    props.wedding?.brideMother ||
    ""
  );
});


const groomFather = computed(() => {
  return (
    groom.value?.Father ||
    props.wedding?.GroomFather ||
    props.wedding?.groomFather ||
    ""
  );
});


const groomMother = computed(() => {
  return (
    groom.value?.Mother ||
    props.wedding?.GroomMother ||
    props.wedding?.groomMother ||
    ""
  );
});


/* =========================================================
   EVENT
========================================================= */

const mainEvent = computed(() => {
  return props.events?.[0] || null;
});


const weddingDate = computed(() => {

  if (mainEvent.value?.EventDate) {

    const date =
      dayjs(mainEvent.value.EventDate);

    if (date.isValid()) {
      return date;
    }
  }

  const date =
    dayjs(props.wedding?.weddingDate);

  return date.isValid()
    ? date
    : dayjs();
});


const weddingDay = computed(() => {

  if (mainEvent.value?.Day) {
    return String(
      mainEvent.value.Day
    ).padStart(2, "0");
  }

  return weddingDate.value.format("DD");
});


const weddingMonth = computed(() => {

  if (mainEvent.value?.Month) {
    return String(
      mainEvent.value.Month
    ).padStart(2, "0");
  }

  return weddingDate.value.format("MM");
});


const weddingYear = computed(() => {

  if (mainEvent.value?.Year) {
    return mainEvent.value.Year;
  }

  return weddingDate.value.format("YYYY");
});


const weddingWeekday = computed(() => {

  if (mainEvent.value?.Weekday) {
    return String(
      mainEvent.value.Weekday
    ).toUpperCase();
  }

  return weddingDate.value
    .locale("vi")
    .format("dddd")
    .toUpperCase();
});


const weddingLunar = computed(() => {

  return (
    mainEvent.value?.Lunar ||
    props.wedding?.weddingLunar ||
    ""
  );
});


/* =========================================================
   EVENT TIME
========================================================= */

const eventTime = computed(() => {

  if (mainEvent.value?.Time) {
    return mainEvent.value.Time;
  }

  if (mainEvent.value?.EventDate) {

    const date =
      dayjs(mainEvent.value.EventDate);

    if (date.isValid()) {
      return date.format("HH:mm");
    }
  }

  return "";
});


const eventName = computed(() => {

  return (
    mainEvent.value?.Name ||
    mainEvent.value?.EventName ||
    mainEvent.value?.Title ||
    ""
  );
});


const eventLocation = computed(() => {

  return (
    mainEvent.value?.Location ||
    mainEvent.value?.Venue ||
    mainEvent.value?.Place ||
    ""
  );
});


const eventAddress = computed(() => {

  return (
    mainEvent.value?.Address ||
    mainEvent.value?.LocationAddress ||
    ""
  );
});


const eventMapUrl = computed(() => {

  return (
    mainEvent.value?.MapUrl ||
    mainEvent.value?.GoogleMapUrl ||
    mainEvent.value?.Map ||
    ""
  );
});
</script>

<style scoped>

/* =========================================================
   ROOT
========================================================= */

.rr-couple-section {

  --rr-red-dark: #260004;
  --rr-red: #47060b;
  --rr-red-light: #650b12;

  --rr-gold: #d4a94f;
  --rr-gold-light: #f2d995;
  --rr-gold-soft: #e7c77b;

  position: relative;

  width: 100%;

  overflow: hidden;

  isolation: isolate;

  color: #f3ddb0;

  background:
    radial-gradient(
      circle at 50% 25%,
      rgba(130, 14, 24, .35),
      transparent 42%
    );
}


/* =========================================================
   BACKGROUND
========================================================= */

.rr-couple-pattern {

  position: absolute;

  inset: 0;

  z-index: -2;

  opacity: .055;

  pointer-events: none;

  background-image:
    radial-gradient(
      circle,
      rgba(243, 217, 156, .9) 0.7px,
      transparent .9px
    );

  background-size: 11px 11px;
}


.rr-couple-glow {

  position: absolute;

  left: 50%;
  top: 30%;

  width: 420px;
  height: 420px;

  transform: translate(-50%, -50%);
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(
      circle,
      rgba(218, 166, 66, .08),
      transparent 68%
    );
  filter: blur(15px);

  animation: rrGlow 7s ease-in-out infinite;
}


/* =========================================================
   CARD
========================================================= */

.rr-couple-card {

  position: relative;

  width: min(100%, 520px);

  margin: 0 auto;

  text-align: center;

}


/* Inner frame */

.rr-couple-card::before {

  content: "";

  position: absolute;

  inset: 7px;
  pointer-events: none;
}


.rr-couple-card::after {

  content: "";

  position: absolute;

  inset: 12px;
  pointer-events: none;
}


/* =========================================================
   TOP DECORATION
========================================================= */

.rr-top-decoration {

  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin-bottom: 20px;
}


.rr-decoration-line {

  width: 48px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--rr-gold),
      transparent
    );
}


.rr-decoration-symbol {

  display: grid;

  place-items: center;

  width: 36px;
  height: 36px;

  color: var(--rr-gold-light);

  font-family: serif;

  font-size: 21px;
  box-shadow:
    0 0 20px rgba(212, 169, 79, .08);
}


/* =========================================================
   HEADER
========================================================= */

.rr-event-header {

  position: relative;

  z-index: 2;

  margin-bottom: 25px;
}


.rr-section-subtitle {

  display: block;

  margin-bottom: 8px;

  color:
    rgba(243, 217, 156, .68);

  font-size: 9px;

  font-weight: 600;

  letter-spacing: .28em;
}


.rr-event-title {

  margin: 0;

  color: var(--rr-gold-light);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 27px;

  font-weight: 600;

  letter-spacing: .08em;
}


.rr-title-decoration {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  margin-top: 12px;
}


.rr-title-decoration span {

  width: 43px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--rr-gold),
      transparent
    );
}


.rr-title-decoration i {

  color: var(--rr-gold);

  font-size: 9px;

  font-style: normal;
}


/* =========================================================
   GUEST CARD
========================================================= */

.rr-guest-card {

  position: relative;

  z-index: 2;

  margin:
    0 auto
    22px;

  max-width: 390px;
  box-shadow:
    inset 0 0 25px rgba(0, 0, 0, .12);
}


/* corner decoration */

.rr-guest-card::before,
.rr-guest-card::after {

  content: "";

  position: absolute;

  width: 18px;
  height: 18px;

}


.rr-guest-card::before {

  top: -1px;
  left: -1px;

  border-width:
    1px 0 0 1px;
}


.rr-guest-card::after {

  right: -1px;
  bottom: -1px;

  border-width:
    0 1px 1px 0;
}


/* guest top */

.rr-guest-top {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  margin-bottom: 8px;
}


.rr-guest-top span {

  width: 35px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(212, 169, 79, .5)
    );
}


.rr-guest-top span:last-child {

  transform: rotate(180deg);
}


.rr-guest-top b {

  color: var(--rr-gold);

  font-size: 8px;

  font-weight: 400;
}


/* guest label */

.rr-guest-label {

  color:
    rgba(243, 217, 156, .62);

  font-size: 8px;

  font-weight: 600;

  letter-spacing: .24em;
}


/* guest name */

.rr-guest-name {

  margin-top: 7px;

  color: #fff0bd;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 27px;

  font-weight: 600;

  line-height: 1.25;

  text-shadow:
    0 2px 12px rgba(0, 0, 0, .3);
}


/* guest note */

.rr-guest-note {

  margin-top: 4px;

  color:
    rgba(243, 221, 176, .58);

  font-size: 11px;

  font-style: italic;
}


/* guest bottom */

.rr-guest-bottom {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  margin-top: 10px;
}


.rr-guest-bottom span {

  width: 25px;

  height: 1px;

  background:
    rgba(212, 169, 79, .35);
}


.rr-guest-bottom i {

  color:
    rgba(212, 169, 79, .7);

  font-size: 12px;

  font-style: normal;
}


/* =========================================================
   INVITATION TEXT
========================================================= */

.rr-invitation-text {

  position: relative;

  z-index: 2;

  margin-bottom: 25px;

  color:
    rgba(243, 221, 176, .62);

  font-size: 11px;

  line-height: 1.7;

  font-style: italic;
}


.rr-invitation-text p {
  margin: 0;
}


/* =========================================================
   FAMILY
========================================================= */

.rr-family-grid {

  position: relative;

  z-index: 2;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    38px
    minmax(0, 1fr);

  align-items: center;

  margin-bottom: 28px;
}


.rr-family-column {

  min-width: 0;

  text-align: center;
}


.rr-family-role {

  display: block;

  margin-bottom: 8px;

  color:
    rgba(243, 217, 156, .62);

  font-size: 8px;

  font-weight: 600;

  letter-spacing: .22em;
}


.rr-family-column h3 {

  margin: 0;

  color: var(--rr-gold-light);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 21px;

  font-weight: 600;
}


.rr-family-divider {

  width: 28px;

  height: 1px;

  margin: 9px auto;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--rr-gold),
      transparent
    );
}


.rr-family-column p {

  margin: 3px 0;

  color:
    rgba(243, 221, 176, .63);

  font-size: 10px;
}


.rr-family-column p span {

  margin-right: 3px;

  color:
    rgba(212, 169, 79, .8);
}


/* =========================================================
   CENTER
========================================================= */

.rr-family-center {

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 6px;
}


.rr-center-ornament {

  display: flex;

  align-items: center;

  gap: 4px;
}


.rr-center-ornament span {

  width: 7px;

  height: 1px;

  background:
    rgba(212, 169, 79, .45);
}


.rr-center-ornament b {

  color: var(--rr-gold);

  font-size: 8px;
}


.rr-ampersand {

  color: var(--rr-gold-light);

  font-family:
    "Great Vibes",
    cursive;

  font-size: 28px;
}


/* =========================================================
   DATE
========================================================= */

.rr-wedding-date {

  position: relative;

  z-index: 2;

  margin:
    8px 0
    27px;


}


.rr-date-top {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin-bottom: 11px;
}


.rr-date-line {

  width: 32px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--rr-gold),
      transparent
    );
}


.rr-weekday {

  color: var(--rr-gold-light);

  font-size: 8px;

  font-weight: 600;

  letter-spacing: .2em;
}


.rr-date-main {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 18px;
}


.rr-date-side {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 2px;

  min-width: 42px;
}


.rr-date-side span {

  color:
    rgba(243, 217, 156, .48);

  font-size: 7px;

  letter-spacing: .18em;
}


.rr-date-side strong {

  color: var(--rr-gold-light);

  font-size: 17px;

  font-weight: 600;
}


.rr-date-day {

  color: #fff0bd;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 48px;

  line-height: 1;
}


.rr-lunar-date {

  margin-top: 10px;

  color:
    rgba(243, 217, 156, .5);

  font-size: 9px;
}


/* =========================================================
   EVENT
========================================================= */

.rr-event-information {

  position: relative;

  z-index: 2;
}


.rr-event-heading {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-bottom: 14px;
}


.rr-event-heading span {

  width: 28px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(212, 169, 79, .5),
      transparent
    );
}


.rr-event-heading i {

  color: var(--rr-gold);

  font-size: 8px;

  font-style: normal;
}


.rr-event-time small {

  display: block;

  margin-bottom: 5px;

  color:
    rgba(243, 217, 156, .52);

  font-size: 7px;

  font-weight: 600;

  letter-spacing: .2em;
}


.rr-event-time strong {

  display: block;

  color: var(--rr-gold-light);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 25px;

  letter-spacing: .08em;
}


.rr-event-location {

  margin-top: 12px;
}


.rr-event-location strong {

  display: block;

  color:
    rgba(243, 217, 156, .88);

  font-size: 13px;
}


.rr-event-location p {

  margin: 3px 0 0;

  color:
    rgba(243, 221, 176, .58);

  font-size: 10px;

  line-height: 1.5;
}


/* =========================================================
   MAP
========================================================= */

.rr-map-button {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  margin-top: 12px;


  color: var(--rr-gold-light);
  text-decoration: none;

  font-size: 8px;

  letter-spacing: .15em;

  transition:
    background .25s ease,
    color .25s ease,
    transform .25s ease;
}


.rr-map-button:hover {

  background: var(--rr-gold);

  color: var(--rr-red-dark);

  transform: translateY(-1px);
}


/* =========================================================
   BOTTOM
========================================================= */

.rr-bottom-decoration {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-top: 27px;
}


.rr-bottom-decoration span {

  width: 38px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(212, 169, 79, .45),
      transparent
    );
}


.rr-bottom-decoration b {

  color:
    rgba(212, 169, 79, .75);

  font-size: 9px;

  font-weight: 400;
}


/* =========================================================
   ANIMATION
========================================================= */

@keyframes rrGlow {

  0%,
  100% {
    opacity: .45;
    transform:
      translate(-50%, -50%)
      scale(.95);
  }

  50% {
    opacity: .8;
    transform:
      translate(-50%, -50%)
      scale(1.08);
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 430px) {



  .rr-event-title {
    font-size: 24px;
  }

  .rr-guest-name {
    font-size: 25px;
  }

  .rr-family-grid {
    grid-template-columns:
      minmax(0, 1fr)
      28px
      minmax(0, 1fr);
  }

  .rr-family-column h3 {
    font-size: 18px;
  }

  .rr-family-column p {
    font-size: 9px;
  }

  .rr-date-main {
    gap: 13px;
  }

  .rr-date-day {
    font-size: 43px;
  }

  .rr-event-time strong {
    font-size: 23px;
  }
}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 350px) {

  .rr-couple-card {
    padding-left: 14px;
    padding-right: 14px;
  }

  .rr-guest-name {
    font-size: 23px;
  }

  .rr-family-grid {
    grid-template-columns:
      minmax(0, 1fr)
      22px
      minmax(0, 1fr);
  }

  .rr-family-column h3 {
    font-size: 16px;
  }

  .rr-date-main {
    gap: 8px;
  }

  .rr-date-day {
    font-size: 39px;
  }
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .rr-couple-glow {
    animation: none;
  }

  .rr-map-button {
    transition: none;
  }
}

</style>
