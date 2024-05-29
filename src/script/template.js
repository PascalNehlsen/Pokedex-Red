// GET TEMPLATES
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

// RENDER MY POKEMON HTML
function renderHTML(pokemon, pokemonDetails, types, i) {
  return /*html*/ `
    <div onclick="openCard(${i})" id="card${i}" class="pokeCard ${pokemonDetails.types[0].type.name}">
        <h3>${pokemonDetails.name}</h3>
        <img loading="lazy" src="${pokemonDetails.sprites.other['dream_world'].front_default}" alt="${pokemon} picture"></img>
        <div class="seperator"></div>
        <span>ID: ${pokemonDetails.id}</span>
        <span>${types}</span>
    </div>
        `;
}

// OPEN CARD HTML
function openCardHTML(i) {
  return /*html*/ `
  <div class="cardContainer">
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
        <img loading="lazy" src="${
          pokeJson[i].sprites.other['dream_world'].front_default
        }" alt=""></img>
      </div>
      <div class="pokeDescription">
        <span>No: ${String(pokeJson[i].id).padStart(5, '0')}</span> 
        <span>Samen Pokemon</span>
        <span>Weight: ${pokeJson[i].weight} lbs</span>
      </div>
    </div>
  </div>
  `;
}
