<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> WEDDING GIFT </span>

        <h1>Mừng cưới</h1>

        <p>Thông tin tài khoản nhận mừng cưới.</p>
      </div>

      <button type="button" class="small-primary-button" @click="addGift">
        <v-icon size="17"> mdi-bank-plus </v-icon>

        Thêm phương thức
      </button>
    </div>

    <div class="items-list">
      <article
        v-for="(gift, index) in wedding.gifts"
        :key="gift.Id || index"
        class="editor-card"
      >
        <div class="card-header">
          <div>
            <span> PHƯƠNG THỨC {{ index + 1 }} </span>

            <strong>
              {{ gift.Name || "Mừng cưới" }}
            </strong>
          </div>

          <EditorItemActions
            :index="index"
            :total="wedding.gifts.length"
            remove-title="Xoá phương thức"
            @move="moveGift"
            @remove="removeGift"
          />
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Tên</label>

            <input
              v-model="gift.Name"
              type="text"
              placeholder="VD: Mừng cưới cô dâu"
            />
          </div>

          <div class="editor-field">
            <label>Ngân hàng / Ví</label>

            <input
              v-model="gift.BankName"
              type="text"
              list="bank-options"
              placeholder="VD: Vietcombank"
            />

            <datalist id="bank-options">
              <option
                v-for="bank in BANK_SUGGESTIONS"
                :key="bank"
                :value="bank"
              />
            </datalist>
          </div>

          <div class="editor-field">
            <label>Tên tài khoản</label>

            <input
              v-model="gift.AccountName"
              type="text"
              placeholder="VD: TRAN THI HA UYEN"
            />

            <small class="field-help">
              Tên chủ tài khoản — ghi đúng như trong app ngân hàng.
            </small>
          </div>

          <div class="editor-field">
            <label>Số tài khoản</label>

            <div class="copy-row">
              <input
                v-model="gift.AccountNumber"
                type="text"
                placeholder="VD: 0123456789"
              />

              <button
                type="button"
                class="copy-button"
                :disabled="!gift.AccountNumber"
                title="Sao chép số tài khoản"
                @click="copyText(gift.AccountNumber, 'Đã sao chép số tài khoản.')"
              >
                <v-icon size="16"> mdi-content-copy </v-icon>
              </button>
            </div>

            <small class="field-help">
              Khách bấm biểu tượng sao chép để dán vào app ngân hàng.
            </small>
          </div>

          <div class="editor-field full">
            <label>QR Code</label>

            <UploadField
              v-model="gift.QrCode"
              kind="image"
              button-text="Tải mã QR lên"
            />

            <small class="field-help">
              Chụp màn hình mã QR trong app ngân hàng rồi tải lên —
              khách quét để chuyển khoản nhanh.
            </small>
          </div>

          <div class="editor-field full">
            <label>Mô tả</label>

            <textarea
              v-model="gift.Description"
              rows="4"
              placeholder="VD: Mọi đóng góp xin gửi về tài khoản của cô dâu."
            />

            <small class="field-help">
              Lời nhắn hiển thị cạnh thông tin tài khoản.
            </small>
          </div>
        </div>
      </article>

      <div v-if="!wedding.gifts?.length" class="empty-card">
        <v-icon size="30"> mdi-gift-outline </v-icon>

        <strong> Chưa có phương thức mừng cưới </strong>

        <span> Thêm tài khoản để khách mời gửi quà online. </span>
      </div>

      <button type="button" class="add-button" @click="addGift">
        <v-icon> mdi-bank-plus </v-icon>

        Thêm phương thức
      </button>
    </div>
  </section>
</template>

<script setup>
import EditorItemActions from "@/components/editor/EditorItemActions.vue";
import UploadField from "@/components/editor/UploadField.vue";

import { confirmDialog } from "@/composables/useConfirm";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Gợi ý ngân hàng phổ biến — người dùng chọn nhanh
 * thay vì gõ tay, vẫn nhập được tên khác.
 */
const BANK_SUGGESTIONS = [
  "Vietcombank",
  "Techcombank",
  "BIDV",
  "VietinBank",
  "Agribank",
  "MB Bank",
  "ACB",
  "Sacombank",
  "TPBank",
  "VPBank",
  "MoMo",
  "ZaloPay",
];

function addGift() {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.gifts)) {
    props.wedding.gifts = [];
  }

  props.wedding.gifts.push({
    Id: Date.now(),
    Name: "",
    Description: "",
    BankName: "",
    AccountName: "",
    AccountNumber: "",
    QrCode: "",
  });
}

async function removeGift(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.gifts)) return;

  const gift = props.wedding.gifts[index];

  const ok = await confirmDialog({
    title: "Xoá phương thức này?",
    message: "Thông tin tài khoản sẽ bị xoá khỏi thiệp.",
    detail: gift?.Name || `Phương thức ${index + 1}`,
    confirmText: "Xoá",
    danger: true,
  });

  if (!ok) {
    return;
  }

  props.wedding.gifts.splice(index, 1);
}

function moveGift(index, direction) {
  const list = props.wedding.gifts;

  const target = index + direction;

  if (!Array.isArray(list) || target < 0 || target >= list.length) {
    return;
  }

  const [item] = list.splice(index, 1);

  list.splice(target, 0, item);
}

/*
 * Sao chép nhanh số tài khoản — người dùng thường phải
 * mở app ngân hàng và dán lại, gõ tay rất dễ sai.
 */
async function copyText(value, message) {
  if (!value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(String(value));
  } catch (error) {
    console.warn("[GiftsPanel] Không sao chép được:", error);
  }
}
</script>

<style scoped>
.copy-row {
  display: flex;

  gap: 7px;

  align-items: stretch;
}

.copy-row input {
  flex: 1;

  min-width: 0;
}

.copy-button {
  width: 42px;

  flex: 0 0 42px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 10px;

  background: #fffdfb;

  color: #6b5a4e;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.copy-button:hover:not(:disabled) {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}

.copy-button:disabled {
  opacity: 0.4;

  cursor: not-allowed;
}
</style>
