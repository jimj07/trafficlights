'use strict';
const STATES = require('./states');

module.exports = (defaultName = 'Traffic Light', defaultState = STATES.RED) => {
   let state = defaultState;
   let name = defaultName;

   // ********************************
   //       Private Functions
   // ********************************

   const setState = (s) => {
      state = s;
   }

   // ********************************
   //       Public Functions
   // ********************************
   const getState = () => {
      return STATES.NAMES[state];
   }

   const status = () => {
      return `${name} is ${getState()}`;
   }

   const turnGreen = () => {
      setState(STATES.GREEN);
   }

   const turnYellow = () => {
      setState(STATES.YELLOW);
   }

   const turnRed = () => {
      setState(STATES.RED);
   }

   return {
      getState,
      status,
      turnGreen,
      turnRed,
      turnYellow
   };
}