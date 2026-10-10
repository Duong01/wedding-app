<template>
  <!--
    Form nhận quà sau khi khách trúng — nhập tên để chủ thiệp
    đối chiếu khi khách đến lễ (POST claimGamePrize).

    Trong iframe preview của editor KHÔNG gọi API — chỉ hiện
    giao diện kèm dòng "(chế độ xem trước)" để chủ thiệp thử
    không ghi rác vào danh sách.
  -->
  <div class="prize-claim">
    <div class="prize-claim__card">
      <span class="prize-claim__orn" aria-hidden="true">🎁</span>

      <strong class="prize-claim__title"> {{ prizeTitle }} </strong>

      <p class="prize-claim__hint">
        {{ $t("Nhập họ tên để cô dâu chú rể chuẩn bị quà cho bạn tại lễ cưới.") }}
      </p>

      <input
        v-model.trim="name"
        type="text"
        class="prize-claim__input"
        :placeholder="$t('Họ và tên của bạn')"
        maxlength="100"
        :disabled="done"
        @keyup.enter="submit"
      />

      <p v-if="message" class="prize-claim__message" :class="{ error: isError }">
        {{ message }}
      </p>

      <button
        type="button"
        class="prize-claim__submit"
        :disabled="submitting || done || !name"
        @click="submit"
      >
        {{ submitting ? $t("Đang gửi...") : done ? $t("Đã nhận quà") : $t("Nhận quà") }}
      </button>

      <small v-if="isPreview" class="prize-claim__preview-note">
        {{ $t("Chế độ xem trước — không lưu.") }}
      </small>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import { claimGamePrize } from "@/model/api";
import { t } from "@/lang";
const props = defineProps({
  /* Title quà khách vừa trúng. */
  prizeTitle: { type: String, required: true },

  /* Loại game đang chơi (lưu kèm để chủ thiệp biết). */
  gameType: { type: String, default: "lucky-wheel" },

  /* Slug thiệp — có trong wedding.slug từ API và mock. */
  slug: { type: String, default: "" },
});

const name = ref("");

const submitting = ref(false);

const done = ref(false);

const message = ref("");

const isError = ref(false);

/*
 * Preview iframe (/preview-bare) — không có route param,
 * phát hiện qua pathname. Chủ thiệp thử game trong editor
 * không nên ghi rác vào danh sách người trúng.
 */
const isPreview = computed(() => {
  try {
    return window.location.pathname.includes("preview-bare");
  } catch {
    return false;
  }
});

async function submit() {
  if (!name.value || submitting.value || done.value) {
    return;
  }

  if (isPreview.value) {
    done.value = true;
    message.value = t("Xem trước — quà sẽ được lưu khi khách thật nhận.");
    isError.value = false;

    return;
  }

  submitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await claimGamePrize({
      slug: props.slug,
      guestName: name.value,
      gameType: props.gameType,
      prizeTitle: props.prizeTitle,
    });

    const result = response?.data;

    if (result && result.status === "success") {
      done.value = true;
      message.value = result.message || t("Nhận quà thành công!");

      /*
       * Soft-guard: lần sau mở lại thiệp không hiện form
       * (DB vẫn là nguồn thật — đây chỉ để UI mượt).
       */
      try {
        localStorage.setItem(`thiepnhaminh:prize-claimed:${props.slug}`, name.value);
      } catch {
        /* localStorage bị chặn — bỏ qua */
      }
    } else {
      message.value = result?.message || t("Không nhận được quà. Thử lại nhé!");
      isError.value = true;
    }
  } catch (error) {
    console.warn("[PrizeClaim] claimGamePrize error:", error);

    message.value = t("Không nhận được quà. Thử lại nhé!");
    isError.value = true;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.prize-claim {
  display: flex;
  justify-content: center;
}

.prize-claim__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  width: min(100%, 360px);

  padding: 26px 20px;

  border: 1px dashed var(--card-line, var(--accent, #c79d5c));
  border-radius: 16px;

  background: var(--card-bg, var(--white, #fffaf4));

  text-align: center;
}

.prize-claim__orn {
  font-size: 34px;
}

.prize-claim__title {
  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-heading, var(--card-ink, var(--primary, #8a7a68)));

  font-family: var(--font-heading, Georgia, serif);

  font-size: clamp(19px, 5.5vw, 24px);
  font-weight: 600;
}

.prize-claim__hint {
  margin: 0;

  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text-secondary, #806f66));

  font-size: 13px;
}

.prize-claim__input {
  width: 100%;

  padding: 11px 14px;

  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text, #5c4d46));

  border: 1px solid var(--card-line, var(--accent, #c79d5c));
  border-radius: 10px;

  background: #fff;

  font-size: 14px;
  text-align: center;

  outline: none;
}

.prize-claim__input:focus {
  border-color: var(--solid, var(--primary, #8a7a68));
}

.prize-claim__message {
  margin: 0;

  /* xanh đậm: #3d9a50 cũ chỉ ~3.3:1 trên card sáng */
  color: #2e7d3e;

  font-size: 12.5px;
}

.prize-claim__message.error {
  color: #c0392b;
}

.prize-claim__submit {
  padding: 10px 26px;

  /* Nút trong card sáng: khối đậm đã kiểm tra tương phản */
  color: var(--solid-ink, #fff);
  border: 0;
  border-radius: 999px;

  background: var(--solid, var(--primary, #8a7a68));

  font-size: 12.5px;
  font-weight: 700;

  cursor: pointer;

  transition: opacity 0.2s ease;
}

.prize-claim__submit:disabled {
  cursor: default;

  opacity: 0.6;
}

.prize-claim__preview-note {
  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text-secondary, #806f66));

  font-size: 11px;
}
</style>
