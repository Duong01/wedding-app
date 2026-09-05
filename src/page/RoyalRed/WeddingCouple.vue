<template>
  <section class="rp-section couple">

    <!-- =========================
         TITLE
    ========================== -->
    <p class="eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="rule">
      <span></span>
      ✦
      <span></span>
    </div>

    <!-- =========================
         COUPLE
    ========================== -->
    <div class="people">

      <!-- CHÚ RỂ -->
      <article class="person person-groom">

        <div class="person-parents">
          <p
            v-if="groomParents?.Father"
            class="parents"
          >
            Ông {{ groomParents.Father }}
          </p>

          <p
            v-if="groomParents?.Mother"
            class="parents"
          >
            Bà {{ groomParents.Mother }}
          </p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="role">
          CHÚ RỂ
        </span>

        <p class="description">
          {{ groomDescription }}
        </p>

      </article>


      <!-- & -->
      <div class="couple-divider">
        <i>&amp;</i>
      </div>


      <!-- CÔ DÂU -->
      <article class="person person-bride">

        <div class="person-parents">
          <p
            v-if="brideParents?.Father"
            class="parents"
          >
            Ông {{ brideParents.Father }}
          </p>

          <p
            v-if="brideParents?.Mother"
            class="parents"
          >
            Bà {{ brideParents.Mother }}
          </p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="role">
          CÔ DÂU
        </span>

        <p class="description">
          {{ brideDescription }}
        </p>

      </article>

    </div>


    <!-- =========================
         WEDDING DATE
    ========================== -->
    <div class="rr-wedding-date">

      <!-- THỨ -->
      <div class="rr-date-top">

        <span class="rr-date-line"></span>

        <span class="rr-weekday">
          {{ weddingWeekday }}
        </span>

        <span class="rr-date-line"></span>

      </div>


      <!-- NGÀY / THÁNG / NĂM -->
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


      <!-- ÂM LỊCH -->
      <div
        v-if="weddingLunar"
        class="rr-lunar-date"
      >
        {{ weddingLunar }}
      </div>


      <!-- =========================
           TIME
      ========================== -->
      <div
        v-if="weddingTime"
        class="rr-wedding-time"
      >

        <div class="time-icon">
          <span></span>
        </div>

        <div class="time-content">

          <span class="time-label">
            THỜI GIAN
          </span>

          <strong>
            {{ weddingTime }}
          </strong>

        </div>

      </div>

    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({})
  },

  guestName: {
    type: String,
    default: "Quý khách"
  }
});


/* =====================================================
   COUPLE
===================================================== */

const groom = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    "Chú rể"
);


const bride = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Cô dâu"
);


/* =====================================================
   DESCRIPTION
===================================================== */

const groomDescription = computed(
  () =>
    props.wedding?.couple?.Groom?.Description ||
    props.wedding?.couple?.Groom?.Address ||
    "Chú rể của gia đình chúng mình"
);


const brideDescription = computed(
  () =>
    props.wedding?.couple?.Bride?.Description ||
    props.wedding?.couple?.Bride?.Address ||
    "Cô dâu của gia đình chúng mình"
);


/* =====================================================
   PARENTS
===================================================== */

const groomParents = computed(
  () => props.wedding?.couple?.Groom || {}
);


const brideParents = computed(
  () => props.wedding?.couple?.Bride || {}
);


/* =====================================================
   DATE
===================================================== */

const weddingDate = computed(() => {
  return (
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    null
  );
});


const dateObject = computed(() => {
  if (!weddingDate.value) return null;

  const date = new Date(weddingDate.value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
});


const weddingDay = computed(() => {
  if (!dateObject.value) return "--";

  return String(
    dateObject.value.getDate()
  ).padStart(2, "0");
});


const weddingMonth = computed(() => {
  if (!dateObject.value) return "--";

  return String(
    dateObject.value.getMonth() + 1
  ).padStart(2, "0");
});


const weddingYear = computed(() => {
  if (!dateObject.value) return "----";

  return dateObject.value.getFullYear();
});


const weddingWeekday = computed(() => {
  if (!dateObject.value) return "";

  const weekdays = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY"
  ];

  return weekdays[
    dateObject.value.getDay()
  ];
});


/* =====================================================
   LUNAR DATE
===================================================== */

const weddingLunar = computed(() => {
  return (
    props.wedding?.weddingLunar ||
    props.wedding?.WeddingLunar ||
    props.wedding?.lunarDate ||
    props.wedding?.LunarDate ||
    ""
  );
});


/* =====================================================
   TIME
===================================================== */

const weddingTime = computed(() => {

  /*
   * Ưu tiên lấy thời gian từ event đầu tiên
   */
  const event =
    Array.isArray(props.wedding?.events)
      ? props.wedding.events[0]
      : null;


  const time =
    event?.Time ||
    event?.time ||
    event?.StartTime ||
    event?.startTime ||
    event?.EventTime ||
    event?.eventTime ||

    props.wedding?.time ||
    props.wedding?.Time ||
    props.wedding?.weddingTime ||
    props.wedding?.WeddingTime ||

    props.wedding?.hero?.time ||
    props.wedding?.hero?.Time ||

    "";


  if (!time) return "";


  /*
   * Nếu API trả về DateTime:
   *
   * 2026-11-14T08:00:00
   *
   * thì chỉ lấy HH:mm
   */
  if (
    typeof time === "string" &&
    time.includes("T")
  ) {

    const date = new Date(time);

    if (!Number.isNaN(date.getTime())) {

      return date.toLocaleTimeString(
        "vi-VN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }
      );

    }

  }


  /*
   * Nếu trả về:
   *
   * 08:00:00
   *
   * thì chuyển thành:
   *
   * 08:00
   */
  if (
    typeof time === "string" &&
    /^\d{1,2}:\d{2}:\d{2}$/.test(time)
  ) {

    return time.substring(0, 5);

  }


  return String(time);

});

</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.rp-section {
  position: relative;
  padding: 48px 22px 42px;
  text-align: center;
  color: #6d3049;
  overflow: hidden;
}


/* =====================================================
   TITLE
===================================================== */

.eyebrow {
  margin: 0;

  color: #b56882;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.28em;
}


.rp-section h2 {
  margin: 8px 0 12px;

  color: #a43e65;

  font-family: "Great Vibes", cursive;

  font-size: 40px;
  font-weight: 400;

  line-height: 1.15;
}


/* =====================================================
   DECORATIVE RULE
===================================================== */

.rule {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin: 0 auto;

  color: #c26a89;

  font-size: 15px;
}


.rule span {
  width: 50px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #d59aad
    );
}


.rule span:last-child {
  background:
    linear-gradient(
      90deg,
      #d59aad,
      transparent
    );
}


/* =====================================================
   COUPLE
===================================================== */

.people {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    auto
    minmax(0, 1fr);

  align-items: center;

  gap: 12px;

  margin-top: 30px;
}


.person {
  min-width: 0;
}


.person-parents {
  min-height: 38px;
}


.people .parents {
  margin: 2px 0;

  color: #9b6b78;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}


.people h3 {
  margin: 8px 0 4px;

  color: #a43e65;

  font-family: "Great Vibes", cursive;

  font-size: 34px;
  font-weight: 400;

  line-height: 1.2;
}


.people .role {
  display: block;

  color: #aa6980;

  font-size: 9px;

  letter-spacing: 0.2em;

  font-weight: 700;
}


.people .description {
  margin: 7px 0 0;

  color: #7d4554;

  font-size: 12px;

  font-style: italic;

  line-height: 1.5;
}


.couple-divider {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 36px;
}


.couple-divider i {
  color: #c26a89;

  font-family: Georgia, serif;

  font-size: 30px;

  font-style: normal;

  font-weight: 400;
}


/* =====================================================
   WEDDING DATE
===================================================== */

.rr-wedding-date {
  position: relative;

  margin: 36px auto 0;

  padding: 22px 14px 18px;

  max-width: 420px;

  border-top: 1px solid rgba(164, 62, 101, 0.18);
  border-bottom: 1px solid rgba(164, 62, 101, 0.18);
}


/* =====================================================
   WEEKDAY
===================================================== */

.rr-date-top {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  margin-bottom: 14px;
}


.rr-weekday {
  color: #a43e65;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 0.25em;
}


.rr-date-line {
  width: 42px;
  height: 1px;

  background: #d7a5b5;
}


/* =====================================================
   DATE MAIN
===================================================== */

.rr-date-main {
  display: grid;

  grid-template-columns:
    1fr
    auto
    1fr;

  align-items: center;

  max-width: 300px;

  margin: auto;
}


.rr-date-side {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 2px;
}


.rr-date-side span {
  color: #aa6980;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 0.2em;
}


.rr-date-side strong {
  color: #a43e65;

  font-family: "Cormorant Garamond", serif;

  font-size: 20px;

  font-weight: 600;
}


.rr-date-day {
  padding: 0 22px;

  color: #a43e65;

  font-family: "Great Vibes", cursive;

  font-size: 66px;

  font-weight: 400;

  line-height: 0.95;
}


/* =====================================================
   LUNAR
===================================================== */

.rr-lunar-date {
  margin-top: 12px;

  color: #9b6b78;

  font-size: 11px;

  font-style: italic;

  letter-spacing: 0.05em;
}


/* =====================================================
   WEDDING TIME
===================================================== */

.rr-wedding-time {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  margin-top: 18px;

  padding: 10px 22px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.42);

  border: 1px solid rgba(194, 106, 137, 0.2);

  box-shadow:
    0 8px 24px rgba(126, 48, 78, 0.08);
}


/* =====================================================
   CLOCK ICON - CSS/SVG-LIKE
===================================================== */

.time-icon {
  position: relative;

  width: 27px;
  height: 27px;

  border: 1.5px solid #c26a89;

  border-radius: 50%;
}


.time-icon::before {
  content: "";

  position: absolute;

  left: 50%;
  top: 5px;

  width: 1px;
  height: 8px;

  background: #c26a89;

  transform-origin: bottom;
}


.time-icon::after {
  content: "";

  position: absolute;

  left: 50%;
  top: 50%;

  width: 7px;
  height: 1px;

  background: #c26a89;

  transform-origin: left center;
}


.time-content {
  display: flex;

  flex-direction: column;

  align-items: flex-start;

  text-align: left;
}


.time-label {
  color: #aa6980;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 0.18em;
}


.time-content strong {
  margin-top: 1px;

  color: #a43e65;

  font-family: "Cormorant Garamond", serif;

  font-size: 21px;

  font-weight: 600;

  line-height: 1;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 480px) {

  .rp-section {
    padding: 40px 16px 36px;
  }


  .rp-section h2 {
    font-size: 36px;
  }


  .people {
    gap: 6px;
  }


  .people h3 {
    font-size: 29px;
  }


  .people .parents {
    font-size: 10px;
  }


  .people .description {
    font-size: 11px;
  }


  .couple-divider {
    width: 25px;
  }


  .couple-divider i {
    font-size: 24px;
  }


  .rr-date-day {
    padding: 0 12px;

    font-size: 58px;
  }


  .rr-date-side strong {
    font-size: 18px;
  }


  .rr-date-line {
    width: 28px;
  }

}


/* =====================================================
   VERY SMALL MOBILE
===================================================== */

@media (max-width: 360px) {

  .people {
    gap: 3px;
  }


  .people h3 {
    font-size: 25px;
  }


  .people .description {
    font-size: 10px;
  }


  .rr-date-day {
    font-size: 52px;
  }


  .rr-wedding-time {
    padding: 9px 16px;
  }

}

</style>