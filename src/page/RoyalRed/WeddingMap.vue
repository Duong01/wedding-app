<template>
  <section class="rr-section">
    <div class="rr-frame">
      <div class="rr-kicker">WEDDING VENUE</div>
      <h2 class="rr-title">Tiệc Cưới Sẽ Tổ Chức Tại</h2>
      <article v-for="(e, i) in eventsWithLocation" :key="i" class="map-card">
        <h3>{{ e.Title || e.Name }}</h3>
        <p>{{  e.Address || e.Location }}</p>
        <iframe
          :src="e.Map || e.Map"
          loading="lazy"
          allowfullscreen
        ></iframe
        ><a
          :href="e.Map || e.Map"
          target="_blank"
          >MỞ GOOGLE MAPS</a
        >
      </article>
    </div>
  </section>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({ events: { type: Array, default: () => [] } });
const eventsWithLocation = computed(() =>
  props.events.filter(
    (e) =>
      e?.Location ||
      e?.Address ||
      e?.Location ||
      e?.Map ||
      e?.Map ||
      e?.MapEmbed ||
      e?.EmbedUrl
  )
);
</script>
<style scoped>
/* =========================================================
   ROYAL RED — WEDDING VENUE
========================================================= */

.rr-section {
  position: relative;
  width: 100%;
  color: #f5e7c4;
}

.rr-frame {
  width: min(1100px, 100%);
  margin: 0 auto;
}

/* =========================================================
   HEADER
========================================================= */

.rr-kicker {
  text-align: center;
  color: #c9a45c;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.38em;
  margin-bottom: 14px;
}

.rr-title {
  position: relative;
  text-align: center;

  color: #f0d48e;
  font-family: "Times New Roman", Georgia, serif;
  font-size: clamp(30px, 5vw, 48px);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.rr-title::after {
  content: "囍";
  display: block;

  margin-top: 16px;

  color: #b98a3e;
  font-family: serif;
  font-size: 22px;
  line-height: 1;
}


/* =========================================================
   MAP CARD
========================================================= */

.map-card {
  position: relative;
  padding: 20px;
  width: 100%;
  margin: 0 auto 80px;

  text-align: center;
}

/* =========================================================
   VENUE TITLE
========================================================= */

.map-card h3 {
  margin: 0;

  color: #f1d28c;

  font-family: "Times New Roman", Georgia, serif;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 500;

  letter-spacing: 0.05em;
  line-height: 1.3;
}

/* dòng trang trí nhỏ dưới tên */

.map-card h3::after {
  content: "✦";

  display: block;

  margin: 14px 0 12px;

  color: #b98a3e;
  font-size: 13px;
}


/* =========================================================
   ADDRESS
========================================================= */

.map-card p {
  max-width: 650px;
  margin: 0 auto 28px;

  color: rgba(245, 231, 196, 0.72);

  font-family: "Times New Roman", Georgia, serif;
  font-size: 15px;
  line-height: 1.8;

  letter-spacing: 0.03em;
}


/* =========================================================
   MAP WRAPPER
========================================================= */

.map-card iframe {
  display: block;
  border-radius: 10px;
  width: 100%;
  height: 430px;

  margin: 0 auto;

  border: 0;

  filter:
    saturate(0.78)
    contrast(1.04)
    brightness(0.88);

  box-shadow:
    0 20px 55px rgba(0, 0, 0, 0.28);

  transition:
    filter 0.5s ease,
    transform 0.5s ease,
    box-shadow 0.5s ease;
}

.map-card:hover iframe {
  filter:
    saturate(0.95)
    contrast(1.03)
    brightness(0.95);

  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.38);
}


/* =========================================================
   GOOGLE MAP BUTTON
========================================================= */

.map-card a {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 210px;

  margin-top: 25px;

  color: #e8c77c;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.2em;
  text-decoration: none;

  transition:
    color 0.3s ease,
    transform 0.3s ease;
}

/* đường gold phía dưới */

.map-card a::after {
  content: "";

  position: absolute;

  left: 50%;
  bottom: 3px;

  width: 35px;
  height: 1px;

  background: #c59a4a;

  transform: translateX(-50%);

  transition:
    width 0.4s ease,
    background 0.3s ease;
}

.map-card a:hover {
  color: #f5dda2;

  transform: translateY(-2px);
}

.map-card a:hover::after {
  width: 100%;
  background: #e0b967;
}


/* =========================================================
   MULTIPLE EVENTS
========================================================= */

.map-card + .map-card {
  margin-top: 100px;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 768px) {

  .map-card iframe {
    height: 330px;
  }

  .map-card p {
    font-size: 14px;
    line-height: 1.7;
  }

}


@media (max-width: 480px) {


  .rr-kicker {
    font-size: 9px;
    letter-spacing: 0.28em;
  }

  .rr-title {
    font-size: 29px;
  }

  .map-card h3 {
    font-size: 24px;
  }

  .map-card iframe {
    height: 280px;
  }

  .map-card a {
    min-width: 190px;
    font-size: 9px;
  }

}
</style>

