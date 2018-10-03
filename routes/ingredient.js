// Requires
const express = require( 'express' );
const Ingredient = require( '../models/ingredient' );
const { verifyToken } = require('../middlewares/authentication' );

const router = express.Router();

// ==========================================================
//    LIST OF INGREDIENT
// ==========================================================
router.get( '/', verifyToken, ( req, res, next ) => {

    const from = Number( req.query.from ) || 0;
    const limit = Number( req.query.limit ) || 10;

    Ingredient.find({})
        .skip(from)
        .limit(limit)
        .sort('name')
        .exec(
            ( err, ingredients ) => {

                if( err ) {
                    return res.status( 500 ).json({
                        ok: false,
                        message: 'Error loading ingredients from the data base',
                        err
                    });
                }
                Recipe.count({ status: true }, ( err, total ) => {
                    res.json({
                        ok: true,
                        ingredients,
                        total
                });
        });
    });
});

// ==========================================================
//    GET INGREDIENT
// ==========================================================
router.get( '/:id', verifyToken, ( req, res, next ) => {

    const id = req.params.id;

    Ingredient.findById( id, ( err, ingredientDB ) => {

        if ( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error getting a ingredient from the data base',
                errors: err
            });
        }
        res.json({
            ok: true,
            ingredient: ingredientDB
        });
    });
});


// ==========================================================
//    CREATE INGREDIENT
// ==========================================================
router.post( '/', verifyToken, ( req, res, next ) => {

    const body = req.body;

    const date = new Date();

    const ingredient = new Ingredient({
        name: body.name,
        quantity: body.quantity,
        comment: body.comment,
        creationDate: date
    });

    ingredient.save( ( err, ingredientDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error creating ingredient',
                err
            });
        }
        if ( !ingredientDB ) {
            return res.status( 400 ).json({
                ok: false,
                err: {
                    message: 'The ingredient with the id ' + id + ' does not exist'
                }
            });
        }
        res.json({
            ok: true,
            ingredient: ingredientDB
        });
    });
});


// ==========================================================
//    UPDATE INGREDIENT
// ==========================================================
router.put( '/:id', verifyToken, ( req, res ) => {

    const id = req.params.id;
    const body = req.body ;

    Ingredient.findByIdAndUpdate( id, body,  { new: true, runValidators: true },
        ( err, ingredientDB ) => {

            if( err ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error updating ingredient',
                    errors: err
                });
            }
            if ( !ingredientDB ) {
                return res.status( 400 ).json({
                    ok: false,
                    err: {
                        message: 'The ingredient with the id ' + id + ' does not exist'
                    }
                });
            }
            res.json({
                ok: true,
                ingredient: ingredientDB
            });

        });
});

// ==========================================================
//    DELETE RECIPE
// ==========================================================
router.delete( '/:id', [ verifyToken, verifyAdminRole ] , ( req, res ) => {

    var id = req.params.id;

    Ingredient.findByIdAndRemove( id, ( err, ingredientDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error deleting ingredient',
                errors: err
            });
        }
        if ( !ingredientDB ) {
            return res.status( 400 ).json({
                ok: false,
                err: {
                    message: 'The ingredient with the id ' + id + ' does not exist'
                }
            });
        }
        res.status( 200 ).json({
            ok: true,
            message: 'Ingredient deleted',
            ingredient: ingredientDB
        });
    });

});

// update ingredient
// delete a ingredient



module.exports = router;


