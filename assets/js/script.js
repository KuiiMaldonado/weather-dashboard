const API_URL = 'https://api.openweathermap.org/';
const searchForm = document.getElementById('search_form');
const searchCity = document.getElementById('search_city');
const searchHistoryElement = document.getElementById('search_history');

var city = { };
var searchHistory = [];

function renderSearchHistory() {

    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    searchHistory.forEach(function (element) {
        let row = document.createElement('div');
        let button = document.createElement('button');

        row.classList.add('row');
        row.classList.add('mb-2');
        row.classList.add('history_button');
        searchHistoryElement.appendChild(row);

        button.textContent = element;
        button.classList.add('btn');
        button.classList.add('rounded-2');
        row.appendChild(button);
    });
}

function cleanSearchHistory() {

    let buttons = document.querySelectorAll('.history_button');

    buttons.forEach(function (element) {
        element.remove();
    });
    renderSearchHistory();
}

function getCityCoordinates(searchCityText) {

    let requestURL = API_URL + 'geo/1.0/direct?q=' + searchCityText + '&limit=5&appid=' + API_KEY;
    fetch(requestURL).then(function (response){
        return response.json();
    }).then(function (data) {
        if(data.length > 0) {
            city.name = data[0].name;
            city.latitude = data[0].lat;
            city.longitude = data[0].lon;
            getCityWeather();
        }
    });
}

function getCityWeather() {

    let requestURL = API_URL + 'data/2.5/onecall?lat=' + city.latitude + '&lon=' + city.longitude + '&units=metric' + '&appid=' + API_KEY;
    fetch(requestURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        city.temp = data.current.temp;
        city.humidity = data.current.humidity;
        city.wind = data.current.wind_speed;
        city.uvi = data.current.uvi;

        city.forecast = []
        for (let i = 1; i < 6; i++) {
            city.forecast.push(data.daily[i]);
        }
    });
}

function saveSearchHistory(cityName) {

    let savedHistory = JSON.parse(localStorage.getItem('searchHistory'));

    if (savedHistory === null) {
        let searchArray = [];
        searchArray.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchArray));
    }
    else {
        if(savedHistory.length < 8) {
            savedHistory.push(cityName);
        }
        else {
            savedHistory.unshift(cityName);
            savedHistory.pop();
        }
        localStorage.setItem('searchHistory', JSON.stringify(savedHistory));
    }
}

function submitHandler(event) {

    event.preventDefault();
    let searchCityText = document.getElementById('search_city').value;
    saveSearchHistory(searchCityText)
    getCityCoordinates(searchCityText);
    searchCity.value = ''
    cleanSearchHistory();
}

searchForm.addEventListener('submit', submitHandler);
renderSearchHistory();