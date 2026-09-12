<template>
  <section class="vs-wishes">
    <div class="vs-wishes__ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <p class="vs-eyebrow">LỜI CHÚC TỪ BẠN</p>

    <h2>Sổ lưu bút</h2>

    <p class="vs-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="vs-wish-form-card">
      <div class="vs-form-decoration vs-form-decoration--tl">❦</div>
      <div class="vs-form-decoration vs-form-decoration--tr">✦</div>

      <div class="vs-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="vs-wish-marquee">
        <div class="vs-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="vs-marquee-window">
          <div class="vs-wish-track">
            <div class="vs-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="vs-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="vs-marquee-dot">✦</b>
              </span>
            </div>

            <div class="vs-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="vs-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="vs-marquee-dot">✦</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="vs-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="vs-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="vs-input-group">
          <label>LỜI CHÚC</label>

          <div class="vs-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="vs-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="vs-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="vs-no-wishes">
      <div class="vs-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="vs-wish-list">
      <div class="vs-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="vs-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="vs-wish-card">
          <div class="vs-card-flower">❦</div>

          <div class="vs-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="vs-wish-content">
            <div class="vs-wish-header">
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
    <div class="vs-wishes__bottom">
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
    console.warn("[VintageSepia][Wishes] Không tải được lời chúc:", error);
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
.vs-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #6b4f3a;

  background: #fbf5e6;

  box-shadow: 0 12px 35px rgba(61, 47, 36, 0.1), inset 0 0 0 1px rgba(255, 253, 246, 0.7);

  border: 1px solid rgba(107, 79, 58, 0.35);
  border-radius: 10px;

  overflow: hidden;
}

.vs-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px dashed rgba(107, 79, 58, 0.28);
  border-radius: 6px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.vs-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: #c2a878;
}

.vs-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.55));
}

.vs-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.vs-eyebrow {
  position: relative;

  margin: 0;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.vs-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: #4a3a2c;
}

.vs-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #97745a;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.vs-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: rgba(255, 253, 246, 0.75);

  box-shadow: 0 8px 25px rgba(61, 47, 36, 0.08);

  border: 1px solid rgba(107, 79, 58, 0.28);
  border-radius: 8px;

  overflow: hidden;
}

.vs-form-decoration {
  position: absolute;

  color: #c2a878;

  opacity: 0.65;

  font-size: 12px;
}

.vs-form-decoration--tl { top: 13px; left: 15px; }
.vs-form-decoration--tr { top: 13px; right: 15px; }

.vs-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #6b4f3a;

  font-size: 13px;
  font-weight: 600;
}

.vs-form-title .v-icon {
  color: #c2a878;
}

/* =========================================================
   INPUT
========================================================= */

.vs-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.vs-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.vs-input-wrap,
.vs-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(107, 79, 58, 0.3);
  border-radius: 8px;

  background: rgba(255, 253, 246, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.vs-input-wrap:focus-within,
.vs-textarea-wrap:focus-within {
  border-color: rgba(151, 116, 90, 0.6);

  background: rgba(255, 253, 246, 0.92);

  box-shadow: 0 0 0 3px rgba(151, 116, 90, 0.12);
}

.vs-input-wrap .v-icon,
.vs-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #97745a;
}

.vs-wishes input,
.vs-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #4a3a2c;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.vs-wishes input::placeholder,
.vs-wishes textarea::placeholder {
  color: #b3a08a;
}

.vs-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.vs-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #b3a08a;

  font-size: 8px;
}

/* =========================================================
   SUBMIT
========================================================= */

.vs-wish-submit {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;

  margin-top: 5px;

  padding: 12px 18px;

  border: 1px solid #2c211a;
  border-radius: 8px;

  color: #ead9bd;

  background: linear-gradient(160deg, #4a3a2c, #3d2f24 60%, #2c211a);

  box-shadow: 0 7px 16px rgba(61, 47, 36, 0.25);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.vs-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(61, 47, 36, 0.32);
}

.vs-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.vs-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.vs-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #a89478;
}

.vs-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #97745a;

  background: rgba(255, 253, 246, 0.5);

  border-radius: 50%;
}

.vs-no-wishes p {
  margin: 0 0 3px;

  color: #6b4f3a;

  font-size: 14px;
  font-weight: 600;
}

.vs-no-wishes span {
  color: #a89478;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.vs-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.vs-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: #97745a;
}

.vs-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.4));
}

.vs-list-heading > span:last-child {
  transform: rotate(180deg);
}

.vs-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.vs-list-heading .v-icon {
  color: #97745a;
}

/* =========================================================
   WISH CARD
========================================================= */

.vs-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(107, 79, 58, 0.22);
  border-radius: 8px;

  background: rgba(255, 253, 246, 0.78);

  box-shadow: 0 5px 17px rgba(61, 47, 36, 0.06);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.vs-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(61, 47, 36, 0.11);
}

.vs-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: #c2a878;

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.vs-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #ead9bd;

  background: radial-gradient(circle at 34% 28%, #8a6a4f, #6b4f3a 60%, #4a3a2c 100%);

  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(234, 217, 189, 0.25);
}

.vs-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.vs-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.vs-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.vs-wish-header b {
  color: #4a3a2c;

  font-size: 13px;
  font-weight: 700;
}

.vs-wish-header span {
  color: #a89478;

  font-size: 8px;
}

.vs-wish-header > .v-icon {
  flex: 0 0 auto;

  color: #97745a;

  margin-top: 2px;
}

.vs-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: #6b4f3a;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.vs-wish-list-enter-active,
.vs-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.vs-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.vs-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.vs-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #c2a878;
}

.vs-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.5));
}

.vs-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.vs-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px dashed rgba(107, 79, 58, 0.25);
  border-bottom: 1px dashed rgba(107, 79, 58, 0.25);

  background: linear-gradient(
    90deg,
    rgba(255, 253, 246, 0.85),
    rgba(240, 229, 205, 0.55),
    rgba(255, 253, 246, 0.85)
  );
}

.vs-marquee-label {
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

  color: #6b4f3a;

  background: linear-gradient(90deg, rgba(255, 253, 246, 1) 72%, rgba(255, 253, 246, 0));

  pointer-events: none;
}

.vs-marquee-label .v-icon {
  color: #97745a;
}

.vs-marquee-label span {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 6px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.vs-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.vs-wish-track {
  display: flex;

  width: max-content;

  animation: vs-wish-marquee 32s linear infinite;

  will-change: transform;
}

.vs-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.vs-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: #6b4f3a;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.vs-wish-marquee-item i {
  color: #97745a;

  font-size: 9px;
  font-style: normal;

  animation: vs-marquee-heart 1.8s ease-in-out infinite;
}

.vs-wish-marquee-item strong {
  color: #4a3a2c;

  font-weight: 700;
}

.vs-wish-marquee-item em {
  color: #7d6248;

  font-style: italic;

  font-size: 11px;
}

.vs-marquee-dot {
  color: #c2a878;

  font-size: 7px;
  font-weight: 400;
}

@keyframes vs-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes vs-marquee-heart {
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

.vs-wish-marquee:hover .vs-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .vs-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .vs-wishes::before {
    inset: 6px;
  }

  .vs-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .vs-wish-form-card {
    padding: 21px 14px 18px;
  }

  .vs-wish-card {
    padding: 12px;
  }

  .vs-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .vs-wish-header b {
    font-size: 12px;
  }

  .vs-wish-content p {
    font-size: 11px;
  }

  .vs-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .vs-marquee-label {
    width: 62px;
  }

  .vs-marquee-window {
    padding-left: 61px;
  }

  .vs-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .vs-wish-marquee-item em {
    font-size: 10px;
  }

  .vs-marquee-label span {
    font-size: 5px;
  }
}

@media (max-width: 380px) {
  .vs-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .vs-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .vs-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .vs-wish-track,
  .vs-wish-marquee-item i {
    animation: none;
  }

  .vs-wish-card,
  .vs-wish-submit,
  .vs-wish-list-enter-active,
  .vs-wish-list-leave-active {
    transition: none;
  }
}
</style>
