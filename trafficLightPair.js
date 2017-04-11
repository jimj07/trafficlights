'use strict';
const trafficLight = require('./trafficLight');
const STATES = require('./states');

module.exports = (first = trafficLight(), second = trafficLight(), defaultState = STATES.RED) => {
   let state = defaultState;
   const lights = [first, second];

   // ********************************
   //       Private Functions
   // ********************************

   const setState = (s, cb) => {
      state = s;
      cb();
   }

   // ********************************
   //       Public Functions
   // ********************************
   const getState = () => {
      return STATES.NAMES[state];
   }

   const turnGreen = () => {
      state = STATES.GREEN
      lights[0].turnGreen();
      lights[1].turnGreen();
   }

   const turnYellow = () => {
      state = STATES.YELLOW
      lights[0].turnYellow();
      lights[1].turnYellow();
   }

   const turnRed = () => {
      state = STATES.RED;
      lights[0].turnRed();
      lights[1].turnRed();
   }

   const status = () => {
      return `${first.status()}\n${second.status()}`;
   }

   return {
      getState,
      status,
      turnGreen,
      turnRed,
      turnYellow
   };
}