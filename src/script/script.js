/**
 * The URL to fetch the first 151 Pokémon from the PokéAPI.
 * @constant {string}
 */
const RED_URL = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';

/**
 * The current index of loaded Pokémon.
 * @type {number}
 */
let currentIndex = 0;

/**
 * The number of Pokémon images to load per batch.
 * @constant {number}
 */
const imagesPerLoad = 20;

/**
 * An array to store the details of loaded Pokémon.
 * @type {Array}
 */
let pokeJson = [];

/**
 * An array to store the sound URLs of loaded Pokémon.
 * @type {Array}
 */
let pokeSound = [];

/**
 * Initializes the application by clearing the content, resetting data arrays, and loading data.
 */
function init() {
  let pokeCard = document.getElementById('content');
  pokeCard.innerHTML = '';
  pokeJson = [];
  loadAndRenderData();
  loadFromLocalStorage();
}

/**
 * Loads and renders Pokémon data by fetching it from the API and then calling the render function.
 * Displays a loading animation while data is being fetched.
 */
async function loadAndRenderData() {
  activateLoadAnimation();
  let data = await loadData();
  if (data) {
    renderCard(data.results);
  } else {
    console.error('No Data to render');
  }
}

/**
 * Fetches Pokémon data from the PokéAPI.
 * @returns {Object} The JSON response from the API containing Pokémon data.
 */
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

/**
 * Renders a batch of Pokémon cards onto the page.
 * @param {Array} pokemonList - The list of Pokémon to render.
 */
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

/**
 * Checks the current index and updates the UI accordingly.
 * If all Pokémon are loaded, disables the load button.
 */
function checkCurrentIndex() {
  currentIndex += imagesPerLoad;
  if (currentIndex == 20) {
    document.getElementById('showAmount').innerHTML = currentIndex + ' / 151';
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

/**
 * Scrolls the page to the bottom after a slight delay.
 */
function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, '10');
  document.getElementById('showAmount').innerHTML = currentIndex + ' / 151';
}

/**
 * Searches for Pokémon by name based on user input and filters the displayed cards.
 */
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

/**
 * Fetches detailed Pokémon information from the provided URL.
 * @param {string} url - The URL to fetch Pokémon details from.
 * @returns {Object} The JSON response containing Pokémon details.
 */
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

/**
 * Allows an element to be dropped by preventing the default handling of the event.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Handles the drag event by setting the data to be transferred.
 * @param {Event} ev - The drag event.
 */
function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.id);
}

/**
 * Handles the drop event by appending a cloned element to the drop container.
 * Limits the number of Pokémon that can be added to favorites.
 * @param {Event} ev - The drop event.
 */
function drop(ev) {
  ev.preventDefault();

  let data = ev.dataTransfer.getData('text');
  let originalElement = document.getElementById(data);
  let dropContainer = document.getElementById('dropContainer');

  if (dropContainer.children.length >= 6) {
    alert('You can only add up to 5 favorite Pokémon.');
    return;
  }

  for (let child of dropContainer.children) {
    if (child.dataset.pokemonId === data) {
      alert('This Pokémon is already in your favorites!');
      return;
    }
  }

  let clone = originalElement.cloneNode(true);
  clone.id = '';
  let containerDiv = document.createElement('div');
  containerDiv.className = 'droppedElement';
  containerDiv.dataset.pokemonId = data;

  containerDiv.appendChild(clone);
  addRemoveButton(containerDiv);
  ev.target.appendChild(containerDiv);

  saveToLocalStorage();
}


/**
 * Adds a remove button to the given element.
 * @param {HTMLElement} element - The element to add a remove button to.
 */
function addRemoveButton(element) {
  let removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'X';
  removeBtn.className = 'remove-btn';
  removeBtn.setAttribute('onclick', 'removeParentElement(this);');
  element.appendChild(removeBtn);
}

/**
 * Removes the parent element of the given element and saves the updated content to local storage.
 * @param {HTMLElement} element - The element whose parent will be removed.
 */
function removeParentElement(element) {
  element.parentElement.remove();
  saveToLocalStorage();
}

/**
 * Saves the current content of the drop container to local storage.
 */
function saveToLocalStorage() {
  let container = document.getElementById('dropContainer');
  localStorage.setItem('containerContent', container.innerHTML);
}

/**
 * Loads the saved content from local storage into the drop container.
 */
function loadFromLocalStorage() {
  let container = document.getElementById('dropContainer');
  let content = localStorage.getItem('containerContent');
  if (content) {
    container.innerHTML = content;
  }
}

/**
 * Converts meters to feet and inches.
 * @param {number} meters - The height in meters.
 * @returns {Object} An object containing the height in feet and inches.
 */
function convertMetersToFeetAndInches(meters) {
  const cm = meters * 100;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Opens a detailed view of the Pokémon card and displays the Pokémon's abilities and height.
 * @param {number} i - The index of the Pokémon in the pokeJson array.
 */
function openCard(i) {
  document.body.style.overflow = 'hidden';
  document.getElementById('popUpContainer').style.display = '';
  let abilities = pokeJson[i].abilities.map((type) => type.ability.name).join('\n');
  let feetAndInch = pokeJson[i].height / 10;
  let height = convertMetersToFeetAndInches(feetAndInch);
  document.getElementById('popUpContainer').innerHTML = openCardHTML(i, abilities, height);
  document.getElementById('popUpContainer').addEventListener('click', closeCard);
}

/**
 * Closes the detailed Pokémon card view if the click event occurs outside the card.
 * @param {Event} event - The click event.
 */
function closeCard(event) {
  if (event.target.id === 'popUpContainer') {
    document.body.style.overflow = '';
    document.getElementById('popUpContainer').style.display = 'none';
    document.getElementById('popUpContainer').innerHTML = '';
  }
}

/**
 * Disables the loading animation and allows scrolling.
 */
function disableLoadAnimation() {
  document.body.style.overflow = '';
  document.getElementById('loadAnimation').style.display = 'none';
}

/**
 * Activates the loading animation and disables scrolling.
 */
function activateLoadAnimation() {
  document.body.style.overflow = 'hidden';
  document.getElementById('loadAnimation').style.display = '';
}

/**
 * Opens the next Pokémon card in the detailed view.
 * If the end of the list is reached, loops back to the beginning.
 * @param {number} i - The current index of the Pokémon.
 */
function nextCard(i) {
  i++;
  if (i >= pokeJson.length) {
    i = 0;
    openCard(i);
  } else {
    openCard(i);
  }
}

/**
 * Opens the previous Pokémon card in the detailed view.
 * If the beginning of the list is reached, loops back to the end.
 * @param {number} i - The current index of the Pokémon.
 */
function lastCard(i) {
  if (i == 0) {
    i = pokeJson.length - 1;
    openCard(i);
  } else {
    i--;
    openCard(i);
  }
}

/**
 * Initializes the progress bars for the selected Pokémon's stats.
 * Each progress bar represents a different stat of the Pokémon.
 * @param {number} i - The index of the Pokémon in the pokeJson array.
 */
function start(i) {
  startProgress('progress-bar-fill-1', pokeJson[i].stats[1].base_stat);
  startProgress('progress-bar-fill-2', pokeJson[i].stats[2].base_stat);
  startProgress('progress-bar-fill-3', pokeJson[i].stats[3].base_stat);
  startProgress('progress-bar-fill-4', pokeJson[i].stats[4].base_stat);
  startProgress('progress-bar-fill-5', pokeJson[i].stats[5].base_stat);
}

/**
 * Updates the width and text of a progress bar element based on the current progress.
 * @param {number} progress - The current progress value to display.
 * @param {string} progressBarFillId - The ID of the progress bar element to update.
 */
function updateProgressBar(progress, progressBarFillId) {
  const progressBarFill = document.getElementById(progressBarFillId);
  progressBarFill.style.width = `${progress}%`;
  progressBarFill.innerText = `${progress}`;
}

/**
 * Animates a progress bar by incrementally increasing its width until it reaches the stop point.
 * @param {string} progressBarFillId - The ID of the progress bar element to animate.
 * @param {number} stopPoint - The value at which the progress bar should stop.
 */
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

/**
 * Plays the sound associated with a specific Pokémon when its card is clicked.
 * Prevents the default click behavior and stops the click event from propagating further.
 * @param {number} i - The index of the Pokémon in the pokeSound array.
 * @param {Event} event - The event object associated with the click.
 */
function playPokeSound(i, event) {
  event.preventDefault();
  event.stopPropagation();
  let audio = new Audio(pokeSound[i]);
  audio.volume = 0.2;
  audio.play().catch(function (error) {
    console.log('Sound not available', error);
  });
}
