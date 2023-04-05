const template = Handlebars.compile("Handlebars <b>{{doesWhat}}</b>");
// console.log(template({ doesWhat: "rocks!" }));

const baseURL = 'https://pokeapi.co/api/v2/pokemon/';

const findPokemonButtonEl = document.querySelector('.find_pokemon_btn');
const startFightButtonEl = document.querySelector('.start_fight_btn');
const listEl = document.querySelector('.pokemon_list');
const winnerNameEl = document.querySelector('.winner');
const fightEl = document.querySelector('.fight_list');
const vsLogoEl = document.querySelector('.vs_logo');
const logoPokemonEl = document.querySelector('.logo_pokemon');

let round = 1;

let maxHealth1 = null;
let maxHealth2 = null;
let maxAttack1 = null;
let maxAttack2 = null;
let maxSpecialAttack1 = null;
let maxSpecialAttack2 = null;
let maxDefense1 = null;
let maxDefense2 = null;
let maxSpecialDefense1 = null;
let maxSpecialDefense2 = null;

let useSpecialPower1 = false;
let useSpecialPower2 = false;

let pokemon1Stats = null;
let pokemon2Stats = null;

let pokemon1RoundStats = null;
let pokemon2RoundStats = null;

winnerNameEl.style.display = "none";
fightEl.style.display = "none";
findPokemonButtonEl.removeAttribute('disabled');

findPokemonButtonEl.addEventListener('click', onFindPokemonButtonClick);
startFightButtonEl.addEventListener('click', onStartFightButtonClick);

function onFindPokemonButtonClick() {
    findPokemonButtonEl.setAttribute('disabled', '');
    winnerNameEl.style.display = "none";
    listEl.innerHTML = "";
    fightEl.innerHTML = "";
    round = 1;
    startFightButtonEl.innerHTML = "Start a fight";
    logoPokemonEl.style.display = "none";
    
    for (let index = 0; index < 2; index++) {
        createPokemon(index);        
    }  
}

function onStartFightButtonClick() {
    fightEl.style.display = "flex";

    startFightButtonEl.textContent = ` ${"Round " + round}`;
    round = round + 1;

    maxHealth1 = pokemon1Stats.health;
    maxAttack1 = pokemon1Stats.attack;
    maxSpecialAttack1 = pokemon1Stats.special_attack;
    maxDefense1 = pokemon1Stats.defense;
    maxSpecialDefense1 = pokemon1Stats.special_defense;

    maxHealth2 = pokemon2Stats.health;
    maxAttack2 = pokemon2Stats.attack;
    maxSpecialAttack2 = pokemon2Stats.special_attack;
    maxDefense2 = pokemon2Stats.defense;
    maxSpecialDefense2 = pokemon2Stats.special_defense;

    let health1 = document.querySelector('.pokemon_list .health1').clientWidth;
    let health2 = document.querySelector('.pokemon_list .health2').clientWidth;

    setFightStats();
    
    const attack1 = pokemon1RoundStats.attack;
    const defense1 = pokemon1RoundStats.defense;
    const attack2 = pokemon2RoundStats.attack;
    const defense2 = pokemon1RoundStats.defense;

    const demage1 = attack2 - defense1;
    const demage2 = attack1 - defense2;

    const demageValue1El = document.querySelector(".demageValue1");
    const demageValue2El = document.querySelector(".demageValue2");

    const demage1El = document.querySelector(".demageWrapper1");
    const demage2El = document.querySelector(".demageWrapper2");

    const healthIndicatorEl1 = document.querySelector('.pokemon_list .health1');
    const healthIndicatorEl2 = document.querySelector('.pokemon_list .health2');

    if (demage1 > 0) {
        demageValue1El.textContent = demage1;
        demageValue1El.style.fontSize = "100px"
        health1 = health1 - demage1;
        healthIndicatorEl1.style = `${(health1 < demage1) && "display: none"}; width: ${health1}px; height: 22px; position: absolute; top: 0; left: 0;`;
    } else {
        demageValue1El.textContent = "DEFENDED";
        demageValue1El.style.fontSize = "35px"
    }

    if (demage2 > 0) {
        demageValue2El.textContent = demage2;
        demageValue2El.style.fontSize = "100px"
        health2 = health2 - demage2;
        healthIndicatorEl2.style = `${(health2 < demage2) && "display: none"}; width: ${health2}px; height: 22px; position: absolute; top: 0; left: 0;`;
    } else {
        demageValue2El.textContent = "DEFENDED";
        demageValue2El.style.fontSize = "35px"
    }

    if (demageValue1El.textContent !=="") {
        demage1El.style.display = "block";
        setTimeout(() => {demage1El.style.display = "none";}, 1000);
    }

    if (demageValue2El.textContent !=="") {
        demage2El.style.display = "block";
        setTimeout(() => {demage2El.style.display = "none";}, 1000);
    }

    if (healthIndicatorEl1.style.display === "none" || healthIndicatorEl2.style.display === "none") {
        
        startFightButtonEl.innerHTML = "Fight is over";
        startFightButtonEl.setAttribute('disabled', '');

        if (health1 > health2) {
            setTimeout(() => {
                winnerCongratulate(1);
                startFightButtonEl.style.display = "none";
                findPokemonButtonEl.removeAttribute('disabled');
            }, 1000);
        } else {
            setTimeout(() => {
                winnerCongratulate(2);
                startFightButtonEl.style.display = "none";
                findPokemonButtonEl.removeAttribute('disabled');
            }, 1000);
        }
    }
}

function winnerCongratulate(winner) {
    fightEl.style.display = "none";
    let looserPokemon = null;
    let winnerName = null; 
    let winnerPokemon = null;
    
    document.querySelector('.stats2').style.display = "none";
    document.querySelector('.stats1').style.display = "none";

    document.querySelector('.name1').style.display = "none";
    document.querySelector('.name2').style.display = "none";

    switch (winner) {
        case 1:
            looserPokemon = document.querySelector('.pokemon2');
            winnerPokemon = document.querySelector('.pokemon1');
            winnerName = document.querySelector('.name1');
            break;
        case 2:
            looserPokemon = document.querySelector('.pokemon1');
            winnerPokemon = document.querySelector('.pokemon2');
            winnerName = document.querySelector('.name2');
            break;
        default:
            break;
    }

    looserPokemon.style.display = "none";
    vsLogoEl.style.display = "none";
    winnerNameEl.textContent = (`${(winnerName.textContent)} wins!`).toUpperCase();
    winnerNameEl.style.display = "block";
    findPokemonButtonEl.style.display = "block";    
    [...document.querySelectorAll('.wrapper')].forEach(element => element.style.display = "none");
}

function createPokemon(index) {
    const randomNumber = getRandomNumber(1, 1008);
    const url = baseURL + randomNumber;

    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.send();
    
    xhr.onload = function () {        
        if (xhr.status !== 200) { 
            console.log(`Помилка ${xhr.status}: ${xhr.statusText}`); 
        } else { 
            const response = JSON.parse(xhr.response);
            const image_dream_world = response.sprites.other.dream_world.front_default;
            const image_home = response.sprites.other.home.front_default;
            const fight_stat = response.stats;

            const pokemonStats = {
                name: response.name,
                health: null,
                image: null,
                attack: null,
                special_attack: null,
                defense: null,
                special_defense: null
            }

            if (image_dream_world) {
                pokemonStats.image = image_dream_world;
            } else if (image_home) {
                pokemonStats.image = image_home;
            } else {
                pokemonStats.image = 'images/image_default.png';
            }
    
            if (response.base_experience) {
                pokemonStats.health = response.base_experience;
            } else {
                pokemonStats.health = getRandomNumber(50, 250);
            }

            fight_stat.map(item => {
                switch (item.stat.name) {
                    case 'attack':
                        pokemonStats.attack = item.base_stat;
                        break;
                    case 'defense':
                        pokemonStats.defense = item.base_stat
                        break;
                    case 'special-attack':
                        pokemonStats.special_attack = item.base_stat
                        break;
                    case 'special-defense':
                        pokemonStats.special_defense = item.base_stat
                            break;
                    default:
                        break;
                }
            })
            
            listEl.insertAdjacentHTML('beforeend',
                `<li class=${'pokemon'+(index+1)}>
                    <p class=${"name" + (index + 1)}>${pokemonStats.name}</p>
                    <div class="wrapper">
                        <div class=${"health"+(index+1)} style="width: ${pokemonStats.health}px; height: 22px; position: absolute; top: 0; left: 0;"></div>
                        <div class=${"shadow"+(index+1)} style="width: ${pokemonStats.health}px; height: 20px; position: absolute; top: 0; left: 0; border: 1px solid black;"></div>
                    </div>
                    <img class="pokemon_image" src="${pokemonStats.image}" />
                    <div class=${'"demageWrapper'+(index+1)}" style="display: none">
                        <img class=${"demageImg"+(index+1)} src="images/demage.png" alt="Demage effect">
                        <span class=${'"demageValue'+(index+1)}"></span>
                    </div>
                    <div class=${"stats"+(index+1)}>
                    <p>Health: <span class="health">${pokemonStats.health}</span></p>
                    <p>Max Attack: <span class="attack">${pokemonStats.attack}</span></p>
                    <p>Max Special attack: <span class="special_attack">${pokemonStats.special_attack}</span></p>
                    <p>Max Defense: <span class="defense">${pokemonStats.defense}</span></p>
                    <p>Max Special defense: <span class="special_defense">${pokemonStats.special_defense}</span></p>
                    </div>
                </li>`
            )

            fightEl.insertAdjacentHTML('beforeend', 
                `<li class=${'pokemon_fight'+(index+1)}>
                    <p>Attack: <span class=${"attack"+(index+1)}></span></p>
                    <p>Defense: <span class=${"defense"+(index+1)}></span></p>
                </li>`
            )

            const listChildren = listEl.childNodes.length;

            if (listChildren === 2) {
                findPokemonButtonEl.style.display = "none";
                startFightButtonEl.style.display = "block";
                startFightButtonEl.removeAttribute('disabled');
                vsLogoEl.style.display = "block";
            }

            switch (index) {
                case 0:
                    pokemon1Stats = pokemonStats;
                    break;
                case 1:
                    pokemon2Stats = pokemonStats;
                    break;
            }
        }
    }    
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

function setFightStats() {
    const randomPowerNumber1 = Math.random();
    const randomPowerNumber2 = Math.random();

    if (randomPowerNumber1 > 0.75) {
        useSpecialPower1 = true;
    } else {
        useSpecialPower1 = false;
    }

    if (randomPowerNumber2 > 0.75) {
        useSpecialPower2 = true;
    } else {
        useSpecialPower2 = false;
    }


    const attack1 = useSpecialPower1 ? Math.floor((maxAttack1 + maxSpecialAttack1) * Math.random()) : Math.floor(maxAttack1 * Math.random());
    const defense1 = useSpecialPower1 ? Math.floor((maxDefense1 + maxSpecialDefense1) * Math.random()) : Math.floor(maxDefense1 * Math.random());

    const attack2 = useSpecialPower2 ? Math.floor((maxAttack2 + maxSpecialAttack2) * Math.random()) : Math.floor(maxAttack2 * Math.random());
    const defense2 = useSpecialPower2 ? Math.floor((maxDefense2 + maxSpecialDefense2) * Math.random()) : Math.floor(maxDefense2 * Math.random());

    document.querySelector('.pokemon_fight1 .attack1').textContent = attack1;
    document.querySelector('.pokemon_fight1 .defense1').textContent = defense1;

    document.querySelector('.pokemon_fight2 .attack2').textContent = attack2;
    document.querySelector('.pokemon_fight2 .defense2').textContent = defense2;

    pokemon1RoundStats = {
        attack: attack1,
        defense: defense1
    };

    pokemon2RoundStats = {
        attack: attack2,
        defense: defense2
    };

    useSpecialPower1 = false;
    useSpecialPower2 = false;
}
