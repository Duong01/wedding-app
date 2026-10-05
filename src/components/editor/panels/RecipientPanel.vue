<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> PERSONALIZATION </span>

        <h1>{{ $t('editor.menu.recipient') }}</h1>

        <p>{{ $t('recipientPanel.desc') }}</p>
      </div>

      <button
        type="button"
        class="small-primary-button"
        :disabled="syncing"
        @click="addRecipient"
      >
        <v-icon size="17"> mdi-account-plus-outline </v-icon>

        {{ $t('recipientPanel.add') }}
      </button>
    </div>

    <p v-if="!wedding.slug" class="sync-message">
      {{ $t('recipientPanel.saveFirst') }}
    </p>

    <p v-if="syncMessage" class="sync-message" :class="{ error: syncError }">
      {{ syncMessage }}
    </p>

    <!-- =====================================================
         THANH CÔNG CỤ
    ====================================================== -->

    <div v-if="recipients.length" class="recipient-toolbar">
      <div class="recipient-search">
        <v-icon size="17"> mdi-magnify </v-icon>

        <input
          v-model="keyword"
          type="text"
          :placeholder="$t('recipientPanel.search')"
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

      <span class="recipient-count">
        {{ $t("recipientPanel.count", { shown: filteredRecipients.length, total: recipients.length }) }} </span> </div> <div v-if="recipients.length" class="recipient-actions"> <button type="button" class="inline-button" :disabled="syncing" @click="bulkOpen = !bulkOpen" > <v-icon size="15"> mdi-account-multiple-plus-outline </v-icon> {{ $t('recipientPanel.addMany') }} </button> <button type="button" class="inline-button" :disabled="!wedding.slug || !recipients.length" @click="copyAllLinks" > <v-icon size="15"> mdi-link-variant-multiple </v-icon> {{ $t('recipientPanel.copyAll') }} </button> </div> <!-- ===================================================== THÊM NHANH NHIỀU KHÁCH ====================================================== --> <div v-if="bulkOpen" class="bulk-card"> <label>{{ $t('recipientPanel.onePerLine') }}</label> <textarea v-model="bulkText" rows="5" :placeholder="$t('recipientPanel.bulkPlaceholder')" /> <div class="bulk-actions"> <span class="bulk-hint"> {{ $t("recipientPanel.willAdd", { n: bulkNames.length }) }} </span> <button type="button" class="small-primary-button" :disabled="!bulkNames.length || syncing" @click="applyBulk" > <v-icon size="16"> mdi-check </v-icon> {{ $t('recipientPanel.addToList') }} </button> </div> </div> <!-- ===================================================== DANH SÁCH ====================================================== --> <div class="items-list"> <article v-for="recipient in filteredRecipients" :key="recipient.token || recipient.__index" class="editor-card" > <div class="card-header"> <div> <span> {{ $t('recipientPanel.itemLabel') }} {{ recipient.__index + 1 }} </span> <strong> {{ recipient.Name || $t('editor.menu.recipient') }} </strong> </div> <div class="card-header-actions"> <button v-if="wedding.slug && recipient.token" type="button" class="small-icon-button" :title="$t('recipientPanel.copyLink')" @click="copyGuestLink(recipient)" > <v-icon size="17"> mdi-link-variant </v-icon> </button> <button type="button" class="danger-icon" :title="$t('recipientPanel.remove')" :disabled="syncing" @click="removeRecipient(recipient.__index)" > <v-icon size="18"> mdi-delete-outline </v-icon> </button> </div> </div> <div class="form-grid"> <div class="editor-field"> <label>Token</label> <input v-model="recipient.token" type="text" readonly /> <small class="field-help"> {{ $t('recipientPanel.tokenHint') }} </small> </div> <div class="editor-field"> <label>{{ $t('recipientPanel.name') }}</label> <input v-model="recipient.Name" type="text" :placeholder="$t('recipientPanel.namePlaceholder')" :disabled="syncing" @blur="updateRecipientName(recipient)" /> <small class="field-help"> {{ $t('recipientPanel.nameHint') }} </small> </div> </div> </article> <p v-if="keyword && !filteredRecipients.length" class="search-empty"> {{ $t("recipientPanel.noMatch", { keyword }) }} </p> <div v-if="!recipients.length" class="empty-card"> <v-icon size="30"> mdi-account-multiple-outline </v-icon> <strong> {{ $t('recipientPanel.empty') }} </strong> <span> {{ $t('recipientPanel.emptyHint') }} </span> </div> <button type="button" class="add-button" @click="addRecipient"> <v-icon> mdi-account-plus-outline </v-icon> {{ $t('recipientPanel.addGuest') }} </button> </div> </section> </template> <script setup> import { useI18n } from "vue-i18n"; import { computed, onMounted, ref } from "vue"; import { addRecipient as addRecipientApi, deleteRecipient as deleteRecipientApi, getRecipients as getRecipientsApi, updateRecipient as updateRecipientApi, } from "@/model/api"; import { confirmDialog } from "@/composables/useConfirm"; const { t } = useI18n(); const props = defineProps({ wedding: { type: Object, required: true }, }); const syncing = ref(false); const syncMessage = ref("");
const syncError = ref(false);

/* =====================================================
   TÌM KIẾM
===================================================== */

const keyword = ref("");

const recipients = computed(() =>
  Array.isArray(props.wedding.recipientName)
    ? props.wedding.recipientName
    : []
);

/*
 * Giữ kèm chỉ số gốc để thao tác xoá vẫn đúng vị trí
 * trong mảng gốc khi danh sách đang được lọc.
 */
const filteredRecipients = computed(() => {
  const query = keyword.value.trim().toLowerCase();

  const list = recipients.value.map((recipient, index) => ({
    ...recipient,
    __index: index,
  }));

  if (!query) {
    return list;
  }

  return list.filter((recipient) => {
    const name = String(recipient.Name || "").toLowerCase();

    const token = String(recipient.token || "").toLowerCase();

    return name.includes(query) || token.includes(query);
  });
});

/* =====================================================
   THÊM NHANH NHIỀU KHÁCH
===================================================== */

const bulkOpen = ref(false);
const bulkText = ref("");

const bulkNames = computed(() =>
  bulkText.value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
);

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
 * Lưu 1 khách mới lên server (nếu thiệp đã có slug).
 * Tách riêng để cả addRecipient lẫn applyBulk dùng chung.
 */
async function persistRecipient(recipient) {
  const slug = props.wedding.slug;

  if (!slug) {
    return true;
  }

  try {
    const response = await addRecipientApi({
      slug: slug,
      Token: recipient.token,
      Name: recipient.Name,
    });

    const result = response?.data;

    if (result && result.status === "success") {
      recipient.__savedName = recipient.Name || "";

      return true;
    }

    showSyncMessage(
      result?.message || t("recipientPanel.saveFailed"),
      true
    );

    return false;
  } catch (error) {
    console.error("[RecipientPanel] addRecipient error:", error);

    showSyncMessage(
      error?.response?.data?.message || t("recipientPanel.saveFailed"),
      true
    );

    return false;
  }
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

  const recipient = normalizeRecipient({
    token: newToken(),
    Name: "",
  });

  props.wedding.recipientName.push(recipient);

  if (!props.wedding.slug) {
    return;
  }

  syncing.value = true;

  const ok = await persistRecipient(recipient);

  syncing.value = false;

  if (ok) {
    showSyncMessage(t("recipientPanel.addedOne"));
  }
}

/*
 * Dán cả danh sách — mỗi dòng một khách. Tiện khi
 * khách mời đã có sẵn trong Excel / Google Sheets.
 */
async function applyBulk() {
  const names = bulkNames.value;

  if (!names.length) {
    return;
  }

  if (!Array.isArray(props.wedding.recipientName)) {
    props.wedding.recipientName = [];
  }

  const created = names.map((name) =>
    normalizeRecipient({ token: newToken(), Name: name })
  );

  props.wedding.recipientName.push(...created);

  bulkText.value = "";
  bulkOpen.value = false;

  if (!props.wedding.slug) {
    showSyncMessage(t("recipientPanel.added", { n: created.length }));

    return;
  }

  syncing.value = true;

  let failed = 0;

  for (const recipient of created) {
    const ok = await persistRecipient(recipient);

    if (!ok) {
      failed += 1;
    }
  }

  syncing.value = false;

  if (failed) {
    showSyncMessage(
      t("recipientPanel.addedPartial", { ok: created.length - failed, total: created.length, failed }),
      true
    );
  } else {
    showSyncMessage(t("recipientPanel.addedServer", { n: created.length }));
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

      showSyncMessage(t("recipientPanel.renamed"));
    } else {
      showSyncMessage(
        result?.message || t("recipientPanel.renameFailed"),
        true
      );
    }
  } catch (error) {
    console.error("[RecipientPanel] updateRecipient error:", error);

    showSyncMessage(
      error?.response?.data?.message || t("recipientPanel.renameFailed"),
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

  const target = props.wedding.recipientName[index];

  const ok = await confirmDialog({
    get title() { return t("recipientPanel.confirmTitle"); },
    message: target?.Name
      ? t("recipientPanel.confirmNamed", { name: target.Name })
      : t("recipientPanel.confirmMessage"),
    get confirmText() { return t("recipientPanel.confirmRemove"); },
    danger: true,
  });

  if (!ok) {
    return;
  }

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
      showSyncMessage(t("recipientPanel.removed"));
    } else {
      showSyncMessage(
        result?.message || t("recipientPanel.removeFailed"),
        true
      );
    }
  } catch (error) {
    console.error("[RecipientPanel] deleteRecipient error:", error);

    showSyncMessage(
      error?.response?.data?.message || t("recipientPanel.removeFailed"),
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
function guestLink(recipient) {
  const slug = props.wedding?.slug;
  const token = recipient?.token;

  if (!slug || !token) {
    return "";
  }

  return `${window.location.origin}/${slug}/${token}`;
}

async function copyGuestLink(recipient) {
  const url = guestLink(recipient);

  if (!url) {
    return;
  }

  try {
    await navigator.clipboard.writeText(url);

    showSyncMessage(t("recipientPanel.linkCopied"));
  } catch (error) {
    console.error("[RecipientPanel] copyGuestLink error:", error);

    showSyncMessage(t("recipientPanel.copyFailed"), true);
  }
}

/*
 * Sao chép toàn bộ link dạng "Tên<TAB>link" — dán thẳng
 * vào Excel / Google Sheets để gửi hàng loạt.
 */
async function copyAllLinks() {
  const lines = recipients.value
    .map((recipient) => {
      const url = guestLink(recipient);

      if (!url) {
        return "";
      }

      return `${recipient.Name || t("guestbookPanel.guest")}\t${url}`;
    })
    .filter(Boolean);

  if (!lines.length) {
    showSyncMessage(t("recipientPanel.noLinks"), true);

    return;
  }

  try {
    await navigator.clipboard.writeText(lines.join("\n"));

    showSyncMessage(t("recipientPanel.linksCopied", { n: lines.length }));
  } catch (error) {
    console.error("[RecipientPanel] copyAllLinks error:", error);

    showSyncMessage(t("recipientPanel.copyListFailed"), true);
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

.recipient-toolbar {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 10px;
}

.recipient-search {
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

.recipient-search:focus-within {
  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.09);
}

.recipient-search input {
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

.recipient-count {
  flex: 0 0 auto;

  padding: 5px 11px;

  border-radius: 999px;

  background: rgba(185, 151, 91, 0.14);

  color: #6b5a4e;

  font-size: 10.5px;
  font-weight: 700;

  white-space: nowrap;
}

.recipient-actions {
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

.bulk-card {
  display: flex;

  flex-direction: column;

  gap: 9px;

  margin-bottom: 18px;

  padding: 15px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 14px;

  background: #fffdfb;
}

.bulk-card label {
  color: #6b5a4e;

  font-size: 11.5px;
  font-weight: 700;
}

.bulk-card textarea {
  width: 100%;

  padding: 10px 12px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 10px;

  background: #fffdfb;

  color: #2b2118;

  font-family: inherit;
  font-size: 13px;

  line-height: 1.6;

  resize: vertical;
}

.bulk-card textarea:focus {
  outline: none;

  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.09);
}

.bulk-actions {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;
}

.bulk-hint {
  color: #a8988a;

  font-size: 11px;
}

.search-empty {
  margin: 0 0 14px;

  color: #a8988a;

  font-size: 12px;
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

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.small-icon-button:hover {
  background: #e9dff0;

  transform: translateY(-1px);
}
</style>
