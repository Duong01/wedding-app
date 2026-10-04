<template>
  <section class="couple">
    <div class="section-heading">
      <span class="heading-line" />
      <div>
        <small>THE BRIDE & GROOM</small>
        <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
        <header v-if="sectionOverride(sections, 'couple', 'Eyebrow')" class="ds-top-custom-head">
          <p v-if="sectionOverride(sections, 'couple', 'Eyebrow')" class="ds-top-custom-head__eyebrow">{{ sectionOverride(sections, "couple", "Eyebrow") }}</p>
        </header>

        <h2>{{ sectionText(sections, "couple", "Heading", "Đôi uyên ương") }}</h2>
      </div>
      <span class="heading-line" />
    </div>

    <div class="couple-intro">
      Hai người, hai hành trình
      <br />
      nay cùng bước chung một con đường.
    </div>

    <div class="couple-grid">
      <article class="person groom">
        <div class="portrait-wrap">
          <div class="portrait-ring" />
          <img
            v-if="groomImage"
            :src="groomImage"
            :alt="groomName"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="portrait-placeholder">
            {{ initials(groomName) }}
          </div>
        </div>

        <span class="role">CHÚ RỂ</span>
        <h3>{{ groomName }}</h3>
        <p>{{ groomDescription }}</p>
      </article>

      <div class="between">
        <div class="drum-symbol">✦</div>
        <span>&</span>
      </div>

      <article class="person bride">
        <div class="portrait-wrap">
          <div class="portrait-ring" />
          <img
            v-if="brideImage"
            :src="brideImage"
            :alt="brideName"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="portrait-placeholder">
            {{ initials(brideName) }}
          </div>
        </div>

        <span class="role">CÔ DÂU</span>
        <h3>{{ brideName }}</h3>
        <p>{{ brideDescription }}</p>
      </article>
    </div>

    <div class="bottom-symbol">
      <span>𓅃</span>
      <i />
      <span>𓅃</span>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";

const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  wedding: {
    type: Object,
    default: () => ({}),
  },
});

const groom = computed(() => props.wedding?.groom || {});
const bride = computed(() => props.wedding?.bride || {});

const groomName = computed(() =>
  props.wedding?.GroomName ||
  props.wedding?.groomName ||
  groom.value?.name ||
  props.wedding?.couple?.Groom?.Name ||
  props.wedding?.hero?.GroomName ||
  ""
);

const brideName = computed(() =>
  props.wedding?.BrideName ||
  props.wedding?.brideName ||
  bride.value?.name ||
  props.wedding?.couple?.Bride?.Name ||
  props.wedding?.hero?.BrideName ||
  ""
);

const groomImage = computed(() =>
  groom.value?.avatar ||
  groom.value?.image ||
  props.wedding?.couple?.Groom?.Avatar ||
  props.wedding?.GroomImage ||
  ""
);

const brideImage = computed(() =>
  bride.value?.avatar ||
  bride.value?.image ||
  props.wedding?.couple?.Bride?.Avatar ||
  props.wedding?.BrideImage ||
  ""
);

const groomDescription = computed(() =>
  groom.value?.description || "Người con trai của gia đình"
);

const brideDescription = computed(() =>
  bride.value?.description || "Người con gái của gia đình"
);

function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map(x => x.charAt(0))
    .join("")
    .toUpperCase();
}
</script>

<style scoped>
.couple {
  position: relative;
  padding: 65px 22px;
  color: var(--tc-641914, #641914);
  text-align: center;
  background:
    radial-gradient(circle at center, rgba(var(--tc-c99552-rgb, 201, 149, 82), .08), transparent 45%),
    var(--tc-f3ead8, #f3ead8);
  overflow: hidden;
}

.couple::before,
.couple::after {
  content: "";
  position: absolute;
  width: 130px;
  height: 130px;
  border: 1px solid rgba(var(--tc-8f241c-rgb, 143, 36, 28), .18);
  border-radius: 50%;
}

.couple::before {
  left: -80px;
  top: 70px;
}

.couple::after {
  right: -80px;
  bottom: 70px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
}

.heading-line {
  width: 42px;
  height: 1px;
  background: var(--tc-8b5829, #8b5829);
}

.section-heading small {
  font-size: 10px;
  letter-spacing: .35em;
  color: var(--tc-8b5829, #8b5829);
}

h2 {
  margin: 6px 0;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.couple-intro {
  margin: 22px auto 35px;
  font-family: Georgia, serif;
  font-style: italic;
  line-height: 1.8;
  color: var(--tc-765f57, #765f57);
}

.couple-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 50px 1fr;
  align-items: start;
  max-width: 650px;
  margin: auto;
}

.person {
  position: relative;
  min-width: 0;
  padding: 22px 14px 18px;
  border: 1px solid rgba(var(--tc-8f241c-rgb, 143, 36, 28), .5);
  background: var(--tc-fffaf0, #fffaf0);
  box-shadow: 0 8px 20px rgba(var(--tc-54120f-rgb, 84, 18, 15), .12);
}

.person::before {
  content: "";
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(var(--tc-a96b32-rgb, 169, 107, 50), .35);
  pointer-events: none;
}

.portrait-wrap {
  position: relative;
  width: min(36vw, 170px);
  aspect-ratio: 1;
  margin: auto;
}

.portrait-ring {
  position: absolute;
  inset: -10px;
  border: 1px solid var(--tc-8b5829, #8b5829);
  border-radius: 50%;
}

.portrait-ring::before {
  content: "";
  position: absolute;
  inset: 7px;
  border: 1px dashed rgba(var(--tc-8f241c-rgb, 143, 36, 28), .45);
  border-radius: 50%;
}

.portrait-wrap img,
.portrait-placeholder {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--tc-f3ead8, #f3ead8);
}

.portrait-placeholder {
  display: grid;
  place-items: center;
  background: var(--tc-741c17, #741c17);
  color: var(--tc-d4a35f, #d4a35f);
  font-family: Georgia, serif;
  font-size: 35px;
}

.role {
  display: block;
  margin-top: 28px;
  font-size: 10px;
  letter-spacing: .35em;
  color: var(--tc-8b5829, #8b5829);
}

h3 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 23px;
  font-weight: 400;
}

.person p {
  margin: auto;
  max-width: 150px;
  font-size: 11px;
  line-height: 1.7;
  color: var(--tc-765f57, #765f57);
}

.between {
  align-self: center;
  color: var(--tc-8b5829, #8b5829);
}

.drum-symbol {
  font-size: 20px;
}

.between span {
  display: block;
  margin-top: 4px;
  font-family: Georgia, serif;
  font-size: 25px;
}

.bottom-symbol {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 180px;
  margin: 45px auto 0;
  color: var(--tc-8b5829, #8b5829);
}

.bottom-symbol i {
  flex: 1;
  height: 1px;
  background: var(--tc-8b5829, #8b5829);
}

@media (max-width: 480px) {
  .couple {
    padding: 50px 14px;
  }

  .couple-grid {
    grid-template-columns: 1fr 34px 1fr;
  }

  .between span {
    font-size: 20px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ds-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ds-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ds-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ds-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
