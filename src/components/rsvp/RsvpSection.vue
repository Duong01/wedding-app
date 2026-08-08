<template>
  <section class="section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">RSVP</div>
        <h2>Xác Nhận Tham Dự</h2>
        <p>Hãy để lại lời chúc và cho chúng mình biết bạn sẽ đến cùng nhé.</p>
      </div>

      <div class="form-card">
        <v-form class="form-grid">
          <v-text-field label="Họ tên" variant="outlined" rounded="lg" />
          <v-text-field label="Số điện thoại" variant="outlined" rounded="lg" />
          <v-select label="Số lượng" :items="[1, 2, 3, 4, 5]" variant="outlined" rounded="lg" />
          <v-textarea label="Lời chúc" rows="4" variant="outlined" rounded="lg" />
          <v-btn color="pink" size="large" block class="submit-btn">Xác nhận</v-btn>
        </v-form>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%);
}
.section-header {
  text-align: center;
  margin-bottom: 56px;
}
.sub-title {
  color: #d88a9c;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 10px;
}
.section-header h2 {
  /* font-size: 2rem; */
  color: #3f2a2a;
  margin-bottom: 10px;
}
.section-header p {
  color: #7a6a6a;
}
.form-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(216, 138, 156, 0.16);
}
.form-grid {
  display: grid;
  gap: 16px;
}
.submit-btn {
  margin-top: 8px;
  border-radius: 16px;
  font-weight: 700;
}
</style>