/**
 * Searches for all HTML elements with the attribute `w3-include-html` and loads the content 
 * of the specified file into these elements. This function is called recursively to ensure 
 * all contents are loaded.
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName('*');
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute('w3-include-html');
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = 'Page not found.';
          }
          elmnt.removeAttribute('w3-include-html');
          includeHTML();
        }
      };
      xhttp.open('GET', file, true);
      xhttp.send();
      return;
    }
  }
}

/**
 * Generates the HTML code for a Pokémon card.
 * 
 * @param {string} pokemon - The name of the Pokémon.
 * @param {Object} pokemonDetails - An object containing detailed information about the Pokémon.
 * @param {string} types - A HTML string representing the types of the Pokémon.
 * @param {number} i - The index of the Pokémon card.
 * @returns {string} The HTML string representing the Pokémon card.
 */
function renderHTML(pokemon, pokemonDetails, types, i) {
  return /*html*/ `
    <div draggable="true" onclick="openCard(${i}); return false;" id="card${i}" class="pokeCard ${pokemonDetails.types[0].type.name}">
        <h3>${pokemonDetails.name}</h3>
        <img id="drag${i}" loading="lazy" ondragstart="drag(event)" src="${pokemonDetails.sprites.other['dream_world'].front_default}" alt="${pokemon} picture"></img>
        <div class="seperator"></div>
        <span>No: ${pokemonDetails.id}</span>
        <div class="typesContainer">${types}</div>
    </div>
  `;
}

/**
 * Generates the HTML code for an expanded view of a Pokémon card.
 * 
 * @param {number} i - The index of the Pokémon card.
 * @param {string} abilities - A string representing the abilities of the Pokémon.
 * @param {Object} height - An object containing the height information of the Pokémon.
 * @param {number} height.feet - The height of the Pokémon in feet.
 * @param {number} height.inches - The height of the Pokémon in inches.
 * @returns {string} The HTML string representing the expanded Pokémon card.
 */
function openCardHTML(i, abilities, height) {
  return /*html*/ `
    <a class="btnLeft" onclick="lastCard(${i}); return false;" href="#"><img src="./src/img/arrow-left.png" alt=""></a> 

    <div class="cardContainer">
    <div onmouseover="start(${i})" class="largeCard front ${pokeJson[i].types[0].type.name}">
        <div class="largeCard ${pokeJson[i].types[0].type.name}">
            <div class="headlineContainer">
                <div>
                    <span class="basis"><i>Basis</i></span>
                    <h2>${pokeJson[i].name}</h2>
                </div>
                <div class="kp">
                    <span>HP</span>
                    <span>${pokeJson[i].stats[0].base_stat}</span>
                </div>
            </div>

            <div class="imgContainer">
                <img loading="lazy" src="${pokeJson[i].sprites.other['dream_world'].front_default}" alt=""></img>
            </div>
            <div class="pokeDescription">
                <span>No: ${String(pokeJson[i].id).padStart(5, '0')}</span>
                <span>Height: ${height.feet}' ${height.inches}"</span>
                <span>Weight: ${pokeJson[i].weight} lbs</span>
            </div>
            <div class="frontAbility">
                <b><u>Abilities</u></b>
                ${abilities.replace(/\n/g, '<br>')}
                <span class="hover">hover card for more details</span>
            </div>
        </div>
    </div>
    <div class="largeCard back ${pokeJson[i].types[0].type.name}">
        <div class="largeCard ${pokeJson[i].types[0].type.name}">
            <div class="gifContainer">
                <img id="backGif" loading="lazy" src="${pokeJson[i].sprites.other['showdown'].back_default}" alt=""></img>
                <a onclick="playPokeSound(${i}, event)" href="#"><img class="scream" id="scream" src="./src/img/scream.png" alt=""></a> 
            </div>
            <div class="barContainer">
                  <span>Attack</span>
                <div class="progress-bar" id="progress-bar-1">
                  <div class="progress-bar-fill" id="progress-bar-fill-1"></div>
                </div>
                <span>Defense</span>
                <div class="progress-bar" id="progress-bar-2">
                  <div class="progress-bar-fill" id="progress-bar-fill-2"></div>
                </div>
                <span>Special-Attack</span>
                <div class="progress-bar" id="progress-bar-3">
                  <div class="progress-bar-fill" id="progress-bar-fill-3"></div>
                </div>
                <span>Special-Defense</span>
                <div class="progress-bar" id="progress-bar-4">
                  <div class="progress-bar-fill" id="progress-bar-fill-4"></div>
                </div>
                <span>Speed</span>
                <div class="progress-bar" id="progress-bar-5">
                  <div class="progress-bar-fill" id="progress-bar-fill-5"></div>
                </div>
            </div>
        </div>
    </div>
</div>

    <a class="btnRight" onclick="nextCard(${i}); return false;" href="#"><img src="./src/img/arrow-right.png" alt=""></a> 
  `;
}
