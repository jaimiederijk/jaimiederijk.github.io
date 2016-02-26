//(function(){
	'use strict';

	var routes = require('./routes');
	var ui = require('./ui');
	var sections = require('./sections');
	var googleMap = require('./googleMap');


	var app = {
		init: function() {
			// sections.firstHideAllSections();
			routes.init();
			//googleMap.setupMap();
			//sections.refreshIssMarker.markerInterval();
			ui.setupEvents();
			//ui.setupGestures();
		}
	};

	app.init();

//})();