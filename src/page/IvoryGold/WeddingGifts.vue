<template>
  <section class="gifts">

    <!-- =========================================
         HEADER
    ========================================== -->

    <div class="gift-heading">

      <span class="gift-kicker">
        {{ sectionText(sections, "gifts", "Eyebrow", "MỘT CHÚT TẤM LÒNG") }}
      </span>

      <h2>
        {{ sectionText(sections, "gifts", "Heading", "MỪNG CƯỚI") }}
      </h2>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'gifts', 'Intro')" class="ig-sub-custom-head">
        <p v-if="sectionOverride(sections, 'gifts', 'Intro')" class="ig-sub-custom-head__intro">{{ sectionOverride(sections, "gifts", "Intro") }}</p>
      </header>


      <div class="gift-decoration">
        <span></span>
        <b>囍</b>
        <span></span>
      </div>

      <p>
        Sự hiện diện và lời chúc phúc của bạn
        đã là món quà quý giá nhất dành cho
        chúng mình.
      </p>

    </div>


    <!-- =========================================
         LÌ XÌ
    ========================================== -->

    <div
  v-if="normalizedGifts.length"
  class="gift-list"
>

  <button
    v-for="(gift, index) in normalizedGifts"
    :key="gift.Id || index"
    type="button"
    class="lixi"
    :class="{
      'lixi-left': index === 0,
      'lixi-right': index === 1,
    }"
    @click="openGift(index)"
  >

    <div class="lixi-image-wrap">

      <img
        :src="lixi"
        :alt="gift.Title"
        class="lixi-image"
      />

      <!-- ánh sáng -->

      <span class="lixi-shine"></span>

      <!-- nút mở -->

      <span class="lixi-open">
        +
      </span>

    </div>


  </button>

</div>


    <!-- =========================================
         EMPTY
    ========================================== -->

    <div
      v-else
      class="gift-empty"
    >
      Chưa có thông tin mừng cưới
    </div>


    <!-- =========================================
         QR DIALOG
    ========================================== -->

    <Teleport to="body">

      <Transition name="gift-dialog">

        <div
          v-if="dialog"
          class="gift-modal"
          @click.self="closeGift"
        >

          <div class="gift-modal-card">

            <!-- close -->

            <button
              type="button"
              class="modal-close"
              aria-label="Đóng"
              @click="closeGift"
            >
              ×
            </button>


            <!-- decoration -->

            <div class="modal-symbol">
              囍
            </div>


            <span class="modal-kicker">
              MỪNG CƯỚI
            </span>


            <h3>
              {{ selectedGift?.Title }}
            </h3>


            <div class="modal-line">
              <span></span>
              <b>♥</b>
              <span></span>
            </div>


            <!-- BANK -->

            <div class="bank-info">

              <div
                v-if="selectedGift?.bankName"
                class="bank-name"
              >
                {{ selectedGift.bankName }}
              </div>


              <div
                v-if="selectedGift?.accountName"
                class="account-name"
              >
                {{ selectedGift.accountName }}
              </div>


              <div
                v-if="selectedGift?.accountNumber"
                class="account-number"
              >
                {{ selectedGift.accountNumber }}
              </div>

              <button
                v-if="selectedGift?.accountNumber"
                type="button"
                class="copy-button"
                aria-label="Sao chép số tài khoản"
                @click="copyAccount(selectedGift)"
              >
                <v-icon size="14">mdi-content-copy</v-icon>

                <span>SAO CHÉP</span>
              </button>

            </div>


            <!-- QR -->

            <div
              v-if="selectedGift?.qr"
              class="qr-wrapper"
            >

              <div class="qr-frame">

                <span class="qr-corner qr-tl"></span>
                <span class="qr-corner qr-tr"></span>
                <span class="qr-corner qr-bl"></span>
                <span class="qr-corner qr-br"></span>

                <img
                  :src="selectedGift.qr"
                  alt="QR mừng cưới"
                />

              </div>

            </div>


            <p class="modal-note">
              Quét mã QR để gửi lời chúc mừng
            </p>


            <div
              v-if="copyState"
              class="copy-toast"
            >
              {{ copyState }}
            </div>


            <button
              type="button"
              class="modal-button"
              @click="closeGift"
            >
              ĐÓNG
            </button>

          </div>

        </div>

      </Transition>

    </Teleport>

  </section>
</template>


<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, ref } from "vue";
import  lixi  from "@/assets/nhat-binh-do-red/nhat_binh_red.webp";


const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  gifts: {
    type: Array,
    default: () => [],
  },
});


/* =========================================
   NORMALIZE
========================================= */

const normalizedGifts = computed(() => {

  return (props.gifts || [])
    .map((gift, index) => {

      const item = gift || {};

      return {
        ...item,

        id:
          item.Id ||
          index,

        title:
          item.Title ||
          item.Name ||
          (
            index === 0
              ? "MỪNG CƯỚI NHÀ TRAI"
              : "MỪNG CƯỚI NHÀ GÁI"
          ),

        bankName:
          item.BankName ||
          item.bank_name ||
          "",

        accountName:
          item.AccountName ||
          item.account_name ||
          "",

        accountNumber:
          item.AccountNumber ||
          item.account_number ||
          "",

        qr:
          item.qr ||
          item.QrCode ||
          item.qr_url ||
          "",

      };

    })
    .slice(0, 2);

});


/* =========================================
   DIALOG
========================================= */

const dialog = ref(false);

const currentIndex = ref(0);


const selectedGift = computed(() => {

  return (
    normalizedGifts.value[
      currentIndex.value
    ] || null
  );

});


function openGift(index) {

  currentIndex.value = index;

  dialog.value = true;

  document.body.classList.add(
    "gift-modal-open"
  );
}


function closeGift() {

  dialog.value = false;

  document.body.classList.remove(
    "gift-modal-open"
  );
}


/* =========================================
   COPY ACCOUNT
========================================= */

const copyState = ref("");

let copyTimer = null;


async function copyAccount(gift) {

  const number = gift?.accountNumber;

  if (!number) return;

  try {

    await navigator.clipboard.writeText(String(number));

    copyState.value = "Đã sao chép số tài khoản ✓";

  } catch (error) {

    console.warn("Không thể sao chép số tài khoản", error);

    copyState.value = "Không thể sao chép, vui lòng chép thủ công";

  }

  window.clearTimeout(copyTimer);

  copyTimer = window.setTimeout(() => {
    copyState.value = "";
  }, 2200);

}
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.gifts {
  position: relative;

  width: 100%;

  padding:
    10px
    4px
    25px;

  color: var(--tc-641417, #641417);

  text-align: center;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;
}


/* =====================================================
   HEADER
===================================================== */

.gift-heading {
  max-width: 340px;

  margin:
    0
    auto
    28px;
}


.gift-kicker {
  display: block;

  margin-bottom: 5px;

  color: var(--tc-8b6834, #8b6834);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 3px;
}


.gift-heading h2 {
  margin: 0;

  color: var(--tc-821419, #821419);

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 23px;
  font-weight: 900;

  letter-spacing: 1.5px;
}


.gift-decoration {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin:
    9px
    auto
    13px;
}


.gift-decoration span {
  width: 40px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      var(--tc-b58a45, #b58a45)
    );
}


.gift-decoration span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      var(--tc-b58a45, #b58a45)
    );
}


.gift-decoration b {
  color: var(--tc-9b161a, #9b161a);

  font-family:
    "Times New Roman",
    serif;

  font-size: 16px;
}


.gift-heading p {
  margin: 0 auto;

  max-width: 300px;

  color: var(--tc-75604e, #75604e);

  font-size: 11px;
  font-weight: 500;

  line-height: 1.8;
}


/* =====================================================
   LIXI LIST
===================================================== */

.gift-list {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  height: 245px;

  margin:
    5px
    auto
    15px;
}


/* =====================================================
   LIXI BUTTON
===================================================== */

.lixi {
  position: absolute;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 145px;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  transition:
    transform .35s cubic-bezier(.2,.8,.2,1);
}

.lixi-left {

  left: calc(50% - 130px);

  z-index: 1;

  transform:
    rotate(-12deg)
    translateY(8px);
}


/* =====================================================
   LÌ XÌ BÊN PHẢI
===================================================== */

.lixi-right {

  right: calc(50% - 130px);

  z-index: 2;

  transform:
    rotate(12deg)
    translateY(-5px);
}


/* =====================================================
   HOVER
===================================================== */

.lixi-left:hover {

  z-index: 5;

  transform:
    rotate(-7deg)
    translateY(-5px)
    scale(1.04);
}


.lixi-right:hover {

  z-index: 5;

  transform:
    rotate(7deg)
    translateY(-10px)
    scale(1.04);
}


/* =====================================================
   IMAGE WRAPPER
===================================================== */

.lixi-image-wrap {
  position: relative;

  width: 100%;

  filter:
    drop-shadow(
      0 12px 15px
      rgba(var(--tc-580e12-rgb, 88, 14, 18), .22)
    );

  animation:
    lixi-float
    4s
    ease-in-out
    infinite;
}


.lixi-right
.lixi-image-wrap {
  animation-delay:
    -1.5s;
}


.lixi-image {
  display: block;

  width: 100%;
  height: auto;

  object-fit: contain;
}


/* =====================================================
   ÁNH SÁNG CHẠY TRÊN LÌ XÌ
===================================================== */

.lixi-shine {
  position: absolute;

  top: 0;
  left: -90%;

  width: 38%;
  height: 100%;

  pointer-events: none;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.5),
      transparent
    );

  transform:
    skewX(-18deg);

  animation:
    lixi-shine
    5s
    ease-in-out
    infinite;
}


/* =====================================================
   NÚT +
===================================================== */

.lixi-open {
  position: absolute;

  right: 8px;
  bottom: 18px;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 25px;
  height: 25px;

  color: var(--tc-8b1116, #8b1116);

  background:
    rgba(var(--tc-fff9e8-rgb, 255, 249, 232), .96);

  border:
    1px solid
    rgba(var(--tc-996e2c-rgb, 153, 110, 44), .6);

  border-radius: 50%;

  box-shadow:
    0 3px 10px
    rgba(var(--tc-460f0f-rgb, 70, 15, 15), .2);

  font-size: 18px;
  font-weight: 400;

  line-height: 1;
}


/* =====================================================
   LABEL
===================================================== */

.lixi-label {
  margin-top: 4px;

  color: var(--tc-7d1519, #7d1519);

  font-size: 11px;
  font-weight: 900;

  letter-spacing: .6px;

  line-height: 1.4;
}


/* =====================================================
   HINT
===================================================== */

.lixi-hint {
  display: block;

  margin-top: 3px;

  color: var(--tc-896836, #896836);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1.7px;
}


/* =====================================================
   FLOAT
===================================================== */

@keyframes lixi-float {

  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-5px);
  }

}


/* =====================================================
   SHINE
===================================================== */

@keyframes lixi-shine {

  0% {
    left: -90%;
  }

  35%,
  100% {
    left: 130%;
  }

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {

  .gift-list {
    height: 220px;
  }


  .lixi {
    width: 132px;
  }


  .lixi-left {
    left: calc(50% - 118px);
  }


  .lixi-right {
    right: calc(50% - 118px);
  }


  .lixi-label {
    font-size: 10px;
  }


  .lixi-hint {
    font-size: 9px;
  }

}

/* =====================================================
   LIXI IMAGE
===================================================== */

.lixi-image-wrap {
  position: relative;

  width: 100%;

  filter:
    drop-shadow(
      0 10px 14px
      rgba(var(--tc-681414-rgb, 104, 20, 20), .18)
    );

  animation:
    lixi-float
    4s
    ease-in-out
    infinite;
}


.lixi:nth-child(2)
.lixi-image-wrap {
  animation-delay:
    -1.5s;
}


.lixi-image {
  display: block;

  width: 100%;
  height: auto;

  object-fit: contain;
}


/* =====================================================
   SHINE
===================================================== */

.lixi-shine {
  position: absolute;

  top: 0;
  left: -80%;

  width: 35%;
  height: 100%;

  pointer-events: none;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.42),
      transparent
    );

  transform:
    skewX(-18deg);

  animation:
    lixi-shine
    5s
    ease-in-out
    infinite;
}


/* =====================================================
   OPEN ICON
===================================================== */

.lixi-open {
  position: absolute;

  right: 9px;
  bottom: 17px;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 25px;
  height: 25px;

  color: var(--tc-8c1116, #8c1116);

  background:
    rgba(var(--tc-fff8e4-rgb, 255, 248, 228), .94);

  border:
    1px solid
    rgba(var(--tc-9a6f30-rgb, 154, 111, 48), .55);

  border-radius: 50%;

  box-shadow:
    0 3px 9px
    rgba(var(--tc-5a1414-rgb, 90, 20, 20), .16);

  font-family:
    Arial,
    sans-serif;

  font-size: 18px;
  font-weight: 400;

  line-height: 1;
}


/* =====================================================
   LABEL
===================================================== */

.lixi-label {
  margin-top: 6px;

  color: var(--tc-7c1519, #7c1519);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: .7px;

  line-height: 1.4;
}


.lixi-hint {
  display: block;

  margin-top: 4px;

  color: var(--tc-8a6836, #8a6836);

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.8px;
}


/* =====================================================
   EMPTY
===================================================== */

.gift-empty {
  color: var(--tc-8a7159, #8a7159);

  font-size: 11px;
}


/* =====================================================
   MODAL
===================================================== */

.gift-modal {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 20px;

  background:
    rgba(48, 8, 10, .72);

  backdrop-filter:
    blur(7px);

  -webkit-backdrop-filter:
    blur(7px);
}


.gift-modal-card {
  position: relative;

  width: min(100%, 360px);

  max-height: 90vh;

  overflow-y: auto;

  padding:
    27px
    22px
    23px;

  color: var(--tc-671317, #671317);

  background:
    linear-gradient(
      145deg,
      var(--tc-fffaf0, #fffaf0),
      var(--tc-f8ead0, #f8ead0)
    );

  border:
    1px solid
    rgba(var(--tc-a97b37-rgb, 169, 123, 55), .65);

  box-shadow:
    0 25px 70px
    rgba(0,0,0,.3);
}


/* inner border */

.gift-modal-card::before {
  content: "";

  position: absolute;

  inset: 7px;

  pointer-events: none;

  border:
    1px solid
    rgba(var(--tc-a97b37-rgb, 169, 123, 55), .25);
}


/* =====================================================
   CLOSE
===================================================== */

.modal-close {
  position: absolute;

  z-index: 3;

  top: 11px;
  right: 12px;

  width: 30px;
  height: 30px;

  border: 0;

  color: var(--tc-7e181c, #7e181c);

  background:
    rgba(var(--tc-91682b-rgb, 145, 104, 43), .08);

  border-radius: 50%;

  font-size: 23px;
  font-weight: 400;

  line-height: 1;

  cursor: pointer;
}


/* =====================================================
   MODAL HEADER
===================================================== */

.modal-symbol {
  position: relative;

  color: var(--tc-a1171c, #a1171c);

  font-family:
    "Times New Roman",
    serif;

  font-size: 35px;
  font-weight: 700;

  line-height: 1;
}


.modal-kicker {
  position: relative;

  display: block;

  margin-top: 6px;

  color: var(--tc-906d38, #906d38);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 3px;
}


.gift-modal-card h3 {
  position: relative;

  margin:
    7px
    0
    0;

  color: var(--tc-771317, #771317);

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 19px;
  font-weight: 900;

  letter-spacing: .7px;
}


.modal-line {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin:
    10px
    auto
    17px;
}


.modal-line span {
  width: 35px;
  height: 1px;

  background: var(--tc-b88b47, #b88b47);
}


.modal-line b {
  color: var(--tc-a1171c, #a1171c);

  font-size: 11px;
}


/* =====================================================
   BANK INFO
===================================================== */

.bank-info {
  position: relative;

  margin-bottom: 16px;
}


.bank-name {
  color: var(--tc-8b661f, #8b661f);

  font-size: 11px;
  font-weight: 900;

  letter-spacing: 1px;
}


.account-name {
  margin-top: 5px;

  color: var(--tc-765c48, #765c48);

  font-size: 11px;
  font-weight: 600;
}


.account-number {
  margin-top: 7px;

  color: var(--tc-821419, #821419);

  font-family:
    Arial,
    sans-serif;

  font-size: 19px;
  font-weight: 900;

  letter-spacing: 1.5px;
}


/* =====================================================
   QR
===================================================== */

.qr-wrapper {
  position: relative;

  display: flex;

  justify-content: center;
}


.qr-frame {
  position: relative;

  width: 178px;
  height: 178px;

  padding: 9px;

  background: #fff;

  border:
    1px solid
    var(--tc-b48a47, #b48a47);

  box-shadow:
    0 8px 20px
    rgba(var(--tc-5b1818-rgb, 91, 24, 24), .12);
}


.qr-frame img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* =====================================================
   QR CORNERS
===================================================== */

.qr-corner {
  position: absolute;

  width: 14px;
  height: 14px;

  z-index: 2;

  border-color: var(--tc-a7191e, #a7191e);
  border-style: solid;
}


.qr-tl {
  top: -4px;
  left: -4px;

  border-width:
    2px
    0
    0
    2px;
}


.qr-tr {
  top: -4px;
  right: -4px;

  border-width:
    2px
    2px
    0
    0;
}


.qr-bl {
  bottom: -4px;
  left: -4px;

  border-width:
    0
    0
    2px
    2px;
}


.qr-br {
  right: -4px;
  bottom: -4px;

  border-width:
    0
    2px
    2px
    0;
}


/* =====================================================
   NOTE
===================================================== */

.modal-note {
  position: relative;

  margin:
    14px
    0
    17px;

  color: var(--tc-866c53, #866c53);

  font-size: 10px;

  line-height: 1.5;
}


/* =====================================================
   COPY BUTTON
===================================================== */

.copy-button {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  margin-top: 12px;

  padding: 8px 16px;

  color: var(--tc-fff9ed, #fff9ed);

  background:
    linear-gradient(
      135deg,
      var(--tc-a37a3d, #a37a3d),
      var(--tc-8b661f, #8b661f)
    );

  border:
    1px solid
    var(--tc-b88b47, #b88b47);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1.6px;

  cursor: pointer;

  transition: filter .2s ease;
}


.copy-button:hover {
  filter: brightness(1.08);
}


.copy-toast {
  margin-bottom: 14px;

  color: var(--tc-7d5a1e, #7d5a1e);

  font-size: 11px;
  font-weight: 700;
}


/* =====================================================
   BUTTON
===================================================== */

.modal-button {
  position: relative;

  min-width: 110px;
  min-height: 36px;

  padding:
    8px
    20px;

  color: var(--tc-fff9ed, #fff9ed);

  background:
    linear-gradient(
      135deg,
      var(--tc-98171c, #98171c),
      var(--tc-771115, #771115)
    );

  border:
    1px solid
    var(--tc-a42b2e, #a42b2e);

  font-size: 11px;
  font-weight: 900;

  letter-spacing: 1.8px;

  cursor: pointer;
}


/* =====================================================
   ANIMATION
===================================================== */

@keyframes lixi-float {

  0%,
  100% {
    transform:
      translateY(0)
      rotate(0deg);
  }

  50% {
    transform:
      translateY(-5px)
      rotate(-1deg);
  }

}


@keyframes lixi-shine {

  0% {
    left: -80%;
  }

  35%,
  100% {
    left: 130%;
  }

}


/* =====================================================
   MODAL TRANSITION
===================================================== */

.gift-dialog-enter-active,
.gift-dialog-leave-active {
  transition:
    opacity .3s ease;
}


.gift-dialog-enter-active
.gift-modal-card,
.gift-dialog-leave-active
.gift-modal-card {
  transition:
    transform .35s ease,
    opacity .3s ease;
}


.gift-dialog-enter-from,
.gift-dialog-leave-to {
  opacity: 0;
}


.gift-dialog-enter-from
.gift-modal-card,
.gift-dialog-leave-to
.gift-modal-card {
  opacity: 0;

  transform:
    translateY(30px)
    scale(.94);
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {

  .gift-list {
    gap: 12px;
  }


  .lixi {
    width: 44%;
  }


  .lixi-label {
    font-size: 11px;
  }


  .lixi-hint {
    font-size: 10px;
  }


  .qr-frame {
    width: 165px;
    height: 165px;
  }

}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ig-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ig-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ig-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ig-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
