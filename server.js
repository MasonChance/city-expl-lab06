'use strict';

const express = require('express'); // sets express dependency
const app = express();  // invokes express
require('dotenv').config();  // sets .env dependency inline per .env docs
const superagent = require('superagent');  // sets superagent dependency- necessary for api request processing. 

const PORT = process.env.PORT;
const cors = require('cors');  // sets cors dependency allowing server to interact with other servers and urls. 

app.use(cors()); // invokes use method on express, passing in the cors invokation. 



//===== location data with the Json ===//
app.get('/location', (req, res) => {
  
  const location = require('./data/geo.json');
  
  res.send('Im the Information');
  
});

/*=== access server, callback should return data mathing the following:
[
  {
    "forecast": "Partly cloudy until afternoon.",
    "time": "Mon Jan 01 2001"
  },
  {
    "forecast": "Mostly cloudy in the morning.",
    "time": "Tue Jan 02 2001"
  },
]

*/

app.get('/weather', (req, res) =>{
  req = require('./data/darksky.json');

  const forecastInJson = req.data[0].weather.description;
  const timeInJson = req.data[0].datetime;
  // let formattedTime = (input, yr, mo, day) =>{
  //   input = timeInJson.split('-');
  //   yr = input[0];
  //   mo = input[1];
  //   day = input[2];
  //   const newDate = new Date(yr, mo, day);
  //   return newDate;
  // };

  // formattedTime = formattedTime.toDateString();

  // const result = new WeatherData(forecastInJson, formattedTime);
  console.log(req.data[0]);
  res.send(req);

  });

//==== constructor for /weather data from JSON ====//
const WeatherData = function(forecast, time){
  this.forecast = forecast;
  this.time = time;
  
}






// ===== spins up server on local and tests it===// see https://limitless-peak-33770.herokuapp.com/ for deployed site. 
app.listen(PORT, () => console.log('I am ALIVE!!')); // local host server test
