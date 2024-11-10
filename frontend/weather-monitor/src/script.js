const cityInput=document.querySelector(".city-input");
const searchButton=document.querySelector(".search.btn");
const weatherCardsDiv=document.querySelector(".weather-cards");
const currentWeatherDiv=document.querySelector(".current-weather");
const locationButton=document.querySelector(".location-btn");
const API_KEY="f614beb3883d3c749d24656bc16816be";
const createWeatherCard=(cityName,weatherItem,index)=>{
    if(index===0){
return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature : ${(weatherItem.main.temp-273.15).toFixed(2)}</h4>
                    <h4>Temperature : ${weatherItem.wind.speed}</h4>
                    <h4>Temperature : ${weatherItem.main.humidity}</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon"/>                    
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }
    else{
    return `<li class="card">
                    <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon"/>
                    <h4>Temperature : ${(weatherItem.main.temp-273.15).toFixed(2)}</h4>
                    <h4>Temperature : ${weatherItem.wind.speed}</h4>
                    <h4>Temperature : ${weatherItem.main.humidity}</h4>
                        
                        </li>`;
}
}
const getWeatherDetails = (cityName,lat,lon)=>{
    const weather_url=`http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(weather_url).then(res=>res.json()).then(data=>{
      
        const uniqueForeCastDays=[];
        const fiveDaysForeCast=data.list.filter(forecast=>{
            const forecastDate=new Date(forecast.dt_txt).getDate();
            if(!uniqueForeCastDays.includes(forecastDate)){
                return uniqueForeCastDays.push(forecastDate);
            }
        });

        cityInput.value="";
        weatherCardsDiv.innerHTML="";
        currentWeatherDiv.innerHTML="";

        console.log(fiveDaysForeCast);
        fiveDaysForeCast.forEach((weatherItem,index)=>{
            if(index===0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));

            }
            else{
            weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
            //createWeatherCard(weatherItem);
            }
        });
    }).catch(()=>{
        alert("error");
    });
}


const getCityCoordinates=()=>{
    const cityName=cityInput.value.trim();
    if(!cityName)return;
    console.log(cityName);
    const api_url=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(api_url).then(res=>res.json()).then(data=>{
        if(!data.length)return alert(`No coordinates`);
        const{name,lat,lon}=data[0];
        getWeatherDetails(name,lat,lon);

        console.log(data);
    }).catch(()=>{
        alert("Error");
    });
}
const getUserCoordinates=()=>{
    navigator.geolocation.getCurrentPosition(
        position=>{
           const {latitude,longitude}=position.coords;
           const REVERSE_GEO_URL=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
           fetch(REVERSE_GEO_URL).then(res=>res.json()).then(data=>{
            if(!data.length)return alert(`No coordinates`);
            const{name}=data[0];
            getWeatherDetails(name,latitude,longitude);
    
            console.log(data);
        }).catch(()=>{
            alert("Error");
        });
        },
        error=>{
            //console.log(error);
            if(error.code===error.PERMISSION_DENIED){
                alert("RESET");
            }
        }
    )
}
searchButton.addEventListener("click",getCityCoordinates);
locationButton.addEventListener("click",getUserCoordinates);