// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     http://people.epfl.ch/*
// @version     1.0.5
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// @updateURL   https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);


var initEpflApi = function() {
    epfl4 = new epfl.API();
    epfl4.createMap({
        layers: [],
        div: 'mymap4'
    });
    epfl4.search('ME A2 424');
};
$(document).ready(function()
{

  // Multiline Function String - Nate Ferrero - Public Domain
  // http://stackoverflow.com/questions/4376431/javascript-heredoc
  function hereDoc (f) {
      return f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
  };
  $(".unit_popup").prepend('<div id="mymap4" style="width:500px;height:300px;border:1px solid grey;float:left;margin:10px !important;"></div>');


  var extbaseloaded = false;
  var extloaded = false;
  var epflloaded = false;

  var head= document.getElementsByTagName('head')[0];

  var loadext = function() {
      var script= document.createElement('script');
      script.type= 'text/javascript';
      script.onload = function() {
        extloaded = true;
        loadepfl();
      };
      script.onreadystatechange = function () {
          if (this.readyState == 'loaded' && !extloaded) {
              loadepfl();
          }
      };
      head.appendChild(script);
      script.src= 'http://plan.epfl.ch/mfbase/ext/ext-all.js';
  };

  var loadepfl = function() {
      var script= document.createElement('script');
      script.type= 'text/javascript';
      script.onload = function() {
        epflloaded = true;
        initEpflApi();
      };
      script.onreadystatechange = function () {
          if (this.readyState == 'loaded' && !epflloaded) {
              initEpflApi();
          }
      };
      head.appendChild(script);
      script.src= 'http://plan.epfl.ch/build/epfl.js?uuid=1602050647';
  };

  var script= document.createElement('script');
  script.type= 'text/javascript';
  script.onload = function() {
    extbaseloaded = true;
    loadext();
  };
  script.onreadystatechange = function () {
      if (this.readyState == 'loaded' && !extbaseloaded) {
          loadext();
      }
  };
  head.appendChild(script);
  script.src= 'http://plan.epfl.ch/mfbase/ext/adapter/ext/ext-base.js';




  //$("body").prepend(EPFLplanLoader);
  /*var initEpflApi = function() {
      epfl4 = new epfl.API();
      epfl4.createMap({
          layers: [],
          div: 'mymap4'
      });
      epfl4.search('ME A2 424');
  };*/
  /*var script = document.createElement('script');
  script.src = "http://plan.epfl.ch/mfbase/ext/ext-all.js";
  document.body.appendChild(script);
  let script2 = document.createElement('script');
  script2.src = "http://plan.epfl.ch/mfbase/ext/adapter/ext/ext-base.js";
  document.body.appendChild(script2);
  let script3 = document.createElement('script');
  script3.src = "http://plan.epfl.ch/build/epfl.js?uuid=1602050645";
  document.body.appendChild(script3); */

  // get the h1 name content
  $.epfl_user = {
      "name": $("h1").text(),
      "sciper": $('a[href*="http://people.epfl.ch/cgi-bin/people?id="]').attr('href').match(/id=([0-9]{6})/)[1]
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
      mailinglistUL = $(html).contents('ul');
      $('.right-col').append('<h4>Mailing List</h4><div id="cadiMLdiv"><ul id="cadiML">test</ul></div>');
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
