<template>
  <a
    v-if="url"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="eg-location"
  >
    <span class="eg-location__icon">
      ⌖
    </span>

    <span class="eg-location__text">
      Xem bản đồ
    </span>

    <span class="eg-location__arrow">
      →
    </span>
  </a>
</template>

<script setup>
defineProps({
  url: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.eg-location {
  display: inline-flex;

  align-items: center;

  gap: 10px;

  min-height: 44px;

  padding:
    8px 18px;

  border:
    1px solid
    rgba(212, 175, 55, 0.4);

  border-radius: 999px;

  color: var(--eg-primary);

  background:
    rgba(255, 253, 246, 0.7);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.eg-location:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 25px
    rgba(35, 32, 26, 0.1);
}

.eg-location__icon {
  color: var(--eg-accent);

  font-size: 18px;
}

.eg-location__text {
  font-size: 15px;
}

.eg-location__arrow {
  color: var(--eg-accent);

  transition:
    transform 0.3s ease;
}

.eg-location:hover
.eg-location__arrow {
  transform: translateX(4px);
}
</style>