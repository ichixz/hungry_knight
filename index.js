var app = new PIXI.Application({
    width: 512,
    height: 512,
    antialias: true,
    transparent: false,
    resolution: 1
});
var resources = PIXI.loader.resources;
document.body.appendChild(app.view);
PIXI.loader
    .add('knight', 'images/knight.png')
    .add('food-texture', 'images/Food.png')
    .load(setup);
var knight, line, knightvx;
function setup() {
    //rycerz
    knight = new PIXI.Sprite(resources['knight'].texture);
    knight.x = 230;
    knight.y = 428;
    knightvx = 0;
    app.stage.addChild(knight);
    //linia
    //Stworzenie linii końcowej
    line = new PIXI.Graphics();
    line.lineStyle(1, 0xFFFFFF, 1);
    line.moveTo(0, 0);
    line.lineTo(512, 0);
    line.x = 0;
    line.y = 505;
    //Dodanie lini końcowej do gry
    app.stage.addChild(line);
}
var fooditem, run = false, TextureCache = PIXI.utils.TextureCache, computerPoints = 0, playerPoints = 0;
var Food = /** @class */ (function () {
    function Food() {
        this.x = 0;
        this.y = 0;
        this.texture = TextureCache['food-texture'];
    }
    Food.prototype.getRandomXY = function (x, y) {
        var list = [0, 16, 32, 48, 64, 80, 96, 112];
        this.x = x = list[Math.floor(Math.random() * 8)];
        this.y = y = list[Math.floor(Math.random() * 8)];
    };
    Food.prototype.loopFood = function () {
        this.getRandomXY(this.x, this.y);
        this.rectangle = new PIXI.Rectangle(this.x, this.y, 16, 16);
        this.texture.frame = this.rectangle;
        fooditem = new PIXI.Sprite(this.texture);
        fooditem.x = Math.floor(Math.random() * 494);
        fooditem.y = 0;
        app.stage.addChild(fooditem);
        run = true;
        //console.log(this.texture);
    };
    return Food;
}());
function gameLoop(delta) {
    knight.x += knightvx;
    if (run)
        fooditem.y += 4 + delta;
    if (hitTestRectangle(fooditem, line)) {
        addPoints('computer');
        console.log('point for computer');
    }
    if (hitTestRectangle(fooditem, knight)) {
        addPoints('player');
        console.log('point for player');
    }
}
function addPoints(who) {
    app.stage.removeChild(fooditem);
    switch (who) {
        case 'player':
            playerPoints++;
            console.log('player points: ' + playerPoints);
            break;
        default:
            computerPoints++;
            console.log('computer points: ' + computerPoints);
    }
    if (computerPoints < 10) {
        newFood.loopFood();
    }
    else {
        alert('przegrałeś! Zdobyte punkty: ' + playerPoints);
        app.ticker.stop();
        run = false;
        playerPoints = 0;
        computerPoints = 0;
        document.getElementById('button').style.display = 'inline-block';
        document.getElementById('button').style.textAlign = 'zacznij od nowa';
    }
}
var newFood;
function runGame() {
    document.getElementById('button').style.display = 'none';
    newFood = new Food();
    newFood.loopFood();
    app.ticker.add(function (delta) { return gameLoop(delta); });
    //console.log(cookie);
}
//obsługa klawiszy
window.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 37:
            knightvx = -5;
            break;
        case 39:
            knightvx = 5;
            break;
        default:
            break;
    }
});
window.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 37:
            knightvx = 0;
            break;
        case 39:
            knightvx = 0;
            break;
        default:
            break;
    }
});
function hitTestRectangle(r1, r2) {
    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    //hit will determine whether there's a collision
    hit = false;
    //Find the center points of each sprite
    var r1centerX, r1centerY;
    var r1halfWidth, r1halfHeight;
    var r2centerX, r2centerY;
    var r2halfWidth, r2halfHeight;
    r1centerX = r1.x + r1.width / 2;
    r1centerY = r1.y + r1.height / 2;
    r2centerX = r2.x + r2.width / 2;
    r2centerY = r2.y + r2.height / 2;
    //Find the half-widths and half-heights of each sprite
    r1halfWidth = r1.width / 2;
    r1halfHeight = r1.height / 2;
    r2halfWidth = r2.width / 2;
    r2halfHeight = r2.height / 2;
    //Calculate the distance vector between the sprites
    vx = r1centerX - r2centerX;
    vy = r1centerY - r2centerY;
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1halfWidth + r2halfWidth;
    combinedHalfHeights = r1halfHeight + r2halfHeight;
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {
            //There's definitely a collision happening
            hit = true;
        }
        else {
            //There's no collision on the y axis
            hit = false;
        }
    }
    else {
        //There's no collision on the x axis
        hit = false;
    }
    //`hit` will be either `true` or `false`
    return hit;
}
;
