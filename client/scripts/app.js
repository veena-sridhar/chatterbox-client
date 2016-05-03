
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



// var characterReplace = function(strTemp) { 
// strTemp = strTemp.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, ''); 
//   return strTemp;
// }; 


var characterReplace = function(string) {
  //debugger;
  // regex filter
  string = string.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, ''); 
  var newString = '';
  if (typeof string !== 'string') {
    string = JSON.stringify(string);
  } else if (string === undefined) {
    newString += 'undefined';
  } else if (typeof string === 'string') {
    for (var i = 0; i < string.length; i++) {
      if (escapeCharacters.hasOwnProperty[string[i]]) {
        newString += escapeCharacters[string[i]];
      } else {
        newString += string[i];
      }
    }
    return newString;
  }
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
            '<div class="username">' + characterReplace(arrayItem.username) + '</div>' + 
            '<br />' + 
            characterReplace(arrayItem.text) + '</div>');
        });
      }
    });
  },
  clearMessages: function () {

  }
};

// YOUR CODE HERE:

$(document).ready(function() { 
  app.server = 'https://api.parse.com/1/classes/messages';
  app.init();
  app.fetch();
  
  
  $('form').submit(function(event) {
    event.preventDefault();
    console.log('submit function just ran');
    var message = {
      username: window.location.search.slice(10),
      text: characterReplace($('.success').val()),
      roomname: $('select').val()
    };
    app.send(message);
    console.log('message sent from form!');


  });

// $('body').css('background-image', 'url("https://cdn.meme.am/instances/500x/52835032.jpg")');



});
