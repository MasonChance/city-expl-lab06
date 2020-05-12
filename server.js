'use strict';

const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());


console.log(PORT); // local host port test

app.get('/location', (req, res) => {
  
  const location = require('./data/geo.json');
  
  res.send('Im the Information');
  
});

app.listen(PORT, () => console.log('I am ALIVE!!')); // local host server test
