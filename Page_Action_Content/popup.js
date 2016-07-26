chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: "http://google.com"}, function(tab) {
  });
});
