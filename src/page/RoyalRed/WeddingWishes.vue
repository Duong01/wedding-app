<template>
  <section class="guestbook-section">
    <div class="guestbook-frame">

      <!-- =====================================================
           HEADER
      ====================================================== -->

      <header class="guestbook-header">

        <div class="header-ornament">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

        <div class="rr-kicker">
          GUEST BOOK
        </div>

        <h2 class="rr-title">
          Sổ Lưu Bút
        </h2>

        <div class="double-happiness">
          囍
        </div>

        <p class="guestbook-intro">
          Mỗi lời chúc là một món quà nhỏ,
          cùng cô dâu chú rể lưu giữ những khoảnh khắc
          đáng nhớ trong ngày trọng đại.
        </p>

      </header>


      <!-- =====================================================
           WRITE WISH
      ====================================================== -->

      <div class="wish-paper">

        <!-- TOP ORNAMENT -->

        <div class="paper-ornament paper-top">
          <span></span>
          <b>✦</b>
          <span></span>
        </div>


        <!-- TITLE -->

        <div class="paper-title">
          GỬI LỜI CHÚC ĐẾN CÔ DÂU CHÚ RỂ
        </div>


        <!-- FORM -->

        <form
          class="wish-form"
          @submit.prevent="submit"
        >

          <!-- NAME -->

          <div class="input-wrap">

            <span class="input-icon">
              ♡
            </span>

            <input
              v-model.trim="form.name"
              type="text"
              placeholder="Tên của bạn"
              maxlength="100"
              autocomplete="name"
            />

          </div>


          <!-- MESSAGE -->

          <div class="textarea-wrap">

            <textarea
              v-model.trim="form.message"
              placeholder="Viết lời chúc của bạn..."
              maxlength="500"
            ></textarea>

            <span class="textarea-decoration">
              囍
            </span>

            <span class="character-count">
              {{ form.message.length }}/500
            </span>

          </div>


          <!-- SUBMIT -->

          <button
            type="submit"
            class="wish-submit"
            :disabled="!form.name || !form.message || submitting"
          >

            <span class="button-shine"></span>

            <span
              v-if="!submitting"
              class="button-icon"
            >
              ✦
            </span>

            <span v-if="!submitting">
              GỬI LỜI CHÚC
            </span>

            <span v-else>
              ĐANG GỬI...
            </span>

          </button>

        </form>


        <!-- BOTTOM ORNAMENT -->

        <div class="paper-ornament paper-bottom">
          <span></span>
          <b>囍</b>
          <span></span>
        </div>

      </div>


      <!-- =====================================================
           WISHES
      ====================================================== -->

      <section
        v-if="wishes && wishes.length"
        class="wishes-section"
      >

        <!-- HEADING -->

        <div class="wishes-heading">

          <span></span>

          <div class="wishes-heading-content">

            <small>
              NHỮNG LỜI CHÚC
            </small>

            <strong>
              Từ những người thân yêu
            </strong>

          </div>

          <span></span>

        </div>


        <!-- WISH LIST -->

        <div class="wishes-list">

          <article
            v-for="(w, i) in wishes"
            :key="w.Id || w.id || i"
            class="wish-item"
          >

            <!-- NUMBER -->

            <div class="wish-number">
              {{ String(i + 1).padStart(2, "0") }}
            </div>


            <!-- CONTENT -->

            <div class="wish-content">

              <!-- AUTHOR -->

              <div class="wish-author">

                <span class="author-symbol">
                  ❖
                </span>

                <strong>
                  {{
                    w.name ||
                    w.Name ||
                    w.guestName ||
                    w.GuestName ||
                    "Một người bạn"
                  }}
                </strong>

              </div>


              <!-- MESSAGE -->

              <p>
                {{
                  w.message ||
                  w.Message ||
                  w.content ||
                  w.Content ||
                  ""
                }}
              </p>


              <!-- SMALL ORNAMENT -->

              <div class="wish-divider">

                <span></span>

                <i>✦</i>

                <span></span>

              </div>

            </div>

          </article>

        </div>

      </section>


      <!-- =====================================================
           EMPTY STATE
      ====================================================== -->

      <section
        v-else
        class="empty-wishes"
      >

        <div class="empty-symbol">
          囍
        </div>

        <div class="empty-title">
          LỜI CHÚC ĐẦU TIÊN
        </div>

        <p>
          Hãy là người đầu tiên gửi những lời chúc
          tốt đẹp nhất đến cô dâu chú rể.
        </p>

      </section>


      <!-- =====================================================
           FOOTER
      ====================================================== -->

      <div class="guestbook-footer">

        <span></span>

        <div>
          ✦
        </div>

        <span></span>

      </div>

    </div>
  </section>
</template>


<script setup>
import { reactive, ref } from "vue";


/* =========================================================
   PROPS
========================================================= */

const props = defineProps({

  wishes: {
    type: Array,
    default: () => [],
  },

  wedding: {
    type: Object,
    default: null,
  },

});


/* =========================================================
   FORM
========================================================= */

const form = reactive({

  name: "",

  message: "",

});


/* =========================================================
   STATE
========================================================= */

const submitting = ref(false);


/* =========================================================
   SUBMIT
========================================================= */

async function submit() {

  if (submitting.value) {
    return;
  }


  const name = form.name.trim();

  const message = form.message.trim();


  /* =========================
     VALIDATE
  ========================== */

  if (!name) {

    alert("Vui lòng nhập tên của bạn.");

    return;

  }


  if (!message) {

    alert("Vui lòng nhập lời chúc.");

    return;

  }


  /* =========================
     START
  ========================== */

  submitting.value = true;


  try {

    /*
     * Nếu sau này bạn có API gửi lời chúc,
     * đặt request tại đây.
     *
     * Ví dụ:
     *
     * await GuestWish({
     *   WeddingId: props.wedding?.Id,
     *   Name: name,
     *   Message: message,
     * });
     */


    await new Promise(resolve =>
      setTimeout(resolve, 500)
    );


    /* =========================
       SUCCESS
    ========================== */

    alert(
      "Cảm ơn bạn! Lời chúc đã được gửi ❤️"
    );


    /* =========================
       RESET
    ========================== */

    form.name = "";

    form.message = "";


  } catch (error) {

    console.error(
      "Guest book error:",
      error
    );

    alert(
      "Đã xảy ra lỗi. Vui lòng thử lại."
    );


  } finally {

    submitting.value = false;

  }

}
</script>


<style scoped>

/* =========================================================
   ROYAL RED
   GUEST BOOK
========================================================= */

.guestbook-section {

  position: relative;

  width: 100%;


  color: #f5e5c0;

  overflow: hidden;

}


.guestbook-frame {

  width:
    min(720px, 100%);

  margin:
    0 auto;

}


/* =========================================================
   HEADER
========================================================= */

.guestbook-header {

  text-align: center;

}


.header-ornament {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  width: 190px;

  margin:
    0 auto
    25px;

}


.header-ornament span {

  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(201,164,92,.65)
    );

}


.header-ornament span:last-child {

  background:
    linear-gradient(
      90deg,
      rgba(201,164,92,.65),
      transparent
    );

}


.header-ornament i {

  color: #c69a4b;

  font-size: 10px;

  font-style: normal;

}


.rr-kicker {

  margin-bottom: 13px;

  color: #c9a45c;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: .4em;

}


.rr-title {

  margin: 0;

  color: #f0d18b;

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size:
    clamp(34px, 7vw, 50px);

  font-weight: 500;

  letter-spacing: .04em;

}


.double-happiness {

  margin-top: 14px;

  color: #b98b45;

  font-family: serif;

  font-size: 22px;

  line-height: 1;

}


.guestbook-intro {

  width:
    min(550px, 100%);

  margin:
    25px auto
    55px;

  color:
    rgba(245,229,192,.67);

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 14px;

  line-height: 1.9;

}


/* =========================================================
   WISH PAPER
========================================================= */

.wish-paper {

  position: relative;

  width:
    min(570px, 100%);

  margin:
    0 auto;

  background:
    linear-gradient(
      145deg,
      rgba(100,10,15,.30),
      rgba(35,0,3,.14)
    );

  box-shadow:
    0 25px 70px
    rgba(0,0,0,.18);

  transition:
    transform .5s ease,
    box-shadow .5s ease;

}


.wish-paper:hover {

  transform:
    translateY(-3px);

  box-shadow:
    0 32px 85px
    rgba(0,0,0,.25);

}


/* =========================================================
   PAPER ORNAMENT
========================================================= */

.paper-ornament {

  display: flex;

  align-items: center;

  gap: 12px;

}


.paper-top {

  margin-bottom: 25px;

}


.paper-bottom {

  margin-top: 28px;

}


.paper-ornament span {

  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(201,164,92,.48)
    );

}


.paper-ornament span:last-child {

  background:
    linear-gradient(
      90deg,
      rgba(201,164,92,.48),
      transparent
    );

}


.paper-ornament b {

  color: #c69a4b;

  font-family: serif;

  font-size: 12px;

  font-weight: 400;

}


/* =========================================================
   PAPER TITLE
========================================================= */

.paper-title {

  margin-bottom: 25px;

  text-align: center;

  color: #d7b56b;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: .27em;

}


/* =========================================================
   FORM
========================================================= */

.wish-form {

  display: flex;

  flex-direction: column;

  gap: 14px;

}


/* =========================================================
   NAME
========================================================= */

.input-wrap {

  position: relative;

  border-bottom:
    1px solid
    rgba(201,164,92,.30);

}


.input-wrap::after {

  content: "";

  position: absolute;

  left: 0;

  bottom: -1px;

  width: 0;

  height: 1px;

  background: #d4ad62;

  transition:
    width .55s
    cubic-bezier(.22,.61,.36,1);

}


.input-wrap:focus-within::after {

  width: 100%;

}


.input-icon {

  position: absolute;

  left: 0;

  top: 3px;

  color: #b98b45;

  font-size: 14px;

}


.input-wrap input {

  width: 100%;

  border: 0;

  outline: 0;

  background: transparent;

  color: #f4dca5;

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 15px;

}


.input-wrap input::placeholder {

  color:
    rgba(245,229,192,.40);

}


/* =========================================================
   TEXTAREA
========================================================= */

.textarea-wrap {

  position: relative;

  padding-top: 4px;

}


.textarea-wrap textarea {

  width: 100%;

  min-height: 140px;

  border: 0;

  outline: 0;

  resize: none;

  background: transparent;

  color: #f4dca5;

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 15px;

  line-height: 1.9;

}


.textarea-wrap textarea::placeholder {

  color:
    rgba(245,229,192,.40);

}


.textarea-wrap::after {

  content: "";

  position: absolute;

  left: 0;

  right: 0;

  bottom: 0;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(201,164,92,.38),
      transparent
    );

}


.textarea-decoration {

  position: absolute;

  right: 5px;

  bottom: 27px;

  color:
    rgba(201,164,92,.22);

  font-family: serif;

  font-size: 32px;

  pointer-events: none;

}


.character-count {

  position: absolute;

  right: 0;

  bottom: 7px;

  color:
    rgba(201,164,92,.35);

  font-size: 8px;

  letter-spacing: .08em;

}


/* =========================================================
   SUBMIT BUTTON
========================================================= */

.wish-submit {

  position: relative;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  align-self: center;

  gap: 9px;

  min-width: 195px;

  margin-top: 9px;



  overflow: hidden;

  border:
    1px solid
    rgba(201,164,92,.7);

  background:
    linear-gradient(
      135deg,
      #b98b45,
      #d8b76c,
      #a97832
    );

  color: #360004;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: .17em;

  cursor: pointer;

  transition:
    transform .35s ease,
    filter .35s ease,
    box-shadow .35s ease;

}


.wish-submit:hover:not(:disabled) {

  transform:
    translateY(-3px);

  filter:
    brightness(1.08);

  box-shadow:
    0 12px 30px
    rgba(201,164,92,.18);

}


.wish-submit:active:not(:disabled) {

  transform:
    translateY(-1px);

}


.wish-submit:disabled {

  opacity: .4;

  cursor: not-allowed;

}


.button-icon {

  font-size: 9px;

}


.button-shine {

  position: absolute;

  top: 0;

  left: -100%;

  width: 45%;

  height: 100%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.38),
      transparent
    );

  transform:
    skewX(-20deg);

  transition:
    left .75s ease;

}


.wish-submit:hover
.button-shine {

  left: 130%;

}


/* =========================================================
   WISHES SECTION
========================================================= */

.wishes-section {

  margin-top: 20px;

}


/* =========================================================
   WISHES HEADING
========================================================= */

.wishes-heading {

  display: grid;

  grid-template-columns:
    1fr
    auto
    1fr;

  align-items: center;

  gap: 20px;

  margin-bottom: 28px;

  text-align: center;

}


.wishes-heading > span {

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(201,164,92,.35)
    );

}


.wishes-heading > span:last-child {

  background:
    linear-gradient(
      90deg,
      rgba(201,164,92,.35),
      transparent
    );

}


.wishes-heading-content {

  display: flex;

  flex-direction: column;

  align-items: center;

}


.wishes-heading small {

  margin-bottom: 7px;

  color: #b98b45;

  font-size: 8px;

  letter-spacing: .3em;

}


.wishes-heading strong {

  color: #efd18b;

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 18px;

  font-weight: 400;

}


/* =========================================================
   WISH LIST
========================================================= */

.wishes-list {

  display: flex;

  flex-direction: column;

}


.wish-item {

  display: grid;

  grid-template-columns:
    52px
    1fr;

  gap: 18px;

  padding:
    25px
    0;

  transition:
    transform .35s ease;

}


.wish-item:hover {

  transform:
    translateX(5px);

}


/* =========================================================
   NUMBER
========================================================= */

.wish-number {

  padding-top: 2px;

  color:
    rgba(201,164,92,.38);

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 12px;

  letter-spacing: .1em;

  text-align: center;

}


/* =========================================================
   AUTHOR
========================================================= */

.wish-author {

  display: flex;

  align-items: center;

  gap: 9px;

  margin-bottom: 8px;

}


.author-symbol {

  color: #b98b45;

  font-size: 9px;

}


.wish-author strong {

  color: #efd18b;

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 16px;

  font-weight: 500;

}


/* =========================================================
   MESSAGE
========================================================= */

.wish-content p {

  margin: 0;

  color:
    rgba(245,229,192,.68);

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 14px;

  line-height: 1.9;

}


/* =========================================================
   WISH DIVIDER
========================================================= */

.wish-divider {

  display: flex;

  align-items: center;

  gap: 8px;

  width: 110px;

  margin-top: 15px;

  opacity: .55;

}


.wish-divider span {

  flex: 1;

  height: 1px;

  background:
    rgba(201,164,92,.28);

}


.wish-divider i {

  color: #b98b45;

  font-size: 7px;

  font-style: normal;

}


/* =========================================================
   EMPTY
========================================================= */

.empty-wishes {

  margin-top: 65px;

  text-align: center;

}


.empty-symbol {

  color:
    rgba(201,164,92,.35);

  font-family: serif;

  font-size: 35px;

  margin-bottom: 14px;

}


.empty-title {

  margin-bottom: 9px;

  color: #c9a45c;

  font-size: 8px;

  font-weight: 600;

  letter-spacing: .3em;

}


.empty-wishes p {

  width:
    min(420px, 100%);

  margin:
    0 auto;

  color:
    rgba(245,229,192,.48);

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: 14px;

  line-height: 1.8;

}


/* =========================================================
   FOOTER
========================================================= */

.guestbook-footer {

  display: flex;

  align-items: center;

  gap: 15px;

  width:
    min(300px, 70%);

  margin:
    70px auto 0;

}


.guestbook-footer span {

  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(201,164,92,.3)
    );

}


.guestbook-footer span:last-child {

  background:
    linear-gradient(
      90deg,
      rgba(201,164,92,.3),
      transparent
    );

}


.guestbook-footer div {

  color: #b98b45;

  font-size: 9px;

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 700px) {


  .wish-paper {

    width: 100%;

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {


  .rr-kicker {

    font-size: 8px;

    letter-spacing: .34em;

  }


  .rr-title {

    font-size:
      clamp(
        32px,
        10vw,
        42px
      );

  }


  .guestbook-intro {

    margin:
      22px auto
      38px;

    font-size: 13px;

    line-height: 1.8;

  }


  .wish-paper {

    padding:
      28px
      20px
      27px;

  }


  .paper-title {

    font-size: 8px;

    letter-spacing: .2em;

  }


  .input-wrap input,
  .textarea-wrap textarea {

    font-size: 14px;

  }


  .wish-submit {

    width: 100%;

  }


  .wishes-section {

    margin-top: 20px;

  }


  .wishes-heading {

    gap: 12px;

  }


  .wishes-heading strong {

    font-size: 16px;

    white-space: nowrap;

  }


  .wish-item {

    grid-template-columns:
      35px
      1fr;

    gap: 10px;

    padding:
      21px
      0;

  }


  .wish-content p {

    font-size: 13px;

    line-height: 1.85;

  }


  .wish-author strong {

    font-size: 15px;

  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

  .guestbook-section {

    padding-left: 12px;

    padding-right: 12px;

  }


  .wish-paper {

    padding-left: 17px;

    padding-right: 17px;

  }


  .wishes-heading {

    grid-template-columns:
      25px
      auto
      25px;

  }


  .wishes-heading strong {

    font-size: 15px;

  }


  .wish-number {

    font-size: 10px;

  }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .wish-paper,
  .wish-item,
  .wish-submit {

    transition: none;

  }


  .button-shine {

    display: none;

  }

}

</style>
