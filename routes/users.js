// Requires
const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const User = require( '../models/user' );
const _ = require( 'underscore' );
const { verifyToken, verifyAdminRole } = require( '../middlewares/authentication');

const router = express.Router();
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';



// ==========================================================
//    LIST OF USERS
// ==========================================================
router.get( '/', verifyToken, ( req, res, next ) => {

    const from = Number( req.query.from ) || 0;
    const limit = Number( req.query.limit ) || 5;

    User.find({ status: true }, 'name email role status google img' )
        .skip(from)
        .limit(limit)
        .exec( ( err, users ) => {

            if( err ) {
                return res.status( 500 ).json({
                    ok: false,
                    message: 'Error load users of the data base',
                    errors: err
                });
            }
            User.count({ status: true }, ( err, count ) => {
                res.json({
                    ok: true,
                    users,
                    count
                });
            });
        });
});


// ==========================================================
//    CREATE USER
// ==========================================================
router.post( '/', [ verifyToken, verifyAdminRole ], ( req, res ) => {

    const body = req.body;

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync ( body.password, saltRounds ),
        role: body.role
    });

    user.save( ( err, userDB ) => {

        if( err ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Error when creating user',
                errors: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

// ==========================================================
//    UPDATE USER
// ==========================================================
router.put( '/:id', [ verifyToken, verifyAdminRole ], ( req, res ) => {

    const id = req.params.id;
    const body = _.pick( req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate( id, body,  { new: true, runValidators: true },
        ( err, userDB ) => {

            if( err ) {
                return res.status( 400 ).json({
                    ok: false,
                    message: 'Error when updating user',
                    errors: err
                });
            }
            res.json({
                ok: true,
                user: userDB
            });

        });
});

// ==========================================================
//    DELETE USER
// ==========================================================
router.delete( '/:id', [ verifyToken, verifyAdminRole ], ( req, res ) => {

    const id = req.params.id;
    const changeStatus = { status: false };


    // To remove completly the data of user
    // User.findByIdAndRemove( id, ( err, deletedUser ) => {

    // To change the status to false of user
    User.findByIdAndUpdate( id, changeStatus, { new: true }, ( err, deletedUser ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when deleting user',
                errors: err
            });
        }
        if ( !userDB ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'The user with the id ' + id + ' does not exist',
                errors: { message: 'the user does not exist' }
            });
        }
        res.json({
            ok: true,
            user: deletedUser
        });
    });

});

module.exports = router;
