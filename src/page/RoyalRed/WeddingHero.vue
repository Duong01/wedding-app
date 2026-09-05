<template>
  <section class="hero">
    <div class="hero-top">THE WEDDING OF</div>
    <div class="hero-flourish">❧ ✦ ❧</div>
    <div class="hero-names">
      <span>{{ groom }}</span
      ><small>&</small><span>{{ bride }}</span>
    </div>
    <div class="hero-date">{{ dateLabel }}</div>
    <div v-if="heroImage" class="hero-photo">
      <img :src="heroImage" alt="Ảnh cưới" />
    </div>
    <div class="hero-seal">{{ monogram }}</div>
    <div class="scroll">SCROLL<br /><b>⌄</b></div>
  </section>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  wedding: Object,
  monogram: String,
  dateLabel: String,
});
const groom = computed(
  () => props.wedding?.GroomName || props.wedding?.groomName || "Quốc Anh"
);
const bride = computed(
  () => props.wedding?.BrideName || props.wedding?.brideName || "Cát Tường"
);
const heroImage = computed(
  () =>
    props.wedding?.hero?.Image ||
    props.wedding?.hero?.Background ||
    props.wedding?.coverImage ||
    ""
);
</script>
<style scoped>
.hero {
  min-height: 650px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  overflow: hidden;
  background: radial-gradient(
    circle at 50% 20%,
    rgba(151, 22, 22, 0.42),
    transparent 38%
  );
  position: relative;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 16px;
  pointer-events: none;
}
.hero-top {
  font-size: 11px;
  letter-spacing: 0.35em;
  color: #d9b76d;
}
.hero-flourish {
  margin: 16px 0;
  color: #c28e40;
  letter-spacing: 0.2em;
}
.hero-names {
  /* font-family: "Great Vibes", cursive; */
  font-size: 68px;
  line-height: 0.9;
  color: #efd18b;
  display: flex;
  flex-direction: column;
}
.hero-names small {
  font-family: "Cormorant Garamond";
  font-size: 25px;
  margin: 12px;
}
.hero-date {
  margin-top: 25px;
  letter-spacing: 0.22em;
  font-size: 13px;
}
.hero-photo {
  width: min(300px, 75vw);
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #d8aa5a;
  padding: 7px;
  margin-top: 28px;
  box-shadow: 0 0 0 8px rgba(216, 170, 90, 0.06);
}
.hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.hero-seal {
  position: absolute;
  bottom: 34px;
  border: 1px solid #d8aa5a;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11px;
  color: #f1d28a;
}
.scroll {
  position: absolute;
  bottom: 22px;
  right: 20px;
  font-size: 8px;
  letter-spacing: 0.16em;
  opacity: 0.55;
}
.scroll b {
  font-size: 17px;
}
</style>
