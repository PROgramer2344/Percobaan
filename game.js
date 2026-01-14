const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize",resize);

// SAFE CSS URL READER
function cssUrl(name){
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
    .replace(/^url\(["']?/, '')
    .replace(/["']?\)$/, '');
}

// LOAD IMAGE & SOUND
const shipImg = new Image();
shipImg.src = cssUrl("--ship-img");

const hitSound = new Audio(cssUrl("--hit-sound"));

let player = {x:200,y:500,w:60,h:60};
let bullets = [];
let enemies = [];
let score = 0;
let weaponLevel = 1;

// TOUCH MOVE
canvas.addEventListener("touchmove",e=>{
  let t=e.touches[0];
  player.x=t.clientX-player.w/2;
  player.y=t.clientY-player.h/2;
  e.preventDefault();
});

// AUTO SHOOT
setInterval(()=>{
  for(let i=0;i<weaponLevel;i++){
    bullets.push({
      x:player.x+player.w/2+(i*8)-(weaponLevel*4),
      y:player.y
    });
  }
},250);

// ENEMY SPAWN
setInterval(()=>{
  enemies.push({
    x:Math.random()*(canvas.width-40),
    y:-40,w:40,h:40
  });
},700);

// GAME LOOP
function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // PLAYER
  ctx.drawImage(shipImg,player.x,player.y,player.w,player.h);

  // BULLETS
  ctx.fillStyle="yellow";
  bullets.forEach(b=>{
    b.y-=12;
    ctx.fillRect(b.x,b.y,5,12);
  });

  // ENEMIES
  ctx.fillStyle="red";
  enemies.forEach(e=>{
    e.y+=4;
    ctx.fillRect(e.x,e.y,e.w,e.h);
  });

  // COLLISION
  enemies = enemies.filter(e=>{
    for(let b of bullets){
      if(b.x>e.x && b.x<e.x+e.w && b.y>e.y && b.y<e.y+e.h){
        hitSound.currentTime=0;
        hitSound.play();
        score++;
        if(score%5==0 && weaponLevel<6) weaponLevel++;
        return false;
      }
    }
    return e.y<canvas.height;
  });

  // UI
  ctx.fillStyle="white";
  ctx.font="18px Arial";
  ctx.fillText("Score: "+score,20,30);
  ctx.fillText("Weapon Lv: "+weaponLevel,20,55);

  requestAnimationFrame(update);
}

update();
