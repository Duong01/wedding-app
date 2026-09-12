<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> PERSONALIZATION </span>

        <h1>Khách mời</h1>

        <p>Tên khách được cá nhân hóa bằng token.</p>
      </div>

      <button
        type="button"
        class="small-primary-button"
        :disabled="syncing"
        @click="addRecipient"
      >
        <v-icon size="17"> mdi-account-plus-outline </v-icon>

        Thêm khách
      </button>
    </div>

    <p v-if="syncMessage" class="sync-message" :class="{ error: syncError }">
      {{ syncMessage }}
    </p>

    <div class="items-list">
      <article
        v-for="(recipient, index) in wedding.recipientName"
        :key="recipient.token || index"
        class="editor-card"
      >
        <div class="card-header">
          <div>
            <span> KHÁCH MỜI {{ index + 1 }} </span>

            <strong>
              {{ recipient.Name || "Khách mời" }}
            </strong>
          </div>

          <button
            type="button"
            class="danger-icon"
            title="Xóa khách"
            :disabled="syncing"
            @click="removeRecipient(index)"
          >
            <v-icon size="18"> mdi-delete-outline </v-icon>
          </button>
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Token</label>

            <input v-model="recipient.token" type="text" />
          </div>

          <div class="editor-field">
            <label>Tên khách</label>

            <input v-model="recipient.Name" type="text" />
          </div>
        </div>
      </article>

      <button type="button" class="add-button" @click="addRecipient">
        <v-icon> mdi-account-plus-outline </v-icon>

        Thêm khách mời
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import {
  addRecipient as addRecipientApi,
  deleteRecipient as deleteRecipientApi,
} from "@/model/api";

const props = defineProps({
  wedding: { type: Object, required: true },
});

const syncing = ref(false);
const syncMessage = ref("");
const syncError = ref(false);

function showSyncMessage(message, isError = false) {
  syncMessage.value = message;
  syncError.value = isError;

  window.clearTimeout(showSyncMessage.timer);

  showSyncMessage.timer = window.setTimeout(() => {
    syncMessage.value = "";
    syncError.value = false;
  }, 2800);
}

function newToken() {
  return Math.random().toString(36).substring(2, 11);
}

/*
 * Thêm khách mời.
 *
 * Nếu thiệp đã lưu trên server (có slug) thì
 * gọi addRecipient ngay để lưu xuống DB — vì
 * AddDataWedding KHÔNG lưu recipients.
 */
async function addRecipient() {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.recipientName)) {
    props.wedding.recipientName = [];
  }

  const recipient = {
    token: newToken(),
    Name: "",
  };

  props.wedding.recipientName.push(recipient);

  const slug = props.wedding.slug;

  if (!slug) {
    return;
  }

  syncing.value = true;

  try {
    const response = await addRecipientApi({
      slug: slug,
      Token: recipient.token,
      Name: recipient.Name,
    });

    const result = response?.data;

    if (result && result.status === "success") {
      showSyncMessage("Đã thêm khách mời vào server.");
    } else {
      showSyncMessage(
        result?.message || "Không thể lưu khách mời lên server.",
        true
      );
    }
  } catch (error) {
    console.error("[RecipientPanel] addRecipient error:", error);

    showSyncMessage(
      error?.response?.data?.message ||
        "Không thể lưu khách mời lên server.",
      true
    );
  } finally {
    syncing.value = false;
  }
}

/*
 * Xóa khách mời.
 *
 * Nếu khách đã tồn tại trên server thì gọi
 * deleteRecipient (theo slug + token).
 */
async function removeRecipient(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.recipientName)) return;

  const [removed] = props.wedding.recipientName.splice(index, 1);

  const slug = props.wedding.slug;

  if (!removed?.token || !slug) {
    return;
  }

  syncing.value = true;

  try {
    const response = await deleteRecipientApi({
      slug: slug,
      token: removed.token,
    });

    const result = response?.data;

    if (result && result.status === "success") {
      showSyncMessage("Đã xóa khách mời khỏi server.");
    } else {
      showSyncMessage(
        result?.message || "Không thể xóa khách mời trên server.",
        true
      );
    }
  } catch (error) {
    console.error("[RecipientPanel] deleteRecipient error:", error);

    showSyncMessage(
      error?.response?.data?.message ||
        "Không thể xóa khách mời trên server.",
      true
    );
  } finally {
    syncing.value = false;
  }
}
</script>

<style scoped>
.sync-message {
  margin: 0 0 14px;

  padding: 10px 14px;

  border-radius: 10px;

  background: rgba(46, 125, 50, 0.08);

  color: #2e7d32;

  font-size: 13px;
}

.sync-message.error {
  background: rgba(198, 40, 40, 0.08);

  color: #c62828;
}
</style>
