// GLOBAL
const RED_URL = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';
let currentIndex = 0;
const imagesPerLoad = 20;
let pokeJson = [];
let pokeSound = [];

// ONLOAD FUNCTION
function init() {
  let pokeCard = document.getElementById('content');
  pokeCard.innerHTML = '';
  pokeJson = [];
  loadAndRenderData();
}

// FUNCTION SCROLL TO BOTTOM WHEN USER CLICKS BUTTON
function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, '10');
  document.getElementById('showAmount').innerHTML = currentIndex + ' / 151 Pokemon';
}

// SEARCH INPUT
function searchPokemon() {
  let inputField = document.getElementById('search');
  let input = inputField.value.toLowerCase();
  let cards = document.getElementById('content').getElementsByTagName('h3');

  if (input.length < 3) {
    Array.from(cards).forEach((card) => (card.parentNode.style.display = ''));
  } else {
    Array.from(cards).forEach((card) => {
      card.parentNode.style.display = card.innerHTML.toLowerCase().includes(input) ? '' : 'none';
    });
  }
}

// LOAD AND RENDER DATA
async function loadAndRenderData() {
  activateLoadAnimation();
  let data = await loadData();
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
    pokeJson.push(pokemonDetails);
    pokeSound.push(pokeJson[i].cries.legacy);
    let types = pokemonDetails.types
      .map((type) => `<span class="types">${type.type.name}</span>`)
      .join('');
    pokeCard.innerHTML += renderHTML(pokemon, pokemonDetails, types, i);
  }
  checkCurrentIndex();
}

// CHECK CURRENTINDEX
function checkCurrentIndex() {
  currentIndex += imagesPerLoad;
  if (currentIndex == 20) {
    document.getElementById('showAmount').innerHTML = currentIndex + ' / 151 Pokemon';
  } else if (currentIndex > 20 && currentIndex <= 151) {
    scrollToBottom();
  } else {
    currentIndex = 151;
    scrollToBottom();
    document.getElementById('loadBtn').style.border = '8px solid #E41F25';
    document.getElementById('loadBtn').style.cursor = 'unset';
    document.getElementById('loadBtn').innerHTML = '';
    document.getElementById('loadBtn').disabled = true;
  }
  disableLoadAnimation();
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

// METER TO FEET AND INCH
function convertMetersToFeetAndInches(meters) {
  const cm = meters * 100;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

// OPEN LARGE CARD
function openCard(i) {
  document.body.style.overflow = 'hidden';
  document.getElementById('popUpContainer').style.display = '';
  let abilities = pokeJson[i].abilities.map((type) => type.ability.name).join('\n');
  let feetAndInch = pokeJson[i].height / 10;
  let height = convertMetersToFeetAndInches(feetAndInch);
  document.getElementById('popUpContainer').innerHTML = openCardHTML(i, abilities, height);
  document.getElementById('popUpContainer').addEventListener('click', closeCard);
}

// CLOSE LARGE CARD
function closeCard(event) {
  if (event.target.id === 'popUpContainer') {
    document.body.style.overflow = '';
    document.getElementById('popUpContainer').style.display = 'none';
    document.getElementById('popUpContainer').innerHTML = '';
  }
}

// DISABLE LOAD ANMIATION
function disableLoadAnimation() {
  document.body.style.overflow = '';
  document.getElementById('loadAnimation').style.display = 'none';
}

// ACTIVATE LOAD ANIMATION
function activateLoadAnimation() {
  document.body.style.overflow = 'hidden';
  document.getElementById('loadAnimation').style.display = '';
}

// NEXT LARGE CARD
function nextCard(i) {
  i++;
  if (i >= pokeJson.length) {
    i = 0;
    openCard(i);
  } else {
    openCard(i);
  }
}

// LAST LARGE CARD
function lastCard(i) {
  if (i == 0) {
    i = pokeJson.length - 1;
    openCard(i);
  } else {
    i--;
    openCard(i);
  }
}

// START FUNCTION ON HOVER LARGE CARD
function start(i) {
  startProgress('progress-bar-fill-1', pokeJson[i].stats[1].base_stat);
  startProgress('progress-bar-fill-2', pokeJson[i].stats[2].base_stat);
  startProgress('progress-bar-fill-3', pokeJson[i].stats[3].base_stat);
  startProgress('progress-bar-fill-4', pokeJson[i].stats[4].base_stat);
  startProgress('progress-bar-fill-5', pokeJson[i].stats[5].base_stat);
}

// FILL PROGRESS BAR
function updateProgressBar(progress, progressBarFillId) {
  const progressBarFill = document.getElementById(progressBarFillId);
  progressBarFill.style.width = `${progress}%`;
  progressBarFill.innerText = `${progress}`;
}

// UPDATE PROGRESS BAR
function startProgress(progressBarFillId, stopPoint) {
  let progress = 0;

  const intervalId = setInterval(function () {
    progress += 1;
    updateProgressBar(progress, progressBarFillId);
    if (progress >= stopPoint) {
      clearInterval(intervalId);
    }
  }, 10);
}

// PLAY POKEMON SOUND
function playPokeSound(i, event) {
  event.preventDefault();
  event.stopPropagation();
  let audio = new Audio(pokeSound[i]);
  audio.volume = 0.2;
  audio.play().catch(function (error) {
    console.log('Sound not avaible', error);
  });
}
