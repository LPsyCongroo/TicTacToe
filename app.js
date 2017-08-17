// jQuery Selector Replacement
window.$ = function(selector) {
    var selectorType = 'querySelectorAll';

    if (selector.indexOf('#') === 0) {
        selectorType = 'getElementById';
        selector = selector.substr(1, selector.length);
    }

    return document[selectorType](selector);
};

/**
 * Initialzie Game:
 * 
 * 1. Select Opponent
 *      2. Local
 *          3. Enter Your Name
 *              4. Enter Your Friend's Name
 *      2. Online
 *          3. Enter Your Name
 *              4. Loading / Waiting for Opponent
 *      2. Machine
 *          3. Enter Your Name
 *              4. Loading
 */
let player = [];

const init = document.querySelector('.init');
const matchup = document.querySelector('h2');
let page = document.querySelector('.page');

const local = document.getElementById('local'),
      online = document.getElementById('online'),
      machine = document.getElementById('machine'); 

let enterName = document.createElement('div');
enterName.className = 'page';

let user = document.createElement('h3');
user.innerHTML = 'Player 1';
enterName.appendChild(user);

let name = document.createElement('input');
name.type = 'text';
name.placeholder = 'Name';
enterName.appendChild(name);

let enter = document.createElement('button');
enter.type = 'button';
enter.innerHTML = 'Enter';
enterName.appendChild(enter);

enter.addEventListener('click', () => { 
    let name2 = document.createElement('input');
    name.replaceWith(name2);
    name = name2
    name.type = 'text';
    name.placeholder = 'Name';
    user.innerHTML = 'Player 2';
    if(player.length === 2){
        matchup.innerHTML = `${player[0]} vs ${player[1]}`;
        document.body.removeChild(init);
    }
});




local.addEventListener('click', function(){
    page.replaceWith(enterName);
});

