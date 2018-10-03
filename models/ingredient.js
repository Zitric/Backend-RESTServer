const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    name: { type: String, required: [ true, 'the name is required' ]},
    quantity: { type: String, required: false },
    comment: { type: String, required: false },
    creationDate: { type: Date, required: [ true, 'the creationTime is required' ]},
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },


});

module.exports = mongoose.model( 'Ingredient', ingredientSchema );
