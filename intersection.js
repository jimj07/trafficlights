'use strict';
const moment = require('moment');
const trafficLight = require('./trafficLight');
const trafficLightPair = require('./trafficLightPair');
const DEFAULT_RULE = {
   interval: 5 * 60 * 1000,
   yellowLength: 30 * 1000,
   startTime: {
      hour: 9,
      minute: 0,
      second: 0
   },
   timeFormat: 'hh:mm a',
   duration: 30 * 60 * 1000
};

module.exports = (northSouth, eastWest, rule = DEFAULT_RULE) => {
   const { interval, yellowLength, startTime, timeFormat, duration, fastForward } = rule;

   const greenLength = interval - yellowLength;
   const startMoment = moment().hour(startTime.hour)
      .minute(startTime.minute)
      .second(startTime.second);
   const curMoment = moment(startMoment);

   let actualGreenLength = greenLength;
   let actualYellowLength = yellowLength;

   // ********************************
   //       Private Functions
   // ********************************
   const initialize = () => {
      northSouth.turnRed();
      eastWest.turnGreen();

      if (fastForward) {
         actualYellowLength = actualGreenLength = 0;
      }
   }

   const startInterval = (greenTLPair, redTLPair, report) => {
      if (curMoment.diff(startMoment) >= duration) {
         return;
      }

      setTimeout(() => {
         curMoment.add(greenLength, 'milliseconds');
         greenTLPair.turnYellow();
         report(getCurStatus());
         setTimeout(() => {
            curMoment.add(yellowLength, 'milliseconds');
            greenTLPair.turnRed();
            redTLPair.turnGreen();
            const nextGreen = redTLPair;
            const nextRed = greenTLPair;
            report(getCurStatus());
            startInterval(nextGreen, nextRed, report);
         }, actualYellowLength);
      }, actualGreenLength);
   };

   const getCurStatus = () => {
      return `${curMoment.format(timeFormat)}\n${northSouth.status()}\n${eastWest.status()}\n`;
   }

   // ********************************
   //       Public Functions
   // ********************************
   const start = (report) => {
      initialize();
      report(getCurStatus());
      startInterval(eastWest, northSouth, report);
   }

   return {
      start
   };
}