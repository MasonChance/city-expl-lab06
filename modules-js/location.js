'use strict';
// const express = require('express');
require('dotenv').config();
const pg = require('pg');
const superagent = require('superagent');
const client = new pg.Client(process.env.POSTGRESS_URL);

client.on('error', console.error);
client.connect();


// ==== Location data Constructor for LocationIQ Data =====// 
//Called By: databaseSavePlus().
function LocationData(city_toBeSearched, result_locatIq){
  this.search_query = city_toBeSearched;
  this.formatted_query = result_locatIq.display_name;
  this.latitude = result_locatIq.lat;
  this.longitude = result_locatIq.lon;
}

LocationData.superQueryParam = function(city_toBeSearched) {
  this.q = city_toBeSearched;
  this.key = process.env.GEOCODE_API_KEY; 
  this.format = 'json';
};

//parentOf checkDataBase()

function getLocation(req, res){
  const locatIq_Url = 'https://us1.locationiq.com/v1/search.php';
  const city_toBeSearched = req.query.city; //[x]
 console.log(`req.query.Response: ${req.body}`)

  superagent.get(locatIq_Url)
  .query(LocationData.superQueryParam)

  .then(result_locatIq => checkDataBase(city_toBeSearched, result_locatIq))
  .catch(error => res.send(`${error} something went wrong`).status(500))  
  console.log('result_locatIq:',req.Response)
}     

//parentOf client.query('check') && databaseSavePlus childOf getLocation()

function checkDataBase (city_toBeSearched, result_locatIq){
  const sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  const sqlVal = [city_toBeSearched];
  client.query(sqlQuery, sqlVal)
    .then(result_sql => {
      if(result_sql.rowCount > 0){
        return result_sql.rows[0]; //!!!check value && typeof <result_sql>
      }else{
       return databaseSavePlus(city_toBeSearched, result_locatIq);
      }   
    })
}

//parentOf new LocationData() && client.query('set') childOf checkDataBase()

function databaseSavePlus(city_toBeSearched, result_locatIq){
  const location_Obj = new LocationData(city_toBeSearched, result_locatIq.body[0])
  const sqlQuery = 'INSERT INTO locations(latitude, search_query, longitude, formatted_query) VALUES($1, $2, $3, $4)';
  const sqlVal = [location_Obj.latitude, location_Obj.search_query, location_Obj.longitude, location_Obj.formatted_query];

  client.query(sqlQuery, sqlVal);
  return location_Obj;
}



module.exports = getLocation; //[x] export works