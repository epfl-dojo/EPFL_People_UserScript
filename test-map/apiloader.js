/* this script dynamically load the javascript needed for the epfl API 
   the loading is chained because of dependencies between the scripts,
   and of course, specialities for IE:
   IE8/9 know only onreadystatechange
   IE10 and all other browers know onload */

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
    /* setting the src AFTER including the element FORCE IE to trigger onreadystatechange in ALL CASES */
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
    /* setting the src AFTER including the element FORCE IE to trigger onreadystatechange in ALL CASES */
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
/* setting the src AFTER including the element FORCE IE to trigger onreadystatechange in ALL CASES */
script.src= 'http://plan.epfl.ch/mfbase/ext/adapter/ext/ext-base.js';

