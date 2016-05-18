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

		if(this.createQueryConfig.newQueryAttempts<1) {
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