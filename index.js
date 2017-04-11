'use strict';
const intersection = require('./intersection');
const trafficLight = require('./trafficLight');
const trafficLightPair = require('./trafficLightPair');
const STATES = require('./states');

const northLight = trafficLight('North');
const southLight = trafficLight('South');
const eastLight = trafficLight('East', STATES.GREEN);
const westLight = trafficLight('West', STATES.GREEN);

const northSouth = trafficLightPair(northLight, southLight);
const eastWest = trafficLightPair(eastLight, westLight);

const fastForwardEnabled = process.argv[2] === '-f';

const rule = {
   interval: 5 * 60 * 1000,
   yellowLength: 30 * 1000,
   startTime: {
      hour: 9,
      minute: 0,
      second: 0
   },
   timeFormat: 'hh:mm:ss a',
   duration: 30 * 60 * 1000,
   fastForward: fastForwardEnabled
};
const int = intersection(northSouth, eastWest, rule);

int.start((status) => {
   console.log(status);
});