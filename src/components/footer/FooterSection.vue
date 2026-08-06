<template>
<footer class="footer">

    <div class="footer-overlay"></div>
    <p class="footer-text">
            {{ wedding.message }}
        </p>
    <v-container class="container-sm footer-content">

        <h2 class="couple-name">
            {{ wedding.groomName }}
            &
            {{ wedding.brideName }}
        </h2>

        

        <div class="copyright">
            © {{ new Date().getFullYear() }}
            {{ wedding.copyright }}
        </div>
        <div class="footer-line"></div>
        <div class="copyright">
            ngaychungdoi.com
        </div>
    </v-container>

</footer>
</template>
<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();

const wedding = computed(() => store.wedding.footer ?? {});
</script>
<style scoped>
.footer{
    position:relative;
    overflow:hidden;
    background:#7b0d0d;
}

.footer::before{

    content:"";

    position:absolute;

    inset:0;

    background:url("/images/pattern.png") center;

    opacity:.06;
}

.footer-overlay{
    position:absolute;
    inset:0;
    background:
        radial-gradient(circle at top,#b81b1b20 0%,transparent 60%);
}

.footer-content{

    position:relative;

    text-align:center;

    z-index:2;
}


.couple-name{

    font-size:20px;

    font-family:"Cormorant Garamond",serif;

    font-weight:600;

    color:#f7d8a3;

}

.couple-name span{


    color:#fff;

    font-weight:300;
}

.footer-text{
    max-width:620px;
    background: #f7d8a3;
    margin:0;
    padding: 0;
    color:rgba(65, 31, 31, 0.85);
    line-height:1.9;
}

.footer-line{

    width:120px;

    height:2px;

    margin:38px auto;

    background:rgba(247,216,163,.7);
}

.copyright{

    color:rgba(255,255,255,.65);

    font-size:11px;

    line-height:2;
}

@media(max-width:768px){

    .footer-icon{

        width:58px;
        height:58px;

        font-size:18px;
    }

    .couple-name{

        font-size:18px;

        line-height:1.4;
    }

    .couple-name span{

        display:block;

    }

    .footer-text{
        height: 70px;
        font-size:12px;
        text-align: center;
        line-height: 70px;
    }

    .copyright{

        font-size:11px;
    }

}
</style>