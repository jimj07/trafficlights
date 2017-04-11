'use strict';
const trafficLight = require('./trafficLight');
const STATES = require('./states');

module.exports = (first = trafficLight(), second = trafficLight(), defaultState = STATES.RED) => {
   let state = defaultState;
   let subscribers = [];
   const lights = [first, second];

   // ********************************
   //       Private Functions
   // ********************************
   const setState = (s) => {
      state = s;
      lights[0].setState(s);
      lights[1].setState(s);
      notify();
   }

   const notify = () => {
      for (const s of subscribers) {
         s();
      }
   }

   // ********************************
   //       Public Functions
   // ********************************
   const getState = () => {
      return STATES.NAMES[state];
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

   const status = () => {
      return `${first.status()}\n${second.status()}`;
   }

   const subscribe = (cb) => {
      subscribers.push(cb);
   }

   return {
      getState,
      status,
      turnGreen,
      turnRed,
      turnYellow,
      subscribe
   };
}