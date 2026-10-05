<template>
  <section class="story">
    <div class="story-circle">
      <span>✦</span>
    </div>

    <div class="story-content">
      <div class="section-title">
        <small>OUR STORY</small>
        <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
        <header v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="ds-top-custom-head">
          <p v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="ds-top-custom-head__eyebrow">{{ sectionOverride(sections, "story", "Eyebrow") }}</p>
        </header>

        <h2>{{ sectionText(sections, "story", "Heading", $t("Chuyện chúng mình")) }}</h2>
      </div>

      <div class="story-divider">𓅃</div>

      <h3 v-if="story?.title">
        {{ story.title }}
      </h3>

      <p v-if="story?.content">
        {{ story.content }}
      </p>

      <p v-else>
        {{ $t("Từ một cuộc gặp gỡ tình cờ, những câu chuyện nhỏ dần trở thành những ký ức lớn. Và hôm nay, chúng mình quyết định viết tiếp câu chuyện ấy bằng một lời hẹn ước trăm năm.") }}
      </p>

      <div class="quote">
        <span>“</span>
        <em>
          {{ $t("Cảm ơn vì đã đến,") }}
          <br />
          {{ $t("ở lại và cùng nhau đi đến hôm nay.") }}
        </em>
        <span>”</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
defineProps({
  sections: { type: Object, default: () => ({}) },
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
  color: var(--tc-ead7b5, #ead7b5);
  background:
    linear-gradient(rgba(var(--tc-54120f-rgb, 84, 18, 15), .96), rgba(var(--tc-54120f-rgb, 84, 18, 15), .96)),
    var(--tc-54120f, #54120f);
}

.story-circle {
  position: absolute;
  width: 330px;
  height: 330px;
  right: -130px;
  top: -100px;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .22);
  border-radius: 50%;
}

.story-circle::before,
.story-circle::after {
  content: "";
  position: absolute;
  inset: 35px;
  border: 1px dashed rgba(var(--tc-c99552-rgb, 201, 149, 82), .18);
  border-radius: 50%;
}

.story-circle::after {
  inset: 75px;
}

.story-circle span {
  position: absolute;
  left: 50%;
  top: 50%;
  color: rgba(var(--tc-c99552-rgb, 201, 149, 82), .4);
}

.story-content {
  position: relative;
  z-index: 2;
  max-width: 570px;
  margin: auto;
  padding: 34px 24px;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .6);
  background: rgba(0,0,0,.2);
  box-shadow: 0 12px 30px rgba(0,0,0,.3);
  text-align: center;
}

.story-content::before {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .28);
  pointer-events: none;
}

.section-title small {
  font-size: 10px;
  letter-spacing: .4em;
  color: var(--tc-c99552, #c99552);
}

h2 {
  margin: 7px 0 20px;
  /* Màu tường minh — h2 toàn cục lấy --primary đỏ, chìm trên khối nền đỏ sẫm */
  color: var(--tc-f3ead8, #f3ead8);
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 31px;
}

.story-divider {
  color: var(--tc-c99552, #c99552);
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
  color: var(--tc-cdb99b, #cdb99b);
}

.quote {
  margin: 35px auto 0;
  padding: 25px 15px;
  border-top: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .35);
  border-bottom: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .35);
}

.quote span {
  color: var(--tc-c99552, #c99552);
  font-size: 24px;
}

.quote em {
  font-family: Georgia, serif;
  line-height: 1.8;
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
</style>