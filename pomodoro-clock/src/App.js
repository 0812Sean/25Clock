import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const beepRef = useRef(null);
  
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60 && !isRunning) setBreakLength(breakLength + 1);
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1 && !isRunning) setBreakLength(breakLength - 1);
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60 && !isRunning) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1 && !isRunning) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isRunning) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            // Play beep sound and switch mode
            if (beepRef.current) {
              try {
                beepRef.current.play();
              } catch (error) {
                console.error('Audio playback failed:', error);
              }
            }
            setIsSession(!isSession);
            return isSession ? breakLength * 60 : sessionLength * 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [isRunning, isSession, breakLength, sessionLength]);

  return (
    <div id="clock-container">
      <h1>25 + 5 Clock</h1>

      <div id="break-label">Break Length</div>
      <div className="break-controls">
        <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={handleBreakIncrement}>+</button>
      </div>

      <div id="session-label">Session Length</div>
      <div className="session-controls">
        <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-increment" onClick={handleSessionIncrement}>+</button>
      </div>

      <div id="timer-label">{isSession ? "Session" : "Break"}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

      <button id="start_stop" onClick={handleStartStop}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button id="reset" onClick={handleReset}>Reset</button>

      <audio
        id="beep"
        ref={beepRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
      />
    </div>
  );
}

export default App;
