<template>
  <section class="rr-section">
    <div class="rr-frame countdown">
      <div class="rr-kicker">COUNTDOWN</div>
      <h2 class="rr-title">Đếm Ngược Ngày Hạnh Phúc</h2>
      <div class="boxes">
        <div v-for="x in units" :key="x.k">
          <b>{{ values[x.k] }}</b
          ><small>{{ x.t }}</small>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
const props = defineProps({ countdown: Object, weddingDate: [String, Date] });
const end = computed(
  () =>
    props.countdown?.Date || props.countdown?.Target || props.weddingDate
);
const values = ref({ d: "00", h: "00", m: "00", s: "00" });
const units = [
  { k: "d", t: "NGÀY" },
  { k: "h", t: "GIỜ" },
  { k: "m", t: "PHÚT" },
  { k: "s", t: "GIÂY" },
];
let timer;
function tick() {
  const diff = new Date(end.value).getTime() - Date.now();
  if (diff <= 0) return;
  values.value = {
    d: String(Math.floor(diff / 864e5)).padStart(2, "0"),
    h: String(Math.floor(diff / 36e5) % 24).padStart(2, "0"),
    m: String(Math.floor(diff / 6e4) % 60).padStart(2, "0"),
    s: String(Math.floor(diff / 1e3) % 60).padStart(2, "0"),
  };
}
onMounted(() => {
  tick();
  timer = setInterval(tick, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>
<style scoped>
.boxes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}
.boxes div {
  border: 1px solid rgba(216, 170, 90, 0.5);
  padding: 14px 3px;
  text-align: center;
  background: rgba(30, 0, 0, 0.2);
}
.boxes b {
  display: block;
  font-size: 27px;
  color: #efd18b;
  font-weight: 500;
}
.boxes small {
  font-size: 8px;
  letter-spacing: 0.12em;
}
</style>
