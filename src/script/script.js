// GLOBAL
const POKE_URL = 'https://pokeapi.co/api/v2';
const RED_URL = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';
let currentIndex = 0;
const imagesPerLoad = 20;
let pokeNames = [];

// FUNCTION SCROLL TO BOTTOM WHEN USER CLICKS BUTTON
function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, '10');
  document.getElementById('showAmount').innerHTML = currentIndex + ' / 151 Pokemon';
}

// SEARCH INPUT
function searchPokemon() {
  let input = document.getElementById('search');
  content = document.getElementById('content');
  card = content.getElementsByTagName('h3');
  for (i = 0; i < card.length; i++) {
    if (input.value == card[i].innerHTML) {
      console.log('right');
    } else {
      console.log('wrong');
    }
  }
}

// ONLOAD FUNCTION
function init() {
  let pokeCard = document.getElementById('content');
  pokeCard.innerHTML = '';
  loadAndRenderData();
}

// LOAD AND RENDER DATA
async function loadAndRenderData() {
  let data = await loadData();
  pokeNames = data;
  if (data) {
    renderCard(data.results);
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
async function renderCard(pokemonList) {
  let pokeCard = document.getElementById('content');
  let endIndex = currentIndex + imagesPerLoad;
  for (let i = currentIndex; i < endIndex && i < pokemonList.length; i++) {
    let pokemon = pokemonList[i]['name'];
    let pokemonUrl = pokemonList[i]['url'];
    let pokemonDetails = await fetchPokemonDetails(pokemonUrl);
    let types = pokemonDetails.types.map((type) => type.type.name).join(', ');
    pokeCard.innerHTML += renderHTML(pokemon, pokemonDetails, types);
  }
  checkCurrentIndex();
}

// CHECK CURRENTINDEX
function checkCurrentIndex() {
  currentIndex += imagesPerLoad;
  if (currentIndex <= 151) {
    scrollToBottom();
  } else {
    currentIndex = 151;
    scrollToBottom();
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
