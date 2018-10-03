const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: { type: String, required: [ true, 'the name is required' ]},
    type: { type: String, required: false },
    description: { type: String, required: false },
    creationDate: { type: Date, required: [ true, 'the creationTime is required' ]},
    status: { type: Boolean, default: true },
    // ingredient: [ Schema.Types.ObjectId ],
    // ingredient: [{
    //     name : { type: Schema.Types.ObjectId },
    //     quantity: { type: String },
    //     comment: { type: String }
    // }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model( 'Recipe', recipeSchema );
