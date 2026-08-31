<template>
  <section class="couple">
    <div class="section-heading">
      <span class="heading-line" />
      <div>
        <small>THE BRIDE & GROOM</small>
        <h2>Đôi uyên ương</h2>
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
import { computed } from "vue";

const props = defineProps({
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
  "Chú Rể"
);

const brideName = computed(() =>
  props.wedding?.BrideName ||
  props.wedding?.brideName ||
  bride.value?.name ||
  "Cô Dâu"
);

const groomImage = computed(() =>
  groom.value?.avatar ||
  groom.value?.image ||
  props.wedding?.GroomImage ||
  ""
);

const brideImage = computed(() =>
  bride.value?.avatar ||
  bride.value?.image ||
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
  color: #641914;
  text-align: center;
  background:
    radial-gradient(circle at center, rgba(201,149,82,.08), transparent 45%),
    #f3ead8;
  overflow: hidden;
}

.couple::before,
.couple::after {
  content: "";
  position: absolute;
  width: 130px;
  height: 130px;
  border: 1px solid rgba(143,36,28,.18);
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
  background: #a96b32;
}

.section-heading small {
  font-size: 8px;
  letter-spacing: .35em;
  color: #a96b32;
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
  color: #805148;
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
  min-width: 0;
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
  border: 1px solid #a96b32;
  border-radius: 50%;
}

.portrait-ring::before {
  content: "";
  position: absolute;
  inset: 7px;
  border: 1px dashed rgba(143,36,28,.45);
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
  border: 4px solid #f3ead8;
}

.portrait-placeholder {
  display: grid;
  place-items: center;
  background: #741c17;
  color: #d4a35f;
  font-family: Georgia, serif;
  font-size: 35px;
}

.role {
  display: block;
  margin-top: 28px;
  font-size: 8px;
  letter-spacing: .35em;
  color: #a96b32;
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
  color: #80675f;
}

.between {
  align-self: center;
  color: #a96b32;
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
  color: #a96b32;
}

.bottom-symbol i {
  flex: 1;
  height: 1px;
  background: #a96b32;
}
</style>