<template>
  <section class="mw-wishes">
    <h2 class="mw-title">Sổ lưu bút</h2>

    <p class="mw-lead">Gửi đến chúng mình những lời chúc thật ấm áp nhé</p>

    <!-- =====================================================
         MARQUEE
    ====================================================== -->

    <div v-if="allWishes.length" class="mw-marquee">
      <div class="mw-marquee__track">
        <div
          v-for="round in 2"
          :key="round"
          class="mw-marquee__content"
          :aria-hidden="round === 2 ? 'true' : undefined"
        >
          <span
            v-for="(wish, index) in allWishes"
            :key="`${round}-${wish?.Id || index}`"
            class="mw-marquee__item"
          >
            <b>{{ getName(wish) }}</b>

            <i>♥</i>

            {{ getMessage(wish) }}
          </span>
        </div>
      </div>
    </div>

    <!-- =====================================================
         FORM
    ====================================================== -->

    <form class="mw-wish-form" @submit.prevent="submitWish">
      <div class="mw-wish-form__group">
        <label for="mw-wish-name">Họ và tên</label>

        <input
          id="mw-wish-name"
          v-model="form.name"
          type="text"
          maxlength="80"
          placeholder="Nhập tên của bạn"
        />
      </div>

      <div class="mw-wish-form__group">
        <label for="mw-wish-message">Lời chúc</label>

        <textarea
          id="mw-wish-message"
          v-model="form.message"
          rows="4"
          maxlength="500"
          placeholder="Gửi những lời chúc tốt đẹp nhất..."
        ></textarea>

        <span class="mw-wish-form__count">{{ form.message.length }}/500</span>
      </div>

      <button
        type="submit"
        class="mw-pill mw-wish-form__submit"
        :disabled="!canSubmit || submitting"
      >
        {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
      </button>
    </form>

    <!-- =====================================================
         DANH SÁCH
    ====================================================== -->

    <div v-if="allWishes.length" class="mw-wish-list">
      <article
        v-for="(wish, index) in allWishes"
        :key="wish?.Id || index"
        class="mw-wish-card"
      >
        <div class="mw-wish-card__head">
          <strong>{{ getName(wish) }}</strong>

          <span v-if="getTime(wish)">{{ getTime(wish) }}</span>
        </div>

        <p>{{ getMessage(wish) }}</p>
      </article>
    </div>

    <p v-else class="mw-wish-empty">
      Chưa có lời chúc nào. Hãy là người đầu tiên!
    </p>
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

const emit = defineEmits(["submit"]);

const route = useRoute();

const form = reactive({
  name: "",
  message: "",
});

const submitting = ref(false);

const localWishes = ref([]);

const allWishes = computed(() =>
  localWishes.value.length ? localWishes.value : props.wishes || []
);

const canSubmit = computed(
  () => form.name.trim().length > 0 && form.message.trim().length > 0
);

/* =========================================================
   HELPERS
========================================================= */

function getName(wish) {
  return wish?.Name || wish?.GuestName || wish?.FullName || "Khách mời";
}

function getMessage(wish) {
  return wish?.Message || wish?.Content || wish?.Wish || "";
}

function getTime(wish) {
  return wish?.CreatedAt || wish?.CreatedDate || wish?.Time || "";
}

function buildSlug() {
  if (!route.params.slug) {
    return "";
  }

  return route.params.token
    ? `${route.params.slug}/${route.params.token}`
    : route.params.slug;
}

/* =========================================================
   LOAD
========================================================= */

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
    console.warn("[WeddingWishes] Không tải được lời chúc:", error);
  }
}

if (route.params.slug && route.name === "WeddingByApi") {
  loadWishes();
}

/* =========================================================
   SUBMIT
========================================================= */

async function submitWish() {
  if (!form.name || !form.name.trim()) {
    alert("Vui lòng nhập tên của bạn");

    return;
  }

  if (!form.message || !form.message.trim()) {
    alert("Vui lòng nhập lời chúc");

    return;
  }

  const param = {
    slug: buildSlug(),
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

      emit("submit", param);

      await loadWishes();
    } else {
      alert(result?.message || "Không thể gửi lời chúc.");
    }
  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
    );
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.mw-wishes {
  text-align: center;
}

/* =========================================================
   MARQUEE
========================================================= */

.mw-marquee {
  width: 100%;

  margin-top: 24px;

  overflow: hidden;

  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 8%,
    #000 92%,
    transparent
  );
}

.mw-marquee__track {
  display: flex;

  width: max-content;

  animation: mw-marquee 42s linear infinite;
}

.mw-marquee__content {
  display: flex;
  align-items: center;
  gap: 32px;

  padding-right: 32px;
}

.mw-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 13px;

  white-space: nowrap;
}

.mw-marquee__item b {
  color: var(--mw-blue);

  font-weight: 600;
}

.mw-marquee__item i {
  color: var(--mw-blue-soft);

  font-size: 10px;
  font-style: normal;
}

@keyframes mw-marquee {
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

.mw-wish-form {
  max-width: 420px;

  margin: 28px auto 0;
  padding: 20px;

  border: 1px solid var(--mw-hairline);
  border-radius: 14px;

  background-color: var(--mw-paper);

  text-align: left;
}

.mw-wish-form__group + .mw-wish-form__group {
  margin-top: 14px;
}

.mw-wish-form__group label {
  display: block;

  margin-bottom: 6px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 12px;

  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.mw-wish-form__group input,
.mw-wish-form__group textarea {
  width: 100%;

  padding: 10px 14px;

  border: 1px solid var(--mw-hairline);
  border-radius: 10px;

  background-color: var(--mw-paper);
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  outline: none;

  resize: none;
}

.mw-wish-form__group input:focus,
.mw-wish-form__group textarea:focus {
  border-color: var(--mw-blue);
}

.mw-wish-form__count {
  display: block;

  margin-top: 4px;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 11px;

  text-align: right;
}

.mw-wish-form__submit {
  width: 100%;

  margin-top: 18px;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.mw-wish-list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  max-width: 420px;
  max-height: 500px;

  margin: 28px auto 0;

  overflow-y: auto;

  text-align: left;
}

.mw-wish-card {
  padding: 14px 16px;

  border: 1px solid var(--mw-hairline-soft);
  border-radius: 10px;

  background-color: var(--mw-paper);
}

.mw-wish-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.mw-wish-card__head strong {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 14px;
  font-weight: 600;
}

.mw-wish-card__head span {
  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 11px;

  white-space: nowrap;
}

.mw-wish-card p {
  margin: 8px 0 0;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  line-height: 1.6;
}

.mw-wish-empty {
  margin: 24px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 14px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-wish-form,
  .mw-wish-list {
    max-width: 600px;
  }

  .mw-marquee__item {
    font-size: 15px;
  }
}
</style>
