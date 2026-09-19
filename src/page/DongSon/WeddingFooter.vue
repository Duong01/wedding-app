<template>
  <footer class="footer">
    <div class="footer-sun">
      <span>✦</span>
    </div>

    <div class="footer-content">
      <small>FOREVER BEGINS HERE</small>

      <div class="monogram">
        {{ monogram }}
      </div>

      <h2>
        {{ groomName }}
        <span>&</span>
        {{ brideName }}
      </h2>

      <div class="footer-line">
        <span />
        <b>𓅃</b>
        <span />
      </div>

      <p>
        {{ thanksMessage }}
      </p>

      <div class="footer-actions">
        <a
          v-if="facebookUrl"
          :href="facebookUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          <v-icon size="15">mdi-facebook</v-icon>

          <span>Facebook</span>
        </a>

        <a
          v-if="phoneUrl"
          :href="phoneUrl"
          class="footer-link"
        >
          <v-icon size="15">mdi-phone</v-icon>

          <span>{{ phoneDisplay }}</span>
        </a>

        <a
          v-if="emailUrl"
          :href="emailUrl"
          class="footer-link"
        >
          <v-icon size="15">mdi-email-outline</v-icon>

          <span>{{ emailDisplay }}</span>
        </a>
      </div>

      <div class="copyright">
        {{ copyrightText }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },
  monogram: String,
  currentYear: Number,
});

const groomName = computed(() =>
  props.wedding?.GroomName ||
  props.wedding?.groomName ||
  props.wedding?.footer?.GroomName ||
  props.wedding?.hero?.GroomName ||
  props.wedding?.couple?.Groom?.Name ||
  ""
);

const brideName = computed(() =>
  props.wedding?.BrideName ||
  props.wedding?.brideName ||
  props.wedding?.footer?.BrideName ||
  props.wedding?.hero?.BrideName ||
  props.wedding?.couple?.Bride?.Name ||
  ""
);

const thanksMessage = computed(() => {
  return (
    props.wedding?.footer?.Message ||
    "Cảm ơn bạn đã dành thời gian đến chung vui cùng gia đình chúng mình."
  );
});

const copyrightText = computed(() => {
  return (
    props.wedding?.footer?.Copyright ||
    `© ${props.currentYear ?? ""} · ${props.monogram ?? ""}`
  );
});

const facebookUrl = computed(() => {
  const raw =
    props.wedding?.footer?.Facebook ||
    props.wedding?.footer?.FacebookUrl ||
    props.wedding?.contact?.Facebook ||
    "";

  if (!raw) return "";

  return raw.startsWith("http") ? raw : `https://${raw}`;
});

const phoneDisplay = computed(() => {
  return (
    props.wedding?.footer?.Phone ||
    props.wedding?.contact?.Phone ||
    ""
  );
});

const phoneUrl = computed(() => {
  const raw = phoneDisplay.value;

  return raw ? `tel:${String(raw).replace(/[^\d+]/g, "")}` : "";
});

const emailDisplay = computed(() => {
  return (
    props.wedding?.footer?.Email ||
    props.wedding?.contact?.Email ||
    ""
  );
});

const emailUrl = computed(() => {
  const raw = emailDisplay.value;

  return raw ? `mailto:${raw}` : "";
});
</script>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  padding: 85px 20px 35px;
  background: #350b0a;
  color: #ead7b5;
  text-align: center;
}

.footer::before,
.footer::after {
  content: "";
  position: absolute;
  width: 280px;
  height: 280px;
  border: 1px solid rgba(201,149,82,.15);
  border-radius: 50%;
}

.footer::before {
  left: -170px;
  top: -100px;
}

.footer::after {
  right: -170px;
  bottom: -130px;
}

.footer-sun {
  position: absolute;
  top: -100px;
  left: 50%;
  width: 250px;
  height: 250px;
  transform: translateX(-50%);
  border: 1px dashed rgba(201,149,82,.2);
  border-radius: 50%;
}

.footer-sun span {
  position: absolute;
  bottom: 25px;
  left: 50%;
  color: #c99552;
}

.footer-content {
  position: relative;
  z-index: 2;
}

.footer-content > small {
  font-size: 10px;
  letter-spacing: .4em;
  color: #c99552;
}

.monogram {
  margin: 20px 0;
  font-family: Georgia, serif;
  font-size: 45px;
  color: #d4a35f;
}

h2 {
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 400;
}

h2 span {
  color: #c99552;
  margin: 0 5px;
}

.footer-line {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 230px;
  margin: 22px auto;
}

.footer-line span {
  height: 1px;
  flex: 1;
  background: rgba(201,149,82,.4);
}

.footer-line b {
  color: #c99552;
}

.footer-content p {
  font-family: Georgia, serif;
  line-height: 1.8;
  color: #cdb99b;
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 26px;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 16px;

  border: 1px solid rgba(201,149,82,.45);

  font-size: 11px;
  letter-spacing: .12em;

  color: #ead7b5;
  background: rgba(201,149,82,.08);

  text-decoration: none;

  transition: background .2s ease, border-color .2s ease;
}

.footer-link:hover {
  border-color: #c99552;
  background: rgba(201,149,82,.18);
}

.copyright {
  margin-top: 45px;
  font-size: 11px;
  letter-spacing: .3em;
  color: #806052;
}

@media (max-width: 480px) {
  .footer {
    padding: 65px 16px 28px;
  }

  .footer-actions {
    gap: 8px;
  }

  .footer-link {
    padding: 7px 12px;
  }
}
</style>
