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

    <p v-if="!wedding.slug" class="sync-message">
      Lưu thiệp trước để quản lý khách mời trên server (thêm / sửa / xóa và
      link cá nhân cho từng khách).
    </p>

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

          <div class="card-header-actions">
            <button
              v-if="wedding.slug && recipient.token"
              type="button"
              class="small-icon-button"
              title="Sao chép link cá nhân cho khách"
              @click="copyGuestLink(recipient)"
            >
              <v-icon size="17"> mdi-link-variant </v-icon>
            </button>

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
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Token</label>

            <input v-model="recipient.token" type="text" readonly />
          </div>

          <div class="editor-field">
            <label>Tên khách</label>

            <input
              v-model="recipient.Name"
              type="text"
              placeholder="VD: Chú Minh + Cô Hằng"
              :disabled="syncing"
              @blur="updateRecipientName(recipient)"
            />
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
import { onMounted, ref } from "vue";
import {
  addRecipient as addRecipientApi,
  deleteRecipient as deleteRecipientApi,
  getRecipients as getRecipientsApi,
  updateRecipient as updateRecipientApi,
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
 * Đảm bảo mỗi recipient có đủ 2 key:
 * - token (chữ thường — dùng trong panel + link)
 * - Token (API C# model binding)
 */
function normalizeRecipient(recipient) {
  if (!recipient.token && recipient.Token) {
    recipient.token = recipient.Token;
  }

  if (!recipient.Token && recipient.token) {
    recipient.Token = recipient.token;
  }

  return recipient;
}

/*
 * Khi mở panel với thiệp đã lưu (có slug): tải danh
 * sách khách mời từ server đè lên dữ liệu local —
 * server là nguồn chính xác (đã lọc IsActive = 1).
 */
onMounted(async () => {
  const slug = props.wedding?.slug;

  if (!slug) {
    return;
  }

  syncing.value = true;

  try {
    const response = await getRecipientsApi({ slug });

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      props.wedding.recipientName = result.data.map((item) =>
        normalizeRecipient({
          ...item,
          __savedName: item.Name || "",
        })
      );
    }
  } catch (error) {
    console.error("[RecipientPanel] getRecipients error:", error);
  } finally {
    syncing.value = false;
  }
});

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

  const token = newToken();

  const recipient = normalizeRecipient({
    token,
    Name: "",
  });

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
      recipient.__savedName = recipient.Name || "";

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
 * Cập nhật tên khách mời trên server (gọi khi rời
 * khỏi ô nhập tên). Chỉ gọi khi có slug + token và
 * tên khác giá trị đã lưu.
 */
async function updateRecipientName(recipient) {
  if (!props.wedding) return;

  const slug = props.wedding.slug;
  const token = recipient?.token;

  if (!slug || !token || syncing.value) {
    return;
  }

  if ((recipient.Name || "") === (recipient.__savedName || "")) {
    return;
  }

  syncing.value = true;

  try {
    const response = await updateRecipientApi({
      slug: slug,
      Token: token,
      Name: recipient.Name || "",
    });

    const result = response?.data;

    if (result && result.status === "success") {
      recipient.__savedName = recipient.Name;

      showSyncMessage("Đã cập nhật tên khách mời.");
    } else {
      showSyncMessage(
        result?.message || "Không thể cập nhật tên khách mời.",
        true
      );
    }
  } catch (error) {
    console.error("[RecipientPanel] updateRecipient error:", error);

    showSyncMessage(
      error?.response?.data?.message ||
        "Không thể cập nhật tên khách mời.",
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

/*
 * Link cá nhân của khách: /{slug}/{token} — mở thiệp
 * kèm tên khách (recipientName) và tự điền tên vào
 * form xác nhận tham dự.
 */
async function copyGuestLink(recipient) {
  const slug = props.wedding?.slug;
  const token = recipient?.token;

  if (!slug || !token) {
    return;
  }

  const url = `${window.location.origin}/${slug}/${token}`;

  try {
    await navigator.clipboard.writeText(url);

    showSyncMessage("Đã sao chép link cá nhân của khách.");
  } catch (error) {
    console.error("[RecipientPanel] copyGuestLink error:", error);

    showSyncMessage("Không thể sao chép link.", true);
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

.card-header-actions {
  display: flex;

  align-items: center;

  gap: 6px;
}

.small-icon-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 34px;

  height: 34px;

  border: 0;

  border-radius: 9px;

  background: #f4eef7;

  color: #6d4a86;

  cursor: pointer;

  transition: transform 0.2s ease, background 0.2s ease;
}

.small-icon-button:hover {
  background: #e9dff0;

  transform: translateY(-1px);
}
</style>
