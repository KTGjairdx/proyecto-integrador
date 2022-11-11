const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const especific = document.querySelector("#especifico");
const numeroEspecifico = document.querySelector('#numeropokedex');
//variables
let limit = 8;
let offset = 1;
let equipo = [];

previous.addEventListener("click", () => {
  if (offset <= 1) {
    offset = 898;
  } else {
    offset -= 9;
  }
  removechilds();
});

next.addEventListener("click", () => {
  if (offset >= 898) {
    offset = 1;
  } else {
    offset += 9;
  }
  removechilds();
});

especific.addEventListener("click", () => {
  const valorUser = parseInt(numeroEspecifico.value);
  if (valorUser >= 908 || valorUser <= 0 || isNaN(valorUser)) {
    Swal.fire({
      icon: 'error',
      title: 'Valor Invalido',
      text: 'Favor de colocar un nuevo numero!',
    })
    offset = 1;
  } else {
    offset = valorUser;
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

function removechilds() {
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
  for (let i = 0; i < pokemon.types.length; i++) {
    const typesprite = document.createElement("img");
    typesprite.src = "/types/" + pokemon.types[i].type.name + ".png ";
    typeContainer.appendChild(typesprite);
  }

  //agrega su numero en la pokedex
  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;
  //agrega su nombre en la pokedex
  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;

  /*agrega a la carta empezando por el sprite
  luego el numero
  luego el nombre
  al final el tipo de la pokedex */
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
  // aqui realiza las operaciones  para dar las estadisticas de cada pokemon
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
  const regionNombre = addRegion(numero);
  Region.textContent =  regionNombre;
  statsContainer.appendChild(Region);
  // -------------------------------------------------------
  const Add = document.createElement("button"); 
  statsContainer.appendChild(Add);
  Add.innerHTML = "Equipo";  

  Add.addEventListener("click", () => {
    console.log(stats.name); 
    agregarEquipo(stats.id); 
  })
  
  return statsContainer;
}


function addRegion(id) {
  let region = 'Region: '
  if (id <= 151) {
    region += "Kanto";
  } else if (id >= 152 && id <= 251) {
    region +=  "Johto";
  } else if (id >= 252 && id <= 386) {
    region +=  "Hoenn";
  } else if (id >= 387 && id <= 493) {
    region += "Sinnoh";
  } else if (id >= 494 && id <= 649) {  
    region += "Teselia";
  } else if (id >= 650 && id <= 721) {
    region += "Kalos";
  } else if (id >= 722 && id <= 809) {
    region += "Alola";
  } else if (id >= 810 && id <= 898) {
    region +=  "Galar";
  } else if (id >= 899) {
    region += "Hisui";
  }
  return region
}

//remueve
function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);


function agregarEquipo(pokemon){
  if(equipo.includes(pokemon)){
    Swal.fire({
      icon: 'error',
      title: 'Hey!',
      text: 'Ya esta en el equipo',
    })
  }else if(equipo.length >= 6 ){
    Swal.fire({
      icon: 'info',
      title: 'Hey!',
      text: 'TU equipo esta lleno',
    })
  } else{
  equipo.push(pokemon);
  }
  console.log(equipo);
}