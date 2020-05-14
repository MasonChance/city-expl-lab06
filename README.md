# city-expl-lab06
backend api/server excercise

**Author**: Mason Fryberger [GitHub](https://github.com/MasonChance)

**Version**: 1.2.0

**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview

This application will be a stand-alone app that interacts with a static front end website requesting and modifying data from up to 6 third-party APIs to send back to the client for display in the browser. server will be connected to a SQL database



## Getting Started

<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

1. Set Up file Structure including .json files and server.js
1. run ` npm install -save ` in terminal
1. run ` npm install dotenv superagent express cors ` in terminal
1.

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->

## Change Log
### Feature 2 Location Route results w/json-file

Estimate of time needed to complete: 60min

Start time: Mon 5-11-2020

Finish time: Wed 5-14-202

Actual time needed to complete: 3days

05-13-2020 16:02 - Application now has a fully-functional express server, with a GET route for the location resource. Future patch will replace "./data/geo.json" with an API from LocationIQ.

### Feature 3 /weather results w/json-file

Estimate of time needed to complete: 60min

Start time: 17:00

Finish time: 21:00

Actual time needed to complete: 4hrs

05-12-2020 21:00 - Application now has response for Weather, with a GET route for the weather resource. Future patch will replace "./data/darksky.json" with API from weatherbit.

### Feature 3 Implement location API

Estimate of time needed to complete: 120min

Start time: 16:15

Finish time: _____

Actual time needed to complete: _____


01-01-2001 4:59pm - Application now has acess to LocationIQ API, using a GET route for the location resource, utilizing 'superagent' to formulate the API query.

<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:


Number and name of feature: ________________________________

Estimate of time needed to complete: _____

Start time: _____

Finish time: _____

Actual time needed to complete: _____

01-01-2001 4:59pm - Application now has a fully-functional express server, with a GET route for the location resource.



## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->
