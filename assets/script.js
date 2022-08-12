$(document).ready(function() {
    var enterCity = document.querySelector("#enter-city");
    var searchEl = document.querySelector("#search-button");
    var nameEl = document.querySelector("#city-name");
    var apiKey = "e208b3449c277794b81b4e8ae9b967d0";
    // var cityName = "";
    var todayweatherEl = document.querySelector("#today-weather");
    var tempEl = document.querySelector("#temperature");
    var currentPic = document.querySelector("#current-pic");
    var windEl = document.querySelector("#wind-speed");
    var humidityEl = document.querySelector("#humidity");
    var currentUv = document.querySelector("#UV-index");
    var clearHistoryButton = document.querySelector("#clear-history")
    var historySearch = JSON.parse(localStorage.getItem("search")) || [];
    var historyCity = document.querySelector("#history");
    var forecastEl = document.querySelector("#forecast-header");
    // var forecastContainerEl = document.querySelector("#five-day-container")
    
    
    var currentDate = moment().format("MM/DD/YY");
            console.log(currentDate);
    
    
    var cityWeather = function(cityName) {
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric" + "&appid=" + apiKey;
        // console.log(cityWeather);
    
        fetch(apiUrl)
        // console.log(apiUrl)
        .then(function(response) {
            return response.json();
        })
    
        .then(function(data) {
            console.log(data);
    
            // remove class list
            todayweatherEl.classList.remove("d-none");
            todayweatherEl.classList = ("list-item flex-row justify-space-between align-center");
            // from data display info
            nameEl.innerHTML = data.name + " " + "(" + currentDate + ")";
            tempEl.innerHTML = "Temp: " + data.main.temp + "\u00B0C";
            var weatherPic = data.weather[0].icon;
            currentPic.src = "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png";
            currentPic.alt = data.weather[0].description;
            windEl.innerHTML = "Wind speed: " + data.wind.speed + " m/s";
            humidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
    
            // get UV index
            var lat = data.coord.lat;
            var lon = data.coord.lon;
    
            var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            fetch(uvUrl)
            // console.log(uvUrl);
            .then(function(response) {
                // to make response an object
                return response.json();
            })
    
                .then(function(data) {
                    // make an element for UV index value
                    var uvIndex = document.createElement("span");
    
                    // if uvi 1-2; low; green color
                    if (data.current.uvi <= 2) {
                        uvIndex.setAttribute("class", "badge badge-pill badge-success");
                    }
                    // if uvi 3-7; warning; yellow color
                    else if (data.current.uvi <= 7) {
                        uvIndex.setAttribute("class", "badge badge-pill badge-warning");
                    }
                    // if uvi more than 8; high; red color
                    else  {
                        uvIndex.setAttribute("class", "badge badge-pill badge-danger")
                    }
                    // make the vale of uv index
                    uvIndex.innerHTML = data.current.uvi;
                    currentUv.innerHTML = "UV Index: ";
                    currentUv.append(uvIndex);
                });
                
                    // 5-fay forecast
            // var cityId = data.weather[0].id;
            var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric" +"&exclude=minutely,hourly,alerts" + "&appid=" + apiKey;
    
            forecastEl.classList.remove("d-none");
    
            fetch(forecastUrl)
            // console.log(forecastUrl);
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
    
                var fiveForecastEl = document.querySelectorAll(".forecast");
             
                
                for (var i = 0; i < fiveForecastEl.length; i++) {
                    fiveForecastEl[i].innerHTML = "";
                
                var forecastDate = moment(data.daily[i].dt*1000);
                
                var getDate = forecastDate.format("MM/DD/YY");
            
                var forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-2 mb-1 forecast-date text-center font-weight-bolder font-size-15");
                
                forecastDateEl.innerHTML = getDate;
                fiveForecastEl[i].append(forecastDateEl);
        
    
                // weather icon
                var forecastWeather = document.createElement("img");
                forecastWeather.src = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
                forecastWeather.alt = data.daily[i].weather[0].description;
                forecastWeather.setAttribute("class", "ml-3");
                fiveForecastEl[i].append(forecastWeather);
    
                var forecastTemp = document.createElement("p");
                forecastTemp.innerHTML = "Temp: " + data.daily[i].temp.max + "\u00B0C";
                fiveForecastEl[i].append(forecastTemp);
    
                var forecastWind = document.createElement("p");
                forecastWind.innerHTML = "Wind speed: " + data.daily[i].wind_speed + " m/s";
                forecastWind.setAttribute("class", "text-align-justify");
                fiveForecastEl[i].append(forecastWind);
    
                var forecaseHumidity = document.createElement("p");
                forecaseHumidity.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
                fiveForecastEl[i].append(forecaseHumidity);
    
                // forecastContainerEl.appendChild(fiveForecastEl);
                };
            });
        });
    };
           
        // click event function for search button
        searchEl.addEventListener("click", function() {
            var searchCity = enterCity.value; 
            cityWeather(searchCity);
            
            // push to add city to the container(historyCity input)
            historySearch.push(searchCity);
            // makes the localStorage an object
            localStorage.setItem("search", JSON.stringify(historySearch));
            // function get history to list all searched cities
            getHistory();
        });
    
        function getHistory() {
            historyCity.innerHTML = "";
            for (var i = 0; i < historySearch.length; i++) {
                var listHistory = document.createElement("input");
                listHistory.setAttribute("type", "text");
                listHistory.setAttribute("readonly", true);
                listHistory.setAttribute("class", "form-control d-block bg-light");
                listHistory.setAttribute("value", historySearch[i]);
                listHistory.addEventListener("click", function() {
                    cityWeather(listHistory.value);
                })
                historyCity.append(listHistory);
            };
        };
    
        getHistory();
        if (historySearch.length > 0) {
            cityWeather(historySearch[historySearch.length-1]);
        };
    
    
        // remove history from local storage when clear button is clicked
        clearHistoryButton.addEventListener("click", function() {
            localStorage.clear();
            historySearch = [];
            getHistory();
        })
    
        
    });
    