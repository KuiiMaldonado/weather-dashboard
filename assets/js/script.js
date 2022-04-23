const API_URL = 'https://api.openweathermap.org/';
const searchCity = document.getElementById('search_city');
const searchHistoryElement = document.getElementById('search_history');
const actualCityElement = document.getElementById('actual_city');
const cityForecastElement = document.getElementById('city_forecast');

var city = { };
var searchHistory = [];

function renderSearchHistory() {

    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

    if (searchHistory !== null) {

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

    if (city.name !== undefined) {

        let date = new Date(city.date * 1000);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let iconURL = 'http://openweathermap.org/img/w/' + city.icon +'.png'

        header.innerHTML = city.name + ' (' + day + '/' + month + '/' + year + ') <span><img src="' + iconURL + '" id="icon"></span>'
        temp.textContent = 'Temp: ' + city.temp + ' °C';
        wind.textContent = 'Wind: ' + city.wind + ' Km/h';
        humidity.textContent = 'Humidity: ' + city.humidity + '%'
        if (city.uvi <= 2)
            uvi.innerHTML = 'UV Index: <span id="uv-index" class="low-uv"> '+ city.uvi + '</span>'
        else if (city.uvi > 2 && city.uvi <= 5)
            uvi.innerHTML = 'UV Index: <span id="uv-index" class="moderate-uv"> '+ city.uvi + '</span>'
        else if (city.uvi > 5) {
            uvi.innerHTML = 'UV Index: <span id="uv-index" class="high-uv"> '+ city.uvi + '</span>'
        }
    }
    else {
        header.innerHTML = 'No city selected'
        temp.textContent = 'Temp: ---';
        wind.textContent = 'Wind: ---';
        humidity.textContent = 'Humidity: ---';
        uvi.textContent = 'UV Index: ---'
    }

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

function renderCityForecast() {

    if (city.name !== undefined) {

        city.forecast.forEach(function (element) {

            let div = document.createElement('div');
            let div2 = document.createElement('div');
            let header = document.createElement('h5');
            let img = document.createElement('img');
            let temp = document.createElement('p');
            let wind = document.createElement('p');
            let humidity = document.createElement('p');

            let date = new Date(element.dt * 1000);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let iconURL = 'http://openweathermap.org/img/w/' + element.weather[0].icon +'.png'

            div.classList.add('col');
            div.classList.add('border');
            div.classList.add('border-dark');
            div.classList.add('forecast');
            div.classList.add('ms-1');

            cityForecastElement.appendChild(div);
            div.appendChild(div2);

            header.textContent = day + '/' + month + '/' + year;
            temp.textContent = 'Temp: ' + element.temp.day + ' °C';
            wind.textContent = 'Wind: ' + element.wind_speed + ' Km/h';
            humidity.textContent = 'Humidity: ' + element.humidity + '%';

            img.setAttribute('src', iconURL);

            div2.appendChild(header);
            div2.appendChild(img);
            div2.appendChild(temp);
            div2.appendChild(wind);
            div2.appendChild(humidity);
        });
    }
}

function cleanCityForecast() {

    let forecast = document.querySelectorAll('.forecast');

    forecast.forEach(function (element) {
        element.remove();
    });

    renderCityForecast();
}

function initialRender() {

    renderSearchHistory();
    city = JSON.parse(localStorage.getItem('results'));
    if (city === null)
        city = {};

    renderActualCity();
    renderCityForecast();
}

function getCityCoordinates(searchCityText) {

    let requestURL = API_URL + 'geo/1.0/direct?q=' + searchCityText + '&limit=5&appid=' + API_KEY;
    fetch(requestURL).then(function (response){
        return response.json();
    }).then(function (data) {
        if(data.length > 0) {
            saveSearchHistory(searchCityText);
            cleanSearchHistory();
            city.name = data[0].name;
            city.latitude = data[0].lat;
            city.longitude = data[0].lon;
            getCityWeather();
        }
        else {
            alert('No city found. Please, try again.');
        }
    });
}

function getCityWeather() {

    let requestURL = API_URL + 'data/2.5/onecall?lat=' + city.latitude + '&lon=' + city.longitude + '&units=metric' + '&appid=' + API_KEY;
    fetch(requestURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        city.date = data.current.dt;
        city.temp = data.current.temp;
        city.humidity = data.current.humidity;
        city.wind = data.current.wind_speed;
        city.uvi = data.current.uvi;
        city.icon = data.current.weather[0].icon;

        city.forecast = []
        for (let i = 1; i < 6; i++) {
            city.forecast.push(data.daily[i]);
        }

        saveResults();
        cleanActualCity();
        cleanCityForecast();
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

        let isPop = checkSearchHistoryDuplicates(savedHistory,cityName);
        if(savedHistory.length < 8) {
            savedHistory.unshift(cityName);
        }
        else {
            savedHistory.unshift(cityName);
            if (!isPop)
                savedHistory.pop();
        }
        localStorage.setItem('searchHistory', JSON.stringify(savedHistory));
    }
}

function checkSearchHistoryDuplicates(savedHistory, cityName) {

    let index = savedHistory.indexOf(cityName);
    if (index !== -1) {
        savedHistory.splice(index, 1);
        return true;
    }
    return false;
}

function saveResults() {

    localStorage.setItem('results', JSON.stringify(city));
}

function clickHandler(event) {

    if (event.target.id == 'search_form') {

        let searchCityText = document.getElementById('search_city').value;
        if (searchCityText !== '') {
            getCityCoordinates(searchCityText);
            searchCity.value = '';
        }
        else {
            alert('Search city field can\'t be empty');
        }
    }
    else if (event.target.classList.contains('btn')) {

        getCityCoordinates(event.target.textContent);
    }
}

searchHistoryElement.addEventListener('click', clickHandler);
initialRender();