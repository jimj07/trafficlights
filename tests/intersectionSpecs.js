const expect = require('chai').expect;
const assert = require('chai').assert;
const chai = require('chai');
const sinon = require('sinon');
const trafficLight = require('../trafficLight');
const trafficLightPair = require('../trafficLightPair');
const intersection = require('../intersection');
const STATES = require('../states');

const DEFAULT_RULE = {
   interval: 5 * 60 * 1000,
   yellowLength: 30 * 1000,
   startTime: {
      hour: 9,
      minute: 0,
      second: 0
   },
   timeFormat: 'hh:mm:ss a',
   duration: 30 * 60 * 1000
};

const GREEN_LENGTH = DEFAULT_RULE.interval - DEFAULT_RULE.yellowLength;
const YELLOW_LENGTH = DEFAULT_RULE.yellowLength;
const DURATION = DEFAULT_RULE.duration;

describe('intersection', () => {
   describe('start()', () => {
      it('should call report function once', () => {
         this.clock = sinon.useFakeTimers();
         const northLight = trafficLight('North');
         const southLight = trafficLight('South');
         const eastLight = trafficLight('East');
         const westLight = trafficLight('West');
         const northSouth = trafficLightPair(northLight, southLight);
         const eastWest = trafficLightPair(eastLight, westLight);

         const int = intersection(northSouth, eastWest, DEFAULT_RULE);
         const callBack = sinon.spy();
         int.start(callBack);
         expect(callBack.calledOnce).to.be.true;
      });
      
      it('should turn NS from Red -> Green -> Yellow -> Red and turn EW from Green -> Yellow -> Red -> Green: 2 intervals', () => {
         this.clock = sinon.useFakeTimers();
         const northLight = trafficLight('North');
         const southLight = trafficLight('South');
         const eastLight = trafficLight('East', STATES.GREEN);
         const westLight = trafficLight('West', STATES.GREEN);
         const northSouth = trafficLightPair(northLight, southLight);
         const eastWest = trafficLightPair(eastLight, westLight);

         const int = intersection(northSouth, eastWest, DEFAULT_RULE);

         let expectOutput = `09:00:00 am\nNorth is Red\nSouth is Red\nEast is Green\nWest is Green\n`;
         const report = (output) => {
            expect(output).to.equals(expectOutput);
         }

         const callBack = sinon.spy(report);
         int.start(callBack);

         // NS: RED, EW: YELLOW
         expectOutput = `09:04:30 am\nNorth is Red\nSouth is Red\nEast is Yellow\nWest is Yellow\n`;
         this.clock.tick(GREEN_LENGTH);
         expect(northSouth.getState()).to.equals(STATES.NAMES[STATES.RED]);
         expect(eastWest.getState()).to.equals(STATES.NAMES[STATES.YELLOW]);

         // NS: GREEN, EW: RED
         expectOutput = `09:05:00 am\nNorth is Green\nSouth is Green\nEast is Red\nWest is Red\n`;
         this.clock.tick(YELLOW_LENGTH);
         expect(northSouth.getState()).to.equals(STATES.NAMES[STATES.GREEN]);
         expect(eastWest.getState()).to.equals(STATES.NAMES[STATES.RED]);

         // should stay the same
         this.clock.tick(GREEN_LENGTH - 10);
         expect(northSouth.getState()).to.equals(STATES.NAMES[STATES.GREEN]);
         expect(eastWest.getState()).to.equals(STATES.NAMES[STATES.RED]);

         // NS: YELLOW, EW: RED
         expectOutput = `09:09:30 am\nNorth is Yellow\nSouth is Yellow\nEast is Red\nWest is Red\n`;
         this.clock.tick(10);
         expect(northSouth.getState()).to.equals(STATES.NAMES[STATES.YELLOW]);
         expect(eastWest.getState()).to.equals(STATES.NAMES[STATES.RED]);

         // should stay the same
         this.clock.tick(YELLOW_LENGTH - 10);
         expect(northSouth.getState()).to.equals(STATES.NAMES[STATES.YELLOW]);
         expect(eastWest.getState()).to.equals(STATES.NAMES[STATES.RED]);

         // NS: RED, EW:GREEN
         expectOutput = `09:10:00 am\nNorth is Red\nSouth is Red\nEast is Green\nWest is Green\n`;
         this.clock.tick(10);
         expect(northSouth.getState()).to.equals(STATES.NAMES[STATES.RED]);
         expect(eastWest.getState()).to.equals(STATES.NAMES[STATES.GREEN]);
      });

      it('should stop after running for the specified duration', () => {
         this.clock = sinon.useFakeTimers();
         const northLight = trafficLight('North');
         const southLight = trafficLight('South');
         const eastLight = trafficLight('East');
         const westLight = trafficLight('West');
         const northSouth = trafficLightPair(northLight, southLight);
         const eastWest = trafficLightPair(eastLight, westLight);

         const int = intersection(northSouth, eastWest, DEFAULT_RULE);
         const callBack = sinon.spy();
         int.start(callBack);
         this.clock.tick(DURATION);

         const northSouthLastState = northSouth.getState();
         const eastWestLastState = eastWest.getState();

         this.clock.tick(GREEN_LENGTH);
         expect(northSouth.getState()).to.equals(northSouthLastState);
         expect(eastWest.getState()).to.equals(eastWestLastState);

         this.clock.tick(YELLOW_LENGTH);
         expect(northSouth.getState()).to.equals(northSouthLastState);
         expect(eastWest.getState()).to.equals(eastWestLastState);
      });

      it('should have no delay if fastForward is enabled', () => {
         this.clock = sinon.useFakeTimers();
         const northLight = trafficLight('North');
         const southLight = trafficLight('South');
         const eastLight = trafficLight('East');
         const westLight = trafficLight('West');
         const northSouth = trafficLightPair(northLight, southLight);
         const eastWest = trafficLightPair(eastLight, westLight);

         DEFAULT_RULE.fastForward = true;

         const int = intersection(northSouth, eastWest, DEFAULT_RULE);
         const callBack = sinon.spy();
         int.start(callBack);

         this.clock.tick(1000);
         const northSouthLastState = northSouth.getState();
         const eastWestLastState = eastWest.getState();

         // intersection is stop, no more changes
         this.clock.tick(GREEN_LENGTH);
         expect(northSouth.getState()).to.equals(northSouthLastState);
         expect(eastWest.getState()).to.equals(eastWestLastState);

         this.clock.tick(YELLOW_LENGTH);
         expect(northSouth.getState()).to.equals(northSouthLastState);
         expect(eastWest.getState()).to.equals(eastWestLastState);
      });
   });
});