<template>
  <section class="story">
    <div class="story-circle">
      <span>✦</span>
    </div>

    <div class="story-content">
      <div class="section-title">
        <small>OUR STORY</small>
        <h2>Chuyện chúng mình</h2>
      </div>

      <div class="story-divider">𓅃</div>

      <h3 v-if="story?.title">
        {{ story.title }}
      </h3>

      <p v-if="story?.content">
        {{ story.content }}
      </p>

      <p v-else>
        Từ một cuộc gặp gỡ tình cờ, những câu chuyện nhỏ
        dần trở thành những ký ức lớn. Và hôm nay,
        chúng mình quyết định viết tiếp câu chuyện ấy
        bằng một lời hẹn ước trăm năm.
      </p>

      <div class="quote">
        <span>“</span>
        <em>
          Cảm ơn vì đã đến,
          <br />
          ở lại và cùng nhau đi đến hôm nay.
        </em>
        <span>”</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  story: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped>
.story {
  position: relative;
  padding: 75px 25px;
  overflow: hidden;
  color: #ead7b5;
  background:
    linear-gradient(rgba(84,18,15,.96), rgba(84,18,15,.96)),
    #54120f;
}

.story-circle {
  position: absolute;
  width: 330px;
  height: 330px;
  right: -130px;
  top: -100px;
  border: 1px solid rgba(201,149,82,.22);
  border-radius: 50%;
}

.story-circle::before,
.story-circle::after {
  content: "";
  position: absolute;
  inset: 35px;
  border: 1px dashed rgba(201,149,82,.18);
  border-radius: 50%;
}

.story-circle::after {
  inset: 75px;
}

.story-circle span {
  position: absolute;
  left: 50%;
  top: 50%;
  color: rgba(201,149,82,.4);
}

.story-content {
  position: relative;
  z-index: 2;
  max-width: 570px;
  margin: auto;
  text-align: center;
}

.section-title small {
  font-size: 8px;
  letter-spacing: .4em;
  color: #c99552;
}

h2 {
  margin: 7px 0 20px;
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 31px;
}

.story-divider {
  color: #c99552;
  margin-bottom: 25px;
}

h3 {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 400;
}

.story-content > p {
  font-family: Georgia, serif;
  line-height: 2;
  font-size: 15px;
  color: #d8c3a1;
}

.quote {
  margin: 35px auto 0;
  padding: 25px 15px;
  border-top: 1px solid rgba(201,149,82,.35);
  border-bottom: 1px solid rgba(201,149,82,.35);
}

.quote span {
  color: #c99552;
  font-size: 24px;
}

.quote em {
  font-family: Georgia, serif;
  line-height: 1.8;
}
</style>