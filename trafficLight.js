'use strict';
const STATES = require('./states');

module.exports = (defaultName = 'Traffic Light', defaultState = STATES.RED) => {
   let state = defaultState;
   let name = defaultName;

   // ********************************
   //       Public Functions
   // ********************************
   const getState = () => {
      return STATES.NAMES[state];
   }

   const status = () => {
      return `${name} is ${getState()}`;
   }

   const setState = (s) => {
      state = s;
   }

   return {
      getState,
      status,
      setState
   };
}