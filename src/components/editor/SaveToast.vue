<template>
  <div
    class="save-toast"
    :class="{
      error: isError,
    }"
  >
    <div class="toast-icon">
      <v-icon size="18">
        {{
          isError
            ? "mdi-alert-circle-outline"
            : "mdi-check-circle-outline"
        }}
      </v-icon>
    </div>

    <span>
      {{ message }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, required: true },
  isError: { type: Boolean, default: false },
});
</script>
