
var messageArray = [];
var friends = [];


// var characterReplace = function(string) {
//   //debugger;
//   // regex filter
//   if (string === undefined) {
//     string = 'undefined';
//   }
//   string = string.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, ''); 
//   return string;

// };


var app = {
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
      success: function(data) {
        _.each(data.results, function (arrayItem) {
          $('#chats').append('<div class="chat">' + 
            '<div class="username ' + _.escape(arrayItem.username) + '"">' + _.escape(arrayItem.username) + '</div>' + 
            '<br />' +  
            '<div class="text">' + _.escape(arrayItem.text) + '</div>' + '</div>');
          $('.username').click(function() {
            if (!_.contains(friends, $(this).text())) {
              friends.push($(this).text());
            }
            app.addFriend(arrayItem);
          });
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
  addFriend: function(messageObject) {

    //if the friends array contains the object's username
    if (_.contains(friends, messageObject.username)) {
      $('.' + messageObject.username).addClass('friend');
    }
    //change css on the message objects with that particular username
  }
};


$(document).ready(function() { 
  app.server = 'https://api.parse.com/1/classes/messages';
  app.init();
  setInterval(function() {
    app.fetch();
  }, 1000);
  
  $('form').submit(function(event) {
    event.preventDefault();
    console.log('submit function just ran');
    var message = {
      username: window.location.search.slice(10),
      text: _.escape($('.success').val()),
      roomname: $('select').val()
    };
    app.send(message);
    console.log('message sent from form!');

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
