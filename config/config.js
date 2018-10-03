
// ==========================================================
//    PORT
// ==========================================================
process.env.PORT = process.env.PORT || 3000;


// ==========================================================
//    ENVIROMENT
// ==========================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ==========================================================
//    EXPIRE DATE OF TOKEN
// ==========================================================
// 60 seconds * 60 minutes * 24 hours * 30 days
//process.env.EXPIRATION_TOKEN = '48h';
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;


// ==========================================================
//    SEED OF AUTHENTICATION
// ==========================================================
process.env.SEED = process.env.SEED ||
    'this-is-my-complicated-seed-of-development';


// ==========================================================
//    DATA BASE
// ==========================================================
process.env.URLDB = process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/RESTServerDB' :
    process.env.MONGO_URL_RESTSERVER;


// ==========================================================
//    GOOGLE CLIENT ID
// ==========================================================
process.env.CLIENT_ID = process.env.CLIENT_ID ||
    '1072945280741-h84h5vl5has73qgd21anp2shgehttssi.apps.googleusercontent.com';

