<template>
  <section class="wedding-section" id="wedding-events">
    <v-container class="invite-container">

      <h2 class="title">
        THÔNG TIN LỄ CƯỚI
      </h2>

      <!-- Cha mẹ -->
      <div class="family-wrapper">

        <div class="family">
          <div class="family-label">Bố Mẹ</div>

          <div class="family-name">
            Ông: {{ wedding.brideFather }}
          </div>

          <div class="family-name">
            Bà: {{ wedding.brideMother }}
          </div>

          <p>
            {{ wedding.brideAddress }}
          </p>
        </div>

        <div class="divider"></div>

        <div class="family">
          <div class="family-label">Bố Mẹ</div>

          <div class="family-name">
            Ông: {{ wedding.groomFather }}
          </div>

          <div class="family-name">
            Bà: {{ wedding.groomMother }}
          </div>

          <p>
            {{ wedding.groomAddress }}
          </p>
        </div>

      </div>

      <!-- Cô dâu -->
      <div class="person-name">
        {{ wedding.bride }}
      </div>

      <div class="person-role">
        CÔ DÂU
      </div>

      <div class="and">&</div>

      <!-- Chú rể -->
      <div class="person-name">
        {{ wedding.groom }}
      </div>

      <div class="person-role">
        CHÚ RỂ
      </div>

      <div class="event-text">
        LỄ VU QUY ĐƯỢC CỬ HÀNH TẠI
      </div>

      <div class="event-place">
        {{ wedding.location }}
      </div>

      <div class="event-time">
        VÀO LÚC {{ firstEvent?.time }}
      </div>

      <!-- Ngày -->
      <div class="calendar">

        <span>
          {{ firstEvent?.weekday || "CHỦ NHẬT" }}
        </span>

        <div class="day">
          {{ firstEvent?.day || "29" }}
        </div>

        <span>
          THÁNG {{ firstEvent?.month || "03" }}
        </span>

      </div>

      <div class="year">
        {{ firstEvent?.year || "2026" }}
      </div>

      <div class="lunar">
        {{ firstEvent?.lunar || "(Tức ngày 11 tháng 2 năm Bính Ngọ)" }}
      </div>

    </v-container>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const firstEvent = computed(() => {
  return store.wedding.events?.[0] ?? {};
});
</script>

<style scoped>

.wedding-section {

    padding:100px 0;
    background:#f7f2ea;
    position:relative;

}

/* nền giấy */

.wedding-section::before{

    content:"";
    position:absolute;
    inset:0;

    background:
        radial-gradient(rgba(0,0,0,.02) 1px, transparent 1px);

    background-size:18px 18px;
    opacity:.4;
}

.invite-container{

    max-width:900px;
    position:relative;
    z-index:2;
    text-align:center;
}

.title{

    color:#7a1d1d;
    font-size:38px;
    margin-bottom:70px;

    font-family:"Cormorant Garamond",serif;
    font-weight:700;
}

.family-wrapper{

    display:grid;
    grid-template-columns:1fr 1px 1fr;
    gap:50px;
    align-items:start;

    margin-bottom:90px;
}

.divider{

    background:#9b4b4b;
    width:1px;
    height:140px;
    margin:auto;
}

.family{

    color:#6d2020;
}

.family-label{

    margin-bottom:12px;

    font-size:22px;
    font-family:"Cormorant Garamond",serif;
}

.family-name{

    font-size:22px;
    font-weight:600;
    margin:10px 0;
}

.family p{

    margin-top:20px;
    line-height:1.8;
}

.person-name{

    font-size:72px;
    color:#7b1f1f;

    font-family:"Cormorant Garamond",serif;
    font-weight:400;

    margin-top:20px;
}

.person-role{

    margin-top:10px;
    letter-spacing:7px;
    color:#7b1f1f;
    font-size:14px;
}

.and{

    font-size:54px;
    color:#7b1f1f;
    margin:20px 0;
    font-family:"Cormorant Garamond",serif;
}

.event-text{

    margin-top:70px;
    color:#7b1f1f;
    font-size:24px;
    line-height:2;
}

.event-place{

    color:#7b1f1f;
    font-size:28px;
    font-weight:600;
}

.event-time{

    margin-top:20px;
    color:#7b1f1f;
    font-size:24px;
}

.calendar{

    display:flex;
    justify-content:center;
    align-items:flex-end;
    gap:25px;

    margin-top:55px;
}

.calendar span{

    color:#7b1f1f;
    font-size:22px;
}

.day{

    font-size:90px;
    color:#7b1f1f;

    line-height:1;

    font-family:"Cormorant Garamond",serif;
}

.year{

    margin-top:15px;
    font-size:42px;
    color:#7b1f1f;

    font-family:"Cormorant Garamond",serif;
}

.lunar{

    margin-top:10px;
    color:#7b1f1f;
    font-style:italic;
}

@media(max-width:768px){

    .family-wrapper{

        grid-template-columns:1fr;
        gap:40px;
    }

    .divider{
        display:none;
    }

    .person-name{
        font-size:48px;
    }

    .day{
        font-size:60px;
    }

    .calendar{

        flex-direction:column;
        align-items:center;
        gap:5px;
    }

    .title{

        font-size:30px;
    }

}

</style>