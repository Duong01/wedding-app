<template>
  <div class="countdown">

    <div
      v-for="item in countdownItems"
      :key="item.label"
      class="count-item"
    >
      <Transition name="flip" mode="out-in">

        <div
          :key="item.value"
          class="number"
        >
          {{ format(item.value) }}
        </div>

      </Transition>

      <div class="label">
        {{ item.label }}
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useWeddingStore } from "@/stores/wedding";

dayjs.extend(duration);

const store = useWeddingStore();

const now = ref(dayjs());

let timer = null;

const remain = computed(() => {

    const target = dayjs(store.wedding.weddingDate);

    const diff = target.diff(now.value);

    if (diff <= 0) {

        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

    }

    const d = dayjs.duration(diff);

    return {

        days: Math.floor(d.asDays()),

        hours: d.hours(),

        minutes: d.minutes(),

        seconds: d.seconds()

    };

});

const countdownItems = computed(() => [

    {
        label: "Ngày",
        value: remain.value.days
    },

    {
        label: "Giờ",
        value: remain.value.hours
    },

    {
        label: "Phút",
        value: remain.value.minutes
    },

    {
        label: "Giây",
        value: remain.value.seconds
    }

]);

function format(value){

    return String(value).padStart(2,"0");

}

onMounted(()=>{

    timer = setInterval(()=>{

        now.value = dayjs();

    },1000);

});

onUnmounted(()=>{

    clearInterval(timer);

});
</script>

<style scoped lang="scss">

.countdown{

    margin-top:45px;

    display:flex;

    justify-content:center;

    gap:18px;

    flex-wrap:wrap;

}

.count-item{

    width:95px;

    border-radius:22px;

    padding:18px 12px;

    backdrop-filter:blur(20px);

    background:rgba(255,255,255,.15);

    border:1px solid rgba(255,255,255,.25);

    box-shadow:0 12px 30px rgba(0,0,0,.15);

    text-align:center;

}

.number{

    font-size:42px;

    font-weight:700;

    color:white;

    line-height:1;

}

.label{

    margin-top:10px;

    color:white;

    opacity:.85;

    font-size:14px;

    letter-spacing:1px;

    text-transform:uppercase;

}

/* Animation */

.flip-enter-active,
.flip-leave-active{

    transition:all .35s ease;

}

.flip-enter-from{

    opacity:0;

    transform:rotateX(-90deg);

}

.flip-leave-to{

    opacity:0;

    transform:rotateX(90deg);

}

@media(max-width:768px){

.countdown{

gap:12px;

}

.count-item{

width:78px;

padding:14px;

}

.number{

font-size:30px;

}

.label{

font-size:12px;

}

}

@media(max-width:480px){

.count-item{

width:68px;

padding:12px;

}

.number{

font-size:26px;

}

}

</style>