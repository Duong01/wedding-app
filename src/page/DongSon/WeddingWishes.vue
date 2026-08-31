<template>
  <section class="wishes">
    <div class="wishes-header">
      <div class="wish-star">✦</div>
      <small>GUEST BOOK</small>
      <h2>Lời chúc yêu thương</h2>
      <p>
        Những lời chúc sẽ trở thành một phần
        ký ức đẹp của chúng mình.
      </p>
    </div>

    <div
      v-if="wishes.length"
      class="wish-list"
    >
      <article
        v-for="(wish, index) in wishes"
        :key="wish.id || index"
        class="wish-card"
      >
        <div class="wish-mark">“</div>

        <p>
          {{ wish.content || wish.message || wish.Wish || "" }}
        </p>

        <div class="wish-author">
          <span />
          <b>
            {{ wish.name || wish.GuestName || "Một người bạn" }}
          </b>
          <span />
        </div>
      </article>
    </div>

    <div v-else class="empty-wishes">
      <span>✦</span>
      <p>
        Hãy để lại một lời chúc thật đẹp
        cho đôi uyên ương.
      </p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  wishes: {
    type: Array,
    default: () => [],
  },
  wedding: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped>
.wishes {
  padding: 70px 20px;
  background:
    radial-gradient(circle at center, rgba(201,149,82,.13), transparent 40%),
    #641914;
  color: #ead7b5;
  text-align: center;
}

.wishes-header {
  max-width: 500px;
  margin: auto;
}

.wish-star {
  margin-bottom: 20px;
  color: #c99552;
}

.wishes-header small {
  font-size: 8px;
  letter-spacing: .4em;
  color: #c99552;
}

h2 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 31px;
  font-weight: 400;
}

.wishes-header p {
  font-family: Georgia, serif;
  font-style: italic;
  line-height: 1.8;
  color: #cdb99b;
}

.wish-list {
  display: grid;
  gap: 15px;
  max-width: 600px;
  margin: 35px auto 0;
}

.wish-card {
  padding: 25px 20px;
  border: 1px solid rgba(201,149,82,.3);
  background: rgba(0,0,0,.08);
}

.wish-mark {
  font-family: Georgia, serif;
  font-size: 35px;
  color: #c99552;
}

.wish-card p {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 14px;
  line-height: 1.9;
}

.wish-author {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.wish-author span {
  width: 30px;
  height: 1px;
  background: #a96b32;
}

.wish-author b {
  font-size: 8px;
  letter-spacing: .2em;
  font-weight: 400;
  color: #c99552;
}

.empty-wishes {
  max-width: 350px;
  margin: 35px auto 0;
  padding: 30px;
  border: 1px solid rgba(201,149,82,.3);
}

.empty-wishes span {
  color: #c99552;
}

.empty-wishes p {
  font-family: Georgia, serif;
  line-height: 1.8;
}
</style>