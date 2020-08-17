// grab lon and lat values from first api to use for one call api
const $city = $('.city');
const $temp = $('.temp');
const $humidity = $('.humidity');
const $wind = $('.wind');
const $UV = $('.UV');
const $icon = $('.icon');
const currentTime = moment().format('l');
const $fiveday = $('.bottom');
const $list = $('.list-group')

var lat;
var lon;
const APIKey = "166a433c57516f51dfab1f7edaed8413";
function displayCurrent() {
    var userCity = $('.input').val();
    var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + userCity + "&appid=" + APIKey;
    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        $('.current').addClass('main');
        $icon.attr('src', 'http://openweathermap.org/img/wn/'+ response.weather[0].icon + '@2x.png')
        $city.text(response.name + ' ' + "(" + currentTime + ")");
        $temp.text("Temperature: " + response.main.temp+ ' °F');
        $humidity.text("Humidity: " + response.main.humidity + '%');
        $wind.text("Wind speed: " + response.wind.speed + " MPH");   
        lat = response.coord.lat;
        lon = response.coord.lon;
        var queryURL2 = 'http://api.openweathermap.org/data/2.5/uvi?appid='+ APIKey +'&lat='+ lat +'&lon='+ lon;
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response) {
        console.log(response)   
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
        display5day();
        $('.input').val('');
    });
});        
}
function display5day() {
    $fiveday.text('')
    
    var queryURL3 = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function(response) {
    console.log(response)
    for (let i = 1; i<6; i++) {
        var $newdiv = $('<div>')
        // add date
        var $newp1 = $('<p>')
        $newp1.text(moment().add(i, 'days').format('l'))
        $newdiv.append($newp1)
        // add icon
        var $newimg = $('<img>')
        $newimg.attr("src", 'http://openweathermap.org/img/wn/'+ response.daily[i].weather[0].icon + '@2x.png')
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
        $fiveday.append($newdiv)
    }

});
}
$(document).on("click", ".btn", function(event) {
    displayCurrent();
    var userCity = $('.input').val();
    var historybtn = $('<button>')
        historybtn.addClass(`list-group-item list-group-item-action`)
        historybtn.attr('type', 'button')
        historybtn.text(userCity)
        $list.prepend(historybtn)
});
$(document).on('click', '.list-group',function(event) {
    const value = $(event.target).closest('.list-group-item').text();
    $('.input').val(value);
    displayCurrent();
    
});