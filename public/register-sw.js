"use strict";

async function registerSW() {
  if (!navigator.serviceWorker) {
    throw new Error('This browser does not support service workers.');
  }

  await navigator.serviceWorker.register('/sw.js');
}