const app = new PIXI.Application({
	width: 512, 
	height: 512,                       
	antialias: true, 
	transparent: false, 
	resolution: 1
})

let resources = PIXI.loader.resources;

document.body.appendChild(app.view);

PIXI.loader
	.add('knight', 'images/knight.png')
	.add('food-texture', 'images/Food.png')
	.load(setup)

let knight:PIXI.Sprite, line:PIXI.Graphics, knightvx:number;

function setup():void {
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

let fooditem: PIXI.Sprite,
	run:boolean = false,
	TextureCache = PIXI.utils.TextureCache,
	computerPoints:number = 0,
	playerPoints:number = 0;

class Food {
	private texture: PIXI.Texture;
	private rectangle: PIXI.Rectangle;
	private x:number = 0;
	private y:number = 0;

	constructor() {
		
		this.texture = TextureCache['food-texture'];
		
	}

	getRandomXY(x:number, y:number):void {
		const list: Array<number> = [0, 16, 32, 48, 64, 80, 96, 112];
		this.x = x = list[Math.floor(Math.random() * 8)];
		this.y = y = list[Math.floor(Math.random() * 8)];
	}

	loopFood():void {
		this.getRandomXY(this.x, this.y);
		this.rectangle = new PIXI.Rectangle(this.x, this.y, 16, 16);
		this.texture.frame = this.rectangle;
		fooditem = new PIXI.Sprite(this.texture);

		fooditem.x = Math.floor(Math.random() * 494);
		fooditem.y = 0;
		app.stage.addChild(fooditem);
		run = true;
		//console.log(this.texture);
	}
}

function gameLoop(delta:number):void {
	knight.x += knightvx;
	if(run) fooditem.y += 4 + delta;
	if(hitTestRectangle(fooditem, line)) {
		addPoints('computer');
		console.log('point for computer');
	}
	if(hitTestRectangle(fooditem, knight)) {
		addPoints('player');
		console.log('point for player');
	}
}

function addPoints(who:string) {
	app.stage.removeChild(fooditem);

	switch(who) {
		case 'player':
			playerPoints++;
			console.log('player points: ' + playerPoints);
			break;
		default:
			computerPoints++;
			console.log('computer points: ' + computerPoints);
	}
	if(computerPoints < 10) {
		newFood.loopFood();
	} else {
		alert('przegrałeś! Zdobyte punkty: ' + playerPoints);
		app.ticker.stop();
		run = false;
		playerPoints = 0;
		computerPoints = 0;
		document.getElementById('button').style.display = 'inline-block';
		document.getElementById('button').style.textAlign = 'zacznij od nowa';
	}
}

let newFood:Food;
function runGame():void {
	document.getElementById('button').style.display = 'none';
	newFood = new Food();
	newFood.loopFood();
	app.ticker.add(delta => gameLoop(delta));
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

function hitTestRectangle(r1:PIXI.Sprite, r2:PIXI.Sprite | PIXI.Graphics):boolean {
	//Define the variables we'll need to calculate
	let hit:boolean, combinedHalfWidths:number, combinedHalfHeights:number, vx:number, vy:number;
	//hit will determine whether there's a collision
	hit = false;
	//Find the center points of each sprite
	let r1centerX:number, r1centerY:number;
	let r1halfWidth:number, r1halfHeight:number;

	let r2centerX:number, r2centerY:number;
	let r2halfWidth:number, r2halfHeight:number;

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
			} else {
				//There's no collision on the y axis
				hit = false;
			}
		} else {
			//There's no collision on the x axis
			hit = false;
		}
	//`hit` will be either `true` or `false`
	return hit;
};