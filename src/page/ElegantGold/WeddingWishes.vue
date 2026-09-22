<template>
  <section class="la-wishes">
    <h2 class="la-title">Sổ lưu bút</h2>

    <p class="la-lead">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =====================================================
         DẢI LỜI CHÚC CHẠY NGANG
    ====================================================== -->
    <div v-if="allWishes.length" class="la-marquee">
      <div class="la-marquee__window">
        <div class="la-marquee__track">
          <div class="la-marquee__content">
            <span
              v-for="(wish, index) in allWishes"
              :key="`mq-a-${wish.Id || wish.id || index}`"
              class="la-marquee__item"
            >
              <strong>{{ getWishName(wish) }}</strong>

              <em>“{{ getWishMessage(wish) }}”</em>

              <b>✦</b>
            </span>
          </div>

          <div class="la-marquee__content" aria-hidden="true">
            <span
              v-for="(wish, index) in allWishes"
              :key="`mq-b-${wish.Id || wish.id || index}`"
              class="la-marquee__item"
            >
              <strong>{{ getWishName(wish) }}</strong>

              <em>“{{ getWishMessage(wish) }}”</em>

              <b>✦</b>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- =====================================================
         FORM GỬI LỜI CHÚC
    ====================================================== -->
    <form class="la-wish-form" @submit.prevent="submitWish">
      <div class="la-field">
        <label for="la-wish-name">TÊN CỦA BẠN</label>

        <input
          id="la-wish-name"
          v-model.trim="form.name"
          type="text"
          maxlength="60"
          placeholder="Nhập tên của bạn"
        />
      </div>

      <div class="la-field">
        <label for="la-wish-message">LỜI CHÚC</label>

        <textarea
          id="la-wish-message"
          v-model.trim="form.message"
          rows="4"
          maxlength="500"
          placeholder="Viết lời chúc dành cho cô dâu &amp; chú rể..."
        ></textarea>

        <div class="la-wish-form__count">{{ form.message.length }}/500</div>
      </div>

      <button type="submit" class="la-pill la-wish-form__submit" :disabled="!canSubmit || submitting">
        {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
      </button>
    </form>

    <!-- =====================================================
         DANH SÁCH LỜI CHÚC
    ====================================================== -->
    <div v-if="allWishes.length" class="la-wish-list">
      <article
        v-for="(wish, index) in allWishes"
        :key="wish.Id || wish.id || index"
        class="la-wish-card"
      >
        <div class="la-wish-card__head">
          <span class="la-wish-card__name">{{ getWishName(wish) }}</span>

          <span v-if="getWishTime(wish)" class="la-wish-card__time">
            {{ getWishTime(wish) }}
          </span>
        </div>

        <p class="la-wish-card__text">{{ getWishMessage(wish) }}</p>
      </article>
    </div>

    <p v-else class="la-wishes__empty">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

import { useRoute } from "vue-router";

import { addWish, getAllWishes } from "@/model/api";

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

/*
 * Lời chúc lấy từ API (getAllWishes) — dữ liệu thật
 * khách mời đã gửi. Fallback về props.wishes
 * (guestBook.Guest lưu trong thiệp) khi API trống.
 */
const route = useRoute();

const form = reactive({
  name: "",
  message: "",
});

const submitting = ref(false);

const localWishes = ref([]);

const allWishes = computed(() => {
  if (localWishes.value.length) {
    return localWishes.value;
  }

  return props.wishes || [];
});

const canSubmit = computed(
  () => form.name.trim().length > 0 && form.message.trim().length > 0
);

function getWishName(wish) {
  return wish?.Name || wish?.name || wish?.GuestName || "Một người bạn";
}

function getWishMessage(wish) {
  return wish?.Message || wish?.Content || wish?.content || wish?.message || wish?.Wish || "";
}

function getWishTime(wish) {
  const raw = wish?.CreatedAt || wish?.createdAt;

  if (!raw) return "";

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) return String(raw);

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildSlug() {
  return route.params.token
    ? `${route.params.slug}/${route.params.token}`
    : route.params.slug;
}

async function loadWishes() {
  const slug = buildSlug();

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
    console.warn("[WeddingWishes] Không tải được lời chúc:", error);
  }
}

async function submitWish() {
  if (!form.name.trim()) {
    alert("Vui lòng nhập tên của bạn");
    return;
  }

  if (!form.message.trim()) {
    alert("Vui lòng nhập lời chúc");
    return;
  }

  const slug = buildSlug();

  if (!slug) {
    alert("Không xác định được thiệp. Vui lòng thử lại.");
    return;
  }

  submitting.value = true;

  try {
    const response = await addWish({
      slug,
      guestName: form.name.trim(),
      message: form.message.trim(),
    });

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

if (route.params.slug && route.name === "WeddingByApi") {
  loadWishes();
}
</script>

<style scoped>
.la-wishes {
  text-align: center;
}

/* =========================================================
   DẢI CHẠY NGANG
========================================================= */

.la-marquee {
  margin-top: 22px;
}

.la-marquee__window {
  overflow: hidden;

  padding: 10px 0;

  border-top: 1px solid var(--la-hairline);
  border-bottom: 1px solid var(--la-hairline);
}

.la-marquee__track {
  display: flex;

  width: max-content;

  animation: la-marquee 42s linear infinite;
}

.la-marquee__content {
  display: flex;
  align-items: center;
}

.la-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 0 18px;

  white-space: nowrap;

  font-family: var(--la-font-hand);
  font-size: 12px;
}

.la-marquee__item strong {
  color: var(--la-red);
  font-weight: 600;
}

.la-marquee__item em {
  color: var(--la-ink);
  font-style: italic;
  opacity: 0.85;
}

.la-marquee__item b {
  color: var(--la-red);
  font-size: 9px;
  opacity: 0.6;
}

@keyframes la-marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

/* =========================================================
   FORM
========================================================= */

.la-wish-form {
  max-width: 100%;

  margin: 24px auto 0;
  padding: 20px 16px;

  border: 1px solid var(--la-hairline);
  border-radius: 14px;

  text-align: left;
}

.la-field {
  margin-bottom: 14px;
}

.la-field label {
  display: block;

  margin-bottom: 6px;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 300;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.la-field input,
.la-field textarea {
  width: 100%;

  padding: 10px 13px;

  border: 1px solid var(--la-hairline);
  border-radius: 8px;

  outline: none;

  background-color: transparent;
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 15px;
  font-weight: 300;

  line-height: 1.6;
}

.la-field textarea {
  resize: none;
}

.la-field input::placeholder,
.la-field textarea::placeholder {
  color: var(--la-ink-soft);
  opacity: 0.55;
}

.la-field input:focus,
.la-field textarea:focus {
  border-color: var(--la-red);
}

.la-wish-form__count {
  margin-top: 5px;

  color: var(--la-ink-soft);

  font-family: var(--la-font-hand);
  font-size: 10px;

  text-align: right;
}

.la-wish-form__submit {
  width: 100%;
}

.la-wish-form__submit:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.la-wish-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-top: 24px;
}

.la-wish-card {
  padding: 12px 14px;

  border: 1px solid var(--la-hairline-soft);
  border-radius: 10px;

  text-align: left;
}

.la-wish-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.la-wish-card__name {
  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-weight: 600;
}

.la-wish-card__time {
  color: var(--la-ink-soft);

  font-family: var(--la-font-hand);
  font-size: 12px;

  opacity: 0.6;
}

.la-wish-card__text {
  margin: 8px 0 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;

  line-height: 1.6;
}

.la-wishes__empty {
  margin-top: 24px;

  color: var(--la-ink-soft);

  font-family: var(--la-font-hand);
  font-size: 13px;

  opacity: 0.7;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-wish-form,
  .la-wish-list {
    max-width: 600px;

    margin-left: auto;
    margin-right: auto;
  }

  .la-wish-form {
    padding: 24px 22px;
  }

  .la-wish-card {
    padding: 14px 16px;
  }

  .la-wish-card__name {
    font-size: 15px;
  }

  .la-wish-card__text {
    font-size: 14px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .la-marquee__track {
    animation: none;
  }
}
</style>
