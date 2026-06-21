<template>

<div class="timeline">

    <div class="line"></div>

    <StoryCard

        v-for="(item,index) in stories"

        :key="item.id"

        :story="item"

        :reverse="index%2"

    />

</div>

</template>

<script setup>

import { computed } from "vue";

import StoryCard from "./StoryCard.vue";

import { useWeddingStore } from "@/stores/wedding";

const store=useWeddingStore();

const stories=computed(()=>{

return store.wedding.story ?? [];

});

</script>

<style scoped>

.timeline{

position:relative;

max-width:1100px;

margin:auto;

}

.line{

position:absolute;

left:50%;

top:0;

bottom:0;

width:4px;

background:

linear-gradient(

#f3ccd5,

#f7a8b9,

#f3ccd5

);

transform:translateX(-50%);

border-radius:999px;

}

@media(max-width:960px){

.line{

left:30px;

}

}

</style>