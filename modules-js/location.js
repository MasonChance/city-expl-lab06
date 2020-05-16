'use strict';
// const express = require('express');

const pg = require('pg');
const superagent = require('superagent');
const client = new pg.Client(process.env.POSTGRESS_URL);

client.on('error', console.error);
client.connect();


// ==== Location data Constructor for LocationIQ Data =====// 
//Called By: databaseSavePlus().
function LocationData(reqArr, search_query){
  this.search_query = search_query;
  this.formatted_query = reqArr[0].display_name;
  this.latitude = reqArr[0].lat;
  this.longitude = reqArr[0].lon;
}

LocationData.superQueryParam = function(city_toBeSearched) {
  this.q = city_toBeSearched;
  this.key = process.env.GEOCODE_API_KEY; 
  this.format = 'json';
  return
};


//parentOf client.query('check') && databaseSavePlus childOf getLocation()

function getLocation (req, res){
  const city_toBeSearched = req.query.city; //[x]
  const sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  const sqlVal = [city_toBeSearched];
  console.log(`city_toBeSearched: ${city_toBeSearched}`);
  client.query(sqlQuery, sqlVal)
    .then(result_sql => {
      if(result_sql.rowCount > 0){
        return result_sql.rows[0]; //!!!check value && typeof <result_sql>
      }else{
        const locatIq_Url = 'https://us1.locationiq.com/v1/search.php';        
        const queryParam = new LocationData.superQueryParam(city_toBeSearched);
        console.log(`queryParam @Ln 33: ${queryParam}`)
        superagent.get(locatIq_Url)
          .query(queryParam)
          .then(result => databaseSavePlus(city_toBeSearched, result, res))
          .catch(error => res.send(`${error} something went wrong`).status(500))  
      }   
    })
}

//parentOf new LocationData() && client.query('set') childOf checkDataBase()

function databaseSavePlus(city_toBeSearched, result_locatIq, res){
  const location_Obj = new LocationData(result_locatIq.body, city_toBeSearched)
  const sqlQuery = 'INSERT INTO locations(latitude, search_query, longitude, formatted_query) VALUES($1, $2, $3, $4)';
  const sqlVal = [location_Obj.latitude, location_Obj.search_query, location_Obj.longitude, location_Obj.formatted_query];
  console.log(`resule_locatIQ @ ln:62: ${result_locatIq}`);
  client.query(sqlQuery, sqlVal);
  res.send(location_Obj) ;
}



module.exports = getLocation; //[x] export works