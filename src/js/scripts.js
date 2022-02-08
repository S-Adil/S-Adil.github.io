let pokemonRepository = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150' ;
  //let modalContainer = document.querySelector('.modal');

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }

  function getAll() {
    return pokemonList;
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      // console.log(item);
      showModal(item);
    });
  }

  function addListItem(pokemon) {
    let pokemonList = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    listItem.classList.add('group-list-item');
    let button = document.createElement('button');
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#exampleModal");
    button.classList.add('pokemonList');
    button.classList.add('btn');
    button.classList.add('btn-outline-dark');
    button.innerText = pokemon.name;
    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
    // adding an event listener and passing the showDetails function to it
    button.addEventListener('click', function(event) {
      showDetails(pokemon);
    });
  }
  //Promise function time: fetch fcn to fetch api
  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function(json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
        console.log(pokemon);
      })
    }).catch(function (e) {
      console.error(e);
    })
  }

  function loadDetails (item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // now we add details to the item
      item.imageURL = details.sprites.front_default;
      item.height = details.height;
      item.abilities = [];
      for (let i = 0; i < details.abilities.length; i++){
        item.abilities.push(" " + details.abilities[i].ability.name);
      }

    }).catch(function (e) {
      console.error(e);
    });
  }

  function showModal(pokemon) {

    //creating variables needed for bootstrap modal using jquery
    let modalBody = $(".modal-body");
    let modalHeader = $(".modal-header");
    let modalTitle = $(".modal-title");

    //clearing modal everytime at the beginning of fucntion
    modalTitle.empty();
    modalBody.empty();

    //creating variables for different pokemon traits, going to append them to the modal
    let pokemonName = $("<h>" + pokemon.name + "</h>");
    let pokemonImageFront = $('<img class="modal-image">');
    pokemonImageFront.attr("src", pokemon.imageURL);
    let pokemonHeight = $("<p>" + "Height: " + pokemon.height + "</p>");
    let pokemonAbilities = $("<p>" + "Abilities: " + pokemon.abilities + "</p>");


    //appending everything to the modal
    modalTitle.append(pokemonName);
    modalBody.append(pokemonImageFront);
    modalBody.append(pokemonHeight);
    modalBody.append(pokemonAbilities);

   }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
  }
})();

pokemonRepository.loadList().then(function() {
  // now the data is loaded
 pokemonRepository.getAll().forEach(function(pokemon) {
   pokemonRepository.addListItem(pokemon);
  });
});
