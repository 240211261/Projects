// ---------- Search Elements ----------
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("query");

// ---------- City & Current Weather ----------
const cityName = document.getElementById("city-name");
const currentTemp = document.getElementById("current-temp");
const currentCondition = document.getElementById("current-condition");

const sunriseValue = document.getElementById("sunrise-value");
const sunsetValue = document.getElementById("sunset-value");

// ---------- Other Details ----------
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("current-humidity");
const windSpeed = document.getElementById("current-wind");
const precipitation = document.getElementById("current-precipitation");

// ---------- Weekday Forecast ----------
const monIcon = document.getElementById("mon-icon");
const tueIcon = document.getElementById("tue-icon");
const wedIcon = document.getElementById("wed-icon");
const thuIcon = document.getElementById("thu-icon");
const friIcon = document.getElementById("fri-icon");
const satIcon = document.getElementById("sat-icon");
const sunIcon = document.getElementById("sun-icon");


//--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= ignore just for debuging ;)
// console.log({
//   searchForm,
//   searchInput,
//   cityName,
//   currentTemp,
//   currentCondition,
//   sunriseValue,
//   sunsetValue,
//   feelsLike,
//   humidity,
//   windSpeed,
//   precipitation,
//   monIcon,
//   tueIcon,
//   wedIcon,
//   thuIcon,
//   friIcon,
//   satIcon,
//   sunIcon
// });

//-==-=-==--------------=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        getWeatherByCity(query);
    }
});


// Auto-detect location
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation is not supported by your browser.");
    }

    function success(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        fetchWeather(lat, lon);
        fetchCity(lat, lon);
    }

    function error() {
        alert("Unable to retrieve your location.");
    }
}

// Search by city name
function getWeatherByCity(cityName) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;

    fetch(geoUrl)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                let lat = data.results[0].latitude;
                let lon = data.results[0].longitude;
                fetchWeather(lat, lon);

                cityName.textContent = data.results[0].name;
            }
            else {
                alert("City not found!");
            }
        })
        .catch(err => console.error("Error fetching city:", err));
}

getCurrentLocationWeather();


function fetchCity(lat, lon) {
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                console.log("Detected City:", data.results[0].name);
                cityName.textContent = data.results[0].name;
            }

        })
        .catch(err => console.error("Error fetching city:", err));
}


function getWeatherIcon(code) {
    if ([0].includes(code)) return "weather-sunny.svg";
    if ([1, 2].includes(code)) return "weather-partly-cloudy.svg";
    if ([3].includes(code)) return "weather-cloudy.svg";
    if ([45, 48].includes(code)) return "weather-fog.svg";
    if ([51, 61, 80].includes(code)) return "weather-rain.svg";
    if ([63, 65, 81, 82].includes(code)) return "weather-heavy-rain.svg";
    if ([71, 73, 75].includes(code)) return "weather-snow.svg";
    if ([95, 96, 99].includes(code)) return "weather-thunder.svg";

    return "weather-unknown.svg";
}

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,relative_humidity_2m&daily=weathercode,sunrise,sunset&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    // --- Current weather ---
    currentTemp.textContent = `${data.current.temperature_2m}°C`;
    currentCondition.textContent = `Humidity: ${data.current.relative_humidity_2m}%`;
    feelsLike.textContent = `${data.current.apparent_temperature}°C`;
    humidity.textContent = `${data.current.relative_humidity_2m}%`;
    windSpeed.textContent = `${data.current.wind_speed_10m} km/h`;
    precipitation.textContent = `${data.current.precipitation} mm`;
    sunriseValue.textContent = new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunsetValue.textContent = new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // cityName.textContent = data.results[0].name;   // not working 

    // Week forecast 
    const weekIcons = [monIcon, tueIcon, wedIcon, thuIcon, friIcon, satIcon, sunIcon];
    data.daily.weathercode.forEach((code, index) => {
        if (weekIcons[index]) {
            weekIcons[index].src = getWeatherIcon(code);
        }
    });
}



