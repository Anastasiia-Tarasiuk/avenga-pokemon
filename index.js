const baseURL = 'https://pokeapi.co/api/v2/pokemon/';

const findPokemonButtonEl = document.querySelector('.find_pokemon_btn');
const startFightButtonEl = document.querySelector('.start_fight_btn');
const listEl = document.querySelector('.pokemon_list');
const winnerNameEl = document.querySelector('.winner');
const fightEl = document.querySelector('.fight_list');
const vsLogoEl = document.querySelector('.vs_logo');

winnerNameEl.style.display = "none";
fightEl.style = "display: none;"
startFightButtonEl.style.display = "none";
vsLogoEl.style.display = "none";

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

findPokemonButtonEl.addEventListener('click', onFindPokemonButtonClick);
startFightButtonEl.addEventListener('click', onStartFightButtonClick);

function onFindPokemonButtonClick() {
    for (let index = 0; index < 2; index++) {
        createPokemon(index);        
    }
}

function onStartFightButtonClick() {
    fightEl.style.display = "flex";

    startFightButtonEl.textContent = ` ${"Round " + round}`;
    round = round + 1;
    
    // const pokemonStats = [".health", ".attack", ".special_attack", ".defense", ".special_defense"]

    const pokemon1values = {
        maxHealth1,
        maxAttack1,
        maxSpecialAttack1,
        maxDefense1,
        maxSpecialDefense1,
    }

    const pokemon2values = {
        maxHealth2,
        maxAttack2,
        maxSpecialAttack2,
        maxDefense2,
        maxSpecialDefense2
    }
    
    // getInnerText(".pokemon1", pokemon1values, pokemonStats);
    // getInnerText(".pokemon2", pokemon2values, pokemonStats);

    maxHealth1 = Number(document.querySelector('.pokemon1 .health').innerText);
    maxAttack1 = Number(document.querySelector('.pokemon1 .attack').innerText);
    maxSpecialAttack1 = Number(document.querySelector('.pokemon1 .special_attack').innerText);
    maxDefense1 = Number(document.querySelector('.pokemon1 .defense').innerText);
    maxSpecialDefense1 = Number(document.querySelector('.pokemon1 .special_defense').innerText);

    maxHealth2 = Number(document.querySelector('.pokemon2 .health').innerText);
    maxAttack2 = Number(document.querySelector('.pokemon2 .attack').innerText);
    maxSpecialAttack2 = Number(document.querySelector('.pokemon2 .special_attack').innerText);
    maxDefense2 = Number(document.querySelector('.pokemon2 .defense').innerText);
    maxSpecialDefense2 = Number(document.querySelector('.pokemon2 .special_defense').innerText);
    
    setFightStats();
    
    let health1 = document.querySelector('.pokemon_fight1 .health1').clientWidth;
    let health2 = document.querySelector('.pokemon_fight2 .health2').clientWidth;

    const attack1 = Number(document.querySelector('.pokemon_fight1 .attack1').innerText);
    const defense1 = Number(document.querySelector('.pokemon_fight1 .defense1').innerText);
    const attack2 = Number(document.querySelector('.pokemon_fight2 .attack2').innerText);
    const defense2 = Number(document.querySelector('.pokemon_fight2 .defense2').innerText);

    const demage1 = attack2 - defense1;
    const demage2 = attack1 - defense2;

    const demageValue1El = document.querySelector(".demageValue1");
    const demageValue2El = document.querySelector(".demageValue2");

    const demage1El = document.querySelector(".demageWrapper1");
    const demage2El = document.querySelector(".demageWrapper2");

    const healthIndicatorEl1 = document.querySelector('.pokemon_fight1 .health1');
    const healthIndicatorEl2 = document.querySelector('.pokemon_fight2 .health2');

    if (demage1 > 0) {
        demageValue1El.textContent = demage1;
        health1 = health1 - demage1;
        healthIndicatorEl1.style = `${(health1 < demage1) && "display: none"}; width: ${health1}px; height: 22px; position: absolute; top: 0; left: 0;`;
    }

    if (demage2 > 0) {
        demageValue2El.textContent = demage2;
        health2 = health2 - demage2;
        healthIndicatorEl2.style = `${(health2 < demage2) && "display: none"}; width: ${health2}px; height: 22px; position: absolute; top: 0; left: 0;`;
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
        startFightButtonEl.style.display = "none";
        if (health1 > health2) {
            setTimeout(() => {
                winnerCongratulate(1);
            }, 1000);
        } else {
            setTimeout(() => {
                winnerCongratulate(2);
            }, 1000);
        }
    }
}

function winnerCongratulate(winner) {
    fightEl.style.display = "none";
    let looserPokemon = null;
    let winnerPokemon = null;
    let winnerName = null; 
    
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
}

function createPokemon(index) {
    const randomNumber = getRandomNumber(1, 1008);
    const url = baseURL + randomNumber;
    
    let health = null;
    let attack = null;
    let defense = null;
    // let speed = null;
    let special_attack = null;
    let special_defense = null;
        
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.send();
    
    xhr.onload = function () {        
        if (xhr.status !== 200) { 
            console.log(`?????????????? ${xhr.status}: ${xhr.statusText}`); 
        } else { 
            const response = JSON.parse(xhr.response);
            const image_dream_world = response.sprites.other.dream_world.front_default;
            const image_home = response.sprites.other.home.front_default;
            const name = response.name;
            const fight_stat = response.stats;
    
            health = response.base_experience;

            if (!health) {
                health = getRandomNumber(50, 250);
            }           

            fight_stat.map(item => {
                switch (item.stat.name) {
                    case 'attack':
                        attack = item.base_stat;
                        break;
                    case 'defense':
                        defense = item.base_stat
                        break;
                    case 'special-attack':
                        special_attack = item.base_stat
                        break;
                    case 'special-defense':
                        special_defense = item.base_stat
                            break;
                    // case 'speed':
                    //     speed = item.base_stat
                    //     break;
                    default:
                        break;
               }
            })
            
            listEl.insertAdjacentHTML('beforeend',
                `<li class=${'pokemon'+(index+1)}>
                    <p class=${"name"+(index+1)}>${name}</p>
                    <img class="pokemon_image" src="${image_dream_world || image_home || 'images/image_default.png'}"/>
                    <div class=${'"demageWrapper'+(index+1)}" style="display: none">
                        <img class=${"demageImg"+(index+1)} src="images/demage.png" alt="Demage effect">
                        <span class=${'"demageValue'+(index+1)}"></span>
                    </div>
                    <div class=${"stats"+(index+1)}>
                    <p>Health: <span class="health">${health}</span></p>
                    <p>Max Attack: <span class="attack">${attack}</span></p>
                    <p>Max Special attack: <span class="special_attack">${special_attack}</span></p>
                    <p>Max Defense: <span class="defense">${defense}</span></p>
                    <p>Max Special defense: <span class="special_defense">${special_defense}</span></p>
                    </div>
                </li>`
            )

            fightEl.insertAdjacentHTML('beforeend', 
                `<li class=${'pokemon_fight'+(index+1)}>
                    <div class="wrapper" style="position: relative;">
                        <div class=${"health"+(index+1)} style="width: ${health}px; height: 22px; position: absolute; top: 0; left: 0;"></div>
                        <div class=${"shadow"+(index+1)} style="width: ${health}px; height: 20px; position: absolute; top: 0; left: 0; border: 1px solid black;"></div>
                    </div>
                    <p>Attack: <span class=${"attack"+(index+1)}></span></p>
                    <p>Defense: <span class=${"defense"+(index+1)}></span></p>
                </li>`
            )

            const listChildren = listEl.childNodes.length;
            if (listChildren === 2) {
                findPokemonButtonEl.style.display = "none";
                startFightButtonEl.style.display = "block";
                vsLogoEl.style.display = "block";
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

    useSpecialPower1 = false;
    useSpecialPower2 = false;
}

// function getInnerText(pokemon, pokemonValues, pokemonStats) {
//     let index = 0;
        
//     for (const value in pokemonValues) {
//         pokemonValues[value] = Number(document.querySelector(`${pokemon} ${pokemonStats[index]}`).innerText);
//         index = index + 1;
//     }
// }

