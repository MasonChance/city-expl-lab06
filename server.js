'use strict';

const express = require('express'); // sets express dependency
const app = express();  // invokes express
require('dotenv').config();  // sets .env dependency inline per .env docs
const superagent = require('superagent');  // sets superagent dependency- necessary for api request processing. 

const PORT = process.env.PORT;
const cors = require('cors');  // sets cors dependency allowing server to interact with other servers and urls. 
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
app.use(cors()); // invokes use method on express, passing in the cors invocation. 



//===== location data with the Json ===//
app.get('/location', (req, res) => {
 /* !!! the following  lines were specific to using a json file that exists in the file directory of the App. // req = require('./data/geo.json'); // starting over with json baseline
  // const result = new LocationData (req[0]);
  // res.send(result);  */
  console.log('req:', req.body);
  //TODO: refactor to use superagent and APIquery
  const locatIq_Url = 'https://us1.locationiq.com/v1/search.php'; //childOf locationIQ
  const city_toBeSearched = req.query.city; // childOf front-end
  console.log('city_toBeSearched:', city_toBeSearched);
  const superQueryParam = {
    q: city_toBeSearched, //childOf front-end
    key: GEOCODE_API_KEY, 
    format: 'json'
  };
  console.log('superQueryParam:', superQueryParam)
  superagent.get(locatIq_Url)
    .query(superQueryParam)
    .then(result_locatIq => {
      const newLocation = new LocationData(result_locatIq.body);
      console.log('newLocation:',  newLocation);
      res.send(newLocation).status(200); // `.status(200)` is arbitrary success msg
    })
    //TODO: needs a .catch to handle promise. 
    .catch(error => {
      console.log('error:', error);
      res.send(error).status(500); // `.status(500)` is arbitrary. specific errors can be choosen but this is the default. 
    });

});





// ==== Location data Constructor =====// 
function LocationData(result_locatIq){
  
  this.search_query = city_toBeSearched;
  this.formatted_query = result_locatIq.body.display_name;
  this.latitude = result_locatIq.body.lat;
  this.longitude = result_locatIq.body.lon;
}


// === weather data using .map and Json file ==//
app.get('/weather', (req, res) => {
  req = require('./data/darksky.json');   
    const result = req.data.map((current) => {
    return new WeatherData(current);  
  })
  res.send(result);
});

//==== constructor for /weather data from JSON ====//
function WeatherData(result){
  this.forecast = result.weather.description;
  this.time = result.datetime;  
}






// ===== spins up server on local and tests it===// see https://limitless-peak-33770.herokuapp.com/ for deployed app. 
app.listen(PORT, () => console.log(`I am ALIVE on: ${PORT} !!`)); // local host server test
