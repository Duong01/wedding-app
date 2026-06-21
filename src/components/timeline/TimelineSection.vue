<template>
  <section class="section">

    <v-container>

      <div class="section-header">

        <div class="sub-title">
          Wedding Timeline
        </div>

        <h2>Lịch Trình</h2>

      </div>

      <v-timeline side="end">

        <v-timeline-item
          dot-color="pink"
          size="small"
        >
          08:00 - Đón khách
        </v-timeline-item>

        <v-timeline-item
          dot-color="pink"
          size="small"
        >
          09:00 - Làm lễ
        </v-timeline-item>

        <v-timeline-item
          dot-color="pink"
          size="small"
        >
          11:00 - Tiệc cưới
        </v-timeline-item>

      </v-timeline>

    </v-container>

  </section>
</template>

<style scoped>
.section{
padding:100px 0;
background:#fff7f7;
}

.section-header{
text-align:center;
margin-bottom:60px;
}

.sub-title{
letter-spacing:4px;
text-transform:uppercase;
color:#d88a9c;
}
</style>