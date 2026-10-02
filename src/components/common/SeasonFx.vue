<template>
  <!--
    Lớp hiệu ứng mùa phủ TOÀN BỘ thiệp (cả màn hình bìa lẫn
    nội dung) — hoa rơi / nắng / lá rơi / tuyết tùy mùa của
    ngày cưới. pointer-events: none nên không chặn bấm nút.
  -->
  <div
    v-if="season"
    class="season-fx"
    :class="`season-fx--${season}`"
    aria-hidden="true"
  >
    <!--
      Mỗi hạt là 1 <i> — số lượng theo mùa (nắng ít + to,
      tuyết nhiều + nhỏ). Vị trí/delay/size ngẫu nhiên sinh
      1 lần khi mount, CSS keyframes lo phần rơi.
    -->
    <i
      v-for="flake in flakes"
      :key="flake.id"
      class="season-fx__flake"
      :class="`season-fx__flake--${flake.variant}`"
      :style="flake.style"
    ></i>

    <!-- Ánh nắng mùa hè: vệt sáng chéo trôi ngang -->
    <span
      v-if="season === 'summer'"
      class="season-fx__sunbeam"
    ></span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
});

const SEASONS = ["spring", "summer", "autumn", "winter"];

/* =========================================================
   MÙA THEO NGÀY CƯỚI
========================================================= */

/*
 * Việt Nam chia 4 mùa theo tháng dương lịch (phía Bắc):
 *   xuân 2–4, hè 5–7, thu 8–10, đông 11–1.
 * Miền Nam chỉ nắng/mưa nhưng giữ 4 mùa cho hiệu ứng đẹp —
 * chủ thiệp muốn tắt thì settings.ShowSeasonFx = false.
 */
const SEASON_BY_MONTH = {
  2: "spring",
  3: "spring",
  4: "spring",
  5: "summer",
  6: "summer",
  7: "summer",
  8: "autumn",
  9: "autumn",
  10: "autumn",
  11: "winter",
  12: "winter",
  1: "winter",
};

const season = computed(() => {
  const settings = props.wedding?.settings || {};

  if (settings.ShowSeasonFx === false) {
    return null;
  }

  /* Chủ thiệp chọn tay mùa khác ngày cưới (editor ghi
   * settings.SeasonOverride: "spring" | "summer" | ...). */
  const override = settings.SeasonOverride;

  if (SEASONS.includes(override)) {
    return override;
  }

  const raw =
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.WeddingDate ||
    props.wedding?.countdown?.Target ||
    "";

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return SEASON_BY_MONTH[date.getMonth() + 1] || null;
});

/* =========================================================
   HẠT HIỆU ỨNG
========================================================= */

/*
 * Số hạt mỗi mùa — đủ thưa để nhẹ nhàng, không nặng máy:
 * nắng chỉ 8 vệt + sunbeam, tuyết 18 hạt nhỏ rơi chậm.
 */
const COUNTS = {
  spring: 15,
  summer: 8,
  autumn: 15,
  winter: 18,
};

/*
 * Sinh hạt: vị trí ngang, delay, thời gian rơi, kích thước
 * ngẫu nhiên — mỗi lần mở thiệp một "trời" hơi khác nhau.
 * Rơi chậm (13–22s một vòng) cho cảm giác lơ lửng nhẹ nhàng.
 */
const flakes = computed(() => {
  if (!season.value) {
    return [];
  }

  const count = COUNTS[season.value] || 0;

  const list = [];

  for (let i = 0; i < count; i += 1) {
    list.push({
      id: i,
      variant: i % 3,
      style: {
        left: `${(Math.random() * 96 + 2).toFixed(2)}%`,
        animationDelay: `${(-Math.random() * 22).toFixed(2)}s`,
        animationDuration: `${(13 + Math.random() * 9).toFixed(2)}s`,
        transform: `scale(${(0.6 + Math.random() * 0.9).toFixed(2)})`,
      },
    });
  }

  return list;
});
</script>

<style scoped>
/* =========================================================
   LỚP PHỦ
========================================================= */

/*
 * z-index 999: ngang màn hình bìa fixed (tr-cover 999) nhưng
 * nằm SAU trong DOM nên đè lên bìa; mọi modal (99999+) và
 * nút nhạc (99999) vẫn nằm trên hiệu ứng.
 */
.season-fx {
  position: fixed;

  inset: 0;

  z-index: 999;

  overflow: hidden;

  pointer-events: none;
}

/* =========================================================
   HẠT CHUNG — rơi + lắc
========================================================= */

.season-fx__flake {
  position: absolute;

  top: -6vh;

  display: block;

  /* Viền mềm như nhìn qua sương — hạt không còn nét cứng */
  filter: blur(0.4px);

  will-change: transform;

  animation-name: season-fx-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/*
 * Độ mờ đỉnh chỉ ~0.6 — hiệu ứng như lơ lửng mờ ảo phía sau,
 * không còn "dán" lên trên thiệp.
 */
@keyframes season-fx-fall {
  0% {
    transform: translate3d(0, -8vh, 0) rotate(0deg);

    opacity: 0;
  }

  12% {
    opacity: 0.6;
  }

  85% {
    opacity: 0.45;
  }

  100% {
    transform: translate3d(var(--drift, 3vw), 108vh, 0)
      rotate(180deg);

    opacity: 0;
  }
}

/* =========================================================
   MÙA XUÂN — CÁNH HOA RƠI
========================================================= */

.season-fx--spring .season-fx__flake {
  --drift: 4vw;

  width: 11px;
  height: 11px;

  border-radius: 60% 40% 55% 45% / 55% 50% 50% 45%;

  /* Hồng phấn nhạt — như cánh hoa cũ mờ trong sương */
  background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.75),
      transparent 55%
    ),
    linear-gradient(135deg, rgba(247, 182, 200, 0.75), rgba(232, 144, 168, 0.6) 60%, rgba(212, 120, 154, 0.55));

  box-shadow: 0 1px 3px rgba(212, 120, 154, 0.18);
}

/* Cánh hoa thứ hai nhỏ hơn, hồng nhạt */
.season-fx--spring .season-fx__flake--1 {
  width: 8px;
  height: 8px;

  background: linear-gradient(135deg, rgba(251, 211, 222, 0.7), rgba(240, 169, 192, 0.55));
}

/* Cánh hoa thứ ba trắng phấn — điểm xuyết */
.season-fx--spring .season-fx__flake--2 {
  width: 9px;
  height: 9px;

  background: linear-gradient(135deg, rgba(255, 240, 244, 0.65), rgba(247, 201, 216, 0.5));
}

/* =========================================================
   MÙA HÈ — HẠNG NẮNG LẤP LÁNH
========================================================= */

.season-fx--summer .season-fx__flake {
  --drift: -2vw;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  /* Đốm nắng mờ — chỉ lấp lánh thoáng qua */
  background: radial-gradient(
    circle,
    rgba(255, 246, 200, 0.7),
    rgba(255, 214, 120, 0.35) 55%,
    transparent 75%
  );

  box-shadow: 0 0 8px rgba(255, 224, 150, 0.45);

  animation-name: season-fx-fall, season-fx-twinkle;
  animation-duration: 16s, 3.4s;
  animation-timing-function: linear, ease-in-out;
}

@keyframes season-fx-twinkle {
  0%,
  100% {
    filter: blur(0.4px) brightness(1);
  }

  50% {
    filter: blur(0.4px) brightness(1.4);
  }
}

/* Vệt nắng chéo trôi ngang màn hình */
.season-fx__sunbeam {
  position: absolute;

  top: -20%;

  left: -30%;

  width: 55%;

  height: 150%;

  background: linear-gradient(
    100deg,
    transparent,
    rgba(255, 236, 180, 0.08) 45%,
    rgba(255, 240, 200, 0.12) 50%,
    rgba(255, 236, 180, 0.08) 55%,
    transparent
  );

  transform: rotate(18deg);

  animation: season-fx-sunbeam 18s ease-in-out infinite;
}

@keyframes season-fx-sunbeam {
  0%,
  100% {
    transform: translateX(-12%) rotate(18deg);

    opacity: 0.3;
  }

  50% {
    transform: translateX(160%) rotate(18deg);

    opacity: 0.6;
  }
}

/* =========================================================
   MÙA THU — LÁ RƠI
========================================================= */

.season-fx--autumn .season-fx__flake {
  --drift: -5vw;

  width: 13px;
  height: 13px;

  border-radius: 0 70% 0 70%;

  /* Cam đất nhạt — lá khô mờ trong chiều thu */
  background: linear-gradient(135deg, rgba(232, 163, 78, 0.7), rgba(212, 118, 58, 0.55) 60%, rgba(184, 92, 46, 0.5));

  box-shadow: inset 0 0 2px rgba(120, 60, 20, 0.2);
}

/* Lá cam đậm */
.season-fx--autumn .season-fx__flake--1 {
  width: 10px;
  height: 10px;

  border-radius: 70% 0 70% 0;

  background: linear-gradient(135deg, rgba(217, 138, 61, 0.65), rgba(184, 84, 42, 0.5));
}

/* Lá vàng khô */
.season-fx--autumn .season-fx__flake--2 {
  width: 15px;
  height: 15px;

  background: linear-gradient(135deg, rgba(232, 191, 106, 0.6), rgba(207, 154, 62, 0.45));
}

/* =========================================================
   MÙA ĐÔNG — TUYẾT RƠI
========================================================= */

.season-fx--winter .season-fx__flake {
  --drift: 2vw;

  width: 6px;
  height: 6px;

  border-radius: 50%;

  /* Tuyết mờ như bông sương — trắng trong, không còn hạt cứng */
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 255, 255, 0.75),
    rgba(240, 246, 255, 0.5) 60%,
    rgba(214, 226, 246, 0.3)
  );

  box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
}

/* Bông tuyết to hơn */
.season-fx--winter .season-fx__flake--1 {
  width: 9px;
  height: 9px;
}

/* Bông tuyết nhỏ li ti */
.season-fx--winter .season-fx__flake--2 {
  width: 4px;
  height: 4px;

  box-shadow: 0 0 3px rgba(255, 255, 255, 0.35);
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .season-fx__flake,
  .season-fx__sunbeam {
    animation: none;
  }

  .season-fx {
    display: none;
  }
}
</style>
