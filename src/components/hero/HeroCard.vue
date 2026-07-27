<template>
  <div ref="card" class="hero-card">

<div class="invite-text">
  Wedding Invitation
</div>

<h3 class="guest">
  {{ guestName }}
</h3>

<p class="welcome">
  Trân trọng kính mời
</p>

<!-- Couple -->

<div class="couple">

  <div class="avatar">

    <v-avatar
      size="90"
      class="avatar-item"
    >
      <v-img :src="groomImage" cover />
    </v-avatar>

  </div>

  <div class="heart">

    <v-icon
      color="pink"
      size="42"
    >
      mdi-heart
    </v-icon>

  </div>

  <div class="avatar">

    <v-avatar
      size="90"
      class="avatar-item"
    >
      <v-img :src="brideImage" cover />
    </v-avatar>

  </div>

</div>

<h1 class="names">

  {{ groomName }}

  <span>&</span>

  {{ brideName }}

</h1>

<div class="date">

  {{ weddingDate }}

</div>

<div class="address">

  {{ address }}

</div>

<v-btn

  size="x-large"

  rounded="pill"

  color="pink"

  class="open-btn"

  @click="$emit('open')"

>

  <v-icon start>

    mdi-email-open-heart-outline

  </v-icon>

  MỞ THIỆP

</v-btn>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

const props = defineProps({

  guestName: String,

  groomName: String,

  brideName: String,

  groomImage: String,

  brideImage: String,

  weddingDate: String,

  address: String

});

defineEmits(["open"]);

const card = ref();

onMounted(() => {

  gsap.from(card.value, {

    y: 80,

    opacity: 0,

    duration: 1.4,

    ease: "power3.out"

  });

});
</script>

<style scoped lang="scss">

.hero-card{

    position:absolute;

    left:50%;

    top:50%;

    transform:translate(-50%,-50%);

    width:min(92%,520px);

    padding:45px;

    border-radius:35px;

    text-align:center;

    color:white;

    backdrop-filter:blur(22px);

    background:rgba(255,255,255,.18);

    border:1px solid rgba(255,255,255,.25);

    box-shadow:

    0 20px 60px rgba(0,0,0,.25);

}

.invite-text{

    letter-spacing:5px;

    font-size:13px;

    text-transform:uppercase;

    opacity:.85;

}

.guest{

    margin-top:18px;

    font-size:32px;

    font-family:cursive;

}

.welcome{

    margin:12px 0 28px;

    opacity:.9;

}

.couple{

    display:flex;

    justify-content:center;

    align-items:center;

    gap:20px;

    margin-bottom:30px;

}

.avatar-item{

    border:4px solid rgba(255,255,255,.85);

}

.heart{

    animation:heartBeat .9s infinite;

}

.names{

    font-size:40px;

    line-height:1.4;

    font-weight:700;

}

.names span{

    color:#ffd54f;

    margin:0 10px;

}

.date{

    margin-top:20px;

    font-size:22px;

}

.address{

    margin-top:10px;

    opacity:.9;

}

.open-btn{

    margin-top:35px;

    font-weight:bold;

    letter-spacing:2px;

    transition:.35s;

}

.open-btn:hover{

    transform:translateY(-3px) scale(1.03);

}

@keyframes heartBeat{

0%,100%{

transform:scale(1);

}

50%{

transform:scale(1.25);

}

}

@media(max-width:600px){

.hero-card{

padding:28px 22px;

}

.guest{

font-size:24px;

}

.names{

font-size:28px;

}

.date{

font-size:18px;

}

}

</style>
