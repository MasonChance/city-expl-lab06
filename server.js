'use strict';

const express = require('express'); // sets express dependency
const app = express();  // invokes express
require('dotenv').config();  // sets .env dependency inline per .env docs
const superagent = require('superagent');  // sets superagent dependency- necessary for api request processing. 

const PORT = process.env.PORT;
const cors = require('cors');  // sets cors dependency allowing server to interact with other servers and urls. 

//===== API_KEY_VARIABLES =======//
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
app.use(cors()); // invokes use method on express, passing in the cors invocation. 

app.get('/',(req, res) =>{
  console.log('who am I?');
  
 })

//===== location data with the Json ===//
app.get('/location', (req, res) => {
  console.log('here:');
  //TODO: refactor to use superagent and APIquery
  const locatIq_Url = 'https://us1.locationiq.com/v1/search.php'; //childOf locationIQ
  const city_toBeSearched = req.query.city; // childOf front-end
  const superQueryParam = {
    q: city_toBeSearched, //childOf front-end
    key: GEOCODE_API_KEY, 
    format: 'json'
  };
  
  superagent.get(locatIq_Url)
    .query(superQueryParam)
    .then(result_locatIq => {
      const newLocation = new LocationData(city_toBeSearched, result_locatIq.body[0]);
      
      res.send(newLocation).status(200); // `.status(200)` is arbitrary success msg
    })
    //TODO: needs a .catch to handle promise. 
    .catch(error => {
     
      res.send(error).status(500); // `.status(500)` is arbitrary. specific errors can be choosen but this is the default. 
    });

});


// ==== Location data Constructor =====// 
function LocationData(city_toBeSearched, result_locatIq){
  
  this.search_query = city_toBeSearched;
  this.formatted_query = result_locatIq.display_name;
  this.latitude = result_locatIq.lat;
  this.longitude = result_locatIq.lon;
}


// === weather data using .map and Json file ==//
app.get('/weather', (req, res) => {
  
  const weatherBit_Url = 'https://api.weatherbit.io/v2.0/forecast/daily';
  const city_toBeSearched = req.query.city;
  console.log('city: ', city_toBeSearched);
  const superQueryParam = {
    key: WEATHERBIT_API_KEY,
    units: 'I',
    days: 7,
    city: city_toBeSearched
  }
  
  superagent.get(weatherBit_Url) 
  .query(superQueryParam)
  .then(result_weather => {
    console.log('result_weather',result_weather.body);
    const sevenDayCast = new WeatherData(result_weather.body.data); 
      return sevenDayCast;
      res.send(sevenDayCast).status(200);
    })

  .catch(error =>{  
      // console.log('result_weather',result_weather);
      res.send(`${error} We're sorry, that information is no longer available`).status(500)
    })
  

});

//==== constructor for /weather data from JSON ====//
function WeatherData(result_weather){
  this.forecast = result_weather.description;
  this.time = result_weather.datetime;  
}

// === where my logs At route? ====//

// app.get('/',(req, res) =>{
//  const iAm = console.log('who am I?');
//  res.send(iAm);
// })




// ===== spins up server on local and tests it===// see https://limitless-peak-33770.herokuapp.com/ for deployed app. 
app.listen(PORT, () => console.log(`Am I Dead Enough for Life?: ${PORT} !!`)); // local host server test
