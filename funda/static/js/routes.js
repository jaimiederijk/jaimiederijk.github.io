var sections = require('./sections');
var data = require('./data');

var routes = {
	init: function() {
		var enable = document.querySelector("#javascript");
		enable.classList.add("hidden");
		//
		routie('', function() {
			sections.displaySection("home");
			var input={
				query:"amsterdam/woonhuis",
				page:1,
				size:1
			};
			data.searchFunda(input);
		});
		routie(':hash', function(hash) {

			if (!document.getElementById(hash)) {
				routie('');
			}
		});
	}

};

module.exports = routes;