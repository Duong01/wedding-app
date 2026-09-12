<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> THE COUPLE </span>

        <h1>Cô dâu & Chú rể</h1>

        <p>Thông tin cá nhân của hai nhân vật chính.</p>
      </div>
    </div>

    <div class="person-grid">
      <!-- BRIDE -->
      <div class="person-editor">
        <div class="person-heading">
          <div class="person-avatar bride">
            <v-icon> mdi-heart-outline </v-icon>
          </div>

          <div>
            <span>CÔ DÂU</span>

            <strong>
              {{ wedding.couple?.Bride?.Name || "Cô dâu" }}
            </strong>
          </div>
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Họ tên</label>

            <input v-model="wedding.couple.Bride.Name" type="text" />
          </div>

          <div class="editor-field">
            <label>Tên gọi</label>

            <input v-model="wedding.couple.Bride.Nickname" type="text" />
          </div>

          <div class="editor-field">
            <label>Vai trò</label>

            <input v-model="wedding.couple.Bride.Role" type="text" />
          </div>

          <div class="editor-field">
            <label>Avatar</label>

            <input v-model="wedding.couple.Bride.Avatar" type="text" />
          </div>

          <div class="editor-field full">
            <label>Ảnh cover</label>

            <input v-model="wedding.couple.Bride.Cover" type="text" />
          </div>

          <div class="editor-field">
            <label>Cha</label>

            <input v-model="wedding.couple.Bride.Father" type="text" />
          </div>

          <div class="editor-field">
            <label>Mẹ</label>

            <input v-model="wedding.couple.Bride.Mother" type="text" />
          </div>

          <div class="editor-field full">
            <label>Địa chỉ</label>

            <textarea v-model="wedding.couple.Bride.Address" rows="3" />
          </div>

          <div class="editor-field full">
            <label>Giới thiệu</label>

            <textarea
              v-model="wedding.couple.Bride.Description"
              rows="4"
            />
          </div>
        </div>
      </div>

      <!-- GROOM -->
      <div class="person-editor">
        <div class="person-heading">
          <div class="person-avatar groom">
            <v-icon> mdi-account-outline </v-icon>
          </div>

          <div>
            <span>CHÚ RỂ</span>

            <strong>
              {{ wedding.couple?.Groom?.Name || "Chú rể" }}
            </strong>
          </div>
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Họ tên</label>

            <input v-model="wedding.couple.Groom.Name" type="text" />
          </div>

          <div class="editor-field">
            <label>Tên gọi</label>

            <input v-model="wedding.couple.Groom.Nickname" type="text" />
          </div>

          <div class="editor-field">
            <label>Vai trò</label>

            <input v-model="wedding.couple.Groom.Role" type="text" />
          </div>

          <div class="editor-field">
            <label>Avatar</label>

            <input v-model="wedding.couple.Groom.Avatar" type="text" />
          </div>

          <div class="editor-field full">
            <label>Ảnh cover</label>

            <input v-model="wedding.couple.Groom.Cover" type="text" />
          </div>

          <div class="editor-field">
            <label>Cha</label>

            <input v-model="wedding.couple.Groom.Father" type="text" />
          </div>

          <div class="editor-field">
            <label>Mẹ</label>

            <input v-model="wedding.couple.Groom.Mother" type="text" />
          </div>

          <div class="editor-field full">
            <label>Địa chỉ</label>

            <textarea v-model="wedding.couple.Groom.Address" rows="3" />
          </div>

          <div class="editor-field full">
            <label>Giới thiệu</label>

            <textarea
              v-model="wedding.couple.Groom.Description"
              rows="4"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  wedding: { type: Object, required: true },
});
</script>
