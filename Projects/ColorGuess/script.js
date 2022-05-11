
var colorList = [ // Base DataBase
    ["white", [255,255,255]],
    ["black", [0,0,0]],
    ["red", [255,0,0]],
    ["green", [0,255,0]],
    ["blue", [0,0,255]],
    ["yellow", [255,255,0]],
    ["purple", [255,0,255]],
    ["cyan", [0,255,255]]
];
var correctGuesses = 0;
var wrongGuesses = 0;

class Color {
    constructor (name, r, g, b){
        this.name = name;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    RNG(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomizeColor(){
        this.r = this.RNG(1,256);
        this.g = this.RNG(1,256);
        this.b = this.RNG(1,256);
    }

    guessName(){ // AI
        let [r,g,b] = [this.r, this.g, this.b];
        let name = this.name;
        let squaredError = 500;
        colorList.forEach(colorData => {
            let n = colorData[0];
            let c = colorData[1];
            let newSquaredError = Math.sqrt((r-c[0])**2 + (g-c[1])**2 + (b-c[2])**2);
            if (newSquaredError < squaredError){
                squaredError = newSquaredError;
                name = n;
            }
        });
        this.name = name;
    }

    export(){
        return [this.name, [this.r, this.g, this.b]];
    }
}


function changeBackgroundColor(){
    document.querySelector("main").style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
}
function changeTextColorName(){
    document.querySelector(".ai-guess").textContent = color.name
}
function getSuggestion(){
    let inp = document.querySelector(".user-guess input").value;
    if (color.name == inp){
        correctGuesses++;
    }
    else{
        wrongGuesses++;
    }
    document.querySelector("#guess-ratio").textContent = Math.round(correctGuesses / (correctGuesses + wrongGuesses)*100) + "%";
    color.name = document.querySelector(".user-guess input").value;
    colorList.push(color.export());
    update();
}
function update(color){
    changeTextColorName(color);
    changeBackgroundColor(color);
}
function changeColor(){
    var newColor = new Color(color.name, document.querySelector("#red").value, document.querySelector("#green").value, document.querySelector("#blue").value);
    color = newColor;
    color.guessName();
    update();
}
function newColor(){
    color.randomizeColor();
    color.guessName();
    document.querySelector("#red").value = color.r;
    document.querySelector("#green").value = color.g;
    document.querySelector("#blue").value = color.b;
    document.querySelector(".user-guess input").value = color.name;
    update();
}

document.querySelector("#red").addEventListener("input", ()=>{changeColor()});
document.querySelector("#green").addEventListener("input", ()=>{changeColor()});
document.querySelector("#blue").addEventListener("input", ()=>{changeColor()});

document.querySelector("#submit").addEventListener("click", ()=>{getSuggestion(); newColor();});
document.querySelector(".user-guess input").addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        getSuggestion(); 
        newColor();
    }
});


color = new Color("white", 255,255,255);
newColor();