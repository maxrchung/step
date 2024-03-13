import { useEffect, useState } from "react";

export default function Test() {
  return <Time deadline={Date.now() + 100000} />;
}

interface TimeProps {
  deadline: number;
}

const Time = ({ deadline }: TimeProps) => {
  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(deadline)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div>
      <p>Remaining time: {remainingTime}</p>
      <button
        onClick={() => setRemainingTime(calculateRemainingTime(deadline))}
      >
        Start
      </button>
    </div>
  );
};

const calculateRemainingTime = (deadline: number): number => {
  return deadline - Date.now();
};
