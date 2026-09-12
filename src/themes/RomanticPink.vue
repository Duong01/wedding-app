<template>
  <div class="romantic-pink">
    <OpeningScreen
      v-if="!opened"
      :wedding="wedding"
      :monogram="monogram"
      :date-label="openDateLabel"
      @open="handleOpen"
    />

    <main v-else class="romantic-invitation">
      <!-- Lời mời chính: luôn là phần đầu sau khi mở thiệp. -->
      <WeddingHero
        v-if="showHero"
        :wedding="wedding"
        :monogram="monogram"
        :date-label="heroDateLabel"
        :event="primaryEvent"
        :guest-name="guestName"
      />

      <!-- Các mục chi tiết được giữ đúng thứ tự trong RomanticPink. -->
      <div class="romantic-content">
        <div class="content-flower content-flower--top"></div>
        <div class="content-flower content-flower--bottom"></div>
        <section v-if="showCouple" class="romantic-section">
          <WeddingCouple :wedding="wedding" :guest-name="guestName" />
        </section>
        <section v-if="showStory && wedding?.story">
          <WeddingStory :story="wedding.story" />
        </section>
        <section v-if="showEvents && events.length" class="romantic-section">
          <WeddingEvents
            :events="events"
            :recipient-name="wedding?.recipientName"
          />
        </section>
        <section
          v-if="showTimeline && timeline.length"
          class="romantic-section"
        >
          <Timeline :timeline="timeline" :events="events" />
        </section>
        <section v-if="showCountdown" class="romantic-section">
          <WeddingCountdown
            :countdown="countdownTarget"
            :wedding-date="wedding?.weddingDate"
          />
        </section>
        <section v-if="showGallery && gallery.length" class="romantic-section">
          <WeddingGallery :gallery="gallery" />
        </section>
      </div>
      <section v-if="showMap && events.length" class="romantic-section">
        <WeddingMap :events="events" />
      </section>
      <section v-if="showGift && gifts.length" class="romantic-section">
        <WeddingGifts :gifts="gifts" />
      </section>
      <section v-if="showGuestBook" class="romantic-section">
        <WeddingWishes :wishes="wishes" :wedding="wedding" />
      </section>

      <WeddingFooter
        v-if="showFooter"
        :wedding="wedding"
        :monogram="monogram"
        :current-year="currentYear"
      />
      <FloatingMusic
        v-if="showMusic"
        ref="floatingMusicRef"
        :music="wedding?.music"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import OpeningScreen from "@/page/RomanticPink/OpeningScreen.vue";
import WeddingHero from "@/page/RomanticPink/WeddingHero.vue";
import WeddingCouple from "@/page/RomanticPink/WeddingCouple.vue";
import WeddingStory from "@/page/RomanticPink/WeddingStory.vue";
import WeddingEvents from "@/page/RomanticPink/WeddingEvents.vue";
import WeddingCountdown from "@/page/RomanticPink/WeddingCountdown.vue";
import WeddingGallery from "@/page/RomanticPink/WeddingGallery.vue";
import WeddingMap from "@/page/RomanticPink/WeddingMap.vue";
import Timeline from "@/page/RomanticPink/Timeline.vue";
import WeddingGifts from "@/page/RomanticPink/WeddingGifts.vue";
import WeddingWishes from "@/page/RomanticPink/WeddingWishes.vue";
import WeddingFooter from "@/page/RomanticPink/WeddingFooter.vue";

import {
  icon,
  hoa,
  may,
  bgFull,
  royalDecor,
  blossomDecor,
} from "@/page/RomanticPink/romaticpink";

const props = defineProps({ wedding: { type: Object, required: true } });
const wedding = computed(() => props.wedding || {});
const opened = ref(false);
const floatingMusicRef = ref(null);
const currentYear = new Date().getFullYear();
const settings = computed(() => wedding.value?.settings || {});
const events = computed(() =>
  Array.isArray(wedding.value?.events) ? wedding.value.events : []
);
const timeline = computed(() =>
  Array.isArray(wedding.value?.timeline) ? wedding.value.timeline : []
);
const gallery = computed(() =>
  Array.isArray(wedding.value?.gallery) ? wedding.value.gallery : []
);
const gifts = computed(() =>
  Array.isArray(wedding.value?.gifts) ? wedding.value.gifts : []
);
const wishes = computed(() =>
  Array.isArray(wedding.value?.guestBook?.Guest)
    ? wedding.value.guestBook.Guest
    : []
);
const primaryEvent = computed(() => events.value[0] || {});
const countdownTarget = computed(
  () =>
    wedding.value?.countdown?.Target ||
    wedding.value?.countdown ||
    wedding.value?.weddingDate
);
const guestName = computed(
  () =>
    (Array.isArray(wedding.value?.recipientName)
      ? wedding.value.recipientName[0]?.Name
      : wedding.value?.recipientName?.Name) ||
    wedding.value?.guestName ||
    "Quý khách"
);
const showHero = computed(() => settings.value.ShowHero !== false);
const showCouple = computed(() => settings.value.ShowCouple !== false);
const showStory = computed(() => settings.value.ShowStory !== false);
const showEvents = computed(() => settings.value.ShowEvents !== false);
const showTimeline = computed(() => settings.value.ShowTimeline !== false);
const showCountdown = computed(() => settings.value.ShowCountdown === true);
const showGallery = computed(() => settings.value.ShowGallery === true);
const showMap = computed(() => settings.value.ShowMap === true);
const showGift = computed(() => settings.value.ShowGift === true);
const showGuestBook = computed(() => settings.value.ShowGuestBook === true);
const showFooter = computed(() => settings.value.ShowFooter !== false);
const showMusic = computed(
  () =>
    wedding.value?.music?.Enabled === true && settings.value.ShowMusic === true
);
const monogram = computed(() => {
  const groom =
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    "G";
  const bride =
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    "B";
  return `${groom.trim().charAt(0)}&${bride.trim().charAt(0)}`.toUpperCase();
});
function formatDate(value) {
  const date = dayjs(value);
  return date.isValid() ? date.format("DD · MM · YYYY") : "";
}
const openDateLabel = computed(() => formatDate(wedding.value?.weddingDate));
const heroDateLabel = computed(() =>
  formatDate(wedding.value?.hero?.weddingDate || wedding.value?.weddingDate)
);
async function handleOpen() {
  opened.value = true;
  await nextTick();
  floatingMusicRef.value?.play?.();
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&display=swap");

.romantic-pink {
  --pink-deep: #9b4b61;
  --pink: #c56f88;
  --pink-soft: #e5b2c0;
  --pink-pale: #f9e8ec;
  --rose-white: #fffaf9;
  --gold: #c6a06a;
  --gold-light: #e4cda5;
  --text: #805363;

  min-height: 100vh;
  width: 100%;

  color: var(--text);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-variant-numeric: lining-nums;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  background: radial-gradient(
    circle at 50% 10%,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(249, 232, 236, 0.94) 45%,
    rgba(229, 194, 205, 0.9) 100%
  );

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.romantic-pink * {
  box-sizing: border-box;
}

/* =========================================================
   TẤM THIỆP
   ========================================================= */

.romantic-invitation {
  position: relative;

  width: min(620px, 100%);
  min-height: 100vh;

  margin: 0 auto;
  overflow: hidden;

  color: rgb(174, 76, 81);

  background: linear-gradient(
      180deg,
      rgba(255, 250, 249, 0.16),
      rgba(255, 250, 249, 0.05) 35%,
      rgba(255, 250, 249, 0.12)
    ),
    url("/src/assets/romatic-pink/bg-full.jpg");

  background-size: cover;
  background-position: center top;
  background-repeat: repeat-y;

  box-shadow: 0 0 0 1px rgba(170, 94, 110, 0.1),
    0 20px 65px rgba(116, 55, 70, 0.2);
}

/* Lớp ánh sáng mềm */
.romantic-invitation::before {
  content: "";

  position: absolute;
  inset: 0;

  background: radial-gradient(
      circle at 50% 15%,
      rgba(255, 255, 255, 0.28),
      transparent 38%
    ),
    linear-gradient(
      180deg,
      rgba(255, 250, 249, 0.06),
      transparent 30%,
      rgba(255, 250, 249, 0.08)
    );

  pointer-events: none;
  z-index: 0;
}

/* =========================================================
   KHUNG NỘI DUNG CHÍNH
   ========================================================= */

.romantic-content {
  position: relative;
  z-index: 2;
  margin: auto;
  width: calc(100% - 30px);

  overflow: hidden;

  border: 1px solid rgba(198, 160, 106, 0.38);
  border-radius: 28px;

  /* background: linear-gradient(
    180deg,
    rgba(255, 250, 249, 0.52),
    rgba(255, 248, 248, 0.22)
  ); */

  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45),
    0 8px 28px rgba(142, 75, 91, 0.07);

  /* backdrop-filter: blur(1.5px); */
}

/* =========================================================
   VIỀN VÀNG BÊN TRONG
   ========================================================= */

.romantic-content::after {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(198, 160, 106, 0.34);
  border-radius: 21px;
  pointer-events: none;
  z-index: 20;
}

/* Viền trang trí thứ hai */
.romantic-content::before {
  content: "";
  position: absolute;
  inset: 15px;
  border: 1px solid rgba(197, 111, 136, 0.12);
  border-radius: 17px;

  pointer-events: none;
  z-index: 20;
}

/* =========================================================
   HOA TRANG TRÍ
   ========================================================= */

.content-flower {
  position: absolute;
  width: 100%;
  height: 230px;
  background-repeat: no-repeat;
  background-size: contain;

  pointer-events: none;

  z-index: 1;
}

/* Hoa góc trên trái */
.content-flower--top {
  top: -42px;
  left: -135px;
  background-image: url("/src/assets/romatic-pink/1.webp");
  transform: scaleX(-1) rotate(-8deg);
  opacity: 0.48;
  filter: saturate(0.88);
}

/* Hoa góc dưới phải */
.content-flower--bottom {
  right: -138px;
  bottom: -55px;
  background-image: url("/src/assets/romatic-pink/2.webp");
  transform: rotate(7deg);
  opacity: 0.4;
  filter: saturate(0.9);
}

/* =========================================================
   CÁC SECTION
   ========================================================= */

.romantic-content > section {
  position: relative;
  z-index: 3;
    padding: 18px 26px;
}

/* =========================================================
   HIỆU ỨNG TIÊU ĐỀ SECTION
   Chỉ áp dụng cho heading bên trong theme này
   (tránh đè heading toàn app).
   ========================================================= */

.romantic-pink :deep(h1),
.romantic-pink :deep(h2),
.romantic-pink :deep(h3) {
  position: relative;
  color: var(--pink-deep);
  font-family: "Great Vibes", cursive;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-align: center;
  font-size: 35px;
}

.eyebrow {
  margin: 0;
  color: var(--pink);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-align: center;
}
/* Đường trang trí dưới tiêu đề */
.romantic-content section h2::after,
.romantic-content section h3::after {
  content: "";
  display: block;
  width: 48px;
  height: 1px;
  margin: 10px auto 0;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

/* =========================================================
   CHỮ SCRIPT
   Có thể dùng class này trong component con
   ========================================================= */

.romantic-script {
  font-family: "Great Vibes", cursive;
  color: var(--pink-deep);
  font-weight: 400;
}

/* =========================================================
   HOA / ORNAMENT TRANG TRÍ
   ========================================================= */

.romantic-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--gold);
}

.romantic-ornament::before,
.romantic-ornament::after {
  content: "";
  width: 65px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(198, 160, 106, 0.7));
}

.romantic-ornament::after {
  transform: rotate(180deg);
}

.romantic-ornament span {
  font-size: 15px;
  color: var(--gold);
}

/* =========================================================
   CARD NHỎ BÊN TRONG
   Nếu component con có class card
   ========================================================= */

.romantic-pink .card,
.romantic-pink .wedding-card,
.romantic-pink .event-card {
  border: 1px solid rgba(198, 160, 106, 0.25);
  border-radius: 18px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.72),
    rgba(255, 244, 246, 0.45)
  );

  box-shadow: 0 8px 25px rgba(141, 70, 88, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.45);
}

/* =========================================================
   ẢNH
   ========================================================= */

.romantic-pink img {
  max-width: 100%;
}

.romantic-pink img:not([class*="icon"]) {
  border-radius: 10px;
}

/* =========================================================
   NÚT
   ========================================================= */

.romantic-pink button {
  font-family: "Cormorant Garamond", Georgia, serif;
  border-radius: 999px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.romantic-pink button:hover {
  transform: translateY(-2px);

  box-shadow: 0 7px 18px rgba(154, 72, 93, 0.18);
}

/* =========================================================
   SCROLLBAR
   ========================================================= */

.romantic-pink::-webkit-scrollbar {
  width: 7px;
}

.romantic-pink::-webkit-scrollbar-track {
  background: rgba(249, 232, 236, 0.6);
}

.romantic-pink::-webkit-scrollbar-thumb {
  background: rgba(197, 111, 136, 0.45);
  border-radius: 10px;
}

.romantic-pink::-webkit-scrollbar-thumb:hover {
  background: rgba(169, 77, 98, 0.65);
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 620px) {
  .romantic-invitation {
    width: 100%;
    box-shadow: none;
  }

  .romantic-content {
    width: calc(100% - 14px);
    border-radius: 22px;
  }

  .romantic-content::after {
    inset: 6px;
    border-radius: 17px;
  }

  .romantic-content::before {
    inset: 11px;
    border-radius: 14px;
  }
  .content-flower {
    width: 185px;
    height: 185px;
  }

  .content-flower--top {
    top: -32px;
    left: -105px;
    opacity: 0.38;
  }

  .content-flower--bottom {
    right: -108px;
    bottom: -38px;
    opacity: 0.32;
  }
}

/* =========================================================
   MÀN HÌNH RẤT NHỎ
   ========================================================= */

@media (max-width: 380px) {
  .romantic-content {
    width: calc(100% - 10px);
  }

  .content-flower {
    width: 160px;
    height: 160px;
  }

  .content-flower--top {
    left: -92px;
  }

  .content-flower--bottom {
    right: -92px;
  }
}

/* =========================================================
   DESKTOP
   ========================================================= */

@media (min-width: 621px) {
  .romantic-invitation {
    min-height: 100vh;
    border-left: 1px solid rgba(198, 160, 106, 0.12);
    border-right: 1px solid rgba(198, 160, 106, 0.12);
  }

  .romantic-content {
    margin-top: 28px;
  }
}
</style>

