<template>
  <section class="timeline-section">
    <v-container>
      <div class="section-header">
        <div class="sub-title">Thông Tin Tiệc Cưới</div>
        <h2>Lịch Trình Trong Ngày</h2>
        <p>Chi tiết các mốc quan trọng để khách mời có thể sẵn sàng tham dự đúng giờ.</p>
      </div>

      <div class="timeline-layout">
        <div class="timeline-card">
          <div class="timeline-card-header">
            <h3>Tiệc cưới sẽ diễn ra vào lúc</h3>
            <div class="timeline-date">16:30 · 28/03/2026</div>
          </div>

          <div class="timeline-items">
            <div class="timeline-item">
              <div class="timeline-time">16:00</div>
              <div>
                <h4>Đón khách</h4>
                <p>Chuẩn bị, chào đón và hướng dẫn khách mời.</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-time">16:30</div>
              <div>
                <h4>Khai tiệc</h4>
                <p>Chính thức bắt đầu tiệc cưới với phần chào mừng.</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-time">18:30</div>
              <div>
                <h4>Tiệc chính</h4>
                <p>Ăn uống, múa hát và chụp ảnh cùng gia đình, bạn bè.</p>
              </div>
            </div>
          </div>

          <v-btn
            class="calendar-btn"
            color="pink"
            rounded="lg"
            target="_blank"
            href="https://www.google.com/calendar/render?action=TEMPLATE&text=Ti%E1%BB%87c%20c%C6%B0%E1%BB%9Di%20&dates=20260328T093000Z/20260328T113000Z&ctz=Asia%2FBangkok"
          >
            Thêm vào lịch
          </v-btn>
        </div>

        <div class="countdown-card">
          <h3>Cùng đếm ngược</h3>
          <HeroCountdown />
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import HeroCountdown from "@/components/hero/HeroCountdown.vue";
</script>

<style scoped>
.timeline-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #fff9f7 0%, #fff 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.sub-title {
  color: #c96f88;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 10px;
}

.section-header h2 {
  /* font-size: 2.5rem; */
  color: #3d2b2f;
  margin-bottom: 12px;
}

.section-header p {
  color: #7e6c73;
  max-width: 680px;
  margin: 0 auto;
}

.timeline-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

.timeline-card,
.countdown-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32px;
  padding: 36px;
  border: 1px solid rgba(220, 145, 168, 0.2);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.08);
}

.timeline-card-header {
  margin-bottom: 28px;
}

.timeline-card-header h3 {
  margin: 0 0 12px;
  color: #3b2a2d;
}

.timeline-date {
  /* font-size: 1.35rem; */
  font-weight: 700;
  color: #b95f7d;
}

.timeline-items {
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 20px;
  align-items: center;
  padding: 18px 20px;
  background: #fff3f6;
  border-radius: 22px;
}

.timeline-time {
  font-weight: 700;
  color: #933e5c;
}

.timeline-item h4 {
  margin: 0 0 6px;
  color: #3c2a2e;
}

.timeline-item p {
  margin: 0;
  color: #7a636d;
}

.calendar-btn {
  width: 100%;
  font-weight: 700;
}

.countdown-card h3 {
  margin-bottom: 24px;
  color: #3c2a2f;
}

@media (max-width: 980px) {
  .timeline-layout {
    grid-template-columns: 1fr;
  }
}
</style>