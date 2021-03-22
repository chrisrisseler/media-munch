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
// const mediatype = $('#media-type').val();
// const mediatype = 'game';
let mediatype;
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
  mediatype = typeOfMedia;
  console.log(typeOfMedia);
});
console.log(mediatype);

const findMedia = function () {
  // temp search box id
  console.log(typeOfMedia);

  if (typeOfMedia === 'Movie') {
    const searchTerm = $('#search-box').val();
    const searchQueryUrl = 'http://www.omdbapi.com/?apikey=f5874e7b&s=' + searchTerm;

    $.ajax({
      url: searchQueryUrl,
      method: 'GET'
    }).then((response) => {
      displayOptionsMovie(response);
      // getMovieDetails(response.Search[0].imdbID);
      console.log(response);
    });
  } else if (typeOfMedia === 'Game') {
    const searchTerm = $('#search-box').val();
    const searchQueryUrl = 'https://api.rawg.io/api/games?key=7dd64f0797d74fb0981b46bc46e59163&search=' + searchTerm;

    $.ajax({
      url: searchQueryUrl,
      method: 'GET'
    }).then((response) => {
      displayOptionsGame(response);
      // getGameDetails(response.Search[0].imdbID);
      console.log(response);
    });
  } else if (typeOfMedia === 'Comic') {
    const searchTerm = $('#search-box').val();
    const responseFields = 'name,id,image,description,deck,cover_date,volume,issue_number,publisher';
    const searchQueryUrl = 'https://cors-anywhere.herokuapp.com/http://www.comicvine.com/api/search/?api_key=2736f1620710c52159ba0d0aea337c59bd273816' +
    '&format=json&field_list=' + responseFields + '$resources=' + 'volume' + '&query=' + searchTerm;

    $.ajax({
      url: searchQueryUrl,
      method: 'GET'
    }).then((response) => {
      displayOptionsComic(response);
      console.log(response);
    });
  };
};

const displayOptionsMovie = function (response) {
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

const displayOptionsGame = function (response) {
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

const displayOptionsComic = function (response) {
  $('#search-results').empty(); // plug in the html of the unordered list of movies
  $('#findMedia').removeClass('invisible');
  $('#search-box').val('');
  console.log(response.results.length);
  for (let i = 0; i < response.results.length; i++) {
    const currentComic = response.results[i];
    // console.log(response);
    const currentTitle = currentComic.name;
    const currentYear = currentComic.released;
    const currentPoster = currentComic.image.medium_url;
    const currentID = currentComic.id;

    // this might be useless due to how we implement li in the append, consider removing when working
    const newComic = document.createElement('li');
    newComic.classList += ''; // Would add any classes needed to add for styling/positioning/etc of the list item
    newComic.id = 'comic-number' + i; // Would be the ID of each Game on the list displayed

    // Would need classes and or ids to set up css in this.
    const currentComicHTML =
      `
  <div>
    <h4>${currentTitle}</h4>
    <p>${currentYear}</p>
    <img src="${currentPoster}">
  </div>
  `;

    $('#search-results').append(`<li>${currentComicHTML}</li><button id=result-select-${i} value="${currentID}" class="btn btn-primary w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm selectedMovieButton">Select</button>`);
  }
};

const getMediaDetails = function (id) {
  if (typeOfMedia === 'Movie') {
    const detailQueryUrl = 'http://www.omdbapi.com/?apikey=f5874e7b&i=' + id;
    $.ajax({
      url: detailQueryUrl,
      method: 'GET'
    }).then((response) => {
      mediatype = 'Movie';
      moviePoster = response.Poster;
      movieTitle = response.Title;
      movieYear = response.Year;
      movieWriter = response.Writer;
      movieDirector = response.Director;
      movieCast = response.Actors;
      movieGenre = response.Genre;

      displaySelectedMovie();
      console.log(moviePoster);
      console.log(response);
    });
  } else if (typeOfMedia === 'Game') {
    const detailQueryUrl = 'https://api.rawg.io/api/games/' + id + '?key=7dd64f0797d74fb0981b46bc46e59163';
    $.ajax({
      url: detailQueryUrl,
      method: 'GET'
    }).then((response) => {
      let genreBuilder = '';
      let devBuilder = '';
      gamePoster = response.background_image;
      gameTitle = response.name;
      gameYear = response.released.substring(0, 4);
      // add loops for these two
      for (let i = 0; i < response.genres.length; i++) {
        if (i === response.genres.length - 1) {
          genreBuilder += response.genres[i].name;
        } else {
          genreBuilder += response.genres[i].name + ', ';
        }
      }
      for (let i = 0; i < response.developers.length; i++) {
        if (i === response.developers.length - 1) {
          devBuilder += response.developers[i].name;
        } else {
          devBuilder += response.developers[i].name + ', ';
        }
      }
      gameGenre = genreBuilder;
      gameDeveloper = devBuilder;

      displaySelectedGame();
      console.log(gamePoster);
      console.log(response);
    });
  }
};

const displaySelectedMovie = function () {
  // $('#search-results').empty();
  $('#findMedia').addClass('hidden');
  $('#inputDiv').removeClass('hidden');
  $('#selectedMedia').html(movieTitle);
  $('#selectedPoster').attr('src', moviePoster);
};

const displaySelectedGame = function () {
  // $('#search-results').empty();
  $('#findMedia').addClass('hidden');
  $('#inputDiv').removeClass('hidden');
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

const handleFormSubmit = function (event) {
  event.preventDefault();

  if (typeOfMedia === 'Movie') {
    example = {
      mediaType: 'Movie',
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
  } else if (typeOfMedia === 'Game') {
    example = {
      mediaType: 'Video Game',
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
  }
};

const handleDeleteBtnClick = function () {
  const idToDelete = $(this).parent().attr('data-id');

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

$searchBtn.on('click', findMedia);

$submitBtn.on('click', handleFormSubmit);
$exampleList.on('click', '.delete', handleDeleteBtnClick);

$(document).on('click', '.selectedMovieButton', function (event) {
  getMediaDetails(event.target.value);
});

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
// not sure if it adds stuff to db
