<template>
  <section class="wedding-info">

    <div class="family-wrapper">
      <!-- NHÀ GÁI -->
      <div class="family-item family-bride">
        <div class="family-kicker">NHÀ GÁI</div>

        <div class="family-name">Ông: {{ bride.father }}</div>

        <div class="family-name">Bà: {{ bride.mother }}</div>

        <div class="family-address">
          {{ bride.address }}
        </div>
      </div>

      <!-- DIVIDER -->
      <div class="family-divider">
        <span>✦</span>
      </div>

      <!-- NHÀ TRAI -->
      <div class="family-item family-groom">
        <div class="family-kicker">NHÀ TRAI</div>
        <div class="family-name">Ông: {{ groom.father }}</div>

        <div class="family-name">Bà: {{ groom.mother }}</div>

        <div class="family-address">
          {{ groom.address }}
        </div>
      </div>
    </div>

    <!-- =========================
       COUPLE
       ========================= -->

    <div class="couple-wrapper">
      <div class="person">
        <div class="person-name">
          {{ bride.name }}
        </div>

        <div class="person-role">CÔ DÂU</div>
      </div>

      <div class="symbol">
        <img src="@/assets/chu-hy.webp" alt="Symbol" />
      </div>

      <div class="person">
        <div class="person-name">
          {{ groom.name }}
        </div>

        <div class="person-role">CHÚ RỂ</div>
      </div>
    </div>

    <!-- =========================
       EVENT
       ========================= -->

    <!-- EVENT INFORMATION -->
<div class="event-wrapper">

  <div class="event-title">
    LỄ VU QUY ĐƯỢC CỬ HÀNH TẠI
  </div>

  <div class="event-location">
    {{ event.location }}
  </div>

  <div class="event-time">
    VÀO LÚC {{ event.time }}
  </div>

</div>


<div class="date-wrapper">

  <div class="date-main">

    <!-- THỨ -->
    <div class="weekday">
      {{ event.weekday }}
    </div>

    <div class="date-separator"></div>

    <!-- NGÀY -->
    <div class="day">
      {{ event.day }}
    </div>

    <div class="date-separator"></div>

    <!-- THÁNG -->
    <div class="month">
      THÁNG {{ event.month }}
    </div>

  </div>

  <!-- NĂM -->
  <div class="year">
    {{ event.year }}
  </div>

  <!-- ÂM LỊCH -->
  <div class="lunar">
    ({{ event.lunar }})
  </div>

</div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const props = defineProps({
  couple: {
    type: Object,
    required: true,
    default: ({})
  },
  events:{
    type: Object,
    required: true,
    default: ({})
  }
});

const bride = computed(() => props.couple?.bride ?? {});

const groom = computed(() => props.couple?.groom ?? {});

const event = computed(() => props.events?.[0] ?? {});
</script>

<style scoped>
/* =========================================================
   MODERN WEDDING INFORMATION
   ========================================================= */

.wedding-info {
  position: relative;
  background: #f8f5ed;
  width: 100%;
  max-width: 900px;

  margin: 0 auto;

  padding: 70px 30px 80px;

  color: var(--text);

  text-align: center;

  overflow: hidden;
}

/* =========================================================
   FAMILY
   ========================================================= */

.family-wrapper {
  display: grid;

  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  max-width: 720px;

  margin: 0 auto 70px;

  gap: 45px;
}

/* Family item */

.family-item {
  display: flex;

  flex-direction: column;
  align-items: center;

  text-align: center;
}

/* Nhà gái / Nhà trai */

.family-kicker {
  margin-bottom: 8px;

  font-family: var(--font-main);

  font-size: 12px;
  font-weight: 500;

  letter-spacing: 3px;

  color: var(--gold);

  text-transform: uppercase;
}

/* Gia đình */

.family-title {
  margin-bottom: 16px;

  font-family: var(--font-wedding);

  font-size: clamp(25px, 5vw, 32px);

  font-weight: 500;

  line-height: 1;

  color: var(--primary);
}

/* Tên bố mẹ */

.family-name {
  margin-bottom: 3px;

  font-family: var(--font-main);

  font-size: 12px;

  font-weight: 400;

  line-height: 1.7;

  color: var(--text);
}

/* Địa chỉ */

.family-address {
  max-width: 230px;

  margin-top: 8px;

  font-family: var(--font-main);

  font-size: 12px;

  font-weight: 300;

  line-height: 1.7;

  color: var(--sub-text);
}

/* =========================================================
   FAMILY DIVIDER
   ========================================================= */

.family-divider {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 1px;
  height: 95px;

  background: rgba(216, 180, 109, 0.45);
}

.family-divider span {
  position: absolute;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  background: var(--paper);

  font-family: var(--font-wedding);

  font-size: 14px;

  color: var(--gold);
}

/* =========================================================
   COUPLE
   ========================================================= */

.couple-wrapper {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: clamp(25px, 8vw, 70px);

  margin: 0 auto 65px;

  padding: 45px 0;

  border-top: 1px solid rgba(123, 13, 13, 0.1);
  border-bottom: 1px solid rgba(123, 13, 13, 0.1);
}

/* Người */

.person {
  flex: 1;

  min-width: 0;
}

/* Tên */

.person-name {
  font-family: var(--font-wedding);

  font-size: clamp(38px, 7vw, 62px);

  font-weight: 500;

  font-style: italic;

  line-height: 0.9;

  color: var(--primary);

  letter-spacing: -0.5px;
}

/* Vai trò */

.person-role {
  margin-top: 13px;

  font-family: var(--font-main);

  font-size: 8px;

  font-weight: 500;

  letter-spacing: 3px;

  color: var(--sub-text);

  text-transform: uppercase;
}

/* & */

.symbol {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  flex-shrink: 0;

  border-radius: 50%;

  font-family: var(--font-wedding);

  font-size: 28px;

  font-style: italic;

  font-weight: 400;

  color: var(--gold);

  background: var(--paper);
}

/* =========================================================
   EVENT
   ========================================================= */

.event-wrapper {
    width: 100%;
    max-width: 650px;

    margin: 0 auto 28px;

    text-align: center;

    color: var(--primary);
}

/* English kicker */

.event-kicker {
  margin-bottom: 10px;

  font-family: var(--font-main);

  font-size: 8px;

  font-weight: 500;

  letter-spacing: 3px;

  text-transform: uppercase;

  color: var(--gold);
}

/* Tiêu đề */

.event-title {
    margin-bottom: 8px;

    font-family: "Cormorant Garamond", serif;

    font-size: 16px;
    font-weight: 600;

    line-height: 1.3;

    color: var(--primary);

    text-transform: uppercase;
}

/* Địa điểm */

.event-location {

  max-width: 600px;

  font-family: var(--font-wedding);

  font-size: clamp(25px, 5vw, 36px);

  font-weight: 500;

  line-height: 1.15;

  color: var(--primary);
}

/* Giờ */

.event-time {
  font-family: 'Times New Roman', Times, serif;

  font-size: 10px;

  font-weight: 400;

  letter-spacing: 1.5px;

  color: var(--text);
}

/* =========================================================
   DATE
   ========================================================= */
/* =========================================================
   THỜI GIAN CƯỚI
   THỨ | NGÀY | THÁNG
   ========================================================= */

.date-wrapper {
  width: 100%;
  margin: 0 auto;
  padding-top: 10px;

  text-align: center;
  color: var(--primary);
}

/* =========================
   THỨ - NGÀY - THÁNG
   ========================= */

.date-main {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 18px;

  min-height: 65px;
}

/* =========================
   THỨ
   ========================= */

.weekday {
  font-family: "Cormorant Garamond", "Times New Roman", serif;

  font-size: 16px;
  font-weight: 600;

  line-height: 1;

  letter-spacing: 1.5px;

  color: var(--primary);

  text-transform: uppercase;

  white-space: nowrap;
}

/* =========================
   NGÀY
   ========================= */

.day {
  font-family: "Times New Roman", Times, serif;

  font-size: 48px;
  font-weight: 700;

  line-height: 0.9;

  color: var(--primary);

  letter-spacing: -1px;

  min-width: 55px;

  text-align: center;
}

/* =========================
   THÁNG
   ========================= */

.month {
  font-family: "Cormorant Garamond", "Times New Roman", serif;

  font-size: 16px;
  font-weight: 600;

  line-height: 1;

  letter-spacing: 1.5px;

  color: var(--primary);

  text-transform: uppercase;

  white-space: nowrap;
}

/* =========================
   ĐƯỜNG KẺ
   ========================= */

.date-separator {
  width: 1px;
  height: 28px;

  flex-shrink: 0;

  background: rgba(123, 13, 13, 0.38);
}

/* =========================
   NĂM
   ========================= */

.date-wrapper .year {
  margin-top: 22px;

  font-family: "Cormorant Garamond", "Times New Roman", serif;

  font-size: 28px;
  font-weight: 500;

  line-height: 1.2;

  color: var(--primary);
}

/* =========================
   ÂM LỊCH
   ========================= */

.lunar {
  margin-top: 14px;

  font-family: "Cormorant Garamond", "Times New Roman", serif;

  font-size: 13px;
  font-weight: 500;

  line-height: 1.5;

  color: var(--primary);
}


.wedding-info .family-wrapper,
.wedding-info .couple-wrapper,
.wedding-info .event-wrapper,
.wedding-info .date-wrapper {
  animation: weddingFadeUp 0.9s ease both;
}

.wedding-info .couple-wrapper {
  animation-delay: 0.15s;
}

.wedding-info .event-wrapper {
  animation-delay: 0.3s;
}

.wedding-info .date-wrapper {
  animation-delay: 0.45s;
}

@keyframes weddingFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 600px) {
  .wedding-info {
    padding: 50px 18px 0px;
  }

  /* =====================
       FAMILY
       ===================== */

  .family-wrapper {
    grid-template-columns: 1fr auto 1fr;

    gap: 14px;

    margin-bottom: 50px;
  }

  .family-kicker {
    font-size: 10px;
    letter-spacing: 2px;
  }

  .family-title {
    margin-bottom: 12px;

    font-size: 23px;
  }

  .family-name {
    font-size: 11px;
  }

  .family-address {
    max-width: 140px;

    font-size: 11px;
  }

  .family-divider {
    height: 80px;
  }

  .family-divider span {
    width: 22px;
    height: 22px;

    font-size: 11px;
  }

  /* =====================
       COUPLE
       ===================== */

  .couple-wrapper {
    gap: 12px;

    margin-bottom: 50px;

    padding: 34px 0;
  }

  .person-name {
    font-size: clamp(31px, 10vw, 45px);
  }

  .person-role {
    margin-top: 10px;

    font-size: 7px;

    letter-spacing: 2px;
  }

  .symbol {
    width: 38px;
    height: 38px;

    font-size: 22px;
  }

  /* =====================
       EVENT
       ===================== */



  .event-wrapper {
        margin-bottom: 24px;
    }


    .event-title {
        font-size: 14px;

        letter-spacing: .1px;
    }


    .event-location {
        margin-bottom: 12px;

        font-size: 15px;
    }


    .event-time {
        font-size: 15px;
    }


    .weekday {
        margin-bottom: 8px;

        font-size: 15px;
    }


    .date-main {
        height: 46px;

        gap: 10px;
    }


    .date-line,
    .date-separator {
        height: 22px;
    }


    .day {
        font-size: 32px;
    }


    .month {
        font-size: 14px;
    }


    .date-wrapper .year {
        margin-top: 11px;

        font-size: 21px;
    }


    .lunar {
        margin-top: 15px;

        font-size: 12px;
    }
}
@media (max-width: 380px) {
  .wedding-info {
    padding-left: 12px;
    padding-right: 12px;
  }

  .family-wrapper {
    gap: 8px;
  }

  .family-name {
    font-size: 11px;
  }

  .family-address {
    max-width: 115px;
    font-size: 11px;
  }

  .person-name {
    font-size: 30px;
  }


  .event-location {
    font-size: 23px;
  }

  .day {
    font-size: 68px;
  }

  .date-side .year {
    font-size: 27px;
  }
}
/* =========================================================
   EVENT INFORMATION
   ========================================================= */

.event-wrapper {
    width: 100%;
    max-width: 650px;

    margin: 0 auto 28px;

    text-align: center;

    color: var(--primary);
}


/* LỄ VU QUY... */

.event-title {
    margin-bottom: 8px;

    font-family: "Cormorant Garamond", serif;

    font-size: 16px;
    font-weight: 600;

    line-height: 1.3;

    color: var(--primary);

    text-transform: uppercase;
}


/* Địa điểm */

.event-location {
    margin-bottom: 14px;

    font-family: "Cormorant Garamond", serif;

    font-size: 17px;
    font-weight: 600;

    line-height: 1.3;

    color: var(--primary);

    text-transform: uppercase;
}


/* VÀO LÚC */

.event-time {

    font-size: 16px;

    line-height: 1.3;

    color: var(--primary);

    text-transform: uppercase;
}


/* =========================================================
   DATE
   ========================================================= */


@media (max-width: 600px) {

  .date-main {
    gap: 10px;
    min-height: 58px;
  }

  .weekday {
    font-size: 12px;
    letter-spacing: 1px;
  }

  .day {
    font-size: 40px;
    min-width: 48px;
  }

  .month {
    font-size: 12px;
    letter-spacing: 1px;
  }

  .date-separator {
    height: 24px;
  }

  .date-wrapper .year {
    margin-top: 18px;
    font-size: 25px;
  }

  .lunar {
    margin-top: 12px;
    font-size: 11px;
  }
}
</style>
