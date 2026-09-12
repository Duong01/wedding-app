<template>
  <section class="lc-wishes">
    <div class="lc-wishes__ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <p class="lc-eyebrow">LỜI CHÚC TỪ BẠN</p>

    <h2>Sổ lưu bút</h2>

    <p class="lc-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="lc-wish-form-card">
      <div class="lc-form-decoration lc-form-decoration--tl">❀</div>
      <div class="lc-form-decoration lc-form-decoration--tr">✦</div>

      <div class="lc-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="lc-wish-marquee">
        <div class="lc-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="lc-marquee-window">
          <div class="lc-wish-track">
            <div class="lc-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="lc-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="lc-marquee-dot">✦</b>
              </span>
            </div>

            <div class="lc-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="lc-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="lc-marquee-dot">✦</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="lc-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="lc-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="lc-input-group">
          <label>LỜI CHÚC</label>

          <div class="lc-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="lc-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="lc-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="lc-no-wishes">
      <div class="lc-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="lc-wish-list">
      <div class="lc-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="lc-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="lc-wish-card">
          <div class="lc-card-flower">❀</div>

          <div class="lc-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="lc-wish-content">
            <div class="lc-wish-header">
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
    <div class="lc-wishes__bottom">
      <span></span>

      <v-icon size="13">mdi-flower-tulip-outline</v-icon>

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
    console.warn("[LavenderCream][Wishes] Không tải được lời chúc:", error);
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
.lc-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #584a5b;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(241, 235, 244, 0.45));

  box-shadow: 0 12px 35px rgba(88, 74, 91, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  border-radius: 28px;

  overflow: hidden;
}

.lc-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(185, 160, 208, 0.28);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.lc-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: #b9a0d0;
}

.lc-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.7));
}

.lc-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.lc-eyebrow {
  position: relative;

  margin: 0;

  color: #a086b4;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lc-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: #584a5b;
}

.lc-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #8d7f92;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.lc-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(246, 240, 250, 0.6));

  box-shadow: 0 8px 25px rgba(88, 74, 91, 0.07);

  border-radius: 20px;

  overflow: hidden;
}

.lc-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(216, 192, 222, 0.3), transparent 70%);

  pointer-events: none;
}

.lc-form-decoration {
  position: absolute;

  color: #b9a0d0;

  opacity: 0.65;

  font-size: 12px;
}

.lc-form-decoration--tl { top: 13px; left: 15px; }
.lc-form-decoration--tr { top: 13px; right: 15px; }

.lc-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #7d6390;

  font-size: 13px;
  font-weight: 600;
}

.lc-form-title .v-icon {
  color: #b9a0d0;
}

/* =========================================================
   INPUT
========================================================= */

.lc-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.lc-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #a086b4;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.lc-input-wrap,
.lc-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(160, 134, 180, 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.lc-input-wrap:focus-within,
.lc-textarea-wrap:focus-within {
  border-color: rgba(160, 134, 180, 0.6);

  background: rgba(255, 255, 255, 0.92);

  box-shadow: 0 0 0 3px rgba(160, 134, 180, 0.1);
}

.lc-input-wrap .v-icon,
.lc-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #a086b4;
}

.lc-wishes input,
.lc-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #584a5b;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.lc-wishes input::placeholder,
.lc-wishes textarea::placeholder {
  color: #b3a6ba;
}

.lc-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.lc-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #b3a6ba;

  font-size: 8px;
}

/* =========================================================
   SUBMIT
========================================================= */

.lc-wish-submit {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;

  margin-top: 5px;

  padding: 12px 18px;

  border: 0;
  border-radius: 999px;

  color: #fbf9ff;

  background: linear-gradient(135deg, #a086b4, #7d6390);

  box-shadow: 0 7px 16px rgba(88, 74, 91, 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.lc-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(88, 74, 91, 0.28);
}

.lc-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.lc-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.lc-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #a99cb0;
}

.lc-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #a086b4;

  background: rgba(255, 255, 255, 0.5);

  border-radius: 50%;
}

.lc-no-wishes p {
  margin: 0 0 3px;

  color: #7d6390;

  font-size: 14px;
  font-weight: 600;
}

.lc-no-wishes span {
  color: #a99cb0;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.lc-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.lc-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: #a086b4;
}

.lc-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.4));
}

.lc-list-heading > span:last-child {
  transform: rotate(180deg);
}

.lc-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.lc-list-heading .v-icon {
  color: #a086b4;
}

/* =========================================================
   WISH CARD
========================================================= */

.lc-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(160, 134, 180, 0.22);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.78), rgba(246, 240, 250, 0.6));

  box-shadow: 0 5px 17px rgba(88, 74, 91, 0.05);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.lc-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(88, 74, 91, 0.09);
}

.lc-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: #b9a0d0;

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.lc-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #7d6390;

  background: linear-gradient(145deg, #ece1f2, #d8c0de);

  border-radius: 50%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.lc-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.lc-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.lc-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.lc-wish-header b {
  color: #584a5b;

  font-size: 13px;
  font-weight: 700;
}

.lc-wish-header span {
  color: #a99cb0;

  font-size: 8px;
}

.lc-wish-header > .v-icon {
  flex: 0 0 auto;

  color: #a086b4;

  margin-top: 2px;
}

.lc-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: #6f5f74;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.lc-wish-list-enter-active,
.lc-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.lc-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.lc-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.lc-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #b9a0d0;
}

.lc-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.55));
}

.lc-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.lc-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(185, 160, 208, 0.2);
  border-bottom: 1px solid rgba(185, 160, 208, 0.2);

  background: linear-gradient(
    90deg,
    rgba(252, 250, 255, 0.85),
    rgba(241, 235, 244, 0.55),
    rgba(252, 250, 255, 0.85)
  );
}

.lc-marquee-label {
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

  color: #7d6390;

  background: linear-gradient(90deg, rgba(252, 250, 255, 1) 72%, rgba(252, 250, 255, 0));

  pointer-events: none;
}

.lc-marquee-label .v-icon {
  color: #a086b4;
}

.lc-marquee-label span {
  font-size: 6px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.lc-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.lc-wish-track {
  display: flex;

  width: max-content;

  animation: lc-wish-marquee 32s linear infinite;

  will-change: transform;
}

.lc-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.lc-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: #6f5f74;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.lc-wish-marquee-item i {
  color: #a086b4;

  font-size: 9px;
  font-style: normal;

  animation: lc-marquee-heart 1.8s ease-in-out infinite;
}

.lc-wish-marquee-item strong {
  color: #584a5b;

  font-weight: 700;
}

.lc-wish-marquee-item em {
  color: #7d6f83;

  font-style: italic;

  font-size: 11px;
}

.lc-marquee-dot {
  color: #b9a0d0;

  font-size: 7px;
  font-weight: 400;
}

@keyframes lc-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes lc-marquee-heart {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.65;
  }

  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

.lc-wish-marquee:hover .lc-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .lc-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .lc-wishes::before {
    inset: 6px;

    border-radius: 18px;
  }

  .lc-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .lc-wish-form-card {
    padding: 21px 14px 18px;
  }

  .lc-wish-card {
    padding: 12px;
  }

  .lc-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .lc-wish-header b {
    font-size: 12px;
  }

  .lc-wish-content p {
    font-size: 11px;
  }

  .lc-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .lc-marquee-label {
    width: 62px;
  }

  .lc-marquee-window {
    padding-left: 61px;
  }

  .lc-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .lc-wish-marquee-item em {
    font-size: 10px;
  }

  .lc-marquee-label span {
    font-size: 5px;
  }
}

@media (max-width: 380px) {
  .lc-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .lc-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .lc-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lc-wish-track,
  .lc-wish-marquee-item i {
    animation: none;
  }

  .lc-wish-card,
  .lc-wish-submit,
  .lc-wish-list-enter-active,
  .lc-wish-list-leave-active {
    transition: none;
  }
}
</style>
