<template>
  <div ref="card" class="hero-card">
    <h2 class="welcome animate-item">Trân trọng kính mời</h2>

    <p class="guest animate-item">{{ guestName }}</p>
    <div class="couple animate-item">
      <div class="avatar-wrap">
        <v-avatar size="94" class="avatar-item">
          <v-img :src="groomImage" cover />
        </v-avatar>
        <span class="avatar-label">Chú rể</span>
      </div>

      <div class="heart">
        <v-icon color="pink-lighten-2" size="40">mdi-heart</v-icon>
      </div>

      <div class="avatar-wrap">
        <v-avatar size="94" class="avatar-item">
          <v-img :src="brideImage" cover />
        </v-avatar>
        <span class="avatar-label">Cô dâu</span>
      </div>
    </div>

    <h1 class="names animate-item">
      {{ groomName }}
      <span>&</span>
      {{ brideName }}
    </h1>

    <div class="meta animate-item">
      <div class="meta-item">
        <v-icon size="18">mdi-calendar-heart</v-icon>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="meta-item">
        <v-icon size="18">mdi-map-marker-radius</v-icon>
        <span>{{ displayAddress }}</span>
      </div>
    </div>

    <v-btn size="x-large" rounded="pill" color="pink" class="open-btn animate-item" @click="$emit('open')">
      <v-icon start>mdi-email-open-heart-outline</v-icon>
      MỞ THIỆP
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { gsap } from "gsap";
import dayjs from "dayjs";

const props = defineProps({
  guestName: String,
  groomName: String,
  brideName: String,
  groomImage: String,
  brideImage: String,
  weddingDate: String,
  address: String
});

defineEmits(["open"]);

const card = ref();
const formattedDate = computed(() => {
  if (!props.weddingDate) return "Sắp diễn ra";
  return dayjs(props.weddingDate).format("DD/MM/YYYY • HH:mm");
});
const displayAddress = computed(() => props.address || "Thông tin địa điểm sẽ được cập nhật sớm");

onMounted(() => {
  const elements = card.value?.querySelectorAll(".animate-item");
  gsap.from(elements, {
    y: 28,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out"
  });
});
</script>

<style scoped lang="scss">
.hero-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(93%, 560px);
  padding: 38px 32px;
  border-radius: 30px;
  text-align: center;
  color: white;
  backdrop-filter: blur(24px);
  background: #680d0e;
  border: 1px solid rgba(233, 206, 158, 0.15);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  clip-path: inset(0 round 8px)
}

.hero-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 58%);
  pointer-events: none;
}

.invite-badge {
  letter-spacing: 0.28em;
  // font-size: 0.8rem;
  text-transform: uppercase;
  opacity: 0.85;
}

.guest {
  margin-top: 16px;
  // font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
}

.welcome {
  margin: 10px 0 24px;
  opacity: 0.95;
  // font-size: 1rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.couple {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-item {
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
}

.avatar-label {
  // font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.8;
}

.heart {
  animation: heartBeat 1s infinite;
}

.names {
  // font-size: clamp(1.9rem, 3vw, 2.6rem);
  line-height: 1.25;
  font-weight: 700;
  margin: 0;
}

.names span {
  color: #ffd54f;
  margin: 0 10px;
}

.meta {
  display: grid;
  gap: 8px;
  margin-top: 18px;
  justify-items: center;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  // font-size: 0.95rem;
}

.open-btn {
  margin-top: 24px;
  margin-bottom: 24px;
  font-weight: 700;
  letter-spacing: 0.16em;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.open-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

@media (max-width: 600px) {
  .hero-card {
    padding: 28px 20px;
  }

  .guest {
    // font-size: 1.45rem;
  }

  .meta-item {
    // font-size: 0.85rem;
  }
}
</style>
