<template>
  <div class="section-header">

    <div
      v-if="subtitle"
      class="section-subtitle"
    >
      {{ subtitle }}
    </div>

    <h2
      v-if="title"
      class="section-title"
    >
      {{ title }}
    </h2>

    <div class="section-divider">
      <span></span>
      <span class="divider-heart">♥</span>
      <span></span>
    </div>

    <p
      v-if="description"
      class="section-description"
    >
      {{ description }}
    </p>

  </div>
</template>


<script setup>

defineProps({

  subtitle: {
    type: String,
    default: "",
  },

  title: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

});

</script>


<style scoped>

.section-header {

  max-width: 680px;

  margin: 0 auto 48px;

  padding: 0 20px;

  text-align: center;

}


.section-subtitle {

  margin-bottom: 8px;

  color: var(--accent);

  font-family: var(--font-main);

  font-size: 13px;

  font-weight: 600;

  letter-spacing: 0.18em;

  text-transform: uppercase;

}


.section-title {

  margin: 0;

  color: var(--heading);

  font-family: var(--font-heading);

  font-size: clamp(32px, 5vw, 46px);

  font-weight: 600;

  line-height: 1.15;

}


.section-divider {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  margin: 18px auto;

}


.section-divider span:not(.divider-heart) {

  width: 55px;

  height: 1px;

  background: var(--accent);

  opacity: 0.55;

}


.divider-heart {

  color: var(--accent);

  font-size: 13px;

}


.section-description {

  margin: 0;

  color: var(--text-secondary);

  font-family: var(--font-main);

  font-size: 16px;

  line-height: 1.8;

}


@media (max-width: 600px) {

  .section-header {

    margin-bottom: 36px;

  }


  .section-title {

    font-size: 32px;

  }


  .section-description {

    font-size: 15px;

  }

}

</style>