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