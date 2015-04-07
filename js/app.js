//Object with properties that aren't directly connected to the player or the enemies
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
    },
    //Use message helper 'massage.js' to notify user of state
    notifications: function(message) {
        game.notice = true;
        dhtmlx.alert(message, function(){
            game.notice = false;
        });
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
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.col += (this.speed * dt);
    if (this.col > 5) {
        this.col = -1;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),101 * this.col, - 15 + 83 * this.row);
};

//Place enemy on a random square
Enemy.prototype.reset = function() {
    this.col = Math.floor(Math.random()*5);
    this.row = Math.floor(Math.random()*3 + 1);
};

//Set enemy to move at a random speed
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
    this.updateState();
};

//Draw the player to screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 101 * this.col, - 12 + 83 * this.row);
    game.displayLevel();
    this.displayLives();
};

//Check state, and update player accordingly
//options: collision, gameOver, passedLevel
Player.prototype.handleState = function() {
    if (this.state === "collision") {
        //Notify user of game state
        game.notifications("Ouch!");
        //Reset the player and the enemies
        resetAll();
    } else if (this.state === "gameOver"){
        game.level = 1;
        this.lives = 1;
        //Empty allEnemies array
        allEnemies.length = 0;
        //Add one enemy to allEnemies array
        getEnemies();
        //Notify user of game state
        game.notifications("Game Over!");
        //Reset the player and the enemies
        resetAll();
    } else if (this.state === "passedLevel"){
        //Notify user of game state
        game.notifications("You passed level " + game.level + "!");
        //Add one enemy to allEnemies array
        getEnemies();
        //Reset the player and the enemies
        resetAll();
        game.level++;
        this.lives++;
    }
    //Reset state
    this.state = "";
};

//Check for collision, game over or passed level
//store results in state variable,
//update amount of lives
Player.prototype.updateState = function() {
    if (this.isCollision()){
        this.state = "collision";
        this.lives--;
    }

    if (this.lives === 0) {
        this.state = "gameOver";
    }

    //Player reached the top row
    if (this.row === 0) {
        this.state = "passedLevel";
    }
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
/*Player.prototype.notifications = function(message) {
    game.notice = true;
    dhtmlx.alert(message, function(){
        game.notice = false;
    });
};*/

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