const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Particle {
  constructor(x, y, angle, speed, hue) {
    this.x = x;
    this.y = y;
    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;
    this.life = 200;  //寿命タイマー
    this.hue = hue;
  }

  update() {
  this.x += this.dx;
  this.y += this.dy;

  if (this.life < 120) {
    this.dy += 0.008;
  }

  this.life--;
}



  draw() {
  const t = this.life / 240; // 1 → 0

  // hue: 赤(0) → オレンジ(30) → 金(45)
  const hue = this.hue - (1 - t) * 20;

  const light = 60 - (1 - t) * 30;
  const r = 1.5 * t + 0.5;

  const alpha = 0.4 + t * 0.6;
  ctx.fillStyle = `hsla(${hue}, 100%, ${light}%, ${alpha})`;
  ctx.beginPath();
  ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
  ctx.fill();
}



  }

class Smoke {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.dx = (Math.random() - 0.5) * 0.15;
    this.dy = -Math.random() * 0.1;

    this.life = 260;
    this.size = 10 + Math.random() * 20;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.life--;
    this.size += 0.12;
  }

  draw() {
    const t = this.life / 260;
    ctx.fillStyle = `rgba(40,40,40,${t * 0.008})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}


class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;
    this.dy = -4 - Math.random() * 1.5;
    this.exploded = false;
    this.trail = [];
    this.explodeY =
      canvas.height * (0.2 + Math.random() * 0.25)
  }

  update() {
    this.y += this.dy;
    this.dy += 0.008; 
    if (this.y < this.explodeY && !this.exploded) {
      this.exploded = true;
      firework(this.x, this.y);
    }
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();


  }

 draw() {
  ctx.fillStyle = "white";
  ctx.fillRect(this.x, this.y, 1, 10);

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  this.trail.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
}
}


let rockets = [];
let particles = [];
let smokes = [];



function firework(x, y) {
  const count = 1500;
  const baseSpeed = 2.0;

  const THEME_HUE = 200;//190～230
  const baseHue = THEME_HUE + (Math.random() - 0.5) * 20; // ±10だけ揺らす

  // 花火粒子
  for (let i = 0; i < count; i++) {
    const baseAngle = (i / count) * Math.PI * 2;
    const angle = baseAngle + (Math.random() - 0.5) * 0.15;
    const speed = baseSpeed * (0.5 + Math.random() * 0.8);

    particles.push(
      new Particle(x, y, angle, speed, baseHue)
    );
  }

  // 煙（遅れて出す）
  setTimeout(() => {
    for (let i = 0; i < 14; i++) {
      const r = 30 + Math.random() * 60;
      const a = Math.random() * Math.PI * 2;

      smokes.push(
        new Smoke(
          x + Math.cos(a) * r,
          y + Math.sin(a) * r
        )
      );
    }
  }, 80); 
}

canvas.addEventListener("click", e => {
  rockets.push(new Rocket(e.clientX));
});

canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  rockets.push(new Rocket(t.clientX));
});


function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.03)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  rockets = rockets.filter(r => !r.exploded);
  rockets.forEach(r => {
   r.update();
   r.draw();
  });

  smokes = smokes.filter(s => s.life > 0);
  smokes.forEach(s => {
    s.update();
    s.draw();
  });

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}
animate();



