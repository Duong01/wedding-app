<template>
  <v-card
    ref="card"
    class="couple-card"
    elevation="0"
  >
    <!-- Avatar -->
    <div class="avatar-wrapper">

      <v-avatar
        size="170"
        class="avatar"
      >
        <v-img
          :src="person.avatar"
          cover
        />
      </v-avatar>

    </div>

    <!-- Name -->
    <h2 class="name">
      {{ person.name }}
    </h2>

    <!-- Job -->
    <div class="job">
      {{ person.job }}
    </div>

    <!-- Description -->
    <p class="description">
      {{ person.description }}
    </p>

    <v-divider class="my-5" />

    <!-- Family -->
    <div class="family">

      <div class="family-item">

        <v-icon color="primary">
          mdi-account
        </v-icon>

        <span>Cha:</span>

        <strong>{{ person.father }}</strong>

      </div>

      <div class="family-item">

        <v-icon color="pink">
          mdi-account-heart
        </v-icon>

        <span>Mẹ:</span>

        <strong>{{ person.mother }}</strong>

      </div>

    </div>

    <v-divider class="my-5" />

    <!-- Social -->
    <div class="social">

      <v-btn
        icon
        variant="text"
        :href="person.facebook"
        target="_blank"
      >
        <v-icon>
          mdi-facebook
        </v-icon>
      </v-btn>

      <v-btn
        icon
        variant="text"
        :href="person.instagram"
        target="_blank"
      >
        <v-icon>
          mdi-instagram
        </v-icon>
      </v-btn>

      <v-btn
        icon
        variant="text"
        :href="person.tiktok"
        target="_blank"
      >
        <v-icon>
          mdi-music-note
        </v-icon>
      </v-btn>

    </div>

  </v-card>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { gsap } from "gsap";
import { useWeddingStore } from "@/stores/wedding";

const props = defineProps({
  type: {
    type: String,
    default: "groom"
  }
});

const card = ref();

const store = useWeddingStore();

const person = computed(() => {

  if (props.type === "groom") {

    return store.wedding.couple?.groom ?? {
      name: "Nguyễn Đức Huy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
      job: "Founder / Product Designer",
      description: "Người luôn tin rằng một mái ấm hạnh phúc được xây từ sự tử tế, chung tay và yêu thương mỗi ngày.",
      father: "Ông Nguyễn Văn Minh",
      mother: "Bà Phạm Thị Hồng",
      facebook: "#",
      instagram: "#",
      tiktok: "#"
    };

  }

  return store.wedding.couple?.bride ?? {
    name: "Trần Thu Thảo",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    job: "Brand Strategist",
    description: "Người yêu những điều nhỏ bé, lãng mạn và luôn muốn biến mỗi ngày trở nên đáng nhớ hơn.",
    father: "Ông Trần Văn Nam",
    mother: "Bà Lê Thị Hoa",
    facebook: "#",
    instagram: "#",
    tiktok: "#"
  };

});

onMounted(() => {

  gsap.from(card.value, {

    y: 80,

    opacity: 0,

    duration: 1,

    ease: "power3.out"

  });

});
</script>

<style scoped lang="scss">

.couple-card{

    padding:40px;

    border-radius:30px;

    background:rgba(255,255,255,.75);

    backdrop-filter:blur(16px);

    transition:.4s;

    border:1px solid rgba(255,255,255,.4);

    box-shadow:0 20px 50px rgba(0,0,0,.08);

}

.couple-card:hover{

    transform:translateY(-10px);

    box-shadow:0 30px 60px rgba(0,0,0,.15);

}

.avatar-wrapper{

    display:flex;

    justify-content:center;

    margin-bottom:25px;

}

.avatar{

    border:5px solid #fff;

    box-shadow:0 10px 30px rgba(0,0,0,.15);

}

.name{

    text-align:center;

    font-size:32px;

    font-weight:700;

    color:#444;

}

.job{

    text-align:center;

    color:#d48b98;

    margin-top:8px;

    font-weight:600;

}

.description{

    margin-top:25px;

    line-height:1.8;

    color:#666;

    text-align:center;

}

.family{

    display:flex;

    flex-direction:column;

    gap:18px;

}

.family-item{

    display:flex;

    align-items:center;

    gap:10px;

    color:#555;

}

.family-item span{

    min-width:40px;

}

.social{

    display:flex;

    justify-content:center;

    gap:12px;

}

.social .v-btn{

    transition:.3s;

}

.social .v-btn:hover{

    transform:translateY(-4px) scale(1.1);

}

@media(max-width:600px){

.couple-card{

padding:24px;

}

.name{

font-size:26px;

}

.avatar{

width:140px !important;

height:140px !important;

}

}

</style>