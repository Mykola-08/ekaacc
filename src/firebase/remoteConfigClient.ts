import { firebaseServices } from './firebaseClient';
import { fetchAndActivate, getString } from 'firebase/remote-config';

export async function initRemoteConfig() {
  const { remoteConfig } = firebaseServices;
  if (!remoteConfig) return;
  try {
    await fetchAndActivate(remoteConfig);
    console.log("Remote config fetched and activated.");
  } catch (error) {
    console.error("Remote config fetch failed:", error);
  }
}

export function getFlag(name: string): string {
  const { remoteConfig } = firebaseServices;
  if (!remoteConfig) return "";
  return getString(remoteConfig, name);
}
