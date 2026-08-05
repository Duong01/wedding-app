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
  padding: 45px 15px 40px;
  color: #7b1b1b;
  text-align: center;
}

.invite-container {
  width: 100%;
  max-width: 430px;
  margin: auto;
}

/* TITLE */

.section-title {
  font-size: 24px;

  font-weight: 700;

  margin-bottom: 35px;

  letter-spacing: 1px;
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
}

.family-divider {
  height: 90px;

  width: 1px;

  background: #b47777;
}

.family-title {
  font-size: 16px;

  margin-bottom: 10px;
}

.family-name {
  font-size: 14px;

  line-height: 1.7;

  white-space: nowrap;
}

.family-name span {
  font-weight: 600;
}

.family-address {
  font-size: 12px;

  line-height: 1.5;

  margin-top: 10px;
}

/* =====================
       COUPLE
===================== */

.couple-wrapper {
  margin-top: 45px;

  margin-bottom: 45px;
}

.person-name {
  font-family: "Cormorant Garamond", serif;

  font-size: 42px;

  line-height: 1.1;
}

.person-role {
  font-size: 11px;

  letter-spacing: 4px;

  margin-top: 5px;
}

.symbol {
  font-family: "Cormorant Garamond", serif;

  font-size: 36px;

  margin: 12px 0;
}

/* =====================
        EVENT
===================== */

.event-wrapper {
  margin-top: 30px;
}

.event-title {
  font-size: 14px;

  line-height: 1.6;
}

.event-location {
  font-size: 20px;

  font-weight: 700;

  margin-top: 8px;
}

.event-time {
  font-size: 15px;

  margin-top: 12px;
}

/* =====================
        DATE
===================== */

.date-wrapper {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 12px;

  margin-top: 35px;
} 

.weekday {
  width: 45px;

  font-size: 12px;
}

.day {
  font-family: "Cormorant Garamond", serif;

  font-size: 65px;

  line-height: 1;
}

.month {
  font-size: 13px;
}

.year {
  font-family: "Cormorant Garamond", serif;

  font-size: 30px;

  margin-top: 12px;
}

.lunar {
  font-size: 13px;

  margin-top: 8px;
}
.family-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.family-address {
  font-size: 13px;

  line-height: 1.5;

  max-width: 150px;

  margin: 10px auto 0;
}
</style>

