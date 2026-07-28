<template>
  <section class="gift-section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Hộp Quà Mừng</div>
        <h2>Gửi Lời Chúc & Quà Mừng</h2>
        <p>Mỗi lời chúc và món quà đều là niềm vui lớn với chúng mình.</p>
      </div>

      <v-row class="gift-grid">
        <v-col v-for="gift in gifts" :key="gift.id" cols="12" md="6">
          <div class="gift-card">
            <div class="gift-icon">
              <v-icon size="28" color="pink">{{ gift.icon }}</v-icon>
            </div>
            <h3>{{ gift.title }}</h3>
            <p>{{ gift.description }}</p>
          </div>
        </v-col>
      </v-row>

      <div class="bank-wrapper">
        <div class="bank-summary">
          <h3>Thông Tin Tài Khoản</h3>
          <p>Nếu quý khách muốn gửi quà, xin vui lòng tham khảo thông tin dưới đây.</p>
        </div>

        <v-row class="bank-grid">
          <v-col v-for="bank in banks" :key="bank.id" cols="12" md="6">
            <div class="bank-card">
              <div class="bank-card-top">
                <div>
                  <h4>{{ bank.bankName }}</h4>
                  <p><strong>Chủ tài khoản:</strong> {{ bank.accountName }}</p>
                  <p><strong>Số tài khoản:</strong> {{ bank.number }}</p>
                </div>
              </div>
              <div class="qr-box">
                <span>QR</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();
const gifts = computed(() => store.wedding.gifts ?? []);
const banks = computed(() => store.wedding.banks ?? []);
</script>

<style scoped>
.gift-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff7f6 0%, #fffdfc 100%);
}
.section-header {
  text-align: center;
  margin-bottom: 56px;
}
.sub-title {
  letter-spacing: 4px;
  color: #c86c8a;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.section-header h2 {
  font-size: 2.5rem;
  color: #3c2a2d;
  margin-bottom: 10px;
}
.section-header p {
  color: #7d6b70;
  max-width: 680px;
  margin: 0 auto;
}
.gift-grid {
  gap: 24px;
  margin-bottom: 48px;
}
.gift-card {
  padding: 34px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.93);
  border: 1px solid rgba(222, 155, 178, 0.24);
  box-shadow: 0 20px 52px rgba(0, 0, 0, 0.08);
}
.gift-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ffe5ed;
  margin-bottom: 18px;
}
.gift-card h3 {
  color: #3b2a2e;
  margin-bottom: 12px;
}
.gift-card p {
  color: #6f6067;
  line-height: 1.75;
}
.bank-wrapper {
  display: grid;
  gap: 24px;
}
.bank-summary {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}
.bank-summary h3 {
  margin-bottom: 12px;
  color: #3c2b2f;
}
.bank-summary p {
  margin: 0;
  color: #7e6b72;
}
.bank-grid {
  gap: 24px;
}
.bank-card {
  padding: 28px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(222, 155, 178, 0.22);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.08);
  display: grid;
  gap: 18px;
}
.bank-card-top h4 {
  margin: 0 0 10px;
  color: #3c2a2f;
}
.bank-card-top p {
  margin: 0 0 4px;
  color: #6d5d65;
}
.qr-box {
  width: 110px;
  height: 110px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #ffd8e6, #fff5f9);
  color: #c74775;
  font-weight: 700;
  font-size: 1.15rem;
}
</style>