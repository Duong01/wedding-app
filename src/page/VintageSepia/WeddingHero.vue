<template>
  <section class="vs-hero">
    <div class="vs-hero__grain"></div>

    <!-- Paper panel frame -->
    <div class="vs-hero__frame">
      <div class="vs-hero__content">
        <p class="vs-hero__save-date">SAVE THE DATE</p>

        <!-- Photo in a perforated postage stamp frame -->
        <div class="vs-hero__stamp">
          <span class="vs-hero__tape vs-hero__tape--tl" aria-hidden="true"></span>
          <span class="vs-hero__tape vs-hero__tape--tr" aria-hidden="true"></span>

          <img v-if="heroImage" :src="heroImage" alt="Ảnh cưới" draggable="false" />

          <span v-else class="vs-hero__stamp-fallback">{{ monogram }}</span>

          <span class="vs-mount vs-mount--bl" aria-hidden="true"></span>
          <span class="vs-mount vs-mount--br" aria-hidden="true"></span>
        </div>

        <!-- Date stamp badge -->
        <p class="vs-hero__est">EST. {{ estYear }}</p>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="vs-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

        <p class="vs-hero__guest">{{ guestName }}</p>

        <p class="vs-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="vs-hero__place">{{ location }}</p>

        <div class="vs-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="vs-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="vs-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Drifting paper specks -->
    <div class="vs-specks" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="vs-speck" :class="`vs-speck--${n}`"></span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

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
    "Nguyễn Huy"
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Nguyễn Mai"
);

const location = computed(
  () =>
    props.event?.Location ||
    props.event?.Address ||
    props.wedding?.hero?.Location ||
    "Địa điểm tổ chức tiệc cưới"
);

const time = computed(
  () =>
    props.event?.EventTime ||
    props.event?.Time ||
    props.event?.StartTime ||
    props.wedding?.hero?.Time ||
    "16:00"
);

const dateText = computed(() => {
  const raw =
    props.event?.EventDate ||
    props.event?.Date ||
    props.wedding?.hero?.weddingDate ||
    props.wedding?.weddingDate;

  const date = dayjs(raw);

  if (date.isValid()) {
    return `${date.day() === 0 ? "CHỦ NHẬT" : `THỨ ${date.day() + 1}`}, NGÀY ${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "NGÀY VUI CỦA CHÚNG MÌNH";
});

const heroImage = computed(
  () => props.wedding?.hero?.Image || props.wedding?.coverImage || ""
);

const estYear = computed(() => {
  const raw =
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.weddingDate;

  const date = dayjs(raw);

  return date.isValid() ? date.format("YYYY") : "2026";
});
</script>

<style scoped>
.vs-hero {
  --vs-ink: #3d2f24;
  --vs-brown: #6b4f3a;
  --vs-faded: #97745a;
  --vs-gold: #c2a878;
  --vs-parchment: #ead9bd;
  --vs-paper: #fbf5e6;
  --vs-bg: #f6efe2;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 26px 14px;

  min-height: 690px;

  background: var(--vs-bg);
}

.vs-hero__grain {
  position: absolute;
  inset: 0;
  z-index: 0;

  opacity: 0.5;

  background-image:
    radial-gradient(rgba(107, 79, 58, 0.13) 0.6px, transparent 0.7px),
    radial-gradient(rgba(61, 47, 36, 0.07) 0.5px, transparent 0.6px);

  background-size: 5px 5px, 9px 9px;
  background-position: 0 0, 3px 4px;

  pointer-events: none;
}

/* =========================================================
   FRAME
========================================================= */

.vs-hero__frame {
  position: relative;
  z-index: 1;

  min-height: 640px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(107, 79, 58, 0.45);
  border-radius: 14px;

  background: var(--vs-bg);

  box-shadow: 0 20px 48px rgba(61, 47, 36, 0.12);
}

.vs-hero__frame::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px dashed rgba(107, 79, 58, 0.3);
  border-radius: 9px;

  pointer-events: none;
}

/* =========================================================
   CONTENT
========================================================= */

.vs-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 460px);

  padding: 46px 26px 42px;

  text-align: center;

  animation: vs-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.vs-hero__save-date {
  margin: 0 0 20px;

  color: var(--vs-faded);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.32em;
  text-indent: 0.32em;
}

/* =========================================================
   STAMP PHOTO FRAME
========================================================= */

.vs-hero__stamp {
  --vs-hole: 4px;
  --vs-gap: 13px;

  position: relative;

  width: min(100%, 320px);

  margin: 0 auto;

  padding: 12px;

  background-color: #fffdf6;

  background-image:
    radial-gradient(circle at 50% 50%, var(--vs-bg) var(--vs-hole), transparent calc(var(--vs-hole) + 0.5px)),
    radial-gradient(circle at 50% 50%, var(--vs-bg) var(--vs-hole), transparent calc(var(--vs-hole) + 0.5px)),
    radial-gradient(circle at 50% 50%, var(--vs-bg) var(--vs-hole), transparent calc(var(--vs-hole) + 0.5px)),
    radial-gradient(circle at 50% 50%, var(--vs-bg) var(--vs-hole), transparent calc(var(--vs-hole) + 0.5px));

  background-size:
    var(--vs-gap) calc(var(--vs-hole) * 2),
    var(--vs-gap) calc(var(--vs-hole) * 2),
    calc(var(--vs-hole) * 2) var(--vs-gap),
    calc(var(--vs-hole) * 2) var(--vs-gap);

  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-position: 0 0, 0 100%, 0 0, 100% 0;

  box-shadow: 0 14px 30px rgba(61, 47, 36, 0.18);

  transform: rotate(-1.5deg);
}

.vs-hero__stamp img {
  display: block;

  width: 100%;

  aspect-ratio: 4 / 3;

  object-fit: cover;

  filter: sepia(0.22) saturate(0.9);

  transition: filter 0.4s ease;
}

.vs-hero__stamp:hover img {
  filter: none;
}

.vs-hero__stamp-fallback {
  display: flex;
  align-items: center;
  justify-content: center;

  aspect-ratio: 4 / 3;

  background:
    radial-gradient(circle at 30% 25%, rgba(194, 168, 120, 0.25), transparent 55%),
    #f1e6cf;

  color: var(--vs-faded);

  font-family: "Allura", cursive;

  font-size: 54px;
}

/* Tape strips across photo corners */
.vs-hero__tape {
  position: absolute;
  z-index: 3;

  width: 92px;
  height: 24px;

  background: rgba(194, 168, 120, 0.35);

  box-shadow: 0 1px 3px rgba(61, 47, 36, 0.12);

  pointer-events: none;
}

.vs-hero__tape--tl {
  top: -8px;
  left: -30px;

  transform: rotate(-45deg);
}

.vs-hero__tape--tr {
  top: -8px;
  right: -30px;

  transform: rotate(45deg);
}

/* Corner photo mounts */
.vs-mount {
  position: absolute;
  z-index: 3;

  width: 0;
  height: 0;

  border-style: solid;

  pointer-events: none;
}

.vs-mount--bl {
  bottom: 0;
  left: 0;

  border-width: 0 0 16px 16px;
  border-color: transparent transparent rgba(107, 79, 58, 0.55) transparent;
}

.vs-mount--br {
  bottom: 0;
  right: 0;

  border-width: 0 16px 16px 0;
  border-color: transparent rgba(107, 79, 58, 0.55) transparent transparent;
}

/* =========================================================
   DATE STAMP BADGE
========================================================= */

.vs-hero__est {
  display: inline-block;

  margin: 22px auto 0;

  padding: 6px 16px;

  border: 1.5px solid rgba(107, 79, 58, 0.55);
  border-radius: 8px;

  background: rgba(255, 253, 246, 0.65);

  color: var(--vs-brown);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;
  text-indent: 0.24em;

  transform: rotate(-2deg);
}

/* =========================================================
   NAMES & TEXTS
========================================================= */

.vs-hero h1 {
  margin: 18px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--vs-ink);
}

.vs-hero h1 i {
  padding: 0 6px;

  color: var(--vs-faded);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.vs-hero__announce {
  margin: 26px 0 8px;

  color: var(--vs-faded);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.vs-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--vs-brown);
}

.vs-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(74, 58, 44, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.vs-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--vs-ink);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.vs-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px dashed rgba(107, 79, 58, 0.45);
  border-bottom: 1px dashed rgba(107, 79, 58, 0.45);
}

.vs-hero__schedule p {
  margin: 4px 0;

  color: var(--vs-brown);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.5;
}

.vs-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(74, 58, 44, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.vs-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--vs-faded);
}

.vs-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.6));
}

.vs-hero__footer span:last-child {
  transform: scaleX(-1);
}

.vs-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   SPECKS
========================================================= */

.vs-specks {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.vs-speck {
  position: absolute;
  top: -20px;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background: rgba(151, 116, 90, 0.4);

  animation: vs-speck-fall linear infinite;
}

.vs-speck--1 { left: 8%; animation-duration: 13s; animation-delay: 0s; }
.vs-speck--2 { left: 22%; animation-duration: 16s; animation-delay: 3s; width: 3px; height: 3px; }
.vs-speck--3 { left: 36%; animation-duration: 14s; animation-delay: 1.5s; }
.vs-speck--4 { left: 50%; animation-duration: 17s; animation-delay: 5s; width: 3px; height: 3px; }
.vs-speck--5 { left: 63%; animation-duration: 13.5s; animation-delay: 2s; }
.vs-speck--6 { left: 76%; animation-duration: 15.5s; animation-delay: 4.2s; width: 3px; height: 3px; }
.vs-speck--7 { left: 87%; animation-duration: 14.5s; animation-delay: 0.8s; }
.vs-speck--8 { left: 95%; animation-duration: 16.5s; animation-delay: 6s; width: 3px; height: 3px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes vs-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes vs-speck-fall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }

  10% {
    opacity: 0.8;
  }

  90% {
    opacity: 0.5;
  }

  100% {
    transform: translateY(720px) translateX(14px);
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .vs-hero__content {
    padding: 38px 18px 34px;
  }

  .vs-hero__frame {
    min-height: 620px;
  }

  .vs-hero h1 {
    font-size: 42px;
  }

  .vs-hero__guest {
    font-size: 26px;
  }

  .vs-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .vs-hero__content,
  .vs-speck {
    animation: none;
  }
}
</style>
