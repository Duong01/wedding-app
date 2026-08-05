<template>
<section class="event-section">

  <v-container class="invite">

    <div class="section-head">
      <span class="sub-title">Wedding Event</span>

      <h2 class="title">
        THÔNG TIN TIỆC CƯỚI
      </h2>

      <p class="desc">
        Trân trọng kính mời Quý khách đến chung vui cùng gia đình
      </p>
    </div>

    <!-- Thời gian -->
    <div class="event-info">

      <div class="time">
        {{ firstEvent.time }}
      </div>

      <div class="calendar-date">
        <span>{{ firstEvent.weekday }}</span>

        <div class="day">
          {{ firstEvent.day }}
        </div>

        <span>THÁNG {{ firstEvent.month }}</span>
      </div>

      <div class="year">
        {{ firstEvent.year }}
      </div>

      <div class="lunar">
        {{ firstEvent.lunar }}
      </div>

    </div>

    <!-- Đón khách -->
    <div class="schedule">

      <div class="schedule-item">
        <small>ĐÓN KHÁCH</small>
        <strong>{{ firstEvent.guestTime }}</strong>
      </div>

      <div class="divider"></div>

      <div class="schedule-item">
        <small>KHAI TIỆC</small>
        <strong>{{ firstEvent.partyTime }}</strong>
      </div>

    </div>

    <!-- Lịch -->
    <WeddingCalendar
      class="calendar-card"
      :year="Number(firstEvent.year)"
      :month="Number(firstEvent.month)"
      :day="Number(firstEvent.day)"
    />

    <!-- Button -->
    <div class="action">

      <a
        class="calendar-link"
        :href="calendarUrl"
        target="_blank"
      >
        📅 Thêm vào Google Calendar
      </a>

      <button
        class="confirm-btn"
        @click="$emit('confirm')"
      >
        XÁC NHẬN THAM DỰ
      </button>

    </div>

  </v-container>

</section>
</template>

<script setup>
import {computed} from "vue";
import {useWeddingStore} from "@/stores/wedding";

const store=useWeddingStore();

const firstEvent=computed(()=>store.wedding.events?.[0]??{});
console.log(firstEvent)
const calendarUrl=computed(()=>{

return `https://calendar.google.com/calendar/render?action=TEMPLATE`;

});
</script>

<style scoped>
.event-section{
    padding:90px 20px;
    background:#f7f2ea;
}

.invite{
    max-width:760px;
    margin:auto;
    text-align:center;
}

.section-head{
    margin-bottom:45px;
}

.sub-title{
    display:block;
    color:#c09a74;
    letter-spacing:4px;
    text-transform:uppercase;
    font-size:13px;
    margin-bottom:10px;
}

.title{
    font-size:42px;
    color:#7b1f1f;
    font-family:"Cormorant Garamond",serif;
}

.desc{
    margin-top:10px;
    color:#666;
    font-size:16px;
}

.time{
    font-size:34px;
    color:#7b1f1f;
    font-weight:700;
    margin-bottom:25px;
}

.calendar-date{
    display:flex;
    justify-content:center;
    align-items:flex-end;
    gap:20px;
}

.calendar-date span{
    font-size:18px;
    color:#7b1f1f;
}

.day{
    font-size:74px;
    line-height:1;
    font-family:"Cormorant Garamond";
    color:#7b1f1f;
}

.year{
    font-size:32px;
    color:#7b1f1f;
    margin-top:10px;
}

.lunar{
    margin-top:8px;
    color:#888;
    font-style:italic;
}

.schedule{
    margin:45px auto;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:35px;
    background:#fff;
    padding:20px;
    border-radius:18px;
    box-shadow:0 10px 25px rgba(0,0,0,.08);
}

.schedule-item{
    display:flex;
    flex-direction:column;
}

.schedule-item small{
    color:#888;
    letter-spacing:2px;
    margin-bottom:8px;
}

.schedule-item strong{
    color:#7b1f1f;
    font-size:22px;
}

.divider{
    width:1px;
    height:55px;
    background:#ddd;
}

.calendar-card{
    margin:35px auto;
    max-width:500px;
}

.action{
    display:flex;
    flex-direction:column;
    gap:18px;
    align-items:center;
    margin-top:35px;
}

.calendar-link{
    color:#7b1f1f;
    text-decoration:none;
    font-weight:600;
}

.confirm-btn{
    background:#7b1f1f;
    color:#fff;
    border:none;
    border-radius:40px;
    padding:15px 42px;
    font-size:15px;
    cursor:pointer;
    transition:.3s;
}

.confirm-btn:hover{
    background:#641414;
    transform:translateY(-2px);
}

@media(max-width:768px){

.title{
    font-size:34px;
}

.time{
    font-size:28px;
}

.day{
    font-size:58px;
}

.calendar-date{
    gap:12px;
}

.calendar-date span{
    font-size:15px;
}

.year{
    font-size:28px;
}

.schedule{
    flex-direction:column;
    gap:20px;
}

.divider{
    width:60%;
    height:1px;
}

}
</style>
