export function getSessionId() {
  let sessionId = localStorage.getItem("anon_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("anon_session_id", sessionId);
  }
  return sessionId;
}