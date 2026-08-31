<template>
  <section class="rr-section timeline">
    <div class="rr-kicker">HÀNH TRÌNH</div>
    <h2 class="rr-title">Dấu Mốc Yêu Thương</h2>
    <div class="line">
      <div v-for="(item, i) in timeline" :key="i" class="node">
        <span></span>
        <div>
          <small>{{ item.Time  || "" }}</small>
          <h3>{{ item.Title || item.Name || "" }}</h3>
          <p>{{ item.Description || item.Content || item.Text || "" }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
defineProps({ timeline: { type: Array, default: () => [] } });
</script>
<style scoped>
.timeline {
  padding-left: 32px;
  padding-right: 32px;
}
.line {
  border-left: 1px solid #a77736;
  padding-left: 24px;
}
.node {
  position: relative;
  padding: 0 0 24px;
}
.node > span {
  position: absolute;
  left: -29px;
  top: 4px;
  width: 9px;
  height: 9px;
  border: 1px solid #d8aa5a;
  border-radius: 50%;
  background: #3b0102;
  box-shadow: 0 0 0 4px rgba(216, 170, 90, 0.08);
}
.node small {
  color: #d8aa5a;
}
.node h3 {
  color: #efd18b;
  margin: 4px 0;
}
.node p {
  opacity: 0.75;
  line-height: 1.5;
  margin: 0;
}
</style>
