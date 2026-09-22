<template>
  <header class="shy-hero">
    <!-- =====================================================
         TIA SÁNG ĐỎ
    ====================================================== -->

    <div class="shy-hero__sunburst" aria-hidden="true">
      <svg viewBox="0 0 671 671" preserveAspectRatio="none">
        <circle cx="335.5" cy="335.5" r="335.5" fill="currentColor" />
      </svg>
    </div>

    <!-- =====================================================
         LỜI CHÀO
    ====================================================== -->

    <p class="shy-hero__welcome">WELCOME TO OUR WEDDING</p>

    <!-- =====================================================
         HAI TÊN + CHỮ SONG HỶ
    ====================================================== -->

    <div class="shy-hero__couple">
      <div class="shy-hero__side">
        <p class="shy-hero__role">{{ groomRole }}</p>

        <p class="shy-hero__name">{{ groomName }}</p>
      </div>

      <img class="shy-hero__hy" :src="chuHy" alt="Song hỷ" draggable="false" />

      <div class="shy-hero__side">
        <p class="shy-hero__role">{{ brideRole }}</p>

        <p class="shy-hero__name">{{ brideName }}</p>
      </div>
    </div>

    <!-- =====================================================
         ẢNH VÒM + CHỮ CONG
    ====================================================== -->

    <div class="shy-hero__photo-wrap">
      <div class="shy-hero__photo">
        <div class="shy-hero__arch">
          <img
            v-if="heroImage"
            :src="heroImage"
            :alt="`${groomName} & ${brideName}`"
            loading="lazy"
            decoding="async"
            draggable="false"
          />

          <span v-else class="shy-hero__arch-fallback">{{ monogram }}</span>
        </div>

        <!-- CHỮ CONG "LOVE NEVER FAILS" -->
        <div class="shy-hero__arc" aria-hidden="true">
          <svg viewBox="0 0 286 143" preserveAspectRatio="xMidYMax meet">
            <defs>
              <path
                id="shy-hero-arc"
                d="M -5.32 143 A 148.32 148.32 0 0 1 291.32 143"
                fill="none"
              />
            </defs>

            <text
              fill="currentColor"
              font-size="14"
              font-family="Cormorant Garamond, Times New Roman, serif"
              letter-spacing="0.22em"
              dominant-baseline="central"
            >
              <textPath href="#shy-hero-arc" startOffset="50%" text-anchor="middle">
                LOVE NEVER FAILS
              </textPath>
            </text>

            <image :href="star" x="40.7" y="24.2" width="12" height="12" opacity="0.9" />
            <image :href="star" x="233.3" y="24.2" width="12" height="12" opacity="0.9" />
          </svg>
        </div>
      </div>
    </div>

    <!-- =====================================================
         LỜI MỜI
    ====================================================== -->

    <div class="shy-hero__invite">
      <p class="shy-hero__guest-label">TRÂN TRỌNG KÍNH MỜI</p>

      <p class="shy-hero__guest">{{ guestName }}</p>

      <p class="shy-hero__intro">
        Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
      </p>

      <p v-if="location" class="shy-hero__place">{{ location }}</p>

      <div class="shy-hero__schedule">
        <p v-if="time">VÀO LÚC {{ time }}</p>
        <p v-if="dateText">{{ dateText }}</p>
      </div>

      <p class="shy-hero__message">
        Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
      </p>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

import { chuHy, star } from "./songHyRedAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
);

const groomRole = computed(
  () => props.wedding?.couple?.Groom?.Role || "ÚT NAM"
);

const brideRole = computed(
  () => props.wedding?.couple?.Bride?.Role || "ÚT NỮ"
);

const location = computed(
  () =>
    props.event?.Location ||
    props.event?.Address ||
    props.wedding?.hero?.Location ||
    props.wedding?.events?.[0]?.Location ||
    ""
);

const time = computed(
  () =>
    props.event?.EventTime ||
    props.event?.Time ||
    props.event?.StartTime ||
    props.wedding?.hero?.Time ||
    props.wedding?.events?.[0]?.EventTime ||
    ""
);

const dateText = computed(() => {
  const raw =
    props.event?.EventDate ||
    props.event?.Date ||
    props.wedding?.hero?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    props.wedding?.weddingDate;

  const date = dayjs(raw);

  if (date.isValid()) {
    return `${date.day() === 0 ? "CHỦ NHẬT" : `THỨ ${date.day() + 1}`}, NGÀY ${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "";
});

const heroImage = computed(
  () =>
    props.wedding?.hero?.Image ||
    props.wedding?.hero?.Background ||
    props.wedding?.coverImage ||
    ""
);
</script>

<style scoped>
.shy-hero {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);
  --shy-gold: var(--accent, #fbbf24);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  padding: 0 0 100px;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   TIA SÁNG ĐỎ
========================================================= */

.shy-hero__sunburst {
  position: absolute;
  z-index: -1;

  left: 50%;
  top: 0;

  width: min(671px, 130vw);
  aspect-ratio: 1;

  transform: translate(-50%, -50%);

  color: var(--shy-red);

  pointer-events: none;
}

.shy-hero__sunburst svg {
  display: block;

  width: 100%;
  height: 100%;
}

/* =========================================================
   LỜI CHÀO
========================================================= */

.shy-hero__welcome {
  position: relative;
  z-index: 2;

  margin: 0;

  padding: 40px 16px 0;

  color: var(--shy-cream);

  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: 11px;

  letter-spacing: 0.35em;
  text-indent: 0.35em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   HAI TÊN + CHỮ SONG HỶ
========================================================= */

.shy-hero__couple {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  margin-top: 12px;
  padding: 0 16px;
}

.shy-hero__side {
  flex: 1;

  min-width: 0;

  text-align: center;
}

.shy-hero__role {
  margin: 0 0 4px;

  color: var(--shy-cream);

  font-family: "Avenir Next", "Be Vietnam Pro", sans-serif;
  font-size: 11px;
}

.shy-hero__name {
  margin: 0;

  color: var(--shy-cream);

  font-family: "Big Caslon", Baskerville, "Times New Roman", serif;
  font-size: 18px;

  white-space: nowrap;

  text-transform: uppercase;
}

.shy-hero__hy {
  flex: 0 0 64px;

  width: 64px;
  height: 64px;

  object-fit: contain;
}

/* =========================================================
   ẢNH VÒM + CHỮ CONG
========================================================= */

.shy-hero__photo-wrap {
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: center;

  margin-top: 8px;
  padding: 0 24px;
}

.shy-hero__photo {
  position: relative;

  width: 100%;
  max-width: 286px;

  transform: translateY(50px);
}

.shy-hero__arch {
  position: relative;

  width: 100%;
  aspect-ratio: 286 / 481;

  overflow: hidden;

  border-radius: 50% 50% 0 0 / 40% 40% 0 0;

  background: color-mix(in srgb, var(--shy-red) 12%, transparent);
}

.shy-hero__arch img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.shy-hero__arch-fallback {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 46px;
}

.shy-hero__arc {
  position: absolute;
  z-index: 3;

  left: 0;
  top: 0;

  width: 100%;
  aspect-ratio: 2 / 1;

  color: var(--shy-cream);

  pointer-events: none;
}

.shy-hero__arc svg {
  display: block;

  width: 100%;
  height: 100%;

  overflow: visible;

  transform: translateY(-20px);
}

/* =========================================================
   LỜI MỜI
========================================================= */

.shy-hero__invite {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 74px 10% 0;

  text-align: center;
}

.shy-hero__guest-label {
  margin: 0 0 4px;

  color: var(--shy-red);

  font-size: 11px;

  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

.shy-hero__guest {
  margin: 0 0 14px;

  color: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 26px;
}

.shy-hero__intro {
  margin: 0 0 6px;

  color: var(--shy-ink);

  font-size: 13px;

  line-height: 1.6;
}

.shy-hero__place {
  margin: 0;

  color: var(--shy-red);

  font-size: 15px;
  font-weight: 600;

  line-height: 1.5;
}

.shy-hero__schedule {
  margin-top: 14px;
}

.shy-hero__schedule p {
  margin: 0;

  color: var(--shy-ink);

  font-size: 13px;

  letter-spacing: 0.08em;
}

.shy-hero__message {
  margin: 16px 0 0;

  color: color-mix(in srgb, var(--shy-ink) 80%, transparent);

  font-size: 12px;
  font-style: italic;

  line-height: 1.6;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-hero {
    padding-bottom: 130px;
  }

  .shy-hero__sunburst {
    width: min(872px, 100%);
  }

  .shy-hero__welcome {
    padding-top: 52px;

    font-size: 14px;
  }

  .shy-hero__couple {
    gap: 20px;

    margin-top: 16px;
    padding: 0 40px;
  }

  .shy-hero__role {
    font-size: 14px;
  }

  .shy-hero__name {
    font-size: 22px;
  }

  .shy-hero__hy {
    flex-basis: 83px;

    width: 83px;
    height: 83px;
  }

  .shy-hero__photo {
    max-width: 372px;

    transform: translateY(73px);
  }

  .shy-hero__arc svg {
    transform: translateY(-15px);
  }

  .shy-hero__invite {
    width: min(100%, 600px);

    padding: 96px 5px 0;
  }

  .shy-hero__guest {
    font-size: 32px;
  }

  .shy-hero__intro {
    font-size: 16px;
  }

  .shy-hero__place {
    font-size: 19px;
  }

  .shy-hero__schedule p {
    font-size: 16px;
  }

  .shy-hero__message {
    font-size: 15px;
  }
}
</style>
