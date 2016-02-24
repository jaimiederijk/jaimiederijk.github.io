(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./googleMap":2,"./sections":6}],2:[function(require,module,exports){
var data = require('./data');
var map;

var googleMap = {
	getCordinates : function(target) {
		var myLatLng = {
		      lat: data[target].latitude,
		      lng: data[target].longitude
		};
		return myLatLng
	},
	setupMap : function () {
		if (document.getElementById('map-canvas')){

		    // Coordinates to center the map
		    var myLatlng = new google.maps.LatLng(0,0);

		    // Other options for the map, pretty much selfexplanatory
		    var mapOptions = {
		        zoom: 1,
		        center: myLatlng,
		        scrollwheel: false,
			    navigationControl: false,
			    mapTypeControl: false,
			    scaleControl: false,
			    draggable: false,
		        mapTypeId: google.maps.MapTypeId.ROADMAP
		    };

		    // Attach a map to the DOM Element, with the defined settings
			map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions );

		}
	},
	setupMarker : function (target) {
		var image = {
			url: "static/images/dot.png",
		    scaledSize: new google.maps.Size(20, 20), // scaled size
		    origin: new google.maps.Point(0,0), // origin
		    anchor: new google.maps.Point(0, 0) // anchor
		};

		var marker = new google.maps.Marker({
		    position: this.getCordinates(target),
		    map: map,
		    title: target,
		    icon: image
		});
	}
};

module.exports = googleMap;
},{"./data":1}],3:[function(require,module,exports){
var htmlElements = {
	body: document.querySelector('body'),
	header: document.querySelector('header'),
	navLi: document.querySelectorAll('nav li'),
	sections: document.querySelectorAll('section'),
	movies: document.querySelector('#searchmovies'),
	movie: document.querySelector('#onemovie'),
	home: document.querySelector('#start'),
	iss: document.querySelector('#isstracker'),
	movieSearch: document.querySelector('#searchmovies form'),
	moviesTemplate: document.querySelector("#template-movies"),
	movieTemplate: document.querySelector("#template-movie"),
	moviesTemplateLoader: document.querySelector("#template-movies div")
};

module.exports = htmlElements;
},{}],4:[function(require,module,exports){
(function(){
	'use strict';

	var routes = require('./routes');
	var ui = require('./ui');
	var sections = require('./sections');
	var googleMap = require('./googleMap');


	var app = {
		init: function() {
			// sections.firstHideAllSections();
			routes.init();
			googleMap.setupMap();
			sections.refreshIssMarker.markerInterval();
			
			ui.setupEvents();
			ui.setupGestures();
		}
	};

	app.init();

})();
},{"./googleMap":2,"./routes":5,"./sections":6,"./ui":7}],5:[function(require,module,exports){
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
},{"./data":1,"./sections":6}],6:[function(require,module,exports){
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
},{"./data":1,"./htmlElements":3}],7:[function(require,module,exports){
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
},{"./htmlElements":3,"./sections":6}]},{},[4]);
