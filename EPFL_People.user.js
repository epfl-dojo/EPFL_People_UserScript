// ==UserScript==
// @name        EPFL People
// @namespace   none
// @description A script to improve browsing on people.epfl.ch
// @include     https://people.epfl.ch/*
// @include     https://personnes.epfl.ch/*
// @include     https://search.epfl.ch/?filter=people&*
// @version     1.5.3
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      EPFL-dojo
// @downloadURL https://raw.githubusercontent.com/epfl-dojo/EPFL_People_UserScript/master/EPFL_People.user.js
// ==/UserScript==

// TODO: [ ] ask people to Tequila login if not
// TODO: [ ] get the groups
// TODO: [ ] get the mailinglist

$(document).ready(async () => {

  console.log("%cCoded by EPFL-DOJO","color:#060;font-weight:bold;"),
  console.log("%cPlease visit https://github.com/epfl-dojo/\nand checkout-out EPFL Userscripts here\nhttps://github.com/search?q=topic:epfl-userscript&type=Repositories\n\nFeel free to contribute (https://github.com/epfl-dojo/EPFL_People_UserScript) and add issues or feature request here\nhttps://github.com/epfl-dojo/EPFL_People_UserScript/issues","color:#08ff00;font-weight:bold;"),
  console.log("%c	⊂(◉‿◉)つ","font-size:34px; line-height:1.4em;");

  var TargetLink = $('a:contains("Administrative data")')
  if (TargetLink.length) {
    window.location.href = TargetLink[0].href
  }

  // Async function to get people's data from search-api
  const getPeopleFromSearchAPI = async function (needle) {
    var searchURL = 'https://search-api.epfl.ch/api/ldap?q=' + encodeURIComponent(needle) + '&showall=0&hl=en&pageSize=all&siteSearch=people.epfl.ch'
    var result = await $.ajax({
      type: 'GET',
      url: searchURL,
      async: true,
      success: function (data) {
        result = data
      }
    })
    return result
  }

  const waitForEl = function (selector, callback) {
    if (jQuery(selector).length) {
      callback()
    } else {
      setTimeout(function () {
        waitForEl(selector, callback)
      }, 100)
    }
  }


  // In case we are on https://search.epfl.ch/?filter=people&
  if (document.URL.includes('https://search.epfl.ch')) {
    console.log('Mode: list')
    console.log('Waiting for results...')
    // TODO: [x] wait for the list to be loaded
    // TODO: [ ] handle pagination if more than 100 results

    // Add the sciper number after the people's name
    waitForEl('.list-unstyled', async () => {
      console.log('...results found!')
      const q = new URLSearchParams(window.location.search).get('q')
      users = await getPeopleFromSearchAPI(q)
      $('h3[class=h3] > a[class=result]').each(function (index, value) {
        // console.log( index + ': ' + $( this ).attr( 'href' ) )
        $(this).after(' #' + users[index].sciper)
      })
    })
  }

  // In case we are on https://people.epfl.ch/*
  // TODO: [ ] handle personnes.epfl.ch too
  if (document.URL.includes('https://people.epfl.ch/')) {
    console.log('Mode: details')
    const users = await getPeopleFromSearchAPI(document.title)
    const user = users[0]
    // console.log(user)
    const sciper = user.sciper
    const username = $('dt:contains("Username")').next('dd').html()

    // Add sciper after name in title
    $('#main > div.container > div.d-flex.flex-wrap.justify-content-between.align-items-baseline > h1').append(' #' + sciper)

    // Comfort, open admindata by default
    unsafeWindow.toggleVis('admin-data')

    // Create a new div to host specific content of this script
    $('.container:first > div > h1.mr-3').css('margin-bottom', '0px')
    $('<div class="d-flex flex-wrap justify-content-between align-items-baseline" id="EPFLPeopleUserScriptData"></div>').insertAfter('.container:first div:first')
    $('#EPFLPeopleUserScriptData').css('font-family', 'monospace')
    $('#EPFLPeopleUserScriptData').css('white-space', 'pre')
    $('#EPFLPeopleUserScriptData').append('<div>sciper: ' + sciper + '</div>')
    $('#EPFLPeopleUserScriptData').append('<div>username: ' + username + '</div>')
    $('#EPFLPeopleUserScriptData').append('<div>email: ' + user.email + '</div>')
    $('#EPFLPeopleUserScriptData').append('<div>unit: ' + user.accreds[0].path + '</div>')
  }

});