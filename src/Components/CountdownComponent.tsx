import React, { useState, useEffect } from "react";

interface CountdownComponentProps {
  date: string;
}

const CountdownComponent = ({ date }: CountdownComponentProps) => {
  //Time until the given date
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const countDownDate = new Date(date).getTime();

    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(x);
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(x);
  }, [date]);

  return (
    <div className="flex mb-12 flex-col w-full justify-center md:w-3/5 lg:w-full lg:mb-14 xl:w-10/12">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="countdown font-semibold text-5xl md:text-6xl lg:text-8xl xl:text-9xl">
            <span
              style={{ "--value": time.days } as React.CSSProperties}
            ></span>
          </span>
          <p className="text-base md:text-2xl">days</p>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-semibold text-5xl md:text-6xl lg:text-8xl xl:text-9xl">
            <span
              style={{ "--value": time.hours } as React.CSSProperties}
            ></span>
          </span>
          <p className="text-base md:text-2xl">hours</p>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-semibold text-5xl md:text-6xl lg:text-8xl xl:text-9xl">
            <span
              style={{ "--value": time.minutes } as React.CSSProperties}
            ></span>
          </span>
          <p className="text-base md:text-2xl">min</p>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-semibold text-5xl md:text-6xl lg:text-8xl xl:text-9xl">
            <span
              style={{ "--value": time.seconds } as React.CSSProperties}
            ></span>
          </span>
          <p className="text-base md:text-2xl">sec</p>
        </div>
      </div>
      <p className="text-base mt-5 md:text-2xl font-normal">Until release!</p>
    </div>
  );
};

export default CountdownComponent;
