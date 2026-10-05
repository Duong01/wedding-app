<template>
  <section id="templates-showcase" class="showcase">
    <div class="mk-container">
      <!-- =====================================================
           MỤC LỚN — CỬA VÀO TRANG XEM MẪU THIỆP
      ====================================================== -->
      <article class="showcase-main" @click="goTemplates">
        <div class="showcase-main__media">
          <img
            v-for="(card, index) in deck"
            :key="card.src"
            :src="card.src"
            :alt="card.label"
            class="showcase-main__img"
            :class="`is-${index}`"
            loading="lazy"
            @error="handleImageError"
          />

          <span class="showcase-main__seal" aria-hidden="true">囍</span>
        </div>

        <div class="showcase-main__body">
          <p class="showcase-main__eyebrow">
            <span class="pulse-dot" aria-hidden="true"></span>
            {{ $t("showcase.waiting", { n: weddings.length }) }} </p> <h2> {{ $t('showcase.h2a') }} <em>{{ $t('showcase.h2b') }}</em> {{ $t('showcase.h2c') }} </h2> <p class="showcase-main__lead"> {{ $t('showcase.lead') }} </p> <div class="showcase-main__actions"> <span class="mk-btn mk-btn--solid"> {{ $t("showcase.viewN", { n: weddings.length }) }} <span aria-hidden="true">→</span> </span> <span class="showcase-main__hint"> {{ $t('showcase.badge') }} </span> </div> </div> </article> <!-- ===================================================== ƯU ĐÃI / TÍNH NĂNG NỔI BẬT ====================================================== --> <div class="perks-head"> <p class="mk-eyebrow">{{ $t('showcase.inEvery') }}</p> <h3>{{ $t('showcase.h3') }}</h3> </div> <div class="perks"> <article v-for="perk in PERKS" :key="perk.title" class="perk" :class="{ 'perk--hot': perk.hot }" @click="goTemplates" > <span class="perk__orn" aria-hidden="true">{{ perk.orn }}</span> <span v-if="perk.hot" class="perk__badge">HOT</span> <h4>{{ perk.title }}</h4> <p>{{ perk.text }}</p> </article> </div> </div> </section> </template> <script setup> import { useI18n } from "vue-i18n"; import { computed } from "vue"; import { useRouter } from "vue-router"; import { handleImageError, toCardItem } from "@/utils/weddingCard"; const { t } = useI18n(); const props = defineProps({ weddings: { type: Array, default: () => [] }, }); const router = useRouter(); /* * Ưu đãi / tính năng bán hàng — viết ngắn, gọn, đánh vào * lợi ích người dùng nhận được chứ không liệt kê tính năng. */ const PERKS = [ { orn: "▶", get title() { return t("showcase.f1.title"); },
    get text() { return t("showcase.f1.text"); },
    hot: true,
  },
  {
    orn: "✧",
    get title() { return t("showcase.f2.title"); },
    get text() { return t("showcase.f2.text"); },
    hot: true,
  },
  {
    orn: "♪",
    get title() { return t("showcase.f3.title"); },
    get text() { return t("showcase.f3.text"); },
  },
  {
    orn: "❝",
    get title() { return t("features.guestbook.title"); },
    get text() { return t("showcase.f4.text"); },
  },
  {
    orn: "✽",
    get title() { return t("showcase.f5.title"); },
    get text() { return t("showcase.f5.text"); },
  },
  {
    orn: "◈",
    get title() { return t("showcase.f6.title"); },
    get text() { return t("showcase.f6.text"); },
  },
];

const deck = computed(() => props.weddings.slice(0, 3).map(toCardItem));

function goTemplates() {
  router.push({ name: "Templates" });
}
</script>

<style scoped>
/* =========================================================
   MỤC LỚN — CỬA VÀO TRANG MẪU THIỆP
   To, nổi bật, chiếm trọn bề ngang — ai cuộn tới cũng
   phải thấy. Toàn khối bấm được.
========================================================= */

.showcase {
  padding: 40px 0 8px;
}

.showcase-main {
  position: relative;

  display: grid;
  grid-template-columns: 1fr;

  gap: 26px;
  align-items: center;

  padding: 26px 22px 30px;

  overflow: hidden;

  border: 1px solid rgba(185, 151, 91, 0.45);
  border-radius: 30px;

  background:
    radial-gradient(
      circle at 88% 8%,
      rgba(185, 151, 91, 0.16),
      transparent 42%
    ),
    radial-gradient(
      circle at 4% 96%,
      rgba(166, 58, 46, 0.08),
      transparent 40%
    ),
    var(--studio-card, #fffdf8);

  box-shadow:
    0 30px 70px rgba(43, 33, 24, 0.14),
    0 0 0 6px rgba(185, 151, 91, 0.08);

  cursor: pointer;

  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.showcase-main:hover {
  transform: translateY(-4px);

  border-color: rgba(185, 151, 91, 0.75);

  box-shadow:
    0 40px 90px rgba(43, 33, 24, 0.18),
    0 0 0 8px rgba(185, 151, 91, 0.12);
}

/* --- media: bộ ba thiệp xoè quạt --- */

.showcase-main__media {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 300px;
}

.showcase-main__img {
  position: absolute;

  width: 172px;
  aspect-ratio: 9 / 16;

  overflow: hidden;

  border: 1px solid rgba(185, 151, 91, 0.4);
  border-radius: 12px;

  background: var(--studio-paper-deep, #efe6d4);

  box-shadow: 0 22px 50px rgba(43, 33, 24, 0.2);

  object-fit: cover;
  object-position: center top;

  transition: transform 0.5s ease;
}

.showcase-main__img.is-0 {
  z-index: 1;

  transform: translateX(-62px) rotate(-8deg) scale(0.92);

  opacity: 0.88;
}

.showcase-main__img.is-1 {
  z-index: 3;

  transform: translateY(-10px);
}

.showcase-main__img.is-2 {
  z-index: 2;

  transform: translateX(62px) rotate(8deg) scale(0.92);

  opacity: 0.88;
}

.showcase-main:hover .showcase-main__img.is-0 {
  transform: translateX(-84px) rotate(-11deg) scale(0.94);
}

.showcase-main:hover .showcase-main__img.is-2 {
  transform: translateX(84px) rotate(11deg) scale(0.94);
}

.showcase-main__seal {
  position: absolute;
  bottom: 2px;
  left: 50%;
  z-index: 4;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 46px;
  height: 46px;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);
  color: #fdf6ec;

  font-family: var(--font-symbol);
  font-size: 21px;

  box-shadow: 0 12px 26px rgba(166, 58, 46, 0.34);

  transform: translateX(-50%);
}

/* --- body --- */

.showcase-main__eyebrow {
  display: inline-flex;
  align-items: center;

  gap: 9px;

  margin: 0 0 14px;

  color: var(--studio-seal, #a63a2e);

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.pulse-dot {
  position: relative;

  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: var(--studio-seal, #a63a2e);
}

.pulse-dot::after {
  content: "";

  position: absolute;
  inset: -4px;

  border-radius: 50%;

  background: rgba(166, 58, 46, 0.35);

  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.6);

    opacity: 1;
  }

  100% {
    transform: scale(1.8);

    opacity: 0;
  }
}

.showcase-main__body h2 {
  margin: 0;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(26px, 3.6vw, 42px);
  font-weight: 600;

  line-height: 1.12;
  letter-spacing: -0.02em;
}

.showcase-main__body h2 em {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.showcase-main__lead {
  max-width: 520px;

  margin: 16px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15.5px;

  line-height: 1.75;
}

.showcase-main__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 8px 18px;

  margin-top: 26px;
}

.showcase-main__hint {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;

  letter-spacing: 0.02em;
}

/* =========================================================
   ƯU ĐÃI / TÍNH NĂNG
========================================================= */

.perks-head {
  margin: 46px 0 22px;

  text-align: center;
}

.perks-head h3 {
  margin: 10px 0 0;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(22px, 2.8vw, 32px);
  font-weight: 600;

  line-height: 1.2;
}

.perks {
  display: grid;

  grid-template-columns: 1fr;

  gap: 14px;
}

.perk {
  position: relative;

  display: flex;
  flex-direction: column;

  padding: 22px 20px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 20px;

  background: var(--studio-card, #fffdf8);

  cursor: pointer;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.perk:hover {
  transform: translateY(-4px);

  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 18px 40px rgba(43, 33, 24, 0.12);
}

/*
 * Hai ưu đãi "HOT" (video + trò chơi) mang nền đỏ son nhạt
 * và viền đậm hơn — nổi bật hẳn khỏi các ô còn lại.
 */
.perk--hot {
  border-color: rgba(166, 58, 46, 0.35);

  background:
    radial-gradient(
      circle at 92% 0%,
      rgba(166, 58, 46, 0.09),
      transparent 46%
    ),
    var(--studio-card, #fffdf8);
}

.perk--hot:hover {
  border-color: rgba(166, 58, 46, 0.6);
}

.perk__orn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;
  margin-bottom: 14px;

  border-radius: 12px;

  background: color-mix(
    in srgb,
    var(--studio-foil, #b9975b) 14%,
    transparent
  );

  color: var(--studio-seal, #a63a2e);

  font-size: 18px;
}

.perk--hot .perk__orn {
  background: rgba(166, 58, 46, 0.12);
}

.perk__badge {
  position: absolute;
  top: 16px;
  right: 16px;

  padding: 4px 10px;

  border-radius: 999px;

  background: var(--studio-seal, #a63a2e);
  color: #fff;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;
}

.perk h4 {
  margin: 0 0 8px;

  color: var(--studio-ink, #2b2118);

  font-size: 15.5px;
  font-weight: 700;

  line-height: 1.3;
}

.perk p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;

  line-height: 1.65;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .showcase {
    padding: 56px 0 16px;
  }

  .showcase-main {
    grid-template-columns: 0.9fr 1.1fr;

    gap: 40px;

    padding: 38px 40px;
  }

  .showcase-main__media {
    height: 400px;
  }

  .showcase-main__img {
    width: 210px;
  }

  .showcase-main__img.is-0 {
    transform: translateX(-78px) rotate(-8deg) scale(0.92);
  }

  .showcase-main__img.is-2 {
    transform: translateX(78px) rotate(8deg) scale(0.92);
  }

  .showcase-main:hover .showcase-main__img.is-0 {
    transform: translateX(-104px) rotate(-11deg) scale(0.94);
  }

  .showcase-main:hover .showcase-main__img.is-2 {
    transform: translateX(104px) rotate(11deg) scale(0.94);
  }

  .perks {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 16px;
  }
}

@media (max-width: 420px) {
  .showcase-main {
    padding: 22px 16px 26px;

    border-radius: 24px;
  }

  .showcase-main__media {
    height: 250px;
  }

  .showcase-main__img {
    width: 148px;
  }

  .showcase-main__img.is-0 {
    transform: translateX(-52px) rotate(-8deg) scale(0.92);
  }

  .showcase-main__img.is-2 {
    transform: translateX(52px) rotate(8deg) scale(0.92);
  }

  .showcase-main__body h2 {
    font-size: clamp(23px, 7.4vw, 30px);
  }

  .showcase-main__lead {
    font-size: 14.5px;

    line-height: 1.7;
  }

  .showcase-main__actions {
    margin-top: 20px;
  }

  .perks-head {
    margin: 36px 0 18px;
  }

  /*
   * Điện thoại: 6 ô ưu đãi xếp dọc chiếm gần hai màn hình
   * cuộn. Bố cục ngang gọn — icon trái, chữ phải — rút còn
   * khoảng một nửa chiều cao mà vẫn đọc rõ.
   */
  .perk {
    flex-direction: row;
    align-items: flex-start;

    gap: 14px;

    padding: 16px 14px;
  }

  .perk__orn {
    width: 38px;
    height: 38px;
    margin-bottom: 0;

    flex-shrink: 0;

    border-radius: 10px;

    font-size: 16px;
  }

  .perk h4 {
    font-size: 14.5px;
  }

  .perk p {
    font-size: 12.5px;

    line-height: 1.55;
  }

  .perk__badge {
    top: 12px;
    right: 12px;

    padding: 3px 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .showcase-main,
  .showcase-main__img,
  .perk {
    transition: none;
  }

  .pulse-dot::after {
    animation: none;
  }
}
</style>
