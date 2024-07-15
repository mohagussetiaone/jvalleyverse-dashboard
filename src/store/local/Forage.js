import localforage from "localforage";

export function setSession(token) {
  return localforage.setItem("userSession", token);
}

export async function removeSession(token) {
  return localforage.removeItem("userSession", token);
}

export function setSessionData(token) {
  return localforage.setItem("sessionData", token);
}

export function getSessionData() {
  return localforage.getItem("sessionData");
}

export async function removeSessionData(token) {
  return localforage.removeItem("sessionData", token);
}
