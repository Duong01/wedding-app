<template>
  <section class="dh-wishes">
    <div class="dh-wishes__ornament">
      <span></span>
      <i>囍</i>
      <span></span>
    </div>

    <p class="dh-eyebrow">LỜI CHÚC TỪ BẠN</p>

    <h2>Sổ lưu bút</h2>

    <p class="dh-wishes__intro">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="dh-wish-form-card">
      <div class="dh-form-decoration dh-form-decoration--tl">囍</div>
      <div class="dh-form-decoration dh-form-decoration--tr">❖</div>

      <div class="dh-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="dh-wish-marquee">
        <div class="dh-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="dh-marquee-window">
          <div class="dh-wish-track">
            <div class="dh-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="dh-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="dh-marquee-dot">❖</b>
              </span>
            </div>

            <div class="dh-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="dh-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="dh-marquee-dot">❖</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="dh-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="dh-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="dh-input-group">
          <label>LỜI CHÚC</label>

          <div class="dh-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="dh-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="dh-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="dh-no-wishes">
      <div class="dh-empty-seal">囍</div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="dh-wish-list">
      <div class="dh-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="dh-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="dh-wish-card">
          <div class="dh-card-seal">囍</div>

          <div class="dh-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="dh-wish-content">
            <div class="dh-wish-header">
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
    <div class="dh-wishes__bottom">
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
    console.warn("[DoubleHappiness][Wishes] Không tải được lời chúc:", error);
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
.dh-wishes {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-red-dark: #5c0e10;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;

  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--dh-ink);

  background: linear-gradient(170deg, rgba(253, 246, 236, 0.7), rgba(243, 217, 164, 0.42));

  box-shadow: 0 12px 35px rgba(60, 10, 12, 0.1), inset 0 0 0 1px rgba(255, 252, 244, 0.7);

  border-radius: 14px;

  overflow: hidden;
}

/* Inner gold line — double border frame */
.dh-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(217, 164, 65, 0.32);
  border-radius: 9px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.dh-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: var(--dh-gold);
}

.dh-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.75));
}

.dh-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

.dh-wishes__ornament i {
  font-size: 14px;
  font-style: normal;
}

/* =========================================================
   HEADER
========================================================= */

.dh-eyebrow {
  position: relative;

  margin: 0;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.dh-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: var(--dh-red);
}

.dh-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #8a6a52;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   FORM CARD
========================================================= */

.dh-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.78), rgba(253, 246, 236, 0.62));

  box-shadow: 0 8px 25px rgba(60, 10, 12, 0.08);

  border: 1px solid rgba(217, 164, 65, 0.35);
  border-radius: 12px;

  overflow: hidden;
}

.dh-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(243, 217, 164, 0.32), transparent 70%);

  pointer-events: none;
}

.dh-form-decoration {
  position: absolute;

  color: var(--dh-gold);

  opacity: 0.65;

  font-size: 12px;
}

.dh-form-decoration--tl { top: 13px; left: 15px; }
.dh-form-decoration--tr { top: 13px; right: 15px; }

.dh-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: var(--dh-red);

  font-size: 13px;
  font-weight: 600;
}

.dh-form-title .v-icon {
  color: var(--dh-gold);
}

/* =========================================================
   INPUT
========================================================= */

.dh-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.dh-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: var(--dh-red-bright);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.dh-input-wrap,
.dh-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(217, 164, 65, 0.35);
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.dh-input-wrap:focus-within,
.dh-textarea-wrap:focus-within {
  border-color: rgba(163, 42, 42, 0.6);

  background: rgba(255, 255, 255, 0.92);

  box-shadow: 0 0 0 3px rgba(163, 42, 42, 0.1);
}

.dh-input-wrap .v-icon,
.dh-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: var(--dh-red-bright);
}

.dh-wishes input,
.dh-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: var(--dh-red);

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.dh-wishes input::placeholder,
.dh-wishes textarea::placeholder {
  color: #bda08a;
}

.dh-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.dh-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #bda08a;

  font-size: 8px;
}

/* =========================================================
   SUBMIT
========================================================= */

.dh-wish-submit {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;

  margin-top: 5px;

  padding: 12px 18px;

  border: 1px solid rgba(243, 217, 164, 0.65);
  border-radius: 999px;

  color: var(--dh-red-dark);

  background: linear-gradient(135deg, var(--dh-gold-light), var(--dh-gold) 60%, #c08f34);

  box-shadow: 0 7px 16px rgba(60, 10, 12, 0.22);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.dh-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(60, 10, 12, 0.3);
}

.dh-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.dh-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.dh-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #a89488;
}

.dh-empty-seal {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: var(--dh-gold);

  font-size: 24px;

  background: rgba(255, 255, 255, 0.5);

  border: 1px solid rgba(217, 164, 65, 0.4);
  border-radius: 50%;
}

.dh-no-wishes p {
  margin: 0 0 3px;

  color: var(--dh-red);

  font-size: 14px;
  font-weight: 600;
}

.dh-no-wishes span {
  color: #a89488;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.dh-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.dh-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: var(--dh-red-bright);
}

.dh-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.45));
}

.dh-list-heading > span:last-child {
  transform: rotate(180deg);
}

.dh-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.dh-list-heading .v-icon {
  color: var(--dh-red-bright);
}

/* =========================================================
   WISH CARD
========================================================= */

.dh-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(217, 164, 65, 0.28);
  border-radius: 12px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.8), rgba(253, 246, 236, 0.62));

  box-shadow: 0 5px 17px rgba(60, 10, 12, 0.06);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dh-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(60, 10, 12, 0.11);
}

.dh-card-seal {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: var(--dh-gold);

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-12deg);

  pointer-events: none;
}

.dh-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: var(--dh-cream);

  background: linear-gradient(145deg, var(--dh-red-bright), var(--dh-red) 70%, #6a1013);

  border-radius: 50%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 2px rgba(243, 217, 164, 0.4);
}

.dh-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.dh-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.dh-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.dh-wish-header b {
  color: var(--dh-red);

  font-size: 13px;
  font-weight: 700;
}

.dh-wish-header span {
  color: #b09a8c;

  font-size: 8px;
}

.dh-wish-header > .v-icon {
  flex: 0 0 auto;

  color: var(--dh-red-bright);

  margin-top: 2px;
}

.dh-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: #7d5c46;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.dh-wish-list-enter-active,
.dh-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.dh-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.dh-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.dh-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: var(--dh-gold);
}

.dh-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.6));
}

.dh-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.dh-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(217, 164, 65, 0.25);
  border-bottom: 1px solid rgba(217, 164, 65, 0.25);

  background: linear-gradient(
    90deg,
    rgba(253, 246, 236, 0.9),
    rgba(243, 217, 164, 0.5),
    rgba(253, 246, 236, 0.9)
  );
}

.dh-marquee-label {
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

  color: var(--dh-red);

  background: linear-gradient(90deg, rgba(253, 246, 236, 1) 72%, rgba(253, 246, 236, 0));

  pointer-events: none;
}

.dh-marquee-label .v-icon {
  color: var(--dh-red-bright);
}

.dh-marquee-label span {
  font-size: 6px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.dh-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.dh-wish-track {
  display: flex;

  width: max-content;

  animation: dh-wish-marquee 32s linear infinite;

  will-change: transform;
}

.dh-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.dh-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: #7d5c46;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.dh-wish-marquee-item i {
  color: var(--dh-red-bright);

  font-size: 9px;
  font-style: normal;

  animation: dh-marquee-heart 1.8s ease-in-out infinite;
}

.dh-wish-marquee-item strong {
  color: var(--dh-red);

  font-weight: 700;
}

.dh-wish-marquee-item em {
  color: #8a6a52;

  font-style: italic;

  font-size: 11px;
}

.dh-marquee-dot {
  color: var(--dh-gold);

  font-size: 7px;
  font-weight: 400;
}

@keyframes dh-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes dh-marquee-heart {
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

.dh-wish-marquee:hover .dh-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .dh-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 12px;
  }

  .dh-wishes::before {
    inset: 6px;

    border-radius: 8px;
  }

  .dh-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .dh-wish-form-card {
    padding: 21px 14px 18px;
  }

  .dh-wish-card {
    padding: 12px;
  }

  .dh-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .dh-wish-header b {
    font-size: 12px;
  }

  .dh-wish-content p {
    font-size: 11px;
  }

  .dh-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .dh-marquee-label {
    width: 62px;
  }

  .dh-marquee-window {
    padding-left: 61px;
  }

  .dh-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .dh-wish-marquee-item em {
    font-size: 10px;
  }

  .dh-marquee-label span {
    font-size: 5px;
  }
}

@media (max-width: 380px) {
  .dh-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .dh-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .dh-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .dh-wish-track,
  .dh-wish-marquee-item i {
    animation: none;
  }

  .dh-wish-card,
  .dh-wish-submit,
  .dh-wish-list-enter-active,
  .dh-wish-list-leave-active {
    transition: none;
  }
}
</style>
