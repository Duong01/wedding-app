<template>
  <section class="rr-gift">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="rr-title">
      {{ heading }}
    </h2>

    <p v-if="intro" class="rr-lead">
      {{ intro }}
    </p>


    <!-- =====================================================
         HỘP QUÀ
    ====================================================== -->

    <button
      type="button"
      class="rr-gift__box"
      aria-label="Mở hộp mừng cưới"
      @click="openGift"
    >

      <span class="rr-gift__sparkle rr-gift__sparkle--1" aria-hidden="true">
        ✦
      </span>

      <span class="rr-gift__sparkle rr-gift__sparkle--2" aria-hidden="true">
        ✦
      </span>

      <span class="rr-gift__sparkle rr-gift__sparkle--3" aria-hidden="true">
        ✦
      </span>

      <span class="rr-gift__sparkle rr-gift__sparkle--4" aria-hidden="true">
        ✦
      </span>

      <span class="rr-gift__lid" aria-hidden="true"></span>

      <span class="rr-gift__body" aria-hidden="true">
        <span class="rr-gift__ribbon"></span>

        <span class="rr-gift__seal">囍</span>
      </span>

      <span class="rr-gift__hint">
        {{ hintLabel }}
      </span>

    </button>


    <!-- =====================================================
         MODAL MỪNG CƯỚI
    ====================================================== -->

    <Teleport to="body">
      <div
        v-if="isOpened"
        class="rr-gift__overlay"
        @click.self="closeGift"
      >
        <div class="rr-gift__modal">

          <div class="rr-gift__modal-head">
            <button
              type="button"
              class="rr-gift__modal-close"
              aria-label="Đóng"
              @click="closeGift"
            >
              ×
            </button>

            <h3>{{ heading }}</h3>
          </div>

          <div class="rr-gift__modal-body">

            <div
              v-for="(gift, index) in normalizedGifts"
              :key="gift.id || index"
              class="rr-gift__card"
            >

              <h4 class="rr-gift__card-title">
                {{ gift.title }}
              </h4>

              <div class="rr-gift__qr">
                <img
                  v-if="gift.qr"
                  :src="gift.qr"
                  :alt="`QR ${gift.title}`"
                />

                <span v-else>♥</span>
              </div>

              <div class="rr-gift__info">
                <p v-if="gift.bank">{{ gift.bank }}</p>

                <p v-if="gift.number" class="rr-gift__number">
                  {{ gift.number }}
                </p>

                <p v-if="gift.owner" class="rr-gift__owner">
                  {{ gift.owner }}
                </p>
              </div>

              <button
                v-if="gift.number"
                type="button"
                class="rr-gift__copy"
                @click="copy(gift.number)"
              >
                {{ copyLabel }}
              </button>

            </div>

          </div>

        </div>
      </div>
    </Teleport>

  </section>
</template>


<script setup>
import { computed, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },

  wedding: {
    type: Object,
    default: () => ({}),
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "gifts", "Heading", "Hộp quà mừng")
);

const intro = computed(() =>
  sectionText(props.sections, "gifts", "Intro")
);

const hintLabel = "Nhấn để mở";

const copyLabel = "Sao chép";


/* =====================================================
   STATE
===================================================== */

const isOpened = ref(false);

function openGift() {
  isOpened.value = true;
}

function closeGift() {
  isOpened.value = false;
}


/* =====================================================
   DỮ LIỆU
===================================================== */

const normalizedGifts = computed(() =>
  (props.gifts || []).slice(0, 2).map((item, index) => {
    const data = item || {};

    return {
      id: data.Id || index,

      title:
        data.Title ||
        data.Name ||
        (index === 0
          ? props.wedding?.BrideName || props.wedding?.brideName
          : props.wedding?.GroomName || props.wedding?.groomName) ||
        "Hộp mừng cưới",

      qr: data.QrCode || data.Qr || data.Image || "",

      bank: data.BankName || data.Bank || "",

      number: data.AccountNumber || data.Number || "",

      owner: data.AccountName || data.Owner || "",
    };
  })
);


/* =====================================================
   SAO CHÉP
===================================================== */

async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);

    alert("Đã sao chép số tài khoản");
  } catch (error) {
    console.error(error);
  }
}
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.rr-gift {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;

  width: 100%;

  padding: 0 24px;

  color: var(--rr-red);

  text-align: center;
}


/* =====================================================
   HỘP QUÀ
===================================================== */

.rr-gift__box {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 260px;
  height: 280px;

  padding: 0 0 26px;

  border: none;
  background: transparent;

  cursor: pointer;
}

.rr-gift__sparkle {
  position: absolute;

  color: var(--rr-gold, #d0a85c);

  line-height: 1;

  pointer-events: none;

  animation: rr-gift-twinkle 2.4s ease-in-out infinite;
}

.rr-gift__sparkle--1 {
  top: 8%;
  left: 14%;

  font-size: 22px;
}

.rr-gift__sparkle--2 {
  top: 18%;
  right: 10%;

  font-size: 16px;

  animation-delay: 0.6s;
}

.rr-gift__sparkle--3 {
  top: 32%;
  left: 5%;

  font-size: 14px;

  animation-delay: 1.2s;
}

.rr-gift__sparkle--4 {
  top: 26%;
  right: 5%;

  font-size: 14px;

  animation-delay: 1.8s;
}

@keyframes rr-gift-twinkle {
  0%,
  100% {
    opacity: 0.25;

    transform: scale(0.85);
  }

  50% {
    opacity: 1;

    transform: scale(1.1);
  }
}

.rr-gift__lid {
  position: absolute;

  left: 50%;
  bottom: 150px;

  width: 200px;
  height: 46px;

  transform: translateX(-50%);

  border-radius: 6px;

  background-color: var(--rr-red);

  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);

  transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.rr-gift__body {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 180px;
  height: 150px;

  border-radius: 6px;

  background-color: color-mix(in srgb, var(--rr-red) 88%, #000000);

  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
}

.rr-gift__ribbon {
  position: absolute;

  top: 0;
  bottom: 0;
  left: 50%;

  width: 26px;

  transform: translateX(-50%);

  background-color: var(--rr-gold, #d0a85c);

  opacity: 0.9;
}

.rr-gift__seal {
  position: relative;

  z-index: 1;

  display: grid;
  place-items: center;

  width: 46px;
  height: 46px;

  border-radius: 50%;

  background-color: var(--rr-cream);

  color: var(--rr-red);

  font-family: serif;
  font-size: 22px;
}

.rr-gift__box:hover .rr-gift__lid {
  transform: translateX(-50%) translateY(-10px) rotate(-3deg);
}

.rr-gift__hint {
  position: absolute;

  bottom: 0;
  left: 50%;

  transform: translateX(-50%);

  color: var(--rr-red);

  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;
}


/* =====================================================
   MODAL
===================================================== */

.rr-gift__overlay {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  padding: 16px;

  background-color: rgba(0, 0, 0, 0.5);
}

.rr-gift__modal {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;

  overflow-y: auto;

  border-radius: 12px;

  background-color: var(--rr-cream, #f4eee2);

  color: var(--rr-red, #5c080c);
}

.rr-gift__modal-head {
  position: relative;

  padding: 24px;

  background-color: var(--rr-red, #5c080c);

  text-align: center;
}

.rr-gift__modal-head h3 {
  margin: 0;

  color: #ffffff;

  font-family: var(--rr-font-heading, "Times New Roman", serif);
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  text-transform: uppercase;
}

.rr-gift__modal-close {
  position: absolute;

  top: 12px;
  right: 12px;

  display: grid;
  place-items: center;

  width: 30px;
  height: 30px;

  border: none;
  border-radius: 50%;

  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;

  font-size: 20px;
  line-height: 1;

  cursor: pointer;
}

.rr-gift__modal-body {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;

  gap: 24px;

  padding: 20px;
}

.rr-gift__card {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  flex: 1 1 180px;

  max-width: 220px;
}

.rr-gift__card-title {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  min-height: 2rem;

  margin: 0;

  font-size: 12px;
  font-weight: 500;

  line-height: 1.4;

  text-align: center;
}

.rr-gift__qr {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 128px;
  height: 128px;

  padding: 8px;

  border: 2px solid var(--rr-hairline-soft, rgba(92, 8, 12, 0.13));
  border-radius: 12px;

  background-color: #ffffff;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.rr-gift__qr img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.rr-gift__qr span {
  color: var(--rr-red, #5c080c);

  font-size: 34px;
}

.rr-gift__info {
  display: flex;
  flex-direction: column;

  gap: 2px;

  text-align: center;
}

.rr-gift__info p {
  margin: 0;

  font-size: 10px;

  line-height: 1.5;
}

.rr-gift__number {
  font-family: "Courier New", monospace;
}

.rr-gift__owner {
  font-weight: 600;
}

.rr-gift__copy {
  margin-top: 4px;
  padding: 4px 10px;

  border: none;
  border-radius: 999px;

  background-color: var(--rr-hairline-soft, rgba(92, 8, 12, 0.13));
  color: var(--rr-red, #5c080c);

  font-size: 10px;
  font-weight: 500;

  cursor: pointer;

  transition: transform 0.2s ease;
}

.rr-gift__copy:hover {
  transform: scale(1.05);
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-gift {
    gap: 28px;

    padding: 0 40px;
  }

  .rr-gift__overlay {
    align-items: center;
  }

  .rr-gift__modal-head h3 {
    font-size: 24px;
  }

  .rr-gift__qr {
    width: 160px;
    height: 160px;
  }
}
</style>
