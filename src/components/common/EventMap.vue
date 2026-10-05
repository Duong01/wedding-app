<template>
  <!--
    Bản đồ nhúng + nút Chỉ đường cho 1 sự kiện — đặt trong
    thẻ sự kiện của từng theme (thay cho section WeddingMap
    standalone trước đây).

    Không suy ra được URL nào (không Map, không địa chỉ) →
    render rỗng, không chiếm chỗ.
  -->
  <div v-if="embedUrl || directionsUrl" class="event-map">
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      class="event-map__frame"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
      :title="`${$t('Bản đồ ')}${event?.Location || event?.Title || $t('sự kiện')}`"
    ></iframe>

    <div v-else class="event-map__placeholder">
      <span aria-hidden="true">📍</span>

      <small>{{ $t("Chưa có bản đồ cho địa điểm này") }}</small>
    </div>

    <a
      v-if="directionsUrl"
      :href="directionsUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="event-map__directions"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2 4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
      </svg>

      {{ $t("CHỈ ĐƯỜNG") }}
    </a>
  </div>
</template>

<script setup>
import { computed } from "vue";

import { mapDirectionsUrl, mapEmbedUrl } from "@/utils/mapEmbed";
const props = defineProps({
  /*
   * 1 event đơn (không phải mảng) — component nằm trong
   * v-for của WeddingEvents từng theme.
   */
  event: { type: Object, required: true },
});

const embedUrl = computed(() => mapEmbedUrl(props.event));

const directionsUrl = computed(() => mapDirectionsUrl(props.event));
</script>

<style scoped>
.event-map {
  width: 100%;

  margin-top: 16px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-map__frame {
  width: 100%;

  height: 220px;

  border: 1px solid var(--accent, #c79d5c);
  border-radius: 12px;

  overflow: hidden;
}

.event-map__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 18px;

  color: var(--text-secondary, #806f66);

  border: 1px dashed var(--accent, #c79d5c);
  border-radius: 12px;

  font-size: 12px;
}

.event-map__directions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  align-self: center;

  min-height: 38px;
  padding: 0 18px;

  color: #fff;

  border-radius: 999px;

  background: var(--primary, #8a7a68);

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;

  text-decoration: none;

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-map__directions:hover {
  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
}

.event-map__directions svg {
  width: 15px;
  height: 15px;
}
</style>
