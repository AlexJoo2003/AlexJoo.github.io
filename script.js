var card_deck = [...document.querySelectorAll("article")];
var top_card = card_deck[card_deck.length - 1];
top_card.classList.remove("card");
top_card.classList.add("top_card");
var top_card_link = document.querySelector("#"+top_card.id+"_link");
top_card_link.classList.remove("card_link")
top_card_link.classList.add("top_card_link");

var mousedown_card = false;

function setup_top_card(){
    top_card.addEventListener("mouseover", top_card_mouseover);
    top_card.addEventListener("mouseout", top_card_mouseout);
    top_card.addEventListener("mousedown", top_card_mousedown);
    top_card.addEventListener("mouseup", top_card_mouseup);
    top_card_link.addEventListener("mouseover", top_card_mouseover);
    top_card_link.addEventListener("mousedown", top_card_mousedown);
    top_card_link.addEventListener("mouseup", top_card_mouseup);
    top_card_link.addEventListener("mouseout", top_card_mouseout);
}
function remove_top_card(){
    let new_card = top_card.cloneNode(true);
    new_card.classList.remove("top_card");
    new_card.classList.add("card");
    top_card.parentNode.replaceChild(new_card, top_card);
    top_card_link.classList.remove("top_card_link");
    top_card_link.classList.add("card_link");
    let new_link = top_card_link.cloneNode(true);
    top_card_link.parentNode.replaceChild(new_link, top_card_link);
    top_card = false;
    top_card_link = false;
}
function top_card_mouseover(){
    top_card.classList.add("top_card_hover");
    top_card.querySelector(".card_name").classList.add("card_name_hover");
    // top_card.querySelector(".card_desc").classList.add("card_desc_hover");

    mousedown_card = true;
    setTimeout(function(){
        console.log(mousedown_card);
        if (mousedown_card){
            top_card.querySelector(".card_desc").classList.add("card_desc_hover");
        }
    }, 1000);
}
function top_card_mouseout(){
    mousedown_card = false;
    top_card.classList.remove("top_card_hover");
    top_card.querySelector(".card_name").classList.remove("card_name_hover");
    top_card.querySelector(".card_desc").classList.remove("card_desc_hover");
    top_card.classList.remove("top_card_mousedown");
    top_card_link.classList.remove("top_card_link_mouseover");
}
function top_card_mousedown(){
    top_card.classList.add("top_card_mousedown");
    top_card.querySelector(".card_desc").classList.add("card_desc_hover");
}
function top_card_mouseup(){
    top_card.classList.remove("top_card_mousedown");
}

function setup_cards(){
    [...document.querySelectorAll("article")].forEach(card => {
        if (!card.classList.contains("top_card")){
            let card_link = document.querySelector("#"+card.id+"_link");
            let new_link = card_link.cloneNode(true);
            card_link.parentNode.replaceChild(new_link, card_link);
            new_link.addEventListener("mouseover", function(){
                card_link_mouseover(new_link);
            });
            new_link.addEventListener("mouseout", function(){
                card_link_mouseout(new_link);
            });
            new_link.addEventListener("mousedown", function(){
                card_link_mousedown(card);
            });
            new_link.addEventListener("mouseup", function(){
                card_link_mouseup(card);
            });
        }
    });
}
function card_link_mouseover(card_link){
    let card = document.querySelector("#"+card_link.id.replace("_link", ""));
    card.querySelector(".card_name").classList.add("card_name_hover");
    card.classList.add("card_hover");
    document.querySelector("#"+card.id+"_link").classList.add("card_link_mouseover");
}
function card_link_mouseout(card_link){
    let card = document.querySelector("#"+card_link.id.replace("_link", ""));
    card.querySelector(".card_name").classList.remove("card_name_hover");
    card.classList.remove("card_hover");
    card.classList.remove("card_mousedown");
    top_card.classList.remove("top_card_disappear");
    document.querySelector("#"+card.id+"_link").classList.remove("card_link_mouseover");
    document.querySelector("#"+card.id+"_link").classList.remove("card_link_mousedown");
    card.querySelector(".card_desc").classList.remove("card_desc_hover");
}
function card_link_mousedown(card){
    mousedown_card = true;
    setTimeout(function(){
        console.log(mousedown_card);
        if (mousedown_card){
            card.querySelector(".card_desc").classList.add("card_desc_hover");
        }
    }, 1000);
    card.classList.add("card_mousedown");
    top_card.classList.add("top_card_disappear");
    document.querySelector("#"+card.id+"_link").classList.add("card_link_mousedown");
}
function card_link_mouseup(card){
    mousedown_card = false;
    card.classList.remove("card_mousedown");
    top_card.classList.remove("top_card_disappear");
    document.querySelector("#"+card.id+"_link").classList.remove("card_link_mousedown");

    remove_top_card();

    let old_card_link = document.querySelector("#"+card.id+"_link");
    let new_card_link = old_card_link.cloneNode(true);
    old_card_link.parentNode.replaceChild(new_card_link, old_card_link);

    let new_card = card.cloneNode(true);
    card.parentNode.appendChild(new_card);
    card.parentNode.removeChild(card);
    top_card = new_card;
    top_card.classList.add("top_card");
    top_card.classList.remove("card");
    
    old_card_link = document.querySelector("#"+top_card.id+"_link");
    new_card_link = old_card_link.cloneNode(true);
    old_card_link.parentNode.replaceChild(new_card_link, old_card_link);
    top_card_link = new_card_link;
    top_card_link.classList.add("top_card_link");
    
    card_link_mouseout(top_card_link);
    setup_top_card();
    top_card_mouseover();
    setup_cards();
}

setup_top_card();
setup_cards();