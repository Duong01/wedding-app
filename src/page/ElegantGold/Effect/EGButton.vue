<template>
  <button
    class="eg-button"
    :class="{
      'eg-button--primary': primary,
      'eg-button--small': small
    }"
    type="button"
    @click="$emit('click')"
  >
    <span v-if="icon" class="eg-button__icon">
      {{ icon }}
    </span>

    <span>
      {{ text }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },

  icon: {
    type: String,
    default: "",
  },

  primary: {
    type: Boolean,
    default: false,
  },

  small: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>

<style scoped>
.eg-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  min-height: 46px;

  padding:
    10px 24px;

  border:
    1px solid
    rgba(212, 175, 55, 0.55);

  border-radius: 999px;

  color: var(--eg-primary);

  background:
    rgba(255, 253, 246, 0.8);

  font-family: inherit;

  font-size: 16px;

  cursor: pointer;

  transition:
    transform 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.eg-button:hover {
  transform: translateY(-2px);

  background:
    var(--eg-accent-light);

  box-shadow:
    0 10px 30px
    rgba(35, 32, 26, 0.12);
}

.eg-button:active {
  transform: scale(0.97);
}

.eg-button--primary {
  color: #fffdf6;

  background:
    var(--eg-primary);

  border-color:
    var(--eg-primary);
}

.eg-button--small {
  min-height: 40px;

  padding:
    8px 18px;

  font-size: 14px;
}

.eg-button__icon {
  font-size: 15px;
}
</style>