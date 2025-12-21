const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Particle {
  constructor(x, y, angle, speed, color) {
    this.x = x;
    this.y = y;
    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;
    this.life = 180;    
    this.color = color;
    this.alpha = 1;

  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += 0.03;
    this.life--;
  }


  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  }


class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;
    this.dy = -6 - Math.random() * 2;
    this.exploded = false;
    this.trail = [];
  }

  update() {
    this.y += this.dy;
    this.dy += 0.05; // 重力
    if (this.y < canvas.height * 0.4 && !this.exploded) {
      this.exploded = true;
      firework(this.x, this.y);
    }
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();


  }

  draw() {
  ctx.fillStyle = this.color.replace(")", `, ${this.life / 90})`);
  ctx.beginPath();
  ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
  ctx.fill();
}



let rockets = [];
let particles = [];


function firework(x, y) {
  const count = 180;
  const baseSpeed = 3.2;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = baseSpeed + Math.random() * 0.3; // ほぼ同速
    const color = "hsl(" + Math.random() * 360 + ",100%,70%)";

    const p = new Particle(x, y, angle, speed, color);
    p.life = 110;        // 寿命を揃える
    p.alpha = 1;
    p.gravity = 0.01;   // 重力を弱める（重要）
    particles.push(p);
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
  ctx.fillStyle = "rgba(0,0,0,0.02)";
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
  update() {
  this.x += this.dx;
  this.y += this.dy;
  this.dy += this.gravity ?? 0.03;
  this.life--;
}

  });

  requestAnimationFrame(animate);
}
animate();


