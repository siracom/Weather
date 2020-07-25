const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/weather.html");
});

app.post("/weatherReport", function (req, res) {
  var cityName = req.body.cityName;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=metric&appid=eb103abd9ec93c602555746f0f4d9226";
  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const weatherIconUrl =
        "http://openweathermap.org/img/wn/" +
        weatherData.weather[0].icon +
        "@2x.png";
      res.write(
        '<head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous"></head>'+
        "<body style='text-align: center; padding:7% 0%; background-color: #ade498'><h1>Current Weather in " +
          weatherData.name +
          " </h1><h2>Overview : " +
          weatherData.weather[0].description +
          " </h2><p>Temperature : " +
          weatherData.main.temp +
          " deg Celcius </p><p>Humidity : " +
          weatherData.main.humidity +
          "% </p><p>Winds : " +
          (weatherData.wind.speed * 18) / 5 +
          " km/hr at " +
          weatherData.wind.deg +
          " deg </p><br><img src='" +
          weatherIconUrl +
          "' alt = 'current-weather-picture'>"+
          "<form action='/' method='get'><button type='submit' class='btn btn-success'>Search Again</button></form>"+
          "</body>"
      );
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server started at port 3000");
});
