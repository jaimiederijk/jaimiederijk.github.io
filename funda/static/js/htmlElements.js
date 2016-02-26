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