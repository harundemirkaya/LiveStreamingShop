import { reactive, toRefs } from "vue";
import moment from "moment";

export const useCountDown = () => {
  const timeObject = reactive({
    timeDifference: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    start: Date.now(),
    finished: false,
  });

  const startTimer = ({ duration = 60 * 5, scheduledTime }) => {
    var start = Date.now(),
      diff;

    function timer() {
      diff = duration - (((scheduledTime - start) / 1000) | 0);

      let difference = scheduledTime - Date.now();
      const tempTime = moment.duration(difference);

      timeObject.days = tempTime.days();
      timeObject.hours = tempTime.hours();
      timeObject.minutes = tempTime.minutes();
      timeObject.seconds = tempTime.seconds();

      if (diff <= 0) {
        start = Date.now() + 1000;
      }
    }

    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
  };

  const startMinSecTimer = ({ seconds }) => {
    timeObject.timeDifference = seconds;

    const timer = () => {
      timeObject.minutes = (timeObject.timeDifference / 60) | 0;
      timeObject.seconds = timeObject.timeDifference % 60 | 0;

      timeObject.minutes =
        timeObject.minutes < 10 ? "0" + timeObject.minutes : timeObject.minutes;
      timeObject.seconds =
        timeObject.seconds < 10 ? "0" + timeObject.seconds : timeObject.seconds;

      if (timeObject.timeDifference > 0) timeObject.timeDifference -= 1;
      else timeObject.finished = true;

      if (timeObject.timeDifference === 0) {

        clearInterval(intervalId);
      }
    };
    timer();
    var intervalId = setInterval(timer, 1000);
  };

  return { startTimer, startMinSecTimer, ...toRefs(timeObject) };
};
