<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> THE COUPLE </span>

        <h1>Cô dâu & Chú rể</h1>

        <p>Thông tin cá nhân của hai nhân vật chính.</p>
      </div>
    </div>

    <!-- =====================================================
         XEM TRƯỚC NHANH
    ====================================================== -->

    <div class="couple-preview">
      <div class="preview-person">
        <div class="preview-avatar bride">
          <img
            v-if="wedding.couple?.Bride?.Avatar"
            :src="wedding.couple.Bride.Avatar"
            alt="Cô dâu"
          />

          <v-icon v-else size="22"> mdi-heart-outline </v-icon>
        </div>

        <div class="preview-text">
          <span>CÔ DÂU</span>

          <strong>
            {{ wedding.couple?.Bride?.Name || "Chưa nhập tên" }}
          </strong>

          <small v-if="wedding.couple?.Bride?.Nickname">
            "{{ wedding.couple.Bride.Nickname }}"
          </small>
        </div>
      </div>

      <span class="preview-amp" aria-hidden="true">&amp;</span>

      <div class="preview-person">
        <div class="preview-avatar groom">
          <img
            v-if="wedding.couple?.Groom?.Avatar"
            :src="wedding.couple.Groom.Avatar"
            alt="Chú rể"
          />

          <v-icon v-else size="22"> mdi-account-outline </v-icon>
        </div>

        <div class="preview-text">
          <span>CHÚ RỂ</span>

          <strong>
            {{ wedding.couple?.Groom?.Name || "Chưa nhập tên" }}
          </strong>

          <small v-if="wedding.couple?.Groom?.Nickname">
            "{{ wedding.couple.Groom.Nickname }}"
          </small>
        </div>
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

            <input
              v-model="wedding.couple.Bride.Name"
              type="text"
              placeholder="Hà Uyên"
            />
          </div>

          <div class="editor-field">
            <label>Tên gọi</label>

            <input
              v-model="wedding.couple.Bride.Nickname"
              type="text"
              placeholder="Uyên"
            />
          </div>

          <div class="editor-field">
            <label>Vai trò</label>

            <input
              v-model="wedding.couple.Bride.Role"
              type="text"
              list="bride-role-options"
            />

            <datalist id="bride-role-options">
              <option value="Trưởng Nữ" />
              <option value="Thứ Nữ" />
              <option value="Út Nữ" />
              <option value="Cô dâu" />
            </datalist>
          </div>

          <div class="editor-field">
            <label>Danh xưng gia đình</label>

            <input
              v-model="wedding.couple.Bride.FamilyLabel"
              type="text"
              placeholder="Ông Bà"
            />

            <small class="field-help">
              Hiển thị phía trên tên cha mẹ ở mục thông tin lễ cưới.
            </small>
          </div>

          <div class="editor-field">
            <label>Thứ tự trong gia đình</label>

            <input
              v-model="wedding.couple.Bride.BirthOrder"
              type="text"
              placeholder="VD: Con thứ hai"
            />

            <small class="field-help">
              Một số mẫu hiển thị dòng này dưới tên cha mẹ.
            </small>
          </div>

          <div class="editor-field">
            <label>Avatar</label>

            <UploadField
              v-model="wedding.couple.Bride.Avatar"
              kind="image"
              button-text="Tải avatar lên"
            />
          </div>

          <div class="editor-field">
            <label>Ảnh cover</label>

            <UploadField
              v-model="wedding.couple.Bride.Cover"
              kind="image"
              button-text="Tải ảnh cover lên"
            />
          </div>

          <div class="editor-field">
            <label>Cha</label>

            <input
              v-model="wedding.couple.Bride.Father"
              type="text"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div class="editor-field">
            <label>Mẹ</label>

            <input
              v-model="wedding.couple.Bride.Mother"
              type="text"
              placeholder="Trần Thị B"
            />
          </div>

          <div class="editor-field full">
            <label>Địa chỉ</label>

            <textarea
              v-model="wedding.couple.Bride.Address"
              rows="3"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            />
          </div>

          <div class="editor-field full">
            <label>Giới thiệu</label>

            <textarea
              v-model="wedding.couple.Bride.Description"
              rows="4"
              placeholder="Vài dòng về cô dâu..."
            />

            <small class="field-help">
              {{ (wedding.couple.Bride.Description || "").length }} ký tự
            </small>
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

            <input
              v-model="wedding.couple.Groom.Name"
              type="text"
              placeholder="Trần Hiếu"
            />
          </div>

          <div class="editor-field">
            <label>Tên gọi</label>

            <input
              v-model="wedding.couple.Groom.Nickname"
              type="text"
              placeholder="Hiếu"
            />
          </div>

          <div class="editor-field">
            <label>Vai trò</label>

            <input
              v-model="wedding.couple.Groom.Role"
              type="text"
              list="groom-role-options"
            />

            <datalist id="groom-role-options">
              <option value="Trưởng Nam" />
              <option value="Thứ Nam" />
              <option value="Út Nam" />
              <option value="Chú rể" />
            </datalist>
          </div>

          <div class="editor-field">
            <label>Danh xưng gia đình</label>

            <input
              v-model="wedding.couple.Groom.FamilyLabel"
              type="text"
              placeholder="Ông Bà"
            />

            <small class="field-help">
              Hiển thị phía trên tên cha mẹ ở mục thông tin lễ cưới.
            </small>
          </div>

          <div class="editor-field">
            <label>Thứ tự trong gia đình</label>

            <input
              v-model="wedding.couple.Groom.BirthOrder"
              type="text"
              placeholder="VD: Con trai út"
            />

            <small class="field-help">
              Một số mẫu hiển thị dòng này dưới tên cha mẹ.
            </small>
          </div>

          <div class="editor-field">
            <label>Avatar</label>

            <UploadField
              v-model="wedding.couple.Groom.Avatar"
              kind="image"
              button-text="Tải avatar lên"
            />
          </div>

          <div class="editor-field">
            <label>Ảnh cover</label>

            <UploadField
              v-model="wedding.couple.Groom.Cover"
              kind="image"
              button-text="Tải ảnh cover lên"
            />
          </div>

          <div class="editor-field">
            <label>Cha</label>

            <input
              v-model="wedding.couple.Groom.Father"
              type="text"
              placeholder="Trần Văn C"
            />
          </div>

          <div class="editor-field">
            <label>Mẹ</label>

            <input
              v-model="wedding.couple.Groom.Mother"
              type="text"
              placeholder="Lê Thị D"
            />
          </div>

          <div class="editor-field full">
            <label>Địa chỉ</label>

            <textarea
              v-model="wedding.couple.Groom.Address"
              rows="3"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            />
          </div>

          <div class="editor-field full">
            <label>Giới thiệu</label>

            <textarea
              v-model="wedding.couple.Groom.Description"
              rows="4"
              placeholder="Vài dòng về chú rể..."
            />

            <small class="field-help">
              {{ (wedding.couple.Groom.Description || "").length }} ký tự
            </small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import UploadField from "@/components/editor/UploadField.vue";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * FamilyLabel / BirthOrder là trường một số mẫu dùng
 * (RoyalRed hiển thị danh xưng gia đình, LongPhungV3
 * hiển thị thứ tự trong gia đình) — bổ sung mặc định
 * cho dữ liệu cũ để v-model ghi được.
 */
["Bride", "Groom"].forEach((role) => {
  const person = props.wedding.couple?.[role];

  if (!person) {
    return;
  }

  if (typeof person.FamilyLabel !== "string") {
    person.FamilyLabel = "Ông Bà";
  }

  if (typeof person.BirthOrder !== "string") {
    person.BirthOrder = "";
  }
});
</script>

<style scoped>
.couple-preview {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 18px;

  margin-bottom: 24px;

  padding: 18px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 16px;

  background:
    radial-gradient(circle at 12% 20%, rgba(185, 151, 91, 0.1), transparent 55%),
    #fffdfb;
}

.preview-person {
  display: flex;

  align-items: center;

  gap: 11px;

  min-width: 0;

  flex: 1;
}

.preview-avatar {
  width: 52px;

  height: 52px;

  flex: 0 0 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 50%;
}

.preview-avatar img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.preview-avatar.bride {
  color: #b75a76;

  background: #fdf0f4;
}

.preview-avatar.groom {
  color: #667da9;

  background: #eef2fa;
}

.preview-text {
  min-width: 0;

  display: flex;

  flex-direction: column;
}

.preview-text span {
  color: #a8988a;

  font-size: 8.5px;
  font-weight: 750;

  letter-spacing: 0.12em;
}

.preview-text strong {
  margin-top: 3px;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

  color: #3a2c26;

  font-family: var(--font-heading), Georgia, serif;
  font-size: 17px;
  font-weight: 600;
}

.preview-text small {
  margin-top: 2px;

  color: #a8988a;

  font-size: 10.5px;
}

.preview-amp {
  flex: 0 0 auto;

  color: var(--wine, #a63a2e);

  font-family: var(--font-heading), Georgia, serif;
  font-size: 22px;
}

@media (max-width: 620px) {
  .couple-preview {
    flex-direction: column;

    gap: 12px;
  }

  .preview-person {
    width: 100%;
  }

  .preview-amp {
    display: none;
  }
}
</style>
