'use strict';

const superagent = require('superagent');

//===== Database Configs ====//
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


// const coords = require('location.js');
//==== Constructor for Trails Data ====//

function TrailData(result_HikePro){
  //data in the format required by hiking api.
    this.name = result_HikePro.name;
    this.location = result_HikePro.location;
    this.length = result_HikePro.length;
    this.stars = result_HikePro.stars;
    this.star_votes = result_HikePro.star_votes;
    this.summary = result_HikePro.summary;
    this.trail_url = result_HikePro.trail_url;
    this.conditions = result_HikePro.conditions;
    this.condition_date = result_HikePro.condition.date;
    this.condition_time = result_HikePro.condition_time;
    
}


//====Constructor Query_Obj.method ======//
TrailData.Query = function(coords){
  this.key = process.env.HIKINGPROJECT_API_KEY;
  this.lat = coords[0];
  this.lon = coords[0];
  this.maxResults = 10;
};


//===== exported callback function for Trails API ===//

function trailsNear(req, res){
  // [x] console.log(`req.query.search_query ${req.query.search_query}`); Returns: Seattle. 
  const trail_Url = 'https://www.hikingproject.com/data/get-trails';
  getLat_Lon_sql(req, res).then((coords) => {
    const trailQuery = TrailData.Query(coords);
    console.log(`coords: trail.js:ln:45-> ${coords}`);
    superagent.get(trail_Url)
      .query(trailQuery)
      .then(list => res.send(list.map(new TrailData(curr))))
      .catch(error => res.send(`${error} We're sorry, We can't find that`).status(500))
  })  
  // call TrailData.Query(return of getLat_Lon_sql(req, res))
  
  console.log(`coords@trails.js:ln:45 ${coords}`);
  console.log(`trailQuery@trails.js:ln:48 ${trailQuery}`);
  // pass TrailData.Query() to superagent.get()
  
  //retuns an array[x10] of trail data objects
}

//=== gets latitude and longitude, pass to TrailData.Query()
function getLat_Lon_sql(req, res){
  // get req.query.search_query
  const city_searched = req.query.search_query;
  const sql_query = 'SELECT * FROM locations WHERE search_query=$1';
  const sql_val = [city_searched];
  
  return  client.query(sql_query, sql_val)
        .then(record => {
          const latitude = record.rows[0].latitude;
          const longitude = record.rows[0].longitude;
          console.log(`latitude ${latitude}`);//[x] logs as a legitimate value!
          const coord_arr = {
            'lat': latitude,
            'lon': longitude
          };
          console.log(`coord_arr@trails.js:ln:73 ${coord_arr}`);
          return coord_arr;
        })
      .catch(error => res.send(`${error} We're sorry, we couldn't find that`).status(500))
    //return objliteral with coresponding properties of Lat/Lon
}









module.exports = trailsNear;