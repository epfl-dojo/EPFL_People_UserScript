// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     https://people.epfl.ch/*
// @include     https://personnes.epfl.ch/*
// @version     1.3.2
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

// TODO: [ ] ask people to Tequila login if not
// TODO: [ ] improve the sciper query if people are logged in
// TODO: [x] get the username
// TODO: [ ] get the groups
// TODO: [ ] get the mailinglist
// TODO: [ ] add proper meta data on the phone number

$(document).ready(function () {

  function getScipterFromOnload() {
    var re = /sciper=([0-9]{6})/;
    try {
      var sciper = ($("html").html().match(re)[1])
      console.log(sciper)
    } catch (e) {
      throw new Error("No sciper found")
    }
    return sciper
  }

  let sciper = getScipterFromOnload()
  let username = $('dt:contains("Username")').next('dd').html()
  let unit = $('[itemprop="address"] > strong').html()

  // Add sciper after name in title
  $("#main > div.container > div.d-flex.flex-wrap.justify-content-between.align-items-baseline > h1").append(" #" + sciper);

  // Comfort, open admindata by default
  unsafeWindow.toggleVis('admin-data')

  // Create a new div to host specific content of this script
  $(".container:first > div > h1.mr-3").css('margin-bottom', '0px')
  $('<div class="d-flex flex-wrap justify-content-between align-items-baseline" id="EPFLPeopleUserScriptData"></div>').insertAfter(".container:first div:first");
  $('#EPFLPeopleUserScriptData').css('font-family', 'monospace')
  $('#EPFLPeopleUserScriptData').css('white-space', 'pre')
  $('#EPFLPeopleUserScriptData').append('<div>sciper: ' + sciper + '</div>')
  $('#EPFLPeopleUserScriptData').append('<div>username: ' + username + '</div>')
  $('#EPFLPeopleUserScriptData').append('<div>unit: ' + unit + '</div>')

});
