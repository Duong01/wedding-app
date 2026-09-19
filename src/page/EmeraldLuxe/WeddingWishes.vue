<template>
  <section class="el-wishes">
    <div class="el-wishes__ornament">
      <span></span>
      <i>❦</i>
      <span></span>
    </div>

    <p class="el-eyebrow">LỜI CHÚC TỪ BẠN</p>

    <h2>Sổ lưu bút</h2>

    <p class="el-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="el-wish-form-card">
      <div class="el-form-decoration el-form-decoration--tl">❦</div>
      <div class="el-form-decoration el-form-decoration--tr">✦</div>

      <div class="el-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="el-wish-marquee">
        <div class="el-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="el-marquee-window">
          <div class="el-wish-track">
            <div class="el-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="el-wish-marquee-item"
              >
                <i>✦</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="el-marquee-dot">✧</b>
              </span>
            </div>

            <div class="el-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="el-wish-marquee-item"
              >
                <i>✦</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="el-marquee-dot">✧</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="el-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="el-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="el-input-group">
          <label>LỜI CHÚC</label>

          <div class="el-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="el-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="el-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="el-no-wishes">
      <div class="el-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="el-wish-list">
      <div class="el-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="el-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="el-wish-card">
          <div class="el-card-flower">❦</div>

          <div class="el-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="el-wish-content">
            <div class="el-wish-header">
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
    <div class="el-wishes__bottom">
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
    console.warn("[EmeraldLuxe][Wishes] Không tải được lời chúc:", error);
  }
}

if(route.params.slug  && route.name === "WeddingByApi") {
  loadWishes();
}

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
.el-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #2e3d36;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.68), rgba(240, 234, 216, 0.52));

  box-shadow: 0 12px 35px rgba(12, 43, 33, 0.09), inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  border: 1px solid rgba(201, 164, 92, 0.55);
  border-radius: 60% 60% 28px 28px / 12% 12% 28px 28px;

  overflow: hidden;
}

/* Fine gold lattice texture */
.el-wishes::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.el-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: #c9a45c;
}

.el-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.85));
}

.el-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

.el-wishes__ornament i {
  font-size: 14px;
  font-style: normal;
}

/* =========================================================
   HEADER
========================================================= */

.el-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.el-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: #123b2e;
}

.el-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #6b7a70;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.el-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.78), rgba(247, 241, 227, 0.62));

  box-shadow: 0 8px 25px rgba(12, 43, 33, 0.08);

  border: 1px solid rgba(201, 164, 92, 0.45);
  border-radius: 999px 999px 20px 20px;

  overflow: hidden;
}

.el-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(201, 164, 92, 0.28), transparent 70%);

  pointer-events: none;
}

.el-form-decoration {
  position: absolute;

  color: #c9a45c;

  opacity: 0.65;

  font-size: 12px;
}

.el-form-decoration--tl { top: 13px; left: 15px; }
.el-form-decoration--tr { top: 13px; right: 15px; }

.el-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #123b2e;

  font-size: 13px;
  font-weight: 600;
}

.el-form-title .v-icon {
  color: #c9a45c;
}

/* =========================================================
   INPUT
========================================================= */

.el-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.el-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.el-input-wrap,
.el-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(201, 164, 92, 0.45);
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.72);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.el-input-wrap:focus-within,
.el-textarea-wrap:focus-within {
  border-color: rgba(201, 164, 92, 0.8);

  background: rgba(255, 255, 255, 0.94);

  box-shadow: 0 0 0 3px rgba(201, 164, 92, 0.14);
}

.el-input-wrap .v-icon,
.el-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #c9a45c;
}

.el-wishes input,
.el-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #2e3d36;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.el-wishes input::placeholder,
.el-wishes textarea::placeholder {
  color: #a8a894;
}

.el-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.el-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #a8a894;

  font-size: 10px;
}

/* =========================================================
   SUBMIT
========================================================= */

.el-wish-submit {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;

  margin-top: 5px;

  padding: 12px 18px;

  border: 1px solid rgba(201, 164, 92, 0.85);
  border-radius: 999px;

  color: #10281f;

  background: linear-gradient(135deg, #e8d3a2, #c9a45c);

  box-shadow: 0 7px 16px rgba(201, 164, 92, 0.28);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.el-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(201, 164, 92, 0.36);
}

.el-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.el-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.el-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #8a9a8f;
}

.el-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #c9a45c;

  background: rgba(255, 255, 255, 0.55);

  border-radius: 50%;
}

.el-no-wishes p {
  margin: 0 0 3px;

  color: #123b2e;

  font-size: 14px;
  font-weight: 600;
}

.el-no-wishes span {
  color: #8a9a8f;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.el-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.el-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: #8a7a52;
}

.el-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.5));
}

.el-list-heading > span:last-child {
  transform: rotate(180deg);
}

.el-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.el-list-heading .v-icon {
  color: #c9a45c;
}

/* =========================================================
   WISH CARD
========================================================= */

.el-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(201, 164, 92, 0.35);
  border-radius: 18px 18px 18px 6px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.8), rgba(247, 241, 227, 0.62));

  box-shadow: 0 5px 17px rgba(12, 43, 33, 0.06);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.el-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(12, 43, 33, 0.11);
}

.el-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: #c9a45c;

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.el-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #123b2e;

  background: linear-gradient(145deg, #e8d3a2, #c9a45c);

  border-radius: 50%;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.el-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.el-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.el-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.el-wish-header b {
  color: #2e3d36;

  font-size: 13px;
  font-weight: 700;
}

.el-wish-header span {
  color: #9aa398;

  font-size: 10px;
}

.el-wish-header > .v-icon {
  flex: 0 0 auto;

  color: #c9a45c;

  margin-top: 2px;
}

.el-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: #55645b;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.el-wish-list-enter-active,
.el-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.el-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.el-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.el-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #c9a45c;
}

.el-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.65));
}

.el-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

.el-wishes__bottom i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   MARQUEE
========================================================= */

.el-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(201, 164, 92, 0.3);
  border-bottom: 1px solid rgba(201, 164, 92, 0.3);

  background: linear-gradient(
    90deg,
    rgba(253, 250, 242, 0.88),
    rgba(240, 234, 216, 0.6),
    rgba(253, 250, 242, 0.88)
  );
}

.el-marquee-label {
  position: absolute;
  z-index: 5;

  left: 0;
  top: 0;
  bottom: 0;

  width: 74px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;

  color: #123b2e;

  background: linear-gradient(90deg, rgba(253, 250, 242, 1) 72%, rgba(253, 250, 242, 0));

  pointer-events: none;
}

.el-marquee-label .v-icon {
  color: #c9a45c;
}

.el-marquee-label span {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.el-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.el-wish-track {
  display: flex;

  width: max-content;

  animation: el-wish-marquee 32s linear infinite;

  will-change: transform;
}

.el-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.el-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: #55645b;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.el-wish-marquee-item i {
  color: #c9a45c;

  font-size: 11px;
  font-style: normal;

  animation: el-marquee-flower 1.8s ease-in-out infinite;
}

.el-wish-marquee-item strong {
  color: #2e3d36;

  font-weight: 700;
}

.el-wish-marquee-item em {
  color: #6b7a70;

  font-style: italic;

  font-size: 11px;
}

.el-marquee-dot {
  color: #c9a45c;

  font-size: 11px;
  font-weight: 400;
}

@keyframes el-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes el-marquee-flower {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.65;
  }

  50% {
    transform: scale(1.3) rotate(20deg);
    opacity: 1;
  }
}

.el-wish-marquee:hover .el-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .el-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .el-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .el-wish-form-card {
    padding: 21px 14px 18px;
  }

  .el-wish-card {
    padding: 12px;
  }

  .el-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .el-wish-header b {
    font-size: 12px;
  }

  .el-wish-content p {
    font-size: 11px;
  }

  .el-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .el-marquee-label {
    width: 62px;
  }

  .el-marquee-window {
    padding-left: 61px;
  }

  .el-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .el-wish-marquee-item em {
    font-size: 10px;
  }

  .el-marquee-label span {
    font-size: 11px;
  }
}

@media (max-width: 380px) {
  .el-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .el-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .el-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .el-wish-track,
  .el-wish-marquee-item i {
    animation: none;
  }

  .el-wish-card,
  .el-wish-submit,
  .el-wish-list-enter-active,
  .el-wish-list-leave-active {
    transition: none;
  }
}
</style>
