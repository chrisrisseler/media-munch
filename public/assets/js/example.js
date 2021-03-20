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
// const $selectMovieClicker = $('#result-select-0');

let example = {};
let movieTitle;
let movieYear;
let movieWriter;
let movieDirector;
let movieCast;
let movieGenre;
let moviePoster;

const displayOptions = function (response) {
  $('#search-results').empty(); // plug in the html of the unordered list of movies
  $('#findMovie').removeClass('invisible');
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
const displaySelected = function () {
  $('#search-results').empty();
  $('#findMovie').addClass('hidden');
  $('#inputDiv').removeClass('hidden');
  getMovieDetails(this.value);
};

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

    console.log(moviePoster);
    console.log(response);
  });
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

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
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

$(document).on('click', '.selectedMovieButton', displaySelected);
// $selectMovieClicker.on('click', displaySelected);
