<template>
  <section class="mn-wishes">
    <div class="mn-wishes__ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <p v-if="eyebrow" class="mn-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <p v-if="intro" class="mn-wishes__intro">
      {{ intro }}
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="mn-wish-form-card">
      <div class="mn-form-decoration mn-form-decoration--tl">✧</div>
      <div class="mn-form-decoration mn-form-decoration--tr">✧</div>

      <div class="mn-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>{{ $t("Gửi lời yêu thương") }}</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="mn-wish-marquee">
        <div class="mn-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ $t("LỜI CHÚC") }}</span>
        </div>

        <div class="mn-marquee-window">
          <div class="mn-wish-track">
            <div class="mn-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="mn-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="mn-marquee-dot">✧</b>
              </span>
            </div>

            <div class="mn-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="mn-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="mn-marquee-dot">✧</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="mn-input-group">
          <label>{{ $t("TÊN CỦA BẠN") }}</label>

          <div class="mn-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              :placeholder="$t('Nhập tên của bạn')"
            />
          </div>
        </div>

        <div class="mn-input-group">
          <label>{{ $t("LỜI CHÚC") }}</label>

          <div class="mn-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              :placeholder="$t('Viết lời chúc dành cho cô dâu & chú rể...')"
            ></textarea>
          </div>

          <div class="mn-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="mn-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? $t("ĐANG GỬI...") : $t("GỬI LỜI CHÚC") }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="mn-no-wishes">
      <div class="mn-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>{{ $t("Chưa có lời chúc nào") }}</p>

      <span>{{ $t("Hãy là người đầu tiên gửi lời yêu thương") }}</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="mn-wish-list">
      <div class="mn-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="mn-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="mn-wish-card">
          <div class="mn-card-flower">✧</div>

          <div class="mn-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="mn-wish-content">
            <div class="mn-wish-header">
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
    <div class="mn-wishes__bottom">
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
import { t, localeTag } from "@/lang";
const props = defineProps({
  wishes: { type: Array, default: () => [] },
  wedding: { type: Object, default: () => ({}) },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "guestbook", "Eyebrow", t("LỜI CHÚC TỪ BẠN"))
);

const heading = computed(() =>
  sectionText(props.sections, "guestbook", "Heading", t("Sổ lưu bút"))
);

const intro = computed(() =>
  sectionText(
    props.sections,
    "guestbook",
    "Intro",
    t("Mỗi lời chúc là một kỷ niệm đẹp\nmà chúng mình muốn lưu giữ trong ngày đặc biệt này")
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
  return wish?.Name || wish?.GuestName || wish?.FullName || t("Khách mời");
}

function getMessage(wish) {
  return wish?.Message || wish?.Content || wish?.Wish || t("Một lời chúc yêu thương");
}

function formatTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(localeTag(), {
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
    console.warn("[ModernNoir][Wishes] Không tải được lời chúc:", error);
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
    alert(t("Vui lòng nhập tên của bạn"));
    return;
  }

  if (!form.message || !form.message.trim()) {
    alert(t("Vui lòng nhập lời chúc"));
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
      alert(t("Gửi lời chúc thành công ❤️"));

      form.name = "";
      form.message = "";

      await loadWishes();
    } else {
      alert(result?.message || t("Không thể gửi lời chúc."));
    }
  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
        t("Có lỗi xảy ra, vui lòng thử lại.")
    );
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.mn-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--tc-3a3a3a, #3a3a3a);

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.45));

  box-shadow: 0 12px 35px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  border-radius: 28px;

  overflow: hidden;
}

.mn-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.28);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.mn-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: var(--tc-4d4d4d, #4d4d4d);
}

.mn-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.7));
}

.mn-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.mn-eyebrow {
  position: relative;

  margin: 0;

  color: var(--tc-474747, #474747);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mn-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: var(--tc-3a3a3a, #3a3a3a);
}

.mn-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: var(--tc-4f4f4f, #4f4f4f);

  font-size: 13px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   FORM CARD
========================================================= */

.mn-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(var(--tc-f4ead4-rgb, 244, 234, 212), 0.6));

  box-shadow: 0 8px 25px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.07);

  border-radius: 20px;

  overflow: hidden;
}

.mn-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-dcc9a4-rgb, 220, 201, 164), 0.3), transparent 70%);

  pointer-events: none;
}

.mn-form-decoration {
  position: absolute;

  color: var(--tc-4d4d4d, #4d4d4d);

  opacity: 0.65;

  font-size: 12px;
}

.mn-form-decoration--tl { top: 13px; left: 15px; }
.mn-form-decoration--tr { top: 13px; right: 15px; }

.mn-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: var(--tc-6b6b6b, #6b6b6b);

  font-size: 13px;
  font-weight: 600;
}

.mn-form-title .v-icon {
  color: var(--tc-4d4d4d, #4d4d4d);
}

/* =========================================================
   INPUT
========================================================= */

.mn-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.mn-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: var(--tc-474747, #474747);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.mn-input-wrap,
.mn-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.mn-input-wrap:focus-within,
.mn-textarea-wrap:focus-within {
  border-color: rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.6);

  background: rgba(255, 255, 255, 0.92);

  box-shadow: 0 0 0 3px rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.1);
}

.mn-input-wrap .v-icon,
.mn-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: var(--tc-474747, #474747);
}

.mn-wishes input,
.mn-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: var(--tc-3a3a3a, #3a3a3a);

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.mn-wishes input::placeholder,
.mn-wishes textarea::placeholder {
  color: var(--tc-585858, #585858);
}

.mn-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.mn-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: var(--tc-585858, #585858);

  font-size: 10px;
}

/* =========================================================
   SUBMIT
========================================================= */

.mn-wish-submit {
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

  color: var(--tc-fcfaf3, #fcfaf3);

  background: linear-gradient(135deg, var(--tc-474747, #474747), var(--tc-6b6b6b, #6b6b6b));

  box-shadow: 0 7px 16px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.mn-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.28);
}

.mn-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.mn-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.mn-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: var(--tc-5a5a5a, #5a5a5a);
}

.mn-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: var(--tc-474747, #474747);

  background: rgba(255, 255, 255, 0.5);

  border-radius: 50%;
}

.mn-no-wishes p {
  margin: 0 0 3px;

  color: var(--tc-6b6b6b, #6b6b6b);

  font-size: 14px;
  font-weight: 600;
}

.mn-no-wishes span {
  color: var(--tc-5a5a5a, #5a5a5a);

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.mn-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.mn-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: var(--tc-474747, #474747);
}

.mn-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.4));
}

.mn-list-heading > span:last-child {
  transform: rotate(180deg);
}

.mn-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.mn-list-heading .v-icon {
  color: var(--tc-474747, #474747);
}

/* =========================================================
   WISH CARD
========================================================= */

.mn-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.22);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.78), rgba(var(--tc-f4ead4-rgb, 244, 234, 212), 0.6));

  box-shadow: 0 5px 17px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.05);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mn-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.09);
}

.mn-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: var(--tc-4d4d4d, #4d4d4d);

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.mn-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: var(--tc-6b6b6b, #6b6b6b);

  background: linear-gradient(145deg, var(--tc-f0e5cd, #f0e5cd), var(--tc-dcc9a4, #dcc9a4));

  border-radius: 50%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.mn-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.mn-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.mn-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.mn-wish-header b {
  color: var(--tc-3a3a3a, #3a3a3a);

  font-size: 13px;
  font-weight: 700;
}

.mn-wish-header span {
  color: var(--tc-5a5a5a, #5a5a5a);

  font-size: 10px;
}

.mn-wish-header > .v-icon {
  flex: 0 0 auto;

  color: var(--tc-474747, #474747);

  margin-top: 2px;
}

.mn-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: var(--tc-5c5c5c, #5c5c5c);

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.mn-wish-list-enter-active,
.mn-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.mn-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.mn-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.mn-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: var(--tc-4d4d4d, #4d4d4d);
}

.mn-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.55));
}

.mn-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.mn-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.2);
  border-bottom: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.2);

  background: linear-gradient(
    90deg,
    rgba(var(--tc-fcfaf4-rgb, 252, 250, 244), 0.85),
    rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.55),
    rgba(var(--tc-fcfaf4-rgb, 252, 250, 244), 0.85)
  );
}

.mn-marquee-label {
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

  color: var(--tc-6b6b6b, #6b6b6b);

  background: linear-gradient(90deg, rgba(var(--tc-fcfaf4-rgb, 252, 250, 244), 1) 72%, rgba(var(--tc-fcfaf4-rgb, 252, 250, 244), 0));

  pointer-events: none;
}

.mn-marquee-label .v-icon {
  color: var(--tc-474747, #474747);
}

.mn-marquee-label span {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.mn-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.mn-wish-track {
  display: flex;

  width: max-content;

  animation: mn-wish-marquee 32s linear infinite;

  will-change: transform;
}

.mn-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.mn-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: var(--tc-5c5c5c, #5c5c5c);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.mn-wish-marquee-item i {
  color: var(--tc-474747, #474747);

  font-size: 11px;
  font-style: normal;

  animation: mn-marquee-heart 1.8s ease-in-out infinite;
}

.mn-wish-marquee-item strong {
  color: var(--tc-3a3a3a, #3a3a3a);

  font-weight: 700;
}

.mn-wish-marquee-item em {
  color: var(--tc-525252, #525252);

  font-style: italic;

  font-size: 11px;
}

.mn-marquee-dot {
  color: var(--tc-4d4d4d, #4d4d4d);

  font-size: 11px;
  font-weight: 400;
}

@keyframes mn-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes mn-marquee-heart {
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

.mn-wish-marquee:hover .mn-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .mn-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .mn-wishes::before {
    inset: 6px;

    border-radius: 18px;
  }

  .mn-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .mn-wish-form-card {
    padding: 21px 14px 18px;
  }

  .mn-wish-card {
    padding: 12px;
  }

  .mn-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .mn-wish-header b {
    font-size: 12px;
  }

  .mn-wish-content p {
    font-size: 11px;
  }

  .mn-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .mn-marquee-label {
    width: 62px;
  }

  .mn-marquee-window {
    padding-left: 61px;
  }

  .mn-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .mn-wish-marquee-item em {
    font-size: 10px;
  }

  .mn-marquee-label span {
    font-size: 11px;
  }
}

@media (max-width: 380px) {
  .mn-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .mn-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .mn-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mn-wish-track,
  .mn-wish-marquee-item i {
    animation: none;
  }

  .mn-wish-card,
  .mn-wish-submit,
  .mn-wish-list-enter-active,
  .mn-wish-list-leave-active {
    transition: none;
  }
}
</style>
