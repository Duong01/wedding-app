<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> GUEST BOOK </span>

        <h1>Sổ lưu bút</h1>

        <p>Cho phép khách mời gửi lời chúc.</p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> Hiển thị sổ lưu bút </strong>

        <small> Khách mời có thể gửi lời chúc. </small>
      </div>

      <v-switch
        v-model="wedding.guestBook.Enabled"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>Tiêu đề</label>

      <input v-model="wedding.guestBook.Title" type="text" />
    </div>

    <div class="guest-list">
      <div
        v-if="loadingWishes"
        class="empty-card"
      >
        <v-progress-circular
          indeterminate
          size="22"
          width="2"
        />

        <strong> Đang tải lời chúc... </strong>
      </div>

      <template v-else-if="apiWishes.length">
        <article
          v-for="wish in apiWishes"
          :key="wish.Id || wish.id"
          class="guest-card"
        >
          <div class="guest-avatar">
            <v-icon size="17"> mdi-account-heart-outline </v-icon>
          </div>

          <div class="guest-content">
            <strong>
              {{ wish.Name || wish.name }}
            </strong>

            <p>
              {{ wish.Message || wish.message }}
            </p>

            <small v-if="wish.CreatedAt || wish.createdAt">
              {{ wish.CreatedAt || wish.createdAt }}
            </small>
          </div>

          <button
            type="button"
            class="guest-delete"
            :disabled="deletingId === (wish.Id || wish.id)"
            title="Xóa lời chúc"
            @click="removeWish(wish)"
          >
            <v-progress-circular
              v-if="deletingId === (wish.Id || wish.id)"
              indeterminate
              size="13"
              width="2"
            />

            <v-icon v-else size="15"> mdi-delete-outline </v-icon>
          </button>
        </article>
      </template>

      <article
        v-for="guest in wedding.guestBook.Guest"
        :key="guest.Id"
        class="guest-card"
      >
        <div class="guest-avatar">
          <v-icon size="17"> mdi-account-heart-outline </v-icon>
        </div>

        <div class="guest-content">
          <strong>
            {{ guest.Name }}
          </strong>

          <p>
            {{ guest.Message }}
          </p>

          <small>
            {{ guest.CreatedAt }}
          </small>
        </div>
      </article>

      <div
        v-if="!wedding.guestBook.Guest?.length && !apiWishes.length && !loadingWishes"
        class="empty-card"
      >
        <v-icon size="30"> mdi-message-heart-outline </v-icon>

        <strong> Chưa có lời chúc </strong>

        <span> Lời chúc của khách mời sẽ hiển thị ở đây. </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

<script setup>
import { onMounted, ref } from "vue";

import { deleteWish, getAllWishes } from "@/model/api";

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

function currentSlug() {
  return props.wedding?.slug || props.wedding?.Slug || "";
}

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

  const id = wish?.Id || wish?.id;

  if (!slug || !id) {
    return;
  }

  if (!window.confirm(`Xóa lời chúc của "${wish?.Name || "khách"}"?`)) {
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
    } else {
      alert(result?.message || "Không thể xóa lời chúc.");
    }
  } catch (err) {
    console.error("[GuestbookPanel] deleteWish error:", err);

    alert("Không thể xóa lời chúc. Vui lòng thử lại.");
  } finally {
    deletingId.value = null;
  }
}

onMounted(() => {
  loadWishes();
});
</script>
