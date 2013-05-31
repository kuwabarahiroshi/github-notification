(function ($) {
  function addSubscribingRepository() {
    chrome.storage.sync.get({'repositories': []}, function (items) {
      var repositories = items.repositories
        , repository = $('#repository-input').val();

      if (repositories.indexOf(repository) < 0) {
        repositories.push(repository);
        chrome.storage.sync.set(items);
        appendRepositoryView(repository, /* animate = */ true);
      }

      subscribe(repositories);
    });
  }

  function appendRepositoryView(repository, animate) {
    var li = document.createElement('li');
    $(li)
      .appendTo('#subscribing')
      .html('<a class="url"></a><span class="remove"><img src="/assets/img/icons/delete.png" width="16" alt="delete"></span>')
      .find('.url').attr('href', repository).text(repository);

    if (animate) {
      $(li).hide().fadeIn();
    }
  }

  function removeRepositoryFromList() {
    $li = $(this).parent();
    unsubscribe($li.find('a').attr('href'));

    $(this).parent().fadeOut(function () {
      $(this).remove();
      var repositories = $('#subscribing li a').toArray().map(function (a) {
        return $(a).attr('href');
      });
      chrome.storage.sync.set({'repositories': repositories});
    });
  }

  function subscribe(repositories) {
    var request = {
      'subscribe': repositories
    };

    $('#loading').show();
    $('#btn-text').hide();

    chrome.runtime.sendMessage(request, function (response) {
      console.log(response);
      $('#loading').hide();
      $('#btn-text').show();
    });
  }

  function unsubscribe(repository) {
    var request = {
      'unsubscribe': [repository]
    }
    chrome.runtime.sendMessage(request, function (response) {
    });
  }

  $('#repository-input').on('keydown', function (event) {
    if (event.keyCode == 13) {
      addSubscribingRepository();
    }
  });
  $('#update-btn').on('click', addSubscribingRepository);
  $(document).on('click', '.remove', removeRepositoryFromList);

  chrome.storage.sync.get({'repositories': []}, function (items) {
    items.repositories.forEach(function (repository) {
      appendRepositoryView(repository, /* animate = */ false);
    });
  });
}(jQuery));
