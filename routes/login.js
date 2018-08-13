const express = require( 'express' );
const User = require( '../models/user' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

const router = express.Router();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// ==========================================================
//    POST LOGIN PAGE
// ==========================================================
router.post( '/', ( req, res ) => {

    const body = req.body;

    User.findOne({ email: body.email }, ( err, userDB ) => {

        if( err ) {
            return res.status( 500 ).json({
                ok: false,
                message: 'Error when searching user',
                errors: err
            });
        }
        if ( !userDB ) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Incorrect credentials',
                errors: err
            });
        }
        if ( !bcrypt.compareSync( body.password, userDB.password )) {
            return res.status( 400 ).json({
                ok: false,
                message: 'Incorrect credentials',
                errors: err
            });
        }

        // create a token
        const token =  jwt.sign({ user: userDB },
            process.env.SEED,
            { expiresIn: process.env.EXPIRATION_TOKEN });


        res.status( 200 ).json({
            ok: true,
            message: 'Login works!',
            user: userDB,
            id: userDB.id,
            token
        });
    });
});

// ==========================================================
//    GOOGLE CONFIGURATIONS
// ==========================================================

// ==========================================================
//    VERIFY TOKEN
// ==========================================================
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

// ==========================================================
//    POST LOGIN GOOGLE PAGE
// ==========================================================
app.post( '/google', async ( req, res ) => {


    const token = req.body.idtoken;


    const googleUser = await verify( token )
        .catch( err => {
            return res.status( 403 ).json({
                ok: false,
                error: err
            })
        });

    // res.json({
    //     user: googleUser
    // });

    // console.log('Token ', token);
    //
    User.findOne({ email: googleUser.email}, ( err, userDB ) => {


        console.log( ' => email of user', googleUser.email );

        if ( err ) {
            return res.status( 500 ).json({
                ok: false,
                err
            });
        }
        // If the user exist
        if ( userDB ) {
            // If is not a google user
            if ( userDB.google === false ) {
                return res.status( 400 ).json({
                    ok: false,
                    err: {
                        message: 'Must use commmon authentication'
                    }
                });
            } else {
                // if is a google user, we must renovate the token
                let authentication = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    authentication
                });
            }
        }
        else {
            // the first time for this user
            const user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            console.log( ' => the new user of google', user );


            // Saving the user at database
            user.save( ( err, userDB ) => {

                if ( err ) {
                    return res.status( 500 ).json({
                        ok: false,
                        err
                    });
                } else {
                    let authentication = jwt.sing({
                        user: userDB
                    }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });
                    console.log( ' => saving the user' );
                    return res.json({
                        ok: true,
                        user: userDB,
                        authentication
                    })
                }
            });
        }
    });
});


module.exports = router;