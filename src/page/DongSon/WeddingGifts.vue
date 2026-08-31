<template>
  <section class="gifts">
    <div class="gift-symbol">
      ✦
    </div>

    <div class="title">
      <small>A LITTLE GIFT</small>
      <h2>Hộp quà mừng cưới</h2>
      <p>
        Sự hiện diện của bạn đã là món quà quý giá nhất.
      </p>
    </div>

    <div class="gift-list">
      <article
        v-for="(gift, index) in gifts"
        :key="gift.id || index"
        class="gift-card"
      >
        <div class="gift-top">
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <b>✦</b>
        </div>

        <h3>
          {{ gift.name || gift.title || "Mừng cưới" }}
        </h3>

        <div class="qr-placeholder">
          <img
            v-if="gift.qrCode || gift.qr"
            :src="gift.qrCode || gift.qr"
            alt="QR"
          />
          <span v-else>QR</span>
        </div>

        <p>
          {{ gift.accountName || gift.owner || "" }}
        </p>

        <strong>
          {{ gift.accountNumber || gift.number || "" }}
        </strong>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  gifts: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.gifts {
  padding: 70px 20px;
  background: #f3ead8;
  color: #641914;
  text-align: center;
}

.gift-symbol {
  width: 55px;
  height: 55px;
  margin: auto;
  display: grid;
  place-items: center;
  border: 1px solid #a96b32;
  border-radius: 50%;
  color: #a96b32;
}

.title {
  margin: 22px auto 35px;
  max-width: 450px;
}

.title small {
  font-size: 8px;
  letter-spacing: .4em;
  color: #a96b32;
}

h2 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.title p {
  font-family: Georgia, serif;
  font-style: italic;
  color: #80675f;
  line-height: 1.7;
}

.gift-list {
  display: grid;
  gap: 20px;
  max-width: 570px;
  margin: auto;
}

.gift-card {
  padding: 25px;
  border: 1px solid rgba(143,36,28,.35);
  background: rgba(255,255,255,.2);
}

.gift-top {
  display: flex;
  justify-content: space-between;
  color: #a96b32;
  font-size: 9px;
}

.gift-card h3 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: 400;
}

.qr-placeholder {
  width: 145px;
  height: 145px;
  margin: 20px auto;
  display: grid;
  place-items: center;
  border: 1px solid #a96b32;
  background: #fffaf0;
}

.qr-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-placeholder span {
  color: #a96b32;
  font-size: 12px;
}

.gift-card p {
  margin: 5px 0;
  color: #80675f;
  font-size: 12px;
}

.gift-card strong {
  color: #641914;
  letter-spacing: .1em;
}
</style>