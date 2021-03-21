// Get references to page elements
const $exampleTitle = $('#card-title');
const $exampleYear = $('#year');
const $exampleAuthor = $('#author');
const $exampleDirector = $('#director');
const $exampleCast = $('#cast');
const $exampleGenre = $('#genre');
const $examplePlot = $('#synopsis');
const $exampleRating = $('#my-rating');
const $exampleReview = $('#my-review');
const $submitBtn = $('#submit');
const $exampleList = $('#example-list');
const $searchBtn = $('#searchBtn');
const mediatype = $('#media-type').val();
// const mediatype = 'game';
const $itemsMenu = $('#options-menu');
let typeOfMedia;

let example = {};
let movieTitle;
let movieYear;
let movieWriter;
let movieDirector;
let movieCast;
let movieGenre;
let moviePoster;

let gameTitle;
let gameYear;
let gameDeveloper;
let gameGenre;
let gamePoster;

const showDropDown = function () {
  $('#media-type').toggleClass('hidden');
};

// $searchBtn.on('click', alert('media type needs to be chosen'));
$itemsMenu.on('click', showDropDown);

$(document).on('click', '.selectMediaItem', function (event) {
  typeOfMedia = event.target.innerHTML;
  $('#media-type').toggleClass('hidden'); // toggles the choices in the box
  document.getElementById('options-menu').innerHTML = typeOfMedia; // changes the type of media box to the currently selected type of media

  console.log(typeOfMedia);
});

if (mediatype === 'movie') {
  const displayOptions = function (response) {
    $('#search-results').empty(); // plug in the html of the unordered list of movies
    $('#findMedia').removeClass('invisible');
    $('#search-box').val('');
    console.log(response.Search.length);
    for (let i = 0; i < response.Search.length; i++) {
      const currentMovie = response.Search[i];
      console.log(response);
      const currentTitle = currentMovie.Title;
      const currentYear = currentMovie.Year;
      const currentPoster = currentMovie.Poster;
      const currentID = currentMovie.imdbID;

      // this might be useless due to how we implement li in the append, consider removing when working
      const newMovie = document.createElement('li');
      newMovie.classList += ''; // Would add any classes needed to add for styling/positioning/etc of the list item
      newMovie.id = 'movie-number' + i; // Would be the ID of each movie on the list displayed

      // Would need classes and or ids to set up css in this.
      const currentMovieHTML =
        `
    <div>
      <h4>${currentTitle}</h4>
      <p>${currentYear}</p>
      <img src="${currentPoster}">
    </div>
    `;

      $('#search-results').append(`<li>${currentMovieHTML}</li><button id=result-select-${i} value="${currentID}" class="btn btn-primary w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm selectedMovieButton">Select</button>`);
    }
  };

  // Unsure if there will be a different call for getMovieDetails so as of right now this is its own function for the user case of selecting the movie off of the list of movies given by OMDB.

  const findMovie = function () {
    // temp search box id
    const searchTerm = $('#search-box').val();
    const searchQueryUrl = 'http://www.omdbapi.com/?apikey=f5874e7b&s=' + searchTerm;

    $.ajax({
      url: searchQueryUrl,
      method: 'GET'
    }).then((response) => {
      displayOptions(response);
      // getMovieDetails(response.Search[0].imdbID);
      console.log(response);
    });
  };

  const getMovieDetails = function (id) {
    const detailQueryUrl = 'http://www.omdbapi.com/?apikey=f5874e7b&i=' + id;
    $.ajax({
      url: detailQueryUrl,
      method: 'GET'
    }).then((response) => {
      moviePoster = response.Poster;
      movieTitle = response.Title;
      movieYear = response.Year;
      movieWriter = response.Writer;
      movieDirector = response.Director;
      movieCast = response.Actors;
      movieGenre = response.Genre;

      displaySelected();
      console.log(moviePoster);
      console.log(response);
    });
  };

  const displaySelected = function () {
    // $('#search-results').empty();
    $('#findMedia').addClass('hidden');
    $('#inputDiv').removeClass('hidden');
    // console.log(movieTitle);
    // console.log(moviePoster);
    $('#selectedMedia').html(movieTitle);
    $('#selectedPoster').attr('src', moviePoster);
  };

  // The API object contains methods for each kind of request we'll make
  const API = {
    saveExample: function (example) {
      return $.ajax({
        headers: {
          'Content-Type': 'application/json'
        },
        type: 'POST',
        url: 'api/examples',
        data: JSON.stringify(example)
      });
    },
    getExamples: function () {
      return $.ajax({
        url: 'api/examples',
        type: 'GET'
      });
    },
    deleteExample: function (id) {
      return $.ajax({
        url: 'api/examples/' + id,
        type: 'DELETE'
      });
    }
  };

  // refreshExamples gets new examples from the db and repopulates the list
  const refreshExamples = function () {
    API.getExamples().then(function (data) {
      const $examples = data.map(function (example) {
        const $a = $('<a>')
          .text(example.text)
          .attr('href', '/example/' + example.id);

        const $li = $('<li>')
          .attr({
            class: 'list-group-item',
            'data-id': example.id
          })
          .append($a);

        const $button = $('<button>')
          .addClass('btn btn-danger float-right delete')
          .text('ｘ');

        $li.append($button);

        return $li;
      });

      $exampleList.empty();
      $exampleList.append($examples);
    });
  };

  // handleFormSubmit is called whenever we submit a new example
  // Save the new example to the db and refresh the list
  const handleFormSubmit = function (event) {
    event.preventDefault();

    example = {
      image: moviePoster,
      title: movieTitle,
      year: movieYear,
      author: movieWriter,
      director: movieDirector,
      cast: movieCast,
      genre: movieGenre,
      synopsis: $examplePlot.val().trim(),
      rating: $exampleRating.val().trim(),
      review: $exampleReview.val().trim(),
      UserId: window.userId
    };
    console.log(example);

    // if (!(example.text && example.description)) {
    //   alert('You must enter an example text and description!');
    //   return;
    // }

    API.saveExample(example).then(function () {
      refreshExamples();
    });

    $exampleTitle.val('');
    $exampleYear.val('');
    $exampleAuthor.val('');
    $exampleDirector.val('');
    $exampleCast.val('');
    $exampleGenre.val('');
    $examplePlot.val('');
    $exampleRating.val('');
    $exampleReview.val('');
  };
  const handleDeleteBtnClick = function () {
    const idToDelete = $(this).parent().attr('data-id');

    API.deleteExample(idToDelete).then(function () {
      refreshExamples();
    });
  };

  // Add event listeners to the submit and delete buttons
  $submitBtn.on('click', handleFormSubmit);
  $exampleList.on('click', '.delete', handleDeleteBtnClick);
  $searchBtn.on('click', findMovie);

  $(document).on('click', '.selectedMovieButton', function (event) {
    getMovieDetails(event.target.value);
  });
} else if (mediatype === 'game') {
  const displayOptions = function (response) {
    $('#search-results').empty(); // plug in the html of the unordered list of movies
    $('#findMedia').removeClass('invisible');
    $('#search-box').val('');
    console.log(response.results.length);
    for (let i = 0; i < response.results.length; i++) {
      const currentGame = response.results[i];
      // console.log(response);
      const currentTitle = currentGame.name;
      const currentYear = currentGame.released;
      const currentPoster = currentGame.background_image;
      const currentID = currentGame.id;

      // this might be useless due to how we implement li in the append, consider removing when working
      const newGame = document.createElement('li');
      newGame.classList += ''; // Would add any classes needed to add for styling/positioning/etc of the list item
      newGame.id = 'game-number' + i; // Would be the ID of each Game on the list displayed

      // Would need classes and or ids to set up css in this.
      const currentGameHTML =
        `
    <div>
      <h4>${currentTitle}</h4>
      <p>${currentYear}</p>
      <img src="${currentPoster}">
    </div>
    `;

      $('#search-results').append(`<li>${currentGameHTML}</li><button id=result-select-${i} value="${currentID}" class="btn btn-primary w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm selectedMovieButton">Select</button>`);
    }
  };

  // Unsure if there will be a different call for getGameDetails so as of right now this is its own function for the user case of selecting the Game off of the list of Games given by OMDB.

  const findGame = function () {
    // temp search box id
    const searchTerm = $('#search-box').val();
    const searchQueryUrl = 'https://api.rawg.io/api/games?key=7dd64f0797d74fb0981b46bc46e59163&search=' + searchTerm;

    $.ajax({
      url: searchQueryUrl,
      method: 'GET'
    }).then((response) => {
      displayOptions(response);
      // getGameDetails(response.Search[0].imdbID);
      console.log(response);
    });
  };

  const getGameDetails = function (id) {
    const detailQueryUrl = 'https://api.rawg.io/api/games/' + id + '?key=7dd64f0797d74fb0981b46bc46e59163';
    $.ajax({
      url: detailQueryUrl,
      method: 'GET'
    }).then((response) => {
      gamePoster = response.background_image;
      gameTitle = response.name;
      gameYear = response.released;
      // add loops for these two
      gameGenre = response.genre;
      gameDeveloper = response.developers;

      displaySelected();
      console.log(gamePoster);
      console.log(response);
    });
  };

  const displaySelected = function () {
    // $('#search-results').empty();
    $('#findMedia').addClass('hidden');
    $('#inputDiv').removeClass('hidden');
    // console.log(GameTitle);
    // console.log(GamePoster);
    $('#selectedMedia').html(gameTitle);
    $('#selectedPoster').attr('src', gamePoster);
  };

  // The API object contains methods for each kind of request we'll make
  const API = {
    saveExample: function (example) {
      return $.ajax({
        headers: {
          'Content-Type': 'application/json'
        },
        type: 'POST',
        url: 'api/examples',
        data: JSON.stringify(example)
      });
    },
    getExamples: function () {
      return $.ajax({
        url: 'api/examples',
        type: 'GET'
      });
    },
    deleteExample: function (id) {
      return $.ajax({
        url: 'api/examples/' + id,
        type: 'DELETE'
      });
    }
  };

  // refreshExamples gets new examples from the db and repopulates the list
  const refreshExamples = function () {
    API.getExamples().then(function (data) {
      const $examples = data.map(function (example) {
        const $a = $('<a>')
          .text(example.text)
          .attr('href', '/example/' + example.id);

        const $li = $('<li>')
          .attr({
            class: 'list-group-item',
            'data-id': example.id
          })
          .append($a);

        const $button = $('<button>')
          .addClass('btn btn-danger float-right delete')
          .text('ｘ');

        $li.append($button);

        return $li;
      });

      $exampleList.empty();
      $exampleList.append($examples);
    });
  };

  // handleFormSubmit is called whenever we submit a new example
  // Save the new example to the db and refresh the list
  const handleFormSubmit = function (event) {
    event.preventDefault();

    example = {
      image: gamePoster,
      title: gameTitle,
      year: gameYear,
      author: gameDeveloper,
      genre: gameGenre,
      synopsis: $examplePlot.val().trim(),
      rating: $exampleRating.val().trim(),
      review: $exampleReview.val().trim(),
      UserId: window.userId
    };
    console.log(example);

    // if (!(example.text && example.description)) {
    //   alert('You must enter an example text and description!');
    //   return;
    // }

    API.saveExample(example).then(function () {
      refreshExamples();
    });

    $exampleTitle.val('');
    $exampleYear.val('');
    $exampleAuthor.val('');
    $exampleDirector.val('');
    $exampleCast.val('');
    $exampleGenre.val('');
    $examplePlot.val('');
    $exampleRating.val('');
    $exampleReview.val('');
  };
  const handleDeleteBtnClick = function () {
    const idToDelete = $(this).parent().attr('data-id');

    API.deleteExample(idToDelete).then(function () {
      refreshExamples();
    });
  };

  // Add event listeners to the submit and delete buttons
  $submitBtn.on('click', handleFormSubmit);
  $exampleList.on('click', '.delete', handleDeleteBtnClick);
  $searchBtn.on('click', findGame);

  $(document).on('click', '.selectedMovieButton', function (event) {
    getGameDetails(event.target.value);
  });
} else {
  alert('media type needs to be chosen');
}
// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
// not sure if it adds stuff to db
