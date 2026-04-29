import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [activeSession, setActiveSession] = useState(null);
  const [timer, setTimer] = useState(45 * 60); // 45 minutes

  useEffect(() => {
    let interval;
    if (activeSession && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      endSession();
    }
    return () => clearInterval(interval);
  }, [activeSession, timer]);

  const startSession = (topicId, difficulty) => {
    setActiveSession({
      id: `sess_${Date.now()}`,
      topicId,
      difficulty,
      startedAt: new Date().toISOString()
    });
    setTimer(45 * 60);
  };

  const endSession = () => {
    setActiveSession(null);
    setTimer(0);
    // Ideally flush final state to backend here
  };

  return (
    <SessionContext.Provider value={{ activeSession, startSession, endSession, timer }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
