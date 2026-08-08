<template>
  <section class="location-section map">
    <v-container>
      <h2 class="section-title">Tiệc cưới diễn ra tại</h2>
          <p class="location-info">
            {{ firstEvent.address }}
          </p>
      <div class="location-card">
      

        <div class="map-frame">
          <iframe :src="mapSrc" loading="lazy" />
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();
const wedding = computed(() => store.wedding);
const firstEvent = computed(() => store.wedding.events?.[0] ?? {});
const mapSrc = computed(() => {
  const query = wedding.value.events?.[0];
  return `${query.map}&output=embed`;
});
</script>

<style scoped>
.section-title{
    color: #fff;
}
.location-info p{
  color: #fff;
}
.location-card {
  display: grid;

  overflow: hidden;

}

.info-list {

  display: flex;

  flex-direction: column;

  gap: 25px;
}

.info-item {
  display: flex;

  gap: 18px;

  align-items: flex-start;
}

.info-item span {
  width: 46px;

  height: 46px;

  border-radius: 50%;


  display: flex;

  justify-content: center;

  align-items: center;

  /* font-size: 22px; */
}

.info-item strong {
  display: block;

  color: var(--primary);

  margin-top: 6px;
}

.actions {
  display: flex;

  gap: 15px;

  margin-top: 40px;
}

.primary-btn {
  flex: 1;

  background: var(--primary);

  color: white;

  text-align: center;

  padding: 14px;

  border-radius: 12px;

  text-decoration: none;

  transition: 0.3s;
}

.primary-btn:hover {
  opacity: 0.9;
}

.outline-btn {
  flex: 1;

  border: 1px solid var(--primary);

  color: var(--primary);

  text-align: center;

  padding: 14px;

  border-radius: 12px;

  text-decoration: none;
}

.outline-btn:hover {

  color: white;
}

.map-frame {
  height: 320px;
  width: 100%;
}

.map-frame iframe {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: none;
}

@media (max-width: 900px) {
  .location-card {
    grid-template-columns: 1fr;
  }

  

  .actions {
    flex-direction: column;
  }

  .map-frame {
    height: 360px;
  }
}
</style>
