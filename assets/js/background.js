/**
 *
 *
 *
 */
const PUSH_SERVER = 'http://github-notification.192.168.11.16.xip.io';

chrome.runtime.onInstalled.addListener(function () {
  chrome.pushMessaging.getChannelId(true, function (channel) {
    var channelId = channel.channelId;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.subscribe || request.unsubscribe) {
        updateSubscription(request, channelId, sendResponse);
      }
      return true;
    });
  });
});


chrome.pushMessaging.onMessage.addListener(function (message) {
  console.log(message);
  var notificationId = 'test'; // TODO: should be commit hash
  chrome.notifications.create(notificationId, {}, function (notificationId) {
    console.log('notified');
  });
});

function updateSubscription(request, channelId, sendResponse) {
  var xhr = new XMLHttpRequest(),
      data = new FormData();

  request['channelId'] = channelId;
  data.append('request', JSON.stringify(request));

  xhr.open('POST', PUSH_SERVER + '/register', true);
  xhr.onreadystatechange = function () {
    console.log(xhr.readyState, XMLHttpRequest.DONE);
    if (xhr.readyState == XMLHttpRequest.DONE) {
    console.log(xhr.status);
      if (xhr.status == 200) {
        sendResponse({status: 'OK', subscribed: request});
      } else {
        sendResponse({status: 'NG', subscribed: request});
      }
    }
  };
  xhr.send(data);
}
