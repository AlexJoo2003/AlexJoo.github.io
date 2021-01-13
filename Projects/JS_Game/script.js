// some global variables

let player = document.getElementById("player");
let area = document.getElementById("playArea");
let health = document.getElementById("health");

// The mode is going to be harder and harder the more points you get
// It starts of with the "baby" mode
var modes = [
    // min time, max time, min amount, max amount, max total
    [10, 15, 0, 3, 10, 1000], // baby
    [8, 12, 3, 7, 20, 500], // easy
    [5, 10, 5, 10, 30, 100],// normal
    [5, 15, 10, 20, 50, 1000], // hard
];
var scores = [0, 50, 500, 2000]; // the scores variable dictates when to change the mode Line: 223
var mode_id = 0;
var current_mode = modes[0];
var time = [current_mode[0], current_mode[1]]; // range of time for a bullet to reach the other side of the screen (the smaller the faster) Line: 103
var amount = [current_mode[2], current_mode[3]]; // range of amount of bullets can spawn every second Line: 78
var total = current_mode[4]; // cap of bullets currently on the screen Line: 79
var score = 0;
var max_hp = 5;
var score_multiplier = 1; // The multiplier will increase every 5 seconds Line: 34
var dead = false;

var loose_sound = new Audio("loose.mp3");
var punch_sound = new Audio("punch.mp3");

var menu_open = false;

var spawnBulletsInterval = setInterval(spawnBullets, 1000); // This Interval will spawn bullets every second Line: 76
setInterval(checkOverlap, 10); // This will check if any bullet is coliding with the player Line: 133
setInterval(changeScoreMultiplier, 5000, false); // Will change score multiplier Line: 247

function getCssProperty(elem, property){
   return Number(String(window.getComputedStyle(elem).getPropertyValue(property)).replace("px", ""));
}
function getPosition(obj){
    let x = getCssProperty(player, "left")+player.offsetWidth/2;
    let y = getCssProperty(player, "top")+player.offsetWidth/2;
    return [x,y];
}
function setPosition(obj, pos){
    // I am changing position by changing the left and top css property.
    // The math here does so that the middle of the cube will be positioned where I clicked
    if (pos[0]-obj.offsetWidth/2<0){
        obj.style.left = "0px";
    }
    else if (pos[0]-obj.offsetWidth/2+obj.offsetWidth > area.offsetWidth){
        obj.style.left = String(area.offsetWidth-obj.offsetWidth-2)+"px"; // -2 because of 2 px of border
    }
    else{
        obj.style.left = String(pos[0]-obj.offsetWidth/2)+"px";
    }
    if (pos[1]-obj.offsetHeight/2<0){
        obj.style.top = "0px";
    }
    else if (pos[1]-obj.offsetHeight/2+obj.offsetHeight > area.offsetHeight){
        obj.style.top = String(area.offsetHeight-obj.offsetHeight-2) + "px";
    }
    else{
        obj.style.top = String(pos[1]-obj.offsetHeight/2)+"px";
    }
}
function getMousePosition(event){
    // This runs every time user clicks in the Area (index.html:24)
    let x = event.clientX - area.offsetLeft;
    let y = event.clientY - area.offsetTop;

    setPosition(player,[x, y]);
}
function RNG(min, max){
    return Math.floor((Math.random() * max) + min);
}
function spawnBullets(){
    if (!dead){
        for (i = 0; i < RNG(amount[0],amount[1]); i++){ // random amount of bullets
            if (document.getElementsByClassName("bullet").length >= total){ // if hit the cap, don't spawn anything
                break;
            }
            let bullet = document.createElement("div"); // creating a bullet element
            bullet.className = "bullet";
            let side = RNG(0,4);
            switch (side){ // What side it will spawn on
                case 0: //top
                    bullet.style.top = "-10px";
                    bullet.style.left = String(RNG(area.offsetLeft, area.offsetWidth-10))+"px";
                    break;
                case 1: //right
                    bullet.style.top = String(RNG(area.offsetTop, area.offsetHeight-10))+"px";
                    bullet.style.left = String(window.innerWidth) + "px";
                    break;
                case 2: //down
                    bullet.style.top = String(window.innerHeight) + "px";
                    bullet.style.left = String(RNG(area.offsetLeft, area.offsetWidth-10))+"px";
                    break;
                case 3: //left
                    bullet.style.top = String(RNG(area.offsetTop, area.offsetHeight-10))+"px";
                    bullet.style.left = "-10px";
                    break;
            }
            let t = RNG(time[0], time[1]); // setting the time the bullet will take to move to the other side
            bullet.style.transition = "all " + String(t) + "s linear";
            document.body.appendChild(bullet);
            setTimeout(moveBullet, 10, bullet, side); // start moving the bullet Line: 111
            setTimeout(despawnBullet,t*1000, bullet); // despawn the bullet after the set amount of time in ms Line: 127
        }
    }
}
function moveBullet(bullet, side){
    switch (side){ // Determine which side the bullet shold go to depending on it's spawn location
            case 0: // top
                bullet.style.top = String(window.innerHeight + 10) + "px";
                break;
            case 1: // right
                bullet.style.left = "-10px";
                break;
            case 2: // down
                bullet.style.top = "-10px";
                break;
            case 3: // left
                bullet.style.left = String(window.innerWidth + 10) + "px";
                break;
        }
}
function despawnBullet(bullet){ // No need for an ID to identify the bullet, since the whole element is used as an argument
    if (bullet){
        document.body.removeChild(bullet);
        changeScore(); // The score increases everytime a bullet despawns Line: 217
    }
}
function checkOverlap(){
    let bullets = [ ...document.getElementsByClassName("bullet")];
    if (bullets.length > 0){ // checks every bullet
        // Found this method on reddit
        bullets.forEach(bullet => {
            let playerBound = player.getBoundingClientRect();
            let bulletBound = bullet.getBoundingClientRect();
            let px = playerBound.left + playerBound.width * 0.5;
            let py = playerBound.top + playerBound.height * 0.5;
            let bx = bulletBound.left + bulletBound.width * 0.5;
            let by = bulletBound.top + bulletBound.height * 0.5;
            let wOff = (playerBound.width + bulletBound.width) * 0.5;
            let hOff = (playerBound.height + bulletBound.height) * 0.5;

            if (Math.abs(px - bx) < wOff && Math.abs(py - by) < hOff){
                despawnBullet(bullet);
                [ ...document.getElementsByClassName("bullet")].forEach(bullet => {
                    despawnBullet(bullet);
                });
                drainHealth();
                for (i = 0; i <= 1000; i++){
                    clearInterval(i);
                }
                changeScore(0);
                setInterval(changeScoreMultiplier, 5000);
                setInterval(checkOverlap, 10);
                setInterval(spawnBullets, 1000);
            }
        });
    }
}
function drainHealth(){ // selfexplanitory
    let hp = Number(health.innerText);
    changeScoreMultiplier(true);
    if (hp == 1 || !hp){
        health.innerText = ";(";
        dead = true;
        clearInterval(spawnBulletsInterval);
        loose_sound.play();
        openOverlay();
        menu_open = true;
        return 0;
    }
    punch_sound.play();
    hp--;
    health.innerText = String(hp);
}
document.addEventListener('keydown', function (event) { // listen for arrowkeys and WASD
    switch (event.key){
        case "w":
        case "ArrowUp":
            setPosition(player, [getPosition(player)[0], getPosition(player)[1]-50]);
            break;
        case "d":
        case "ArrowRight":
            setPosition(player, [getPosition(player)[0]+50, getPosition(player)[1]]);
            break;
        case "s":
        case "ArrowDown":
            setPosition(player, [getPosition(player)[0], getPosition(player)[1]+50]);
            break;
        case "a":
        case "ArrowLeft":
            setPosition(player, [getPosition(player)[0]-50, getPosition(player[1])]);
            break;
        case "Escape": // opens the overlay screen on Spacebar or Escape
        case " ":
            if (menu_open){
                document.getElementsByClassName("overlay")[0].style.height = "0";
                menu_open = false;
            }
            else{
                document.getElementsByClassName("overlay")[0].style.height = "100%";
                menu_open = true;
            }
            break;
    }
});
function openOverlay(){
    document.getElementsByClassName("overlay")[0].style.height = "100%";
}
function closeOverlay(){
    document.getElementsByClassName("overlay")[0].style.height = "0";
}
function changeScore(){
    if (!dead){
        score_add = 1 * score_multiplier;
        score += score_add;
        document.getElementsByClassName("score")[0].innerText = String(Math.round(score));
    
        for (i = 0; i < scores.length; i++){ // detects if score reached the requered amount to be able to move on to the next mode difficulty
            if (score >= scores[mode_id+1] && mode_id < i){
                changeMode();
                break;
            }
        }
        for (i = 0; i < scores.length; i++){
            if (score >= scores[i] && score < scores[i] && current_mode != modes[i+1]){
                changeMode(i);
            }
        }
    }
}
function changeMode(){
    if (mode_id < modes.length){ // changes the global variables depending on the current mode
        mode_id++;
        current_mode = modes[mode_id];
        time = [current_mode[0], current_mode[1]];
        amount = [current_mode[2], current_mode[3]];
        total = current_mode[4];
        clearInterval(spawnBulletsInterval);
        spawnBulletsInterval = setInterval(spawnBullets, current_mode[5]);
    }
}
function changeScoreMultiplier(lostHP){
    if (!dead){
        if (lostHP){ // if a bullet hits you the multiplier goes back to 1
            score_multiplier = 1;
        }
        else{ // add .1
            score_multiplier = Math.round((score_multiplier + 0.1) * 100) / 100;
        }
        let score_multiplier_text = document.getElementById("score_multiplier");
        score_multiplier_text.innerText = "x " + String(score_multiplier);
    }
}