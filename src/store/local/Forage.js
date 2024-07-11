import localforage from "localforage";

export function set(token) {
  return localforage.setItem("userSession", token);
}

export async function remove(token) {
  return localforage.removeItem("userSession", token);
}
