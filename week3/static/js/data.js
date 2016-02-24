var data = {
	config : {
		issBaseUrl:"https://api.wheretheiss.at/v1/",
		movieBaseUrl:"http://api.themoviedb.org/3/",
		movieApiKey:"3974f78e9e581f953c413271e51a527a",
	},
	movieSearchTerms : [
		"western","ocean","war","rome","crime","murder","space","china","school"
	],
	requestDataIss:function (url, target) {	//target = under what name should the the data be saved
		var self = this;
		var target = target;
		var googleMap = require('./googleMap');
		var sections = require('./sections');
		promise.get(url).then(function(error, text, xhr) {
		    if (error) {
		    	sections.refreshIssMarker.stopInterval();
		        console.log('Error ' + xhr.status);
		        return;
		    }
		    self[target] = JSON.parse(text);
		    //googleMap.setMapCordinates();

		    googleMap.setupMarker(target);
		});
		//debugger
	},
	recommendMovie : function (lat) {
		var devideBy = 180/data.movieSearchTerms.length;
		var number = Math.abs(Math.floor(lat/devideBy));
		var input = data.movieSearchTerms[number];
		data.searchMovie(input,"searchedMovies");
	},
	searchMovie :function(input, target) {	//target = under what name should the the data be saved
		var url = this.config.movieBaseUrl + 'search/multi?query=' + input +'&api_key=' + this.config.movieApiKey;
		var self = this;
		var sections = require('./sections');
		promise.get(url).then(function(error, text, xhr) {
			if (error) {

		        sections.renderMovieSearchedError();
		        return;
		    };
		    self[target] = JSON.parse(text);
		    setTimeout(function(){ sections.renderMovieSearched(); }, 1000); //test load animation
		    //sections.renderMovieSearched();
		    //console.log(JSON.parse(text));
		});
	}
};

module.exports = data;