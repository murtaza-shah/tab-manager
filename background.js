chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == "getTabs") {
    chrome.tabs.query({}, function (tabs) {
      sendResponse(tabs);
    });
  }
  if (request.type == "notification") {
    chrome.notifications.create("", request.options);
  }
  return true;
});
