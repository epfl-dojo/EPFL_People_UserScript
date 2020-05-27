// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     https://people.epfl.ch/*
// @include     https://personnes.epfl.ch/*
// @include     https://search.epfl.ch/?filter=people&*
// @version     1.4.0
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM.setValue
// @grant       GM.getValue
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

// TODO: [ ] ask people to Tequila login if not
// TODO: [x] improve the sciper query if people are logged in
// TODO: [x] get the username
// TODO: [ ] get the groups
// TODO: [ ] get the mailinglist
// TODO: [x] add proper meta data on the phone number

$( document ).ready( async function () {

  async function getInfoFromPeopleAPI( needle ) {
    var people = 'https://search-api.epfl.ch/api/ldap?q=' + needle;
    GM_xmlhttpRequest({
      method: 'GET',
      url: people,
      onload: async function( response ) {
        html = $.parseJSON( response.responseText )
        // console.log(html)
        await GM.setValue( 'searchAPIData', html )
      }
    })
  }
  
  // In case we are on https://search.epfl.ch/?filter=people&
  if ( document.URL.includes( 'https://search.epfl.ch' ) ) {
    console.log( 'Mode: list' )
    const urlParams = new URLSearchParams( window.location.search )
    const q = urlParams.get( 'q' )
    await getInfoFromPeopleAPI( q )
    const users = await GM.getValue( 'searchAPIData' )
    // console.log(users)
    $( 'a[class=result]' ).each(function( index, value ) {
      //console.log( index + ': ' + $( this ).attr( 'href' ) )
      $( this ).after(' #' + users[index].sciper )
    })
  } 

  if ( document.URL.includes( 'https://people.epfl.ch/' ) ) {
    console.log( 'Mode: defails' )
    await getInfoFromPeopleAPI( document.title )
    const users = await GM.getValue( 'searchAPIData' )
    const user = users[0]
    // console.log(user)

    const sciper   = user.sciper
    const username = $( 'dt:contains("Username")' ).next( 'dd' ).html()

    // Add sciper after name in title
    $( '#main > div.container > div.d-flex.flex-wrap.justify-content-between.align-items-baseline > h1' ).append( ' #' + sciper )

    // Comfort, open admindata by default
    unsafeWindow.toggleVis( 'admin-data' )

    // Create a new div to host specific content of this script
    $( '.container:first > div > h1.mr-3' ).css( 'margin-bottom','0px' )
    $( '<div class="d-flex flex-wrap justify-content-between align-items-baseline" id="EPFLPeopleUserScriptData"></div>' ).insertAfter( '.container:first div:first' )
    $( '#EPFLPeopleUserScriptData' ).css( 'font-family', 'monospace' )
    $( '#EPFLPeopleUserScriptData' ).css( 'white-space', 'pre' )
    $( '#EPFLPeopleUserScriptData' ).append( '<div>sciper: ' + sciper + '</div>' )
    $( '#EPFLPeopleUserScriptData' ).append( '<div>username: ' + username + '</div>' )
    $( '#EPFLPeopleUserScriptData' ).append( '<div>email: ' + user.email + '</div>' )
    $( '#EPFLPeopleUserScriptData' ).append( '<div>unit: ' + user.accreds[0].path + '</div>' )
  }

});
