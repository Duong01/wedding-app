<template>

<div class="music">

    <audio

        ref="audio"

        loop

        preload="auto"

    ></audio>

    <Transition name="zoom">

        <div

            class="music-btn"

            :class="{playing:store.playing}"

            @click="toggle"

        >

            <v-icon size="32">

                {{

                    store.playing

                    ?

                    'mdi-disc'

                    :

                    'mdi-music'

                }}

            </v-icon>

        </div>

    </Transition>

</div>

</template>

<script setup>

import {

onMounted,

ref

}

from "vue";

import {

useMusic

}

from "@/composables/useMusic";

const audio=ref();

const{

store,

init,

play,

pause

}=useMusic();

onMounted(()=>{

    init(audio.value);

});

function toggle(){

    if(store.playing)

        pause();

    else

        play();

}

</script>

<style scoped>

.music{

position:fixed;

right:20px;

bottom:30px;

z-index:9999;

}

.music-btn{

width:70px;

height:70px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

cursor:pointer;

color:white;

background:linear-gradient(

135deg,

#ff7aa2,

#ff4d88

);

box-shadow:

0 15px 40px rgba(0,0,0,.25);

transition:.35s;

}

.music-btn:hover{

transform:scale(1.08);

}

.music-btn.playing{

animation:rotate 4s linear infinite;

}

@keyframes rotate{

from{

transform:rotate(0deg);

}

to{

transform:rotate(360deg);

}

}

.zoom-enter-active,

.zoom-leave-active{

transition:.35s;

}

.zoom-enter-from,

.zoom-leave-to{

opacity:0;

transform:scale(.5);

}

@media(max-width:600px){

.music-btn{

width:58px;

height:58px;

}

}

</style>