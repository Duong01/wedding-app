<template>
  <div ref="container" class="hero-content">
    <div class="hero-card animate-item">
      <p class="eyebrow">The Wedding Of</p>
      <h1 class="hero-names">{{ bride.name }} <div>&</div> {{ groom.name }}</h1>
      <p class="hero-subtitle">Sự hiện diện của các bạn là niềm vui lớn nhất của chúng mình</p>

      <div class="hero-meta">
        <div class="meta-pill">{{ formatDate(event.date) }}</div>
        <div class="meta-pill">{{ event.location }}</div>
      </div>

      <HeroCountdown />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { gsap } from "gsap";
import dayjs from "dayjs";
import HeroCountdown from "./HeroCountdown.vue";
import { useWeddingStore } from "@/stores/wedding";

const store1 = useWeddingStore();

const wedding = computed(() => store1.wedding);
const bride = computed(() => wedding.value.couple?.bride ?? {});
const groom = computed(() => wedding.value.couple?.groom ?? {});
const event = computed(() => wedding.value.events?.[0] ?? {});

const container = ref();

function formatDate(date) {
  if (!date) return "";
  return dayjs(date).format("DD.MM.YYYY");
}

onMounted(() => {
  const elements = container.value?.querySelectorAll(".animate-item");
  gsap.from(elements, {
    y: 26,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out"
  });
});
</script>

<style scoped lang="scss">
.hero-content {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: white;
}

.hero-card {
  width: min(100%, 760px);
  padding: 38px 32px;
  border-radius: 32px;
  text-align: center;
  background: rgba(255, 250, 245, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.26);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(16px);
  font-family: "Inter", sans-serif;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: clamp(0.72rem, 2vw, 0.86rem);
  letter-spacing: 0.32em;
  text-transform: uppercase;
  opacity: 0.9;
}

.hero-names {
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2.2rem, 4.8vw, 3.4rem);
  font-weight: 600;
  line-height: 1.15;
}

.hero-names span {
  color: #ffd8be;
  margin: 0 10px;
}

.hero-subtitle {
  margin: 16px auto 0;
  max-width: 560px;
  font-size: clamp(0.98rem, 2.2vw, 1.05rem);
  line-height: 1.85;
  opacity: 0.95;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 24px 0 20px;
}

.meta-pill {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  font-size: clamp(0.88rem, 2vw, 0.95rem);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 600px) {
  .hero-card {
    padding: 28px 20px;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }
}
</style>
