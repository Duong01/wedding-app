<template>
<section class="event-section">

    <v-container class="invite">

        <h2 class="title">
            THÔNG TIN TIỆC CƯỚI
        </h2>

        <div class="desc">
            TIỆC CƯỚI SẼ DIỄN RA VÀO LÚC:
        </div>

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

        <div class="schedule">

            <div>
                <small>ĐÓN KHÁCH</small>
                <strong>{{ firstEvent.guestTime }}</strong>
            </div>

            <div>
                <small>KHAI TIỆC</small>
                <strong>{{ firstEvent.partyTime }}</strong>
            </div>

        </div>

        <WeddingCalendar
            :year="Number(firstEvent.year)"
            :month="Number(firstEvent.month)"
            :day="Number(firstEvent.day)"
        />

        <a
            class="calendar-link"
            :href="calendarUrl"
            target="_blank"
        >
            Thêm vào lịch
        </a>

        <button
            class="confirm-btn"
            @click="$emit('confirm')"
        >
            XÁC NHẬN THAM DỰ
        </button>

    </v-container>

</section>
</template>

<script setup>
import {computed} from "vue";
import {useWeddingStore} from "@/stores/wedding";

const store=useWeddingStore();

const firstEvent=computed(()=>store.wedding.events[0]);

const calendarUrl=computed(()=>{

return `https://calendar.google.com/calendar/render?action=TEMPLATE`;

});
</script>

<style scoped>
.event-section{

    background:#f7f2ea;
    padding:100px 0;
    position:relative;
}

.event-section::before{

    content:"";
    position:absolute;
    inset:0;

    background:url("/images/paper.webp");
    opacity:.18;
}

.invite{

    max-width:700px;
    text-align:center;
}

.title{

    color:#7b1f1f;

    font-size:42px;

    font-family:"Cormorant Garamond";
}

.desc{

    margin-top:25px;

    color:#7b1f1f;

    font-size:30px;
}

.time{

    margin:35px 0;

    font-size:48px;

    color:#7b1f1f;

    font-weight:bold;
}

.calendar-date{

    display:flex;

    justify-content:center;

    align-items:flex-end;

    gap:25px;
}

.calendar-date span{

    font-size:22px;

    color:#7b1f1f;
}

.day{

    font-size:86px;

    line-height:1;

    color:#7b1f1f;

    font-family:"Cormorant Garamond";
}

.year{

    margin-top:20px;

    font-size:42px;

    color:#7b1f1f;
}

.lunar{

    margin:20px 0 50px;
}

.schedule{

    display:flex;

    justify-content:center;

    gap:80px;

    margin-bottom:45px;
}

.schedule div{

    display:flex;

    flex-direction:column;

    gap:10px;
}

.schedule strong{

    color:#7b1f1f;

    font-size:30px;
}

.calendar{

    border:1px solid #c9a6a0;

    border-radius:12px;

    overflow:hidden;

    background:#fffdf9;

    margin:40px auto;
}

.calendar-header{

    padding:18px;

    border-bottom:1px solid #d9b2aa;

    font-weight:700;

    color:#7b1f1f;
}

.week,
.days{

    display:grid;

    grid-template-columns:repeat(7,1fr);
}

.week{

    border-bottom:1px solid #eee;
}

.week span{

    padding:12px 0;
}

.cell{

    height:55px;

    display:flex;

    justify-content:center;

    align-items:center;
}

.heart{

    position:relative;

    color:#8b1d1d;

    font-size:32px;
}

.heart span{

    position:absolute;

    color:#fff;

    font-size:13px;

    top:50%;
    left:50%;
    transform:translate(-50%,-55%);
}

.confirm-btn{

    margin-top:35px;

    padding:16px 40px;

    background:#8b1d1d;

    color:#fff;

    border:none;

    border-radius:12px;

    font-weight:bold;

    cursor:pointer;
}

.confirm-btn:hover{

    background:#701515;
}
</style>
