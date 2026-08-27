<template>
  <section class="eg-story">

    <div class="story-background" />

    <div class="story-inner">

      <div class="story-label">
        OUR STORY
      </div>

      <div class="story-script">
        Câu chuyện của chúng mình
      </div>

      <div class="story-quote">
        “
      </div>

      <h2>
        Từ một cuộc gặp gỡ
        <br />
        <em>đến một đời bên nhau</em>
      </h2>

      <div class="story-divider">
        <span></span>
        <i>✦</i>
        <span></span>
      </div>

      <div
        v-if="storyDescription"
        class="story-description"
      >
        {{ storyDescription }}
      </div>

      <div
        v-if="storyItems.length"
        class="story-timeline"
      >
        <article
          v-for="(item, index) in storyItems"
          :key="index"
          class="story-item"
        >
          <div class="story-year">
            {{ item.year }}
          </div>

          <div class="story-dot">
            ◆
          </div>

          <div class="story-item-content">
            <h3>
              {{ item.Title }}
            </h3>

            <p>
              {{ item.description }}
            </p>
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
  story: {
    type: Object,
    default: () => ({}),
  },
});

const storyDescription = computed(() => {
  return (
    props.story?.description ||
    props.story?.content ||
    ""
  );
});

const storyItems = computed(() => {
  if (
    Array.isArray(
      props.story?.items
    )
  ) {
    return props.story.items;
  }

  if (
    Array.isArray(
      props.story?.timeline
    )
  ) {
    return props.story.timeline;
  }

  return [];
});
</script>

<style scoped>
.eg-story {
  position: relative;

  padding:
    105px 40px;

  overflow: hidden;

  color: #f8f1df;

  background:
    #211e18;
}

.story-background {
  position: absolute;

  inset: 0;

  opacity: 0.22;

  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(212,175,55,0.18),
      transparent 30%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(212,175,55,0.12),
      transparent 30%
    );
}

.eg-story::before {
  content: "";

  position: absolute;

  inset: 22px;

  border:
    1px solid
    rgba(212,175,55,0.16);

  pointer-events: none;
}

.story-inner {
  position: relative;

  z-index: 2;

  width: min(
    100%,
    650px
  );

  margin: auto;

  text-align: center;
}

.story-label {
  color: #d4af37;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.story-script {
  margin-top: 20px;

  color: #d9bc68;

  font-family:
    "Allura",
    cursive;

  font-size: 34px;
}

.story-quote {
  margin-top: 20px;

  color: #d4af37;

  font-family:
    Georgia,
    serif;

  font-size: 70px;

  line-height: 0.6;

  opacity: 0.75;
}

.story-inner h2 {
  margin: 20px 0;

  color: #fff8e8;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(35px, 6vw, 50px);

  font-weight: 400;

  line-height: 1;
}

.story-inner h2 em {
  color: #d8bd76;

  font-style: italic;
}

.story-divider {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 180px;

  margin: 30px auto;
}

.story-divider span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #d4af37
    );
}

.story-divider span:last-child {
  background:
    linear-gradient(
      90deg,
      #d4af37,
      transparent
    );
}

.story-divider i {
  color: #d4af37;

  font-size: 8px;

  font-style: normal;
}

.story-description {
  color:
    rgba(248,241,223,0.76);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 18px;

  line-height: 1.75;

  white-space: pre-line;
}

/* TIMELINE */

.story-timeline {
  position: relative;

  margin-top: 65px;

  text-align: left;
}

.story-timeline::before {
  content: "";

  position: absolute;

  top: 0;
  bottom: 0;
  left: 95px;

  width: 1px;

  background:
    linear-gradient(
      180deg,
      transparent,
      rgba(212,175,55,0.55),
      transparent
    );
}

.story-item {
  position: relative;

  display: grid;

  grid-template-columns:
    75px
    40px
    1fr;

  align-items: start;

  margin-bottom: 42px;
}

.story-year {
  padding-top: 3px;

  color: #d4af37;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 18px;

  text-align: right;
}

.story-dot {
  position: relative;

  z-index: 2;

  width: 12px;
  height: 12px;

  margin:
    7px auto 0;

  color: #d4af37;

  font-size: 6px;

  text-align: center;
}

.story-item-content {
  padding-left: 10px;
}

.story-item-content h3 {
  margin: 0 0 5px;

  color: #f7edcf;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 25px;

  font-weight: 400;
}

.story-item-content p {
  margin: 0;

  color:
    rgba(248,241,223,0.6);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;

  line-height: 1.6;
}

@media (max-width: 600px) {
  .eg-story {
    padding:
      80px 28px;
  }

  .eg-story::before {
    inset: 10px;
  }

  .story-description {
    font-size: 17px;
  }

  .story-timeline::before {
    left: 70px;
  }

  .story-item {
    grid-template-columns:
      55px
      30px
      1fr;
  }

  .story-item-content h3 {
    font-size: 22px;
  }
}
</style>