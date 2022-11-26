// time and date part
function formatDateTime() {
  let date = new Date();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Thuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  document.querySelector("#day").innerHTML = days[date.getDay()];
  document.querySelector("#month").innerHTML = months[date.getMonth()];
  document.querySelector("#year").innerHTML = date.getFullYear();
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  document.querySelector("#hour").innerHTML = `${hour}:${minute}`;
}
formatDateTime();
// temperature part
let celsius = null;
let units = "metric";
let coordinates = [];
let timestamp = null;
let city = "";

function showTempreture(response) {
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#country").innerHTML = response.data.country;
  document.querySelector("#weather-description").innerHTML =
    response.data.condition.description;
  document.querySelector("#real-feel").innerHTML = Math.round(
    response.data.temperature.feels_like
  );
  document.querySelector("#icon").src = response.data.condition.icon_url;
  document.querySelector("#icon").alt = response.data.condition.icon;
  document.querySelector("#current-tempreture").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.temperature.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#pressure").innerHTML = Math.round(
    response.data.temperature.pressure
  );

  city = response.data.city;

  coordinates = response.data.coordinates;
  displayForecast(coordinates);

  timestamp = response.data.time;
  formatTimestampToDay(timestamp);
}
function search(city) {
  let apiKey = "a7c7f51a8a5abc24e0tb69o4ff6018a3";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current";
  let apiQuery = city;
  let apiUrl = `${apiEndpoint}?query=${apiQuery}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTempreture);
}
search("berlin");

function searchForCity(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#input").value;
  search(searchedCity);
}
let form = document.querySelector("#search");
form.addEventListener("submit", searchForCity);

//current position weather
function showCurrentWeather(position) {
  let apiKey = "a7c7f51a8a5abc24e0tb69o4ff6018a3";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  apiUrl = `${apiEndpoint}?lon=${lon}&lat=${lat}&key=${apiKey}`;

  axios.get(apiUrl).then(showTempreture);
}

function getCurrent() {
  navigator.geolocation.getCurrentPosition(showCurrentWeather);
}

let currentBtn = document.querySelector("#current-weather");
currentBtn.addEventListener("click", getCurrent);

// conversion part

function convertToFahrenheit(event) {
  event.preventDefault();
  units = "imperial";
  let apiKey = "a7c7f51a8a5abc24e0tb69o4ff6018a3";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current";
  let apiUrl = `${apiEndpoint}?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTempreture);
  document.querySelector("#celsius").classList.add("active");
  document.querySelector("#fahrenheit").classList.remove("active");
}

function convertToCelsius(event) {
  event.preventDefault;
  units = "metric";
  let apiKey = "a7c7f51a8a5abc24e0tb69o4ff6018a3";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current";
  let apiUrl = `${apiEndpoint}?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTempreture);
  document.querySelector("#celsius").classList.remove("active");
  document.querySelector("#fahrenheit").classList.add("active");
  axios.get(apiUrl).then(showTempreture);
}
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiuslink = document.querySelector("#celsius");
celsiuslink.addEventListener("click", convertToCelsius);

// forecast bit
function formatTimestampToDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function forecastTemplate(response) {
  let forecastDay = response.data.daily;
  let forecastHtml = document.querySelector("#forecast");
  let template = "";
  forecastDay.forEach(function (day, index) {
    if (index < 6) {
      template += `<div class="card">
    <div class="title"><h3>${formatTimestampToDay(day.time)}</h3></div>
    <div class="icon">
    <img
    src=${day.condition.icon_url}
    alt="icon"
    />
    </div>
    <div class="tempreture">
    <h3 id="max-temperature">${Math.round(day.temperature.maximum)}°</h3>
    <h3 id="min-temperature">${Math.round(day.temperature.minimum)}°</h3>
    </div>
    </div>`;
    }
  });
  forecastHtml.innerHTML = template;
}

function displayForecast(coordinates) {
  let apiKey = "a7c7f51a8a5abc24e0tb69o4ff6018a3";
  let latitude = coordinates.latitude;
  let longitude = coordinates.longitude;
  let apiEndpoint = "https://api.shecodes.io/weather/v1/forecast";
  let apiUrl = `${apiEndpoint}?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(forecastTemplate);
}
