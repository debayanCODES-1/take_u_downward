import { useState, useEffect, useRef } from 'react';

export function useProctoring(sessionId) {
  const [violations, setViolations] = useState([]);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // 1. Request Camera Access
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
      } catch (err) {
        setCameraError('Camera/Microphone access denied or unavailable.');
        recordViolation('camera_missing', 'High', 'User denied media access');
      }
    }
    setupCamera();

    // 2. Setup WebSocket for real-time reporting
    wsRef.current = new WebSocket('ws://localhost:3000/ws/proctor');
    wsRef.current.onopen = () => console.log('Connected to proctor engine');

    // 3. Tab Visibility Monitoring (Visibility API)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('tab_switch', 'Medium', 'User switched tabs or minimized browser');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. Window Blur Monitoring
    const handleBlur = () => {
      recordViolation('window_blur', 'Medium', 'Window lost focus');
    };
    window.addEventListener('blur', handleBlur);

    // 5. Screenshot Key Blocking
    const handleKeyDown = (e) => {
      // PrintScreen, Cmd+Shift+3/4 (Mac) handling
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        recordViolation('screenshot_attempt', 'High', `Key combo blocked: ${e.key}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // 6. Right click block
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      if (wsRef.current) wsRef.current.close();
    };
  }, [sessionId]);

  const recordViolation = (type, severity, details) => {
    const violation = {
      sessionId,
      type,
      severity,
      metadata: details,
      timestamp: new Date().toISOString()
    };
    
    setViolations(prev => [...prev, violation]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(violation));
    }
  };

  return { stream, violations, cameraError };
}
