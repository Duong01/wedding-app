<template>
  <div class="footer-section">

    <!-- =================================================
         ẢNH CƯỚI LÀM NỀN
    ================================================== -->

    <div
      v-if="photoUrl"
      class="footer-photo"
      aria-hidden="true"
    >
      <img
        :src="photoUrl"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>

    <!-- Lớp phủ đỏ + ánh kim giữ chữ luôn đọc được -->
    <div class="footer-veil" aria-hidden="true"></div>

    <!-- Khung viền kép mảnh -->
    <div class="footer-frame" aria-hidden="true"></div>


    <!-- =================================================
         NỘI DUNG
    ================================================== -->

    <div class="footer-content">

      <!-- Ấn triện -->
      <div class="footer-seal" aria-hidden="true">
        <span>囍</span>
      </div>

      <!-- Message -->
      <p
        v-if="wedding.Message"
        class="footer-message"
      >
        {{ wedding.Message }}
      </p>

      <!-- Small label -->
      <div class="footer-label">
        <span class="label-line"></span>

        <span>
          Hạnh phúc trăm năm
        </span>

        <span class="label-line"></span>
      </div>

      <!-- =================================================
           CHÂN DUNG CÔ DÂU - CHÚ RỂ
      ================================================== -->

      <div
        v-if="groomAvatar || brideAvatar"
        class="couple-portraits"
      >
        <div v-if="groomAvatar" class="portrait">
          <img :src="groomAvatar" alt="" loading="lazy" decoding="async" />
        </div>

        <div class="portrait-heart" aria-hidden="true">♥</div>

        <div v-if="brideAvatar" class="portrait">
          <img :src="brideAvatar" alt="" loading="lazy" decoding="async" />
        </div>
      </div>

      <!-- =================================================
           COUPLE
      ================================================== -->

      <div
        v-if="wedding.GroomName || wedding.BrideName"
        class="couple-wrapper"
      >
        <!-- Groom -->
        <div
          v-if="wedding.GroomName"
          class="couple-name"
        >
          {{ wedding.GroomName }}
        </div>

        <!-- Symbol -->
        <div
          v-if="wedding.GroomName && wedding.BrideName"
          class="couple-symbol"
          aria-hidden="true"
        >
          <span>&</span>
        </div>

        <!-- Bride -->
        <div
          v-if="wedding.BrideName"
          class="couple-name"
        >
          {{ wedding.BrideName }}
        </div>
      </div>

      <!-- =================================================
           COPYRIGHT
      ================================================== -->

      <div
        v-if="wedding.Copyright"
        class="copyright"
      >
        <p>{{ wedding.Copyright }}</p>
        © {{ currentYear }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

import fallbackPhoto from "@/assets/photos/couple-veil.jpg";

const props = defineProps({
  footer: {
    type: Object,
    default: () => ({}),
  },

  /* Ảnh cưới dùng làm nền footer */
  photo: {
    type: String,
    default: "",
  },

  /* Ảnh bìa thiệp */
  cover: {
    type: String,
    default: "",
  },

  /* Album cưới — lấy ảnh đầu tiên nếu chưa có ảnh bìa */
  gallery: {
    type: Array,
    default: () => [],
  },

  /* Thông tin cô dâu chú rể (Avatar) */
  couple: {
    type: Object,
    default: () => ({}),
  },
});

const wedding = computed(() => props.footer ?? {});

const currentYear = new Date().getFullYear();

/* =========================================================
   ẢNH NỀN
========================================================= */

const groomAvatar = computed(() => props.couple?.Groom?.Avatar || "");

const brideAvatar = computed(() => props.couple?.Bride?.Avatar || "");

const galleryPhoto = computed(() => {
  const item = (props.gallery || []).find(
    (entry) => entry?.Url || entry?.Image || entry?.Src || entry?.ImageUrl
  );

  if (!item) return "";

  return item.Url || item.Image || item.Src || item.ImageUrl || "";
});

/*
 * Thứ tự ưu tiên:
 * ảnh chỉ định -> ảnh bìa -> ảnh album -> ảnh cưới mặc định.
 */
const photoUrl = computed(
  () =>
    props.photo ||
    props.cover ||
    galleryPhoto.value ||
    fallbackPhoto
);
</script>

<style scoped>
/* =========================================================
   ROOT
========================================================= */

.footer-section {
  --footer-red: var(--p-primary, #7b0d0d);
  --footer-red-dark: var(--p-primary-dark, #65090c);

  --footer-gold: var(--p-gold, #c79d5c);
  --footer-gold-light: var(--p-gold-light, #f7d8a3);

  --footer-white: var(--white, #fffaf4);

  position: relative;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: clamp(520px, 72vh, 720px);

  padding: 90px 24px 70px;

  overflow: hidden;

  color: var(--footer-white);

  text-align: center;

  isolation: isolate;
}


/* =========================================================
   ẢNH NỀN
========================================================= */

.footer-photo {
  position: absolute;

  inset: 0;

  z-index: 0;

  pointer-events: none;
}

.footer-photo img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  object-position: center 32%;

  filter: saturate(0.82) contrast(1.06) brightness(0.86);

  transform: scale(1.04);
}


/* =========================================================
   LỚP PHỦ
========================================================= */

.footer-veil {
  position: absolute;

  inset: 0;

  z-index: 1;

  pointer-events: none;

  background:
    radial-gradient(
      ellipse at center 78%,
      rgba(199, 157, 92, 0.22),
      transparent 55%
    ),
    linear-gradient(
      180deg,
      rgba(101, 9, 12, 0.96) 0%,
      rgba(123, 13, 13, 0.62) 26%,
      rgba(101, 9, 12, 0.72) 62%,
      rgba(58, 3, 5, 0.96) 100%
    );
}


/* =========================================================
   KHUNG VIỀN
========================================================= */

.footer-frame {
  position: absolute;

  inset: 16px;

  z-index: 2;

  pointer-events: none;

  border: 1px solid rgba(231, 193, 119, 0.34);

  border-radius: 4px;

  box-shadow:
    inset 0 0 0 4px rgba(231, 193, 119, 0.06),
    inset 0 0 60px rgba(0, 0, 0, 0.28);
}


/* =========================================================
   CONTENT
========================================================= */

.footer-content {
  position: relative;

  z-index: 3;

  width: 100%;
  max-width: 760px;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 0 auto;
}


/* =========================================================
   ẤN TRIỆN
========================================================= */

.footer-seal {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 58px;
  height: 58px;

  margin-bottom: 26px;

  border-radius: 50%;

  background:
    radial-gradient(circle at 35% 30%, #f7e3a9, #cda85d 72%);

  box-shadow:
    0 0 0 1px rgba(255, 227, 177, 0.5),
    0 0 0 6px rgba(199, 157, 92, 0.12),
    0 10px 26px rgba(0, 0, 0, 0.3);
}

.footer-seal span {
  font-family: var(--font-symbol, "Noto Serif SC", serif);

  font-size: 27px;

  line-height: 1;

  color: #7a3d22;
}


/* =========================================================
   MESSAGE
========================================================= */

.footer-message {
  width: 100%;
  max-width: 620px;

  margin: 0 auto 24px;

  font-family: var(--font-main, "Cormorant Garamond", serif);

  font-size: 17px;

  font-weight: 400;

  line-height: 1.9;

  letter-spacing: 0.35px;

  color: rgba(255, 250, 244, 0.9);

  text-align: center;

  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
}


/* =========================================================
   LABEL
========================================================= */

.footer-label {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-bottom: 24px;

  font-family: var(--font-main, "Cormorant Garamond", serif);

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 4px;

  text-transform: uppercase;

  color: rgba(247, 216, 163, 0.86);

  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.label-line {
  width: 26px;

  height: 1px;

  background: rgba(247, 216, 163, 0.5);
}


/* =========================================================
   CHÂN DUNG
========================================================= */

.couple-portraits {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 16px;

  margin-bottom: 22px;
}

.portrait {
  width: 84px;
  height: 84px;

  flex: 0 0 84px;

  border-radius: 50%;

  overflow: hidden;

  border: 1px solid rgba(231, 193, 119, 0.6);

  box-shadow:
    0 0 0 4px rgba(199, 157, 92, 0.14),
    0 12px 30px rgba(0, 0, 0, 0.35);
}

.portrait img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.portrait-heart {
  font-size: 15px;

  color: var(--footer-gold-light);

  text-shadow: 0 0 14px rgba(247, 216, 163, 0.5);
}


/* =========================================================
   COUPLE
========================================================= */

.couple-wrapper {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  gap: 26px;

  margin-top: 4px;
}

.couple-name {
  font-family: var(
    --font-wedding,
    "Allura",
    cursive
  );

  font-size: clamp(30px, 6vw, 50px);

  font-weight: 400;

  font-style: normal;

  line-height: 1.1;

  color: var(--footer-gold-light);

  white-space: nowrap;

  text-shadow:
    0 2px 16px rgba(0, 0, 0, 0.5);
}


/* =========================================================
   &
========================================================= */

.couple-symbol {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 46px;
  height: 46px;

  flex: 0 0 46px;
}

.couple-symbol::before,
.couple-symbol::after {
  content: "";

  position: absolute;

  width: 100%;
  height: 100%;

  border: 1px solid rgba(
    247,
    216,
    163,
    0.38
  );

  transform: rotate(45deg);

  border-radius: 5px;
}

.couple-symbol::after {
  width: 36px;
  height: 36px;

  border-color: rgba(
    247,
    216,
    163,
    0.18
  );
}

.couple-symbol span {
  position: relative;

  z-index: 2;

  font-family: var(
    --font-wedding,
    "Allura",
    cursive
  );

  font-size: 28px;

  font-style: italic;

  color: var(--footer-gold-light);
}


/* =========================================================
   COPYRIGHT
========================================================= */

.copyright {
  margin-top: 30px;

  font-family: var(--font-main, "Cormorant Garamond", serif);

  font-size: 13px;

  font-weight: 400;

  line-height: 1.8;

  letter-spacing: 1.5px;

  color: rgba(
    255,
    250,
    244,
    0.66
  );

  text-transform: uppercase;

  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.copyright p {
  margin: 0 0 4px;
}

.copyright span {
  color: rgba(
    247,
    216,
    163,
    0.82
  );
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 768px) {
  .footer-section {
    min-height: 480px;

    padding: 76px 24px 60px;
  }

  .footer-frame {
    inset: 12px;
  }

  .footer-message {
    max-width: 500px;

    font-size: 16px;
  }

  .couple-wrapper {
    gap: 18px;
  }

  .couple-name {
    font-size: clamp(
      25px,
      8vw,
      45px
    );
  }

  .couple-symbol {
    width: 40px;
    height: 40px;

    flex-basis: 40px;
  }

  .couple-symbol::after {
    width: 31px;
    height: 31px;
  }

  .couple-symbol span {
    font-size: 24px;
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .footer-section {
    min-height: 440px;

    padding: 68px 18px 55px;
  }

  .footer-frame {
    inset: 9px;
  }

  .footer-seal {
    width: 50px;
    height: 50px;

    margin-bottom: 20px;
  }

  .footer-seal span {
    font-size: 23px;
  }

  .footer-message {
    max-width: 330px;

    margin-bottom: 20px;

    font-size: 15px;

    line-height: 1.8;
  }

  .footer-label {
    gap: 8px;

    margin-bottom: 20px;

    font-size: 11px;

    letter-spacing: 3px;
  }

  .label-line {
    width: 18px;
  }

  .portrait {
    width: 68px;
    height: 68px;

    flex-basis: 68px;
  }

  .couple-portraits {
    gap: 12px;

    margin-bottom: 18px;
  }

  .couple-wrapper {
    gap: 9px;
  }

  .couple-name {
    font-size: clamp(
      20px,
      10vw,
      35px
    );
  }

  .couple-symbol {
    width: 34px;
    height: 34px;

    flex-basis: 34px;
  }

  .couple-symbol::after {
    width: 26px;
    height: 26px;
  }

  .couple-symbol span {
    font-size: 20px;
  }

  .copyright {
    margin-top: 24px;

    font-size: 11px;

    letter-spacing: 1px;
  }
}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {
  .footer-section {
    padding-left: 12px;
    padding-right: 12px;
  }

  .couple-wrapper {
    gap: 5px;
  }

  .couple-name {
    font-size: 26px;
  }

  .couple-symbol {
    width: 30px;
    height: 30px;

    flex-basis: 30px;
  }

  .couple-symbol::after {
    width: 23px;
    height: 23px;
  }

  .couple-symbol span {
    font-size: 18px;
  }

  .footer-message {
    max-width: 290px;
  }
}
</style>
