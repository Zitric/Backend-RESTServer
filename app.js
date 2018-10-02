require( './config/config' );

// Requires
const createError = require( 'http-errors' );
const express = require( 'express' );
const path = require( 'path' );
const cookieParser = require( 'cookie-parser' );
const logger = require('morgan');
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );

// Routes Imports
const indexRouter = require('./routes/index' );
const loginRouter = require('./routes/login' );
const usersRouter = require('./routes/users' );
const recipeRouter = require('./routes/recipe' );


const app = express();

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ));
app.set( 'view engine', 'hbs' );

app.use( logger( 'dev') );
app.use( express.json() );
app.use( express.urlencoded( { extended: false }) );
app.use( cookieParser() );

// enabling the public folder
app.use( express.static( path.join( __dirname, 'public' )));


// Middlewares
app.use( '/', indexRouter );
app.use( '/login', loginRouter );
app.use( '/users', usersRouter );
app.use( '/recipes', recipeRouter );

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false }) );

// parse application/json
app.use( bodyParser.json() );


// Connection to database
mongoose.connection.openUri( process.env.URLDB,  ( err, res ) => {
    if ( err ) {
        throw err;
    } else {
        console.log( 'Data base ONLINE' );
    }
} );

// catch 404 and forward to error handler
app.use(( req, res, next ) => {
    next( createError( 404 ) );
});

// error handler
app.use(( err, req, res, next ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 );
    res.render( 'error' );
});

module.exports = app;
