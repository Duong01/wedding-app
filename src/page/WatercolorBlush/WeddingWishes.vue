<template>
  <section class="wb-wishes">
    <div class="wb-wishes__ornament">
      <span></span>
      <v-icon size="15">mdi-heart-outline</v-icon>
      <span></span>
    </div>

    <p v-if="eyebrow" class="wb-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <p v-if="intro" class="wb-wishes__intro">
      {{ intro }}
    </p>

    <!-- =========================================
         WISH FORM
    ========================================== -->
    <div class="wb-wish-form-card">
      <div class="wb-form-decoration wb-form-decoration--tl">❀</div>
      <div class="wb-form-decoration wb-form-decoration--tr">❁</div>

      <div class="wb-form-title">
        <v-icon size="18">mdi-feather</v-icon>
        <span>{{ $t("Gửi lời yêu thương") }}</span>
      </div>

      <!-- MARQUEE -->
      <div v-if="items.length" class="wb-wish-marquee">
        <div class="wb-marquee-label">
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ $t("LỜI CHÚC") }}</span>
        </div>

        <div class="wb-marquee-window">
          <div class="wb-wish-track">
            <div class="wb-wish-track-content">
              <span
                v-for="(item, index) in items"
                :key="`marquee-a-${item.Id || index}`"
                class="wb-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="wb-marquee-dot">❁</b>
              </span>
            </div>

            <div class="wb-wish-track-content" aria-hidden="true">
              <span
                v-for="(item, index) in items"
                :key="`marquee-b-${item.Id || index}`"
                class="wb-wish-marquee-item"
              >
                <i>♥</i>

                <strong>{{ getName(item) }}</strong>

                <em>“{{ getMessage(item) }}”</em>

                <b class="wb-marquee-dot">❁</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitWish">
        <div class="wb-input-group">
          <label>{{ $t("TÊN CỦA BẠN") }}</label>

          <div class="wb-input-wrap">
            <v-icon size="17">mdi-account-outline</v-icon>

            <input
              v-model.trim="form.name"
              type="text"
              maxlength="60"
              :placeholder="$t('Nhập tên của bạn')"
            />
          </div>
        </div>

        <div class="wb-input-group">
          <label>{{ $t("LỜI CHÚC") }}</label>

          <div class="wb-textarea-wrap">
            <v-icon size="17">mdi-heart-outline</v-icon>

            <textarea
              v-model.trim="form.message"
              maxlength="500"
              :placeholder="$t('Viết lời chúc dành cho cô dâu & chú rể...')"
            ></textarea>
          </div>

          <div class="wb-character-count">{{ form.message.length }}/500</div>
        </div>

        <button type="submit" class="wb-wish-submit" :disabled="!canSubmit || submitting">
          <span>{{ submitting ? $t("ĐANG GỬI...") : $t("GỬI LỜI CHÚC") }}</span>

          <v-icon size="15">mdi-heart-outline</v-icon>
        </button>
      </form>
    </div>

    <!-- =========================================
         EMPTY
    ========================================== -->
    <div v-if="items.length === 0" class="wb-no-wishes">
      <div class="wb-empty-flower">
        <v-icon size="27">mdi-flower-outline</v-icon>
      </div>

      <p>{{ $t("Chưa có lời chúc nào") }}</p>

      <span>{{ $t("Hãy là người đầu tiên gửi lời yêu thương") }}</span>
    </div>

    <!-- =========================================
         WISHES LIST
    ========================================== -->
    <div v-else class="wb-wish-list">
      <div class="wb-list-heading">
        <span></span>

        <div>
          <v-icon size="13">mdi-heart</v-icon>
          <span>{{ items.length }} lời chúc</span>
        </div>

        <span></span>
      </div>

      <TransitionGroup name="wb-wish-list" tag="div">
        <article v-for="(item, index) in items" :key="item.Id || index" class="wb-wish-card">
          <div class="wb-card-flower">❀</div>

          <div class="wb-wish-avatar">
            {{ getName(item).charAt(0).toUpperCase() }}
          </div>

          <div class="wb-wish-content">
            <div class="wb-wish-header">
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
    <div class="wb-wishes__bottom">
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
    console.warn("[WatercolorBlush][Wishes] Không tải được lời chúc:", error);
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
.wb-wishes {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 35px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--tc-8a4a5c, #8a4a5c);

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.6), rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.45));

  box-shadow: 0 12px 35px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.7);

  border-radius: 28px;

  overflow: hidden;
}

.wb-wishes::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.28);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   TOP ORNAMENT
========================================================= */

.wb-wishes__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 11px;

  color: var(--tc-a05a6e, #a05a6e);
}

.wb-wishes__ornament span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.7));
}

.wb-wishes__ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   HEADER
========================================================= */

.wb-eyebrow {
  position: relative;

  margin: 0;

  color: var(--tc-a5586c, #a5586c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.wb-wishes h2 {
  position: relative;

  margin: 5px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 35px);
  font-weight: 600;

  color: var(--tc-8a4a5c, #8a4a5c);
}

.wb-wishes__intro {
  position: relative;

  margin: 0 0 25px;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 13px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   FORM CARD
========================================================= */

.wb-wish-form-card {
  position: relative;

  margin: 0 auto 27px;

  padding: 23px 18px 20px;

  max-width: 460px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(var(--tc-fef4f7-rgb, 254, 244, 247), 0.6));

  box-shadow: 0 8px 25px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.07);

  border-radius: 20px;

  overflow: hidden;
}

.wb-wish-form-card::before {
  content: "";
  position: absolute;

  width: 180px;
  height: 180px;

  top: -125px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-f2ccd8-rgb, 242, 204, 216), 0.3), transparent 70%);

  pointer-events: none;
}

.wb-form-decoration {
  position: absolute;

  color: var(--tc-a05a6e, #a05a6e);

  opacity: 0.65;

  font-size: 12px;
}

.wb-form-decoration--tl { top: 13px; left: 15px; }
.wb-form-decoration--tr { top: 13px; right: 15px; }

.wb-form-title {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 18px;

  color: var(--tc-b06a80, #b06a80);

  font-size: 13px;
  font-weight: 600;
}

.wb-form-title .v-icon {
  color: var(--tc-a05a6e, #a05a6e);
}

/* =========================================================
   INPUT
========================================================= */

.wb-input-group {
  position: relative;

  margin-bottom: 13px;

  text-align: left;
}

.wb-input-group label {
  display: block;

  margin: 0 0 5px 5px;

  color: var(--tc-a5586c, #a5586c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.wb-input-wrap,
.wb-textarea-wrap {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  padding: 10px 12px;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.3);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.7);

  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.wb-input-wrap:focus-within,
.wb-textarea-wrap:focus-within {
  border-color: rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.6);

  background: rgba(255, 255, 255, 0.92);

  box-shadow: 0 0 0 3px rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.1);
}

.wb-input-wrap .v-icon,
.wb-textarea-wrap .v-icon {
  flex: 0 0 auto;

  margin-top: 1px;

  color: var(--tc-a5586c, #a5586c);
}

.wb-wishes input,
.wb-wishes textarea {
  width: 100%;

  border: 0;
  outline: 0;

  color: var(--tc-8a4a5c, #8a4a5c);

  background: transparent;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;
}

.wb-wishes input::placeholder,
.wb-wishes textarea::placeholder {
  color: var(--tc-96626f, #96626f);
}

.wb-wishes textarea {
  min-height: 82px;

  resize: vertical;

  line-height: 1.6;
}

.wb-character-count {
  position: absolute;

  right: 7px;
  bottom: -15px;

  color: var(--tc-96626f, #96626f);

  font-size: 10px;
}

/* =========================================================
   SUBMIT
========================================================= */

.wb-wish-submit {
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

  color: var(--tc-fefafb, #fefafb);

  background: linear-gradient(135deg, var(--tc-a5586c, #a5586c), var(--tc-b06a80, #b06a80));

  box-shadow: 0 7px 16px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.wb-wish-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.28);
}

.wb-wish-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.wb-wish-submit:disabled {
  cursor: not-allowed;

  opacity: 0.48;
}

/* =========================================================
   EMPTY
========================================================= */

.wb-no-wishes {
  position: relative;

  padding: 25px 10px 20px;

  color: var(--tc-9c6a76, #9c6a76);
}

.wb-empty-flower {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 9px;

  color: var(--tc-a5586c, #a5586c);

  background: rgba(255, 255, 255, 0.5);

  border-radius: 50%;
}

.wb-no-wishes p {
  margin: 0 0 3px;

  color: var(--tc-b06a80, #b06a80);

  font-size: 14px;
  font-weight: 600;
}

.wb-no-wishes span {
  color: var(--tc-9c6a76, #9c6a76);

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   LIST
========================================================= */

.wb-wish-list {
  position: relative;

  max-width: 460px;

  margin: 0 auto;
}

.wb-list-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 5px 15px;

  color: var(--tc-a5586c, #a5586c);
}

.wb-list-heading > span {
  flex: 1;

  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.4));
}

.wb-list-heading > span:last-child {
  transform: rotate(180deg);
}

.wb-list-heading div {
  display: flex;
  align-items: center;
  gap: 5px;

  white-space: nowrap;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.wb-list-heading .v-icon {
  color: var(--tc-a5586c, #a5586c);
}

/* =========================================================
   WISH CARD
========================================================= */

.wb-wish-card {
  position: relative;

  display: flex;
  gap: 12px;

  margin-bottom: 11px;

  padding: 14px 14px 14px 13px;

  text-align: left;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.22);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.78), rgba(var(--tc-fef4f7-rgb, 254, 244, 247), 0.6));

  box-shadow: 0 5px 17px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.05);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wb-wish-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 9px 23px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.09);
}

.wb-card-flower {
  position: absolute;

  right: 8px;
  bottom: -8px;

  color: var(--tc-a05a6e, #a05a6e);

  font-size: 28px;

  opacity: 0.16;

  transform: rotate(-20deg);

  pointer-events: none;
}

.wb-wish-avatar {
  position: relative;

  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: var(--tc-b06a80, #b06a80);

  background: linear-gradient(145deg, var(--tc-fae8ed, #fae8ed), var(--tc-f2ccd8, #f2ccd8));

  border-radius: 50%;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 17px;
  font-weight: 600;

  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.wb-wish-content {
  position: relative;

  flex: 1;

  min-width: 0;
}

.wb-wish-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.wb-wish-header > div {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.wb-wish-header b {
  color: var(--tc-8a4a5c, #8a4a5c);

  font-size: 13px;
  font-weight: 700;
}

.wb-wish-header span {
  color: var(--tc-9c6a76, #9c6a76);

  font-size: 10px;
}

.wb-wish-header > .v-icon {
  flex: 0 0 auto;

  color: var(--tc-a5586c, #a5586c);

  margin-top: 2px;
}

.wb-wish-content p {
  position: relative;

  margin: 5px 0 0;
  padding-right: 8px;

  color: var(--tc-a06a7c, #a06a7c);

  font-size: 12px;

  line-height: 1.65;

  overflow-wrap: anywhere;
}

/* =========================================================
   TRANSITION
========================================================= */

.wb-wish-list-enter-active,
.wb-wish-list-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.wb-wish-list-enter-from {
  opacity: 0;

  transform: translateY(-15px) scale(0.96);
}

.wb-wish-list-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.97);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.wb-wishes__bottom {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: var(--tc-a05a6e, #a05a6e);
}

.wb-wishes__bottom span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.55));
}

.wb-wishes__bottom span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MARQUEE
========================================================= */

.wb-wish-marquee {
  position: relative;

  width: 100%;

  margin: 0 0 20px;

  padding: 9px 0;

  overflow: hidden;

  border-top: 1px solid rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.2);
  border-bottom: 1px solid rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.2);

  background: linear-gradient(
    90deg,
    rgba(var(--tc-fffafc-rgb, 255, 250, 252), 0.85),
    rgba(var(--tc-f1ebf4-rgb, 241, 235, 244), 0.55),
    rgba(var(--tc-fffafc-rgb, 255, 250, 252), 0.85)
  );
}

.wb-marquee-label {
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

  color: var(--tc-b06a80, #b06a80);

  background: linear-gradient(90deg, rgba(var(--tc-fffafc-rgb, 255, 250, 252), 1) 72%, rgba(var(--tc-fffafc-rgb, 255, 250, 252), 0));

  pointer-events: none;
}

.wb-marquee-label .v-icon {
  color: var(--tc-a5586c, #a5586c);
}

.wb-marquee-label span {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.wb-marquee-window {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding-left: 73px;

  mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%);
}

.wb-wish-track {
  display: flex;

  width: max-content;

  animation: wb-wish-marquee 32s linear infinite;

  will-change: transform;
}

.wb-wish-track-content {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}

.wb-wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding-right: 30px;

  color: var(--tc-a06a7c, #a06a7c);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 11px;

  white-space: nowrap;
}

.wb-wish-marquee-item i {
  color: var(--tc-a5586c, #a5586c);

  font-size: 11px;
  font-style: normal;

  animation: wb-marquee-heart 1.8s ease-in-out infinite;
}

.wb-wish-marquee-item strong {
  color: var(--tc-8a4a5c, #8a4a5c);

  font-weight: 700;
}

.wb-wish-marquee-item em {
  color: var(--tc-a2667a, #a2667a);

  font-style: italic;

  font-size: 11px;
}

.wb-marquee-dot {
  color: var(--tc-a05a6e, #a05a6e);

  font-size: 11px;
  font-weight: 400;
}

@keyframes wb-wish-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes wb-marquee-heart {
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

.wb-wish-marquee:hover .wb-wish-track {
  animation-play-state: paused;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .wb-wishes {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .wb-wishes::before {
    inset: 6px;

    border-radius: 18px;
  }

  .wb-wishes__intro {
    margin-bottom: 21px;

    font-size: 12px;
  }

  .wb-wish-form-card {
    padding: 21px 14px 18px;
  }

  .wb-wish-card {
    padding: 12px;
  }

  .wb-wish-avatar {
    flex-basis: 35px;

    width: 35px;
    height: 35px;

    font-size: 15px;
  }

  .wb-wish-header b {
    font-size: 12px;
  }

  .wb-wish-content p {
    font-size: 11px;
  }

  .wb-wish-marquee {
    margin-bottom: 17px;

    padding: 8px 0;
  }

  .wb-marquee-label {
    width: 62px;
  }

  .wb-marquee-window {
    padding-left: 61px;
  }

  .wb-wish-marquee-item {
    gap: 5px;

    padding-right: 23px;

    font-size: 10px;
  }

  .wb-wish-marquee-item em {
    font-size: 10px;
  }

  .wb-marquee-label span {
    font-size: 11px;
  }
}

@media (max-width: 380px) {
  .wb-wishes {
    padding-left: 9px;
    padding-right: 9px;
  }

  .wb-wish-form-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  .wb-wish-card {
    gap: 9px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .wb-wish-track,
  .wb-wish-marquee-item i {
    animation: none;
  }

  .wb-wish-card,
  .wb-wish-submit,
  .wb-wish-list-enter-active,
  .wb-wish-list-leave-active {
    transition: none;
  }
}
</style>
