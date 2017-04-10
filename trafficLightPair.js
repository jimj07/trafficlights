const trafficLight = require('./trafficLight');
const STATES = require('./states');

module.exports = (first = trafficLight(), second = trafficLight(), defaultState = STATES.RED) => {
   let state = defaultState;
   let subscribers = [];
   const lights = [first, second];

   const getState = () => {
      return STATES.NAMES[state];
   }

   const setState = (s) => {
      for (l of lights) {
         l.setState(s);
      }
      notify();
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

   const notify = () => {
      for(s of subscribers) {
         s();
      }
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