'use strict';

const express = require('express'); // sets express dependency
const cors = require('cors');  // sets cors dependency allowing server to interact with other servers and urls. 
const pg = require('pg');
const superagent = require('superagent');  // sets superagent dependency- necessary for api request processing. 

require('dotenv').config();  // sets .env dependency inline per .env docs

const PORT = process.env.PORT; // sets port for localhost
const app = express();  // invokes express

app.use(cors()); // invokes use method on express, passing in the cors invocation. 

//=== DataBase Config ===//
const client = new pg.Client(process.env.POSTGRESS_URL)
client.on('error', console.error);
client.connect();



//===== Routes ===//
app.get('/location', getLocation)
 

function getLocation(req, res){
  const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
  const locatIq_Url = 'https://us1.locationiq.com/v1/search.php'; //childOf locationIQ
  const city_toBeSearched = req.query.city; // childOf front-end
  const superQueryParam = {
    q: city_toBeSearched, //childOf front-end
    key: GEOCODE_API_KEY, 
    format: 'json'
  };
  superagent.get(locatIq_Url)
  .query(superQueryParam)
  .then(result_locatIq => checkDataBase(city_toBeSearched, result_locatIq))
  .catch(error => res.send(`${error} something went wrong`).status(500))  

}     

function databaseSavePlus(city_toBeSearched, result_locatIq){
  const location_Obj = new LocationData(city_toBeSearched, result_locatIq.body[0])
  const sqlQuery = 'INSERT INTO locations(latitude, search_query, longitude, formatted_query) VALUES($1, $2, $3, $4)';
  const sqlVal = [location_Obj.latitude, location_Obj.search_query, location_Obj.longitude, location_Obj.formatted_query];

  client.query(sqlQuery, sqlVal);
  return location_Obj;
}

function checkDataBase (city_toBeSearched, result_locatIq){
  const sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  const sqlVal = [city_toBeSearched];
  client.query(sqlQuery, sqlVal)
    .then(result_sql => {
      if(result_sql.rowCount > 0){
        return result_sql.rows[0];
      }else{
       return databaseSavePlus(city_toBeSearched, result_locatIq);
      }   
    })
}

// ==== Location data Constructor for LocationIQ Data =====// 
function LocationData(city_toBeSearched, result_locatIq){
  
  this.search_query = city_toBeSearched;
  this.formatted_query = result_locatIq.display_name;
  this.latitude = result_locatIq.lat;
  this.longitude = result_locatIq.lon;
}


// === weather data using .map and Json file ==//
app.get('/weather', (req, res) => {
  const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
  const weatherBit_Url = 'https://api.weatherbit.io/v2.0/forecast/daily';
  const city_toBeSearched = req.query.search_query;
  
  const superQueryParam = {
    key: WEATHERBIT_API_KEY,
    units: 'I',
    days: 8,
    city: city_toBeSearched
  }
  
  superagent.get(weatherBit_Url) 
  .query(superQueryParam)
  .then((req) => {
    const result = req.body.data;
    const sevenDayCast = result.map(val =>new WeatherData(val.weather.description, val.datetime))
    
    res.send(sevenDayCast).status(200)    
  })
  .catch(error => res.send(`${error} We're sorry, We can't find that`).status(500))
});

//==== constructor for /weather data from Weatherbit_API ====//
function WeatherData(forecast, time){
  this.forecast = forecast;
  this.time = time;  
}




// ===== spins up server on local and tests it===// see https://limitless-peak-33770.herokuapp.com/ for deployed app. 
app.listen(PORT, () => console.log(`Am I Dead Enough for Life?: ${PORT} !!`)); // local host server test
