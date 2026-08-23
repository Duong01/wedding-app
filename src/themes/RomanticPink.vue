<template>
  <div
    class="wedding-page"
    :data-theme="themeName"
    :style="themeStyle"
  >

    <!-- =========================================================
         OPEN INVITATION
    ========================================================== -->
    <Transition name="open-fade">
      <div
        v-if="!isOpened"
        class="opening-screen"
      >

        <div
          class="opening-background"
          :style="{
            backgroundImage: `url(${coverImage})`
          }"
        ></div>

        <div class="opening-overlay"></div>

        <div class="opening-decoration decoration-1">
          ♡
        </div>

        <div class="opening-decoration decoration-2">
          ✦
        </div>

        <div class="opening-card">

          <span class="opening-small">
            {{ heroSubtitle || 'SAVE THE DATE' }}
          </span>

          <div class="opening-line"></div>

          <h1>
            {{ groomName }}
          </h1>

          <span class="opening-and">
            &
          </span>

          <h1>
            {{ brideName }}
          </h1>

          <div class="opening-date">
            {{ formattedWeddingDate }}
          </div>

          <p v-if="wedding?.opening?.message">
            {{ wedding.opening.message }}
          </p>

          <button
            class="open-button"
            type="button"
            @click="openInvitation"
          >
            <span>♡</span>
            Mở thiệp
          </button>

        </div>

      </div>
    </Transition>


    <!-- =========================================================
         MAIN INVITATION
    ========================================================== -->
    <div
      v-if="isOpened"
      class="invitation-content"
    >

      <!-- =======================================================
           FLOATING MUSIC
      ======================================================== -->
      <button
        v-if="musicUrl && showMusic"
        class="music-button"
        :class="{ playing: isPlaying }"
        type="button"
        @click="toggleMusic"
        aria-label="Bật tắt nhạc"
      >
        <span class="music-icon">
          {{ isPlaying ? '♫' : '♪' }}
        </span>

        <span class="music-wave">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </button>

      <audio
        ref="audioPlayer"
        :src="musicUrl"
        loop
        preload="none"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      ></audio>


      <!-- =======================================================
           HERO
      ======================================================== -->
      <section
        class="hero-section"
        data-reveal
      >

        <div
          class="hero-image"
          :style="{
            backgroundImage: `url(${coverImage})`
          }"
        ></div>

        <div class="hero-overlay"></div>

        <div class="hero-content">

          <span class="hero-label">
            {{ heroSubtitle || 'WE ARE GETTING MARRIED' }}
          </span>

          <div class="hero-line"></div>

          <h1 class="hero-groom">
            {{ groomName }}
          </h1>

          <div class="hero-heart">
            <span></span>
            <b>♡</b>
            <span></span>
          </div>

          <h1 class="hero-bride">
            {{ brideName }}
          </h1>

          <div class="hero-date">
            {{ formattedWeddingDate }}
          </div>

          <button
            class="hero-scroll"
            type="button"
            @click="scrollToSection('invitation')"
          >
            <span>Khám phá câu chuyện</span>
            <b>↓</b>
          </button>

        </div>

      </section>


      <!-- =======================================================
           COUNTDOWN
      ======================================================== -->
      <section
        v-if="wedding?.weddingDate"
        class="countdown-section"
        data-reveal
      >

        <div class="section-container">

          <span class="section-eyebrow">
            The Big Day
          </span>

          <h2>
            Đếm ngược đến ngày chung đôi
          </h2>

          <p class="section-description">
            Một ngày đặc biệt đang đến gần...
          </p>

          <div class="countdown">

            <div class="count-item">
              <strong>{{ countdown.days }}</strong>
              <span>Ngày</span>
            </div>

            <div class="count-separator">:</div>

            <div class="count-item">
              <strong>{{ countdown.hours }}</strong>
              <span>Giờ</span>
            </div>

            <div class="count-separator">:</div>

            <div class="count-item">
              <strong>{{ countdown.minutes }}</strong>
              <span>Phút</span>
            </div>

            <div class="count-separator">:</div>

            <div class="count-item">
              <strong>{{ countdown.seconds }}</strong>
              <span>Giây</span>
            </div>

          </div>

        </div>

      </section>


      <!-- =======================================================
           INVITATION MESSAGE
      ======================================================== -->
      <section
        id="invitation"
        v-if="hasInvitation"
        class="invitation-section"
        data-reveal
      >

        <div class="floral-decoration top">
          ❧
        </div>

        <div class="section-container narrow">

          <span class="section-eyebrow">
            Invitation
          </span>

          <h2>
            {{ invitationTitle }}
          </h2>

          <div class="ornament">
            <span></span>
            ♡
            <span></span>
          </div>

          <p class="invitation-text">
            {{ invitationMessage }}
          </p>

          <p
            v-if="invitationDescription"
            class="invitation-description"
          >
            {{ invitationDescription }}
          </p>

          <div class="signature">
            <span>
              Trân trọng,
            </span>

            <strong>
              {{ groomName }} & {{ brideName }}
            </strong>
          </div>

        </div>

      </section>


      <!-- =======================================================
           LOVE STORY
      ======================================================== -->
      <section
        v-if="storyItems.length"
        class="story-section"
        data-reveal
      >

        <div class="section-container">

          <div class="section-heading">

            <span class="section-eyebrow">
              Our Story
            </span>

            <h2>
              Câu chuyện của chúng mình
            </h2>

            <p
              v-if="storyDescription"
              class="section-description"
            >
              {{ storyDescription }}
            </p>

          </div>


          <div class="story-timeline">

            <article
              v-for="(item, index) in storyItems"
              :key="item.id || index"
              class="story-item"
            >

              <div class="story-dot">
                <span>♡</span>
              </div>

              <div class="story-content">

                <span class="story-date">
                  {{ item.date }}
                </span>

                <h3>
                  {{ item.title }}
                </h3>

                <p>
                  {{ item.description }}
                </p>

                <div
                  v-if="item.image"
                  class="story-image"
                >
                  <img
                    :src="item.image"
                    :alt="item.title"
                    loading="lazy"
                  />
                </div>

              </div>

            </article>

          </div>

        </div>

      </section>


      <!-- =======================================================
           COUPLE
      ======================================================== -->
      <section
        v-if="hasCouple"
        class="couple-section"
        data-reveal
      >

        <div class="section-container">

          <div class="section-heading">

            <span class="section-eyebrow">
              The Couple
            </span>

            <h2>
              Hai trái tim, một hành trình
            </h2>

          </div>


          <div class="couple-grid">

            <!-- BRIDE -->
            <article
              v-if="bride"
              class="person-card bride-card"
            >

              <div class="person-image-wrapper">

                <div class="person-ring"></div>

                <img
                  :src="bride.avatar || defaultAvatar"
                  :alt="bride.name"
                  loading="lazy"
                />

              </div>

              <span class="person-role">
                {{ bride.role || 'Cô dâu' }}
              </span>

              <h3>
                {{ bride.name }}
              </h3>

              <p
                v-if="bride.description"
                class="person-description"
              >
                {{ bride.description }}
              </p>

              <div class="family-info">

                <div v-if="bride.father">
                  <span>Con gái</span>
                  <strong>{{ bride.father }}</strong>
                </div>

                <div v-if="bride.mother">
                  <span>Và</span>
                  <strong>{{ bride.mother }}</strong>
                </div>

              </div>

            </article>


            <!-- HEART -->
            <div class="couple-heart">
              <span>♡</span>
            </div>


            <!-- GROOM -->
            <article
              v-if="groom"
              class="person-card groom-card"
            >

              <div class="person-image-wrapper">

                <div class="person-ring"></div>

                <img
                  :src="groom.avatar || defaultAvatar"
                  :alt="groom.name"
                  loading="lazy"
                />

              </div>

              <span class="person-role">
                {{ groom.role || 'Chú rể' }}
              </span>

              <h3>
                {{ groom.name }}
              </h3>

              <p
                v-if="groom.description"
                class="person-description"
              >
                {{ groom.description }}
              </p>

              <div class="family-info">

                <div v-if="groom.father">
                  <span>Con trai</span>
                  <strong>{{ groom.father }}</strong>
                </div>

                <div v-if="groom.mother">
                  <span>Và</span>
                  <strong>{{ groom.mother }}</strong>
                </div>

              </div>

            </article>

          </div>

        </div>

      </section>


      <!-- =======================================================
           FAMILIES
      ======================================================== -->
      <section
        v-if="hasFamilies"
        class="families-section"
        data-reveal
      >

        <div class="section-container">

          <div class="section-heading">

            <span class="section-eyebrow">
              Our Families
            </span>

            <h2>
              Gia đình hai bên
            </h2>

          </div>


          <div class="families-grid">

            <div
              v-if="bride"
              class="family-card"
            >

              <span class="family-label">
                Nhà gái
              </span>

              <h3>
                Gia đình cô dâu
              </h3>

              <div class="family-line"></div>

              <p v-if="bride.father">
                Ông
                <strong>{{ bride.father }}</strong>
              </p>

              <p v-if="bride.mother">
                Bà
                <strong>{{ bride.mother }}</strong>
              </p>

            </div>


            <div
              v-if="groom"
              class="family-card"
            >

              <span class="family-label">
                Nhà trai
              </span>

              <h3>
                Gia đình chú rể
              </h3>

              <div class="family-line"></div>

              <p v-if="groom.father">
                Ông
                <strong>{{ groom.father }}</strong>
              </p>

              <p v-if="groom.mother">
                Bà
                <strong>{{ groom.mother }}</strong>
              </p>

            </div>

          </div>

        </div>

      </section>


      <!-- =======================================================
           WEDDING DATE
      ======================================================== -->
      <section
        v-if="wedding?.weddingDate"
        class="date-section"
        data-reveal
      >

        <div class="date-background"></div>

        <div class="date-content">

          <span class="section-eyebrow">
            Save The Date
          </span>

          <div class="big-date">

            <span class="date-weekday">
              {{ weddingWeekday }}
            </span>

            <strong>
              {{ weddingDay }}
            </strong>

            <span class="date-month">
              THÁNG {{ weddingMonth }}
            </span>

            <span class="date-year">
              {{ weddingYear }}
            </span>

          </div>

          <div class="date-ornament">
            <span></span>
            ♡
            <span></span>
          </div>

          <p>
            {{ weddingTime }}
          </p>

        </div>

      </section>


      <!-- =======================================================
           EVENTS
      ======================================================== -->
      <section
        v-if="events.length"
        class="events-section"
        data-reveal
      >

        <div class="section-container">

          <div class="section-heading">

            <span class="section-eyebrow">
              Wedding Events
            </span>

            <h2>
              Lịch trình ngày cưới
            </h2>

            <p class="section-description">
              Những khoảnh khắc quan trọng trong ngày đặc biệt của chúng mình.
            </p>

          </div>


          <div class="events-grid">

            <article
              v-for="(event, index) in events"
              :key="event.id || index"
              class="event-card"
            >

              <div class="event-number">
                {{ String(index + 1).padStart(2, '0') }}
              </div>

              <span class="event-weekday">
                {{ event.weekday }}
              </span>

              <strong class="event-day">
                {{ event.day }}
              </strong>

              <span class="event-month">
                THÁNG {{ event.month }} · {{ event.year }}
              </span>

              <div class="event-divider"></div>

              <div class="event-time">
                {{ event.time }}
              </div>

              <h3>
                {{ event.title || event.type || 'Sự kiện' }}
              </h3>

              <p class="event-location">
                {{ event.location }}
              </p>

              <p
                v-if="event.address"
                class="event-address"
              >
                {{ event.address }}
              </p>

              <a
                v-if="event.map"
                :href="event.map"
                target="_blank"
                rel="noopener noreferrer"
                class="map-button"
              >
                Xem bản đồ
                <span>↗</span>
              </a>

            </article>

          </div>

        </div>

      </section>


      <!-- =======================================================
           GALLERY
      ======================================================== -->
      <section
        v-if="gallery.length"
        class="gallery-section"
        data-reveal
      >

        <div class="section-container">

          <div class="section-heading">

            <span class="section-eyebrow">
              Our Memories
            </span>

            <h2>
              Những khoảnh khắc đẹp
            </h2>

            <p class="section-description">
              Cùng chúng mình nhìn lại những khoảnh khắc đáng nhớ.
            </p>

          </div>


          <div class="gallery-grid">

            <button
              v-for="(image, index) in gallery"
              :key="image.id || index"
              class="gallery-item"
              :class="{
                'gallery-large': index % 5 === 0 ||
                  index % 5 === 3
              }"
              type="button"
              @click="openGallery(index)"
            >

              <img
                :src="getGalleryImage(image)"
                :alt="
                  image.caption ||
                  `Ảnh cưới ${index + 1}`
                "
                loading="lazy"
              />

              <span class="gallery-overlay">
                <span>＋</span>
              </span>

            </button>

          </div>


          <button
            v-if="gallery.length > 6"
            type="button"
            class="view-gallery-button"
            @click="openGallery(0)"
          >
            Xem toàn bộ album
            <span>→</span>
          </button>

        </div>

      </section>


      <!-- =======================================================
           VIDEO
      ======================================================== -->
      <section
        v-if="videoUrl"
        class="video-section"
        data-reveal
      >

        <div class="video-container">

          <div
            class="video-cover"
            :style="{
              backgroundImage:
                videoThumbnail
                  ? `url(${videoThumbnail})`
                  : undefined
            }"
          >

            <div class="video-overlay"></div>

            <button
              class="video-play"
              type="button"
              @click="openVideo"
            >
              <span>▶</span>
            </button>

            <div class="video-title">

              <span>
                Our Film
              </span>

              <h2>
                Câu chuyện của chúng mình
              </h2>

            </div>

          </div>

        </div>

      </section>


      <!-- =======================================================
           LOCATION
      ======================================================== -->
      <section
        v-if="location"
        class="location-section"
        data-reveal
      >

        <div class="section-container">

          <div class="location-grid">

            <div class="location-info">

              <span class="section-eyebrow">
                Where
              </span>

              <h2>
                {{ location.title || 'Địa điểm tổ chức' }}
              </h2>

              <h3>
                {{ location.name }}
              </h3>

              <p>
                {{ location.address }}
              </p>

              <a
                v-if="location.map"
                :href="location.map"
                target="_blank"
                rel="noopener noreferrer"
                class="primary-button"
              >
                Chỉ đường
                <span>↗</span>
              </a>

            </div>

            <div class="map-wrapper">

              <iframe
                v-if="location.mapEmbed"
                :src="location.mapEmbed"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              ></iframe>

              <div
                v-else
                class="map-placeholder"
              >
                <span>♡</span>
                <strong>
                  {{ location.name }}
                </strong>
                <small>
                  {{ location.address }}
                </small>
              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- =======================================================
           DRESS CODE
      ======================================================== -->
      <section
        v-if="dressCode"
        class="dress-code-section"
        data-reveal
      >

        <div class="section-container narrow">

          <span class="section-eyebrow">
            Dress Code
          </span>

          <h2>
            {{ dressCode.title || 'Dress Code' }}
          </h2>

          <p>
            {{ dressCode.description }}
          </p>

          <div
            v-if="dressCode.colors?.length"
            class="dress-colors"
          >

            <span
              v-for="(color, index) in dressCode.colors"
              :key="index"
              class="dress-color"
              :style="{ backgroundColor: color }"
            ></span>

          </div>

        </div>

      </section>


      <!-- =======================================================
           GIFTS
      ======================================================== -->
      <section
        v-if="gifts.length"
        class="gift-section"
        data-reveal
      >

        <div class="section-container">

          <div class="section-heading">

            <span class="section-eyebrow">
              Wedding Gift
            </span>

            <h2>
              Mừng cưới
            </h2>

            <p class="section-description">
              Sự hiện diện của bạn là món quà tuyệt vời nhất.
              Nếu bạn muốn gửi lời chúc theo cách riêng,
              chúng mình xin chân thành cảm ơn.
            </p>

          </div>


          <div class="gift-grid">

            <article
              v-for="(gift, index) in gifts"
              :key="gift.id || index"
              class="gift-card"
            >

              <div class="gift-icon">
                ♡
              </div>

              <span class="gift-name">
                {{ gift.name }}
              </span>

              <h3>
                {{ gift.bankName }}
              </h3>

              <p>
                {{ gift.accountName }}
              </p>

              <strong class="account-number">
                {{ gift.accountNumber }}
              </strong>

              <div
                v-if="gift.qrCode"
                class="qr-wrapper"
              >
                <img
                  :src="gift.qrCode"
                  alt="QR mừng cưới"
                  loading="lazy"
                />
              </div>

              <button
                v-if="gift.accountNumber"
                type="button"
                class="copy-button"
                @click="
                  copyAccount(
                    gift.accountNumber
                  )
                "
              >
                Sao chép số tài khoản
              </button>

            </article>

          </div>

        </div>

      </section>


      <!-- =======================================================
           RSVP
      ======================================================== -->
      <section
        v-if="rsvp"
        class="rsvp-section"
        data-reveal
      >

        <div class="section-container narrow">

          <span class="section-eyebrow">
            RSVP
          </span>

          <h2>
            {{ rsvp.title || 'Bạn sẽ tham dự chứ?' }}
          </h2>

          <p>
            {{ rsvp.description }}
          </p>

          <button
            type="button"
            class="primary-button"
            @click="openRsvp"
          >
            Xác nhận tham dự
            <span>♡</span>
          </button>

        </div>

      </section>


      <!-- =======================================================
           GUEST BOOK
      ======================================================== -->
      <section
        v-if="wishes.length"
        class="wishes-section"
        data-reveal
      >

        <div class="section-container">

          <div class="section-heading">

            <span class="section-eyebrow">
              Guest Book
            </span>

            <h2>
              Lời chúc yêu thương
            </h2>

          </div>


          <div class="wishes-list">

            <article
              v-for="(wish, index) in wishes"
              :key="wish.id || index"
              class="wish-card"
            >

              <div class="wish-quote">
                “
              </div>

              <p>
                {{ wish.message }}
              </p>

              <strong>
                {{ wish.name }}
              </strong>

              <small
                v-if="wish.created_at"
              >
                {{ wish.created_at }}
              </small>

            </article>

          </div>

        </div>

      </section>


      <!-- =======================================================
           FOOTER
      ======================================================== -->
      <footer class="wedding-footer">

        <div
          class="footer-background"
          :style="{
            backgroundImage: `url(${coverImage})`
          }"
        ></div>

        <div class="footer-overlay"></div>

        <div class="footer-content">

          <span>
            Thank You
          </span>

          <h2>
            {{ groomName }}
          </h2>

          <div class="footer-heart">
            ♡
          </div>

          <h2>
            {{ brideName }}
          </h2>

          <p>
            {{
              footerMessage ||
              'Cảm ơn bạn đã đến và chung vui cùng chúng mình.'
            }}
          </p>

          <div class="footer-date">
            {{ formattedWeddingDate }}
          </div>

          <div class="footer-copyright">
            {{ copyright }}
          </div>

        </div>

      </footer>

    </div>


    <!-- =========================================================
         GALLERY LIGHTBOX
    ========================================================== -->
    <Teleport to="body">

      <Transition name="lightbox">

        <div
          v-if="galleryOpen"
          class="gallery-lightbox"
          @click.self="closeGallery"
        >

          <button
            class="lightbox-close"
            type="button"
            @click="closeGallery"
          >
            ×
          </button>

          <button
            class="lightbox-prev"
            type="button"
            @click="previousImage"
          >
            ‹
          </button>

          <div class="lightbox-content">

            <img
              :src="currentGalleryImage"
              :alt="
                currentGalleryItem?.caption ||
                'Ảnh cưới'
              "
            />

            <div class="lightbox-counter">
              {{ currentGalleryIndex + 1 }}
              /
              {{ gallery.length }}
            </div>

            <p
              v-if="currentGalleryItem?.caption"
              class="lightbox-caption"
            >
              {{ currentGalleryItem.caption }}
            </p>

          </div>

          <button
            class="lightbox-next"
            type="button"
            @click="nextImage"
          >
            ›
          </button>

          <div class="lightbox-thumbnails">

            <button
              v-for="(image, index) in gallery"
              :key="image.id || index"
              type="button"
              :class="{
                active:
                  currentGalleryIndex === index
              }"
              @click="currentGalleryIndex = index"
            >
              <img
                :src="getGalleryImage(image)"
                alt=""
              />
            </button>

          </div>

        </div>

      </Transition>

    </Teleport>


    <!-- =========================================================
         VIDEO MODAL
    ========================================================== -->
    <Teleport to="body">

      <Transition name="modal">

        <div
          v-if="videoOpen"
          class="video-modal"
          @click.self="closeVideo"
        >

          <button
            class="modal-close"
            type="button"
            @click="closeVideo"
          >
            ×
          </button>

          <video
            ref="videoPlayer"
            :src="videoUrl"
            controls
            playsinline
            autoplay
            class="video-player"
          ></video>

        </div>

      </Transition>

    </Teleport>


    <!-- =========================================================
         RSVP MODAL
    ========================================================== -->
    <Teleport to="body">

      <Transition name="modal">

        <div
          v-if="rsvpOpen"
          class="rsvp-modal"
          @click.self="rsvpOpen = false"
        >

          <div class="rsvp-card">

            <button
              class="modal-close dark"
              type="button"
              @click="rsvpOpen = false"
            >
              ×
            </button>

            <span class="section-eyebrow">
              RSVP
            </span>

            <h2>
              {{ rsvp?.title || 'Xác nhận tham dự' }}
            </h2>

            <p>
              {{ rsvp?.description }}
            </p>

            <form
              class="rsvp-form"
              @submit.prevent="submitRsvp"
            >

              <input
                v-model="rsvpForm.name"
                type="text"
                placeholder="Tên của bạn"
                required
              />

              <select
                v-model="rsvpForm.attending"
                required
              >
                <option value="">
                  Bạn có tham dự không?
                </option>

                <option value="yes">
                  Có, tôi sẽ tham dự
                </option>

                <option value="no">
                  Rất tiếc, tôi không thể tham dự
                </option>
              </select>

              <input
                v-model="rsvpForm.guests"
                type="number"
                min="1"
                max="20"
                placeholder="Số người tham dự"
              />

              <textarea
                v-model="rsvpForm.message"
                rows="4"
                placeholder="Lời nhắn..."
              ></textarea>

              <button
                type="submit"
                class="primary-button"
                :disabled="rsvpSubmitting"
              >
                {{
                  rsvpSubmitting
                    ? 'Đang gửi...'
                    : 'Gửi xác nhận'
                }}
              </button>

            </form>

          </div>

        </div>

      </Transition>

    </Teleport>


    <!-- =========================================================
         TOAST
    ========================================================== -->
    <Transition name="toast">

      <div
        v-if="toastMessage"
        class="toast-message"
      >
        {{ toastMessage }}
      </div>

    </Transition>

  </div>
</template>


<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";


/* =============================================================
   PROPS
============================================================= */

const props = defineProps({

  wedding: {
    type: Object,
    required: true
  }

});


/* =============================================================
   BASIC DATA
============================================================= */

const wedding = computed(() => props.wedding || {});

const isOpened = ref(false);

const defaultAvatar =
  "/images/default-avatar.jpg";


/* =============================================================
   COUPLE
============================================================= */

const groom = computed(() =>
  wedding.value?.couple?.groom || null
);

const bride = computed(() =>
  wedding.value?.couple?.bride || null
);

const groomName = computed(() =>
  groom.value?.name ||
  wedding.value?.groomName ||
  "Chú rể"
);

const brideName = computed(() =>
  bride.value?.name ||
  wedding.value?.brideName ||
  "Cô dâu"
);

const hasCouple = computed(() =>
  !!groom.value || !!bride.value
);


/* =============================================================
   COVER
============================================================= */

const coverImage = computed(() =>
  wedding.value?.coverImage ||
  wedding.value?.hero?.image ||
  defaultAvatar
);


/* =============================================================
   HERO
============================================================= */

const heroSubtitle = computed(() =>
  wedding.value?.hero?.subtitle ||
  wedding.value?.hero?.title ||
  "WE ARE GETTING MARRIED"
);


/* =============================================================
   INVITATION
============================================================= */

const invitation = computed(() =>
  wedding.value?.invitation ||
  null
);

const hasInvitation = computed(() =>
  !!invitation.value
);

const invitationTitle = computed(() =>
  invitation.value?.title ||
  "Trân trọng kính mời"
);

const invitationMessage = computed(() =>
  invitation.value?.message ||
  invitation.value?.description ||
  "Sự hiện diện của quý vị là niềm vinh hạnh lớn đối với gia đình chúng tôi."
);

const invitationDescription = computed(() =>
  invitation.value?.description ||
  ""
);


/* =============================================================
   STORY
============================================================= */

const story = computed(() =>
  wedding.value?.story || null
);

const storyItems = computed(() =>
  story.value?.items || []
);

const storyDescription = computed(() =>
  story.value?.description || ""
);


/* =============================================================
   DATE
============================================================= */

const weddingDate = computed(() => {

  const value =
    wedding.value?.weddingDate ||
    wedding.value?.hero?.weddingDate;

  if (!value) return null;

  const date = new Date(value);

  return isNaN(date.getTime())
    ? null
    : date;

});


const weddingDay = computed(() =>
  weddingDate.value
    ? String(weddingDate.value.getDate()).padStart(2, "0")
    : ""
);

const weddingMonth = computed(() =>
  weddingDate.value
    ? String(
        weddingDate.value.getMonth() + 1
      ).padStart(2, "0")
    : ""
);

const weddingYear = computed(() =>
  weddingDate.value
    ? weddingDate.value.getFullYear()
    : ""
);

const weddingTime = computed(() => {

  if (!weddingDate.value) return "";

  return weddingDate.value.toLocaleTimeString(
    "vi-VN",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );

});


const weddingWeekday = computed(() => {

  if (!weddingDate.value) return "";

  return weddingDate.value.toLocaleDateString(
    "vi-VN",
    {
      weekday: "long"
    }
  );

});


const formattedWeddingDate = computed(() => {

  if (!weddingDate.value) return "";

  return weddingDate.value.toLocaleDateString(
    "vi-VN",
    {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );

});


/* =============================================================
   COUNTDOWN
============================================================= */

const countdown = reactive({

  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00"

});

let countdownTimer = null;


const updateCountdown = () => {

  if (!weddingDate.value) return;

  const distance =
    weddingDate.value.getTime() -
    Date.now();

  if (distance <= 0) {

    countdown.days = "00";
    countdown.hours = "00";
    countdown.minutes = "00";
    countdown.seconds = "00";

    return;
  }

  const totalSeconds =
    Math.floor(distance / 1000);

  countdown.days = String(
    Math.floor(totalSeconds / 86400)
  ).padStart(2, "0");

  countdown.hours = String(
    Math.floor(
      (totalSeconds % 86400) / 3600
    )
  ).padStart(2, "0");

  countdown.minutes = String(
    Math.floor(
      (totalSeconds % 3600) / 60
    )
  ).padStart(2, "0");

  countdown.seconds = String(
    totalSeconds % 60
  ).padStart(2, "0");

};


/* =============================================================
   EVENTS
============================================================= */

const events = computed(() =>
  Array.isArray(wedding.value?.events)
    ? wedding.value.events
    : []
);


/* =============================================================
   GALLERY
============================================================= */

const gallery = computed(() =>
  Array.isArray(wedding.value?.gallery)
    ? wedding.value.gallery
    : []
);


const getGalleryImage = (image) => {

  if (typeof image === "string") {
    return image;
  }

  return (
    image?.image ||
    image?.url ||
    image?.src ||
    image?.thumbnail ||
    defaultAvatar
  );

};


const galleryOpen = ref(false);

const currentGalleryIndex = ref(0);


const currentGalleryItem = computed(() =>
  gallery.value[
    currentGalleryIndex.value
  ] || null
);


const currentGalleryImage = computed(() =>
  currentGalleryItem.value
    ? getGalleryImage(
        currentGalleryItem.value
      )
    : ""
);


const openGallery = (index = 0) => {

  currentGalleryIndex.value =
    index;

  galleryOpen.value = true;

  lockBodyScroll();

};


const closeGallery = () => {

  galleryOpen.value = false;

  unlockBodyScroll();

};


const previousImage = () => {

  if (!gallery.value.length) return;

  currentGalleryIndex.value =
    currentGalleryIndex.value <= 0
      ? gallery.value.length - 1
      : currentGalleryIndex.value - 1;

};


const nextImage = () => {

  if (!gallery.value.length) return;

  currentGalleryIndex.value =
    currentGalleryIndex.value >=
    gallery.value.length - 1
      ? 0
      : currentGalleryIndex.value + 1;

};


/* =============================================================
   VIDEO
============================================================= */

const video = computed(() =>
  wedding.value?.video || null
);

const videoUrl = computed(() =>
  video.value?.url ||
  video.value?.src ||
  ""
);

const videoThumbnail = computed(() =>
  video.value?.thumbnail ||
  ""
);

const videoOpen = ref(false);

const videoPlayer = ref(null);


const openVideo = async () => {

  videoOpen.value = true;

  lockBodyScroll();

  await nextTick();

  videoPlayer.value?.play?.();

};


const closeVideo = () => {

  videoPlayer.value?.pause?.();

  videoOpen.value = false;

  unlockBodyScroll();

};


/* =============================================================
   LOCATION
============================================================= */

const location = computed(() =>
  wedding.value?.location || null
);


/* =============================================================
   DRESS CODE
============================================================= */

const dressCode = computed(() =>
  wedding.value?.dressCode?.enabled === false
    ? null
    : wedding.value?.dressCode || null
);


/* =============================================================
   GIFTS
============================================================= */

const gifts = computed(() =>
  Array.isArray(wedding.value?.gifts)
    ? wedding.value.gifts
    : []
);


/* =============================================================
   WISHES
============================================================= */

const wishes = computed(() => {

  const guestBook =
    wedding.value?.guestBook;

  if (!guestBook) return [];

  if (Array.isArray(guestBook)) {
    return guestBook;
  }

  return (
    guestBook.guest ||
    guestBook.wishes ||
    guestBook.items ||
    []
  );

});


/* =============================================================
   RSVP
============================================================= */

const rsvp = computed(() => {

  const data =
    wedding.value?.rsvp;

  if (!data) return null;

  if (data.enabled === false) {
    return null;
  }

  return data;

});


const rsvpOpen = ref(false);

const rsvpSubmitting = ref(false);

const rsvpForm = reactive({

  name: "",
  attending: "",
  guests: 1,
  message: ""

});


const openRsvp = () => {

  rsvpOpen.value = true;

  lockBodyScroll();

};


const submitRsvp = async () => {

  if (!rsvpForm.name) return;

  rsvpSubmitting.value = true;

  try {

    /*
      GỌI API CỦA BẠN TẠI ĐÂY.

      Ví dụ:

      await weddingStore.submitRsvp(
        wedding.value.slug,
        {
          ...rsvpForm
        }
      );
    */

    await new Promise(resolve =>
      setTimeout(resolve, 700)
    );

    showToast(
      "Cảm ơn bạn đã xác nhận tham dự ❤️"
    );

    rsvpForm.name = "";
    rsvpForm.attending = "";
    rsvpForm.guests = 1;
    rsvpForm.message = "";

    rsvpOpen.value = false;

    unlockBodyScroll();

  } finally {

    rsvpSubmitting.value = false;

  }

};


/* =============================================================
   MUSIC
============================================================= */

const audioPlayer = ref(null);

const isPlaying = ref(false);

const showMusic = computed(() => {

  if (
    wedding.value?.settings
      ?.showMusic === false
  ) {
    return false;
  }

  return true;

});


const musicUrl = computed(() =>
  wedding.value?.music?.url ||
  wedding.value?.music?.src ||
  ""
);


const toggleMusic = async () => {

  if (!audioPlayer.value) return;

  try {

    if (audioPlayer.value.paused) {

      await audioPlayer.value.play();

    } else {

      audioPlayer.value.pause();

    }

  } catch (error) {

    console.warn(
      "Không thể phát nhạc:",
      error
    );

  }

};


/* =============================================================
   THEME
============================================================= */

const themeName = computed(() =>
  wedding.value?.theme ||
  "romantic-pink"
);


const themeColors = computed(() =>
  wedding.value?.themeConfig?.colors ||
  wedding.value?.colors ||
  {}
);


const themeStyle = computed(() => {

  const colors =
    themeColors.value;

  return {

    "--w-primary":
      colors.primary ||
      "#b0566b",

    "--w-primary-dark":
      colors.primaryDark ||
      "#963f55",

    "--w-secondary":
      colors.secondary ||
      "#d98a9c",

    "--w-accent":
      colors.accent ||
      "#c9986a",

    "--w-background":
      colors.background ||
      "#fffaf8",

    "--w-background-secondary":
      colors.backgroundSecondary ||
      "#fdf1f3",

    "--w-text":
      colors.text ||
      "#503d42",

    "--w-text-secondary":
      colors.textSecondary ||
      "#947c82"

  };

});


/* =============================================================
   FOOTER
============================================================= */

const footerMessage = computed(() =>
  wedding.value?.footer?.message ||
  ""
);

const copyright = computed(() =>
  wedding.value?.footer?.copyright ||
  "Ngày Chung Đôi"
);


/* =============================================================
   OPEN
============================================================= */

const openInvitation = async () => {

  isOpened.value = true;

  unlockBodyScroll();

  await nextTick();

  initReveal();

};


/* =============================================================
   SCROLL
============================================================= */

const scrollToSection = (id) => {

  const element =
    document.getElementById(id);

  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

};


/* =============================================================
   REVEAL
============================================================= */

let revealObserver = null;


const initReveal = () => {

  revealObserver?.disconnect();

  const elements =
    document.querySelectorAll(
      ".wedding-page [data-reveal]"
    );

  if (!elements.length) return;

  revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          revealObserver?.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.08,
        rootMargin:
          "0px 0px -60px 0px"
      }
    );

  elements.forEach(element => {

    revealObserver.observe(element);

  });

};


/* =============================================================
   BODY SCROLL
============================================================= */

let previousBodyOverflow = "";

const lockBodyScroll = () => {

  previousBodyOverflow =
    document.body.style.overflow;

  document.body.style.overflow =
    "hidden";

};


const unlockBodyScroll = () => {

  document.body.style.overflow =
    previousBodyOverflow || "";

};


/* =============================================================
   COPY
============================================================= */

const toastMessage = ref("");

let toastTimer = null;


const showToast = (message) => {

  toastMessage.value = message;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toastMessage.value = "";

  }, 2500);

};


const copyAccount = async (
  accountNumber
) => {

  try {

    await navigator.clipboard.writeText(
      accountNumber
    );

    showToast(
      "Đã sao chép số tài khoản ❤️"
    );

  } catch {

    showToast(
      "Không thể sao chép"
    );

  }

};


/* =============================================================
   KEYBOARD GALLERY
============================================================= */

const handleKeyboard = (event) => {

  if (!galleryOpen.value) return;

  if (event.key === "Escape") {
    closeGallery();
  }

  if (event.key === "ArrowLeft") {
    previousImage();
  }

  if (event.key === "ArrowRight") {
    nextImage();
  }

};


/* =============================================================
   WATCH
============================================================= */

watch(
  weddingDate,
  () => {

    updateCountdown();

    clearInterval(countdownTimer);

    countdownTimer =
      setInterval(
        updateCountdown,
        1000
      );

  },
  {
    immediate: true
  }
);


/* =============================================================
   MOUNT
============================================================= */

onMounted(() => {

  document.addEventListener(
    "keydown",
    handleKeyboard
  );

});


/* =============================================================
   UNMOUNT
============================================================= */

onBeforeUnmount(() => {

  clearInterval(countdownTimer);

  revealObserver?.disconnect();

  document.removeEventListener(
    "keydown",
    handleKeyboard
  );

  document.body.style.overflow = "";

  clearTimeout(toastTimer);

});
</script>


<style scoped>

/* =============================================================
   GLOBAL
============================================================= */

.wedding-page {
  --w-primary: #b0566b;
  --w-primary-dark: #963f55;
  --w-secondary: #d98a9c;
  --w-accent: #c9986a;

  --w-background: #fffaf8;
  --w-background-secondary: #fdf1f3;

  --w-text: #503d42;
  --w-text-secondary: #947c82;

  width: 100%;
  min-height: 100dvh;

  overflow-x: clip;

  color: var(--w-text);

  background:
    radial-gradient(
      circle at 0% 10%,
      rgba(217,138,156,.12),
      transparent 28%
    ),
    radial-gradient(
      circle at 100% 70%,
      rgba(201,152,106,.10),
      transparent 30%
    ),
    var(--w-background);

  font-family:
    "Montserrat",
    "Segoe UI",
    sans-serif;
}

.wedding-page *,
.wedding-page *::before,
.wedding-page *::after {
  box-sizing: border-box;
}

.wedding-page button,
.wedding-page input,
.wedding-page textarea,
.wedding-page select {
  font: inherit;
}

.wedding-page button {
  cursor: pointer;
}

.wedding-page img {
  display: block;
  max-width: 100%;
}

.section-container {
  width: min(
    calc(100% - 40px),
    1180px
  );

  margin-inline: auto;
}

.section-container.narrow {
  max-width: 760px;
}

.section-heading {
  max-width: 700px;
  margin: 0 auto 70px;
  text-align: center;
}

.section-eyebrow {
  display: block;

  margin-bottom: 14px;

  color: var(--w-primary);

  font-size: 11px;

  font-weight: 600;

  letter-spacing: .28em;

  text-transform: uppercase;
}

.section-heading h2,
.section-container > .section-eyebrow + h2,
.narrow > h2 {
  margin: 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(40px, 6vw, 66px);

  line-height: .95;

  font-weight: 500;

  color: var(--w-text);
}

.section-description {
  margin: 22px auto 0;

  max-width: 620px;

  color: var(--w-text-secondary);

  line-height: 1.8;

  font-size: 15px;
}

.primary-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  min-height: 48px;

  padding: 0 26px;

  border: 0;

  border-radius: 999px;

  color: white;

  background:
    linear-gradient(
      135deg,
      var(--w-primary),
      var(--w-primary-dark)
    );

  text-decoration: none;

  box-shadow:
    0 15px 35px
    rgba(176,86,107,.22);

  transition:
    transform .3s ease,
    box-shadow .3s ease;
}

.primary-button:hover {
  transform: translateY(-3px);

  box-shadow:
    0 20px 40px
    rgba(176,86,107,.28);
}


/* =============================================================
   OPENING
============================================================= */

.opening-screen {
  position: fixed;

  inset: 0;

  z-index: 99999;

  display: grid;

  place-items: center;

  overflow: hidden;

  color: white;

  background: #2c2023;
}

.opening-background {
  position: absolute;

  inset: -20px;

  background-position: center;

  background-size: cover;

  filter: saturate(.85);

  transform: scale(1.04);
}

.opening-overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(35,20,25,.65),
      rgba(35,20,25,.25)
    );
}

.opening-card {
  position: relative;

  z-index: 2;

  width: min(
    calc(100% - 40px),
    620px
  );

  padding: 50px 30px;

  text-align: center;

  border: 1px solid
    rgba(255,255,255,.28);

  background:
    rgba(255,255,255,.07);

  backdrop-filter: blur(12px);

  border-radius: 28px;
}

.opening-small {
  font-size: 11px;

  letter-spacing: .3em;
}

.opening-line {
  width: 70px;

  height: 1px;

  margin: 25px auto;

  background: rgba(255,255,255,.7);
}

.opening-card h1 {
  margin: 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(48px, 10vw, 92px);

  line-height: .85;

  font-weight: 400;
}

.opening-and {
  display: block;

  margin: 12px 0;

  color: #f1c3cd;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 38px;
}

.opening-date {
  margin-top: 30px;

  font-size: 12px;

  letter-spacing: .2em;

  text-transform: uppercase;
}

.opening-card p {
  margin: 25px auto;

  max-width: 450px;

  color: rgba(255,255,255,.82);

  line-height: 1.8;
}

.open-button {
  display: inline-flex;

  align-items: center;

  gap: 10px;

  margin-top: 15px;

  min-height: 50px;

  padding: 0 28px;

  border: 1px solid
    rgba(255,255,255,.5);

  border-radius: 999px;

  color: white;

  background: rgba(255,255,255,.1);

  transition:
    background .3s ease,
    transform .3s ease;
}

.open-button:hover {
  background: rgba(255,255,255,.2);

  transform: translateY(-3px);
}

.opening-decoration {
  position: absolute;

  z-index: 1;

  color: rgba(255,255,255,.3);

  font-family:
    "Cormorant Garamond",
    serif;
}

.decoration-1 {
  top: 10%;

  left: 10%;

  font-size: 100px;
}

.decoration-2 {
  right: 12%;

  bottom: 12%;

  font-size: 70px;
}


/* =============================================================
   HERO
============================================================= */

.hero-section {
  position: relative;

  min-height: 100svh;

  display: grid;

  place-items: center;

  overflow: hidden;

  color: white;
}

.hero-image,
.hero-overlay {
  position: absolute;

  inset: 0;
}

.hero-image {
  background-position: center;

  background-size: cover;

  transform: scale(1.02);
}

.hero-overlay {
  background:
    linear-gradient(
      to bottom,
      rgba(25,15,20,.42),
      rgba(25,15,20,.18) 45%,
      rgba(25,15,20,.58)
    );
}

.hero-content {
  position: relative;

  z-index: 2;

  width: min(
    calc(100% - 30px),
    900px
  );

  text-align: center;
}

.hero-label {
  font-size: 11px;

  letter-spacing: .32em;

  text-transform: uppercase;
}

.hero-line {
  width: 70px;

  height: 1px;

  margin: 22px auto;
}

.hero-groom,
.hero-bride {
  margin: 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(64px, 12vw, 130px);

  line-height: .78;

  font-weight: 400;

  text-shadow:
    0 10px 40px
    rgba(0,0,0,.25);
}

.hero-heart {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 14px;

  margin: 28px 0;
}

.hero-heart span {
  width: 55px;

  height: 1px;

  background: rgba(255,255,255,.65);
}

.hero-heart b {
  font-size: 30px;

  font-weight: 400;
}

.hero-date {
  margin-top: 35px;

  font-size: 13px;

  letter-spacing: .25em;

  text-transform: uppercase;
}

.hero-scroll {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 10px;

  margin: 70px auto 0;

  border: 0;

  color: white;

  background: transparent;

  font-size: 11px;

  letter-spacing: .12em;
}

.hero-scroll b {
  font-size: 25px;

  animation:
    scrollDown 1.8s ease-in-out infinite;
}

@keyframes scrollDown {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(8px);
  }

}


/* =============================================================
   COUNTDOWN
============================================================= */

.countdown-section {
  padding: 110px 0;

  text-align: center;

  background:
    linear-gradient(
      180deg,
      #fffaf8,
      #fdf1f3
    );
}

.countdown {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: clamp(10px, 4vw, 40px);

  margin-top: 55px;
}

.count-item {
  min-width: 80px;
}

.count-item strong {
  display: block;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(46px, 8vw, 78px);

  line-height: .9;

  font-weight: 500;

  color: var(--w-primary);
}

.count-item span {
  display: block;

  margin-top: 12px;

  color: var(--w-text-secondary);

  font-size: 11px;

  letter-spacing: .15em;

  text-transform: uppercase;
}

.count-separator {
  margin-top: -25px;

  color: var(--w-accent);

  font-size: 28px;
}


/* =============================================================
   INVITATION
============================================================= */

.invitation-section {
  position: relative;

  padding: 130px 0;

  text-align: center;

  background:
    radial-gradient(
      circle at center,
      rgba(217,138,156,.12),
      transparent 50%
    );
}

.invitation-text {
  margin: 35px auto 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(25px, 4vw, 38px);

  line-height: 1.45;

  color: var(--w-text);
}

.invitation-description {
  max-width: 650px;

  margin: 20px auto;

  color: var(--w-text-secondary);

  line-height: 1.8;
}

.ornament,
.date-ornament {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 15px;

  color: var(--w-accent);

  font-size: 20px;
}

.ornament span,
.date-ornament span {
  width: 50px;

  height: 1px;

  background:
    var(--w-accent);
}

.signature {
  display: flex;

  flex-direction: column;

  gap: 6px;

  margin-top: 40px;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;
}

.signature span {
  color: var(--w-text-secondary);

  font-size: 18px;
}

.signature strong {
  font-size: 30px;

  font-weight: 500;
}


/* =============================================================
   STORY
============================================================= */

.story-section {
  padding: 130px 0;

  background: var(--w-background-secondary);
}

.story-timeline {
  position: relative;

  max-width: 900px;

  margin: auto;

  padding-left: 45px;
}

.story-timeline::before {
  content: "";

  position: absolute;

  top: 0;
  bottom: 0;

  left: 10px;

  width: 1px;

  background:
    linear-gradient(
      to bottom,
      transparent,
      var(--w-secondary),
      transparent
    );
}

.story-item {
  position: relative;

  margin-bottom: 70px;
}

.story-item:last-child {
  margin-bottom: 0;
}

.story-dot {
  position: absolute;

  left: -45px;

  top: 0;

  width: 22px;
  height: 22px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: var(--w-background-secondary);

  border: 1px solid var(--w-accent);

  color: var(--w-primary);

  font-size: 10px;
}

.story-date {
  color: var(--w-accent);

  font-size: 12px;

  letter-spacing: .15em;
}

.story-content h3 {
  margin: 8px 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 36px;

  font-weight: 500;
}

.story-content p {
  margin: 0;

  color: var(--w-text-secondary);

  line-height: 1.8;
}

.story-image {
  overflow: hidden;

  margin-top: 25px;

  border-radius: 20px;
}

.story-image img {
  width: 100%;

  aspect-ratio: 16 / 9;

  object-fit: cover;

  transition:
    transform .8s ease;
}

.story-image:hover img {
  transform: scale(1.03);
}


/* =============================================================
   COUPLE
============================================================= */

.couple-section {
  padding: 130px 0;
}

.couple-grid {
  position: relative;

  display: grid;

  grid-template-columns:
    1fr 80px 1fr;

  align-items: center;

  max-width: 1000px;

  margin: auto;
}

.person-card {
  text-align: center;
}

.person-image-wrapper {
  position: relative;

  width: min(270px, 75vw);

  aspect-ratio: 1;

  margin: auto;
}

.person-ring {
  position: absolute;

  inset: -12px;

  border: 1px solid
    rgba(201,152,106,.5);

  border-radius: 50%;

  transform: rotate(8deg);
}

.person-image-wrapper img {
  position: relative;

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 50%;
}

.person-role {
  display: block;

  margin-top: 35px;

  color: var(--w-primary);

  font-size: 11px;

  letter-spacing: .2em;

  text-transform: uppercase;
}

.person-card h3 {
  margin: 8px 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 50px;

  font-weight: 500;
}

.person-description {
  max-width: 330px;

  margin: 15px auto;

  color: var(--w-text-secondary);

  line-height: 1.8;
}

.family-info {
  margin-top: 25px;
}

.family-info div {
  display: flex;

  justify-content: center;

  gap: 8px;

  margin-top: 4px;

  color: var(--w-text-secondary);

  font-size: 13px;
}

.family-info strong {
  color: var(--w-text);
}

.couple-heart {
  display: grid;

  place-items: center;
}

.couple-heart span {
  display: grid;

  place-items: center;

  width: 54px;
  height: 54px;

  border-radius: 50%;

  color: white;

  background:
    var(--w-primary);

  box-shadow:
    0 15px 35px
    rgba(176,86,107,.25);

  font-size: 25px;
}


/* =============================================================
   FAMILIES
============================================================= */

.families-section {
  padding: 110px 0;

  background:
    var(--w-background-secondary);
}

.families-grid {
  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 25px;

  max-width: 900px;

  margin: auto;
}

.family-card {
  padding: 50px 30px;

  text-align: center;

  border-radius: 25px;

  background:
    rgba(255,255,255,.7);

  border: 1px solid
    rgba(201,152,106,.18);
}

.family-label {
  color: var(--w-primary);

  font-size: 11px;

  letter-spacing: .2em;

  text-transform: uppercase;
}

.family-card h3 {
  margin: 10px 0 20px;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 34px;

  font-weight: 500;
}

.family-line {
  width: 45px;

  height: 1px;

  margin: 0 auto 20px;

  background: var(--w-accent);
}

.family-card p {
  margin: 8px 0;

  color: var(--w-text-secondary);
}

.family-card strong {
  margin-left: 5px;

  color: var(--w-text);
}


/* =============================================================
   DATE
============================================================= */

.date-section {
  position: relative;

  min-height: 600px;

  display: grid;

  place-items: center;

  overflow: hidden;

  color: white;

  text-align: center;
}

.date-background {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      rgba(65,30,40,.72),
      rgba(65,30,40,.72)
    ),
    var(--date-image, none);

  background-position: center;

  background-size: cover;

  background-color:
    var(--w-primary-dark);
}

.date-content {
  position: relative;

  z-index: 1;
}

.date-content .section-eyebrow {
  color: #f3cbd4;
}

.big-date {
  display: flex;

  flex-direction: column;

  align-items: center;

  margin-top: 20px;
}

.date-weekday {
  font-size: 13px;

  letter-spacing: .2em;

  text-transform: uppercase;
}

.big-date strong {
  margin: 5px 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(100px, 20vw, 180px);

  line-height: .8;

  font-weight: 400;
}

.date-month {
  font-size: 14px;

  letter-spacing: .2em;
}

.date-year {
  margin-top: 8px;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 30px;
}

.date-ornament {
  margin: 30px 0;
}

.date-ornament span {
  background: rgba(255,255,255,.5);
}

.date-content > p {
  margin: 0;

  font-size: 16px;

  letter-spacing: .15em;
}


/* =============================================================
   EVENTS
============================================================= */

.events-section {
  padding: 130px 0;
}

.events-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(280px, 1fr)
    );

  gap: 25px;
}

.event-card {
  position: relative;

  padding: 50px 30px;

  text-align: center;

  border-radius: 25px;

  background:
    linear-gradient(
      145deg,
      #fff,
      #fff8f9
    );

  border: 1px solid
    rgba(176,86,107,.12);

  box-shadow:
    0 20px 60px
    rgba(80,40,50,.07);

  transition:
    transform .4s ease,
    box-shadow .4s ease;
}

.event-card:hover {
  transform: translateY(-8px);

  box-shadow:
    0 30px 70px
    rgba(80,40,50,.12);
}

.event-number {
  position: absolute;

  top: 20px;
  right: 25px;

  color: rgba(176,86,107,.35);

  font-size: 11px;

  letter-spacing: .1em;
}

.event-weekday {
  display: block;

  color: var(--w-primary);

  font-size: 12px;

  letter-spacing: .18em;

  text-transform: uppercase;
}

.event-day {
  display: block;

  margin-top: 10px;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  color: var(--w-text);

  font-size: 92px;

  line-height: .8;

  font-weight: 500;
}

.event-month {
  display: block;

  margin-top: 15px;

  color: var(--w-text-secondary);

  font-size: 11px;

  letter-spacing: .15em;
}

.event-divider {
  width: 45px;

  height: 1px;

  margin: 25px auto;

  background: var(--w-accent);
}

.event-time {
  color: var(--w-primary);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 28px;
}

.event-card h3 {
  margin: 15px 0 10px;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 32px;

  font-weight: 500;
}

.event-location {
  margin: 0;

  color: var(--w-text);

  font-weight: 600;
}

.event-address {
  margin: 8px 0 20px;

  color: var(--w-text-secondary);

  line-height: 1.6;

  font-size: 13px;
}

.map-button {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: var(--w-primary);

  font-size: 12px;

  text-decoration: none;

  border-bottom: 1px solid
    var(--w-primary);

  padding-bottom: 3px;
}


/* =============================================================
   GALLERY
============================================================= */

.gallery-section {
  padding: 130px 0;

  background:
    var(--w-background-secondary);
}

.gallery-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  grid-auto-rows: 250px;

  gap: 12px;
}

.gallery-item {
  position: relative;

  min-width: 0;

  overflow: hidden;

  padding: 0;

  border: 0;

  border-radius: 18px;

  background: #eee;
}

.gallery-large {
  grid-column: span 2;

  grid-row: span 2;
}

.gallery-item img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform .8s
    cubic-bezier(.22,1,.36,1);
}

.gallery-overlay {
  position: absolute;

  inset: 0;

  display: grid;

  place-items: center;

  background:
    rgba(40,20,25,.25);

  opacity: 0;

  transition:
    opacity .35s ease;
}

.gallery-overlay span {
  display: grid;

  place-items: center;

  width: 50px;
  height: 50px;

  border: 1px solid white;

  border-radius: 50%;

  color: white;

  font-size: 25px;
}

.gallery-item:hover img {
  transform: scale(1.06);
}

.gallery-item:hover
.gallery-overlay {
  opacity: 1;
}

.view-gallery-button {
  display: flex;

  align-items: center;

  gap: 15px;

  margin: 35px auto 0;

  padding: 12px 0;

  border: 0;

  border-bottom: 1px solid
    var(--w-primary);

  color: var(--w-primary);

  background: transparent;
}


/* =============================================================
   VIDEO
============================================================= */

.video-section {
  padding: 120px 20px;
}

.video-container {
  width: min(
    100%,
    1200px
  );

  margin: auto;
}

.video-cover {
  position: relative;

  min-height: 600px;

  display: grid;

  place-items: center;

  overflow: hidden;

  border-radius: 30px;

  background:
    linear-gradient(
      135deg,
      var(--w-primary-dark),
      var(--w-primary)
    );

  background-position: center;

  background-size: cover;
}

.video-overlay {
  position: absolute;

  inset: 0;

  background:
    rgba(30,15,20,.35);
}

.video-play {
  position: relative;

  z-index: 2;

  display: grid;

  place-items: center;

  width: 85px;
  height: 85px;

  border: 1px solid
    rgba(255,255,255,.7);

  border-radius: 50%;

  color: white;

  background:
    rgba(255,255,255,.12);

  backdrop-filter: blur(8px);

  font-size: 22px;

  transition:
    transform .3s ease,
    background .3s ease;
}

.video-play:hover {
  transform: scale(1.08);

  background:
    rgba(255,255,255,.22);
}

.video-title {
  position: absolute;

  left: 40px;
  bottom: 40px;

  z-index: 2;

  color: white;
}

.video-title span {
  font-size: 11px;

  letter-spacing: .2em;

  text-transform: uppercase;
}

.video-title h2 {
  margin: 5px 0 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 45px;

  font-weight: 400;
}


/* =============================================================
   LOCATION
============================================================= */

.location-section {
  padding: 130px 0;

  background:
    var(--w-background-secondary);
}

.location-grid {
  display: grid;

  grid-template-columns:
    .8fr 1.2fr;

  gap: 50px;

  align-items: center;
}

.location-info h2 {
  margin: 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 60px;

  font-weight: 500;
}

.location-info h3 {
  margin: 25px 0 8px;

  font-size: 18px;
}

.location-info p {
  margin-bottom: 30px;

  color: var(--w-text-secondary);

  line-height: 1.8;
}

.map-wrapper {
  min-height: 450px;

  overflow: hidden;

  border-radius: 25px;

  background: #eee;

  box-shadow:
    0 25px 60px
    rgba(60,30,40,.1);
}

.map-wrapper iframe {
  width: 100%;
  height: 450px;

  display: block;

  border: 0;
}

.map-placeholder {
  min-height: 450px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 12px;

  text-align: center;
}

.map-placeholder span {
  color: var(--w-primary);

  font-size: 45px;
}

.map-placeholder small {
  color: var(--w-text-secondary);
}


/* =============================================================
   DRESS CODE
============================================================= */

.dress-code-section {
  padding: 120px 0;

  text-align: center;
}

.dress-code-section p {
  max-width: 600px;

  margin: 20px auto;

  color: var(--w-text-secondary);

  line-height: 1.8;
}

.dress-colors {
  display: flex;

  justify-content: center;

  gap: 15px;

  margin-top: 35px;
}

.dress-color {
  width: 55px;
  height: 55px;

  border-radius: 50%;

  border: 5px solid white;

  box-shadow:
    0 10px 30px
    rgba(0,0,0,.1);
}


/* =============================================================
   GIFTS
============================================================= */

.gift-section {
  padding: 130px 0;

  background:
    var(--w-background-secondary);
}

.gift-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(280px, 1fr)
    );

  gap: 25px;

  max-width: 900px;

  margin: auto;
}

.gift-card {
  padding: 45px 25px;

  text-align: center;

  border-radius: 25px;

  background: white;

  box-shadow:
    0 20px 60px
    rgba(80,40,50,.07);
}

.gift-icon {
  color: var(--w-primary);

  font-size: 32px;
}

.gift-name {
  display: block;

  margin-top: 10px;

  color: var(--w-text-secondary);

  font-size: 12px;

  letter-spacing: .1em;
}

.gift-card h3 {
  margin: 12px 0 4px;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 32px;

  font-weight: 500;
}

.gift-card p {
  margin: 0;

  color: var(--w-text-secondary);
}

.account-number {
  display: block;

  margin-top: 15px;

  color: var(--w-primary);

  letter-spacing: .08em;
}

.qr-wrapper {
  width: 150px;

  margin: 25px auto;

  padding: 10px;

  border-radius: 15px;

  background: white;

  box-shadow:
    0 10px 30px
    rgba(0,0,0,.08);
}

.qr-wrapper img {
  width: 100%;
}

.copy-button {
  padding: 10px 18px;

  border: 1px solid
    var(--w-primary);

  border-radius: 999px;

  color: var(--w-primary);

  background: transparent;

  font-size: 12px;
}


/* =============================================================
   RSVP
============================================================= */

.rsvp-section {
  padding: 130px 0;

  text-align: center;
}

.rsvp-section p {
  margin: 20px auto 30px;

  max-width: 600px;

  color: var(--w-text-secondary);

  line-height: 1.8;
}


/* =============================================================
   WISHES
============================================================= */

.wishes-section {
  padding: 130px 0;

  background:
    var(--w-background-secondary);
}

.wishes-list {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(260px, 1fr)
    );

  gap: 20px;
}

.wish-card {
  padding: 35px;

  border-radius: 20px;

  background: white;

  box-shadow:
    0 15px 45px
    rgba(80,40,50,.05);
}

.wish-quote {
  color: var(--w-primary);

  font-family:
    Georgia,
    serif;

  font-size: 60px;

  line-height: .5;
}

.wish-card p {
  margin: 20px 0;

  color: var(--w-text-secondary);

  line-height: 1.8;
}

.wish-card strong {
  display: block;
}

.wish-card small {
  display: block;

  margin-top: 5px;

  color: #aaa;
}


/* =============================================================
   FOOTER
============================================================= */

.wedding-footer {
  position: relative;

  min-height: 600px;

  display: grid;

  place-items: center;

  overflow: hidden;

  color: white;

  text-align: center;
}

.footer-background {
  position: absolute;

  inset: 0;

  background-position: center;

  background-size: cover;

  filter: blur(2px);

  transform: scale(1.05);
}

.footer-overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      rgba(45,20,28,.76),
      rgba(45,20,28,.85)
    );
}

.footer-content {
  position: relative;

  z-index: 1;

  width: min(
    calc(100% - 40px),
    700px
  );
}

.footer-content > span {
  font-size: 12px;

  letter-spacing: .3em;

  text-transform: uppercase;
}

.footer-content h2 {
  margin: 12px 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(55px, 10vw, 100px);

  line-height: .75;

  font-weight: 400;
}

.footer-heart {
  margin: 25px 0;

  font-size: 35px;

  color: #f3c1cd;
}

.footer-content p {
  max-width: 500px;

  margin: 35px auto;

  color: rgba(255,255,255,.78);

  line-height: 1.8;
}

.footer-date {
  font-size: 12px;

  letter-spacing: .2em;

  text-transform: uppercase;
}

.footer-copyright {
  margin-top: 60px;

  padding-top: 20px;

  border-top:
    1px solid rgba(255,255,255,.15);

  color: rgba(255,255,255,.5);

  font-size: 11px;
}


/* =============================================================
   MUSIC
============================================================= */

.music-button {
  position: fixed;

  z-index: 5000;

  right: 20px;
  bottom: 20px;

  width: 52px;
  height: 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  border: 1px solid
    rgba(176,86,107,.2);

  border-radius: 50%;

  color: var(--w-primary);

  background:
    rgba(255,255,255,.9);

  box-shadow:
    0 10px 30px
    rgba(80,40,50,.15);

  backdrop-filter: blur(10px);
}

.music-icon {
  font-size: 22px;
}

.music-wave {
  position: absolute;

  inset: -4px;

  border-radius: 50%;

  border: 1px solid
    transparent;
}

.music-button.playing
.music-wave {
  border-color:
    rgba(176,86,107,.3);

  animation:
    musicPulse 1.5s
    ease-in-out infinite;
}

@keyframes musicPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: .4;
  }

  50% {
    transform: scale(1.12);
    opacity: 1;
  }

}


/* =============================================================
   LIGHTBOX
============================================================= */

.gallery-lightbox {
  position: fixed;

  inset: 0;

  z-index: 999999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 70px 70px 120px;

  background:
    rgba(15,8,12,.96);
}

.lightbox-content {
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 78vh;

  object-fit: contain;

  border-radius: 8px;

  box-shadow:
    0 30px 100px
    rgba(0,0,0,.4);
}

.lightbox-close,
.lightbox-prev,
.lightbox-next {
  position: fixed;

  z-index: 3;

  display: grid;

  place-items: center;

  width: 48px;
  height: 48px;

  border: 1px solid
    rgba(255,255,255,.2);

  border-radius: 50%;

  color: white;

  background:
    rgba(255,255,255,.08);

  font-size: 30px;
}

.lightbox-close {
  top: 20px;
  right: 20px;
}

.lightbox-prev {
  left: 20px;
  top: 50%;

  transform: translateY(-50%);
}

.lightbox-next {
  right: 20px;
  top: 50%;

  transform: translateY(-50%);
}

.lightbox-counter {
  margin-top: 15px;

  color: rgba(255,255,255,.65);

  font-size: 12px;
}

.lightbox-caption {
  margin: 10px 0 0;

  color: rgba(255,255,255,.8);

  text-align: center;
}

.lightbox-thumbnails {
  position: fixed;

  left: 20px;
  right: 20px;
  bottom: 20px;

  z-index: 4;

  display: flex;

  justify-content: center;

  gap: 8px;

  overflow-x: auto;

  padding: 5px;
}

.lightbox-thumbnails button {
  flex: 0 0 55px;

  width: 55px;
  height: 55px;

  padding: 0;

  overflow: hidden;

  border: 2px solid transparent;

  border-radius: 8px;

  opacity: .55;

  background: transparent;
}

.lightbox-thumbnails button.active {
  border-color: white;

  opacity: 1;
}

.lightbox-thumbnails img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


/* =============================================================
   VIDEO MODAL
============================================================= */

.video-modal {
  position: fixed;

  inset: 0;

  z-index: 999999;

  display: grid;

  place-items: center;

  padding: 30px;

  background:
    rgba(10,5,8,.96);
}

.video-player {
  width: min(
    1200px,
    100%
  );

  max-height: 85vh;

  border-radius: 15px;
}

.modal-close {
  position: fixed;

  top: 20px;
  right: 20px;

  z-index: 2;

  width: 45px;
  height: 45px;

  border: 1px solid
    rgba(255,255,255,.25);

  border-radius: 50%;

  color: white;

  background:
    rgba(255,255,255,.08);

  font-size: 28px;
}

.modal-close.dark {
  position: absolute;

  color: var(--w-text);

  background: transparent;

  border-color:
    rgba(80,40,50,.1);
}


/* =============================================================
   RSVP MODAL
============================================================= */

.rsvp-modal {
  position: fixed;

  inset: 0;

  z-index: 999999;

  display: grid;

  place-items: center;

  padding: 20px;

  background:
    rgba(30,15,20,.7);

  backdrop-filter: blur(8px);
}

.rsvp-card {
  position: relative;

  width: min(
    100%,
    550px
  );

  padding: 50px 35px;

  border-radius: 25px;

  background: var(--w-background);

  text-align: center;

  box-shadow:
    0 30px 100px
    rgba(0,0,0,.2);
}

.rsvp-card h2 {
  margin: 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 48px;

  font-weight: 500;
}

.rsvp-card > p {
  color: var(--w-text-secondary);

  line-height: 1.7;
}

.rsvp-form {
  display: grid;

  gap: 12px;

  margin-top: 30px;
}

.rsvp-form input,
.rsvp-form select,
.rsvp-form textarea {
  width: 100%;

  padding: 14px 16px;

  border: 1px solid
    rgba(80,40,50,.12);

  border-radius: 12px;

  outline: none;

  color: var(--w-text);

  background: white;
}

.rsvp-form textarea {
  resize: vertical;
}

.rsvp-form input:focus,
.rsvp-form select:focus,
.rsvp-form textarea:focus {
  border-color:
    var(--w-primary);
}


/* =============================================================
   TOAST
============================================================= */

.toast-message {
  position: fixed;

  z-index: 1000000;

  left: 50%;
  bottom: 30px;

  transform: translateX(-50%);

  padding: 13px 22px;

  border-radius: 999px;

  color: white;

  background:
    rgba(45,25,30,.95);

  box-shadow:
    0 15px 40px
    rgba(0,0,0,.2);

  font-size: 13px;
}


/* =============================================================
   REVEAL
============================================================= */

[data-reveal] {
  opacity: 0;

  transform:
    translateY(45px);

  transition:
    opacity .9s
      cubic-bezier(.22,1,.36,1),
    transform .9s
      cubic-bezier(.22,1,.36,1);
}

[data-reveal].is-visible {
  opacity: 1;

  transform:
    translateY(0);
}


/* =============================================================
   TRANSITIONS
============================================================= */

.open-fade-enter-active,
.open-fade-leave-active {
  transition:
    opacity .8s ease;
}

.open-fade-enter-from,
.open-fade-leave-to {
  opacity: 0;
}

.lightbox-enter-active,
.lightbox-leave-active,
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity .35s ease;
}

.lightbox-enter-from,
.lightbox-leave-to,
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity .3s ease,
    transform .3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform:
    translate(-50%, 15px);
}


/* =============================================================
   MOBILE
============================================================= */

@media (max-width: 768px) {

  .section-container {
    width: min(
      calc(100% - 28px),
      1180px
    );
  }

  .section-heading {
    margin-bottom: 45px;
  }

  .opening-card {
    padding: 40px 20px;

    border-radius: 22px;
  }

  .hero-groom,
  .hero-bride {
    font-size:
      clamp(55px, 17vw, 85px);
  }

  .hero-scroll {
    margin-top: 50px;
  }

  .countdown {
    gap: 5px;
  }

  .count-item {
    min-width: 55px;
  }

  .count-item strong {
    font-size: 40px;
  }

  .count-item span {
    font-size: 9px;
  }

  .count-separator {
    font-size: 20px;
  }

  .couple-grid {
    grid-template-columns: 1fr;

    gap: 60px;
  }

  .couple-heart {
    order: 2;
  }

  .groom-card {
    order: 3;
  }

  .families-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns:
      repeat(2, 1fr);

    grid-auto-rows: 180px;

    gap: 8px;
  }

  .gallery-large {
    grid-column: span 2;

    grid-row: span 2;
  }

  .video-cover {
    min-height: 450px;

    border-radius: 20px;
  }

  .video-title {
    left: 25px;
    bottom: 25px;
  }

  .video-title h2 {
    font-size: 34px;
  }

  .location-grid {
    grid-template-columns: 1fr;

    gap: 35px;
  }

  .location-info h2 {
    font-size: 48px;
  }

  .map-wrapper,
  .map-wrapper iframe,
  .map-placeholder {
    min-height: 350px;

    height: 350px;
  }

  .gallery-lightbox {
    padding:
      60px 10px 100px;
  }

  .lightbox-prev,
  .lightbox-next {
    width: 40px;
    height: 40px;

    font-size: 25px;
  }

  .lightbox-prev {
    left: 10px;
  }

  .lightbox-next {
    right: 10px;
  }

  .lightbox-content img {
    max-height: 70vh;
  }

  .lightbox-thumbnails {
    justify-content: flex-start;
  }

}


/* =============================================================
   SMALL MOBILE
============================================================= */

@media (max-width: 480px) {

  .hero-label {
    font-size: 9px;

    letter-spacing: .2em;
  }

  .hero-heart {
    margin: 22px 0;
  }

  .hero-heart span {
    width: 35px;
  }

  .hero-date {
    font-size: 10px;

    letter-spacing: .16em;
  }

  .countdown-section,
  .invitation-section,
  .story-section,
  .couple-section,
  .events-section,
  .gallery-section,
  .location-section,
  .gift-section,
  .rsvp-section,
  .wishes-section {
    padding-top: 90px;
    padding-bottom: 90px;
  }

  .big-date strong {
    font-size: 120px;
  }

  .person-card h3 {
    font-size: 43px;
  }

  .event-day {
    font-size: 75px;
  }

  .gallery-grid {
    grid-auto-rows: 150px;
  }

  .music-button {
    right: 14px;
    bottom: 14px;
  }

}


/* =============================================================
   REDUCED MOTION
============================================================= */

@media (prefers-reduced-motion: reduce) {

  [data-reveal] {
    opacity: 1;

    transform: none;

    transition: none;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;

    animation-duration: .01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: .01ms !important;
  }

}

</style>