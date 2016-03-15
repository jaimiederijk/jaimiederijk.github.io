'use strict';
//(function(){
	var htmlElements = {
		body: document.querySelector('body'),
		header: document.querySelector('header'),
		navLi: document.querySelectorAll('nav li'),
		sections : document.querySelectorAll('section'),
		eventinfo : document.querySelector("#eventinfo"),
		matchinfo : document.querySelector("#matchinfo"),
		program : document.querySelector("#program"),
		match : document.querySelector("#match"),
		eventinfoTemplate: document.querySelector("#template-eventinfo"),
		matchinfoTemplate: document.querySelector("#template-matchinfo"),
		programTemplate: document.querySelector("#template-program"),
		matchTemplate: document.querySelector("#template-match")
	};
	var app = {
		init: function() {
			data.requestData("data/matches.json","matches");
			routes.init();


			// ui.setupEvents();
			// ui.setupGestures();
		}
	};
	var routes = {
		init: function() {
			routie('', function() {
				routie('programma');
			});
			routie('programma', function() {
				
				sections.displaySection("program");
			});
			routie('wedstrijdinfo/:id', function(id) {
				sections.renderMatchinfo(id);
				sections.displaySection("matchinfo");
			});
			routie('wedstrijd/:id', function(id) {
				if (data.searchedMovies) {//has data been collected then continue
					sections.displaySection("movie");
					sections.renderMoviePage(id);
				} else {
					routie('movies');
				};
			});
		}

	};

	var sections = {
		// setupMovieSearched : function (input) {
			
		// 	if (data.searchedMovies) {
		// 		Transparency.render(htmlElements.moviesTemplate,"");
		// 		data.oldSearchedMovies = _.filter(data.searchedMovies.results, function(item){
		// 			return item.vote_average > 5.5;
		// 		});
		// 	}

		// 	htmlElements.moviesTemplateLoader.classList.add("loader");	
			
		// 	data.searchMovie(input,"searchedMovies");
		// },
		renderProgram : function () {
			var temp = htmlElements.programTemplate;

			var program = data.matches.matches;
			var directives = {
				deeplink : {
					href : function (params) {
						return "#wedstrijdinfo/" + this.id;
					}
				},
				vs : {
					text: function(params) {
				      return this.team1 + " vs " + this.team2;
				    }
				}

			};
			//htmlElements.moviesTemplateLoader.classList.remove("loader");
			Transparency.render(temp,program,directives);
		},
		renderMatchinfo : function (id) {
			//var movie = _.find(data.searchedMovies.results,function(id){ return id = id; });
			var matchId = id;
			var matchinfo = _.find(data.matches.matches,function(item){ return item.id == matchId;})
			var temp = htmlElements.matchinfoTemplate;
			Transparency.render(temp,matchinfo);
		},
		hideAllSections : function () {
			var sections = htmlElements.sections;
			for (var i = 0; i < sections.length; i++) { //hide all sections via loop
				sections[i].classList.remove("show");
				sections[i].classList.add("hidden");
				//sections[i].classList.remove("notransition");
			};
		},
		displaySection : function (sectionName) {
			//htmlElements.moviesTemplateLoader.classList.add("loader");
			this.hideAllSections();
			var section = htmlElements[sectionName];
			section.classList.remove("hidden");
			section.classList.add("show");
		}
	};
	var data = {
		requestData:function (url, target) {	//target = under what name should the the data be saved
			var self = this;
			var target = target;
			promise.get(url).then(function(error, text, xhr) {
			    if (error) {
			    	sections.refreshIssMarker.stopInterval();
			        console.log('Error ' + xhr.status);
			        return;
			    }
			    self[target] = JSON.parse(text);
			    sections.renderProgram();

			});
			//debugger
		}
	}

	app.init()
//})();