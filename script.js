const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': ,
        'x-rapidapi-host': 
    }
};



// Event listener for search form
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents form from submitting traditionally
    const city = document.querySelector('.search').value.trim(); // Gets the city name from input
    if (city) {
        fetchWeather(city); // Passes the city name to fetchWeather function
    }
});

// Map Yahoo weather codes/text to icons
const iconMap = {
    'Mostly Sunny': 'weather-sunny.svg',
    'Thunderstorms': 'weather-thunder.svg',
    'Rain': 'weather-rain.svg',
    'Showers': 'weather-showers.svg',
    'Scattered Showers': 'weather-showers.svg',
    'Fair': 'weather-sunny.svg',
};

async function fetchWeather(city) {
    if (!city) {
        console.error('City is required');
        return;
    }

    const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${city}&format=json&u=f`;
    try {
        const response = await fetch(url, options);
        
        if (response.status === 429) {
            document.getElementById('current-condition').textContent = 'Too many requests. Please wait a moment and try again.';
            return;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Update current weather
        if (result.current_observation) {
            const current = result.current_observation;
            document.getElementById('current-condition').textContent = `Condition: ${current.condition.text}`;
            document.getElementById('current-temp').textContent = `Temperature: ${current.condition.temperature}°F`;
            document.getElementById('current-humidity').textContent = `Humidity: ${current.atmosphere.humidity}%`;
            document.getElementById('current-wind').textContent = `Wind: ${current.wind.speed} mph`;
            document.getElementById('current-pressure').textContent = `Pressure: ${current.atmosphere.pressure} mb`;

            // Update sunrise and sunset times
            if (current.astronomy) {
                document.getElementById('sunrise-value').textContent = current.astronomy.sunrise;
                document.getElementById('sunset-value').textContent = current.astronomy.sunset;
            }
        }

        // Update city info
        if (result.location) {
            const location = result.location;
            document.getElementById('city-name').textContent = `${location.city}, ${location.country}`;
        }

        // Update forecast icons and info
        if (Array.isArray(result.forecasts)) {
            const dayIds = ['sat-icon', 'sun-icon', 'mon-icon', 'tue-icon', 'wed-icon', 'thu-icon', 'fri-icon'];
            result.forecasts.slice(0, 7).forEach((forecast, i) => {
                const iconElem = document.getElementById(dayIds[i]);
                if (iconElem) {
                    const iconFile = iconMap[forecast.text] || 'weather-tornado-svgrepo-com.svg';
                    iconElem.src = iconFile;
                    iconElem.alt = forecast.text;
                    // Add temperature range if you have elements for it
                    const tempElem = document.getElementById(`${dayIds[i]}-temp`);
                    if (tempElem) {
                        tempElem.textContent = `${forecast.low}°F - ${forecast.high}°F`;
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('current-condition').textContent = 'Error fetching weather data';
    }
}


