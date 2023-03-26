const timeEl = document.getElementById('time');
const locationEl = document.getElementById('location');
const dateEl = document.getElementById('date');
const iconEl = document.getElementById('icon');
const weatherItemsTodayEl = document.getElementById('weather-description-today');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const descriptionEl = document.getElementById('description');
const avgMinMaxTemp = document.getElementById('avg-max-min-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const API_KEY = 'aeb465719972f94f7e53238716a0ca80';

const weather = {
    longitude: 0,
    latitude: 0,
    temperature : {
        value : 18,
        min: 0,
        max: 0,
        unit : "celcius"
    },
    humidity : {
        value : 100,
        unit : "%"
    },
    pressure: 0, 
    windSpeed : {
        value : 40,
        unit : "meter per second"
    },
    sun : {
        rise: 11,
        set: 1
    },
    description : "Clear Sky",
    iconID : "",
    city : "Jaipur",
    country : "INDIA"
};

var todayDAY = '';

setInterval(() => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HourFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HourFormat < 10? '0'+hoursIn12HourFormat : hoursIn12HourFormat) + ':' + (minutes < 10? '0'+minutes:minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ' ' + months[month] + ' ' + date + ', ' + year;

    todayDAY= days[day];

}), 1000;




function getCurrentWeather() {
    var inputCity = document.getElementById('getCityInput').value;
    const KELVIN = 273;
 
    let api = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity +"&appid=aeb465719972f94f7e53238716a0ca80";

    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.longitude = data.coord.lon;
        weather.latitude = data.coord.lat;
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        console.log(weather.description);
        weather.humidity.value = data.main.humidity;
        weather.pressure = data.main.pressure;
        weather.windSpeed.value = data.wind.speed;
        weather.iconID = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
        weather.sun.rise = data.sys.sunrise;
        weather.sun.set = data.sys.sunset;
    })
    .then(function(){
        displayWeather();
    })
}

function displayWeather() {
    var iconurl = "http://openweathermap.org/img/w/" + weather.iconID + ".png";
    iconEl.innerHTML = `<img src="${iconurl}" style="height:150px">`;
    descriptionEl.innerHTML = weather.description;
    weatherItemsTodayEl.innerHTML = `<div class="weather-item">
        <div>Humidity</div>
        <div>${weather.humidity.value}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${weather.pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${weather.windSpeed.value} m/s</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(weather.sun.rise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(weather.sun.set * 1000).format('HH:mm a')}</div>
    </div>`

    callnextapi();
}

function callnextapi() {
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${weather.latitude}&lon=${weather.longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`;

    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        displayFutureForecast(data);
    })
}

function displayFutureForecast(data) {
    let otherDayForecast = '';
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
                <div class="diff">
                    <div class="day">${todayDAY}</div>
                    <div class="temp">Night: ${day.temp.night}&#176;C</div>
                    <div class="temp">Day: ${day.temp.day}&#176;C</div>
                </div>`;
            avgMinMaxTemp.innerHTML = `<div class="avg-temp" id="avg-temp">
                ${weather.temperature.value}&#176;C
            </div>
            <div class="max-min">
                <span id="max-temp">${day.temp.day}&#176;C</span>
                <span>/</span>
                <span id="min-temp">${day.temp.night}&#176;C</span>
            </div>`;
        } else {
            otherDayForecast += `<div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">Night: ${day.temp.night}&#176;C</div>
                <div class="temp">Day: ${day.temp.day}&#176;C</div>
            </div>`;
        }
    })
    weatherForecastEl.innerHTML = otherDayForecast;
}