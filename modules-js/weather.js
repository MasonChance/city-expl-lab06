'use strict';

const superagent = require('superagent');

//==== constructor for /weather data from Weatherbit_API ====//

function WeatherData(forecast, time){
  this.forecast = forecast;
  this.time = time;  
}

WeatherData.superQueryParam = function(req){
  this.key = process.env.WEATHERBIT_API_KEY;
  this.units = 'I',
  this.days = 8;
  this.city = req.query.search_query;
}


function getForecast(req, res){
  const weatherBit_Url = 'https://api.weatherbit.io/v2.0/forecast/daily';
  const result = req.body.data;

  superagent.get(weatherBit_Url) 
  .query(WeatherData.superQueryParam)
  .then(() => {
    res.send(result.map(val => new WeatherData(val.weather.description, val.datetime))).status(200)
  })
  .catch(error => res.send(`${error} We're sorry, We can't find that`).status(500))
}


module.exports = getForecast;