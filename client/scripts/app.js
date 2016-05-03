
var messageArray = [];


var escapeCharacters = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&apos;',
  '"': '&dblac;',
  '`': '&grave;',
  ',': '&comma;',
  '!': '&excl;',
  '@': '&commat;',
  '$': '&dollar;',
  '%': '&percnt;',
  '(': '&lpar;',
  ')': '&rpar;',
  '=': '&equals;',
  '+': '&plus;',
  '{': '&lcub;',
  '}': '&rcub;',
  '[': '&lsqb;',
  ']': '&rsqb;'

};

var characterReplace = function(string) {
  var newString = '';
  for (var i = 0; i < string.length; i++) {
    if (escapeCharacters.hasOwnProperty[string[i]]) {
      newString += escapeCharacters[string[i]];
    } else {
      newString += string[i];
    }
  }
  return newString;
};






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
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        $('.success').val('');
        messageArray.push(data);
        //$('#chats').append('<div class="chats">' + message + '</div>');
      }
    });
  },
  fetch: function () {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function(data) {
        messageArray.push(data);
      }
    });
  }
};

// YOUR CODE HERE:
$(document).ready(function() { 

  app.init();
  
  
  $('form').submit(function() {
    var message = {
      username: window.location.search.slice(10),
      userMessage: characterReplace($('.success').val()),
      roomname: $('select').val()
    };
    app.send(userMessage);
    event.stopPropagation();
    console.log('message sent from form!');
  });









});