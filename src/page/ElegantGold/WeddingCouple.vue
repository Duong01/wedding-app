<template>
  <section class="eg-couple">
    <div class="section-inner">

      <!-- Header -->
      <div class="section-header">
        <div class="eyebrow">
          <span></span>
          THE COUPLE
          <span></span>
        </div>

        <div class="script-title">
          Chúng mình
        </div>

        <h2>
          Hai trái tim
          <br />
          <em>về chung một nhà</em>
        </h2>

        <div class="gold-symbol">
          ◆
        </div>
      </div>

      <!-- Couple -->
      <div class="couple-grid">

        <!-- Groom -->
        <article class="person-card groom-card">

          <div class="person-image-wrap">
            <div class="person-image-frame">
              <img
                v-if="groom.avatar"
                :src="groom.avatar"
                :alt="groom.name"
                class="person-image"
              />

              <div
                v-else
                class="image-placeholder"
              >
                G
              </div>
            </div>

            <div class="image-corner top-left"></div>
            <div class="image-corner bottom-right"></div>
          </div>

          <div class="person-content">

            <div class="person-role">
              CHÚ RỂ
            </div>

            <h3>
              {{ groom.name }}
            </h3>

            <div class="person-divider">
              <span></span>
              <i>✦</i>
              <span></span>
            </div>

            <p
              v-if="groom.description"
              class="person-description"
            >
              {{ groom.description }}
            </p>

            <div
              v-if="groomFather || groomMother"
              class="parents"
            >
              <div class="parents-label">
                CON TRAI CỦA
              </div>

              <div v-if="groomFather">
                Ông {{ groomFather }}
              </div>

              <div v-if="groomMother">
                Bà {{ groomMother }}
              </div>
            </div>
          </div>
        </article>

        <!-- Center -->
        <div class="couple-center">
          <div class="center-line"></div>

          <div class="center-heart">
            <span>♥</span>
          </div>

          <div class="center-monogram">
            {{ monogram }}
          </div>

          <div class="center-line"></div>
        </div>

        <!-- Bride -->
        <article class="person-card bride-card">

          <div class="person-image-wrap">
            <div class="person-image-frame">
              <img
                v-if="bride.avatar"
                :src="bride.avatar"
                :alt="bride.name"
                class="person-image"
              />

              <div
                v-else
                class="image-placeholder"
              >
                B
              </div>
            </div>

            <div class="image-corner top-left"></div>
            <div class="image-corner bottom-right"></div>
          </div>

          <div class="person-content">

            <div class="person-role">
              CÔ DÂU
            </div>

            <h3>
              {{ bride.name }}
            </h3>

            <div class="person-divider">
              <span></span>
              <i>✦</i>
              <span></span>
            </div>

            <p
              v-if="bride.description"
              class="person-description"
            >
              {{ bride.description }}
            </p>

            <div
              v-if="brideFather || brideMother"
              class="parents"
            >
              <div class="parents-label">
                CON GÁI CỦA
              </div>

              <div v-if="brideFather">
                Ông {{ brideFather }}
              </div>

              <div v-if="brideMother">
                Bà {{ brideMother }}
              </div>
            </div>
          </div>
        </article>

      </div>

    </div>
  </section>
</template>

<script setup>
import {
  computed,
} from "vue";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
});

const groom = computed(() => {
  return {
    name:
      props.wedding?.GroomName ||
      props.wedding?.couple?.groom?.name ||
      "Chú rể",

    avatar:
      props.wedding?.couple?.groom?.avatar ||
      props.wedding?.groomAvatar ||
      "",

    description:
      props.wedding?.couple?.groom?.description ||
      "",
  };
});

const bride = computed(() => {
  return {
    name:
      props.wedding?.BrideName ||
      props.wedding?.couple?.bride?.name ||
      "Cô dâu",

    avatar:
      props.wedding?.couple?.bride?.avatar ||
      props.wedding?.brideAvatar ||
      "",

    description:
      props.wedding?.couple?.bride?.description ||
      "",
  };
});

const groomFather = computed(() => {
  return (
    props.wedding?.couple?.groom?.father ||
    ""
  );
});

const groomMother = computed(() => {
  return (
    props.wedding?.couple?.groom?.mother ||
    ""
  );
});

const brideFather = computed(() => {
  return (
    props.wedding?.couple?.bride?.father ||
    ""
  );
});

const brideMother = computed(() => {
  return (
    props.wedding?.couple?.bride?.mother ||
    ""
  );
});

const monogram = computed(() => {
  return (
    `${groom.value.name.charAt(0)}&` +
    `${bride.value.name.charAt(0)}`
  ).toUpperCase();
});
</script>

<style scoped>
.eg-couple {
  position: relative;

  padding:
    100px 45px;

  background:
    #fffdf8;

  overflow: hidden;
}

.eg-couple::before {
  content: "";

  position: absolute;

  top: 0;
  left: 50%;

  width: 1px;
  height: 100%;

  background:
    linear-gradient(
      180deg,
      transparent,
      rgba(212,175,55,0.08),
      transparent
    );
}

.section-inner {
  width: min(
    100%,
    760px
  );

  margin: auto;
}

/* HEADER */

.section-header {
  text-align: center;

  margin-bottom: 65px;
}

.eyebrow {
  display: flex;

  justify-content: center;
  align-items: center;

  gap: 12px;

  color: #b89432;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.eyebrow span {
  width: 30px;

  height: 1px;

  background:
    #d4af37;
}

.script-title {
  margin-top: 22px;

  color: #c59c39;

  font-family:
    "Allura",
    cursive;

  font-size: 34px;
}

.section-header h2 {
  margin: 5px 0 15px;

  color: #29241c;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(36px, 6vw, 50px);

  font-weight: 400;

  line-height: 0.95;
}

.section-header h2 em {
  color: #8d7a59;

  font-style: italic;
}

.gold-symbol {
  color: #d4af37;

  font-size: 7px;
}

/* COUPLE */

.couple-grid {
  display: grid;

  grid-template-columns:
    1fr
    80px
    1fr;

  align-items: center;

  gap: 20px;
}

.person-card {
  text-align: center;
}

.person-image-wrap {
  position: relative;

  width: min(
    100%,
    280px
  );

  margin: auto;
}

.person-image-frame {
  position: relative;

  aspect-ratio: 0.78;

  overflow: hidden;

  background: #eee8dc;

  border:
    1px solid
    rgba(180,142,40,0.55);

  padding: 7px;
}

.person-image {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  filter:
    saturate(0.88)
    contrast(1.02);

  transition:
    transform 0.7s ease;
}

.person-card:hover
.person-image {
  transform: scale(1.04);
}

.Image-placeholder {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #c6a34b;

  font-family:
    "Allura",
    cursive;

  font-size: 70px;

  background:
    linear-gradient(
      145deg,
      #eee8dc,
      #f8f3e8
    );
}

.Image-corner {
  position: absolute;

  width: 35px;
  height: 35px;

  border-color: #d4af37;

  border-style: solid;

  pointer-events: none;
}

.top-left {
  top: -4px;
  left: -4px;

  border-width:
    1px 0 0 1px;
}

.bottom-right {
  right: -4px;
  bottom: -4px;

  border-width:
    0 1px 1px 0;
}

/* PERSON */

.person-content {
  padding-top: 27px;
}

.person-role {
  color: #b3944a;

  font-family: Arial, sans-serif;

  font-size: 8px;

  letter-spacing: 3px;
}

.person-content h3 {
  margin:
    7px 0 12px;

  color: #2c271f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 38px;

  font-weight: 400;
}

.person-divider {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;
}

.person-divider span {
  width: 25px;

  height: 1px;

  background:
    #d4af37;
}

.person-divider i {
  color: #d4af37;

  font-size: 7px;

  font-style: normal;
}

.person-description {
  max-width: 260px;

  margin:
    15px auto;

  color: #817564;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;

  line-height: 1.5;
}

.parents {
  margin-top: 18px;

  color: #756957;

  font-size: 13px;

  line-height: 1.7;
}

.parents-label {
  margin-bottom: 3px;

  color: #b3944a;

  font-family: Arial, sans-serif;

  font-size: 7px;

  letter-spacing: 2px;
}

/* CENTER */

.couple-center {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 18px;
}

.center-line {
  width: 1px;

  height: 75px;

  background:
    linear-gradient(
      180deg,
      transparent,
      #d4af37,
      transparent
    );
}

.center-heart {
  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    #d4af37;

  border-radius: 50%;

  color: #c59c39;

  font-size: 15px;
}

.center-monogram {
  color: #c59c39;

  font-family:
    "Allura",
    cursive;

  font-size: 25px;
}

/* MOBILE */

@media (max-width: 650px) {
  .eg-couple {
    padding:
      75px 25px;
  }

  .section-header {
    margin-bottom: 45px;
  }

  .couple-grid {
    grid-template-columns: 1fr;

    gap: 45px;
  }

  .couple-center {
    flex-direction: row;

    gap: 15px;
  }

  .center-line {
    width: 45px;
    height: 1px;
  }

  .person-image-wrap {
    width: min(
      100%,
      250px
    );
  }

  .person-content h3 {
    font-size: 34px;
  }
}
</style>