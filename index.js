const express = require('express');
const router = require('./src/router');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const port = 3000;

// TODO ADD DB TO CONNECTION STRING
const connectionString = 'mongodb://localhost:27017/shared-trips';


(async function start() {
	const app = express();

	await require('./src/config/database')(connectionString);
	require('./src/config/handlebars')(app);

	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(session({
		secret: 'supermegadupersecretword',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: 'auto' }
	}))
	app.use('/static', express.static('public'));
	app.use(router);

	app.listen(port, () => console.log('App is listening on port ' + port));
})();