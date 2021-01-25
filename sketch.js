var trex, trex_running, edges, ground, groundmov, invground, cloudima,cloudGroup,cactiGroup, trexdead,gameover,gameOver;
var cactus1,cactus2,cactus3,cactus4,cactus5,cactus6;
var jumpSound,dieSound,checkSound;
var gameState = "play";
var sNum = 100;
var fNum
var score = 0;
function preload() {

  trex_running = loadAnimation("trex1.png", "trex4.png", "trex3.png");
  groundmov = loadImage("ground2.png");
  cloudima = loadImage("cloud.png");
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  trexdead = loadAnimation("trex_collided.png");
  gameOver = loadImage("gameOver.png");
  jumpSound = loadSound("jump.mp3");
  dieSound= loadSound("die.mp3");
  checkSound=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200)

  //Invisible ground to debug trex floting 
  invground = createSprite(50, 190, 100, 20);
  invground.visible = false;

  //create a trex sprite
  trex = createSprite(50, 169, 20, 50);
  trex.addAnimation("run", trex_running)
  trex.scale = 0.75;
  trex.debug = false;
  trex.addAnimation("dead",trexdead)
  //Ground sprite
  ground = createSprite(300, 180, 800, 30);
  
  ground.addImage("move", groundmov);
  gameover= createSprite(300,100);
  gameover.addImage(gameOver);
 
  //creating edge sprites
  edges = createEdgeSprites();
  
  //creating groups
  cloudGroup = new Group();
  cactiGroup = new Group();
  
}

function draw() {
  background("lightblue");
  console.log(gameState);
  if(gameState === "play")
    {
    trex.changeAnimation("run", trex_running);
       gameover.visible=false;
      score += Math.round(frameRate()/30 );
      if(score % 25 ===0 && score!=0)
        
        { ground.velocityX = -(2+score/5);
         sNum -= 3;
         console.log (sNum)
         console.log(ground.velocityX)
          checkSound.play();
        }
      ground.velocityX = -2;
      //jump logic for trex
  if (keyDown("space") && trex.y > 90) {
    trex.velocityY = -12;
    jumpSound.play();
  }
  //resetting the ground to make it go on forever
  if (ground.x < 0) {
    ground.x = ground.width / 2
  }
      //spawn clouds at every 50 frames
  cloud();
  //spawn the cacti 
  cacti(sNum);
      if(cactiGroup.isTouching(trex))
        { 
          dieSound.play();
          gameState = "stop";
        }
    }
  else if(gameState === "stop")
    {
       gameover.visible=true;
      ground.velocityX = 0;
      cloudGroup.setVelocityXEach(0);
      cactiGroup.setVelocityXEach(0);
      cloudGroup.setLifetimeEach(-1);
      cactiGroup.setLifetimeEach(-1);
      trex.changeAnimation("dead",trexdead);
      if(keyDown("space") || mousePressedOver(gameover)){
       reset(); 
      }
    }
  
  //adding the gravity to trex.
  trex.velocityY = trex.velocityY + 0.9;
  //trex not falling off from the ground and also touching the ground 
  trex.collide(invground);
  text("score:"+score,20,22)
  drawSprites();

}
function reset(){
        score=0;
        sNum = 100;
        cactiGroup.destroyEach();
        cloudGroup.destroyEach();
        gameState = "play";
}
function cloud() {
  //true for every 50 frames
  if (frameCount % 50 === 0) {
    var cloud = createSprite(600, 20);
    cloudGroup.add(cloud)
    //rounding off the random number to make sure they are all diffrent integers
    //spawing clouds at diffrent heights
    cloud.y = Math.round(random(20, 70));
    cloud.velocityX = -3;
    cloud.addImage(cloudima);
    cloud.depth=trex.depth;
    //trex.depth = trex.depth+1
    trex.depth += 1; 
    cloud.lifetime = 250;
  }
  
}
function cacti(fNum)
{
  if(frameCount%fNum === 0) {
    var cactus = createSprite(580, 155, 20, 50);
    //adding all the cacti into the group
    cactiGroup.add(cactus);
    cactus.velocityX=-3;
    var imgRand = Math.round(random(1,6));
    switch(imgRand)
      {
        case 1: cactus.addImage(cactus1);
                break;
        case 2: cactus.addImage(cactus2);
                break;
        case 3: cactus.addImage(cactus3);
                break;
        case 4: cactus.addImage(cactus4);
                break;
        case 5: cactus.addImage(cactus5);
                break;
        case 6: cactus.addImage(cactus6);
                break;
        default: break;        
      }
    cactus.scale = 0.4;
    cactus.lifetime = 200;
  }
}