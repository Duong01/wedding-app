<template>
  <section class="gift-section">

        <div class="section-subtitle">
            Mừng cưới
        </div>

        <h2 class="section-title">
            HỘP QUÀ MỪNG
        </h2>

        <div class="gift-grid">

            <div
                class="gift-item"
                v-for="gift in gifts"
                :key="gift.Id"
            >

                <div class="qr-card">

                    <img
                        :src="gift.QrCode"
                        class="qr-image"
                    />

                </div>

                <div class="bank-name">
                    {{ gift.BankName }}
                </div>

                <div class="account-number">
                    {{ gift.AccountNumber }}
                </div>

                <div class="account-name">
                    {{ gift.AccountName }}
                </div>

            </div>

        </div>


</section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    gifts:{
        type: Object,
        required: true,
        default: () => []
    }
})
const gifts = computed(() => props.gifts ?? []);
async function copy(text){
    await navigator.clipboard.writeText(text);

}
</script>

<style scoped>
.gift-section{

    background:var(--p-deep, #7b0d0d);
    position:relative;
    overflow:hidden;
}

.gift-section::before{

    content:"";
    position:absolute;
    inset:0;
    background:url("/images/pattern.png") center;
    opacity:.06;
}

.section-title{

    color:var(--p-gold-light, #f8dfad);
    margin-bottom:45px;
}

.section-subtitle{

    color:var(--p-gold-light, #f8dfad);
    margin-bottom:10px;
}

/* =========================================================
   GIFT GRID
   → LUÔN 2 QR TRÊN CÙNG 1 DÒNG
========================================================= */

.gift-grid {
    position: relative;

    width: 100%;
    max-width: 620px;

    margin: 0 auto;

    display: grid;

    grid-template-columns: repeat(2, minmax(0, 1fr));

    align-items: start;

    justify-content: center;

    gap: clamp(14px, 5vw, 45px);

    padding: 0 10px;

    box-sizing: border-box;
}


/* =========================================================
   GIFT ITEM
========================================================= */

.gift-item {
    min-width: 0;

    width: 100%;

    display: flex;

    flex-direction: column;

    align-items: center;

    text-align: center;
}


/* =========================================================
   QR CARD
   → TỰ CO THEO MÀN HÌNH
========================================================= */

.qr-card {
    /*
     * Desktop tối đa 170px
     * Mobile tự giảm nhưng KHÔNG BAO GIỜ làm rớt dòng
     */
    width: min(170px, 100%);

    aspect-ratio: 1 / 1;

    height: auto;

    box-sizing: border-box;

    background: #fff;

    border-radius: 18px;

    padding: clamp(6px, 2vw, 10px);

    display: flex;

    align-items: center;
    justify-content: center;

    box-shadow:
        0 8px 25px rgba(0, 0, 0, .25),
        inset 0 0 0 2px #ececec;

    animation: float 4s ease-in-out infinite;

    transition:
        transform .3s ease,
        box-shadow .3s ease;
}


/* =========================================================
   QR IMAGE
========================================================= */

.qr-image {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: contain;

    min-width: 0;
}


/* =========================================================
   TEXT
========================================================= */

.bank-name {
    width: 100%;

    margin-top: 8px;

    color: var(--p-gold-light, #f8dfad);

    font-family: var(--font-main);

    font-size: var(--text-sm);

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}


.account-number {
    width: 100%;

    margin-top: 5px;

    color: #fff;

    font-family: var(--font-heading);

    font-variant-numeric: lining-nums;

    font-size: var(--text-sm);

    font-weight: 700;

    letter-spacing: 1px;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}


.account-name {
    width: 100%;

    margin-top: 6px;

    color: var(--p-gold-light, #f8dfad);

    font-family: var(--font-main);

    font-size: var(--text-xs);

    font-weight: 600;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}


/* =========================================================
   HOVER
========================================================= */

.qr-card:hover {
    transform: translateY(-6px);

    box-shadow:
        0 14px 30px rgba(0, 0, 0, .30),
        inset 0 0 0 2px #ececec;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 768px) {

    .gift-grid {
        width: 100%;

        max-width: 100%;

        grid-template-columns: repeat(2, minmax(0, 1fr));

        gap: 16px;

        padding:
            0 6px;
    }

    .qr-card {
        width: min(145px, 100%);

        border-radius: 14px;

        padding: 7px;
    }

}


/* =========================================================
   VERY SMALL PHONE
========================================================= */

@media (max-width: 380px) {

    .gift-grid {
        gap: 10px;

        padding-left: 3px;
        padding-right: 3px;
    }

    .qr-card {
        width: min(125px, 100%);

        border-radius: 12px;

        padding: 6px;
    }

    .bank-name {
        font-size: 11px;
    }

    .account-number {
        font-size: 11px;

        letter-spacing: .5px;
    }

    .account-name {
        font-size: 10px;
    }

}


/* =========================================================
   FLOAT ANIMATION
========================================================= */

.qr-card:nth-child(2) {
    animation-delay: .8s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }

}

.bank-name{


    color:var(--p-gold-light, #f8dfad);

    font-family:var(--font-main);
    font-size:var(--text-sm);
}

.account-number{

    margin-top:5px;

    color:#fff;

    font-family:var(--font-heading);
    font-variant-numeric: lining-nums;
    font-size:var(--text-sm);

    font-weight:700;

    letter-spacing:1px;
}

.account-name{

    margin-top:6px;

    color:var(--p-gold-light, #f8dfad);

    font-family:var(--font-main);
    font-size:var(--text-xs);

    font-weight:600;
}

.copy-btn{

    margin-top:18px;

    padding:10px 24px;

    border:none;

    border-radius:30px;

    background:var(--p-gold-light, #f8dfad);

    color:var(--p-deep, #7b0d0d);

    font-family:var(--font-main);
    font-size:var(--text-sm);
    font-weight:700;

    cursor:pointer;

    transition:.3s;
}

.copy-btn:hover{

    transform:translateY(-2px);

    background:#fff;
}

@media(max-width:768px){

    .copy-btn{

        padding:8px 18px;
    }

}
.qr-card{
    animation:float 4s ease-in-out infinite;
}

.qr-card:nth-child(2){

    animation-delay:.8s;
}

@keyframes float{

    0%,100%{
        transform:translateY(0);
    }

    50%{
        transform:translateY(-8px);
    }

}
</style>