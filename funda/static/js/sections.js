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