<template>
  <section class="wedding-list">
    <v-container>
      <div class="page-header">
        <div class="sub-title">Wedding Invitation</div>

        <h1>Những mẫu thiệp cưới</h1>

        <p>Lựa chọn mẫu thiệp phù hợp với ngày trọng đại của bạn.</p>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="loading">Đang tải...</div>

      <!-- Error -->
      <div v-else-if="store.error" class="error-message">
        {{ store.error }}
      </div>

      <!-- Không có dữ liệu -->
      <div v-else-if="weddings.length === 0" class="empty-message">
        Chưa có mẫu thiệp cưới nào.
      </div>

      <!-- Danh sách thiệp -->
      <v-row v-else>
        <v-col
          v-for="wedding in weddings"
          :key="wedding.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <article class="wedding-card" @click="openWedding(wedding)">
            <!-- Cover -->
            <div class="wedding-cover">
              <img
                :src="wedding.coverImage"
                :alt="getCoupleName(wedding)"
                loading="lazy"
                @error="handleImageError"
              />

              <div class="cover-overlay">
                <span> Xem thiệp </span>
              </div>
            </div>

            <!-- Thông tin -->
            <div class="wedding-info">
              <h2>
                {{ wedding.couple?.bride?.name || "" }}
                &
                {{ wedding.couple?.groom?.name || "" }}
              </h2>

              <p>
                {{ formatDate(wedding.weddingDate) }}
              </p>

              <button type="button" @click.stop="openWedding(wedding)">
                Xem thiệp
              </button>
            </div>
          </article>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>


<script setup>
import { computed, onMounted } from "vue";

import { useRouter } from "vue-router";

import { useWeddingStore } from "@/stores/wedding";

const router = useRouter();

const store = useWeddingStore();
/*
 * Danh sách thiệp cho Home
 */
const weddings = computed(() => {
  return store.weddings || [];
});

/*
 * Load danh sách thiệp
 */
onMounted(async () => {
  await store.loadWeddings();

  console.log("Danh sách wedding:", store.weddings);
});

function getCoupleName(wedding) {
  const bride = wedding?.couple?.bride?.name || "";

  const groom = wedding?.couple?.groom?.name || "";

  return `${bride} & ${groom}`;
}
/*
 * Click vào thiệp
 */
function openWedding(wedding) {
  console.log(wedding.slug);
  router.push({
    name: "WeddingBySlug",
    params: {
      slug: wedding.slug,
    },
  });
}

/*
 * Format ngày
 */
function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}
</script>


<style scoped>
.wedding-list {
  min-height: 100vh;
  padding: 80px 0 100px;

  background: linear-gradient(135deg, #fff8f8 0%, #fffdfb 50%, #fff7f5 100%);
}

/* Header */

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.sub-title {
  margin-bottom: 10px;

  color: #c76a7e;

  font-size: 0.8rem;
  font-weight: 700;

  letter-spacing: 0.3em;

  text-transform: uppercase;
}

.page-header h1 {
  margin: 0 0 12px;

  color: #4d3537;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(2rem, 4vw, 3rem);

  font-weight: 600;
}

.page-header p {
  max-width: 650px;

  margin: 0 auto;

  color: #7a6768;

  line-height: 1.8;
}

/* Loading */

.loading {
  padding: 80px 20px;

  text-align: center;

  color: #9a7378;

  font-size: 1rem;
}

/* Error */

.error-message {
  padding: 40px 20px;

  text-align: center;

  color: #b64c5f;

  background: #fff0f2;

  border-radius: 20px;
}

/* Empty */

.empty-message {
  padding: 80px 20px;

  text-align: center;

  color: #8b7779;
}

/* Card */

.wedding-card {
  height: 100%;

  overflow: hidden;

  cursor: pointer;

  background: #fff;

  border: 1px solid rgba(205, 166, 152, 0.18);

  border-radius: 24px;

  box-shadow: 0 15px 45px rgba(93, 61, 54, 0.08);

  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.wedding-card:hover {
  transform: translateY(-8px);

  box-shadow: 0 25px 60px rgba(93, 61, 54, 0.15);
}

/* Cover */

.wedding-cover {
  position: relative;

  width: 100%;

  aspect-ratio: 3 / 4;

  overflow: hidden;

  background: #f5eeee;
}

.wedding-cover img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  transition: transform 0.6s ease;
}

.wedding-card:hover .wedding-cover img {
  transform: scale(1.05);
}

/* Overlay */

.cover-overlay {
  position: absolute;

  inset: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  opacity: 0;

  background: rgba(67, 35, 40, 0.35);

  transition: opacity 0.35s ease;
}

.wedding-card:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay span {
  padding: 11px 22px;

  color: #fff;

  font-size: 0.9rem;

  font-weight: 600;

  border: 1px solid rgba(255, 255, 255, 0.7);

  border-radius: 999px;

  backdrop-filter: blur(8px);
}

/* Info */

.wedding-info {
  padding: 20px;
}

.wedding-info h2 {
  margin: 0 0 7px;

  color: #4d3537;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 1.35rem;

  font-weight: 600;

  text-align: center;
}

.wedding-info p {
  margin: 0 0 15px;

  color: #a16f76;

  font-size: 0.9rem;

  text-align: center;
}

/* Button */

.wedding-info button {
  width: 100%;

  padding: 11px 16px;

  border: 0;

  border-radius: 999px;

  color: #fff;

  background: linear-gradient(135deg, #c97885, #ad5d6d);

  font-size: 0.9rem;

  font-weight: 600;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wedding-info button:hover {
  transform: translateY(-2px);

  box-shadow: 0 8px 20px rgba(173, 93, 109, 0.25);
}

/* Mobile */

@media (max-width: 600px) {
  .wedding-list {
    padding: 55px 0 70px;
  }

  .page-header {
    margin-bottom: 35px;
  }

  .wedding-info {
    padding: 16px;
  }
}
</style>