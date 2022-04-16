const API_URL = 'https://api.openweathermap.org/';
const search_form = document.getElementById('search_form');

function getCityCoordinates(city) {

    let requestURL = API_URL + 'geo/1.0/direct?q=' + city + '&limit=5&appid=' + API_KEY;
    fetch(requestURL).then(function (response){
        return response.json();
    }).then(function (data) {
        console.log(data[0].name);
        console.log(data[0].lat);
        console.log(data[0].lon);
    });
}

function submitHandler(event) {

    event.preventDefault();
    let city = document.getElementById('search_city').value;
    getCityCoordinates(city);
}

search_form.addEventListener('submit', submitHandler);