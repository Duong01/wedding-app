<template>
  <footer class="footer">
    <div class="mark">{{ monogram }}</div>
    <div class="names">{{ groom }} <span>&</span> {{ bride }}</div>
    <div class="date">{{ date }}</div>
    <p>Cảm ơn bạn đã dành thời gian đến với ngày vui của chúng tôi.</p>
    <div class="ornament">❧ ✦ ❧</div>
    <small>© {{ currentYear }} · WEDDING INVITATION</small>
  </footer>
</template>
<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
const p = defineProps({
  wedding: Object,
  monogram: String,
  currentYear: Number,
});
const groom = computed(
  () => p.wedding?.GroomName || p.wedding?.groomName || ""
);
const bride = computed(
  () => p.wedding?.BrideName || p.wedding?.brideName || ""
);
const date = computed(() => {
  const d = dayjs(p.wedding?.weddingDate);
  return d.isValid() ? d.format("DD · MM · YYYY") : "";
});
</script>
<style scoped>
.footer {
  text-align: center;
  padding: 55px 25px 35px;
  border-top: 1px solid rgba(216, 170, 90, 0.28);
}
.mark {
  width: 55px;
  height: 55px;
  border: 1px solid #d8aa5a;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin: auto;
  color: #efd18b;
}
.names {
  font-family: "Great Vibes";
  font-size: 32px;
  color: #efd18b;
  margin-top: 15px;
}
.names span {
  font-family: "Cormorant Garamond";
  font-size: 18px;
}
.date {
  margin: 10px;
  letter-spacing: 0.15em;
}
.footer p {
  opacity: 0.65;
  max-width: 350px;
  margin: 20px auto;
  line-height: 1.6;
}
.ornament {
  color: #d8aa5a;
}
.footer small {
  display: block;
  margin-top: 20px;
  opacity: 0.4;
  font-size: 8px;
  letter-spacing: 0.14em;
}
</style>
