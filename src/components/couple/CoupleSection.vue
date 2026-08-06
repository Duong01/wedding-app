<template>
  <section class="couple-section" id="couple">

    <v-container>

      <!-- Section Title -->
      <div class="section-header">

        <div class="subtitle">
          Bride & Groom
        </div>

        <h2>
          Cô Dâu & Chú Rể
        </h2>

        <div class="line"></div>

      </div>

      <!-- Cards -->
      <v-row
        class="mt-10"
        justify="center"
      >

        <v-col
          cols="12"
          md="5"
        >
          <CoupleCard
            type="groom"
          />
        </v-col>

        <v-col
          cols="12"
          md="5"
        >
          <CoupleCard
            type="bride"
          />
        </v-col>

      </v-row>

    </v-container>

  </section>
</template>

<script setup>
import CoupleCard from "./CoupleCard.vue";
</script>

<style scoped lang="scss">

.couple-section{

    position:relative;

    background:

    linear-gradient(

        180deg,

        #fff,

        #fff8f7,

        #ffffff

    );

}

.section-header{

    text-align:center;

}

.subtitle{

    color:#d89ca7;

    letter-spacing:4px;

    text-transform:uppercase;

    font-size:13px;

    margin-bottom:12px;

}

.section-header h2{

    font-size:42px;

    font-weight:700;

    color:#444;

}

.line{

    width:80px;

    height:4px;

    border-radius:999px;

    background:#f7b5c0;

    margin:25px auto;

}

@media(max-width:600px){

.section-header h2{

font-size:30px;

}

}

</style>