<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> DESIGN SYSTEM </span>

        <h1>Giao diện</h1>

        <p>Tùy chỉnh màu sắc, font và bố cục.</p>
      </div>
    </div>

    <!-- CURRENT THEME -->
    <div class="theme-current">
      <div
        class="theme-color-preview"
        :style="{
          background: wedding.theme.Colors.Primary,
        }"
      >
        ♥
      </div>

      <div class="theme-current-info">
        <span> Theme hiện tại </span>

        <strong>
          {{ wedding.theme.Name }}
        </strong>
      </div>
    </div>

    <!-- COLORS -->
    <h3 class="sub-heading">Màu sắc</h3>

    <div class="color-grid">
      <div class="color-field">
        <label>Primary</label>

        <div class="color-control">
          <input v-model="wedding.theme.Colors.Primary" type="color" />

          <input v-model="wedding.theme.Colors.Primary" type="text" />
        </div>
      </div>

      <div class="color-field">
        <label>Secondary</label>

        <div class="color-control">
          <input v-model="wedding.theme.Colors.Secondary" type="color" />

          <input v-model="wedding.theme.Colors.Secondary" type="text" />
        </div>
      </div>

      <div class="color-field">
        <label>Accent</label>

        <div class="color-control">
          <input v-model="wedding.theme.Colors.Accent" type="color" />

          <input v-model="wedding.theme.Colors.Accent" type="text" />
        </div>
      </div>

      <div class="color-field">
        <label>Accent Light</label>

        <div class="color-control">
          <input
            v-model="wedding.theme.Colors.AccentLight"
            type="color"
          />

          <input v-model="wedding.theme.Colors.AccentLight" type="text" />
        </div>
      </div>

      <div class="color-field">
        <label>Background</label>

        <div class="color-control">
          <input v-model="wedding.theme.Colors.Background" type="color" />

          <input v-model="wedding.theme.Colors.Background" type="text" />
        </div>
      </div>

      <div class="color-field">
        <label>Background Secondary</label>

        <div class="color-control">
          <input
            v-model="wedding.theme.Colors.BackgroundSecondary"
            type="color"
          />

          <input
            v-model="wedding.theme.Colors.BackgroundSecondary"
            type="text"
          />
        </div>
      </div>

      <div class="color-field">
        <label>Text</label>

        <div class="color-control">
          <input v-model="wedding.theme.Colors.Text" type="color" />

          <input v-model="wedding.theme.Colors.Text" type="text" />
        </div>
      </div>

      <div class="color-field">
        <label>Text Secondary</label>

        <div class="color-control">
          <input
            v-model="wedding.theme.Colors.TextSecondary"
            type="color"
          />

          <input
            v-model="wedding.theme.Colors.TextSecondary"
            type="text"
          />
        </div>
      </div>

      <div class="color-field">
        <label>White</label>

        <div class="color-control">
          <input v-model="wedding.theme.Colors.White" type="color" />

          <input v-model="wedding.theme.Colors.White" type="text" />
        </div>
      </div>
    </div>

    <!-- FONT -->
    <h3 class="sub-heading">Font</h3>

    <div class="form-grid">
      <div class="editor-field">
        <label>Font nội dung</label>

        <input v-model="wedding.theme.Fonts.Main" type="text" />
      </div>

      <div class="editor-field">
        <label>Font tiêu đề</label>

        <input v-model="wedding.theme.Fonts.Heading" type="text" />
      </div>

      <div class="editor-field">
        <label>Font chữ nghệ thuật</label>

        <input v-model="wedding.theme.Fonts.Script" type="text" />
      </div>
    </div>

    <!-- LAYOUT -->
    <h3 class="sub-heading">Layout</h3>

    <div class="form-grid">
      <div class="editor-field">
        <label>Max width</label>

        <input v-model="wedding.theme.Layout.MaxWidth" type="text" />
      </div>

      <div class="editor-field">
        <label>Section padding</label>

        <input
          v-model="wedding.theme.Layout.SectionPadding"
          type="text"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  wedding: { type: Object, required: true },
});
</script>
