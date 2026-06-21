<template>
  <v-app-bar app color="pink-lighten-5" elevate-on-scroll>
    <v-toolbar-title>
      <span>Đông <i class="fa fa-heart" aria-hidden="true"></i> Mây</span>
    </v-toolbar-title>
    <v-spacer />
    <v-btn v-for="item in menu" :key="item.text" :href="item.href" text>
      {{ item.text }}
    </v-btn>
  </v-app-bar>
</template>

<script setup>
const menu = [
  { text: 'Cặp đôi', href: '#cuple' },
  { text: 'Câu chuyện', href: '#story' },
  { text: 'Sự kiện', href: '#event' },
  { text: 'Thư viện', href: '#gallery' },
  { text: 'Gửi chúc mừng', href: '#Contact' }
]

</script>