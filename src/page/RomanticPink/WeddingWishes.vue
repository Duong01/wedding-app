<template>
  <section class="wishes">
    <!-- =========================
         HEADER
    ========================== -->
    <div class="gg-eyebrow">LỜI CHÚC TỪ BẠN</div>

    <h2 class="gg-title">Sổ lưu bút</h2>

    <p class="gg-lead">
      Mỗi lời chúc là một kỷ niệm đẹp<br />
      mà chúng mình muốn lưu giữ trong ngày đặc biệt này
    </p>

    <!-- =========================
         WISH MARQUEE
    ========================== -->
    <div v-if="items.length" class="wish-marquee">
      <div class="marquee-window">
        <div class="wish-track">
          <div class="wish-track-content">
            <span
              v-for="(item, index) in items"
              :key="`marquee-a-${item.Id || index}`"
              class="wish-marquee-item"
            >
              <strong>{{ item.Name || item.GuestName || "Khách mời" }}</strong>

              <em>
                “{{ item.Content || item.Message || "Một lời chúc yêu thương" }}”
              </em>

              <b class="marquee-dot">✦</b>
            </span>
          </div>

          <div class="wish-track-content" aria-hidden="true">
            <span
              v-for="(item, index) in items"
              :key="`marquee-b-${item.Id || index}`"
              class="wish-marquee-item"
            >
              <strong>{{ item.Name || item.GuestName || "Khách mời" }}</strong>

              <em>
                “{{ item.Content || item.Message || "Một lời chúc yêu thương" }}”
              </em>

              <b class="marquee-dot">✦</b>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================
         WISH FORM
    ========================== -->
    <div class="wish-form-card">
      <form @submit.prevent="add">
        <div class="input-group">
          <label>TÊN CỦA BẠN</label>

          <input
            v-model.trim="name"
            type="text"
            maxlength="60"
            placeholder="Nhập tên của bạn"
          />
        </div>

        <div class="input-group">
          <label>LỜI CHÚC</label>

          <textarea
            v-model.trim="message"
            rows="4"
            maxlength="500"
            placeholder="Viết lời chúc dành cho cô dâu & chú rể..."
          ></textarea>

          <div class="character-count">{{ message.length }}/500</div>
        </div>

        <button type="submit" class="wish-submit" :disabled="!message">
          GỬI LỜI CHÚC
        </button>
      </form>
    </div>

    <!-- =========================
         EMPTY
    ========================== -->
    <div v-if="items.length === 0" class="no-wishes">
      <p>Chưa có lời chúc nào. Hãy là người đầu tiên!</p>
    </div>

    <!-- =========================
         WISHES LIST
    ========================== -->
    <div v-else class="wish-list">
      <TransitionGroup name="wish-list" tag="div">
        <article
          v-for="(item, index) in items"
          :key="item.Id || index"
          class="wish-card"
        >
          <div class="wish-avatar">
            {{ (item.Name || item.GuestName || "K").charAt(0).toUpperCase() }}
          </div>

          <div class="wish-content">
            <div class="wish-header">
              <b>{{ item.Name || item.GuestName || "Khách mời" }}</b>

              <span v-if="item.CreatedAt">
                {{ formatTime(item.CreatedAt) }}
              </span>
            </div>

            <p>{{ item.Content || item.Message }}</p>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { useRoute } from "vue-router";

import { addWish, getAllWishes } from "@/model/api";

const props = defineProps({
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

const name = ref("");
const message = ref("");

const added = ref([]);

const localWishes = ref([]);

const items = computed(() => {
  if (localWishes.value.length) {
    return localWishes.value;
  }

  return [...added.value, ...props.wishes];
});

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
    console.warn("[WeddingWishes] Không tải được lời chúc:", error);
  }
}

if (route.params.slug && route.name === "WeddingByApi") {
  loadWishes();
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

async function add() {
  const content = message.value?.trim();

  if (!content) return;

  const slug = route.params.slug
    ? route.params.token
      ? `${route.params.slug}/${route.params.token}`
      : route.params.slug
    : "";

  try {
    const response = await addWish({
      slug,
      guestName: name.value?.trim() || "Khách mời",
      message: content,
    });

    const result = response?.data;

    if (result && result.status === "success") {
      name.value = "";
      message.value = "";

      await loadWishes();
    } else {
      added.value.unshift({
        Id: `local-${Date.now()}`,

        Name: name.value?.trim() || "Khách mời",

        Content: content,

        CreatedAt: new Date().toISOString(),
      });

      name.value = "";
      message.value = "";
    }
  } catch (error) {
    console.warn("[WeddingWishes] Không gửi được lời chúc:", error);

    added.value.unshift({
      Id: `local-${Date.now()}`,

      Name: name.value?.trim() || "Khách mời",

      Content: content,

      CreatedAt: new Date().toISOString(),
    });

    name.value = "";
    message.value = "";
  }
}
</script>

<style scoped>
.wishes {
  text-align: center;
}

/* =====================================================
   MARQUEE
===================================================== */

.wish-marquee {
  margin-top: 24px;
}

.marquee-window {
  overflow: hidden;

  padding: 10px 0;

  border-top: 1px solid rgba(203, 93, 108, 0.25);
  border-bottom: 1px solid rgba(203, 93, 108, 0.25);
}

.wish-track {
  display: flex;
  width: max-content;

  animation: marquee 42s linear infinite;
}

.wish-track-content {
  display: flex;
  align-items: center;
}

.wish-marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 0 18px;

  white-space: nowrap;

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
}

.wish-marquee-item strong {
  color: var(--gg-rose, #cb5d6c);
  font-weight: 600;
}

.wish-marquee-item em {
  color: var(--gg-deep, #933845);
  font-style: italic;
  opacity: 0.85;
}

.marquee-dot {
  color: var(--gg-rose, #cb5d6c);
  font-size: 9px;
  opacity: 0.6;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* =====================================================
   FORM
===================================================== */

.wish-form-card {
  max-width: 100%;
  margin: 26px auto 0;
  padding: 22px 18px;

  border-radius: 16px;
  border: 1px solid rgba(203, 93, 108, 0.35);

  background-color: rgba(255, 255, 255, 0.8);

  box-shadow: 0 10px 30px -8px rgba(147, 56, 69, 0.2);

  text-align: left;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.8;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 10px 14px;

  border: 1px solid rgba(203, 93, 108, 0.3);
  border-radius: 12px;

  background-color: #ffffff;
  color: var(--gg-deep, #933845);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 14px;
  line-height: 1.6;

  outline: none;
  resize: vertical;
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  color: rgba(147, 56, 69, 0.45);
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: var(--gg-rose, #cb5d6c);
}

.character-count {
  margin-top: 5px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  text-align: right;
  opacity: 0.6;
}

.wish-submit {
  width: 100%;
  padding: 11px;

  border: none;
  border-radius: 999px;

  background-color: var(--gg-rose, #cb5d6c);
  color: #ffffff;

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;

  cursor: pointer;
}

.wish-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wish-submit:not(:disabled):hover {
  background-color: var(--gg-deep, #933845);
}

/* =====================================================
   EMPTY
===================================================== */

.no-wishes {
  margin-top: 24px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;

  opacity: 0.7;
}

/* =====================================================
   LIST
===================================================== */

.wish-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-top: 24px;
}

.wish-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  padding: 14px 16px;

  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.35);

  background-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.45),
    0 10px 26px -8px rgba(147, 56, 69, 0.24);

  text-align: left;
}

.wish-avatar {
  flex: 0 0 auto;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background-color: rgba(203, 93, 108, 0.14);
  color: var(--gg-rose, #cb5d6c);

  font-family: "EB Garamond", serif;
  font-size: 16px;
  font-weight: 600;
}

.wish-content {
  min-width: 0;
  flex: 1;
}

.wish-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.wish-header b {
  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 15px;
  font-weight: 600;
}

.wish-header span {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  opacity: 0.6;
}

.wish-content p {
  margin: 5px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  line-height: 1.65;
}

/* =====================================================
   TRANSITION
===================================================== */

.wish-list-enter-active,
.wish-list-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.wish-list-enter-from,
.wish-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .wish-form-card {
    max-width: 600px;
    padding: 26px 24px;
  }

  .wish-list {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wish-track {
    animation: none;
  }
}
</style>
