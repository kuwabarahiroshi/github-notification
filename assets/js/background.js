/**
 *
 *
 *
 */
var channelId;
chrome.runtime.onInstalled.addListener(function () {
  chrome.pushMessaging.getChannelId(true, function (channel) {
    channelId = channel.channelId;
    console.log(channel.channelId);
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.notification_server) {
    registerChannelId(request.notification_server, channelId);
  }
});

/*
chrome.pushMessaging.getChannelId(true, function (channel) {
  channelId = channel.channelId;
});
*/

chrome.pushMessaging.onMessage.addListener(function (message) {
  console.log(message);
  var notificationId = 'test'; // TODO: should be commit hash
  chrome.notifications.create(notificationId, {}, function (notificationId) {
    console.log('notified');
  });
});

function registerChannelId(server, channelId) {
  var xhr = new XMLHttpRequest(),
      data = new FormData();
  data.append('channelId', channelId);

  xhr.open('POST', server, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      console.log('registered');
    }
  };
  console.log('channelId=' + channelId);
  xhr.send(data);
}
