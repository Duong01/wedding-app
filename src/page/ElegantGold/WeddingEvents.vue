<template>
  <section class="eg-events">

    <div class="events-inner">

      <!-- HEADER -->

      <header class="events-header">

        <div class="events-label">
          WEDDING EVENTS
        </div>

        <div class="events-script">
          Ngày trọng đại
        </div>

        <h2>
          Hãy cùng chúng mình
          <br />
          <em>lưu giữ những khoảnh khắc</em>
        </h2>

        <div class="header-symbol">
          ◆
        </div>

      </header>

      <!-- EVENTS -->

      <div class="events-list">

        <article
          v-for="(event, index) in events"
          :key="event.Id || index"
          class="event-card"
        >

          <!-- NUMBER -->

          <div class="event-number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <!-- ICON -->

          <div class="event-icon">
            <span>
              {{ getIcon(event, index) }}
            </span>
          </div>

          <!-- CONTENT -->

          <div class="event-content">

            <div class="event-type">
              {{ event.type || "WEDDING EVENT" }}
            </div>

            <h3>
              {{ event.Title || event.name }}
            </h3>

            <!-- DATE -->

            <div
              v-if="event.date"
              class="event-row"
            >
              <span class="row-icon">
                ◆
              </span>

              <span>
                {{ formatDate(event.date) }}
              </span>
            </div>

            <!-- TIME -->

            <div
              v-if="event.time"
              class="event-row"
            >
              <span class="row-icon">
                ◆
              </span>

              <span>
                {{ event.time }}
              </span>
            </div>

            <!-- LOCATION -->

            <div
              v-if="event.location"
              class="event-row"
            >
              <span class="row-icon">
                ◆
              </span>

              <span>
                {{ event.location }}
              </span>
            </div>

            <!-- ADDRESS -->

            <div
              v-if="event.address"
              class="event-address"
            >
              {{ event.address }}
            </div>

            <!-- MAP BUTTON -->

            <a
              v-if="event.map"
              :href="event.map"
              target="_blank"
              rel="noopener noreferrer"
              class="map-button"
            >
              <span>
                Xem bản đồ
              </span>

              <span>
                →
              </span>
            </a>

          </div>

        </article>

      </div>

    </div>
  </section>
</template>

<script setup>
import dayjs from "dayjs";
import "dayjs/locale/vi";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

function formatDate(date) {
  if (!date) return "";

  const parsed = dayjs(date);

  if (!parsed.isValid()) {
    return date;
  }

  return parsed
    .locale("vi")
    .format("dddd, DD.MM.YYYY");
}

function getIcon(event, index) {
  if (
    event?.icon
  ) {
    return event.icon;
  }

  const icons = [
    "♢",
    "✦",
    "♡",
    "◆",
  ];

  return icons[
    index % icons.length
  ];
}
</script>

<style scoped>
.eg-events {
  position: relative;

  padding:
    100px 35px;

  background:
    #f4efe5;

  overflow: hidden;
}

.eg-events::before {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(180,142,40,0.12);

  pointer-events: none;
}

.events-inner {
  position: relative;

  width: min(
    100%,
    700px
  );

  margin: auto;
}

/* HEADER */

.events-header {
  text-align: center;

  margin-bottom: 60px;
}

.events-label {
  color: #a78948;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.events-script {
  margin-top: 20px;

  color: #c29d46;

  font-family:
    "Allura",
    cursive;

  font-size: 35px;
}

.events-header h2 {
  margin: 4px 0 18px;

  color: #30291f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(34px, 6vw, 48px);

  font-weight: 400;

  line-height: 1;
}

.events-header h2 em {
  color: #8c795b;

  font-style: italic;
}

.header-symbol {
  color: #d4af37;

  font-size: 7px;
}

/* EVENTS */

.events-list {
  display: flex;

  flex-direction: column;

  gap: 28px;
}

.event-card {
  position: relative;

  display: grid;

  grid-template-columns:
    55px
    80px
    1fr;

  min-height: 190px;

  background:
    #fffdf8;

  border:
    1px solid
    rgba(180,142,40,0.24);

  box-shadow:
    0 15px 40px
    rgba(75,61,38,0.07);

  overflow: hidden;
}

.event-card::before {
  content: "";

  position: absolute;

  inset: 6px;

  border:
    1px solid
    rgba(212,175,55,0.08);

  pointer-events: none;
}

/* NUMBER */

.event-number {
  display: flex;

  align-items: center;
  justify-content: center;

  color:
    rgba(174,139,54,0.5);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 20px;

  writing-mode:
    vertical-rl;

  transform:
    rotate(180deg);
}

/* ICON */

.event-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  border-left:
    1px solid
    rgba(212,175,55,0.18);

  border-right:
    1px solid
    rgba(212,175,55,0.18);
}

.event-icon span {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    #d4af37;

  border-radius: 50%;

  color:
    #c49d3c;

  font-size: 14px;
}

/* CONTENT */

.event-content {
  padding:
    30px 28px;
}

.event-type {
  color:
    #b0924b;

  font-family:
    Arial,
    sans-serif;

  font-size: 7px;

  letter-spacing: 3px;
}

.event-content h3 {
  margin:
    5px 0 15px;

  color:
    #30291f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 32px;

  font-weight: 400;
}

/* ROW */

.event-row {
  display: flex;

  align-items: flex-start;

  gap: 9px;

  margin-top: 6px;

  color:
    #756957;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;
}

.row-icon {
  padding-top: 4px;

  color:
    #d4af37;

  font-size: 5px;
}

.event-address {
  margin-top: 10px;

  color:
    #958675;

  font-size: 13px;

  line-height: 1.5;
}

/* MAP */

.map-button {
  display: inline-flex;

  align-items: center;

  gap: 14px;

  margin-top: 20px;

  padding:
    8px 14px;

  border:
    1px solid
    rgba(180,142,40,0.55);

  color:
    #9c7d34;

  text-decoration: none;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 14px;

  transition:
    all 0.3s ease;
}

.map-button:hover {
  background:
    #30291f;

  color:
    #f5e7bd;

  border-color:
    #30291f;
}

/* MOBILE */

@media (max-width: 600px) {
  .eg-events {
    padding:
      75px 20px;
  }

  .eg-events::before {
    inset: 10px;
  }

  .event-card {
    grid-template-columns:
      40px
      62px
      1fr;
  }

  .event-number {
    font-size: 16px;
  }

  .event-icon span {
    width: 40px;
    height: 40px;

    font-size: 12px;
  }

  .event-content {
    padding:
      25px 17px;
  }

  .event-content h3 {
    font-size: 27px;
  }

  .event-row {
    font-size: 14px;
  }
}
</style>