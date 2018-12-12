// ==UserScript==
// @name        EPFL People
// @namespace   none
// @version     1.3.5
// @author      EPFL-dojo
// @description A script to improve browsing on people.epfl.ch
// @include     https://people.epfl.ch/*
// @include     https://personnes.epfl.ch/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @connect     self
// @run-at      document-end
// @homepage    https://github.com/ponsfrilus/EPFL_People_UserScript/
// @homepageURL https://github.com/ponsfrilus/EPFL_People_UserScript/
// @hwebsite    https://github.com/ponsfrilus/EPFL_People_UserScript/
// @source      https://github.com/ponsfrilus/EPFL_People_UserScript/
// @downloadURL https://github.com/ponsfrilus/EPFL_People_UserScript/raw/master/EPFL_People.user.js
// @updateURL   https://github.com/ponsfrilus/EPFL_People_UserScript/raw/master/EPFL_People.user.js
// @supportURL  https://github.com/ponsfrilus/EPFL_People_UserScript/issues
// @icon        https://github.com/ponsfrilus/EPFL_People_UserScript/raw/master/img/epfl_search_people.png
// @iconURL     https://github.com/ponsfrilus/EPFL_People_UserScript/raw/master/img/epfl_search_people.png
// @defaulticon https://github.com/ponsfrilus/EPFL_People_UserScript/raw/master/img/epfl_search_people.png
// ==/UserScript==

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
  
  console.log("Userscript EPFL People");

  /**
   * FIRST PART: data manipulation with unlogged users
   **/
  
  // Add link for everry part of the unit path
  // TODO:  add "title" attribute with the full unit name
  // DEBUG: console.log($('*[itemprop="location"] > *[itemprop="name"]').text());
  $('*[itemprop="location"] > *[itemprop="name"]').each(function(i, c){
    var unitPath = '';
    $(this).text().split(" ").forEach(function(el){
      if (el) {
        unitPath = unitPath + '<a href="https://search.epfl.ch/?filter=unit&q=' + el + '">' + el + '</a> ';
      }
    });
    $(this).html(unitPath); // setting text
  });
  
  // TODO:  Make the email selectable

  
  /**
   * SECOND PART: data manipulation with logged users
   **/
  $.epfl_user = {
    "name": $("h1").text(),
    "sciper": $('a[href*="https://people.epfl.ch/cgi-bin/people?id="]').attr('href').match(/id=([0-9]{6})/)[1]
  };
  
  $.epfl_user.rooms = $('a[href*="http://plan.epfl.ch/?room="]').map(function() {
    return this.text;
  }).toArray();
  
  $('span.unit-name').each(function(){
    var that = $(this);
    var unitName = that.parent().find('a').last().text();
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://search.epfl.ch/ubrowse.action?acro=" + unitName,
      onload: function(response) {
        var html = $.parseHTML( response.responseText );
        var unitHref = $(html).find('a[href*="http://infowww.epfl.ch/imon-public/OrgUnites.detail?ww_i_unite="]').attr('href');
        var unitId = unitHref.match(/ww_i_unite=([0-9]{4,6})/)[1];
        that.parent().parent().parent().append("(<a href='" + unitHref + "'>#" + unitId + "</a>)");
      }
    });
  });

  // change the main title content to add the sciper in it
  $("h1").text($.epfl_user["name"] + " #" + $.epfl_user["sciper"] + " ()");
  $.get("/cgi-bin/people/showcv?id=" + $.epfl_user["sciper"] + "&op=admindata&type=show&lang=en&cvlang=en", function(data){
    $.epfl_user["username"] = data.match(/Username: (\w+)\s/)[1];
    $("h1").text($.epfl_user["name"] + " #" + $.epfl_user["sciper"] + " (" + $.epfl_user["username"]+ ")");
    $('.presentation').append('Username : ' + $.epfl_user["username"]+'<br />');
  });
  $('.presentation').append('Sciper : ' + $.epfl_user["sciper"]+'<br />');
    
  function absURL(url, needle, replacement) {
    return url.replace(needle, replacement);
  }

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
        $('.right-col').append('<h4>Mailing Lists</h4><div id="cadiMLdiv"><ul id="cadiML">cadiML</ul></div>');
        $('#cadiML').html(mailinglistUL);
        // replace cadi's relative URL with absolute URL
        $('#cadiML a').each(function(){
          this.href = absURL(this.href, window.location.origin, 'http://cadiwww.epfl.ch');
        });
      }
      // Group list emails
      grouplistUL = $(html).contents('ul').last();
      if (0 < grouplistUL.length) {
        $('.right-col').append('<br /><h4>Groups Lists</h4><div id="cadiGLdiv"><ul id="cadiGL">cadiGL</ul></div>');
        $('#cadiGL').html(grouplistUL);
        // replace cadi's relative URL with absolute URL
        $('#cadiGL a').each(function(){
          this.href = absURL(this.href, window.location.origin, 'http://cadiwww.epfl.ch');
        });
      }
    }
  });
  GM_addStyle("#cadiMLdiv{ padding-left: 20px; } #cadiML ul ul { margin-left: 10px; }" );
  GM_addStyle("#cadiGLdiv{ padding-left: 20px; } #cadiGL ul ul { margin-left: 10px; }" );
});
