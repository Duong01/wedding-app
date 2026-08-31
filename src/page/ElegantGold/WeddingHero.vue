<template>
  <section class="dong-hero">
    <div class="hero-sun">
      <div class="hero-sun-core">
        <span>✦</span>
      </div>
    </div>

    <div class="hero-top-pattern" />

    <div class="hero-content">
      <p class="label">TRÂN TRỌNG KÍNH MỜI</p>

      <div class="monogram">
        {{ monogram }}
      </div>

      <p class="intro">
        cùng gia đình hai bên
        <br />
        trân trọng báo tin
      </p>

      <h1>
        {{ groomName }}
        <small>&</small>
        {{ brideName }}
      </h1>

      <div class="hero-divider">
        <span />
        <b>◈</b>
        <span />
      </div>

      <p class="date-label">
        {{ dateLabel }}
      </p>

      <p class="message">
        Một hành trình mới bắt đầu
        <br />
        bằng một lời hẹn ước trăm năm
      </p>
    </div>

    <div class="hero-bird bird-one">𓅃</div>
    <div class="hero-bird bird-two">𓅃</div>

    <div class="hero-bottom">
      <span />
      <i>ĐÔNG SƠN · TRĂM NĂM HẠNH PHÚC</i>
      <span />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },
  monogram: String,
  dateLabel: String,
});

const groomName = computed(() =>
  props.wedding?.GroomName ||
  props.wedding?.groomName ||
  props.wedding?.groom?.name ||
  "Chú Rể"
);

const brideName = computed(() =>
  props.wedding?.BrideName ||
  props.wedding?.brideName ||
  props.wedding?.bride?.name ||
  "Cô Dâu"
);
</script>

<style scoped>
.dong-hero {
  position: relative;
  min-height: 700px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #f3e5c8;
  background:
    radial-gradient(circle at 50% 32%, rgba(172,92,39,.22), transparent 30%),
    linear-gradient(180deg, #741c17 0%, #641914 50%, #54120f 100%);
}

.dong-hero::after {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(201,149,82,.35);
  pointer-events: none;
}

.hero-sun {
  position: absolute;
  width: 460px;
  height: 460px;
  border: 1px solid rgba(201,149,82,.28);
  border-radius: 50%;
  animation: rotateSun 45s linear infinite;
}

.hero-sun::before,
.hero-sun::after {
  content: "";
  position: absolute;
  inset: 40px;
  border: 1px dashed rgba(201,149,82,.28);
  border-radius: 50%;
}

.hero-sun-core {
  position: absolute;
  inset: 36%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(201,149,82,.55);
  border-radius: 50%;
  font-size: 34px;
  color: #c99552;
}

.hero-content {
  position: relative;
  z-index: 3;
  width: min(90%, 550px);
  animation: heroReveal 1.1s ease both;
}

.label {
  font-size: 10px;
  letter-spacing: .45em;
  color: #d4a35f;
}

.monogram {
  margin: 15px 0;
  font-family: Georgia, serif;
  font-size: 25px;
  color: #d4a35f;
  letter-spacing: .12em;
}

.intro {
  font-family: Georgia, serif;
  font-size: 15px;
  line-height: 1.8;
  font-style: italic;
  color: #dcc8a5;
}

h1 {
  margin: 25px 0 15px;
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: clamp(36px, 10vw, 62px);
  line-height: 1.05;
}

h1 small {
  display: block;
  margin: 7px 0;
  font-size: 22px;
  color: #c99552;
}

.hero-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(270px, 80%);
  margin: 24px auto;
}

.hero-divider span {
  height: 1px;
  flex: 1;
  background: linear-gradient(
    90deg,
    transparent,
    #b9823f
  );
}

.hero-divider span:last-child {
  background: linear-gradient(
    90deg,
    #b9823f,
    transparent
  );
}

.hero-divider b {
  color: #d4a35f;
}

.date-label {
  letter-spacing: .25em;
  font-size: 13px;
  color: #d4a35f;
}

.message {
  margin-top: 24px;
  font-family: Georgia, serif;
  line-height: 1.8;
  color: #d6c09b;
}

.hero-bird {
  position: absolute;
  z-index: 1;
  font-size: 120px;
  color: rgba(201,149,82,.12);
}

.bird-one {
  left: -25px;
  top: 15%;
  transform: rotate(-20deg);
}

.bird-two {
  right: -25px;
  bottom: 18%;
  transform: scaleX(-1) rotate(-20deg);
}

.hero-top-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  opacity: .25;
  background:
    repeating-radial-gradient(
      circle at 20px 0,
      transparent 0 7px,
      #c99552 8px 9px,
      transparent 10px 18px
    );
}

.hero-bottom {
  position: absolute;
  bottom: 30px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 80%;
  font-size: 8px;
  letter-spacing: .3em;
  color: #b9823f;
}

.hero-bottom span {
  height: 1px;
  flex: 1;
  background: rgba(201,149,82,.4);
}

@keyframes rotateSun {
  to { transform: rotate(360deg); }
}

@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(35px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>