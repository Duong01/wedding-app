<template>
  <section class="sp-wishes">
    <div class="sp-wishes__ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <p class="sp-eyebrow">LỜI CHÚC TỪ BẠN</p>

    <h2>Sổ lưu bút</h2>

    <p class="sp-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="sp-wish-form-card">
      <div class="sp-form-decoration sp-form-decoration--tl">❁</div>
      <div class="sp-form-decoration sp-form-decoration--tr">✧</div>

      <div class="sp-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="sp-wish-marquee">
        <div class="sp-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="sp-marquee-window">
          <div class="sp-wish-track">
            <div class="sp-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="sp-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="sp-marquee-dot">✧</b>
              </span>
            </div>

            <div class="sp-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="sp-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="sp-marquee-dot">✧</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="sp-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="sp-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="sp-input-group">
          <label>LỜI CHÚC</label>

          <div class="sp-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="sp-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="sp-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="sp-no-wishes">
      <div class="sp-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="sp-wish-list">
      <div class="sp-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="sp-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="sp-wish-card">
          <div class="sp-card-flower">❁</div>

          <div class="sp-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="sp-wish-content">
            <div class="sp-wish-header">
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
    <div class="sp-wishes__bottom">
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
    console.warn("[SunsetPeach][Wishes] Không tải được lời chúc:", error);
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
.sp-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #7a4a3d;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(255, 242, 232, 0.45));

  box-shadow: 0 12px 35px rgba(122, 74, 61, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  border-radius: 28px;

  overflow: hidden;
}

.sp-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(224, 163, 126, 0.32);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.sp-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: #e0a37e;
}

.sp-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.7));
}

.sp-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.sp-eyebrow {
  position: relative;

  margin: 0;

  color: #d67a63;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sp-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: #7a4a3d;
}

.sp-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #a3806f;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.sp-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(255, 242, 232, 0.6));

  box-shadow: 0 8px 25px rgba(122, 74, 61, 0.07);

  border-radius: 20px;

  overflow: hidden;
}

.sp-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(244, 198, 169, 0.35), transparent 70%);

  pointer-events: none;
}

.sp-form-decoration {
  position: absolute;

  color: #e0a37e;

  opacity: 0.65;

  font-size: 12px;
}

.sp-form-decoration--tl { top: 13px; left: 15px; }
.sp-form-decoration--tr { top: 13px; right: 15px; }

.sp-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #b85c48;

  font-size: 13px;
  font-weight: 600;
}

.sp-form-title .v-icon {
  color: #e0a37e;
}

/* =========================================================
   INPUT
========================================================= */

.sp-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.sp-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #d67a63;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.sp-input-wrap,
.sp-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(214, 122, 99, 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.sp-input-wrap:focus-within,
.sp-textarea-wrap:focus-within {
  border-color: rgba(214, 122, 99, 0.6);

  background: rgba(255, 255, 255, 0.92);

  box-shadow: 0 0 0 3px rgba(214, 122, 99, 0.1);
}

.sp-input-wrap .v-icon,
.sp-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #d67a63;
}

.sp-wishes input,
.sp-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #7a4a3d;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.sp-wishes input::placeholder,
.sp-wishes textarea::placeholder {
  color: #c4a08c;
}

.sp-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.sp-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #c4a08c;

  font-size: 8px;
}

/* =========================================================
   SUBMIT
========================================================= */

.sp-wish-submit {
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

  color: #fff6ef;

  background: linear-gradient(135deg, #d67a63, #b85c48);

  box-shadow: 0 7px 16px rgba(122, 74, 61, 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.sp-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(122, 74, 61, 0.28);
}

.sp-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.sp-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.sp-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #b09a8c;
}

.sp-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #d67a63;

  background: rgba(255, 255, 255, 0.5);

  border-radius: 50%;
}

.sp-no-wishes p {
  margin: 0 0 3px;

  color: #b85c48;

  font-size: 14px;
  font-weight: 600;
}

.sp-no-wishes span {
  color: #b09a8c;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.sp-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.sp-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: #d67a63;
}

.sp-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.4));
}

.sp-list-heading > span:last-child {
  transform: rotate(180deg);
}

.sp-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.sp-list-heading .v-icon {
  color: #d67a63;
}

/* =========================================================
   WISH CARD
========================================================= */

.sp-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(214, 122, 99, 0.22);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.78), rgba(255, 242, 232, 0.6));

  box-shadow: 0 5px 17px rgba(122, 74, 61, 0.05);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sp-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(122, 74, 61, 0.09);
}

.sp-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: #e0a37e;

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.sp-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #b85c48;

  background: linear-gradient(145deg, #fdeee4, #fbdcc9);

  border-radius: 50%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.sp-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.sp-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.sp-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.sp-wish-header b {
  color: #7a4a3d;

  font-size: 13px;
  font-weight: 700;
}

.sp-wish-header span {
  color: #b09a8c;

  font-size: 8px;
}

.sp-wish-header > .v-icon {
  flex: 0 0 auto;

  color: #d67a63;

  margin-top: 2px;
}

.sp-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: #8a6353;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.sp-wish-list-enter-active,
.sp-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.sp-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.sp-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.sp-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #e0a37e;
}

.sp-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.55));
}

.sp-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.sp-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(224, 163, 126, 0.25);
  border-bottom: 1px solid rgba(224, 163, 126, 0.25);

  background: linear-gradient(
    90deg,
    rgba(255, 250, 245, 0.85),
    rgba(253, 238, 228, 0.55),
    rgba(255, 250, 245, 0.85)
  );
}

.sp-marquee-label {
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

  color: #b85c48;

  background: linear-gradient(90deg, rgba(255, 250, 245, 1) 72%, rgba(255, 250, 245, 0));

  pointer-events: none;
}

.sp-marquee-label .v-icon {
  color: #d67a63;
}

.sp-marquee-label span {
  font-size: 6px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.sp-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.sp-wish-track {
  display: flex;

  width: max-content;

  animation: sp-wish-marquee 32s linear infinite;

  will-change: transform;
}

.sp-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.sp-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: #8a6353;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.sp-wish-marquee-item i {
  color: #d67a63;

  font-size: 9px;
  font-style: normal;

  animation: sp-marquee-heart 1.8s ease-in-out infinite;
}

.sp-wish-marquee-item strong {
  color: #7a4a3d;

  font-weight: 700;
}

.sp-wish-marquee-item em {
  color: #9c7361;

  font-style: italic;

  font-size: 11px;
}

.sp-marquee-dot {
  color: #e0a37e;

  font-size: 7px;
  font-weight: 400;
}

@keyframes sp-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes sp-marquee-heart {
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

.sp-wish-marquee:hover .sp-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .sp-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .sp-wishes::before {
    inset: 6px;

    border-radius: 18px;
  }

  .sp-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .sp-wish-form-card {
    padding: 21px 14px 18px;
  }

  .sp-wish-card {
    padding: 12px;
  }

  .sp-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .sp-wish-header b {
    font-size: 12px;
  }

  .sp-wish-content p {
    font-size: 11px;
  }

  .sp-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .sp-marquee-label {
    width: 62px;
  }

  .sp-marquee-window {
    padding-left: 61px;
  }

  .sp-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .sp-wish-marquee-item em {
    font-size: 10px;
  }

  .sp-marquee-label span {
    font-size: 5px;
  }
}

@media (max-width: 380px) {
  .sp-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .sp-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .sp-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sp-wish-track,
  .sp-wish-marquee-item i {
    animation: none;
  }

  .sp-wish-card,
  .sp-wish-submit,
  .sp-wish-list-enter-active,
  .sp-wish-list-leave-active {
    transition: none;
  }
}
</style>
