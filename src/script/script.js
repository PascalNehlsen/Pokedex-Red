// GLOBAL
const POKE_URL = 'https://pokeapi.co/api/v2';
const RED_URL = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';

// ONLOAD FUNCTION
function init() {
  loadAndRenderData();
}

// LOAD AND RENDER DATA
async function loadAndRenderData() {
  let data = await loadData();
  if (data) {
    render(data.results);
  } else {
    console.error('No Data to render');
  }
}

// LOAD ALL DATA
async function loadData() {
  try {
    let response = await fetch(RED_URL);
    if (!response.ok) {
      throw new Error('No Data from Server');
    }
    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error('Fetch Problem:', error);
  }
}

// RENDER MY POKEMON
async function render(pokemonList) {
  let pokeCard = document.getElementById('content');
  pokeCard.innerHTML = '';
  for (let i = 0; i < pokemonList.length; i++) {
    let pokemon = pokemonList[i]['name'];
    let pokemonUrl = pokemonList[i]['url'];
    let pokemonDetails = await fetchPokemonDetails(pokemonUrl);
    pokeCard.innerHTML += renderHTML(pokemon, pokemonDetails, i);
  }
}

// FETCH DETAILED DATA FOR EACH POKEMON
async function fetchPokemonDetails(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error('No Data from Server');
    }
    let pokemonDetails = await response.json();
    return pokemonDetails;
  } catch (error) {
    console.error('Fetch problem:', error);
    return '';
  }
}

// RENDER MY POKEMON HTML
function renderHTML(pokemon, pokemonDetails) {
  return /*html*/ `
    <div class="pokeCard ${pokemonDetails.types[0].type.name}">
    <div class="pokeCardHeader">
        <h3>${pokemonDetails.name}</h3>
    </div>
        <img src="${pokemonDetails.sprites.other['dream_world'].front_default}" alt="${pokemon} picture"></img>
        <div class="seperator"></div>
        <span>ID: ${pokemonDetails.id}</span></div>
    </div>
    `;
}
