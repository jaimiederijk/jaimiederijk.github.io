var data = require('./data');
var htmlElements = require('./htmlElements');


var sections = {
	setupMovieSearched : function (input) {
		
		if (data.searchedMovies) {
			Transparency.render(htmlElements.moviesTemplate,"");
			data.oldSearchedMovies = _.filter(data.searchedMovies.results, function(item){
				return item.vote_average > 5.5;
			});
		}

		htmlElements.moviesTemplateLoader.classList.add("loader");	
		
		data.searchMovie(input,"searchedMovies");
	},
	renderMovieSearched : function () {
		var temp = htmlElements.moviesTemplate;

		var movies = data.searchedMovies;
		var directives = {
			deeplink : {
				href : function (params) {
					return "#movies/#" + this.id;
				}
			}
		};
		htmlElements.moviesTemplateLoader.classList.remove("loader");
		Transparency.render(temp,movies.results,directives);
	},
	renderMovieSearchedError : function () {
		var temp = htmlElements.moviesTemplate;
		var errorData = {
			title:"something went wrong",
			overview:"please try again"
		}
		htmlElements.moviesTemplateLoader.classList.remove("loader");
		Transparency.render(temp,errorData);
	},
	renderMoviePage : function (id) {
		var movie = _.find(data.searchedMovies.results,function(id){ return id = id; });
		var temp = htmlElements.movieTemplate;
		Transparency.render(temp,movie);
	},
	// firstHideAllSections : function() {
	// 	var sections = htmlElements.sections;
	// 	for (var i = 0; i < sections.length; i++) { //hide all sections via loop
	// 		sections[i].classList.add("notransition");
	// 	};
	// },
	hideAllSections : function () {
		var sections = htmlElements.sections;
		for (var i = 0; i < sections.length; i++) { //hide all sections via loop
			sections[i].classList.remove("show");
			sections[i].classList.add("hidden");
			//sections[i].classList.remove("notransition");
		};
	},
	displaySection : function (sectionName) {
		htmlElements.moviesTemplateLoader.classList.add("loader");
		this.hideAllSections();
		var section = htmlElements[sectionName];
		section.classList.remove("hidden");
		section.classList.add("show");
	},
	refreshIssMarker : {
		markerInterval : function() {this.interval = window.setInterval(this.sendIssRequest ,2000)},
		sendIssRequest : function() {
			data.requestDataIss(data.config.issBaseUrl+"satellites/25544","issData");

		},
		stopInterval : function() {
			clearInterval(this.interval);
		}
	}
};

module.exports = sections;