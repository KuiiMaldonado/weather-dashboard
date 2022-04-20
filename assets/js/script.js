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

    let requestURL = API_URL + 'data/2.5/onecall?lat=' + city.latitude + '&lon=' + city.longitude + '&units=metric' + '&appid=' + API_KEY;
    fetch(requestURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        city.temp = data.current.temp;
        city.humidity = data.current.humidity;
        city.wind = data.current.wind_speed;
        city.uvi = data.current.uvi;
    });
}

// function getCityForecast() {
//
//     let requestURL = API_URL + 'data/2.5/forecast?lat=' + city.latitude + '&lon=' + city.longitude + '&units=metric' + '&appid=' + API_KEY;
//     fetch(requestURL).then(function (response) {
//         return response.json();
//     }).then(function (data) {
//         console.log(data);
//     });
// }


function submitHandler(event) {

    event.preventDefault();
    let searchCityText = document.getElementById('search_city').value;
    getCityCoordinates(searchCityText);
}

search_form.addEventListener('submit', submitHandler);