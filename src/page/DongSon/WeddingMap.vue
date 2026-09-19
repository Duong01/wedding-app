<template>
  <section class="map-section">
    <div class="map-title">
      <small>WEDDING LOCATION</small>
      <h2>Nơi tình yêu hội tụ</h2>
    </div>

    <div
      v-for="(event, index) in events"
      :key="event.id || event.Id || index"
      class="location"
    >
      <div class="location-symbol">◉</div>

      <div class="location-info">
        <span>{{ event.type || event.Type || "ĐỊA ĐIỂM" }}</span>

        <h3>
          {{ event.location || event.Location || "Địa điểm tổ chức" }}
        </h3>

        <p>
          {{ event.address || event.Address || "" }}
        </p>

        <a
          v-if="event.mapUrl || event.MapUrl || event.map"
          :href="event.mapUrl || event.MapUrl || event.map"
          target="_blank"
          rel="noopener noreferrer"
        >
          CHỈ ĐƯỜNG →
        </a>
      </div>
    </div>

    <div
      v-for="(event, index) in mapEvents"
      :key="`map-${event.id || event.Id || index}`"
      class="map-embed-wrap"
    >
      <iframe
        v-if="embedUrl(event)"
        :src="embedUrl(event)"
        class="map-embed"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
        title="Bản đồ địa điểm cưới"
      ></iframe>
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

const mapEvents = computed(() =>
  props.events.filter((event) => embedUrl(event))
);

function embedUrl(event) {
  const raw = event?.mapUrl || event?.MapUrl || event?.map || "";

  if (!raw) return "";

  const match = String(raw).match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

  if (match) {
    return `https://www.google.com/maps?q=${match[1]},${match[2]}&output=embed`;
  }

  return `${raw}${raw.includes("?") ? "&" : "?"}output=embed`;
}
</script>

<style scoped>
.map-section {
  padding: 65px 22px;
  background: #54120f;
  color: #ead7b5;
}

.map-title {
  text-align: center;
  margin-bottom: 35px;
}

.map-title small {
  font-size: 10px;
  letter-spacing: .4em;
  color: #c99552;
}

h2 {
  margin-top: 8px;
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 30px;
}

.location {
  max-width: 570px;
  margin: 15px auto;
  padding: 25px;
  display: flex;
  gap: 20px;
  border: 1px solid rgba(201,149,82,.35);
  background: rgba(255,255,255,.025);
}

.location-symbol {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border: 1px solid #a96b32;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #d4a35f;
}

.location-info span {
  font-size: 11px;
  letter-spacing: .3em;
  color: #c99552;
}

.location-info h3 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 19px;
  font-weight: 400;
}

.location-info p {
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: #cdb99b;

  overflow-wrap: anywhere;
}

.location-info a {
  display: inline-block;
  margin-top: 12px;
  color: #d4a35f;
  text-decoration: none;
  font-size: 10px;
  letter-spacing: .2em;

  transition: color .2s ease;
}

.location-info a:hover {
  color: #ead7b5;
}

.map-embed-wrap {
  max-width: 570px;
  margin: 18px auto;
}

.map-embed {
  display: block;

  width: 100%;
  height: 260px;

  border: 1px solid rgba(201,149,82,.35);

  filter: sepia(.18) saturate(.9);
}

@media (max-width: 480px) {
  .map-section {
    padding: 50px 14px;
  }

  .location {
    padding: 18px 14px;
    gap: 14px;
  }

  .map-embed {
    height: 210px;
  }
}
</style>
