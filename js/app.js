//Object with properties that aren't connected to the player or the enemies
var game = {
    pause: false,
    notice: false,
    level: 1,
    displayLevel: function() {
        $("#level").text(game.level);
    },
    handleInput: function(key) {
        if (key === 'space') {
            //space toggles pause mode
            game.pause = !game.pause;
        }
    }
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = this.getSpeed();
    this.reset();
    //this.speed = 0.1;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //console.log(dt);
    this.col += (this.speed * dt);
    if (this.col > 5) {
        this.col = -1;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //ctx.drawImage(Resources.get(this.sprite), 101*3, -10 +83*3);
    //this.board(this.col, this.row);
    ctx.drawImage(Resources.get(this.sprite),101 * this.col, - 15 + 83 * this.row);
    //console.log(this + " row: " + this.row + " col: " + this.col);
};

//places enemy on random square
Enemy.prototype.reset = function() {
    this.col = Math.floor(Math.random()*5);
    this.row = Math.floor(Math.random()*3 + 1);
};

//sets enemy to move at a random speed
Enemy.prototype.getSpeed = function() {
    speedArr = [1, 1.5, 2];
    var speed = Math.floor(Math.random() * speedArr.length);
    return speedArr[speed];
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.numCollisions = 0;
    this.col;
    this.row;
    this.state;
    this.lives = 1;
    this.reset();
};

// Update the player's position
Player.prototype.update = function() {

    this.handleState();
    //this.lives = (4 - this.numCollisions);

    if (this.isCollision()){
        this.numCollisions++;
        this.state = "collision";
        this.lives--;
    }

    if (this.lives === 0) {
        this.state = "gameOver";
        //this.numCollisions = 0;
    }

    if (this.row === 0) {
        this.state = "passedLevel";
    }
};

//Draw the player to screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 101 * this.col, - 12 + 83 * this.row);
    game.displayLevel();
    this.displayLives();
};

//checks players state, and updates player accordingly
//options: collision, gameOver, passedLevel
Player.prototype.handleState = function() {
    switch (this.state) {
        case "collision":
            //Notify user of game state
            this.notifications("Ouch!");

            //Reset the player
            resetAll();
            break;

        case "gameOver":
            //reset level
            game.level = 1;
            this.lives = 1;

            //Empty allEnemies array
            allEnemies.length = 0;

            //Add one enemy to allEnemies array
            getEnemies();

            //Notify user of game state
            this.notifications("Game Over");

            //Reset the player and the enemies
            resetAll();
            break;

        case "passedLevel":
            //Notify user of game state
            this.notifications("You passed level " + game.level + "!");

            //Add one enemy to allEnemies array
            getEnemies();

            //Reset the player and the enemies
            resetAll();

            game.level++;
            this.lives++;
        default:
    }
    this.state = "";
};

//Display amount of lives left
Player.prototype.displayLives = function() {
    $("#lives").text(this.lives);
};

//Check if the player is in the same square as an enemy
Player.prototype.isCollision = function() {
    for (i = 0; i < allEnemies.length; i++) {
        //Enemy can be in two squares while moving
        if ((this.col === Math.floor(allEnemies[i].col) || this.col === Math.ceil(allEnemies[i].col)) && this.row === allEnemies[i].row) {
            return true;
        }
    }
    return false;
};

//Use message helper to notify user of player state
Player.prototype.notifications = function(message) {
    game.notice = true;
    dhtmlx.alert(message, function(){
        game.notice = false;
    });

};

//Place the player at a random square on the bottom row
Player.prototype.reset = function() {
    this.col = Math.floor(Math.random()*5);
    this.row = 5;
};

Player.prototype.handleInput = function(key) {
    /*if (key === 'space') {
        //space toggles pause mode
        game.pause = !game.pause;
    }*/

    //Verify that game is not paused,
    //moves player in direcction of key pressed if still on board
    if (!game.pause && !game.notice) {
        if (key === 'up') {
            if (this.row > 0) {
                this.row--;
            }
        } else if (key === 'left') {
            if (this.col > 0) {
                this.col--;
            }
        } else if (key === 'down') {
            if (this.row < 5) {
                this.row++;
            }

        } else if (key === 'right') {
            if (this.col < 4) {
                this.col++;
            }
        }
    }
};

//Reset the player and the enemies
var resetAll = function() {
    player.reset();
    for (i = 0; i < allEnemies.length; i++) {
        allEnemies[i].reset();
    }
    player.numCollisions = 0;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//array holding all enemies
var allEnemies = [];

//Add one enemy
var getEnemies = function() {
    var enemy = new Enemy();
    allEnemies.push(enemy);
};

getEnemies();

//Instantiate the player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (allowedKeys[e.keyCode] === 'space') {
        game.handleInput(allowedKeys[e.keyCode]);
    } else {
        player.handleInput(allowedKeys[e.keyCode]);
    }

});