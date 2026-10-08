<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> THE COUPLE </span>

        <h1>{{ $t('editor.menu.couple') }}</h1>

        <p>{{ $t('couplePanel.desc') }}</p>
      </div>

      <PanelProgressBadge
        :done="progress?.done || 0"
        :total="progress?.total || 0"
      />
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
            :alt="$t('panel.bride')"
          />

          <v-icon v-else size="22"> mdi-heart-outline </v-icon>
        </div>

        <div class="preview-text">
          <span>{{ $t('couplePanel.brideCaps') }}</span>

          <strong>
            {{ wedding.couple?.Bride?.Name || $t('couplePanel.noName') }}
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
            :alt="$t('panel.groom')"
          />

          <v-icon v-else size="22"> mdi-account-outline </v-icon>
        </div>

        <div class="preview-text">
          <span>{{ $t('couplePanel.groomCaps') }}</span>

          <strong>
            {{ wedding.couple?.Groom?.Name || $t('couplePanel.noName') }}
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
            <span>{{ $t('couplePanel.brideCaps') }}</span>

            <strong>
              {{ wedding.couple?.Bride?.Name || $t('panel.bride') }}
            </strong>
          </div>
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>{{ $t('couplePanel.fullName') }}</label>

            <input
              v-model="wedding.couple.Bride.Name"
              type="text"
              placeholder="Hà Uyên"
            />

            <small class="field-help">
              {{ $t('couplePanel.fullNameHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.nickname') }}</label>

            <input
              v-model="wedding.couple.Bride.Nickname"
              type="text"
              placeholder="Uyên"
            />

            <small class="field-help">
              {{ $t('couplePanel.nicknameHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.role') }}</label>

            <input
              v-model="wedding.couple.Bride.Role"
              type="text"
              list="bride-role-options"
            />

            <small class="field-help">
              {{ $t('couplePanel.roleHint') }}
            </small>

            <datalist id="bride-role-options">
              <option value="Trưởng Nữ" />
              <option value="Thứ Nữ" />
              <option value="Út Nữ" />
              <option value="Cô dâu" />
            </datalist>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.familyLabel') }}</label>

            <input
              v-model="wedding.couple.Bride.FamilyLabel"
              type="text"
              placeholder="Ông Bà"
            />

            <small class="field-help">
              {{ $t('couplePanel.familyLabelHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.birthOrder') }}</label>

            <input
              v-model="wedding.couple.Bride.BirthOrder"
              type="text"
              :placeholder="$t('couplePanel.birthOrderBride')"
            />

            <small class="field-help">
              {{ $t('couplePanel.birthOrderHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>Avatar</label>

            <UploadField
              v-model="wedding.couple.Bride.Avatar"
              kind="image"
              :button-text="$t('couplePanel.uploadAvatar')"
            />

            <small class="field-help">
              {{ $t('couplePanel.avatarHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.cover') }}</label>

            <UploadField
              v-model="wedding.couple.Bride.Cover"
              kind="image"
              :button-text="$t('couplePanel.uploadCover')"
            />

            <small class="field-help">
              {{ $t('couplePanel.coverHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.father') }}</label>

            <input
              v-model="wedding.couple.Bride.Father"
              type="text"
              placeholder="Nguyễn Văn A"
            />

            <small class="field-help">
              {{ $t('couplePanel.parentsHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.mother') }}</label>

            <input
              v-model="wedding.couple.Bride.Mother"
              type="text"
              placeholder="Trần Thị B"
            />

            <small class="field-help">
              {{ $t('couplePanel.parentsHint') }}
            </small>
          </div>

          <div class="editor-field full">
            <label>{{ $t('couplePanel.address') }}</label>

            <textarea
              v-model="wedding.couple.Bride.Address"
              rows="3"
              :placeholder="$t('couplePanel.addressPlaceholder')"
            />
          </div>

          <div class="editor-field full">
            <label>{{ $t('couplePanel.bio') }}</label>

            <textarea
              v-model="wedding.couple.Bride.Description"
              rows="4"
              :placeholder="$t('couplePanel.bioBride')"
            />

            <small class="field-help">
              {{ $t("couplePanel.bioHint") }}
              {{ $t("common.chars", { n: (wedding.couple.Bride.Description || "").length }) }}
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
            <span>{{ $t('couplePanel.groomCaps') }}</span>

            <strong>
              {{ wedding.couple?.Groom?.Name || $t('panel.groom') }}
            </strong>
          </div>
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>{{ $t('couplePanel.fullName') }}</label>

            <input
              v-model="wedding.couple.Groom.Name"
              type="text"
              placeholder="Trần Hiếu"
            />

            <small class="field-help">
              {{ $t('couplePanel.fullNameHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.nickname') }}</label>

            <input
              v-model="wedding.couple.Groom.Nickname"
              type="text"
              placeholder="Hiếu"
            />

            <small class="field-help">
              {{ $t('couplePanel.nicknameHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.role') }}</label>

            <input
              v-model="wedding.couple.Groom.Role"
              type="text"
              list="groom-role-options"
            />

            <small class="field-help">
              {{ $t('couplePanel.roleHint') }}
            </small>

            <datalist id="groom-role-options">
              <option value="Trưởng Nam" />
              <option value="Thứ Nam" />
              <option value="Út Nam" />
              <option value="Chú rể" />
            </datalist>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.familyLabel') }}</label>

            <input
              v-model="wedding.couple.Groom.FamilyLabel"
              type="text"
              placeholder="Ông Bà"
            />

            <small class="field-help">
              {{ $t('couplePanel.familyLabelHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.birthOrder') }}</label>

            <input
              v-model="wedding.couple.Groom.BirthOrder"
              type="text"
              :placeholder="$t('couplePanel.birthOrderGroom')"
            />

            <small class="field-help">
              {{ $t('couplePanel.birthOrderHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>Avatar</label>

            <UploadField
              v-model="wedding.couple.Groom.Avatar"
              kind="image"
              :button-text="$t('couplePanel.uploadAvatar')"
            />

            <small class="field-help">
              {{ $t('couplePanel.avatarHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.cover') }}</label>

            <UploadField
              v-model="wedding.couple.Groom.Cover"
              kind="image"
              :button-text="$t('couplePanel.uploadCover')"
            />

            <small class="field-help">
              {{ $t('couplePanel.coverHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.father') }}</label>

            <input
              v-model="wedding.couple.Groom.Father"
              type="text"
              placeholder="Trần Văn C"
            />

            <small class="field-help">
              {{ $t('couplePanel.parentsHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('couplePanel.mother') }}</label>

            <input
              v-model="wedding.couple.Groom.Mother"
              type="text"
              placeholder="Lê Thị D"
            />

            <small class="field-help">
              {{ $t('couplePanel.parentsHint') }}
            </small>
          </div>

          <div class="editor-field full">
            <label>{{ $t('couplePanel.address') }}</label>

            <textarea
              v-model="wedding.couple.Groom.Address"
              rows="3"
              :placeholder="$t('couplePanel.addressPlaceholder')"
            />
          </div>

          <div class="editor-field full">
            <label>{{ $t('couplePanel.bio') }}</label>

            <textarea
              v-model="wedding.couple.Groom.Description"
              rows="4"
              :placeholder="$t('couplePanel.bioGroom')"
            />

            <small class="field-help">
              {{ $t("couplePanel.bioHint") }}
              {{ $t("common.chars", { n: (wedding.couple.Groom.Description || "").length }) }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { watchEffect } from "vue";

import UploadField from "@/components/editor/UploadField.vue";

import PanelProgressBadge from "@/components/editor/PanelProgressBadge.vue";

const props = defineProps({
  wedding: { type: Object, required: true },

  /* { done, total } từ Editor.vue — badge hoàn thiện mục. */
  progress: { type: Object, default: null },
});

/*
 * Panel này là panel DUY NHẤT dùng v-model đi thẳng vào
 * wedding.couple.Bride.* / wedding.couple.Groom.* (không
 * optional chaining) — vì vậy couple/Bride/Groom BẮT BUỘC
 * phải là object trước khi render.
 *
 * Trước đây phần bù này chạy một lần ở module scope: nếu lúc
 * đó wedding.couple còn null (thiệp lưu dở, hoặc panel được
 * mount trước khi ensureNewSections chạy) thì không bù gì cả
 * và template ném lỗi → cả mục "Cô dâu & Chú rể" trắng trơn.
 *
 * watchEffect chạy lại mỗi khi wedding đổi, nên dữ liệu về
 * muộn (load API xong) vẫn được bù đúng.
 *
 * FamilyLabel / BirthOrder là trường một số mẫu dùng
 * (RoyalRed hiển thị danh xưng gia đình, LongPhungV3
 * hiển thị thứ tự trong gia đình) — bổ sung mặc định
 * cho dữ liệu cũ để v-model ghi được.
 */
watchEffect(() => {
  const wedding = props.wedding;

  if (!wedding) {
    return;
  }

  if (!wedding.couple || typeof wedding.couple !== "object") {
    wedding.couple = {};
  }

  ["Bride", "Groom"].forEach((role) => {
    if (!wedding.couple[role] || typeof wedding.couple[role] !== "object") {
      wedding.couple[role] = {};
    }

    const person = wedding.couple[role];

    if (typeof person.FamilyLabel !== "string") {
      person.FamilyLabel = "Ông Bà";
    }

    if (typeof person.BirthOrder !== "string") {
      person.BirthOrder = "";
    }
  });
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
