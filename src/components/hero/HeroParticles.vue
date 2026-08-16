<template>
  <canvas ref="canvas" class="hero-particles"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const canvas = ref(null);

let ctx;
let width = 0;
let height = 0;
let dpr = window.devicePixelRatio || 1;
let animationId = 0;

const particles = [];

const MAX_PARTICLES =
  window.innerWidth < 768
    ? 45
    : 90;

class Particle {

  constructor() {
    this.reset(true);
  }

  reset(first = false) {

    this.x = Math.random() * width;

    this.y = first
      ? Math.random() * height
      : -50;

    this.size = Math.random() * 10 + 8;

    this.speedY = Math.random() * 0.8 + 0.5;

    this.speedX = Math.random() * 0.8 - 0.4;

    this.rotation = Math.random() * Math.PI;

    this.rotateSpeed =
      (Math.random() - 0.5) * 0.03;

    this.alpha =
      Math.random() * 0.5 + 0.4;

    const r = Math.random();

    if (r < 0.45)
      this.type = "petal";
    else if (r < 0.75)
      this.type = "heart";
    else
      this.type = "spark";
  }

  update() {

    this.y += this.speedY;

    this.x += this.speedX;

    this.rotation += this.rotateSpeed;

    this.x +=
      Math.sin(this.y * 0.01) * 0.35;

    if (
      this.y >
      height + 60
    ) {
      this.reset();
    }

  }

  draw() {

    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.rotate(this.rotation);

    ctx.globalAlpha = this.alpha;

    switch (this.type) {

      case "petal":
        drawPetal(this.size);
        break;

      case "heart":
        drawHeart(this.size * 0.7);
        break;

      case "spark":
        drawSpark(this.size * 0.3);
        break;

    }

    ctx.restore();

  }

}

function drawPetal(size) {

  ctx.fillStyle = "#ffd3df";

  ctx.beginPath();

  ctx.moveTo(0, -size);

  ctx.bezierCurveTo(
    size,
    -size,
    size,
    size,
    0,
    size
  );

  ctx.bezierCurveTo(
    -size,
    size,
    -size,
    -size,
    0,
    -size
  );

  ctx.fill();

}

function drawHeart(size) {

  ctx.fillStyle = "#ff4d88";

  ctx.beginPath();

  ctx.moveTo(0, size);

  ctx.bezierCurveTo(
    size * 2,
    -size,
    size * 3,
    size,
    0,
    size * 3
  );

  ctx.bezierCurveTo(
    -size * 3,
    size,
    -size * 2,
    -size,
    0,
    size
  );

  ctx.fill();

}

function drawSpark(size) {

  ctx.fillStyle = "#fff8cc";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    size,
    0,
    Math.PI * 2
  );

  ctx.fill();

}

function resize() {

  width = window.innerWidth;

  height = window.innerHeight;

  dpr = window.devicePixelRatio || 1;

  canvas.value.width = width * dpr;

  canvas.value.height = height * dpr;

  canvas.value.style.width = width + "px";

  canvas.value.style.height = height + "px";

  ctx = canvas.value.getContext("2d");

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

}

function createParticles() {

  particles.length = 0;

  for (
    let i = 0;
    i < MAX_PARTICLES;
    i++
  ) {
    particles.push(
      new Particle()
    );
  }

}

function animate() {

  ctx.clearRect(
    0,
    0,
    width,
    height
  );

  particles.forEach((p) => {

    p.update();

    p.draw();

  });

  animationId =
    requestAnimationFrame(
      animate
    );

}

onMounted(() => {

  resize();

  createParticles();

  animate();

  window.addEventListener(
    "resize",
    resize
  );

});

onUnmounted(() => {

  cancelAnimationFrame(
    animationId
  );

  window.removeEventListener(
    "resize",
    resize
  );

});
</script>

<style scoped>

.hero-particles{

    position:absolute;

    inset:0;

    width:100%;

    height:100%;

    pointer-events:none;

    z-index:1000;

}

</style>
