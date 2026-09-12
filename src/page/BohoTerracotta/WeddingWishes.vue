<template>
  <section class="bt-wishes">
    <div class="bt-wishes__ornament">
      <span></span>
      <i>❋</i>
      <span></span>
    </div>

    <p class="bt-eyebrow">LỜI CHÚC TỪ BẠN</p>

    <h2>Sổ lưu bút</h2>

    <p class="bt-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="bt-wish-form-card">
      <div class="bt-form-decoration bt-form-decoration--tl">❋</div>
      <div class="bt-form-decoration bt-form-decoration--tr">✽</div>

      <div class="bt-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="bt-wish-marquee">
        <div class="bt-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="bt-marquee-window">
          <div class="bt-wish-track">
            <div class="bt-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="bt-wish-marquee-item"
              >
                <i>✽</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="bt-marquee-dot">✧</b>
              </span>
            </div>

            <div class="bt-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="bt-wish-marquee-item"
              >
                <i>✽</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="bt-marquee-dot">✧</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="bt-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="bt-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="bt-input-group">
          <label>LỜI CHÚC</label>

          <div class="bt-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="bt-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="bt-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="bt-no-wishes">
      <div class="bt-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="bt-wish-list">
      <div class="bt-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="bt-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="bt-wish-card">
          <div class="bt-card-flower">❋</div>

          <div class="bt-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="bt-wish-content">
            <div class="bt-wish-header">
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
    <div class="bt-wishes__bottom">
      <span></span>

      <i>✽</i>

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
    console.warn("[BohoTerracotta][Wishes] Không tải được lời chúc:", error);
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
.bt-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #5c4636;

  background: linear-gradient(172deg, rgba(255, 251, 245, 0.65), rgba(242, 226, 208, 0.5));

  box-shadow: 0 12px 35px rgba(92, 70, 54, 0.09), inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  border: 2px dashed rgba(156, 91, 63, 0.4);
  border-radius: 60% 60% 28px 28px / 12% 12% 28px 28px;

  overflow: hidden;
}

/* Macramé lattice texture */
.bt-wishes::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.bt-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: #c97b5d;
}

.bt-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

.bt-wishes__ornament i {
  font-size: 14px;
  font-style: normal;
}

/* =========================================================
   HEADER
========================================================= */

.bt-eyebrow {
  position: relative;

  margin: 0;

  color: #8a9b7c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bt-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: #9c5b3f;
}

.bt-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #8a6f5c;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.bt-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.75), rgba(250, 243, 236, 0.6));

  box-shadow: 0 8px 25px rgba(92, 70, 54, 0.08);

  border: 1px dashed rgba(156, 91, 63, 0.35);
  border-radius: 999px 999px 20px 20px;

  overflow: hidden;
}

.bt-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(217, 176, 140, 0.3), transparent 70%);

  pointer-events: none;
}

.bt-form-decoration {
  position: absolute;

  color: #c97b5d;

  opacity: 0.65;

  font-size: 12px;
}

.bt-form-decoration--tl { top: 13px; left: 15px; }
.bt-form-decoration--tr { top: 13px; right: 15px; }

.bt-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #9c5b3f;

  font-size: 13px;
  font-weight: 600;
}

.bt-form-title .v-icon {
  color: #c97b5d;
}

/* =========================================================
   INPUT
========================================================= */

.bt-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.bt-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #8a9b7c;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.bt-input-wrap,
.bt-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px dashed rgba(156, 91, 63, 0.35);
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.bt-input-wrap:focus-within,
.bt-textarea-wrap:focus-within {
  border-color: rgba(201, 123, 93, 0.65);
  border-style: solid;

  background: rgba(255, 255, 255, 0.92);

  box-shadow: 0 0 0 3px rgba(201, 123, 93, 0.12);
}

.bt-input-wrap .v-icon,
.bt-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #c97b5d;
}

.bt-wishes input,
.bt-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #5c4636;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.bt-wishes input::placeholder,
.bt-wishes textarea::placeholder {
  color: #bda394;
}

.bt-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.bt-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #bda394;

  font-size: 8px;
}

/* =========================================================
   SUBMIT
========================================================= */

.bt-wish-submit {
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

  color: #fff6ec;

  background: linear-gradient(135deg, #c97b5d, #9c5b3f);

  box-shadow: 0 7px 16px rgba(156, 91, 63, 0.24);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.bt-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px) rotate(-0.5deg);

  box-shadow: 0 10px 20px rgba(156, 91, 63, 0.32);
}

.bt-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.bt-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.bt-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #a89488;
}

.bt-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #c97b5d;

  background: rgba(255, 255, 255, 0.5);

  border-radius: 50% 50% 50% 20%;
}

.bt-no-wishes p {
  margin: 0 0 3px;

  color: #9c5b3f;

  font-size: 14px;
  font-weight: 600;
}

.bt-no-wishes span {
  color: #a89488;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.bt-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.bt-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: #8a9b7c;
}

.bt-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.4));
}

.bt-list-heading > span:last-child {
  transform: rotate(180deg);
}

.bt-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.bt-list-heading .v-icon {
  color: #c97b5d;
}

/* =========================================================
   WISH CARD
========================================================= */

.bt-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px dashed rgba(156, 91, 63, 0.28);
  border-radius: 18px 18px 18px 6px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.78), rgba(250, 243, 236, 0.6));

  box-shadow: 0 5px 17px rgba(92, 70, 54, 0.06);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bt-wish-card:hover {
  transform: translateY(-2px) rotate(-0.4deg);

  box-shadow: 0 9px 23px rgba(92, 70, 54, 0.11);
}

.bt-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: #c97b5d;

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.bt-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #9c5b3f;

  background: linear-gradient(145deg, #f2e2d0, #d9b08c);

  border-radius: 50% 50% 50% 20%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.bt-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.bt-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.bt-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.bt-wish-header b {
  color: #5c4636;

  font-size: 13px;
  font-weight: 700;
}

.bt-wish-header span {
  color: #b09a8c;

  font-size: 8px;
}

.bt-wish-header > .v-icon {
  flex: 0 0 auto;

  color: #c97b5d;

  margin-top: 2px;
}

.bt-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: #7d6350;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.bt-wish-list-enter-active,
.bt-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.bt-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.bt-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.bt-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #c97b5d;
}

.bt-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.55));
}

.bt-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

.bt-wishes__bottom i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   MARQUEE
========================================================= */

.bt-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px dashed rgba(156, 91, 63, 0.25);
  border-bottom: 1px dashed rgba(156, 91, 63, 0.25);

  background: linear-gradient(
    90deg,
    rgba(255, 251, 245, 0.85),
    rgba(242, 226, 208, 0.55),
    rgba(255, 251, 245, 0.85)
  );
}

.bt-marquee-label {
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

  color: #9c5b3f;

  background: linear-gradient(90deg, rgba(255, 251, 245, 1) 72%, rgba(255, 251, 245, 0));

  pointer-events: none;
}

.bt-marquee-label .v-icon {
  color: #c97b5d;
}

.bt-marquee-label span {
  font-size: 6px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.bt-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.bt-wish-track {
  display: flex;

  width: max-content;

  animation: bt-wish-marquee 32s linear infinite;

  will-change: transform;
}

.bt-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.bt-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: #7d6350;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.bt-wish-marquee-item i {
  color: #c97b5d;

  font-size: 9px;
  font-style: normal;

  animation: bt-marquee-flower 1.8s ease-in-out infinite;
}

.bt-wish-marquee-item strong {
  color: #5c4636;

  font-weight: 700;
}

.bt-wish-marquee-item em {
  color: #8a6f5c;

  font-style: italic;

  font-size: 11px;
}

.bt-marquee-dot {
  color: #c97b5d;

  font-size: 7px;
  font-weight: 400;
}

@keyframes bt-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes bt-marquee-flower {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.65;
  }

  50% {
    transform: scale(1.3) rotate(20deg);
    opacity: 1;
  }
}

.bt-wish-marquee:hover .bt-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .bt-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .bt-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .bt-wish-form-card {
    padding: 21px 14px 18px;
  }

  .bt-wish-card {
    padding: 12px;
  }

  .bt-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .bt-wish-header b {
    font-size: 12px;
  }

  .bt-wish-content p {
    font-size: 11px;
  }

  .bt-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .bt-marquee-label {
    width: 62px;
  }

  .bt-marquee-window {
    padding-left: 61px;
  }

  .bt-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .bt-wish-marquee-item em {
    font-size: 10px;
  }

  .bt-marquee-label span {
    font-size: 5px;
  }
}

@media (max-width: 380px) {
  .bt-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .bt-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .bt-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bt-wish-track,
  .bt-wish-marquee-item i {
    animation: none;
  }

  .bt-wish-card,
  .bt-wish-submit,
  .bt-wish-list-enter-active,
  .bt-wish-list-leave-active {
    transition: none;
  }
}
</style>
