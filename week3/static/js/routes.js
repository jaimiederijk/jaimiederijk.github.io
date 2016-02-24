var sections = require('./sections');
var data = require('./data');

var routes = {
	init: function() {
		routie('', function() {
			routie('movies');
			//sections.displaySection("home");
		});
		routie('movies', function() {
			sections.displaySection("movies");
			if (data.issData) {
				data.recommendMovie(data.issData.longitude);
			} else {
				setTimeout(function(){ data.recommendMovie(data.issData.longitude); }, 2500);
			}
		});
		routie('iss', function() {
			sections.displaySection("iss");
		});
		routie('movies/:id', function(id) {
			if (data.searchedMovies) {//has data been collected then continue
				sections.displaySection("movie");
				sections.renderMoviePage(id);
			} else {
				routie('movies');
			};
		});
	}

};

module.exports = routes;