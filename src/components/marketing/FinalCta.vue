<template>
  <section class="mk-final">
    <div class="mk-container">
      <div class="mk-final__box">
        <span class="mk-final__seal" aria-hidden="true">囍</span>

        <h2>
          {{ title }}
          <em>{{ titleAccent }}</em>
        </h2>

        <p>{{ text }}</p>

        <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--light">
          {{ cta }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Thiệp cưới của bạn" },
  titleAccent: { type: String, default: "bắt đầu từ đây." },
  text: {
    type: String,
    default:
      "Tạo miễn phí, dùng thử 3 ngày — chỉ thanh toán khi bạn thật sự ưng ý.",
  },
  cta: { type: String, default: "Tạo thiệp ngay" },
});
</script>
