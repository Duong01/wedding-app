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
        Cảm ơn bạn đã dành thời gian
        <br />
        đến chung vui cùng gia đình chúng mình.
      </p>

      <div class="copyright">
        © {{ currentYear }} · {{ monogram }}
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
  "Chú Rể"
);

const brideName = computed(() =>
  props.wedding?.BrideName ||
  props.wedding?.brideName ||
  "Cô Dâu"
);
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
  font-size: 8px;
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

.copyright {
  margin-top: 45px;
  font-size: 7px;
  letter-spacing: .3em;
  color: #806052;
}
</style>