document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANT: In a real production application,
    // you should never expose your API key directly in client-side JavaScript.
    // Instead, you'd make this API call from a secure backend server.
    const API_KEY = '33e48ccf910fec398daabbf84ecdc831'; // Your API Key
    const CITY = 'Kigali';
    const COUNTRY_CODE = 'RW'; // Rwanda
    const UNITS = 'metric'; // For Celsius

    // Get references to HTML elements
    const locationNameElement = document.getElementById('location-name');
    const temperatureElement = document.getElementById('temperature');
    const feelsLikeElement = document.getElementById('feels-like');
    const conditionElement = document.getElementById('condition');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');
    const pressureElement = document.getElementById('pressure');
    const temperatureAdomElement = document.getElementById('temperature-adom');
    const lastUpdatedElement = document.getElementById('last-updated');
    const skyElement = document.getElementById('sky'); // NEW: Get reference to the sky div

    // Function to convert Celsius to Adom
    const celsiusToAdom = (celsius) => {
        return (8 / 25) * celsius + 15;
    };

    const fetchWeatherData = async () => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}&units=${UNITS}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data); // Log the full data for inspection

            // Update HTML elements with weather data
            locationNameElement.textContent = `${data.name}, ${data.sys.country}`;
            temperatureElement.textContent = `${data.main.temp}°C`;
            feelsLikeElement.textContent = `${data.main.feels_like}°C`;
            humidityElement.textContent = `${data.main.humidity}%`;
            windSpeedElement.textContent = `${data.wind.speed} m/s`;
            pressureElement.textContent = `${data.main.pressure} hPa`;

            // --- NEW: Update Sky Background and Condition Text ---
            const weatherMain = data.weather[0].main; // e.g., "Clouds", "Clear", "Rain"
            const weatherDescription = data.weather[0].description; // e.g., "broken clouds"

            conditionElement.textContent = weatherDescription; // Display the detailed description

            // Remove any existing sky classes
            skyElement.className = '';
            let weatherClass = 'sky-default'; // Default fallback class

            // Determine which sky class to apply based on weatherMain
            switch (weatherMain) {
                case 'Clear':
                    weatherClass = 'sky-clear';
                    break;
                case 'Clouds':
                    weatherClass = 'sky-clouds';
                    break;
                case 'Rain':
                    weatherClass = 'sky-rain';
                    break;
                case 'Drizzle':
                    weatherClass = 'sky-drizzle';
                    break;
                case 'Thunderstorm':
                    weatherClass = 'sky-thunderstorm';
                    break;
                case 'Snow':
                    weatherClass = 'sky-snow';
                    break;
                case 'Mist':
                case 'Smoke':
                case 'Haze':
                case 'Dust':
                case 'Fog':
                case 'Sand':
                case 'Ash':
                case 'Squall':
                case 'Tornado':
                    weatherClass = 'sky-atmosphere'; // Group all atmospheric conditions
                    break;
                default:
                    weatherClass = 'sky-default'; // Fallback for unknown conditions
            }
            skyElement.classList.add(weatherClass); // Add the appropriate class to the sky div
            // --- END NEW ---

            // Convert and display in Adom
            const currentTempCelsius = data.main.temp;
            const currentTempAdom = celsiusToAdom(currentTempCelsius);
            temperatureAdomElement.textContent = currentTempAdom.toFixed(2); // Display with 2 decimal places

            // Update last updated time
            const now = new Date();
            lastUpdatedElement.textContent = now.toLocaleTimeString();

        } catch (error) {
            console.error('Error fetching weather data:', error);
            locationNameElement.textContent = 'Could not load weather data.';
            temperatureElement.textContent = '--';
            feelsLikeElement.textContent = '--';
            conditionElement.textContent = 'Error';
            humidityElement.textContent = '--';
            windSpeedElement.textContent = '--';
            pressureElement.textContent = '--';
            temperatureAdomElement.textContent = '--';
            lastUpdatedElement.textContent = 'Failed to update';
        }
    };

    // Fetch weather data when the page loads
    fetchWeatherData();

    // Optionally, refresh weather data every 5 minutes (300000 milliseconds)
    setInterval(fetchWeatherData, 300000); // 300000 milliseconds = 5 minutes
});