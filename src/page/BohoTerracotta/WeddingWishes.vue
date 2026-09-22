<template>
  <section class="bq-wishes">
    <h2 class="bq-heading">SỔ LƯU BÚT</h2>

    <!-- =========================================
         FORM GỬI LỜI CHÚC
    ========================================== -->
    <form class="bq-wish-form" @submit.prevent="submitWish">
      <div class="bq-field">
        <input
          v-model.trim="form.name"
          type="text"
          maxlength="60"
          placeholder="Nhập tên*"
        />
      </div>

      <div class="bq-field">
        <textarea
          v-model.trim="form.message"
          maxlength="500"
          rows="4"
          placeholder="Nhập lời chúc*"
        ></textarea>
      </div>

      <div class="bq-wish-form__actions">
        <span class="bq-wish-form__count">{{ form.message.length }}/500</span>

        <button type="submit" class="bq-wish-submit" :disabled="!canSubmit || submitting">
          {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
        </button>
      </div>
    </form>

    <!-- =========================================
         CHƯA CÓ LỜI CHÚC
    ========================================== -->
    <div v-if="items.length === 0" class="bq-wishes__empty">
      <p>Chưa có lời chúc nào</p>

      <small>Hãy là người đầu tiên gửi lời yêu thương</small>
    </div>

    <!-- =========================================
         DANH SÁCH LỜI CHÚC
    ========================================== -->
    <div v-else class="bq-wish-list">
      <TransitionGroup name="bq-wish">
        <article v-for="(item, index) in items" :key="item.Id || index" class="bq-wish-card">
          <div class="bq-wish-card__head">
            <b>{{ getName(item) }}</b>

            <span v-if="item.CreatedAt">{{ formatTime(item.CreatedAt) }}</span>
          </div>

          <p>{{ getMessage(item) }}</p>
        </article>
      </TransitionGroup>
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
    console.warn("[BaroqueDarkRed][Wishes] Không tải được lời chúc:", error);
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
.bq-wishes {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  padding: 0 24px;

  text-align: center;

  color: var(--bq-ink);
}

.bq-heading {
  margin: 0 0 20px;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

/* =========================================================
   FORM
========================================================= */

.bq-wish-form {
  width: 100%;
  max-width: 248px;

  margin: 0 auto;
}

.bq-field {
  margin-bottom: 16px;
}

.bq-field input,
.bq-field textarea {
  width: 100%;

  padding: 12px 16px;

  box-sizing: border-box;

  border: 1px solid var(--bq-accent);
  border-radius: 6px;

  background: transparent;

  color: var(--bq-ink);

  font-family: "Roboto", "Helvetica Neue", sans-serif;
  font-size: 14px;

  outline: none;

  transition: border-color 0.2s ease;
}

.bq-field textarea {
  resize: none;

  line-height: 1.6;
}

.bq-field input::placeholder,
.bq-field textarea::placeholder {
  color: rgba(var(--bq-ink-rgb), 0.45);
}

.bq-field input:focus,
.bq-field textarea:focus {
  border-color: var(--bq-accent-light);
}

.bq-wish-form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 16px;
}

.bq-wish-form__count {
  color: var(--bq-muted);

  font-size: 11px;
}

.bq-wish-submit {
  padding: 8px 24px;

  border: 0;
  border-radius: 999px;

  color: var(--bq-deep);

  background: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: transform 0.2s ease;
}

.bq-wish-submit:hover:not(:disabled) {
  transform: scale(1.05);
}

.bq-wish-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* =========================================================
   TRỐNG
========================================================= */

.bq-wishes__empty {
  margin-top: 32px;
}

.bq-wishes__empty p {
  margin: 0 0 4px;

  color: var(--bq-ink);

  font-size: 14px;
}

.bq-wishes__empty small {
  color: var(--bq-muted);

  font-size: 11px;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.bq-wish-list {
  width: 100%;
  max-width: 248px;
  max-height: 500px;

  margin: 32px auto 0;
  padding-right: 8px;

  overflow-y: auto;

  text-align: left;
}

.bq-wish-card {
  margin-bottom: 12px;
  padding: 16px;

  border: 1px solid var(--bq-line);
  border-radius: 6px;

  background: rgba(var(--bq-accent-rgb), 0.06);

  font-size: 14px;
}

.bq-wish-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.bq-wish-card__head b {
  color: var(--bq-accent);

  font-weight: 600;
}

.bq-wish-card__head span {
  flex-shrink: 0;

  color: var(--bq-ink);

  font-size: 12px;

  opacity: 0.7;
}

.bq-wish-card p {
  margin: 8px 0 0;

  color: var(--bq-ink);

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   CHUYỂN ĐỘNG DANH SÁCH
========================================================= */

.bq-wish-enter-active,
.bq-wish-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.bq-wish-enter-from,
.bq-wish-leave-to {
  opacity: 0;

  transform: translateY(12px);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-heading {
    font-size: 24px;
  }

  .bq-wish-form,
  .bq-wish-list {
    max-width: 380px;
  }

  .bq-wish-list {
    max-width: 600px;
  }
}
</style>
