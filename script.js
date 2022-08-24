const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoText = inputPart.querySelector(".info-text"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    //if user pressed enter button and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value)
    }
});

locationBtn.addEventListener("click", () => {
    if(navigator.geolocation){ //if browser supports geolocation
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else{
        alert("Your browser does not support geolocation");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords; //getting lat and long of user devicefrom coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=d3453a7d4b2156cc2adfb16c459075e3`;
    fetchData();
}

function onError(error){
    infoText.innerText = error.message;
    infoText.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d3453a7d4b2156cc2adfb16c459075e3`;
    fetchData();
}

function fetchData(){
    infoText.innerText = "Getting weather details...";
    infoText.classList.add("pending");
    //Getting api response and returning it with parsing into js object and in another
    //then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoText.classList.replace("pending","error");
        infoText.innerText = `${inputField.value} isn't a valid city name`;
    }
    else{
        //let's get required properties value from info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        //Using custom icons according to the id returned by api
        if(id == 800){
            wIcon.src = "Weather Icons/clear.svg";
        }
        else if(id >= 200 && id <= 232){
            wIcon.src = "Weather Icons/storm.svg";
        }
        else if(id >= 600 && id <= 622){
            wIcon.src = "Weather Icons/snow.svg";
        }
        else if(id >= 701 && id <= 781){
            wIcon.src = "Weather Icons/haze.svg";
        }
        else if(id >= 801 && id <= 804){
            wIcon.src = "Weather Icons/cloud.svg";
        }
        else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "Weather Icons/rain.svg";
        }

        //let's pass these values to a particular html element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoText.classList.remove("pending","error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});