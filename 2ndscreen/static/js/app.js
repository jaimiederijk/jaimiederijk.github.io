'use strict';
//(function(){
	var htmlElements = {
		body: document.querySelector('body'),
		header: document.querySelector('header'),
		navLi: document.querySelectorAll('nav li'),
		sections : document.querySelectorAll('section'),
		eventinfo : document.querySelector("#eventinfo"),
		eventMessage : document.querySelector("#event"),
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
				sections.changeBallKeeper(false);
				sections.displaySection("program");
			});
			routie('wedstrijdinfo/:competitionname/:id', function(competitionname, id) {
				if (data.matches) {
					sections.renderMatchinfo(competitionname,id);
					sections.displaySection("matchinfo");
					sections.changeBallKeeper(false);
				} else {
					routie('programma');
				}
				
			});
			routie('wedstrijd/:competitionname/:id', function(competitionname,id) {
				if (data.matches) {
					sections.renderMatch(competitionname,id);
					sections.displaySection("match");
					htmlElements.eventMessage.innerHTML= "<a href='#event/start'>start van de wedstrijd</a>";
					sections.changeBallKeeper(true);
				} else {
					routie('programma');
				}
			});
			routie('event/:name', function(name) {
				if (data.matches) {
					sections.renderEvent(name);
					sections.displaySection("eventinfo");
					sections.changeBallKeeper(false);
				} else {
					routie('programma');
				}
			});
		}

	};
	var ballInterval;
	var eventInterval;
	var sections = {
		changeBallKeeper : function (onoroff) {
			sections.randomEvent(onoroff);
			if (onoroff) {
				ballInterval = window.setInterval(selectPlayer, 2500);
				var players = document.querySelectorAll('#match p');
				function selectPlayer() {
					var playerNumber = Math.floor(Math.random() * (26));
					removeHasBall();
					players[playerNumber].classList.add("hasball");
				};
				function removeHasBall(){
					for (var i = 0; i < players.length; i++) {
						players[i].classList.remove("hasball");
					};
				};
			} else {
				clearInterval(ballInterval);
			}

		},
		randomEvent : function (onoroff) {
			if (onoroff) {
				eventInterval = window.setInterval(whiteOrBlue, 5000);
				function whiteOrBlue() {
					var two = Math.floor(Math.random() * (2));
					selectPlayer(two);
				};
				function selectPlayer(whiteOrBlue){
					var playerNumber = Math.floor(Math.random() * (12 - 0 + 1)) + 0;
					var player = document.querySelectorAll('#match p');
					var number = player[playerNumber].firstChild.innerText;
					var color = "";
					if (whiteOrBlue == 0) {
						color = "w";
					} else {
						color = "b";
					}
					sections.createEvent(color + number);
				};
			} else {
				clearInterval(eventInterval);
			}

		},
		createEvent : function (player) {
			var eventNumber = Math.floor(Math.random() * (data.matches.events.length));
			var name = data.matches.events[eventNumber].name;

			htmlElements.eventMessage.innerHTML= "<a href='#event/"+ name + "'>"+ player + "  " + name +"</a>";
		},
		renderEvent: function (name) {
			var temp = htmlElements.eventinfoTemplate;
			var eventinfo = _.find(data.matches.events,function(item){ return item.name == name;})

			var directives = {
				eventimage : {
					src: function () {
						return this.image;
					}
				}
			}
			Transparency.render(temp,eventinfo,directives);
		},
		renderProgram : function () {
			var temp = htmlElements.programTemplate;
			var competitionName = ""
			var program = data.matches;

			var directives = {
				competitions : {
					compname : {
						text: function() {
							competitionName = this.name;
							return this.name;
						}
					},
					matches : {
						deeplink : {
							href : function (params) {
								return "#wedstrijdinfo/" + competitionName + "/" + this.id;
							}
						},
						vs : {
							text: function(params) {
						      return this.team1 + " - " + this.team2;
						    }
						}
					}
				}
			};
			//htmlElements.moviesTemplateLoader.classList.remove("loader");
			Transparency.render(temp,program,directives);
		},
		renderMatchinfo : function (competitionname,id) {
			//var movie = _.find(data.searchedMovies.results,function(id){ return id = id; });
			var matchId = id;
			var competitionName = competitionname;
			var compinfo = _.find(data.matches.competitions,function(item){ return item.name == competitionName;})
			var matchinfo = _.find(compinfo.matches,function(item){ return item.id == matchId;})
			var temp = htmlElements.matchinfoTemplate;

			var directives = {
				matchvideo : {
					href : function (params) {
						return this.video;
					}
				},
				matchlink : {
					href : function (params) {
						return "#wedstrijd/" + competitionName + "/" + this.id;
					},
					text : function () {
						return "de wedstrijd"
					}
				}
			};

			Transparency.render(temp,matchinfo,directives);
		},
		renderMatch : function (competitionname,id) {
			//var movie = _.find(data.searchedMovies.results,function(id){ return id = id; });
			var matchId = id;
			var competitionName = competitionname;
			var compinfo = _.find(data.matches.competitions,function(item){ return item.name == competitionName;})
			var matchinfo = _.find(compinfo.matches,function(item){ return item.id == matchId;})
			var team1info = _.find(compinfo.teams,function(item){ return item.team == matchinfo.team1;})
			var team2info = _.find(compinfo.teams,function(item){ return item.team == "Hongarije";})//matchinfo.team2
			var temp = htmlElements.matchTemplate;

			matchinfo.team1Athletes = team1info.athletes;
			matchinfo.team2Athletes = team2info.athletes;

			var directives = {
				// matchvideo : {
				// 	href : function (params) {
				// 		return this.video;
				// 	}
				// },
				// matchlink : {
				// 	href : function (params) {
				// 		return "#wedstrijd/" + competitionName + "/" + this.id;
				// 	},
				// 	text : function () {
				// 		return "de wedstrijd"
				// 	}
				// },
			};

			Transparency.render(temp,matchinfo,directives);
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