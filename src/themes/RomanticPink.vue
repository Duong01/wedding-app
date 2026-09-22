<template>
  <div class="romantic-pink" :data-theme="theme.Name" :style="themeStyle">
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

        <section v-if="showStory && wedding?.story" class="romantic-section">
          <WeddingStory :story="wedding.story" />
        </section>

        <section v-if="showGallery && gallery.length" class="romantic-section">
          <WeddingGallery :gallery="gallery" />
        </section>

        <section v-if="showEvents && events.length" class="romantic-section">
          <WeddingEvents
            :events="events"
            :recipient-name="wedding?.recipientName"
          />
        </section>

        <section v-if="showCountdown" class="romantic-section">
          <WeddingCountdown
            :countdown="countdownTarget"
            :wedding-date="wedding?.weddingDate"
          />
        </section>

        <section v-if="showMap && events.length" class="romantic-section">
          <WeddingMap :events="events" />
        </section>

        <section v-if="showDressCode" class="romantic-section">
          <DressCode :dress-code="wedding?.dressCode" />
        </section>

        <section
          v-if="showTimeline && timeline.length"
          class="romantic-section"
        >
          <Timeline :timeline="timeline" :events="events" />
        </section>
      </div>

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
        :music="heroMusic"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import { useWeddingTheme } from "@/composables/useWeddingTheme";
import OpeningScreen from "@/page/RomanticPink/OpeningScreen.vue";
import WeddingHero from "@/page/RomanticPink/WeddingHero.vue";
import WeddingCouple from "@/page/RomanticPink/WeddingCouple.vue";
import WeddingStory from "@/page/RomanticPink/WeddingStory.vue";
import WeddingEvents from "@/page/RomanticPink/WeddingEvents.vue";
import WeddingCountdown from "@/page/RomanticPink/WeddingCountdown.vue";
import WeddingGallery from "@/page/RomanticPink/WeddingGallery.vue";
import WeddingMap from "@/page/RomanticPink/WeddingMap.vue";
import DressCode from "@/page/RomanticPink/DressCode.vue";
import Timeline from "@/page/RomanticPink/Timeline.vue";
import WeddingGifts from "@/page/RomanticPink/WeddingGifts.vue";
import WeddingWishes from "@/page/RomanticPink/WeddingWishes.vue";
import WeddingFooter from "@/page/RomanticPink/WeddingFooter.vue";

const props = defineProps({ wedding: { type: Object, required: true } });
const wedding = computed(() => props.wedding || {});

/*
 * Bảng màu / font lấy từ theme của thiệp (xem useWeddingTheme),
 * fallback về tông "kính mờ vườn hồng" khi dữ liệu chưa có.
 */
const { theme, themeStyle } = useWeddingTheme(props.wedding);

/*
 * Ưu tiên nhạc từ wedding.music (panel Nhạc).
 * Nếu trống mà hero.Music có giá trị thì dùng hero.Music.
 */
const heroMusic = computed(() => {
  const music = wedding.value?.music || {};
  const heroUrl = wedding.value?.hero?.Music;

  if (music.Url || !heroUrl) {
    return music;
  }

  return { ...music, Url: heroUrl };
});

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
const showDressCode = computed(() => settings.value.ShowDressCode !== false);
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
  formatDate(
    wedding.value?.hero?.WeddingDate ||
      wedding.value?.hero?.weddingDate ||
      wedding.value?.weddingDate
  )
);
async function handleOpen() {
  opened.value = true;
  await nextTick();
  floatingMusicRef.value?.play?.();
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Viaoda+Libre&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Alex+Brush&family=Ms+Madi&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap");

/* =========================================================
   TOKENS — KÍNH MỜ VƯỜN HỒNG
   Các biến này kế thừa xuống mọi component con.
   ========================================================= */

.romantic-pink {
  /*
   * Bảng màu lấy từ theme.Colors của thiệp (xem useWeddingTheme),
   * fallback về tông "kính mờ vườn hồng" khi dữ liệu chưa có.
   */
  --gg-rose: var(--primary, #cb5d6c);
  --gg-deep: var(--secondary, #933845);
  --gg-white: var(--white, #ffffff);
  --gg-blush: var(--background-secondary, #f6dfe2);
  --gg-mist: rgba(255, 255, 255, 0.16);
  --gg-mist-rose: rgba(239, 192, 189, 0.1);
  --gg-line: rgba(255, 255, 255, 0.35);
  --gg-hairline: rgba(203, 93, 108, 0.35);

  --gg-glass: inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.45),
    inset -1.5px -1.5px 3px rgba(180, 120, 130, 0.12),
    0 18px 50px -6px rgba(147, 56, 69, 0.3),
    0 6px 20px 2px rgba(147, 56, 69, 0.14);

  --gg-font-body: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  --gg-font-display: "Viaoda Libre", "EB Garamond", cursive;
  --gg-font-script: "Alex Brush", "The Nautigal", cursive;
  --gg-font-hand: "Ms Madi", cursive;
  --gg-font-head: "Times New Roman", Times, serif;

  min-height: 100vh;
  width: 100%;

  color: var(--gg-deep);
  font-family: var(--gg-font-body);
  font-variant-numeric: lining-nums;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  background-color: var(--background, #fdf3f4);
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.72),
      rgba(255, 255, 255, 0.72)
    ),
    url("@/assets/glass-garden-pink/floral-background.webp");
  background-repeat: repeat;
  background-size: 180% auto;
  background-position: top left;

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

  width: min(480px, 100%);
  min-height: 100vh;

  margin: 0 auto;
  overflow: hidden;

  color: var(--gg-deep);

  background-color: var(--gg-white);
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.6)
    ),
    url("@/assets/glass-garden-pink/floral-background.webp");
  background-repeat: repeat;
  background-size: 180% auto;
  background-position: top left;

  box-shadow: 0 0 0 1px rgba(203, 93, 108, 0.08),
    0 24px 70px rgba(147, 56, 69, 0.18);
}

/* Lớp ánh sáng mềm phía trên */
.romantic-invitation::before {
  content: "";

  position: absolute;
  inset: 0;

  background: radial-gradient(
      circle at 50% 8%,
      rgba(255, 255, 255, 0.5),
      transparent 42%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.18),
      transparent 26%,
      rgba(255, 255, 255, 0.14)
    );

  pointer-events: none;
  z-index: 0;
}

/* =========================================================
   KHUNG NỘI DUNG CHÍNH — TẤM KÍNH LỚN
   ========================================================= */

.romantic-content {
  position: relative;
  z-index: 2;

  margin: 0 auto;
  width: 100%;

  overflow: hidden;

  background-color: var(--gg-mist-rose);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  border-top: 1px solid var(--gg-line);
  border-bottom: 1px solid var(--gg-line);
  border-radius: 30px 30px 0 0;

  box-shadow: var(--gg-glass);
}

/* =========================================================
   HOA TRANG TRÍ
   ========================================================= */

.content-flower {
  position: absolute;
  background-repeat: no-repeat;
  background-size: contain;

  pointer-events: none;

  z-index: 1;
}

/* Hoa góc trên trái */
.content-flower--top {
  top: -30px;
  left: -70px;

  width: 200px;
  height: 200px;

  background-image: url("@/assets/glass-garden-pink/flower1-decoration.webp");
  transform: rotate(-12deg);
  opacity: 0.55;
}

/* Hoa góc dưới phải */
.content-flower--bottom {
  right: -80px;
  bottom: -40px;

  width: 220px;
  height: 220px;

  background-image: url("@/assets/glass-garden-pink/flower4-decoration.webp");
  transform: rotate(10deg);
  opacity: 0.5;
}

/* =========================================================
   CÁC SECTION
   ========================================================= */

.romantic-section {
  position: relative;
  z-index: 3;
  padding: 26px 22px;
}

/* =========================================================
   TIÊU ĐỀ SECTION — DÙNG CHUNG
   ========================================================= */

.romantic-pink :deep(.gg-title) {
  margin: 0;
  color: var(--gg-rose);
  font-family: var(--gg-font-head);
  font-weight: 700;
  font-size: 20px;
  line-height: 1.25;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-align: center;
}

.romantic-pink :deep(.gg-eyebrow) {
  margin: 0;
  color: var(--gg-deep);
  font-family: var(--gg-font-body);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  text-align: center;
  opacity: 0.75;
}

.romantic-pink :deep(.gg-lead) {
  margin: 10px auto 0;
  max-width: 340px;
  color: var(--gg-deep);
  font-family: var(--gg-font-body);
  font-size: 13px;
  line-height: 1.7;
  text-align: center;
  opacity: 0.85;
}

/* Thẻ kính dùng lại được ở component con */
.romantic-pink :deep(.gg-glass) {
  background-color: var(--gg-mist);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);
  border: 1px solid var(--gg-line);
  border-radius: 20px;
  box-shadow: var(--gg-glass);
}

/* =========================================================
   ẢNH
   ========================================================= */

.romantic-pink img {
  max-width: 100%;
}

/* =========================================================
   NÚT
   ========================================================= */

.romantic-pink button {
  font-family: var(--gg-font-body);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.romantic-pink button:hover {
  transform: translateY(-2px);
}

/* =========================================================
   SCROLLBAR
   ========================================================= */

.romantic-pink::-webkit-scrollbar {
  width: 7px;
}

.romantic-pink::-webkit-scrollbar-track {
  background: rgba(246, 223, 226, 0.6);
}

.romantic-pink::-webkit-scrollbar-thumb {
  background: rgba(203, 93, 108, 0.4);
  border-radius: 10px;
}

.romantic-pink::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 56, 69, 0.6);
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 480px) {
  .romantic-invitation {
    width: 100%;
    box-shadow: none;
  }

  .romantic-content {
    border-radius: 24px 24px 0 0;
  }

  .content-flower--top {
    left: -80px;
    width: 170px;
    height: 170px;
    opacity: 0.45;
  }

  .content-flower--bottom {
    right: -90px;
    width: 180px;
    height: 180px;
    opacity: 0.4;
  }

  .romantic-section {
    padding: 22px 16px;
  }
}

/* =========================================================
   DESKTOP
   ========================================================= */

@media (min-width: 900px) {
  .romantic-invitation {
    width: min(900px, 100%);
  }

  .romantic-pink :deep(.gg-title) {
    font-size: 26px;
  }

  .romantic-section {
    padding: 34px 40px;
  }
}
</style>
