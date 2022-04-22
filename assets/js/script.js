const API_URL = 'https://api.openweathermap.org/';
const searchForm = document.getElementById('search_form');
const searchCity = document.getElementById('search_city');
const searchHistoryElement = document.getElementById('search_history');
const actualCityElement = document.getElementById('actual_city');

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

function renderActualCity() {

    let header = document.createElement('h3');
    let temp = document.createElement('p');
    let wind = document.createElement('p');
    let humidity = document.createElement('p');
    let uvi = document.createElement('p');

    header.textContent = city.name;
    temp.textContent = 'Temp: ' + city.temp + ' °C';
    wind.textContent = 'Wind: ' + city.wind + 'Km/h';
    humidity.textContent = 'Humidity: ' + city.humidity + '%'
    uvi.textContent = 'UV Index: ' + city.uvi;

    header.classList.add('results');
    temp.classList.add('results');
    wind.classList.add('results');
    humidity.classList.add('results');
    uvi.classList.add('results');

    actualCityElement.appendChild(header);
    actualCityElement.appendChild(temp);
    actualCityElement.appendChild(wind);
    actualCityElement.appendChild(humidity);
    actualCityElement.appendChild(uvi);

}

function cleanActualCity() {

    let results = document.querySelectorAll('.results');

    results.forEach(function (element) {
        element.remove();
    });

    renderActualCity();
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
        // console.log(data);
        city.temp = data.current.temp;
        city.humidity = data.current.humidity;
        city.wind = data.current.wind_speed;
        city.uvi = data.current.uvi;
        city.icon = data.current.weather[0].icon;

        city.forecast = []
        for (let i = 1; i < 6; i++) {
            city.forecast.push(data.daily[i]);
        }

        cleanActualCity();
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