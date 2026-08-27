<template>
  <section class="eg-wishes">

    <div class="wishes-inner">

      <!-- HEADER -->

      <header class="wishes-header">

        <div class="section-label">
          GUEST BOOK
        </div>

        <div class="script-title">
          Lời chúc yêu thương
        </div>

        <h2>
          Cảm ơn bạn
          <br />
          <em>đã đến chung vui</em>
        </h2>

        <div class="gold-symbol">
          ◆
        </div>

      </header>

      <!-- FORM -->

      <form
        class="wish-form"
        @submit.prevent="submitWish"
      >

        <div class="field">

          <label>
            TÊN CỦA BẠN
          </label>

          <input
            v-model="form.name"
            type="text"
            placeholder="Nhập tên của bạn"
            maxlength="80"
          />

        </div>

        <div class="field">

          <label>
            LỜI CHÚC
          </label>

          <textarea
            v-model="form.Message"
            placeholder="Gửi đôi lời yêu thương..."
            maxlength="500"
            rows="4"
          ></textarea>

        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="!canSubmit"
        >
          <span>
            {{ submitted
              ? "Đã gửi lời chúc"
              : "Gửi lời chúc"
            }}
          </span>

          <i>✦</i>
        </button>

      </form>

      <!-- WISHES -->

      <div
        v-if="wishes.length"
        class="wish-list"
      >

        <article
          v-for="(wish, index) in wishes"
          :key="wish.Id || index"
          class="wish-card"
        >

          <div class="wish-mark">
            “
          </div>

          <p>
            {{ wish.Message || wish.content }}
          </p>

          <div class="wish-author">
            <span></span>

            {{
              wish.name ||
              wish.guestName ||
              "Một người bạn"
            }}

            <span></span>
          </div>

        </article>

      </div>

      <div
        v-else
        class="empty-wishes"
      >
        <span>♡</span>

        <p>
          Hãy là người đầu tiên gửi
          lời chúc đến chúng mình.
        </p>
      </div>

    </div>

  </section>
</template>

<script setup>
import {
  computed,
  reactive,
  ref,
} from "vue";

defineProps({
  wishes: {
    type: Array,
    default: () => [],
  },

  wedding: {
    type: Object,
    default: () => ({}),
  },
});

const form = reactive({
  name: "",
  message: "",
});

const submitted = ref(false);

const canSubmit = computed(() => {
  return (
    form.name.trim().length > 0 &&
    form.Message.trim().length > 0 &&
    !submitted.value
  );
});

function submitWish() {
  if (!canSubmit.value) {
    return;
  }

  /*
   * Hiện tại chỉ xử lý UI.
   *
   * Khi backend/API sẵn sàng,
   * thay phần này bằng API POST.
   */

  submitted.value = true;

  setTimeout(() => {
    form.name = "";
    form.Message = "";

    submitted.value = false;
  }, 1800);
}
</script>

<style scoped>
.eg-wishes {
  position: relative;

  padding:
    100px 30px;

  background:
    #fffdf8;
}

.eg-wishes::before {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(180,142,40,.1);
}

.wishes-inner {
  position: relative;

  width: min(
    100%,
    700px
  );

  margin: auto;
}

/* HEADER */

.wishes-header {
  text-align: center;

  margin-bottom: 45px;
}

.section-label {
  color: #a98a47;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.script-title {
  margin-top: 18px;

  color: #c39c42;

  font-family:
    "Allura",
    cursive;

  font-size: 35px;
}

.wishes-header h2 {
  margin:
    5px 0 18px;

  color: #30291f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(35px, 6vw, 48px);

  font-weight: 400;

  line-height: .95;
}

.wishes-header h2 em {
  color: #8e7a59;

  font-style: italic;
}

.gold-symbol {
  color: #d4af37;

  font-size: 7px;
}

/* FORM */

.wish-form {
  padding: 30px;

  border:
    1px solid
    rgba(180,142,40,.25);

  background:
    #faf6ec;

  margin-bottom: 35px;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;

  margin-bottom: 8px;

  color: #9b7b3d;

  font-family: Arial, sans-serif;

  font-size: 8px;

  letter-spacing: 2px;
}

.field input,
.field textarea {
  width: 100%;

  box-sizing: border-box;

  border:
    1px solid
    rgba(150,125,75,.22);

  outline: none;

  padding:
    12px 14px;

  background:
    rgba(255,255,255,.6);

  color: #4a4033;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;

  transition:
    border-color .3s ease,
    box-shadow .3s ease;
}

.field textarea {
  resize: vertical;

  min-height: 100px;
}

.field input:focus,
.field textarea:focus {
  border-color:
    rgba(180,142,40,.7);

  box-shadow:
    0 0 0 3px
    rgba(212,175,55,.07);
}

.field input::placeholder,
.field textarea::placeholder {
  color: #b1a594;
}

/* BUTTON */

.submit-button {
  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  padding: 13px;

  border:
    1px solid
    #b89548;

  background:
    #a98a47;

  color: #fffdf5;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;

  cursor: pointer;

  transition:
    all .3s ease;
}

.submit-button i {
  font-size: 8px;

  font-style: normal;
}

.submit-button:hover:not(:disabled) {
  background:
    #8f733a;
}

.submit-button:disabled {
  opacity: .55;

  cursor: default;
}

/* WISH LIST */

.wish-list {
  display: grid;

  gap: 15px;
}

.wish-card {
  position: relative;

  padding:
    28px 30px;

  border:
    1px solid
    rgba(180,142,40,.15);

  background:
    #fff;

  text-align: center;
}

.wish-mark {
  color:
    rgba(180,142,40,.35);

  font-family:
    Georgia,
    serif;

  font-size: 45px;

  line-height: .5;
}

.wish-card p {
  margin:
    15px auto;

  color: #706454;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 17px;

  line-height: 1.6;
}

.wish-author {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #a0803f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 14px;

  font-style: italic;
}

.wish-author span {
  width: 25px;

  height: 1px;

  background:
    rgba(180,142,40,.35);
}

.empty-wishes {
  padding: 30px;

  text-align: center;

  color: #9c8c75;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;
}

.empty-wishes span {
  color: #c39c42;

  font-size: 25px;
}

/* MOBILE */

@media (max-width:600px) {
  .eg-wishes {
    padding:
      75px 20px;
  }

  .eg-wishes::before {
    inset: 10px;
  }

  .wish-form {
    padding: 20px;
  }

  .wish-card {
    padding:
      25px 20px;
  }
}
</style>