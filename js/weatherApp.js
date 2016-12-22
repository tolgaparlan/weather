$(document).ready(function() {          
    weatherDisplay();
});

//get the user location and put in a suitable format for the API
var weatherDisplay = function(){
    var coordinates = "";
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            coordinates += position.coords.latitude+',';
            coordinates += position.coords.longitude;
            dataGrab(coordinates);
        });
    }        
}; 

//get the weather data from the API
var dataGrab = function(loc){
    var time = Math.floor(Date.now()/1000); //not a typo. this returns a unix timestamp
    console.log(time);
    var unit = "si"; //add option to switch to fahrenheit
    var url = "https://api.darksky.net/forecast/9b7da12d061643778caa8aff7c3b85cf/" + loc + ","+time+"?callback=?&units="+unit+"&exclude=flags,hourly";
    $.getJSON(url,function(data){
        dataPlacement(data,loc);
    });
}

//place the weather data into HTML elements
var dataPlacement = function(data,loc){
    console.log(data);
    //main weather event
    $("#weather").text(data["currently"]["summary"]);
    
    //do the same for the descriptions
    $("#weather-description").text(data["daily"]["data"][0]["summary"]);
    
    //temperatures
    $("#temperature-current").text("Temp: " + Math.floor(data["currently"]["temperature"]));
    $("#temperature-maxmin").text("Temp max/min: " + Math.floor(data["daily"]["data"][0]["temperatureMax"]) + "/" + Math.floor(data["daily"]["data"][0]["temperatureMin"]));    
    
    //the address 
    getAddress(loc);
    
    //wind speed
    $("#wind").text("Wind Speed: "+data["currently"]["windSpeed"]);
}

//get the address from the google maps API
var getAddress = function(loc){
    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="+loc+"&result_type=political&key=AIzaSyBsD60C9sqevu_5EXhyl_bCphqoGLBO8do",function(data){
        setAddress(data);
    });
}
var setAddress = function(address){    
    //place the address data
    $("#address").text(address["results"][0]["formatted_address"]);
}

