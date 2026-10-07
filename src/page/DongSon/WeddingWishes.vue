<template>
  <section class="wishes">
    <div class="wishes-header">
      <div class="wish-star">✦</div>
      <small>GUEST BOOK</small>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'guestbook', 'Eyebrow')" class="ds-top-custom-head">
        <p v-if="sectionOverride(sections, 'guestbook', 'Eyebrow')" class="ds-top-custom-head__eyebrow">{{ sectionOverride(sections, "guestbook", "Eyebrow") }}</p>
      </header>

      <h2>{{ sectionText(sections, "guestbook", "Heading", $t("Lời chúc yêu thương")) }}</h2>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'guestbook', 'Intro')" class="ds-sub-custom-head">
        <p v-if="sectionOverride(sections, 'guestbook', 'Intro')" class="ds-sub-custom-head__intro">{{ sectionOverride(sections, "guestbook", "Intro") }}</p>
      </header>

      <p>
        {{ $t("Những lời chúc sẽ trở thành một phần ký ức đẹp của chúng mình.") }}
      </p>
    </div>

    <!-- MARQUEE LỜI CHÚC -->
    <div v-if="allWishes.length" class="wish-marquee">
      <div class="marquee-label">
        <span>✦</span>
        <b>{{ $t("LỜI CHÚC") }}</b>
      </div>

      <div class="marquee-window">
        <div class="marquee-track">
          <div class="marquee-content">
            <span
              v-for="(wish, index) in allWishes"
              :key="`mq-a-${wish.Id || wish.id || index}`"
              class="marquee-item"
            >
              <i>◈</i>

              <strong>{{ getWishName(wish) }}</strong>

              <em>“{{ getWishMessage(wish) }}”</em>
            </span>
          </div>

          <div class="marquee-content" aria-hidden="true">
            <span
              v-for="(wish, index) in allWishes"
              :key="`mq-b-${wish.Id || wish.id || index}`"
              class="marquee-item"
            >
              <i>◈</i>

              <strong>{{ getWishName(wish) }}</strong>

              <em>“{{ getWishMessage(wish) }}”</em>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- FORM GỬI LỜI CHÚC -->
    <div class="wish-form-card">
      <div class="form-title">
        <span class="form-title-line" />

        <b>{{ $t("✦ Gửi lời yêu thương ✦") }}</b>

        <span class="form-title-line" />
      </div>

      <form @submit.prevent="submitWish">
        <label class="form-label" for="ds-wish-name">{{ $t("TÊN CỦA BẠN") }}</label>

        <input
          id="ds-wish-name"
          v-model.trim="form.name"
          type="text"
          maxlength="60"
          :placeholder="$t('Nhập tên của bạn')"
        />

        <label class="form-label" for="ds-wish-message">{{ $t("LỜI CHÚC") }}</label>

        <textarea
          id="ds-wish-message"
          v-model.trim="form.message"
          maxlength="500"
          :placeholder="$t('Viết lời chúc dành cho đôi uyên ương...')"
        ></textarea>

        <div class="char-count">{{ form.message.length }}/500</div>

        <button type="submit" class="wish-submit" :disabled="!canSubmit || submitting">
          {{ submitting ? $t("ĐANG GỬI...") : $t("GỬI LỜI CHÚC") }}
        </button>
      </form>
    </div>

    <!-- DANH SÁCH LỜI CHÚC -->
    <div
      v-if="allWishes.length"
      class="wish-list"
    >
      <div class="list-heading">
        <span />

        <b>{{ allWishes.length }} LỜI CHÚC</b>

        <span />
      </div>

      <article
        v-for="(wish, index) in allWishes"
        :key="wish.Id || wish.id || index"
        class="wish-card"
      >
        <div class="wish-avatar">
          {{ getWishName(wish).charAt(0).toUpperCase() }}
        </div>

        <div class="wish-body">
          <div class="wish-mark">“</div>

          <p>
            {{ getWishMessage(wish) }}
          </p>

          <div class="wish-author">
            <span />

            <b>{{ getWishName(wish) }}</b>

            <span v-if="getWishTime(wish)" class="wish-time">
              · {{ getWishTime(wish) }}
            </span>

            <span />
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty-wishes">
      <span>✦</span>
      <p>
        {{ $t("Hãy để lại một lời chúc thật đẹp cho đôi uyên ương.") }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, reactive, ref } from "vue";

import { useRoute } from "vue-router";

import { addWish, getAllWishes } from "@/model/api";
import { t, localeTag } from "@/lang";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  wishes: {
    type: Array,
    default: () => [],
  },
  wedding: {
    type: Object,
    default: () => ({}),
  },
});

/*
 * Lời chúc lấy từ API (getAllWishes) — dữ liệu thật
 * khách mời đã gửi. Fallback về props.wishes
 * (guestBook.Guest lưu trong thiệp) khi API trống.
 */
const route = useRoute();

const form = reactive({
  name: "",
  message: "",
});

const submitting = ref(false);

const localWishes = ref([]);

const allWishes = computed(() => {
  if (localWishes.value.length) {
    return localWishes.value;
  }

  return props.wishes || [];
});

const canSubmit = computed(() => {
  return form.name.trim().length > 0 && form.message.trim().length > 0;
});

function getWishName(wish) {
  return wish?.Name || wish?.name || wish?.GuestName || t("Một người bạn");
}

function getWishMessage(wish) {
  return wish?.Message || wish?.content || wish?.message || wish?.Wish || "";
}

function getWishTime(wish) {
  const raw = wish?.CreatedAt || wish?.createdAt;

  if (!raw) return "";

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(localeTag(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildSlug() {
  return route.params.slug;
}

async function loadWishes() {
  const slug = buildSlug();

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
    console.warn("[WeddingWishes] Không tải được lời chúc:", error);
  }
}

async function submitWish() {
  if (!form.name.trim()) {
    alert(t("Vui lòng nhập tên của bạn"));
    return;
  }

  if (!form.message.trim()) {
    alert(t("Vui lòng nhập lời chúc"));
    return;
  }

  const slug = buildSlug();

  if (!slug) {
    alert(t("Không xác định được thiệp. Vui lòng thử lại."));
    return;
  }

  submitting.value = true;

  try {
    const response = await addWish({
      slug,
      guestName: form.name.trim(),
      message: form.message.trim(),
    });

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

if(route.params.slug  && route.name === "WeddingByApi") {
  loadWishes();
}
</script>

<style scoped>
.wishes {
  padding: 70px 20px;
  background:
    radial-gradient(circle at center, rgba(var(--tc-c99552-rgb, 201, 149, 82), .13), transparent 40%),
    var(--tc-641914, #641914);
  color: var(--tc-ead7b5, #ead7b5);
  text-align: center;
}

.wishes-header {
  max-width: 500px;
  margin: auto;
}

.wish-star {
  margin-bottom: 20px;
  color: var(--tc-c99552, #c99552);
}

.wishes-header small {
  font-size: 10px;
  letter-spacing: .4em;
  color: var(--tc-c99552, #c99552);
}

h2 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 31px;
  font-weight: 400;
}

.wishes-header p {
  font-family: Georgia, serif;
  font-style: italic;
  line-height: 1.8;
  color: var(--tc-cdb99b, #cdb99b);
}

/* =========================================================
   MARQUEE
========================================================= */

.wish-marquee {
  display: flex;
  align-items: center;
  gap: 12px;

  max-width: 600px;
  margin: 30px auto 0;
  padding: 9px 14px;

  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .35);
  background: rgba(0,0,0,.12);
}

.marquee-label {
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 10px;
  letter-spacing: .18em;
  color: var(--tc-c99552, #c99552);
}

.marquee-window {
  flex: 1;
  min-width: 0;

  overflow: hidden;

  -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
}

.marquee-track {
  display: flex;

  width: max-content;

  animation: ds-marquee 34s linear infinite;
}

.marquee-content {
  display: flex;
  align-items: center;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 0 12px;

  white-space: nowrap;

  font-size: 12px;
  color: rgba(var(--tc-ead7b5-rgb, 234, 215, 181), .85);
}

.marquee-item i {
  font-style: normal;
  font-size: 11px;
  color: var(--tc-c99552, #c99552);
}

.marquee-item strong {
  font-weight: 700;
  color: var(--tc-d4a35f, #d4a35f);
}

.marquee-item em {
  font-style: italic;
  color: rgba(var(--tc-ead7b5-rgb, 234, 215, 181), .7);
}

@keyframes ds-marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

/* =========================================================
   FORM
========================================================= */

.wish-form-card {
  max-width: 600px;
  margin: 26px auto 0;
  padding: 26px 22px;

  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .7);
  background: rgba(0,0,0,.28);

  box-shadow: 0 10px 26px rgba(0,0,0,.25);

  text-align: left;
}

.form-title {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 20px;

  text-align: center;
}

.form-title b {
  font-family: Georgia, serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: .08em;
  color: var(--tc-d4a35f, #d4a35f);

  white-space: nowrap;
}

.form-title-line {
  flex: 1;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c99552-rgb, 201, 149, 82), .5));
}

.form-title-line:last-child {
  transform: scaleX(-1);
}

.form-label {
  display: block;

  margin-bottom: 7px;

  font-size: 10px;
  letter-spacing: .22em;
  color: var(--tc-c99552, #c99552);
}

.wish-form-card input,
.wish-form-card textarea {
  width: 100%;

  margin-bottom: 16px;
  padding: 12px 14px;

  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .5);
  border-radius: 0;

  outline: none;

  font-family: Georgia, serif;
  font-size: 14px;

  color: var(--tc-ead7b5, #ead7b5);
  background: rgba(0,0,0,.14);

  transition: border-color .2s ease, box-shadow .2s ease;
}

.wish-form-card textarea {
  min-height: 100px;

  resize: vertical;

  line-height: 1.7;
}

.wish-form-card input::placeholder,
.wish-form-card textarea::placeholder {
  color: rgba(var(--tc-ead7b5-rgb, 234, 215, 181), .65);
}

.wish-form-card input:focus,
.wish-form-card textarea:focus {
  border-color: var(--tc-c99552, #c99552);

  box-shadow: 0 0 0 3px rgba(var(--tc-c99552-rgb, 201, 149, 82), .15);
}

.char-count {
  margin: -10px 0 14px;

  text-align: right;

  font-size: 11px;
  color: rgba(var(--tc-ead7b5-rgb, 234, 215, 181), .65);
}

.wish-submit {
  display: block;

  width: 100%;
  padding: 13px 20px;

  border: 1px solid var(--tc-c99552, #c99552);

  font-family: Georgia, serif;
  font-size: 12px;
  letter-spacing: .24em;

  color: var(--tc-641914, #641914);
  background: linear-gradient(180deg, var(--tc-d4a35f, #d4a35f), var(--tc-c99552, #c99552));

  cursor: pointer;

  transition: filter .2s ease, transform .2s ease;
}

.wish-submit:hover:not(:disabled) {
  filter: brightness(1.06);
}

.wish-submit:active:not(:disabled) {
  transform: scale(.99);
}

.wish-submit:disabled {
  opacity: .55;

  cursor: not-allowed;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.wish-list {
  display: grid;
  gap: 15px;
  max-width: 600px;
  margin: 35px auto 0;
}

.list-heading {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 4px;

  font-size: 10px;
  letter-spacing: .24em;
  color: var(--tc-c99552, #c99552);
}

.list-heading span {
  flex: 1;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c99552-rgb, 201, 149, 82), .45));
}

.list-heading span:last-child {
  transform: scaleX(-1);
}

.wish-card {
  position: relative;

  display: flex;
  align-items: flex-start;
  gap: 14px;

  padding: 22px 20px;

  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .6);
  background: rgba(0,0,0,.24);

  box-shadow: 0 8px 22px rgba(0,0,0,.22);

  text-align: left;
}

.wish-card::before {
  content: "";
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .22);
  pointer-events: none;
}

.wish-avatar {
  flex: 0 0 40px;

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .5);
  border-radius: 50%;

  font-family: Georgia, serif;
  font-size: 15px;
  font-weight: 700;

  color: var(--tc-d4a35f, #d4a35f);
  background: rgba(var(--tc-c99552-rgb, 201, 149, 82), .14);
}

.wish-body {
  flex: 1;
  min-width: 0;
}

.wish-mark {
  font-family: Georgia, serif;
  font-size: 28px;
  line-height: 1;

  color: var(--tc-c99552, #c99552);
}

.wish-card p {
  margin: 2px 0 0;
  font-family: Georgia, serif;
  font-size: 14px;
  line-height: 1.9;

  overflow-wrap: anywhere;
}

.wish-author {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
  margin-top: 16px;
}

.wish-author span {
  width: 26px;
  height: 1px;
  background: var(--tc-a96b32, #a96b32);
}

.wish-author b {
  font-size: 10px;
  letter-spacing: .2em;
  font-weight: 400;
  color: var(--tc-c99552, #c99552);

  white-space: nowrap;
}

.wish-time {
  width: auto !important;
  height: auto !important;

  font-size: 10px;
  letter-spacing: .06em;
  color: rgba(var(--tc-ead7b5-rgb, 234, 215, 181), .65);

  white-space: nowrap;
}

/* =========================================================
   EMPTY
========================================================= */

.empty-wishes {
  max-width: 350px;
  margin: 35px auto 0;
  padding: 30px;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .3);
}

.empty-wishes span {
  color: var(--tc-c99552, #c99552);
}

.empty-wishes p {
  font-family: Georgia, serif;
  line-height: 1.8;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .wishes {
    padding: 54px 14px;
  }

  .wish-marquee {
    margin-top: 24px;
  }

  .wish-form-card {
    padding: 20px 14px;
  }

  .wish-card {
    padding: 16px 14px;
    gap: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ds-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ds-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ds-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ds-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ds-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ds-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ds-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ds-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
