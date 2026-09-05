<template>
  <section class="wishes">
    <!-- =========================
         DECORATIVE TOP
    ========================== -->
    <div class="wish-ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <div class="eyebrow">LỜI CHÚC TỪ BẠN</div>

    <h2>Sổ lưu bút</h2>

    <p class="wish-intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================
         WISH FORM
    ========================== -->
    <div class="wish-form-card">
      <div class="form-decoration form-decoration--tl">✦</div>
      <div class="form-decoration form-decoration--tr">✧</div>

      <div class="form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>
      <!-- =========================
     WISH MARQUEE
========================== -->
<div v-if="items.length" class="wish-marquee">
  <div class="marquee-label">
    <v-icon size="13">mdi-heart</v-icon>
    <span>LỜI CHÚC</span>
  </div>

  <div class="marquee-window">
    <div class="wish-track">
      <!-- Bản 1 -->
      <div class="wish-track-content">
        <span
          v-for="(item, index) in items"
          :key="`marquee-a-${item.Id || index}`"
          class="wish-marquee-item"
        >
          <i>♥</i>

          <strong>
            {{ item.Name || item.GuestName || "Khách mời" }}
          </strong>

          <em>“{{ item.Content || item.Message || "Một lời chúc yêu thương" }}”</em>

          <b class="marquee-dot">✦</b>
        </span>
      </div>

      <!-- Bản copy để tạo vòng lặp liền mạch -->
      <div class="wish-track-content" aria-hidden="true">
        <span
          v-for="(item, index) in items"
          :key="`marquee-b-${item.Id || index}`"
          class="wish-marquee-item"
        >
          <i>♥</i>

          <strong>
            {{ item.Name || item.GuestName || "Khách mời" }}
          </strong>

          <em>“{{ item.Content || item.Message || "Một lời chúc yêu thương" }}”</em>

          <b class="marquee-dot">✦</b>
        </span>
      </div>
    </div>
  </div>
</div>
      <form @submit.prevent="add">
        <div class="input-group">
          <label> TÊN CỦA BẠN </label>

          <div class="input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="input-group">
          <label> LỜI CHÚC </label>

          <div class="textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="character-count">{{ message.length }}/500</div>
        </div>

        <button type="submit" class="wish-submit" :disabled="!message">
          <span>GỬI LỜI CHÚC</span>

          <v-icon size="15"> mdi-heart-outline </v-icon>
        </button>
      </form>
    </div>

    <!-- =========================
         EMPTY
    ========================== -->
    <div v-if="items.length === 0" class="no-wishes">
      <div class="empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span> Hãy là người đầu tiên gửi lời yêu thương </span>
    </div>

    <!-- =========================
         WISHES LIST
    ========================== -->
    <div v-else class="wish-list">
      <div class="list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="wish-list" tag="div">
        <article
          v-for="(item, index) in items"
          :key="item.Id || index"
          class="wish-card"
        >
          <!-- flower / heart decoration -->
          <div class="card-flower">❀</div>

          <!-- avatar -->
          <div class="wish-avatar">
            {{ (item.Name || item.GuestName || "K").charAt(0).toUpperCase() }}
          </div>

          <!-- content -->
          <div class="wish-content">
            <div class="wish-header">
              <div>
                <b>
                  {{ item.Name || item.GuestName || "Khách mời" }}
                </b>

                <span v-if="item.CreatedAt">
                  {{ formatTime(item.CreatedAt) }}
                </span>
              </div>

              <v-icon size="13"> mdi-heart-outline </v-icon>
            </div>

            <p>
              {{ item.Content || item.Message }}
            </p>
          </div>
        </article>
      </TransitionGroup>
    </div>

    <!-- =========================
         BOTTOM
    ========================== -->
    <div class="wish-bottom-ornament">
      <span></span>

      <v-icon size="13"> mdi-flower-tulip-outline </v-icon>

      <span></span>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  wishes: {
    type: Array,
    default: () => [],
  },

  wedding: {
    type: Object,
    default: () => ({}),
  },
});

const name = ref("");
const message = ref("");

const added = ref([]);

const items = computed(() => [...added.value, ...props.wishes]);

function formatTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function add() {
  const content = message.value?.trim();

  if (!content) return;

  added.value.unshift({
    Id: `local-${Date.now()}`,

    Name: name.value?.trim() || "Khách mời",

    Content: content,

    CreatedAt: new Date().toISOString(),
  });

  name.value = "";
  message.value = "";
}
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #805363;
  background: linear-gradient(
    145deg,
    rgba(255, 252, 251, 0.56),
    rgba(249, 229, 235, 0.38)
  );

  box-shadow: 0 12px 35px rgba(137, 67, 84, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  overflow: hidden;
}

/* Inner frame */

.wishes::before {
  content: "";

  position: absolute;

  inset: 8px;

  border: 1px solid rgba(198, 160, 106, 0.25);

  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.wish-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-bottom: 11px;

  color: #c6a06a;
}

.wish-ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(198, 160, 106, 0.7));
}

.wish-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.eyebrow {
  position: relative;

  color: #b17486;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
}

.wishes h2 {
  position: relative;

  margin: 5px 0 5px;

  color: #9b4b61;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);

  font-weight: 600;
}

.wish-intro {
  position: relative;

  margin: 0 0 25px;

  color: #956476;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.72),
    rgba(255, 245, 247, 0.55)
  );

  box-shadow: 0 8px 25px rgba(132, 62, 80, 0.07);

  overflow: hidden;
}

/* soft light */

.wish-form-card::before {
  content: "";

  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);
  background: radial-gradient(
    circle,
    rgba(229, 185, 198, 0.25),
    transparent 70%
  );

  pointer-events: none;
}

/* =========================================================
   FORM DECORATION
========================================================= */

.form-decoration {
  position: absolute;

  color: #c6a06a;

  opacity: 0.65;

  font-size: 12px;
}

.form-decoration--tl {
  top: 13px;
  left: 15px;
}

.form-decoration--tr {
  top: 13px;
  right: 15px;
}

/* =========================================================
   FORM TITLE
========================================================= */

.form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-bottom: 18px;

  color: #a15168;

  font-size: 13px;
  font-weight: 600;
}

.form-title .v-icon {
  color: #c6a06a;
}

/* =========================================================
   INPUT
========================================================= */

.input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #b17486;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.input-wrap,
.textarea-wrap {
  display: flex;
  align-items: flex-start;

  gap: 9px;

  padding: 10px 12px;

  background: rgba(255, 255, 255, 0.66);

  transition: border-color 0.25s ease, box-shadow 0.25s ease,
    background 0.25s ease;
}

.input-wrap:focus-within,
.textarea-wrap:focus-within {

  background: rgba(255, 255, 255, 0.9);

  box-shadow: 0 0 0 3px rgba(190, 91, 119, 0.07);
}

.input-wrap .v-icon,
.textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #bd7890;
}

.wishes input,
.wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #754b5b;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.wishes input::placeholder,
.wishes textarea::placeholder {
  color: #bd9aa6;
}

.wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

/* =========================================================
   CHARACTER
========================================================= */

.character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #c29eaa;

  font-size: 8px;
}

/* =========================================================
   SUBMIT
========================================================= */

.wish-submit {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  width: 100%;

  margin-top: 5px;

  padding: 12px 18px;
  color: white;

  background: linear-gradient(135deg, #c36f89, #a64d69);

  box-shadow: 0 7px 16px rgba(157, 66, 94, 0.16);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(157, 66, 94, 0.23);
}

.wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #a08589;
}

.empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #c68ba0;

  background: rgba(255, 255, 255, 0.45);
}

.no-wishes p {
  margin: 0 0 3px;

  color: #9f6577;

  font-size: 14px;
  font-weight: 600;
}

.no-wishes span {
  color: #b4939e;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST HEADING
========================================================= */

.wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.list-heading {
  display: flex;
  align-items: center;

  gap: 10px;

  margin: 0 5px 15px;

  color: #b17486;
}

.list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(198, 160, 106, 0.35));
}

.list-heading > span:last-child {
  transform: rotate(180deg);
}

.list-heading div {
  display: flex;
  align-items: center;

  gap: 5px;

  white-space: nowrap;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.08em;
}

.list-heading .v-icon {
  color: #c56f88;
}

/* =========================================================
   WISH CARD
========================================================= */

.wish-card {
  position: relative;

  display: flex;

  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.72),
    rgba(255, 247, 248, 0.53)
  );

  box-shadow: 0 5px 17px rgba(125, 60, 76, 0.05);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.wish-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 9px 23px rgba(125, 60, 76, 0.09);
}

/* card decoration */

.card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: #d8aebc;

  font-size: 28px;

  opacity: 0.18;

  transform: rotate(-20deg);

  pointer-events: none;
}

/* =========================================================
   AVATAR
========================================================= */

.wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #a44e68;

  background: linear-gradient(145deg, #f9e7ec, #f2d4de);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

/* =========================================================
   CONTENT
========================================================= */

.wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 8px;
}

.wish-header > div {
  display: flex;
  align-items: baseline;

  flex-wrap: wrap;

  gap: 6px;
}

.wish-header b {
  color: #974e65;

  font-size: 13px;
  font-weight: 700;
}

.wish-header span {
  color: #b89ca5;

  font-size: 8px;
}

.wish-header > .v-icon {
  flex: 0 0 auto;

  color: #c98599;

  margin-top: 2px;
}

.wish-content p {
  position: relative;

  margin: 5px 0 0;

  padding-right: 8px;

  color: #805868;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.wish-list-enter-active,
.wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.wish-bottom-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 24px;

  color: #c6a06a;
}

.wish-bottom-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(198, 160, 106, 0.55));
}

.wish-bottom-ornament span:last-child {
  transform: rotate(180deg);
}
/* =========================================================
   WISH MARQUEE
   ========================================================= */

.wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(198, 160, 106, 0.18);
  border-bottom: 1px solid rgba(198, 160, 106, 0.18);

  background:
    linear-gradient(
      90deg,
      rgba(255, 248, 249, 0.8),
      rgba(249, 229, 235, 0.5),
      rgba(255, 248, 249, 0.8)
    );
}


/* Nhãn nhỏ bên trái */

.marquee-label {
  position: absolute;

  z-index: 5;

  left: 0;
  top: 0;
  bottom: 0;

  width: 74px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 1px;

  color: #a44f67;

  background:
    linear-gradient(
      90deg,
      rgba(255, 248, 249, 1) 72%,
      rgba(255, 248, 249, 0)
    );

  pointer-events: none;
}

.marquee-label .v-icon {
  color: #c26b84;
}

.marquee-label span {
  font-size: 6px;
  font-weight: 700;

  letter-spacing: 0.16em;
}


/* Vùng che chuyển động */

.marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(
    90deg,
    transparent 0,
    black 7%,
    black 93%,
    transparent 100%
  );

  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0,
    black 7%,
    black 93%,
    transparent 100%
  );
}


/* Track chạy */

.wish-track {
  display: flex;

  width: max-content;

  animation: wishMarquee 32s linear infinite;

  will-change: transform;
}


/*
 * Hai bản nội dung phải có kích thước
 * tương đương nhau để loop không bị giật.
 */

.wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}


/* Từng lời chúc */

.wish-marquee-item {
  display: inline-flex;
  align-items: center;

  gap: 7px;

  padding-right: 30px;

  color: #825363;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}


/* Tim */

.wish-marquee-item i {
  color: #c36c84;

  font-size: 9px;

  font-style: normal;

  animation: marqueeHeart 1.8s ease-in-out infinite;
}


/* Tên người gửi */

.wish-marquee-item strong {
  color: #9b4b61;

  font-weight: 700;
}


/* Nội dung lời chúc */

.wish-marquee-item em {
  color: #8b6470;

  font-style: italic;

  font-size: 11px;
}


/* Ngôi sao phân cách */

.marquee-dot {
  color: #c6a06a;

  font-size: 7px;

  font-weight: 400;
}


/* =========================================================
   MARQUEE ANIMATION
   ========================================================= */

@keyframes wishMarquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}


/* Tim nhẹ nhàng */

@keyframes marqueeHeart {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.65;
  }

  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}


/* =========================================================
   HOVER / TOUCH
   ========================================================= */

.wish-marquee:hover .wish-track {
  animation-play-state: paused;
}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 620px) {
  .wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .marquee-label {
    width: 62px;
  }

  .marquee-window {
    padding-left: 61px;
  }

  .wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .wish-marquee-item em {
    font-size: 10px;
  }

  .marquee-label span {
    font-size: 5px;
  }
}


/* =========================================================
   REDUCE MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  .wish-track {
    animation: none;
  }

  .wish-marquee-item i {
    animation: none;
  }
}
/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .wishes::before {
    inset: 6px;

    border-radius: 18px;
  }

  .wish-intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .wish-form-card {
    padding: 21px 14px 18px;
  }

  .wish-card {
    padding: 12px;
  }

  .wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .wish-header b {
    font-size: 12px;
  }

  .wish-content p {
    font-size: 11px;
  }
}

/* =========================================================
   SMALL PHONE
========================================================= */

@media (max-width: 380px) {
  .wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .wish-card,
  .wish-submit,
  .wish-list-enter-active,
  .wish-list-leave-active {
    transition: none;
  }
}
</style>

