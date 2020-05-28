// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     https://people.epfl.ch/*
// @include     https://personnes.epfl.ch/*
// @include     https://search.epfl.ch/?filter=people&*
// @version     1.5.2
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

// TODO: [ ] ask people to Tequila login if not
// TODO: [ ] get the groups
// TODO: [ ] get the mailinglist

$( document ).ready( async () => {

  // Async function to get people's data from search-api
  const getPeopleFromSearchAPI = async function ( needle ) {
    var people = 'https://search-api.epfl.ch/api/ldap?q=' + needle
    var result = await $.ajax({
      type: 'GET',
      url: people,
      async: true,
      success: function ( data ) {
        result = data
      }
    })
    return result
  }

  const waitForEl = function ( selector, callback ) {
    if (jQuery(selector).length) {
      callback()
    } else {
      setTimeout(function() {
        waitForEl(selector, callback)
      }, 100)
    }
  }
  
  
  // In case we are on https://search.epfl.ch/?filter=people&
  if ( document.URL.includes( 'https://search.epfl.ch' ) ) {
    console.log( 'Mode: list' )
    console.log( 'Waiting for results...' )
    // TODO: [x] wait for the list to be loaded
    // TODO: [ ] handle pagination if more than 100 results

    // Add the sciper number after the people's name
    waitForEl( '.list-unstyled', async () => {
      console.log( '...results found!' )
      const q = new URLSearchParams( window.location.search ).get( 'q' )
      users = await getPeopleFromSearchAPI( q )
      $( 'h3[class=h3] > a[class=result]' ).each(function( index, value ) {
        // console.log( index + ': ' + $( this ).attr( 'href' ) )
        $( this ).after(' #' + users[index].sciper )
      })
    })
  } 

  // In case we are on https://people.epfl.ch/*
  // TODO: [ ] handle personnes.epfl.ch too
  if ( document.URL.includes( 'https://people.epfl.ch/' ) ) {
    console.log( 'Mode: details' )
    const users = await getPeopleFromSearchAPI( document.title )
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