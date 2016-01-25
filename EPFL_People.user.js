// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     http://people.epfl.ch/*
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author      EPFL-dojo
// ==/UserScript==

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function()
{
  // get the h1 name content
  var h1name = $("h1").text();
  // get the sciper number
  var sciper = $('a[href*="http://people.epfl.ch/cgi-bin/people?id="]').attr('href').match(/id=([0-9]{6})/)[1];
  // change the main title content to add the sciper in it
  $("h1").text(h1name + " #" + sciper);
});
