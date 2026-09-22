<template>
  <footer class="tr-footer">
    <!-- =====================================================
         ẢNH CƯỚI LÀM NỀN
    ====================================================== -->

    <div class="tr-footer__photo" aria-hidden="true">
      <img :src="photoUrl" alt="" loading="lazy" decoding="async" />
    </div>

    <div class="tr-footer__veil" aria-hidden="true"></div>
    <div class="tr-footer__frame" aria-hidden="true"></div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tr-footer__content">
      <div class="tr-footer__seal" aria-hidden="true">囍</div>

      <p class="tr-footer__message">{{ thanksMessage }}</p>

      <div class="tr-footer__portraits">
        <div v-if="groomAvatar" class="tr-footer__portrait">
          <img :src="groomAvatar" alt="" loading="lazy" decoding="async" />
        </div>

        <span class="tr-footer__heart" aria-hidden="true">♥</span>

        <div v-if="brideAvatar" class="tr-footer__portrait">
          <img :src="brideAvatar" alt="" loading="lazy" decoding="async" />
        </div>
      </div>

      <div class="tr-footer__couple">
        <span class="tr-footer__name">{{ groom }}</span>

        <span class="tr-footer__amp">&amp;</span>

        <span class="tr-footer__name">{{ bride }}</span>
      </div>

      <div v-if="date" class="tr-footer__date">{{ date }}</div>

      <small class="tr-footer__copyright">{{ copyrightText }}</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import dayjs from "dayjs";

import fallbackPhoto from "@/assets/photos/couple-veil.jpg";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  monogram: {
    type: String,
    default: "",
  },

  currentYear: {
    type: Number,
    default: new Date().getFullYear(),
  },

  photo: {
    type: String,
    default: "",
  },

  cover: {
    type: String,
    default: "",
  },

  gallery: {
    type: Array,
    default: () => [],
  },

  couple: {
    type: Object,
    default: () => ({}),
  },
});

/* =========================================================
   ẢNH NỀN
   Ưu tiên: ảnh truyền vào -> ảnh bìa -> ảnh album -> mặc định
========================================================= */

const galleryPhoto = computed(() => {
  const item = (props.gallery || []).find(
    (entry) => entry?.Url || entry?.Image || entry?.Src || entry?.ImageUrl
  );

  return item ? item.Url || item.Image || item.Src || item.ImageUrl || "" : "";
});

const photoUrl = computed(
  () => props.photo || props.cover || galleryPhoto.value || fallbackPhoto
);

/* =========================================================
   CHÂN DUNG
========================================================= */

const groomAvatar = computed(
  () => props.couple?.Groom?.Avatar || props.wedding?.couple?.Groom?.Avatar || ""
);

const brideAvatar = computed(
  () => props.couple?.Bride?.Avatar || props.wedding?.couple?.Bride?.Avatar || ""
);

/* =========================================================
   TÊN / LỜI CẢM ƠN
========================================================= */

const groom = computed(
  () => props.wedding?.GroomName || props.wedding?.groomName || ""
);

const bride = computed(
  () => props.wedding?.BrideName || props.wedding?.brideName || ""
);

const thanksMessage = computed(
  () =>
    props.wedding?.footer?.Message ||
    "Cảm ơn bạn đã dành thời gian đến với ngày vui của chúng tôi."
);

const copyrightText = computed(
  () =>
    props.wedding?.footer?.Copyright ||
    `© ${props.currentYear} · WEDDING INVITATION`
);

const date = computed(() => {
  const value = dayjs(props.wedding?.weddingDate);

  return value.isValid() ? value.format("DD · MM · YYYY") : "";
});
</script>

<style scoped>
/* =========================================================
   FOOTER
========================================================= */

.tr-footer {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  min-height: clamp(520px, 72vh, 720px);

  padding: 90px 24px 70px;

  overflow: hidden;

  text-align: center;
}

/* =========================================================
   ẢNH
========================================================= */

.tr-footer__photo {
  position: absolute;

  inset: 0;

  z-index: 0;
}

.tr-footer__photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  object-position: center 32%;

  filter: saturate(0.82) contrast(1.06) brightness(0.86);

  transform: scale(1.04);
}

.tr-footer__veil {
  position: absolute;

  inset: 0;

  z-index: 1;

  background: radial-gradient(
      ellipse at center 78%,
      rgba(199, 157, 92, 0.22),
      transparent 55%
    ),
    linear-gradient(
      180deg,
      rgba(74, 8, 8, 0.96) 0%,
      rgba(104, 14, 14, 0.62) 26%,
      rgba(74, 8, 8, 0.72) 62%,
      rgba(40, 3, 3, 0.96) 100%
    );
}

.tr-footer__frame {
  position: absolute;

  inset: 16px;

  z-index: 2;

  pointer-events: none;

  border: 1px solid rgba(255, 227, 177, 0.34);
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tr-footer__content {
  position: relative;

  z-index: 3;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  max-width: 520px;
}

.tr-footer__seal {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 52px;
  height: 52px;

  margin-bottom: 20px;

  border-radius: 50%;

  color: #4a0808;

  font-family: var(--font-symbol, "Noto Serif SC", serif);

  font-size: 24px;

  line-height: 1;

  background: radial-gradient(circle at 35% 30%, #ffe3b1, #cbb080 72%);

  box-shadow: 0 0 0 1px rgba(255, 227, 177, 0.45),
    0 0 0 6px rgba(255, 227, 177, 0.08), 0 8px 22px rgba(0, 0, 0, 0.35);
}

.tr-footer__message {
  margin: 0 0 28px;

  max-width: 420px;

  color: rgba(255, 227, 177, 0.88);

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 15px;

  line-height: 1.7;
}

/* =========================================================
   CHÂN DUNG
========================================================= */

.tr-footer__portraits {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  margin-bottom: 20px;
}

.tr-footer__portrait {
  width: 84px;
  height: 84px;

  border-radius: 50%;

  overflow: hidden;

  border: 1px solid rgba(255, 227, 177, 0.6);

  box-shadow: 0 0 0 4px rgba(255, 227, 177, 0.1),
    0 10px 24px rgba(0, 0, 0, 0.4);
}

.tr-footer__portrait img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.tr-footer__heart {
  color: #ffe3b1;

  font-size: 14px;

  opacity: 0.85;
}

/* =========================================================
   TÊN
========================================================= */

.tr-footer__couple {
  display: flex;

  align-items: baseline;
  justify-content: center;

  gap: 10px;

  flex-wrap: wrap;
}

.tr-footer__name {
  color: #ffe3b1;

  font-family: "The Nautigal", "Great Vibes", cursive;

  font-size: 40px;

  line-height: 1.1;
}

.tr-footer__amp {
  color: rgba(255, 227, 177, 0.7);

  font-family: "EB Garamond", "Cormorant Garamond", serif;

  font-size: 20px;
}

.tr-footer__date {
  margin-top: 10px;

  color: rgba(255, 227, 177, 0.7);

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 12px;

  letter-spacing: 0.22em;
}

.tr-footer__copyright {
  margin-top: 26px;

  color: rgba(255, 227, 177, 0.45);

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 10px;

  letter-spacing: 0.18em;
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .tr-footer {
    padding: 70px 18px 56px;
  }

  .tr-footer__portrait {
    width: 68px;
    height: 68px;
  }

  .tr-footer__name {
    font-size: 34px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .tr-footer__photo img {
    transform: none;
  }
}
</style>
