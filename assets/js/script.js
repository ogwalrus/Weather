var form = document.querySelector('form');
var cityInput = document.querySelector('#city-search');
var currentWeather = document.querySelector('#current-weather');
var forecast = document.querySelector('#forecast');
var searchHistory = document.querySelector('#search-history');
var dateElement = document.querySelector('#date');
var weatherIcon = document.querySelector('#weather-icon');

form.addEventListener('submit', event => {
  event.preventDefault();

  // Get the city name from the form input
  var city = cityInput.value;

  // Get current weather data for the city
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d7e152a5453fb10df19e8fb8e4c26412`)
    .then(response => response.json())
    .then(data => {
      var date = new Date(data.dt * 1000);
      var dateString = date.toLocaleDateString();

      // Update the page with current weather data
      document.querySelector('#city-name').innerText = data.name;
      dateElement.innerText = dateString;
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.querySelector('#temperature').innerText = data.main.temp;
      document.querySelector('#humidity').innerText = data.main.humidity;
      document.querySelector('#wind-speed').innerText = data.wind.speed;
      getForecast(city);
    });

  // Get 5-day forecast data for the city
  var apiKey = 'd7e152a5453fb10df19e8fb8e4c26412';

  function getForecast(city) {
    forecast.innerHTML = '';
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        // Loop through the forecast data and update the page
        data.list.filter((forecastData, index, arr) => {
          return new Date(forecastData.dt_txt).toDateString() !== new Date(arr[index - 1]?.dt_txt).toDateString();
        }).forEach(forecastData => {
      
            // Get the date and time of the forecast
            var dateTime = forecastData.dt_txt;
            // Get the temperature and weather condition
            var temperature = forecastData.main.temp + '°C';
            var condition = forecastData.weather[0].main;
            var humidity = forecastData.main.humidity + '%';
            var windSpeed = forecastData.wind.speed + ' m/s';
            var forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');
            forecastDay.innerHTML = `
                <p>Date: ${dateTime}</p>
                <img src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" alt="Weather Icon">
                <p>Temperature: ${temperature}</p>
                <p>Condition: ${condition}</p>
                <p>Humidity: ${humidity}</p>
                <p>Wind Speed: ${windSpeed}</p>
            `;
            forecast.appendChild(forecastDay);
        });
    })
    .catch(error => {
        console.log("Error fetching data", error);
    });
}
const cityListItem = document.createElement('li');
cityListItem.innerText = city;
searchHistory.appendChild(cityListItem);
var deleteButton = document.createElement("button");
deleteButton.innerHTML = "x";
cityListItem.appendChild(deleteButton);
deleteButton.addEventListener("click", function() {
  searchHistory.removeChild(cityListItem);
});

});


