let API_KEY = "f6a6380cc8fbade7eea6eb13be18f488";

let weatherApp = {
    // API endpoint for fetching weather by city name
    apiUrl: "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + API_KEY + "&q=",
    
    data: {}, // Holds fetched weather data

    // DOM references
    city: document.getElementById("city"),
    temp: document.getElementById("temp"),
    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("wind"),
    locationInput: document.getElementById("locationInput"),
    weatherIcon: document.getElementById("weatherIcon"),
    weatherData: document.getElementById("weatherData"),
    details: document.getElementById("details"),
    card: document.getElementById("weatherCard"),
    container: document.getElementById("weatherContainer"),

    // API URL for geolocation-based weather
    apiUrlCoord: "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + API_KEY,

    // Fetch weather data using user's latitude and longitude
    getWeatherByCoords: async function (lat, lon) {
        try {
            const url = `${this.apiUrlCoord}&lat=${lat}&lon=${lon}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to get location-based weather");
            }

            this.data = await response.json();

            // Update UI with weather info
            this.city.innerText = this.data.name;
            this.temp.innerText = Math.round(this.data.main.temp) + "°C";
            this.humidity.innerText = this.data.main.humidity + "%";
            this.windSpeed.innerText = this.data.wind.speed + " kmph";

            // Set appropriate weather icon
            let iconCode = this.data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            this.weatherIcon.src = iconUrl;
            this.weatherIcon.alt = this.data.weather[0].description;
            // Fetch forecast using city name from API
            this.getFiveDayForecast(this.data.name);

            // Display weather section
            this.weatherData.classList.remove("hidden");
            this.weatherData.classList.add("flex", "justify-center", "items-center");
            this.details.classList.remove("hidden");

        } catch (error) {
            console.error("Geolocation fetch error:", error.message);
        }
    },

    // Fetch and display weather for a searched city
    searchWeather: async function (location) {
        try {
            const response = await fetch(this.apiUrl + location);
            if (!response.ok) {
                throw new Error("City not found");
            }

            this.data = await response.json();

            // Update UI with weather data
            this.city.innerText = this.data.name;
            this.temp.innerText = Math.round(this.data.main.temp) + "°C";
            this.humidity.innerText = this.data.main.humidity + "%";
            this.windSpeed.innerText = this.data.wind.speed + " kmph";

            // Update weather icon
            let iconCode = this.data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            this.weatherIcon.src = iconUrl;
            this.weatherIcon.alt = this.data.weather[0].description;

            // Show the weather section
            this.weatherData.classList.remove("hidden");
            this.weatherData.classList.add("flex", "flex-col", "justify-center", "items-center");

            // Save to recent search history
            this.saveRecentSearch(this.data.name);

            // Load forecast data
            this.getFiveDayForecast(this.data.name);

            // Reveal weather details section
            this.details.classList.remove("hidden");

        } catch (error) {
            console.error("Problem fetching weather:", error.message);
        }
    },

    // --- Recent Searches Feature ---

    recentSearchKey: "recentCities", // Key for localStorage
    dropdown: document.getElementById("recentDropdown"),
    recentList: document.getElementById("recentList"),
    toggleBtn: document.getElementById("toggleDropdownBtn"),

    // Save new city to recent search list in localStorage
    saveRecentSearch: function(city) {
        let recent = JSON.parse(localStorage.getItem(this.recentSearchKey)) || [];
        recent = recent.filter(item => item.toLowerCase() !== city.toLowerCase()); // Avoid duplicates
        recent.unshift(city); // Add new city to top
        if (recent.length > 5) recent.pop(); // Limit to 5 cities
        localStorage.setItem(this.recentSearchKey, JSON.stringify(recent));
    },

    // Load saved cities into the recent dropdown
    loadRecentSearches: function() {
        this.recentList.innerHTML = ""; // Clear list first
        let recent = JSON.parse(localStorage.getItem(this.recentSearchKey)) || [];

        // Create clickable list items for each city
        recent.forEach(city => {
            let li = document.createElement("li");
            li.textContent = city;
            li.className = "cursor-pointer px-4 py-2 hover:bg-gray-100";
            li.addEventListener("click", () => {
                this.searchWeather(city);
                this.dropdown.classList.add("hidden");
            });
            this.recentList.appendChild(li);
        });

        // Toggle visibility of dropdown
        this.dropdown.classList.toggle("hidden");
    },

    // Fetch 5-day forecast (filtered to 12 PM data)
    getFiveDayForecast: async function (city) {
        try {
            let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
            const response = await fetch(forecastUrl);
            if (!response.ok) throw new Error("Forecast fetch failed");

            const forecastData = await response.json();

            // Get one data point per day (at 12:00 PM)
            let dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

            // Render forecast cards
            this.renderForecast(dailyData);

        } catch (error) {
            console.error("Forecast error:", error.message);
        }
    },

    // Render forecast cards dynamically into the DOM
    renderForecast: function (dailyData) {
        let forecastContainer = document.getElementById("forecastContainer");
        forecastContainer.innerHTML = ""; // Clear any previous forecast cards

        dailyData.forEach(item => {
            let date = new Date(item.dt_txt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric"
            });

            let icon = item.weather[0].icon;
            let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            let card = document.createElement("div");
            card.className = "flex flex-col items-center p-4 border border-gray-300 text-gray-800 rounded-lg bg-gradient-to-r from-indigo-80 to-blue-100 shadow-md w-32";

            card.innerHTML = `
                <div class="font-semibold">${date}</div>
                <img src="${iconUrl}" alt="${item.weather[0].description}" class="w-12 h-12" />
                <div class="text-sm">🌡️ ${Math.round(item.main.temp)}°C</div>
                <div class="text-sm">💧 ${item.main.humidity}%</div>
                <div class="text-sm">💨 ${item.wind.speed} kmph</div>
            `;

            forecastContainer.appendChild(card);
        });
    },
};

// Handle search form submission (Enter key or search button)
let form = document.getElementById("weatherForm");
form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from reloading the page

    let location = weatherApp.locationInput.value;
    if (location) {
        weatherApp.searchWeather(location);
        weatherApp.locationInput.value = ""; // Clear input after search
    }
});

// Handle "Current Location" button click
let currentLocationBtn = document.getElementById("currentLocationBtn");
currentLocationBtn.addEventListener("click", function () {
    let weatherData=document.getElementById("weatherData")
    weatherData.classList.add("flex", "flex-col", "justify-center", "items-center");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                weatherApp.getWeatherByCoords(lat, lon);
            },
            error => {
                alert("Location access denied or unavailable.");
            }
        );
    } else {
        alert("Geolocation not supported by this browser.");
    }
});

// Toggle recent searches dropdown on icon/button click
weatherApp.toggleBtn.addEventListener("click", function () {
    weatherApp.loadRecentSearches();
});
