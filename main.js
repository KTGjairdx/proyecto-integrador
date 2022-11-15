const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const especific = document.querySelector("#especifico");
const numeroEspecifico = document.querySelector('#numeropokedex');
const mostrarEquipo = document.querySelector("#equipo");
const Eliminar = document.querySelector('#eliminarEquipo');
const Inicio = document.querySelector('#Inicio');
const modalEquipo = document.querySelector('#modal');
const CerrarModal = document.querySelector('#close');
const debilidadescontainer = document.querySelector(".debilidades");
//variables globales
let limit = 8;
let offset = 1;
let equipo = [];
let yaEnEquipo = false;


//realiza el primer despliegue de pokemons 
fetchPokemons(offset, limit);

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
 // const typeContainer = document.createElement("div");
  //typeContainer.classList.add("img-container-type");

  //agrega el tipo del pokemon con imagenes ()


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
  let tipo =[]
  for (let i = 0; i < pokemon.types.length; i++) {
    tipo.push(pokemon.types[i].type.name);
  }
  agregar(card,tipo);

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
  Region.textContent =  addRegion(parseInt(stats.id));
  statsContainer.appendChild(Region);

  ///aqui crear que si ya esta en el equipo en luigar de ser agregar sea eliminar :d 
  for (let x of equipo){
    if(x.id==stats.id){
       yaEnEquipo =true
    }
  }

  if(yaEnEquipo==true){
    const remove = document.createElement("button"); 
    statsContainer.appendChild(remove);
    remove.innerHTML = "Remover de equipo";
    remove.style.background='#990000';  
    remove.style.color='#FFFFFF';
    remove.addEventListener("click", () => {
      EliminarPokemon(stats); 
    })
    yaEnEquipo=false;
  }else{
    const Add = document.createElement("button"); 
    statsContainer.appendChild(Add);
    Add.innerHTML = "Equipo";  
    Add.addEventListener("click", () => {
      agregarEquipo(stats); 
    })
  }
  
  return statsContainer;
}

//funcion que determinado el id del pokemon agrega la region a la que permanece
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
//revisar por que no jala la validacion solamente
function agregarEquipo(pokemon){
if(equipo.length >= 6 ){
    Swal.fire({
      icon: 'info',
      title: 'Hey!',
      text: 'TU equipo esta lleno',
    })
  } else{
  equipo.push(pokemon);
  }
  removechilds();
}

function EliminarPokemon(pokemon){
  equipo.pop(pokemon.id);
  removechilds();
}

mostrarEquipo.addEventListener("click", () => { 
  if(equipo.length == 0){
  Swal.fire({
    icon: 'error',
    title: 'Hey!',
    text: 'tu equipo esta vacio',
  })
  }else{
    modalEquipo.style.visibility = "visible";
    removeChildNodes(pokemonContainer);
    removeChildNodes(debilidadescontainer);
    let debilidadestipo = [];
    for (let i = 0; i < equipo.length ; i++) {
      fetchPokemon(equipo[i].id);
      for (let y = 0; y < equipo[i].types.length; y++) {
      const tipo = equipo[i].types[y].type.name;
      const respuesta = debilidad(tipo);
      debilidadestipo = debilidadestipo.concat(respuesta);
      }
    }
    agregar(debilidadescontainer,debilidadestipo);
  }
});

Eliminar.addEventListener("click", () => {
  if(equipo.length == 0){ 
  Swal.fire({
    icon: 'error',
    title: 'Hey!',
    text: 'tu equipo esta vacio',
  })
  }else{
    equipo=[];
    Swal.fire({
      icon: 'success',
      text: 'Equipo eliminado con exito',
    })
    removechilds();
  }
});

CerrarModal.addEventListener("click", () => {
  modalEquipo.style.visibility = "hidden";
});

function debilidad(tipo){
  let grupoDebilidades=[];
  switch (tipo) {
    case 'grass':
      grupoDebilidades = ['bug','fire','ice','poison','flying'];
      break;
    case 'fire':
      grupoDebilidades = ['water','rock','ground'];
    break;
    case 'water':
      grupoDebilidades = ['electric','grass'];
    break;
    case 'steel':
      grupoDebilidades = ['fire','fighting','ground'];
    break;
    case 'bug':
      grupoDebilidades = ['fire','rock','flying'];
    break;
    case 'dragon':
      grupoDebilidades = ['dragon','fairy','ice'];
    break;
    case 'electric':
      grupoDebilidades = ['ground'];
    break;
    case 'ghost':
      grupoDebilidades = ['dark'];
    break;
    case 'fairy':
      grupoDebilidades = ['steel','poison'];
    break;
    case 'ice':
      grupoDebilidades = ['steel','fire','fighting','rock'];
    break;
    case 'fighting':
      grupoDebilidades = ['fairy','psychic','flying'];
    break;
    case 'normal':
      grupoDebilidades = ['fighting'];
    break;
    case 'psychic':
      grupoDebilidades = ['bug','ghost','dark'];
    break;
    case 'rock':
      grupoDebilidades = ['steel','water','fighting','grass','ground'];
    break;
    case 'dark':
      grupoDebilidades = ['bug','fairy','fighting'];
    break;
    case 'dark':
      grupoDebilidades = ['bug','fairy','fighting'];
    break;
    case 'ground':
      grupoDebilidades = ['water','ice','grass'];
    break;
    case 'poison':
      grupoDebilidades = ['psychic','ground'];
    break;
    case 'flying':
      grupoDebilidades = ['electric','ice','rock'];
    break;
  }
  return grupoDebilidades;
}

function agregar(contendor,respuesta){
  const typeContainer = document.createElement("div");
  typeContainer.classList.add("img-container-type");
  for(let x = 0;x<respuesta.length;x++){
    const typesprite = document.createElement("img");
    typesprite.src = "/types/" + respuesta[x] + ".png ";
    typeContainer.appendChild(typesprite);
  }
  contendor.appendChild(typeContainer);
}