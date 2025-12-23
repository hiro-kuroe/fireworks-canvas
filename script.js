const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Particle {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;
    this.life = 300;  //寿命タイマー
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
  const hue = 220 - (1 - t) * 45;

  // 明るさも徐々に落とす
  const light = 60 - (1 - t) * 30;

  ctx.fillStyle = `hsla(${hue}, 100%, ${light}%, ${t})`;
  ctx.beginPath();
  ctx.arc(this.x, this.y, 0.5, 0, Math.PI * 2);
  ctx.fill();
}



  }

class Smoke {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = (Math.random() - 0.5) * 0.3;
    this.dy = -Math.random() * 0.2;
    this.life = 200;
    this.size += 0.03;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.life--;
    this.size += 0.05;
  }

  draw() {
    const t = this.life / 200;
    ctx.fillStyle = `rgba(80,80,80,${t * 0.06})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;
    this.dy = -4 - Math.random() * 1.5;//ロケットのスピード
    this.exploded = false;
    this.trail = [];
    this.explodeY =
      canvas.height * (0.2 + Math.random() * 0.25)
      - this.dy * 20;//爆発高さを追加
  }

  update() {
    this.y += this.dy;
    this.dy += 0.008; // 重力
    if (this.y < this.explodeY && !this.exploded) {
      this.exploded = true;
      firework(this.x, this.y);
    }
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();


  }

 draw() {
  ctx.fillStyle = "orange";
  ctx.fillRect(this.x, this.y, 2, 10);

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
  const count = 6000;//粒子数
  const baseSpeed = 2.0;
  
  for (let i = 0; i < count; i++) {
    const baseAngle = (i / count) * Math.PI * 2;
    const angle = baseAngle + (Math.random() - 0.5) * 0.15;
    const speed = baseSpeed * (0.1 + Math.random() * 0.6);

    particles.push(
      new Particle(x, y, angle, speed)
    );
  }
  for (let i = 0; i < 6; i++) {
    smokes.push(new Smoke(x, y));
}
  if (Math.random() < 0.3) {
    setTimeout(() => {
      firework(x, y);
    }, 120);
}

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



