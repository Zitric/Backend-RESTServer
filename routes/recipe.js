// Requires
const express = require( 'express' );
const Recipe = require( '../models/recipe' );
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication' );

const router = express.Router();

// ==========================================================
//    LIST OF RECIPE
// ==========================================================
router.get( '/', verifyToken, ( req, res, next ) => {

    const from = Number( req.query.from ) || 0;
    const limit = Number( req.query.limit ) || 10;

    Recipe.find({})
        .skip(from)
        .limit(limit)
        .sort('name')
        //.populate('ingredient')
        .populate('user', 'name email') // to show the data of the linked users
        .exec(( err, recipes ) => {

                if( err ) {
                    return res.status( 500 ).json({
                        ok: false,
                        message: 'Error loading recipes from the data base',
                        err
                    });
                }
                Recipe.count({ status: true }, ( err, total ) => {
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
router.get( '/:id', verifyToken, ( req, res, next ) => {

    const id = req.params.id;

    Recipe.findById( id, ( err, recipeDB ) => {

        if ( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error getting a recipe from the data base',
                errors: err
            });
        }
        if ( !recipeDB ) {
            return res.status( 400 ).json({
                ok: false,
                err: {
                    message: 'The recipe with the id ' + id + ' does not exist'
                }
            });
        }
        res.json({
            ok: true,
            recipe: recipeDB
        });
    });
});

// ==========================================================
//    SEARCH RECIPE
// ==========================================================
router.get('/recipes/search/:word', verifyToken, ( req, res ) => {

    const word = req.params.word;

    const regex = new RegExp( word, 'i');

    Recipe.find({ name : regex })
        .exec(( err, recipesDB ) => {

            if ( err ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error getting a recipe from the data base',
                    errors: err
                });
            }
            res.json({
                ok: true,
                recipes: recipesDB
            });
    });

});

// ==========================================================
//    CREATE RECIPE
// ==========================================================
router.post( '/', verifyToken, ( req, res, next ) => {

    const body = req.body;

    const date = new Date();

    const recipe = new Recipe({
        name: body.name,
        description: body.description,
        creationDate: date,
        user: req.user._id
    });

    recipe.save( ( err, recipeDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error creating recipe',
                err
            });
        }
        if ( !recipeDB ) {
            return res.status( 400 ).json({
                ok: false,
                err: {
                    message: 'The recipe with the id ' + id + ' does not exist'
                }
            });
        }
        res.json({
            ok: true,
            recipe: recipeDB
        });
    });
});

// ==========================================================
//    UPDATE RECIPE
// ==========================================================
router.put( '/:id', verifyToken, ( req, res ) => {

    const id = req.params.id;
    const body = req.body ;

    Recipe.findByIdAndUpdate( id, body,  { new: true, runValidators: true },
        ( err, recipeDB ) => {

            if( err ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error updating recipe',
                    errors: err
                });
            }
            if ( !recipeDB ) {
                return res.status( 400 ).json({
                    ok: false,
                    err: {
                        message: 'The recipe with the id ' + id + ' does not exist'
                    }
                });
            }
            res.json({
                ok: true,
                recipe: recipeDB
            });

        });
});


// ==========================================================
//    DELETE RECIPE
// ==========================================================
router.delete( '/:id', [ verifyToken, verifyAdminRole ] , ( req, res ) => {

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
                err: {
                    message: 'The recipe with the id ' + id + ' does not exist'
                }
            });
        }
        res.status( 200 ).json({
            ok: true,
            message: 'Recipe deleted',
            recipe: recipeDB
        });
    });

});

module.exports = router;



