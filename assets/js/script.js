var savedCities = [];
var city = "San Diego";

// use api data to display info about today's weather in the main card
function displayToday(data) {
  weatherIcon =
    "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";

  $("#dayInfo").children().empty();

  $("#dayInfo")
    .children(".nameDateWeather")
    .html(city + moment.unix(data.current.dt).format(" (M/DD/YYYY) "));

    // create the image of the weather icon and append it to the main "today" item
  var img = $('<img id="weather">');
  img.attr("src", weatherIcon);
  img.attr("title", data.current.weather[0].description);
  img.attr("alt", data.current.weather[0].description);
  img.appendTo($("#dayInfo").children(".nameDateWeather"));

  $("#dayInfo")
    .children(".temp")
    .html("Temp: " + data.current.temp + "&deg;F");
  $("#dayInfo")
    .children(".wind")
    .html("Wind: " + data.current.wind_speed + " MPH");
  $("#dayInfo")
    .children(".humid")
    .html("Humidity: " + data.current.humidity + " &percnt;");

    // for the uv background, we add the general stuff and then add a colored span based on uv severity
  $("#dayInfo").children(".uvi").html("UV Index: ");

  var uvi = data.current.uvi;
  if (uvi < 3) {
    spanFontColor = "text-white";
    spanBackColor = "#157e51";
  } else if (uvi < 6) {
    spanFontColor = "text-dark";
    spanBackColor = "yellow";
  } else if (uvi < 8) {
    spanFontColor = "text-dark";
    spanBackColor = "orange";
  } else if (uvi < 11) {
    spanFontColor = "text-dark";
    spanBackColor = "red";
  } else {
    spanFontColor = "text-white";
    spanBackColor = "purple";
  }
  $("#dayInfo")
    .children(".uvi")
    .append(
      `<span class="rounded ${spanFontColor} py-1 px-3 uvi-span" style="background-color:${spanBackColor};">${uvi}</span>`
    );
}

// display forecast infor in 5 forecast cards (very similar to displayToday)
function displayForecast(data) {
  for (let index = 0; index < 5; index++) {
    weatherIcon =
      "https://openweathermap.org/img/wn/" +
      data.daily[index].weather[0].icon +
      ".png";
    $(`.fore${index + 1}`)
      .children()
      .empty();

    $(`.fore${index + 1}`)
      .children(".date")
      .html(moment.unix(data.daily[index].dt).format("M/DD/YYYY"));

    var img = $('<img id="weather">');
    img.attr("src", weatherIcon);
    img.attr("title", data.daily[index].weather[0].description);
    img.attr("alt", data.daily[index].weather[0].description);
    img.addClass("py-0");
    img.appendTo($(`.fore${index + 1}`).children(".weather"));

    $(`.fore${index + 1}`)
      .children(".temp")
      .html("Temp: " + data.daily[index].temp.day + "&deg;F");
    $(`.fore${index + 1}`)
      .children(".wind")
      .html("Wind: " + data.daily[index].wind_speed + " MPH");
    $(`.fore${index + 1}`)
      .children(".humid")
      .html("Humidity: " + data.daily[index].humidity + " &percnt;");
    $(`.fore${index + 1}`)
      .children(".uvi")
      .html("UV Index: " + data.daily[index].uvi);
  }
}

function getInfo() {
  var locDataURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=1a14ca5cc491853ccfe45f332ddb1ec2";
  $.ajax({
    url: locDataURL,
  }).then(function (data) {
    var lat = data[0].lat;
    var lon = data[0].lon;

    $.ajax({
      url: (weatherURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=1a14ca5cc491853ccfe45f332ddb1ec2"),
    }).then(function (data) {
      displayToday(data);
      displayForecast(data);
    });
  });
}

// display the buttons representing cities from previous searches
function displayPreviousSearches() {
  var prevButtonDiv = $("#previousSearches");
  prevButtonDiv.empty();
  if (savedCities.length !== 0) {
    for (let index = 0; index < savedCities.length; index++) {
      prevButtonDiv.append(
        `<button type="button" class="list-group-item list-group-item-action mt-3 mb-2 rounded text-center prevButton" style="background-color:lightgray">${savedCities[index]}</button>`
      );
    }
    // get the button in a clickable state
    $(document).ready(function () {
      $(".prevButton").click(function () {
        city = $(this).html();
        getInfo();
      });
    });
  }
}

// display search data on search
$("#searchButton").click(function () {
  city = $("#citySearch").val();
//   make sure there's something in the search bar and then add the city to storage
  if (city != null) {
    if (!savedCities.includes(city)) {
      savedCities.push(city);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
    }
    // update saved search section
    displayPreviousSearches();
    getInfo();
  }
});

// on page load, put local storage data into an array for easier access
if (localStorage.length !== 0) {
  for (let index = 0; index < localStorage.length; index++) {
    savedCities = JSON.parse(localStorage.getItem("savedCities"));
    // make the default display on load a little more relevant by using the last search item
    city = savedCities[savedCities.length - 1];
  }
}

// on page load, display the default city info and any saved searches
getInfo();
displayPreviousSearches();
