const API_URL = 'https://api.openweathermap.org/';
const search_form = document.getElementById('search_form');

var city = { };

function getCityCoordinates(searchCityText) {

    let requestURL = API_URL + 'geo/1.0/direct?q=' + searchCityText + '&limit=5&appid=' + API_KEY;
    fetch(requestURL).then(function (response){
        return response.json();
    }).then(function (data) {
        city.name = data[0].name;
        city.latitude = data[0].lat;
        city.longitude = data[0].lon;
        getCityWeather();
    });
}

function getCityWeather() {

    let requestURL = API_URL + 'data/2.5/weather?lat=' + city.latitude + '&lon=' + city.longitude + '&units=metric' + '&appid=' + API_KEY;
    fetch(requestURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        city.temp = data.main.temp;
        city.humidity = data.main.humidity;
        city.wind = data.wind.speed;
        getCityUVIndex();
    });
}

function getCityUVIndex() {

    let requestURL = API_URL + 'data/2.5/onecall?lat=' + city.latitude + '&lon=' + city.longitude + '&units=metric' +
        '&exclude=minutely,hourly,daily,alerts&appid=' + API_KEY;
    fetch(requestURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        city.uvi = data.current.uvi;
        getCityForecast();
    });
}

function getCityForecast() {

    let requestURL = API_URL + 'data/2.5/forecast?lat=' + city.latitude + '&lon=' + city.longitude + '&units=metric' + '&appid=' + API_KEY;
    fetch(requestURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
    });
}


function submitHandler(event) {

    event.preventDefault();
    let searchCityText = document.getElementById('search_city').value;
    getCityCoordinates(searchCityText);
}

search_form.addEventListener('submit', submitHandler);