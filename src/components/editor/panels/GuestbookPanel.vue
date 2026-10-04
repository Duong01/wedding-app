<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> GUEST BOOK </span>

        <h1>{{ $t('editor.menu.guestbook') }}</h1>

        <p>{{ $t('guestbookPanel.desc') }}</p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> {{ $t('guestbookPanel.show') }} </strong>

        <small> {{ $t('guestbookPanel.showHint') }} </small>
      </div>

      <v-switch
        v-model="wedding.guestBook.Enabled"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>{{ $t('panel.title') }}</label>

      <input
        v-model="wedding.guestBook.Title"
        type="text"
        :placeholder="$t('guestbookPanel.titlePlaceholder')"
      />

      <small class="field-help">
        {{ $t('guestbookPanel.titleHint') }}
      </small>
    </div>

    <p v-if="feedback" class="panel-feedback" :class="{ error: feedbackError }">
      {{ feedback }}
    </p>

    <!-- =====================================================
         THANH CÔNG CỤ
    ====================================================== -->

    <div v-if="allWishes.length" class="wish-toolbar">
      <div class="wish-search">
        <v-icon size="17"> mdi-magnify </v-icon>

        <input
          v-model="keyword"
          type="text"
          :placeholder="$t('guestbookPanel.search')"
        />

        <button
          v-if="keyword"
          type="button"
          class="search-clear"
          :title="$t('editor.nav.clearSearch')"
          @click="keyword = ''"
        >
          <v-icon size="15"> mdi-close </v-icon>
        </button>
      </div>

      <span class="wish-count">
        {{ $t("guestbookPanel.count", { shown: filteredWishes.length, total: allWishes.length }) }}
      </span>
    </div>

    <div v-if="allWishes.length" class="wish-actions">
      <button
        type="button"
        class="inline-button"
        :disabled="loadingWishes"
        @click="loadWishes"
      >
        <v-icon size="15"> mdi-refresh </v-icon>

        {{ $t('guestbookPanel.reload') }}
      </button>

      <button
        type="button"
        class="inline-button"
        :disabled="!filteredWishes.length"
        @click="copyWishes"
      >
        <v-icon size="15"> mdi-content-copy </v-icon>

        {{ $t('guestbookPanel.copyAll') }}
      </button>
    </div>

    <!-- =====================================================
         DANH SÁCH LỜI CHÚC
    ====================================================== -->

    <div class="guest-list">
      <div v-if="loadingWishes" class="empty-card">
        <v-progress-circular indeterminate size="22" width="2" />

        <strong> {{ $t('guestbookPanel.loading') }} </strong>
      </div>

      <template v-else>
        <article
          v-for="wish in filteredWishes"
          :key="wish.__key"
          class="guest-card"
        >
          <div class="guest-avatar">
            <v-icon size="17"> mdi-account-heart-outline </v-icon>
          </div>

          <div class="guest-content">
            <strong>
              {{ wish.Name || $t('guestbookPanel.guest') }}
            </strong>

            <p>
              {{ wish.Message }}
            </p>

            <small v-if="wish.__time">
              {{ wish.__time }}
            </small>
          </div>

          <button
            v-if="wish.__id"
            type="button"
            class="guest-delete"
            :disabled="deletingId === wish.__id"
            :title="$t('guestbookPanel.deleteOne')"
            @click="removeWish(wish)"
          >
            <v-progress-circular
              v-if="deletingId === wish.__id"
              indeterminate
              size="13"
              width="2"
            />

            <v-icon v-else size="15"> mdi-delete-outline </v-icon>
          </button>
        </article>
      </template>

      <p v-if="keyword && !filteredWishes.length" class="search-empty">
        {{ $t("guestbookPanel.noMatch", { keyword }) }}
      </p>

      <div
        v-if="!allWishes.length && !loadingWishes"
        class="empty-card"
      >
        <v-icon size="30"> mdi-message-heart-outline </v-icon>

        <strong> {{ $t('guestbookPanel.empty') }} </strong>

        <span> {{ $t('guestbookPanel.emptyHint') }} </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, onMounted, ref } from "vue";

import { deleteWish, getAllWishes } from "@/model/api";

import { confirmDialog } from "@/composables/useConfirm";

const { t } = useI18n();

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * =========================================================
 * LỜI CHÚC TỪ API
 *
 * Panel hiển thị lời chúc khách mời đã gửi qua thiệp
 * (getAllWishes theo slug) + cho phép xóa lời chúc
 * (deleteWish). wedding.guestBook.Guest vẫn dùng cho
 * dữ liệu lưu trong thiệp.
 * =========================================================
 */

const apiWishes = ref([]);

const loadingWishes = ref(false);

const deletingId = ref(null);

const feedback = ref("");
const feedbackError = ref(false);

function showFeedback(message, isError = false) {
  feedback.value = message;
  feedbackError.value = isError;

  window.clearTimeout(showFeedback.timer);

  showFeedback.timer = window.setTimeout(() => {
    feedback.value = "";
    feedbackError.value = false;
  }, 2800);
}

function currentSlug() {
  return props.wedding?.slug || props.wedding?.Slug || "";
}

/*
 * Gộp lời chúc từ API và lời chúc lưu trong thiệp về
 * cùng một dạng để template + tìm kiếm chỉ xử lý 1 nguồn.
 * __id chỉ có ở lời chúc API (mới xoá được).
 */
const allWishes = computed(() => {
  const fromApi = apiWishes.value.map((wish, index) => ({
    __key: `api-${wish.Id || wish.id || index}`,
    __id: wish.Id || wish.id || null,
    __time: wish.CreatedAt || wish.createdAt || "",
    Name: wish.Name || wish.name || "",
    Message: wish.Message || wish.message || "",
  }));

  const fromWedding = (props.wedding.guestBook?.Guest || []).map(
    (guest, index) => ({
      __key: `local-${guest.Id || index}`,
      __id: null,
      __time: guest.CreatedAt || "",
      Name: guest.Name || "",
      Message: guest.Message || "",
    })
  );

  return [...fromApi, ...fromWedding];
});

/* =====================================================
   TÌM KIẾM
===================================================== */

const keyword = ref("");

const filteredWishes = computed(() => {
  const query = keyword.value.trim().toLowerCase();

  if (!query) {
    return allWishes.value;
  }

  return allWishes.value.filter((wish) => {
    return (
      String(wish.Name).toLowerCase().includes(query) ||
      String(wish.Message).toLowerCase().includes(query)
    );
  });
});

async function loadWishes() {
  const slug = currentSlug();

  if (!slug) {
    return;
  }

  loadingWishes.value = true;

  try {
    const response = await getAllWishes({ slug });

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      apiWishes.value = result.data;
    } else {
      apiWishes.value = [];
    }
  } catch (err) {
    console.warn("[GuestbookPanel] Không tải được lời chúc:", err);

    apiWishes.value = [];
  } finally {
    loadingWishes.value = false;
  }
}

async function removeWish(wish) {
  const slug = currentSlug();

  const id = wish?.__id;

  if (!slug || !id) {
    return;
  }

  const ok = await confirmDialog({
    get title() { return t("guestbookPanel.confirmTitle"); },
    message: t("guestbookPanel.confirmMessage", { name: wish?.Name || t("guestbookPanel.guestLower") }),
    get confirmText() { return t("guestbookPanel.confirmDelete"); },
    danger: true,
  });

  if (!ok) {
    return;
  }

  deletingId.value = id;

  try {
    const response = await deleteWish({ slug, id });

    const result = response?.data;

    if (result && result.status === "success") {
      apiWishes.value = apiWishes.value.filter((item) => {
        return (item.Id || item.id) !== id;
      });

      showFeedback(t("guestbookPanel.deleted"));
    } else {
      showFeedback(result?.message || t("guestbookPanel.deleteFailed"), true);
    }
  } catch (err) {
    console.error("[GuestbookPanel] deleteWish error:", err);

    showFeedback(t("guestbookPanel.deleteFailedRetry"), true);
  } finally {
    deletingId.value = null;
  }
}

/*
 * Sao chép toàn bộ lời chúc dạng "Tên: nội dung" để dán
 * vào sổ lưu niệm hoặc gửi cho gia đình.
 */
async function copyWishes() {
  const lines = filteredWishes.value
    .map((wish) => `${wish.Name || t("guestbookPanel.guest")}: ${wish.Message || ""}`)
    .filter(Boolean);

  if (!lines.length) {
    return;
  }

  try {
    await navigator.clipboard.writeText(lines.join("\n"));

    showFeedback(t("guestbookPanel.copied", { n: lines.length }));
  } catch (err) {
    console.error("[GuestbookPanel] copyWishes error:", err);

    showFeedback(t("guestbookPanel.copyFailed"), true);
  }
}

onMounted(() => {
  loadWishes();
});
</script>

<style scoped>
.panel-feedback {
  margin: 0 0 14px;

  padding: 10px 14px;

  border-radius: 10px;

  background: rgba(46, 125, 50, 0.08);

  color: #2e7d32;

  font-size: 12.5px;
}

.panel-feedback.error {
  background: rgba(198, 40, 40, 0.08);

  color: #c62828;
}

.wish-toolbar {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 10px;
}

.wish-search {
  flex: 1;

  min-width: 0;

  display: flex;

  align-items: center;

  gap: 9px;

  padding: 0 13px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 11px;

  background: #fffdfb;

  color: #a8988a;
}

.wish-search:focus-within {
  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.09);
}

.wish-search input {
  flex: 1;

  min-width: 0;

  border: 0;

  outline: none;

  background: transparent;

  color: #2b2118;

  padding: 10px 0;

  font-family: inherit;
  font-size: 13px;
}

.search-clear {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 24px;

  height: 24px;

  border: 0;

  border-radius: 7px;

  background: #f4eee6;

  color: #6b5a4e;

  cursor: pointer;
}

.wish-count {
  flex: 0 0 auto;

  padding: 5px 11px;

  border-radius: 999px;

  background: rgba(185, 151, 91, 0.14);

  color: #6b5a4e;

  font-size: 10.5px;
  font-weight: 700;

  white-space: nowrap;
}

.wish-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  margin-bottom: 16px;
}

.inline-button {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 7px 12px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 9px;

  background: #fffdfb;

  color: #6b5a4e;

  font-family: inherit;
  font-size: 11px;
  font-weight: 650;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.inline-button:hover:not(:disabled) {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}

.inline-button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}

.search-empty {
  margin: 0 0 14px;

  color: #a8988a;

  font-size: 12px;
}

.guest-card {
  position: relative;
}

.guest-delete {
  position: absolute;

  top: 10px;

  right: 10px;

  width: 28px;

  height: 28px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 0;

  border-radius: 8px;

  background: transparent;

  color: var(--app-danger, #a03030);

  cursor: pointer;

  opacity: 0.55;

  transition:
    opacity 0.15s ease,
    background 0.15s ease;
}

.guest-delete:hover {
  opacity: 1;

  background: #fdf1f1;
}

.guest-delete:disabled {
  opacity: 0.4;

  cursor: not-allowed;
}
</style>
