(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var data = {
	config : {
		fundaBaseUrl:"http://funda.kyrandia.nl",
		fundaKey:"e2d60e885b8742d4b0648300e3703bd7"
	},
	positiveQueries: [],
	negativeQueries: [],
	//newQuery: {},
	seenList: [],
	createQueryConfig : {
		page:1,
		size:25,
		newQueryAttempts:5
	},
	addQueries : function (posorneg) {
		this[posorneg].push({
			soort:data.currentHouse.ObjectType,
			kamers:data.currentHouse.AantalKamers,
			woonoppervlakte:data.currentHouse.WoonOppervlakte,
			perceeloppervlakte:data.currentHouse.PerceelOppervlakte,
			energielabel:data.currentHouse.Energielabel.Label,
			prijs:data.currentHouse.KoopPrijs
		})
	},
	createNewQuery : function () {
		var input={};
		var queryCreator = require('./queryCreator');	
		var soort = queryCreator.soort();
		var query;

		if(createQueryConfig.newQueryAttempts<1) {
			console.log("no houses found");
			return
		}
		query = queryCreator.city() + "/" + soort + "/" + queryCreator.kamers() + "/" + queryCreator.woonoppervlakte() + "/" + queryCreator.perceeloppervlakte() + "/" + queryCreator.prijs();
		if (soort=="woonhuis") {
			query += "/" + queryCreator.energielabel();
		}
		input = {
			query:query,
			page:data.createQueryConfig.page,
			size:data.createQueryConfig.size
		}
		this.searchFunda(input);
	},
	searchFunda : function (input) {//input should be a object that contains query , pagnumber(page) and pagesize(size)
		var query = input;
		var sections = require('./sections');
		var url = this.config.fundaBaseUrl + '/feeds/Aanbod.svc/json/' + this.config.fundaKey + '/?type=koop&zo=/' + input.query + '/&page='+ input.page + '&pagesize=' + input.size;
		var self = this;
		promise.get(url).then(function(error, text, xhr){
			if (error) {
		        console.log('Error ' + xhr.status);
		        return;
		    }
		    // console.log(text)
		    self.searchedHouses = JSON.parse(text);
		    self.filterHasShown(self.searchedHouses);
		    //sections.renderHouses();
		})
	},
	filterHasShown : function(searchedHouses) {
		var goodArray;
		var id;
		if (searchedHouses.Objects.length < 1) {//query does not give results
			data.createQueryConfig.newQueryAttempts -= 1;
			data.createNewQuery();
			return
		}
		goodArray = _.filter( searchedHouses.Objects,function(item) {
			return !_.contains(data.seenList, item.Id);
		});
		if (goodArray.length < 1) {// has seen all thas has been searched
			data.createQueryConfig.page += 1;
			data.createNewQuery();
			return
		}

		id = goodArray[0].Id;
		data.createQueryConfig.newQueryAttempts=5;
		this.getFundaObject(id);
	},
	getFundaObject : function (id) {//
		var sections = require('./sections');
		var url = this.config.fundaBaseUrl + '/feeds/Aanbod.svc/json/detail/' + this.config.fundaKey + '/koop/' + id + '/';
		var self = this;
		promise.get(url).then(function(error, text, xhr){
			if (error) {
		        console.log('Error ' + xhr.status);
		        return;
		    }
		    // console.log(text)
		    self.currentHouse = JSON.parse(text);
		    sections.renderHouses(self.currentHouse);
		})
	},
	requestGeoLocationIP:function () {
		var geoData = {
			city : geoplugin_city(),
			longitude : geoplugin_longitude(),
			latitude : geoplugin_latitude()
		};
		return geoData;
	},

};

module.exports = data;
},{"./queryCreator":5,"./sections":7}],2:[function(require,module,exports){
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
	navLi: document.querySelectorAll('nav li'),
	sections: document.querySelectorAll('section'),
	houses: document.querySelector('#houses_template'),
	home: document.querySelector('#start'),
	buttonYes: document.querySelector('button:last-of-type'),
	buttonNo:document.querySelector('button:first-of-type')
};

module.exports = htmlElements;
},{}],4:[function(require,module,exports){
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
},{"./googleMap":2,"./routes":6,"./sections":7,"./ui":8}],5:[function(require,module,exports){
var data = require('./data');

// all the logic for creating a new query
// nederlandse objecten omdat de data nederlands is
var queryCreator = {
	city : function () {
		var city = geoplugin_city();
		if (city =="") {
			city="amsterdam";
		}
		return city
	},
	soort : function () {	
		var soortFilter;
		var posSize = _.size(data.positiveQueries);
		var negSize = _.size(data.negativeQueries);

		if (posSize + negSize > 2 ) {
			if (posSize >= 1) {
				var soortCountPos = _.countBy(data.positiveQueries, function(item) {//determine which is bigger //useless
					return item.soort == "woonhuis" ? "woonhuis" : "appartement"
				});
				soortFilter = soortCountPos.woonhuis > soortCountPos.appartement ? "woonhuis" : "appartement";
			} else {
				soortFilter = Math.random() >= 0.5 ? "woonhuis" : "appartement"; // nothing positive choose random
			}					
		} else if (posSize + negSize == 2 ) {
			soortFilter = "woonhuis"
		} else if (posSize + negSize < 2) {//after the first one alwys pick a different soort
			soortFilter = "appartement"
			// var queries = posSize == 1 ? "positiveQueries" : "negativeQueries";
			// soortFilter= data.[queries][0].soort == "woonhuis" ? "appartement" : "woonhuis";
		}

		return soortFilter
	},
	kamers : function () {
		var laag = data.positiveQueries[0].kamers;
		var hoog = 10;
		var kamerFilter = laag + "-" + hoog + "-kamers"; 
		return kamerFilter
	},
	woonoppervlakte : function () {
		var laag = 1;
		var hoog = 550;
		var woonoppervlakteFilter = laag + "-" + hoog + "-woonopp"; 
		return woonoppervlakteFilter
	},
	perceeloppervlakte : function () {
		var laag = 1; //data.positiveQueries[0].perceeloppervlakte
		var hoog = 550;
		var perceeloppFilter = laag + "-" + hoog + "-perceelopp";
		return perceeloppFilter
	},	
	energielabel : function () {
		return "energielabel-" + data.positiveQueries[0].energielabel
	},
	prijs : function () {
		var laag = 50000;//data.positiveQueries[0].prijs
		var hoog = 550000;
		var prijsFilter = laag + "-" + hoog;
		return prijsFilter
	}
};

module.exports = queryCreator;
},{"./data":1}],6:[function(require,module,exports){
var sections = require('./sections');
var data = require('./data');

var routes = {
	init: function() {
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
},{"./data":1,"./sections":7}],7:[function(require,module,exports){
var data = require('./data');
var htmlElements = require('./htmlElements');


var sections = {
	hideAllSections : function () {
		var sections = htmlElements.sections;
		for (var i = 0; i < sections.length; i++) { //hide all sections via loop
			sections[i].classList.remove("show");
			sections[i].classList.add("hidden");
			//sections[i].classList.remove("notransition");
		};
	},
	handleHouseChoice : function (selection) {
		data.seenList.push(data.currentHouse.InternalId)
		var posorneg = selection ? "positiveQueries":"negativeQueries";
		data.addQueries(posorneg);
		data.createNewQuery();
	},
	displaySection : function (sectionName) {
		this.hideAllSections();
		var section = htmlElements[sectionName];
		section.classList.remove("hidden");
		section.classList.add("show");
	},
	renderHouses : function (housedata) {
		var temp = htmlElements.houses;
		var housesData = housedata;

		var directives = {
			main_img : {
				src: function(params) {
					return this.HoofdFoto;
				}
			},
			Media : {
				extra_media_id : {
					id: function (params) {
						return this.Id
					}
				},
				extra_media_link : {
					href: function (params) {
						return "#" + this.Id
					}
				},
				extra_media : {
					src: function (params) {
						if (this.ContentType ===1 || this.ContentType ===20) {
							return this.MediaItems[2].Url
						
						} else {
							//debugger
						}
					}
				}
			}
		}

		Transparency.render(temp, housesData, directives);
	}
};

module.exports = sections;
},{"./data":1,"./htmlElements":3}],8:[function(require,module,exports){
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
},{"./htmlElements":3,"./sections":7}]},{},[4]);
