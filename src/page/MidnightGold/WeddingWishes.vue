<template>
  <section class="mg-wishes">
    <div class="mg-wishes__ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <p class="mg-eyebrow">LỜI CHÚC TỪ BẠN</p>

    <h2>Sổ lưu bút</h2>

    <p class="mg-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="mg-wish-form-card">
      <div class="mg-form-decoration mg-form-decoration--tl">✧</div>
      <div class="mg-form-decoration mg-form-decoration--tr">✦</div>

      <div class="mg-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="mg-wish-marquee">
        <div class="mg-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="mg-marquee-window">
          <div class="mg-wish-track">
            <div class="mg-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="mg-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="mg-marquee-dot">✦</b>
              </span>
            </div>

            <div class="mg-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="mg-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="mg-marquee-dot">✦</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="mg-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="mg-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="mg-input-group">
          <label>LỜI CHÚC</label>

          <div class="mg-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="mg-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="mg-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="mg-no-wishes">
      <div class="mg-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="mg-wish-list">
      <div class="mg-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="mg-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="mg-wish-card">
          <div class="mg-card-star">✦</div>

          <div class="mg-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="mg-wish-content">
            <div class="mg-wish-header">
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
    <div class="mg-wishes__bottom">
      <span></span>

      <v-icon size="13">mdi-flower-tulip-outline</v-icon>

      <span></span>
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
  const slug = route.params.slug;

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
    console.warn("[MidnightGold][Wishes] Không tải được lời chúc:", error);
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
.mg-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #f0e6d2;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(216, 182, 118, 0.18);

  border-radius: 28px;

  overflow: hidden;
}

.mg-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(216, 182, 118, 0.18);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.mg-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: #d8b676;
}

.mg-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.7));
}

.mg-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.mg-eyebrow {
  position: relative;

  margin: 0;

  color: #d8b676;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mg-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: #f0e6d2;
}

.mg-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #b9a88f;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.mg-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);

  border: 1px solid rgba(216, 182, 118, 0.22);

  border-radius: 20px;

  overflow: hidden;
}

.mg-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(216, 182, 118, 0.16), transparent 70%);

  pointer-events: none;
}

.mg-form-decoration {
  position: absolute;

  color: #d8b676;

  opacity: 0.65;

  font-size: 12px;
}

.mg-form-decoration--tl { top: 13px; left: 15px; }
.mg-form-decoration--tr { top: 13px; right: 15px; }

.mg-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #eed9a8;

  font-size: 13px;
  font-weight: 600;
}

.mg-form-title .v-icon {
  color: #d8b676;
}

/* =========================================================
   INPUT
========================================================= */

.mg-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.mg-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #b9a88f;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.mg-input-wrap,
.mg-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(216, 182, 118, 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.06);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.mg-input-wrap:focus-within,
.mg-textarea-wrap:focus-within {
  border-color: rgba(216, 182, 118, 0.6);

  background: rgba(255, 255, 255, 0.09);

  box-shadow: 0 0 0 3px rgba(216, 182, 118, 0.1);
}

.mg-input-wrap .v-icon,
.mg-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #d8b676;
}

.mg-wishes input,
.mg-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #f0e6d2;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.mg-wishes input::placeholder,
.mg-wishes textarea::placeholder {
  color: #8d7f6d;
}

.mg-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.mg-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #8d7f6d;

  font-size: 8px;
}

/* =========================================================
   SUBMIT
========================================================= */

.mg-wish-submit {
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

  color: #261d23;

  background: linear-gradient(135deg, #d8b676, #9b7d4d);

  box-shadow: 0 7px 16px rgba(0, 0, 0, 0.45), 0 0 18px rgba(216, 182, 118, 0.15);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.mg-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 26px rgba(216, 182, 118, 0.25);
}

.mg-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.mg-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.mg-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #8d7f6d;
}

.mg-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #d8b676;

  background: rgba(216, 182, 118, 0.1);

  border-radius: 50%;
}

.mg-no-wishes p {
  margin: 0 0 3px;

  color: #eed9a8;

  font-size: 14px;
  font-weight: 600;
}

.mg-no-wishes span {
  color: #8d7f6d;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.mg-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.mg-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: #d8b676;
}

.mg-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.4));
}

.mg-list-heading > span:last-child {
  transform: rotate(180deg);
}

.mg-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.mg-list-heading .v-icon {
  color: #d8b676;
}

/* =========================================================
   WISH CARD
========================================================= */

.mg-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(216, 182, 118, 0.22);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow: 0 5px 17px rgba(0, 0, 0, 0.35);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mg-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(0, 0, 0, 0.45), 0 0 16px rgba(216, 182, 118, 0.08);
}

.mg-card-star {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: #d8b676;

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.mg-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #261d23;

  background: linear-gradient(145deg, #eed9a8, #d8b676);

  border-radius: 50%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(38, 29, 35, 0.25), 0 0 12px rgba(216, 182, 118, 0.2);
}

.mg-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.mg-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.mg-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.mg-wish-header b {
  color: #f0e6d2;

  font-size: 13px;
  font-weight: 700;
}

.mg-wish-header span {
  color: #8d7f6d;

  font-size: 8px;
}

.mg-wish-header > .v-icon {
  flex: 0 0 auto;

  color: #d8b676;

  margin-top: 2px;
}

.mg-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: rgba(240, 230, 210, 0.78);

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.mg-wish-list-enter-active,
.mg-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.mg-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.mg-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.mg-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #d8b676;
}

.mg-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.55));
}

.mg-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.mg-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(216, 182, 118, 0.2);
  border-bottom: 1px solid rgba(216, 182, 118, 0.2);

  background: linear-gradient(
    90deg,
    rgba(216, 182, 118, 0.07),
    rgba(216, 182, 118, 0.03),
    rgba(216, 182, 118, 0.07)
  );
}

.mg-marquee-label {
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

  color: #eed9a8;

  background: linear-gradient(90deg, rgba(29, 22, 34, 1) 72%, rgba(29, 22, 34, 0));

  pointer-events: none;
}

.mg-marquee-label .v-icon {
  color: #d8b676;
}

.mg-marquee-label span {
  font-size: 6px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.mg-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.mg-wish-track {
  display: flex;

  width: max-content;

  animation: mg-wish-marquee 32s linear infinite;

  will-change: transform;
}

.mg-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.mg-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: rgba(240, 230, 210, 0.78);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.mg-wish-marquee-item i {
  color: #d8b676;

  font-size: 9px;
  font-style: normal;

  animation: mg-marquee-heart 1.8s ease-in-out infinite;
}

.mg-wish-marquee-item strong {
  color: #eed9a8;

  font-weight: 700;
}

.mg-wish-marquee-item em {
  color: #b9a88f;

  font-style: italic;

  font-size: 11px;
}

.mg-marquee-dot {
  color: #d8b676;

  font-size: 7px;
  font-weight: 400;
}

@keyframes mg-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes mg-marquee-heart {
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

.mg-wish-marquee:hover .mg-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .mg-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .mg-wishes::before {
    inset: 6px;

    border-radius: 18px;
  }

  .mg-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .mg-wish-form-card {
    padding: 21px 14px 18px;
  }

  .mg-wish-card {
    padding: 12px;
  }

  .mg-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .mg-wish-header b {
    font-size: 12px;
  }

  .mg-wish-content p {
    font-size: 11px;
  }

  .mg-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .mg-marquee-label {
    width: 62px;
  }

  .mg-marquee-window {
    padding-left: 61px;
  }

  .mg-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .mg-wish-marquee-item em {
    font-size: 10px;
  }

  .mg-marquee-label span {
    font-size: 5px;
  }
}

@media (max-width: 380px) {
  .mg-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .mg-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .mg-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-wish-track,
  .mg-wish-marquee-item i {
    animation: none;
  }

  .mg-wish-card,
  .mg-wish-submit,
  .mg-wish-list-enter-active,
  .mg-wish-list-leave-active {
    transition: none;
  }
}
</style>
