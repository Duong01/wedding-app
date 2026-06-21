<template>

<section class="section">

<v-container>

<div class="section-header">

<div class="sub-title">

Location

</div>

<h2>

Địa Điểm

</h2>

</div>

<v-responsive
aspect-ratio="16/9"
>

<iframe

src="https://maps.google.com/maps?q=Hanoi&t=&z=13&ie=UTF8&iwloc=&output=embed"

width="100%"

height="100%"

style="border:0"

loading="lazy"

></iframe>

</v-responsive>

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
color:#d88a9c;
}
</style>