<template>
  <section class="shc-wishes">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shc-wishes__title">Sổ lưu bút</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shc-wishes__inner">
      <!-- FORM GỬI LỜI CHÚC -->

      <form class="shc-wish-form" @submit.prevent="submitWish">
        <input
          v-model.trim="form.name"
          type="text"
          class="shc-wish-form__input"
          maxlength="500"
          placeholder="Nhập tên*"
          required
        />

        <textarea
          v-model.trim="form.message"
          class="shc-wish-form__textarea"
          maxlength="10000"
          placeholder="Nhập lời chúc*"
          rows="4"
          required
        ></textarea>

        <div class="shc-wish-form__actions">
          <button
            type="submit"
            class="shc-wish-form__submit"
            :disabled="!canSubmit || submitting"
          >
            {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
          </button>
        </div>
      </form>

      <!-- =========================================
           CHƯA CÓ LỜI CHÚC
      ========================================== -->

      <div v-if="items.length === 0" class="shc-wishes__empty">
        <p>Chưa có lời chúc nào</p>

        <span>Hãy là người đầu tiên gửi lời yêu thương</span>
      </div>

      <!-- =========================================
           DANH SÁCH LỜI CHÚC
      ========================================== -->

      <div v-else class="shc-wish-list">
        <article
          v-for="(item, index) in items"
          :key="item.Id || index"
          class="shc-wish-card"
        >
          <div class="shc-wish-card__header">
            <span class="shc-wish-card__name">{{ getName(item) }}</span>

            <span v-if="item.CreatedAt" class="shc-wish-card__time">
              {{ formatTime(item.CreatedAt) }}
            </span>
          </div>

          <p class="shc-wish-card__message">{{ getMessage(item) }}</p>
        </article>
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
    console.warn("[SongHacRed][Wishes] Không tải được lời chúc:", error);
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
.shc-wishes {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);

  position: relative;

  overflow: hidden;

  margin-top: 23px;
  padding: 24px 37px 40px;

  color: var(--shc-cream);

  background-color: var(--shc-red);

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.shc-wishes__title {
  margin: 0 0 24px;

  color: var(--shc-cream);

  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-wishes__inner {
  display: flex;
  flex-direction: column;

  gap: 22px;

  width: 100%;

  text-align: left;
}

/* =========================================================
   FORM
========================================================= */

.shc-wish-form {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

.shc-wish-form__input,
.shc-wish-form__textarea {
  width: 100%;

  padding: 8px 10px;

  border: 1px solid var(--shc-cream);
  border-radius: 6px;

  color: var(--shc-cream);

  background: transparent;

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;

  outline: none;

  transition: border-color 0.2s ease;
}

.shc-wish-form__input:focus,
.shc-wish-form__textarea:focus {
  border-color: #ffffff;
}

.shc-wish-form__input::placeholder,
.shc-wish-form__textarea::placeholder {
  color: rgba(255, 232, 164, 0.55);
}

.shc-wish-form__textarea {
  resize: none;
}

.shc-wish-form__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.shc-wish-form__submit {
  padding: 6px 16px;

  border: 0;
  border-radius: 7px;

  color: var(--shc-red);

  background: var(--shc-cream);

  font-family: "Times New Roman", Times, serif;
  font-size: 13px;

  cursor: pointer;

  transition: transform 0.2s ease, opacity 0.2s ease;
}

.shc-wish-form__submit:hover:not(:disabled) {
  transform: scale(1.05);
}

.shc-wish-form__submit:disabled {
  cursor: not-allowed;

  opacity: 0.6;
}

/* =========================================================
   CHƯA CÓ LỜI CHÚC
========================================================= */

.shc-wishes__empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  padding: 30px 0;

  color: rgba(255, 232, 164, 0.6);

  text-align: center;
}

.shc-wishes__empty p {
  margin: 0;

  font-size: 14px;
}

.shc-wishes__empty span {
  font-size: 12px;
}

/* =========================================================
   DANH SÁCH LỜI CHÚC
========================================================= */

.shc-wish-list {
  display: flex;
  flex-direction: column;

  gap: 12px;

  max-height: 500px;

  padding-right: 8px;

  overflow-y: auto;
}

.shc-wish-card {
  padding: 16px;

  border: 1px solid rgba(255, 232, 164, 0.33);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.07);

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shc-wish-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 10px;
}

.shc-wish-card__name {
  color: var(--shc-cream);

  font-size: 14px;
  font-weight: 600;
}

.shc-wish-card__time {
  color: rgba(255, 232, 164, 0.7);

  font-size: 12px;

  white-space: nowrap;
}

.shc-wish-card__message {
  margin: 8px 0 0;

  color: rgba(255, 232, 164, 0.9);

  font-size: 14px;

  line-height: 1.6;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-wishes {
    margin-top: 31px;
    padding: 32px 50px 56px;
  }

  .shc-wishes__title {
    font-size: 27px;
  }

  .shc-wish-form__input,
  .shc-wish-form__textarea {
    font-size: 15px;
  }

  .shc-wish-form__submit {
    font-size: 18px;
  }
}
</style>
