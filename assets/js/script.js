let searchHistory = [];
const geocodingApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const weatherApiKey = '1e3e2e65dadaaf2f700e6a237b8ee977';

const searchInput = document.querySelector('#cityInput');
const searchBtn = document.querySelector('#searchBtn');
const searchHistoryContainer = document.querySelector('#searchHistoryContainer');
const forecastContainer = document.querySelector('#forecast');
const currentWeatherContainer = document.querySelector('#currentWeather');

function renderSearchHistory() {
    searchHistoryContainer.innerHTML = '';

    for (let i = searchHistory.length - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.classList.add('history-btn', 'btn', 'btn-secondary', 'm-1');
        btn.textContent = searchHistory[i];
        btn.addEventListener('click', () => searchCity(searchHistory[i]));
        searchHistoryContainer.appendChild(btn);
    }
}

function appendToHistory(search) {
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
}




function searchCity(city) {
    let weatherIcon;
    fetch(`${weatherApiUrl}?q=${city}&appid=${weatherApiKey}&units=imperial`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const cityName = data.city.name;
            const temperature = data.list[0].main.temp;
            const weatherDescription = data.list[0].weather[0].description;
            const humidity = data.list[0].main.humidity;
            const windSpeed = data.list[0].wind.speed;
            weatherIcon = data.list[0].weather[0].icon;
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextFiveDaysData = data.list.filter(item => {
            const itemDate = new Date(item.dt * 1000);
            const fiveDaysFromNow = new Date();
            fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
                
                return itemDate > tomorrow && itemDate <= fiveDaysFromNow;
            });
            

            currentWeatherContainer.innerHTML = `
                <h2>${cityName}<img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}"></h2> 
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>Temperature: ${temperature}°F</p>
                <p>Weather: ${weatherDescription}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} Mph</p>
                
                
            `;

            currentWeatherContainer.style.backgroundColor = '#54B4D3';
            currentWeatherContainer.style.color = '#333';
            
            forecastContainer.innerHTML = '';
            let counter = 0;
            let nextDate = new Date(tomorrow);

            nextFiveDaysData.forEach(day => {
                if (counter < 5) {
                const date = nextDate.toLocaleDateString();
                const temperature = day.main.temp;
                const weatherDescription = day.weather[0].description;
                const humidity = day.main.humidity;
                const windSpeed = day.wind.speed;
                const weatherIcon = day.weather[0].icon;

                forecastContainer.innerHTML += `
                    <div class="forecast-day">
                        <p>Date: ${date}</p>
                        <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}">
                        <p>Temperature: ${temperature}°F</p>
                        <p>Weather: ${weatherDescription}</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Wind Speed: ${windSpeed} Mph</p>
                    </div>
                `;

                nextDate.setDate(nextDate.getDate() + 1);
                counter++; 
            }
            });

            forecastContainer.style.backgroundColor = '#54B4D3'; 
            forecastContainer.style.color = '#333'; 

            if (currentWeatherContainer.innerHTML.trim() !== '') {
                currentWeatherContainer.classList.add('border', 'border-dark');
            } else {
                currentWeatherContainer.classList.remove('border', 'border-dark');
            }

            if (forecastContainer.innerHTML.trim() !== '') {
                forecastContainer.classList.add('border', 'border-dark');
            } else {
                forecastContainer.classList.remove('border', 'border-dark');
            }
            
            
            appendToHistory(cityName);
        })
        .catch(error => {
            console.error('There was a problem fetching the weather data:', error);
        });
}

searchBtn.addEventListener('click', () => {
    searchCityAndClearInput();
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCityAndClearInput();
    }
});

function searchCityAndClearInput() {
    const city = searchInput.value.trim();
    if (city) {
        searchCity(city);
        searchInput.value = "";
    }
}

function initSearchHistory() {
    const storedSearchHistory = localStorage.getItem('search-history');
    if (storedSearchHistory) {
        searchHistory = JSON.parse(storedSearchHistory);
        renderSearchHistory();
    }
}


initSearchHistory();


