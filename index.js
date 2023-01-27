const findPokemonButtonEl = document.querySelector('.find_pokemon_btn');
const startFightButtonEl = document.querySelector('.start_fight_btn');
const baseURL = 'https://pokeapi.co/api/v2/pokemon/';
const listEl = document.querySelector('.pokemon_list');
const fightEl = document.querySelector('.fight_list');

const vsLogoEl = document.querySelector('.vs_logo');



startFightButtonEl.style.display = "none";
vsLogoEl.style.display = "none";

findPokemonButtonEl.addEventListener('click', onFindPokemonButtonClick);
startFightButtonEl.addEventListener('click', onStartFightButtonClick);

function onFindPokemonButtonClick() {
    for (let index = 0; index < 2; index++) {
        createPokemon(index);
        
    }
}

function onStartFightButtonClick() {

    const pokemon1 = [...document.querySelectorAll('.pokemon_fight1')];
    const pokemon2 = [...document.querySelectorAll('.pokemon_fight2')];

    let health1 = null;
    let attack1 = null;
    let defense1 = null; 

    let health2 = null;
    let attack2 = null;
    let defense2 = null; 

    
    pokemon1.map(item => {
        health1 = [...item.children][0].clientWidth;
        const attack1Text = [...item.children][2].innerText;
        attack1 = Number(attack1Text.slice(8, attack1Text.length))
        const defense1Text = [...item.children][3].innerText;
        defense1 = Number(defense1Text.slice(8, defense1Text.length))
        console.log(item)
    })

    pokemon2.map(item => {
        health2 = [...item.children][0].clientWidth;
        const attack2Text = [...item.children][2].innerText;
        attack2 = Number(attack2Text.slice(8, attack2Text.length))
        const defense2Text = [...item.children][3].innerText;
        defense2 = Number(defense2Text.slice(9, defense2Text.length))
    })

    const demage1 = attack2 - defense1;
    const demage2 = attack1 - defense2;

    


    if (demage1 > 0) {
        health1 = health1 - demage1;
        const healthIndicatorEl = document.querySelector('.pokemon_fight1 .health');
        healthIndicatorEl.style = `${(health1 < demage1) && "display: none"}; width: ${health1}px; height: 20px; position: relative; border: "none"`;
    }

    if (demage2 > 0) {
        health2 = health2 - demage2;
        const healthIndicatorEl = document.querySelector('.pokemon_fight2 .health');
        healthIndicatorEl.style = `${(health2 < demage2) && "display: none"}; width: ${health2}px; height: 20px; position: relative; border: "none"`;
    }

    // if ()

    // console.log(demage1, demage2)
}

function createPokemon(index) {
    const randomNumber = getRandomNumber(1, 1008);
    const randomPowerNumber = Math.random();
    let useSpecialPower = false;

    let health = null;
    let attack = null;
    let defense = null;
    let speed = null;
    let special_attack = null;
    let special_defense = null;
    
    if (randomPowerNumber > 0.75) {
        useSpecialPower = true;
    } else {
        useSpecialPower = false;
    }

    const url = baseURL + randomNumber;
   
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.send();
    
    xhr.onload = function () {        
        if (xhr.status != 200) { 
            console.log(`Помилка ${xhr.status}: ${xhr.statusText}`); 
        } else { 
            const response = JSON.parse(xhr.response);
            const image_dream_world = response.sprites.other.dream_world.front_default;
            const image_home = response.sprites.other.home.front_default;
            const name = response.name;
            const fight_stat = response.stats;
            
            health = response.base_experience;
            

            fight_stat.map(item => {
                
                switch (item.stat.name) {
                // case 'hp':
                //     health = item.base_stat;
                //     break;
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
                case 'speed':
                    speed = item.base_stat
                    break;
                default:
                    break;
               }
            })
            
            listEl.insertAdjacentHTML('beforeend',
                `<li class=${'pokemon'+(index+1)}>
                    <p>${name}</p>
                    <img class="pokemon_image" src="${image_dream_world || image_home || 'images/image_default.png'}"/>
                    <p>Attack: ${attack}</p>
                    <p>Special attack: ${special_attack}</p>
                    <p>Defense: ${defense}</p>
                    <p>Special defense: ${special_defense}</p>
                </li>`
            )

            if (health) {
                fightEl.insertAdjacentHTML('beforeend', 
                    `<li class=${'pokemon_fight'+(index+1)}>
                    <div class="health" style="width: ${health}px; height: 20px;"></div>
                    <div class="shadow" style="display: none; width: ${health}px; height: 20px;"></div>
                    <p class="attack">Attack: ${useSpecialPower ? (special_attack + attack) * randomPowerNumber  : attack * randomPowerNumber}</p>
                    <p class="defense">Defense: ${useSpecialPower ? (special_defense + defense) * randomPowerNumber  : defense * randomPowerNumber }</p>
                    </li>
                `)
            }

            useSpecialPower = false;
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