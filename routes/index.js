var express = require( 'express' );
var router = express.Router();

// ==========================================================
//    GET HOME PAGE
// ==========================================================
router.get( '/', ( req, res, next ) => {

    // res.render( 'index', { title: 'Express' });

    res.status( 200 ).json({
        ok: true,
        message: 'Request done right'
    });

});

module.exports = router;