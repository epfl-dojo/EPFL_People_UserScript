// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     https://people.epfl.ch/*
// @include     https://personnes.epfl.ch/*
// @version     1.3.1
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

// TODO: [ ] ask people to Tequila login if not
// TODO: [ ] improve the sciper query if people are logged in
// TODO: [ ] get the username
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
      // Exit the script if sciper not found
      throw new Error("No sciper found")
    }
    return sciper
  }

  // Add sciper after name in title
  $("#main > div.container > div.d-flex.flex-wrap.justify-content-between.align-items-baseline > h1").append(" #" + getScipterFromOnload())

  // Comfort, open adminstrative data by default
  $('span:contains("Administrative data")').parent().click()

});

