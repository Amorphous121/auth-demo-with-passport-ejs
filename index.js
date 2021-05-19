require('express-async-errors');
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport')
const methodOverride = require('method-override');
const flash = require('connect-flash');
require('./middlewares/passport');
const routes = require('./routes')
const Database = require('./middlewares/database-middleware');
const error = require('./middlewares/error-middleware')
const { sendJson } = require('./middlewares/generateResponse-middleware');
const MongoStore = require('connect-mongo');
Database.connect();

const app = express();
app.response.sendJson = sendJson;
const port = process.env.PORT || 8081;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(logger('dev'));
app.use(methodOverride('_method'));


const store = new MongoStore({ mongoUrl : process.env.DB_URI });
app.use(session({
	secret : "secret",
	resave : false,
	saveUninitialized : false,
	cookie : {
		maxAge : 3600000
	},
	store : store ,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.flash = req.flash();
    next()
})

app.use('/', routes);

/* Error Handling middlewares */  

app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

app.listen(port, () => console.log(`-----------> Server is up and running at ${8000}} <----------`));
