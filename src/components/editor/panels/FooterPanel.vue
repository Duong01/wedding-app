<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> FOOTER </span>

        <h1>Chân thiệp</h1>

        <p>Thông tin cuối thiệp.</p>
      </div>
    </div>

    <div class="form-grid">
      <div class="editor-field">
        <label>Tên chú rể</label>

        <input v-model="wedding.footer.GroomName" type="text" />

        <small class="field-help">
          Đã đồng bộ với mục Thông tin chung.
        </small>
      </div>

      <div class="editor-field">
        <label>Tên cô dâu</label>

        <input v-model="wedding.footer.BrideName" type="text" />

        <small class="field-help">
          Đã đồng bộ với mục Thông tin chung.
        </small>
      </div>

      <div class="editor-field full">
        <label>Lời kết</label>

        <textarea
          v-model="wedding.footer.Message"
          rows="6"
          placeholder="Lời cảm ơn gửi tới khách mời..."
        />

        <small class="field-help">
          {{ (wedding.footer.Message || "").length }} ký tự
        </small>
      </div>

      <div class="editor-field full">
        <label>Lời cảm ơn riêng</label>

        <textarea
          v-model="wedding.thankYouNote"
          rows="3"
          placeholder="VD: Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!"
        />

        <small class="field-help">
          Một số mẫu dùng dòng này thay cho Lời kết. Để trống nếu không
          cần.
        </small>
      </div>

      <div class="editor-field full">
        <label>Copyright</label>

        <input
          v-model="wedding.footer.Copyright"
          type="text"
          placeholder="VD: Hà Uyên & Trần Hiếu"
        />

        <button
          type="button"
          class="inline-button"
          @click="fillCopyrightFromCouple"
        >
          <v-icon size="15"> mdi-auto-fix </v-icon>

          Lấy từ tên cô dâu chú rể
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * thankYouNote là trường một số mẫu dùng (LongPhungV3)
 * — bổ sung mặc định cho dữ liệu cũ để v-model ghi được.
 */
if (typeof props.wedding.thankYouNote !== "string") {
  props.wedding.thankYouNote = "";
}

function fillCopyrightFromCouple() {
  const bride = props.wedding.brideName || props.wedding.couple?.Bride?.Name;

  const groom = props.wedding.groomName || props.wedding.couple?.Groom?.Name;

  const parts = [bride, groom].filter(Boolean);

  if (!parts.length) {
    return;
  }

  props.wedding.footer.Copyright = parts.join(" & ");
}
</script>

<style scoped>
.inline-button {
  align-self: flex-start;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  margin-top: 2px;

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

.inline-button:hover {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}
</style>
