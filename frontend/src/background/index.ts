
import {
  getVideo,
  addVideo,
} from './api' 
import { LocalStorageUser, LocalStorageVideo } from './storage';

let user: LocalStorageUser = {
  mode: false,
  isAdmin: false,
  pauseEnable: false,
  visitedEnable: false,
};

let video: LocalStorageVideo = {
  videoId: '',
  title: '',
  status: 'null',
}

chrome.runtime.onInstalled.addListener((object) => {
  chrome.storage.sync.set({ user });
  chrome.storage.local.set({ video });
  let internalUrl = chrome.runtime.getURL("options.html");
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: internalUrl });
  }
})

/*
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "API_CALL") {
    const { endpoint, method = "GET", body, token } = message.payload;

    fetch(`https://cosight.onrender.com/api/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    })
      .then(async (res) => {
        const json = await res.json();
        sendResponse({ success: true, data: json });
      })
      .catch((err) => {
        sendResponse({ success: false, error: err.message });
      });

    return true; // Keep channel open for async response
  }
});
*/
