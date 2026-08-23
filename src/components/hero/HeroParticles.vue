<template>
  <canvas
    ref="canvas"
    class="hero-particles"
  ></canvas>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
} from "vue";

const canvas = ref(null);

let ctx = null;

let width = 0;
let height = 0;

/* Giới hạn DPR 1.5 -> giảm chi phí fill canvas */
let dpr =
  Math.min(window.devicePixelRatio || 1, 1.5);

let animationId = 0;

const particles = [];

/* Chỉ vẽ khi hero đang hiển thị trong viewport */
let isVisible = true;

const prefersReducedMotion =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getMaxParticles = () => {
  if (window.innerWidth < 380) {
    return 20;
  }

  if (window.innerWidth < 768) {
    return 30;
  }

  return 50;
};


class Particle {

  constructor() {
    this.reset(true);
  }


  reset(first = false) {

    this.x =
      Math.random() * width;

    this.y = first
      ? Math.random() * height
      : -40;

    this.size =
      Math.random() * 8 + 6;

    this.speedY =
      Math.random() * 0.7 + 0.35;

    this.speedX =
      Math.random() * 0.5 - 0.25;

    this.rotation =
      Math.random() *
      Math.PI *
      2;

    this.rotateSpeed =
      (Math.random() - 0.5) *
      0.025;

    this.alpha =
      Math.random() * 0.45 + 0.2;

    const random =
      Math.random();

    if (random < 0.48) {

      this.type = "petal";

    } else if (random < 0.82) {

      this.type = "heart";

    } else {

      this.type = "spark";

    }
  }


  update() {

    this.y += this.speedY;

    this.x += this.speedX;

    this.rotation +=
      this.rotateSpeed;

    this.x +=
      Math.sin(
        this.y * 0.008
      ) * 0.25;


    if (
      this.y >
      height + 50
    ) {

      this.reset();

    }

  }


  draw() {

    if (!ctx) return;

    ctx.save();

    ctx.translate(
      this.x,
      this.y
    );

    ctx.rotate(
      this.rotation
    );

    ctx.globalAlpha =
      this.alpha;


    if (
      this.type === "heart"
    ) {

      drawHeart(
        this.size
      );

    } else if (
      this.type === "petal"
    ) {

      drawPetal(
        this.size
      );

    } else {

      drawSpark(
        this.size
      );

    }


    ctx.restore();

  }

}


/* =========================================================
   HEART
========================================================= */

function drawHeart(size) {

  ctx.fillStyle =
    "#f5c6a5";

  ctx.beginPath();

  ctx.moveTo(
    0,
    size * 0.9
  );

  ctx.bezierCurveTo(
    size * 1.8,
    -size * 0.5,
    size * 2.8,
    size * 0.4,
    0,
    size * 2.4
  );

  ctx.bezierCurveTo(
    -size * 2.8,
    size * 0.4,
    -size * 1.8,
    -size * 0.5,
    0,
    size * 0.9
  );

  ctx.fill();

}


/* =========================================================
   PETAL
========================================================= */

function drawPetal(size) {

  ctx.fillStyle =
    "#f3d5b4";

  ctx.beginPath();

  ctx.moveTo(
    0,
    -size
  );

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


/* =========================================================
   SPARK
========================================================= */

function drawSpark(size) {

  ctx.fillStyle =
    "#ffe6a8";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    size * 0.35,
    0,
    Math.PI * 2
  );

  ctx.fill();

}


/* =========================================================
   RESIZE
========================================================= */

function resize() {

  if (!canvas.value) return;

  width =
    canvas.value.parentElement
      ?.clientWidth ||
    window.innerWidth;

  height =
    canvas.value.parentElement
      ?.clientHeight ||
    window.innerHeight;

  dpr =
    Math.min(
      window.devicePixelRatio || 1,
      1.5
    );


  canvas.value.width =
    width * dpr;

  canvas.value.height =
    height * dpr;


  canvas.value.style.width =
    `${width}px`;

  canvas.value.style.height =
    `${height}px`;


  ctx =
    canvas.value.getContext(
      "2d"
    );


  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

}


/* =========================================================
   CREATE
========================================================= */

function createParticles() {

  particles.length = 0;

  const count =
    getMaxParticles();

  for (
    let i = 0;
    i < count;
    i++
  ) {

    particles.push(
      new Particle()
    );

  }

}


/* =========================================================
   ANIMATION
   - start/stop theo viewport & tab visibility
   -> không đốt GPU/CPU khi người dùng đang lăn
========================================================= */

function animate() {

  if (!ctx) return;

  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  particles.forEach(
    (particle) => {

      particle.update();

      particle.draw();

    }
  );


  animationId =
    requestAnimationFrame(
      animate
    );

}


function startAnimation() {

  if (
    animationId ||
    prefersReducedMotion ||
    !isVisible
  ) {
    return;
  }

  animationId =
    requestAnimationFrame(
      animate
    );

}


function stopAnimation() {

  if (animationId) {

    cancelAnimationFrame(
      animationId
    );

    animationId = 0;

  }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {

  resize();

  createParticles();


  /* Tạm dừng canvas khi hero ra khỏi màn hình */
  let visibilityObserver = null;

  if (canvas.value && "IntersectionObserver" in window) {

    visibilityObserver = new IntersectionObserver(
      (entries) => {

        isVisible = entries[0]?.isIntersecting ?? true;

        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }

      },
      {
        threshold: 0.02,
      }
    );

    visibilityObserver.observe(canvas.value);

  }


  /* Dừng khi tab ẩn */
  const handleVisibilityChange = () => {

    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }

  };

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );


  startAnimation();


  window.addEventListener(
    "resize",
    resize
  );


  onUnmounted(() => {

    stopAnimation();

    visibilityObserver?.disconnect();

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.removeEventListener(
      "resize",
      resize
    );

  });

});

</script>


<style scoped>

.hero-particles {

  position: absolute;

  inset: 0;

  width: 100%;

  height: 100%;

  z-index: 4;

  pointer-events: none;

}

</style>