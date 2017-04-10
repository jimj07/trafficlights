const intersection = require('./intersection')({
   interval: 5 * 60 * 1000,
   yellowLength: 30 * 1000,
   startTime: {
      hour: 9,
      minute: 0,
      second: 0
   },
   duration: 30 * 60 * 1000
});

intersection.start();