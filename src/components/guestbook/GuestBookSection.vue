<template>
  <section class="guestbook-section">
    <h2 class="section-title">SỔ LƯU BÚT</h2>

    <!-- Chữ chạy -->
    <div class="wish-marquee">
      <div class="wish-track">
        <span v-for="item in wishes" :key="item.Id">
          💛 {{ item.Name }}: "{{ item.Message }}"
        </span>
      </div>
    </div>

    <!-- Form -->
    <div class="guestbook-form card">
      <input v-model="form.name" placeholder="Tên của bạn" />

      <textarea
        v-model="form.message"
        rows="4"
        placeholder="Gửi lời chúc..."
      ></textarea>

      <div class="action">
        <button class="primary-btn" @click="submitWish">Gửi lời chúc</button>
      </div>
    </div>

    <!-- Danh sách -->
    <div class="wish-list">
      <div class="wish-card" v-for="item in wishes" :key="item.Id">
        <div class="avatar">
          {{ item.Name.charAt(0).toUpperCase() }}
        </div>

        <div class="content">
          <div class="head">
            <strong>
              {{ item.Name }}
            </strong>

            <small>
              {{ item.CreatedAt }}
            </small>
          </div>

          <p>
            {{ item.Message }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
const props = defineProps({
  guestBook: {
    type: Object,
    required: true,
    default: () => [],
  },
});
const route = useRoute();
const wishes = computed(() => props.guestBook?.Guest ?? []);

const form = reactive({
  name: "",
  message: "",
});
function submitWish() {
  if (!form.name || !form.name.trim()) {
    alert("Vui lòng nhập tên của bạn");
    return;
  }
  if (!form.message || !form.message.trim()) {
    alert("Vui lòng nhập lời chúc");
    return;
  }
  const param = {
    slug: route.params.slug,
    recipientToken: route.params.token || "",
    guestName: form.name,
    message: form.message,
  };
  try {
    alert("Gửi lời chúc thành công ❤️");
    form.name = "";
    form.message = "";
  } catch (error) {
    console.error(error);
    alert("Có lỗi xảy ra, vui lòng thử lại.");
  }
}
</script>

<style scoped>
.section-title {
  color: var(--p-gold-light, #f8dfad);
  margin-bottom: 45px;
}

.guestbook-section {
  margin: 0;
  background: var(--p-deep, #7b0d0d);
  position: relative;
  overflow: hidden;
  color: #fff;
}

.guestbook-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("/images/pattern.png") center/cover;
  opacity: 0.08;
}

.wish-marquee {
  overflow: hidden;
  white-space: nowrap;
  margin: 30px 0 45px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 14px 0;
}

.wish-track {
  display: inline-flex;
  animation: marquee 35s linear infinite;
}

.wish-track span {
  margin-right: 70px;
  color: #ffe9c5;
  font-family: var(--font-main);
  font-size: var(--text-sm);
  font-style: italic;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

.guestbook-form {
  padding: 28px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 40px;
}

.guestbook-form input,
.guestbook-form textarea {
  width: 100%;
  padding: 15px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  margin-bottom: 18px;
  font-family: var(--font-main);
  font-size: var(--text-sm);
}

.guestbook-form input::placeholder,
.guestbook-form textarea::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.action {
  display: flex;

  justify-content: center;
  align-items: center;

  width: 100%;

  margin-top: 4px;
}

.primary-btn {
  width: min(100%, 360px);

  min-height: 48px;

  padding: 12px 28px;

  border: 1px solid rgba(255, 239, 190, 0.8);

  border-radius: 999px;

  background: linear-gradient(135deg, #ffe9b5 0%, #e5c27d 50%, #cda45f 100%);

  color: var(--p-deep, #7b0d0d);

  font-family: var(--font-main);

  font-size: var(--text-sm);

  font-weight: 700;

  letter-spacing: 0.3px;

  cursor: pointer;

  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

/* Hover */

.primary-btn:hover {
  transform: translateY(-2px);

  filter: brightness(1.05);

  box-shadow:
    0 9px 24px rgba(0, 0, 0, 0.28),
    0 0 18px rgba(238, 202, 122, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

/* Click */

.primary-btn:active {
  transform: scale(0.97);
}

/* =========================================================
   WISH LIST
========================================================= */

.wish-list {
  max-height: 250px;

  overflow-y: auto;

  display: flex;

  flex-direction: column;

  gap: 10px;

  padding: 2px 6px 2px 2px;

  scroll-behavior: smooth;
}

/* =========================================================
   SCROLLBAR
========================================================= */

.wish-list::-webkit-scrollbar {
  width: 5px;
}

.wish-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);

  border-radius: 20px;
}

.wish-list::-webkit-scrollbar-thumb {
  background: rgba(216, 180, 109, 0.7);

  border-radius: 20px;
}

/* =========================================================
   WISH CARD
========================================================= */

.wish-card {
  display: flex;

  align-items: flex-start;

  gap: 11px;

  padding: 11px 13px;

  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.095),
    rgba(255, 255, 255, 0.045)
  );

  border: 1px solid rgba(255, 226, 174, 0.14);

  border-radius: 13px;

  backdrop-filter: blur(8px);

  box-shadow: 0 3px 12px rgba(35, 0, 0, 0.1);

  transition:
    background 0.25s ease,
    transform 0.25s ease,
    border-color 0.25s ease;
}

.wish-card:hover {
  transform: translateY(-2px);

  background: rgba(255, 255, 255, 0.11);

  border-color: rgba(255, 220, 155, 0.28);
}

/* =========================================================
   AVATAR
========================================================= */

.avatar {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(135deg, #f2d38d, #c79d5c);

  color: var(--p-deep, #7b0d0d);

  font-family: var(--font-heading);

  font-size: 15px;

  font-weight: 700;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

/* =========================================================
   CONTENT
========================================================= */

.content {
  flex: 1;

  min-width: 0;
}

/* =========================================================
   HEADER
========================================================= */

.head {
  display: flex;

  align-items: baseline;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 3px;

  line-height: 1.2;
}

.head strong {
  min-width: 0;

  color: #fff;

  font-family: var(--font-main);

  font-size: var(--text-sm);

  font-weight: 700;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

.head small {
  flex-shrink: 0;

  color: rgba(255, 226, 184, 0.62);

  font-family: var(--font-main);

  font-size: 10px;

  white-space: nowrap;
}

/* =========================================================
   MESSAGE
========================================================= */

.content p {
  margin: 0;

  color: rgba(255, 245, 232, 0.88);

  font-family: var(--font-main);

  font-size: var(--text-xs);

  line-height: 1.5;

  word-break: break-word;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 768px) {
  .primary-btn {
    width: 100%;

    min-height: 46px;

    padding: 11px 20px;

    font-size: 13px;
  }
  .wish-list {
    max-height: 230px;

    gap: 8px;

    padding-right: 4px;
  }

  .wish-card {
    gap: 9px;

    padding: 9px 10px;

    border-radius: 11px;
  }

  .avatar {
    width: 34px;
    height: 34px;

    flex-basis: 34px;

    font-size: 13px;
  }

  .head {
    gap: 6px;

    margin-bottom: 2px;
  }

  .head strong {
    font-size: 12px;
  }

  .head small {
    font-size: 9px;
  }

  .content p {
    font-size: 11px;

    line-height: 1.45;
  }
}

/* =========================================================
   VERY SMALL PHONE
========================================================= */

@media (max-width: 380px) {
  .wish-card {
    padding: 8px 9px;

    gap: 8px;
  }

  .avatar {
    width: 31px;
    height: 31px;

    flex-basis: 31px;

    font-size: 12px;
  }

  .head strong {
    font-size: 11px;
  }

  .head small {
    font-size: 8px;
  }

  .content p {
    font-size: 10px;
  }
}
</style>
