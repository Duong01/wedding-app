<template>
  <section class="shy-wishes">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shy-bar">Sổ lưu bút</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-wishes__inner">
      <p class="shy-wishes__intro">
        Mỗi lời chúc là một kỷ niệm đẹp
        mà chúng mình muốn lưu giữ trong ngày đặc biệt này
      </p>

      <!-- =========================================
           FORM GỬI LỜI CHÚC
      ========================================== -->

      <div class="shy-wish-form">
        <p class="shy-wish-form__title">Gửi lời yêu thương</p>

        <!-- MARQUEE -->
        <div v-if="items.length" class="shy-marquee">
          <div class="shy-marquee__label">
            <span>LỜI CHÚC</span>
          </div>

          <div class="shy-marquee__window">
            <div class="shy-marquee__track">
              <div class="shy-marquee__content">
                <span
                  v-for="(item, index) in items"
                  :key="`marquee-a-${item.Id || index}`"
                  class="shy-marquee__item"
                >
                  <i>♥</i>

                  <strong>{{ getName(item) }}</strong>

                  <em>“{{ getMessage(item) }}”</em>

                  <b>❦</b>
                </span>
              </div>

              <div class="shy-marquee__content" aria-hidden="true">
                <span
                  v-for="(item, index) in items"
                  :key="`marquee-b-${item.Id || index}`"
                  class="shy-marquee__item"
                >
                  <i>♥</i>

                  <strong>{{ getName(item) }}</strong>

                  <em>“{{ getMessage(item) }}”</em>

                  <b>❦</b>
                </span>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitWish">
          <div class="shy-field">
            <label for="shy-wish-name">TÊN CỦA BẠN</label>

            <input
              id="shy-wish-name"
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div class="shy-field">
            <label for="shy-wish-message">LỜI CHÚC</label>

            <textarea
              id="shy-wish-message"
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>

            <span class="shy-field__count">{{ form.message.length }}/500</span>
          </div>

          <button type="submit" class="shy-wish-submit" :disabled="!canSubmit || submitting">
            {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
          </button>
        </form>
      </div>

      <!-- =========================================
           CHƯA CÓ LỜI CHÚC
      ========================================== -->

      <div v-if="items.length === 0" class="shy-wishes__empty">
        <p>Chưa có lời chúc nào</p>

        <span>Hãy là người đầu tiên gửi lời yêu thương</span>
      </div>

      <!-- =========================================
           DANH SÁCH LỜI CHÚC
      ========================================== -->

      <div v-else class="shy-wish-list">
        <p class="shy-wish-list__heading">{{ items.length }} lời chúc</p>

        <TransitionGroup name="shy-wish-list" tag="div">
          <article v-for="(item, index) in items" :key="item.Id || index" class="shy-wish-card">
            <div class="shy-wish-card__avatar">
              {{ getName(item).charAt(0).toUpperCase() }}
            </div>

            <div class="shy-wish-card__content">
              <div class="shy-wish-card__header">
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
    console.warn("[SongHyRed][Wishes] Không tải được lời chúc:", error);
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
.shy-wishes {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-wishes__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 24px 8px 36px;

  text-align: center;
}

.shy-wishes__intro {
  margin: 0 0 18px;

  color: var(--shy-ink);

  font-size: 13px;

  line-height: 1.7;

  white-space: pre-line;
}

/* =========================================================
   FORM
========================================================= */

.shy-wish-form {
  width: 100%;

  padding: 20px 16px 18px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 20%, transparent);
  border-radius: 10px;

  background: #ffffff;

  box-shadow: 0 10px 26px rgba(128, 0, 0, 0.08);

  text-align: left;
}

.shy-wish-form__title {
  margin: 0 0 14px;

  color: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.16em;

  text-align: center;
  text-transform: uppercase;
}

.shy-field {
  position: relative;

  margin-bottom: 16px;
}

.shy-field label {
  display: block;

  margin-bottom: 6px;

  color: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.shy-field input,
.shy-field textarea {
  width: 100%;

  padding: 11px 12px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 22%, transparent);
  border-radius: 8px;

  outline: 0;

  color: var(--shy-ink);

  background: #ffffff;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 14px;

  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.shy-field input:focus,
.shy-field textarea:focus {
  border-color: var(--shy-red);

  box-shadow: 0 0 0 3px color-mix(in srgb, var(--shy-red) 12%, transparent);
}

.shy-field input::placeholder,
.shy-field textarea::placeholder {
  color: color-mix(in srgb, var(--shy-ink) 45%, transparent);
}

.shy-field textarea {
  min-height: 88px;

  resize: vertical;

  line-height: 1.6;
}

.shy-field__count {
  position: absolute;

  right: 2px;
  bottom: -14px;

  color: color-mix(in srgb, var(--shy-ink) 55%, transparent);

  font-family: "Times New Roman", serif;
  font-size: 10px;
}

.shy-wish-submit {
  width: 100%;

  margin-top: 8px;
  padding: 13px 18px;

  border: 0;
  border-radius: 10px;

  color: var(--shy-cream);

  background: var(--shy-red);

  box-shadow: 0 12px 26px rgba(128, 0, 0, 0.24);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.16em;
  text-indent: 0.16em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.shy-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 16px 32px rgba(128, 0, 0, 0.32);
}

.shy-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   MARQUEE
========================================================= */

.shy-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 18px;
  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid color-mix(in srgb, var(--shy-red) 20%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--shy-red) 20%, transparent);
}

.shy-marquee__label {
  position: absolute;
  z-index: 5;

  left: 0;
  top: 0;
  bottom: 0;

  width: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--shy-red);

  background: linear-gradient(90deg, #ffffff 72%, rgba(255, 255, 255, 0));

  pointer-events: none;
}

.shy-marquee__label span {
  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.shy-marquee__window {
  position: relative;

  width: 100%;

  padding-left: 73px;

  overflow: hidden;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.shy-marquee__track {
  display: flex;

  width: max-content;

  animation: shy-marquee 32s linear infinite;

  will-change: transform;
}

.shy-marquee__content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.shy-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: var(--shy-ink);

  font-size: 11px;

  white-space: nowrap;
}

.shy-marquee__item i {
  color: var(--shy-red);

  font-size: 11px;
  font-style: normal;

  animation: shy-marquee-heart 1.8s ease-in-out infinite;
}

.shy-marquee__item strong {
  color: var(--shy-red);

  font-weight: 700;
}

.shy-marquee__item em {
  font-style: italic;
}

.shy-marquee__item b {
  color: color-mix(in srgb, var(--shy-red) 45%, transparent);

  font-size: 11px;
  font-weight: 400;
}

.shy-marquee:hover .shy-marquee__track {
  animation-play-state: paused;
}

@keyframes shy-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes shy-marquee-heart {
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

.shy-wishes__empty {
  width: 100%;

  padding: 24px 0 10px;
}

.shy-wishes__empty p {
  margin: 0 0 4px;

  color: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 14px;
  font-weight: 700;
}

.shy-wishes__empty span {
  color: color-mix(in srgb, var(--shy-ink) 70%, transparent);

  font-size: 11px;
  font-style: italic;
}

/* =========================================================
   DANH SÁCH LỜI CHÚC
========================================================= */

.shy-wish-list {
  width: 100%;

  margin-top: 24px;
}

.shy-wish-list__heading {
  margin: 0 0 12px;

  color: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  text-transform: uppercase;
}

.shy-wish-card {
  display: flex;
  gap: 12px;

  margin-bottom: 11px;
  padding: 14px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 16%, transparent);
  border-radius: 10px;

  background: #ffffff;

  box-shadow: 0 6px 18px rgba(128, 0, 0, 0.06);

  text-align: left;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.shy-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 10px 24px rgba(128, 0, 0, 0.1);
}

.shy-wish-card__avatar {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 20px;
}

.shy-wish-card__content {
  flex: 1;

  min-width: 0;
}

.shy-wish-card__header {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.shy-wish-card__header b {
  color: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 13px;
  font-weight: 700;
}

.shy-wish-card__header span {
  color: color-mix(in srgb, var(--shy-ink) 60%, transparent);

  font-family: "Times New Roman", serif;
  font-size: 10px;
}

.shy-wish-card__content p {
  margin: 5px 0 0;

  color: var(--shy-ink);

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.shy-wish-list-enter-active,
.shy-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.shy-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.shy-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-wishes__inner {
    width: min(100%, 600px);

    padding: 32px 5px 44px;
  }

  .shy-wishes__intro {
    font-size: 16px;
  }

  .shy-wish-form {
    padding: 24px 22px 20px;
  }

  .shy-wish-form__title {
    font-size: 15px;
  }

  .shy-field label {
    font-size: 12px;
  }

  .shy-field input,
  .shy-field textarea {
    font-size: 16px;
  }

  .shy-wish-submit {
    font-size: 15px;
  }

  .shy-marquee__item {
    font-size: 13px;
  }

  .shy-wish-card__header b {
    font-size: 16px;
  }

  .shy-wish-card__content p {
    font-size: 15px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .shy-marquee__track,
  .shy-marquee__item i {
    animation: none;
  }

  .shy-wish-card,
  .shy-wish-submit,
  .shy-wish-list-enter-active,
  .shy-wish-list-leave-active {
    transition: none;
  }
}
</style>
