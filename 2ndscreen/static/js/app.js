'use strict';
//(function(){
	var htmlElements = {
		body: document.querySelector('body'),
		header: document.querySelector('header'),
		navLi: document.querySelectorAll('nav li'),
		sections : document.querySelectorAll('section'),
		matchTimer : document.querySelector('.matchtimer'),
		playerData : document.querySelectorAll('.playerdata'),
		//sections / pages
		eventinfo : document.querySelector("#eventinfo"),
		eventMessage : document.querySelector("#event"),
		matchinfo : document.querySelector("#matchinfo"),
		program : document.querySelector("#program"),
		match : document.querySelector("#match"),
		afterActionReport : document.querySelector("#afteractionreport"),
		playerInfo : document.querySelector("#playerinfo"),
		//templates
		eventinfoTemplate: document.querySelector("#template-eventinfo"),
		matchinfoTemplate: document.querySelector("#template-matchinfo"),
		programTemplate: document.querySelector("#template-program"),
		matchTemplate: document.querySelector("#template-match"),
		aarTemplate: document.querySelector("#template-aar"),

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
				sections.renderHeader();
				window.clearInterval(startMatchInterval);
			});
			routie('wedstrijdinfo/:competitionname/:id', function(competitionname, id) {
				if (data.matches) {
					window.clearInterval(startMatchInterval);
					sections.renderMatchinfo(competitionname,id);
					sections.displaySection("matchinfo");
					sections.changeBallKeeper(false);
					sections.renderHeader();
				} else {
					routie('programma');
				}
				
			});
			routie('wedstrijd/:competitionname/:id', function(competitionname,id) {
				if (data.matches) {
					sections.renderMatch(competitionname,id);
					sections.displaySection("match");
					htmlElements.eventMessage.innerHTML= "<p>Wit 4</p><a href='#event/start'>opzwemmen</a>"//"<a href='#event/start'>start van de wedstrijd</a>";
					sections.changeBallKeeper(true);
					window.clearInterval(startMatchInterval);
					sections.renderHeader();
				} else {
					routie('programma');
				}
			});
			routie('aar/:competitionname/:id', function(competitionname,id) {
				if (data.matches) {
					sections.renderAar(competitionname,id);
					sections.displaySection("afterActionReport");
					window.clearInterval(startMatchInterval);
					sections.renderHeader();
				} else {
					routie('programma');
				}
			});
			routie('event/:name', function(name) {
				if (data.matches) {
					sections.renderEvent(name);
					sections.displaySection("eventinfo");
					sections.changeBallKeeper(false);
					window.clearInterval(startMatchInterval);
					sections.renderHeader();
				} else {
					routie('programma');
				}
			});
		}

	};
	var ballInterval;
	var eventInterval;
	var startMatchInterval;
	var sections = {
		changeBallKeeper : function (onoroff) {
			sections.randomEvent(onoroff);
			if (onoroff) {
				clearInterval(ballInterval);
				ballInterval = window.setInterval(selectPlayer, 2500);
				var players = document.querySelectorAll('.athlete');
				var athleteData = document.querySelectorAll('.playerdata');
				function selectPlayer() {
					var two = Math.floor(Math.random() * (2));
					var playerNumber;
					if (two===1) {
						playerNumber = Math.floor(Math.random() * (7));
					} else {
						playerNumber = Math.floor(Math.random() * (7))+13;
					};
					
					removeHasBall();
					players[playerNumber].classList.add("hasball");
					if (onoroff!="choose") {
						sections.hideAllPlayerData();
						athleteData[playerNumber].classList.remove("hideplayerdata");
					};
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
					var playerNumber = Math.floor(Math.random() * 6+1);
					var player = document.querySelectorAll('#match p');
					var number = player[playerNumber].firstChild.innerText;
					var color = "";
					if (whiteOrBlue == 0) {
						color = "wit ";
					} else {
						color = "blauw ";
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

			htmlElements.eventMessage.innerHTML= "<p>"+player+"</p><a href='#event/"+name+"'>"+name+"</a>";
		},//<h3>Gebeurtenis:</h3>
		startMatchTimer: function () {
			startMatchInterval = window.setInterval(countdown,1000);
			var timerSec = 30
			function countdown() {
				timerSec-=1;
				// console.log(timerSec);
				if (timerSec==0) {
					window.clearInterval(startMatchInterval);
					//routie('wedstrijd' + location.hash.substring(14));
				};
				htmlElements.matchTimer.innerHTML = "Begint over: "+timerSec +"S";
			};
		},
		renderHeader: function () {
			var temp = htmlElements.header;

			var directives = {
				pagetitle : {
					text: function () {
						var loc = location.hash;
						if (loc=="#programma") {
							return "Wedstrijden"
						} else if (loc=="#wedstrijd/EKWaterpoloDames/7") {
							return "Live verslag"
						} else if (loc=="#event/u20" || loc=="#event/strafworp" || loc== "#event/vrijeworp") {
							return "Gebeurtenis"
						} else {
							return
						}
						 
					}
				}
			}
			Transparency.render(temp,data.matches,directives)
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
				matchstarttimer : {
					text:function(params) {
						sections.startMatchTimer();
					}
				},
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
								var a = competitionName.replace(/\s+/g, '');
								return "#aar/" + a + "/" + this.id;
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
			var compinfo = _.find(data.matches.competitions,function(item){ return item.name.replace(/\s+/g, '') == competitionName;})
			var matchinfo = _.find(compinfo.matches,function(item){ return item.id == matchId;})
			var temp = htmlElements.matchinfoTemplate;

			var directives = {
				matchstarttimer : {
					text:function(params) {
						sections.startMatchTimer();
					}
				},
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
			var compinfo = _.find(data.matches.competitions,function(item){ return item.name.replace(/\s+/g, '') == competitionName;})
			var matchinfo = _.find(compinfo.matches,function(item){ return item.id == matchId;})
			var team1info = _.find(compinfo.teams,function(item){ return item.team == matchinfo.team1;})
			var team2info = _.find(compinfo.teams,function(item){ return item.team == "Hongarije";})//matchinfo.team2
			var temp = htmlElements.matchTemplate;



			matchinfo.team1Athletes = team1info.athletes;
			matchinfo.team2Athletes = team2info.athletes;

			var directives = {
				team1Athletes : {
					goals : {
						text : function (params) {
							return params.value + " " +  this.goals;
						}
					},					
					p : {
						text : function (params) {
							return params.value + " " +  this.p;
						}
					}
				},
				team2Athletes : {
					goals : {
						text : function (params) {
							return params.value + " " +  this.goals;
						}
					},
					p : {
						text : function (params) {
							return params.value + " " +  this.p;
						}
					}
				}
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
			sections.hideAllPlayerData();
			sections.hidePlayer();
			sections.clickAthlete();
		},
		renderAar :function (competitionname,id) {
			
			var matchId = id;
			var competitionName = competitionname;
			var compinfo = _.find(data.matches.competitions,function(item){ return item.name.replace(/\s+/g, '') == competitionName;})
			var matchinfo = _.find(compinfo.matches,function(item){ return item.id == matchId;})
			var team1info = _.find(compinfo.teams,function(item){ return item.team == matchinfo.team1;})
			var team2info = _.find(compinfo.teams,function(item){ return item.team == "Hongarije";})//matchinfo.team2
			var temp = htmlElements.aarTemplate;



			matchinfo.team1Athletes = team1info.athletes;
			matchinfo.team2Athletes = team2info.athletes;

			var directives = {
				matchreport : {
					1:{
						gtijd:{
							text: function (params) {
								if (this.actie) {
									return this.vtijd-516 + " S" ;
								} else {
									return
								}
								
							}
						},
						render : {
							href: function() {
								if (this.actie) {
									return "#event/u20";
								}
								else {
									return
								}
							},
							class: function() {
								if (this.actie) {
									return "aarevents";
								}
								else {
									return
								}
							}
						},
						gspeler : {
							text: function () {
								if (this.actie) {
									return this.speler;
								}
								else {
									return
								}
							}
						}
						//,
						// actie :{
						// 	text: function (params) {
						// 		if (this.actie) {
						// 			return this.actie;
						// 		};
						// 	}
						// }
					}
				},
				team1Athletes : {
					goals : {
						text : function (params) {
							return params.value + " " +  this.goals;
						}
					},
					p : {
						text : function (params) {
							return params.value + " " +  this.p;
						}
					}
				},
				team2Athletes : {
					goals : {
						text : function (params) {
							return params.value + " " +  this.goals;
						}
					},
					p : {
						text : function (params) {
							return params.value + " " +  this.p;
						}
					}
				}
			};

			Transparency.render(temp,matchinfo,directives);
		},
		clickAthlete : function () {
			var athlete = document.querySelectorAll('.athlete');
			var athleteData = document.querySelectorAll('.playerdata');
			var players = document.querySelectorAll('.athlete');
			for (var i = 0; i < athlete.length; i++) {
				athlete[i].addEventListener("click",showPlayerData, false)
			};
			function showPlayerData(e) {
				
				sections.changeBallKeeper("choose");
				sections.hideAllPlayerData();
				var number = Number(e.currentTarget.children[0].children[0].innerHTML)-1;
				if (e.currentTarget.parentElement.dataset.bind =="team2Athletes") {
					number+=13;
				};
				players[number].classList.add("chosenPlayer");
				athleteData[number].classList.remove("hideplayerdata");
				athleteData[number].classList.add("chosenPlayerdata");
				
			}
		},
		hideAllPlayerData : function() {
			var playerData =  document.querySelectorAll('.playerdata');
			for (var i = 0; i < playerData.length; i++) { //hide all sections via loop
				playerData[i].classList.add("hideplayerdata");
				//sections[i].classList.remove("notransition");
			};
		},
		hidePlayer : function() {
			var player =  document.querySelectorAll('.athlete')
			for (var i = 7; i < 13; i++) { //hide all sections via loop
				player[i].classList.add("hideplayer");
			};
			for (var i = 20; i < player.length; i++) { //hide all sections via loop
				player[i].classList.add("hideplayer");
			};
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