<template>
  <section id="gallery" class="section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Our Memories</div>
        <h2>Thư Viện Ảnh</h2>
        <p>Những khoảnh khắc đáng nhớ của chúng mình.</p>
      </div>

      <v-row>
        <v-col
          v-for="i in 6"
          :key="i"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card rounded="xl">
            <v-img
              height="260"
              src="https://picsum.photos/600/800?random=1"
              cover
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.section{
    padding:100px 0;
    background:#fff;
}
.section-header{
    text-align:center;
    margin-bottom:60px;
}
.sub-title{
    color:#d88a9c;
    letter-spacing:4px;
    text-transform:uppercase;
}
</style>