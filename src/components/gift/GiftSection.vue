<template>
  <section class="gift-section">

    <v-container>

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
                :key="gift.id"
            >

                <div class="qr-card">

                    <img
                        :src="gift.qrCode"
                        class="qr-image"
                    />

                </div>

                <div class="bank-name">
                    {{ gift.bankName }}
                </div>

                <div class="account-number">
                    {{ gift.accountNumber }}
                </div>

                <div class="account-name">
                    {{ gift.accountName }}
                </div>

            </div>

        </div>

    </v-container>

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

.gift-grid{

    position:relative;

    display:flex;
    justify-content:center;
    gap:45px;
    flex-wrap:wrap;

}

.gift-item{

    text-align:center;
}

.qr-card{

    width:170px;
    height:170px;

    background:#fff;

    border-radius:18px;

    padding:10px;

    display:flex;
    align-items:center;
    justify-content:center;

    box-shadow:
        0 8px 25px rgba(0,0,0,.25),
        inset 0 0 0 2px #ececec;

    transition:.3s;
}

.qr-card:hover{

    transform:translateY(-6px);
}

.qr-image{

    width:100%;
    height:100%;
    object-fit:contain;
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

    .gift-grid{

        gap:28px;
    }

    .qr-card{

        width:145px;
        height:145px;
    }

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