"use strict";

var view = document.querySelector('#view');
var app = new PIXI.Application({
  height: window.innerHeight,
  width: window.innerWidth,
  backgroundColor: 0x00000,
  view: view
});
var bubbleTexture = PIXI.Texture.from('../img/bubble.png');
var starAmount = 20;
var cameraZ = 0;
var fov = 20;
var baseSpeed = 0.025;
var speed = 0;
var warpSpeed = 0;
var starStretch = 5;
var starBaseSize = 0.005;
var stars = [];

for (var i = 0; i < starAmount; i++) {
  var star = {
    sprite: new PIXI.Sprite(bubbleTexture),
    z: 0,
    x: 0,
    y: 0
  };
  star.sprite.anchor.x = 0.5;
  star.sprite.anchor.y = 0.7;
  randomizeStar(star, true);
  app.stage.addChild(star.sprite);
  stars.push(star);
}

function randomizeStar(star, initial) {
  star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;
  var deg = Math.random() * Math.PI * 2;
  var distance = Math.random() * 50 + 1;
  star.x = Math.cos(deg) * distance;
  star.y = Math.sin(deg) * distance;
}
/*setInterval(() => {
  warpSpeed = warpSpeed > 0 ? 0 : 1
}, 5000)*/


app.ticker.add(function (delta) {
  speed += (warpSpeed - speed) / 20;
  cameraZ += delta * 10 * (speed + baseSpeed);

  for (var _i = 0; _i < starAmount; _i++) {
    var _star = stars[_i];
    if (_star.z < cameraZ) randomizeStar(_star);
    var z = _star.z - cameraZ;
    _star.sprite.x = _star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;
    _star.sprite.y = _star.y * (fov / z) * app.renderer.screen.height + app.renderer.screen.height / 2; //

    var dxCenter = _star.sprite.x - app.renderer.screen.width / 2;
    var dyCenter = _star.sprite.y - app.renderer.screen.height / 2;
    var distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
    var distanceScale = Math.max(0, (2000 - z) / 2000);
    _star.sprite.scale.x = distanceScale * starBaseSize;
    _star.sprite.scale.y = distanceScale * starBaseSize + distanceScale * speed * starStretch * distanceCenter / app.renderer.screen.width;
    _star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
  }
});