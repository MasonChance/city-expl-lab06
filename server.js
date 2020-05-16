'use strict';

const express = require('express');
const cors = require('cors'); 

require('dotenv').config();  

const PORT = process.env.PORT; 
const app = express();  

app.use(cors()); 

//==== Handlers =====///
const homePage = require('https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/')
const getLocation = require('./modules-js/location.js');
const getForecast = require('./modules-js/weather.js');

//===== Routes ===//
app.get('/', homePage);
app.get('/location', getLocation);
app.get('/weather', getForecast);

//!!! troubleshooting console.logs !!!





// ===== spins up server on local and tests it===// see https://limitless-peak-33770.herokuapp.com/ for deployed app. 

app.listen(PORT, () => console.log(`Am I Dead Enough for Life?: ${PORT} !!`)); // local host server test
