formatArticle = data => {
  console.log(data);
  let container = $("<div>").addClass("");
  let container2 = $("<div>").addClass("card mb-4 shadow-sm");
  let textcontainer = $("<div>").addClass("card-body");
  let text = $("<p>").addClass("card-text").text(data.title)
  let url = $("<a>").addClass("card-text").text(data.link).attr("href", data.link);
  let commentDiv = $("<div>").addClass("d-flex justify-content-between align-items-center");
  let buttonDiv = $("<div>").addClass("btn-group");
  let commentBtn = $("<button>").addClass("comment-btn btn btn-sm btn-outline-secondary").text("Comment").attr("data-id", data._id);
  buttonDiv.append(commentBtn);
  commentDiv.append(buttonDiv);
  textcontainer.append(text)
  textcontainer.append(url);
  textcontainer.append(commentDiv);
  container2.append(textcontainer);
  container.append(container2);
  return container;
}

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    let thing = formatArticle(data[i]);
    $("#articles").append(thing);
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".comment-btn", function () {
  // Empty the notes from the note section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h5>" + data.title + "</h5>");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  let bodyData = $("#bodyinput").val();
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from note textarea
        body: bodyData
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
});