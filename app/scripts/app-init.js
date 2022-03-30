// eslint-disable-next-line
let initialized = false;
// eslint-disable-next-line import/unambiguous
function tryImport(...fileNames) {
  try {
    // eslint-disable-next-line
    importScripts(...fileNames);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// eslint-disable-next-line
chrome.runtime.onConnect.addListener((remotePort) => {
  if (!initialized) {
    console.log('APP-INIT OnConnect - not initalized. Importing scripts now!');
    importAllScripts();
    if (remotePort?.name === 'popup') {
      console.log(
        'NOW ATTEMPTING TO SEND MESSAGE with remoteport:',
        remotePort,
      );
      chrome.runtime.sendMessage(remotePort?.sender?.id, {
        type: 'REMOTE_PORT',
        remotePort,
      });
    }
  }
});

// eslint-disable-next-line
self.oninstall = () => {
  console.log('ON INSTALL');
  return importAllScripts();
};

// eslint-disable-next-line
function importAllScripts() {
  tryImport('./globalthis.js');
  tryImport('./sentry-install.js');
  tryImport('./runtime-lavamoat.js');
  tryImport('./lockdown-more.js');
  tryImport('./policy-load.js');

  const fileList = [
    /** FILE NAMES */
  ];

  fileList.forEach((fileName) => tryImport(fileName));

  initialized = true;
  console.log('FINISHING IMPORT ALL SCRIPTS');
}
