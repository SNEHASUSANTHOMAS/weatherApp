let API_KEY = "f6a6380cc8fbade7eea6eb13be18f488";

let weatherApp = {
    apiUrl: "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + API_KEY + "&q=",
    data: {},

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
    apiUrlCoord: "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + API_KEY,

    getWeatherByCoords: async function (lat, lon) {
        try {
            const url = `${this.apiUrlCoord}&lat=${lat}&lon=${lon}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to get location-based weather");
            }

            this.data = await response.json();

            // Update DOM elements
            this.city.innerText = this.data.name;
            this.temp.innerText = Math.round(this.data.main.temp) + "°C";
            this.humidity.innerText = this.data.main.humidity + "%";
            this.windSpeed.innerText = this.data.wind.speed + " kmph";

            // Set weather icon
            let iconCode = this.data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            this.weatherIcon.src = iconUrl;
            this.weatherIcon.alt = this.data.weather[0].description;

            // Make weather section visible
            this.weatherData.classList.remove("hidden");
            this.weatherData.classList.add("flex", "justify-center", "items-center");
            this.details.classList.remove("hidden");

        } catch (error) {
            console.error("Geolocation fetch error:", error.message);
        }
    },


    // Fetch and display weather
    searchWeather: async function (location) {
        try {
            const response = await fetch(this.apiUrl + location);
            if (!response.ok) {
                throw new Error("City not found");
            }

            this.data = await response.json();

            // Update DOM elements
            this.city.innerText = this.data.name;
            this.temp.innerText = Math.round(this.data.main.temp) + "°C";
            this.humidity.innerText = this.data.main.humidity + "%";
            this.windSpeed.innerText = this.data.wind.speed + " kmph";

            // Set weather icon
            let iconCode = this.data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            this.weatherIcon.src = iconUrl;
            this.weatherIcon.alt = this.data.weather[0].description;

            // Make weather section visible
            this.weatherData.classList.remove("hidden");
            this.weatherData.classList.add("flex", "justify-center", "items-center");
            this.details.classList.remove("hidden");

        } catch (error) {
            console.error("Problem fetching weather:", error.message);
        }
    }
};

// Handle form submission instead of button click directly
let form = document.getElementById("weatherForm");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    let location = weatherApp.locationInput.value;
    if (location) {
        weatherApp.searchWeather(location);
        weatherApp.locationInput.value = ""; // Clear input after search
    }
});
let currentLocationBtn = document.getElementById("currentLocationBtn");

currentLocationBtn.addEventListener("click", function () {
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

