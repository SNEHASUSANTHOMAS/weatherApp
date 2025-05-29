let API_KEY = "f6a6380cc8fbade7eea6eb13be18f488";

let weatherApp = {
    apiUrl: "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + API_KEY + "&q=",
    data: {},

    city: document.getElementById("city"),
    temp: document.getElementById("temp"),
    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("wind"),
    locationInput: document.getElementById("locationInput"),
    searchBtn: document.getElementById("searchBtn"),
    weatherIcon: document.getElementById("weatherIcon"),
    weatherData: document.getElementById("weatherData"),
    details: document.getElementById("details"),
    card: document.getElementById("weatherCard"),
    container: document.getElementById("weatherContainer"),

    searchWeather: async function(location) {
        try {
            const response = await fetch(this.apiUrl + location);
            if (!response.ok) {
                throw new Error("City not found");
            }

            this.data = await response.json();
            this.city.innerText = this.data.name;
            this.temp.innerText = Math.round(this.data.main.temp) + "°C";
            this.humidity.innerText = this.data.main.humidity + "%";
            this.windSpeed.innerText = this.data.wind.speed + " kmph";

            let iconCode = this.data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            this.weatherIcon.src = iconUrl;
            this.weatherIcon.alt = this.data.weather[0].description;

            // Show sections
            this.weatherData.style.display = "block";
            this.details.style.display = "block";

        } catch (error) {
            console.error("Problem fetching weather:", error.message);
        }
    }
};

// Attach event listener to the search button
weatherApp.searchBtn.addEventListener("click", function () {
    let location = weatherApp.locationInput.value;
    if (location) {
        weatherApp.searchWeather(location);
        weatherApp.locationInput.value = "";
    }
});
