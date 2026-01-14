const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

function resize(){
 canvas.width=innerWidth;
 canvas.height=innerHeight;
}
resize();
addEventListener("resize",resize);

// safe css url
function cssUrl(v){
 return getComputedStyle(document.documentElement)
  .getPropertyValue(v)
  .trim()
  .replace(/^url\(["']?/, '')
  .replace(/["']?\)$/, '');
}

// load assets
const shipImg=new Image();
shipImg.src=cssUrl("--ship-img");

const hitSound=new Audio(cssUrl("--hit-sound"));

let player={x:200,y:400,w:60,h:60};
let bullets=[];
let enemies=[];
let score=0;
let weapon=1;

// touch move
canvas.addEventListener("touchmove",e=>{
 let t=e.touches[0];
 player.x=t.clientX-player.w/2;
 player.y=t.clientY-player.h/2;
 e.preventDefault();
});

// auto shoot
setInterval(()=>{
 for(let i=0;i<weapon;i++){
  bullets.push({
   x:player.x+player.w/2+(i*10)-(weapon*5),
   y:player.y
  });
 }
},250);

// enemy spawn
setInterval(()=>{
 enemies.push({
  x:Math.random()*(canvas.width-40),
  y:-40,w:40,h:40
 });
},700);

// loop
function game(){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 // player
 ctx.drawImage(shipImg,player.x,player.y,player.w,player.h);

 // bullets
 ctx.fillStyle="yellow";
 bullets.forEach(b=>{
  b.y-=12;
  ctx.fillRect(b.x,b.y,5,12);
 });

 // enemies
 ctx.fillStyle="red";
 enemies.forEach(e=>{
  e.y+=4;
  ctx.fillRect(e.x,e.y,e.w,e.h);
 });

 // collision
 enemies=enemies.filter(e=>{
  for(let b of bullets){
   if(b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){
    hitSound.currentTime=0;
    hitSound.play();
    score++;
    if(score%5==0 && weapon<6) weapon++;
    return false;
   }
  }
  return e.y<canvas.height;
 });

 // UI
 ctx.fillStyle="white";
 ctx.font="18px Arial";
 ctx.fillText("Score: "+score,20,30);
 ctx.fillText("Weapon Lv: "+weapon,20,55);

 requestAnimationFrame(game);
}
game();
