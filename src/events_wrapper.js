/* eslint-disable no-console */
const queues = require('./resources/queues');
const events = require('./resources/events');

function sleep(ms) {
  // TODO add jitter.
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function eventsWrapper(config) {
  const z = {
    queues: queues(config),
    events: events(config),
  };

  function logError(error) {
    console.log('zulip-js: Error while communicating with server:', error); // eslint-disable-line no-console
  }

  async function registerQueue(eventTypes = null) {
    let res;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const params = { eventTypes };
        res = await z.queues.register(params); // eslint-disable-line no-await-in-loop
        if (res.result === 'error') {
          logError(res.msg);
          await sleep(1000); // eslint-disable-line no-await-in-loop
        } else {
          return {
            queueId: res.queue_id,
            lastEventId: res.last_event_id,
          };
        }
      } catch (e) {
        logError(e);
      }
    }
  }

  async function callOnEachEvent(callback, eventTypes = null) {
    let queueId = null;
    let lastEventId = -1;
    let queueData = null;
    const handleEvent = (event) => {
      lastEventId = Math.max(lastEventId, event.id);
      console.log(`!!! callOnEachEvent - lastEventId : ${  lastEventId}`);
      callback(event);
    };
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log(`!!! callOnEachEvent - queId:1 = ${queueId},${lastEventId}`);
      if (!queueId) {
        console.log("!!! callOnEachEvent - queueId OK");
        // const queueData = await registerQueue(eventTypes); // eslint-disable-line no-await-in-loop
        queueData = await registerQueue(eventTypes); // eslint-disable-line no-await-in-loop
        queueId = queueData.queueId;
        lastEventId = queueData.lastEventId;
      }
      else {
        console.log("!!! callOnEachEvent - queueId No");
        lastEventId = queueData.lastEventId;
      }
      // try {
      //   console.log(`!!! callOnEachEvent - !!--01`);
      //   // eslint-disable-next-line no-await-in-loop
      //   z.events.retrieve({
      //     queue_id: queueId,
      //     last_event_id: lastEventId,
      //     dont_block: true,
      //   }).then((res)=>{
      //     console.log(`!!! callOnEachEvent - !!--02`);
      //     if (res.events) {
      //       console.log("!!! callOnEachEvent - event callback call");
      //       res.events.forEach(handleEvent);
      //     } 
      //     console.log(`!!! callOnEachEvent - !!--03`);
      //   });
      // } catch (e) {
      //   console.log(`!!! callOnEachEvent - ERROR : ${  e}`);
      //   logError(e);
      // }        
      // console.log(`!!! callOnEachEvent - !!--04 @@@`);
      // await sleep(1000); // eslint-disable-line no-await-in-loop

      try {
        console.log(`!!! callOnEachEvent - !!--01`);
        // eslint-disable-next-line no-await-in-loop
        const res = await z.events.retrieve({
          queue_id: queueId,
          last_event_id: lastEventId,
          dont_block: false,
        });
        console.log(`!!! callOnEachEvent - !!--02`);
        // if (res.events) {
        //   console.log("!!! callOnEachEvent - event callback call");
        //   console.log(`"!!! callOnEachEvent - !!--02:1 - if res : ${ res.events}"`);
        console.log(`!!! callOnEachEvent - !!--02!!!!!!!!!!!!!!!!!!!!!!!`);  
        console.log(`!!! callOnEachEvent - !!--02-${JSON.stringify(res)}`);
          res.events.forEach(handleEvent);
        // } 
        // else {
        //   console.log(`"!!! callOnEachEvent - !!--02:2 - else res : ${ res.events}"`);
        // }
        console.log(`!!! callOnEachEvent - !!--03`);
      } catch (e) {
        console.log(`!!! callOnEachEvent - ERROR : ${  e}`);
        logError(e);
      }
      await sleep(1000); // eslint-disable-line no-await-in-loop
    }
  }

  return callOnEachEvent;
}

module.exports = eventsWrapper;
