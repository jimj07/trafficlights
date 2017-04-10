const expect = require('chai').expect;
const chai = require('chai');
const trafficLight = require('../trafficLight');
const STATES = require('../states');

describe('trafficLight', () => {
   describe('initialization', () => {
      it('should return state as Green', () => {
         const name = 'North';
         const tl = trafficLight(name, STATES.GREEN);
         const state = tl.getState();
         const status = tl.status();
         expect(state).equals(STATES.NAMES[STATES.GREEN]);
         expect(status).equals(`${name} is ${state}`);
      });
   });

   describe('getState()', () => {
      it('should return default value Red', () => {
         const tl = trafficLight();
         const state = tl.getState();
         expect(state).equals(STATES.NAMES[STATES.RED]);
      });
   });

   describe('setState()', () => {
      it('should set state to Yellow', () => {
         const tl = trafficLight();
         tl.setState(STATES.YELLOW);

         const state = tl.getState();
         expect(state).equals(STATES.NAMES[STATES.YELLOW]);
      });
   });

});