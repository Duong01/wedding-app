<template>
  <!--
    Nút đổi ngôn ngữ giao diện (website + trang chỉnh sửa).
    Bấm → danh sách 5 ngôn ngữ; chọn là đổi ngay, lưu lại
    cho lần sau (xem src/lang/index.js).

    compact: chỉ hiện mã ngắn (VI/EN...) — dùng ở thanh
    header chật của Editor.
  -->
  <div ref="rootRef" class="lang-switcher" :class="{ 'lang-switcher--compact': compact }">
    <button
      type="button"
      class="lang-switcher__toggle"
      :aria-label="$t('common.language')"
      :title="$t('common.language')"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <v-icon size="17">mdi-translate</v-icon>

      <span class="lang-switcher__current">{{ current.short }}</span>

      <v-icon size="15" class="lang-switcher__caret">mdi-chevron-down</v-icon>
    </button>

    <Transition name="lang-pop">
      <ul
        v-if="open"
        class="lang-switcher__menu"
        :class="{ 'lang-switcher__menu--up': dropUp }"
        role="listbox"
        :aria-label="$t('common.language')"
      >
        <li v-for="lang in LANGUAGES" :key="lang.code">
          <button
            type="button"
            role="option"
            class="lang-switcher__option"
            :class="{ active: lang.code === locale }"
            :aria-selected="lang.code === locale"
            :lang="lang.htmlLang"
            @click="choose(lang.code)"
          >
            <span class="lang-switcher__flag" aria-hidden="true">{{ lang.flag }}</span>

            <span class="lang-switcher__label">{{ lang.label }}</span>

            <v-icon v-if="lang.code === locale" size="16" class="lang-switcher__check">mdi-check</v-icon>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { useI18n } from "vue-i18n";

import { LANGUAGES, setLocale } from "@/lang";

defineProps({
  compact: { type: Boolean, default: false },

  /* Mở menu lên trên (khi đặt sát đáy màn hình) */
  dropUp: { type: Boolean, default: false },
});

const { locale } = useI18n();

const open = ref(false);

const rootRef = ref(null);

const current = computed(
  () => LANGUAGES.find((item) => item.code === locale.value) || LANGUAGES[0]
);

function choose(code) {
  setLocale(code);

  open.value = false;
}

/* Bấm ra ngoài / Esc → đóng menu */
function onDocClick(event) {
  if (open.value && rootRef.value && !rootRef.value.contains(event.target)) {
    open.value = false;
  }
}

function onKey(event) {
  if (event.key === "Escape") {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onDocClick, true);
  document.addEventListener("keydown", onKey);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick, true);
  document.removeEventListener("keydown", onKey);
});
</script>

<style scoped>
.lang-switcher {
  position: relative;
}

.lang-switcher__toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  height: 38px;

  padding: 0 9px 0 10px;

  color: var(--studio-ink, #2b2118);

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 10px;

  background: var(--studio-card, #fffdf8);

  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;

  cursor: pointer;

  transition: background 0.2s ease, border-color 0.2s ease;
}

.lang-switcher__toggle:hover {
  border-color: var(--studio-seal, #a63a2e);
}

.lang-switcher__caret {
  opacity: 0.6;
}

.lang-switcher--compact .lang-switcher__toggle {
  height: 34px;

  padding: 0 8px;
}

.lang-switcher__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1200;

  min-width: 172px;

  margin: 0;
  padding: 6px;

  list-style: none;

  border: 1px solid var(--studio-line, rgba(120, 95, 70, 0.18));
  border-radius: 14px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 18px 40px rgba(40, 25, 15, 0.18);
}

.lang-switcher__menu--up {
  top: auto;
  bottom: calc(100% + 8px);
}

.lang-switcher__option {
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;

  padding: 9px 10px;

  color: var(--studio-ink, #2b2118);

  border: 0;
  border-radius: 10px;

  background: transparent;

  font-size: 13.5px;

  text-align: left;

  cursor: pointer;
}

.lang-switcher__option:hover {
  background: color-mix(in srgb, var(--studio-seal, #a63a2e) 9%, transparent);
}

.lang-switcher__option.active {
  font-weight: 700;
}

.lang-switcher__flag {
  font-size: 17px;
  line-height: 1;
}

.lang-switcher__label {
  flex: 1;
}

.lang-switcher__check {
  color: var(--studio-seal, #a63a2e);
}

/* Header editor trên điện thoại chật — bỏ mũi tên */
@media (max-width: 520px) {
  .lang-switcher--compact .lang-switcher__caret {
    display: none;
  }
}

.lang-pop-enter-active,
.lang-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.lang-pop-enter-from,
.lang-pop-leave-to {
  opacity: 0;

  transform: translateY(-4px);
}
</style>
