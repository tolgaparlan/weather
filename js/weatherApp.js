var unit = "ca"; //global variable forfahrenheit/si

$(document).ready(function() {  //fires when everything is properly loaded  
    weatherDisplay();     

    $("#unit-change").click(function(){//when the button is pressed
        unit = (unit=="ca" ? "us" : "ca"); 
        weatherDisplay();
    });
});

//get the user location and put in a suitable format for the API
var weatherDisplay = function(){
    roughLocation();//this should make sure even in devices that geolocation doesn't work, some close estimate will be shown
    preciseLocation(); 
}

//use google's geolocation API. More stabile but tends to be slightly off (or sometimes a lot)
var roughLocation = function(){
    $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBsD60C9sqevu_5EXhyl_bCphqoGLBO8do",function(data){
        dataGrab(data["location"]["lat"]+","+data["location"]["lng"]);
    });
}

//try to use device's geolocation for precise location. tends to fail in phones for some reason
var preciseLocation = function(){
    navigator.geolocation.getCurrentPosition(function(loc){  
        dataGrab(loc["coords"]["latitude"]+","+loc["coords"]["longitude"]); //acquire the weather data for the given location
    });   
}

//get the weather data from the API
var dataGrab = function(loc){
    var time = Math.floor(Date.now()/1000); //returns a unix timestamp
    var url = "https://api.darksky.net/forecast/9b7da12d061643778caa8aff7c3b85cf/" + loc + ","+time+"?callback=?&units="+unit+"&exclude=flags,hourly";
    $.getJSON(url,function(data){
        dataPlacement(data,loc);
    });
}

//place the weather data into HTML elements
var dataPlacement = function(data,loc){
    var tempSuffix = (unit=="ca"? "°C" : "°F");
    
    //main weather event
    $("#weather").text(data["currently"]["summary"]);
    
    //do the same for the descriptions
    $("#weather-description").text(data["daily"]["data"][0]["summary"]);
    
    //daily rain chance
    $("#rain-chance").text("Rain Chance: "+data["daily"]["data"][0]["precipProbability"]*100+"%");
    
    //temperatures
    $("#temperature-current").text(Math.floor(data["currently"]["temperature"])+tempSuffix);
    $("#temperature-maxmin").text(Math.floor(data["daily"]["data"][0]["temperatureMax"]) + tempSuffix+"/" + Math.floor(data["daily"]["data"][0]["temperatureMin"])+tempSuffix);    
    
    //the address 
    getAddress(loc);
    
    //wind speed
    $("#wind").text("Wind Speed: "+data["daily"]["data"][0]["windSpeed"]+" km/h");
    
    //icon and it's animation  
    var skycons = new Skycons({"color": "gray"});
    skycons.play();

    // you can add a canvas by it's ID...
    skycons.add("weather-icon", data["currently"]["icon"]);
    
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