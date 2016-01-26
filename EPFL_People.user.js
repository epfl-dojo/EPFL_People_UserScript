// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     http://people.epfl.ch/*
// @version     1
// @grant       GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author      EPFL-dojo
// ==/UserScript==

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
  // get the h1 name content
  var h1name = $("h1").text();
  // get the sciper number
  var sciper = $('a[href*="http://people.epfl.ch/cgi-bin/people?id="]').attr('href').match(/id=([0-9]{6})/)[1];
  // change the main title content to add the sciper in it
  $("h1").text(h1name + " #" + sciper);

  // http://wiki.greasespot.net/GM_xmlhttpRequest
  // Note that for cross-domain request GM_xmlhttpRequest needs grant
  var cadiURL = 'http://cadiwww.epfl.ch/listes?sciper=' + sciper;
  GM_xmlhttpRequest({
    method: "GET",
    url: cadiURL,
    onload: function(response) {
      alert(response.responseText);
      html = $.parseHTML(response.responseText);
      mailinglistUL = $(html).find("ul");
      $('#footer').before(mailinglistUL);
    }
  });
  
  var cadiURL = 'http://cadiwww.epfl.ch/listes?sciper='+sciper;
  console.log(cadiURL);
  GM_xmlhttpRequest({
    method: "GET",
    url: cadiURL,
    onload: function(response) {
      html = $.parseHTML( response.responseText );
      mailinglistUL = $(html).contents('ul');
      console.log(mailinglistUL);
      $('.right-col').append('<div id="cadiMLdiv"><h4>Mailing List</h4><ul id="cadiML">test</ul></div>');
      $('#cadiML').html(mailinglistUL);
    }
  });
  GM_addStyle("#cadiMLdiv{ padding-left: 20px; } #cadiML ul ul { margin-left: 10px; }" );
  
  // var adminDataURL = "http://people.epfl.ch/cgi-bin/people?id="+sciper+"&op=admindata&lang=en&cvlang=en";
  /* Idea => add accred link
    <div class="button accred">
    <a href="http://accred.epfl.ch/accred/accreds.pl/userinfo?thescip=136597">
      <button class="icon"></button>
      <span class="label"> Accreditations of Jean-Claude&nbsp;De Giorgi (fr)</span>
    </a>
  </div>*/
});
