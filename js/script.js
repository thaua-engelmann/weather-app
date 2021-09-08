// Required elements;
const weatherBox = document.querySelector('.weather-box');
const weatherInput = document.querySelector('.weather-input');
const weatherAPI = document.querySelector('.weather-api');

const inputField = weatherInput.querySelector('input');
const checkWeatherBtn = weatherInput.querySelector('.check-weather');
const getLocationBtn = document.querySelector('.get-location');
const degs = document.querySelectorAll('.deg')

const getLocationError = document.querySelector('.get-location-error');
const invalidCityError = document.querySelector('.invalid-city-error');

const weatherIcon = document.querySelector('.weather-api img');

const arrowBack = document.querySelector('.header-text i');

let api;

inputField.addEventListener('keyup', (e) => {
    // If user have pressed ENTER key on keyboard & input value not empty;
    if (e.key === "Enter" && inputField.value !== '') {
        requestApi(inputField.value);
    }
})

checkWeatherBtn.addEventListener('click', () => {
    // If user have clicked on Check Button & input value not empty;
    if (inputField.value !== '') {
        requestApi(inputField.value);
    }
})

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) { // If browser support geolocation API;
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation API");
    }
})

function onSuccess(position) {
    const {latitude, longitude} = position.coords; // Getting latitude and longitude from device using coords object;

    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=b05ec584b24b621261f8cd7601f322f4`;
    fetchData();

    getLocationError.classList.add('hide');
}

function onError() {
    getLocationError.classList.add('show');
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b05ec584b24b621261f8cd7601f322f4`;
    fetchData();
}

function fetchData() {
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod == '404') {
        invalidCityError.classList.remove('hide');
        invalidCityError.classList.add('show');
        invalidCityError.innerHTML = `<i class="fas fa-times-circle"></i><span>${inputField.value}</span> ins't a valid city name`;

    } else {
        invalidCityError.classList.add('hide');
        weatherBox.classList.add('active');

        // Getting required properties value from info object;
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, temp, humidity} = info.main;

        if (id >= 200 && id <= 232) {
            weatherIcon.src = '../icons/storm.svg';
        } else if (id >= 300 && id <= 321 || id >= 500 && id <= 531) {
            weatherIcon.src = '../icons/rain.svg';
        } else if (id >= 600 && id <= 622) {
            weatherIcon.src = '../icons/snow.svg';
        } else if (id >= 701 && id <= 781) {
            weatherIcon.src = '../icons/haze.svg';
        } else if (id === 800) {
            weatherIcon.src = '../icons/clear.svg';
        } else if (id >= 801 && id <= 804) {
            weatherIcon.src = '../icons/cloud.svg';
        }
        
        // Passing these values to html format;
        weatherAPI.querySelector('.location span').innerHTML = `${city}, ${country}`;
        weatherAPI.querySelector('.temperature .numb').innerHTML = temp.toFixed(1);
        weatherAPI.querySelector('.weather-status').innerHTML = description;
        weatherAPI.querySelector('.feels .numb').innerHTML = feels_like.toFixed(1);
        weatherAPI.querySelector('.humidity .numb').innerHTML = `${humidity}%`;

        // Converter to Fahrenheit;
        const fahrenheitBtn = document.querySelector('button.fahrenheit');
        const celsiusBtn = document.querySelector('button.celsius');

        fahrenheitBtn.addEventListener('click', () => {
            let fahTemp = (9 * temp / 5) + 32;
            let fahFeels = (9 * feels_like / 5) + 32;
            weatherAPI.querySelector('.temperature .numb').innerHTML = fahTemp.toFixed(1);
            weatherAPI.querySelector('.feels .numb').innerHTML = fahFeels.toFixed(1);

            degs.forEach(deg => {
                deg.innerHTML = "°F";
            })
        })

        celsiusBtn.addEventListener('click', () => {
            weatherAPI.querySelector('.temperature .numb').innerHTML = temp.toFixed(1);
            weatherAPI.querySelector('.feels .numb').innerHTML = feels_like.toFixed(1);

            degs.forEach(deg => {
                deg.innerHTML = "°C";
            })
        })
    }
}

arrowBack.addEventListener('click', () => {
    weatherBox.classList.remove('active');
});

function converter(value) {
    let result = (9 * value / 5) + 32;

    console.log(result);
}