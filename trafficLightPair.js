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

   const setState = (s, cb) => {
      state = s;
      notify();
      cb();
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
      setState(STATES.GREEN, () => {
         lights[0].turnGreen();
         lights[1].turnGreen();
      });
   }

   const turnYellow = () => {
      setState(STATES.YELLOW, () => {
         lights[0].turnYellow();
         lights[1].turnYellow();
      });
   }

   const turnRed = () => {
      setState(STATES.RED, () => {
         lights[0].turnRed();
         lights[1].turnRed();
      });
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