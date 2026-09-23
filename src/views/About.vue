<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: 'Giới thiệu' }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">Về chúng tôi</p>

        <h1>
          Chúng tôi làm thiệp cưới
          <em>cho người Việt.</em>
        </h1>

        <p class="mk-hero__lead">
          {{ BRAND.name }} ra đời từ một điều rất giản dị: ngày cưới ai cũng
          xứng đáng có một tấm thiệp đẹp, nhưng không phải ai cũng có thời
          gian và tiền bạc để thuê thiết kế riêng.
        </p>

        <ul class="mk-hero__stats">
          <li v-for="stat in ABOUT_STATS" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- =====================================================
         CÂU CHUYỆN
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-narrow story">
        <p class="mk-eyebrow">Câu chuyện</p>

        <h2 class="story-title">
          Bắt đầu từ một tấm thiệp
          <em>bị in sai ngày.</em>
        </h2>

        <div class="story-body">
          <p>
            Năm 2023, một người trong nhóm chúng tôi chuẩn bị cưới. Thiệp giấy
            đặt in xong mới phát hiện sai giờ tiệc. Sửa thì phải in lại toàn
            bộ, mà gửi đi rồi thì không thu hồi được. Cả nhà cuống lên gọi
            từng khách để xin lỗi.
          </p>

          <p>
            Hôm đó chúng tôi nhận ra: thiệp giấy không sai — nhưng nó thiếu
            khả năng sửa. Một tấm thiệp online thì không như vậy. Bạn sửa một
            lần, tất cả khách mời mở link đều thấy nội dung mới.
          </p>

          <p>
            Chúng tôi bắt đầu dựng {{ BRAND.name }} với một nguyên tắc: mọi
            thứ phải đẹp như thiệp in, nhưng linh hoạt như một trang web. Ba
            năm sau, hơn mười hai nghìn cặp đôi đã gửi thiệp qua đây.
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
         GIÁ TRỊ
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Giá trị</p>

          <h2>
            Bốn điều chúng tôi
            <em>không thỏa hiệp.</em>
          </h2>
        </header>

        <RailHint text="Vuốt ngang để xem đủ bốn giá trị" />

        <div class="mk-grid mk-grid--4">
          <article v-for="value in VALUES" :key="value.title" class="mk-card">
            <span class="mk-orn" aria-hidden="true">{{ value.orn }}</span>

            <h3>{{ value.title }}</h3>

            <p>{{ value.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CÁCH LÀM VIỆC
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Cách chúng tôi làm</p>

          <h2>
            Thiệp được dựng như một
            <em>sản phẩm thật.</em>
          </h2>
        </header>

        <RailHint text="Vuốt ngang để xem đủ ba bước" />

        <div class="mk-grid mk-grid--3">
          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">壹</span>

            <h3>Thiết kế theo bộ sưu tập</h3>

            <p>
              Mỗi mẫu không phải một bảng màu tô lên cùng một bố cục. Năm bộ
              sưu tập có nhịp chữ, họa tiết và tỉ lệ khác nhau — chọn sai bộ
              vẫn đẹp, chỉ là khác gu.
            </p>
          </article>

          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">贰</span>

            <h3>Kiểm tra trên máy thật</h3>

            <p>
              Hơn 90% khách mời mở thiệp bằng điện thoại. Mọi mẫu đều được
              kiểm trên màn hình nhỏ trước, rồi mới tới máy tính — không làm
              ngược lại.
            </p>
          </article>

          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">叁</span>

            <h3>Hỗ trợ có người thật</h3>

            <p>
              Không chatbot, không trả lời máy. Bạn nhắn là có người đọc và
              trả lời — kể cả ngoài giờ hành chính, kể cả trước ngày cưới một
              hôm.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CTA
    ====================================================== -->
    <section class="mk-section mk-section--tight">
      <div class="mk-container">
        <div class="mk-grid mk-grid--2">
          <router-link
            :to="{ name: 'Templates' }"
            class="mk-card link-card"
          >
            <span class="mk-orn" aria-hidden="true">囍</span>

            <h3>Xem bộ sưu tập mẫu thiệp</h3>

            <p>
              Hơn hai mươi mẫu thiệp thuộc năm bộ sưu tập — chọn hướng rồi
              xem toàn bộ mẫu trong đó.
            </p>

            <span class="link-more">
              Xem mẫu thiệp <span aria-hidden="true">→</span>
            </span>
          </router-link>

          <router-link :to="{ name: 'Contact' }" class="mk-card link-card">
            <span class="mk-orn" aria-hidden="true">❝</span>

            <h3>Nói chuyện với tụi mình</h3>

            <p>
              Có yêu cầu riêng, cần thiết kế theo ý, hay chỉ muốn hỏi trước
              khi bắt đầu — nhắn tụi mình bất cứ lúc nào.
            </p>

            <span class="link-more">
              Liên hệ <span aria-hidden="true">→</span>
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <FinalCta
      title="Cùng tụi mình làm"
      title-accent="tấm thiệp của bạn."
      text="Tạo miễn phí, dùng thử 3 ngày — chỉ thanh toán khi bạn thật sự ưng ý."
    />
  </main>
</template>

<script setup>
import PageBreadcrumb from "@/components/marketing/PageBreadcrumb.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";
import RailHint from "@/components/marketing/RailHint.vue";

import { useSeo, organizationJsonLd } from "@/composables/useSeo";

import { ABOUT_STATS, BRAND, VALUES } from "@/data/siteContent";

useSeo({
  title: "Giới thiệu",
  description:
    `${BRAND.name} — nền tảng tạo thiệp cưới online cho người Việt. ` +
    "Hơn 12.000 cặp đôi đã gửi thiệp qua đây. Tạo miễn phí, dùng thử 3 ngày.",
  path: "/gioi-thieu",
  jsonLd: organizationJsonLd(),
});
</script>

<style scoped>
.story-title {
  margin: 0 0 24px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 600;

  line-height: 1.15;
}

.story-title em {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.story-body {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.story-body p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 16px;

  line-height: 1.9;
}

.link-card {
  display: flex;
  flex-direction: column;

  text-decoration: none;
}

.link-more {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  margin-top: 18px;

  color: var(--studio-seal, #a63a2e);

  font-size: 13px;
  font-weight: 650;
}
</style>
