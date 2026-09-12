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

          <button
            type="button"
            class="danger-icon"
            title="Xóa phương thức"
            @click="removeGift(index)"
          >
            <v-icon size="18"> mdi-delete-outline </v-icon>
          </button>
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Tên</label>

            <input v-model="gift.Name" type="text" />
          </div>

          <div class="editor-field">
            <label>Ngân hàng / Ví</label>

            <input v-model="gift.BankName" type="text" />
          </div>

          <div class="editor-field">
            <label>Tên tài khoản</label>

            <input v-model="gift.AccountName" type="text" />
          </div>

          <div class="editor-field">
            <label>Số tài khoản</label>

            <input v-model="gift.AccountNumber" type="text" />
          </div>

          <div class="editor-field full">
            <label>QR Code</label>

            <input
              v-model="gift.QrCode"
              type="text"
              placeholder="/images/qr-bank.png"
            />
          </div>

          <div class="editor-field full">
            <label>Mô tả</label>

            <textarea v-model="gift.Description" rows="4" />
          </div>
        </div>
      </article>

      <button type="button" class="add-button" @click="addGift">
        <v-icon> mdi-bank-plus </v-icon>

        Thêm phương thức
      </button>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  wedding: { type: Object, required: true },
});

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

function removeGift(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.gifts)) return;

  props.wedding.gifts.splice(index, 1);
}
</script>
