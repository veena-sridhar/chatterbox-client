
var messageArray = [];
var friends = [];
var app = {
  lastMessageId: 0,

  init: function() {
    if (!/(&|\?)username=/.test(window.location.search)) {
      var newSearch = window.location.search;
      if (newSearch !== '' & newSearch !== '?') {
        newSearch += '&';
      }
      newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
      window.location.search = newSearch;
      console.log('this is the init function');
    }

    setInterval(app.fetch, 2000);
    
  },

  send: function(message) {
    console.log('message is: ', message);
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('Inside send success method');
        $('.success').val('');
        messageArray.push(data);

      },
    });
  },
  fetch: function () {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: { order: '-createdAt'},
      success: function(data) {
        if (!data.results || !data.results.length) {
          return;
        }
        var mostRecentMessage = data.results[data.results.length - 1];
        var displayedRoom = $('select').val();
        $('.username').click(function() {
          app.addFriend($(this).text());
        });
        _.each(data.results, function (arrayItem) {
          if (mostRecentMessage.objectId !== app.lastMessageId || arrayItem.roomname !== displayedRoom) {
            if (arrayItem.text && arrayItem.username) {
              $('#chats').append('<div class="chat">' + 
                '<div class="username ' + _.escape(arrayItem.username) + '"">' + _.escape(arrayItem.username) + '</div>' + 
                '<br />' +  
                '<div class="text">' + _.escape(arrayItem.text) + '</div>' + '</div>');
            }
          }
          app.lastMessageId = mostRecentMessage.objectId;
        });
        
      }
    });
  },
  clearMessages: function () {
    var toRemove = document.getElementById('chats');
    while (toRemove.firstChild) {
      toRemove.removeChild(toRemove.firstChild);
    }
  },
  addMessage: function (messageObject) {
    var cleanMessage = _.escape(messageObject.text);
    $('#chats').append('<div class="chat">' +
      '<div class="username">' + window.location.search.slice(10) + '</div>' +
      '<br />' +
      cleanMessage + '</div>');

  },
  addRoom: function (roomObject) {
    var roomName = roomObject.roomname;
    $('select').append('<option value =' + '"' + roomName + '">' + roomName + '</option>');
  },
  addFriend: function(userName) {
    if (_.contains(friends, userName)) {
      return;
    } else {
      $('.' + userName).addClass('friend');
      friends.push(userName);
      $('.friendList').append('<li class="friendName">' + friends[friends.length - 1] + '</li>');
    }
  }
};


$(document).ready(function() { 
  app.server = 'https://api.parse.com/1/classes/messages';
  app.init();
  app.fetch();

  // var displayFriend = function () {
  //   $('.friendList').append('<li class="friendName">' + friends[friends.length - 1] + '</li>');
  // };

  $('form').submit(function(event) {
    event.preventDefault();
    var message = {
      username: window.location.search.slice(10),
      text: _.escape($('.success').val()),
      roomname: $('select').val()
    };
    app.send(message);
  });

  $('.username').on('click', function() {
    var message = {
      username: window.location.search.slice(10),
      text: _.escape($('.success').val()),
      roomname: $('select').val()
    };
    app.addFriend(message);
  
  });



    // $('body').on('click', '.usernameclick(function(event) {
    // console.log('handling the click on username');
    // // if (!_.contains(friends, $(this).text())) {
    // //   friends.push($(this).text());
    // // }
  // });

  //$('body').css('background-image', 'url("http://sharocity.com/wp-content/uploads/2012/11/Rollin-Yoda-Internet-Meme.jpg")');

});
