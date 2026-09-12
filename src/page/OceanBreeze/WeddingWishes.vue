<template>
  <section class="ob-wishes">
    <div class="ob-wishes__ornament">
      <span></span>
      <i>〜</i>
      <span class="ob-wishes__ornament-flip"></span>
    </div>

    <p class="ob-eyebrow">LỜI CHÚC TỪ BẠN</p>

    <h2>Sổ lưu bút</h2>

    <p class="ob-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="ob-wish-form-card">
      <div class="ob-form-decoration ob-form-decoration--tl">〜</div>
      <div class="ob-form-decoration ob-form-decoration--tr">❊</div>

      <div class="ob-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="ob-wish-marquee">
        <div class="ob-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="ob-marquee-window">
          <div class="ob-wish-track">
            <div class="ob-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="ob-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="ob-marquee-dot">❊</b>
              </span>
            </div>

            <div class="ob-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="ob-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="ob-marquee-dot">❊</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="ob-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="ob-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="ob-input-group">
          <label>LỜI CHÚC</label>

          <div class="ob-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="ob-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="ob-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="ob-no-wishes">
      <div class="ob-empty-shell">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="ob-wish-list">
      <div class="ob-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span class="ob-list-heading-flip"></span>
      </div>

      <TransitionGroup name="ob-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="ob-wish-card">
          <div class="ob-card-wave">〜</div>

          <div class="ob-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="ob-wish-content">
            <div class="ob-wish-header">
              <div>
                <b>{{ getName(item) }}</b>

                <span v-if="item.CreatedAt">
                  {{ formatTime(item.CreatedAt) }}
                </span>
              </div>

              <v-icon size="13">mdi-heart-outline</v-icon>
            </div>

            <p>{{ getMessage(item) }}</p>
          </div>
        </article>
      </TransitionGroup>
    </div>

    <!-- =========================================
         BOTTOM
    ========================================== -->
    <div class="ob-wishes__bottom">
      <span></span>

      <v-icon size="13">mdi-flower-tulip-outline</v-icon>

      <span class="ob-wishes__bottom-flip"></span>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { addWish, getAllWishes } from "@/model/api";

const props = defineProps({
  wishes: { type: Array, default: () => [] },
  wedding: { type: Object, default: () => ({}) },
});

const route = useRoute();

const form = reactive({
  name: "",
  message: "",
});

const submitting = ref(false);

const localWishes = ref([]);

const items = computed(() => {
  if (localWishes.value.length) {
    return localWishes.value;
  }

  return props.wishes || [];
});

const canSubmit = computed(() => {
  return form.name.trim().length > 0 && form.message.trim().length > 0;
});

function getName(wish) {
  return wish?.Name || wish?.GuestName || wish?.FullName || "Khách mời";
}

function getMessage(wish) {
  return wish?.Message || wish?.Content || wish?.Wish || "Một lời chúc yêu thương";
}

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

/* =========================================
   LOAD WISHES
========================================= */

async function loadWishes() {
  const slug = route.params.token
    ? `${route.params.slug}/${route.params.token}`
    : route.params.slug;

  if (!slug) {
    return;
  }

  try {
    const response = await getAllWishes({ slug });

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      localWishes.value = result.data;
    }
  } catch (error) {
    console.warn("[OceanBreeze][Wishes] Không tải được lời chúc:", error);
  }
}

loadWishes();

/* =========================================
   SUBMIT
========================================= */

async function submitWish() {
  if (!form.name || !form.name.trim()) {
    alert("Vui lòng nhập tên của bạn");
    return;
  }

  if (!form.message || !form.message.trim()) {
    alert("Vui lòng nhập lời chúc");
    return;
  }

  const slug = route.params.slug
    ? route.params.token
      ? `${route.params.slug}/${route.params.token}`
      : route.params.slug
    : "";

  const param = {
    slug: slug,
    guestName: form.name.trim(),
    message: form.message.trim(),
  };

  submitting.value = true;

  try {
    const response = await addWish(param);

    const result = response?.data;

    if (result && result.status === "success") {
      alert("Gửi lời chúc thành công ❤️");

      form.name = "";
      form.message = "";

      await loadWishes();
    } else {
      alert(result?.message || "Không thể gửi lời chúc.");
    }
  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
        "Có lỗi xảy ra, vui lòng thử lại."
    );
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.ob-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #274b5c;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.65), rgba(244, 250, 252, 0.5));

  box-shadow: 0 12px 35px rgba(29, 106, 142, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.75);

  border: 1px solid rgba(74, 154, 184, 0.3);
  border-radius: 24px;

  overflow: hidden;
}

.ob-wishes::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;

  background:
    radial-gradient(circle at 12px 8px, transparent 9px, rgba(168, 208, 220, 0.55) 10px, transparent 11px) repeat-x;
  background-size: 24px 10px;
  background-position: 0 0;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.ob-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: #4a9ab8;
}

.ob-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.7));
}

.ob-wishes__ornament-flip {
  transform: rotate(180deg);
}

.ob-wishes__ornament i {
  font-size: 14px;
  font-style: normal;

  color: #e8927c;
}

/* =========================================================
   HEADER
========================================================= */

.ob-eyebrow {
  position: relative;

  margin: 0;

  color: #4a9ab8;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ob-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: #1d6a8e;
}

.ob-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #5b8296;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.ob-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.8), rgba(244, 250, 252, 0.65));

  box-shadow: 0 8px 25px rgba(29, 106, 142, 0.07);

  border: 1px solid rgba(74, 154, 184, 0.25);
  border-radius: 20px;

  overflow: hidden;
}

.ob-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(168, 208, 220, 0.35), transparent 70%);

  pointer-events: none;
}

.ob-form-decoration {
  position: absolute;

  color: #4a9ab8;

  opacity: 0.65;

  font-size: 12px;
}

.ob-form-decoration--tl { top: 13px; left: 15px; }
.ob-form-decoration--tr { top: 13px; right: 15px; }

.ob-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #1d6a8e;

  font-size: 13px;
  font-weight: 600;
}

.ob-form-title .v-icon {
  color: #e8927c;
}

/* =========================================================
   INPUT
========================================================= */

.ob-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.ob-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #4a9ab8;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.ob-input-wrap,
.ob-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(74, 154, 184, 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.75);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.ob-input-wrap:focus-within,
.ob-textarea-wrap:focus-within {
  border-color: rgba(74, 154, 184, 0.65);

  background: rgba(255, 255, 255, 0.95);

  box-shadow: 0 0 0 3px rgba(74, 154, 184, 0.12);
}

.ob-input-wrap .v-icon,
.ob-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #4a9ab8;
}

.ob-wishes input,
.ob-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #274b5c;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.ob-wishes input::placeholder,
.ob-wishes textarea::placeholder {
  color: #8fb3c0;
}

.ob-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.ob-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #8fb3c0;

  font-size: 8px;
}

/* =========================================================
   SUBMIT
========================================================= */

.ob-wish-submit {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;

  margin-top: 5px;

  padding: 12px 18px;

  border: 0;
  border-radius: 999px;

  color: #ffffff;

  background: linear-gradient(135deg, #4a9ab8, #1d6a8e);

  box-shadow: 0 7px 16px rgba(29, 106, 142, 0.22);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.ob-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(29, 106, 142, 0.3);
}

.ob-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.ob-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.ob-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #7ba3b3;
}

.ob-empty-shell {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #4a9ab8;

  background: rgba(255, 255, 255, 0.55);

  border: 1px solid rgba(74, 154, 184, 0.3);
  border-radius: 50% 50% 50% 12px;
}

.ob-no-wishes p {
  margin: 0 0 3px;

  color: #1d6a8e;

  font-size: 14px;
  font-weight: 600;
}

.ob-no-wishes span {
  color: #7ba3b3;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.ob-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.ob-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: #4a9ab8;
}

.ob-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.4));
}

.ob-list-heading-flip {
  transform: rotate(180deg);
}

.ob-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.ob-list-heading .v-icon {
  color: #e8927c;
}

/* =========================================================
   WISH CARD
========================================================= */

.ob-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(74, 154, 184, 0.22);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.82), rgba(244, 250, 252, 0.65));

  box-shadow: 0 5px 17px rgba(29, 106, 142, 0.05);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ob-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(29, 106, 142, 0.09);
}

.ob-card-wave {
  position: absolute;

  right: 8px;
  bottom: -10px;

  color: #4a9ab8;

  font-size: 30px;

  opacity: 0.16;

  transform: rotate(-12deg);

  pointer-events: none;
}

.ob-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #ffffff;

  background: linear-gradient(145deg, #4a9ab8, #1d6a8e);

  border-radius: 50% 50% 50% 8px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.35);
}

.ob-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.ob-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.ob-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.ob-wish-header b {
  color: #1d6a8e;

  font-size: 13px;
  font-weight: 700;
}

.ob-wish-header span {
  color: #7ba3b3;

  font-size: 8px;
}

.ob-wish-header > .v-icon {
  flex: 0 0 auto;

  color: #e8927c;

  margin-top: 2px;
}

.ob-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: #4f7488;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.ob-wish-list-enter-active,
.ob-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.ob-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.ob-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.ob-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #4a9ab8;
}

.ob-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.55));
}

.ob-wishes__bottom-flip {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.ob-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(74, 154, 184, 0.2);
  border-bottom: 1px solid rgba(74, 154, 184, 0.2);

  background: linear-gradient(
    90deg,
    rgba(244, 250, 252, 0.9),
    rgba(226, 241, 245, 0.6),
    rgba(244, 250, 252, 0.9)
  );
}

.ob-marquee-label {
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

  color: #1d6a8e;

  background: linear-gradient(90deg, rgba(244, 250, 252, 1) 72%, rgba(244, 250, 252, 0));

  pointer-events: none;
}

.ob-marquee-label .v-icon {
  color: #e8927c;
}

.ob-marquee-label span {
  font-size: 6px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.ob-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.ob-wish-track {
  display: flex;

  width: max-content;

  animation: ob-wish-marquee 32s linear infinite;

  will-change: transform;
}

.ob-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.ob-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: #4f7488;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.ob-wish-marquee-item i {
  color: #e8927c;

  font-size: 9px;
  font-style: normal;

  animation: ob-marquee-heart 1.8s ease-in-out infinite;
}

.ob-wish-marquee-item strong {
  color: #1d6a8e;

  font-weight: 700;
}

.ob-wish-marquee-item em {
  color: #4f7488;

  font-style: italic;

  font-size: 11px;
}

.ob-marquee-dot {
  color: #4a9ab8;

  font-size: 7px;
  font-weight: 400;
}

@keyframes ob-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes ob-marquee-heart {
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

.ob-wish-marquee:hover .ob-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .ob-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 20px;
  }

  .ob-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .ob-wish-form-card {
    padding: 21px 14px 18px;
  }

  .ob-wish-card {
    padding: 12px;
  }

  .ob-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .ob-wish-header b {
    font-size: 12px;
  }

  .ob-wish-content p {
    font-size: 11px;
  }

  .ob-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .ob-marquee-label {
    width: 62px;
  }

  .ob-marquee-window {
    padding-left: 61px;
  }

  .ob-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .ob-wish-marquee-item em {
    font-size: 10px;
  }

  .ob-marquee-label span {
    font-size: 5px;
  }
}

@media (max-width: 380px) {
  .ob-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .ob-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ob-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ob-wish-track,
  .ob-wish-marquee-item i {
    animation: none;
  }

  .ob-wish-card,
  .ob-wish-submit,
  .ob-wish-list-enter-active,
  .ob-wish-list-leave-active {
    transition: none;
  }
}
</style>
