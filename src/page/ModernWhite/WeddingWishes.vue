<template>
  <section class="wishes">
    <!-- =========================================
         HEADER
    ========================================== -->

    <div class="wish-heading">
      <span class="wish-kicker"> LỜI CHÚC YÊU THƯƠNG </span>

      <h2>GỬI ĐẾN CHÚNG MÌNH</h2>

      <div class="wish-decoration">
        <span></span>
        <b>囍</b>
        <span></span>
      </div>
    </div>

    <!-- =========================================
         CHẠY LỜI CHÚC NGANG
    ========================================== -->

    <div v-if="allWishes.length" class="wish-marquee">
      <div class="wish-marquee-track">
        <div
          v-for="(wish, index) in allWishes"
          :key="wish?.Id || index"
          class="wish-marquee-item"
        >
          <span class="marquee-name">
            {{ getName(wish) }}
          </span>

          <span class="marquee-dot"> ♥ </span>

          <span class="marquee-message">
            {{ getMessage(wish) }}
          </span>
        </div>
      </div>
    </div>

    <!-- =========================================
         FORM
    ========================================== -->

    <form class="wish-form">
      <div class="form-title">
        <span class="form-title-icon">♡</span>

        <span> GỬI LỜI CHÚC ĐẾN CÔ DÂU CHÚ RỂ </span>

        <span class="form-title-icon">♡</span>
      </div>

      <div class="form-group">
        <label> HỌ VÀ TÊN </label>

        <div class="input-wrap">
          <input
            v-model="form.name"
            type="text"
            maxlength="80"
            placeholder="Nhập tên của bạn"
          />
        </div>
      </div>

      <div class="form-group">
        <label> LỜI CHÚC </label>

        <div class="input-wrap textarea-wrap">
          <textarea
            v-model="form.message"
            rows="4"
            maxlength="500"
            placeholder="Gửi những lời chúc tốt đẹp nhất..."
          ></textarea>
        </div>
      </div>

      <button type="button" :disabled="!canSubmit || submitting" class="submit-button" @click="submitWish">
        <span> ♡ </span>

        GỬI LỜI CHÚC

        <span> ♡ </span>
      </button>
    </form>

    <!-- =========================================
         DANH SÁCH LỜI CHÚC
    ========================================== -->

    <div v-if="allWishes.length" class="wish-list-wrapper">
      <div class="list-heading">
        <span></span>

        <strong> NHỮNG LỜI CHÚC </strong>

        <span></span>
      </div>

      <div class="wish-list">
        <article
          v-for="(wish, index) in allWishes"
          :key="wish?.Id || index"
          class="wish"
        >
          <div class="wish-mark">囍</div>

          <div class="wish-content">
            <div class="wish-name">
              {{ getName(wish) }}
            </div>

            <p>
              {{ getMessage(wish) }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->

    <div v-else class="wish-empty">
      Hãy là người đầu tiên gửi lời chúc đến cô dâu chú rể nhé ♡
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { addWish, getAllWishes } from "@/model/api";import { useRoute } from "vue-router";
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

/* =========================================
   FORM
========================================= */
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

const canSubmit = computed(() => {
  return form.name.trim().length > 0 && form.message.trim().length > 0;
});

/* =========================================
   GET NAME
========================================= */

function getName(wish) {
  return wish?.Name || wish?.GuestName || wish?.FullName || "Khách mời";
}

/* =========================================
   GET MESSAGE
========================================= */

function getMessage(wish) {
  return wish?.Message || wish?.Content || wish?.Wish || "";
}

/* =========================================
   LOAD WISHES
========================================= */

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

loadWishes();

/* =========================================
   SUBMIT
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

      emit("submit", param);

      await loadWishes();
    } else {
      alert(result?.message || "Không thể gửi lời chúc.");
    }
  } catch (error) {
    console.error(error);
    alert(
      error?.response?.data?.message ||
        "Có lỗi xảy ra, vui lòng thử lại."
    );
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* =====================================================
   ROOT
===================================================== */

.wishes {
  width: 100%;

  color: #641316;

  font-family: Arial, "Helvetica Neue", sans-serif;
}

/* =====================================================
   HEADING
===================================================== */

.wish-heading {
  text-align: center;

  margin-bottom: 20px;
}

.wish-kicker {
  display: block;

  margin-bottom: 5px;

  color: #a77b3d;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 2.5px;
}

.wish-heading h2 {
  margin: 0;

  color: #801519;

  font-family: Arial, "Helvetica Neue", sans-serif;

  font-size: 21px;
  font-weight: 800;

  letter-spacing: 1px;
}

.wish-decoration {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-top: 8px;
}

.wish-decoration span {
  width: 36px;

  height: 1px;

  background: linear-gradient(to right, transparent, #b78b4a);
}

.wish-decoration span:last-child {
  background: linear-gradient(to left, transparent, #b78b4a);
}

.wish-decoration b {
  color: #9a171b;

  font-family: Arial, "Helvetica Neue", sans-serif;

  font-size: 16px;
}

/* =====================================================
   MARQUEE
===================================================== */

.wish-marquee {
  position: relative;

  width: 100%;

  height: 58px;

  margin-bottom: 22px;

  overflow-x: auto;

  overflow-y: hidden;

  border-top: 1px solid rgba(181, 139, 67, 0.28);

  border-bottom: 1px solid rgba(181, 139, 67, 0.28);

  background: linear-gradient(
    90deg,
    rgba(255, 250, 239, 0.95),
    rgba(250, 240, 218, 0.65),
    rgba(255, 250, 239, 0.95)
  );

  scrollbar-width: thin;

  scrollbar-color: rgba(166, 123, 61, 0.45) transparent;
}

/*
 * Hai lớp mờ ở hai bên
 * tạo cảm giác nội dung chạy vào/ra.
 */

.wish-marquee::before,
.wish-marquee::after {
  content: "";

  position: absolute;

  z-index: 3;

  top: 0;

  width: 30px;

  height: 100%;

  pointer-events: none;
}

.wish-marquee::before {
  left: 0;

  background: linear-gradient(to right, #fffaf0, transparent);
}

.wish-marquee::after {
  right: 0;

  background: linear-gradient(to left, #fffaf0, transparent);
}

/* =====================================================
   MARQUEE TRACK
===================================================== */

.wish-marquee-track {
  display: inline-flex;

  align-items: center;

  gap: 14px;

  min-width: max-content;

  height: 100%;

  padding: 0 30px;
}

/* =====================================================
   MARQUEE ITEM
===================================================== */

.wish-marquee-item {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  min-height: 34px;

  padding: 7px 13px;

  border: 1px solid rgba(181, 139, 67, 0.3);

  border-radius: 20px;

  background: rgba(255, 255, 255, 0.72);

  white-space: nowrap;

  box-shadow: 0 3px 10px rgba(104, 57, 25, 0.05);
}

.marquee-name {
  color: #8c1519;

  font-family: Arial, "Helvetica Neue", sans-serif;

  font-size: 10px;
  font-weight: 700;
}

.marquee-message {
  color: #705744;

  font-family: Arial, "Helvetica Neue", sans-serif;

  font-size: 10px;
  font-weight: 400;

  line-height: 1.5;
}

/* =====================================================
   FORM
===================================================== */

.wish-form {
  width: 100%;

  padding: 20px 18px 18px;

  border: 1px solid rgba(181, 139, 67, 0.38);

  background: linear-gradient(
    145deg,
    rgba(255, 251, 242, 0.96),
    rgba(250, 240, 218, 0.58)
  );

  box-shadow: 0 8px 24px rgba(100, 48, 24, 0.05);
}

.form-title,
.form-group label,
.form-group input,
.form-group textarea,
.submit-button {
  font-family: Arial, "Helvetica Neue", sans-serif;
}

/* =====================================================
   FORM TITLE
===================================================== */

.form-title {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-bottom: 18px;

  color: #8d171b;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1.5px;

  text-align: center;
}

.form-title-icon {
  color: #b18443;

  font-size: 11px;
}

/* =====================================================
   FORM GROUP
===================================================== */

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;

  margin-bottom: 6px;

  color: #8d171b;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1.5px;
}

/* =====================================================
   INPUT
===================================================== */

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;

  top: 50%;

  left: 11px;

  z-index: 2;

  color: #b18443;

  font-size: 11px;

  transform: translateY(-50%);

  pointer-events: none;
}

.input-wrap textarea + .input-icon {
  top: 13px;
}

.form-group input,
.form-group textarea {
  display: block;

  box-sizing: border-box;

  width: 100%;

  border: 1px solid #d6c39e;

  border-radius: 0;

  outline: none;

  padding: 11px 12px 11px 32px;

  color: #604b39;

  background: rgba(255, 255, 255, 0.72);

  font-family: Arial, "Helvetica Neue", sans-serif;

  font-size: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-group textarea {
  min-height: 92px;

  resize: vertical;

  line-height: 1.6;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #ae9a82;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #a77b3d;

  background: #fffdf7;

  box-shadow: 0 0 0 3px rgba(167, 123, 61, 0.08);
}

/* =====================================================
   SUBMIT
===================================================== */

.submit-button {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  width: 100%;

  height: 42px;

  border: 1px solid #8f1519;

  color: #fff9ef;

  background: linear-gradient(135deg, #a51b20, #781115);

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.8px;

  cursor: pointer;

  box-shadow: 0 5px 15px rgba(121, 17, 21, 0.15);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.submit-button span {
  color: #f2d9a7;

  font-size: 12px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow: 0 8px 20px rgba(121, 17, 21, 0.22);
}

.submit-button:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}

/* =====================================================
   LIST WRAPPER
===================================================== */

.wish-list-wrapper {
  margin-top: 25px;
}

/* =====================================================
   LIST HEADING
===================================================== */

.list-heading {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  margin-bottom: 10px;
}

.list-heading span {
  width: 35px;

  height: 1px;

  background: #c19b5d;
}

.list-heading strong {
  color: #9a171b;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 2px;
}

/* =====================================================
   SCROLL LIST
===================================================== */

.wish-list {
  max-height: 300px;

  overflow-y: auto;

  overflow-x: hidden;

  padding-right: 5px;

  scrollbar-width: thin;

  scrollbar-color: rgba(166, 123, 61, 0.45) transparent;
}

/* =====================================================
   WISH
===================================================== */

.wish {
  position: relative;

  display: flex;

  gap: 12px;

  padding: 14px 5px;

  border-bottom: 1px solid rgba(181, 139, 67, 0.2);
}

.wish:first-child {
  padding-top: 8px;
}

.wish-mark {
  flex: 0 0 28px;

  width: 28px;

  height: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-top: 1px;

  color: #9b171b;

  border: 1px solid rgba(181, 139, 67, 0.4);

  background: rgba(255, 249, 235, 0.8);

  font-family: Arial, "Helvetica Neue", sans-serif;

  font-size: 13px;
}

/* =====================================================
   WISH CONTENT
===================================================== */

.wish-content {
  min-width: 0;

  text-align: left;
}

.wish-name {
  color: #8d1519;

  font-family: Arial, "Helvetica Neue", sans-serif;

  font-size: 12px;
  font-weight: 700;
}

.wish p {
  margin: 4px 0 0;

  color: #705947;

  font-family: Arial, "Helvetica Neue", sans-serif;

  font-size: 11px;
  font-weight: 400;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.wish-empty {
  margin-top: 20px;

  padding: 20px;

  color: #987b5d;

  border: 1px dashed rgba(181, 139, 67, 0.35);

  background: rgba(255, 250, 240, 0.45);

  font-size: 11px;

  line-height: 1.7;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .wish-heading h2 {
    font-size: 19px;
  }

  .wish-kicker {
    font-size: 7px;

    letter-spacing: 2px;
  }

  .wish-marquee {
    height: 54px;
  }

  .wish-marquee-item {
    padding: 6px 11px;
  }

  .marquee-name {
    font-size: 9px;
  }

  .marquee-message {
    max-width: 210px;

    font-size: 9px;
  }

  .wish-form {
    padding: 18px 14px;
  }

  .wish-list {
    max-height: 280px;
  }
}
</style>
