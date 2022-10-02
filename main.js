const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

let limit = 8;
let offset = 1;

previous.addEventListener("click", () => {
if (offset == 1){
    offset = 898
}else{
  offset -= 9
}
    removechilds();
});

next.addEventListener("click", () => {
  if(offset >= 898 ){
    offset = 1;
  }else{
  offset += 9;
  }
  removechilds();

});

function fetchPokemon(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      createPokemon(data);
      spinner.style.display = "none";
    });
}

function fetchPokemons(offset, limit) {
  spinner.style.display = "block";
  for (let i = offset; i <= offset + limit; i++) {
    fetchPokemon(i);
  }
}

function removechilds(){
    removeChildNodes(pokemonContainer);
    fetchPokemons(offset, limit);
}


function createPokemon(pokemon) {
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  const card = document.createElement("div");
  card.classList.add("pokemon-block");


  //crea el contenedor y agrega el sprite de los pokemon
  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  //crea el conteiner de la imagen de los typos
  const typeContainer = document.createElement("div");
  typeContainer.classList.add("img-container-type"); 

//agrega el tipo del pokemon con imagenes ()
  for(let i = 0; i < pokemon.types.length ; i++){
    const typesprite = document.createElement("img");
    typesprite.src = '/types/'+ pokemon.types[i].type.name + '.png ';
    typeContainer.appendChild(typesprite);
    }

//agrega su numero en la pokedex 
  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;
//agrega su nombre en la pokedex
  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;


  //agrega a la carta empezando por el sprite
  //luego el numero
  //luego el nombre
  //al final el tipo de la pokedex 
  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);
  card.appendChild(typeContainer);  


  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  cardBack.appendChild(progressBars(pokemon));

  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  pokemonContainer.appendChild(flipCard);

}


//funct que agrega las stadisticas en la parte anterior de la tarjeta
function progressBars(stats) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 3; i++) {
    const stat = stats.stats[i];

    const statPercent = stat.base_stat / 2 + "%";
    const statContainer = document.createElement("stat-container");
    statContainer.classList.add("stat-container");

    const statName = document.createElement("p");
    statName.textContent = stat.stat.name;

    const progress = document.createElement("div");
    progress.classList.add("progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent;

    progressBar.textContent = stat.base_stat;

    progress.appendChild(progressBar);
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }

  // coloca la region del pokemon
  const Region = document.createElement("p");
  Region.classList.add("name");
  const numero = parseInt(stats.id);
  if(numero <= 151){
    Region.textContent = 'Region: Kanto';
  }else if(numero >= 152 && numero <= 251 ){
    Region.textContent = 'Region: Johto';
  }
  else if(numero >= 252 && numero <= 386 ){
    Region.textContent = 'Region: Hoenn';
  }
  else if(numero >= 387 && numero <= 493 ){
    Region.textContent = 'Region: Sinnoh';
  }
  else if(numero >= 494 && numero <= 649 ){
    Region.textContent = 'Region: Teselia';
  }
  else if(numero >= 650 && numero <= 721 ){
    Region.textContent = 'Region: Kalos';
  }
  else if(numero >= 722 && numero <= 809 ){
    Region.textContent = 'Region: Alola';
  }
  else if(numero >= 810 && numero <= 898){
    Region.textContent = 'Region: Galar';
  }
  else if(numero >= 899 ){
    Region.textContent = 'Region: Hisui';
  }
  console.log(stats)
  statsContainer.appendChild(Region);
// -------------------------------------------------------



  return statsContainer;
}
//remueve 
function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);
