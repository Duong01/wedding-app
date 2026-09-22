<template>
  <section class="cr-wishes">
    <img
      :src="cherryBlossom"
      alt=""
      aria-hidden="true"
      class="cr-wishes__blossom"
      draggable="false"
    />

    <header class="cr-heading">
      <h2 class="cr-heading__vi">Sổ lưu bút</h2>

      <p class="cr-heading__zh">賓客留言</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="cr-heading__intro">
        Mỗi lời chúc là một kỷ niệm đẹp<br />
        mà chúng mình muốn lưu giữ trong ngày đặc biệt này
      </p>
    </header>

    <!-- =========================================
         FORM GỬI LỜI CHÚC
    ========================================== -->
    <div class="cr-wish-form">
      <p class="cr-wish-form__title">Gửi lời yêu thương</p>

      <!-- DÒNG CHỮ CHẠY -->
      <div v-if="items.length" class="cr-marquee">
        <div class="cr-marquee__window">
          <div class="cr-marquee__track">
            <div class="cr-marquee__content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="cr-marquee__item"
              >
                <strong>{{ getName(item) }}</strong>
                <em>“{{ getMessage(item) }}”</em>
                <i>❀</i>
              </span>
            </div>

            <div class="cr-marquee__content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="cr-marquee__item"
              >
                <strong>{{ getName(item) }}</strong>
                <em>“{{ getMessage(item) }}”</em>
                <i>❀</i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="cr-field">
          <label>TÊN CỦA BẠN</label>

          <input
            v-model.trim="form.name"
            type="text"
            maxlength="60"
            placeholder="Nhập tên của bạn"
          />
        </div>

        <div class="cr-field">
          <label>LỜI CHÚC</label>

          <textarea
            v-model.trim="form.message"
            maxlength="500"
            placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
          ></textarea>

          <div class="cr-field__count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="cr-wish-submit" :disabled="!canSubmit || submitting">
          {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
        </button>
      </form>
    </div>

    <!-- =========================================
         CHƯA CÓ LỜI CHÚC
    ========================================== -->
    <div v-if="items.length === 0" class="cr-wishes__empty">
      <span aria-hidden="true">❀</span>

      <p>Chưa có lời chúc nào</p>

      <small>Hãy là người đầu tiên gửi lời yêu thương</small>
    </div>

    <!-- =========================================
         DANH SÁCH LỜI CHÚC
    ========================================== -->
    <div v-else class="cr-wish-list">
      <p class="cr-wish-list__count">{{ items.length }} lời chúc</p>

      <TransitionGroup name="cr-wish">
        <article v-for="(item, index) in items" :key="item.Id || index" class="cr-wish-card">
          <div class="cr-wish-card__avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="cr-wish-card__body">
            <div class="cr-wish-card__head">
              <b>{{ getName(item) }}</b>

              <span v-if="item.CreatedAt">{{ formatTime(item.CreatedAt) }}</span>
            </div>

            <p>{{ getMessage(item) }}</p>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { addWish, getAllWishes } from "@/model/api";

import { cherryBlossom } from "./emeraldLuxeAssets";

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
    console.warn("[EmeraldLuxe][Wishes] Không tải được lời chúc:", error);
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
.cr-wishes {
  position: relative;

  color: var(--cr-ink);
}

.cr-wishes__blossom {
  position: absolute;

  top: 0;
  right: -18px;

  width: 92px;
  height: 92px;

  object-fit: contain;

  opacity: 0.45;

  pointer-events: none;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cr-heading {
  position: relative;

  text-align: center;

  margin-bottom: 22px;
}

.cr-heading__vi {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-heading__zh {
  margin: 4px 0 0;

  font-family: "Noto Serif SC", serif;

  font-size: 0.85em;

  letter-spacing: 0.3em;
  text-indent: 0.3em;

  opacity: 0.7;

  color: var(--cr-soft);
}

.cr-heading__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 12px;

  color: var(--cr-accent);
}

.cr-heading__ornament span {
  width: 52px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-heading__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-heading__ornament i {
  font-size: 13px;
  font-style: normal;
}

.cr-heading__intro {
  margin: 12px 0 0;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.7;
}

/* =========================================================
   FORM
========================================================= */

.cr-wish-form {
  padding: 20px 16px 18px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.18);
  border-radius: 18px;

  background: rgba(var(--cr-surface-rgb), 0.88);

  box-shadow: 0 14px 34px rgba(var(--cr-ink-rgb), 0.08);
}

.cr-wish-form__title {
  margin: 0 0 14px;

  text-align: center;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 18px;

  letter-spacing: 0.08em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

/* =========================================================
   DÒNG CHỮ CHẠY
========================================================= */

.cr-marquee {
  margin-bottom: 16px;
  padding: 8px 0;

  border-top: 1px solid rgba(var(--cr-accent-rgb), 0.9);
  border-bottom: 1px solid rgba(var(--cr-accent-rgb), 0.9);
}

.cr-marquee__window {
  overflow: hidden;
}

.cr-marquee__track {
  display: flex;

  width: max-content;

  animation: cr-marquee 34s linear infinite;
}

.cr-marquee__content {
  display: flex;
  align-items: center;
}

.cr-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 0 16px;

  white-space: nowrap;

  font-size: 12px;
}

.cr-marquee__item strong {
  color: var(--cr-ink);
}

.cr-marquee__item em {
  color: var(--cr-soft);

  font-style: italic;
}

.cr-marquee__item i {
  color: var(--cr-accent);

  font-style: normal;
}

@keyframes cr-marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

/* =========================================================
   Ô NHẬP
========================================================= */

.cr-field {
  margin-bottom: 14px;
}

.cr-field label {
  display: block;

  margin-bottom: 6px;

  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.18em;
}

.cr-field input,
.cr-field textarea {
  width: 100%;

  padding: 11px 14px;

  box-sizing: border-box;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 10px;

  background: #fff;

  color: var(--cr-ink);

  font-family: inherit;
  font-size: 14px;

  outline: none;

  transition: border-color 0.2s ease;
}

.cr-field textarea {
  min-height: 96px;

  resize: vertical;

  line-height: 1.6;
}

.cr-field input:focus,
.cr-field textarea:focus {
  border-color: var(--cr-accent);
}

.cr-field__count {
  margin-top: 4px;

  text-align: right;

  color: var(--cr-muted);

  font-size: 10px;
}

.cr-wish-submit {
  width: 100%;

  padding: 13px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 999px;

  color: var(--cr-ink);

  background: linear-gradient(135deg, var(--cr-accent-light), var(--cr-accent));

  font-family: inherit;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;

  cursor: pointer;

  transition: transform 0.2s ease;
}

.cr-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.cr-wish-submit:disabled {
  opacity: 0.6;
  cursor: default;
}

/* =========================================================
   TRỐNG
========================================================= */

.cr-wishes__empty {
  margin-top: 22px;
  padding: 30px 20px;

  text-align: center;

  border: 1px dashed rgba(var(--cr-accent-rgb), 1);
  border-radius: 16px;
}

.cr-wishes__empty span {
  color: var(--cr-accent);

  font-size: 22px;
}

.cr-wishes__empty p {
  margin: 8px 0 4px;

  color: var(--cr-ink);

  font-size: 14px;
}

.cr-wishes__empty small {
  color: var(--cr-muted);

  font-size: 11px;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.cr-wish-list {
  margin-top: 22px;
}

.cr-wish-list__count {
  margin: 0 0 12px;

  text-align: center;

  color: var(--cr-muted);

  font-size: 11px;

  letter-spacing: 0.16em;
}

.cr-wish-card {
  display: flex;
  gap: 12px;

  margin-bottom: 12px;
  padding: 14px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.16);
  border-radius: 14px;

  background: rgba(var(--cr-surface-rgb), 0.88);
}

.cr-wish-card__avatar {
  flex: 0 0 auto;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-radius: 50%;

  background: rgba(var(--cr-bg-rgb), 0.9);

  color: var(--cr-ink);

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 16px;
}

.cr-wish-card__body {
  min-width: 0;
}

.cr-wish-card__head {
  display: flex;
  align-items: baseline;
  gap: 8px;

  flex-wrap: wrap;
}

.cr-wish-card__head b {
  color: var(--cr-ink);

  font-size: 13px;
}

.cr-wish-card__head span {
  color: var(--cr-muted);

  font-size: 10px;
}

.cr-wish-card__body p {
  margin: 5px 0 0;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   CHUYỂN ĐỘNG DANH SÁCH
========================================================= */

.cr-wish-enter-active,
.cr-wish-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cr-wish-enter-from,
.cr-wish-leave-to {
  opacity: 0;

  transform: translateY(12px);
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cr-marquee__track {
    animation: none;
  }
}
</style>
