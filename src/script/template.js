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
function renderHTML(pokemon, pokemonDetails, types) {
  return /*html*/ `
    <div class="pokeCard ${pokemonDetails.types[0].type.name}">
    <div class="pokeCardHeader">
        <h3>${pokemonDetails.name}</h3>
    </div>
        <img loading="lazy" src="${pokemonDetails.sprites.other['dream_world'].front_default}" alt="${pokemon} picture"></img>
        <div class="seperator"></div>
        <span>ID: ${pokemonDetails.id}</span>
        <span>${types}</span>
    </div>
        `;
}
