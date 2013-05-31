/**
 *
 *
 *
 */
const PUSH_SERVER = 'http://github-notification.herokuapp.com';

chrome.pushMessaging.getChannelId(true, function (channel) {
  var channelId = channel.channelId;

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.subscribe || request.unsubscribe) {
      updateSubscription(request, channelId, sendResponse);
    }
    return true;
  });
});

chrome.pushMessaging.onMessage.addListener(function (message) {
  var payload;
  try {
    payload = JSON.parse(message.payload);
  } catch (e) {
    console.error(e);
  }

  if (!payload) return;
  console.log('payload: ', payload);

  var notificationId = payload.hash
    , date = new Date(payload.at)
    , opt = {
      type: 'basic',
      title: 'New push from "' + payload.pusher + '"',
      message: 'repository: ' + payload.url + '\nat: ' + date + '\ncommits: ' + payload.commits,
      iconUrl: '/assets/img/github.png'
    };

  var notif = webkitNotifications.createNotification(
    opt.iconUrl,
    opt.title,
    opt.message
  );
  console.log(notif);
  notif.show();

/**
 * chrome.notifications APIはwindows, chromeOSのみ対応
 *
  chrome.notifications.create(notificationId, opt, function (notificationId) {
    console.log('notified');
  }).show();

  *
  */

});

function updateSubscription(request, channelId, sendResponse) {
  var xhr = new XMLHttpRequest(),
      data = new FormData();

  request['channelId'] = channelId;
  data.append('request', JSON.stringify(request));

  xhr.open('POST', PUSH_SERVER + '/register', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        sendResponse({status: 'OK', subscribed: request});
      } else {
        sendResponse({status: 'NG', subscribed: request});
      }
    }
  };
  xhr.send(data);
}
