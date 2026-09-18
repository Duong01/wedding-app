<template>
  <section class="lp-wishes">
    <div class="lp-section-title">
      <h2>SỔ LƯU BÚT</h2>
    </div>

    <p class="lp-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         FORM LỜI CHÚC
    ========================================== -->
    <div class="lp-wish-form-card">
      <div class="lp-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="lp-wish-marquee">
        <div class="lp-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="lp-marquee-window">
          <div class="lp-wish-track">
            <div class="lp-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="lp-wish-marquee-item"
              >
                <i>✦</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="lp-marquee-dot">✧</b>
              </span>
            </div>

            <div class="lp-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="lp-wish-marquee-item"
              >
                <i>✦</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="lp-marquee-dot">✧</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="lp-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="lp-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="lp-input-group">
          <label>LỜI CHÚC</label>

          <div class="lp-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="lp-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="lp-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         TRỐNG
    ========================================== -->
    <div v-if="items.length === 0" class="lp-no-wishes">
      <div class="lp-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         DANH SÁCH LỜI CHÚC
    ========================================== -->
    <div v-else class="lp-wish-list">
      <div class="lp-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="lp-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="lp-wish-card">
          <div class="lp-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="lp-wish-content">
            <div class="lp-wish-header">
              <div>
                <b>{{ getName(item) }}</b>

                <span v-if="item.CreatedAt">
                  {{ formatTime(item.CreatedAt) }}
                </span>
              </div>

              <v-icon size="13">mdi-heart-outline</v-icon>
            </div>

            <p>{{ getMessage(item) }}</p>
          </div>
        </article>
      </TransitionGroup>
    </div>

    <!-- =========================================
         BOTTOM
    ========================================== -->
    <div class="lp-wishes__bottom">
      <span></span>

      <i>✦</i>

      <span></span>
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
   LOAD WISHES
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
    console.warn("[LongPhungV3][Wishes] Không tải được lời chúc:", error);
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
.lp-wishes {
  position: relative;

  width: min(600px, calc(100% - 24px));

  margin: 24px auto 30px;
  padding: 30px 16px 24px;

  text-align: center;

  color: #ffbe89;
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 14px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: #ffbe89;
}

.lp-wishes__intro {
  margin: 0 0 22px;

  font-size: 12px;

  line-height: 1.7;

  color: rgba(255, 190, 137, 0.7);
}

/* =========================================================
   FORM CARD
========================================================= */

.lp-wish-form-card {
  position: relative;

  padding: 24px 20px;

  border: 1px solid rgba(255, 190, 137, 0.66);
  border-radius: 16px;

  background: rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(4px);

  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);

  text-align: left;
}

.lp-form-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-bottom: 18px;

  font-size: 14px;
  font-weight: 600;

  color: #ffbe89;
}

/* =========================================================
   MARQUEE
========================================================= */

.lp-wish-marquee {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 18px;

  padding: 8px 12px;

  border: 1px solid rgba(255, 190, 137, 0.3);
  border-radius: 10px;

  background: rgba(255, 190, 137, 0.06);
}

.lp-marquee-label {
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.14em;

  color: rgba(255, 190, 137, 0.8);
}

.lp-marquee-window {
  flex: 1;
  min-width: 0;

  overflow: hidden;

  -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
}

.lp-wish-track {
  display: flex;

  width: max-content;

  animation: lp-marquee 32s linear infinite;
}

.lp-wish-track-content {
  display: flex;
  align-items: center;
}

.lp-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 0 10px;

  white-space: nowrap;

  font-size: 11px;

  color: rgba(255, 190, 137, 0.85);
}

.lp-wish-marquee-item i {
  font-size: 8px;
  font-style: normal;

  color: #d4af37;
}

.lp-wish-marquee-item strong {
  font-weight: 700;

  color: #ffbe89;
}

.lp-wish-marquee-item em {
  font-style: italic;

  color: rgba(255, 190, 137, 0.7);
}

.lp-marquee-dot {
  font-size: 8px;

  color: rgba(255, 190, 137, 0.4);
}

@keyframes lp-marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

/* =========================================================
   INPUT
========================================================= */

.lp-input-group {
  margin-bottom: 14px;
}

.lp-input-group label {
  display: block;

  margin-bottom: 6px;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;

  color: rgba(255, 190, 137, 0.75);
}

.lp-input-wrap,
.lp-textarea-wrap {
  position: relative;

  display: flex;
  align-items: center;
}

.lp-textarea-wrap {
  align-items: flex-start;
}

.lp-input-wrap .v-icon,
.lp-textarea-wrap .v-icon {
  position: absolute;

  left: 12px;

  top: 50%;

  transform: translateY(-50%);

  color: rgba(255, 190, 137, 0.6);

  pointer-events: none;
}

.lp-textarea-wrap .v-icon {
  top: 18px;

  transform: none;
}

.lp-input-wrap input,
.lp-textarea-wrap textarea {
  width: 100%;

  padding: 11px 13px 11px 38px;

  border: 1px solid #ffbe89;
  border-radius: 6px;

  outline: none;

  font-family: inherit;

  font-size: 14px;

  color: #ffbe89;

  background: rgba(255, 190, 137, 0.1);

  transition: box-shadow 0.2s ease;
}

.lp-textarea-wrap textarea {
  min-height: 96px;

  resize: vertical;

  line-height: 1.6;
}

.lp-input-wrap input::placeholder,
.lp-textarea-wrap textarea::placeholder {
  color: rgba(255, 190, 137, 0.45);
}

.lp-input-wrap input:focus,
.lp-textarea-wrap textarea:focus {
  box-shadow: 0 0 0 3px rgba(255, 190, 137, 0.18);
}

.lp-character-count {
  margin-top: 5px;

  text-align: right;

  font-size: 9px;

  color: rgba(255, 190, 137, 0.5);
}

/* =========================================================
   SUBMIT
========================================================= */

.lp-wish-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  padding: 9px 22px;

  border: 0;
  border-radius: 999px;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: #710001;

  background: #ffbe89;

  box-shadow: 0 8px 20px rgba(255, 190, 137, 0.3);

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.lp-wish-submit:hover:not(:disabled) {
  transform: scale(1.05);

  box-shadow: 0 12px 26px rgba(255, 190, 137, 0.4);
}

.lp-wish-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================================================
   EMPTY
========================================================= */

.lp-no-wishes {
  padding: 40px 20px;

  text-align: center;

  color: rgba(255, 190, 137, 0.6);
}

.lp-empty-flower {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 10px;

  border: 1px solid rgba(255, 190, 137, 0.35);
  border-radius: 50%;

  background: rgba(255, 190, 137, 0.08);
}

.lp-no-wishes p {
  margin: 0 0 4px;

  font-size: 14px;
  font-weight: 600;

  color: #ffbe89;
}

.lp-no-wishes span {
  font-size: 11px;
  font-style: italic;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.lp-wish-list {
  margin-top: 22px;
}

.lp-list-heading {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 14px;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.14em;

  color: rgba(255, 190, 137, 0.75);
}

.lp-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;
}

.lp-list-heading span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(255, 190, 137, 0.4));
}

.lp-list-heading span:last-child {
  transform: rotate(180deg);
}

.lp-wish-card {
  display: flex;
  align-items: flex-start;
  gap: 11px;

  margin-bottom: 11px;

  padding: 13px 14px;

  border: 1px solid rgba(255, 190, 137, 0.66);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.11);

  text-align: left;
}

.lp-wish-avatar {
  flex: 0 0 36px;

  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(140deg, rgba(255, 190, 137, 0.3), rgba(212, 175, 55, 0.25));

  font-size: 14px;
  font-weight: 700;

  color: #ffbe89;
}

.lp-wish-content {
  flex: 1;
  min-width: 0;
}

.lp-wish-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  margin-bottom: 4px;
}

.lp-wish-header b {
  font-size: 12px;
  font-weight: 700;

  color: #ffbe89;
}

.lp-wish-header span {
  font-size: 9px;

  color: rgba(255, 190, 137, 0.5);
}

.lp-wish-content p {
  margin: 0;

  font-size: 12px;

  line-height: 1.6;

  color: rgba(255, 190, 137, 0.85);

  overflow-wrap: anywhere;
}

/* TransitionGroup */
.lp-wish-list-enter-active,
.lp-wish-list-leave-active {
  transition: all 0.4s ease;
}

.lp-wish-list-enter-from {
  opacity: 0;

  transform: translateY(14px);
}

.lp-wish-list-leave-to {
  opacity: 0;

  transform: scale(0.96);
}

/* =========================================================
   BOTTOM
========================================================= */

.lp-wishes__bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 22px;

  color: rgba(255, 190, 137, 0.6);
}

.lp-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(255, 190, 137, 0.5));
}

.lp-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

.lp-wishes__bottom i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .lp-wishes {
    width: calc(100% - 16px);

    padding: 26px 12px 20px;
  }

  .lp-wish-form-card {
    padding: 20px 14px;
  }

  .lp-wish-card {
    padding: 11px 12px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lp-wish-track {
    animation: none;
  }
}
</style>
