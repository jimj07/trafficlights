const expect = require('chai').expect;
const assert = require('chai').assert;
const chai = require('chai');
const trafficLight = require('../trafficLight');
const trafficLightPair = require('../trafficLightPair');
const STATES = require('../states');

describe('trafficLightPair', () => {

   describe('getState()', () => {
      it('should return default value Red', () => {
         const tlPair = trafficLightPair();
         const state = tlPair.getState();
         expect(state).equals(STATES.NAMES[STATES.RED]);
      });
   });

   describe('turnYellow()', () => {
      it('should set state to Yellow', () => {
         const tl1 = trafficLight();
         const tl2 = trafficLight();
         const tlPair = trafficLightPair(tl1, tl2);
         tlPair.turnYellow();

         expect(tlPair.getState()).equals(STATES.NAMES[STATES.YELLOW]);
         expect(tl1.getState()).equals(STATES.NAMES[STATES.YELLOW]);
         expect(tl2.getState()).equals(STATES.NAMES[STATES.YELLOW]);
      });
   });

   describe('turnGreen()', () => {
      it('should set state to Green', () => {
         const tl1 = trafficLight();
         const tl2 = trafficLight();
         const tlPair = trafficLightPair(tl1, tl2);
         tlPair.turnGreen();

         expect(tlPair.getState()).equals(STATES.NAMES[STATES.GREEN]);
         expect(tl1.getState()).equals(STATES.NAMES[STATES.GREEN]);
         expect(tl2.getState()).equals(STATES.NAMES[STATES.GREEN]);
      });
   });

   describe('turnRed()', () => {
      it('should set state to Red', () => {
         const tl1 = trafficLight('tl1', STATES.YELLOW);
         const tl2 = trafficLight('tl2', STATES.YELLOW);
         const tlPair = trafficLightPair(tl1, tl2);
         tlPair.turnRed();

         expect(tlPair.getState()).equals(STATES.NAMES[STATES.RED]);
         expect(tl1.getState()).equals(STATES.NAMES[STATES.RED]);
         expect(tl2.getState()).equals(STATES.NAMES[STATES.RED]);
      });
   });

   describe('status()', () => {
      it('should return the status of traffic light pair', () => {
         const tl1 = trafficLight('tl1', STATES.YELLOW);
         const tl2 = trafficLight('tl2', STATES.YELLOW);
         const tlPair = trafficLightPair(tl1, tl2);
         const expectStatus = `${tl1.status()}\n${tl2.status()}`;

         expect(tlPair.status()).equals(expectStatus);
      });
   });

   describe('subscribe()', () => {
      it('should be notified when state is changed', () => {
         const tl1 = trafficLight('tl1', STATES.YELLOW);
         const tl2 = trafficLight('tl2', STATES.YELLOW);
         const tlPair = trafficLightPair(tl1, tl2);
         const expectStatus = `${tl1.status()}\n${tl2.status()}`;
         let isNotified = false;

         tlPair.subscribe(() => {
            isNotified = true;
         });

         tlPair.turnGreen();
         expect(isNotified).to.be.true;

         isNotified = false;
         tlPair.turnRed();
         expect(isNotified).to.be.true;

         isNotified = false;
         tlPair.turnGreen();
         expect(isNotified).to.be.true;
      });
   });

});