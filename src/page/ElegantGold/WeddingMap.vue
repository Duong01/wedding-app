<template>
  <section class="eg-map">

    <div class="map-inner">

      <!-- HEADER -->

      <header class="section-header">

        <div class="section-label">
          WEDDING LOCATION
        </div>

        <div class="script-title">
          Địa điểm tổ chức
        </div>

        <h2>
          Nơi chúng mình
          <br />
          <em>trao nhau lời hẹn ước</em>
        </h2>

        <div class="gold-symbol">
          ◆
        </div>

      </header>

      <!-- LOCATIONS -->

      <div class="location-list">

        <article
          v-for="(event, index) in mapEvents"
          :key="event.Id || index"
          class="location-card"
        >

          <div class="location-number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div class="location-content">

            <div class="location-type">
              {{ event.type || "WEDDING EVENT" }}
            </div>

            <h3>
              {{ event.Title || event.name }}
            </h3>

            <div
              v-if="event.time"
              class="location-time"
            >
              {{ event.time }}
            </div>

            <div
              v-if="event.date"
              class="location-date"
            >
              {{ event.date }}
            </div>

            <p
              v-if="getAddress(event)"
              class="location-address"
            >
              <span class="address-icon">⌖</span>
              {{ getAddress(event) }}
            </p>

            <a
              v-if="getMapUrl(event)"
              :href="getMapUrl(event)"
              target="_blank"
              rel="noopener noreferrer"
              class="direction-button"
            >
              <span>
                Xem bản đồ
              </span>

              <i>↗</i>
            </a>

          </div>

        </article>

      </div>

      <!-- EMPTY -->

      <div
        v-if="!mapEvents.length"
        class="empty-map"
      >
        <span>✦</span>
        <p>
          Địa điểm sẽ được cập nhật sớm.
        </p>
      </div>

    </div>

  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

const mapEvents = computed(() => {
  return props.events.filter((event) => {
    return (
      event?.map ||
      event?.mapUrl ||
      event?.googleMap ||
      event?.location?.map
    );
  });
});

function getAddress(event) {
  return (
    event?.map?.address ||
    event?.address ||
    event?.location?.address ||
    ""
  );
}

function getMapUrl(event) {
  return (
    event?.map?.url ||
    event?.map?.link ||
    event?.mapUrl ||
    event?.googleMap ||
    event?.location?.map ||
    ""
  );
}
</script>

<style scoped>
.eg-map {
  position: relative;

  padding:
    100px 30px;

  background:
    #f5f0e6;

  overflow: hidden;
}

.eg-map::before {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(180,142,40,0.1);

  pointer-events: none;
}

.map-inner {
  position: relative;

  width: min(
    100%,
    700px
  );

  margin: auto;
}

/* HEADER */

.section-header {
  text-align: center;

  margin-bottom: 55px;
}

.section-label {
  color: #a98a47;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.script-title {
  margin-top: 18px;

  color: #c39c42;

  font-family:
    "Allura",
    cursive;

  font-size: 35px;
}

.section-header h2 {
  margin:
    5px 0 18px;

  color: #30291f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(34px, 6vw, 48px);

  font-weight: 400;

  line-height: .95;
}

.section-header h2 em {
  color: #8e7a59;

  font-style: italic;
}

.gold-symbol {
  color: #d4af37;

  font-size: 7px;
}

/* LOCATION */

.location-list {
  display: grid;

  gap: 20px;
}

.location-card {
  position: relative;

  display: grid;

  grid-template-columns:
    55px 1fr;

  padding: 30px;

  border:
    1px solid
    rgba(180,142,40,0.28);

  background:
    rgba(255,253,248,.75);

  box-shadow:
    0 15px 45px
    rgba(50,40,20,.05);
}

.location-number {
  color:
    rgba(180,142,40,.35);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 18px;
}

.location-type {
  color: #b18d3e;

  font-family: Arial, sans-serif;

  font-size: 8px;

  letter-spacing: 3px;
}

.location-content h3 {
  margin:
    6px 0 5px;

  color: #30291f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 31px;

  font-weight: 400;
}

.location-time,
.location-date {
  color: #786b59;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;
}

.location-address {
  display: flex;

  gap: 8px;

  margin:
    14px 0 20px;

  color: #766b5d;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;

  line-height: 1.5;
}

.address-icon {
  color: #c39c42;
}

.direction-button {
  width: fit-content;

  display: inline-flex;

  align-items: center;

  gap: 14px;

  padding:
    9px 15px;

  border:
    1px solid
    rgba(180,142,40,.45);

  color: #8d7136;

  text-decoration: none;

  font-family: Arial, sans-serif;

  font-size: 8px;

  letter-spacing: 1.5px;

  transition:
    all .3s ease;
}

.direction-button i {
  font-size: 13px;

  font-style: normal;
}

.direction-button:hover {
  background: #b18d3e;

  color: white;
}

.empty-map {
  text-align: center;

  color: #8e806d;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;
}

.empty-map span {
  color: #d4af37;
}

/* MOBILE */

@media (max-width:600px) {
  .eg-map {
    padding:
      75px 20px;
  }

  .eg-map::before {
    inset: 10px;
  }

  .location-card {
    grid-template-columns:
      35px 1fr;

    padding: 22px;
  }

  .location-content h3 {
    font-size: 27px;
  }
}
</style>