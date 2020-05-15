// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     https://people.epfl.ch/*
// @include     https://personnes.epfl.ch/*
// @version     1.3
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

//Avoid conflicts

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function () {
  var re = /sciper=([0-9]{6})/;
  let sciper = ($("html").html().match(re)[1]);
  $("#main > div.container > div.d-flex.flex-wrap.justify-content-between.align-items-baseline > h1").append(" #" + sciper);
  console.log(sciper)
});