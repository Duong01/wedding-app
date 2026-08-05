<template>
  <div ref="card" class="hero-card">
    <div class="card-top">
      <!-- <div class="invite-badge animate-item">✨ Wedding Invitation ✨</div> -->
      <p class="guest animate-item">{{ guestName }}</p>
      <h2 class="welcome animate-item">Trân trọng kính mời</h2>
    </div>

    <div class="card-divider"></div>

    <div class="couple animate-item">
      <div class="avatar-wrap">
        <div class="avatar-frame">
          <v-avatar size="110" class="avatar-item">
            <v-img :src="groomImage" cover />
          </v-avatar>
        </div>
        <span class="avatar-label">Chú rể</span>
      </div>

      <div class="heart">
        <v-icon color="pink-lighten-1" size="44">mdi-heart</v-icon>
      </div>

      <div class="avatar-wrap">
        <div class="avatar-frame">
          <v-avatar size="110" class="avatar-item">
            <v-img :src="brideImage" cover />
          </v-avatar>
        </div>
        <span class="avatar-label">Cô dâu</span>
      </div>
    </div>

    <h1 class="names animate-item">
      {{ groomName }}
      <span>&</span>
      {{ brideName }}
    </h1>

    <div class="card-divider"></div>

    <div class="meta animate-item">
      <div class="meta-item">
        <v-icon size="20" class="meta-icon">mdi-calendar-heart</v-icon>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="meta-item">
        <v-icon size="20" class="meta-icon">mdi-map-marker-radius</v-icon>
        <span>{{ displayAddress }}</span>
      </div>
    </div>

    <div class="card-bottom animate-item">
      <p class="invitation-text">Sự hiện diện của bạn là niềm vui lớn nhất của chúng mình</p>
      <v-btn size="large" rounded="pill" color="pink-lighten-2" class="open-btn" @click="$emit('open')">
        <v-icon start>mdi-email-open-heart-outline</v-icon>
        MỞ THIỆP
      </v-btn>
    </div>
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
.animate-item {
  will-change: transform, opacity;
}

.hero-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(92%, 580px);
  padding: 0;
  border-radius: 24px;
  text-align: center;
  color: #4b3537;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 250, 248, 0.96));
  border: 2px solid rgba(255, 184, 208, 0.4);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  overflow: hidden;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.hero-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 30%, rgba(255, 200, 220, 0.08), transparent);
  pointer-events: none;
}

.card-top,
.card-bottom {
  padding: 32px 28px;
}

.card-top {
  padding-top: 36px;
}

.card-bottom {
  padding-bottom: 36px;
}

.card-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 184, 208, 0.3), transparent);
  margin: 20px 0;
}

.invite-badge {
  letter-spacing: 0.28em;
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  text-transform: uppercase;
  opacity: 0.75;
  color: #e91e63;
  font-weight: 600;
}

.guest {
  margin-top: 12px;
  font-size: clamp(1.3rem, 4vw, 1.9rem);
  font-family: "Cormorant Garamond", serif;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #d32f2f;
}

.welcome {
  margin: 8px 0 0;
  opacity: 0.85;
  font-size: clamp(0.95rem, 2.2vw, 1.05rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5d4037;
  font-weight: 500;
}

.couple {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin: 20px 0 16px;
}

.avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-frame::before {
  content: "";
  position: absolute;
  inset: -8px;
  border: 2px solid rgba(255, 184, 208, 0.5);
  border-radius: 50%;
}

.avatar-item {
  border: 6px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.avatar-label {
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.7;
  color: #7f5a58;
  font-weight: 500;
}

.heart {
  animation: heartBeat 1.2s ease-in-out infinite;
}

.names {
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 1.2;
  font-weight: 700;
  margin: 8px 0 0;
  font-family: "Cormorant Garamond", serif;
  color: #3e2723;
  letter-spacing: 0.02em;
}

.names span {
  color: #ffa726;
  margin: 0 12px;
  font-size: 1.1em;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-items: center;
  margin-top: 0;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 184, 208, 0.08), rgba(255, 218, 185, 0.08));
  font-size: clamp(0.82rem, 2vw, 0.95rem);
  color: #5d4037;
  border: 1px solid rgba(255, 184, 208, 0.2);
}

.meta-icon {
  color: #e91e63;
  flex-shrink: 0;
}

.invitation-text {
  font-size: clamp(0.95rem, 2.2vw, 1.05rem);
  font-style: italic;
  color: #6d4c41;
  line-height: 1.6;
  margin: 0 0 16px 0;
  letter-spacing: 0.01em;
}

.open-btn {
  width: min(100%, 280px);
  font-weight: 700;
  letter-spacing: 0.16em;
  transition: transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease;
  background: linear-gradient(135deg, #ff8fa3, #ff6b9d) !important;
  color: white !important;
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.3);
}

.open-btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 28px rgba(255, 107, 157, 0.4);
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.18);
  }
}

@media (max-width: 600px) {
  .hero-card {
    padding: 0;
    border-radius: 20px;
    width: min(96%, 540px);
  }

  .card-top {
    padding: 28px 20px 0;
  }

  .card-bottom {
    padding: 0 20px 28px;
  }

  .guest {
    font-size: 1.5rem;
  }

  .couple {
    flex-direction: column;
    gap: 20px;
    margin: 16px 0;
  }

  .meta-item {
    font-size: 0.85rem;
  }

  .open-btn {
    width: 100%;
  }
}
</style>
