<template>
  <section class="tdx-wishes">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-wishes__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />

      <img
        :src="ribbonDecoration"
        alt=""
        class="tdx-decor tdx-decor--ribbon"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-wishes__inner">
      <h2 class="tdx-heading">Sổ lưu bút</h2>

      <p class="tdx-wishes__intro">
        Mỗi lời chúc là một kỷ niệm đẹp
        mà chúng mình muốn lưu giữ trong ngày đặc biệt này
      </p>

      <!-- =========================================
           FORM GỬI LỜI CHÚC
      ========================================== -->

      <div class="tdx-wish-form">
        <p class="tdx-wish-form__title">Gửi lời yêu thương</p>

        <!-- MARQUEE -->
        <div v-if="items.length" class="tdx-marquee">
          <div class="tdx-marquee__label">
            <span>LỜI CHÚC</span>
          </div>

          <div class="tdx-marquee__window">
            <div class="tdx-marquee__track">
              <div class="tdx-marquee__content">
                <span
                  v-for="(item, index) in items"
                  :key="`marquee-a-${item.Id || index}`"
                  class="tdx-marquee__item"
                >
                  <i>♥</i>

                  <strong>{{ getName(item) }}</strong>

                  <em>“{{ getMessage(item) }}”</em>

                  <b>❀</b>
                </span>
              </div>

              <div class="tdx-marquee__content" aria-hidden="true">
                <span
                  v-for="(item, index) in items"
                  :key="`marquee-b-${item.Id || index}`"
                  class="tdx-marquee__item"
                >
                  <i>♥</i>

                  <strong>{{ getName(item) }}</strong>

                  <em>“{{ getMessage(item) }}”</em>

                  <b>❀</b>
                </span>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitWish">
          <div class="tdx-field">
            <label for="tdx-wish-name">TÊN CỦA BẠN</label>

            <input
              id="tdx-wish-name"
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div class="tdx-field">
            <label for="tdx-wish-message">LỜI CHÚC</label>

            <textarea
              id="tdx-wish-message"
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>

            <span class="tdx-field__count">{{ form.message.length }}/500</span>
          </div>

          <button type="submit" class="tdx-wish-submit" :disabled="!canSubmit || submitting">
            {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
          </button>
        </form>
      </div>

      <!-- =========================================
           CHƯA CÓ LỜI CHÚC
      ========================================== -->

      <div v-if="items.length === 0" class="tdx-wishes__empty">
        <p>Chưa có lời chúc nào</p>

        <span>Hãy là người đầu tiên gửi lời yêu thương</span>
      </div>

      <!-- =========================================
           DANH SÁCH LỜI CHÚC
      ========================================== -->

      <div v-else class="tdx-wish-list">
        <p class="tdx-wish-list__heading">{{ items.length }} lời chúc</p>

        <TransitionGroup name="tdx-wish-list" tag="div">
          <article v-for="(item, index) in items" :key="item.Id || index" class="tdx-wish-card">
            <div class="tdx-wish-card__avatar">
              {{ getName(item).charAt(0).toUpperCase() }}
            </div>

            <div class="tdx-wish-card__content">
              <div class="tdx-wish-card__header">
                <b>{{ getName(item) }}</b>

                <span v-if="item.CreatedAt">{{ formatTime(item.CreatedAt) }}</span>
              </div>

              <p>{{ getMessage(item) }}</p>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { addWish, getAllWishes } from "@/model/api";

import {
  flowerDecoration,
  lineDecoration,
  ribbonDecoration,
} from "./toDuyenXanhAssets";

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
   TẢI LỜI CHÚC
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
    console.warn("[ToDuyenXanh][Wishes] Không tải được lời chúc:", error);
  }
}

if (route.params.slug && route.name === "WeddingByApi") {
  loadWishes();
}

/* =========================================
   GỬI LỜI CHÚC
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

    alert(error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.tdx-wishes {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);
  --tdx-cream: var(--accent-light, #f3dfc5);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-wishes__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 60px;
  right: -70px;

  width: 198px;
  height: 420px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: 30px;
  right: -80px;

  width: 190px;
  height: 190px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

.tdx-decor--ribbon {
  bottom: -10px;
  left: -365px;

  width: 700px;
  height: 155px;

  object-fit: contain;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-wishes__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 2.5% 10% 22%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;

  text-align: start;
}

.tdx-heading {
  margin: 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.tdx-wishes__intro {
  margin: 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.6;

  white-space: pre-line;
}

/* =========================================================
   FORM
========================================================= */

.tdx-wish-form {
  width: 100%;

  margin-top: 6px;
  padding: 18px 16px 16px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: rgba(255, 255, 255, 0.7);
}

.tdx-wish-form__title {
  margin: 0 0 14px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.16em;

  text-transform: uppercase;
}

.tdx-field {
  position: relative;

  margin-bottom: 14px;
}

.tdx-field label {
  display: block;

  margin-bottom: 6px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.tdx-field input,
.tdx-field textarea {
  width: 100%;

  padding: 11px 12px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  outline: 0;

  color: var(--tdx-ink);

  background: #ffffff;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 14px;

  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.tdx-field input:focus,
.tdx-field textarea:focus {
  border-color: var(--tdx-green);

  box-shadow: 0 0 0 3px rgba(94, 129, 60, 0.12);
}

.tdx-field input::placeholder,
.tdx-field textarea::placeholder {
  color: rgba(26, 53, 0, 0.4);
}

.tdx-field textarea {
  min-height: 88px;

  resize: vertical;

  line-height: 1.6;
}

.tdx-field__count {
  position: absolute;

  right: 2px;
  bottom: -14px;

  color: rgba(26, 53, 0, 0.45);

  font-family: "Times New Roman", serif;
  font-size: 10px;
}

.tdx-wish-submit {
  width: 100%;

  margin-top: 8px;
  padding: 13px 18px;

  border: 0;
  border-radius: 7px;

  color: #fefbf4;

  background: var(--tdx-green);

  box-shadow: 0 12px 26px rgba(94, 129, 60, 0.3);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.tdx-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 16px 32px rgba(94, 129, 60, 0.4);
}

.tdx-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   MARQUEE
========================================================= */

.tdx-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 18px;
  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid var(--tdx-line);
  border-bottom: 1px solid var(--tdx-line);
}

.tdx-marquee__label {
  position: absolute;
  z-index: 5;

  left: 0;
  top: 0;
  bottom: 0;

  width: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tdx-green);

  background: linear-gradient(90deg, #ffffff 72%, rgba(255, 255, 255, 0));

  pointer-events: none;
}

.tdx-marquee__label span {
  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.tdx-marquee__window {
  position: relative;

  width: 100%;

  padding-left: 73px;

  overflow: hidden;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.tdx-marquee__track {
  display: flex;

  width: max-content;

  animation: tdx-marquee 32s linear infinite;

  will-change: transform;
}

.tdx-marquee__content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.tdx-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 11px;

  white-space: nowrap;
}

.tdx-marquee__item i {
  color: var(--tdx-green);

  font-size: 11px;
  font-style: normal;

  animation: tdx-marquee-heart 1.8s ease-in-out infinite;
}

.tdx-marquee__item strong {
  color: var(--tdx-green);

  font-weight: 700;
}

.tdx-marquee__item em {
  font-style: italic;
}

.tdx-marquee__item b {
  color: var(--tdx-line);

  font-size: 11px;
  font-weight: 400;
}

.tdx-marquee:hover .tdx-marquee__track {
  animation-play-state: paused;
}

@keyframes tdx-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes tdx-marquee-heart {
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
   CHƯA CÓ LỜI CHÚC
========================================================= */

.tdx-wishes__empty {
  width: 100%;

  padding: 20px 0 10px;

  text-align: center;
}

.tdx-wishes__empty p {
  margin: 0 0 4px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 14px;
  font-weight: 700;
}

.tdx-wishes__empty span {
  color: rgba(26, 53, 0, 0.6);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
}

/* =========================================================
   DANH SÁCH LỜI CHÚC
========================================================= */

.tdx-wish-list {
  width: 100%;
}

.tdx-wish-list__heading {
  margin: 0 0 12px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  text-transform: uppercase;
}

.tdx-wish-card {
  display: flex;
  gap: 12px;

  margin-bottom: 11px;
  padding: 14px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: rgba(255, 255, 255, 0.7);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tdx-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(26, 53, 0, 0.08);
}

.tdx-wish-card__avatar {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: #fefbf4;

  background: var(--tdx-green);

  font-family: Carattere, cursive;
  font-size: 20px;
}

.tdx-wish-card__content {
  flex: 1;

  min-width: 0;
}

.tdx-wish-card__header {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.tdx-wish-card__header b {
  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 13px;
  font-weight: 700;
}

.tdx-wish-card__header span {
  color: rgba(26, 53, 0, 0.5);

  font-family: "Times New Roman", serif;
  font-size: 10px;
}

.tdx-wish-card__content p {
  margin: 5px 0 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.tdx-wish-list-enter-active,
.tdx-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.tdx-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.tdx-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-wishes__inner {
    width: min(100%, 600px);

    padding: 2.5% 5px 22%;

    gap: 20px;
  }

  .tdx-decor--line-right {
    top: 80px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 560px;
  }

  .tdx-decor--flower-right {
    top: 20px;
    left: -300px;
    right: auto;

    width: 420px;
    height: 420px;
  }

  .tdx-decor--ribbon {
    bottom: 20px;
    left: -538px;

    width: 1403px;
    height: 246px;
  }

  .tdx-heading {
    font-size: 27px;
  }

  .tdx-wishes__intro {
    font-size: 16px;
  }

  .tdx-wish-form {
    padding: 24px 22px 20px;
  }

  .tdx-wish-form__title {
    font-size: 15px;
  }

  .tdx-field label {
    font-size: 12px;
  }

  .tdx-field input,
  .tdx-field textarea {
    font-size: 16px;
  }

  .tdx-wish-submit {
    font-size: 13px;
  }

  .tdx-marquee__item {
    font-size: 13px;
  }

  .tdx-wish-card__header b {
    font-size: 16px;
  }

  .tdx-wish-card__content p {
    font-size: 15px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .tdx-marquee__track,
  .tdx-marquee__item i {
    animation: none;
  }

  .tdx-wish-card,
  .tdx-wish-submit,
  .tdx-wish-list-enter-active,
  .tdx-wish-list-leave-active {
    transition: none;
  }
}
</style>
