'use strict';
const moment = require('moment');
const trafficLight = require('./trafficLight');
const trafficLightPair = require('./trafficLightPair');
const STATES = require('./states');

module.exports = (rule = {
   interval: 5 * 60 * 1000,
   yellowLength: 30 * 1000,
   startTime: {
      hour: 9,
      minute: 0,
      second: 0
   },
   duration: 30 * 60 * 1000
}) => {
   const {interval, yellowLength, startTime, duration} = rule;
   
   const greenLength = interval - yellowLength;
   const startMoment = moment().hour(startTime.hour)
      .minute(startTime.minute)
      .second(startTime.second);
   const curMoment = moment(startMoment);

   const northLight = trafficLight('North');
   const southLight = trafficLight('South');
   const eastLight = trafficLight('East', STATES.GREEN);
   const westLight = trafficLight('West', STATES.GREEN);

   const northSouth = trafficLightPair(northLight, southLight);
   const eastWest = trafficLightPair(eastLight, westLight);

   const start = () => {
      report();
      northSouth.subscribe(report);
      eastWest.subscribe(report);
      startInterval(eastWest, northSouth);
   }

   const startInterval = (greenTLPair, redTLPair) => {
      if (curMoment.diff(startMoment) >= duration) {
         return;
      }
      
      setTimeout(() => {
         curMoment.add(greenLength, 'milliseconds');
         greenTLPair.turnYellow();
         setTimeout(() => {
            curMoment.add(yellowLength, 'milliseconds');
            greenTLPair.turnRed();
            redTLPair.turnGreen();
            const nextGreen = redTLPair;
            const nextRed = greenTLPair;
            startInterval(nextGreen, nextRed);
         }, yellowLength);
      }, greenLength);
   };

   const report = () => {
      const output = `
${curMoment.format()}
${northSouth.status()}
${eastWest.status()}
`
      console.log(output);
   };

   return {
      start
   };
}