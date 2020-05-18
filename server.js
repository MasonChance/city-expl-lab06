'use strict';

const express = require('express');
const cors = require('cors'); 

require('dotenv').config();  

const PORT = process.env.PORT; 
const app = express();  

app.use(cors({origin:'https://codefellows.github.io'})); 

//==== Handlers =====///

const getLocation = require('./modules-js/location.js');
const getForecast = require('./modules-js/weather.js');
// const trailsNear = require('./modules-js/trails.js')
//===== Routes ===//

app.get('/location', getLocation);
app.get('/weather', getForecast);
// app.get('/trails', trailsNear);






// ===== spins up server on local and tests it===// see https://limitless-peak-33770.herokuapp.com/ for deployed app. 

app.listen(PORT, () => console.log(`Am I Dead Enough for Life?: ${PORT} !!`)); // local host server test
