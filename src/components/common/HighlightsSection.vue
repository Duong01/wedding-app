<template>
  <section class="wedding-section">
    <div class="invite-container">
      <!-- TITLE -->
      <h2 class="section-title">THÔNG TIN LỄ CƯỚI</h2>

      <!-- FAMILY INFORMATION -->
      <div class="family-wrapper">
        <!-- NHÀ GÁI -->
        <div class="family-item">
          <div class="family-title">Bố Mẹ</div>

          <div class="family-name">Ông: {{ bride.father }}</div>

          <div class="family-name">Bà: {{ bride.mother }}</div>

          <div class="family-address">
            {{ bride.address }}
          </div>
        </div>

        <!-- divider -->

        <div class="family-divider"></div>

        <!-- NHÀ TRAI -->

        <div class="family-item">
          <div class="family-title">Bố Mẹ</div>

          <div class="family-name">Ông: {{ groom.father }}</div>

          <div class="family-name">Bà: {{ groom.mother }}</div>

          <div class="family-address">
            {{ groom.address }}
          </div>
        </div>
      </div>

      <!-- COUPLE -->

      <div class="couple-wrapper">
        <div class="person">
          <div class="person-name">
            {{ bride.name }}
          </div>

          <div class="person-role">CÔ DÂU</div>
        </div>

        <div class="symbol">&</div>

        <div class="person">
          <div class="person-name">
            {{ groom.name }}
          </div>

          <div class="person-role">CHÚ RỂ</div>
        </div>
      </div>

      <!-- EVENT INFORMATION -->

      <div class="event-wrapper">
        <div class="event-title">LỄ VU QUY ĐƯỢC CỬ HÀNH TẠI</div>

        <div class="event-location">
          {{ event.location }}
        </div>

        <div class="event-time">VÀO LÚC {{ event.time }}</div>
      </div>

      <!-- DATE -->

      <div class="date-wrapper">
        <div class="weekday">
          {{ event.weekday }}
        </div>

        <div class="day">
          {{ event.day }}
        </div>

        <div class="month">THÁNG {{ event.month }}</div>
      </div>

      <div class="year">
        {{ event.year }}
      </div>

      <div class="lunar">
        {{ event.lunar }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const bride = computed(() => wedding.value.couple?.bride ?? {});

const groom = computed(() => wedding.value.couple?.groom ?? {});

const event = computed(() => wedding.value.events?.[0] ?? {});
</script>

<style scoped>
.wedding-section {
  padding: 50px 20px 45px;
  color: rgb(104, 14, 14);
  background-color: rgb(248, 240, 227);
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

.invite-container {
  width: 100%;
  max-width: 480px;
  margin: auto;
}

/* TITLE */

.section-title {
  font-size: clamp(22px, 5vw, 28px);
  font-weight: 700;
  margin-bottom: 35px;
  letter-spacing: 1px;
  animation: fadeInUp 0.8s ease-out 0.1s both;
}

/* =====================
      FAMILY
===================== */

.family-wrapper {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 12px;
  align-items: start;
  width: 100%;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.family-divider {
  height: 90px;
  width: 1px;
  background: #b47777;
}

.family-item {
  padding: 0 10px;
}

.family-title {
  font-size: clamp(14px, 3vw, 16px);
  margin-bottom: 10px;
  font-weight: 600;
}

.family-name {
  font-size: clamp(12px, 2.5vw, 14px);
  line-height: 1.7;
  white-space: normal;
  word-break: break-word;
}

.family-name span {
  font-weight: 600;
}

.family-address {
  font-size: clamp(11px, 2vw, 13px);
  line-height: 1.5;
  margin-top: 10px;
  max-width: 100%;
}

/* =====================
       COUPLE
===================== */

.couple-wrapper {
  margin-top: 45px;
  margin-bottom: 45px;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.person {
  animation: scaleIn 0.6s ease-out;
}

.person-name {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(28px, 8vw, 42px);
  line-height: 1.1;
  font-weight: 600;
}

.person-role {
  font-size: clamp(10px, 2vw, 12px);
  letter-spacing: 4px;
  margin-top: 8px;
  text-transform: uppercase;
  font-weight: 500;
}

.symbol {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(28px, 6vw, 36px);
  margin: 12px 0;
  animation: floatAnimation 3s ease-in-out infinite;
}

/* =====================
        EVENT
===================== */

.event-wrapper {
  margin-top: 35px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.event-title {
  font-size: clamp(12px, 2vw, 14px);
  line-height: 1.6;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 500;
}

.event-location {
  font-size: clamp(16px, 4vw, 20px);
  font-weight: 700;
  margin-top: 8px;
}

.event-time {
  font-size: clamp(13px, 3vw, 15px);
  margin-top: 12px;
  font-weight: 500;
}

/* =====================
        DATE
===================== */

.date-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 35px;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.5s both;
}

.weekday {
  width: auto;
  font-size: clamp(11px, 2vw, 12px);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.day {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(48px, 12vw, 65px);
  line-height: 1;
  font-weight: 700;
}

.month {
  font-size: clamp(12px, 2vw, 13px);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.year {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(24px, 6vw, 30px);
  margin-top: 12px;
  font-weight: 600;
}

.lunar {
  font-size: clamp(12px, 2vw, 13px);
  margin-top: 8px;
  color: #8b6a5d;
  font-style: italic;
}

@media (max-width: 768px) {
  .wedding-section {
    padding: 40px 15px 35px;
  }

  .family-wrapper {
    gap: 10px;
  }

  .family-divider {
    height: 80px;
  }
}

@media (max-width: 480px) {
  .wedding-section {
    padding: 30px 12px 25px;
  }

  .invite-container {
    max-width: 100%;
  }

  .family-wrapper {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .family-divider {
    display: none;
  }

  .couple-wrapper {
    margin-top: 35px;
    margin-bottom: 35px;
  }
}
</style>

