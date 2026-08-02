<template>
  <section class="section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Sổ Lưu Bút</div>
        <h2>Những lời chúc yêu thương</h2>
        <p>Mỗi câu chúc đều là một lời gửi gắm đầy ấm áp cho ngày lễ đặc biệt này.</p>
      </div>

      <div class="guestbook-list">
        <div class="guestbook-card">
          <p>“Chúc hai bạn luôn bên nhau, hạnh phúc và trọn vẹn trong từng ngày tháng tới.”</p>
          <span>— Nguyễn Văn A</span>
        </div>
        <div class="guestbook-card">
          <p>“Một ngày cưới đẹp như mơ, một cuộc đời hạnh phúc như mong đợi.”</p>
          <span>— Trần Văn B</span>
        </div>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.section {
  padding: 90px 0 100px;
}
.section-header {
  text-align: center;
  margin-bottom: 42px;
}
.sub-title {
  color: #c57c78;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 0.85rem;
}
.section-header h2 {
  margin: 0 0 10px;
  font-family: "Cormorant Garamond", serif;
  font-size: 2rem;
  color: #4d3537;
}
.section-header p {
  margin: 0 auto;
  color: #7a6768;
  max-width: 680px;
  line-height: 1.8;
}
.guestbook-list {
  display: grid;
  gap: 18px;
  max-width: 760px;
  margin: 0 auto;
}
.guestbook-card {
  padding: 24px 28px;
  border-radius: 22px;
  background: rgba(255, 250, 245, 0.95);
  border: 1px solid rgba(205, 166, 152, 0.22);
  box-shadow: 0 16px 40px rgba(93, 61, 54, 0.07);
}
.guestbook-card p {
  margin: 0 0 10px;
  color: #5f4c4f;
  line-height: 1.8;
}
.guestbook-card span {
  color: #b16d65;
  font-weight: 600;
}
</style>