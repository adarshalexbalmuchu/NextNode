
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('neural-session-id');
  
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('neural-session-id', sessionId);
  }
  
  return sessionId;
};
