const hbs = require('express-handlebars');

module.exports = (app) => {
	app.engine('hbs', hbs.create({
		extname: '.hbs'
	}).engine);
	app.set('view engine', 'hbs');
	app.set('views', './src/views');
}