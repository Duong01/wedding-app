<template>
  <section class="bl-wishes">
    <div class="bl-wishes__ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <p v-if="eyebrow" class="bl-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <p v-if="intro" class="bl-wishes__intro">
      {{ intro }}
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="bl-wish-form-card">
      <div class="bl-form-decoration bl-form-decoration--tl">❧</div>
      <div class="bl-form-decoration bl-form-decoration--tr">✤</div>

      <div class="bl-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>Gửi lời yêu thương</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="bl-wish-marquee">
        <div class="bl-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>LỜI CHÚC</span>
        </div>

        <div class="bl-marquee-window">
          <div class="bl-wish-track">
            <div class="bl-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="bl-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="bl-marquee-dot">✤</b>
              </span>
            </div>

            <div class="bl-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="bl-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="bl-marquee-dot">✤</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="bl-input-group">
          <label>TÊN CỦA BẠN</label>

          <div class="bl-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        <div class="bl-input-group">
          <label>LỜI CHÚC</label>

          <div class="bl-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
            ></textarea>
          </div>

          <div class="bl-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="bl-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC" }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="bl-no-wishes">
      <div class="bl-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>Chưa có lời chúc nào</p>

      <span>Hãy là người đầu tiên gửi lời yêu thương</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="bl-wish-list">
      <div class="bl-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="bl-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="bl-wish-card">
          <div class="bl-card-flower">❧</div>

          <div class="bl-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="bl-wish-content">
            <div class="bl-wish-header">
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
    <div class="bl-wishes__bottom">
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
import { sectionText } from "@/data/sectionTitles";

const props = defineProps({
  wishes: { type: Array, default: () => [] },
  wedding: { type: Object, default: () => ({}) },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "guestbook", "Eyebrow", "LỜI CHÚC TỪ BẠN")
);

const heading = computed(() =>
  sectionText(props.sections, "guestbook", "Heading", "Sổ lưu bút")
);

const intro = computed(() =>
  sectionText(
    props.sections,
    "guestbook",
    "Intro",
    "Mỗi lời chúc là một kỷ niệm đẹp\nmà chúng mình muốn lưu giữ trong ngày đặc biệt này"
  )
);

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
    console.warn("[BotanicalLeaf][Wishes] Không tải được lời chúc:", error);
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
.bl-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #3d5a47;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(241, 235, 244, 0.45));

  box-shadow: 0 12px 35px rgba(61, 90, 71, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  border-radius: 28px;

  overflow: hidden;
}

.bl-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(181, 208, 186, 0.28);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.bl-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: #4f6b58;
}

.bl-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.7));
}

.bl-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.bl-eyebrow {
  position: relative;

  margin: 0;

  color: #4a6653;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bl-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: #3d5a47;
}

.bl-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: #526e5a;

  font-size: 13px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   FORM CARD
========================================================= */

.bl-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(244, 250, 245, 0.6));

  box-shadow: 0 8px 25px rgba(61, 90, 71, 0.07);

  border-radius: 20px;

  overflow: hidden;
}

.bl-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(207, 227, 210, 0.3), transparent 70%);

  pointer-events: none;
}

.bl-form-decoration {
  position: absolute;

  color: #4f6b58;

  opacity: 0.65;

  font-size: 12px;
}

.bl-form-decoration--tl { top: 13px; left: 15px; }
.bl-form-decoration--tr { top: 13px; right: 15px; }

.bl-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #57806a;

  font-size: 13px;
  font-weight: 600;
}

.bl-form-title .v-icon {
  color: #4f6b58;
}

/* =========================================================
   INPUT
========================================================= */

.bl-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.bl-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: #4a6653;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.bl-input-wrap,
.bl-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(127, 163, 137, 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.bl-input-wrap:focus-within,
.bl-textarea-wrap:focus-within {
  border-color: rgba(127, 163, 137, 0.6);

  background: rgba(255, 255, 255, 0.92);

  box-shadow: 0 0 0 3px rgba(127, 163, 137, 0.1);
}

.bl-input-wrap .v-icon,
.bl-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: #4a6653;
}

.bl-wishes input,
.bl-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: #3d5a47;

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.bl-wishes input::placeholder,
.bl-wishes textarea::placeholder {
  color: #566f5e;
}

.bl-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.bl-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: #566f5e;

  font-size: 10px;
}

/* =========================================================
   SUBMIT
========================================================= */

.bl-wish-submit {
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

  color: #fbfcfa;

  background: linear-gradient(135deg, #4a6653, #57806a);

  box-shadow: 0 7px 16px rgba(61, 90, 71, 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.bl-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(61, 90, 71, 0.28);
}

.bl-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.bl-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.bl-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: #58715f;
}

.bl-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: #4a6653;

  background: rgba(255, 255, 255, 0.5);

  border-radius: 50%;
}

.bl-no-wishes p {
  margin: 0 0 3px;

  color: #57806a;

  font-size: 14px;
  font-weight: 600;
}

.bl-no-wishes span {
  color: #58715f;

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.bl-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.bl-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: #4a6653;
}

.bl-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.4));
}

.bl-list-heading > span:last-child {
  transform: rotate(180deg);
}

.bl-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.bl-list-heading .v-icon {
  color: #4a6653;
}

/* =========================================================
   WISH CARD
========================================================= */

.bl-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(127, 163, 137, 0.22);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.78), rgba(244, 250, 245, 0.6));

  box-shadow: 0 5px 17px rgba(61, 90, 71, 0.05);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bl-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(61, 90, 71, 0.09);
}

.bl-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: #4f6b58;

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.bl-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #57806a;

  background: linear-gradient(145deg, #e9f2ea, #cfe3d2);

  border-radius: 50%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.bl-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.bl-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.bl-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.bl-wish-header b {
  color: #3d5a47;

  font-size: 13px;
  font-weight: 700;
}

.bl-wish-header span {
  color: #58715f;

  font-size: 10px;
}

.bl-wish-header > .v-icon {
  flex: 0 0 auto;

  color: #4a6653;

  margin-top: 2px;
}

.bl-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: #5a7362;

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.bl-wish-list-enter-active,
.bl-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.bl-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.bl-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.bl-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #4f6b58;
}

.bl-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.55));
}

.bl-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.bl-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(181, 208, 186, 0.2);
  border-bottom: 1px solid rgba(181, 208, 186, 0.2);

  background: linear-gradient(
    90deg,
    rgba(252, 253, 252, 0.85),
    rgba(241, 235, 244, 0.55),
    rgba(252, 253, 252, 0.85)
  );
}

.bl-marquee-label {
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

  color: #57806a;

  background: linear-gradient(90deg, rgba(252, 253, 252, 1) 72%, rgba(252, 253, 252, 0));

  pointer-events: none;
}

.bl-marquee-label .v-icon {
  color: #4a6653;
}

.bl-marquee-label span {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.bl-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.bl-wish-track {
  display: flex;

  width: max-content;

  animation: bl-wish-marquee 32s linear infinite;

  will-change: transform;
}

.bl-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.bl-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: #5a7362;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.bl-wish-marquee-item i {
  color: #4a6653;

  font-size: 11px;
  font-style: normal;

  animation: bl-marquee-heart 1.8s ease-in-out infinite;
}

.bl-wish-marquee-item strong {
  color: #3d5a47;

  font-weight: 700;
}

.bl-wish-marquee-item em {
  color: #55705c;

  font-style: italic;

  font-size: 11px;
}

.bl-marquee-dot {
  color: #4f6b58;

  font-size: 11px;
  font-weight: 400;
}

@keyframes bl-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes bl-marquee-heart {
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

.bl-wish-marquee:hover .bl-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .bl-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .bl-wishes::before {
    inset: 6px;

    border-radius: 18px;
  }

  .bl-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .bl-wish-form-card {
    padding: 21px 14px 18px;
  }

  .bl-wish-card {
    padding: 12px;
  }

  .bl-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .bl-wish-header b {
    font-size: 12px;
  }

  .bl-wish-content p {
    font-size: 11px;
  }

  .bl-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .bl-marquee-label {
    width: 62px;
  }

  .bl-marquee-window {
    padding-left: 61px;
  }

  .bl-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .bl-wish-marquee-item em {
    font-size: 10px;
  }

  .bl-marquee-label span {
    font-size: 11px;
  }
}

@media (max-width: 380px) {
  .bl-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .bl-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .bl-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bl-wish-track,
  .bl-wish-marquee-item i {
    animation: none;
  }

  .bl-wish-card,
  .bl-wish-submit,
  .bl-wish-list-enter-active,
  .bl-wish-list-leave-active {
    transition: none;
  }
}
</style>
