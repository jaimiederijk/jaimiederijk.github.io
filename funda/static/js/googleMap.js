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