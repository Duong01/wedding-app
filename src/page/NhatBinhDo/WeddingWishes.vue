<template>
  <section class="cfr-wishes">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="cfr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         FORM
    ====================================================== -->

    <form class="cfr-wishes__form" @submit.prevent="submit">

      <div class="cfr-wishes__box">

        <div class="cfr-wishes__field">
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

        <div class="cfr-wishes__actions">
          <div class="cfr-wishes__tools">
            <button
              type="button"
              class="cfr-wishes__ai"
              title="Tạo lời chúc bằng AI"
              aria-label="Tạo lời chúc bằng AI"
              @click="generateWish"
            >
              🪄
            </button>
          </div>

          <button
            type="submit"
            class="cfr-pill cfr-wishes__submit"
            :disabled="submitting || !form.name || !form.message"
          >
            {{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}
          </button>
        </div>

      </div>

    </form>


    <!-- =====================================================
         DANH SÁCH LỜI CHÚC
    ====================================================== -->

    <div class="cfr-wishes__list">

      <p v-if="!allWishes.length" class="cfr-wishes__empty">
        Hãy là người đầu tiên gửi lời chúc đến cô dâu chú rể nhé ♡
      </p>

      <article
        v-for="(wish, index) in allWishes"
        :key="wish.Id || wish.id || index"
        class="cfr-wishes__item"
      >
        <div class="cfr-wishes__item-head">
          <span class="cfr-wishes__author">
            {{ wishName(wish) }}
          </span>

          <span v-if="wishTime(wish)" class="cfr-wishes__time">
            {{ wishTime(wish) }}
          </span>
        </div>

        <p class="cfr-wishes__message">
          {{ wishMessage(wish) }}
        </p>
      </article>

    </div>

  </section>
</template>


<script setup>
import { computed, reactive, ref } from "vue";

import { useRoute } from "vue-router";

import { sectionText } from "@/data/sectionTitles";

import { addWish, getAllWishes } from "@/model/api";


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  wishes: {
    type: Array,
    default: () => [],
  },

  wedding: {
    type: Object,
    default: () => ({}),
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});

const route = useRoute();


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "guestbook", "Heading")
);


/* =====================================================
   FORM
===================================================== */

const form = reactive({
  name: "",
  message: "",
});

const submitting = ref(false);


/* =====================================================
   LỜI CHÚC
   Ưu tiên dữ liệu thật từ API, fallback về props.wishes
   (guestBook.Guest lưu trong thiệp).
===================================================== */

const localWishes = ref([]);

const allWishes = computed(() =>
  localWishes.value.length ? localWishes.value : props.wishes || []
);


function wishName(wish) {
  return (
    wish?.Name ||
    wish?.name ||
    wish?.GuestName ||
    wish?.guestName ||
    "Khách mời"
  );
}


function wishMessage(wish) {
  return (
    wish?.Message ||
    wish?.message ||
    wish?.Content ||
    wish?.content ||
    ""
  );
}


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
    console.warn("[NhatBinhDo] Không tải được lời chúc:", error);
  }
}


if (route.params.slug && route.name === "WeddingByApi") {
  loadWishes();
}


/* =====================================================
   GỢI Ý LỜI CHÚC
===================================================== */

/*
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


/* =====================================================
   GỬI LỜI CHÚC
===================================================== */

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
    console.error("[NhatBinhDo] Guest book error:", error);

    alert("Đã xảy ra lỗi. Vui lòng thử lại.");
  } finally {
    submitting.value = false;
  }
}
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.cfr-wishes {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;
  max-width: 338px;

  margin: 0 auto;

  color: var(--cfr-red-deep);

  text-align: center;
}


/* =====================================================
   FORM
===================================================== */

.cfr-wishes__form {
  width: 100%;
}

.cfr-wishes__box {
  padding: 16px;

  border: 1px solid var(--cfr-hairline);
  border-radius: 12px;

  background-color: color-mix(in srgb, var(--cfr-cream-2) 45%, transparent);
}

.cfr-wishes__field {
  margin-bottom: 16px;
}

.cfr-wishes__box input,
.cfr-wishes__box textarea {
  width: 100%;

  padding: 12px 16px;

  border: 1px solid var(--cfr-hairline);
  border-radius: 8px;

  background-color: color-mix(in srgb, var(--cfr-cream) 70%, transparent);

  color: var(--cfr-red-deep);

  font-family: var(--cfr-font-body);
  font-size: 16px;

  outline: none;
}

.cfr-wishes__box input::placeholder,
.cfr-wishes__box textarea::placeholder {
  color: color-mix(in srgb, var(--cfr-red-deep) 55%, transparent);
}

.cfr-wishes__box textarea {
  resize: none;
}

.cfr-wishes__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  margin-top: 16px;
}

.cfr-wishes__tools {
  display: flex;
  align-items: center;

  gap: 4px;
}

.cfr-wishes__ai {
  padding: 6px 8px;

  border: none;
  border-radius: 8px;

  background-color: color-mix(in srgb, var(--cfr-red) 8%, transparent);

  font-size: 15px;

  line-height: 1;

  cursor: pointer;

  transition: transform 0.2s ease;
}

.cfr-wishes__ai:hover {
  transform: scale(1.1);
}

.cfr-wishes__submit {
  border: none;

  cursor: pointer;

  transition: transform 0.2s ease;
}

.cfr-wishes__submit:hover:not(:disabled) {
  transform: scale(1.05);
}

.cfr-wishes__submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* =====================================================
   DANH SÁCH
===================================================== */

.cfr-wishes__list {
  display: flex;
  flex-direction: column;

  gap: 12px;

  width: 100%;
  max-height: 500px;

  padding-right: 8px;

  overflow-y: auto;
}

.cfr-wishes__empty {
  margin: 0;

  font-size: 15px;

  text-align: center;

  opacity: 0.75;
}

.cfr-wishes__item {
  padding: 12px;

  border: 1px solid var(--cfr-hairline-soft);
  border-radius: 12px;

  background-color: color-mix(in srgb, var(--cfr-cream-2) 30%, transparent);

  font-size: 16px;

  text-align: start;
}

.cfr-wishes__item-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
}

.cfr-wishes__author {
  color: var(--cfr-red);

  font-weight: 600;
}

.cfr-wishes__time {
  flex-shrink: 0;

  font-size: 14px;

  opacity: 0.7;
}

.cfr-wishes__message {
  margin: 8px 0 0;

  line-height: 1.6;

  white-space: pre-line;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .cfr-wishes {
    max-width: 560px;

    gap: 32px;
  }

  .cfr-wishes__box {
    padding: 20px;
  }

  .cfr-wishes__box input,
  .cfr-wishes__box textarea {
    padding: 14px 16px;

    font-size: 17px;
  }

  .cfr-wishes__item {
    padding: 16px;

    font-size: 17px;
  }

  .cfr-wishes__time {
    font-size: 15px;
  }
}


@media (min-width: 1024px) {
  .cfr-wishes {
    max-width: 600px;
  }
}
</style>
