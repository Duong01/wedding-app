<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> GUEST BOOK </span>

        <h1>Sổ lưu bút</h1>

        <p>Cho phép khách mời gửi lời chúc.</p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> Hiển thị sổ lưu bút </strong>

        <small> Khách mời có thể gửi lời chúc. </small>
      </div>

      <v-switch
        v-model="wedding.guestBook.Enabled"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>Tiêu đề</label>

      <input v-model="wedding.guestBook.Title" type="text" />
    </div>

    <div class="guest-list">
      <article
        v-for="guest in wedding.guestBook.Guest"
        :key="guest.Id"
        class="guest-card"
      >
        <div class="guest-avatar">
          <v-icon size="17"> mdi-account-heart-outline </v-icon>
        </div>

        <div class="guest-content">
          <strong>
            {{ guest.Name }}
          </strong>

          <p>
            {{ guest.Message }}
          </p>

          <small>
            {{ guest.CreatedAt }}
          </small>
        </div>
      </article>

      <div v-if="!wedding.guestBook.Guest?.length" class="empty-card">
        <v-icon size="30"> mdi-message-heart-outline </v-icon>

        <strong> Chưa có lời chúc </strong>

        <span> Lời chúc của khách mời sẽ hiển thị ở đây. </span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  wedding: { type: Object, required: true },
});
</script>
