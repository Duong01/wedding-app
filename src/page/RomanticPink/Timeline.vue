<template>
  <section class="timeline">
    <!-- HEADER -->
    <div class="timeline-header">
      <div class="eyebrow">DẤU MỐC YÊU THƯƠNG</div>

      <h2>Hành trình của chúng mình</h2>

      <p class="timeline-intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình
        đến ngày hôm nay
      </p>
    </div>

    <!-- TIMELINE -->
    <ol class="timeline-list">
      <li
        v-for="(item, index) in items"
        :key="item.Id || index"
        class="timeline-item"
      >
        <!-- LINE + NUMBER -->
        <div class="timeline-side">
          <div class="timeline-number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div
            v-if="index < items.length - 1"
            class="timeline-line"
          ></div>
        </div>

        <!-- CONTENT CARD -->
        <article class="timeline-card">
          <!-- TIME -->
          <div class="timeline-date">
            <span class="date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>
              {{ item.Time || item.Date || formatTime(index) }}
            </time>
          </div>

          <!-- TITLE -->
          <div class="timeline-title-row">
            <div class="timeline-icon">
              {{ item.Icon || "♡" }}
            </div>

            <h3>
              {{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}
            </h3>
          </div>

          <!-- DESCRIPTION -->
          <p
            v-if="item.Description || item.Content"
            class="timeline-description"
          >
            {{ item.Description || item.Content }}
          </p>

          <!-- LOCATION -->
          <div
            v-if="item.Location"
            class="timeline-location"
          >
            <v-icon size="14">
              mdi-map-marker-outline
            </v-icon>

            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <!-- FOOTER -->
    <div class="timeline-footer">
      <span></span>

      <v-icon size="14">
        mdi-heart
      </v-icon>

      <span></span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },
});

const items = computed(() => props.timeline || []);

function formatTime(index) {
  return `DẤU MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
/* =========================================================
   TIMELINE
========================================================= */

.timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #805363;

  border: 1px solid rgba(198, 160, 106, 0.35);

  border-radius: 28px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 250, 249, 0.55),
      rgba(250, 230, 237, 0.28)
    );

  box-shadow:
    0 12px 35px rgba(137, 67, 84, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.65);

  overflow: hidden;
}

.timeline::before {
  content: "";

  position: absolute;

  inset: 8px;

  border: 1px solid rgba(198, 160, 106, 0.2);

  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.timeline-header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.eyebrow {
  color: #b17486;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 0.28em;
}

.timeline-header h2 {
  margin: 5px 0 5px;

  color: #9b4b61;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(28px, 7vw, 36px);

  font-weight: 600;

  line-height: 1.1;
}

.timeline-intro {
  max-width: 440px;

  margin: 0 auto;

  color: #956476;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.timeline-list {
  position: relative;

  margin: 0;

  padding: 0;

  list-style: none;
}

.timeline-item {
  position: relative;

  display: grid;

  grid-template-columns: 52px 1fr;

  gap: 14px;

  margin-bottom: 18px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   LEFT SIDE
========================================================= */

.timeline-side {
  position: relative;

  display: flex;

  justify-content: center;

  align-items: flex-start;
}

.timeline-number {
  position: relative;

  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #a25369;

  border: 1px solid rgba(198, 160, 106, 0.45);

  border-radius: 50%;

  background:
    linear-gradient(
      145deg,
      #fffdfc,
      #f8e5ea
    );

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;

  font-weight: 700;

  box-shadow:
    0 5px 14px rgba(123, 55, 73, 0.08);
}

.timeline-line {
  position: absolute;

  z-index: 1;

  top: 38px;

  bottom: -18px;

  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background:
    linear-gradient(
      180deg,
      rgba(198, 160, 106, 0.55),
      rgba(220, 156, 175, 0.2)
    );
}

/* =========================================================
   CARD
========================================================= */

.timeline-card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(198, 160, 106, 0.27);

  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 247, 249, 0.72)
    );

  box-shadow:
    0 7px 22px rgba(118, 55, 72, 0.06);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.timeline-card:hover {
  transform: translateY(-3px);

  border-color:
    rgba(198, 160, 106, 0.42);

  box-shadow:
    0 12px 28px rgba(118, 55, 72, 0.1);
}

/* =========================================================
   DATE
========================================================= */

.timeline-date {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  margin-bottom: 8px;

  color: #a6536b;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.12em;
}

.date-icon {
  width: 25px;
  height: 25px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #b06a7e;

  border-radius: 50%;

  background:
    rgba(247, 225, 232, 0.8);
}

/* =========================================================
   TITLE
========================================================= */

.timeline-title-row {
  display: flex;

  align-items: center;

  gap: 9px;
}

.timeline-icon {
  width: 34px;
  height: 34px;

  flex: 0 0 auto;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #a6536b;

  border: 1px solid rgba(198, 160, 106, 0.3);

  border-radius: 50%;

  background:
    linear-gradient(
      145deg,
      #fff,
      #f8e4e9
    );

  font-family:
    Georgia,
    serif;

  font-size: 17px;
}

.timeline-card h3 {
  margin: 0;

  color: #7a3752;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 22px;

  font-weight: 600;

  line-height: 1.2;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.timeline-description {
  margin: 9px 0 0;

  color: #764158;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.timeline-location {
  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 11px;

  padding-top: 9px;

  border-top: 1px solid
    rgba(198, 160, 106, 0.18);

  color: #9b6b78;

  font-size: 11px;

  line-height: 1.4;
}

.timeline-location .v-icon {
  color: #b06a7e;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.timeline-footer {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  margin-top: 27px;

  color: #c6a06a;
}

.timeline-footer span {
  width: 55px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(198, 160, 106, 0.5)
    );
}

.timeline-footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 23px;
  }

  .timeline::before {
    inset: 6px;

    border-radius: 18px;
  }

  .timeline-header {
    margin-bottom: 25px;
  }

  .timeline-header h2 {
    font-size: 29px;
  }

  .timeline-intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .timeline-item {
    grid-template-columns: 39px 1fr;

    gap: 9px;

    margin-bottom: 14px;
  }

  .timeline-number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .timeline-line {
    top: 32px;

    bottom: -14px;
  }

  .timeline-card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .timeline-date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .date-icon {
    width: 23px;
    height: 23px;
  }

  .timeline-icon {
    width: 31px;
    height: 31px;

    font-size: 15px;
  }

  .timeline-card h3 {
    font-size: 20px;
  }

  .timeline-description {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .timeline-location {
    margin-top: 9px;

    padding-top: 8px;

    font-size: 10px;
  }
}

/* =========================================================
   VERY SMALL SCREEN
========================================================= */

@media (max-width: 380px) {
  .timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .timeline-item {
    grid-template-columns: 34px 1fr;

    gap: 7px;
  }

  .timeline-number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .timeline-line {
    top: 29px;
  }

  .timeline-card {
    padding: 12px;
  }

  .timeline-card h3 {
    font-size: 18px;
  }

  .timeline-icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .timeline-card {
    transition: none;
  }
}
</style>
