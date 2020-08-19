// maybe local storage to keep history list
// declaring variables to access the HTML
const $city = $('.city');
const $temp = $('.temp');
const $humidity = $('.humidity');
const $wind = $('.wind');
const $UV = $('.UV');
const $icon = $('.icon');
const currentTime = moment().format('l');
const $fiveday = $('.bottom');
const $list = $('.list-group')
// initiallizing variables globally that I will need in other functions
var lat;
var lon;
const APIKey = "166a433c57516f51dfab1f7edaed8413";
// funtion used to display current weather conditions onto page
setCities();
function displayCurrent() {
    // take user city
    var userCity = $('.input').val();
    saveInput();
    // query API based on user city
    var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + userCity + "&appid=" + APIKey;
    // make API request for icon, city name, temp, humidity, and wind
    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function(response) {
        $('.current').addClass('main');
        // add icon
        $icon.attr('src', 'https://openweathermap.org/img/wn/'+ response.weather[0].icon + '@2x.png')
        // add user city and the current date from moments library
        $city.text(response.name + ' ' + "(" + currentTime + ")");
        // add temperature
        $temp.text("Temperature: " + response.main.temp+ ' °F');
        // add humidiy
        $humidity.text("Humidity: " + response.main.humidity + '%');
        // add wind speed
        $wind.text("Wind speed: " + response.wind.speed + " MPH"); 
        // set lat and lon values taken from this api call to use in another api call  
        lat = response.coord.lat;
        lon = response.coord.lon;
        var queryURL2 = 'https://api.openweathermap.org/data/2.5/uvi?appid='+ APIKey +'&lat='+ lat +'&lon='+ lon;
    // make api request for uv value
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response) {
        // add uv value and give it a color based on severity of value   
        $UV.text("UV index: " + response.value);
        if (response.value < 6) {
            $UV.css({
                'color': 'green',
            });
        }
        if (response.value<11 && response.value> 6) {
            $UV.css({
                'color': 'orange',
            });
        }
        if (response.value>11) {
            $UV.css({
                'color': 'red',
            });
        }
        // invoking next function inside this one to ensure first function finishes
        // running before this one begins
        display5day();
        // clear input text box
        $('.input').val('');
    });
});        
}
// function used to display 5 day forecast onto page
function display5day() {
    // clear container
    $fiveday.text('')
    var queryURL3 = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    // make api request for 5 day forecast
    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function(response) {
    // for loop dynamically adding forecasts one day at a time
    for (let i = 1; i<6; i++) {
        // create a div
        var $newdiv = $('<div>')
        // add date
        var $newp1 = $('<p>')
        $newp1.text(moment().add(i, 'days').format('l'))
        $newdiv.append($newp1)
        // add icon
        var $newimg = $('<img>')
        $newimg.attr("src", 'https://openweathermap.org/img/wn/'+ response.daily[i].weather[0].icon + '@2x.png')
        $newdiv.append($newimg)
        // add temp
        var $newp3 = $('<p>')
        $newp3.text('Temp: ' + response.daily[i].temp.day + ' °F');
        $newdiv.append($newp3)
        // add humidity
        var $newp4 = $('<p>')
        $newp4.text('Humidity: ' + response.daily[i].humidity + '%');
        $newdiv.append($newp4)
        $newdiv.css({
            'background-color': 'lightblue',
            'margin': '10px'
        })
        // add div to fiveday container
        $fiveday.append($newdiv)
    }
});
}
function saveInput(event) {
    //event.preventDefault();
    var userCity = $('.input').val();
    // initialize variable to store array
    var cityArray;
    // set variable to array from local storage if one exists, else set to empty array
    if (localStorage.getItem("cities")) {
        cityArray = JSON.parse(localStorage.getItem("cities"));
    } else {
        cityArray = [];
    }
    for (let i=0; i < cityArray.length;i++) { 
        if (userCity === cityArray[i].city) {
            return;
        }
    }
    //store time and value in an obj
    let newObj = {'city': userCity}
    //push obj to array
    cityArray.push(newObj)
    //set item
    localStorage.setItem('cities', JSON.stringify(cityArray));
    //reload page
}
function setCities() {
    if (localStorage.getItem('cities')){
        const arr = JSON.parse(localStorage.getItem('cities'))
        for (let i=0; i < arr.length;i++) {
            var historybtn = $('<button>')
            historybtn.addClass(`list-group-item list-group-item-action`)
            historybtn.attr('type', 'button')
            historybtn.text(arr[i].city)
            $list.prepend(historybtn)
        }
        $('.input').val(arr[0].city)
        displayCurrent()
    }
}
$(document).on("click", ".btn", function(event) {
    // dispay weather conditions when search button is clicked
    displayCurrent();
    // add user city to a list group that contains users search history
    var userCity = $('.input').val();
    var historybtn = $('<button>')
        historybtn.addClass(`list-group-item list-group-item-action`)
        historybtn.attr('type', 'button')
        historybtn.text(userCity)
        $list.prepend(historybtn)
});
$(document).on('click', '.list-group',function(event) {
    // when an item from search history is clicked, grab text value
    const value = $(event.target).closest('.list-group-item').text();
    // set input text box to targeted city name
    $('.input').val(value);
    // display weather conditions
    displayCurrent();
});