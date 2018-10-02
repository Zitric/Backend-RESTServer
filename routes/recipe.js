// Requires
const express = require( 'express' );
const Recipe = require( '../models/recipe' );
const { verifyToken } = require('../middlewares/authentication' );

const router = express.Router();

// ==========================================================
//    LIST OF RECIPE
// ==========================================================
router.get( '/', ( req, res, next ) => {

    const from = Number( req.query.from ) || 0;
    const limit = Number( req.query.limit ) || 5;

    Recipe.find({})
        .skip(from)
        .limit(limit)
        .exec(
            ( err, recipes ) => {

                if( err ) {
                    return res.status( 500 ).json({
                        ok: false,
                        message: 'Error load categories of the data base',
                        errors: err
                    });
                }
                Recipe.count({ status: true }, (err, total ) => {
                    res.json({
                        ok: true,
                        recipes,
                        total
                });
        });
    });
});


// ==========================================================
//    GET RECIPE
// ==========================================================
router.get( '/:id', (req, res, next ) => {

    const id = req.params.id;

    Recipe.findById( id, ( err, recipeBD ) => {

        if ( err ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Error getting a recipe',
                errors: err
            });
        }
        res.json({
            ok: true,
            doctor: recipeBD
        });
    });
});


// ==========================================================
//    CREATE RECIPE
// ==========================================================
router.post( '/', verifyToken, ( req, res, next ) => {

    const body = req.body;

    const recipe = new Recipe({
        name: body.name,
        description: body.description,
        user: req.user._id
    });

    recipe.save( ( err, recipeDB ) => {

        if( err ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Error creating recipe',
                errors: err
            });
        }

        res.json({
            ok: true,
            doctor: recipeDB
        });
    });
});

// ==========================================================
//    UPDATE RECIPE
// ==========================================================
router.put( '/:id', verifyToken, ( req, res ) => {

    const id = req.params.id;
    const body = req.body ;

    Recipe.findByIdAndUpdate( id, body,  { new: true },
        ( err, recipeDB ) => {

            if( err ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'Error updating recipe',
                    errors: err
                });
            }
            res.json({
                ok: true,
                doctor: recipeDB
            });

        });
});


// ==========================================================
//    DELETE RECIPE
// ==========================================================
router.delete( '/:id', verifyToken, ( req, res ) => {

    var id = req.params.id;

    Recipe.findByIdAndRemove( id, ( err, recipeDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error deleting recipe',
                errors: err
            });
        }
        if ( !recipeDB ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'The recipe with the id ' + id + ' does not exist',
                errors: { message: 'the recipe does not exist' }
            });
        }
        res.status( 200 ).json({
            ok: true,
            doctor: recipeDB
        });
    });

});

module.exports = router;



// delete category, only admins can delete, with token

