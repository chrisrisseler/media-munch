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

let example = {};
let movieTitle;
let movieYear;
let movieWriter;
let movieDirector;
let movieCast;
let movieGenre;

const displayOptions = function (response) {
  $('').empty(); // plug in the html of the unordered list of movies
  for (let i = 0; i < response.length; i++) {
    const currentMovie = response[i];
    const currentTitle = currentMovie.Title;
    const currentYear = currentMovie.Year;
    const currentPoster = currentMovie.Poster;

    const newMovie = document.createElement('li');
    newMovie.classList += ''; // Would add any classes needed to add for styling/positioning/etc of the list item
    newMovie.id = 'movie-number' + i; // Would be the ID of each movie on the list displayed

    document.getElementById('').appendChild(newMovie); // Whatever the name of the UL on the page would go here

    // Would need classes and or ids to set up css in this.
    const currentMovieHTML =
      `
    <div>
      <h4>${currentTitle}</h4>
      <p>${currentYear}</p>
      <img src="${currentPoster}">
    </div>
    `;

    // Would add the movie div to the list item in the unordered list
    $('#' + newMovie.id).append(currentMovieHTML);
  }
};

const getID = function (response) {
  return response.imdbID;
};

const findMovie = function (search) {
  // temp search box id
  const searchTerm = $('.search-box').val();
  const searchQueryUrl = 'http://www.omdbapi.com/?apikey=f5874e7b&s=' + searchTerm;

  $.ajax({
    url: searchQueryUrl,
    method: 'GET'
  }).then((response) => {
    displayOptions(response);

    console.log(response);
  });
};

const getMovieDetails = function () {
  const detailQueryUrl = 'http://www.omdbapi.com/?apikey=f5874e7b&i=' + getID();

  $.ajax({
    url: detailQueryUrl,
    method: 'GET'
  }).then((response) => {
    movieTitle = response.Title;
    movieYear = response.Year;
    movieWriter = response.Writer;
    movieDirector = response.Director;
    movieCast = response.Actors;
    movieGenre = response.Genre;

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
