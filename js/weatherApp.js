$(document).ready(function() {          
    weatherDisplay();
});

//get the user location and put in a suitable format for the API
var weatherDisplay = function(){
    var coordinates = "";
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            coordinates += "lat="+position.coords.latitude;
            coordinates += "&lon="+position.coords.longitude;
            dataGrab(coordinates);
        });
    }        
}; 

//get the weather data from the API
var dataGrab = function(loc){
    var url = "http://api.openweathermap.org/data/2.5/weather?" + loc + "&appid=76d306923f93e462d87c1a1d0c9b6ec6&units=metric";
    $("#weatherID").text(url);
    $.getJSON(url,function(data){
        dataPlacement(data);
    });
}

//place the weather data into HTML elements
var dataPlacement = function(data){
    var keys = Object.keys(data);
    console.log(data);
    
    //get all major weather events from the weather array and add them to HTML
    var dataHold = "";//one variable to hold them all, and bind them in the HTMl
    for(var i=0;i<data["weather"].length;i++){
        dataHold += data["weather"][i]["main"] + " / "; 
    }
    $("#weather").text(dataHold);
    
    //do the same for the descriptions
    dataHold = "";
    for(var i=0;i<data["weather"].length;i++){
        dataHold += data["weather"][i]["description"] + " / "; 
    }
    $("#weather-description").text(dataHold);
    
    //temperatures
    $("#temperature-current").text("Temp: " + data["main"]["temp"]);
    $("#temperature-maxmin").text("Temp max/min: " + data["main"]["temp_max"] + "/" + data["main"]["temp_min"]);
    
    
    //place the address data
    $("#address").text(data["name"]+ "/"+data["sys"]["country"]);
    //wind speed
    $("#wind").text("Wind: "+data["wind"]["speed"]);
}



