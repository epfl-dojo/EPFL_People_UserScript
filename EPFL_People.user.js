// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     http://people.epfl.ch/*
// @include     https://people.epfl.ch/*
// @version     1.0.8
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// @updateURL   https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function()
{
  // get the h1 name content
  $.epfl_user = {
      "name": $("h1").text(),
      "sciper": $('a[href*="https://people.epfl.ch/cgi-bin/people?id="]').attr('href').match(/id=([0-9]{6})/)[1]
  };
  // change the main title content to add the sciper in it
  $("h1").text($.epfl_user["name"] + " #" + $.epfl_user["sciper"] + " ()");

  $.get("/cgi-bin/people/showcv?id=" + $.epfl_user["sciper"] + "&op=admindata&type=show&lang=en&cvlang=en", function(data){
    $.epfl_user["username"] = data.match(/Username: (\w+)\s/)[1];
    $("h1").text($.epfl_user["name"] + " #" + $.epfl_user["sciper"] + " (" + $.epfl_user["username"]+ ")");
    $('.presentation').append('Username : ' + $.epfl_user["username"]+'<br />');
  });
  $('.presentation').append('Sciper : ' + $.epfl_user["sciper"]+'<br />');
  
  // Add user's mailing list in the right column
  var cadiURL = 'http://cadiwww.epfl.ch/listes?sciper='+$.epfl_user["sciper"];
  GM_xmlhttpRequest({
    method: "GET",
    url: cadiURL,
    onload: function(response) {
      html = $.parseHTML( response.responseText );
      // Mailing list emails
      mailinglistUL = $(html).contents('ul').not(':last');
      if (0 < mailinglistUL.length) {
        $('.right-col').append('<h4>Mailing Lists</h4><div id="cadiMLdiv"><ul id="cadiML">test</ul></div>');
        $('#cadiML').html(mailinglistUL);
      }
      // Group list emails
      grouplistUL = $(html).contents('ul').last();
      if (0 < grouplistUL.length) {
        $('.right-col').append('<br /><h4>Groups Lists</h4><div id="cadiGLdiv"><ul id="cadiGL">test</ul></div>');
        $('#cadiGL').html(grouplistUL);
      }
    }
  });
  GM_addStyle("#cadiMLdiv{ padding-left: 20px; } #cadiML ul ul { margin-left: 10px; }" );
  GM_addStyle("#cadiGLdiv{ padding-left: 20px; } #cadiGL ul ul { margin-left: 10px; }" );
  
  // var adminDataURL = "http://people.epfl.ch/cgi-bin/people?id="+sciper+"&op=admindata&lang=en&cvlang=en";
  /* Idea => add accred link
    <div class="button accred">
    <a href="http://accred.epfl.ch/accred/accreds.pl/userinfo?thescip=136597">
      <button class="icon"></button>
      <span class="label"> Accreditations of Jean-Claude&nbsp;De Giorgi (fr)</span>
    </a>
  </div>*/
});
