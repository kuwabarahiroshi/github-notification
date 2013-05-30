document.getElementById('button').addEventListener('click', function () {
  console.log('button clicked');
  var server = document.getElementById('push-server').value;
  var request = {
    'notification_server': server
  };
  chrome.runtime.sendMessage(request, function (response) {
  });
});
