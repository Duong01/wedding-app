<template>
  <section class="tr-wishes">
    <h2 class="tr-wishes__title">Sổ lưu bút</h2>

    <!-- =====================================================
         FORM GỬI LỜI CHÚC
    ====================================================== -->

    <form class="tr-wishes__form" @submit.prevent="submit">
      <div class="tr-wishes__field">
        <input
          v-model.trim="form.name"
          type="text"
          placeholder="Nhập tên của bạn*"
          maxlength="500"
          autocomplete="name"
        />
      </div>

      <textarea
        v-model.trim="form.message"
        placeholder="Nhập lời chúc của bạn*"
        rows="4"
        maxlength="10000"
      ></textarea>

      <div class="tr-wishes__actions">
        <div class="tr-wishes__tools">
          <button
            type="button"
            class="tr-wishes__ai"
            title="Tạo lời chúc bằng AI"
            aria-label="Tạo lời chúc bằng AI"
            @click="generateWish"
          >
            🪄
          </button>
        </div>

        <button
          type="submit"
          class="tr-wishes__submit"
          :disabled="submitting || !form.name || !form.message"
        >
          {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
        </button>
      </div>
    </form>

    <!-- =====================================================
         DANH SÁCH LỜI CHÚC
    ====================================================== -->

    <div class="tr-wishes__list">
      <p v-if="!allWishes.length" class="tr-wishes__empty">
        Chưa có lời chúc nào. Hãy là người đầu tiên!
      </p>

      <article
        v-for="(wish, index) in allWishes"
        :key="wish.Id || wish.id || index"
        class="tr-wishes__item"
      >
        <div class="tr-wishes__item-head">
          <strong class="tr-wishes__author">
            {{ wish.name || wish.Name || wish.guestName || wish.GuestName || "Một người bạn" }}
          </strong>

          <span v-if="wishTime(wish)" class="tr-wishes__time">
            {{ wishTime(wish) }}
          </span>
        </div>

        <p class="tr-wishes__message">
          {{ wish.message || wish.Message || wish.content || wish.Content || "" }}
        </p>
      </article>
    </div>
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
    default: null,
  },
});

const route = useRoute();

/* =========================================================
   FORM
========================================================= */

const form = reactive({
  name: "",
  message: "",
});

const submitting = ref(false);

/* =========================================================
   LỜI CHÚC
   Ưu tiên dữ liệu thật từ API, fallback về props.wishes
   (guestBook.Guest lưu trong thiệp).
========================================================= */

const localWishes = ref([]);

const allWishes = computed(() =>
  localWishes.value.length ? localWishes.value : props.wishes || []
);

/* =========================================================
   THỜI GIAN GỬI
========================================================= */

function wishTime(wish) {
  return (
    wish?.CreatedAt ||
    wish?.createdAt ||
    wish?.CreatedDate ||
    wish?.createdDate ||
    ""
  );
}

async function loadWishes() {
  const slug = route.params.slug;

  if (!slug) return;

  try {
    const response = await getAllWishes({ slug });

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      localWishes.value = result.data;
    }
  } catch (error) {
    console.warn("[TraditionalRed] Không tải được lời chúc:", error);
  }
}

if (route.params.slug && route.name === "WeddingByApi") {
  loadWishes();
}

/* =========================================================
   GỬI LỜI CHÚC
========================================================= */

/*
 * Gợi ý lời chúc.
 *
 * Mẫu gốc gọi API AI của hệ thống; repo hiện chưa có endpoint đó
 * nên dùng danh sách câu chúc soạn sẵn, chọn ngẫu nhiên.
 * Khi có API, chỉ cần thay thân hàm này bằng lời gọi API.
 */
const WISH_TEMPLATES = [
  "Chúc hai bạn trăm năm hạnh phúc, sớm sinh quý tử!",
  "Chúc mừng hai bạn về chung một nhà. Mong hai bạn luôn yêu thương nhau như ngày đầu!",
  "Chúc cô dâu chú rể trăm năm hảo hợp, gia đình luôn đầm ấm.",
  "Mừng hạnh phúc hai bạn! Chúc hai bạn luôn nắm tay nhau đi hết chặng đường dài.",
  "Mong rằng cuộc sống hôn nhân sẽ là hành trình tuyệt vời nhất của hai bạn.",
  "Chúc hai bạn một đời bình an, một nhà hạnh phúc, một lòng son sắt.",
];

function generateWish() {
  const current = form.message.trim();

  const options = WISH_TEMPLATES.filter((item) => item !== current);

  form.message = options[Math.floor(Math.random() * options.length)];
}

async function submit() {
  if (submitting.value) return;

  const name = form.name.trim();
  const message = form.message.trim();

  if (!name) {
    alert("Vui lòng nhập tên của bạn.");

    return;
  }

  if (!message) {
    alert("Vui lòng nhập lời chúc.");

    return;
  }

  submitting.value = true;

  try {
    const slug = route.params.slug
      ? route.params.token
        ? `${route.params.slug}/${route.params.token}`
        : route.params.slug
      : "";

    const response = await addWish({ slug, guestName: name, message });

    const result = response?.data;

    if (!result || result.status !== "success") {
      throw new Error(result?.message || "Gửi lời chúc thất bại.");
    }

    alert("Cảm ơn bạn! Lời chúc đã được gửi ❤️");

    form.name = "";
    form.message = "";

    await loadWishes();
  } catch (error) {
    console.error("Guest book error:", error);

    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.tr-wishes {
  position: relative;

  z-index: 10;

  padding: 40px 16px 32px;

  color: #ffe3b1;
}

.tr-wishes__title {
  margin: 0;

  text-align: center;

  color: #ffe3b1;

  font-family: "Pattaya", "Great Vibes", cursive;

  font-size: 22px;

  font-weight: 400;
}

/* =========================================================
   FORM
========================================================= */

.tr-wishes__form {
  display: flex;

  flex-direction: column;

  gap: 12px;

  width: 100%;
  max-width: 600px;

  margin: 24px auto 0;
}

.tr-wishes__field {
  margin-bottom: 4px;
}

.tr-wishes__form input,
.tr-wishes__form textarea {
  width: 100%;

  padding: 8px 16px;

  border: 1px solid #ffe3b1;

  border-radius: 6px;

  background-color: transparent;

  color: #ffe3b1;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 13px;

  outline: none;
}

.tr-wishes__form input::placeholder,
.tr-wishes__form textarea::placeholder {
  color: rgba(255, 227, 177, 0.6);
}

.tr-wishes__form textarea {
  resize: none;
}

.tr-wishes__actions {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 12px;

  margin-top: 4px;
}

.tr-wishes__tools {
  display: flex;

  align-items: center;

  gap: 4px;
}

.tr-wishes__ai {
  padding: 8px;

  border: none;

  border-radius: 8px;

  cursor: pointer;

  background-color: rgba(255, 227, 177, 0.1);

  color: #ffe3b1;

  font-size: 16px;

  line-height: 1;

  transition: transform 0.2s ease;
}

.tr-wishes__ai:hover {
  transform: scale(1.1);
}

.tr-wishes__submit {
  padding: 6px 16px;

  border: none;

  border-radius: 999px;

  cursor: pointer;

  background-color: #ffe3b1;

  color: #680e0e;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 12px;

  font-weight: 600;

  transition: transform 0.2s ease;
}

.tr-wishes__submit:hover:not(:disabled) {
  transform: scale(1.05);
}

.tr-wishes__submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.tr-wishes__list {
  display: flex;

  flex-direction: column;

  gap: 12px;

  width: 100%;
  max-width: 600px;

  max-height: 500px;

  margin: 32px auto 0;

  padding-right: 8px;

  overflow-y: auto;
}

.tr-wishes__empty {
  margin: 0;

  text-align: center;

  font-size: 14px;

  opacity: 0.7;
}

.tr-wishes__item {
  padding: 12px 16px;

  border: 1px solid rgba(255, 227, 177, 0.4);

  border-radius: 10px;

  background-color: rgba(255, 227, 177, 0.1);
}

.tr-wishes__item-head {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
}

.tr-wishes__time {
  flex-shrink: 0;

  font-size: 12px;

  opacity: 0.7;
}

.tr-wishes__author {
  display: block;

  margin-bottom: 4px;

  color: #ffe3b1;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 14px;

  font-weight: 600;
}

.tr-wishes__message {
  margin: 0;

  color: rgba(255, 227, 177, 0.85);

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 14px;

  line-height: 1.6;

  white-space: pre-line;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-wishes {
    padding: 48px 32px 40px;
  }

  .tr-wishes__title {
    font-size: 24px;
  }

  .tr-wishes__form input,
  .tr-wishes__form textarea {
    font-size: 14px;
  }

  .tr-wishes__submit {
    font-size: 13px;
  }
}
</style>
