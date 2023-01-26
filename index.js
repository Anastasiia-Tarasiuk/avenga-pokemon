const findPokemonButtonEl = document.querySelector('.find_pokemon_btn');
const startFightButtonEl = document.querySelector('.start_fight_btn');
const baseURL = 'https://pokeapi.co/api/v2/pokemon/';
const listEl = document.querySelector('.pokemon_list');

const vsLogoEl = document.querySelector('.vs_logo');


startFightButtonEl.style.display = "none";
vsLogoEl.style.display = "none";

findPokemonButtonEl.addEventListener('click', onFindPokemonButtonClick);

function onFindPokemonButtonClick() {
    for (let index = 0; index < 2; index++) {
        createPokemon(index);
        
    }
}

function createPokemon(index) {
    const rendomNumber = getRandomNumber(1, 1008);
    const url = baseURL + rendomNumber;

    
    
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

            listEl.insertAdjacentHTML('afterbegin',
                `<li class=${'pokemon'+(index+1)}>
                    <p>${name}</p>
                    <img class="pokemon_image" src="${image_dream_world || image_home ||'images/image_default.png'}"/>
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