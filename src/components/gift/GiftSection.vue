<template>
  <section class="section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Wedding Gift</div>
        <h2>Mừng Cưới</h2>
        <p>Những món quà nhỏ sẽ mang đến cho chúng mình thêm nhiều niềm vui và động lực.</p>
      </div>

      <v-row justify="center">
        <v-col v-for="gift in gifts" :key="gift.id" cols="12" md="6">
          <div class="gift-card">
            <div class="gift-icon">
              <v-icon size="26" color="pink">{{ gift.icon }}</v-icon>
            </div>
            <h3>{{ gift.title }}</h3>
            <p>{{ gift.description }}</p>
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-8" justify="center">
        <v-col v-for="bank in banks" :key="bank.id" cols="12" md="6">
          <div class="bank-card">
            <h3>{{ bank.bankName }}</h3>
            <p><strong>Chủ tài khoản:</strong> {{ bank.accountName }}</p>
            <p><strong>Số tài khoản:</strong> {{ bank.number }}</p>
            <div class="qr-box">
              <span>QR</span>
            </div>
          </div>
        </v-col>
      </v-row>
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
.section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff8fb 0%, #ffffff 100%);
}
.section-header {
  text-align: center;
  margin-bottom: 56px;
}
.sub-title {
  letter-spacing: 4px;
  color: #d88a9c;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.section-header h2 {
  font-size: 2rem;
  color: #3f2a2a;
  margin-bottom: 10px;
}
.section-header p {
  color: #7a6a6a;
}
.gift-card,
.bank-card {
  padding: 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(216, 138, 156, 0.16);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.gift-card:hover,
.bank-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 42px rgba(0, 0, 0, 0.12);
}
.gift-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ffe4eb;
  margin-bottom: 14px;
}
.gift-card h3,
.bank-card h3 {
  color: #3f2a2a;
  margin-bottom: 10px;
}
.gift-card p,
.bank-card p {
  color: #6f6a6a;
  line-height: 1.7;
}
.qr-box {
  margin-top: 16px;
  width: 92px;
  height: 92px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #ffd7e3, #fff6f9);
  color: #d88a9c;
  font-weight: 700;
  font-size: 1.1rem;
}
</style>