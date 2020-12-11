let card_deck = [...document.querySelectorAll(".card")];
let top_card = card_deck[card_deck.length - 1];
let top_card_link = document.querySelector("#"+top_card.id+"_link");

function setup_top_card(){
    top_card.classList.add("top_card");
    top_card.addEventListener("mouseover", top_card_mouseover);
    top_card.addEventListener("mouseout", top_card_mouseout);
    top_card.addEventListener("mousedown", top_card_mousedown);
    top_card.addEventListener("mouseup", top_card_mouseup);
    top_card_link.addEventListener("mousedown", top_card_mousedown);
    top_card_link.addEventListener("mouseup", top_card_mouseup);
    top_card_link.addEventListener("mouseover", top_card_mouseover);
    top_card_link.addEventListener("mouseout", top_card_mouseout);
}
function remove_top_card(){
    top_card.classList.remove("top_card");
    top_card.removeEventListener("mouseover", top_card_mouseover);
    top_card.removeEventListener("mouseout", top_card_mouseout);
    top_card_link.removeEventListener("mouseover", top_card_mouseover);
    top_card_link.removeEventListener("mouseout", top_card_mouseout);
}
function top_card_mouseover(){
    top_card.classList.add("top_card_hover");
    top_card.querySelector(".card_name").classList.add("card_name_hover");
}
function top_card_mouseout(){
    top_card.classList.remove("top_card_hover");
    top_card.querySelector(".card_name").classList.remove("card_name_hover");
    top_card.classList.remove("top_card_mousedown");
}
function top_card_mousedown(){
    top_card.classList.add("top_card_mousedown");
}
function top_card_mouseup(){
    top_card.classList.remove("top_card_mousedown");
}

function setup_cards(){
    card_deck.forEach(card => {
        if (card !== top_card){
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
}
function card_link_mouseout(card_link){
    let card = document.querySelector("#"+card_link.id.replace("_link", ""));
    card.querySelector(".card_name").classList.remove("card_name_hover");
    card.classList.remove("card_hover");
    card.classList.remove("card_mousedown");
    top_card.classList.remove("top_card_disappear");
}
function card_link_mousedown(card){
    card.classList.add("card_mousedown");
    top_card.classList.add("top_card_disappear");
}
function card_link_mouseup(card){
    card.classList.remove("card_mousedown");
    top_card.classList.remove("top_card_disappear");

    // remove_top_card();
    // new_card = card.cloneNode(true);
    // card.parentNode.appendChild(new_card);
    // card.parentNode.removeChild(card);
    // top_card = new_card;
    // top_card_link = document.querySelector("#"+top_card.id+"_link");
    // setup_top_card();
    // setup_cards();
}

setup_top_card();
setup_cards();