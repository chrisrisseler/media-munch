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

const findMovie = function () {
  $.ajax({
    url: 'https://www.omdbapi.com/?s=batman&filter_sort_order=asc&apikey=c2a157c7',
    method: 'GET'
  }).then((response) => {
    console.log(response);
  });
};

findMovie();

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

  const example = {
    title: $exampleTitle.val().trim(),
    year: $exampleYear.val().trim(),
    author: $exampleAuthor.val().trim(),
    director: $exampleDirector.val().trim(),
    cast: $exampleCast.val().trim(),
    genre: $exampleGenre.val().trim(),
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
