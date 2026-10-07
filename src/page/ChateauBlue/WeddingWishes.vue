<template>
  <section class="ct-wishes">
    <div class="ct-wishes__ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <p v-if="eyebrow" class="ct-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <p v-if="intro" class="ct-wishes__intro">
      {{ intro }}
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="ct-wish-form-card">
      <div class="ct-form-decoration ct-form-decoration--tl">❦</div>
      <div class="ct-form-decoration ct-form-decoration--tr">✦</div>

      <div class="ct-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>{{ $t("Gửi lời yêu thương") }}</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="ct-wish-marquee">
        <div class="ct-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ $t("LỜI CHÚC") }}</span>
        </div>

        <div class="ct-marquee-window">
          <div class="ct-wish-track">
            <div class="ct-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="ct-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="ct-marquee-dot">✦</b>
              </span>
            </div>

            <div class="ct-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="ct-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="ct-marquee-dot">✦</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="ct-input-group">
          <label>{{ $t("TÊN CỦA BẠN") }}</label>

          <div class="ct-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              :placeholder="$t('Nhập tên của bạn')"
            />
          </div>
        </div>

        <div class="ct-input-group">
          <label>{{ $t("LỜI CHÚC") }}</label>

          <div class="ct-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              :placeholder="$t('Viết lời chúc dành cho cô dâu & chú rể...')"
            ></textarea>
          </div>

          <div class="ct-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="ct-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? $t("ĐANG GỬI...") : $t("GỬI LỜI CHÚC") }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="ct-no-wishes">
      <div class="ct-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>{{ $t("Chưa có lời chúc nào") }}</p>

      <span>{{ $t("Hãy là người đầu tiên gửi lời yêu thương") }}</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="ct-wish-list">
      <div class="ct-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="ct-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="ct-wish-card">
          <div class="ct-card-flower">❦</div>

          <div class="ct-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="ct-wish-content">
            <div class="ct-wish-header">
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
    <div class="ct-wishes__bottom">
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
    console.warn("[ChateauBlue][Wishes] Không tải được lời chúc:", error);
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

  const slug = route.params.slug || "";

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
.ct-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--tc-2f3e5c, #2f3e5c);

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.45));

  box-shadow: 0 12px 35px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  border-radius: 28px;

  overflow: hidden;
}

.ct-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.28);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.ct-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: var(--tc-4d5a75, #4d5a75);
}

.ct-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.7));
}

.ct-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.ct-eyebrow {
  position: relative;

  margin: 0;

  color: var(--tc-48546e, #48546e);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ct-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: var(--tc-505d78, #505d78);

  font-size: 13px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   FORM CARD
========================================================= */

.ct-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(var(--tc-f4f7fb-rgb, 244, 247, 251), 0.6));

  box-shadow: 0 8px 25px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.07);

  border-radius: 20px;

  overflow: hidden;
}

.ct-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-ccd6e8-rgb, 204, 214, 232), 0.3), transparent 70%);

  pointer-events: none;
}

.ct-form-decoration {
  position: absolute;

  color: var(--tc-4d5a75, #4d5a75);

  opacity: 0.65;

  font-size: 12px;
}

.ct-form-decoration--tl { top: 13px; left: 15px; }
.ct-form-decoration--tr { top: 13px; right: 15px; }

.ct-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: var(--tc-5c6d8f, #5c6d8f);

  font-size: 13px;
  font-weight: 600;
}

.ct-form-title .v-icon {
  color: var(--tc-4d5a75, #4d5a75);
}

/* =========================================================
   INPUT
========================================================= */

.ct-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.ct-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: var(--tc-48546e, #48546e);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.ct-input-wrap,
.ct-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.ct-input-wrap:focus-within,
.ct-textarea-wrap:focus-within {
  border-color: rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.6);

  background: rgba(255, 255, 255, 0.92);

  box-shadow: 0 0 0 3px rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.1);
}

.ct-input-wrap .v-icon,
.ct-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: var(--tc-48546e, #48546e);
}

.ct-wishes input,
.ct-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: var(--tc-2f3e5c, #2f3e5c);

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.ct-wishes input::placeholder,
.ct-wishes textarea::placeholder {
  color: var(--tc-566074, #566074);
}

.ct-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.ct-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: var(--tc-566074, #566074);

  font-size: 10px;
}

/* =========================================================
   SUBMIT
========================================================= */

.ct-wish-submit {
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

  color: var(--tc-fcfdfe, #fcfdfe);

  background: linear-gradient(135deg, var(--tc-48546e, #48546e), var(--tc-5c6d8f, #5c6d8f));

  box-shadow: 0 7px 16px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.ct-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.28);
}

.ct-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.ct-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.ct-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: var(--tc-586276, #586276);
}

.ct-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: var(--tc-48546e, #48546e);

  background: rgba(255, 255, 255, 0.5);

  border-radius: 50%;
}

.ct-no-wishes p {
  margin: 0 0 3px;

  color: var(--tc-5c6d8f, #5c6d8f);

  font-size: 14px;
  font-weight: 600;
}

.ct-no-wishes span {
  color: var(--tc-586276, #586276);

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.ct-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.ct-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: var(--tc-48546e, #48546e);
}

.ct-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.4));
}

.ct-list-heading > span:last-child {
  transform: rotate(180deg);
}

.ct-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.ct-list-heading .v-icon {
  color: var(--tc-48546e, #48546e);
}

/* =========================================================
   WISH CARD
========================================================= */

.ct-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.22);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.78), rgba(var(--tc-f4f7fb-rgb, 244, 247, 251), 0.6));

  box-shadow: 0 5px 17px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.05);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ct-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.09);
}

.ct-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: var(--tc-4d5a75, #4d5a75);

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.ct-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: var(--tc-5c6d8f, #5c6d8f);

  background: linear-gradient(145deg, var(--tc-e7ecf5, #e7ecf5), var(--tc-ccd6e8, #ccd6e8));

  border-radius: 50%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.ct-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.ct-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.ct-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.ct-wish-header b {
  color: var(--tc-2f3e5c, #2f3e5c);

  font-size: 13px;
  font-weight: 700;
}

.ct-wish-header span {
  color: var(--tc-586276, #586276);

  font-size: 10px;
}

.ct-wish-header > .v-icon {
  flex: 0 0 auto;

  color: var(--tc-48546e, #48546e);

  margin-top: 2px;
}

.ct-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: var(--tc-5a6378, #5a6378);

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.ct-wish-list-enter-active,
.ct-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.ct-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.ct-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.ct-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: var(--tc-4d5a75, #4d5a75);
}

.ct-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.55));
}

.ct-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.ct-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.2);
  border-bottom: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.2);

  background: linear-gradient(
    90deg,
    rgba(var(--tc-fcfcfd-rgb, 252, 252, 253), 0.85),
    rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.55),
    rgba(var(--tc-fcfcfd-rgb, 252, 252, 253), 0.85)
  );
}

.ct-marquee-label {
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

  color: var(--tc-5c6d8f, #5c6d8f);

  background: linear-gradient(90deg, rgba(var(--tc-fcfcfd-rgb, 252, 252, 253), 1) 72%, rgba(var(--tc-fcfcfd-rgb, 252, 252, 253), 0));

  pointer-events: none;
}

.ct-marquee-label .v-icon {
  color: var(--tc-48546e, #48546e);
}

.ct-marquee-label span {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.ct-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.ct-wish-track {
  display: flex;

  width: max-content;

  animation: ct-wish-marquee 32s linear infinite;

  will-change: transform;
}

.ct-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.ct-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: var(--tc-5a6378, #5a6378);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.ct-wish-marquee-item i {
  color: var(--tc-48546e, #48546e);

  font-size: 11px;
  font-style: normal;

  animation: ct-marquee-heart 1.8s ease-in-out infinite;
}

.ct-wish-marquee-item strong {
  color: var(--tc-2f3e5c, #2f3e5c);

  font-weight: 700;
}

.ct-wish-marquee-item em {
  color: var(--tc-535f7a, #535f7a);

  font-style: italic;

  font-size: 11px;
}

.ct-marquee-dot {
  color: var(--tc-4d5a75, #4d5a75);

  font-size: 11px;
  font-weight: 400;
}

@keyframes ct-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes ct-marquee-heart {
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

.ct-wish-marquee:hover .ct-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .ct-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .ct-wishes::before {
    inset: 6px;

    border-radius: 18px;
  }

  .ct-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .ct-wish-form-card {
    padding: 21px 14px 18px;
  }

  .ct-wish-card {
    padding: 12px;
  }

  .ct-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .ct-wish-header b {
    font-size: 12px;
  }

  .ct-wish-content p {
    font-size: 11px;
  }

  .ct-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .ct-marquee-label {
    width: 62px;
  }

  .ct-marquee-window {
    padding-left: 61px;
  }

  .ct-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .ct-wish-marquee-item em {
    font-size: 10px;
  }

  .ct-marquee-label span {
    font-size: 11px;
  }
}

@media (max-width: 380px) {
  .ct-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .ct-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ct-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ct-wish-track,
  .ct-wish-marquee-item i {
    animation: none;
  }

  .ct-wish-card,
  .ct-wish-submit,
  .ct-wish-list-enter-active,
  .ct-wish-list-leave-active {
    transition: none;
  }
}
</style>
