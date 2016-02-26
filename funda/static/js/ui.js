var htmlElements = require('./htmlElements');
var sections = require('./sections');

var ui = {
	setupEvents : function () {
		document.addEventListener("touchstart", function(){}, true)
		htmlElements.buttonNo.addEventListener("click", function () {
			sections.handleHouseChoice(false);
		});
		htmlElements.buttonYes.addEventListener("click", function () {
			sections.handleHouseChoice(true);
		});
	},
	setupGestures : function () {
		var hammertime = new Hammer(htmlElements.body);
		hammertime.on('swiperight', function(ev) {
		    ui.switchSection("right");			    
		});
		hammertime.on('swipeleft', function(ev) {
		    ui.switchSection("left");			    
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