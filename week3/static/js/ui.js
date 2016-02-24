var htmlElements = require('./htmlElements');
var sections = require('./sections');

var ui = {
	setupEvents : function () {
		document.addEventListener("touchstart", function(){}, true)
		htmlElements.movieSearch.addEventListener("submit", function () {
				sections.setupMovieSearched(event.target[0].value);
		});
	},
	setupGestures : function () {
		var hammertime = new Hammer(htmlElements.header);
		hammertime.on('swiperight', function(ev) {
		    ui.switchSection("left");			    
		});
		hammertime.on('swipeleft', function(ev) {
		    ui.switchSection("right");    
		});
	},
	switchSection : function (direction) {
		var newShow;
		var newSection;
		var current = _.findIndex(htmlElements.navLi, function(item) {
			return item.dataset.section==window.location.hash;
		})			
		if ( direction === "right" ) {
			newShow = current == htmlElements.navLi.length-1 ? 0 : current+1;	
		} else if ( direction === "left" ) {
			newShow = current == 0 ? htmlElements.navLi.length-1 : current-1;
		}
		newSection = htmlElements.navLi[newShow].dataset.section;
		routie(newSection);
	}
}

module.exports = ui;