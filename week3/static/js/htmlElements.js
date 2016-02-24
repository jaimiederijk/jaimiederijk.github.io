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