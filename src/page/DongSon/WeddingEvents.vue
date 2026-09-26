<template>
  <section class="events">
    <div class="title">
      <small>WEDDING CEREMONY</small>
      <h2>Ngày trọng đại</h2>
      <div class="title-mark">✦</div>
    </div>

    <div class="event-list">
      <article
        v-for="(event, index) in events"
        :key="event.id || event.Id || index"
        class="event-card"
      >
        <div class="event-number">
          {{ String(index + 1).padStart(2, "0") }}
        </div>

        <div class="event-icon">
          <span v-if="index % 2 === 0">◉</span>
          <span v-else>✦</span>
        </div>

        <div class="event-content">
          <span class="event-type">
            {{ event.type || event.Type || event.title || "LỄ CƯỚI" }}
          </span>

          <h3>
            {{ event.name || event.Name || event.title || "Lễ thành hôn" }}
          </h3>

          <div class="event-row">
            <b>THỜI GIAN</b>
            <span>
              {{ event.time || event.Time || event.EventTime || "" }}
            </span>
          </div>

          <div class="event-row">
            <b>ĐỊA ĐIỂM</b>
            <span>
              {{ event.location || event.Location || "" }}
            </span>
          </div>

          <a
            v-if="event.mapUrl || event.MapUrl || event.map"
            :href="event.mapUrl || event.MapUrl || event.map"
            target="_blank"
            rel="noopener noreferrer"
            class="map-button"
          >
            XEM BẢN ĐỒ
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.events {
  padding: 70px 20px;
  background: #f3ead8;
  color: #641914;
}

.title {
  text-align: center;
  margin-bottom: 38px;
}

.title small {
  font-size: 10px;
  letter-spacing: .4em;
  color: #8b5829;
}

h2 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 32px;
  font-weight: 400;
}

.title-mark {
  color: #8b5829;
}

.event-list {
  display: grid;
  gap: 22px;
  max-width: 600px;
  margin: auto;
}

.event-card {
  position: relative;
  display: grid;
  grid-template-columns: 42px 55px 1fr;
  gap: 15px;
  padding: 25px 20px;
  border: 1px solid rgba(143,36,28,.35);
  background: rgba(255,250,238,.45);
}

.event-card::before {
  content: "";
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(169,107,50,.25);
  pointer-events: none;
}

.event-number {
  font-family: Georgia, serif;
  color: #8b5829;
  font-size: 12px;
}

.event-icon {
  position: relative;
  z-index: 2;
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border: 1px solid #8b5829;
  border-radius: 50%;
  color: #8b5829;
}

.event-content {
  position: relative;
  z-index: 2;
}

.event-type {
  font-size: 10px;
  letter-spacing: .3em;
  color: #8b5829;
}

h3 {
  margin: 6px 0 17px;
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 400;
}

.event-row {
  display: grid;
  gap: 3px;
  margin-top: 9px;
}

.event-row b {
  font-size: 11px;
  letter-spacing: .2em;
  color: #8f5a50;
}

.event-row span {
  font-family: Georgia, serif;
  font-size: 13px;
  line-height: 1.5;

  overflow-wrap: anywhere;
}

.map-button {
  display: inline-block;
  margin-top: 18px;
  padding: 9px 14px;
  border: 1px solid #8b5829;
  color: #641914;
  text-decoration: none;
  font-size: 10px;
  letter-spacing: .2em;

  transition: background .2s ease, color .2s ease;
}

.map-button:hover {
  background: #8b5829;
  color: #fffaf0;
}

@media (max-width: 480px) {
  .events {
    padding: 54px 14px;
  }

  .event-card {
    grid-template-columns: 34px 46px 1fr;
    gap: 11px;
    padding: 18px 14px;
  }

  .event-icon {
    width: 42px;
    height: 42px;
  }
}
</style>
