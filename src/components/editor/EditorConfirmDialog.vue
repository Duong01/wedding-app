<template>
  <Transition name="confirm">
    <div
      v-if="state.open"
      class="confirm-overlay"
      @click.self="cancel"
      @keydown.esc="cancel"
    >
      <div
        class="confirm-box"
        role="alertdialog"
        aria-modal="true"
        :aria-label="state.title"
      >
        <div class="confirm-icon" :class="{ danger: state.danger }">
          <v-icon size="22">
            {{ state.danger ? "mdi-alert-outline" : "mdi-help-circle-outline" }}
          </v-icon>
        </div>

        <h3 class="confirm-title">
          {{ state.title }}
        </h3>

        <p v-if="state.message" class="confirm-message">
          {{ state.message }}
        </p>

        <p v-if="state.detail" class="confirm-detail">
          {{ state.detail }}
        </p>

        <div class="confirm-actions">
          <button type="button" class="confirm-btn ghost" @click="cancel">
            {{ state.cancelText }}
          </button>

          <button
            type="button"
            class="confirm-btn"
            :class="state.danger ? 'danger' : 'primary'"
            autofocus
            @click="accept"
          >
            {{ state.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";

import { useConfirmState, resolveConfirm } from "@/composables/useConfirm";

const state = useConfirmState();

function accept() {
  resolveConfirm(true);
}

function cancel() {
  resolveConfirm(false);
}

/*
 * Enter = xác nhận, Esc = huỷ — thao tác quen thuộc
 * khi người dùng đang gõ liên tục trong editor.
 */
function onKeydown(event) {
  if (!state.open) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    cancel();
  }

  if (event.key === "Enter") {
    event.preventDefault();
    accept();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.confirm-overlay {
  position: fixed;

  inset: 0;

  z-index: 4000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background: rgba(30, 20, 14, 0.42);

  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

.confirm-box {
  width: 100%;

  max-width: 400px;

  padding: 26px 24px 20px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 20px;

  background: #fffdfb;

  box-shadow: 0 30px 70px rgba(60, 35, 20, 0.28);

  text-align: center;
}

.confirm-icon {
  width: 50px;

  height: 50px;

  margin: 0 auto 14px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 15px;

  color: var(--wine, #a63a2e);

  background: rgba(166, 58, 46, 0.08);
}

.confirm-icon.danger {
  color: #c62828;

  background: #fdecec;
}

.confirm-title {
  margin: 0;

  color: #2b2118;

  font-family: var(--font-heading), Georgia, serif;
  font-size: 20px;
  font-weight: 600;

  line-height: 1.25;
}

.confirm-message {
  margin: 10px 0 0;

  color: #6b5a4e;

  font-size: 13px;

  line-height: 1.6;
}

.confirm-detail {
  margin: 8px 0 0;

  padding: 9px 12px;

  border-radius: 10px;

  background: #f7f1ea;

  color: #8a7a68;

  font-size: 11.5px;

  line-height: 1.5;

  overflow-wrap: anywhere;
}

.confirm-actions {
  display: flex;

  gap: 10px;

  margin-top: 22px;
}

.confirm-btn {
  flex: 1;

  height: 42px;

  border: 0;

  border-radius: 11px;

  font-family: inherit;
  font-size: 13px;
  font-weight: 650;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.confirm-btn.ghost {
  background: #f4eee6;

  color: #6b5a4e;
}

.confirm-btn.ghost:hover {
  background: #ece4d9;
}

.confirm-btn.primary {
  background: linear-gradient(135deg, var(--wine, #a63a2e), #7c2a20);

  color: #fdf6ec;

  box-shadow: 0 8px 20px rgba(166, 58, 46, 0.24);
}

.confirm-btn.danger {
  background: linear-gradient(135deg, #c62828, #8e1c1c);

  color: #fff;

  box-shadow: 0 8px 20px rgba(198, 40, 40, 0.24);
}

.confirm-btn:hover {
  transform: translateY(-1px);
}

.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 0.2s ease;
}

.confirm-enter-active .confirm-box,
.confirm-leave-active .confirm-box {
  transition: transform 0.22s ease;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}

.confirm-enter-from .confirm-box,
.confirm-leave-to .confirm-box {
  transform: translateY(10px) scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .confirm-enter-active,
  .confirm-leave-active,
  .confirm-enter-active .confirm-box,
  .confirm-leave-active .confirm-box {
    transition: none;
  }
}
</style>
