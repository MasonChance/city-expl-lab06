'use strict';

const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

app.listen(PORT, () => console.log('I am ALIVE!!')); // local host server test

console.log(PORT); // local host port test

app.get('./geo', (req, res) => {

  const location = req('./data/geo.json');

  res.send({
    console.log('im the information')
  });
  
});

