<template>
  <section class="guestbook-section">

    <v-container class="container-md">
        
         <h2 class="section-title">
            SỔ LƯU BÚT
        </h2>
        

        <!-- Chữ chạy -->
        <div class="wish-marquee">

            <div class="wish-track">

                <span
                    v-for="item in wishes"
                    :key="item.id"
                >
                    💛 {{ item.name }}: "{{ item.message }}"
                </span>

            </div>

        </div>

        <!-- Form -->
        <div class="guestbook-form card">

            <input
                v-model="name"
                placeholder="Tên của bạn"
            >

            <textarea
                v-model="message"
                rows="4"
                placeholder="Gửi lời chúc..."
            ></textarea>

            <div class="action">

                <button
                    class="primary-btn"
                    @click="submitWish"
                >
                    Gửi lời chúc
                </button>

            </div>

        </div>

        <!-- Danh sách -->
        <div class="wish-list">

            <div
                class="wish-card"
                v-for="item in wishes"
                :key="item.id"
            >

                <div class="avatar">
                    {{ item.name.charAt(0).toUpperCase() }}
                </div>

                <div class="content">

                    <div class="head">

                        <strong>
                            {{ item.name }}
                        </strong>

                        <small>
                            {{ item.created_at }}
                        </small>

                    </div>

                    <p>
                        {{ item.message }}
                    </p>

                </div>

            </div>

        </div>

    </v-container>

</section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    guestBook:{
        type: Object,
        required: true,
        default: () => []
    }
})
const wishes = computed(() => props.guestBook?.guest ?? []);
</script>

<style scoped>
.section-title{

    color:var(--p-gold-light, #f8dfad);
    margin-bottom:45px;
}

.guestbook-section{
  margin: 0;
    background:var(--p-deep, #7b0d0d);
    position:relative;
    overflow:hidden;
    color:#fff;
}

.guestbook-section::before{
    content:"";
    position:absolute;
    inset:0;
    background:url("/images/pattern.png") center/cover;
    opacity:.08;
}

.wish-marquee{
    overflow:hidden;
    white-space:nowrap;
    margin:30px 0 45px;
    border-top:1px solid rgba(255,255,255,.2);
    border-bottom:1px solid rgba(255,255,255,.2);
    padding:14px 0;
}

.wish-track{
    display:inline-flex;
    animation:marquee 35s linear infinite;
}

.wish-track span{
    margin-right:70px;
    color:#ffe9c5;
    font-family:var(--font-main);
    font-size:var(--text-sm);
    font-style:italic;
}

@keyframes marquee{

from{
transform:translateX(0);
}

to{
transform:translateX(-50%);
}

}

.guestbook-form{
    padding:28px;
    background:rgba(255,255,255,.08);
    backdrop-filter:blur(15px);
    border:1px solid rgba(255,255,255,.15);
    margin-bottom:40px;
}

.guestbook-form input,
.guestbook-form textarea{

    width:100%;
    padding:15px 18px;
    border-radius:14px;
    border:1px solid rgba(255,255,255,.25);
    background:rgba(255,255,255,.05);
    color:#fff;
    margin-bottom:18px;
    font-family:var(--font-main);
    font-size:var(--text-sm);
}

.guestbook-form input::placeholder,
.guestbook-form textarea::placeholder{

color:rgba(255,255,255,.55);

}

.action{

display:flex;
justify-content:flex-end;

}

.wish-list{

max-height:250px;

    overflow-y:auto;

    display:flex;

    flex-direction:column;

    gap:18px;

    padding-right:8px;

    scroll-behavior:smooth;

}
.wish-list::-webkit-scrollbar{
    width:8px;
}

.wish-list::-webkit-scrollbar-track{
    background:rgba(255,255,255,.08);
    border-radius:20px;
}

.wish-list::-webkit-scrollbar-thumb{
    background:var(--p-gold, #d8b46d);
    border-radius:20px;
}
.wish-card{
padding: 10px;
display:flex;
gap:18px;
background:rgba(255,255,255,.08);
border-radius:22px;
border:1px solid rgba(255,255,255,.18);
backdrop-filter:blur(12px);
transition:.35s;

}

.wish-card:hover{

transform:translateY(-4px);

background:rgba(255,255,255,.12);

}

.avatar{

width:58px;
height:58px;
border-radius:50%;
background:var(--p-gold, #d8b46d);
color:var(--p-deep, #7b0d0d);
font-family:var(--font-heading);
font-size:var(--text-lg);
font-weight:bold;
display:flex;
justify-content:center;
align-items:center;
flex-shrink:0;

}

.content{

flex:1;

}

.head{

display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:10px;

}

.head strong{

font-family:var(--font-main);
font-size:var(--text-md);
color:#fff;

}

.head small{

color:#ffe2b8;

}

.content p{

margin:0;
color:#fff;
line-height:1.8;

}

@media(max-width:768px){

.guestbook-form{

padding:20px;

}

.wish-card{

gap:14px;

}

.avatar{

width:48px;
height:48px;

}

.head{

flex-direction:column;
align-items:flex-start;
gap:4px;

}

.wish-track span{

margin-right:45px;

}

}
</style>