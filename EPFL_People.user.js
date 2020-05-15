// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     https://people.epfl.ch/*
// @include     https://personnes.epfl.ch/*
// @version     1.4
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

//Avoid conflicts

$(document).ready(function () {
  let sciper = ($("html").html().match("/sciper=/"))
  console.log(sciper)
});
