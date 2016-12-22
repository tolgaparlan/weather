$(document).ready(function() {    
    weatherDisplay();
});

//get the user location and put in a suitable format for the API
var weatherDisplay = function(){
    $.getJSON('https://ipinfo.io', function(data){
        dataGrab(data["loc"],data["city"]+"/"+data["region"]+"/"+data["country"]); //acquire the weather data for the given location
    })         
}; 

//get the weather data from the API
var dataGrab = function(loc,address){
    var time = Math.floor(Date.now()/1000); //returns a unix timestamp
    console.log(time);
    var unit = "si"; //add option to switch to fahrenheit
    var url = "https://api.darksky.net/forecast/9b7da12d061643778caa8aff7c3b85cf/" + loc + ","+time+"?callback=?&units="+unit+"&exclude=flags,hourly";
    $.getJSON(url,function(data){
        dataPlacement(data,loc,address);
    });
}

//place the weather data into HTML elements
var dataPlacement = function(data,loc,address){
    console.log(data);
    //main weather event
    $("#weather").text(data["currently"]["summary"]);
    
    //do the same for the descriptions
    $("#weather-description").text(data["daily"]["data"][0]["summary"]);
    
    //temperatures
    $("#temperature-current").text("Temp: " + Math.floor(data["currently"]["temperature"]));
    $("#temperature-maxmin").text("Temp max/min: " + Math.floor(data["daily"]["data"][0]["temperatureMax"]) + "/" + Math.floor(data["daily"]["data"][0]["temperatureMin"]));    
    
    //the address 
    $("#address").text(address);
    
    //wind speed
    $("#wind").text("Wind Speed: "+data["currently"]["windSpeed"]);
}