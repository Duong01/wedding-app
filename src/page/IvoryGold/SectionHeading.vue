<template>
  <div class="section-heading">
    <div class="heading-line">
      <span></span>
      <i>❖</i>
      <span></span>
    </div>

    <h2>{{ title }}</h2>

    <div class="heading-sub">
      <span>囍</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.section-heading {
  text-align: center;
  padding: 18px 20px 28px;
  color: #8d1115;
}

.heading-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}

.heading-line span {
  width: 45px;
  height: 1px;
  background: #c9a45c;
}

.heading-line i {
  color: #b28a42;
  font-size: 10px;
  font-style: normal;
}

.section-heading h2 {
  margin: 0;
  font-family:
    "Noto Serif",
    "Times New Roman",
    serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.5;
}

.heading-sub {
  margin-top: 8px;
}

.heading-sub span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a3161b;
  font-family: serif;
  font-size: 22px;
  font-weight: 700;
}
</style>
