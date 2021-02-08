var PLAY = 1, END = 0, FINISH = -1, gs = PLAY;
var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;
var coinGroup, coinImage, coinSound;
var obstaclesGroup, obstacle2, obstacle1, obstacle3;
var gameOver, restart;
var score = 0, life = 3;
localStorage["HighestScore"] = 0;

function preload() {
  mario_running = loadAnimation("Capture1.png", "Capture3.png", "Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("backg.jpg");
  coinImage = loadImage("coin.png");
  coinSound = loadSound("coin.wav");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  mario = createSprite(50, 180, 20, 50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;
  ground = createSprite(0, 190, 1200, 10);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100);
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  coinGroup = new Group();
  obstaclesGroup = new Group();
}

function draw() {
  background("blue");
  if (gs === PLAY) {
    Play();
  } else if (gs == END) {
    End();
  } else if (gs == FINISH) {
    Finish();
  }
  drawSprites();
}

function Score() {
  textSize(20);
  fill(255);
  text("Score: " + score, 500, 40);
  text("Life: " + life, 500, 60);
}

function Play() {
  mario.velocityY = mario.velocityY + 0.8;
  ground.velocityX = -(6 + 3 * score / 100);
  Score();
  if (keyDown("space") && mario.y >= 139) {
    mario.velocityY = -12;
  }
  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }
  mario.collide(ground);
  Spawn_Coin();
  Spawn_Obstacles();
  if (obstaclesGroup.isTouching(mario)) {
    for (var i = 0;i<obstaclesGroup.length;i++) {
      if (obstaclesGroup.get(i).x<=mario.x) {
        obstaclesGroup.get(i).destroy();
      }
    }
    life--;
    gs = END;
  }
  if (coinGroup.isTouching(mario)) {
    coinGroup[0].destroy();
    score++;
    coinSound.play();
  }
  if (life == 0) {
    gs = FINISH;
  }
}

function Finish() {
  End();
  Reset();
  gs = FINISH;
  textSize(20);
  fill(255);
  text("Final Score - "+score, 250, 75);
  text("Highest Score - "+localStorage["HighestScore"], 250,100);
  text("Lives - 0", 250,125);
}

function End() {
  gameOver.visible = true;
  restart.visible = true;
  mario.addAnimation("collided", mario_collided);
  ground.velocityX = 0;
  mario.velocityY = 0;
  obstaclesGroup.setVelocityXEach(0);
  coinGroup.setVelocityXEach(0);
  mario.changeAnimation("collided", mario_collided);
  mario.scale = 0.35;
  obstaclesGroup.setLifetimeEach(-1);
  coinGroup.setLifetimeEach(-1);
  Score();
  if (mousePressedOver(restart)) {
    Reset();
  }
}

function Spawn_Coin() {
  if (frameCount % 60 === 0) {
    var coin = createSprite(600, Math.round(random(80, 120)), 40, 10);
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    coin.lifetime = 200;
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    coinGroup.add(coin);
  }
}

function Spawn_Obstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    switch (Math.round(random(1, 3))) {
      case 1:
        obstacle.addImage(obstacle2);
        break;
      case 2:
        obstacle.addImage(obstacle1);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
    }
    obstacle.velocityX = -(6 + 3 * score / 100);
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function Reset() {
  gs = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  mario.changeAnimation("running", mario_running);
  mario.scale = 0.5;
  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }
  score = 0;
}