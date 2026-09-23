<template>
  <section class="rr-wishes">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="rr-wishes__heading">
      {{ heading }}
    </h2>


    <!-- =====================================================
         FORM GỬI LỜI CHÚC
    ====================================================== -->

    <form class="rr-wishes__form" @submit.prevent="submit">

      <input
        v-model.trim="form.name"
        class="rr-wishes__input"
        type="text"
        :placeholder="namePlaceholder"
        maxlength="100"
        autocomplete="name"
      />

      <textarea
        v-model.trim="form.message"
        class="rr-wishes__textarea"
        :placeholder="messagePlaceholder"
        rows="4"
        maxlength="500"
      ></textarea>

      <div class="rr-wishes__actions">

        <span class="rr-wishes__count">
          {{ form.message.length }}/500
        </span>

        <button
          type="submit"
          class="rr-wishes__submit"
          :disabled="!form.name || !form.message || submitting"
        >
          {{ submitting ? "ĐANG GỬI..." : submitLabel }}
        </button>

      </div>

    </form>


    <!-- =====================================================
         DANH SÁCH LỜI CHÚC
    ====================================================== -->

    <div v-if="allWishes.length" class="rr-wishes__list">

      <article
        v-for="(wish, index) in allWishes"
        :key="wish.Id || wish.id || index"
        class="rr-wishes__item"
      >

        <div class="rr-wishes__item-head">
          <span class="rr-wishes__author">
            {{
              wish.name ||
              wish.Name ||
              wish.guestName ||
              wish.GuestName ||
              "Một người bạn"
            }}
          </span>

          <span v-if="wish.CreatedAt || wish.createdAt" class="rr-wishes__time">
            {{ wish.CreatedAt || wish.createdAt }}
          </span>
        </div>

        <p class="rr-wishes__message">
          {{
            wish.message ||
            wish.Message ||
            wish.content ||
            wish.Content ||
            ""
          }}
        </p>

      </article>

    </div>


    <!-- =====================================================
         CHƯA CÓ LỜI CHÚC
    ====================================================== -->

    <p v-else class="rr-wishes__empty">
      {{ emptyText }}
    </p>

  </section>
</template>


<script setup>
import { computed, reactive, ref } from "vue";

import { useRoute } from "vue-router";

import { addWish, getAllWishes } from "@/model/api";
import { sectionText } from "@/data/sectionTitles";


/* =========================================================
   PROPS
========================================================= */

const props = defineProps({
  wishes: {
    type: Array,
    default: () => [],
  },

  wedding: {
    type: Object,
    default: null,
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =========================================================
   TIÊU ĐỀ MỤC
========================================================= */

const heading = computed(() =>
  sectionText(props.sections, "guestbook", "Heading", "Sổ lưu bút")
);

const namePlaceholder = "Nhập tên của bạn*";

const messagePlaceholder = "Nhập lời chúc của bạn*";

const submitLabel = "GỬI LỜI CHÚC";

const emptyText = computed(() =>
  sectionText(
    props.sections,
    "guestbook",
    "Intro",
    "Hãy là người đầu tiên gửi những lời chúc tốt đẹp nhất đến cô dâu chú rể."
  )
);


/* =========================================================
   FORM
========================================================= */

const form = reactive({
  name: "",
  message: "",
});


/* =========================================================
   STATE
========================================================= */

const submitting = ref(false);

/*
 * Lời chúc lấy từ API (getAllWishes) — dữ liệu thật
 * khách mời đã gửi. Fallback về props.wishes
 * (guestBook.Guest lưu trong thiệp) khi API trống.
 */
const route = useRoute();

const localWishes = ref([]);

const allWishes = computed(() => {
  if (localWishes.value.length) {
    return localWishes.value;
  }

  return props.wishes || [];
});

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
   GỬI LỜI CHÚC
========================================================= */

async function submit() {
  if (submitting.value) {
    return;
  }

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
    /*
     * Gửi lời chúc lên API (addWish).
     * Slug kèm token để ghi đúng thiệp của khách mời.
     */
    const slug = route.params.slug
      ? route.params.token
        ? `${route.params.slug}/${route.params.token}`
        : route.params.slug
      : "";

    const response = await addWish({
      slug,
      guestName: name,
      message,
    });

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

.rr-wishes {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;

  padding: 0 16px;

  color: var(--rr-red);
}


/* =========================================================
   TIÊU ĐỀ
========================================================= */

.rr-wishes__heading {
  margin: 0;

  color: var(--rr-red);

  font-family: var(--rr-font-guestbook);
  font-size: 22px;
  font-weight: 400;

  line-height: 1.4;

  text-align: center;
}


/* =========================================================
   FORM
========================================================= */

.rr-wishes__form {
  display: flex;
  flex-direction: column;

  gap: 12px;

  width: 100%;
  max-width: 600px;
}

.rr-wishes__input,
.rr-wishes__textarea {
  width: 100%;

  padding: 8px 16px;

  border: 1px solid var(--rr-red);
  border-radius: 6px;

  background-color: #ffffff;
  color: var(--rr-red);

  font-family: var(--rr-font-body);
  font-size: 13px;

  line-height: 1.6;
}

.rr-wishes__input::placeholder,
.rr-wishes__textarea::placeholder {
  color: var(--rr-red);

  opacity: 0.55;
}

.rr-wishes__input:focus,
.rr-wishes__textarea:focus {
  outline: none;

  box-shadow: 0 0 0 2px var(--rr-hairline-soft);
}

.rr-wishes__textarea {
  resize: none;
}

.rr-wishes__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;
}

.rr-wishes__count {
  font-size: 12px;

  opacity: 0.6;
}

.rr-wishes__submit {
  padding: 6px 16px;

  border: none;
  border-radius: 999px;

  background-color: var(--rr-red);
  color: #ffffff;

  font-family: var(--rr-font-body);
  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.02em;

  cursor: pointer;

  transition: transform 0.2s ease, opacity 0.2s ease;
}

.rr-wishes__submit:hover:not(:disabled) {
  transform: scale(1.05);
}

.rr-wishes__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* =========================================================
   DANH SÁCH
========================================================= */

.rr-wishes__list {
  display: flex;
  flex-direction: column;

  gap: 12px;

  width: 100%;
  max-width: 600px;
  max-height: 500px;

  overflow-y: auto;

  padding-right: 8px;
}

.rr-wishes__item {
  padding: 12px;

  border: 1px solid var(--rr-hairline);
  border-radius: 8px;

  background-color: #ffffff;

  font-size: 13px;
}

.rr-wishes__item-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
}

.rr-wishes__author {
  color: var(--rr-red);

  font-weight: 600;
}

.rr-wishes__time {
  flex-shrink: 0;

  font-size: 12px;

  opacity: 0.7;
}

.rr-wishes__message {
  margin: 8px 0 0;

  line-height: 1.7;

  white-space: pre-line;
}


/* =========================================================
   EMPTY
========================================================= */

.rr-wishes__empty {
  max-width: 420px;

  margin: 0;

  font-size: 14px;

  line-height: 1.7;

  text-align: center;

  opacity: 0.75;
}


/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .rr-wishes {
    gap: 32px;

    padding: 0 32px;
  }

  .rr-wishes__heading {
    font-size: 24px;
  }

  .rr-wishes__input,
  .rr-wishes__textarea {
    font-size: 14px;
  }
}
</style>
