
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
    this.life = 180;  
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    const age = 1 - this.life / 180;

    // 後半ほど重力が強くなる
    this.dy += 0.03 + age * 0.12;

    // 空気抵抗っぽく横も減衰
    this.dx *= 0.985;

    this.life--;
  }




  draw() {
  const t = this.life / 180; // 1 → 0

  // hue: 赤(0) → オレンジ(30) → 金(45)
  const hue = 45 - (1 - t) * 45;

  // 明るさも徐々に落とす
  const light = 75 - (1 - t) * 35;

  ctx.fillStyle = `hsla(${hue}, 100%, ${light}%, ${t})`;
  ctx.beginPath();
  const r = 0.3 + (1 - t) * 0.8;
  ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
  ctx.fill();
  }
}


class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;
    this.dy = -4 - Math.random() * 1.3;
    this.exploded = false;
    this.trail = [];
  }

  update() {
    this.y += this.dy;
    this.dy += 0.006; // 重力
    if (this.y < canvas.height * 0.4 && !this.exploded) {
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


function firework(x, y) {
  const count = 120;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i;
const speed =
  Math.random() < 0.3
    ? 1.5 + Math.random() * 1.5
    : 3 + Math.random() * 2;
    particles.push(
      new Particle(x, y, angle, speed)
    );
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
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  rockets = rockets.filter(r => !r.exploded);
  rockets.forEach(r => {
   r.update();
   r.draw();
  });


  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}
animate();



